'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  BINGO_PRESETS,
  PICTURE_BINGO_PRESETS,
  buildShuffledBoards,
  buildShuffledItemBoards,
  generateBingoPdf,
  type BingoCardMode,
  type BingoItem,
  type BingoPreset,
  type PictureBingoPreset,
} from '@/lib/bingo-pdf';
import {
  clipartUrl,
  formatClipartLabel,
  getClipart,
  listThemes,
  searchClipart,
  type ClipartItem,
} from '@/lib/clipart';
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
  Search,
} from 'lucide-react';

export function BingoGenerator() {
  const [cardMode, setCardMode] = useState<BingoCardMode>('picture-word');
  const [title, setTitle] = useState(PICTURE_BINGO_PRESETS[0].title);
  const [selectedItems, setSelectedItems] = useState<BingoItem[]>(
    PICTURE_BINGO_PRESETS[0].items
  );
  const [wordsText, setWordsText] = useState(BINGO_PRESETS[0].words.join('\n'));
  const [searchQuery, setSearchQuery] = useState('');
  const [themeFilter, setThemeFilter] = useState('all');
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

  useEffect(() => {
    const param = new URLSearchParams(window.location.search).get('theme');
    if (!param) return;
    const found = PICTURE_BINGO_PRESETS.find(
      (p) => p.id === param || p.id === `pic-${param}`
    );
    if (found) {
      setCardMode('picture-word');
      setTitle(found.title);
      setSelectedItems(found.items);
      if (found.items.length < 16) setGridSize(3);
      setPreviewIdx(0);
    }
  }, []);

  const themes = useMemo(() => listThemes(), []);

  const filteredClipart = useMemo(
    () => searchClipart(searchQuery, { theme: themeFilter }),
    [searchQuery, themeFilter]
  );

  const selectedClipartIds = useMemo(
    () => new Set(selectedItems.map((it) => it.clipartId).filter(Boolean)),
    [selectedItems]
  );

  const parsedWords = useMemo(
    () =>
      wordsText
        .split(/[\n,;]+/)
        .map((w) => w.trim())
        .filter(Boolean),
    [wordsText]
  );

  const minNeeded = gridSize === 3 ? (freeCenter ? 8 : 9) : 16;

  const activeItemsList: BingoItem[] = useMemo(() => {
    if (cardMode === 'word-only') {
      return parsedWords.map((w) => ({ label: w }));
    }
    return selectedItems;
  }, [cardMode, parsedWords, selectedItems]);

  const boards = useMemo(() => {
    if (cardMode === 'word-only') {
      return buildShuffledBoards(parsedWords, gridSize, freeCenter, cardCount, seed).map(
        (b) => ({
          cardNumber: b.cardNumber,
          cells: b.cells.map((label) => ({ label }) as BingoItem),
        })
      );
    }
    return buildShuffledItemBoards(
      selectedItems,
      gridSize,
      freeCenter,
      cardCount,
      seed
    );
  }, [cardMode, parsedWords, selectedItems, gridSize, freeCenter, cardCount, seed]);

  const safeIdx = Math.min(previewIdx, boards.length - 1);
  const activeBoard = boards[safeIdx] || boards[0];

  const handleModeChange = (nextMode: BingoCardMode) => {
    setCardMode(nextMode);
    if (nextMode === 'word-only' && title === PICTURE_BINGO_PRESETS[0].title) {
      setTitle(BINGO_PRESETS[0].title);
    } else if (
      nextMode !== 'word-only' &&
      title === BINGO_PRESETS[0].title
    ) {
      setTitle(PICTURE_BINGO_PRESETS[0].title);
    }
    setPreviewIdx(0);
  };

  const handleSelectTextPreset = (preset: BingoPreset) => {
    setTitle(preset.title);
    setWordsText(preset.words.join('\n'));
    setPreviewIdx(0);
    setSeed((s) => s + 1);
  };

  const handleSelectPicturePreset = (preset: PictureBingoPreset) => {
    setTitle(preset.title);
    setSelectedItems(preset.items);
    if (gridSize === 4 && preset.items.length < 16) {
      setGridSize(3);
    }
    setPreviewIdx(0);
    setSeed((s) => s + 1);
  };

  const togglePictureItem = (item: ClipartItem) => {
    setSelectedItems((prev) => {
      const exists = prev.some((it) => it.clipartId === item.id);
      if (exists) {
        if (prev.length <= 1) return prev;
        return prev.filter((it) => it.clipartId !== item.id);
      }
      if (prev.length >= 30) return prev;
      return [...prev, { label: formatClipartLabel(item), clipartId: item.id }];
    });
    setPreviewIdx(0);
  };

  const buildPdfBytes = () =>
    generateBingoPdf({
      title,
      words: parsedWords,
      mode: cardMode,
      items: cardMode === 'word-only' ? undefined : selectedItems,
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
        mode: cardMode,
        gridSize,
        cardCount,
        cardsPerPage,
        paperSize,
        wordCount: activeItemsList.length,
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
        mode: cardMode,
        gridSize,
        cardCount,
        paperSize,
      });
    } finally {
      setGenerating(false);
    }
  };

  const uniqueCallerItems = useMemo(() => {
    const seen = new Set<string>();
    const out: BingoItem[] = [];
    for (const it of activeItemsList) {
      const key = it.clipartId || it.label.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        out.push(it);
      }
    }
    return out;
  }, [activeItemsList]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Controls Panel */}
      <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
        {/* Card Mode Toggle */}
        <div className="space-y-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
            1. Bingo Card Style
          </span>
          <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-slate-100 border border-slate-200 text-[11px]">
            {[
              { id: 'picture-word' as const, label: 'Picture + Word' },
              { id: 'picture-only' as const, label: 'Picture Only' },
              { id: 'word-only' as const, label: 'Text Only' },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleModeChange(opt.id)}
                className={`py-2 px-1.5 rounded-lg font-bold transition-colors ${
                  cardMode === opt.id
                    ? 'bg-white text-[#2E6B6B] shadow-2xs border border-slate-200/80'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Presets */}
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
            2. Quick ESL Vocabulary Sets
          </span>
          {cardMode === 'word-only' ? (
            <div className="flex flex-wrap gap-1.5">
              {BINGO_PRESETS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleSelectTextPreset(p)}
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
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {PICTURE_BINGO_PRESETS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleSelectPicturePreset(p)}
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
          )}
        </div>

        {/* Game Title */}
        <div className="space-y-1.5">
          <label
            htmlFor="bingo-title-input"
            className="block text-xs font-bold uppercase tracking-wider text-slate-600"
          >
            3. Bingo Title
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

        {/* Picture Picker OR Custom Words */}
        {cardMode === 'word-only' ? (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="bingo-words-input"
                className="block text-xs font-bold uppercase tracking-wider text-slate-600"
              >
                4. Vocabulary Words (1 per line)
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
        ) : (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                4. Pick Drawings
              </span>
              <span
                className={`text-[11px] font-bold ${
                  selectedItems.length >= minNeeded ? 'text-emerald-700' : 'text-amber-600'
                }`}
              >
                {selectedItems.length} selected (min {minNeeded})
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
                aria-label="Filter bingo drawings by theme"
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

            <div className="grid grid-cols-4 gap-1.5 max-h-44 overflow-y-auto p-2 rounded-xl bg-slate-50 border border-slate-200">
              {filteredClipart.map((item) => {
                const active = selectedClipartIds.has(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => togglePictureItem(item)}
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
        )}

        {/* Grid Size & Card Count */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              5. Grid Size
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
              6. Unique Cards
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
              8. Cards / Sheet
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
            <strong>100% Free &amp; Browser-Private:</strong> Every picture or word bingo board is shuffled and built locally in your browser.
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
                  const clipItem =
                    cardMode !== 'word-only' && cell.clipartId
                      ? getClipart(cell.clipartId)
                      : undefined;

                  return (
                    <div
                      key={idx}
                      className={`aspect-square border border-[#3d7575]/45 flex flex-col items-center justify-center p-1.5 text-center select-none overflow-hidden ${
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
                      ) : clipItem ? (
                        cardMode === 'picture-only' ? (
                          <img
                            src={clipartUrl(clipItem)}
                            alt={cell.label}
                            className="w-4/5 h-4/5 object-contain"
                          />
                        ) : (
                          <>
                            <div className="flex-1 min-h-0 w-full flex items-center justify-center p-0.5">
                              <img
                                src={clipartUrl(clipItem)}
                                alt={cell.label}
                                className="max-w-full max-h-full object-contain"
                              />
                            </div>
                            <span
                              className={`font-extrabold leading-tight truncate w-full ${
                                gridSize === 3 ? 'text-[11px] sm:text-xs' : 'text-[9px] sm:text-[10px]'
                              }`}
                            >
                              {cell.label}
                            </span>
                          </>
                        )
                      ) : (
                        <span
                          className={`font-extrabold leading-tight break-words ${
                            gridSize === 3 ? 'text-sm sm:text-base' : 'text-xs sm:text-sm'
                          }`}
                        >
                          {cell.label}
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
                  Check off items as you call them ({uniqueCallerItems.length} items · {cardCount} student cards)
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {uniqueCallerItems.slice(0, 32).map((item, i) => {
                  const clipItem =
                    cardMode !== 'word-only' && item.clipartId
                      ? getClipart(item.clipartId)
                      : undefined;
                  return (
                    <div
                      key={`${item.label}-${i}`}
                      className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-[#F0F7F7]/60 border border-[#d0e3e3] text-xs font-semibold text-slate-800"
                    >
                      <span className="w-3.5 h-3.5 rounded border border-[#2E6B6B] bg-white shrink-0" />
                      {clipItem && (
                        <img
                          src={clipartUrl(clipItem)}
                          alt={item.label}
                          className="w-5 h-5 object-contain shrink-0"
                        />
                      )}
                      <span className="truncate">
                        {i + 1}. {item.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
