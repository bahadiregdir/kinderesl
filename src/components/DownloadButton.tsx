'use client';

import React, { useState } from 'react';
import { FileDown, Printer, Check, ShieldCheck, Sparkles } from 'lucide-react';
import { siteConfig } from '@/config/site';

interface DownloadButtonProps {
  pdfUrl: string;
  pdfTitle: string;
  pdfSize?: string;
  pageCount?: number;
}

export function DownloadButton({
  pdfUrl,
  pdfTitle,
  pdfSize = 'PDF Document',
  pageCount = 1,
}: DownloadButtonProps) {
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = async () => {
    // If AdSense Offerwall / Rewarded Ad is enabled in future:
    if (siteConfig.adsense.rewardedAdEnabled) {
      console.log('AdSense Rewarded Ad / Offerwall hook trigger point');
    }

    setDownloading(true);

    try {
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = `${pdfTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 4000);
    } catch (e) {
      console.error('Download error:', e);
    } finally {
      setDownloading(false);
    }
  };

  const handlePrint = () => {
    const printWindow = window.open(pdfUrl, '_blank');
    if (printWindow) {
      printWindow.focus();
    }
  };

  return (
    <div className="bg-[#F0F7F7] border border-[#d0e3e3] rounded-xl p-5 my-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Info left */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#2E6B6B]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>High-Resolution Printable</span>
            </span>
            <span className="text-xs text-slate-600 font-medium">({pdfSize} · {pageCount} {pageCount > 1 ? 'pages' : 'page'})</span>
          </div>
          <h4 className="text-sm font-bold text-slate-800">
            Free Download for Teachers &amp; Parents
          </h4>
          <p className="text-xs text-slate-600">
            Available in US Letter &amp; A4 formats. Ready to print in black &amp; white or full color.
          </p>
        </div>

        {/* Buttons right */}
        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleDownload}
            disabled={downloading}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-[#2E6B6B] hover:bg-[#225151] text-white text-sm font-bold shadow-xs transition-all duration-150 disabled:opacity-50 active:scale-95"
            aria-label={downloaded ? 'Downloaded' : downloading ? 'Preparing PDF' : 'Download PDF Free'}
          >
            {downloaded ? (
              <>
                <Check className="w-4 h-4 text-emerald-200" />
                <span>Downloaded!</span>
              </>
            ) : downloading ? (
              <span>Preparing PDF...</span>
            ) : (
              <>
                <FileDown className="w-4 h-4" />
                <span>Download PDF Free</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-3 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold transition-colors"
            title="Open printable PDF in new tab"
            aria-label="Print worksheet PDF"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span className="hidden sm:inline">Print</span>
          </button>
        </div>
      </div>

      {/* Classroom use badge */}
      <div className="mt-4 pt-3 border-t border-[#d0e3e3] flex items-center justify-between text-[11px] text-slate-600">
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-[#2E6B6B]" />
          <span>Free for classroom and homeschool use. No registration or credit card required.</span>
        </span>
        <span className="hidden md:inline font-medium text-[#2E6B6B]">100% Ad-Free PDF File</span>
      </div>
    </div>
  );
}
