'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  PATTERN_PRESETS,
  buildPatternSheet,
  generatePatternPdf,
  type PatternPreset,
  type PatternRule,
} from '@/lib/pattern-pdf';
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
} from 'lucide-react';

export function PatternGenerator() {
  const defaultPreset = PATTERN_PRESETS[0];
  const [title, setTitle] = useState(defaultPreset.title);
  const [selectedIds, setSelectedIds] = useState<string[]>(defaultPreset.clipartIds);
  const [rule, setRule] = useState<PatternRule>('mixed');
  const [paperSize, setPaperSize] = useState<PaperSizeOption>('letter');
  const [showWordLabels, setShowWordLabels] = useState(true);
  const [includeDistractors, setIncludeDistractors] = useState(true);
  const [includeAnswerKey, setIncludeAnswerKey] = useState(true);
  const [seed, setSeed] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [themeFilter, setThemeFilter] = useState('all');
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    const param = new URLSearchParams(window.location.search).get('theme');
    if (!param) return;
    const found = PATTERN_PRESETS.find((p) => p.id === param);
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

  const sheet = useMemo(
    () =>
      buildPatternSheet({
        title,
        clipartIds: selectedIds,
        rule,
        paperSize,
        showWordLabels,
        includeDistractors,
        includeAnswerKey,
        seed,
      }),
    [title, selectedIds, rule, paperSize, showWordLabels, includeDistractors, includeAnswerKey, seed]
  );

  const paperLabel = getPaperLabel(paperSize);

  const applyPreset = (preset: PatternPreset) => {
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
      if (prev.length >= 12) return prev;
      return [...prev, item.id];
    });
  };

  const buildPdfBytes = () =>
    generatePatternPdf({
      title,
      clipartIds: selectedIds,
      rule,
      paperSize,
      showWordLabels,
      includeDistractors,
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
      const slug = (title || 'patterns')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 40);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `cut-and-paste-patterns-${slug || 'preschool'}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 15000);

      trackEvent('pattern_pdf_download', { rule, paperSize, includeDistractors });
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

      trackEvent('pattern_pdf_print', { rule, paperSize });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
        <div className="space-y-2">
          <span className="block text-xs font-bold uppercase tracking-wider text-slate-600">
            1. Quick Seasonal &amp; ESL Themes
          </span>
          <div className="flex flex-wrap gap-1.5">
            {PATTERN_PRESETS.map((p) => (
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
            htmlFor="pattern-title-input"
            className="block text-xs font-bold uppercase tracking-wider text-slate-600"
          >
            2. Worksheet Title
          </label>
          <input
            id="pattern-title-input"
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
              3. Pick Pictures (3–12)
            </span>
            <span className="text-[11px] font-bold text-[#2E6B6B]">
              {selectedIds.length} / 12 chosen
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
              aria-label="Filter pattern drawings by theme"
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
            4. Pattern Type
          </span>
          <div className="grid grid-cols-5 gap-1 p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs">
            {(
              [
                { id: 'AB', label: 'AB' },
                { id: 'AAB', label: 'AAB' },
                { id: 'ABB', label: 'ABB' },
                { id: 'ABC', label: 'ABC' },
                { id: 'mixed', label: 'Mixed' },
              ] as const
            ).map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setRule(opt.id)}
                className={`py-2 px-1 rounded-lg font-bold transition-colors ${
                  rule === opt.id
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
            5. Paper Size
          </span>
          <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs">
            {(
              [
                { id: 'letter', label: 'US Letter' },
                { id: 'a4', label: 'A4 Paper' },
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

        <div className="space-y-2">
          <label className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#F0F7F7]/70 border border-[#d0e3e3] cursor-pointer text-xs font-semibold text-slate-800">
            <input
              type="checkbox"
              checked={includeDistractors}
              onChange={(e) => setIncludeDistractors(e.target.checked)}
              className="w-4 h-4 accent-[#2E6B6B] rounded"
            />
            <span>Include 2 extra distractor tiles (6 cut pieces)</span>
          </label>
          <label className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer text-xs font-semibold text-slate-800">
            <input
              type="checkbox"
              checked={showWordLabels}
              onChange={(e) => setShowWordLabels(e.target.checked)}
              className="w-4 h-4 accent-[#2E6B6B] rounded"
            />
            <span>Show English word labels on cut pieces</span>
          </label>
          <label className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer text-xs font-semibold text-slate-800">
            <input
              type="checkbox"
              checked={includeAnswerKey}
              onChange={(e) => setIncludeAnswerKey(e.target.checked)}
              className="w-4 h-4 accent-[#2E6B6B] rounded"
            />
            <span>Include Page 2 Answer Key</span>
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
                ? 'Creating Pattern PDF...'
                : 'Download Free Pattern PDF'}
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
              <span>Shuffle Rows</span>
            </button>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-start gap-2 text-[11px] text-slate-600 leading-relaxed">
          <ShieldCheck className="w-4 h-4 text-[#2E6B6B] shrink-0 mt-0.5" />
          <span>
            <strong>Cut-and-Paste Math + ESL:</strong> Kids name each picture aloud in English as they spot AB, AAB, ABB, or ABC sequences.
          </span>
        </div>
      </div>

      {/* Live Preview */}
      <div className="lg:col-span-7 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 px-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Sparkles className="w-3.5 h-3.5 text-[#F2B544]" />
            <span>
              Live Worksheet Preview · {paperLabel} ({rule.toUpperCase()})
            </span>
          </div>
          <span className="text-[11px] font-semibold text-slate-500">
            4 Pattern Rows + {sheet.cutTiles.length} Cut Pieces
          </span>
        </div>

        <div className="bg-slate-100/90 border border-slate-200 rounded-2xl p-4 sm:p-6 flex items-center justify-center">
          <div className="w-full max-w-[540px] bg-white rounded-xl shadow-md border border-slate-200 p-5 sm:p-6 flex flex-col justify-between aspect-[8.5/11]">
            <div className="space-y-4">
              <div className="border-b-2 border-[#2E6B6B] pb-2">
                <div className="flex items-baseline justify-between gap-2">
                  <h2 className="text-sm sm:text-base font-extrabold text-slate-900 font-heading truncate">
                    {title}
                  </h2>
                  <span className="text-[10px] font-medium text-slate-500 shrink-0">
                    {paperLabel}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  Look at each row. Cut and glue the picture that comes next!
                </p>
              </div>

              <div className="space-y-2.5">
                {sheet.rows.map((row) => (
                  <div key={row.rowIndex} className="flex items-center gap-1.5 sm:gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#F0F7F7] border border-[#2E6B6B] text-[#2E6B6B] text-[10px] font-extrabold flex items-center justify-center shrink-0">
                      {row.rowIndex + 1}
                    </span>
                    <div className="grid grid-cols-6 gap-1.5 flex-1">
                      {row.slots.map((slotId, idx) => {
                        const item = getClipart(slotId);
                        return (
                          <div
                            key={idx}
                            className="aspect-square rounded-lg border border-slate-300 bg-white p-1 flex items-center justify-center"
                          >
                            {item && (
                              <img
                                src={clipartUrl(item)}
                                alt={formatClipartLabel(item)}
                                className="max-w-full max-h-full object-contain"
                              />
                            )}
                          </div>
                        );
                      })}
                      <div className="aspect-square rounded-lg border-2 border-dashed border-[#2E6B6B] bg-[#F0F7F7] flex items-center justify-center text-sm sm:text-base font-extrabold text-[#2E6B6B]/60">
                        ?
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-3 border-t-2 border-dashed border-[#2E6B6B]/70">
              <p className="text-center text-[10px] font-bold text-[#2E6B6B]">
                Cut out the pictures below and glue each one into the matching box
              </p>
              <div className="flex items-center justify-center gap-2 sm:gap-2.5">
                {sheet.cutTiles.map((tileId, idx) => {
                  const item = getClipart(tileId);
                  return (
                    <div
                      key={`${tileId}-${idx}`}
                      className="w-14 sm:w-16 aspect-square rounded-lg border border-dashed border-[#2E6B6B] bg-white p-1 flex flex-col items-center justify-between"
                    >
                      <div className="flex-1 min-h-0 flex items-center justify-center">
                        {item && (
                          <img
                            src={clipartUrl(item)}
                            alt={formatClipartLabel(item)}
                            className="max-w-full max-h-full object-contain"
                          />
                        )}
                      </div>
                      {showWordLabels && item && (
                        <span className="text-[8px] font-bold text-slate-700 truncate w-full text-center">
                          {formatClipartLabel(item)}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
