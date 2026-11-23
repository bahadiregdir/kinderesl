import { subjects } from '@/data/subjects';
import { topics } from '@/data/topics';
import { months } from '@/data/months';
import {
  Worksheet,
  WorksheetSubject,
  ActivityType,
  AgeBand,
  isIndexableCollection,
} from '@/types/worksheet';
import type { CmsFileChange } from './cms-storage';
import { commitFiles, getStorageInfo } from './cms-storage';
import { deleteFromR2ByUrl, isR2Configured, uploadBufferToR2 } from './r2-storage';

export const RESERVED_SUBJECT_SLUGS = new Set<string>(subjects.map((s) => s.slug));
export const VALID_SUBJECTS = new Set<string>(subjects.map((s) => s.slug));
export const VALID_ACTIVITY_TYPES = new Set<string>([
  'tracing',
  'coloring',
  'cut-and-paste',
  'matching',
  'counting',
  'odd-one-out',
  'flashcards',
  'dot-to-dot',
  'maze',
]);
export const VALID_AGE_BANDS = new Set<string>(['3-4', '4-5', '5-6']);

export const MAX_PDF_BYTES = 20 * 1024 * 1024; // 20 MB upper bound
export const MAX_IMAGE_BYTES = 10 * 1024 * 1024; // 10 MB per preview/pin image
const SLUG_RE = /^[a-z0-9-]+$/;

export class WorksheetValidationError extends Error {
  status: number;
  errors: Record<string, string>;

  constructor(status: number, errors: Record<string, string>, message?: string) {
    const firstMsg = message || Object.values(errors)[0] || 'Validation failed';
    super(firstMsg);
    this.name = 'WorksheetValidationError';
    this.status = status;
    this.errors = errors;
  }
}

