import manifestJson from '@/data/clipart-manifest.json';

/**
 * KinderESL clip-art library: original black line art on transparent
 * backgrounds (PNG, plus SVG for a few vector items).
 * Assets live in public/clipart/<theme>/<slug>.png and are described by
 * src/data/clipart-manifest.json. See docs/clipart.md.
 */

export type ClipartTheme =
  | 'animals'
  | 'body'
  | 'christmas'
  | 'classroom'
  | 'clothes'
  | 'farm'
  | 'feelings'
  | 'food'
  | 'helpers'
  | 'household'
  | 'nature'
  | 'routines'
  | 'shapes'
  | 'summer'
  | 'transport'
  | 'weather'
  | 'winter';

export interface ClipartItem {
  id: string;
  /** English display word for flashcards, bingo cards, and I Spy lists. */
  name: string;
  /** Primary theme (also the folder name). */
  theme: ClipartTheme;
  /** Secondary themes and keywords. */
  tags: string[];
  /** `false`, or the CVC word this picture stands for. */
  cvc: false | { word: string };
  /** PNG path relative to public/clipart. */
  file: string;
  /** SVG path relative to public/clipart, when the art is vector. */
  svg?: string;
  width: number;
  height: number;
  style: 'lineart';
  /** Near-duplicate of another item; skip it when picking one set. */
  variantOf?: string;
}

export const CLIPART_BASE_PATH = '/clipart';

const items = manifestJson as ClipartItem[];
const byId = new Map(items.map((item) => [item.id, item]));

export function getClipart(id: string): ClipartItem | undefined {
  return byId.get(id);
}

export function listClipart(options: { includeVariants?: boolean } = {}): ClipartItem[] {
  const { includeVariants = true } = options;
  return includeVariants ? [...items] : items.filter((item) => !item.variantOf);
}

export function getClipartByTheme(
  theme: ClipartTheme,
  options: { includeVariants?: boolean } = {},
): ClipartItem[] {
  const { includeVariants = false } = options;
  return items.filter(
    (item) => item.theme === theme && (includeVariants || !item.variantOf),
  );
}

/** Themes that have at least one item, in alphabetical order. */
export function listThemes(): { theme: ClipartTheme; count: number }[] {
  const counts = new Map<ClipartTheme, number>();
  for (const item of items) counts.set(item.theme, (counts.get(item.theme) ?? 0) + 1);
  return [...counts.entries()]
    .map(([theme, count]) => ({ theme, count }))
    .sort((a, b) => a.theme.localeCompare(b.theme));
}

/** Public URL path for an item's PNG (or SVG when `format` is 'svg'). */
export function clipartUrl(item: ClipartItem, format: 'png' | 'svg' = 'png'): string {
  if (format === 'svg') {
    if (!item.svg) throw new Error(`Clipart "${item.id}" has no SVG version`);
    return `${CLIPART_BASE_PATH}/${item.svg}`;
  }
  return `${CLIPART_BASE_PATH}/${item.file}`;
}

/**
 * Fetch the PNG bytes for an item, for pdf-lib embedding:
 *   const png = await pdfDoc.embedPng(await fetchClipartBytes(item));
 * In the browser the URL is relative to the site; on the server pass
 * `baseUrl` (for example the site origin).
 */
export async function fetchClipartBytes(
  item: ClipartItem,
  baseUrl = '',
): Promise<Uint8Array> {
  const res = await fetch(`${baseUrl}${clipartUrl(item)}`);
  if (!res.ok) {
    throw new Error(`Failed to load clipart "${item.id}" (${res.status})`);
  }
  return new Uint8Array(await res.arrayBuffer());
}
