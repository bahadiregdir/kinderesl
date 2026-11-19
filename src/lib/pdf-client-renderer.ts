'use client';

export interface RenderedPdfPage {
  pageNumber: number;
  blob: Blob;
  dataUrl: string;
  width: number;
  height: number;
}

export interface RenderedPdfResult {
  numPages: number;
  fileSizeBytes: number;
  fileSizeLabel: string;
  previews: RenderedPdfPage[];
}

export function formatBytesLabel(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const kb = Math.round(bytes / 1024);
  if (kb < 1024) return `${kb} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  mimeType: string,
  quality?: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error(`Canvas export failed for ${mimeType}`));
        }
      },
      mimeType,
      quality
    );
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load preview image for Pin generation`));
    img.src = src;
  });
}

function wrapCanvasLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxLines: number
): string[] {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return ['Free Printable Worksheet'];

  const lines: string[] = [];
  let current = words[0];

  for (let i = 1; i < words.length; i++) {
    const test = `${current} ${words[i]}`;
    if (ctx.measureText(test).width <= maxWidth) {
      current = test;
    } else {
      lines.push(current);
      current = words[i];
      if (lines.length === maxLines - 1) {
        // Fill remaining words onto last line with ellipsis if needed
        const rest = words.slice(i).join(' ');
        let clipped = rest;
        while (ctx.measureText(clipped).width > maxWidth && clipped.length > 3) {
          clipped = clipped.slice(0, -4).trimEnd() + '...';
        }
        lines.push(clipped);
        return lines;
      }
    }
  }
  lines.push(current);
  return lines.slice(0, maxLines);
}

export async function renderPdfPagesToPngs(file: File): Promise<RenderedPdfResult> {
  if (typeof window === 'undefined') {
    throw new Error('renderPdfPagesToPngs can only run in the browser.');
  }

  // Dynamic import keeps pdfjs-dist completely out of Next.js SSR / server bundles
  const pdfjsLib = await import('pdfjs-dist');
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
  const pdf = await loadingTask.promise;

  const previews: RenderedPdfPage[] = [];
  const totalPages = pdf.numPages;

  for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const baseViewport = page.getViewport({ scale: 1 });
    const targetScale = Math.min(2.2, Math.max(1.2, 1224 / baseViewport.width));
    const viewport = page.getViewport({ scale: targetScale });

    const canvas = document.createElement('canvas');
    canvas.width = Math.round(viewport.width);
    canvas.height = Math.round(viewport.height);

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Unable to acquire 2D canvas context');
    }

    // Paint clean white paper background before rendering PDF page
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    await page.render({
      canvas,
      canvasContext: ctx,
      viewport,
    }).promise;

    const blob = await canvasToBlob(canvas, 'image/png');
    const dataUrl = canvas.toDataURL('image/png');

    previews.push({
      pageNumber: pageNum,
      blob,
      dataUrl,
      width: canvas.width,
      height: canvas.height,
    });
  }

  return {
    numPages: totalPages,
    fileSizeBytes: file.size,
    fileSizeLabel: formatBytesLabel(file.size),
    previews,
  };
}

export interface PinterestPinOptions {
  title: string;
  subtitle: string;
  badgeText?: string;
  pageImages: string[];
  domainLabel?: string;
}

