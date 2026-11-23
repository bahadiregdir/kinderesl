export const DEFAULT_OG_IMAGE = {
  url: '/images/og-default.jpg',
  width: 1200,
  height: 630,
  alt: 'KinderESL Free Printable Preschool & ESL Worksheets',
} as const;

const DESCRIPTIVE_PREFIX_RE =
  /letter|phonics|count|number|shape|color|animal|winter|farm|flashcard|tracing|match|cut|bingo|card|chart|pack|worksheet|circle|weather|feeling|body|classroom|schedule|helper|valentine|command|sound|theme|topic/i;

/**
 * Normalizes a page title so that when combined with " | KinderESL" (+12 chars),
 * the full <title> stays <= 60 chars (and always <= 65 chars).
 */
export function buildSeoTitle(rawTitle: string, maxInner = 48): string {
  const clean = rawTitle.replace(/\s+/g, ' ').trim();
  if (clean.length <= maxInner) {
    return clean;
  }

  const colonIdx = clean.indexOf(':');
  if (colonIdx !== -1) {
    const before = clean.slice(0, colonIdx).trim();
    const after = clean.slice(colonIdx + 1).trim();

    if (
      before.length >= 16 &&
      before.length <= maxInner &&
      DESCRIPTIVE_PREFIX_RE.test(before)
    ) {
      return before;
    }

    if (after.length >= 16 && after.length <= maxInner) {
      return after;
    }
  }

  const slice = clean.slice(0, maxInner);
  const lastSpace = slice.lastIndexOf(' ');
  const trimmed =
    lastSpace >= 16 ? slice.slice(0, lastSpace) : slice;
  return trimmed.replace(/[:;,.\-–—&]+$/g, '').trim();
}

/**
 * Clamps or expands a meta description cleanly into the 70-160 character target range.
 */
export function buildSeoDescription(
  rawDescription: string,
  minLen = 70,
  maxLen = 158
): string {
  let text = rawDescription.replace(/\s+/g, ' ').trim();

  if (text.length > maxLen) {
    const windowStr = text.slice(0, maxLen);
    const lastPeriod = Math.max(
      windowStr.lastIndexOf('. '),
      windowStr.lastIndexOf('! '),
      windowStr.lastIndexOf('? '),
      windowStr.endsWith('.') ? windowStr.length - 1 : -1
    );

    if (lastPeriod >= minLen - 1) {
      text = text.slice(0, lastPeriod + 1).trim();
    } else {
      const slice = text.slice(0, maxLen - 1);
      const lastSpace = slice.lastIndexOf(' ');
      const cut = lastSpace >= minLen - 10 ? slice.slice(0, lastSpace) : slice;
      text = `${cut.replace(/[,;:\-–—.]+$/g, '').trim()}.`;
    }
  }

  if (text.length < minLen) {
    const base = /[.!?]$/.test(text) ? text : `${text}.`;
    const expanded = `${base} Free printable PDF in US Letter & A4 for preschool and ESL.`;
    if (expanded.length <= maxLen) {
      text = expanded;
    } else {
      const slice = expanded.slice(0, maxLen - 1);
      const lastSpace = slice.lastIndexOf(' ');
      text = `${(lastSpace >= minLen ? slice.slice(0, lastSpace) : slice)
        .replace(/[,;:\-–—.]+$/g, '')
        .trim()}.`;
    }
  }

  return text;
}
