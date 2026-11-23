import { getSiteUrl, toAbsoluteAssetUrl } from '@/config/site';
import {
  commitFiles,
  getStorageInfo,
  readJsonFile,
  type CmsFileChange,
} from './cms-storage';
import {
  dbGetWorksheetBySlug,
  dbListWorksheets,
  dbUpsertWorksheet,
  isDatabaseConfigured,
} from './db';
import { getR2Info } from './r2-storage';
import { revalidateCatalog } from './revalidation';
import {
  WorksheetValidationError,
  computeCollectionStats,
  formatFileSize,
  processUploadedAssets,
  removeOldAssetUrls,
  sanitizeSlug,
  saveUploadedAssetsForWorksheet,
  validateWorksheetMetadata,
} from './worksheet-cms-helper';
import type { Worksheet } from '@/types/worksheet';

function validatePresignedUrl(
  url: unknown,
  slug: string,
  field: string
): string | undefined {
  if (url === undefined || url === null || url === '') return undefined;
  if (typeof url !== 'string') {
    throw new WorksheetValidationError(400, { [field]: `${field} must be a URL string.` });
  }
  const trimmed = url.trim();
  const r2Info = getR2Info();
  const allowedR2Prefix = r2Info.configured
    ? `${r2Info.publicUrl}/worksheets/${slug}/`
    : null;
  const allowedLocalPrefix = `/worksheets/${slug}/`;

  if (
    (allowedR2Prefix && trimmed.startsWith(allowedR2Prefix)) ||
    trimmed.startsWith(allowedLocalPrefix)
  ) {
    return trimmed;
  }

  throw new WorksheetValidationError(400, {
    [field]: `${field} must point to an uploaded asset under worksheets/${slug}/ on ${
      r2Info.configured ? r2Info.publicUrl : 'local storage'
    }.`,
  });
}

function normalizePreviewUrlList(
  rawMeta: Record<string, unknown>,
  slug: string
): string[] {
  const list: string[] = [];
  if (typeof rawMeta.previewUrl === 'string' && rawMeta.previewUrl.trim()) {
    const valid = validatePresignedUrl(rawMeta.previewUrl, slug, 'previewUrl');
    if (valid) list.push(valid);
  }
  if (Array.isArray(rawMeta.previewUrls)) {
    rawMeta.previewUrls.forEach((item, idx) => {
      const valid = validatePresignedUrl(item, slug, `previewUrls[${idx}]`);
      if (valid) list.push(valid);
    });
  }
  return Array.from(new Set(list));
}

async function parseUpsertPayload(request: Request): Promise<{
  rawMeta: Record<string, unknown>;
  formData: FormData | null;
}> {
  const contentType = (request.headers.get('content-type') || '').toLowerCase();

  if (contentType.includes('multipart/form-data')) {
    const formData = await request.formData();
    const rawStr = formData.get('metadata');
    if (typeof rawStr !== 'string' || !rawStr.trim()) {
      throw new WorksheetValidationError(400, {
        metadata: 'Missing metadata JSON field in multipart/form-data.',
      });
    }
    let parsed: unknown;
    try {
      parsed = JSON.parse(rawStr);
    } catch {
      throw new WorksheetValidationError(400, {
        metadata: 'metadata field contains invalid JSON.',
      });
    }
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      throw new WorksheetValidationError(400, {
        metadata: 'metadata must be a JSON object.',
      });
    }
    return { rawMeta: parsed as Record<string, unknown>, formData };
  }

  let parsedBody: unknown;
  try {
    parsedBody = await request.json();
  } catch {
    throw new WorksheetValidationError(400, {
      metadata: 'Request body must be valid JSON or multipart/form-data.',
    });
  }

  if (!parsedBody || typeof parsedBody !== 'object' || Array.isArray(parsedBody)) {
    throw new WorksheetValidationError(400, {
      metadata: 'JSON body must be an object.',
    });
  }

  const obj = parsedBody as Record<string, unknown>;
  const rawMeta =
    obj.metadata && typeof obj.metadata === 'object' && !Array.isArray(obj.metadata)
      ? {
          ...(obj.metadata as Record<string, unknown>),
          ...(obj.pdfUrl !== undefined ? { pdfUrl: obj.pdfUrl } : {}),
          ...(obj.pdfFileSize !== undefined ? { pdfFileSize: obj.pdfFileSize } : {}),
          ...(obj.pdfSizeBytes !== undefined ? { pdfSizeBytes: obj.pdfSizeBytes } : {}),
          ...(obj.previewUrl !== undefined ? { previewUrl: obj.previewUrl } : {}),
          ...(obj.previewUrls !== undefined ? { previewUrls: obj.previewUrls } : {}),
          ...(obj.pinUrl !== undefined ? { pinUrl: obj.pinUrl } : {}),
        }
      : obj;

  return { rawMeta, formData: null };
}

