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

export const NUMBER_WORDS: Record<number, string> = {
  0: 'zero',
  1: 'one',
  2: 'two',
  3: 'three',
  4: 'four',
  5: 'five',
  6: 'six',
  7: 'seven',
  8: 'eight',
  9: 'nine',
  10: 'ten',
  11: 'eleven',
  12: 'twelve',
  13: 'thirteen',
  14: 'fourteen',
  15: 'fifteen',
  16: 'sixteen',
  17: 'seventeen',
  18: 'eighteen',
  19: 'nineteen',
  20: 'twenty',
};

export const ALL_NUMBERS = Array.from({ length: 21 }, (_, i) => i);

export const NUMBER_PRESETS = [
  { id: '1-10', label: '1–10', numbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
  { id: '0-10', label: '0–10', numbers: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
  { id: '11-20', label: '11–20', numbers: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20] },
  { id: '0-20', label: '0–20 (All)', numbers: ALL_NUMBERS },
] as const;

export interface NumberTracingConfig {
  numbers: number[];
  showTenFrame: boolean;
  includeNumberWord: boolean;
  showStartingDots: boolean;
  paperSize: PaperSizeOption;
}

export interface NumberRowSpec {
  label: string;
  token: string;
  count: number;
  mode: 'trace-dots' | 'trace' | 'write-own';
}

export function normalizeSelectedNumbers(raw: number[]): number[] {
  const seen = new Set<number>();
  const valid: number[] = [];
  for (const n of raw) {
    if (Number.isInteger(n) && n >= 0 && n <= 20 && !seen.has(n)) {
      seen.add(n);
      valid.push(n);
    }
  }
  return valid.length > 0 ? valid.slice(0, 21) : [1];
}

export function getNumberRowSpecs(
  num: number,
  includeNumberWord: boolean
): NumberRowSpec[] {
  const numStr = String(num);
  const numeralRepeats = num >= 10 ? 5 : 6;
  const word = NUMBER_WORDS[num] ?? numStr;
  const wordRepeats = word.length <= 5 ? 3 : 2;

  const row4: NumberRowSpec = includeNumberWord
    ? {
        label: `Trace Number Word (${word})`,
        token: word,
        count: wordRepeats,
        mode: 'trace-dots',
      }
    : {
        label: 'Trace Numerals',
        token: numStr,
        count: numeralRepeats,
        mode: 'trace',
      };

  return [
    { label: 'Trace With Starting Dots', token: numStr, count: numeralRepeats, mode: 'trace-dots' },
    { label: 'Trace', token: numStr, count: numeralRepeats, mode: 'trace-dots' },
    { label: 'Trace Independently', token: numStr, count: numeralRepeats, mode: 'trace' },
    row4,
    { label: 'Write On Your Own', token: numStr, count: 1, mode: 'write-own' },
  ];
}

export function getNumberSheetLayout(paperSize: PaperSizeOption) {
  const { width: pageW, height: pageH } = getSheetSize(paperSize, 'portrait');
  const marginX = 44;
  const topHeaderY = 42;
  const bottomFooterY = pageH - 36;
  const usableW = pageW - marginX * 2;

  const bannerY = 92;
  const bannerH = 96;

  const firstRowTop = bannerY + bannerH + 22;
  const usableRowsH = bottomFooterY - 20 - firstRowTop;
  const rowCount = 5;
  const rowGap = 28;
  const totalStep = usableRowsH / rowCount;
  const rowH = Math.min(70, totalStep - rowGap);

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

export function buildNumberRowStrokes(
  spec: NumberRowSpec,
  boxX: number,
  boxY: number,
  usableW: number,
  rowH: number
): { strokes: StrokePath[]; scale: number } {
  if (spec.mode === 'write-own') {
    const res = layoutNameStrokes(spec.token, {
      boxX: boxX + 12,
      boxY,
      boxWidth: Math.min(120, usableW * 0.22),
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

export function getTenFrameMetrics(
  num: number,
  areaX: number,
  areaY: number,
  areaW: number,
  areaH: number
) {
  const frameCount = num > 10 ? 2 : 1;
  const frameGap = 14;
  const maxFrameW = frameCount === 2 ? (areaW - frameGap) / 2 : Math.min(176, areaW);
  const cellSize = Math.min(maxFrameW / 5, areaH / 2);
  const frameW = cellSize * 5;
  const frameH = cellSize * 2;
  const totalW = frameCount === 2 ? frameW * 2 + frameGap : frameW;
  const startX = areaX + (areaW - totalW) / 2;
  const startY = areaY + (areaH - frameH) / 2;

  const frames: Array<{
    x: number;
    y: number;
    w: number;
    h: number;
    cellSize: number;
    filledDots: number;
  }> = [];

  for (let f = 0; f < frameCount; f++) {
    const remaining = Math.max(0, Math.min(10, num - f * 10));
    frames.push({
      x: startX + f * (frameW + frameGap),
      y: startY,
      w: frameW,
      h: frameH,
      cellSize,
      filledDots: remaining,
    });
  }

  return { frames };
}

export async function generateNumberTracingPdf(
  config: NumberTracingConfig
): Promise<Uint8Array> {
  const numbers = normalizeSelectedNumbers(config.numbers);
  const doc = await PDFDocument.create();
  doc.setTitle('Number Tracing & Counting Worksheets - KinderESL');
  doc.setAuthor('KinderESL Educational Resources');
  doc.setCreator('KinderESL Number Tracing Generator');

  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await doc.embedFont(StandardFonts.Helvetica);

  const layout = getNumberSheetLayout(config.paperSize);
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

  for (const num of numbers) {
    const page = doc.addPage([pageW, pageH]);
    const word = NUMBER_WORDS[num] ?? String(num);
    const titleWord = word.charAt(0).toUpperCase() + word.slice(1);

    drawStandardSheetChromePdf(page, {
      pageW,
      pageH,
      marginX,
      topHeaderY,
      bottomFooterY,
      title: `Number ${num} (${titleWord}) Tracing`,
      subtitle: 'Count the dots in the ten-frame, then trace the number starting at the dot.',
      paperSize: config.paperSize,
      fontBold,
      fontRegular,
    });

    // Top showcase box
    page.drawRectangle({
      x: marginX,
      y: toY(bannerY + bannerH),
      width: usableW,
      height: bannerH,
      color: PDF_PALETTE.tealSoft,
      borderColor: PDF_PALETTE.tealBorder,
      borderWidth: 1,
    });

    // Giant reference numeral on left
    const showcaseRes = layoutNameStrokes(String(num), {
      boxX: marginX + 18,
      boxY: bannerY + 16,
      boxWidth: 132,
      rowHeight: 62,
      align: 'center',
    });

    for (const s of showcaseRes.strokes) {
      drawStrokeCommandsPdf(page, pageH, s.commands, {
        lineWidth: 3,
        color: PDF_PALETTE.teal,
        dashed: false,
      });
      if (config.showStartingDots && s.startDot) {
        drawStartDotPdf(page, pageH, s.startDot[0], s.startDot[1], 3.2, PDF_PALETTE.inkDark);
      }
    }

    if (config.showTenFrame) {
      const tfLabel = `Count & Color: ${titleWord} (${num})`;
      page.drawText(tfLabel, {
        x: marginX + 178,
        y: toY(bannerY + 20),
        size: 11,
        font: fontBold,
        color: PDF_PALETTE.inkDark,
      });

      const { frames } = getTenFrameMetrics(
        num,
        marginX + 178,
        bannerY + 28,
        usableW - 196,
        bannerH - 38
      );

      for (const frame of frames) {
        page.drawRectangle({
          x: frame.x,
          y: toY(frame.y + frame.h),
          width: frame.w,
          height: frame.h,
          color: PDF_PALETTE.white,
          borderColor: PDF_PALETTE.teal,
          borderWidth: 1.2,
        });

        // Vertical grid dividers (4 internal lines)
        for (let c = 1; c < 5; c++) {
          const lx = frame.x + c * frame.cellSize;
          page.drawLine({
            start: { x: lx, y: toY(frame.y) },
            end: { x: lx, y: toY(frame.y + frame.h) },
            thickness: 0.8,
            color: PDF_PALETTE.lineSolid,
          });
        }

        // Horizontal middle divider
        page.drawLine({
          start: { x: frame.x, y: toY(frame.y + frame.cellSize) },
          end: { x: frame.x + frame.w, y: toY(frame.y + frame.cellSize) },
          thickness: 0.8,
          color: PDF_PALETTE.lineSolid,
        });

        // Counting dots (row-major)
        const dotR = Math.max(4, frame.cellSize * 0.29);
        for (let d = 0; d < frame.filledDots; d++) {
          const row = Math.floor(d / 5);
          const col = d % 5;
          const cx = frame.x + col * frame.cellSize + frame.cellSize / 2;
          const cy = frame.y + row * frame.cellSize + frame.cellSize / 2;
          page.drawCircle({
            x: cx,
            y: toY(cy),
            size: dotR,
            color: PDF_PALETTE.teal,
          });
        }
      }
    } else {
      page.drawText(`Number ${num} — "${titleWord}"`, {
        x: marginX + 184,
        y: toY(bannerY + 42),
        size: 18,
        font: fontBold,
        color: PDF_PALETTE.inkDark,
      });
      page.drawText('Trace every dashed numeral carefully, then write it on your own.', {
        x: marginX + 184,
        y: toY(bannerY + 62),
        size: 9.5,
        font: fontRegular,
        color: PDF_PALETTE.inkMuted,
      });
    }

    // 5 Practice Rows
    const rowSpecs = getNumberRowSpecs(num, config.includeNumberWord);
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

      const { strokes, scale } = buildNumberRowStrokes(
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
