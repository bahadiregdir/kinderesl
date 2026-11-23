import { NextResponse } from 'next/server';
import {
  dbIncrementDownload,
  dbRecordSearch,
  isDatabaseConfigured,
} from '@/lib/db';

export async function POST(request: Request) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ ok: true, persisted: false });
  }

  try {
    const body = (await request.json()) as {
      type?: string;
      slug?: string;
      query?: string;
      resultCount?: number;
    };

    if (body.type === 'download' && typeof body.slug === 'string') {
      const cleanSlug = body.slug.trim().toLowerCase().slice(0, 120);
      if (/^[a-z0-9-]+$/.test(cleanSlug)) {
        await dbIncrementDownload(cleanSlug);
      }
      return NextResponse.json({ ok: true, persisted: true });
    }

    if (body.type === 'search' && typeof body.query === 'string') {
      const cleanQuery = body.query.trim();
      if (cleanQuery.length >= 2) {
        await dbRecordSearch(cleanQuery, Number(body.resultCount) || 0);
      }
      return NextResponse.json({ ok: true, persisted: true });
    }

    return NextResponse.json({ ok: false, error: 'Unsupported event type' }, { status: 400 });
  } catch {
    // Analytics must never interrupt user browsing
    return NextResponse.json({ ok: true, persisted: false });
  }
}
