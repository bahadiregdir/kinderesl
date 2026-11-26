import {
  PDFDocument,
  StandardFonts,
  rgb,
  pushGraphicsState,
  popGraphicsState,
  setLineWidth,
  setLineCap,
  setLineJoin,
  setDashPattern,
  setStrokingColor,
  moveTo,
  lineTo,
  appendBezierCurve,
  stroke,
  LineCapStyle,
  LineJoinStyle,
  type PDFPage,
} from 'pdf-lib';
import { layoutNameStrokes, type StrokeCmd } from '@/lib/tracing-strokes';

export type PaperSizeOption = 'letter' | 'a4';
export type OrientationOption = 'landscape' | 'portrait';
export type CaseModeOption = 'title' | 'upper' | 'lower';

export interface NameTracingConfig {
  names: string[];
  paperSize: PaperSizeOption;
  orientation: OrientationOption;
  caseMode: CaseModeOption;
  showStartingDots: boolean;
}

export function applyCaseMode(raw: string, mode: CaseModeOption): string {
  const clean = raw.replace(/\s+/g, ' ').trim();
  if (!clean) return 'Emma';
  if (mode === 'upper') return clean.toLocaleUpperCase('en-US');
  if (mode === 'lower') return clean.toLocaleLowerCase('en-US');

  // Title Case while preserving hyphenated names like Mary-Jane
  return clean
    .split(' ')
    .map((word) =>
      word
        .split('-')
        .map((part) =>
          part
            ? part.charAt(0).toLocaleUpperCase('en-US') +
              part.slice(1).toLocaleLowerCase('en-US')
            : part
        )
        .join('-')
    )
    .join(' ');
}

export function getSheetDimensions(
  paperSize: PaperSizeOption,
  orientation: OrientationOption
): { width: number; height: number } {
  const baseW = paperSize === 'a4' ? 595.28 : 612;
  const baseH = paperSize === 'a4' ? 841.89 : 792;
  return orientation === 'landscape'
    ? { width: baseH, height: baseW }
    : { width: baseW, height: baseH };
}

export interface RowConfig {
  label: string;
  mode: 'guide' | 'trace-dots' | 'trace' | 'blank';
}

export function getRowsForOrientation(
  orientation: OrientationOption
): RowConfig[] {
  if (orientation === 'landscape') {
    return [
      { label: 'Read & Trace', mode: 'guide' },
      { label: 'Trace', mode: 'trace-dots' },
      { label: 'Trace Independently', mode: 'trace' },
      { label: 'Write Your Name', mode: 'blank' },
    ];
  }
  return [
    { label: 'Read & Trace', mode: 'guide' },
    { label: 'Trace', mode: 'trace-dots' },
    { label: 'Trace', mode: 'trace-dots' },
    { label: 'Trace Independently', mode: 'trace' },
    { label: 'Write Your Name', mode: 'blank' },
  ];
}

export function getSheetMetrics(
  paperSize: PaperSizeOption,
  orientation: OrientationOption
) {
  const { width: pageW, height: pageH } = getSheetDimensions(
    paperSize,
    orientation
  );
  const rows = getRowsForOrientation(orientation);
  const marginX = 44;
  const topHeaderY = 44;
  const firstRowTop = orientation === 'landscape' ? 104 : 114;
  const bottomFooterY = pageH - 34;
  const usableW = pageW - marginX * 2;
  const usableH = bottomFooterY - firstRowTop - 16;
  const rowGap = orientation === 'landscape' ? 28 : 30;
  const totalStep = usableH / rows.length;
  const rowH = Math.min(82, totalStep - rowGap);

  return {
    pageW,
    pageH,
    rows,
    marginX,
    topHeaderY,
    firstRowTop,
    bottomFooterY,
    usableW,
    totalStep,
    rowH,
  };
}

function drawStrokeCommandsPdf(
  page: PDFPage,
  pageHeight: number,
  commands: StrokeCmd[],
  options: {
    lineWidth: number;
    color: ReturnType<typeof rgb>;
    dashed: boolean;
  }
) {
  if (commands.length === 0) return;

  const toY = (yTop: number) => pageHeight - yTop;
  const ops = [
    pushGraphicsState(),
    setLineWidth(options.lineWidth),
    setLineCap(LineCapStyle.Round),
    setLineJoin(LineJoinStyle.Round),
    setStrokingColor(options.color),
  ];

  if (options.dashed) {
    ops.push(setDashPattern([3, 3.6], 0));
  } else {
    ops.push(setDashPattern([], 0));
  }

  for (const cmd of ops) {
    page.pushOperators(cmd);
  }

  for (const cmd of commands) {
    if (cmd.type === 'M') {
      page.pushOperators(moveTo(cmd.x, toY(cmd.y)));
    } else if (cmd.type === 'L') {
      page.pushOperators(lineTo(cmd.x, toY(cmd.y)));
    } else {
      page.pushOperators(
        appendBezierCurve(
          cmd.x1,
          toY(cmd.y1),
          cmd.x2,
          toY(cmd.y2),
          cmd.x,
          toY(cmd.y)
        )
      );
    }
  }

  page.pushOperators(stroke(), popGraphicsState());
}

