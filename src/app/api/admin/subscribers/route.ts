import { NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { dbListSubscribers, isDatabaseConfigured } from '@/lib/db';

function csvEscape(val: string): string {
  const safe = val.replace(/"/g, '""');
  return /[",\n\r]/.test(safe) ? `"${safe}"` : safe;
}

export async function GET(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const subscribers = isDatabaseConfigured() ? await dbListSubscribers() : [];
    const { searchParams } = new URL(request.url);

    if (searchParams.get('format') === 'csv') {
      const header = 'email,role,source,created_at';
      const rows = subscribers.map((s) =>
        [
          csvEscape(s.email),
          csvEscape(s.role),
          csvEscape(s.source),
          csvEscape(s.createdAt),
        ].join(',')
      );
      const csvBody = [header, ...rows].join('\n');

      return new NextResponse(csvBody, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': 'attachment; filename="kinderesl-subscribers.csv"',
          'Cache-Control': 'no-store',
        },
      });
    }

    return NextResponse.json({
      count: subscribers.length,
      subscribers,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to load subscribers';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
