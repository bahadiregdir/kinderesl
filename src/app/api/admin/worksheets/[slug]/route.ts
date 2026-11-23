import { NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { commitFiles, readJsonFile, type CmsFileChange } from '@/lib/cms-storage';
import {
  dbDeleteWorksheet,
  dbGetWorksheetBySlug,
  dbListWorksheets,
  dbUpsertWorksheet,
  isDatabaseConfigured,
} from '@/lib/db';
import { revalidateCatalog } from '@/lib/revalidation';
import {
  computeCollectionStats,
  removeOldAssetUrls,
  saveUploadedAssetsForWorksheet,
  validateWorksheetMetadata,
} from '@/lib/worksheet-cms-helper';
import type { Worksheet } from '@/types/worksheet';

interface RouteContext {
  params: Promise<{ slug: string }>;
}

export async function PUT(request: Request, context: RouteContext) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { slug: paramSlug } = await context.params;
    const useDb = isDatabaseConfigured();
    const existingWorksheets = useDb
      ? await dbListWorksheets()
      : await readJsonFile<Worksheet[]>('src/data/worksheets.json');

    const current = useDb
      ? await dbGetWorksheetBySlug(paramSlug)
      : existingWorksheets.find((w) => w.slug === paramSlug) || null;

    if (!current) {
      return NextResponse.json({ error: 'Worksheet not found' }, { status: 404 });
    }

    const contentType = request.headers.get('content-type') || '';
    let parsedMeta: Record<string, unknown>;
    let uploaded: Awaited<ReturnType<typeof saveUploadedAssetsForWorksheet>> | null = null;

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const raw = formData.get('metadata');
      if (typeof raw !== 'string') {
        return NextResponse.json({ error: 'Missing metadata JSON' }, { status: 400 });
      }
      parsedMeta = JSON.parse(raw) as Record<string, unknown>;
      uploaded = await saveUploadedAssetsForWorksheet(current.slug, formData);
    } else {
      parsedMeta = (await request.json()) as Record<string, unknown>;
    }

    const validated = validateWorksheetMetadata(
      {
        ...parsedMeta,
        id: current.id,
        slug: current.slug,
        datePublished: current.datePublished,
        pdfPath: current.pdfPath,
        pdfFileSize: current.pdfFileSize,
        previewImages: current.previewImages,
        pinterestPinImage: current.pinterestPinImage,
        pinterest: parsedMeta.pinterest ?? current.pinterest,
        pages: current.pages,
      },
      {
        requireSlugFree: false,
        existingWorksheets,
        currentSlug: current.slug,
      }
    );

    const updatedWorksheet: Worksheet = { ...validated };
    const replacedUrls: string[] = [];

    if (uploaded) {
      if (uploaded.pdfPath && uploaded.pdfFileSize) {
        if (current.pdfPath !== uploaded.pdfPath) {
          replacedUrls.push(current.pdfPath);
        }
        updatedWorksheet.pdfPath = uploaded.pdfPath;
        updatedWorksheet.pdfFileSize = uploaded.pdfFileSize;
      }

      if (uploaded.previewImages.length > 0) {
        for (const oldImg of current.previewImages) {
          if (!uploaded.previewImages.includes(oldImg)) {
            replacedUrls.push(oldImg);
          }
        }
        updatedWorksheet.previewImages = uploaded.previewImages;
        updatedWorksheet.pages = uploaded.previewImages.length;
      }

      if (uploaded.pinterestPinImage) {
        if (
          current.pinterestPinImage !== uploaded.pinterestPinImage &&
          !updatedWorksheet.previewImages.includes(current.pinterestPinImage)
        ) {
          replacedUrls.push(current.pinterestPinImage);
        }
        updatedWorksheet.pinterestPinImage = uploaded.pinterestPinImage;
      }
    }

    if (useDb) {
      if (uploaded?.localChanges && uploaded.localChanges.length > 0) {
        await commitFiles(
          uploaded.localChanges,
          `cms: update local assets for ${updatedWorksheet.slug}`
        );
      }
      await dbUpsertWorksheet(updatedWorksheet, false);
      if (replacedUrls.length > 0) {
        await removeOldAssetUrls(replacedUrls);
      }
      revalidateCatalog(updatedWorksheet.slug);

      const nextList = existingWorksheets.map((w) =>
        w.slug === updatedWorksheet.slug ? updatedWorksheet : w
      );
      return NextResponse.json({
        worksheet: updatedWorksheet,
        commit: { mode: 'neon', assetStorage: uploaded?.assetBackend || 'unchanged' },
        stats: computeCollectionStats(nextList),
      });
    }

    // Fallback JSON / Git-CMS
    const changes: CmsFileChange[] = [];
    if (uploaded?.localChanges) {
      changes.push(...uploaded.localChanges);
    }
    const nextList = existingWorksheets.map((w) =>
      w.slug === updatedWorksheet.slug ? updatedWorksheet : w
    );
    const jsonBase64 = Buffer.from(JSON.stringify(nextList, null, 2) + '\n', 'utf8').toString(
      'base64'
    );
    changes.push({ path: 'src/data/worksheets.json', contentBase64: jsonBase64 });

    const commit = await commitFiles(changes, `cms: update worksheet ${updatedWorksheet.slug}`);
    if (replacedUrls.length > 0) {
      await removeOldAssetUrls(replacedUrls);
    }

    return NextResponse.json({
      worksheet: updatedWorksheet,
      commit,
      stats: computeCollectionStats(nextList),
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to update worksheet';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { slug: paramSlug } = await context.params;
    const useDb = isDatabaseConfigured();

    if (useDb) {
      const deleted = await dbDeleteWorksheet(paramSlug);
      if (!deleted) {
        return NextResponse.json({ error: 'Worksheet not found' }, { status: 404 });
      }
      await removeOldAssetUrls([
        deleted.pdfPath,
        ...deleted.previewImages,
        deleted.pinterestPinImage,
      ]);
      revalidateCatalog(paramSlug);
      const nextList = await dbListWorksheets();

      return NextResponse.json({
        deletedSlug: paramSlug,
        commit: { mode: 'neon' },
        stats: computeCollectionStats(nextList),
      });
    }

    // Legacy JSON fallback
    const existingWorksheets = await readJsonFile<Worksheet[]>('src/data/worksheets.json');
    const target = existingWorksheets.find((w) => w.slug === paramSlug);
    if (!target) {
      return NextResponse.json({ error: 'Worksheet not found' }, { status: 404 });
    }

    const nextList = existingWorksheets.filter((w) => w.slug !== paramSlug);
    const jsonBase64 = Buffer.from(JSON.stringify(nextList, null, 2) + '\n', 'utf8').toString(
      'base64'
    );
    const commit = await commitFiles(
      [{ path: 'src/data/worksheets.json', contentBase64: jsonBase64 }],
      `cms: delete worksheet ${paramSlug}`
    );
    await removeOldAssetUrls([
      target.pdfPath,
      ...target.previewImages,
      target.pinterestPinImage,
    ]);

    return NextResponse.json({
      deletedSlug: paramSlug,
      commit,
      stats: computeCollectionStats(nextList),
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to delete worksheet';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { slug: paramSlug } = await context.params;
    const body = (await request.json()) as { pinterestAutoPublish?: boolean };
    const autoPublish = Boolean(body.pinterestAutoPublish);
    const useDb = isDatabaseConfigured();

    const existingWorksheets = useDb
      ? await dbListWorksheets()
      : await readJsonFile<Worksheet[]>('src/data/worksheets.json');

    const current = useDb
      ? await dbGetWorksheetBySlug(paramSlug)
      : existingWorksheets.find((w) => w.slug === paramSlug) || null;

    if (!current) {
      return NextResponse.json({ error: 'Worksheet not found' }, { status: 404 });
    }

    const updatedWorksheet: Worksheet = {
      ...current,
      pinterest: {
        autoPublish,
        ...(autoPublish ? { rssQueuedAt: new Date().toISOString() } : {}),
      },
    };

    if (useDb) {
      await dbUpsertWorksheet(updatedWorksheet, false);
      revalidateCatalog(updatedWorksheet.slug);
      return NextResponse.json({
        worksheet: updatedWorksheet,
        commit: { mode: 'neon' },
      });
    }

    const nextList = existingWorksheets.map((w) =>
      w.slug === updatedWorksheet.slug ? updatedWorksheet : w
    );
    const jsonBase64 = Buffer.from(JSON.stringify(nextList, null, 2) + '\n', 'utf8').toString(
      'base64'
    );
    const commit = await commitFiles(
      [{ path: 'src/data/worksheets.json', contentBase64: jsonBase64 }],
      `cms: toggle pinterest RSS for ${updatedWorksheet.slug}`
    );

    return NextResponse.json({
      worksheet: updatedWorksheet,
      commit,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to update Pinterest status';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