export async function generatePinterestPinBlob(
  options: PinterestPinOptions
): Promise<{ blob: Blob; dataUrl: string }> {
  const WIDTH = 1000;
  const HEIGHT = 1500;

  const canvas = document.createElement('canvas');
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Unable to acquire canvas context for Pinterest Pin');
  }

  // 1. Warm cream paper background (#FAF6F0)
  ctx.fillStyle = '#FAF6F0';
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Subtle decorative corner glow
  ctx.fillStyle = '#F0F7F7';
  ctx.beginPath();
  ctx.arc(WIDTH - 60, 80, 210, 0, Math.PI * 2);
  ctx.fill();

  const marginX = 72;

  // 2. Top uppercase teal kicker
  const badge = (options.badgeText || 'FREE PRINTABLE · PRE-K & KINDERGARTEN').toUpperCase();
  ctx.fillStyle = '#2E6B6B';
  ctx.font = '700 26px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.fillText(badge, marginX, 108);

  // 3. Large bold headline
  ctx.fillStyle = '#1E293B';
  ctx.font = '800 66px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  const titleLines = wrapCanvasLines(ctx, options.title, WIDTH - marginX * 2, 3);
  let yCursor = 188;
  for (const line of titleLines) {
    ctx.fillText(line, marginX, yCursor);
    yCursor += 78;
  }

  // 4. Teal accent bar + subtitle
  const barY = yCursor - 36;
  ctx.fillStyle = '#2E6B6B';
  ctx.fillRect(marginX, barY, 96, 7);

  const subY = barY + 52;
  ctx.fillStyle = '#475569';
  ctx.font = '600 32px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  const subLines = wrapCanvasLines(ctx, options.subtitle, WIDTH - marginX * 2, 1);
  ctx.fillText(subLines[0] || '', marginX, subY);

  // 5. Tilted worksheet paper collage
  const loadedImgs: HTMLImageElement[] = [];
  for (const src of options.pageImages.slice(0, 2)) {
    try {
      const img = await loadImage(src);
      loadedImgs.push(img);
    } catch {
      // Ignore individual image load error
    }
  }

  const drawPaperCard = (
    img: HTMLImageElement,
    cx: number,
    cy: number,
    cardW: number,
    cardH: number,
    angleRad: number
  ) => {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angleRad);

    ctx.shadowColor = 'rgba(15, 23, 42, 0.22)';
    ctx.shadowBlur = 32;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 14;

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(-cardW / 2, -cardH / 2, cardW, cardH);

    ctx.shadowColor = 'transparent';
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 2;
    ctx.strokeRect(-cardW / 2, -cardH / 2, cardW, cardH);

    const pad = 12;
    ctx.drawImage(img, -cardW / 2 + pad, -cardH / 2 + pad, cardW - pad * 2, cardH - pad * 2);
    ctx.restore();
  };

  const footerH = 112;
  const collageTop = subY + 46;
  const availH = HEIGHT - footerH - collageTop - 36;

  if (loadedImgs.length >= 2) {
    const cardH = Math.min(760, Math.round(availH * 0.92));
    const cardW = Math.round(cardH * (1224 / 1584));
    const midY = collageTop + availH / 2;
    // Page 2 tilted behind right
    drawPaperCard(loadedImgs[1], WIDTH * 0.66, midY + 18, cardW * 0.94, cardH * 0.94, (3.2 * Math.PI) / 180);
    // Page 1 tilted in front left
    drawPaperCard(loadedImgs[0], WIDTH * 0.39, midY, cardW, cardH, (-2.2 * Math.PI) / 180);
  } else if (loadedImgs.length === 1) {
    const cardH = Math.min(820, Math.round(availH * 0.94));
    const cardW = Math.round(cardH * (1224 / 1584));
    drawPaperCard(loadedImgs[0], WIDTH / 2, collageTop + availH / 2, cardW, cardH, (-1.8 * Math.PI) / 180);
  }

  // 6. Bottom deep teal footer band
  const footerY = HEIGHT - footerH;
  ctx.fillStyle = '#2E6B6B';
  ctx.fillRect(0, footerY, WIDTH, footerH);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '800 34px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.fillText(options.domainLabel || 'KinderESL.com', marginX, footerY + 68);

  const ctaText = 'Download free →';
  ctx.font = '600 30px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  const ctaWidth = ctx.measureText(ctaText).width;
  ctx.fillStyle = '#E2F2F2';
  ctx.fillText(ctaText, WIDTH - marginX - ctaWidth, footerY + 68);

  const blob = await canvasToBlob(canvas, 'image/jpeg', 0.88);
  const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
  return { blob, dataUrl };
}
