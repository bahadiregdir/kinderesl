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

export type PatternRule = 'AB' | 'AAB' | 'ABB' | 'ABC' | 'mixed';
export type ConcretePatternRule = 'AB' | 'AAB' | 'ABB' | 'ABC';

export interface PatternPreset {
  id: string;
  label: string;
  title: string;
  clipartIds: string[];
}

export interface PatternConfig {
  title: string;
  clipartIds: string[];
  rule: PatternRule;
  paperSize: PaperSizeOption;
  showWordLabels: boolean;
  includeDistractors: boolean;
  includeAnswerKey: boolean;
  seed?: number;
}

export interface PatternRow {
  rowIndex: number;
  rule: ConcretePatternRule;
  slots: string[];
  answerId: string;
}

export interface GeneratedPatternSheet {
  rows: PatternRow[];
  cutTiles: string[];
}

function idsFromTheme(key: string, limit = 8): string[] {
  return getClipartByThemeOrTag(key)
    .slice(0, limit)
    .map((i) => i.id);
}

export const PATTERN_PRESETS: PatternPreset[] = [
  {
    id: 'farm',
    label: 'Farm Animals (8)',
    title: 'Farm Animals Cut & Paste Patterns',
    clipartIds: idsFromTheme('farm', 8),
  },
  {
    id: 'winter',
    label: 'Winter (8)',
    title: 'Winter Cut & Paste Patterns',
    clipartIds: getClipartByThemeOrTag('winter')
      .filter((i) => i.theme === 'winter')
      .slice(0, 8)
      .map((i) => i.id),
  },
  {
    id: 'halloween',
    label: 'Halloween (8)',
    title: 'Halloween Cut & Paste Patterns',
    clipartIds: idsFromTheme('halloween', 8),
  },
  {
    id: 'fall',
    label: 'Fall (8)',
    title: 'Fall & Autumn Cut & Paste Patterns',
    clipartIds: idsFromTheme('fall', 8),
  },
  {
    id: 'christmas',
    label: 'Christmas (8)',
    title: 'Christmas Cut & Paste Patterns',
    clipartIds: idsFromTheme('christmas', 8),
  },
  {
    id: 'spring',
    label: 'Spring (8)',
    title: 'Spring Cut & Paste Patterns',
    clipartIds: idsFromTheme('spring', 8),
  },
  {
    id: 'valentines',
    label: "Valentine's (8)",
    title: "Valentine's Day Cut & Paste Patterns",
    clipartIds: idsFromTheme('valentines', 8),
  },
  {
    id: 'summer',
    label: 'Summer (8)',
    title: 'Summer Cut & Paste Patterns',
    clipartIds: idsFromTheme('summer', 8),
  },
  {
    id: 'animals',
    label: 'Animals & Bugs (8)',
    title: 'Animals Cut & Paste Patterns',
    clipartIds: idsFromTheme('animals', 8),
  },
  {
    id: 'food',
    label: 'Food (8)',
    title: 'Food Cut & Paste Patterns',
    clipartIds: idsFromTheme('food', 8),
  },
  {
    id: 'classroom',
    label: 'Classroom (8)',
    title: 'Classroom Objects Cut & Paste Patterns',
    clipartIds: idsFromTheme('classroom', 8),
  },
  {
    id: 'weather',
    label: 'Weather (8)',
    title: 'Weather Cut & Paste Patterns',
    clipartIds: idsFromTheme('weather', 8),
  },
  {
    id: 'transport',
    label: 'Transport (8)',
    title: 'Transportation Cut & Paste Patterns',
    clipartIds: idsFromTheme('transport', 8),
  },
  {
    id: 'clothes',
    label: 'Clothes (8)',
    title: 'Clothes Cut & Paste Patterns',
    clipartIds: idsFromTheme('clothes', 8),
  },
  {
    id: 'nature',
    label: 'Nature (8)',
    title: 'Nature Cut & Paste Patterns',
    clipartIds: idsFromTheme('nature', 8),
  },
  {
    id: 'body',
    label: 'Body Parts (6)',
    title: 'Body Parts Cut & Paste Patterns',
    clipartIds: idsFromTheme('body', 6),
  },
  {
    id: 'feelings',
    label: 'Feelings (6)',
    title: 'Feelings Cut & Paste Patterns',
    clipartIds: idsFromTheme('feelings', 6),
  },
  {
    id: 'helpers',
    label: 'Helpers (6)',
    title: 'Community Helpers Cut & Paste Patterns',
    clipartIds: idsFromTheme('helpers', 6),
  },
  {
    id: 'routines',
    label: 'Routines (6)',
    title: 'Daily Routines Cut & Paste Patterns',
    clipartIds: idsFromTheme('routines', 6),
  },
  {
    id: 'cvc',
    label: 'CVC Words (8)',
    title: 'CVC Phonics Cut & Paste Patterns',
    clipartIds: listCvcClipart()
      .slice(0, 8)
      .map((i) => i.id),
  },
];

