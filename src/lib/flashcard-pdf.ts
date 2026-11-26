import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFImage } from 'pdf-lib';
import {
  fetchClipartBytesCached,
  formatClipartLabel,
  getClipart,
  getClipartByThemeOrTag,
  listCvcClipart,
  type ClipartItem,
} from '@/lib/clipart';
import {
  PDF_PALETTE,
  drawHandwritingGuideLinesPdf,
  drawStartDotPdf,
  drawStrokeCommandsPdf,
  getPaperLabel,
  getSheetSize,
  toWinAnsiSafe,
  type PaperSizeOption,
} from '@/lib/pdf-stroke-utils';
import { layoutNameStrokes } from '@/lib/tracing-strokes';

export type FlashcardGridSize = '2x2' | '2x3' | '3x3';
export type FlashcardLabelMode = 'picture-word' | 'picture-only' | 'picture-trace';

export interface FlashcardEntry {
  id: string;
  label: string;
  clipartId?: string;
  customImageDataUrl?: string;
  customWidth?: number;
  customHeight?: number;
}

export interface FlashcardConfig {
  title: string;
  entries: FlashcardEntry[];
  gridSize: FlashcardGridSize;
  labelMode: FlashcardLabelMode;
  paperSize: PaperSizeOption;
  showCutLines: boolean;
  includeWordDeck: boolean;
}

export interface FlashcardPreset {
  id: string;
  label: string;
  title: string;
  clipartIds: string[];
}

function idsFromThemeOrTag(key: string, limit = 12): string[] {
  return getClipartByThemeOrTag(key)
    .slice(0, limit)
    .map((item) => item.id);
}

export const FLASHCARD_PRESETS: FlashcardPreset[] = [
  {
    id: 'farm',
    label: 'Farm Animals',
    title: 'Farm Animals ESL Flashcards',
    clipartIds: idsFromThemeOrTag('farm', 9),
  },
  {
    id: 'winter',
    label: 'Winter Words',
    title: 'Winter Vocabulary ESL Flashcards',
    clipartIds: idsFromThemeOrTag('winter', 12),
  },
  {
    id: 'classroom',
    label: 'Classroom',
    title: 'Classroom Objects ESL Flashcards',
    clipartIds: idsFromThemeOrTag('classroom', 12),
  },
  {
    id: 'animals',
    label: 'Animals & Bugs',
    title: 'Animals & Bugs ESL Flashcards',
    clipartIds: idsFromThemeOrTag('animals', 10),
  },
  {
    id: 'food',
    label: 'Food & Snacks',
    title: 'Food & Drinks ESL Flashcards',
    clipartIds: idsFromThemeOrTag('food', 11),
  },
  {
    id: 'routines',
    label: 'Routines & Actions',
    title: 'Classroom Routines & Action Flashcards',
    clipartIds: idsFromThemeOrTag('routines', 12),
  },
  {
    id: 'christmas',
    label: 'Christmas',
    title: 'Christmas Vocabulary Flashcards',
    clipartIds: idsFromThemeOrTag('christmas', 9),
  },
  {
    id: 'body',
    label: 'Body Parts',
    title: 'Body Parts ESL Flashcards',
    clipartIds: idsFromThemeOrTag('body', 9),
  },
  {
    id: 'feelings',
    label: 'Feelings',
    title: 'Emotions & Feelings Flashcards',
    clipartIds: idsFromThemeOrTag('feelings', 9),
  },
  {
    id: 'helpers',
    label: 'Community Helpers',
    title: 'Community Helpers ESL Flashcards',
    clipartIds: idsFromThemeOrTag('helpers', 9),
  },
  {
    id: 'fall',
    label: 'Fall & Autumn',
    title: 'Fall & Autumn ESL Flashcards',
    clipartIds: idsFromThemeOrTag('fall', 8),
  },
  {
    id: 'halloween',
    label: 'Halloween',
    title: 'Halloween ESL Flashcards',
    clipartIds: idsFromThemeOrTag('halloween', 8),
  },
  {
    id: 'spring',
    label: 'Spring',
    title: 'Spring Season ESL Flashcards',
    clipartIds: idsFromThemeOrTag('spring', 8),
  },
  {
    id: 'valentines',
    label: "Valentine's Day",
    title: "Valentine's Day ESL Flashcards",
    clipartIds: Array.from(new Set(['heart', ...idsFromThemeOrTag('valentines', 8)])).slice(0, 8),
  },
  {
    id: 'summer',
    label: 'Summer',
    title: 'Summer Fun ESL Flashcards',
    clipartIds: idsFromThemeOrTag('summer', 8),
  },
  {
    id: 'weather',
    label: 'Weather',
    title: 'Weather & Sky ESL Flashcards',
    clipartIds: idsFromThemeOrTag('weather', 8),
  },
  {
    id: 'transport',
    label: 'Transportation',
    title: 'Transportation & Vehicles Flashcards',
    clipartIds: idsFromThemeOrTag('transport', 8),
  },
  {
    id: 'clothes',
    label: 'Clothes',
    title: 'Clothes & Dressing ESL Flashcards',
    clipartIds: idsFromThemeOrTag('clothes', 8),
  },
  {
    id: 'nature',
    label: 'Nature',
    title: 'Nature & Outdoors ESL Flashcards',
    clipartIds: idsFromThemeOrTag('nature', 8),
  },
  {
    id: 'cvc',
    label: 'CVC Phonics (12)',
    title: 'CVC Phonics Picture Flashcards',
    clipartIds: listCvcClipart()
      .slice(0, 12)
      .map((item) => item.id),
  },
];

