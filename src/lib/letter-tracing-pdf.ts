import { PDFDocument, StandardFonts } from 'pdf-lib';
import {
  PDF_PALETTE,
  drawHandwritingGuideLinesPdf,
  drawStandardSheetChromePdf,
  drawStartDotPdf,
  drawStrokeCommandsPdf,
  getSheetSize,
  layoutRepeatedSlotStrokes,
  type PaperSizeOption,
} from '@/lib/pdf-stroke-utils';
import { layoutNameStrokes, type StrokePath } from '@/lib/tracing-strokes';

export const ALPHABET_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export const LETTER_PHONICS_WORDS: Record<string, { word: string; prep: 'is for' | 'as in' }> = {
  A: { word: 'Apple', prep: 'is for' },
  B: { word: 'Bear', prep: 'is for' },
  C: { word: 'Cat', prep: 'is for' },
  D: { word: 'Dog', prep: 'is for' },
  E: { word: 'Elephant', prep: 'is for' },
  F: { word: 'Fish', prep: 'is for' },
  G: { word: 'Goat', prep: 'is for' },
  H: { word: 'Hat', prep: 'is for' },
  I: { word: 'Igloo', prep: 'is for' },
  J: { word: 'Jam', prep: 'is for' },
  K: { word: 'Kite', prep: 'is for' },
  L: { word: 'Lion', prep: 'is for' },
  M: { word: 'Moon', prep: 'is for' },
  N: { word: 'Nest', prep: 'is for' },
  O: { word: 'Octopus', prep: 'is for' },
  P: { word: 'Pig', prep: 'is for' },
  Q: { word: 'Queen', prep: 'is for' },
  R: { word: 'Rabbit', prep: 'is for' },
  S: { word: 'Sun', prep: 'is for' },
  T: { word: 'Tiger', prep: 'is for' },
  U: { word: 'Umbrella', prep: 'is for' },
  V: { word: 'Van', prep: 'is for' },
  W: { word: 'Whale', prep: 'is for' },
  X: { word: 'Box', prep: 'as in' },
  Y: { word: 'Yarn', prep: 'is for' },
  Z: { word: 'Zebra', prep: 'is for' },
};

export const LETTER_PRESETS = [
  { id: 'single-a', label: 'Single (Aa)', letters: ['A'] },
  { id: 'satpin', label: 'SATPIN (6)', letters: ['S', 'A', 'T', 'P', 'I', 'N'] },
  { id: 'vowels', label: 'Vowels (5)', letters: ['A', 'E', 'I', 'O', 'U'] },
  { id: 'full-az', label: 'Full A–Z (26)', letters: ALPHABET_LETTERS },
] as const;

export type LetterCaseStyle = 'mixed' | 'upper' | 'lower';

export interface LetterTracingConfig {
  letters: string[];
  caseStyle: LetterCaseStyle;
  showStartingDots: boolean;
  showPhonicsCue: boolean;
  paperSize: PaperSizeOption;
}

export interface LetterRowSpec {
  label: string;
  token: string;
  count: number;
  mode: 'trace-dots' | 'trace' | 'write-own';
}

export function normalizeSelectedLetters(raw: string[]): string[] {
  const seen = new Set<string>();
  const valid: string[] = [];
  for (const ch of raw) {
    const upper = ch.trim().toUpperCase();
    if (/^[A-Z]$/.test(upper) && !seen.has(upper)) {
      seen.add(upper);
      valid.push(upper);
    }
  }
  return valid.length > 0 ? valid.slice(0, 26) : ['A'];
}

export function getDisplayPair(letter: string, caseStyle: LetterCaseStyle): string {
  const upper = letter.toUpperCase();
  const lower = letter.toLowerCase();
  if (caseStyle === 'upper') return upper;
  if (caseStyle === 'lower') return lower;
  return `${upper}${lower}`;
}

