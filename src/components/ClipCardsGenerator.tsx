'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  CLIP_CARD_PRESETS,
  buildClipCards,
  generateClipCardsPdf,
  type ClipCardGridSize,
  type ClipCardLetterCase,
  type ClipCardPreset,
} from '@/lib/clip-cards-pdf';
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
  Shuffle,
  ShieldCheck,
  Sparkles,
  Search,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export function ClipCardsGenerator() {
  const defaultPreset = CLIP_CARD_PRESETS[0];
  const [title, setTitle] = useState(defaultPreset.title);
  const [selectedIds, setSelectedIds] = useState<string[]>(defaultPreset.clipartIds);
  const [gridSize, setGridSize] = useState<ClipCardGridSize>('2x2');
  const [letterCase, setLetterCase] = useState<ClipCardLetterCase>('upper');
  const [paperSize, setPaperSize] = useState<PaperSizeOption>('letter');
  const [showCutLines, setShowCutLines] = useState(true);
  const [includeAnswerKey, setIncludeAnswerKey] = useState(true);
  const [seed, setSeed] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [themeFilter, setThemeFilter] = useState('all');
  const [previewPage, setPreviewPage] = useState(0);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    const param = new URLSearchParams(window.location.search).get('theme');
    if (!param) return;
    const found = CLIP_CARD_PRESETS.find((p) => p.id === param);
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

  const cards = useMemo(
    () =>
      buildClipCards({
        title,
        clipartIds: selectedIds,
        gridSize,
        letterCase,
        paperSize,
        showCutLines,
        includeAnswerKey,
        seed,
      }),
    [title, selectedIds, gridSize, letterCase, paperSize, showCutLines, includeAnswerKey, seed]
  );

  const perPage = gridSize === '2x2' ? 4 : 6;
  const totalPages = Math.max(1, Math.ceil(cards.length / perPage));
  const safePage = Math.min(previewPage, totalPages - 1);
  const pageCards = cards.slice(safePage * perPage, (safePage + 1) * perPage);
  const paperLabel = getPaperLabel(paperSize);

  const applyPreset = (preset: ClipCardPreset) => {
    setTitle(preset.title);
    setSelectedIds(preset.clipartIds);
    setPreviewPage(0);
    setSeed((s) => s + 1);
  };

  const toggleClipart = (item: ClipartItem) => {
    setSelectedIds((prev) => {
      if (prev.includes(item.id)) {
        if (prev.length <= 4) return prev;
        return prev.filter((id) => id !== item.id);
      }
      if (prev.length >= 24) return prev;
      return [...prev, item.id];
    });
    setPreviewPage(0);
  };

  const buildPdfBytes = () =>
    generateClipCardsPdf({
      title,
      clipartIds: selectedIds,
      gridSize,
      letterCase,
      paperSize,
      showCutLines,
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
      const slug = (title || 'clip-cards')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 40);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `clip-cards-${slug || 'phonics'}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 15000);

      trackEvent('clip_cards_pdf_download', {
        cardCount: cards.length,
        gridSize,
        letterCase,
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

      trackEvent('clip_cards_pdf_print', { cardCount: cards.length, gridSize, paperSize });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
        <div className="space-y-2">
          <span className="block text-xs font-bold uppercase tracking-wider text-slate-600">
            1. Quick Phonics &amp; ESL Sets
          </span>
          <div className="flex flex-wrap gap-1.5">
            {CLIP_CARD_PRESETS.map((p) => (
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
            htmlFor="clip-title-input"
            className="block text-xs font-bold uppercase tracking-wider text-slate-600"
          >
            2. Deck Title
          </label>
          <input
            id="clip-title-input"
            type="text"
            maxLength={54}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3.5 py-2 text-sm font-medium bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#2E6B6B]"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              3. Pick Pictures (4–24)
            </span>
            <span className="text-[11px] font-bold text-[#2E6B6B]">
              {cards.length} / 24 cards
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
              aria-label="Filter clip card drawings by theme"
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
              4. Cards / Sheet
            </span>
            <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs">
              <button
                type="button"
                onClick={() => {
                  setGridSize('2x2');
                  setPreviewPage(0);
                }}
                className={`py-2 px-2 rounded-lg font-bold transition-colors ${
                  gridSize === '2x2'
                    ? 'bg-white text-[#2E6B6B] shadow-2xs border border-slate-200/80'
                    : 'text-slate-600'
                }`}
              >
                2×2 (4 Big)
              </button>
              <button
                type="button"
                onClick={() => {
                  setGridSize('2x3');
                  setPreviewPage(0);
                }}
                className={`py-2 px-2 rounded-lg font-bold transition-colors ${
                  gridSize === '2x3'
                    ? 'bg-white text-[#2E6B6B] shadow-2xs border border-slate-200/80'
                    : 'text-slate-600'
                }`}
              >
                2×3 (6 Saver)
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              5. Paper Size
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

        <div className="space-y-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
            6. Choice Letter Style
          </span>
          <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs">
            {[
              { id: 'upper' as const, label: 'UPPER (C)' },
              { id: 'lower' as const, label: 'lower (c)' },
              { id: 'mixed' as const, label: 'Both (Cc)' },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setLetterCase(opt.id)}
                className={`py-2 px-1 rounded-lg font-bold transition-colors ${
                  letterCase === opt.id
                    ? 'bg-white text-[#2E6B6B] shadow-2xs border border-slate-200/80'
                    : 'text-slate-600'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#F0F7F7]/70 border border-[#d0e3e3] cursor-pointer text-xs font-semibold text-slate-800">
            <input
              type="checkbox"
              checked={includeAnswerKey}
              onChange={(e) => setIncludeAnswerKey(e.target.checked)}
              className="w-4 h-4 accent-[#2E6B6B] rounded"
            />
            <span>Include Teacher Answer Key page</span>
          </label>
          <label className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer text-xs font-semibold text-slate-800">
            <input
              type="checkbox"
              checked={showCutLines}
              onChange={(e) => setShowCutLines(e.target.checked)}
              className="w-4 h-4 accent-[#2E6B6B] rounded"
            />
            <span>Show dashed scissors cut guides</span>
          </label>
        </div>

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
                ? 'Creating Clip Cards PDF...'
                : `Download Free Clip Cards PDF (${cards.length} Cards)`}
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
              <span>Shuffle Letters</span>
            </button>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-start gap-2 text-[11px] text-slate-600 leading-relaxed">
          <ShieldCheck className="w-4 h-4 text-[#2E6B6B] shrink-0 mt-0.5" />
          <span>
            <strong>Fine-Motor + Phonics:</strong> Print on cardstock or laminate—students pinch clothespins or use mini erasers on the matching sound.
          </span>
        </div>
      </div>

      {/* Live Preview */}
      <div className="lg:col-span-7 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 px-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Sparkles className="w-3.5 h-3.5 text-[#F2B544]" />
            <span>
              Live Clip Cards Preview · {paperLabel} ({gridSize})
            </span>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center gap-1.5 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setPreviewPage((p) => Math.max(0, p - 1))}
                disabled={safePage === 0}
                aria-label="Previous page"
                className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 disabled:opacity-40 hover:bg-slate-50"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="px-2 text-slate-700">
                Page {safePage + 1} of {totalPages}
              </span>
              <button
                type="button"
                onClick={() =>
                  setPreviewPage((p) => Math.min(totalPages - 1, p + 1))
                }
                disabled={safePage >= totalPages - 1}
                aria-label="Next page"
                className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 disabled:opacity-40 hover:bg-slate-50"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        <div className="bg-slate-100/90 border border-slate-200 rounded-2xl p-4 sm:p-6 flex items-center justify-center">
          <div className="w-full max-w-[520px] bg-white rounded-xl shadow-md border border-slate-200 p-5 sm:p-6 flex flex-col justify-between aspect-[8.5/11]">
            <div>
              <div className="flex items-baseline justify-between gap-2 border-b-2 border-[#2E6B6B] pb-2 mb-3">
                <h2 className="text-sm sm:text-base font-extrabold text-slate-900 font-heading truncate">
                  {title}
                </h2>
                <span className="text-[10px] font-medium text-slate-500 shrink-0">
                  {paperLabel}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {pageCards.map((card) => {
                  const item = getClipart(card.clipartId);
                  return (
                    <div
                      key={card.clipartId}
                      className={`rounded-xl border-2 border-[#2E6B6B] bg-white overflow-hidden flex flex-col justify-between p-2 ${
                        gridSize === '2x2' ? 'aspect-[1/1.1]' : 'aspect-[1.2/1]'
                      } ${
                        showCutLines
                          ? 'outline-1 outline-dashed outline-slate-300 outline-offset-2'
                          : ''
                      }`}
                    >
                      <div className="flex-1 min-h-0 flex items-center justify-center p-1">
                        {item && (
                          <img
                            src={clipartUrl(item)}
                            alt={card.word}
                            className="max-w-full max-h-full object-contain"
                          />
                        )}
                      </div>
                      <div className="grid grid-cols-3 gap-1.5 pt-1 shrink-0">
                        {card.choices.map((ch) => (
                          <div
                            key={ch}
                            className="h-9 sm:h-10 rounded-lg border border-[#2E6B6B] bg-[#F0F7F7] flex items-center justify-center text-sm sm:text-base font-extrabold text-slate-900"
                          >
                            {ch}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 text-center text-[9px] text-slate-500">
              Cut out cards and clip a clothespin on the matching beginning sound · kinderesl.com
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
