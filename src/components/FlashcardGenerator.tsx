'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  FLASHCARD_PRESETS,
  buildEntriesFromClipartIds,
  generateFlashcardPdf,
  getFlashcardGridSpec,
  type FlashcardEntry,
  type FlashcardGridSize,
  type FlashcardLabelMode,
} from '@/lib/flashcard-pdf';
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
import {
  layoutNameStrokes,
  strokeCommandsToSvgPath,
} from '@/lib/tracing-strokes';
import { trackEvent } from '@/lib/analytics';
import {
  FileDown,
  Printer,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Search,
  Upload,
  X,
} from 'lucide-react';

async function fileToPngDataUrl(
  file: File
): Promise<{ dataUrl: string; width: number; height: number }> {
  const rawUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Could not read file'));
    reader.readAsDataURL(file);
  });

  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const el = new Image();
    el.onload = () => resolve(el);
    el.onerror = () => reject(new Error('Invalid image file'));
    el.src = rawUrl;
  });

  const maxSide = 900;
  const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
  const w = Math.max(1, Math.round(img.width * scale));
  const h = Math.max(1, Math.round(img.height * scale));
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.drawImage(img, 0, 0, w, h);
  }
  return { dataUrl: canvas.toDataURL('image/png'), width: w, height: h };
}

function MiniTraceSvg({ label }: { label: string }) {
  const svgW = 140;
  const rowH = 32;
  const topY = 4;
  const midY = topY + rowH * 0.48;
  const baseY = topY + rowH;
  const layout = layoutNameStrokes(label || 'Word', {
    boxX: 6,
    boxY: topY,
    boxWidth: svgW - 12,
    rowHeight: rowH,
    align: 'center',
  });

  return (
    <svg
      viewBox={`0 0 ${svgW} ${rowH + 10}`}
      className="w-full h-8 select-none"
      aria-hidden="true"
    >
      <line x1={4} y1={topY} x2={svgW - 4} y2={topY} stroke="#94ABB8" strokeWidth={0.9} />
      <line
        x1={4}
        y1={midY}
        x2={svgW - 4}
        y2={midY}
        stroke="#ADC2CF"
        strokeWidth={0.85}
        strokeDasharray="4 3"
      />
      <line x1={4} y1={baseY} x2={svgW - 4} y2={baseY} stroke="#94ABB8" strokeWidth={1.1} />
      {layout.strokes.map((s, idx) => (
        <path
          key={idx}
          d={strokeCommandsToSvgPath(s.commands)}
          fill="none"
          stroke="#4D5C6E"
          strokeWidth={1.6}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="2.5 3"
        />
      ))}
      {layout.strokes.map((s, idx) =>
        s.startDot ? (
          <circle
            key={`d-${idx}`}
            cx={s.startDot[0]}
            cy={s.startDot[1]}
            r={2}
            fill="#2E6B6B"
          />
        ) : null
      )}
    </svg>
  );
}

