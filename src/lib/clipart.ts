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
  | 'fall'
  | 'farm'
  | 'feelings'
  | 'food'
  | 'halloween'
  | 'helpers'
  | 'household'
  | 'nature'
  | 'routines'
  | 'shapes'
  | 'spring'
  | 'summer'
  | 'transport'
  | 'valentines'
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

export const CLIPART_COUNT = items.length;
export const CLIPART_THEME_COUNT = new Set(items.map((item) => item.theme)).size;

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

const bytesCache = new Map<string, Promise<Uint8Array>>();

/** Cached browser/client loader so repeated cards fetch each PNG only once. */
export async function fetchClipartBytesCached(
  item: ClipartItem,
  baseUrl = '',
): Promise<Uint8Array> {
  const key = `${baseUrl}|${item.id}`;
  const cached = bytesCache.get(key);
  if (cached) return cached;

  const promise = fetchClipartBytes(item, baseUrl).catch((err) => {
    bytesCache.delete(key);
    throw err;
  });
  bytesCache.set(key, promise);
  return promise;
}

export function getClipartByThemeOrTag(
  themeOrTag: string,
  options: { includeVariants?: boolean } = {},
): ClipartItem[] {
  const { includeVariants = false } = options;
  return items.filter(
    (item) =>
      (includeVariants || !item.variantOf) &&
      (item.theme === themeOrTag || item.tags.includes(themeOrTag)),
  );
}

export function listCvcClipart(
  options: { includeVariants?: boolean } = {},
): ClipartItem[] {
  const { includeVariants = false } = options;
  return items.filter(
    (item) => item.cvc !== false && (includeVariants || !item.variantOf),
  );
}

export function searchClipart(
  query: string,
  options: { theme?: string; includeVariants?: boolean } = {},
): ClipartItem[] {
  const { theme, includeVariants = false } = options;
  const q = query.trim().toLowerCase();

  return items.filter((item) => {
    if (!includeVariants && item.variantOf) return false;
    if (theme && theme !== 'all') {
      if (theme === 'cvc') {
        if (item.cvc === false) return false;
      } else if (item.theme !== theme && !item.tags.includes(theme)) {
        return false;
      }
    }
    if (!q) return true;
    return (
      item.name.toLowerCase().includes(q) ||
      item.id.toLowerCase().includes(q) ||
      item.theme.toLowerCase().includes(q) ||
      item.tags.some((t) => t.toLowerCase().includes(q)) ||
      (item.cvc !== false && item.cvc.word.toLowerCase().includes(q))
    );
  });
}

export function formatClipartLabel(item: ClipartItem): string {
  return item.name
    .split(/\s+/)
    .map((part) => (part ? part.charAt(0).toUpperCase() + part.slice(1) : part))
    .join(' ');
}
