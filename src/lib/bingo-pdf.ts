import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFImage } from 'pdf-lib';
import {
  fetchClipartBytesCached,
  formatClipartLabel,
  getClipart,
  getClipartByThemeOrTag,
  listCvcClipart,
  type ClipartItem,
} from '@/lib/clipart';

export type BingoCardMode = 'picture-word' | 'picture-only' | 'word-only';

export interface BingoItem {
  label: string;
  clipartId?: string;
}

export interface PictureBingoPreset {
  id: string;
  label: string;
  title: string;
  items: BingoItem[];
}

function toBingoItems(list: ClipartItem[]): BingoItem[] {
  return list.map((item) => ({
    label: formatClipartLabel(item),
    clipartId: item.id,
  }));
}

function mergeClipartSets(...lists: ClipartItem[][]): ClipartItem[] {
  const seen = new Set<string>();
  const merged: ClipartItem[] = [];
  for (const list of lists) {
    for (const item of list) {
      if (!seen.has(item.id)) {
        seen.add(item.id);
        merged.push(item);
      }
    }
  }
  return merged;
}

export const PICTURE_BINGO_PRESETS: PictureBingoPreset[] = [
  {
    id: 'pic-farm',
    label: 'Farm Animals (8)',
    title: 'Farm Animals Picture Bingo',
    items: toBingoItems(getClipartByThemeOrTag('farm')),
  },
  {
    id: 'pic-winter',
    label: 'Winter Words (11)',
    title: 'Winter Vocabulary Picture Bingo',
    items: toBingoItems(getClipartByThemeOrTag('winter').filter((i) => i.theme === 'winter')),
  },
  {
    id: 'pic-classroom',
    label: 'Classroom (11)',
    title: 'Classroom Objects Picture Bingo',
    items: toBingoItems(getClipartByThemeOrTag('classroom')),
  },
  {
    id: 'pic-animals',
    label: 'Animals & Bugs (10)',
    title: 'Animals & Bugs Picture Bingo',
    items: toBingoItems(getClipartByThemeOrTag('animals')),
  },
  {
    id: 'pic-food',
    label: 'Food & Snacks (11)',
    title: 'Food & Snacks Picture Bingo',
    items: toBingoItems(getClipartByThemeOrTag('food')),
  },
  {
    id: 'pic-routines',
    label: 'Routines (12)',
    title: 'Classroom Routines Picture Bingo',
    items: toBingoItems(getClipartByThemeOrTag('routines')),
  },
  {
    id: 'pic-fall',
    label: 'Fall (8)',
    title: 'Fall & Autumn Picture Bingo',
    items: toBingoItems(getClipartByThemeOrTag('fall')),
  },
  {
    id: 'pic-halloween',
    label: 'Halloween (8)',
    title: 'Halloween Picture Bingo',
    items: toBingoItems(getClipartByThemeOrTag('halloween')),
  },
  {
    id: 'pic-spring',
    label: 'Spring (8)',
    title: 'Spring Vocabulary Picture Bingo',
    items: toBingoItems(getClipartByThemeOrTag('spring')),
  },
  {
    id: 'pic-valentines',
    label: "Valentine's (8)",
    title: "Valentine's Day Picture Bingo",
    items: toBingoItems(
      mergeClipartSets(
        [getClipart('heart')].filter((i): i is ClipartItem => Boolean(i)),
        getClipartByThemeOrTag('valentines')
      )
    ),
  },
  {
    id: 'pic-summer',
    label: 'Summer (8)',
    title: 'Summer Fun Picture Bingo',
    items: toBingoItems(getClipartByThemeOrTag('summer')),
  },
  {
    id: 'pic-weather',
    label: 'Weather (8)',
    title: 'Weather & Sky Picture Bingo',
    items: toBingoItems(getClipartByThemeOrTag('weather')),
  },
  {
    id: 'pic-transport',
    label: 'Transport (8)',
    title: 'Transportation Picture Bingo',
    items: toBingoItems(getClipartByThemeOrTag('transport')),
  },
  {
    id: 'pic-clothes',
    label: 'Clothes (8)',
    title: 'Clothes & Dressing Picture Bingo',
    items: toBingoItems(getClipartByThemeOrTag('clothes')),
  },
  {
    id: 'pic-nature',
    label: 'Nature (8)',
    title: 'Nature & Outdoors Picture Bingo',
    items: toBingoItems(getClipartByThemeOrTag('nature')),
  },
  {
    id: 'pic-winter-christmas',
    label: 'Winter + Christmas (18)',
    title: 'Winter & Christmas Picture Bingo',
    items: toBingoItems(
      mergeClipartSets(
        getClipartByThemeOrTag('winter').filter((i) => i.theme === 'winter'),
        getClipartByThemeOrTag('christmas')
      )
    ),
  },
  {
    id: 'pic-animals-farm',
    label: 'Animals + Farm (18)',
    title: 'Animals & Farm Picture Bingo',
    items: toBingoItems(
      mergeClipartSets(getClipartByThemeOrTag('animals'), getClipartByThemeOrTag('farm'))
    ),
  },
  {
    id: 'pic-cvc',
    label: 'CVC Phonics (16+)',
    title: 'CVC Phonics Picture Bingo',
    items: toBingoItems(listCvcClipart().slice(0, 20)),
  },
];