function createPrng(seed: number) {
  let s = (seed >>> 0) || 1;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function shuffleWithPrng<T>(arr: T[], rand: () => number): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function buildPatternSheet(config: PatternConfig): GeneratedPatternSheet {
  const validIds = Array.from(new Set(config.clipartIds)).filter((id) =>
    Boolean(getClipart(id))
  );
  const pool =
    validIds.length >= 3
      ? validIds
      : Array.from(
          new Set([...validIds, ...PATTERN_PRESETS[0].clipartIds])
        ).slice(0, 8);

  const rand = createPrng((config.seed ?? 1) * 7919 + pool.length * 97);
  const rotated = shuffleWithPrng(pool, rand);

  const rowRules: ConcretePatternRule[] =
    config.rule === 'mixed'
      ? ['AB', 'AAB', 'ABB', 'ABC']
      : [config.rule, config.rule, config.rule, config.rule];

  const rows: PatternRow[] = rowRules.map((rule, rIdx) => {
    const offset = rIdx * 2;
    const a = rotated[offset % rotated.length];
    let b = rotated[(offset + 1) % rotated.length];
    if (b === a && rotated.length > 1) {
      b = rotated[(offset + 2) % rotated.length];
    }
    let c = rotated[(offset + 2) % rotated.length];
    if (c === a || c === b) {
      c = rotated.find((id) => id !== a && id !== b) ?? b;
    }

    if (rule === 'AB') {
      return { rowIndex: rIdx, rule, slots: [a, b, a, b, a], answerId: b };
    }
    if (rule === 'AAB') {
      return { rowIndex: rIdx, rule, slots: [a, a, b, a, a], answerId: b };
    }
    if (rule === 'ABB') {
      return { rowIndex: rIdx, rule, slots: [a, b, b, a, b], answerId: b };
    }
    return { rowIndex: rIdx, rule: 'ABC', slots: [a, b, c, a, b], answerId: c };
  });

  const answers = rows.map((r) => r.answerId);
  const cutPool = [...answers];

  if (config.includeDistractors) {
    const answerSet = new Set(answers);
    const unused = rotated.filter((id) => !answerSet.has(id));
    const fallbackExtras = PATTERN_PRESETS.flatMap((p) => p.clipartIds).filter(
      (id) => !answerSet.has(id)
    );
    const candidates = [...unused, ...fallbackExtras];
    let added = 0;
    for (const extra of candidates) {
      if (!cutPool.includes(extra) || added < 2) {
        if (!cutPool.includes(extra)) {
          cutPool.push(extra);
          added++;
          if (added >= 2) break;
        }
      }
    }
  }

  // Deterministic shuffle so cut tiles do not sit in exact 1-2-3-4 answer order
  let shuffled = shuffleWithPrng(cutPool, rand);
  if (
    shuffled.length >= 4 &&
    shuffled.slice(0, 4).every((id, idx) => id === answers[idx])
  ) {
    shuffled = [...shuffled.slice(1), shuffled[0]];
  }

  return { rows, cutTiles: shuffled };
}

function fitFontSize(
  text: string,
  font: { widthOfTextAtSize: (t: string, s: number) => number },
  maxWidth: number,
  maxSize: number,
  minSize = 6.5
): { text: string; size: number } {
  const clean = toWinAnsiSafe(text);
  let size = maxSize;
  while (size > minSize && font.widthOfTextAtSize(clean, size) > maxWidth) {
    size -= 0.5;
  }
  return { text: clean, size };
}

export async function generatePatternPdf(
  config: PatternConfig,
  options: {
    loadClipartBytes?: (item: ClipartItem) => Promise<Uint8Array>;
  } = {}
): Promise<Uint8Array> {
  const loadClipart =
    options.loadClipartBytes ?? ((item) => fetchClipartBytesCached(item));
  const sheet = buildPatternSheet(config);

  const doc = await PDFDocument.create();
  doc.setTitle(`${toWinAnsiSafe(config.title || 'Cut & Paste Patterns')} - KinderESL`);
  doc.setAuthor('KinderESL Educational Resources');
  doc.setCreator('KinderESL Cut & Paste Pattern Maker');

  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await doc.embedFont(StandardFonts.Helvetica);

  const neededIds = new Set<string>();
  for (const r of sheet.rows) {
    for (const s of r.slots) neededIds.add(s);
    neededIds.add(r.answerId);
  }
  for (const t of sheet.cutTiles) neededIds.add(t);

  const imageMap = new Map<string, PDFImage>();
  await Promise.all(
    Array.from(neededIds).map(async (id) => {
      const item = getClipart(id);
      if (!item) return;
      const bytes = await loadClipart(item);
      const img = await doc.embedPng(bytes);
      imageMap.set(id, img);
    })
  );

  const { width: pageW, height: pageH } = getSheetSize(config.paperSize, 'portrait');
  const toY = (yTop: number) => pageH - yTop;
  const marginX = 36;
  const topHeaderY = 42;
  const bottomFooterY = pageH - 28;
  const usableW = pageW - marginX * 2;
  const safeTitle = toWinAnsiSafe(config.title) || 'Cut & Paste Patterns';

  const drawPatternPage = (isAnswerKey: boolean) => {
    const page = doc.addPage([pageW, pageH]);
    drawStandardSheetChromePdf(page, {
      pageW,
      pageH,
      marginX,
      topHeaderY,
      bottomFooterY,
      title: isAnswerKey ? `${safeTitle} - Answer Key` : safeTitle,
      subtitle: isAnswerKey
        ? 'Teacher Reference Key showing the correct next picture for each row.'
        : 'Look at each row. Cut and glue the picture that comes next!',
      paperSize: config.paperSize,
      fontBold,
      fontRegular,
    });

    const numCircleArea = 28;
    const gap = 8;
    const boxSize = Math.min(72, Math.floor((usableW - numCircleArea - gap * 5) / 6));
    const rowStartX = marginX + numCircleArea;
    const rowsTop = topHeaderY + 62;
    const rowPitch = config.paperSize === 'a4' ? 96 : 90;

    sheet.rows.forEach((row, rIdx) => {
      const rowY = rowsTop + rIdx * rowPitch;
      const badgeCy = rowY + boxSize / 2;

      // Row number badge
      page.drawCircle({
        x: marginX + 10,
        y: toY(badgeCy),
        size: 10,
        color: PDF_PALETTE.tealSoft,
        borderColor: PDF_PALETTE.teal,
        borderWidth: 1.1,
      });
      const numStr = String(rIdx + 1);
      const nw = fontBold.widthOfTextAtSize(numStr, 10);
      page.drawText(numStr, {
        x: marginX + 10 - nw / 2,
        y: toY(badgeCy + 3.5),
        size: 10,
        font: fontBold,
        color: PDF_PALETTE.teal,
      });

      // 5 given pattern slots
      row.slots.forEach((slotId, sIdx) => {
        const bx = rowStartX + sIdx * (boxSize + gap);
        page.drawRectangle({
          x: bx,
          y: toY(rowY + boxSize),
          width: boxSize,
          height: boxSize,
          color: PDF_PALETTE.white,
          borderColor: rgb(0.79, 0.84, 0.88),
          borderWidth: 1.2,
        });

        const img = imageMap.get(slotId);
        if (img) {
          const pad = 7;
          const avail = boxSize - pad * 2;
          const sc = Math.min(avail / img.width, avail / img.height);
          const dw = img.width * sc;
          const dh = img.height * sc;
          page.drawImage(img, {
            x: bx + (boxSize - dw) / 2,
            y: toY(rowY + (boxSize - dh) / 2 + dh),
            width: dw,
            height: dh,
          });
        }
      });

      // 6th slot: glue box or Answer Key reveal
      const ansX = rowStartX + 5 * (boxSize + gap);
      page.drawRectangle({
        x: ansX,
        y: toY(rowY + boxSize),
        width: boxSize,
        height: boxSize,
        color: isAnswerKey ? rgb(0.9, 0.96, 0.95) : PDF_PALETTE.tealSoft,
        borderColor: PDF_PALETTE.teal,
        borderWidth: 1.6,
        borderDashArray: isAnswerKey ? undefined : [4, 3],
      });

      if (isAnswerKey) {
        const img = imageMap.get(row.answerId);
        const item = getClipart(row.answerId);
        const labelReserve = 12;
        if (img) {
          const pad = 6;
          const availW = boxSize - pad * 2;
          const availH = boxSize - pad * 2 - labelReserve;
          const sc = Math.min(availW / img.width, availH / img.height);
          const dw = img.width * sc;
          const dh = img.height * sc;
          page.drawImage(img, {
            x: ansX + (boxSize - dw) / 2,
            y: toY(rowY + pad + (availH - dh) / 2 + dh),
            width: dw,
            height: dh,
          });
        }
        if (item) {
          const { text, size } = fitFontSize(
            formatClipartLabel(item),
            fontBold,
            boxSize - 8,
            8.5
          );
          const tw = fontBold.widthOfTextAtSize(text, size);
          page.drawText(text, {
            x: ansX + (boxSize - tw) / 2,
            y: toY(rowY + boxSize - 4),
            size,
            font: fontBold,
            color: PDF_PALETTE.teal,
          });
        }
      } else {
        const qW = fontBold.widthOfTextAtSize('?', 22);
        page.drawText('?', {
          x: ansX + (boxSize - qW) / 2,
          y: toY(rowY + boxSize / 2 + 8),
          size: 22,
          font: fontBold,
          color: rgb(0.56, 0.72, 0.72),
        });
      }
    });

    if (!isAnswerKey) {
      // Scissor cut divider & bottom tray
      const cutLineY = rowsTop + 4 * rowPitch + 24;
      page.drawLine({
        start: { x: marginX, y: toY(cutLineY) },
        end: { x: pageW - marginX, y: toY(cutLineY) },
        thickness: 1.1,
        dashArray: [6, 4],
        color: PDF_PALETTE.teal,
      });

      const cutPrompt =
        'Cut out the pictures below and glue each one into the matching box';
      const cpW = fontBold.widthOfTextAtSize(cutPrompt, 9);
      page.drawRectangle({
        x: (pageW - cpW - 18) / 2,
        y: toY(cutLineY + 7),
        width: cpW + 18,
        height: 14,
        color: PDF_PALETTE.white,
      });
      page.drawText(cutPrompt, {
        x: (pageW - cpW) / 2,
        y: toY(cutLineY + 3),
        size: 9,
        font: fontBold,
        color: PDF_PALETTE.teal,
      });

      const count = sheet.cutTiles.length;
      const tileSize = count <= 4 ? 78 : Math.min(72, Math.floor((usableW - (count - 1) * 12) / count));
      const tileGap = count <= 4 ? 18 : 12;
      const totalTrayW = count * tileSize + (count - 1) * tileGap;
      const trayStartX = (pageW - totalTrayW) / 2;
      const trayTopY = cutLineY + 26;

      sheet.cutTiles.forEach((tileId, idx) => {
        const tx = trayStartX + idx * (tileSize + tileGap);
        page.drawRectangle({
          x: tx,
          y: toY(trayTopY + tileSize),
          width: tileSize,
          height: tileSize,
          color: PDF_PALETTE.white,
          borderColor: PDF_PALETTE.teal,
          borderWidth: 1.3,
          borderDashArray: [4, 3],
        });

        const img = imageMap.get(tileId);
        const item = getClipart(tileId);
        const labelRoom = config.showWordLabels ? 14 : 0;
        if (img) {
          const pad = 7;
          const availW = tileSize - pad * 2;
          const availH = tileSize - pad * 2 - labelRoom;
          const sc = Math.min(availW / img.width, availH / img.height);
          const dw = img.width * sc;
          const dh = img.height * sc;
          page.drawImage(img, {
            x: tx + (tileSize - dw) / 2,
            y: toY(trayTopY + pad + (availH - dh) / 2 + dh),
            width: dw,
            height: dh,
          });
        }

        if (config.showWordLabels && item) {
          const { text, size } = fitFontSize(
            formatClipartLabel(item),
            fontBold,
            tileSize - 8,
            8.5
          );
          const tw = fontBold.widthOfTextAtSize(text, size);
          page.drawText(text, {
            x: tx + (tileSize - tw) / 2,
            y: toY(trayTopY + tileSize - 5),
            size,
            font: fontBold,
            color: PDF_PALETTE.inkDark,
          });
        }
      });
    } else {
      const note = `Paper: ${getPaperLabel(config.paperSize)}  |  Rule: ${config.rule.toUpperCase()}  |  Row patterns shown above`;
      const nw = fontRegular.widthOfTextAtSize(note, 9.5);
      page.drawText(note, {
        x: (pageW - nw) / 2,
        y: toY(rowsTop + 4 * rowPitch + 24),
        size: 9.5,
        font: fontRegular,
        color: PDF_PALETTE.inkMuted,
      });
    }
  };

  drawPatternPage(false);
  if (config.includeAnswerKey) {
    drawPatternPage(true);
  }

  return doc.save();
}
