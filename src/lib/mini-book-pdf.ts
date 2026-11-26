import { PDFDocument, StandardFonts, degrees, rgb, type PDFImage, type PDFPage } from 'pdf-lib';
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

export type MiniBookFormat = 'half-page' | 'one-sheet-zine';
export type MiniBookCaptionMode = 'i-see' | 'this-is' | 'word-only' | 'trace-word';

export interface MiniBookPreset {
  id: string;
  label: string;
  title: string;
  clipartIds: string[];
}

export interface MiniBookConfig {
  title: string;
  clipartIds: string[];
  format: MiniBookFormat;
  captionMode: MiniBookCaptionMode;
  paperSize: PaperSizeOption;
  showFoldGuides: boolean;
}

function idsFromTheme(key: string, limit = 6): string[] {
  return getClipartByThemeOrTag(key)
    .slice(0, limit)
    .map((i) => i.id);
}

export const MINI_BOOK_PRESETS: MiniBookPreset[] = [
  {
    id: 'farm',
    label: 'Farm Animals (6)',
    title: 'Farm Animals Book',
    clipartIds: idsFromTheme('farm', 6),
  },
  {
    id: 'winter',
    label: 'Winter (6)',
    title: 'Winter Book',
    clipartIds: getClipartByThemeOrTag('winter')
      .filter((i) => i.theme === 'winter')
      .slice(0, 6)
      .map((i) => i.id),
  },
  {
    id: 'halloween',
    label: 'Halloween (6)',
    title: 'Halloween Book',
    clipartIds: idsFromTheme('halloween', 6),
  },
  {
    id: 'fall',
    label: 'Fall (6)',
    title: 'Fall Leaves & Harvest Book',
    clipartIds: idsFromTheme('fall', 6),
  },
  {
    id: 'christmas',
    label: 'Christmas (6)',
    title: 'Christmas Book',
    clipartIds: idsFromTheme('christmas', 6),
  },
  {
    id: 'spring',
    label: 'Spring (6)',
    title: 'Spring Garden Book',
    clipartIds: idsFromTheme('spring', 6),
  },
  {
    id: 'valentines',
    label: "Valentine's (6)",
    title: "Valentine's Book",
    clipartIds: idsFromTheme('valentines', 6),
  },
  {
    id: 'summer',
    label: 'Summer (6)',
    title: 'Summer Beach Book',
    clipartIds: idsFromTheme('summer', 6),
  },
  {
    id: 'animals',
    label: 'Animals (6)',
    title: 'Animals Book',
    clipartIds: idsFromTheme('animals', 6),
  },
  {
    id: 'food',
    label: 'Food (6)',
    title: 'Healthy Food Book',
    clipartIds: idsFromTheme('food', 6),
  },
  {
    id: 'classroom',
    label: 'Classroom (6)',
    title: 'My Classroom Book',
    clipartIds: idsFromTheme('classroom', 6),
  },
  {
    id: 'weather',
    label: 'Weather (6)',
    title: 'Weather Book',
    clipartIds: idsFromTheme('weather', 6),
  },
  {
    id: 'transport',
    label: 'Transport (6)',
    title: 'Things That Go Book',
    clipartIds: idsFromTheme('transport', 6),
  },
  {
    id: 'clothes',
    label: 'Clothes (6)',
    title: 'Clothes Book',
    clipartIds: idsFromTheme('clothes', 6),
  },
  {
    id: 'nature',
    label: 'Nature (6)',
    title: 'Outdoor Nature Book',
    clipartIds: idsFromTheme('nature', 6),
  },
  {
    id: 'body',
    label: 'Body Parts (6)',
    title: 'My Body Book',
    clipartIds: idsFromTheme('body', 6),
  },
  {
    id: 'feelings',
    label: 'Feelings (6)',
    title: 'My Feelings Book',
    clipartIds: idsFromTheme('feelings', 6),
  },
  {
    id: 'helpers',
    label: 'Helpers (6)',
    title: 'Community Helpers Book',
    clipartIds: idsFromTheme('helpers', 6),
  },
  {
    id: 'routines',
    label: 'Routines (6)',
    title: 'Daily Routines Book',
    clipartIds: idsFromTheme('routines', 6),
  },
  {
    id: 'cvc',
    label: 'CVC Words (6)',
    title: 'CVC Reading Book',
    clipartIds: listCvcClipart()
      .slice(0, 6)
      .map((i) => i.id),
  },
];

