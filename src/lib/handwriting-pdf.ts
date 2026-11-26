import { PDFDocument, StandardFonts } from 'pdf-lib';
import {
  PDF_PALETTE,
  drawHandwritingGuideLinesPdf,
  drawStandardSheetChromePdf,
  drawStartDotPdf,
  drawStrokeCommandsPdf,
  getSheetSize,
  layoutRepeatedSlotStrokes,
  toWinAnsiSafe,
  type PaperSizeOption,
} from '@/lib/pdf-stroke-utils';
import { layoutNameStrokes, type StrokePath } from '@/lib/tracing-strokes';

export interface HandwritingPreset {
  id: string;
  label: string;
  title: string;
  words: string[];
}

export const HANDWRITING_PRESETS: HandwritingPreset[] = [
  {
    id: 'dolch-preprimer-1',
    label: 'Dolch Pre-Primer 1',
    title: 'Sight Word Practice: Pre-Primer Set 1',
    words: ['the', 'and', 'see', 'can', 'look', 'play'],
  },
  {
    id: 'dolch-preprimer-2',
    label: 'Dolch Pre-Primer 2',
    title: 'Sight Word Practice: Pre-Primer Set 2',
    words: ['big', 'blue', 'come', 'find', 'help', 'jump'],
  },
  {
    id: 'dolch-primer',
    label: 'Dolch Primer',
    title: 'Sight Word Practice: Primer Set',
    words: ['like', 'have', 'good', 'said', 'they', 'with'],
  },
  {
    id: 'cvc-at',
    label: 'CVC -at Family',
    title: 'CVC Word Family Practice (-at)',
    words: ['cat', 'hat', 'bat', 'mat', 'sat', 'rat'],
  },
  {
    id: 'cvc-mix',
    label: 'CVC -an & -ig',
    title: 'Phonics Word Practice (-an & -ig)',
    words: ['can', 'fan', 'pan', 'big', 'dig', 'pig'],
  },
  {
    id: 'esl-classroom',
    label: 'ESL Classroom',
    title: 'ESL Vocabulary Handwriting Practice',
    words: ['book', 'desk', 'pen', 'bag', 'red', 'sun'],
  },
];

export type HandwritingLayoutMode = 'read-trace-write' | 'full-trace';
export type HandwritingCaseMode = 'preserve' | 'lower' | 'upper';

export interface HandwritingConfig {
  title: string;
  words: string[];
  layoutMode: HandwritingLayoutMode;
  caseMode: HandwritingCaseMode;
  showStartingDots: boolean;
  paperSize: PaperSizeOption;
}

export function formatWordCase(raw: string, caseMode: HandwritingCaseMode): string {
  const clean = raw.replace(/\s+/g, ' ').trim();
  if (!clean) return 'the';
  if (caseMode === 'lower') return clean.toLocaleLowerCase('en-US');
  if (caseMode === 'upper') return clean.toLocaleUpperCase('en-US');
  return clean;
}

export function parseHandwritingWords(
  rawText: string,
  caseMode: HandwritingCaseMode
): string[] {
  const list = rawText
    .split(/[\n,;]+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 18)
    .map((w) => formatWordCase(w, caseMode));
  return list.length > 0 ? list : [formatWordCase('the', caseMode)];
}

export function paginateHandwritingWords(words: string[]): string[][] {
  const clean = words.slice(0, 18);
  const pages: string[][] = [];
  for (let i = 0; i < clean.length; i += 6) {
    pages.push(clean.slice(i, i + 6));
  }
  return pages.length > 0 ? pages : [['the']];
}

export function getHandwritingSheetLayout(paperSize: PaperSizeOption) {
  const { width: pageW, height: pageH } = getSheetSize(paperSize, 'portrait');
  const marginX = 44;
  const topHeaderY = 42;
  const bottomFooterY = pageH - 36;
  const usableW = pageW - marginX * 2;

  const colHeaderY = 98;
  const firstRowTop = 122;
  const usableRowsH = bottomFooterY - 22 - firstRowTop;
  const rowCount = 6;
  const rowGap = 28;
  const totalStep = usableRowsH / rowCount;
  const rowH = Math.min(64, totalStep - rowGap);

  const colWidth = usableW / 3;

  return {
    pageW,
    pageH,
    marginX,
    topHeaderY,
    bottomFooterY,
    usableW,
    colHeaderY,
    firstRowTop,
    totalStep,
    rowH,
    colWidth,
  };
}

export interface HandwritingRowRenderData {
  guideStrokes: StrokePath[];
  guideScale: number;
  traceStrokes: StrokePath[];
  traceScale: number;
  dotStrokes: StrokePath[];
  dotScale: number;
}