export function getLetterRowSpecs(
  letter: string,
  caseStyle: LetterCaseStyle
): LetterRowSpec[] {
  const upper = letter.toUpperCase();
  const lower = letter.toLowerCase();
  const pair = `${upper}${lower}`;

  if (caseStyle === 'upper') {
    return [
      { label: 'Trace Uppercase', token: upper, count: 5, mode: 'trace-dots' },
      { label: 'Trace Uppercase', token: upper, count: 5, mode: 'trace-dots' },
      { label: 'Trace With Less Help', token: upper, count: 5, mode: 'trace' },
      { label: 'Trace Independently', token: upper, count: 5, mode: 'trace' },
      { label: 'Write On Your Own', token: upper, count: 1, mode: 'write-own' },
    ];
  }

  if (caseStyle === 'lower') {
    return [
      { label: 'Trace Lowercase', token: lower, count: 5, mode: 'trace-dots' },
      { label: 'Trace Lowercase', token: lower, count: 5, mode: 'trace-dots' },
      { label: 'Trace With Less Help', token: lower, count: 5, mode: 'trace' },
      { label: 'Trace Independently', token: lower, count: 5, mode: 'trace' },
      { label: 'Write On Your Own', token: lower, count: 1, mode: 'write-own' },
    ];
  }

  return [
    { label: 'Trace Uppercase', token: upper, count: 5, mode: 'trace-dots' },
    { label: 'Trace Lowercase', token: lower, count: 5, mode: 'trace-dots' },
    { label: 'Trace Together', token: pair, count: 4, mode: 'trace-dots' },
    { label: 'Trace Independently', token: pair, count: 4, mode: 'trace' },
    { label: 'Write On Your Own', token: pair, count: 1, mode: 'write-own' },
  ];
}

export function getLetterSheetLayout(paperSize: PaperSizeOption) {
  const { width: pageW, height: pageH } = getSheetSize(paperSize, 'portrait');
  const marginX = 44;
  const topHeaderY = 42;
  const bottomFooterY = pageH - 36;
  const usableW = pageW - marginX * 2;

  const bannerY = 92;
  const bannerH = 88;

  const firstRowTop = bannerY + bannerH + 24;
  const usableRowsH = bottomFooterY - 20 - firstRowTop;
  const rowCount = 5;
  const rowGap = 28;
  const totalStep = usableRowsH / rowCount;
  const rowH = Math.min(72, totalStep - rowGap);

  return {
    pageW,
    pageH,
    marginX,
    topHeaderY,
    bottomFooterY,
    usableW,
    bannerY,
    bannerH,
    firstRowTop,
    totalStep,
    rowH,
  };
}

export function buildLetterRowStrokes(
  spec: LetterRowSpec,
  boxX: number,
  boxY: number,
  usableW: number,
  rowH: number
): { strokes: StrokePath[]; scale: number } {
  if (spec.mode === 'write-own') {
    const res = layoutNameStrokes(spec.token, {
      boxX: boxX + 12,
      boxY,
      boxWidth: Math.min(130, usableW * 0.25),
      rowHeight: rowH,
      align: 'left',
    });
    return { strokes: res.strokes, scale: res.scale };
  }

  return layoutRepeatedSlotStrokes(spec.token, spec.count, {
    boxX: boxX + 6,
    boxY,
    boxWidth: usableW - 12,
    rowHeight: rowH,
  });
}