export function buildEntriesFromClipartIds(clipartIds: string[]): FlashcardEntry[] {
  const entries: FlashcardEntry[] = [];
  for (const id of clipartIds) {
    const item = getClipart(id);
    if (!item) continue;
    entries.push({
      id: `clip-${item.id}`,
      clipartId: item.id,
      label: formatClipartLabel(item),
    });
  }
  return entries;
}

export function getFlashcardGridSpec(gridSize: FlashcardGridSize): {
  cols: number;
  rows: number;
  perPage: number;
} {
  if (gridSize === '2x2') return { cols: 2, rows: 2, perPage: 4 };
  if (gridSize === '2x3') return { cols: 2, rows: 3, perPage: 6 };
  return { cols: 3, rows: 3, perPage: 9 };
}

function fitTextSingleLine(
  raw: string,
  font: PDFFont,
  maxWidth: number,
  maxFontSize: number,
  minFontSize = 9
): { text: string; size: number } {
  const text = toWinAnsiSafe(raw) || raw;
  for (let s = maxFontSize; s >= minFontSize; s -= 1) {
    if (font.widthOfTextAtSize(text, s) <= maxWidth) {
      return { text, size: s };
    }
  }
  return { text, size: minFontSize };
}

function decodeDataUrl(dataUrl: string): { mime: string; bytes: Uint8Array } | null {
  const match = dataUrl.match(/^data:(image\/[a-zA-Z0-9+.-]+);base64,(.+)$/);
  if (!match) return null;
  const mime = match[1].toLowerCase();
  const b64 = match[2];
  if (typeof Buffer !== 'undefined') {
    return { mime, bytes: new Uint8Array(Buffer.from(b64, 'base64')) };
  }
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return { mime, bytes: out };
}

export function getFlashcardSheetGeometry(
  paperSize: PaperSizeOption,
  gridSize: FlashcardGridSize
) {
  const { width: pageW, height: pageH } = getSheetSize(paperSize, 'portrait');
  const { cols, rows, perPage } = getFlashcardGridSpec(gridSize);
  const marginX = 36;
  const topHeaderY = 38;
  const gridTop = 70;
  const bottomFooterY = pageH - 28;
  const gap = gridSize === '3x3' ? 12 : 16;

  const usableW = pageW - marginX * 2;
  const usableH = bottomFooterY - 14 - gridTop;

  const cardW = (usableW - gap * (cols - 1)) / cols;
  const cardH = (usableH - gap * (rows - 1)) / rows;

  return {
    pageW,
    pageH,
    cols,
    rows,
    perPage,
    marginX,
    topHeaderY,
    gridTop,
    bottomFooterY,
    gap,
    usableW,
    usableH,
    cardW,
    cardH,
  };
}

