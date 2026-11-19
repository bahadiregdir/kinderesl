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

const RESERVED_SUBJECT_SLUGS = new Set<string>(subjects.map((s) => s.slug));
const VALID_SUBJECTS = new Set<string>(subjects.map((s) => s.slug));
const MAX_PDF_BYTES = 4 * 1024 * 1024; // 4 MB safety guard for Vercel 4.5MB limit

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
      remainingForIndex: Math.max(0, 6 - count),
    };
  });

  const topicStats = topics.map((t) => {
    const count = allWorksheets.filter((w) => w.topics.includes(t.slug)).length;
    return {
      slug: t.slug,
      title: t.title,
      count,
      indexed: isIndexableCollection(count),
      remainingForIndex: Math.max(0, 6 - count),
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
      remainingForIndex: Math.max(0, 6 - count),
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
  const title = String(raw.title || '').trim();
  if (title.length < 5) {
    throw new Error('Title must be at least 5 characters.');
  }

  const slug = sanitizeSlug(String(raw.slug || title));
  if (!slug || slug.length < 3 || !/^[a-z0-9-]+$/.test(slug)) {
    throw new Error('Slug must contain at least 3 lowercase letters, numbers, or hyphens.');
  }
  if (RESERVED_SUBJECT_SLUGS.has(slug)) {
    throw new Error(`Slug "${slug}" conflicts with a reserved subject route.`);
  }
  if (options.requireSlugFree && options.existingWorksheets.some((w) => w.slug === slug)) {
    throw new Error(`A worksheet with slug "${slug}" already exists.`);
  }
  if (
    !options.requireSlugFree &&
    options.currentSlug &&
    slug !== options.currentSlug &&
    options.existingWorksheets.some((w) => w.slug === slug)
  ) {
    throw new Error(`Cannot rename to "${slug}" because that slug is already in use.`);
  }

  const subjectRaw = String(raw.subject || '');
  if (!VALID_SUBJECTS.has(subjectRaw)) {
    throw new Error(`Invalid subject "${subjectRaw}".`);
  }
  const subject = subjectRaw as WorksheetSubject;
  const subjectMeta = subjects.find((s) => s.slug === subject)!;

  const description = String(raw.description || '').trim();
  const quickSummary = String(raw.quickSummary || description).trim();
  const skill = String(raw.skill || '').trim();
  if (!description || !skill) {
    throw new Error('Description and Skill focus are required.');
  }

  const teacherNoteRaw = (raw.teacherNote || {}) as Record<string, unknown>;
  const teacherNote = {
    skillFocus: String(teacherNoteRaw.skillFocus || skill).trim(),
    learningGoal: String(teacherNoteRaw.learningGoal || '').trim(),
    teachingTip: String(teacherNoteRaw.teachingTip || '').trim(),
    extensionActivity: String(teacherNoteRaw.extensionActivity || '').trim(),
    steps: Array.isArray(teacherNoteRaw.steps)
      ? teacherNoteRaw.steps.map((s) => String(s).trim()).filter(Boolean)
      : [],
  };

  if (!teacherNote.learningGoal || !teacherNote.teachingTip) {
    throw new Error('Teacher note requires Learning Goal and Teaching Tip.');
  }

  const topicsList = Array.isArray(raw.topics)
    ? raw.topics.map((t) => String(t).trim()).filter(Boolean)
    : [];
  const activityTypes = (
    Array.isArray(raw.activityTypes) ? raw.activityTypes : []
  ).map((a) => String(a).trim()) as ActivityType[];
  const ageBands = (Array.isArray(raw.ageBands) ? raw.ageBands : []).map((a) =>
    String(a).trim()
  ) as AgeBand[];

  if (ageBands.length === 0) {
    throw new Error('Select at least one target Age Band.');
  }

  const ages = String(raw.ages || 'Ages 3–5').trim();
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

  const today = new Date().toISOString().slice(0, 10);

  return {
    id: String(raw.id || `ws-${slug}`).trim(),
    title,
    slug,
    subject,
    subjectName: subjectMeta.shortTitle,
    topics: topicsList,
    activityTypes: activityTypes.length > 0 ? activityTypes : ['tracing'],
    ageBands,
    eslLevel,
    ages,
    gradeLevel,
    skill,
    pages: Math.max(1, Number(raw.pages) || 1),
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
    category: subject,
    categoryName: subjectMeta.shortTitle,
    theme: topicsList[0] || subject,
    themeName: topics.find((t) => t.slug === topicsList[0])?.title || subjectMeta.shortTitle,
  };
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
  const changes: CmsFileChange[] = [];
  let pdfPath: string | undefined;
  let pdfFileSize: string | undefined;
  const previewImages: string[] = [];
  let pinterestPinImage: string | undefined;

  const pdfEntry = formData.get('pdf');
  if (pdfEntry instanceof File && pdfEntry.size > 0) {
    if (pdfEntry.size > MAX_PDF_BYTES) {
      throw new Error('PDF file exceeds 4 MB limit.');
    }
    if (pdfEntry.type && pdfEntry.type !== 'application/pdf' && !pdfEntry.name.toLowerCase().endsWith('.pdf')) {
      throw new Error('Uploaded PDF must be a valid .pdf file.');
    }
    const buf = Buffer.from(await pdfEntry.arrayBuffer());
    const safePdfName = sanitizeFilename(
      pdfEntry.name.endsWith('.pdf') ? pdfEntry.name : `${slug}.pdf`,
      `${slug}.pdf`
    );
    const repoPdfPath = `public/worksheets/${slug}/${safePdfName}`;
    changes.push({ path: repoPdfPath, contentBase64: buf.toString('base64') });
    pdfPath = `/worksheets/${slug}/${safePdfName}`;
    pdfFileSize = formatFileSize(buf.byteLength);
  }

  const previewEntries: Array<{ idx: number; file: File }> = [];
  for (const [key, value] of formData.entries()) {
    const match = /^preview_(\d+)$/.exec(key);
    if (match && value instanceof File && value.size > 0) {
      previewEntries.push({ idx: Number(match[1]), file: value });
    }
  }
  previewEntries.sort((a, b) => a.idx - b.idx);

  for (let i = 0; i < previewEntries.length; i++) {
    const { file } = previewEntries[i];
    const ext = file.type === 'image/webp' ? 'webp' : file.type === 'image/jpeg' ? 'jpg' : 'png';
    const buf = Buffer.from(await file.arrayBuffer());
    const repoImgPath = `public/worksheets/${slug}/preview-page-${i + 1}.${ext}`;
    changes.push({ path: repoImgPath, contentBase64: buf.toString('base64') });
    previewImages.push(`/worksheets/${slug}/preview-page-${i + 1}.${ext}`);
  }

  const pinEntry = formData.get('pinterestPin');
  if (pinEntry instanceof File && pinEntry.size > 0) {
    const ext = pinEntry.type === 'image/png' ? 'png' : 'jpg';
    const buf = Buffer.from(await pinEntry.arrayBuffer());
    const repoPinPath = `public/worksheets/${slug}/pinterest-pin.${ext}`;
    changes.push({ path: repoPinPath, contentBase64: buf.toString('base64') });
    pinterestPinImage = `/worksheets/${slug}/pinterest-pin.${ext}`;
  }

  return { changes, pdfPath, pdfFileSize, previewImages, pinterestPinImage };
}
