export function triggerPdfFileDownload(pdfUrl: string, title?: string): void {
  if (typeof window === 'undefined' || !pdfUrl) return;
  const link = document.createElement('a');
  link.href = pdfUrl;
  const fallbackName = pdfUrl.split('/').pop() || 'kinderesl-worksheet.pdf';
  link.download = title
    ? `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}.pdf`
    : fallbackName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
