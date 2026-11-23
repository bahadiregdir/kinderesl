import { NextResponse } from 'next/server';
import { dbUpsertSubscriber, isDatabaseConfigured } from '@/lib/db';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ALLOWED_ROLES = new Set(['teacher', 'parent', 'homeschooler']);

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      email?: string;
      role?: string;
      source?: string;
    };

    const cleanEmail =
      typeof body.email === 'string' ? body.email.trim().toLowerCase().slice(0, 160) : '';
    if (!EMAIL_RE.test(cleanEmail)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    const rawRole = typeof body.role === 'string' ? body.role.trim().toLowerCase() : 'teacher';
    const role = ALLOWED_ROLES.has(rawRole) ? rawRole : 'teacher';
    const source =
      typeof body.source === 'string' && body.source.trim()
        ? body.source.trim().toLowerCase().slice(0, 40)
        : 'homepage';

    if (!isDatabaseConfigured()) {
      return NextResponse.json({
        ok: true,
        alreadySubscribed: false,
        persisted: false,
      });
    }

    const result = await dbUpsertSubscriber({ email: cleanEmail, role, source });
    return NextResponse.json({
      ok: true,
      alreadySubscribed: result.alreadySubscribed,
      persisted: true,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Subscription failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