export function buildHandwritingRowRenderData(
  word: string,
  layoutMode: HandwritingLayoutMode,
  options: {
    marginX: number;
    boxY: number;
    usableW: number;
    rowH: number;
    colWidth: number;
  }
): HandwritingRowRenderData {
  const { marginX, boxY, usableW, rowH, colWidth } = options;

  if (layoutMode === 'read-trace-write') {
    const colPad = 10;
    const guide = layoutNameStrokes(word, {
      boxX: marginX + colPad,
      boxY,
      boxWidth: colWidth - colPad * 2,
      rowHeight: rowH,
      align: 'center',
    });
    const trace = layoutNameStrokes(word, {
      boxX: marginX + colWidth + colPad,
      boxY,
      boxWidth: colWidth - colPad * 2,
      rowHeight: rowH,
      align: 'center',
    });
    return {
      guideStrokes: guide.strokes,
      guideScale: guide.scale,
      traceStrokes: trace.strokes,
      traceScale: trace.scale,
      dotStrokes: trace.strokes,
      dotScale: trace.scale,
    };
  }

  // full-trace mode: repeat 2-3 times across full width
  const count = word.length <= 4 ? 3 : 2;
  const slotW = (usableW - 12) / count;
  const firstOnly = layoutNameStrokes(word, {
    boxX: marginX + 6 + Math.min(8, slotW * 0.08),
    boxY,
    boxWidth: Math.max(12, slotW - Math.min(8, slotW * 0.08) * 2),
    rowHeight: rowH,
    align: 'center',
  });
  const repeated = layoutRepeatedSlotStrokes(word, count, {
    boxX: marginX + 6,
    boxY,
    boxWidth: usableW - 12,
    rowHeight: rowH,
  });

  return {
    guideStrokes: [],
    guideScale: rowH,
    traceStrokes: repeated.strokes,
    traceScale: repeated.scale,
    dotStrokes: firstOnly.strokes,
    dotScale: firstOnly.scale,
  };
}

export async function generateHandwritingPdf(
  config: HandwritingConfig
): Promise<Uint8Array> {
  const words = (config.words.length > 0 ? config.words : ['the'])
    .slice(0, 18)
    .map((w) => formatWordCase(w, config.caseMode));
  const pages = paginateHandwritingWords(words);

  const doc = await PDFDocument.create();
  doc.setTitle(`${toWinAnsiSafe(config.title || 'Sight Word Practice')} - KinderESL`);
  doc.setAuthor('KinderESL Educational Resources');
  doc.setCreator('KinderESL Handwriting Worksheet Maker');

  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await doc.embedFont(StandardFonts.Helvetica);

  const layout = getHandwritingSheetLayout(config.paperSize);
  const {
    pageW,
    pageH,
    marginX,
    topHeaderY,
    bottomFooterY,
    usableW,
    colHeaderY,
    firstRowTop,
    totalStep,
    rowH,
    colWidth,
  } = layout;
  const toY = (yTop: number) => pageH - yTop;

  pages.forEach((pageWords, pageIdx) => {
    const page = doc.addPage([pageW, pageH]);
    const sheetTitle =
      pages.length > 1
        ? `${config.title || 'Sight Word Handwriting'} (${pageIdx + 1}/${pages.length})`
        : config.title || 'Sight Word Handwriting';

    drawStandardSheetChromePdf(page, {
      pageW,
      pageH,
      marginX,
      topHeaderY,
      bottomFooterY,
      title: sheetTitle,
      subtitle:
        config.layoutMode === 'read-trace-write'
          ? 'Read each word aloud, trace the dashed letters, then write it on your own.'
          : 'Say each word aloud and trace it carefully across the handwriting lines.',
      paperSize: config.paperSize,
      fontBold,
      fontRegular,
    });

    if (config.layoutMode === 'read-trace-write') {
      const headers = ['1. READ', '2. TRACE', '3. WRITE ON YOUR OWN'];
      headers.forEach((h, idx) => {
        const cx = marginX + idx * colWidth + colWidth / 2;
        const hw = fontBold.widthOfTextAtSize(h, 8.5);
        page.drawText(h, {
          x: cx - hw / 2,
          y: toY(colHeaderY + 8),
          size: 8.5,
          font: fontBold,
          color: PDF_PALETTE.teal,
        });
      });
    } else {
      page.drawText('TRACE EACH WORD ACROSS THE LINE', {
        x: marginX,
        y: toY(colHeaderY + 8),
        size: 8.5,
        font: fontBold,
        color: PDF_PALETTE.teal,
      });
    }

    pageWords.forEach((word, rowIdx) => {
      const boxY = firstRowTop + rowIdx * totalStep;

      drawHandwritingGuideLinesPdf(page, pageH, {
        x: marginX,
        y: boxY,
        width: usableW,
        height: rowH,
      });

      if (config.layoutMode === 'read-trace-write') {
        // Subtle vertical column dividers inside the 3-line guide
        [1, 2].forEach((divIdx) => {
          const dx = marginX + divIdx * colWidth;
          page.drawLine({
            start: { x: dx, y: toY(boxY - 4) },
            end: { x: dx, y: toY(boxY + rowH + 4) },
            thickness: 0.75,
            dashArray: [2, 3],
            color: PDF_PALETTE.divider,
          });
        });
      }

      const data = buildHandwritingRowRenderData(word, config.layoutMode, {
        marginX,
        boxY,
        usableW,
        rowH,
        colWidth,
      });

      // Model solid strokes (column 1 in read-trace-write)
      if (data.guideStrokes.length > 0) {
        const gw = Math.max(1.4, Math.min(2.3, data.guideScale * 0.036));
        for (const s of data.guideStrokes) {
          drawStrokeCommandsPdf(page, pageH, s.commands, {
            lineWidth: gw,
            color: PDF_PALETTE.guideStroke,
            dashed: false,
          });
        }
      }

      // Dashed traceable strokes
      const tw = Math.max(1.4, Math.min(2.3, data.traceScale * 0.035));
      for (const s of data.traceStrokes) {
        drawStrokeCommandsPdf(page, pageH, s.commands, {
          lineWidth: tw,
          color: PDF_PALETTE.traceDark,
          dashed: true,
        });
      }

      if (config.showStartingDots) {
        const dotR = Math.max(1.9, Math.min(2.8, data.dotScale * 0.042));
        for (const s of data.dotStrokes) {
          if (s.startDot) {
            drawStartDotPdf(page, pageH, s.startDot[0], s.startDot[1], dotR);
          }
        }
      }
    });
  });

  return doc.save();
}
