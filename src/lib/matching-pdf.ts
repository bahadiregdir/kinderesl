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
  getSheetSize,
  toWinAnsiSafe,
  type PaperSizeOption,
} from '@/lib/pdf-stroke-utils';

export type MatchingMode = 'picture-word' | 'beginning-letter';
export type MatchingCaseMode = 'title' | 'upper' | 'lower';

export interface MatchingPreset {
  id: string;
  label: string;
  title: string;
  clipartIds: string[];
}

export interface MatchingConfig {
  title: string;
  clipartIds: string[];
  mode: MatchingMode;
  caseMode: MatchingCaseMode;
  paperSize: PaperSizeOption;
  includeAnswerKey: boolean;
  seed?: number;
}

export interface MatchingLeftItem {
  clipartId: string;
  word: string;
  firstLetter: string;
}

export interface MatchingRightItem {
  key: string;
  clipartId: string;
  displayText: string;
}

export interface MatchingAnswerPair {
  leftIdx: number;
  rightIdx: number;
}

export interface MatchingLayoutResult {
  leftItems: MatchingLeftItem[];
  rightItems: MatchingRightItem[];
  answerPairs: MatchingAnswerPair[];
}

function idsFromTheme(key: string, limit = 6): string[] {
  return getClipartByThemeOrTag(key)
    .slice(0, limit)
    .map((i) => i.id);
}

export const MATCHING_PRESETS: MatchingPreset[] = [
  {
    id: 'farm',
    label: 'Farm Animals',
    title: 'Farm Animals Picture Matching',
    clipartIds: ['cow', 'duck', 'egg', 'horse', 'nest', 'pig'],
  },
  {
    id: 'winter',
    label: 'Winter Words',
    title: 'Winter Vocabulary Picture Matching',
    clipartIds: ['beanie', 'coat', 'igloo', 'mitten', 'scarf', 'sled'],
  },
  {
    id: 'classroom',
    label: 'Classroom',
    title: 'Classroom Objects Picture Matching',
    clipartIds: ['bag', 'crayon', 'glue', 'pencil', 'scissors', 'table'],
  },
  {
    id: 'animals',
    label: 'Animals & Bugs',
    title: 'Animals & Bugs Picture Matching',
    clipartIds: ['ant', 'bee', 'cat', 'dog', 'fish', 'ladybug'],
  },
  {
    id: 'food',
    label: 'Food & Snacks',
    title: 'Food & Fruit Picture Matching',
    clipartIds: ['apple', 'bun', 'cup', 'grapes', 'orange', 'watermelon'],
  },
  {
    id: 'christmas',
    label: 'Christmas',
    title: 'Christmas Vocabulary Matching',
    clipartIds: ['bell', 'cocoa', 'gift', 'ornament', 'star', 'stocking'],
  },
  {
    id: 'body',
    label: 'Body Parts',
    title: 'Body Parts Picture Matching',
    clipartIds: ['ear', 'foot', 'hand', 'mouth', 'body', 'x-ray'],
  },
  {
    id: 'feelings',
    label: 'Feelings',
    title: 'Feelings & Emotions Matching',
    clipartIds: idsFromTheme('feelings', 6),
  },
  {
    id: 'helpers',
    label: 'Helpers',
    title: 'Community Helpers Matching',
    clipartIds: idsFromTheme('helpers', 6),
  },
  {
    id: 'cvc',
    label: 'CVC Phonics',
    title: 'CVC Phonics Picture Matching',
    clipartIds: ['cat', 'dog', 'bed', 'sun', 'hat', 'pig'],
  },
];