export async function generateNameTracingPdf(
  config: NameTracingConfig
): Promise<Uint8Array> {
  const namesList = (config.names.length > 0 ? config.names : ['Emma'])
    .map((n) => applyCaseMode(n, config.caseMode))
    .slice(0, 30);

  const doc = await PDFDocument.create();
  doc.setTitle('Custom Name Tracing Worksheet - KinderESL');
  doc.setAuthor('KinderESL Educational Resources');
  doc.setCreator('KinderESL Name Tracing Generator');

  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await doc.embedFont(StandardFonts.Helvetica);

  const {
    pageW,
    pageH,
    rows,
    marginX,
    topHeaderY,
    firstRowTop,
    bottomFooterY,
    usableW,
    totalStep,
    rowH,
  } = getSheetMetrics(config.paperSize, config.orientation);

  const inkDark = rgb(0.06, 0.09, 0.16);
  const inkMuted = rgb(0.39, 0.45, 0.55);
  const tealColor = rgb(0.18, 0.42, 0.42);
  const dividerColor = rgb(0.82, 0.89, 0.89);
  const lineSolidColor = rgb(0.58, 0.67, 0.72);
  const lineMidColor = rgb(0.68, 0.76, 0.81);
  const guideStrokeColor = rgb(0.76, 0.84, 0.84);
  const traceDarkColor = rgb(0.32, 0.38, 0.44);
  const traceLightColor = rgb(0.47, 0.52, 0.58);

  const paperLabel =
    config.paperSize === 'a4' ? 'A4 (210x297mm)' : 'US Letter (8.5x11")';

  for (const nameText of namesList) {
    const page = doc.addPage([pageW, pageH]);
    const toY = (yTop: number) => pageH - yTop;

    // Header
    page.drawText('Name Tracing Practice', {
      x: marginX,
      y: toY(topHeaderY),
      size: 20,
      font: fontBold,
      color: inkDark,
    });

    const rightTag = `${paperLabel}  |  KinderESL.com`;
    const tagW = fontRegular.widthOfTextAtSize(rightTag, 9);
    page.drawText(rightTag, {
      x: pageW - marginX - tagW,
      y: toY(topHeaderY - 1),
      size: 9,
      font: fontRegular,
      color: inkMuted,
    });

    // Header divider line
    page.drawLine({
      start: { x: marginX, y: toY(topHeaderY + 18) },
      end: { x: pageW - marginX, y: toY(topHeaderY + 18) },
      thickness: 1.5,
      color: tealColor,
    });

    // Subtle student prompt line
    page.drawText('Say each letter sound aloud as you trace starting from the dot.', {
      x: marginX,
      y: toY(topHeaderY + 36),
      size: 10,
      font: fontRegular,
      color: inkMuted,
    });

    // Handwriting rows
    rows.forEach((row, idx) => {
      const boxY = firstRowTop + idx * totalStep;
      const midY = boxY + rowH * 0.48;
      const baseY = boxY + rowH;

      // Small row label above top line
      page.drawText(row.label.toUpperCase(), {
        x: marginX,
        y: toY(boxY - 6),
        size: 7.5,
        font: fontBold,
        color: tealColor,
      });

      // Top ascender line (solid)
      page.drawLine({
        start: { x: marginX, y: toY(boxY) },
        end: { x: pageW - marginX, y: toY(boxY) },
        thickness: 0.9,
        color: lineSolidColor,
      });

      // Midline (dashed)
      page.drawLine({
        start: { x: marginX, y: toY(midY) },
        end: { x: pageW - marginX, y: toY(midY) },
        thickness: 0.85,
        dashArray: [5, 4],
        color: lineMidColor,
      });

      // Baseline (solid)
      page.drawLine({
        start: { x: marginX, y: toY(baseY) },
        end: { x: pageW - marginX, y: toY(baseY) },
        thickness: 1.15,
        color: lineSolidColor,
      });

      if (row.mode === 'blank') {
        return;
      }

      const { strokes, scale } = layoutNameStrokes(nameText, {
        boxX: marginX + 12,
        boxY,
        boxWidth: usableW - 24,
        rowHeight: rowH,
        align: 'left',
      });

      const strokeW = Math.max(1.5, Math.min(2.6, scale * 0.036));
      const dotRadius = Math.max(2.1, Math.min(3.3, scale * 0.044));

      const strokeColor =
        row.mode === 'guide'
          ? guideStrokeColor
          : row.mode === 'trace-dots'
          ? traceDarkColor
          : traceLightColor;

      const isDashed = row.mode !== 'guide';

      for (const s of strokes) {
        drawStrokeCommandsPdf(page, pageH, s.commands, {
          lineWidth: strokeW,
          color: strokeColor,
          dashed: isDashed,
        });
      }

      if (
        config.showStartingDots &&
        (row.mode === 'guide' || row.mode === 'trace-dots')
      ) {
        for (const s of strokes) {
          if (s.startDot) {
            page.drawCircle({
              x: s.startDot[0],
              y: toY(s.startDot[1]),
              size: dotRadius,
              color: tealColor,
            });
          }
        }
      }
    });

    // Footer
    page.drawLine({
      start: { x: marginX, y: toY(bottomFooterY - 14) },
      end: { x: pageW - marginX, y: toY(bottomFooterY - 14) },
      thickness: 0.75,
      color: dividerColor,
    });
    page.drawText('Free for classroom & home use · kinderesl.com', {
      x: marginX,
      y: toY(bottomFooterY),
      size: 8.5,
      font: fontRegular,
      color: inkMuted,
    });
  }

  return doc.save();
}
