declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

const TOOL_EVENT_TO_SLUG: Record<string, string> = {
  name_tracing_pdf_download: 'name-tracing',
  name_tracing_pdf_print: 'name-tracing',
  letter_tracing_pdf_download: 'letter-tracing',
  letter_tracing_pdf_print: 'letter-tracing',
  number_tracing_pdf_download: 'number-tracing',
  number_tracing_pdf_print: 'number-tracing',
  handwriting_maker_pdf_download: 'handwriting-maker',
  handwriting_maker_pdf_print: 'handwriting-maker',
  flashcard_maker_pdf_download: 'flashcard-maker',
  flashcard_maker_pdf_print: 'flashcard-maker',
  i_spy_pdf_download: 'i-spy-maker',
  i_spy_pdf_print: 'i-spy-maker',
  matching_maker_pdf_download: 'matching-maker',
  matching_maker_pdf_print: 'matching-maker',
  word_search_pdf_download: 'word-search-maker',
  word_search_pdf_print: 'word-search-maker',
  clip_cards_pdf_download: 'clip-cards-maker',
  clip_cards_pdf_print: 'clip-cards-maker',
  bingo_pdf_download: 'bingo-maker',
  bingo_pdf_print: 'bingo-maker',
  pattern_pdf_download: 'pattern-maker',
  pattern_pdf_print: 'pattern-maker',
  mini_book_pdf_download: 'mini-book-maker',
  mini_book_pdf_print: 'mini-book-maker',
  domino_pdf_download: 'domino-maker',
  domino_pdf_print: 'domino-maker',
};

function postAnalyticsEvent(payload: Record<string, unknown>): void {
  if (typeof window === 'undefined') return;
  try {
    const json = JSON.stringify(payload);
    if (
      typeof navigator !== 'undefined' &&
      typeof navigator.sendBeacon === 'function'
    ) {
      try {
        const blob = new Blob([json], { type: 'text/plain;charset=UTF-8' });
        if (navigator.sendBeacon('/api/analytics/event', blob)) {
          return;
        }
      } catch {
        // Fallback to keepalive fetch below
      }
    }
    fetch('/api/analytics/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: json,
      keepalive: true,
    }).catch(() => {});
  } catch {
    // Analytics should never break interactive UI
  }
}

export function recordWorksheetDownloadInDb(slug: string): void {
  if (!slug) return;
  postAnalyticsEvent({ type: 'download', slug });
}

export function trackEvent(
  eventName: string,
  params?: Record<string, string | number | boolean>
): void {
  if (typeof window === 'undefined') return;
  try {
    const payload = params || {};
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, payload);
    }
    if (!Array.isArray(window.dataLayer)) {
      window.dataLayer = [];
    }
    window.dataLayer.push({
      event: eventName,
      ...payload,
    });

    const toolSlug = TOOL_EVENT_TO_SLUG[eventName];
    if (toolSlug) {
      postAnalyticsEvent({ type: 'tool_download', slug: toolSlug });
    }
  } catch {
    // Analytics should never break interactive UI
  }
}

export function trackPdfDownload(input: {
  slug: string;
  title: string;
  subject: string;
  pages: number;
  paperSize: 'letter' | 'a4';
  fileName: string;
  source: 'modal' | 'modal_retry' | 'lesson_pack' | 'lesson_pack_all';
}): void {
  trackEvent('pdf_download', {
    worksheet_slug: input.slug,
    worksheet_title: input.title,
    worksheet_subject: input.subject,
    paper_size: input.paperSize,
    pages: input.pages,
    file_name: input.fileName,
    file_extension: 'pdf',
    download_source: input.source,
  });
}
