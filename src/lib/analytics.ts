declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
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
