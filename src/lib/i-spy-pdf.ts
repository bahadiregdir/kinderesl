import { PDFDocument, StandardFonts, degrees, rgb, type PDFImage } from 'pdf-lib';
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

export type ISpyDifficulty = 'easy' | 'medium' | 'challenge';

export interface ISpyPreset {
  id: string;
  label: string;
  title: string;
  clipartIds: string[];
}

export interface ISpyConfig {
  title: string;
  clipartIds: string[];
  difficulty: ISpyDifficulty;
  paperSize: PaperSizeOption;
  showWordLabels: boolean;
  allowRotation: boolean;
  includeAnswerKey: boolean;
  seed?: number;
}

export interface ISpyPlacedObject {
  id: string;
  clipartId: string;
  label: string;
  cx: number;
  cyTop: number;
  drawW: number;
  drawH: number;
  angleDeg: number;
}

export interface ISpyTargetCount {
  clipartId: string;
  label: string;
  count: number;
}

export interface ISpyLayoutResult {
  targets: ISpyTargetCount[];
  placed: ISpyPlacedObject[];
  countsById: Record<string, number>;
  totalObjects: number;
}

function idsFromTheme(key: string, limit = 8): string[] {
  return getClipartByThemeOrTag(key)
    .slice(0, limit)
    .map((i) => i.id);
}

export const I_SPY_PRESETS: ISpyPreset[] = [
  {
    id: 'winter',
    label: 'Winter',
    title: 'Winter I Spy & Count',
    clipartIds: getClipartByThemeOrTag('winter')
      .filter((i) => i.theme === 'winter')
      .slice(0, 8)
      .map((i) => i.id),
  },
  {
    id: 'christmas',
    label: 'Christmas',
    title: 'Christmas I Spy & Count',
    clipartIds: idsFromTheme('christmas', 7),
  },
  {
    id: 'farm',
    label: 'Farm Animals',
    title: 'Farm Animals I Spy & Count',
    clipartIds: idsFromTheme('farm', 8),
  },
  {
    id: 'animals',
    label: 'Animals & Bugs',
    title: 'Animals & Bugs I Spy & Count',
    clipartIds: idsFromTheme('animals', 8),
  },
  {
    id: 'classroom',
    label: 'Classroom',
    title: 'Classroom Objects I Spy & Count',
    clipartIds: idsFromTheme('classroom', 8),
  },
  {
    id: 'food',
    label: 'Food & Snacks',
    title: 'Food & Snacks I Spy & Count',
    clipartIds: idsFromTheme('food', 8),
  },
  {
    id: 'routines',
    label: 'Routines',
    title: 'School Routines I Spy & Count',
    clipartIds: idsFromTheme('routines', 8),
  },
  {
    id: 'body',
    label: 'Body Parts',
    title: 'Body Parts I Spy & Count',
    clipartIds: idsFromTheme('body', 7),
  },
  {
    id: 'feelings',
    label: 'Feelings',
    title: 'Feelings & Faces I Spy & Count',
    clipartIds: idsFromTheme('feelings', 6),
  },
  {
    id: 'helpers',
    label: 'Helpers',
    title: 'Community Helpers I Spy & Count',
    clipartIds: idsFromTheme('helpers', 6),
  },
  {
    id: 'cvc',
    label: 'CVC Phonics',
    title: 'CVC Phonics I Spy & Count',
    clipartIds: listCvcClipart()
      .slice(0, 8)
      .map((i) => i.id),
  },
];

export function getISpySheetGeometry(paperSize: PaperSizeOption) {
  const { width: pageW, height: pageH } = getSheetSize(paperSize, 'portrait');
  const marginX = 36;
  const topHeaderY = 38;
  const bottomFooterY = pageH - 26;
  const usableW = pageW - marginX * 2;

  const canvasX = marginX;
  const canvasY = 86;
  const canvasW = usableW;
  const checklistH = 148;
  const canvasH = bottomFooterY - 14 - checklistH - 12 - canvasY;
  const checklistY = canvasY + canvasH + 12;

  return {
    pageW,
    pageH,
    marginX,
    topHeaderY,
    bottomFooterY,
    usableW,
    canvasX,
    canvasY,
    canvasW,
    canvasH,
    checklistY,
    checklistH,
  };
}

