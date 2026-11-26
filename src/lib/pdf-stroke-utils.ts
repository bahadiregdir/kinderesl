import {
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
  type PDFFont,
} from 'pdf-lib';
import { layoutNameStrokes, type StrokeCmd, type StrokePath } from '@/lib/tracing-strokes';

export type PaperSizeOption = 'letter' | 'a4';
export type OrientationOption = 'portrait' | 'landscape';

export function layoutRepeatedSlotStrokes(
  token: string,
  count: number,
  options: {
    boxX: number;
    boxY: number;
    boxWidth: number;
    rowHeight: number;
  }
): { strokes: StrokePath[]; scale: number } {
  const { boxX, boxY, boxWidth, rowHeight } = options;
  const safeCount = Math.max(1, count);
  const slotWidth = boxWidth / safeCount;
  const slotPad = Math.min(8, slotWidth * 0.08);
  const strokes: StrokePath[] = [];
  let minScale = rowHeight;

  for (let i = 0; i < safeCount; i++) {
    const res = layoutNameStrokes(token, {
      boxX: boxX + i * slotWidth + slotPad,
      boxY,
      boxWidth: Math.max(12, slotWidth - slotPad * 2),
      rowHeight,
      align: 'center',
    });
    strokes.push(...res.strokes);
    if (res.scale < minScale) minScale = res.scale;
  }

  return { strokes, scale: minScale };
}

export const PDF_PALETTE = {
  inkDark: rgb(0.06, 0.09, 0.16),
  inkMuted: rgb(0.39, 0.45, 0.55),
  teal: rgb(0.18, 0.42, 0.42),
  tealSoft: rgb(0.94, 0.97, 0.97),
  tealBorder: rgb(0.82, 0.89, 0.89),
  divider: rgb(0.82, 0.89, 0.89),
  lineSolid: rgb(0.58, 0.67, 0.72),
  lineMid: rgb(0.68, 0.76, 0.81),
  guideStroke: rgb(0.76, 0.84, 0.84),
  traceDark: rgb(0.3, 0.36, 0.43),
  traceLight: rgb(0.47, 0.52, 0.58),
  white: rgb(1, 1, 1),
};

export function getSheetSize(
  paperSize: PaperSizeOption,
  orientation: OrientationOption = 'portrait'
): { width: number; height: number } {
  const baseW = paperSize === 'a4' ? 595.28 : 612;
  const baseH = paperSize === 'a4' ? 841.89 : 792;
  return orientation === 'landscape'
    ? { width: baseH, height: baseW }
    : { width: baseW, height: baseH };
}

export function getPaperLabel(paperSize: PaperSizeOption): string {
  return paperSize === 'a4' ? 'A4 (210x297mm)' : 'US Letter (8.5x11")';
}

export function toWinAnsiSafe(raw: string): string {
  return raw
    .replace(/ğ/g, 'g')
    .replace(/Ğ/g, 'G')
    .replace(/ş/g, 's')
    .replace(/Ş/g, 'S')
    .replace(/ı/g, 'i')
    .replace(/İ/g, 'I')
    .replace(/[’‘]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[–—]/g, '-')
    .replace(/[^\x20-\x7E\xA0-\xFF]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function drawStrokeCommandsPdf(
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

export function drawStartDotPdf(
  page: PDFPage,
  pageHeight: number,
  x: number,
  y: number,
  radius = 3.2,
  color: ReturnType<typeof rgb> = PDF_PALETTE.teal
) {
  page.drawCircle({
    x,
    y: pageHeight - y,
    size: radius,
    color,
  });
}

export function drawHandwritingGuideLinesPdf(
  page: PDFPage,
  pageHeight: number,
  box: { x: number; y: number; width: number; height: number }
) {
  const toY = (yTop: number) => pageHeight - yTop;
  const midY = box.y + box.height * 0.48;
  const baseY = box.y + box.height;

  // Top ascender line (solid)
  page.drawLine({
    start: { x: box.x, y: toY(box.y) },
    end: { x: box.x + box.width, y: toY(box.y) },
    thickness: 0.9,
    color: PDF_PALETTE.lineSolid,
  });

  // Midline (dashed)
  page.drawLine({
    start: { x: box.x, y: toY(midY) },
    end: { x: box.x + box.width, y: toY(midY) },
    thickness: 0.85,
    dashArray: [5, 4],
    color: PDF_PALETTE.lineMid,
  });

  // Baseline (solid)
  page.drawLine({
    start: { x: box.x, y: toY(baseY) },
    end: { x: box.x + box.width, y: toY(baseY) },
    thickness: 1.15,
    color: PDF_PALETTE.lineSolid,
  });
}

export function drawStandardSheetChromePdf(
  page: PDFPage,
  options: {
    pageW: number;
    pageH: number;
    marginX: number;
    topHeaderY: number;
    bottomFooterY: number;
    title: string;
    subtitle: string;
    paperSize: PaperSizeOption;
    fontBold: PDFFont;
    fontRegular: PDFFont;
  }
) {
  const {
    pageW,
    pageH,
    marginX,
    topHeaderY,
    bottomFooterY,
    title,
    subtitle,
    paperSize,
    fontBold,
    fontRegular,
  } = options;
  const toY = (yTop: number) => pageH - yTop;

  // Main title
  page.drawText(toWinAnsiSafe(title), {
    x: marginX,
    y: toY(topHeaderY),
    size: 19,
    font: fontBold,
    color: PDF_PALETTE.inkDark,
  });

  // Name: ______________ line on top-right beside paper tag
  const rightTag = `${getPaperLabel(paperSize)}  |  KinderESL.com`;
  const tagW = fontRegular.widthOfTextAtSize(rightTag, 8.5);
  page.drawText(rightTag, {
    x: pageW - marginX - tagW,
    y: toY(topHeaderY - 1),
    size: 8.5,
    font: fontRegular,
    color: PDF_PALETTE.inkMuted,
  });

  // Name field on right below tag or inline
  const nameLabel = 'Name: _______________________';
  const nameW = fontRegular.widthOfTextAtSize(nameLabel, 9.5);
  page.drawText(nameLabel, {
    x: pageW - marginX - nameW,
    y: toY(topHeaderY + 34),
    size: 9.5,
    font: fontRegular,
    color: PDF_PALETTE.inkMuted,
  });

  // Header divider line
  page.drawLine({
    start: { x: marginX, y: toY(topHeaderY + 17) },
    end: { x: pageW - marginX, y: toY(topHeaderY + 17) },
    thickness: 1.5,
    color: PDF_PALETTE.teal,
  });

  // Instruction line
  page.drawText(toWinAnsiSafe(subtitle), {
    x: marginX,
    y: toY(topHeaderY + 34),
    size: 9.5,
    font: fontRegular,
    color: PDF_PALETTE.inkMuted,
  });

  // Footer
  page.drawLine({
    start: { x: marginX, y: toY(bottomFooterY - 12) },
    end: { x: pageW - marginX, y: toY(bottomFooterY - 12) },
    thickness: 0.75,
    color: PDF_PALETTE.divider,
  });

  const footerText =
    'Free for non-commercial home & classroom use  |  More free printables at KinderESL.com';
  const footerW = fontRegular.widthOfTextAtSize(footerText, 8.5);
  page.drawText(footerText, {
    x: (pageW - footerW) / 2,
    y: toY(bottomFooterY + 4),
    size: 8.5,
    font: fontRegular,
    color: PDF_PALETTE.inkMuted,
  });
}
