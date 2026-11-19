import { NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { commitFiles, readJsonFile, type CmsFileChange } from '@/lib/cms-storage';
import {
  computeCollectionStats,
  processUploadedAssets,
  validateWorksheetMetadata,
} from '@/lib/worksheet-cms-helper';
import type { Worksheet } from '@/types/worksheet';

interface RouteContext {
  params: Promise<{ slug: string }>;
}

function toRepoPublicPath(webPath: string): string | null {
  const clean = webPath.trim().replace(/^\/+/, '');
  if (!clean.startsWith('worksheets/')) return null;
  return `public/${clean}`;
}

export async function PUT(request: Request, context: RouteContext) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { slug: paramSlug } = await context.params;
    const existingWorksheets = await readJsonFile<Worksheet[]>('src/data/worksheets.json');
    const targetIndex = existingWorksheets.findIndex((w) => w.slug === paramSlug);
    if (targetIndex === -1) {
      return NextResponse.json({ error: 'Worksheet not found' }, { status: 404 });
    }
    const current = existingWorksheets[targetIndex];

    const contentType = request.headers.get('content-type') || '';
    let parsedMeta: Record<string, unknown>;
    let uploaded: Awaited<ReturnType<typeof processUploadedAssets>> | null = null;

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const raw = formData.get('metadata');
      if (typeof raw !== 'string') {
        return NextResponse.json({ error: 'Missing metadata JSON' }, { status: 400 });
      }
      parsedMeta = JSON.parse(raw) as Record<string, unknown>;
      // Preserve existing slug directory for assets
      uploaded = await processUploadedAssets(current.slug, formData);
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
        pages: current.pages,
      },
      {
        requireSlugFree: false,
        existingWorksheets,
        currentSlug: current.slug,
      }
    );

    const changes: CmsFileChange[] = [];
    let updatedWorksheet: Worksheet = { ...validated };

    if (uploaded) {
      if (uploaded.pdfPath && uploaded.pdfFileSize) {
        if (current.pdfPath !== uploaded.pdfPath) {
          const oldPdf = toRepoPublicPath(current.pdfPath);
          if (oldPdf) changes.push({ path: oldPdf, delete: true });
        }
        updatedWorksheet.pdfPath = uploaded.pdfPath;
        updatedWorksheet.pdfFileSize = uploaded.pdfFileSize;
      }

      if (uploaded.previewImages.length > 0) {
        for (const oldImg of current.previewImages) {
          if (!uploaded.previewImages.includes(oldImg)) {
            const oldRepoImg = toRepoPublicPath(oldImg);
            if (oldRepoImg) changes.push({ path: oldRepoImg, delete: true });
          }
        }
        updatedWorksheet.previewImages = uploaded.previewImages;
        updatedWorksheet.pages = uploaded.previewImages.length;
      }

      if (uploaded.pinterestPinImage) {
        if (
          current.pinterestPinImage !== uploaded.pinterestPinImage &&
          !current.previewImages.includes(current.pinterestPinImage)
        ) {
          const oldPin = toRepoPublicPath(current.pinterestPinImage);
          if (oldPin) changes.push({ path: oldPin, delete: true });
        }
        updatedWorksheet.pinterestPinImage = uploaded.pinterestPinImage;
      }

      changes.push(...uploaded.changes);
    }

    const nextList = [...existingWorksheets];
    nextList[targetIndex] = updatedWorksheet;

    const jsonBase64 = Buffer.from(JSON.stringify(nextList, null, 2) + '\n', 'utf8').toString(
      'base64'
    );
    changes.push({ path: 'src/data/worksheets.json', contentBase64: jsonBase64 });

    const commit = await commitFiles(changes, `cms: update worksheet ${updatedWorksheet.slug}`);

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
    const existingWorksheets = await readJsonFile<Worksheet[]>('src/data/worksheets.json');
    const target = existingWorksheets.find((w) => w.slug === paramSlug);
    if (!target) {
      return NextResponse.json({ error: 'Worksheet not found' }, { status: 404 });
    }

    const nextList = existingWorksheets.filter((w) => w.slug !== paramSlug);
    const assetPaths = new Set<string>();
    const maybePaths = [target.pdfPath, ...target.previewImages, target.pinterestPinImage];
    for (const p of maybePaths) {
      const repoPath = toRepoPublicPath(p);
      if (repoPath) assetPaths.add(repoPath);
    }

    const changes: CmsFileChange[] = [];
    for (const repoPath of assetPaths) {
      changes.push({ path: repoPath, delete: true });
    }
    const jsonBase64 = Buffer.from(JSON.stringify(nextList, null, 2) + '\n', 'utf8').toString(
      'base64'
    );
    changes.push({ path: 'src/data/worksheets.json', contentBase64: jsonBase64 });

    const commit = await commitFiles(changes, `cms: delete worksheet ${paramSlug}`);

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
