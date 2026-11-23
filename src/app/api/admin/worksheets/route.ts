import { NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { commitFiles, getStorageInfo, readJsonFile } from '@/lib/cms-storage';
import {
  dbGetAnalyticsSummary,
  dbListWorksheets,
  dbUpsertWorksheet,
  isDatabaseConfigured,
} from '@/lib/db';
import { revalidateCatalog } from '@/lib/revalidation';
import {
  computeCollectionStats,
  saveUploadedAssetsForWorksheet,
  validateWorksheetMetadata,
} from '@/lib/worksheet-cms-helper';
import type { Worksheet } from '@/types/worksheet';

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const useDb = isDatabaseConfigured();
    const worksheets = useDb
      ? await dbListWorksheets()
      : await readJsonFile<Worksheet[]>('src/data/worksheets.json');

    const analytics = useDb
      ? await dbGetAnalyticsSummary()
      : {
          totalDownloads: 0,
          topDownloaded: [],
          topSearches: [],
          traffic: {
            totalPageViews: 0,
            todayPageViews: 0,
            uniqueSessions30d: 0,
            todaySessions: 0,
            avgDurationSec: 0,
            dailyVisits: [],
            topPages: [],
            topReferrers: [],
          },
        };

    return NextResponse.json({
      worksheets,
      storage: getStorageInfo(),
      stats: computeCollectionStats(worksheets),
      analytics,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to load worksheets';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const metadataRaw = formData.get('metadata');
    if (typeof metadataRaw !== 'string') {
      return NextResponse.json({ error: 'Missing worksheet metadata JSON' }, { status: 400 });
    }

    const parsedMeta = JSON.parse(metadataRaw) as Record<string, unknown>;
    const useDb = isDatabaseConfigured();
    const existingWorksheets = useDb
      ? await dbListWorksheets()
      : await readJsonFile<Worksheet[]>('src/data/worksheets.json');

    const validated = validateWorksheetMetadata(parsedMeta, {
      requireSlugFree: true,
      existingWorksheets,
    });

    const uploaded = await saveUploadedAssetsForWorksheet(validated.slug, formData);
    if (!uploaded.pdfPath || !uploaded.pdfFileSize) {
      return NextResponse.json({ error: 'A valid PDF file is required.' }, { status: 400 });
    }
    if (uploaded.previewImages.length === 0) {
      return NextResponse.json(
        { error: 'At least one rendered PNG preview page is required.' },
        { status: 400 }
      );
    }

    const finalWorksheet: Worksheet = {
      ...validated,
      pdfPath: uploaded.pdfPath,
      pdfFileSize: uploaded.pdfFileSize,
      previewImages: uploaded.previewImages,
      pages: uploaded.previewImages.length,
      pinterestPinImage: uploaded.pinterestPinImage || uploaded.previewImages[0],
    };

    if (useDb) {
      if (uploaded.localChanges.length > 0) {
        await commitFiles(
          uploaded.localChanges,
          `cms: save local assets for ${finalWorksheet.slug}`
        );
      }
      await dbUpsertWorksheet(finalWorksheet, true);
      revalidateCatalog(finalWorksheet.slug);

      const nextList = [finalWorksheet, ...existingWorksheets];
      return NextResponse.json(
        {
          worksheet: finalWorksheet,
          commit: { mode: 'neon', assetStorage: uploaded.assetBackend },
          stats: computeCollectionStats(nextList),
        },
        { status: 201 }
      );
    }

    // Legacy JSON / Git-CMS fallback if DATABASE_URL is absent
    const nextList = [finalWorksheet, ...existingWorksheets];
    const jsonBase64 = Buffer.from(JSON.stringify(nextList, null, 2) + '\n', 'utf8').toString(
      'base64'
    );

    const commit = await commitFiles(
      [
        ...uploaded.localChanges,
        { path: 'src/data/worksheets.json', contentBase64: jsonBase64 },
      ],
      `cms: add worksheet ${finalWorksheet.slug}`
    );

    return NextResponse.json(
      {
        worksheet: finalWorksheet,
        commit,
        stats: computeCollectionStats(nextList),
      },
      { status: 201 }
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to publish worksheet';
    const status =
      msg.includes('already exists') || msg.includes('required') || msg.includes('limit')
        ? 400
        : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}
