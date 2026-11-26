'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  WORD_SEARCH_PRESETS,
  buildWordSearchLayout,
  cleanWordSearchTerm,
  generateWordSearchPdf,
  type WordSearchCaseMode,
  type WordSearchDirectionMode,
  type WordSearchGridSize,
  type WordSearchPreset,
} from '@/lib/word-search-pdf';
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

export function WordSearchGenerator() {
  const defaultPreset = WORD_SEARCH_PRESETS[0];
  const [title, setTitle] = useState(defaultPreset.title);
  const [selectedIds, setSelectedIds] = useState<string[]>(defaultPreset.clipartIds);
  const [gridSize, setGridSize] = useState<WordSearchGridSize>(8);
  const [directionMode, setDirectionMode] =
    useState<WordSearchDirectionMode>('across-down');
  const [caseMode, setCaseMode] = useState<WordSearchCaseMode>('upper');
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
    const found = WORD_SEARCH_PRESETS.find((p) => p.id === param);
    if (found) {
      setTitle(found.title);
      setSelectedIds(found.clipartIds);
    }
  }, []);

  const themes = useMemo(() => listThemes(), []);
  const maxWords = gridSize === 6 ? 5 : 8;

  const filteredClipart = useMemo(
    () =>
      searchClipart(searchQuery, { theme: themeFilter }).filter((item) => {
        const len = cleanWordSearchTerm(item.name).length;
        return len >= 2 && len <= gridSize;
      }),
    [searchQuery, themeFilter, gridSize]
  );

  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  const layout = useMemo(
    () =>
      buildWordSearchLayout({
        title,
        clipartIds: selectedIds,
        gridSize,
        directionMode,
        caseMode,
        paperSize,
        includeAnswerKey,
        seed,
      }),
    [title, selectedIds, gridSize, directionMode, caseMode, paperSize, includeAnswerKey, seed]
  );

  const paperLabel = getPaperLabel(paperSize);

  const applyPreset = (preset: WordSearchPreset) => {
    setTitle(preset.title);
    setSelectedIds(preset.clipartIds);
    setSeed((s) => s + 1);
  };

  const toggleClipart = (item: ClipartItem) => {
    setSelectedIds((prev) => {
      if (prev.includes(item.id)) {
        if (prev.length <= 3) return prev;
        return prev.filter((id) => id !== item.id);
      }
      if (prev.length >= maxWords) return prev;
      return [...prev, item.id];
    });
    setSeed((s) => s + 1);
  };

  const buildPdfBytes = () =>
    generateWordSearchPdf({
      title,
      clipartIds: selectedIds,
      gridSize,
      directionMode,
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
      const slug = (title || 'word-search')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 40);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `word-search-${slug || 'puzzle'}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 15000);

      trackEvent('word_search_pdf_download', {
        gridSize,
        placedWords: layout.placed.length,
        directionMode,
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

      trackEvent('word_search_pdf_print', { gridSize, paperSize });
    } finally {
      setGenerating(false);
    }
  };

  const bankCols = layout.placed.length <= 6 ? 3 : 4;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
        <div className="space-y-2">
          <span className="block text-xs font-bold uppercase tracking-wider text-slate-600">
            1. Quick Picture Word Search Themes
          </span>
          <div className="flex flex-wrap gap-1.5">
            {WORD_SEARCH_PRESETS.map((p) => (
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
            htmlFor="ws-title-input"
            className="block text-xs font-bold uppercase tracking-wider text-slate-600"
          >
            2. Puzzle Title
          </label>
          <input
            id="ws-title-input"
            type="text"
            maxLength={50}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3.5 py-2 text-sm font-medium bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#2E6B6B]"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              3. Pick Words (3–{maxWords})
            </span>
            <span className="text-[11px] font-bold text-[#2E6B6B]">
              {layout.placed.length} placed in {gridSize}×{gridSize}
            </span>
          </div>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search short words..."
                className="w-full pl-8 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#2E6B6B]"
              />
            </div>
            <select
              value={themeFilter}
              onChange={(e) => setThemeFilter(e.target.value)}
              aria-label="Filter word search drawings by theme"
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
              4. Grid Size
            </span>
            <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs">
              <button
                type="button"
                onClick={() => {
                  setGridSize(6);
                  setSeed((s) => s + 1);
                }}
                className={`py-2 px-2 rounded-lg font-bold transition-colors ${
                  gridSize === 6
                    ? 'bg-white text-[#2E6B6B] shadow-2xs border border-slate-200/80'
                    : 'text-slate-600'
                }`}
              >
                6×6 Pre-K
              </button>
              <button
                type="button"
                onClick={() => {
                  setGridSize(8);
                  setSeed((s) => s + 1);
                }}
                className={`py-2 px-2 rounded-lg font-bold transition-colors ${
                  gridSize === 8
                    ? 'bg-white text-[#2E6B6B] shadow-2xs border border-slate-200/80'
                    : 'text-slate-600'
                }`}
              >
                8×8 Kinder
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              5. Directions
            </span>
            <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-slate-100 border border-slate-200 text-[11px]">
              <button
                type="button"
                onClick={() => {
                  setDirectionMode('across-only');
                  setSeed((s) => s + 1);
                }}
                className={`py-2 px-1.5 rounded-lg font-bold transition-colors ${
                  directionMode === 'across-only'
                    ? 'bg-white text-[#2E6B6B] shadow-2xs border border-slate-200/80'
                    : 'text-slate-600'
                }`}
              >
                Across Only
              </button>
              <button
                type="button"
                onClick={() => {
                  setDirectionMode('across-down');
                  setSeed((s) => s + 1);
                }}
                className={`py-2 px-1.5 rounded-lg font-bold transition-colors ${
                  directionMode === 'across-down'
                    ? 'bg-white text-[#2E6B6B] shadow-2xs border border-slate-200/80'
                    : 'text-slate-600'
                }`}
              >
                Across + Down
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              6. Letter Case
            </span>
            <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs">
              <button
                type="button"
                onClick={() => setCaseMode('upper')}
                className={`py-2 px-2 rounded-lg font-bold transition-colors ${
                  caseMode === 'upper'
                    ? 'bg-white text-[#2E6B6B] shadow-2xs border border-slate-200/80'
                    : 'text-slate-600'
                }`}
              >
                UPPER
              </button>
              <button
                type="button"
                onClick={() => setCaseMode('lower')}
                className={`py-2 px-2 rounded-lg font-bold transition-colors ${
                  caseMode === 'lower'
                    ? 'bg-white text-[#2E6B6B] shadow-2xs border border-slate-200/80'
                    : 'text-slate-600'
                }`}
              >
                lower
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              7. Paper Size
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
          <span>Include Page 2 Highlighted Answer Key</span>
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
                ? 'Creating Word Search PDF...'
                : `Download Free Word Search PDF (${layout.placed.length} Words)`}
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
              <span>Shuffle Puzzle</span>
            </button>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-start gap-2 text-[11px] text-slate-600 leading-relaxed">
          <ShieldCheck className="w-4 h-4 text-[#2E6B6B] shrink-0 mt-0.5" />
          <span>
            <strong>Early-Reader Friendly:</strong> Words read strictly left-to-right or top-to-bottom (never backwards or diagonal).
          </span>
        </div>
      </div>

      {/* Live Preview */}
      <div className="lg:col-span-7 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 px-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Sparkles className="w-3.5 h-3.5 text-[#F2B544]" />
            <span>
              Live Puzzle Preview · {paperLabel} ({gridSize}×{gridSize})
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
              <span>Puzzle Sheet</span>
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
            <div>
              <div className="flex items-baseline justify-between border-b-2 border-[#2E6B6B] pb-1.5">
                <h2 className="text-sm sm:text-base font-extrabold text-slate-900 font-heading truncate pr-2">
                  {previewTab === 'answer' ? `Answer Key: ${title}` : title}
                </h2>
                <span className="text-[10px] text-slate-500 shrink-0">
                  Name: _________
                </span>
              </div>
              <p className="text-[10px] text-slate-500 mt-1 mb-3">
                {directionMode === 'across-only'
                  ? 'Find and circle each hidden word reading left to right!'
                  : 'Find and circle each hidden word reading across or down!'}
              </p>

              {/* Letter Grid */}
              <div
                className={`mx-auto w-[76%] grid border-2 border-[#2E6B6B] bg-white ${
                  gridSize === 6 ? 'grid-cols-6' : 'grid-cols-8'
                }`}
              >
                {layout.grid.flatMap((row, rIdx) =>
                  row.map((ch, cIdx) => {
                    const isHit =
                      previewTab === 'answer' && layout.answerMask[rIdx][cIdx];
                    return (
                      <div
                        key={`${rIdx}-${cIdx}`}
                        className={`aspect-square border border-[#d0e3e3] flex items-center justify-center font-extrabold select-none ${
                          gridSize === 6 ? 'text-base sm:text-lg' : 'text-xs sm:text-sm'
                        } ${
                          isHit
                            ? 'bg-[#DFF2EF] text-[#2E6B6B]'
                            : 'bg-white text-slate-900'
                        }`}
                      >
                        {ch}
                      </div>
                    );
                  })
                )}
              </div>

              {/* Picture Word Bank */}
              <div className="mt-3.5 p-2.5 rounded-xl bg-[#F0F7F7] border border-[#d0e3e3]">
                <div className="text-[9px] font-bold uppercase tracking-wider text-[#2E6B6B] mb-2">
                  Picture Word Bank (Check off as you find):
                </div>
                <div
                  className={`grid gap-1.5 ${
                    bankCols === 3 ? 'grid-cols-3' : 'grid-cols-4'
                  }`}
                >
                  {layout.placed.map((p) => {
                    const item = getClipart(p.clipartId);
                    const disp =
                      caseMode === 'lower'
                        ? p.cleanWord.toLowerCase()
                        : p.cleanWord;
                    return (
                      <div
                        key={p.clipartId}
                        className="bg-white border border-[#d0e3e3] rounded-lg px-1.5 py-1 flex items-center gap-1.5"
                      >
                        {item && (
                          <img
                            src={clipartUrl(item)}
                            alt={p.label}
                            className="w-6 h-6 object-contain shrink-0"
                          />
                        )}
                        <span className="text-[10px] font-extrabold text-slate-900 truncate">
                          {disp}
                        </span>
                      </div>
                    );
                  })}
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