const VOWEL_ARTICLE_EXCEPTIONS = new Set(['umbrella', 'unicorn']);

export function formatMiniBookSentence(wordRaw: string, mode: MiniBookCaptionMode): string {
  const clean = toWinAnsiSafe(wordRaw);
  const lower = clean.toLowerCase();
  if (mode === 'word-only' || mode === 'trace-word') {
    return clean;
  }

  const startsWithVowel = /^[aeiou]/i.test(lower) && lower !== 'unicorn';
  const article = VOWEL_ARTICLE_EXCEPTIONS.has(lower)
    ? lower === 'umbrella'
      ? 'an'
      : 'a'
    : startsWithVowel
    ? 'an'
    : 'a';

  if (mode === 'this-is') {
    return `This is ${article} ${lower}.`;
  }
  return `I see ${article} ${lower}.`;
}

function fitFontSize(
  text: string,
  font: { widthOfTextAtSize: (t: string, s: number) => number },
  maxWidth: number,
  maxSize: number,
  minSize = 8
): { text: string; size: number } {
  const clean = toWinAnsiSafe(text);
  let size = maxSize;
  while (size > minSize && font.widthOfTextAtSize(clean, size) > maxWidth) {
    size -= 0.5;
  }
  return { text: clean, size };
}

function normalizeBookTitle(raw: string): string {
  const clean = toWinAnsiSafe(raw) || 'Mini Book';
  return /^my\s+/i.test(clean) ? clean : `My ${clean}`;
}

