const AD_PREVIEW_KEY = 'kinderesl_ad_preview';
export const AD_PREVIEW_EVENT = 'kinderesl-ad-preview-change';

export function syncAdPreviewFromUrl(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const params = new URLSearchParams(window.location.search);
    const param = params.get('adpreview');
    if (param === '1') {
      window.sessionStorage.setItem(AD_PREVIEW_KEY, '1');
      return true;
    }
    if (param === '0') {
      window.sessionStorage.removeItem(AD_PREVIEW_KEY);
      return false;
    }
    return window.sessionStorage.getItem(AD_PREVIEW_KEY) === '1';
  } catch {
    return false;
  }
}

export function disableAdPreview(): void {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.removeItem(AD_PREVIEW_KEY);
    const url = new URL(window.location.href);
    if (url.searchParams.has('adpreview')) {
      url.searchParams.delete('adpreview');
      window.history.replaceState({}, '', url.pathname + url.search + url.hash);
    }
    window.dispatchEvent(new Event(AD_PREVIEW_EVENT));
  } catch {
    // ignore
  }
}
