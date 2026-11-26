import { PDFDocument, StandardFonts, rgb, type PDFImage } from 'pdf-lib';
import {
  fetchClipartBytesCached,
  formatClipartLabel,
  getClipart,
  type ClipartItem,
} from '@/lib/clipart';
import {
  PDF_PALETTE,
  drawStandardSheetChromePdf,
  getSheetSize,
  toWinAnsiSafe,
  type PaperSizeOption,
} from '@/lib/pdf-stroke-utils';

export type WordSearchGridSize = 6 | 8;
export type WordSearchDirectionMode = 'across-down' | 'across-only';
export type WordSearchCaseMode = 'upper' | 'lower';

export interface WordSearchPreset {
  id: string;
  label: string;
  title: string;
  clipartIds: string[];
}

export interface WordSearchConfig {
  title: string;
  clipartIds: string[];
  gridSize: WordSearchGridSize;
  directionMode: WordSearchDirectionMode;
  caseMode: WordSearchCaseMode;
  paperSize: PaperSizeOption;
  includeAnswerKey: boolean;
  seed?: number;
}

export interface WordSearchPlacement {
  clipartId: string;
  label: string;
  cleanWord: string;
  row: number;
  col: number;
  dir: 'H' | 'V';
}

export interface WordSearchLayout {
  size: number;
  grid: string[][];
  answerMask: boolean[][];
  placed: WordSearchPlacement[];
}

export const WORD_SEARCH_PRESETS: WordSearchPreset[] = [
  {
    id: 'winter',
    label: 'Winter',
    title: 'Winter Picture Word Search',
    clipartIds: ['snow', 'coat', 'boot', 'hat', 'sled', 'scarf', 'igloo', 'mitten'],
  },
  {
    id: 'farm',
    label: 'Farm Animals',
    title: 'Farm Animals Picture Word Search',
    clipartIds: ['cow', 'pig', 'duck', 'egg', 'hen', 'nest', 'horse', 'sheep'],
  },
  {
    id: 'animals',
    label: 'Animals & Bugs',
    title: 'Animals & Bugs Picture Word Search',
    clipartIds: ['ant', 'bee', 'bug', 'cat', 'dog', 'fish', 'rat', 'web'],
  },
  {
    id: 'classroom',
    label: 'Classroom',
    title: 'Classroom Objects Picture Word Search',
    clipartIds: ['bag', 'book', 'box', 'glue', 'pen', 'yarn', 'chair', 'table'],
  },
  {
    id: 'christmas',
    label: 'Christmas',
    title: 'Christmas Picture Word Search',
    clipartIds: ['bell', 'gift', 'star', 'tree', 'cocoa', 'snowman', 'mitten'],
  },
  {
    id: 'food',
    label: 'Food & Fruit',
    title: 'Food & Fruit Picture Word Search',
    clipartIds: ['bun', 'cup', 'jug', 'lid', 'pot', 'apple', 'snack', 'grapes'],
  },
  {
    id: 'body',
    label: 'Body Parts',
    title: 'Body Parts Picture Word Search',
    clipartIds: ['ear', 'eye', 'foot', 'hand', 'body', 'mouth'],
  },
  {
    id: 'feelings',
    label: 'Feelings',
    title: 'Feelings Picture Word Search',
    clipartIds: ['calm', 'sad', 'happy', 'angry', 'sleepy'],
  },
  {
    id: 'helpers',
    label: 'Helpers',
    title: 'Community Helpers Word Search',
    clipartIds: ['chef', 'doctor', 'driver', 'police', 'teacher'],
  },
  {
    id: 'cvc',
    label: 'CVC Phonics',
    title: 'CVC Phonics Picture Word Search',
    clipartIds: ['cat', 'dog', 'bat', 'bed', 'bin', 'mop', 'net', 'sun'],
  },
];