export function sanitizeSlug(raw: string): string {
  return raw
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const kb = Math.round(bytes / 1024);
  if (kb < 1024) return `${kb} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function sanitizeFilename(name: string, fallback: string): string {
  const clean = name
    .toLowerCase()
    .replace(/[^a-z0-9.-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  return clean || fallback;
}

export function computeCollectionStats(allWorksheets: Worksheet[]) {
  const subjectStats = subjects.map((s) => {
    const count = allWorksheets.filter((w) => w.subject === s.slug).length;
    return {
      slug: s.slug,
      title: s.shortTitle,
      fullTitle: s.title,
      count,
      indexed: isIndexableCollection(count),
      remainingForIndex: Math.max(0, 1 - count),
    };
  });

  const topicStats = topics.map((t) => {
    const count = allWorksheets.filter((w) => w.topics.includes(t.slug)).length;
    return {
      slug: t.slug,
      title: t.title,
      count,
      indexed: isIndexableCollection(count),
      remainingForIndex: Math.max(0, 1 - count),
    };
  });

  const monthStats = months.map((m) => {
    const matchingTopics = topics
      .filter((t) => t.curriculumMonths.includes(m.monthNumber))
      .map((t) => t.slug);
    const count = allWorksheets.filter(
      (w) =>
        (w.months && w.months.includes(m.monthNumber)) ||
        w.topics.some((tp) => matchingTopics.includes(tp))
    ).length;
    return {
      slug: m.slug,
      name: m.name,
      monthNumber: m.monthNumber,
      count,
      indexed: isIndexableCollection(count),
      remainingForIndex: Math.max(0, 1 - count),
    };
  });

  return {
    totalWorksheets: allWorksheets.length,
    totalPages: allWorksheets.reduce((acc, w) => acc + (w.pages || 1), 0),
    indexedSubjects: subjectStats.filter((s) => s.indexed).length,
    indexedTopics: topicStats.filter((t) => t.indexed).length,
    indexedMonths: monthStats.filter((m) => m.indexed).length,
    subjectStats,
    topicStats,
    monthStats,
  };
}

export interface ParsedWorksheetPayload {
  metadata: Partial<Worksheet> & { slug: string; title: string; subject: WorksheetSubject };
  pdfFile: File | null;
  previewFiles: Array<{ index: number; file: File }>;
  pinFile: File | null;
}

export function validateWorksheetMetadata(
  raw: Record<string, unknown>,
  options: { requireSlugFree: boolean; existingWorksheets: Worksheet[]; currentSlug?: string }
): Worksheet {
  const errors: Record<string, string> = {};

  const title = typeof raw.title === 'string' ? raw.title.trim() : '';
  if (title.length < 5) {
    errors.title = 'Title is required and must be at least 5 characters.';
  }

  let slug = '';
  if (raw.slug !== undefined && raw.slug !== null && String(raw.slug).trim() !== '') {
    const rawSlugStr = String(raw.slug).trim();
    if (!SLUG_RE.test(rawSlugStr) || rawSlugStr.length < 3) {
      errors.slug = 'Slug must match ^[a-z0-9-]+$ and be at least 3 characters.';
    } else {
      slug = rawSlugStr;
    }
  } else if (title.length >= 5) {
    const derived = sanitizeSlug(title);
    if (!derived || derived.length < 3 || !SLUG_RE.test(derived)) {
      errors.slug = 'Slug could not be derived from title; provide a valid slug (^[a-z0-9-]+$).';
    } else {
      slug = derived;
    }
  } else {
    errors.slug = 'Slug is required (^[a-z0-9-]+$).';
  }

  if (slug && RESERVED_SUBJECT_SLUGS.has(slug)) {
    errors.slug = `Slug "${slug}" conflicts with a reserved subject route.`;
  }

  const subjectRaw = typeof raw.subject === 'string' ? raw.subject.trim() : '';
  if (!subjectRaw || !VALID_SUBJECTS.has(subjectRaw)) {
    errors.subject = `Subject must be one of: ${Array.from(VALID_SUBJECTS).join(', ')}.`;
  }

  const description = typeof raw.description === 'string' ? raw.description.trim() : '';
  if (description.length < 10) {
    errors.description = 'Description is required and must be at least 10 characters.';
  }

  if (raw.activityTypes !== undefined) {
    if (!Array.isArray(raw.activityTypes)) {
      errors.activityTypes = 'activityTypes must be an array.';
    } else {
      const invalid = raw.activityTypes.filter(
        (a) => !VALID_ACTIVITY_TYPES.has(String(a).trim())
      );
      if (invalid.length > 0) {
        errors.activityTypes = `Invalid activityTypes: ${invalid.join(', ')}. Allowed: ${Array.from(
          VALID_ACTIVITY_TYPES
        ).join(', ')}.`;
      }
    }
  }

  if (raw.ageBands !== undefined) {
    if (!Array.isArray(raw.ageBands) || raw.ageBands.length === 0) {
      errors.ageBands = 'ageBands must be a non-empty array of: 3-4, 4-5, 5-6.';
    } else {
      const invalid = raw.ageBands.filter((a) => !VALID_AGE_BANDS.has(String(a).trim()));
      if (invalid.length > 0) {
        errors.ageBands = `Invalid ageBands: ${invalid.join(', ')}. Allowed: 3-4, 4-5, 5-6.`;
      }
    }
  }

  if (raw.months !== undefined) {
    if (!Array.isArray(raw.months)) {
      errors.months = 'months must be an array of integers between 1 and 12.';
    } else {
      const invalid = raw.months.filter((m) => {
        const num = Number(m);
        return !Number.isInteger(num) || num < 1 || num > 12;
      });
      if (invalid.length > 0) {
        errors.months = 'months must contain integers between 1 and 12.';
      }
    }
  }

  const rawPageCount = raw.pageCount ?? raw.pages;
  if (rawPageCount !== undefined && rawPageCount !== null && rawPageCount !== '') {
    const pc = Number(rawPageCount);
    if (!Number.isFinite(pc) || pc < 1 || !Number.isInteger(pc)) {
      errors.pageCount = 'pageCount must be a positive integer (>= 1).';
    }
  }

  if (raw.published !== undefined && typeof raw.published !== 'boolean') {
    errors.published = 'published must be a boolean.';
  }

  if (raw.includeInRss !== undefined && typeof raw.includeInRss !== 'boolean') {
    errors.includeInRss = 'includeInRss must be a boolean.';
  }

  if (Object.keys(errors).length > 0) {
    throw new WorksheetValidationError(400, errors);
  }

  // Slug conflict check returns 409
  if (options.requireSlugFree && options.existingWorksheets.some((w) => w.slug === slug)) {
    throw new WorksheetValidationError(409, {
      slug: `A worksheet with slug "${slug}" already exists. Pass ?upsert=true to update it.`,
    });
  }
  if (
    !options.requireSlugFree &&
    options.currentSlug &&
    slug !== options.currentSlug &&
    options.existingWorksheets.some((w) => w.slug === slug)
  ) {
    throw new WorksheetValidationError(409, {
      slug: `Cannot rename to "${slug}" because that slug is already in use.`,
    });
  }

  const subject = subjectRaw as WorksheetSubject;
  const subjectMeta = subjects.find((s) => s.slug === subject)!;

  const quickSummary = String(raw.quickSummary || description).trim();
  const skill =
    typeof raw.skill === 'string' && raw.skill.trim()
      ? raw.skill.trim()
      : `${subjectMeta.shortTitle}: ${description.slice(0, 140)}`;

  const teacherNoteRaw = (raw.teacherNote || {}) as Record<string, unknown>;
  const teacherNote = {
    skillFocus: String(teacherNoteRaw.skillFocus || skill).trim(),
    learningGoal:
      String(teacherNoteRaw.learningGoal || '').trim() ||
      `Learners complete ${title} while practicing ${subjectMeta.shortTitle.toLowerCase()} skills.`,
    teachingTip:
      String(teacherNoteRaw.teachingTip || '').trim() ||
      `Model one example together before students work independently with ${title}.`,
    extensionActivity: String(teacherNoteRaw.extensionActivity || '').trim(),
    steps: Array.isArray(teacherNoteRaw.steps)
      ? teacherNoteRaw.steps.map((s) => String(s).trim()).filter(Boolean)
      : [],
  };

  const topicsList = Array.isArray(raw.topics)
    ? raw.topics.map((t) => String(t).trim()).filter(Boolean)
    : [];
  const activityTypes = (
    Array.isArray(raw.activityTypes) && raw.activityTypes.length > 0
      ? raw.activityTypes
      : ['tracing']
  ).map((a) => String(a).trim()) as ActivityType[];
  const ageBands = (
    Array.isArray(raw.ageBands) && raw.ageBands.length > 0
      ? raw.ageBands
      : ['3-4', '4-5']
  ).map((a) => String(a).trim()) as AgeBand[];

  const ages = String(raw.ages || `Ages ${ageBands[0]}–${ageBands[ageBands.length - 1]}`).trim();
  const gradeLevel = String(raw.gradeLevel || 'Pre-K & Kindergarten').trim();
  const eslLevel = raw.eslLevel === 'early-reader' ? 'early-reader' : 'beginner';

  const whatsInside = Array.isArray(raw.whatsInside)
    ? raw.whatsInside.map((s) => String(s).trim()).filter(Boolean)
    : [];
  const vocabulary = Array.isArray(raw.vocabulary)
    ? raw.vocabulary.map((s) => String(s).trim()).filter(Boolean)
    : [];
  const keywords = Array.isArray(raw.keywords)
    ? raw.keywords.map((s) => String(s).trim()).filter(Boolean)
    : [];
  const relatedSlugs = Array.isArray(raw.relatedSlugs)
    ? raw.relatedSlugs.map((s) => String(s).trim()).filter(Boolean)
    : options.existingWorksheets
        .filter((w) => w.slug !== slug)
        .slice(0, 3)
        .map((w) => w.slug);
  const monthsList = Array.isArray(raw.months)
    ? raw.months.map((m) => Number(m)).filter((m) => m >= 1 && m <= 12)
    : [];

  const faqs = Array.isArray(raw.faqs)
    ? raw.faqs
        .map((f) => {
          const item = f as Record<string, unknown>;
          return {
            question: String(item?.question || '').trim(),
            answer: String(item?.answer || '').trim(),
          };
        })
        .filter((f) => f.question && f.answer)
    : [];

  let series: Worksheet['series'] = undefined;
  if (raw.series && typeof raw.series === 'object') {
    const sr = raw.series as Record<string, unknown>;
    const srName = String(sr.name || '').trim();
    const srId = sanitizeSlug(String(sr.id || srName));
    if (srName && srId) {
      series = {
        id: srId,
        name: srName,
        order: Number(sr.order) || 1,
        ...(sr.total ? { total: Number(sr.total) } : {}),
        ...(sr.nextSlug ? { nextSlug: sanitizeSlug(String(sr.nextSlug)) } : {}),
        ...(sr.prevSlug ? { prevSlug: sanitizeSlug(String(sr.prevSlug)) } : {}),
      };
    }
  }

  const published = raw.published !== false;

  let pinterestConfig: Worksheet['pinterest'];
  if (typeof raw.includeInRss === 'boolean') {
    const existingRssAt =
      raw.pinterest && typeof raw.pinterest === 'object'
        ? String((raw.pinterest as Record<string, unknown>).rssQueuedAt || '').trim()
        : '';
    pinterestConfig = {
      autoPublish: raw.includeInRss,
      ...(raw.includeInRss
        ? { rssQueuedAt: existingRssAt || new Date().toISOString() }
        : {}),
    };
  } else if (raw.pinterest && typeof raw.pinterest === 'object') {
    const pObj = raw.pinterest as Record<string, unknown>;
    const autoPublish = pObj.autoPublish !== false;
    const queuedStr = String(pObj.rssQueuedAt || '').trim();
    const rssQueuedAt = queuedStr || (autoPublish ? new Date().toISOString() : undefined);
    pinterestConfig = {
      autoPublish,
      ...(rssQueuedAt ? { rssQueuedAt } : {}),
    };
  } else {
    pinterestConfig = {
      autoPublish: true,
      rssQueuedAt: new Date().toISOString(),
    };
  }

  const today = new Date().toISOString().slice(0, 10);
  const pages = Math.max(1, Number(rawPageCount) || 1);

  return {
    id: String(raw.id || `ws-${slug}`).trim(),
    title,
    slug,
    subject,
    subjectName: subjectMeta.shortTitle,
    topics: topicsList,
    activityTypes,
    ageBands,
    eslLevel,
    ages,
    gradeLevel,
    skill,
    pages,
    description,
    quickSummary,
    teacherNote,
    whatsInside,
    pdfPath: String(raw.pdfPath || '').trim(),
    pdfFileSize: String(raw.pdfFileSize || '').trim(),
    previewImages: Array.isArray(raw.previewImages)
      ? raw.previewImages.map((s) => String(s).trim()).filter(Boolean)
      : [],
    pinterestPinImage: String(raw.pinterestPinImage || '').trim(),
    vocabulary,
    ...(series ? { series } : {}),
    ...(monthsList.length > 0 ? { months: monthsList } : {}),
    keywords,
    relatedSlugs,
    faqs,
    datePublished: String(raw.datePublished || today).trim(),
    dateModified: today,
    published,
    pinterest: pinterestConfig,
    category: subject,
    categoryName: subjectMeta.shortTitle,
    theme: topicsList[0] || subject,
    themeName: topics.find((t) => t.slug === topicsList[0])?.title || subjectMeta.shortTitle,
  };
}

function isAllowedImageFile(file: File): boolean {
  const mime = (file.type || '').toLowerCase();
  if (mime) {
    return mime.startsWith('image/');
  }
  return /\.(png|jpe?g|webp|gif)$/i.test(file.name);
}

function imageExt(file: File): string {
  const mime = (file.type || '').toLowerCase();
  if (mime === 'image/webp' || file.name.toLowerCase().endsWith('.webp')) return 'webp';
  if (mime === 'image/jpeg' || mime === 'image/jpg' || /\.jpe?g$/i.test(file.name)) return 'jpg';
  return 'png';
}

export async function processUploadedAssets(
  slug: string,
  formData: FormData
): Promise<{
  changes: CmsFileChange[];
  pdfPath?: string;
  pdfFileSize?: string;
  previewImages: string[];
  pinterestPinImage?: string;
}> {
  const errors: Record<string, string> = {};
  const changes: CmsFileChange[] = [];
  let pdfPath: string | undefined;
  let pdfFileSize: string | undefined;
  const previewImages: string[] = [];
  let pinterestPinImage: string | undefined;

  const pdfEntry = formData.get('pdf');
  if (pdfEntry instanceof File && pdfEntry.size > 0) {
    if (pdfEntry.size > MAX_PDF_BYTES) {
      errors.pdf = 'PDF file exceeds 20 MB upper limit.';
    } else if (
      pdfEntry.type
        ? pdfEntry.type.toLowerCase() !== 'application/pdf'
        : !pdfEntry.name.toLowerCase().endsWith('.pdf')
    ) {
      errors.pdf = 'Uploaded PDF must have MIME type application/pdf.';
    } else {
      const buf = Buffer.from(await pdfEntry.arrayBuffer());
      const safePdfName = sanitizeFilename(
        pdfEntry.name.toLowerCase().endsWith('.pdf') ? pdfEntry.name : `${slug}.pdf`,
        `${slug}.pdf`
      );
      const repoPdfPath = `public/worksheets/${slug}/${safePdfName}`;
      changes.push({ path: repoPdfPath, contentBase64: buf.toString('base64') });
      pdfPath = `/worksheets/${slug}/${safePdfName}`;
      pdfFileSize = formatFileSize(buf.byteLength);
    }
  } else if (pdfEntry !== null && !(pdfEntry instanceof File)) {
    errors.pdf = 'pdf must be uploaded as a file in multipart/form-data.';
  }

  // Gather both `preview_0..n` (Admin UI) and `preview` (Bot API)
  const indexedPreviews: Array<{ idx: number; file: File }> = [];
  const plainPreviews: File[] = [];

  for (const [key, value] of formData.entries()) {
    if (!(value instanceof File) || value.size === 0) continue;
    const match = /^preview_(\d+)$/.exec(key);
    if (match) {
      indexedPreviews.push({ idx: Number(match[1]), file: value });
    } else if (key === 'preview') {
      plainPreviews.push(value);
    }
  }
  indexedPreviews.sort((a, b) => a.idx - b.idx);
  const allPreviews = [...indexedPreviews.map((p) => p.file), ...plainPreviews];

  for (let i = 0; i < allPreviews.length; i++) {
    const file = allPreviews[i];
    if (file.size > MAX_IMAGE_BYTES) {
      errors.preview = `Preview image ${i + 1} exceeds 10 MB limit.`;
      break;
    }
    if (!isAllowedImageFile(file)) {
      errors.preview = `Preview image ${i + 1} must have an image/* MIME type.`;
      break;
    }
    const ext = imageExt(file);
    const buf = Buffer.from(await file.arrayBuffer());
    const repoImgPath = `public/worksheets/${slug}/preview-page-${i + 1}.${ext}`;
    changes.push({ path: repoImgPath, contentBase64: buf.toString('base64') });
    previewImages.push(`/worksheets/${slug}/preview-page-${i + 1}.${ext}`);
  }

  // Gather `pinterestPin` (Admin UI) or `pin` (Bot API)
  const pinEntry = formData.get('pinterestPin') ?? formData.get('pin');
  if (pinEntry instanceof File && pinEntry.size > 0) {
    if (pinEntry.size > MAX_IMAGE_BYTES) {
      errors.pin = 'Pinterest pin image exceeds 10 MB limit.';
    } else if (!isAllowedImageFile(pinEntry)) {
      errors.pin = 'Pinterest pin image must have an image/* MIME type.';
    } else {
      const ext = imageExt(pinEntry);
      const buf = Buffer.from(await pinEntry.arrayBuffer());
      const repoPinPath = `public/worksheets/${slug}/pinterest-pin.${ext}`;
      changes.push({ path: repoPinPath, contentBase64: buf.toString('base64') });
      pinterestPinImage = `/worksheets/${slug}/pinterest-pin.${ext}`;
    }
  }

  if (Object.keys(errors).length > 0) {
    throw new WorksheetValidationError(400, errors);
  }

  return { changes, pdfPath, pdfFileSize, previewImages, pinterestPinImage };
}

export async function saveUploadedAssetsForWorksheet(
  slug: string,
  formData: FormData
): Promise<{
  assetBackend: 'r2' | 'local';
  pdfPath?: string;
  pdfFileSize?: string;
  previewImages: string[];
  pinterestPinImage?: string;
  localChanges: CmsFileChange[];
}> {
  const localPrepared = await processUploadedAssets(slug, formData);

  if (isR2Configured()) {
    let pdfPath: string | undefined;
    const previewImages: string[] = [];
    let pinterestPinImage: string | undefined;

    for (const ch of localPrepared.changes) {
      if (ch.delete) continue;
      const buf = Buffer.from(ch.contentBase64, 'base64');
      const objectKey = ch.path.replace(/^public\//, '');
      let contentType = 'application/octet-stream';
      if (objectKey.endsWith('.pdf')) contentType = 'application/pdf';
      else if (objectKey.endsWith('.png')) contentType = 'image/png';
      else if (objectKey.endsWith('.webp')) contentType = 'image/webp';
      else if (objectKey.endsWith('.jpg') || objectKey.endsWith('.jpeg')) {
        contentType = 'image/jpeg';
      }

      const publicUrl = await uploadBufferToR2(objectKey, buf, contentType);
      if (objectKey.endsWith('.pdf')) {
        pdfPath = publicUrl;
      } else if (objectKey.includes('/pinterest-pin.')) {
        pinterestPinImage = publicUrl;
      } else {
        previewImages.push(publicUrl);
      }
    }

    return {
      assetBackend: 'r2',
      pdfPath,
      pdfFileSize: localPrepared.pdfFileSize,
      previewImages,
      pinterestPinImage,
      localChanges: [],
    };
  }

  const info = getStorageInfo();
  if (info.assetStorage === 'unconfigured' && localPrepared.changes.length > 0) {
    throw new Error(
      'Cloudflare R2 is not configured in Vercel production. Please add R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, and R2_PUBLIC_URL in Vercel Environment Variables to upload PDF and preview files.'
    );
  }

  return {
    assetBackend: 'local',
    pdfPath: localPrepared.pdfPath,
    pdfFileSize: localPrepared.pdfFileSize,
    previewImages: localPrepared.previewImages,
    pinterestPinImage: localPrepared.pinterestPinImage,
    localChanges: localPrepared.changes,
  };
}

export async function removeOldAssetUrls(urls: string[]): Promise<void> {
  const uniqueUrls = Array.from(new Set(urls.filter(Boolean)));
  const r2Urls = uniqueUrls.filter(
    (u) => u.startsWith('https://') || u.startsWith('http://')
  );
  const localPaths = uniqueUrls
    .filter((u) => u.startsWith('/worksheets/'))
    .map((u) => `public/${u.replace(/^\/+/, '')}`);

  await Promise.all(r2Urls.map((u) => deleteFromR2ByUrl(u)));

  const info = getStorageInfo();
  if (localPaths.length > 0 && info.mode === 'local') {
    await commitFiles(
      localPaths.map((p) => ({ path: p, delete: true })),
      'cms: cleanup removed local worksheet assets'
    );
  }
}