export async function upsertWorksheetFromRequest(
  request: Request,
  options: { upsert?: boolean; dryRun?: boolean; forcedSlug?: string } = {}
) {
  const { rawMeta, formData } = await parseUpsertPayload(request);

  const useDb = isDatabaseConfigured();
  const existingWorksheets = useDb
    ? await dbListWorksheets()
    : await readJsonFile<Worksheet[]>('src/data/worksheets.json');

  let current: Worksheet | null = null;
  if (options.forcedSlug) {
    current =
      (useDb
        ? await dbGetWorksheetBySlug(options.forcedSlug)
        : existingWorksheets.find((w) => w.slug === options.forcedSlug)) || null;
    if (!current) {
      throw new WorksheetValidationError(404, { slug: 'Worksheet not found.' });
    }
  } else {
    const candidateSlug =
      typeof rawMeta.slug === 'string' && rawMeta.slug.trim()
        ? rawMeta.slug.trim()
        : typeof rawMeta.title === 'string'
        ? sanitizeSlug(rawMeta.title)
        : '';
    if (candidateSlug) {
      current = existingWorksheets.find((w) => w.slug === candidateSlug) || null;
    }
  }

  const isUpdate = Boolean(current && (options.upsert || options.forcedSlug));
  const mergedRaw: Record<string, unknown> = current && isUpdate
    ? {
        ...rawMeta,
        id: current.id,
        slug: options.forcedSlug || current.slug,
        datePublished: current.datePublished,
        pdfPath: current.pdfPath,
        pdfFileSize: rawMeta.pdfFileSize ?? current.pdfFileSize,
        previewImages: current.previewImages,
        pinterestPinImage: current.pinterestPinImage,
        pinterest: rawMeta.pinterest ?? current.pinterest,
        pages: rawMeta.pageCount ?? rawMeta.pages ?? current.pages,
      }
    : rawMeta;

  const validated = validateWorksheetMetadata(mergedRaw, {
    requireSlugFree: !isUpdate,
    existingWorksheets,
    currentSlug: current?.slug,
  });

  // Check presigned asset URLs if provided in JSON/metadata
  const presignedPdfUrl = validatePresignedUrl(rawMeta.pdfUrl, validated.slug, 'pdfUrl');
  const presignedPreviewUrls = normalizePreviewUrlList(rawMeta, validated.slug);
  const presignedPinUrl = validatePresignedUrl(rawMeta.pinUrl, validated.slug, 'pinUrl');

  const hasMultipartPdf = Boolean(
    formData && formData.get('pdf') instanceof File && (formData.get('pdf') as File).size > 0
  );

  if (!isUpdate && !hasMultipartPdf && !presignedPdfUrl) {
    throw new WorksheetValidationError(400, {
      pdf: 'PDF file (multipart field "pdf") or presigned pdfUrl is required.',
    });
  }

  // Dry run validates multipart assets & metadata strictly in memory without writing
  if (options.dryRun) {
    if (formData) {
      await processUploadedAssets(validated.slug, formData);
    }
    const siteUrl = getSiteUrl();
    const storageInfo = getStorageInfo();
    return {
      dryRun: true as const,
      valid: true,
      action: isUpdate ? ('update' as const) : ('create' as const),
      slug: validated.slug,
      pageUrl: `${siteUrl}/worksheets/${validated.slug}`,
      inRss: validated.pinterest?.autoPublish !== false,
      published: validated.published !== false,
      storageBackend: storageInfo.assetStorage,
    };
  }

  let uploaded: Awaited<ReturnType<typeof saveUploadedAssetsForWorksheet>> | null = null;
  if (formData) {
    uploaded = await saveUploadedAssetsForWorksheet(validated.slug, formData);
  }

  const finalWorksheet: Worksheet = { ...validated };
  const replacedUrls: string[] = [];

  // Resolve PDF
  if (uploaded?.pdfPath && uploaded.pdfFileSize) {
    if (current && current.pdfPath !== uploaded.pdfPath) {
      replacedUrls.push(current.pdfPath);
    }
    finalWorksheet.pdfPath = uploaded.pdfPath;
    finalWorksheet.pdfFileSize = uploaded.pdfFileSize;
  } else if (presignedPdfUrl) {
    if (current && current.pdfPath !== presignedPdfUrl) {
      replacedUrls.push(current.pdfPath);
    }
    finalWorksheet.pdfPath = presignedPdfUrl;
    if (typeof rawMeta.pdfFileSize === 'string' && rawMeta.pdfFileSize.trim()) {
      finalWorksheet.pdfFileSize = rawMeta.pdfFileSize.trim();
    } else if (typeof rawMeta.pdfSizeBytes === 'number' && rawMeta.pdfSizeBytes > 0) {
      finalWorksheet.pdfFileSize = formatFileSize(rawMeta.pdfSizeBytes);
    } else if (!finalWorksheet.pdfFileSize) {
      finalWorksheet.pdfFileSize = 'PDF';
    }
  }

  // Resolve Previews
  const nextPreviews =
    uploaded && uploaded.previewImages.length > 0
      ? uploaded.previewImages
      : presignedPreviewUrls.length > 0
      ? presignedPreviewUrls
      : [];

  if (nextPreviews.length > 0) {
    if (current) {
      for (const oldImg of current.previewImages) {
        if (!nextPreviews.includes(oldImg)) {
          replacedUrls.push(oldImg);
        }
      }
    }
    finalWorksheet.previewImages = nextPreviews;
    const explicitPageCount = rawMeta.pageCount ?? rawMeta.pages;
    if (explicitPageCount === undefined) {
      finalWorksheet.pages = nextPreviews.length;
    }
  }

  // Resolve Pinterest Pin
  const nextPin = uploaded?.pinterestPinImage || presignedPinUrl;
  if (nextPin) {
    if (
      current &&
      current.pinterestPinImage !== nextPin &&
      !finalWorksheet.previewImages.includes(current.pinterestPinImage)
    ) {
      replacedUrls.push(current.pinterestPinImage);
    }
    finalWorksheet.pinterestPinImage = nextPin;
  }

  // Guarantee safe fallbacks so card/page images never render empty src
  if (finalWorksheet.previewImages.length === 0) {
    finalWorksheet.previewImages = finalWorksheet.pinterestPinImage
      ? [finalWorksheet.pinterestPinImage]
      : ['/images/og-default.jpg'];
  }
  if (!finalWorksheet.pinterestPinImage) {
    finalWorksheet.pinterestPinImage = finalWorksheet.previewImages[0];
  }

  const siteUrl = getSiteUrl();
  const buildApiUrls = () => ({
    slug: finalWorksheet.slug,
    pageUrl: `${siteUrl}/worksheets/${finalWorksheet.slug}`,
    pdfUrl: toAbsoluteAssetUrl(finalWorksheet.pdfPath, siteUrl),
    previewUrl: toAbsoluteAssetUrl(finalWorksheet.previewImages[0] || '', siteUrl),
    previewUrls: finalWorksheet.previewImages.map((u) => toAbsoluteAssetUrl(u, siteUrl)),
    pinUrl: toAbsoluteAssetUrl(finalWorksheet.pinterestPinImage, siteUrl),
    inRss: finalWorksheet.pinterest?.autoPublish !== false,
    published: finalWorksheet.published !== false,
  });

  if (useDb) {
    if (uploaded?.localChanges && uploaded.localChanges.length > 0) {
      await commitFiles(
        uploaded.localChanges,
        `cms: save local assets for ${finalWorksheet.slug}`
      );
    }
    await dbUpsertWorksheet(finalWorksheet, !current);
    if (replacedUrls.length > 0) {
      await removeOldAssetUrls(replacedUrls);
    }
    revalidateCatalog(finalWorksheet.slug);

    const nextList = current
      ? existingWorksheets.map((w) =>
          w.slug === finalWorksheet.slug ? finalWorksheet : w
        )
      : [finalWorksheet, ...existingWorksheets];

    return {
      ...buildApiUrls(),
      worksheet: finalWorksheet,
      commit: {
        mode: 'neon',
        assetStorage: uploaded?.assetBackend || (presignedPdfUrl ? 'r2' : 'unchanged'),
      },
      stats: computeCollectionStats(nextList),
    };
  }

  // Fallback JSON / Git-CMS
  const changes: CmsFileChange[] = [];
  if (uploaded?.localChanges) {
    changes.push(...uploaded.localChanges);
  }
  const nextList = current
    ? existingWorksheets.map((w) =>
        w.slug === finalWorksheet.slug ? finalWorksheet : w
      )
    : [finalWorksheet, ...existingWorksheets];
  const jsonBase64 = Buffer.from(JSON.stringify(nextList, null, 2) + '\n', 'utf8').toString(
    'base64'
  );
  changes.push({ path: 'src/data/worksheets.json', contentBase64: jsonBase64 });

  const commit = await commitFiles(
    changes,
    `cms: ${current ? 'update' : 'add'} worksheet ${finalWorksheet.slug}`
  );
  if (replacedUrls.length > 0) {
    await removeOldAssetUrls(replacedUrls);
  }

  return {
    ...buildApiUrls(),
    worksheet: finalWorksheet,
    commit,
    stats: computeCollectionStats(nextList),
  };
}