function createPrng(seed: number) {
  let s = (seed >>> 0) || 1;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

export function cleanWordSearchTerm(raw: string): string {
  return raw.toUpperCase().replace(/[^A-Z]/g, '');
}

export function buildWordSearchLayout(config: WordSearchConfig): WordSearchLayout {
  const size = config.gridSize;
  const maxWords = size === 6 ? 5 : 8;

  const candidateIds = Array.from(new Set(config.clipartIds)).filter((id) =>
    Boolean(getClipart(id))
  );
  const items = candidateIds
    .map((id) => getClipart(id)!)
    .map((item) => ({
      item,
      label: formatClipartLabel(item),
      cleanWord: cleanWordSearchTerm(item.name),
    }))
    .filter((entry) => entry.cleanWord.length >= 2 && entry.cleanWord.length <= size)
    .slice(0, maxWords);

  // Longest words first improves grid placement success
  const sorted = [...items].sort((a, b) => b.cleanWord.length - a.cleanWord.length);

  const grid: string[][] = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => '')
  );
  const answerMask: boolean[][] = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => false)
  );
  const placed: WordSearchPlacement[] = [];

  const rand = createPrng(
    (config.seed ?? 1) * 6151 + size * 97 + sorted.length * 13
  );

  const canPlace = (word: string, row: number, col: number, dir: 'H' | 'V') => {
    if (dir === 'H' && col + word.length > size) return false;
    if (dir === 'V' && row + word.length > size) return false;
    for (let i = 0; i < word.length; i++) {
      const r = dir === 'H' ? row : row + i;
      const c = dir === 'H' ? col + i : col;
      if (grid[r][c] !== '' && grid[r][c] !== word[i]) {
        return false;
      }
    }
    return true;
  };

  for (const entry of sorted) {
    const word = entry.cleanWord;
    const dirs: Array<'H' | 'V'> =
      config.directionMode === 'across-only' ? ['H'] : ['H', 'V'];
    const candidates: Array<{ row: number; col: number; dir: 'H' | 'V'; overlap: number }> = [];

    for (const dir of dirs) {
      for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
          if (!canPlace(word, r, c, dir)) continue;
          let overlap = 0;
          for (let i = 0; i < word.length; i++) {
            const rr = dir === 'H' ? r : r + i;
            const cc = dir === 'H' ? c + i : c;
            if (grid[rr][cc] === word[i]) overlap++;
          }
          candidates.push({ row: r, col: c, dir, overlap });
        }
      }
    }

    if (candidates.length === 0) continue;

    // Prefer slight variation among valid slots (prefer intersection when available)
    const maxOverlap = Math.max(...candidates.map((c) => c.overlap));
    const pool =
      maxOverlap > 0 && rand() < 0.7
        ? candidates.filter((c) => c.overlap > 0)
        : candidates;
    const chosen = pool[Math.floor(rand() * pool.length)];

    for (let i = 0; i < word.length; i++) {
      const rr = chosen.dir === 'H' ? chosen.row : chosen.row + i;
      const cc = chosen.dir === 'H' ? chosen.col + i : chosen.col;
      grid[rr][cc] = word[i];
      answerMask[rr][cc] = true;
    }

    placed.push({
      clipartId: entry.item.id,
      label: entry.label,
      cleanWord: word,
      row: chosen.row,
      col: chosen.col,
      dir: chosen.dir,
    });
  }

  // Fill empty cells using kid-friendly common letters
  const fillAlphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (!grid[r][c]) {
        grid[r][c] = fillAlphabet[Math.floor(rand() * fillAlphabet.length)];
      }
      if (config.caseMode === 'lower') {
        grid[r][c] = grid[r][c].toLowerCase();
      }
    }
  }

  // Keep placed list in stable display order matching input order
  const orderMap = new Map(items.map((it, i) => [it.item.id, i]));
  placed.sort((a, b) => (orderMap.get(a.clipartId) ?? 0) - (orderMap.get(b.clipartId) ?? 0));

  return { size, grid, answerMask, placed };
}

export function getWordSearchGeometry(paperSize: PaperSizeOption) {
  const { width: pageW, height: pageH } = getSheetSize(paperSize, 'portrait');
  const marginX = 40;
  const topHeaderY = 38;
  const bottomFooterY = pageH - 28;
  const usableW = pageW - marginX * 2;

  const gridTop = 94;
  const bankH = 166;
  const maxGridH = bottomFooterY - 16 - bankH - 16 - gridTop;
  const gridSide = Math.min(390, usableW - 24, maxGridH);
  const gridX = (pageW - gridSide) / 2;
  const bankY = gridTop + gridSide + 18;

  return {
    pageW,
    pageH,
    marginX,
    topHeaderY,
    bottomFooterY,
    usableW,
    gridX,
    gridTop,
    gridSide,
    bankY,
    bankH,
  };
}

