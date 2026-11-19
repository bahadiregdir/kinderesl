'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLessonPack } from '@/context/LessonPackContext';
import { triggerPdfFileDownload } from '@/lib/download-helper';
import { trackEvent } from '@/lib/analytics';
import {
  X,
  FileDown,
  Printer,
  Trash2,
  FolderHeart,
  BookOpen,
  ClipboardList,
  Layers,
} from 'lucide-react';

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function LessonPackDrawer() {
  const { items, isOpen, closeDrawer, removeItem, clearPack } = useLessonPack();
  const [downloadProgress, setDownloadProgress] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeDrawer();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, closeDrawer]);

  if (!isOpen) return null;

  const totalPages = items.reduce((sum, item) => sum + (item.pages || 1), 0);

  const handleDownloadAll = async () => {
    if (items.length === 0 || downloadProgress) return;
    trackEvent('lesson_pack_download_all', { count: items.length, pages: totalPages });

    for (let i = 0; i < items.length; i++) {
      setDownloadProgress(`Downloading ${i + 1} of ${items.length}...`);
      triggerPdfFileDownload(items[i].pdfPath, items[i].title);
      if (i < items.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 600));
      }
    }

    setDownloadProgress('All PDFs started!');
    setTimeout(() => setDownloadProgress(null), 2500);
  };

  const handlePrintChecklist = () => {
    if (items.length === 0) return;
    const printWin = window.open('', '_blank', 'width=720,height=840');
    if (!printWin) {
      window.print();
      return;
    }
    const listHtml = items
      .map(
        (item, idx) =>
          `<li style="margin-bottom:14px;padding-bottom:10px;border-bottom:1px solid #e2e8f0;display:flex;justify-content:space-between;gap:12px;">
            <div>
              <strong>${idx + 1}. [ ] ${escapeHtml(item.title)}</strong>
              <div style="font-size:12px;color:#475569;margin-top:4px;">${escapeHtml(item.subjectName)} · ${escapeHtml(item.ages)}</div>
            </div>
            <span style="font-size:12px;color:#0f172a;white-space:nowrap;">${item.pages} ${item.pages > 1 ? 'pages' : 'page'}</span>
          </li>`
      )
      .join('');

    printWin.document.write(`<!DOCTYPE html>
      <html>
        <head><title>KinderESL Weekly Lesson Pack Checklist</title></head>
        <body style="font-family:system-ui,sans-serif;padding:32px;color:#0f172a;max-width:680px;margin:0 auto;">
          <h1 style="margin:0 0 6px;font-size:22px;color:#2E6B6B;">KinderESL Lesson Pack Checklist</h1>
          <p style="margin:0 0 24px;font-size:13px;color:#64748b;">${items.length} worksheets · ${totalPages} printable US Letter pages total</p>
          <ol style="list-style:none;padding:0;margin:0;">${listHtml}</ol>
        </body>
      </html>`);
    printWin.document.close();
    printWin.focus();
    setTimeout(() => printWin.print(), 250);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label="My Lesson Pack">
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        onClick={closeDrawer}
      />

      <div className="relative z-10 w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-slate-200">
        {/* Drawer Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-[#F0F7F7]/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#2E6B6B] text-white flex items-center justify-center">
              <FolderHeart className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 font-heading leading-tight">
                My Lesson Pack
              </h2>
              <p className="text-[11px] text-slate-600">
                Saved in your browser · No account required
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeDrawer}
            aria-label="Close lesson pack drawer"
            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200/70 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {items.length === 0 ? (
            <div className="py-16 text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-[#F0F7F7] text-[#2E6B6B] flex items-center justify-center">
                <BookOpen className="w-7 h-7" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-slate-900">Your Lesson Pack is empty</h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                  Click <strong>+ Pack</strong> on any worksheet card to gather printables for your weekly classroom or homeschooling plan.
                </p>
              </div>
              <Link
                href="/worksheets"
                onClick={closeDrawer}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2E6B6B] hover:bg-[#235353] text-white text-xs font-bold transition-colors"
              >
                Browse Worksheets
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.slug}
                className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 bg-white hover:border-[#2E6B6B]/40 transition-colors"
              >
                <Link
                  href={`/worksheets/${item.slug}`}
                  onClick={closeDrawer}
                  className="relative w-14 h-18 rounded-md overflow-hidden bg-slate-50 border border-slate-100 shrink-0"
                >
                  <Image
                    src={item.previewImage}
                    alt={item.title}
                    fill
                    sizes="56px"
                    className="object-contain p-1"
                  />
                </Link>

                <div className="flex-1 min-w-0">
                  <Link
                    href={`/worksheets/${item.slug}`}
                    onClick={closeDrawer}
                    className="text-xs font-bold text-slate-900 hover:text-[#2E6B6B] line-clamp-2 leading-snug"
                  >
                    {item.title}
                  </Link>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                    <span className="font-semibold text-[#2E6B6B]">{item.subjectName}</span>
                    <span>·</span>
                    <span className="inline-flex items-center gap-0.5">
                      <Layers className="w-3 h-3" />
                      {item.pages}p
                    </span>
                    <span>·</span>
                    <span>{item.pdfFileSize}</span>
                  </div>

                  <div className="flex items-center gap-2 mt-2.5">
                    <button
                      type="button"
                      onClick={() => triggerPdfFileDownload(item.pdfPath, item.title)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#F0F7F7] hover:bg-[#dcedec] text-[#2E6B6B] text-[11px] font-bold transition-colors"
                    >
                      <FileDown className="w-3 h-3" />
                      <span>PDF</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const win = window.open(item.pdfPath, '_blank');
                        if (win) win.focus();
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold transition-colors"
                    >
                      <Printer className="w-3 h-3" />
                      <span>Print</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => removeItem(item.slug)}
                      aria-label={`Remove ${item.title} from Lesson Pack`}
                      className="ml-auto p-1 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer */}
        {items.length > 0 && (
          <div className="p-5 border-t border-slate-200 bg-slate-50 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700">
                {items.length} {items.length === 1 ? 'worksheet' : 'worksheets'} · {totalPages} total{' '}
                {totalPages === 1 ? 'page' : 'pages'}
              </span>
              <button
                type="button"
                onClick={clearPack}
                className="text-slate-500 hover:text-red-600 font-semibold transition-colors"
              >
                Clear pack
              </button>
            </div>

            <button
              type="button"
              onClick={handleDownloadAll}
              disabled={Boolean(downloadProgress)}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#2E6B6B] hover:bg-[#235353] text-white text-sm font-bold shadow-xs transition-colors disabled:opacity-75"
            >
              <FileDown className="w-4 h-4" />
              <span>{downloadProgress || 'Download All PDFs'}</span>
            </button>

            <button
              type="button"
              onClick={handlePrintChecklist}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors"
            >
              <ClipboardList className="w-4 h-4 text-[#2E6B6B]" />
              <span>Print Lesson Checklist</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
