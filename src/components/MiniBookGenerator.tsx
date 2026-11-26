'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  MINI_BOOK_PRESETS,
  formatMiniBookSentence,
  generateMiniBookPdf,
  type MiniBookCaptionMode,
  type MiniBookFormat,
  type MiniBookPreset,
} from '@/lib/mini-book-pdf';
import {
  CLIPART_COUNT,
  clipartUrl,
  formatClipartLabel,
  getClipart,
  listThemes,
  searchClipart,
  type ClipartItem,
} from '@/lib/clipart';
import { getPaperLabel, type PaperSizeOption } from '@/lib/pdf-stroke-utils';
import { trackEvent } from '@/lib/analytics';
import {
  FileDown,
  Printer,
  ShieldCheck,
  Sparkles,
  Search,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export function MiniBookGenerator() {
  const defaultPreset = MINI_BOOK_PRESETS[0];
  const [title, setTitle] = useState(defaultPreset.title);
  const [selectedIds, setSelectedIds] = useState<string[]>(defaultPreset.clipartIds);
  const [format, setFormat] = useState<MiniBookFormat>('half-page');
  const [captionMode, setCaptionMode] = useState<MiniBookCaptionMode>('i-see');
  const [paperSize, setPaperSize] = useState<PaperSizeOption>('letter');
  const [showFoldGuides, setShowFoldGuides] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [themeFilter, setThemeFilter] = useState('all');
  const [spreadIdx, setSpreadIdx] = useState(0);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    const param = new URLSearchParams(window.location.search).get('theme');
    if (!param) return;
    const found = MINI_BOOK_PRESETS.find((p) => p.id === param);
    if (found) {
      setTitle(found.title);
      setSelectedIds(found.clipartIds);
      setSpreadIdx(0);
    }
  }, []);

  const themes = useMemo(() => listThemes(), []);
  const filteredClipart = useMemo(
    () => searchClipart(searchQuery, { theme: themeFilter }),
    [searchQuery, themeFilter]
  );
  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);
  const maxAllowed = format === 'one-sheet-zine' ? 6 : 7;
  const activeIds = useMemo(
    () => selectedIds.slice(0, maxAllowed),
    [selectedIds, maxAllowed]
  );

  const halfPageSpreads = useMemo(() => {
    const panels: Array<
      | { kind: 'cover'; id: string }
      | { kind: 'story'; pageNum: number; id: string }
      | { kind: 'back' }
    > = [
      { kind: 'cover', id: activeIds[0] },
      ...activeIds.map((id, i) => ({ kind: 'story' as const, pageNum: i + 1, id })),
      { kind: 'back' },
    ];
    if (panels.length % 2 === 1) {
      panels.splice(panels.length - 1, 0, {
        kind: 'story',
        pageNum: activeIds.length + 1,
        id: activeIds[0],
      });
    }
    const pairs: typeof panels[] = [];
    for (let i = 0; i < panels.length; i += 2) {
      pairs.push(panels.slice(i, i + 2));
    }
    return pairs;
  }, [activeIds]);

  const safeSpreadIdx = Math.min(spreadIdx, Math.max(0, halfPageSpreads.length - 1));
  const paperLabel = getPaperLabel(paperSize);
  const displayTitle = /^my\s+/i.test(title.trim()) ? title.trim() : `My ${title.trim() || 'Mini Book'}`;

  const applyPreset = (preset: MiniBookPreset) => {
    setTitle(preset.title);
    setSelectedIds(preset.clipartIds);
    setSpreadIdx(0);
  };

  const toggleClipart = (item: ClipartItem) => {
    setSelectedIds((prev) => {
      if (prev.includes(item.id)) {
        if (prev.length <= 4) return prev;
        return prev.filter((id) => id !== item.id);
      }
      if (prev.length >= 7) return prev;
      return [...prev, item.id];
    });
    setSpreadIdx(0);
  };

  const buildPdfBytes = () =>
    generateMiniBookPdf({
      title,
      clipartIds: activeIds,
      format,
      captionMode,
      paperSize,
      showFoldGuides,
    });

  const handleDownload = async () => {
    if (generating) return;
    setGenerating(true);
    try {
      const pdfBytes = await buildPdfBytes();
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
      const blobUrl = URL.createObjectURL(blob);
      const slug = (title || 'mini-book')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 40);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `mini-book-${slug || 'esl'}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 15000);

      trackEvent('mini_book_pdf_download', { format, captionMode, paperSize });
    } finally {
      setGenerating(false);
    }
  };

  const handlePrint = async () => {
    if (generating) return;
    setGenerating(true);
    try {
      const pdfBytes = await buildPdfBytes();
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
      const blobUrl = URL.createObjectURL(blob);
      const win = window.open(blobUrl, '_blank');
      if (win) win.focus();
      setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);

      trackEvent('mini_book_pdf_print', { format, paperSize });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
        <div className="space-y-2">
          <span className="block text-xs font-bold uppercase tracking-wider text-slate-600">
            1. Quick Story Book Themes
          </span>
          <div className="flex flex-wrap gap-1.5">
            {MINI_BOOK_PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => applyPreset(p)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                  title === p.title
                    ? 'bg-[#2E6B6B] text-white border-[#2E6B6B]'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-[#2E6B6B] hover:text-[#2E6B6B]'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="minibook-title-input"
            className="block text-xs font-bold uppercase tracking-wider text-slate-600"
          >
            2. Book Cover Title
          </label>
          <input
            id="minibook-title-input"
            type="text"
            maxLength={48}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3.5 py-2 text-sm font-medium bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#2E6B6B]"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              3. Pick Pictures (4–{maxAllowed} Pages)
            </span>
            <span className="text-[11px] font-bold text-[#2E6B6B]">
              {activeIds.length} / {maxAllowed} selected
            </span>
          </div>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search ${CLIPART_COUNT} drawings...`}
                className="w-full pl-8 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#2E6B6B]"
              />
            </div>
            <select
              value={themeFilter}
              onChange={(e) => setThemeFilter(e.target.value)}
              aria-label="Filter mini-book drawings by theme"
              className="px-2.5 py-2 text-xs font-semibold bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#2E6B6B]"
            >
              <option value="all">All Themes</option>
              <option value="cvc">CVC Phonics</option>
              {themes.map((t) => (
                <option key={t.theme} value={t.theme}>
                  {t.theme.charAt(0).toUpperCase() + t.theme.slice(1)} ({t.count})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-4 gap-1.5 max-h-40 overflow-y-auto p-2 rounded-xl bg-slate-50 border border-slate-200">
            {filteredClipart.map((item) => {
              const active = selectedSet.has(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleClipart(item)}
                  className={`p-1.5 rounded-lg border flex flex-col items-center gap-1 transition-all ${
                    active
                      ? 'bg-[#F0F7F7] border-[#2E6B6B] ring-1 ring-[#2E6B6B]/25'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <img
                    src={clipartUrl(item)}
                    alt={item.name}
                    className="w-8 h-8 object-contain"
                    loading="lazy"
                  />
                  <span className="text-[10px] font-semibold text-slate-700 truncate w-full text-center">
                    {formatClipartLabel(item)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
            4. Book Format
          </span>
          <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs">
            <button
              type="button"
              onClick={() => {
                setFormat('half-page');
                setSpreadIdx(0);
              }}
              className={`py-2 px-2 rounded-lg font-bold transition-colors ${
                format === 'half-page'
                  ? 'bg-white text-[#2E6B6B] shadow-2xs border border-slate-200/80'
                  : 'text-slate-600'
              }`}
            >
              Half-Page Booklet
            </button>
            <button
              type="button"
              onClick={() => {
                setFormat('one-sheet-zine');
                setSpreadIdx(0);
              }}
              className={`py-2 px-2 rounded-lg font-bold transition-colors ${
                format === 'one-sheet-zine'
                  ? 'bg-white text-[#2E6B6B] shadow-2xs border border-slate-200/80'
                  : 'text-slate-600'
              }`}
            >
              1-Sheet Foldable (8p)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              5. Sentence Pattern
            </span>
            <select
              value={captionMode}
              onChange={(e) => setCaptionMode(e.target.value as MiniBookCaptionMode)}
              aria-label="Choose mini-book caption sentence"
              className="w-full px-3 py-2 text-xs font-semibold bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#2E6B6B]"
            >
              <option value="i-see">I see a / an ...</option>
              <option value="this-is">This is a / an ...</option>
              <option value="word-only">Single Word Only</option>
              <option value="trace-word">Traceable Word</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              6. Paper Size
            </span>
            <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs">
              {(
                [
                  { id: 'letter', label: 'Letter' },
                  { id: 'a4', label: 'A4' },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setPaperSize(opt.id)}
                  className={`py-2 px-2 rounded-lg font-bold transition-colors ${
                    paperSize === opt.id
                      ? 'bg-white text-[#2E6B6B] shadow-2xs border border-slate-200/80'
                      : 'text-slate-600'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <label className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#F0F7F7]/70 border border-[#d0e3e3] cursor-pointer text-xs font-semibold text-slate-800">
          <input
            type="checkbox"
            checked={showFoldGuides}
            onChange={(e) => setShowFoldGuides(e.target.checked)}
            className="w-4 h-4 accent-[#2E6B6B] rounded"
          />
          <span>
            {format === 'one-sheet-zine'
              ? 'Show dashed fold lines & center slit cut guide'
              : 'Show cut line & left staple marks'}
          </span>
        </label>

        <div className="space-y-2.5 pt-1">
          <button
            type="button"
            onClick={handleDownload}
            disabled={generating}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl bg-[#2E6B6B] hover:bg-[#225151] text-white text-sm font-bold shadow-sm transition-colors disabled:opacity-60"
          >
            <FileDown className="w-4 h-4" />
            <span>
              {generating
                ? 'Creating Mini-Book PDF...'
                : 'Download Free Mini-Book PDF'}
            </span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            disabled={generating}
            className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors disabled:opacity-60"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>Print Mini-Book PDF</span>
          </button>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-start gap-2 text-[11px] text-slate-600 leading-relaxed">
          <ShieldCheck className="w-4 h-4 text-[#2E6B6B] shrink-0 mt-0.5" />
          <span>
            <strong>Zero Prep Classroom Reader:</strong> Color every page, trace or read aloud the repeated English sentence frame, and take home!
          </span>
        </div>
      </div>

      {/* Live Preview */}
      <div className="lg:col-span-7 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 px-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Sparkles className="w-3.5 h-3.5 text-[#F2B544]" />
            <span>
              Live Booklet Preview · {paperLabel} (
              {format === 'one-sheet-zine' ? '1-Sheet 8-Panel Zine' : 'Half-Page Staple'})
            </span>
          </div>

          {format === 'half-page' && halfPageSpreads.length > 1 && (
            <div className="flex items-center gap-1.5 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setSpreadIdx((p) => Math.max(0, p - 1))}
                disabled={safeSpreadIdx === 0}
                aria-label="Previous sheet"
                className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 disabled:opacity-40 hover:bg-slate-50"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="px-2 text-slate-700">
                Sheet {safeSpreadIdx + 1} of {halfPageSpreads.length}
              </span>
              <button
                type="button"
                onClick={() =>
                  setSpreadIdx((p) => Math.min(halfPageSpreads.length - 1, p + 1))
                }
                disabled={safeSpreadIdx >= halfPageSpreads.length - 1}
                aria-label="Next sheet"
                className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 disabled:opacity-40 hover:bg-slate-50"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        <div className="bg-slate-100/90 border border-slate-200 rounded-2xl p-4 sm:p-6 flex items-center justify-center">
          {format === 'half-page' ? (
            <div className="w-full max-w-[600px] bg-white rounded-xl shadow-md border border-slate-200 p-4 grid grid-cols-2 gap-4 aspect-[11/8.5] relative">
              {showFoldGuides && (
                <div className="absolute inset-y-2 left-1/2 -translate-x-px border-l border-dashed border-slate-300 pointer-events-none" />
              )}
              {(halfPageSpreads[safeSpreadIdx] ?? []).map((panel, pIdx) => {
                if (panel.kind === 'cover') {
                  const item = getClipart(panel.id);
                  return (
                    <div
                      key={`cover-${pIdx}`}
                      className="rounded-lg border-2 border-[#2E6B6B] bg-white flex flex-col justify-between overflow-hidden p-3"
                    >
                      <div className="rounded bg-[#F0F7F7] px-2 py-2 text-center font-extrabold text-xs sm:text-sm text-slate-900 truncate">
                        {displayTitle}
                      </div>
                      <div className="flex-1 min-h-0 flex items-center justify-center p-2">
                        {item && (
                          <img
                            src={clipartUrl(item)}
                            alt={formatClipartLabel(item)}
                            className="max-w-full max-h-full object-contain"
                          />
                        )}
                      </div>
                      <div className="text-center space-y-1">
                        <p className="text-[10px] font-bold text-slate-700">
                          Name: ___________________
                        </p>
                        <p className="text-[8px] text-slate-400">kinderesl.com</p>
                      </div>
                    </div>
                  );
                }

                if (panel.kind === 'back') {
                  return (
                    <div
                      key={`back-${pIdx}`}
                      className="rounded-lg border-2 border-[#2E6B6B] bg-white flex flex-col items-center justify-center p-3 gap-3 text-center"
                    >
                      <p className="text-base sm:text-lg font-extrabold text-[#2E6B6B]">
                        The End!
                      </p>
                      <p className="text-[10px] text-slate-600">
                        Read your mini-book 3 times:
                      </p>
                      <div className="flex gap-2">
                        {['1x', '2x', '3x'].map((x) => (
                          <span
                            key={x}
                            className="w-8 h-8 rounded-full border border-[#2E6B6B] text-[#2E6B6B] text-[10px] font-bold flex items-center justify-center"
                          >
                            {x}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                }

                const item = getClipart(panel.id);
                const word = item ? formatClipartLabel(item) : '';
                return (
                  <div
                    key={`p-${panel.pageNum}-${pIdx}`}
                    className="rounded-lg border-2 border-[#2E6B6B] bg-white flex flex-col justify-between p-3 relative"
                  >
                    <div className="flex-1 min-h-0 flex items-center justify-center p-2">
                      {item && (
                        <img
                          src={clipartUrl(item)}
                          alt={word}
                          className="max-w-full max-h-full object-contain"
                        />
                      )}
                    </div>
                    {captionMode === 'trace-word' ? (
                      <div className="border-y border-slate-300 py-1.5 text-center text-sm font-bold tracking-wider text-slate-400">
                        {word}
                      </div>
                    ) : (
                      <p className="text-center text-xs sm:text-sm font-extrabold text-slate-900">
                        {formatMiniBookSentence(word, captionMode)}
                      </p>
                    )}
                    <span className="text-[9px] font-bold text-slate-400 text-right">
                      {panel.pageNum}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="w-full max-w-[600px] bg-white rounded-xl shadow-md border border-slate-200 p-3 aspect-[11/8.5] relative flex flex-col justify-between">
              <div className="grid grid-cols-4 grid-rows-2 gap-1.5 flex-1 relative">
                {[5, 4, 3, 2].map((storyIdx) => {
                  const item = getClipart(activeIds[storyIdx] ?? activeIds[0]);
                  const word = item ? formatClipartLabel(item) : '';
                  return (
                    <div
                      key={`top-${storyIdx}`}
                      className="rounded border border-[#2E6B6B] bg-white p-1.5 flex flex-col items-center justify-between rotate-180"
                    >
                      <span className="text-[8px] font-bold text-slate-400 self-end">
                        p.{storyIdx + 1}
                      </span>
                      {item && (
                        <img
                          src={clipartUrl(item)}
                          alt={word}
                          className="w-10 h-10 object-contain"
                        />
                      )}
                      <span className="text-[8px] font-bold text-slate-800 truncate w-full text-center">
                        {formatMiniBookSentence(word, captionMode)}
                      </span>
                    </div>
                  );
                })}

                {/* Back Cover */}
                <div className="rounded border border-[#2E6B6B] bg-white p-1.5 flex flex-col items-center justify-center text-center">
                  <span className="text-xs font-extrabold text-[#2E6B6B]">
                    The End!
                  </span>
                  <span className="text-[8px] text-slate-500 mt-1">
                    Back Cover
                  </span>
                </div>

                {/* Front Cover */}
                <div className="rounded border border-[#2E6B6B] bg-white p-1.5 flex flex-col items-center justify-between">
                  <span className="w-full rounded bg-[#F0F7F7] py-1 text-[8px] font-extrabold text-slate-900 text-center truncate px-1">
                    {displayTitle}
                  </span>
                  {(() => {
                    const cov = getClipart(activeIds[0]);
                    return cov ? (
                      <img
                        src={clipartUrl(cov)}
                        alt={formatClipartLabel(cov)}
                        className="w-10 h-10 object-contain"
                      />
                    ) : null;
                  })()}
                  <span className="text-[7px] font-bold text-slate-500">
                    By: _________
                  </span>
                </div>

                {/* Page 1 & Page 2 */}
                {[0, 1].map((storyIdx) => {
                  const item = getClipart(activeIds[storyIdx] ?? activeIds[0]);
                  const word = item ? formatClipartLabel(item) : '';
                  return (
                    <div
                      key={`bot-${storyIdx}`}
                      className="rounded border border-[#2E6B6B] bg-white p-1.5 flex flex-col items-center justify-between"
                    >
                      <span className="text-[8px] font-bold text-slate-400 self-end">
                        p.{storyIdx + 1}
                      </span>
                      {item && (
                        <img
                          src={clipartUrl(item)}
                          alt={word}
                          className="w-10 h-10 object-contain"
                        />
                      )}
                      <span className="text-[8px] font-bold text-slate-800 truncate w-full text-center">
                        {formatMiniBookSentence(word, captionMode)}
                      </span>
                    </div>
                  );
                })}

                {showFoldGuides && (
                  <div className="absolute left-1/4 right-1/4 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
                    <div className="w-full border-t-2 border-dashed border-[#2E6B6B]" />
                    <span className="absolute px-1.5 py-0.5 rounded bg-white text-[8px] font-extrabold text-[#2E6B6B] border border-[#d0e3e3]">
                      CUT SLIT
                    </span>
                  </div>
                )}
              </div>
              <p className="text-[9px] text-slate-500 text-center pt-1.5">
                Top row is printed upside down (180°) so every page faces upright when folded.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