export async function generateMiniBookPdf(
  config: MiniBookConfig,
  options: {
    loadClipartBytes?: (item: ClipartItem) => Promise<Uint8Array>;
  } = {}
): Promise<Uint8Array> {
  const loadClipart =
    options.loadClipartBytes ?? ((item) => fetchClipartBytesCached(item));

  const uniqueIds = Array.from(new Set(config.clipartIds)).filter((id) =>
    Boolean(getClipart(id))
  );
  const effectiveIds = (
    uniqueIds.length >= 4
      ? uniqueIds
      : Array.from(new Set([...uniqueIds, ...MINI_BOOK_PRESETS[0].clipartIds]))
  ).slice(0, config.format === 'one-sheet-zine' ? 6 : 7);

  // Pad zine to 6 story panels cleanly if somehow < 6
  while (config.format === 'one-sheet-zine' && effectiveIds.length < 6) {
    effectiveIds.push(effectiveIds[effectiveIds.length % effectiveIds.length]);
  }

  const doc = await PDFDocument.create();
  doc.setTitle(`${toWinAnsiSafe(config.title || 'Printable Mini-Book')} - KinderESL`);
  doc.setAuthor('KinderESL Educational Resources');
  doc.setCreator('KinderESL Foldable Mini-Book Maker');

  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await doc.embedFont(StandardFonts.Helvetica);

  const imageMap = new Map<string, PDFImage>();
  await Promise.all(
    Array.from(new Set(effectiveIds)).map(async (id) => {
      const item = getClipart(id);
      if (!item) return;
      const bytes = await loadClipart(item);
      const img = await doc.embedPng(bytes);
      imageMap.set(id, img);
    })
  );

  const { width: pageW, height: pageH } = getSheetSize(config.paperSize, 'landscape');
  const toY = (yTop: number) => pageH - yTop;
  const bookTitle = normalizeBookTitle(config.title);
  const paperLabel = getPaperLabel(config.paperSize);

  if (config.format === 'half-page') {
    type PanelSpec =
      | { kind: 'cover'; clipartId: string }
      | { kind: 'story'; pageNum: number; clipartId: string }
      | { kind: 'back' };

    const panels: PanelSpec[] = [
      { kind: 'cover', clipartId: effectiveIds[0] },
      ...effectiveIds.map((id, idx) => ({
        kind: 'story' as const,
        pageNum: idx + 1,
        clipartId: id,
      })),
      { kind: 'back' },
    ];
    if (panels.length % 2 === 1) {
      // Ensure cover + back remain cleanly paired by repeating cover panel only never—instead keep odd 5/7 story pages → even total!
      // Wait: 1 cover + 7 story + 1 back = 9 → slice story to 6 or pad. Let's make back extra blank writing page if odd.
      panels.splice(panels.length - 1, 0, {
        kind: 'story',
        pageNum: effectiveIds.length + 1,
        clipartId: effectiveIds[0],
      });
    }

    const halfW = pageW / 2;
    const drawHalfPanel = (page: PDFPage, slotX: number, panel: PanelSpec) => {
      const pad = 26;
      const fx = slotX + pad;
      const fy = 26;
      const fw = halfW - pad * 2;
      const fh = pageH - 52;

      page.drawRectangle({
        x: fx,
        y: toY(fy + fh),
        width: fw,
        height: fh,
        color: PDF_PALETTE.white,
        borderColor: PDF_PALETTE.teal,
        borderWidth: 1.6,
      });

      // Staple marks along left inside edge
      if (config.showFoldGuides) {
        for (const frac of [0.22, 0.5, 0.78]) {
          const sy = fy + fh * frac;
          page.drawLine({
            start: { x: fx + 6, y: toY(sy - 8) },
            end: { x: fx + 6, y: toY(sy + 8) },
            thickness: 1.3,
            color: PDF_PALETTE.lineSolid,
          });
        }
      }

      if (panel.kind === 'cover') {
        page.drawRectangle({
          x: fx + 1.5,
          y: toY(fy + 58),
          width: fw - 3,
          height: 56,
          color: PDF_PALETTE.tealSoft,
        });
        const { text: tText, size: tSize } = fitFontSize(bookTitle, fontBold, fw - 32, 22, 13);
        const tw = fontBold.widthOfTextAtSize(tText, tSize);
        page.drawText(tText, {
          x: fx + (fw - tw) / 2,
          y: toY(fy + 38),
          size: tSize,
          font: fontBold,
          color: PDF_PALETTE.inkDark,
        });

        const img = imageMap.get(panel.clipartId);
        if (img) {
          const avail = Math.min(fw - 70, fh - 190);
          const sc = Math.min(avail / img.width, avail / img.height);
          const dw = img.width * sc;
          const dh = img.height * sc;
          page.drawImage(img, {
            x: fx + (fw - dw) / 2,
            y: toY(fy + 78 + (avail - dh) / 2 + dh),
            width: dw,
            height: dh,
          });
        }

        const nameLine = 'Name: ___________________________';
        const nw = fontBold.widthOfTextAtSize(nameLine, 12);
        page.drawText(nameLine, {
          x: fx + (fw - nw) / 2,
          y: toY(fy + fh - 44),
          size: 12,
          font: fontBold,
          color: PDF_PALETTE.inkDark,
        });

        const foot = `${paperLabel}  |  Color & Read Mini-Book  |  KinderESL.com`;
        const fwTxt = fontRegular.widthOfTextAtSize(foot, 8);
        page.drawText(foot, {
          x: fx + (fw - fwTxt) / 2,
          y: toY(fy + fh - 16),
          size: 8,
          font: fontRegular,
          color: PDF_PALETTE.inkMuted,
        });
        return;
      }

      if (panel.kind === 'back') {
        const endStr = 'The End!';
        const ew = fontBold.widthOfTextAtSize(endStr, 26);
        page.drawText(endStr, {
          x: fx + (fw - ew) / 2,
          y: toY(fy + 115),
          size: 26,
          font: fontBold,
          color: PDF_PALETTE.teal,
        });

        const sub = 'Great reading! Read your mini-book 3 times:';
        const sw = fontRegular.widthOfTextAtSize(sub, 12);
        page.drawText(sub, {
          x: fx + (fw - sw) / 2,
          y: toY(fy + 170),
          size: 12,
          font: fontRegular,
          color: PDF_PALETTE.inkDark,
        });

        // 3 check circles to color after each read
        const centerXs = [fx + fw / 2 - 70, fx + fw / 2, fx + fw / 2 + 70];
        centerXs.forEach((cx, idx) => {
          page.drawCircle({
            x: cx,
            y: toY(fy + 250),
            size: 24,
            color: PDF_PALETTE.white,
            borderColor: PDF_PALETTE.teal,
            borderWidth: 1.6,
          });
          const lbl = `${idx + 1}x`;
          const lw = fontBold.widthOfTextAtSize(lbl, 13);
          page.drawText(lbl, {
            x: cx - lw / 2,
            y: toY(fy + 254),
            size: 13,
            font: fontBold,
            color: PDF_PALETTE.teal,
          });
        });

        const foot = 'Free preschool & ESL printables at KinderESL.com';
        const ftW = fontRegular.widthOfTextAtSize(foot, 8.5);
        page.drawText(foot, {
          x: fx + (fw - ftW) / 2,
          y: toY(fy + fh - 22),
          size: 8.5,
          font: fontRegular,
          color: PDF_PALETTE.inkMuted,
        });
        return;
      }

      // Story page
      const item = getClipart(panel.clipartId);
      const wordLabel = item ? formatClipartLabel(item) : '';
      const img = imageMap.get(panel.clipartId);
      const bottomBandH = config.captionMode === 'trace-word' ? 112 : 84;
      const imgBoxH = fh - bottomBandH - 42;
      const imgBoxW = fw - 56;

      if (img) {
        const sc = Math.min(imgBoxW / img.width, imgBoxH / img.height);
        const dw = img.width * sc;
        const dh = img.height * sc;
        page.drawImage(img, {
          x: fx + (fw - dw) / 2,
          y: toY(fy + 22 + (imgBoxH - dh) / 2 + dh),
          width: dw,
          height: dh,
        });
      }

      if (config.captionMode === 'trace-word') {
        const traceBoxX = fx + 28;
        const traceBoxW = fw - 56;
        const traceBoxH = 54;
        const traceBoxY = fy + fh - bottomBandH + 14;

        drawHandwritingGuideLinesPdf(page, pageH, {
          x: traceBoxX,
          y: traceBoxY,
          width: traceBoxW,
          height: traceBoxH,
        });

        const layout = layoutNameStrokes(wordLabel, {
          boxX: traceBoxX + 6,
          boxY: traceBoxY,
          boxWidth: traceBoxW - 12,
          rowHeight: traceBoxH,
          align: 'center',
        });
        const sw = Math.max(1.5, Math.min(2.3, layout.scale * 0.04));
        const dotR = Math.max(1.9, Math.min(2.9, layout.scale * 0.05));
        for (const s of layout.strokes) {
          drawStrokeCommandsPdf(page, pageH, s.commands, {
            lineWidth: sw,
            color: PDF_PALETTE.traceDark,
            dashed: true,
          });
          if (s.startDot) {
            drawStartDotPdf(page, pageH, s.startDot[0], s.startDot[1], dotR);
          }
        }
      } else {
        const caption = formatMiniBookSentence(wordLabel, config.captionMode);
        const { text: cText, size: cSize } = fitFontSize(caption, fontBold, fw - 36, 22, 12);
        const cw = fontBold.widthOfTextAtSize(cText, cSize);
        page.drawText(cText, {
          x: fx + (fw - cw) / 2,
          y: toY(fy + fh - 46),
          size: cSize,
          font: fontBold,
          color: PDF_PALETTE.inkDark,
        });
      }

      // Page number badge at bottom-right
      const pNum = String(panel.pageNum);
      const pwNum = fontBold.widthOfTextAtSize(pNum, 10);
      page.drawText(pNum, {
        x: fx + fw - 18 - pwNum,
        y: toY(fy + fh - 14),
        size: 10,
        font: fontBold,
        color: PDF_PALETTE.inkMuted,
      });
    };

    for (let i = 0; i < panels.length; i += 2) {
      const page = doc.addPage([pageW, pageH]);
      drawHalfPanel(page, 0, panels[i]);
      if (panels[i + 1]) {
        drawHalfPanel(page, halfW, panels[i + 1]);
      }

      if (config.showFoldGuides) {
        page.drawLine({
          start: { x: halfW, y: 12 },
          end: { x: halfW, y: pageH - 12 },
          thickness: 0.9,
          dashArray: [5, 4],
          color: PDF_PALETTE.lineSolid,
        });
      }
    }
  } else {
    // One-sheet 8-panel foldable zine (2 rows x 4 cols on Landscape)
    const page = doc.addPage([pageW, pageH]);
    const pw = pageW / 4;
    const ph = pageH / 2;

    const drawZinePanel = (
      col: number,
      rowFromTop: number,
      rotated: boolean,
      drawFn: (helpers: {
        box: (lx: number, ly: number, lw: number, lh: number) => {
          x: number;
          y: number;
          width: number;
          height: number;
        };
        drawTextCentered: (text: string, centerX: number, topY: number, size: number, bold: boolean, color: ReturnType<typeof rgb>) => void;
        drawImageCentered: (img: PDFImage, boxX: number, boxY: number, boxW: number, boxH: number) => void;
      }) => void
    ) => {
      const px = col * pw;
      const pyTop = rowFromTop * ph;

      const mapBox = (lx: number, lyTop: number, lw: number, lh: number) => {
        if (!rotated) {
          return {
            x: px + lx,
            y: toY(pyTop + lyTop + lh),
            width: lw,
            height: lh,
          };
        }
        return {
          x: px + (pw - lx - lw),
          y: toY(pyTop + (ph - lyTop - lh) + lh),
          width: lw,
          height: lh,
        };
      };

      const drawTextCentered = (
        text: string,
        lxCenter: number,
        lyTop: number,
        size: number,
        bold: boolean,
        color: ReturnType<typeof rgb>
      ) => {
        const font = bold ? fontBold : fontRegular;
        const safe = toWinAnsiSafe(text);
        const tw = font.widthOfTextAtSize(safe, size);
        if (!rotated) {
          page.drawText(safe, {
            x: px + lxCenter - tw / 2,
            y: toY(pyTop + lyTop),
            size,
            font,
            color,
          });
        } else {
          page.drawText(safe, {
            x: px + pw - lxCenter + tw / 2,
            y: toY(pyTop + ph - lyTop),
            size,
            font,
            color,
            rotate: degrees(180),
          });
        }
      };

      const drawImageCentered = (
        img: PDFImage,
        boxX: number,
        boxYTop: number,
        boxW: number,
        boxH: number
      ) => {
        const sc = Math.min(boxW / img.width, boxH / img.height);
        const dw = img.width * sc;
        const dh = img.height * sc;
        const lx = boxX + (boxW - dw) / 2;
        const lyTop = boxYTop + (boxH - dh) / 2;

        if (!rotated) {
          page.drawImage(img, {
            x: px + lx,
            y: toY(pyTop + lyTop + dh),
            width: dw,
            height: dh,
          });
        } else {
          // Bottom-left in rotated frame sits at (px + pw - lx, pageH - (pyTop + ph - lyTop))
          // Wait: in pdf-lib drawImage rotates counter-clockwise around its origin (x, y)!
          // Rotating width dw, height dh by 180 deg around (x, y) shifts drawn rect to [x - dw, x] x [y - dh, y].
          const targetRightX = px + (pw - lx);
          const targetHighestY = toY(pyTop + (ph - lyTop - dh));
          page.drawImage(img, {
            x: targetRightX,
            y: targetHighestY,
            width: dw,
            height: dh,
            rotate: degrees(180),
          });
        }
      };

      // Panel inner frame
      const frame = mapBox(12, 12, pw - 24, ph - 24);
      page.drawRectangle({
        x: frame.x,
        y: frame.y,
        width: frame.width,
        height: frame.height,
        color: PDF_PALETTE.white,
        borderColor: PDF_PALETTE.teal,
        borderWidth: 1.2,
      });

      drawFn({ box: mapBox, drawTextCentered, drawImageCentered });
    };

    const renderStoryZinePanel = (
      col: number,
      rowFromTop: number,
      rotated: boolean,
      pageNum: number,
      clipartId: string
    ) => {
      drawZinePanel(col, rowFromTop, rotated, ({ box, drawTextCentered, drawImageCentered }) => {
        const img = imageMap.get(clipartId);
        const item = getClipart(clipartId);
        const word = item ? formatClipartLabel(item) : '';

        if (img) {
          drawImageCentered(img, 24, 24, pw - 48, ph - 106);
        }

        if (config.captionMode === 'trace-word') {
          const lineBox = box(24, ph - 52, pw - 48, 2);
          page.drawRectangle({
            x: lineBox.x,
            y: lineBox.y,
            width: lineBox.width,
            height: 0.8,
            color: PDF_PALETTE.lineSolid,
          });
          const { text, size } = fitFontSize(word, fontBold, pw - 44, 18, 10);
          drawTextCentered(text, pw / 2, ph - 58, size, true, rgb(0.68, 0.74, 0.78));
        } else {
          const caption = formatMiniBookSentence(word, config.captionMode);
          const { text, size } = fitFontSize(caption, fontBold, pw - 36, 15, 9);
          drawTextCentered(text, pw / 2, ph - 56, size, true, PDF_PALETTE.inkDark);
        }

        drawTextCentered(String(pageNum), pw - 26, ph - 22, 8.5, true, PDF_PALETTE.inkMuted);
      });
    };

    // Row 0 (top, rotated 180): Pages 6, 5, 4, 3
    renderStoryZinePanel(0, 0, true, 6, effectiveIds[5]);
    renderStoryZinePanel(1, 0, true, 5, effectiveIds[4]);
    renderStoryZinePanel(2, 0, true, 4, effectiveIds[3]);
    renderStoryZinePanel(3, 0, true, 3, effectiveIds[2]);

    // Row 1 (bottom, upright): Back Cover, Front Cover, Page 1, Page 2
    drawZinePanel(0, 1, false, ({ drawTextCentered }) => {
      drawTextCentered('The End!', pw / 2, 110, 18, true, PDF_PALETTE.teal);
      drawTextCentered('I read my mini-book!', pw / 2, 146, 10, false, PDF_PALETTE.inkDark);
      drawTextCentered('kinderesl.com', pw / 2, ph - 24, 8, true, PDF_PALETTE.inkMuted);
    });

    drawZinePanel(1, 1, false, ({ box, drawTextCentered, drawImageCentered }) => {
      const banner = box(14, 14, pw - 28, 42);
      page.drawRectangle({
        x: banner.x,
        y: banner.y,
        width: banner.width,
        height: banner.height,
        color: PDF_PALETTE.tealSoft,
      });
      const { text, size } = fitFontSize(bookTitle, fontBold, pw - 36, 14, 9);
      drawTextCentered(text, pw / 2, 41, size, true, PDF_PALETTE.inkDark);

      const coverImg = imageMap.get(effectiveIds[0]);
      if (coverImg) {
        drawImageCentered(coverImg, 26, 66, pw - 52, ph - 134);
      }
      drawTextCentered('By: ___________________', pw / 2, ph - 40, 9.5, true, PDF_PALETTE.inkDark);
      drawTextCentered('Fold into 8-page book', pw / 2, ph - 21, 7.5, false, PDF_PALETTE.inkMuted);
    });

    renderStoryZinePanel(2, 1, false, 1, effectiveIds[0]);
    renderStoryZinePanel(3, 1, false, 2, effectiveIds[1]);

    // Fold lines & center cut slit
    if (config.showFoldGuides) {
      for (const col of [1, 2, 3]) {
        const x = col * pw;
        page.drawLine({
          start: { x, y: 4 },
          end: { x, y: pageH - 4 },
          thickness: 0.7,
          dashArray: [3, 4],
          color: rgb(0.75, 0.8, 0.84),
        });
      }
      // Horizontal fold on outer segments
      page.drawLine({
        start: { x: 4, y: ph },
        end: { x: pw, y: ph },
        thickness: 0.7,
        dashArray: [3, 4],
        color: rgb(0.75, 0.8, 0.84),
      });
      page.drawLine({
        start: { x: 3 * pw, y: ph },
        end: { x: pageW - 4, y: ph },
        thickness: 0.7,
        dashArray: [3, 4],
        color: rgb(0.75, 0.8, 0.84),
      });

      // Center slit cut guide (col 1..3 along middle fold)
      page.drawLine({
        start: { x: pw, y: ph },
        end: { x: 3 * pw, y: ph },
        thickness: 1.8,
        dashArray: [6, 4],
        color: PDF_PALETTE.teal,
      });
      const slitLbl = '--- CUT CENTER SLIT ONLY ---';
      const sw = fontBold.widthOfTextAtSize(slitLbl, 7.5);
      page.drawRectangle({
        x: (pageW - sw - 12) / 2,
        y: ph - 5.5,
        width: sw + 12,
        height: 11,
        color: PDF_PALETTE.white,
      });
      page.drawText(slitLbl, {
        x: (pageW - sw) / 2,
        y: ph - 2.5,
        size: 7.5,
        font: fontBold,
        color: PDF_PALETTE.teal,
      });
    }
  }

  return doc.save();
}
