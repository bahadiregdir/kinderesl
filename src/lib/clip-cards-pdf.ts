import { PDFDocument, StandardFonts, rgb, type PDFImage } from 'pdf-lib';
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
  drawStandardSheetChromePdf,
  getPaperLabel,
  getSheetSize,
  toWinAnsiSafe,
  type PaperSizeOption,
} from '@/lib/pdf-stroke-utils';

export type ClipCardGridSize = '2x2' | '2x3';
export type ClipCardLetterCase = 'upper' | 'lower' | 'mixed';

export interface ClipCardPreset {
  id: string;
  label: string;
  title: string;
  clipartIds: string[];
}

export interface ClipCardsConfig {
  title: string;
  clipartIds: string[];
  gridSize: ClipCardGridSize;
  letterCase: ClipCardLetterCase;
  paperSize: PaperSizeOption;
  showCutLines: boolean;
  includeAnswerKey: boolean;
  seed?: number;
}

export interface GeneratedClipCard {
  clipartId: string;
  word: string;
  correctLetter: string;
  choices: string[];
  correctDisplay: string;
}

function idsFromTheme(key: string, limit = 12): string[] {
  return getClipartByThemeOrTag(key)
    .slice(0, limit)
    .map((i) => i.id);
}

export const CLIP_CARD_PRESETS: ClipCardPreset[] = [
  {
    id: 'cvc',
    label: 'CVC Phonics (12)',
    title: 'CVC Beginning Sounds Clip Cards',
    clipartIds: listCvcClipart()
      .slice(0, 12)
      .map((i) => i.id),
  },
  {
    id: 'farm',
    label: 'Farm Animals (8)',
    title: 'Farm Animals Beginning Sounds Clip Cards',
    clipartIds: idsFromTheme('farm', 8),
  },
  {
    id: 'winter',
    label: 'Winter Words (10)',
    title: 'Winter Vocabulary Beginning Sounds Clip Cards',
    clipartIds: getClipartByThemeOrTag('winter')
      .filter((i) => i.theme === 'winter')
      .slice(0, 10)
      .map((i) => i.id),
  },
  {
    id: 'animals',
    label: 'Animals & Bugs (10)',
    title: 'Animals Beginning Sounds Clip Cards',
    clipartIds: idsFromTheme('animals', 10),
  },
  {
    id: 'classroom',
    label: 'Classroom (10)',
    title: 'Classroom Beginning Sounds Clip Cards',
    clipartIds: idsFromTheme('classroom', 10),
  },
  {
    id: 'food',
    label: 'Food & Snacks (10)',
    title: 'Food Beginning Sounds Clip Cards',
    clipartIds: idsFromTheme('food', 10),
  },
  {
    id: 'christmas',
    label: 'Christmas (6)',
    title: 'Christmas Beginning Sounds Clip Cards',
    clipartIds: idsFromTheme('christmas', 6),
  },
  {
    id: 'body',
    label: 'Body Parts (6)',
    title: 'Body Parts Beginning Sounds Clip Cards',
    clipartIds: idsFromTheme('body', 6),
  },
  {
    id: 'feelings',
    label: 'Feelings (6)',
    title: 'Feelings Beginning Sounds Clip Cards',
    clipartIds: idsFromTheme('feelings', 6),
  },
  {
    id: 'helpers',
    label: 'Helpers (6)',
    title: 'Community Helpers Beginning Sounds Clip Cards',
    clipartIds: idsFromTheme('helpers', 6),
  },
  {
    id: 'fall',
    label: 'Fall (8)',
    title: 'Fall & Autumn Beginning Sounds Clip Cards',
    clipartIds: idsFromTheme('fall', 8),
  },
  {
    id: 'halloween',
    label: 'Halloween (8)',
    title: 'Halloween Beginning Sounds Clip Cards',
    clipartIds: idsFromTheme('halloween', 8),
  },
  {
    id: 'spring',
    label: 'Spring (8)',
    title: 'Spring Beginning Sounds Clip Cards',
    clipartIds: idsFromTheme('spring', 8),
  },
  {
    id: 'valentines',
    label: "Valentine's (8)",
    title: "Valentine's Day Beginning Sounds Clip Cards",
    clipartIds: Array.from(new Set(['heart', ...idsFromTheme('valentines', 8)])).slice(0, 8),
  },
  {
    id: 'summer',
    label: 'Summer (8)',
    title: 'Summer Fun Beginning Sounds Clip Cards',
    clipartIds: idsFromTheme('summer', 8),
  },
  {
    id: 'weather',
    label: 'Weather (8)',
    title: 'Weather Beginning Sounds Clip Cards',
    clipartIds: idsFromTheme('weather', 8),
  },
  {
    id: 'transport',
    label: 'Transport (8)',
    title: 'Transportation Beginning Sounds Clip Cards',
    clipartIds: idsFromTheme('transport', 8),
  },
  {
    id: 'clothes',
    label: 'Clothes (8)',
    title: 'Clothes Beginning Sounds Clip Cards',
    clipartIds: idsFromTheme('clothes', 8),
  },
  {
    id: 'nature',
    label: 'Nature (8)',
    title: 'Nature Beginning Sounds Clip Cards',
    clipartIds: idsFromTheme('nature', 8),
  },
];