export function FlashcardGenerator() {
  const defaultPreset = FLASHCARD_PRESETS[0];
  const [selectedPresetId, setSelectedPresetId] = useState(defaultPreset.id);
  const [title, setTitle] = useState(defaultPreset.title);
  const [entries, setEntries] = useState<FlashcardEntry[]>(() =>
    buildEntriesFromClipartIds(defaultPreset.clipartIds)
  );
  const [gridSize, setGridSize] = useState<FlashcardGridSize>('2x2');
  const [labelMode, setLabelMode] = useState<FlashcardLabelMode>('picture-word');
  const [paperSize, setPaperSize] = useState<PaperSizeOption>('letter');
  const [showCutLines, setShowCutLines] = useState(true);
  const [includeWordDeck, setIncludeWordDeck] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [themeFilter, setThemeFilter] = useState('all');
  const [previewPage, setPreviewPage] = useState(0);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    const param = new URLSearchParams(window.location.search).get('theme');
    if (!param) return;
    const found = FLASHCARD_PRESETS.find((p) => p.id === param);
    if (found) {
      setSelectedPresetId(found.id);
      setTitle(found.title);
      setEntries(buildEntriesFromClipartIds(found.clipartIds));
      setPreviewPage(0);
    }
  }, []);

  const themes = useMemo(() => listThemes(), []);

  const filteredClipart = useMemo(
    () => searchClipart(searchQuery, { theme: themeFilter }),
    [searchQuery, themeFilter]
  );

  const selectedClipartIds = useMemo(
    () => new Set(entries.map((e) => e.clipartId).filter(Boolean)),
    [entries]
  );

  const { cols, perPage } = getFlashcardGridSpec(gridSize);
  const totalPages = Math.max(1, Math.ceil(entries.length / perPage));
  const safePageIdx = Math.min(previewPage, totalPages - 1);
  const pageEntries = entries.slice(
    safePageIdx * perPage,
    (safePageIdx + 1) * perPage
  );
  const paperLabel = getPaperLabel(paperSize);

  const applyPreset = (presetId: string) => {
    const found = FLASHCARD_PRESETS.find((p) => p.id === presetId);
    if (!found) return;
    setSelectedPresetId(found.id);
    setTitle(found.title);
    setEntries(buildEntriesFromClipartIds(found.clipartIds));
    setPreviewPage(0);
  };

  const toggleClipartItem = (item: ClipartItem) => {
    setSelectedPresetId('custom');
    setEntries((prev) => {
      const exists = prev.some((e) => e.clipartId === item.id);
      if (exists) {
        if (prev.length === 1) return prev;
        return prev.filter((e) => e.clipartId !== item.id);
      }
      if (prev.length >= 36) return prev;
      return [
        ...prev,
        {
          id: `clip-${item.id}`,
          clipartId: item.id,
          label: formatClipartLabel(item),
        },
      ];
    });
    setPreviewPage(0);
  };

  const handleUploadCustomImages = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const added: FlashcardEntry[] = [];
    for (const file of files.slice(0, 12)) {
      try {
        const converted = await fileToPngDataUrl(file);
        const rawLabel = file.name
          .replace(/\.[^/.]+$/, '')
          .replace(/[-_]+/g, ' ')
          .trim();
        const label = rawLabel
          ? rawLabel
              .split(/\s+/)
              .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
              .join(' ')
          : 'Custom Card';
        added.push({
          id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          label,
          customImageDataUrl: converted.dataUrl,
          customWidth: converted.width,
          customHeight: converted.height,
        });
      } catch {
        // Ignore unreadable image file
      }
    }

    if (added.length > 0) {
      setSelectedPresetId('custom');
      setEntries((prev) => [...prev, ...added].slice(0, 36));
      setPreviewPage(0);
    }
    e.target.value = '';
  };

  const updateEntryLabel = (id: string, newLabel: string) => {
    setEntries((prev) =>
      prev.map((entry) =>
        entry.id === id ? { ...entry, label: newLabel } : entry
      )
    );
  };

  const removeEntry = (id: string) => {
    setEntries((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((e) => e.id !== id);
    });
    setPreviewPage(0);
  };

  const buildPdfBytes = async () => {
    return generateFlashcardPdf({
      title,
      entries,
      gridSize,
      labelMode,
      paperSize,
      showCutLines,
      includeWordDeck,
    });
  };

  const handleDownload = async () => {
    if (generating) return;
    setGenerating(true);
    try {
      const pdfBytes = await buildPdfBytes();
      const blob = new Blob([new Uint8Array(pdfBytes)], {
        type: 'application/pdf',
      });
      const blobUrl = URL.createObjectURL(blob);
      const slug = (title || 'esl-flashcards')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 40);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `flashcards-${slug || 'set'}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 15000);

      trackEvent('flashcard_maker_pdf_download', {
        cardCount: entries.length,
        gridSize,
        labelMode,
        paperSize,
        includeWordDeck,
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
      const blob = new Blob([new Uint8Array(pdfBytes)], {
        type: 'application/pdf',
      });
      const blobUrl = URL.createObjectURL(blob);
      const win = window.open(blobUrl, '_blank');
      if (win) win.focus();
      setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);

      trackEvent('flashcard_maker_pdf_print', {
        cardCount: entries.length,
        gridSize,
        labelMode,
        paperSize,
      });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Controls Panel */}
      <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
        {/* Presets */}
        <div className="space-y-2">
          <span className="block text-xs font-bold uppercase tracking-wider text-slate-600">
            1. Quick ESL Vocabulary Sets
          </span>
          <div className="flex flex-wrap gap-1.5">
            {FLASHCARD_PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => applyPreset(p.id)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                  selectedPresetId === p.id
                    ? 'bg-[#2E6B6B] text-white border-[#2E6B6B]'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-[#2E6B6B] hover:text-[#2E6B6B]'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div className="space-y-1.5">
          <label
            htmlFor="flashcard-title-input"
            className="block text-xs font-bold uppercase tracking-wider text-slate-600"
          >
            2. Deck Title
          </label>
          <input
            id="flashcard-title-input"
            type="text"
            maxLength={54}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3.5 py-2 text-sm font-medium bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#2E6B6B] focus:border-[#2E6B6B]"
          />
        </div>

        {/* Browse Drawings + Custom Image Upload */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              3. Pick Drawings or Upload Images
            </span>
            <span className="text-[11px] font-bold text-[#2E6B6B]">
              {entries.length} / 36 cards
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

          <div className="grid grid-cols-4 gap-1.5 max-h-48 overflow-y-auto p-2 rounded-xl bg-slate-50 border border-slate-200">
            {filteredClipart.map((item) => {
              const active = selectedClipartIds.has(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleClipartItem(item)}
                  className={`p-1.5 rounded-lg border flex flex-col items-center gap-1 transition-all ${
                    active
                      ? 'bg-[#F0F7F7] border-[#2E6B6B] ring-1 ring-[#2E6B6B]/25'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <img
                    src={clipartUrl(item)}
                    alt={item.name}
                    className="w-9 h-9 object-contain"
                    loading="lazy"
                  />
                  <span className="text-[10px] font-semibold text-slate-700 truncate w-full text-center">
                    {formatClipartLabel(item)}
                  </span>
                </button>
              );
            })}
          </div>

          <label className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-dashed border-[#2E6B6B]/50 bg-[#F0F7F7]/50 hover:bg-[#F0F7F7] text-xs font-bold text-[#2E6B6B] cursor-pointer transition-colors">
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Your Own Pictures (PNG/JPG)</span>
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              multiple
              onChange={handleUploadCustomImages}
              className="sr-only"
            />
          </label>
        </div>

        {/* Selected Card Labels Editor */}
        <div className="space-y-1.5">
          <span className="block text-xs font-bold uppercase tracking-wider text-slate-600">
            4. Edit Card Words ({entries.length})
          </span>
          <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1">
            {entries.map((entry) => {
              const item = entry.clipartId ? getClipart(entry.clipartId) : undefined;
              const imgSrc = item
                ? clipartUrl(item)
                : entry.customImageDataUrl || '';
              return (
                <div
                  key={entry.id}
                  className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-50 border border-slate-200"
                >
                  {imgSrc && (
                    <img
                      src={imgSrc}
                      alt={entry.label}
                      className="w-7 h-7 object-contain bg-white rounded border border-slate-200 p-0.5 shrink-0"
                    />
                  )}
                  <input
                    type="text"
                    maxLength={28}
                    value={entry.label}
                    onChange={(e) => updateEntryLabel(entry.id, e.target.value)}
                    aria-label={`Card label for ${entry.label}`}
                    className="flex-1 min-w-0 px-2 py-1 text-xs font-semibold bg-white border border-slate-200 rounded-md focus:outline-hidden focus:ring-1 focus:ring-[#2E6B6B]"
                  />
                  <button
                    type="button"
                    onClick={() => removeEntry(entry.id)}
                    disabled={entries.length <= 1}
                    aria-label={`Remove ${entry.label}`}
                    className="p-1 text-slate-400 hover:text-rose-600 disabled:opacity-30"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Card Size & Label Mode */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              5. Cards Per Sheet
            </span>
            <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-slate-100 border border-slate-200 text-[11px]">
              {[
                { id: '2x2' as const, label: '2×2 (4)' },
                { id: '2x3' as const, label: '2×3 (6)' },
                { id: '3x3' as const, label: '3×3 (9)' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    setGridSize(opt.id);
                    setPreviewPage(0);
                  }}
                  className={`py-2 px-1 rounded-lg font-bold transition-colors ${
                    gridSize === opt.id
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
        </div>

        {/* Label Mode */}
        <div className="space-y-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
            7. Card Style
          </span>
          <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-slate-100 border border-slate-200 text-[11px]">
            {[
              { id: 'picture-word' as const, label: 'Picture + Word' },
              { id: 'picture-only' as const, label: 'Picture Only' },
              { id: 'picture-trace' as const, label: 'Picture + Trace' },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setLabelMode(opt.id)}
                className={`py-2 px-1.5 rounded-lg font-bold transition-colors ${
                  labelMode === opt.id
                    ? 'bg-white text-[#2E6B6B] shadow-2xs border border-slate-200/80'
                    : 'text-slate-600'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Checkboxes */}
        <div className="space-y-2">
          <label className="flex items-center gap-2.5 p-3 rounded-xl bg-[#F0F7F7]/70 border border-[#d0e3e3] cursor-pointer">
            <input
              type="checkbox"
              checked={includeWordDeck}
              onChange={(e) => setIncludeWordDeck(e.target.checked)}
              className="w-4 h-4 accent-[#2E6B6B] rounded"
            />
            <div>
              <span className="block text-xs font-bold text-slate-800">
                Add Matching Word-Only Cards
              </span>
              <span className="block text-[11px] text-slate-500">
                Appends a matching set of word cards for memory &amp; picture-to-word games.
              </span>
            </div>
          </label>

          <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
            <input
              type="checkbox"
              checked={showCutLines}
              onChange={(e) => setShowCutLines(e.target.checked)}
              className="w-4 h-4 accent-[#2E6B6B] rounded"
            />
            <span className="text-xs font-bold text-slate-800">
              Show dashed scissors cut guides
            </span>
          </label>
        </div>

        {/* Download & Print */}
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
                ? 'Building Flashcard PDF...'
                : `Download Free Flashcard PDF (${entries.length} Cards)`}
            </span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            disabled={generating}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors disabled:opacity-60"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>Open &amp; Print PDF</span>
          </button>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-start gap-2 text-[11px] text-slate-600 leading-relaxed">
          <ShieldCheck className="w-4 h-4 text-[#2E6B6B] shrink-0 mt-0.5" />
          <span>
            <strong>100% Browser-Private:</strong> Uploaded classroom images and custom decks stay inside your browser—never uploaded to any server.
          </span>
        </div>
      </div>

      {/* Right Live Sheet Preview */}
      <div className="lg:col-span-7 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 px-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Sparkles className="w-3.5 h-3.5 text-[#F2B544]" />
            <span>
              Live Flashcard Sheet Preview · {paperLabel} ({gridSize})
            </span>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center gap-1.5 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setPreviewPage((p) => Math.max(0, p - 1))}
                disabled={safePageIdx === 0}
                aria-label="Previous page"
                className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 disabled:opacity-40 hover:bg-slate-50"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="px-2 text-slate-700">
                Page {safePageIdx + 1} of {totalPages}
              </span>
              <button
                type="button"
                onClick={() =>
                  setPreviewPage((p) => Math.min(totalPages - 1, p + 1))
                }
                disabled={safePageIdx >= totalPages - 1}
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
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900 font-heading truncate">
                  {title || 'ESL Picture Flashcards'}
                </h3>
                <span className="text-[10px] font-medium text-slate-500 shrink-0">
                  {paperLabel}
                </span>
              </div>

              <div
                className={`grid ${
                  cols === 2 ? 'grid-cols-2' : 'grid-cols-3'
                } gap-2.5 sm:gap-3`}
              >
                {pageEntries.map((entry) => {
                  const item = entry.clipartId
                    ? getClipart(entry.clipartId)
                    : undefined;
                  const imgSrc = item
                    ? clipartUrl(item)
                    : entry.customImageDataUrl || '';
                  return (
                    <div
                      key={entry.id}
                      className={`rounded-xl border-2 border-[#2E6B6B] bg-white overflow-hidden flex flex-col justify-between ${
                        gridSize === '2x2'
                          ? 'aspect-[1/1.15]'
                          : gridSize === '2x3'
                          ? 'aspect-[1.2/1]'
                          : 'aspect-square'
                      } ${
                        showCutLines ? 'outline-1 outline-dashed outline-slate-300 outline-offset-2' : ''
                      }`}
                    >
                      <div className="h-1.5 bg-[#F0F7F7] w-full shrink-0" />
                      <div className="flex-1 min-h-0 flex items-center justify-center p-2">
                        {imgSrc && (
                          <img
                            src={imgSrc}
                            alt={entry.label}
                            className="max-w-full max-h-full object-contain"
                          />
                        )}
                      </div>
                      {labelMode === 'picture-word' && (
                        <div className="border-t border-[#d0e3e3] px-1.5 py-1.5 text-center bg-white shrink-0">
                          <span
                            className={`font-extrabold text-slate-900 block truncate ${
                              gridSize === '3x3' ? 'text-xs' : 'text-sm sm:text-base'
                            }`}
                          >
                            {entry.label}
                          </span>
                        </div>
                      )}
                      {labelMode === 'picture-trace' && (
                        <div className="px-2 pb-1.5 shrink-0">
                          <MiniTraceSvg label={entry.label} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 text-center text-[10px] text-slate-500">
              Free for classroom &amp; home use · Cut along dashed lines · kinderesl.com
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
