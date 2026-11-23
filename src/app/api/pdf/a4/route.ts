import fs from 'node:fs/promises';
import path from 'node:path';
import { NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib';
import { fetchWorksheetBySlug } from '@/lib/worksheets-store';

const A4_WIDTH = 595.28;
const A4_HEIGHT = 841.89;
const SAFE_MARGIN = 18;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawSlug = searchParams.get('slug') || '';
  const slug = rawSlug.trim().toLowerCase();

  if (!/^[a-z0-9-]+$/.test(slug)) {
    return NextResponse.json({ error: 'Invalid worksheet slug' }, { status: 400 });
  }

  const worksheet = await fetchWorksheetBySlug(slug);
  if (!worksheet || !worksheet.pdfPath) {
    return NextResponse.json({ error: 'Worksheet PDF not found' }, { status: 404 });
  }

  try {
    let sourceBytes: Uint8Array;
    if (/^https?:\/\//i.test(worksheet.pdfPath)) {
      const upstream = await fetch(worksheet.pdfPath);
      if (!upstream.ok) {
        return NextResponse.json(
          { error: 'Unable to fetch source PDF' },
          { status: 502 }
        );
      }
      sourceBytes = new Uint8Array(await upstream.arrayBuffer());
    } else {
      const cleanRel = worksheet.pdfPath.replace(/^\/+/, '');
      const localPath = path.join(process.cwd(), 'public', cleanRel);
      sourceBytes = new Uint8Array(await fs.readFile(localPath));
    }

    const srcDoc = await PDFDocument.load(sourceBytes);
    const outDoc = await PDFDocument.create();
    const srcPages = srcDoc.getPages();

    const maxW = A4_WIDTH - SAFE_MARGIN * 2;
    const maxH = A4_HEIGHT - SAFE_MARGIN * 2;

    for (const srcPage of srcPages) {
      const embedded = await outDoc.embedPage(srcPage);
      const scale = Math.min(maxW / embedded.width, maxH / embedded.height);
      const drawW = embedded.width * scale;
      const drawH = embedded.height * scale;

      const outPage = outDoc.addPage([A4_WIDTH, A4_HEIGHT]);
      outPage.drawPage(embedded, {
        x: (A4_WIDTH - drawW) / 2,
        y: (A4_HEIGHT - drawH) / 2,
        width: drawW,
        height: drawH,
      });
    }

    const a4Bytes = await outDoc.save();

    return new NextResponse(Buffer.from(a4Bytes), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${slug}-A4.pdf"`,
        'Cache-Control': 'public, max-age=86400, s-maxage=604800',
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to convert PDF to A4';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
