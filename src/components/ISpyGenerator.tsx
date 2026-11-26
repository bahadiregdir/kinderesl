'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  I_SPY_PRESETS,
  buildISpyLayout,
  generateISpyPdf,
  getISpySheetGeometry,
  type ISpyDifficulty,
  type ISpyPreset,
} from '@/lib/i-spy-pdf';
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
  Eye,
  CheckSquare,
} from 'lucide-react';

export function ISpyGenerator() {
  const defaultPreset = I_SPY_PRESETS[0];
  const [title, setTitle] = useState(defaultPreset.title);
  const [selectedIds, setSelectedIds] = useState<string[]>(defaultPreset.clipartIds);
  const [difficulty, setDifficulty] = useState<ISpyDifficulty>('medium');
  const [paperSize, setPaperSize] = useState<PaperSizeOption>('letter');
  const [showWordLabels, setShowWordLabels] = useState(true);
  const [allowRotation, setAllowRotation] = useState(true);
  const [includeAnswerKey, setIncludeAnswerKey] = useState(true);
  const [seed, setSeed] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [themeFilter, setThemeFilter] = useState('all');
  const [previewTab, setPreviewTab] = useState<'student' | 'answer'>('student');
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    const param = new URLSearchParams(window.location.search).get('theme');
    if (!param) return;
    const found = I_SPY_PRESETS.find((p) => p.id === param);
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

  const geom = useMemo(() => getISpySheetGeometry(paperSize), [paperSize]);
  const layout = useMemo(
    () =>
      buildISpyLayout({
        title,
        clipartIds: selectedIds,
        difficulty,
        paperSize,
        showWordLabels,
        allowRotation,
        includeAnswerKey,
        seed,
      }),
    [
      title,
      selectedIds,
      difficulty,
      paperSize,
      showWordLabels,
      allowRotation,
      includeAnswerKey,
      seed,
    ]
  );

  const paperLabel = getPaperLabel(paperSize);

  const applyPreset = (preset: ISpyPreset) => {
    setTitle(preset.title);
    setSelectedIds(preset.clipartIds);
    setSeed((s) => s + 1);
  };

  const toggleClipartItem = (item: ClipartItem) => {
    setSelectedIds((prev) => {
      if (prev.includes(item.id)) {
        if (prev.length <= 4) return prev;
        return prev.filter((id) => id !== item.id);
      }
      if (prev.length >= 8) return prev;
      return [...prev, item.id];
    });
    setSeed((s) => s + 1);
  };

  const buildPdfBytes = () =>
    generateISpyPdf({
      title,
      clipartIds: selectedIds,
      difficulty,
      paperSize,
      showWordLabels,
      allowRotation,
      includeAnswerKey,
      seed,
    });

  const handleDownload = async () => {
    if (generating) return;
    setGenerating(true);
    try {
      const pdfBytes = await buildPdfBytes();
      const blob = new Blob([new Uint8Array(pdfBytes)], {
        type: 'application/pdf',
      });
      const blobUrl = URL.createObjectURL(blob);
      const slug = (title || 'i-spy-worksheet')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 40);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${slug || 'i-spy-worksheet'}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 15000);

      trackEvent('i_spy_pdf_download', {
        difficulty,
        targetCount: layout.targets.length,
        totalObjects: layout.totalObjects,
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
      const blob = new Blob([new Uint8Array(pdfBytes)], {
        type: 'application/pdf',
      });
      const blobUrl = URL.createObjectURL(blob);
      const win = window.open(blobUrl, '_blank');
      if (win) win.focus();
      setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);

      trackEvent('i_spy_pdf_print', {
        difficulty,
        targetCount: layout.targets.length,
        paperSize,
      });
    } finally {
      setGenerating(false);
    }
  };

  const cols = layout.targets.length <= 6 ? 3 : 4;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Controls Panel */}
      <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
        {/* Theme Presets */}
        <div className="space-y-2">
          <span className="block text-xs font-bold uppercase tracking-wider text-slate-600">
            1. Quick I Spy Theme Packs
          </span>
          <div className="flex flex-wrap gap-1.5">
            {I_SPY_PRESETS.map((p) => (
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

        {/* Title */}
        <div className="space-y-1.5">
          <label
            htmlFor="ispy-title-input"
            className="block text-xs font-bold uppercase tracking-wider text-slate-600"
          >
            2. Worksheet Title
          </label>
          <input
            id="ispy-title-input"
            type="text"
            maxLength={50}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3.5 py-2 text-sm font-medium bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#2E6B6B] focus:border-[#2E6B6B]"
          />
        </div>

        {/* Clipart Target Picker (4-8) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              3. Pick Target Pictures (4–8)
            </span>
            <span className="text-[11px] font-bold text-[#2E6B6B]">
              {layout.targets.length} / 8 active · {layout.totalObjects} objects
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
              aria-label="Filter I Spy drawings by theme"
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
              const active = selectedSet.has(item.id);
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

        {/* Difficulty & Paper Size */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              4. Difficulty
            </span>
            <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-slate-100 border border-slate-200 text-[11px]">
              {[
                { id: 'easy' as const, label: 'Easy' },
                { id: 'medium' as const, label: 'Medium' },
                { id: 'challenge' as const, label: 'Busy' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    setDifficulty(opt.id);
                    setSeed((s) => s + 1);
                  }}
                  className={`py-2 px-1 rounded-lg font-bold transition-colors ${
                    difficulty === opt.id
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

        {/* Options */}
        <div className="space-y-2">
          <label className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#F0F7F7]/70 border border-[#d0e3e3] cursor-pointer text-xs font-semibold text-slate-800">
            <input
              type="checkbox"
              checked={includeAnswerKey}
              onChange={(e) => setIncludeAnswerKey(e.target.checked)}
              className="w-4 h-4 accent-[#2E6B6B] rounded"
            />
            <span>Include Page 2 Teacher Answer Key</span>
          </label>
          <label className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer text-xs font-semibold text-slate-800">
            <input
              type="checkbox"
              checked={showWordLabels}
              onChange={(e) => setShowWordLabels(e.target.checked)}
              className="w-4 h-4 accent-[#2E6B6B] rounded"
            />
            <span>Show English vocabulary labels in checklist boxes</span>
          </label>
          <label className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer text-xs font-semibold text-slate-800">
            <input
              type="checkbox"
              checked={allowRotation}
              onChange={(e) => {
                setAllowRotation(e.target.checked);
                setSeed((s) => s + 1);
              }}
              className="w-4 h-4 accent-[#2E6B6B] rounded"
            />
            <span>Playful tilted pictures inside search box</span>
          </label>
        </div>

        {/* Actions */}
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
                ? 'Creating I Spy PDF...'
                : `Download Free I Spy PDF (${layout.totalObjects} Objects)`}
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
              <span>Shuffle Layout</span>
            </button>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-start gap-2 text-[11px] text-slate-600 leading-relaxed">
          <ShieldCheck className="w-4 h-4 text-[#2E6B6B] shrink-0 mt-0.5" />
          <span>
            <strong>100% Free &amp; Browser-Private:</strong> Clean black-ink line art saves printer toner and doubles as a coloring sheet.
          </span>
        </div>
      </div>

      {/* Right Live Preview Panel */}
      <div className="lg:col-span-7 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 px-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Sparkles className="w-3.5 h-3.5 text-[#F2B544]" />
            <span>
              Live Worksheet Preview · {paperLabel} ({layout.totalObjects} Objects)
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

        <div className="bg-slate-100/90 border border-slate-200 rounded-2xl p-4 sm:p-6">
          {previewTab === 'student' ? (
            <div className="max-w-[520px] mx-auto bg-white rounded-xl shadow-md border border-slate-200 p-4 sm:p-5 flex flex-col justify-between aspect-[8.5/11]">
              <div>
                <div className="flex items-baseline justify-between border-b-2 border-[#2E6B6B] pb-1.5">
                  <h2 className="text-sm sm:text-base font-extrabold text-slate-900 font-heading truncate pr-2">
                    {title || 'I Spy & Count'}
                  </h2>
                  <span className="text-[10px] text-slate-500 shrink-0">
                    Name: ___________
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 mt-1 mb-2">
                  Find, color, and count each picture! Write how many you find below.
                </p>

                {/* Proportional Scattered Search Canvas */}
                <div
                  className="relative w-full border-2 border-[#2E6B6B] bg-[#FCFEFE] overflow-hidden"
                  style={{
                    aspectRatio: `${geom.canvasW} / ${geom.canvasH}`,
                  }}
                >
                  {layout.placed.map((obj) => {
                    const item = getClipart(obj.clipartId);
                    if (!item) return null;
                    const leftPct =
                      ((obj.cx - obj.drawW / 2 - geom.canvasX) / geom.canvasW) * 100;
                    const topPct =
                      ((obj.cyTop - obj.drawH / 2 - geom.canvasY) / geom.canvasH) *
                      100;
                    const wPct = (obj.drawW / geom.canvasW) * 100;
                    const hPct = (obj.drawH / geom.canvasH) * 100;

                    return (
                      <img
                        key={obj.id}
                        src={clipartUrl(item)}
                        alt={obj.label}
                        style={{
                          position: 'absolute',
                          left: `${leftPct}%`,
                          top: `${topPct}%`,
                          width: `${wPct}%`,
                          height: `${hPct}%`,
                          transform: `rotate(${obj.angleDeg}deg)`,
                        }}
                        className="object-contain select-none pointer-events-none"
                      />
                    );
                  })}
                </div>

                {/* Bottom Count & Write Checklist */}
                <div className="mt-2.5 p-2 rounded-lg bg-[#F0F7F7] border border-[#d0e3e3]">
                  <div className="text-[9px] font-bold uppercase tracking-wider text-[#2E6B6B] mb-1.5">
                    Count &amp; Write How Many You Spy:
                  </div>
                  <div
                    className={`grid gap-1.5 ${
                      cols === 3 ? 'grid-cols-3' : 'grid-cols-4'
                    }`}
                  >
                    {layout.targets.map((target) => {
                      const item = getClipart(target.clipartId);
                      return (
                        <div
                          key={target.clipartId}
                          className="bg-white border border-[#d0e3e3] rounded px-1.5 py-1 flex items-center justify-between gap-1"
                        >
                          <div className="flex items-center gap-1 min-w-0">
                            {item && (
                              <img
                                src={clipartUrl(item)}
                                alt={target.label}
                                className="w-5 h-5 object-contain shrink-0"
                              />
                            )}
                            {showWordLabels && (
                              <span className="text-[9px] font-bold text-slate-800 truncate">
                                {target.label}
                              </span>
                            )}
                          </div>
                          <span className="w-5 h-5 rounded border border-[#2E6B6B] bg-white shrink-0" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="pt-1.5 text-center text-[9px] text-slate-500">
                Free for classroom &amp; home use · kinderesl.com
              </div>
            </div>
          ) : (
            <div className="max-w-[520px] mx-auto bg-white rounded-xl shadow-md border border-slate-200 p-5 sm:p-6 space-y-4">
              <div className="border-b-2 border-[#2E6B6B] pb-2">
                <h2 className="text-base sm:text-lg font-extrabold text-slate-900 font-heading">
                  Teacher Answer Key: {title || 'I Spy & Count'}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Verified counts for all {layout.totalObjects} objects ({difficulty} level).
                </p>
              </div>
              <div className="space-y-2">
                {layout.targets.map((target, idx) => {
                  const item = getClipart(target.clipartId);
                  return (
                    <div
                      key={target.clipartId}
                      className="flex items-center justify-between px-3 py-2 rounded-xl bg-[#F0F7F7]/65 border border-[#d0e3e3]"
                    >
                      <div className="flex items-center gap-3">
                        {item && (
                          <img
                            src={clipartUrl(item)}
                            alt={target.label}
                            className="w-8 h-8 object-contain"
                          />
                        )}
                        <span className="text-sm font-bold text-slate-900">
                          {idx + 1}. {target.label}
                        </span>
                      </div>
                      <span className="inline-flex items-center justify-center w-9 h-8 rounded-lg bg-[#2E6B6B] text-white text-sm font-extrabold">
                        {target.count}
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
