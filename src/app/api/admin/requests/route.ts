import { NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { commitFiles, readJsonFile } from '@/lib/cms-storage';
import type { WorksheetRequest } from '@/types/worksheet';

const VALID_STATUSES = new Set<WorksheetRequest['status']>(['new', 'planned', 'done']);

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const requests = await readJsonFile<WorksheetRequest[]>('src/data/requests.json');
    return NextResponse.json({ requests });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to load requests';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = (await request.json()) as {
      id?: string;
      status?: WorksheetRequest['status'];
      delete?: boolean;
    };

    if (!body.id) {
      return NextResponse.json({ error: 'Request id is required.' }, { status: 400 });
    }

    const requests = await readJsonFile<WorksheetRequest[]>('src/data/requests.json');
    const exists = requests.some((r) => r.id === body.id);
    if (!exists) {
      return NextResponse.json({ error: 'Request not found.' }, { status: 404 });
    }

    let nextList: WorksheetRequest[];
    if (body.delete) {
      nextList = requests.filter((r) => r.id !== body.id);
    } else if (body.status && VALID_STATUSES.has(body.status)) {
      nextList = requests.map((r) =>
        r.id === body.id ? { ...r, status: body.status! } : r
      );
    } else {
      return NextResponse.json({ error: 'Invalid status update.' }, { status: 400 });
    }

    const contentBase64 = Buffer.from(
      JSON.stringify(nextList, null, 2) + '\n',
      'utf8'
    ).toString('base64');

    const commit = await commitFiles(
      [{ path: 'src/data/requests.json', contentBase64 }],
      `cms: ${body.delete ? 'delete' : 'update'} worksheet request ${body.id}`
    );

    return NextResponse.json({ requests: nextList, commit });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to update request';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