export async function patchWorksheetMetadata(
  slug: string,
  body: Record<string, unknown>
) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw new WorksheetValidationError(400, {
      body: 'PATCH body must be a JSON object.',
    });
  }

  const useDb = isDatabaseConfigured();
  const existingWorksheets = useDb
    ? await dbListWorksheets()
    : await readJsonFile<Worksheet[]>('src/data/worksheets.json');

  const current = useDb
    ? await dbGetWorksheetBySlug(slug)
    : existingWorksheets.find((w) => w.slug === slug) || null;

  if (!current) {
    throw new WorksheetValidationError(404, { slug: 'Worksheet not found.' });
  }

  const normalizedPatch: Record<string, unknown> = { ...body };
  if (
    normalizedPatch.includeInRss === undefined &&
    typeof normalizedPatch.pinterestAutoPublish === 'boolean'
  ) {
    normalizedPatch.includeInRss = normalizedPatch.pinterestAutoPublish;
  }

  const mergedRaw: Record<string, unknown> = {
    ...current,
    ...normalizedPatch,
    id: current.id,
    slug: current.slug,
    datePublished: current.datePublished,
    pdfPath: current.pdfPath,
    pdfFileSize: current.pdfFileSize,
    previewImages: current.previewImages,
    pinterestPinImage: current.pinterestPinImage,
    pages: normalizedPatch.pageCount ?? normalizedPatch.pages ?? current.pages,
    published:
      normalizedPatch.published !== undefined ? normalizedPatch.published : current.published,
  };

  const updatedWorksheet = validateWorksheetMetadata(mergedRaw, {
    requireSlugFree: false,
    existingWorksheets,
    currentSlug: current.slug,
  });

  const siteUrl = getSiteUrl();

  if (useDb) {
    await dbUpsertWorksheet(updatedWorksheet, false);
    revalidateCatalog(updatedWorksheet.slug);
    return {
      slug: updatedWorksheet.slug,
      pageUrl: `${siteUrl}/worksheets/${updatedWorksheet.slug}`,
      published: updatedWorksheet.published !== false,
      inRss: updatedWorksheet.pinterest?.autoPublish !== false,
      updatedAt: updatedWorksheet.dateModified,
      worksheet: updatedWorksheet,
      commit: { mode: 'neon' },
    };
  }

  const nextList = existingWorksheets.map((w) =>
    w.slug === updatedWorksheet.slug ? updatedWorksheet : w
  );
  const jsonBase64 = Buffer.from(JSON.stringify(nextList, null, 2) + '\n', 'utf8').toString(
    'base64'
  );
  const commit = await commitFiles(
    [{ path: 'src/data/worksheets.json', contentBase64: jsonBase64 }],
    `cms: patch metadata for ${updatedWorksheet.slug}`
  );

  return {
    slug: updatedWorksheet.slug,
    pageUrl: `${siteUrl}/worksheets/${updatedWorksheet.slug}`,
    published: updatedWorksheet.published !== false,
    inRss: updatedWorksheet.pinterest?.autoPublish !== false,
    updatedAt: updatedWorksheet.dateModified,
    worksheet: updatedWorksheet,
    commit,
  };
}