export async function generateLetterTracingPdf(
  config: LetterTracingConfig
): Promise<Uint8Array> {
  const letters = normalizeSelectedLetters(config.letters);
  const doc = await PDFDocument.create();
  doc.setTitle('Alphabet Letter Tracing Worksheets - KinderESL');
  doc.setAuthor('KinderESL Educational Resources');
  doc.setCreator('KinderESL Letter Tracing Generator');

  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await doc.embedFont(StandardFonts.Helvetica);

  const layout = getLetterSheetLayout(config.paperSize);
  const {
    pageW,
    pageH,
    marginX,
    topHeaderY,
    bottomFooterY,
    usableW,
    bannerY,
    bannerH,
    firstRowTop,
    totalStep,
    rowH,
  } = layout;
  const toY = (yTop: number) => pageH - yTop;

  for (const letter of letters) {
    const page = doc.addPage([pageW, pageH]);
    const displayPair = getDisplayPair(letter, config.caseStyle);

    drawStandardSheetChromePdf(page, {
      pageW,
      pageH,
      marginX,
      topHeaderY,
      bottomFooterY,
      title: `Letter ${displayPair} Tracing Practice`,
      subtitle: 'Say the letter sound aloud as you trace starting from each dot.',
      paperSize: config.paperSize,
      fontBold,
      fontRegular,
    });

    // Top showcase card
    page.drawRectangle({
      x: marginX,
      y: toY(bannerY + bannerH),
      width: usableW,
      height: bannerH,
      color: PDF_PALETTE.tealSoft,
      borderColor: PDF_PALETTE.tealBorder,
      borderWidth: 1,
    });

    // Showcase giant vector letter(s) on the left of the banner
    const showcaseRes = layoutNameStrokes(displayPair, {
      boxX: marginX + 20,
      boxY: bannerY + 13,
      boxWidth: 150,
      rowHeight: 58,
      align: 'center',
    });

    for (const s of showcaseRes.strokes) {
      drawStrokeCommandsPdf(page, pageH, s.commands, {
        lineWidth: 2.8,
        color: PDF_PALETTE.teal,
        dashed: false,
      });
      if (config.showStartingDots && s.startDot) {
        drawStartDotPdf(page, pageH, s.startDot[0], s.startDot[1], 3.2, PDF_PALETTE.inkDark);
      }
    }

    // Banner text column
    const textColX = marginX + 196;
    const phonicsInfo = LETTER_PHONICS_WORDS[letter] ?? { word: letter, prep: 'is for' };
    if (config.showPhonicsCue) {
      page.drawText(`${displayPair} ${phonicsInfo.prep} ${phonicsInfo.word}`, {
        x: textColX,
        y: toY(bannerY + 38),
        size: 18,
        font: fontBold,
        color: PDF_PALETTE.inkDark,
      });
      page.drawText(
        `Finger-trace the big letter ${displayPair} above, then trace each row below.`,
        {
          x: textColX,
          y: toY(bannerY + 58),
          size: 9.5,
          font: fontRegular,
          color: PDF_PALETTE.inkMuted,
        }
      );
    } else {
      page.drawText(`Letter ${displayPair} Formation Guide`, {
        x: textColX,
        y: toY(bannerY + 38),
        size: 16,
        font: fontBold,
        color: PDF_PALETTE.inkDark,
      });
      page.drawText('Follow the starting dots from top to bottom and left to right.', {
        x: textColX,
        y: toY(bannerY + 58),
        size: 9.5,
        font: fontRegular,
        color: PDF_PALETTE.inkMuted,
      });
    }

    // 5 Practice Rows
    const rowSpecs = getLetterRowSpecs(letter, config.caseStyle);
    rowSpecs.forEach((spec, idx) => {
      const boxY = firstRowTop + idx * totalStep;

      page.drawText(spec.label.toUpperCase(), {
        x: marginX,
        y: toY(boxY - 6),
        size: 7.5,
        font: fontBold,
        color: PDF_PALETTE.teal,
      });

      drawHandwritingGuideLinesPdf(page, pageH, {
        x: marginX,
        y: boxY,
        width: usableW,
        height: rowH,
      });

      const { strokes, scale } = buildLetterRowStrokes(
        spec,
        marginX,
        boxY,
        usableW,
        rowH
      );

      const strokeW = Math.max(1.5, Math.min(2.4, scale * 0.034));
      const dotRadius = Math.max(2.1, Math.min(3.1, scale * 0.042));
      const strokeColor =
        spec.mode === 'write-own'
          ? PDF_PALETTE.guideStroke
          : spec.mode === 'trace-dots'
          ? PDF_PALETTE.traceDark
          : PDF_PALETTE.traceLight;

      for (const s of strokes) {
        drawStrokeCommandsPdf(page, pageH, s.commands, {
          lineWidth: strokeW,
          color: strokeColor,
          dashed: spec.mode !== 'write-own',
        });
      }

      if (config.showStartingDots && spec.mode === 'trace-dots') {
        for (const s of strokes) {
          if (s.startDot) {
            drawStartDotPdf(page, pageH, s.startDot[0], s.startDot[1], dotRadius);
          }
        }
      }
    });
  }

  return doc.save();
}