export interface BingoPreset {
  id: string;
  label: string;
  title: string;
  words: string[];
}

export const BINGO_PRESETS: BingoPreset[] = [
  {
    id: 'farm-animals',
    label: 'Farm Animals',
    title: 'Farm Animals ESL Bingo',
    words: [
      'Cow', 'Pig', 'Sheep', 'Chicken',
      'Horse', 'Duck', 'Goat', 'Rooster',
      'Barn', 'Tractor', 'Hay', 'Fence',
      'Farmer', 'Egg', 'Milk', 'Mud',
    ],
  },
  {
    id: 'winter',
    label: 'Winter Words',
    title: 'Winter Vocabulary Bingo',
    words: [
      'Snow', 'Mitten', 'Hat', 'Scarf',
      'Coat', 'Boots', 'Snowman', 'Penguin',
      'Ice', 'Sled', 'Cold', 'Flake',
      'Cocoa', 'Frost', 'Sweater', 'Gloves',
    ],
  },
  {
    id: 'colors-shapes',
    label: 'Colors & Shapes',
    title: 'Colors & Shapes Bingo',
    words: [
      'Red', 'Blue', 'Yellow', 'Green',
      'Orange', 'Purple', 'Pink', 'Black',
      'Circle', 'Square', 'Triangle', 'Star',
      'Heart', 'Oval', 'Diamond', 'Rectangle',
    ],
  },
  {
    id: 'classroom',
    label: 'Classroom',
    title: 'Classroom Objects Bingo',
    words: [
      'Book', 'Pencil', 'Crayon', 'Paper',
      'Scissors', 'Glue', 'Desk', 'Chair',
      'Ruler', 'Eraser', 'Backpack', 'Board',
      'Clock', 'Marker', 'Folder', 'Brush',
    ],
  },
  {
    id: 'body-feelings',
    label: 'Body & Feelings',
    title: 'Body Parts & Feelings Bingo',
    words: [
      'Head', 'Hands', 'Eyes', 'Ears',
      'Nose', 'Mouth', 'Knees', 'Toes',
      'Happy', 'Sad', 'Tired', 'Excited',
      'Angry', 'Scared', 'Brave', 'Silly',
    ],
  },
  {
    id: 'weather',
    label: 'Weather',
    title: 'Weather & Seasons Bingo',
    words: [
      'Sunny', 'Rainy', 'Cloudy', 'Windy',
      'Snowy', 'Stormy', 'Hot', 'Cold',
      'Rainbow', 'Puddle', 'Sun', 'Cloud',
      'Umbrella', 'Breeze', 'Spring', 'Summer',
    ],
  },
];

export interface BingoConfig {
  title: string;
  words: string[];
  mode?: BingoCardMode;
  items?: BingoItem[];
  gridSize: 3 | 4;
  freeCenter: boolean;
  cardCount: number;
  cardsPerPage: 1 | 2;
  includeCallerSheet: boolean;
  paperSize: 'letter' | 'a4';
  seed?: number;
}

export interface GeneratedBingoBoard {
  cardNumber: number;
  cells: string[]; // row-major length gridSize * gridSize
}

