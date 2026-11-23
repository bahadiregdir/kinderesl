import { NextResponse } from 'next/server';
import { commitFiles, getStorageInfo, readJsonFile } from '@/lib/cms-storage';
import { dbInsertRequest, isDatabaseConfigured } from '@/lib/db';
import type { WorksheetRequest } from '@/types/worksheet';

// Simple per-instance sliding window rate limit (5 requests / 10 minutes per IP)
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 5;
const ipHits = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const prev = (ipHits.get(ip) || []).filter((ts) => now - ts < RATE_WINDOW_MS);
  if (prev.length >= RATE_MAX) {
    ipHits.set(ip, prev);
    return true;
  }
  prev.push(now);
  ipHits.set(ip, prev);
  return false;
}

export async function POST(request: Request) {
  try {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many requests sent recently. Please try again in a few minutes.' },
        { status: 429 }
      );
    }

    const body = (await request.json()) as Record<string, unknown>;

    // Silent honeypot for spam bots
    if (typeof body.website === 'string' && body.website.trim() !== '') {
      return NextResponse.json({ ok: true, saved: true });
    }

    const name = String(body.name || '').trim().slice(0, 80);
    const email = String(body.email || '').trim().slice(0, 120);
    const role = String(body.role || '').trim().slice(0, 60);
    const ageGroup = String(body.ageGroup || '').trim().slice(0, 40);
    const subject = String(body.subject || '').trim().slice(0, 60);
    const topic = String(body.topic || '').trim().slice(0, 140);
    const details = String(body.details || '').trim().slice(0, 1000);

    if (!name || !role || !ageGroup || !subject || !topic || !details) {
      return NextResponse.json(
        { error: 'Please complete all required fields.' },
        { status: 400 }
      );
    }

    const newReq: WorksheetRequest = {
      id: `req-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
      name,
      ...(email ? { email } : {}),
      role,
      ageGroup,
      subject,
      topic,
      details,
      status: 'new',
      createdAt: new Date().toISOString(),
    };

    if (isDatabaseConfigured()) {
      await dbInsertRequest(newReq);
      return NextResponse.json({
        ok: true,
        saved: true,
        requestId: newReq.id,
      });
    }

    const storage = getStorageInfo();
    if (storage.mode === 'unconfigured') {
      return NextResponse.json({
        ok: true,
        saved: false,
        fallbackEmail: true,
      });
    }

    const existing = await readJsonFile<WorksheetRequest[]>('src/data/requests.json');
    const nextList = [newReq, ...existing].slice(0, 200);
    const contentBase64 = Buffer.from(
      JSON.stringify(nextList, null, 2) + '\n',
      'utf8'
    ).toString('base64');

    await commitFiles(
      [{ path: 'src/data/requests.json', contentBase64 }],
      `cms: new educator worksheet request (${subject})`
    );

    return NextResponse.json({
      ok: true,
      saved: true,
      requestId: newReq.id,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unable to save request';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
