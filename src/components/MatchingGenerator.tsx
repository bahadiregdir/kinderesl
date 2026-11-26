'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  MATCHING_PRESETS,
  buildMatchingLayout,
  generateMatchingPdf,
  getMatchingSheetGeometry,
  type MatchingCaseMode,
  type MatchingMode,
  type MatchingPreset,
} from '@/lib/matching-pdf';
import {
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
  Shuffle,
  ShieldCheck,
  Sparkles,
  Search,
  Eye,
  CheckSquare,
} from 'lucide-react';

export function MatchingGenerator() {
  const defaultPreset = MATCHING_PRESETS[0];
  const [title, setTitle] = useState(defaultPreset.title);
  const [selectedIds, setSelectedIds] = useState<string[]>(defaultPreset.clipartIds);
  const [mode, setMode] = useState<MatchingMode>('picture-word');
  const [caseMode, setCaseMode] = useState<MatchingCaseMode>('title');
  const [paperSize, setPaperSize] = useState<PaperSizeOption>('letter');
  const [includeAnswerKey, setIncludeAnswerKey] = useState(true);
  const [seed, setSeed] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [themeFilter, setThemeFilter] = useState('all');
  const [previewTab, setPreviewTab] = useState<'student' | 'answer'>('student');
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    const param = new URLSearchParams(window.location.search).get('theme');
    if (!param) return;
    const found = MATCHING_PRESETS.find((p) => p.id === param);
    if (found) {
      setTitle(found.title);
      setSelectedIds(found.clipartIds);
    }
  }, []);

  const themes = useMemo(() => listThemes(), []);
  const filteredClipart = useMemo(
    () => searchClipart(searchQuery, { theme: themeFilter }),
    [searchQuery, themeFilter]
  );
  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  const layout = useMemo(
    () =>
      buildMatchingLayout({
        title,
        clipartIds: selectedIds,
        mode,
        caseMode,
        paperSize,
        includeAnswerKey,
        seed,
      }),
    [title, selectedIds, mode, caseMode, paperSize, includeAnswerKey, seed]
  );

  const geom = useMemo(
    () => getMatchingSheetGeometry(paperSize, layout.leftItems.length),
    [paperSize, layout.leftItems.length]
  );
  const paperLabel = getPaperLabel(paperSize);

  const applyPreset = (preset: MatchingPreset) => {
    setTitle(preset.title);
    setSelectedIds(preset.clipartIds);
    setSeed((s) => s + 1);
  };

  const toggleClipart = (item: ClipartItem) => {
    setSelectedIds((prev) => {
      if (prev.includes(item.id)) {
        if (prev.length <= 4) return prev;
        return prev.filter((id) => id !== item.id);
      }
      if (prev.length >= 6) return prev;
      return [...prev, item.id];
    });
    setSeed((s) => s + 1);
  };

  const buildPdfBytes = () =>
    generateMatchingPdf({
      title,
      clipartIds: selectedIds,
      mode,
      caseMode,
      paperSize,
      includeAnswerKey,
      seed,
    });

  const handleDownload = async () => {
    if (generating) return;
    setGenerating(true);
    try {
      const pdfBytes = await buildPdfBytes();
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
      const blobUrl = URL.createObjectURL(blob);
      const slug = (title || 'picture-matching')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 40);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `matching-${slug || 'worksheet'}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 15000);

      trackEvent('matching_maker_pdf_download', {
        mode,
        rowCount: layout.leftItems.length,
        paperSize,
      });
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

      trackEvent('matching_maker_pdf_print', { mode, paperSize });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
        <div className="space-y-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
            1. Matching Mode
          </span>
          <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs">
            <button
              type="button"
              onClick={() => {
                setMode('picture-word');
                setSeed((s) => s + 1);
              }}
              className={`py-2 px-2 rounded-lg font-bold transition-colors ${
                mode === 'picture-word'
                  ? 'bg-white text-[#2E6B6B] shadow-2xs border border-slate-200/80'
                  : 'text-slate-600'
              }`}
            >
              Picture ↔ Word
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('beginning-letter');
                setSeed((s) => s + 1);
              }}
              className={`py-2 px-2 rounded-lg font-bold transition-colors ${
                mode === 'beginning-letter'
                  ? 'bg-white text-[#2E6B6B] shadow-2xs border border-slate-200/80'
                  : 'text-slate-600'
              }`}
            >
              Picture ↔ Letter
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <span className="block text-xs font-bold uppercase tracking-wider text-slate-600">
            2. Quick ESL Sets
          </span>
          <div className="flex flex-wrap gap-1.5">
            {MATCHING_PRESETS.map((p) => (
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
            htmlFor="matching-title-input"
            className="block text-xs font-bold uppercase tracking-wider text-slate-600"
          >
            3. Worksheet Title
          </label>
          <input
            id="matching-title-input"
            type="text"
            maxLength={52}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3.5 py-2 text-sm font-medium bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#2E6B6B]"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              4. Pick Items (4–6)
            </span>
            <span className="text-[11px] font-bold text-[#2E6B6B]">
              {layout.leftItems.length} / 6 pairs
            </span>
          </div>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search 125 drawings..."
                className="w-full pl-8 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#2E6B6B]"
              />
            </div>
            <select
              value={themeFilter}
              onChange={(e) => setThemeFilter(e.target.value)}
              aria-label="Filter drawings by theme"
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              5. Text Case
            </span>
            <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-slate-100 border border-slate-200 text-[11px]">
              {[
                { id: 'title' as const, label: mode === 'beginning-letter' ? 'Aa' : 'Cat' },
                { id: 'upper' as const, label: mode === 'beginning-letter' ? 'A' : 'CAT' },
                { id: 'lower' as const, label: mode === 'beginning-letter' ? 'a' : 'cat' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setCaseMode(opt.id)}
                  className={`py-2 px-1 rounded-lg font-bold transition-colors ${
                    caseMode === opt.id
                      ? 'bg-white text-[#2E6B6B] shadow-2xs border border-slate-200/80'
                      : 'text-slate-600'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              6. Paper Size
            </span>
            <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs">
              <button
                type="button"
                onClick={() => setPaperSize('letter')}
                className={`py-2 px-2 rounded-lg font-bold transition-colors ${
                  paperSize === 'letter'
                    ? 'bg-white text-[#2E6B6B] shadow-2xs border border-slate-200/80'
                    : 'text-slate-600'
                }`}
              >
                Letter
              </button>
              <button
                type="button"
                onClick={() => setPaperSize('a4')}
                className={`py-2 px-2 rounded-lg font-bold transition-colors ${
                  paperSize === 'a4'
                    ? 'bg-white text-[#2E6B6B] shadow-2xs border border-slate-200/80'
                    : 'text-slate-600'
                }`}
              >
                A4
              </button>
            </div>
          </div>
        </div>

        <label className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#F0F7F7]/70 border border-[#d0e3e3] cursor-pointer text-xs font-semibold text-slate-800">
          <input
            type="checkbox"
            checked={includeAnswerKey}
            onChange={(e) => setIncludeAnswerKey(e.target.checked)}
            className="w-4 h-4 accent-[#2E6B6B] rounded"
          />
          <span>Include Page 2 Teacher Answer Key (with matching lines)</span>
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
              {generating ? 'Creating Matching PDF...' : 'Download Free Matching PDF'}
            </span>
          </button>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={handlePrint}
              disabled={generating}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors disabled:opacity-60"
            >
              <Printer className="w-4 h-4 text-slate-600" />
              <span>Print PDF</span>
            </button>
            <button
              type="button"
              onClick={() => setSeed((s) => s + 1)}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#F0F7F7] hover:bg-[#e1efef] text-[#2E6B6B] border border-[#d0e3e3] text-xs font-bold transition-colors"
            >
              <Shuffle className="w-4 h-4" />
              <span>Shuffle Column</span>
            </button>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-start gap-2 text-[11px] text-slate-600 leading-relaxed">
          <ShieldCheck className="w-4 h-4 text-[#2E6B6B] shrink-0 mt-0.5" />
          <span>
            <strong>100% Free &amp; Browser-Private:</strong> Clean black-ink pictures double as coloring prompts.
          </span>
        </div>
      </div>

      {/* Live Preview */}
      <div className="lg:col-span-7 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 px-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Sparkles className="w-3.5 h-3.5 text-[#F2B544]" />
            <span>
              Live Worksheet Preview · {paperLabel} ({layout.leftItems.length} Pairs)
            </span>
          </div>

          <div className="inline-flex rounded-lg bg-slate-100 p-0.5 border border-slate-200 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setPreviewTab('student')}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors ${
                previewTab === 'student'
                  ? 'bg-white text-[#2E6B6B] shadow-2xs'
                  : 'text-slate-600'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Student Sheet</span>
            </button>
            <button
              type="button"
              onClick={() => setPreviewTab('answer')}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors ${
                previewTab === 'answer'
                  ? 'bg-white text-[#2E6B6B] shadow-2xs'
                  : 'text-slate-600'
              }`}
            >
              <CheckSquare className="w-3.5 h-3.5" />
              <span>Answer Key</span>
            </button>
          </div>
        </div>

        <div className="bg-slate-100/90 border border-slate-200 rounded-2xl p-4 sm:p-6 flex items-center justify-center">
          <div className="w-full max-w-[500px] bg-white rounded-xl shadow-md border border-slate-200 p-5 flex flex-col justify-between aspect-[8.5/11]">
            <div className="flex flex-col flex-1">
              <div className="flex items-baseline justify-between border-b-2 border-[#2E6B6B] pb-1.5">
                <h2 className="text-sm sm:text-base font-extrabold text-slate-900 font-heading truncate pr-2">
                  {previewTab === 'answer' ? `Answer Key: ${title}` : title}
                </h2>
                <span className="text-[10px] text-slate-500 shrink-0">
                  Name: _________
                </span>
              </div>
              <p className="text-[10px] text-slate-500 mt-1 mb-2.5">
                {mode === 'beginning-letter'
                  ? 'Draw a line from each picture to its beginning letter.'
                  : 'Draw a line from each picture to its matching English word.'}
              </p>

              <div className="relative flex-1 flex justify-between items-stretch gap-4">
                {previewTab === 'answer' && (
                  <svg
                    viewBox={`0 0 ${geom.pageW} ${geom.pageH - geom.startY - 30}`}
                    className="absolute inset-0 w-full h-full pointer-events-none"
                    preserveAspectRatio="none"
                  >
                    {layout.answerPairs.map((pair) => {
                      const y1 =
                        pair.leftIdx * geom.totalStep + geom.boxH / 2;
                      const y2 =
                        pair.rightIdx * geom.totalStep + geom.boxH / 2;
                      return (
                        <line
                          key={pair.leftIdx}
                          x1={geom.leftDotX}
                          y1={y1}
                          x2={geom.rightDotX}
                          y2={y2}
                          stroke="#2E6B6B"
                          strokeWidth={2.4}
                          strokeDasharray="6 4"
                        />
                      );
                    })}
                  </svg>
                )}

                {/* Left column */}
                <div className="w-[34%] flex flex-col justify-between gap-2 z-10">
                  {layout.leftItems.map((left) => {
                    const item = getClipart(left.clipartId);
                    return (
                      <div
                        key={left.clipartId}
                        className="flex-1 flex items-center gap-2"
                      >
                        <div className="flex-1 h-full border-2 border-[#2E6B6B] rounded-lg bg-white flex items-center justify-center p-1.5">
                          {item && (
                            <img
                              src={clipartUrl(item)}
                              alt={left.word}
                              className="max-h-12 max-w-full object-contain"
                            />
                          )}
                        </div>
                        <span className="w-2.5 h-2.5 rounded-full bg-[#2E6B6B] shrink-0" />
                      </div>
                    );
                  })}
                </div>

                {/* Right column */}
                <div className="w-[40%] flex flex-col justify-between gap-2 z-10">
                  {layout.rightItems.map((right) => (
                    <div
                      key={right.key}
                      className="flex-1 flex items-center gap-2"
                    >
                      <span className="w-2.5 h-2.5 rounded-full bg-[#2E6B6B] shrink-0" />
                      <div className="flex-1 h-full border-2 border-[#2E6B6B] rounded-lg bg-[#F0F7F7] flex items-center justify-center px-2">
                        <span
                          className={`font-extrabold text-slate-900 truncate ${
                            mode === 'beginning-letter'
                              ? 'text-lg sm:text-xl'
                              : 'text-sm sm:text-base'
                          }`}
                        >
                          {right.displayText}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2 text-center text-[9px] text-slate-500">
              Free for classroom &amp; home use · kinderesl.com
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
