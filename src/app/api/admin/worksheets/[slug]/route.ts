import { NextResponse } from 'next/server';
import { requireAdminApiAccess } from '@/lib/admin-api-guard';
import { commitFiles, readJsonFile } from '@/lib/cms-storage';
import {
  dbDeleteWorksheet,
  dbListWorksheets,
  isDatabaseConfigured,
} from '@/lib/db';
import { revalidateCatalog } from '@/lib/revalidation';
import {
  WorksheetValidationError,
  computeCollectionStats,
  removeOldAssetUrls,
} from '@/lib/worksheet-cms-helper';
import {
  patchWorksheetMetadata,
  upsertWorksheetFromRequest,
} from '@/lib/worksheet-service';
import type { Worksheet } from '@/types/worksheet';

interface RouteContext {
  params: Promise<{ slug: string }>;
}

export async function PUT(request: Request, context: RouteContext) {
  const access = await requireAdminApiAccess(request);
  if (!access.authorized) return access.response;

  try {
    const { slug: paramSlug } = await context.params;
    const { searchParams } = new URL(request.url);
    const dryRun = searchParams.get('dryRun') === 'true';

    const result = await upsertWorksheetFromRequest(request, {
      forcedSlug: paramSlug,
      upsert: true,
      dryRun,
    });

    return NextResponse.json(result, { status: 200, headers: access.headers });
  } catch (err) {
    if (err instanceof WorksheetValidationError) {
      return NextResponse.json(
        { error: err.message, errors: err.errors },
        { status: err.status, headers: access.headers }
      );
    }
    const msg = err instanceof Error ? err.message : 'Failed to update worksheet';
    return NextResponse.json({ error: msg }, { status: 500, headers: access.headers });
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  const access = await requireAdminApiAccess(request);
  if (!access.authorized) return access.response;

  try {
    const { slug: paramSlug } = await context.params;
    const body = (await request.json()) as Record<string, unknown>;
    const result = await patchWorksheetMetadata(paramSlug, body);
    return NextResponse.json(result, { status: 200, headers: access.headers });
  } catch (err) {
    if (err instanceof WorksheetValidationError) {
      return NextResponse.json(
        { error: err.message, errors: err.errors },
        { status: err.status, headers: access.headers }
      );
    }
    const msg = err instanceof Error ? err.message : 'Failed to update worksheet metadata';
    return NextResponse.json({ error: msg }, { status: 500, headers: access.headers });
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  const access = await requireAdminApiAccess(request);
  if (!access.authorized) return access.response;

  try {
    const { slug: paramSlug } = await context.params;
    const useDb = isDatabaseConfigured();

    if (useDb) {
      const deleted = await dbDeleteWorksheet(paramSlug);
      if (!deleted) {
        return NextResponse.json(
          { error: 'Worksheet not found' },
          { status: 404, headers: access.headers }
        );
      }
      await removeOldAssetUrls([
        deleted.pdfPath,
        ...deleted.previewImages,
        deleted.pinterestPinImage,
      ]);
      revalidateCatalog(paramSlug);
      const nextList = await dbListWorksheets();

      return NextResponse.json(
        {
          deletedSlug: paramSlug,
          commit: { mode: 'neon' },
          stats: computeCollectionStats(nextList),
        },
        { status: 200, headers: access.headers }
      );
    }

    // Legacy JSON fallback
    const existingWorksheets = await readJsonFile<Worksheet[]>('src/data/worksheets.json');
    const target = existingWorksheets.find((w) => w.slug === paramSlug);
    if (!target) {
      return NextResponse.json(
        { error: 'Worksheet not found' },
        { status: 404, headers: access.headers }
      );
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

    return NextResponse.json(
      {
        deletedSlug: paramSlug,
        commit,
        stats: computeCollectionStats(nextList),
      },
      { status: 200, headers: access.headers }
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to delete worksheet';
    return NextResponse.json({ error: msg }, { status: 500, headers: access.headers });
  }
}