function createPrng(seed: number) {
  let s = (seed >>> 0) || 1;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

export function buildISpyLayout(config: ISpyConfig): ISpyLayoutResult {
  const { canvasX, canvasY, canvasW, canvasH } = getISpySheetGeometry(
    config.paperSize
  );

  const uniqueIds = Array.from(new Set(config.clipartIds))
    .filter((id) => Boolean(getClipart(id)))
    .slice(0, 8);
  const validItems = (
    uniqueIds.length >= 4 ? uniqueIds : I_SPY_PRESETS[0].clipartIds.slice(0, 6)
  )
    .map((id) => getClipart(id))
    .filter((item): item is ClipartItem => Boolean(item));

  const seedNum =
    (config.seed ?? 1) * 7919 +
    validItems.length * 131 +
    (config.difficulty === 'easy' ? 11 : config.difficulty === 'medium' ? 23 : 37);
  const rand = createPrng(seedNum);

  const diffSpec =
    config.difficulty === 'easy'
      ? { minCount: 2, maxCount: 4, baseSize: 78 }
      : config.difficulty === 'medium'
      ? { minCount: 3, maxCount: 6, baseSize: 60 }
      : { minCount: 4, maxCount: 8, baseSize: 49 };

  // Build desired queue: guarantee first 2 of every item first, then remaining copies shuffled
  const guaranteedQueue: ClipartItem[] = [];
  const extraQueue: ClipartItem[] = [];

  for (const item of validItems) {
    const targetCount =
      diffSpec.minCount +
      Math.floor(rand() * (diffSpec.maxCount - diffSpec.minCount + 1));
    for (let k = 0; k < targetCount; k++) {
      if (k < 2) guaranteedQueue.push(item);
      else extraQueue.push(item);
    }
  }

  // Shuffle extra queue so layout mixes items organically
  for (let i = extraQueue.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [extraQueue[i], extraQueue[j]] = [extraQueue[j], extraQueue[i]];
  }

  const allToPlace = [...guaranteedQueue, ...extraQueue];
  const placed: ISpyPlacedObject[] = [];
  const placedCircles: Array<{ cx: number; cy: number; r: number }> = [];
  const minGap = config.difficulty === 'challenge' ? 3 : 5;

  const tryPlace = (item: ClipartItem, sizeScale: number): boolean => {
    const longest = diffSpec.baseSize * sizeScale * (0.9 + rand() * 0.22);
    const scale = longest / Math.max(item.width, item.height);
    const drawW = item.width * scale;
    const drawH = item.height * scale;
    const radius = Math.hypot(drawW, drawH) / 2;
    const safePad = radius + 6;
    const minX = canvasX + safePad;
    const maxX = canvasX + canvasW - safePad;
    const minY = canvasY + safePad;
    const maxY = canvasY + canvasH - safePad;

    if (maxX <= minX || maxY <= minY) return false;

    for (let attempt = 0; attempt < 180; attempt++) {
      const cx = minX + rand() * (maxX - minX);
      const cyTop = minY + rand() * (maxY - minY);
      const hitRadius = radius * 0.88;

      let collides = false;
      for (const existing of placedCircles) {
        const dx = cx - existing.cx;
        const dy = cyTop - existing.cy;
        const dist = Math.hypot(dx, dy);
        if (dist < hitRadius + existing.r + minGap) {
          collides = true;
          break;
        }
      }

      if (!collides) {
        const angleDeg = config.allowRotation
          ? Math.round((rand() * 40 - 20) * 10) / 10
          : 0;
        placed.push({
          id: `${item.id}-${placed.length}`,
          clipartId: item.id,
          label: formatClipartLabel(item),
          cx,
          cyTop,
          drawW,
          drawH,
          angleDeg,
        });
        placedCircles.push({ cx, cy: cyTop, r: hitRadius });
        return true;
      }
    }
    return false;
  };

  for (const item of allToPlace) {
    if (!tryPlace(item, 1.0)) {
      tryPlace(item, 0.84);
    }
  }

  const countsById: Record<string, number> = {};
  for (const item of validItems) countsById[item.id] = 0;
  for (const p of placed) {
    countsById[p.clipartId] = (countsById[p.clipartId] ?? 0) + 1;
  }

  const targets: ISpyTargetCount[] = validItems.map((item) => ({
    clipartId: item.id,
    label: formatClipartLabel(item),
    count: countsById[item.id] ?? 0,
  }));

  return {
    targets,
    placed,
    countsById,
    totalObjects: placed.length,
  };
}

export async function generateISpyPdf(
  config: ISpyConfig,
  options: {
    loadClipartBytes?: (item: ClipartItem) => Promise<Uint8Array>;
  } = {}
): Promise<Uint8Array> {
  const loadClipart =
    options.loadClipartBytes ?? ((item) => fetchClipartBytesCached(item));
  const layout = buildISpyLayout(config);
  const geom = getISpySheetGeometry(config.paperSize);
  const {
    pageW,
    pageH,
    marginX,
    topHeaderY,
    bottomFooterY,
    usableW,
    canvasX,
    canvasY,
    canvasW,
    canvasH,
    checklistY,
    checklistH,
  } = geom;

  const doc = await PDFDocument.create();
  doc.setTitle(`${toWinAnsiSafe(config.title || 'I Spy & Count')} - KinderESL`);
  doc.setAuthor('KinderESL Educational Resources');
  doc.setCreator('KinderESL I Spy Worksheet Maker');

  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await doc.embedFont(StandardFonts.Helvetica);

  // Pre-embed each clipart PNG once
  const clipartImageMap = new Map<string, PDFImage>();
  await Promise.all(
    layout.targets.map(async (target) => {
      const item = getClipart(target.clipartId);
      if (!item) return;
      const bytes = await loadClipart(item);
      const img = await doc.embedPng(bytes);
      clipartImageMap.set(target.clipartId, img);
    })
  );

  // Page 1: Student I Spy Sheet
  const page = doc.addPage([pageW, pageH]);
  const toY = (yTop: number) => pageH - yTop;
  const safeTitle = toWinAnsiSafe(config.title) || 'I Spy & Count';

  drawStandardSheetChromePdf(page, {
    pageW,
    pageH,
    marginX,
    topHeaderY,
    bottomFooterY,
    title: safeTitle,
    subtitle: 'Find, color, and count each picture! Write how many you find below.',
    paperSize: config.paperSize,
    fontBold,
    fontRegular,
  });

  // Search area frame
  page.drawRectangle({
    x: canvasX,
    y: toY(canvasY + canvasH),
    width: canvasW,
    height: canvasH,
    color: rgb(0.992, 0.996, 0.996),
    borderColor: PDF_PALETTE.teal,
    borderWidth: 1.6,
  });

  // Draw all scattered clipart items with rotation around visual center
  for (const obj of layout.placed) {
    const img = clipartImageMap.get(obj.clipartId);
    if (!img) continue;

    const hx = obj.drawW / 2;
    const hy = obj.drawH / 2;
    const cyPdf = toY(obj.cyTop);
    const pdfAngleDeg = -obj.angleDeg;
    const rad = (pdfAngleDeg * Math.PI) / 180;
    const blX = obj.cx - hx * Math.cos(rad) + hy * Math.sin(rad);
    const blY = cyPdf - hx * Math.sin(rad) - hy * Math.cos(rad);

    page.drawImage(img, {
      x: blX,
      y: blY,
      width: obj.drawW,
      height: obj.drawH,
      rotate: degrees(pdfAngleDeg),
    });
  }

  // Bottom Count & Write checklist container
  page.drawRectangle({
    x: marginX,
    y: toY(checklistY + checklistH),
    width: usableW,
    height: checklistH,
    color: PDF_PALETTE.tealSoft,
    borderColor: PDF_PALETTE.tealBorder,
    borderWidth: 1.1,
  });

  page.drawText('COUNT & WRITE HOW MANY YOU SPY:', {
    x: marginX + 12,
    y: toY(checklistY + 14),
    size: 8.5,
    font: fontBold,
    color: PDF_PALETTE.teal,
  });

  const cols = layout.targets.length <= 6 ? 3 : 4;
  const rows = 2;
  const gridPadX = 12;
  const gridTop = checklistY + 24;
  const gridH = checklistH - 32;
  const cellGapX = 10;
  const cellGapY = 8;
  const cellW = (usableW - gridPadX * 2 - cellGapX * (cols - 1)) / cols;
  const cellH = (gridH - cellGapY * (rows - 1)) / rows;

  layout.targets.forEach((target, idx) => {
    const col = idx % cols;
    const row = Math.floor(idx / cols);
    const cx = marginX + gridPadX + col * (cellW + cellGapX);
    const cy = gridTop + row * (cellH + cellGapY);

    page.drawRectangle({
      x: cx,
      y: toY(cy + cellH),
      width: cellW,
      height: cellH,
      color: PDF_PALETTE.white,
      borderColor: PDF_PALETTE.tealBorder,
      borderWidth: 0.9,
    });

    const img = clipartImageMap.get(target.clipartId);
    const boxSize = Math.min(22, cellH - 16);
    const boxX = cx + cellW - boxSize - 7;
    const boxYTop = cy + (cellH - boxSize) / 2;

    if (img) {
      const iconMax = Math.min(cellH - 14, config.showWordLabels ? (cols === 4 ? 28 : 34) : cellH - 12);
      const maxIconW = config.showWordLabels ? cellW * 0.25 : cellW * 0.45;
      const scale = Math.min(maxIconW / img.width, iconMax / img.height);
      const iw = img.width * scale;
      const ih = img.height * scale;
      const ix = cx + 7;
      const iyTop = cy + (cellH - ih) / 2;
      page.drawImage(img, {
        x: ix,
        y: toY(iyTop + ih),
        width: iw,
        height: ih,
      });

      if (config.showWordLabels) {
        const label = toWinAnsiSafe(target.label);
        let fontSize = cols === 4 ? 8.5 : 9.5;
        const labelX = ix + iw + 5;
        const maxLabelW = Math.max(20, boxX - labelX - 5);
        while (fontSize > 5.5 && fontBold.widthOfTextAtSize(label, fontSize) > maxLabelW) {
          fontSize -= 0.5;
        }
        page.drawText(label, {
          x: labelX,
          y: toY(cy + cellH / 2 + fontSize * 0.35),
          size: fontSize,
          font: fontBold,
          color: PDF_PALETTE.inkDark,
        });
      }
    }

    // Write-in answer box
    page.drawRectangle({
      x: boxX,
      y: toY(boxYTop + boxSize),
      width: boxSize,
      height: boxSize,
      color: PDF_PALETTE.white,
      borderColor: PDF_PALETTE.teal,
      borderWidth: 1.2,
    });
  });

  // Page 2: Teacher Answer Key
  if (config.includeAnswerKey) {
    const keyPage = doc.addPage([pageW, pageH]);
    drawStandardSheetChromePdf(keyPage, {
      pageW,
      pageH,
      marginX,
      topHeaderY,
      bottomFooterY,
      title: `Teacher Answer Key: ${safeTitle}`,
      subtitle: `Verified counts for all ${layout.totalObjects} objects (${config.difficulty.toUpperCase()} level).`,
      paperSize: config.paperSize,
      fontBold,
      fontRegular,
    });

    const rowH = 58;
    const startY = 104;
    layout.targets.forEach((target, idx) => {
      const yTop = startY + idx * (rowH + 10);
      keyPage.drawRectangle({
        x: marginX,
        y: toY(yTop + rowH),
        width: usableW,
        height: rowH,
        color: idx % 2 === 0 ? PDF_PALETTE.tealSoft : PDF_PALETTE.white,
        borderColor: PDF_PALETTE.tealBorder,
        borderWidth: 0.9,
      });

      const img = clipartImageMap.get(target.clipartId);
      if (img) {
        const scale = Math.min(40 / img.width, 40 / img.height);
        const iw = img.width * scale;
        const ih = img.height * scale;
        keyPage.drawImage(img, {
          x: marginX + 16 + (40 - iw) / 2,
          y: toY(yTop + rowH / 2 + ih / 2),
          width: iw,
          height: ih,
        });
      }

      keyPage.drawText(`${idx + 1}. ${toWinAnsiSafe(target.label)}`, {
        x: marginX + 74,
        y: toY(yTop + rowH / 2 + 5),
        size: 14,
        font: fontBold,
        color: PDF_PALETTE.inkDark,
      });

      const countStr = `${target.count}`;
      const badgeW = 48;
      const badgeH = 34;
      const badgeX = pageW - marginX - badgeW - 16;
      const badgeYTop = yTop + (rowH - badgeH) / 2;
      keyPage.drawRectangle({
        x: badgeX,
        y: toY(badgeYTop + badgeH),
        width: badgeW,
        height: badgeH,
        color: PDF_PALETTE.teal,
      });
      const cw = fontBold.widthOfTextAtSize(countStr, 16);
      keyPage.drawText(countStr, {
        x: badgeX + (badgeW - cw) / 2,
        y: toY(badgeYTop + badgeH / 2 + 6),
        size: 16,
        font: fontBold,
        color: PDF_PALETTE.white,
      });
    });
  }

  return doc.save();
}
