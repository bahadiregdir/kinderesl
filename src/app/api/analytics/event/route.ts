import { NextResponse } from 'next/server';
import {
  dbIncrementDownload,
  dbIncrementToolDownload,
  dbRecordPageExit,
  dbRecordPageView,
  dbRecordSearch,
  isDatabaseConfigured,
} from '@/lib/db';

const BOT_UA_RE = /bot|crawl|spider|slurp|bingpreview|lighthouse|headless/i;

function normalizePath(raw: unknown): string | null {
  if (typeof raw !== 'string') return null;
  const trimmed = raw.trim().split('?')[0].split('#')[0];
  if (!trimmed.startsWith('/')) return null;
  return trimmed.slice(0, 200) || '/';
}

export async function POST(request: Request) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ ok: true, persisted: false });
  }

  try {
    const rawText = await request.text();
    if (!rawText) {
      return NextResponse.json({ ok: false, error: 'Empty payload' }, { status: 400 });
    }

    const body = JSON.parse(rawText) as {
      type?: string;
      slug?: string;
      query?: string;
      resultCount?: number;
      path?: string;
      referrerHost?: string | null;
      sessionId?: string;
      deviceType?: string;
      durationMs?: number;
    };

    if (body.type === 'download' && typeof body.slug === 'string') {
      const cleanSlug = body.slug.trim().toLowerCase().slice(0, 120);
      if (/^[a-z0-9-]+$/.test(cleanSlug)) {
        await dbIncrementDownload(cleanSlug);
      }
      return NextResponse.json({ ok: true, persisted: true });
    }

    if (body.type === 'tool_download' && typeof body.slug === 'string') {
      const cleanSlug = body.slug.trim().toLowerCase().slice(0, 120);
      if (/^[a-z0-9-]+$/.test(cleanSlug)) {
        await dbIncrementToolDownload(cleanSlug);
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

    if (body.type === 'pageview' || body.type === 'exit') {
      const ua = request.headers.get('user-agent') || '';
      if (BOT_UA_RE.test(ua)) {
        return NextResponse.json({ ok: true, persisted: false });
      }

      const path = normalizePath(body.path);
      const sessionId =
        typeof body.sessionId === 'string' ? body.sessionId.trim().slice(0, 64) : '';
      if (!path || !sessionId || path.startsWith('/admin') || path.startsWith('/api')) {
        return NextResponse.json({ ok: true, persisted: false });
      }

      if (body.type === 'pageview') {
        const deviceType = body.deviceType === 'mobile' ? 'mobile' : 'desktop';
        const referrerHost =
          typeof body.referrerHost === 'string' && body.referrerHost.trim()
            ? body.referrerHost.trim().toLowerCase().slice(0, 120)
            : null;
        await dbRecordPageView({ path, referrerHost, sessionId, deviceType });
        return NextResponse.json({ ok: true, persisted: true });
      }

      await dbRecordPageExit({
        path,
        sessionId,
        durationMs: Number(body.durationMs) || 0,
      });
      return NextResponse.json({ ok: true, persisted: true });
    }

    return NextResponse.json({ ok: false, error: 'Unsupported event type' }, { status: 400 });
  } catch {
    // Analytics must never interrupt user browsing
    return NextResponse.json({ ok: true, persisted: false });
  }
}