function createPrng(seed: number) {
  let s = (seed >>> 0) || 1;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function formatTextCase(raw: string, caseMode: MatchingCaseMode): string {
  const clean = toWinAnsiSafe(raw) || raw;
  if (caseMode === 'upper') return clean.toUpperCase();
  if (caseMode === 'lower') return clean.toLowerCase();
  return clean;
}

function formatLetterDisplay(letter: string, caseMode: MatchingCaseMode): string {
  const up = letter.toUpperCase();
  const lo = letter.toLowerCase();
  if (caseMode === 'upper') return up;
  if (caseMode === 'lower') return lo;
  return `${up}${lo}`;
}

export function buildMatchingLayout(config: MatchingConfig): MatchingLayoutResult {
  const uniqueIds = Array.from(new Set(config.clipartIds))
    .filter((id) => Boolean(getClipart(id)))
    .slice(0, 6);
  const rawItems = (uniqueIds.length >= 4 ? uniqueIds : MATCHING_PRESETS[0].clipartIds)
    .map((id) => getClipart(id))
    .filter((it): it is ClipartItem => Boolean(it));

  let selected = rawItems;
  if (config.mode === 'beginning-letter') {
    const seenLetters = new Set<string>();
    const deduped: ClipartItem[] = [];
    for (const item of rawItems) {
      const first = item.name.replace(/[^a-zA-Z]/g, '').charAt(0).toUpperCase();
      if (first && !seenLetters.has(first)) {
        seenLetters.add(first);
        deduped.push(item);
      }
    }
    if (deduped.length < 4) {
      for (const fallback of listCvcClipart()) {
        if (deduped.length >= 6) break;
        const first = fallback.name.replace(/[^a-zA-Z]/g, '').charAt(0).toUpperCase();
        if (first && !seenLetters.has(first)) {
          seenLetters.add(first);
          deduped.push(fallback);
        }
      }
    }
    selected = deduped.slice(0, 6);
  }

  const leftItems: MatchingLeftItem[] = selected.map((item) => {
    const word = formatClipartLabel(item);
    const firstLetter = word.replace(/[^a-zA-Z]/g, '').charAt(0).toUpperCase() || 'A';
    return {
      clipartId: item.id,
      word,
      firstLetter,
    };
  });

  const baseRight: MatchingRightItem[] = leftItems.map((left) => ({
    key: left.clipartId,
    clipartId: left.clipartId,
    displayText:
      config.mode === 'beginning-letter'
        ? formatLetterDisplay(left.firstLetter, config.caseMode)
        : formatTextCase(left.word, config.caseMode),
  }));

  const rand = createPrng(
    (config.seed ?? 1) * 4099 + leftItems.length * 19 + (config.mode === 'beginning-letter' ? 7 : 3)
  );

  let shuffled = [...baseRight];
  for (let attempt = 0; attempt < 30; attempt++) {
    shuffled = [...baseRight];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    const allMoved = shuffled.every((r, idx) => r.clipartId !== leftItems[idx].clipartId);
    if (allMoved) break;
  }

  const answerPairs: MatchingAnswerPair[] = leftItems.map((left, leftIdx) => ({
    leftIdx,
    rightIdx: shuffled.findIndex((r) => r.clipartId === left.clipartId),
  }));

  return {
    leftItems,
    rightItems: shuffled,
    answerPairs,
  };
}

export function getMatchingSheetGeometry(
  paperSize: PaperSizeOption,
  rowCount: number
) {
  const { width: pageW, height: pageH } = getSheetSize(paperSize, 'portrait');
  const marginX = 44;
  const topHeaderY = 38;
  const bottomFooterY = pageH - 28;
  const usableW = pageW - marginX * 2;

  const colHeaderY = 92;
  const startY = 112;
  const usableH = bottomFooterY - 18 - startY;
  const count = Math.max(4, Math.min(6, rowCount));
  const rowGap = 14;
  const totalStep = usableH / count;
  const boxH = Math.min(84, totalStep - rowGap);

  const leftCardW = 118;
  const rightCardW = 172;
  const leftX = marginX;
  const rightX = pageW - marginX - rightCardW;
  const leftDotX = leftX + leftCardW + 10;
  const rightDotX = rightX - 10;

  return {
    pageW,
    pageH,
    marginX,
    topHeaderY,
    bottomFooterY,
    usableW,
    colHeaderY,
    startY,
    totalStep,
    boxH,
    leftX,
    leftCardW,
    rightX,
    rightCardW,
    leftDotX,
    rightDotX,
  };
}

export async function generateMatchingPdf(
  config: MatchingConfig,
  options: {
    loadClipartBytes?: (item: ClipartItem) => Promise<Uint8Array>;
  } = {}
): Promise<Uint8Array> {
  const loadClipart =
    options.loadClipartBytes ?? ((item) => fetchClipartBytesCached(item));
  const layout = buildMatchingLayout(config);
  const geom = getMatchingSheetGeometry(config.paperSize, layout.leftItems.length);
  const {
    pageW,
    pageH,
    marginX,
    topHeaderY,
    bottomFooterY,
    colHeaderY,
    startY,
    totalStep,
    boxH,
    leftX,
    leftCardW,
    rightX,
    rightCardW,
    leftDotX,
    rightDotX,
  } = geom;

  const doc = await PDFDocument.create();
  doc.setTitle(`${toWinAnsiSafe(config.title || 'Picture Matching')} - KinderESL`);
  doc.setAuthor('KinderESL Educational Resources');
  doc.setCreator('KinderESL Picture & Beginning Sounds Matching Maker');

  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await doc.embedFont(StandardFonts.Helvetica);

  const clipartMap = new Map<string, PDFImage>();
  await Promise.all(
    layout.leftItems.map(async (itemRef) => {
      const item = getClipart(itemRef.clipartId);
      if (!item) return;
      const bytes = await loadClipart(item);
      clipartMap.set(item.id, await doc.embedPng(bytes));
    })
  );

  const renderSheet = (isAnswerKey: boolean) => {
    const page = doc.addPage([pageW, pageH]);
    const toY = (yTop: number) => pageH - yTop;
    const safeTitle = toWinAnsiSafe(config.title) || 'Picture Matching Worksheet';

    drawStandardSheetChromePdf(page, {
      pageW,
      pageH,
      marginX,
      topHeaderY,
      bottomFooterY,
      title: isAnswerKey ? `Answer Key: ${safeTitle}` : safeTitle,
      subtitle:
        config.mode === 'beginning-letter'
          ? 'Say each picture name aloud, then draw a line to its beginning letter.'
          : 'Look at each picture, then draw a line to match the English word.',
      paperSize: config.paperSize,
      fontBold,
      fontRegular,
    });

    page.drawText('PICTURES', {
      x: leftX,
      y: toY(colHeaderY + 8),
      size: 8.5,
      font: fontBold,
      color: PDF_PALETTE.teal,
    });
    page.drawText(
      config.mode === 'beginning-letter' ? 'BEGINNING LETTERS' : 'ENGLISH WORDS',
      {
        x: rightX,
        y: toY(colHeaderY + 8),
        size: 8.5,
        font: fontBold,
        color: PDF_PALETTE.teal,
      }
    );

    layout.leftItems.forEach((left, idx) => {
      const yTop = startY + idx * totalStep;
      const cy = yTop + boxH / 2;

      page.drawRectangle({
        x: leftX,
        y: toY(yTop + boxH),
        width: leftCardW,
        height: boxH,
        color: PDF_PALETTE.white,
        borderColor: PDF_PALETTE.teal,
        borderWidth: 1.4,
      });

      const img = clipartMap.get(left.clipartId);
      if (img) {
        const pad = 8;
        const maxW = leftCardW - pad * 2;
        const maxH = boxH - pad * 2;
        const scale = Math.min(maxW / img.width, maxH / img.height);
        const drawW = img.width * scale;
        const drawH = img.height * scale;
        page.drawImage(img, {
          x: leftX + (leftCardW - drawW) / 2,
          y: toY(cy + drawH / 2),
          width: drawW,
          height: drawH,
        });
      }

      page.drawCircle({
        x: leftDotX,
        y: toY(cy),
        size: 4.5,
        color: PDF_PALETTE.teal,
      });
    });

    layout.rightItems.forEach((right, idx) => {
      const yTop = startY + idx * totalStep;
      const cy = yTop + boxH / 2;

      page.drawRectangle({
        x: rightX,
        y: toY(yTop + boxH),
        width: rightCardW,
        height: boxH,
        color: PDF_PALETTE.tealSoft,
        borderColor: PDF_PALETTE.teal,
        borderWidth: 1.4,
      });

      let fontSize = config.mode === 'beginning-letter' ? 28 : 20;
      const maxTextW = rightCardW - 20;
      while (fontSize > 10 && fontBold.widthOfTextAtSize(right.displayText, fontSize) > maxTextW) {
        fontSize -= 1;
      }
      const tw = fontBold.widthOfTextAtSize(right.displayText, fontSize);
      page.drawText(right.displayText, {
        x: rightX + (rightCardW - tw) / 2,
        y: toY(cy + fontSize * 0.34),
        size: fontSize,
        font: fontBold,
        color: PDF_PALETTE.inkDark,
      });

      page.drawCircle({
        x: rightDotX,
        y: toY(cy),
        size: 4.5,
        color: PDF_PALETTE.teal,
      });
    });

    if (isAnswerKey) {
      layout.answerPairs.forEach((pair) => {
        const y1 = startY + pair.leftIdx * totalStep + boxH / 2;
        const y2 = startY + pair.rightIdx * totalStep + boxH / 2;
        page.drawLine({
          start: { x: leftDotX, y: toY(y1) },
          end: { x: rightDotX, y: toY(y2) },
          thickness: 2,
          dashArray: [5, 4],
          color: rgb(0.18, 0.42, 0.42),
        });
      });
    }
  };

  renderSheet(false);
  if (config.includeAnswerKey) {
    renderSheet(true);
  }

  return doc.save();
}