export async function generateWordSearchPdf(
  config: WordSearchConfig,
  options: {
    loadClipartBytes?: (item: ClipartItem) => Promise<Uint8Array>;
  } = {}
): Promise<Uint8Array> {
  const loadClipart =
    options.loadClipartBytes ?? ((item) => fetchClipartBytesCached(item));
  const layout = buildWordSearchLayout(config);
  const geom = getWordSearchGeometry(config.paperSize);
  const {
    pageW,
    pageH,
    marginX,
    topHeaderY,
    bottomFooterY,
    usableW,
    gridX,
    gridTop,
    gridSide,
    bankY,
    bankH,
  } = geom;

  const doc = await PDFDocument.create();
  doc.setTitle(`${toWinAnsiSafe(config.title || 'Picture Word Search')} - KinderESL`);
  doc.setAuthor('KinderESL Educational Resources');
  doc.setCreator('KinderESL Easy Picture Word Search Maker');

  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await doc.embedFont(StandardFonts.Helvetica);

  const clipartMap = new Map<string, PDFImage>();
  await Promise.all(
    layout.placed.map(async (p) => {
      const item = getClipart(p.clipartId);
      if (!item) return;
      const bytes = await loadClipart(item);
      clipartMap.set(item.id, await doc.embedPng(bytes));
    })
  );

  const renderPage = (isAnswerKey: boolean) => {
    const page = doc.addPage([pageW, pageH]);
    const toY = (yTop: number) => pageH - yTop;
    const safeTitle = toWinAnsiSafe(config.title) || 'Picture Word Search';

    drawStandardSheetChromePdf(page, {
      pageW,
      pageH,
      marginX,
      topHeaderY,
      bottomFooterY,
      title: isAnswerKey ? `Answer Key: ${safeTitle}` : safeTitle,
      subtitle:
        config.directionMode === 'across-only'
          ? 'Find and circle each hidden word reading left to right!'
          : 'Find and circle each hidden word reading across or down!',
      paperSize: config.paperSize,
      fontBold,
      fontRegular,
    });

    const cellSize = gridSide / layout.size;
    const letterSize = layout.size === 6 ? 22 : 17;

    // Grid outer border
    page.drawRectangle({
      x: gridX,
      y: toY(gridTop + gridSide),
      width: gridSide,
      height: gridSide,
      color: PDF_PALETTE.white,
      borderColor: PDF_PALETTE.teal,
      borderWidth: 1.8,
    });

    for (let r = 0; r < layout.size; r++) {
      for (let c = 0; c < layout.size; c++) {
        const cx = gridX + c * cellSize;
        const cyTop = gridTop + r * cellSize;
        const isHit = isAnswerKey && layout.answerMask[r][c];

        page.drawRectangle({
          x: cx,
          y: toY(cyTop + cellSize),
          width: cellSize,
          height: cellSize,
          color: isHit ? rgb(0.87, 0.95, 0.94) : PDF_PALETTE.white,
          borderColor: PDF_PALETTE.tealBorder,
          borderWidth: 0.75,
        });

        const ch = layout.grid[r][c];
        const cw = fontBold.widthOfTextAtSize(ch, letterSize);
        page.drawText(ch, {
          x: cx + (cellSize - cw) / 2,
          y: toY(cyTop + cellSize / 2 + letterSize * 0.34),
          size: letterSize,
          font: fontBold,
          color: isHit ? PDF_PALETTE.teal : PDF_PALETTE.inkDark,
        });
      }
    }

    // Picture Word Bank box
    page.drawRectangle({
      x: marginX,
      y: toY(bankY + bankH),
      width: usableW,
      height: bankH,
      color: PDF_PALETTE.tealSoft,
      borderColor: PDF_PALETTE.tealBorder,
      borderWidth: 1.1,
    });

    page.drawText('PICTURE WORD BANK (CHECK OFF AS YOU FIND):', {
      x: marginX + 12,
      y: toY(bankY + 15),
      size: 8.5,
      font: fontBold,
      color: PDF_PALETTE.teal,
    });

    const cols = layout.placed.length <= 6 ? 3 : 4;
    const rows = 2;
    const padX = 12;
    const itemsTop = bankY + 26;
    const gapX = 10;
    const gapY = 10;
    const itemW = (usableW - padX * 2 - gapX * (cols - 1)) / cols;
    const itemH = (bankH - 38 - gapY * (rows - 1)) / rows;

    layout.placed.forEach((p, idx) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const ix = marginX + padX + col * (itemW + gapX);
      const iy = itemsTop + row * (itemH + gapY);

      page.drawRectangle({
        x: ix,
        y: toY(iy + itemH),
        width: itemW,
        height: itemH,
        color: PDF_PALETTE.white,
        borderColor: PDF_PALETTE.tealBorder,
        borderWidth: 0.9,
      });

      const img = clipartMap.get(p.clipartId);
      let textX = ix + 10;
      if (img) {
        const iconMax = Math.min(32, itemH - 12);
        const scale = Math.min((itemW * 0.32) / img.width, iconMax / img.height);
        const iw = img.width * scale;
        const ih = img.height * scale;
        page.drawImage(img, {
          x: ix + 8,
          y: toY(iy + itemH / 2 + ih / 2),
          width: iw,
          height: ih,
        });
        textX = ix + 8 + iw + 7;
      }

      const wordDisplay =
        config.caseMode === 'lower' ? p.cleanWord.toLowerCase() : p.cleanWord;
      let fSize = cols === 4 ? 10 : 11;
      const maxTextW = Math.max(24, ix + itemW - textX - 6);
      while (fSize > 6.5 && fontBold.widthOfTextAtSize(wordDisplay, fSize) > maxTextW) {
        fSize -= 0.5;
      }
      page.drawText(wordDisplay, {
        x: textX,
        y: toY(iy + itemH / 2 + fSize * 0.34),
        size: fSize,
        font: fontBold,
        color: PDF_PALETTE.inkDark,
      });
    });
  };

  renderPage(false);
  if (config.includeAnswerKey) {
    renderPage(true);
  }

  return doc.save();
}
