import { NextResponse } from 'next/server';
import { requireAdminApiAccess } from '@/lib/admin-api-guard';
import { getStorageInfo, readJsonFile } from '@/lib/cms-storage';
import {
  dbGetAnalyticsSummary,
  dbListWorksheets,
  isDatabaseConfigured,
} from '@/lib/db';
import {
  WorksheetValidationError,
  computeCollectionStats,
} from '@/lib/worksheet-cms-helper';
import { upsertWorksheetFromRequest } from '@/lib/worksheet-service';
import type { Worksheet } from '@/types/worksheet';

export async function GET(request: Request) {
  const access = await requireAdminApiAccess(request);
  if (!access.authorized) return access.response;

  try {
    const useDb = isDatabaseConfigured();
    const worksheets = useDb
      ? await dbListWorksheets()
      : await readJsonFile<Worksheet[]>('src/data/worksheets.json');

    // Token-authenticated API clients receive the clean summary array
    if (access.method === 'bearer') {
      return NextResponse.json(
        {
          count: worksheets.length,
          worksheets: worksheets.map((w) => ({
            slug: w.slug,
            title: w.title,
            subject: w.subject,
            published: w.published !== false,
            inRss: w.pinterest?.autoPublish !== false,
            updatedAt: w.dateModified,
          })),
        },
        { status: 200, headers: access.headers }
      );
    }

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

    return NextResponse.json(
      {
        worksheets,
        storage: getStorageInfo(),
        stats: computeCollectionStats(worksheets),
        analytics,
      },
      { status: 200, headers: access.headers }
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to load worksheets';
    return NextResponse.json({ error: msg }, { status: 500, headers: access.headers });
  }
}

export async function POST(request: Request) {
  const access = await requireAdminApiAccess(request);
  if (!access.authorized) return access.response;

  try {
    const { searchParams } = new URL(request.url);
    const upsert = searchParams.get('upsert') === 'true';
    const dryRun = searchParams.get('dryRun') === 'true';

    const result = await upsertWorksheetFromRequest(request, { upsert, dryRun });
    const status = dryRun ? 200 : 201;

    return NextResponse.json(result, { status, headers: access.headers });
  } catch (err) {
    if (err instanceof WorksheetValidationError) {
      return NextResponse.json(
        { error: err.message, errors: err.errors },
        { status: err.status, headers: access.headers }
      );
    }
    const msg = err instanceof Error ? err.message : 'Failed to publish worksheet';
    return NextResponse.json({ error: msg }, { status: 500, headers: access.headers });
  }
}