export async function generateFlashcardPdf(
  config: FlashcardConfig,
  options: {
    loadClipartBytes?: (item: ClipartItem) => Promise<Uint8Array>;
  } = {}
): Promise<Uint8Array> {
  const loadClipart = options.loadClipartBytes ?? ((item) => fetchClipartBytesCached(item));
  const entries = (
    config.entries.length > 0
      ? config.entries
      : buildEntriesFromClipartIds(FLASHCARD_PRESETS[0].clipartIds)
  ).slice(0, 36);

  const doc = await PDFDocument.create();
  doc.setTitle(`${toWinAnsiSafe(config.title || 'ESL Picture Flashcards')} - KinderESL`);
  doc.setAuthor('KinderESL Educational Resources');
  doc.setCreator('KinderESL Picture Flashcard Maker');

  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await doc.embedFont(StandardFonts.Helvetica);

  // Pre-embed unique clipart images once
  const clipartImageMap = new Map<string, PDFImage>();
  const uniqueClipartIds = Array.from(
    new Set(entries.map((e) => e.clipartId).filter((v): v is string => Boolean(v)))
  );
  await Promise.all(
    uniqueClipartIds.map(async (id) => {
      const item = getClipart(id);
      if (!item) return;
      const bytes = await loadClipart(item);
      const img = await doc.embedPng(bytes);
      clipartImageMap.set(id, img);
    })
  );

  // Embed any custom uploaded images
  const customImageMap = new Map<string, PDFImage>();
  for (const entry of entries) {
    if (!entry.clipartId && entry.customImageDataUrl) {
      const decoded = decodeDataUrl(entry.customImageDataUrl);
      if (!decoded) continue;
      const img = decoded.mime.includes('png')
        ? await doc.embedPng(decoded.bytes)
        : await doc.embedJpg(decoded.bytes);
      customImageMap.set(entry.id, img);
    }
  }

  const geom = getFlashcardSheetGeometry(config.paperSize, config.gridSize);
  const {
    pageW,
    pageH,
    cols,
    rows,
    perPage,
    marginX,
    topHeaderY,
    gridTop,
    bottomFooterY,
    gap,
    cardW,
    cardH,
  } = geom;
  const toY = (yTop: number) => pageH - yTop;
  const paperLabel = getPaperLabel(config.paperSize);
  const safeTitle = toWinAnsiSafe(config.title) || 'ESL Picture Flashcards';

  const drawSheetChrome = (page: ReturnType<typeof doc.addPage>, heading: string) => {
    page.drawText(heading, {
      x: marginX,
      y: toY(topHeaderY),
      size: 16,
      font: fontBold,
      color: PDF_PALETTE.inkDark,
    });
    const rightTag = `${paperLabel}  |  KinderESL.com`;
    const tagW = fontRegular.widthOfTextAtSize(rightTag, 8.5);
    page.drawText(rightTag, {
      x: pageW - marginX - tagW,
      y: toY(topHeaderY - 1),
      size: 8.5,
      font: fontRegular,
      color: PDF_PALETTE.inkMuted,
    });
    page.drawLine({
      start: { x: marginX, y: toY(topHeaderY + 15) },
      end: { x: pageW - marginX, y: toY(topHeaderY + 15) },
      thickness: 1.3,
      color: PDF_PALETTE.teal,
    });

    const footerText =
      'Free for non-commercial classroom & home use  |  Cut along dashed lines  |  KinderESL.com';
    const fw = fontRegular.widthOfTextAtSize(footerText, 8);
    page.drawText(footerText, {
      x: (pageW - fw) / 2,
      y: toY(bottomFooterY + 4),
      size: 8,
      font: fontRegular,
      color: PDF_PALETTE.inkMuted,
    });
  };

  const drawCutGuides = (page: ReturnType<typeof doc.addPage>) => {
    if (!config.showCutLines) return;
    for (let c = 1; c < cols; c++) {
      const cx = marginX + c * cardW + (c - 0.5) * gap;
      page.drawLine({
        start: { x: cx, y: toY(gridTop - 4) },
        end: { x: cx, y: toY(gridTop + rows * cardH + (rows - 1) * gap + 4) },
        thickness: 0.75,
        dashArray: [4, 4],
        color: rgb(0.65, 0.73, 0.76),
      });
    }
    for (let r = 1; r < rows; r++) {
      const ry = gridTop + r * cardH + (r - 0.5) * gap;
      page.drawLine({
        start: { x: marginX - 4, y: toY(ry) },
        end: { x: pageW - marginX + 4, y: toY(ry) },
        thickness: 0.75,
        dashArray: [4, 4],
        color: rgb(0.65, 0.73, 0.76),
      });
    }
  };

  // Picture flashcard pages
  const totalCardPages = Math.ceil(entries.length / perPage);
  for (let p = 0; p < totalCardPages; p++) {
    const page = doc.addPage([pageW, pageH]);
    const pageEntries = entries.slice(p * perPage, (p + 1) * perPage);
    const pageHeading =
      totalCardPages > 1 ? `${safeTitle} (${p + 1}/${totalCardPages})` : safeTitle;
    drawSheetChrome(page, pageHeading);

    pageEntries.forEach((entry, idx) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const cardX = marginX + col * (cardW + gap);
      const cardY = gridTop + row * (cardH + gap);

      // Card frame
      page.drawRectangle({
        x: cardX,
        y: toY(cardY + cardH),
        width: cardW,
        height: cardH,
        color: PDF_PALETTE.white,
        borderColor: PDF_PALETTE.teal,
        borderWidth: 1.6,
      });

      // Subtle inner accent bar at top of card (inset inside border)
      page.drawRectangle({
        x: cardX + 1.5,
        y: toY(cardY + 7.5),
        width: cardW - 3,
        height: 6,
        color: PDF_PALETTE.tealSoft,
      });

      const img =
        (entry.clipartId ? clipartImageMap.get(entry.clipartId) : undefined) ??
        customImageMap.get(entry.id);

      const pad = config.gridSize === '3x3' ? 10 : 14;
      const labelBandH =
        config.labelMode === 'picture-only'
          ? 8
          : config.labelMode === 'picture-trace'
          ? Math.max(48, cardH * 0.31)
          : Math.max(30, cardH * 0.22);

      const imgAreaX = cardX + pad;
      const imgAreaY = cardY + pad + 4;
      const imgAreaW = cardW - pad * 2;
      const imgAreaH = cardH - pad * 2 - labelBandH;

      if (img && imgAreaW > 10 && imgAreaH > 10) {
        const scale = Math.min(imgAreaW / img.width, imgAreaH / img.height);
        const drawW = img.width * scale;
        const drawH = img.height * scale;
        const drawX = imgAreaX + (imgAreaW - drawW) / 2;
        const drawYTop = imgAreaY + (imgAreaH - drawH) / 2;
        page.drawImage(img, {
          x: drawX,
          y: toY(drawYTop + drawH),
          width: drawW,
          height: drawH,
        });
      }

      if (config.labelMode === 'picture-word') {
        const divY = cardY + cardH - labelBandH;
        page.drawLine({
          start: { x: cardX + 10, y: toY(divY) },
          end: { x: cardX + cardW - 10, y: toY(divY) },
          thickness: 0.75,
          color: PDF_PALETTE.tealBorder,
        });

        const maxFont =
          config.gridSize === '2x2' ? 22 : config.gridSize === '2x3' ? 18 : 15;
        const { text, size } = fitTextSingleLine(
          entry.label,
          fontBold,
          cardW - 20,
          maxFont,
          9
        );
        const tw = fontBold.widthOfTextAtSize(text, size);
        page.drawText(text, {
          x: cardX + (cardW - tw) / 2,
          y: toY(divY + labelBandH * 0.64),
          size,
          font: fontBold,
          color: PDF_PALETTE.inkDark,
        });
      } else if (config.labelMode === 'picture-trace') {
        const tracePadX = 12;
        const bottomRoom = 15;
        const traceH = Math.min(34, labelBandH - bottomRoom - 4);
        const traceY = cardY + cardH - traceH - bottomRoom;
        const traceW = cardW - tracePadX * 2;

        drawHandwritingGuideLinesPdf(page, pageH, {
          x: cardX + tracePadX,
          y: traceY,
          width: traceW,
          height: traceH,
        });

        const strokeLayout = layoutNameStrokes(toWinAnsiSafe(entry.label) || entry.label, {
          boxX: cardX + tracePadX + 4,
          boxY: traceY,
          boxWidth: traceW - 8,
          rowHeight: traceH,
          align: 'center',
        });

        const sw = Math.max(1.1, Math.min(1.8, strokeLayout.scale * 0.04));
        const dotR = Math.max(1.5, Math.min(2.3, strokeLayout.scale * 0.048));
        for (const s of strokeLayout.strokes) {
          drawStrokeCommandsPdf(page, pageH, s.commands, {
            lineWidth: sw,
            color: PDF_PALETTE.traceDark,
            dashed: true,
          });
          if (s.startDot) {
            drawStartDotPdf(page, pageH, s.startDot[0], s.startDot[1], dotR);
          }
        }
      }
    });

    drawCutGuides(page);
  }

  // Optional matching word-only deck pages
  if (config.includeWordDeck) {
    const totalWordPages = Math.ceil(entries.length / perPage);
    for (let p = 0; p < totalWordPages; p++) {
      const page = doc.addPage([pageW, pageH]);
      const pageEntries = entries.slice(p * perPage, (p + 1) * perPage);
      const heading =
        totalWordPages > 1
          ? `${safeTitle} — Matching Word Cards (${p + 1}/${totalWordPages})`
          : `${safeTitle} — Matching Word Cards`;
      drawSheetChrome(page, heading);

      pageEntries.forEach((entry, idx) => {
        const col = idx % cols;
        const row = Math.floor(idx / cols);
        const cardX = marginX + col * (cardW + gap);
        const cardY = gridTop + row * (cardH + gap);

        page.drawRectangle({
          x: cardX,
          y: toY(cardY + cardH),
          width: cardW,
          height: cardH,
          color: PDF_PALETTE.tealSoft,
          borderColor: PDF_PALETTE.teal,
          borderWidth: 1.6,
        });

        const maxFont =
          config.gridSize === '2x2' ? 30 : config.gridSize === '2x3' ? 24 : 20;
        const { text, size } = fitTextSingleLine(
          entry.label,
          fontBold,
          cardW - 24,
          maxFont,
          10
        );
        const tw = fontBold.widthOfTextAtSize(text, size);
        page.drawText(text, {
          x: cardX + (cardW - tw) / 2,
          y: toY(cardY + cardH / 2 + size * 0.32),
          size,
          font: fontBold,
          color: PDF_PALETTE.inkDark,
        });
      });

      drawCutGuides(page);
    }
  }

  return doc.save();
}
