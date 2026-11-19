import { NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { commitFiles, getStorageInfo, readJsonFile } from '@/lib/cms-storage';
import {
  computeCollectionStats,
  processUploadedAssets,
  validateWorksheetMetadata,
} from '@/lib/worksheet-cms-helper';
import type { Worksheet } from '@/types/worksheet';

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const worksheets = await readJsonFile<Worksheet[]>('src/data/worksheets.json');
    return NextResponse.json({
      worksheets,
      storage: getStorageInfo(),
      stats: computeCollectionStats(worksheets),
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
    const existingWorksheets = await readJsonFile<Worksheet[]>('src/data/worksheets.json');

    const validated = validateWorksheetMetadata(parsedMeta, {
      requireSlugFree: true,
      existingWorksheets,
    });

    const uploaded = await processUploadedAssets(validated.slug, formData);
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

    const nextList = [finalWorksheet, ...existingWorksheets];
    const jsonBase64 = Buffer.from(JSON.stringify(nextList, null, 2) + '\n', 'utf8').toString(
      'base64'
    );

    const commit = await commitFiles(
      [
        ...uploaded.changes,
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
    const status = msg.includes('already exists') || msg.includes('required') ? 400 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}