export interface GeneratedBingoItemBoard {
  cardNumber: number;
  cells: BingoItem[]; // row-major length gridSize * gridSize
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

export function buildShuffledItemBoards(
  rawItems: BingoItem[],
  gridSize: 3 | 4,
  freeCenter: boolean,
  cardCount: number,
  seed = 1
): GeneratedBingoItemBoard[] {
  const cleanItems = rawItems.filter((it) => it.label.trim() || it.clipartId);
  const useFree = gridSize === 3 && freeCenter;
  const totalCells = gridSize * gridSize;
  const slotsNeeded = useFree ? totalCells - 1 : totalCells;

  const poolSource =
    cleanItems.length > 0 ? cleanItems : PICTURE_BINGO_PRESETS[0].items;
  const paddedPool = [...poolSource];
  let padIdx = 0;
  while (paddedPool.length < slotsNeeded) {
    paddedPool.push(poolSource[padIdx % poolSource.length]);
    padIdx++;
  }

  const rand = createPrng(seed * 9973 + cardCount * 31 + gridSize * 7);
  const seenSignatures = new Set<string>();
  const boards: GeneratedBingoItemBoard[] = [];

  for (let c = 0; c < cardCount; c++) {
    let picked: BingoItem[] = [];
    for (let attempt = 0; attempt < 25; attempt++) {
      picked = shuffleWithPrng(paddedPool, rand).slice(0, slotsNeeded);
      const sig = picked.map((it) => it.clipartId || it.label).join('|');
      if (!seenSignatures.has(sig) || attempt === 24) {
        seenSignatures.add(sig);
        break;
      }
    }

    const cells: BingoItem[] = [];
    let wordCursor = 0;
    for (let cellIdx = 0; cellIdx < totalCells; cellIdx++) {
      if (useFree && cellIdx === 4) {
        cells.push({ label: 'FREE' });
      } else {
        cells.push(picked[wordCursor++] || { label: '' });
      }
    }

    boards.push({
      cardNumber: c + 1,
      cells,
    });
  }

  return boards;
}

export function buildShuffledBoards(
  rawWords: string[],
  gridSize: 3 | 4,
  freeCenter: boolean,
  cardCount: number,
  seed = 1
): GeneratedBingoBoard[] {
  const cleanWords = rawWords.map((w) => w.trim()).filter(Boolean);
  const pool =
    cleanWords.length > 0
      ? cleanWords.map((w) => ({ label: w }))
      : BINGO_PRESETS[0].words.map((w) => ({ label: w }));

  return buildShuffledItemBoards(pool, gridSize, freeCenter, cardCount, seed).map(
    (board) => ({
      cardNumber: board.cardNumber,
      cells: board.cells.map((c) => c.label),
    })
  );
}

function wrapTextToLines(
  text: string,
  font: PDFFont,
  fontSize: number,
  maxWidth: number
): string[] {
  const words = text.split(' ').filter(Boolean);
  if (words.length === 0) return [''];
  const lines: string[] = [];
  let current = '';

  for (const w of words) {
    const candidate = current ? `${current} ${w}` : w;
    if (font.widthOfTextAtSize(candidate, fontSize) <= maxWidth) {
      current = candidate;
    } else {
      if (current) lines.push(current);
      current = w;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function fitCellText(
  rawText: string,
  font: PDFFont,
  maxWidth: number,
  maxHeight: number,
  startSize: number
): { lines: string[]; fontSize: number } {
  const safeText = toWinAnsiSafe(rawText) || rawText;
  for (let size = startSize; size >= 8; size -= 1) {
    const lines = wrapTextToLines(safeText, font, size, maxWidth);
    const maxLineW = Math.max(
      ...lines.map((l) => font.widthOfTextAtSize(l, size))
    );
    const totalH = lines.length * (size * 1.22);
    if (lines.length <= 3 && maxLineW <= maxWidth && totalH <= maxHeight) {
      return { lines, fontSize: size };
    }
  }
  return {
    lines: wrapTextToLines(safeText, font, 8, maxWidth).slice(0, 3),
    fontSize: 8,
  };
}

export async function generateBingoPdf(
  config: BingoConfig,
  options: {
    loadClipartBytes?: (item: ClipartItem) => Promise<Uint8Array>;
  } = {}
): Promise<Uint8Array> {
  const effectiveMode: BingoCardMode =
    config.mode ?? (config.items && config.items.length > 0 ? 'picture-word' : 'word-only');
  const sourceItems: BingoItem[] =
    effectiveMode !== 'word-only' && config.items && config.items.length > 0
      ? config.items
      : config.words.map((w) => ({ label: w }));

  const safeCount = Math.max(1, Math.min(30, Math.round(config.cardCount || 1)));
  const boards = buildShuffledItemBoards(
    sourceItems,
    config.gridSize,
    config.freeCenter,
    safeCount,
    config.seed ?? 1
  );

  const doc = await PDFDocument.create();
  doc.setTitle(toWinAnsiSafe(config.title) || 'ESL Bingo Cards - KinderESL');
  doc.setAuthor('KinderESL Educational Resources');
  doc.setCreator('KinderESL ESL Bingo Card Generator');

  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await doc.embedFont(StandardFonts.Helvetica);

  // Pre-embed unique clipart PNGs once per PDF
  const clipartImageMap = new Map<string, PDFImage>();
  if (effectiveMode !== 'word-only') {
    const loadClipart =
      options.loadClipartBytes ?? ((item) => fetchClipartBytesCached(item));
    const uniqueIds = Array.from(
      new Set(
        sourceItems
          .map((it) => it.clipartId)
          .filter((v): v is string => Boolean(v))
      )
    );
    await Promise.all(
      uniqueIds.map(async (id) => {
        const item = getClipart(id);
        if (!item) return;
        const bytes = await loadClipart(item);
        const img = await doc.embedPng(bytes);
        clipartImageMap.set(id, img);
      })
    );
  }

  const pageW = config.paperSize === 'a4' ? 595.28 : 612;
  const pageH = config.paperSize === 'a4' ? 841.89 : 792;
  const safeTitle = toWinAnsiSafe(config.title) || 'ESL Vocabulary Bingo';
  const paperLabel =
    config.paperSize === 'a4' ? 'A4 (210x297mm)' : 'US Letter (8.5x11")';

  const inkDark = rgb(0.06, 0.09, 0.16);
  const inkMuted = rgb(0.39, 0.45, 0.55);
  const tealColor = rgb(0.18, 0.42, 0.42);
  const tealSoftFill = rgb(0.94, 0.97, 0.97);
  const freeBgFill = rgb(0.9, 0.96, 0.95);
  const altCellFill = rgb(0.985, 0.99, 0.99);
  const borderColor = rgb(0.24, 0.46, 0.46);
  const cutDashColor = rgb(0.65, 0.72, 0.76);

  const slotsPerPage = config.cardsPerPage;

  for (let i = 0; i < boards.length; i += slotsPerPage) {
    const page = doc.addPage([pageW, pageH]);
    const pageBoards = boards.slice(i, i + slotsPerPage);
    const slotH = slotsPerPage === 1 ? pageH : pageH / 2;

    pageBoards.forEach((board, slotIdx) => {
      const slotTop = slotIdx * slotH;
      const marginX = 42;
      const topPad = slotsPerPage === 1 ? 46 : 26;
      const bottomPad = slotsPerPage === 1 ? 34 : 22;
      const contentW = pageW - marginX * 2;
      const toY = (yTop: number) => pageH - (slotTop + yTop);

      // Header
      const headerSize = slotsPerPage === 1 ? 22 : 16;
      page.drawText(safeTitle, {
        x: marginX,
        y: toY(topPad),
        size: headerSize,
        font: fontBold,
        color: inkDark,
      });

      const cardBadge = `Card #${board.cardNumber}`;
      const badgeW = fontBold.widthOfTextAtSize(cardBadge, 11);
      page.drawText(cardBadge, {
        x: pageW - marginX - badgeW,
        y: toY(topPad + 1),
        size: 11,
        font: fontBold,
        color: tealColor,
      });

      const accentLineY = topPad + (slotsPerPage === 1 ? 14 : 11);
      page.drawLine({
        start: { x: marginX, y: toY(accentLineY) },
        end: { x: pageW - marginX, y: toY(accentLineY) },
        thickness: 1.4,
        color: tealColor,
      });

      const gridTop = accentLineY + (slotsPerPage === 1 ? 24 : 14);
      const footerY = slotH - bottomPad;
      const availGridH = footerY - gridTop - 22;
      const gridSize = config.gridSize;
      const boardSide =
        slotsPerPage === 1
          ? Math.min(contentW, availGridH)
          : Math.min(contentW * 0.88, availGridH);
      const gridLeft = (pageW - boardSide) / 2;
      const cellSize = boardSide / gridSize;

      // Optional compact BINGO banner row tint or outer frame
      page.drawRectangle({
        x: gridLeft,
        y: toY(gridTop + boardSide),
        width: boardSide,
        height: boardSide,
        color: rgb(1, 1, 1),
        borderColor,
        borderWidth: 2,
      });

      const startFont =
        slotsPerPage === 1
          ? gridSize === 3
            ? 20
            : 16
          : gridSize === 3
          ? 14
          : 11;

      for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
          const idx = row * gridSize + col;
          const cellItem = board.cells[idx] || { label: '' };
          const label = cellItem.label || '';
          const cellImg =
            effectiveMode !== 'word-only' && cellItem.clipartId
              ? clipartImageMap.get(cellItem.clipartId)
              : undefined;
          const isFree = gridSize === 3 && config.freeCenter && idx === 4;
          const cellX = gridLeft + col * cellSize;
          const cellTop = gridTop + row * cellSize;
          const cellBottomY = toY(cellTop + cellSize);

          page.drawRectangle({
            x: cellX,
            y: cellBottomY,
            width: cellSize,
            height: cellSize,
            color: isFree
              ? freeBgFill
              : (row + col) % 2 === 1
              ? altCellFill
              : rgb(1, 1, 1),
            borderColor,
            borderWidth: 1,
          });

          if (isFree) {
            const freeText = 'FREE';
            const fSize = slotsPerPage === 1 ? 20 : 14;
            const fw = fontBold.widthOfTextAtSize(freeText, fSize);
            page.drawText(freeText, {
              x: cellX + (cellSize - fw) / 2,
              y: toY(cellTop + cellSize / 2 + fSize * 0.25),
              size: fSize,
              font: fontBold,
              color: tealColor,
            });
            const sub = 'SPACE';
            const sw = fontRegular.widthOfTextAtSize(sub, 8);
            page.drawText(sub, {
              x: cellX + (cellSize - sw) / 2,
              y: toY(cellTop + cellSize / 2 + fSize * 0.25 + 12),
              size: 8,
              font: fontRegular,
              color: tealColor,
            });
          } else if (cellImg) {
            const cellPad = slotsPerPage === 1 ? 8 : 5;
            if (effectiveMode === 'picture-only') {
              const boxW = cellSize - cellPad * 2;
              const boxH = cellSize - cellPad * 2;
              const scale = Math.min(boxW / cellImg.width, boxH / cellImg.height);
              const drawW = cellImg.width * scale;
              const drawH = cellImg.height * scale;
              page.drawImage(cellImg, {
                x: cellX + (cellSize - drawW) / 2,
                y: toY(cellTop + (cellSize + drawH) / 2),
                width: drawW,
                height: drawH,
              });
            } else {
              // picture-word: top ~70% illustration, bottom ~24% crisp label
              const labelBandH = Math.max(18, cellSize * 0.24);
              const boxW = cellSize - cellPad * 2;
              const boxH = cellSize - cellPad * 1.5 - labelBandH;
              const scale = Math.min(boxW / cellImg.width, boxH / cellImg.height);
              const drawW = cellImg.width * scale;
              const drawH = cellImg.height * scale;
              const imgTop = cellTop + cellPad * 0.75 + (boxH - drawH) / 2;
              page.drawImage(cellImg, {
                x: cellX + (cellSize - drawW) / 2,
                y: toY(imgTop + drawH),
                width: drawW,
                height: drawH,
              });

              const maxLabelFont =
                slotsPerPage === 1 ? (gridSize === 3 ? 13 : 10.5) : 9;
              const { lines, fontSize } = fitCellText(
                label,
                fontBold,
                cellSize - 10,
                labelBandH,
                maxLabelFont
              );
              const singleLine = lines[0] || '';
              const lw = fontBold.widthOfTextAtSize(singleLine, fontSize);
              page.drawText(singleLine, {
                x: cellX + (cellSize - lw) / 2,
                y: toY(cellTop + cellSize - Math.max(6, (labelBandH - fontSize) / 2)),
                size: fontSize,
                font: fontBold,
                color: inkDark,
              });
            }
          } else {
            const { lines, fontSize } = fitCellText(
              label,
              fontBold,
              cellSize - 14,
              cellSize - 14,
              startFont
            );
            const lineH = fontSize * 1.22;
            const blockH = lines.length * lineH;
            const firstBaselineTop =
              cellTop + (cellSize - blockH) / 2 + fontSize * 0.85;

            lines.forEach((lineStr, lIdx) => {
              const lw = fontBold.widthOfTextAtSize(lineStr, fontSize);
              page.drawText(lineStr, {
                x: cellX + (cellSize - lw) / 2,
                y: toY(firstBaselineTop + lIdx * lineH),
                size: fontSize,
                font: fontBold,
                color: inkDark,
              });
            });
          }
        }
      }

      // Slot footer
      const footerTxt = `Free for classroom & home use · ${paperLabel} · kinderesl.com`;
      page.drawText(footerTxt, {
        x: marginX,
        y: toY(footerY),
        size: 8.5,
        font: fontRegular,
        color: inkMuted,
      });
    });

    // Dashed horizontal cut guide when 2 cards per page
    if (slotsPerPage === 2) {
      page.drawLine({
        start: { x: 24, y: pageH / 2 },
        end: { x: pageW - 24, y: pageH / 2 },
        thickness: 0.9,
        dashArray: [6, 5],
        color: cutDashColor,
      });
    }
  }

  // Optional Teacher Caller Checklist page
  if (config.includeCallerSheet) {
    const page = doc.addPage([pageW, pageH]);
    const toY = (yTop: number) => pageH - yTop;
    const marginX = 44;

    const seenCaller = new Set<string>();
    const callerItems: BingoItem[] = [];
    for (const item of sourceItems) {
      const cleanLabel = toWinAnsiSafe(item.label);
      const key = item.clipartId || cleanLabel.toLowerCase();
      if (!key || seenCaller.has(key)) continue;
      seenCaller.add(key);
      callerItems.push({ label: cleanLabel || item.label, clipartId: item.clipartId });
    }

    page.drawText(`Teacher Caller Sheet: ${safeTitle}`, {
      x: marginX,
      y: toY(48),
      size: 18,
      font: fontBold,
      color: inkDark,
    });
    page.drawText(
      `Check off each item as you call it aloud (${callerItems.length} vocabulary items · ${safeCount} student cards).`,
      {
        x: marginX,
        y: toY(68),
        size: 10,
        font: fontRegular,
        color: inkMuted,
      }
    );
    page.drawLine({
      start: { x: marginX, y: toY(82) },
      end: { x: pageW - marginX, y: toY(82) },
      thickness: 1.5,
      color: tealColor,
    });

    const cols = 2;
    const colW = (pageW - marginX * 2 - 20) / cols;
    const rowH = 32;
    const startY = 104;

    callerItems.slice(0, 40).forEach((item, idx) => {
      const col = Math.floor(idx / 20);
      const row = idx % 20;
      const x = marginX + col * (colW + 20);
      const yTop = startY + row * rowH;

      page.drawRectangle({
        x,
        y: toY(yTop + 22),
        width: colW,
        height: 26,
        color: row % 2 === 0 ? tealSoftFill : rgb(1, 1, 1),
        borderColor: rgb(0.84, 0.89, 0.89),
        borderWidth: 0.75,
      });

      // Checkbox
      page.drawRectangle({
        x: x + 10,
        y: toY(yTop + 15),
        width: 11,
        height: 11,
        color: rgb(1, 1, 1),
        borderColor: tealColor,
        borderWidth: 1.1,
      });

      const miniImg =
        effectiveMode !== 'word-only' && item.clipartId
          ? clipartImageMap.get(item.clipartId)
          : undefined;
      let textX = x + 28;
      if (miniImg) {
        const iconMax = 18;
        const scale = Math.min(iconMax / miniImg.width, iconMax / miniImg.height);
        const iw = miniImg.width * scale;
        const ih = miniImg.height * scale;
        page.drawImage(miniImg, {
          x: x + 26 + (iconMax - iw) / 2,
          y: toY(yTop + 18 - (iconMax - ih) / 2),
          width: iw,
          height: ih,
        });
        textX = x + 50;
      }

      page.drawText(`${idx + 1}. ${item.label}`, {
        x: textX,
        y: toY(yTop + 13),
        size: 11,
        font: fontBold,
        color: inkDark,
      });
    });

    page.drawText('Free for classroom & home use · kinderesl.com', {
      x: marginX,
      y: toY(pageH - 34),
      size: 8.5,
      font: fontRegular,
      color: inkMuted,
    });
  }

  return doc.save();
}
