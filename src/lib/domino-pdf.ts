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

export type DominoGameMode =
  | 'dominoes'
  | 'memory-picture-word'
  | 'memory-picture-picture';
export type DominoLetterCase = 'title' | 'lower' | 'upper';

export interface DominoPreset {
  id: string;
  label: string;
  title: string;
  clipartIds: string[];
}

export interface DominoConfig {
  title: string;
  clipartIds: string[];
  mode: DominoGameMode;
  letterCase: DominoLetterCase;
  paperSize: PaperSizeOption;
  showCutLines: boolean;
  includeAnswerKeyOrBacks: boolean;
  seed?: number;
}

export interface DominoTile {
  index: number;
  leftClipartId: string;
  leftWord: string;
  rightClipartId: string;
  rightWord: string;
}

export interface MemoryCard {
  id: string;
  clipartId: string;
  kind: 'picture' | 'word' | 'picture-labeled';
  label: string;
}

function idsFromTheme(key: string, limit = 8): string[] {
  return getClipartByThemeOrTag(key)
    .slice(0, limit)
    .map((i) => i.id);
}

export const DOMINO_PRESETS: DominoPreset[] = [
  {
    id: 'farm',
    label: 'Farm Animals (8)',
    title: 'Farm Animals Picture Dominoes',
    clipartIds: idsFromTheme('farm', 8),
  },
  {
    id: 'winter',
    label: 'Winter (8)',
    title: 'Winter Picture Dominoes',
    clipartIds: getClipartByThemeOrTag('winter')
      .filter((i) => i.theme === 'winter')
      .slice(0, 8)
      .map((i) => i.id),
  },
  {
    id: 'halloween',
    label: 'Halloween (8)',
    title: 'Halloween Picture Dominoes',
    clipartIds: idsFromTheme('halloween', 8),
  },
  {
    id: 'fall',
    label: 'Fall (8)',
    title: 'Fall & Autumn Picture Dominoes',
    clipartIds: idsFromTheme('fall', 8),
  },
  {
    id: 'christmas',
    label: 'Christmas (8)',
    title: 'Christmas Picture Dominoes',
    clipartIds: idsFromTheme('christmas', 8),
  },
  {
    id: 'spring',
    label: 'Spring (8)',
    title: 'Spring Picture Dominoes',
    clipartIds: idsFromTheme('spring', 8),
  },
  {
    id: 'valentines',
    label: "Valentine's (8)",
    title: "Valentine's Day Picture Dominoes",
    clipartIds: idsFromTheme('valentines', 8),
  },
  {
    id: 'summer',
    label: 'Summer (8)',
    title: 'Summer Picture Dominoes',
    clipartIds: idsFromTheme('summer', 8),
  },
  {
    id: 'animals',
    label: 'Animals & Bugs (8)',
    title: 'Animals Picture Dominoes',
    clipartIds: idsFromTheme('animals', 8),
  },
  {
    id: 'food',
    label: 'Food (8)',
    title: 'Food Picture Dominoes',
    clipartIds: idsFromTheme('food', 8),
  },
  {
    id: 'classroom',
    label: 'Classroom (8)',
    title: 'Classroom Picture Dominoes',
    clipartIds: idsFromTheme('classroom', 8),
  },
  {
    id: 'weather',
    label: 'Weather (8)',
    title: 'Weather Picture Dominoes',
    clipartIds: idsFromTheme('weather', 8),
  },
  {
    id: 'transport',
    label: 'Transport (8)',
    title: 'Transportation Picture Dominoes',
    clipartIds: idsFromTheme('transport', 8),
  },
  {
    id: 'clothes',
    label: 'Clothes (8)',
    title: 'Clothes Picture Dominoes',
    clipartIds: idsFromTheme('clothes', 8),
  },
  {
    id: 'nature',
    label: 'Nature (8)',
    title: 'Nature Picture Dominoes',
    clipartIds: idsFromTheme('nature', 8),
  },
  {
    id: 'body',
    label: 'Body Parts (6)',
    title: 'Body Parts Picture Dominoes',
    clipartIds: idsFromTheme('body', 6),
  },
  {
    id: 'feelings',
    label: 'Feelings (6)',
    title: 'Feelings Picture Dominoes',
    clipartIds: idsFromTheme('feelings', 6),
  },
  {
    id: 'helpers',
    label: 'Helpers (6)',
    title: 'Community Helpers Picture Dominoes',
    clipartIds: idsFromTheme('helpers', 6),
  },
  {
    id: 'routines',
    label: 'Routines (6)',
    title: 'Daily Routines Picture Dominoes',
    clipartIds: idsFromTheme('routines', 6),
  },
  {
    id: 'cvc',
    label: 'CVC Words (8)',
    title: 'CVC Words Picture Dominoes',
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

export function formatDominoWord(raw: string, letterCase: DominoLetterCase): string {
  const clean = toWinAnsiSafe(raw);
  if (letterCase === 'upper') return clean.toUpperCase();
  if (letterCase === 'lower') return clean.toLowerCase();
  return clean;
}

export function buildDominoTiles(config: DominoConfig): DominoTile[] {
  const valid = Array.from(new Set(config.clipartIds))
    .filter((id) => Boolean(getClipart(id)))
    .slice(0, 16);
  const pool =
    valid.length >= 6
      ? valid
      : Array.from(new Set([...valid, ...DOMINO_PRESETS[0].clipartIds])).slice(0, 8);

  const rand = createPrng((config.seed ?? 1) * 4099 + pool.length * 61);
  const loopOrder = shuffleWithPrng(pool, rand);

  const tiles: DominoTile[] = loopOrder.map((leftId, idx) => {
    const rightId = loopOrder[(idx + 1) % loopOrder.length];
    const leftItem = getClipart(leftId);
    const rightItem = getClipart(rightId);
    return {
      index: idx,
      leftClipartId: leftId,
      leftWord: formatDominoWord(leftItem ? formatClipartLabel(leftItem) : leftId, config.letterCase),
      rightClipartId: rightId,
      rightWord: formatDominoWord(rightItem ? formatClipartLabel(rightItem) : rightId, config.letterCase),
    };
  });

  // Shuffle presentation order so adjacent cards do not sit sequentially on page
  return shuffleWithPrng(tiles, rand);
}

export function buildMemoryCards(config: DominoConfig): MemoryCard[] {
  const valid = Array.from(new Set(config.clipartIds))
    .filter((id) => Boolean(getClipart(id)))
    .slice(0, 12);
  const pool =
    valid.length >= 4
      ? valid
      : Array.from(new Set([...valid, ...DOMINO_PRESETS[0].clipartIds])).slice(0, 6);

  const rand = createPrng((config.seed ?? 1) * 6271 + pool.length * 53);
  const deck: MemoryCard[] = [];

  for (const id of pool) {
    const item = getClipart(id);
    const word = formatDominoWord(item ? formatClipartLabel(item) : id, config.letterCase);
    if (config.mode === 'memory-picture-word') {
      deck.push({ id: `${id}-pic`, clipartId: id, kind: 'picture', label: word });
      deck.push({ id: `${id}-word`, clipartId: id, kind: 'word', label: word });
    } else {
      deck.push({ id: `${id}-a`, clipartId: id, kind: 'picture-labeled', label: word });
      deck.push({ id: `${id}-b`, clipartId: id, kind: 'picture-labeled', label: word });
    }
  }

  return shuffleWithPrng(deck, rand);
}

function fitFontSize(
  text: string,
  font: { widthOfTextAtSize: (t: string, s: number) => number },
  maxWidth: number,
  maxSize: number,
  minSize = 9
): { text: string; size: number } {
  const clean = toWinAnsiSafe(text);
  let size = maxSize;
  while (size > minSize && font.widthOfTextAtSize(clean, size) > maxWidth) {
    size -= 0.5;
  }
  return { text: clean, size };
}

export async function generateDominoPdf(
  config: DominoConfig,
  options: {
    loadClipartBytes?: (item: ClipartItem) => Promise<Uint8Array>;
  } = {}
): Promise<Uint8Array> {
  const loadClipart =
    options.loadClipartBytes ?? ((item) => fetchClipartBytesCached(item));

  const doc = await PDFDocument.create();
  doc.setTitle(`${toWinAnsiSafe(config.title || 'Picture Dominoes & Memory')} - KinderESL`);
  doc.setAuthor('KinderESL Educational Resources');
  doc.setCreator('KinderESL Dominoes & Memory Match Maker');

  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await doc.embedFont(StandardFonts.Helvetica);

  const tiles = config.mode === 'dominoes' ? buildDominoTiles(config) : [];
  const memoryCards = config.mode !== 'dominoes' ? buildMemoryCards(config) : [];

  const neededIds = new Set<string>();
  for (const t of tiles) {
    neededIds.add(t.leftClipartId);
    neededIds.add(t.rightClipartId);
  }
  for (const c of memoryCards) {
    neededIds.add(c.clipartId);
  }

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
  const topHeaderY = 38;
  const bottomFooterY = pageH - 28;
  const usableW = pageW - marginX * 2;
  const gridTop = 90;
  const usableH = bottomFooterY - 18 - gridTop;
  const safeTitle = toWinAnsiSafe(config.title) || 'ESL Picture Game';

  if (config.mode === 'dominoes') {
    const cols = 2;
    const rows = 4;
    const perPage = cols * rows;
    const colGap = 20;
    const rowGap = 16;
    const tileW = (usableW - colGap) / cols;
    const tileH = (usableH - rowGap * (rows - 1)) / rows;
    const totalPages = Math.ceil(tiles.length / perPage);

    for (let p = 0; p < totalPages; p++) {
      const page = doc.addPage([pageW, pageH]);
      const pageTiles = tiles.slice(p * perPage, (p + 1) * perPage);
      drawStandardSheetChromePdf(page, {
        pageW,
        pageH,
        marginX,
        topHeaderY,
        bottomFooterY,
        title: totalPages > 1 ? `${safeTitle} (${p + 1}/${totalPages})` : safeTitle,
        subtitle: 'Cut along dashed guides and connect each English word to its matching picture!',
        paperSize: config.paperSize,
        fontBold,
        fontRegular,
      });

      pageTiles.forEach((tile, idx) => {
        const c = idx % cols;
        const r = Math.floor(idx / cols);
        const tx = marginX + c * (tileW + colGap);
        const ty = gridTop + r * (tileH + rowGap);

        if (config.showCutLines) {
          page.drawRectangle({
            x: tx - 4,
            y: toY(ty + tileH + 4),
            width: tileW + 8,
            height: tileH + 8,
            borderColor: rgb(0.68, 0.75, 0.78),
            borderWidth: 0.75,
            borderDashArray: [4, 3],
          });
        }

        page.drawRectangle({
          x: tx,
          y: toY(ty + tileH),
          width: tileW,
          height: tileH,
          color: PDF_PALETTE.white,
          borderColor: PDF_PALETTE.teal,
          borderWidth: 1.6,
        });

        // Vertical center bar splitting left picture & right word
        const midX = tx + tileW / 2;
        page.drawLine({
          start: { x: midX, y: toY(ty + 8) },
          end: { x: midX, y: toY(ty + tileH - 8) },
          thickness: 1.6,
          color: PDF_PALETTE.teal,
        });

        // Subtle soft tint behind word side
        page.drawRectangle({
          x: midX + 1.5,
          y: toY(ty + tileH - 1.5),
          width: tileW / 2 - 3,
          height: tileH - 3,
          color: rgb(0.97, 0.99, 0.99),
        });

        // Left illustration
        const img = imageMap.get(tile.leftClipartId);
        if (img) {
          const pad = 12;
          const availW = tileW / 2 - pad * 2;
          const availH = tileH - pad * 2;
          const sc = Math.min(availW / img.width, availH / img.height);
          const dw = img.width * sc;
          const dh = img.height * sc;
          page.drawImage(img, {
            x: tx + (tileW / 2 - dw) / 2,
            y: toY(ty + (tileH - dh) / 2 + dh),
            width: dw,
            height: dh,
          });
        }

        // Right bold word
        const { text, size } = fitFontSize(
          tile.rightWord,
          fontBold,
          tileW / 2 - 18,
          17,
          9
        );
        const tw = fontBold.widthOfTextAtSize(text, size);
        page.drawText(text, {
          x: midX + (tileW / 2 - tw) / 2,
          y: toY(ty + tileH / 2 + size * 0.34),
          size,
          font: fontBold,
          color: PDF_PALETTE.inkDark,
        });
      });
    }

    // Optional Teacher Loop Answer Key page
    if (config.includeAnswerKeyOrBacks) {
      const page = doc.addPage([pageW, pageH]);
      drawStandardSheetChromePdf(page, {
        pageW,
        pageH,
        marginX,
        topHeaderY,
        bottomFooterY,
        title: `${safeTitle} - Loop Key`,
        subtitle: 'All dominoes form one closed loop! Check any student chain using this sequence.',
        paperSize: config.paperSize,
        fontBold,
        fontRegular,
      });

      // Sort back into cyclic order 0..N-1
      const ordered = [...tiles].sort((a, b) => a.index - b.index);
      const rowH = 34;
      ordered.forEach((tile, idx) => {
        const y = gridTop + 10 + idx * rowH;
        page.drawRectangle({
          x: marginX,
          y: toY(y + rowH - 6),
          width: usableW,
          height: rowH - 6,
          color: idx % 2 === 0 ? PDF_PALETTE.tealSoft : PDF_PALETTE.white,
          borderColor: PDF_PALETTE.tealBorder,
          borderWidth: 0.75,
        });
        const lineText = `${idx + 1}.  [Picture: ${tile.leftWord}]   -->   Word: "${tile.rightWord}"`;
        page.drawText(toWinAnsiSafe(lineText), {
          x: marginX + 14,
          y: toY(y + 18),
          size: 10.5,
          font: fontBold,
          color: PDF_PALETTE.inkDark,
        });
      });

      const note = `Total cards: ${ordered.length}  |  Paper: ${getPaperLabel(config.paperSize)}`;
      const nw = fontRegular.widthOfTextAtSize(note, 9);
      page.drawText(note, {
        x: (pageW - nw) / 2,
        y: toY(gridTop + 26 + ordered.length * rowH),
        size: 9,
        font: fontRegular,
        color: PDF_PALETTE.inkMuted,
      });
    }
  } else {
    // Memory Match cards (3 cols x 4 rows = 12 per page)
    const cols = 3;
    const rows = 4;
    const perPage = cols * rows;
    const gap = 14;
    const cardW = (usableW - gap * (cols - 1)) / cols;
    const cardH = (usableH - gap * (rows - 1)) / rows;
    const totalPages = Math.ceil(memoryCards.length / perPage);

    for (let p = 0; p < totalPages; p++) {
      const page = doc.addPage([pageW, pageH]);
      const pageCards = memoryCards.slice(p * perPage, (p + 1) * perPage);
      drawStandardSheetChromePdf(page, {
        pageW,
        pageH,
        marginX,
        topHeaderY,
        bottomFooterY,
        title: totalPages > 1 ? `${safeTitle} (${p + 1}/${totalPages})` : safeTitle,
        subtitle:
          config.mode === 'memory-picture-word'
            ? 'Cut along guides. Place face down and match each picture card to its English word!'
            : 'Cut along guides. Place face down and flip pairs of matching pictures!',
        paperSize: config.paperSize,
        fontBold,
        fontRegular,
      });

      pageCards.forEach((card, idx) => {
        const c = idx % cols;
        const r = Math.floor(idx / cols);
        const cx = marginX + c * (cardW + gap);
        const cy = gridTop + r * (cardH + gap);

        if (config.showCutLines) {
          page.drawRectangle({
            x: cx - 3,
            y: toY(cy + cardH + 3),
            width: cardW + 6,
            height: cardH + 6,
            borderColor: rgb(0.68, 0.75, 0.78),
            borderWidth: 0.75,
            borderDashArray: [4, 3],
          });
        }

        page.drawRectangle({
          x: cx,
          y: toY(cy + cardH),
          width: cardW,
          height: cardH,
          color: PDF_PALETTE.white,
          borderColor: PDF_PALETTE.teal,
          borderWidth: 1.5,
        });

        if (card.kind === 'word') {
          page.drawRectangle({
            x: cx + 6,
            y: toY(cy + cardH - 6),
            width: cardW - 12,
            height: cardH - 12,
            color: PDF_PALETTE.tealSoft,
          });
          const { text, size } = fitFontSize(card.label, fontBold, cardW - 22, 20, 10);
          const tw = fontBold.widthOfTextAtSize(text, size);
          page.drawText(text, {
            x: cx + (cardW - tw) / 2,
            y: toY(cy + cardH / 2 + size * 0.34),
            size,
            font: fontBold,
            color: PDF_PALETTE.inkDark,
          });
        } else {
          const img = imageMap.get(card.clipartId);
          const labelRoom = card.kind === 'picture-labeled' ? 24 : 0;
          if (img) {
            const pad = 10;
            const availW = cardW - pad * 2;
            const availH = cardH - pad * 2 - labelRoom;
            const sc = Math.min(availW / img.width, availH / img.height);
            const dw = img.width * sc;
            const dh = img.height * sc;
            page.drawImage(img, {
              x: cx + (cardW - dw) / 2,
              y: toY(cy + pad + (availH - dh) / 2 + dh),
              width: dw,
              height: dh,
            });
          }
          if (card.kind === 'picture-labeled') {
            const { text, size } = fitFontSize(card.label, fontBold, cardW - 16, 12, 8);
            const tw = fontBold.widthOfTextAtSize(text, size);
            page.drawText(text, {
              x: cx + (cardW - tw) / 2,
              y: toY(cy + cardH - 8),
              size,
              font: fontBold,
              color: PDF_PALETTE.teal,
            });
          }
        }
      });
    }

    // Optional patterned Card Backs page aligned to the exact 3x4 grid
    if (config.includeAnswerKeyOrBacks) {
      const page = doc.addPage([pageW, pageH]);
      drawStandardSheetChromePdf(page, {
        pageW,
        pageH,
        marginX,
        topHeaderY,
        bottomFooterY,
        title: `${safeTitle} - Card Backs`,
        subtitle: 'Print double-sided (flip on long edge) so cards stay opaque when placed face down.',
        paperSize: config.paperSize,
        fontBold,
        fontRegular,
      });

      for (let idx = 0; idx < perPage; idx++) {
        const c = idx % cols;
        const r = Math.floor(idx / cols);
        const cx = marginX + c * (cardW + gap);
        const cy = gridTop + r * (cardH + gap);

        page.drawRectangle({
          x: cx,
          y: toY(cy + cardH),
          width: cardW,
          height: cardH,
          color: PDF_PALETTE.tealSoft,
          borderColor: PDF_PALETTE.teal,
          borderWidth: 1.5,
        });
        page.drawRectangle({
          x: cx + 8,
          y: toY(cy + cardH - 8),
          width: cardW - 16,
          height: cardH - 16,
          borderColor: PDF_PALETTE.teal,
          borderWidth: 0.9,
          borderDashArray: [3, 3],
        });
        const mark = 'KinderESL';
        const mw = fontBold.widthOfTextAtSize(mark, 12);
        page.drawText(mark, {
          x: cx + (cardW - mw) / 2,
          y: toY(cy + cardH / 2 + 4),
          size: 12,
          font: fontBold,
          color: PDF_PALETTE.teal,
        });
      }
    }
  }

  return doc.save();
}
