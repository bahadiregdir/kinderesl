'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Worksheet } from '@/types/worksheet';
import { AdUnit } from '@/components/AdUnit';
import { triggerPdfFileDownload } from '@/lib/download-helper';
import { trackEvent, trackPdfDownload } from '@/lib/analytics';
import { siteConfig } from '@/config/site';
import { useLessonPack } from '@/context/LessonPackContext';
import {
  X,
  FileDown,
  Printer,
  CheckCircle2,
  FolderHeart,
  Check,
  Sparkles,
  ArrowRight,
  Plus,
} from 'lucide-react';

interface PreDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  worksheet: Worksheet;
  relatedWorksheets: Worksheet[];
  paperSize?: 'letter' | 'a4';
  onPaperSizeChange?: (size: 'letter' | 'a4') => void;
}

export function PreDownloadModal({
  isOpen,
  onClose,
  worksheet,
  relatedWorksheets,
  paperSize: controlledPaperSize,
  onPaperSizeChange,
}: PreDownloadModalProps) {
  const initialSeconds = siteConfig.adsense.rewardedAdEnabled !== false ? 3 : 0;
  const [countdown, setCountdown] = useState(initialSeconds);
  const [downloadStarted, setDownloadStarted] = useState(false);
  const [internalPaperSize, setInternalPaperSize] = useState<'letter' | 'a4'>('letter');
  const paperSize = controlledPaperSize ?? internalPaperSize;
  const setPaperSize = (next: 'letter' | 'a4') => {
    setInternalPaperSize(next);
    onPaperSizeChange?.(next);
  };
  const { hasItem, toggleItem } = useLessonPack();
  const downloadRecordedRef = useRef(false);

  const recordDownloadInDb = useCallback(() => {
    if (downloadRecordedRef.current) return;
    downloadRecordedRef.current = true;
    fetch('/api/analytics/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'download', slug: worksheet.slug }),
      keepalive: true,
    }).catch(() => {});
  }, [worksheet.slug]);

  const activePdfUrl =
    paperSize === 'a4' ? `/api/pdf/a4?slug=${worksheet.slug}` : worksheet.pdfPath;
  const activeDownloadTitle =
    paperSize === 'a4' ? `${worksheet.title} a4` : worksheet.title;
  const paperFormatLabel = paperSize === 'a4' ? 'A4 PDF (210×297mm)' : 'US Letter PDF';

  useEffect(() => {
    if (!isOpen) {
      setCountdown(initialSeconds);
      setDownloadStarted(false);
      downloadRecordedRef.current = false;
      return;
    }

    setCountdown(initialSeconds);
    setDownloadStarted(false);
    downloadRecordedRef.current = false;

    if (initialSeconds === 0) {
      return;
    }

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, worksheet.slug, initialSeconds]);

  useEffect(() => {
    if (isOpen && countdown === 0 && !downloadStarted) {
      setDownloadStarted(true);
      triggerPdfFileDownload(activePdfUrl, activeDownloadTitle);
      trackPdfDownload({
        slug: worksheet.slug,
        title: worksheet.title,
        subject: worksheet.subject,
        pages: worksheet.pages,
        paperSize,
        fileName: `${worksheet.slug}${paperSize === 'a4' ? '-a4' : ''}.pdf`,
        source: 'modal',
      });
      recordDownloadInDb();
    }
  }, [
    isOpen,
    countdown,
    downloadStarted,
    worksheet,
    activePdfUrl,
    activeDownloadTitle,
    paperSize,
    recordDownloadInDb,
  ]);

  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const progressPct =
    initialSeconds === 0 ? 100 : ((initialSeconds - countdown) / initialSeconds) * 100;
  const inPack = hasItem(worksheet.slug);

  const handlePrint = () => {
    trackEvent('worksheet_print', { slug: worksheet.slug, subject: worksheet.subject, paperSize });
    recordDownloadInDb();
    const win = window.open(activePdfUrl, '_blank');
    if (win) win.focus();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="predownload-modal-title"
    >
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Top bar */}
        <div className="px-6 py-4 bg-[#F0F7F7] border-b border-[#d0e3e3] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <Sparkles className="w-4 h-4 text-[#2E6B6B] shrink-0" />
            <h2
              id="predownload-modal-title"
              className="text-sm sm:text-base font-bold text-slate-900 font-heading truncate"
            >
              {downloadStarted ? 'Your PDF download has started!' : 'Preparing your printable PDF...'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close download modal"
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-white/70 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Paper Format Toggle inside modal */}
          <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200 text-[11px]">
            <span className="font-bold text-slate-600 pl-1.5">Paper size:</span>
            <div className="grid grid-cols-2 gap-1 bg-white p-0.5 rounded-lg border border-slate-200">
              <button
                type="button"
                onClick={() => setPaperSize('letter')}
                className={`px-2.5 py-1 rounded-md font-bold transition-colors ${
                  paperSize === 'letter'
                    ? 'bg-[#2E6B6B] text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                US Letter (8.5×11&quot;)
              </button>
              <button
                type="button"
                onClick={() => setPaperSize('a4')}
                className={`px-2.5 py-1 rounded-md font-bold transition-colors ${
                  paperSize === 'a4'
                    ? 'bg-[#2E6B6B] text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                A4 (210×297mm)
              </button>
            </div>
          </div>

          {/* Worksheet Summary + Countdown / Status */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-700 truncate pr-3">{worksheet.title}</span>
              <span className="text-[#2E6B6B] shrink-0">
                {downloadStarted ? 'Ready' : `${countdown}s remaining`}
              </span>
            </div>

            {/* Animated Progress Bar */}
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/70">
              <div
                className="h-full bg-[#2E6B6B] transition-all duration-700 ease-out rounded-full"
                style={{ width: `${downloadStarted ? 100 : Math.max(15, progressPct)}%` }}
              />
            </div>

            {downloadStarted ? (
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {worksheet.pages} {worksheet.pages > 1 ? 'pages' : 'page'} · {worksheet.pdfFileSize} {paperFormatLabel}
                  </span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    triggerPdfFileDownload(activePdfUrl, activeDownloadTitle);
                    trackPdfDownload({
                      slug: worksheet.slug,
                      title: worksheet.title,
                      subject: worksheet.subject,
                      pages: worksheet.pages,
                      paperSize,
                      fileName: `${worksheet.slug}${paperSize === 'a4' ? '-a4' : ''}.pdf`,
                      source: 'modal_retry',
                    });
                    recordDownloadInDb();
                  }}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#2E6B6B] hover:underline"
                >
                  <FileDown className="w-3.5 h-3.5" />
                  <span>Click here to download again</span>
                </button>
              </div>
            ) : (
              <p className="text-xs text-slate-500">
                {paperSize === 'a4'
                  ? 'Standard 210×297mm ISO A4 vector PDF · Scaled for international printers.'
                  : 'Standard 8.5×11" US Letter vector PDF · Free for classroom and homeschooling use.'}
              </p>
            )}
          </div>

          {/* Pre-Download Ad Slot (0px when AdSense disabled unless ?adpreview=1) */}
          <AdUnit slotType="pre-download" className="my-2!" />

          {/* Action Row */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print PDF</span>
            </button>
            <button
              type="button"
              onClick={() => toggleItem(worksheet)}
              className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-colors ${
                inPack
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-[#F0F7F7] hover:bg-[#dfeeee] text-[#2E6B6B] border border-[#d0e3e3]'
              }`}
            >
              {inPack ? <Check className="w-4 h-4" /> : <FolderHeart className="w-4 h-4" />}
              <span>{inPack ? 'Saved in Lesson Pack' : 'Add to Lesson Pack'}</span>
            </button>
          </div>

          {/* Related Companion Printables (Next 3) */}
          {relatedWorksheets.length > 0 && (
            <div className="pt-4 border-t border-slate-100 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Keep Building Your Lesson · Next 3 Printables
                </span>
                <Link
                  href="/worksheets"
                  onClick={onClose}
                  className="text-[11px] font-bold text-[#2E6B6B] hover:underline"
                >
                  Browse all →
                </Link>
              </div>
              <div className="space-y-2">
                {relatedWorksheets.slice(0, 3).map((rel) => {
                  const relInPack = hasItem(rel.slug);
                  return (
                    <div
                      key={rel.slug}
                      className="flex items-center gap-2.5 p-2 rounded-xl border border-slate-200 hover:border-[#2E6B6B] bg-slate-50/70 transition-colors"
                    >
                      <Link
                        href={`/worksheets/${rel.slug}`}
                        onClick={onClose}
                        className="flex items-center gap-2.5 flex-1 min-w-0 group"
                      >
                        <div className="relative w-10 h-12 rounded bg-white border border-slate-200 shrink-0 overflow-hidden">
                          <Image
                            src={rel.previewImages[0]}
                            alt={rel.title}
                            fill
                            sizes="40px"
                            className="object-contain p-0.5"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-slate-800 group-hover:text-[#2E6B6B] truncate">
                            {rel.title}
                          </p>
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-500">
                            <span>{rel.subjectName} · {rel.pages}p</span>
                            <span className="text-[#2E6B6B] inline-flex items-center gap-0.5">
                              Open <ArrowRight className="w-2.5 h-2.5" />
                            </span>
                          </span>
                        </div>
                      </Link>
                      <button
                        type="button"
                        onClick={() => toggleItem(rel)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold shrink-0 transition-colors ${
                          relInPack
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-white text-[#2E6B6B] border border-slate-200 hover:border-[#2E6B6B]'
                        }`}
                      >
                        {relInPack ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                        <span>{relInPack ? 'Saved' : 'Pack'}</span>
                      </button>
                    </div>
                  );
                })}
              </div>
              <div className="pt-1 text-center">
                <Link
                  href="/tools/name-tracing"
                  onClick={onClose}
                  className="text-[11px] font-semibold text-[#2E6B6B] hover:underline"
                >
                  Need personalized sheets? Try our Free Name Tracing Generator →
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
