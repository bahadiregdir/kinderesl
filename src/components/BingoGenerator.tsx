'use client';

import React, { useMemo, useState } from 'react';
import {
  BINGO_PRESETS,
  buildShuffledBoards,
  generateBingoPdf,
  type BingoPreset,
} from '@/lib/bingo-pdf';
import { trackEvent } from '@/lib/analytics';
import {
  FileDown,
  Printer,
  Shuffle,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  CheckSquare,
  Grid3X3,
} from 'lucide-react';

export function BingoGenerator() {
  const [title, setTitle] = useState(BINGO_PRESETS[0].title);
  const [wordsText, setWordsText] = useState(BINGO_PRESETS[0].words.join('\n'));
  const [gridSize, setGridSize] = useState<3 | 4>(3);
  const [freeCenter, setFreeCenter] = useState(true);
  const [cardCount, setCardCount] = useState(10);
  const [cardsPerPage, setCardsPerPage] = useState<1 | 2>(1);
  const [paperSize, setPaperSize] = useState<'letter' | 'a4'>('letter');
  const [includeCallerSheet, setIncludeCallerSheet] = useState(true);
  const [seed, setSeed] = useState(1);
  const [previewIdx, setPreviewIdx] = useState(0);
  const [previewMode, setPreviewMode] = useState<'card' | 'caller'>('card');
  const [generating, setGenerating] = useState(false);

  const parsedWords = useMemo(
    () =>
      wordsText
        .split(/[\n,;]+/)
        .map((w) => w.trim())
        .filter(Boolean),
    [wordsText]
  );

  const minNeeded =
    gridSize === 3 ? (freeCenter ? 8 : 9) : 16;

  const boards = useMemo(
    () => buildShuffledBoards(parsedWords, gridSize, freeCenter, cardCount, seed),
    [parsedWords, gridSize, freeCenter, cardCount, seed]
  );

  const safeIdx = Math.min(previewIdx, boards.length - 1);
  const activeBoard = boards[safeIdx] || boards[0];

  const handleSelectPreset = (preset: BingoPreset) => {
    setTitle(preset.title);
    setWordsText(preset.words.join('\n'));
    setPreviewIdx(0);
    setSeed((s) => s + 1);
  };

  const buildPdfBytes = () =>
    generateBingoPdf({
      title,
      words: parsedWords,
      gridSize,
      freeCenter,
      cardCount,
      cardsPerPage,
      includeCallerSheet,
      paperSize,
      seed,
    });

  const handleDownload = async () => {
    if (generating) return;
    setGenerating(true);
    try {
      const bytes = await buildPdfBytes();
      const blob = new Blob([new Uint8Array(bytes)], { type: 'application/pdf' });
      const blobUrl = URL.createObjectURL(blob);
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `esl-bingo-${slug || 'cards'}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 15000);

      trackEvent('bingo_pdf_download', {
        gridSize,
        cardCount,
        cardsPerPage,
        paperSize,
        wordCount: parsedWords.length,
      });
    } finally {
      setGenerating(false);
    }
  };

  const handlePrint = async () => {
    if (generating) return;
    setGenerating(true);
    try {
      const bytes = await buildPdfBytes();
      const blob = new Blob([new Uint8Array(bytes)], { type: 'application/pdf' });
      const blobUrl = URL.createObjectURL(blob);
      const win = window.open(blobUrl, '_blank');
      if (win) win.focus();
      setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);

      trackEvent('bingo_pdf_print', {
        gridSize,
        cardCount,
        paperSize,
      });
    } finally {
      setGenerating(false);
    }
  };

  const uniqueWordCount = Array.from(new Set(parsedWords)).length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Controls Panel */}
      <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
        {/* Preset Topic Chips */}
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
            1. Quick ESL Vocabulary Sets
          </span>
          <div className="flex flex-wrap gap-1.5">
            {BINGO_PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => handleSelectPreset(p)}
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

        {/* Game Title */}
        <div className="space-y-1.5">
          <label
            htmlFor="bingo-title-input"
            className="block text-xs font-bold uppercase tracking-wider text-slate-600"
          >
            2. Bingo Title
          </label>
          <input
            id="bingo-title-input"
            type="text"
            maxLength={50}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm font-medium bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#2E6B6B] focus:border-[#2E6B6B]"
          />
        </div>

        {/* Word List */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="bingo-words-input"
              className="block text-xs font-bold uppercase tracking-wider text-slate-600"
            >
              3. Vocabulary Words (1 per line)
            </label>
            <span
              className={`text-[11px] font-bold ${
                parsedWords.length >= minNeeded ? 'text-emerald-700' : 'text-amber-600'
              }`}
            >
              {parsedWords.length} words (min {minNeeded})
            </span>
          </div>
          <textarea
            id="bingo-words-input"
            rows={5}
            value={wordsText}
            onChange={(e) => {
              setWordsText(e.target.value);
              setPreviewIdx(0);
            }}
            placeholder="Type words, one per line..."
            className="w-full px-3.5 py-2.5 text-sm font-medium bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#2E6B6B] focus:border-[#2E6B6B]"
          />
        </div>

        {/* Grid Size & Card Count */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              4. Grid Size
            </span>
            <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs">
              <button
                type="button"
                onClick={() => setGridSize(3)}
                className={`py-2 px-2 rounded-lg font-bold transition-colors ${
                  gridSize === 3
                    ? 'bg-white text-[#2E6B6B] shadow-2xs border border-slate-200/80'
                    : 'text-slate-600'
                }`}
              >
                3×3 Pre-K
              </button>
              <button
                type="button"
                onClick={() => setGridSize(4)}
                className={`py-2 px-2 rounded-lg font-bold transition-colors ${
                  gridSize === 4
                    ? 'bg-white text-[#2E6B6B] shadow-2xs border border-slate-200/80'
                    : 'text-slate-600'
                }`}
              >
                4×4 Kinder
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="bingo-card-count"
              className="block text-xs font-bold uppercase tracking-wider text-slate-600"
            >
              5. Unique Cards
            </label>
            <select
              id="bingo-card-count"
              value={cardCount}
              onChange={(e) => {
                setCardCount(Number(e.target.value));
                setPreviewIdx(0);
              }}
              className="w-full px-3 py-2 text-xs font-bold bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#2E6B6B]"
            >
              {[4, 10, 16, 24, 30].map((n) => (
                <option key={n} value={n}>
                  {n} shuffled student cards
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Paper Size & Cards per Page */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                US Letter
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

          <div className="space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              7. Cards / Sheet
            </span>
            <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs">
              <button
                type="button"
                onClick={() => setCardsPerPage(1)}
                className={`py-2 px-2 rounded-lg font-bold transition-colors ${
                  cardsPerPage === 1
                    ? 'bg-white text-[#2E6B6B] shadow-2xs border border-slate-200/80'
                    : 'text-slate-600'
                }`}
              >
                1 Big
              </button>
              <button
                type="button"
                onClick={() => setCardsPerPage(2)}
                className={`py-2 px-2 rounded-lg font-bold transition-colors ${
                  cardsPerPage === 2
                    ? 'bg-white text-[#2E6B6B] shadow-2xs border border-slate-200/80'
                    : 'text-slate-600'
                }`}
              >
                2 Saver
              </button>
            </div>
          </div>
        </div>

        {/* Options Checkboxes */}
        <div className="space-y-2">
          {gridSize === 3 && (
            <label className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#F0F7F7]/70 border border-[#d0e3e3] cursor-pointer text-xs font-semibold text-slate-800">
              <input
                type="checkbox"
                checked={freeCenter}
                onChange={(e) => setFreeCenter(e.target.checked)}
                className="w-4 h-4 accent-[#2E6B6B] rounded"
              />
              <span>Include FREE center square (3×3)</span>
            </label>
          )}
          <label className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer text-xs font-semibold text-slate-800">
            <input
              type="checkbox"
              checked={includeCallerSheet}
              onChange={(e) => setIncludeCallerSheet(e.target.checked)}
              className="w-4 h-4 accent-[#2E6B6B] rounded"
            />
            <span>Add Teacher Caller Checklist page at the end</span>
          </label>
        </div>

        {/* CTA Actions */}
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
                ? 'Creating Bingo PDF...'
                : `Download Free Bingo PDF (${cardCount} Cards)`}
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
              <span>Shuffle Boards</span>
            </button>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-start gap-2 text-[11px] text-slate-600 leading-relaxed">
          <ShieldCheck className="w-4 h-4 text-[#2E6B6B] shrink-0 mt-0.5" />
          <span>
            <strong>100% Free &amp; Browser-Private:</strong> Every bingo board is shuffled and built locally in your browser—no sign-up or limits.
          </span>
        </div>
      </div>

      {/* Right Live Preview Panel */}
      <div className="lg:col-span-7 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 px-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Sparkles className="w-3.5 h-3.5 text-[#F2B544]" />
            <span>
              Live Preview · {paperSize === 'a4' ? 'A4' : 'US Letter'} ({cardsPerPage === 2 ? '2 cards/sheet' : '1 card/sheet'})
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="inline-flex rounded-lg bg-slate-100 p-0.5 border border-slate-200 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setPreviewMode('card')}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors ${
                  previewMode === 'card'
                    ? 'bg-white text-[#2E6B6B] shadow-2xs'
                    : 'text-slate-600'
                }`}
              >
                <Grid3X3 className="w-3.5 h-3.5" />
                <span>Cards</span>
              </button>
              <button
                type="button"
                onClick={() => setPreviewMode('caller')}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors ${
                  previewMode === 'caller'
                    ? 'bg-white text-[#2E6B6B] shadow-2xs'
                    : 'text-slate-600'
                }`}
              >
                <CheckSquare className="w-3.5 h-3.5" />
                <span>Caller Sheet</span>
              </button>
            </div>

            {previewMode === 'card' && boards.length > 1 && (
              <div className="flex items-center gap-1 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setPreviewIdx((i) => Math.max(0, i - 1))}
                  disabled={safeIdx === 0}
                  aria-label="Previous bingo card"
                  className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 disabled:opacity-40 hover:bg-slate-50"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <span className="px-1.5 text-slate-700">
                  Card <strong className="text-[#2E6B6B]">#{activeBoard.cardNumber}</strong> / {boards.length}
                </span>
                <button
                  type="button"
                  onClick={() => setPreviewIdx((i) => Math.min(boards.length - 1, i + 1))}
                  disabled={safeIdx >= boards.length - 1}
                  aria-label="Next bingo card"
                  className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 disabled:opacity-40 hover:bg-slate-50"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="bg-slate-100/90 border border-slate-200 rounded-2xl p-4 sm:p-6">
          {previewMode === 'card' ? (
            <div className="max-w-[500px] mx-auto bg-white rounded-xl shadow-md border border-slate-200 p-5 sm:p-7 space-y-4">
              <div className="flex items-baseline justify-between border-b-2 border-[#2E6B6B] pb-2">
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 font-heading truncate pr-3">
                  {title || 'ESL Vocabulary Bingo'}
                </h2>
                <span className="text-xs font-bold text-[#2E6B6B] shrink-0">
                  Card #{activeBoard.cardNumber}
                </span>
              </div>

              <div
                className={`grid border-2 border-[#2E6B6B] bg-white ${
                  gridSize === 3 ? 'grid-cols-3' : 'grid-cols-4'
                }`}
              >
                {activeBoard.cells.map((cell, idx) => {
                  const isFree = gridSize === 3 && freeCenter && idx === 4;
                  const row = Math.floor(idx / gridSize);
                  const col = idx % gridSize;
                  return (
                    <div
                      key={idx}
                      className={`aspect-square border border-[#3d7575]/45 flex flex-col items-center justify-center p-2 text-center select-none ${
                        isFree
                          ? 'bg-[#e6f4f2] text-[#2E6B6B]'
                          : (row + col) % 2 === 1
                          ? 'bg-slate-50/70 text-slate-900'
                          : 'bg-white text-slate-900'
                      }`}
                    >
                      {isFree ? (
                        <>
                          <span className="text-base sm:text-lg font-extrabold tracking-wide">
                            FREE
                          </span>
                          <span className="text-[9px] font-semibold uppercase tracking-widest opacity-80">
                            Space
                          </span>
                        </>
                      ) : (
                        <span
                          className={`font-extrabold leading-tight break-words ${
                            gridSize === 3 ? 'text-sm sm:text-base' : 'text-xs sm:text-sm'
                          }`}
                        >
                          {cell}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                <span>Free for classroom &amp; home use</span>
                <span>kinderesl.com</span>
              </div>
            </div>
          ) : (
            <div className="max-w-[500px] mx-auto bg-white rounded-xl shadow-md border border-slate-200 p-5 sm:p-7 space-y-4">
              <div className="border-b-2 border-[#2E6B6B] pb-2">
                <h2 className="text-base sm:text-lg font-extrabold text-slate-900 font-heading">
                  Teacher Caller Sheet: {title || 'ESL Bingo'}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Check off words as you call them ({uniqueWordCount} items · {cardCount} student cards)
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {Array.from(new Set(parsedWords)).slice(0, 32).map((w, i) => (
                  <div
                    key={`${w}-${i}`}
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-[#F0F7F7]/60 border border-[#d0e3e3] text-xs font-semibold text-slate-800"
                  >
                    <span className="w-3.5 h-3.5 rounded border border-[#2E6B6B] bg-white shrink-0" />
                    <span className="truncate">
                      {i + 1}. {w}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