const DISTRACTOR_POOL = 'ABCDEFGHKLMNOPRSTW'.split('');

function createPrng(seed: number) {
  let s = (seed >>> 0) || 1;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function formatChoiceLetter(upper: string, letterCase: ClipCardLetterCase): string {
  const lo = upper.toLowerCase();
  if (letterCase === 'upper') return upper;
  if (letterCase === 'lower') return lo;
  return `${upper}${lo}`;
}

export function buildClipCards(config: ClipCardsConfig): GeneratedClipCard[] {
  const uniqueIds = Array.from(new Set(config.clipartIds))
    .filter((id) => Boolean(getClipart(id)))
    .slice(0, 24);
  const items = (uniqueIds.length > 0 ? uniqueIds : CLIP_CARD_PRESETS[0].clipartIds)
    .map((id) => getClipart(id))
    .filter((it): it is ClipartItem => Boolean(it));

  const rand = createPrng((config.seed ?? 1) * 5381 + items.length * 41);

  return items.map((item) => {
    const word = formatClipartLabel(item);
    const correctLetter = word.replace(/[^a-zA-Z]/g, '').charAt(0).toUpperCase() || 'A';

    const pool = DISTRACTOR_POOL.filter((l) => l !== correctLetter);
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    const rawChoices = [correctLetter, pool[0], pool[1]];
    for (let i = rawChoices.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [rawChoices[i], rawChoices[j]] = [rawChoices[j], rawChoices[i]];
    }

    return {
      clipartId: item.id,
      word,
      correctLetter,
      choices: rawChoices.map((ch) => formatChoiceLetter(ch, config.letterCase)),
      correctDisplay: formatChoiceLetter(correctLetter, config.letterCase),
    };
  });
}

export function getClipCardSheetGeometry(
  paperSize: PaperSizeOption,
  gridSize: ClipCardGridSize
) {
  const { width: pageW, height: pageH } = getSheetSize(paperSize, 'portrait');
  const cols = 2;
  const rows = gridSize === '2x2' ? 2 : 3;
  const perPage = cols * rows;
  const marginX = 36;
  const topHeaderY = 38;
  const gridTop = 70;
  const bottomFooterY = pageH - 28;
  const gap = 16;

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
    cardW,
    cardH,
  };
}

export async function generateClipCardsPdf(
  config: ClipCardsConfig,
  options: {
    loadClipartBytes?: (item: ClipartItem) => Promise<Uint8Array>;
  } = {}
): Promise<Uint8Array> {
  const loadClipart =
    options.loadClipartBytes ?? ((item) => fetchClipartBytesCached(item));
  const cards = buildClipCards(config);
  const geom = getClipCardSheetGeometry(config.paperSize, config.gridSize);
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
  const safeTitle = toWinAnsiSafe(config.title) || 'Beginning Sounds Clip Cards';

  const doc = await PDFDocument.create();
  doc.setTitle(`${safeTitle} - KinderESL`);
  doc.setAuthor('KinderESL Educational Resources');
  doc.setCreator('KinderESL Beginning Sounds Clip Cards Maker');

  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await doc.embedFont(StandardFonts.Helvetica);

  const clipartMap = new Map<string, PDFImage>();
  await Promise.all(
    cards.map(async (card) => {
      if (clipartMap.has(card.clipartId)) return;
      const item = getClipart(card.clipartId);
      if (!item) return;
      const bytes = await loadClipart(item);
      clipartMap.set(item.id, await doc.embedPng(bytes));
    })
  );

  const totalPages = Math.ceil(cards.length / perPage);

  for (let p = 0; p < totalPages; p++) {
    const page = doc.addPage([pageW, pageH]);
    const pageCards = cards.slice(p * perPage, (p + 1) * perPage);
    const heading =
      totalPages > 1 ? `${safeTitle} (${p + 1}/${totalPages})` : safeTitle;

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

    pageCards.forEach((card, idx) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const cardX = marginX + col * (cardW + gap);
      const cardY = gridTop + row * (cardH + gap);

      page.drawRectangle({
        x: cardX,
        y: toY(cardY + cardH),
        width: cardW,
        height: cardH,
        color: PDF_PALETTE.white,
        borderColor: PDF_PALETTE.teal,
        borderWidth: 1.6,
      });

      page.drawRectangle({
        x: cardX + 1.5,
        y: toY(cardY + 7.5),
        width: cardW - 3,
        height: 6,
        color: PDF_PALETTE.tealSoft,
      });

      const choicesBandH = config.gridSize === '2x2' ? 68 : 52;
      const img = clipartMap.get(card.clipartId);
      const pad = 12;
      const imgAreaW = cardW - pad * 2;
      const imgAreaH = cardH - pad * 2 - choicesBandH;
      const imgAreaY = cardY + pad + 4;

      if (img && imgAreaW > 10 && imgAreaH > 10) {
        const scale = Math.min(imgAreaW / img.width, imgAreaH / img.height);
        const drawW = img.width * scale;
        const drawH = img.height * scale;
        page.drawImage(img, {
          x: cardX + (cardW - drawW) / 2,
          y: toY(imgAreaY + (imgAreaH + drawH) / 2),
          width: drawW,
          height: drawH,
        });
      }

      // 3 Clip Boxes across bottom of card
      const choicePadX = 12;
      const choiceGap = 10;
      const boxY = cardY + cardH - choicesBandH + 6;
      const boxH = choicesBandH - 16;
      const boxW = (cardW - choicePadX * 2 - choiceGap * 2) / 3;
      const letterSize = config.gridSize === '2x2' ? 24 : 19;

      card.choices.forEach((choice, cIdx) => {
        const bx = cardX + choicePadX + cIdx * (boxW + choiceGap);
        page.drawRectangle({
          x: bx,
          y: toY(boxY + boxH),
          width: boxW,
          height: boxH,
          color: PDF_PALETTE.tealSoft,
          borderColor: PDF_PALETTE.teal,
          borderWidth: 1.3,
        });
        const lw = fontBold.widthOfTextAtSize(choice, letterSize);
        page.drawText(choice, {
          x: bx + (boxW - lw) / 2,
          y: toY(boxY + boxH / 2 + letterSize * 0.34),
          size: letterSize,
          font: fontBold,
          color: PDF_PALETTE.inkDark,
        });
      });
    });

    if (config.showCutLines) {
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
    }

    const footerText =
      'Cut out cards and clip a clothespin on the matching beginning sound  |  KinderESL.com';
    const fw = fontRegular.widthOfTextAtSize(footerText, 8);
    page.drawText(footerText, {
      x: (pageW - fw) / 2,
      y: toY(bottomFooterY + 4),
      size: 8,
      font: fontRegular,
      color: PDF_PALETTE.inkMuted,
    });
  }

  if (config.includeAnswerKey) {
    const keyPage = doc.addPage([pageW, pageH]);
    drawStandardSheetChromePdf(keyPage, {
      pageW,
      pageH,
      marginX: 40,
      topHeaderY: 38,
      bottomFooterY,
      title: `Teacher Answer Key: ${safeTitle}`,
      subtitle: `Correct beginning sound letters for all ${cards.length} clip cards.`,
      paperSize: config.paperSize,
      fontBold,
      fontRegular,
    });

    const keyCols = 2;
    const keyMarginX = 40;
    const keyColW = (pageW - keyMarginX * 2 - 16) / keyCols;
    const keyRowH = 42;
    const keyStartY = 102;

    cards.slice(0, 24).forEach((card, idx) => {
      const col = Math.floor(idx / 12);
      const row = idx % 12;
      const kx = keyMarginX + col * (keyColW + 16);
      const ky = keyStartY + row * (keyRowH + 6);

      keyPage.drawRectangle({
        x: kx,
        y: toY(ky + keyRowH),
        width: keyColW,
        height: keyRowH,
        color: row % 2 === 0 ? PDF_PALETTE.tealSoft : PDF_PALETTE.white,
        borderColor: PDF_PALETTE.tealBorder,
        borderWidth: 0.85,
      });

      const img = clipartMap.get(card.clipartId);
      if (img) {
        const s = Math.min(26 / img.width, 26 / img.height);
        const iw = img.width * s;
        const ih = img.height * s;
        keyPage.drawImage(img, {
          x: kx + 10 + (26 - iw) / 2,
          y: toY(ky + keyRowH / 2 + ih / 2),
          width: iw,
          height: ih,
        });
      }

      keyPage.drawText(`${idx + 1}. ${toWinAnsiSafe(card.word)}`, {
        x: kx + 44,
        y: toY(ky + keyRowH / 2 + 4),
        size: 11,
        font: fontBold,
        color: PDF_PALETTE.inkDark,
      });

      const badgeW = 34;
      const badgeH = 26;
      const bx = kx + keyColW - badgeW - 10;
      const by = ky + (keyRowH - badgeH) / 2;
      keyPage.drawRectangle({
        x: bx,
        y: toY(by + badgeH),
        width: badgeW,
        height: badgeH,
        color: PDF_PALETTE.teal,
      });
      const bw = fontBold.widthOfTextAtSize(card.correctDisplay, 12);
      keyPage.drawText(card.correctDisplay, {
        x: bx + (badgeW - bw) / 2,
        y: toY(by + badgeH / 2 + 4),
        size: 12,
        font: fontBold,
        color: PDF_PALETTE.white,
      });
    });
  }

  return doc.save();
}
