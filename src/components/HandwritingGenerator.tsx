'use client';

import React, { useMemo, useState } from 'react';
import {
  HANDWRITING_PRESETS,
  buildHandwritingRowRenderData,
  generateHandwritingPdf,
  getHandwritingSheetLayout,
  paginateHandwritingWords,
  parseHandwritingWords,
  type HandwritingCaseMode,
  type HandwritingLayoutMode,
} from '@/lib/handwriting-pdf';
import { getPaperLabel, type PaperSizeOption } from '@/lib/pdf-stroke-utils';
import { strokeCommandsToSvgPath } from '@/lib/tracing-strokes';
import { WorksheetSvgShell, SvgHandwritingRow } from '@/components/WorksheetSvgShell';
import { trackEvent } from '@/lib/analytics';
import {
  FileDown,
  Printer,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export function HandwritingGenerator() {
  const defaultPreset = HANDWRITING_PRESETS[0];
  const [selectedPresetId, setSelectedPresetId] = useState<string>(defaultPreset.id);
  const [title, setTitle] = useState(defaultPreset.title);
  const [wordsText, setWordsText] = useState(defaultPreset.words.join('\n'));
  const [layoutMode, setLayoutMode] =
    useState<HandwritingLayoutMode>('read-trace-write');
  const [caseMode, setCaseMode] = useState<HandwritingCaseMode>('preserve');
  const [showStartingDots, setShowStartingDots] = useState(true);
  const [paperSize, setPaperSize] = useState<PaperSizeOption>('letter');
  const [previewIdx, setPreviewIdx] = useState(0);
  const [generating, setGenerating] = useState(false);

  const parsedWords = useMemo(
    () => parseHandwritingWords(wordsText, caseMode),
    [wordsText, caseMode]
  );

  const pages = useMemo(
    () => paginateHandwritingWords(parsedWords),
    [parsedWords]
  );

  const safePreviewIdx = Math.min(previewIdx, pages.length - 1);
  const activePageWords = pages[safePreviewIdx] || ['the'];

  const layout = useMemo(
    () => getHandwritingSheetLayout(paperSize),
    [paperSize]
  );
  const paperLabel = getPaperLabel(paperSize);

  const applyPreset = (presetId: string) => {
    const found = HANDWRITING_PRESETS.find((p) => p.id === presetId);
    if (!found) return;
    setSelectedPresetId(found.id);
    setTitle(found.title);
    setWordsText(found.words.join('\n'));
    setPreviewIdx(0);
  };

  const buildPdfBytes = async () => {
    return generateHandwritingPdf({
      title,
      words: parsedWords,
      layoutMode,
      caseMode,
      showStartingDots,
      paperSize,
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

      const safeSlug = (title || 'sight-words')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 40);
      const fileName = `handwriting-${safeSlug || 'worksheet'}.pdf`;

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 15000);

      trackEvent('handwriting_maker_pdf_download', {
        wordCount: parsedWords.length,
        pageCount: pages.length,
        layoutMode,
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

      trackEvent('handwriting_maker_pdf_print', {
        wordCount: parsedWords.length,
        pageCount: pages.length,
        layoutMode,
        paperSize,
      });
    } finally {
      setGenerating(false);
    }
  };

  const {
    pageW,
    pageH,
    marginX,
    topHeaderY,
    bottomFooterY,
    usableW,
    colHeaderY,
    firstRowTop,
    totalStep,
    rowH,
    colWidth,
  } = layout;

  const sheetTitle =
    pages.length > 1
      ? `${title || 'Sight Word Handwriting'} (${safePreviewIdx + 1}/${pages.length})`
      : title || 'Sight Word Handwriting';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Controls Panel */}
      <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
        {/* Ready Word Lists */}
        <div className="space-y-1.5">
          <span className="block text-xs font-bold uppercase tracking-wider text-slate-600">
            1. Ready Sight Word &amp; Phonics Sets
          </span>
          <div className="grid grid-cols-2 gap-1.5">
            {HANDWRITING_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => applyPreset(preset.id)}
                className={`py-2 px-2.5 rounded-xl text-xs font-bold border text-left transition-colors truncate ${
                  selectedPresetId === preset.id
                    ? 'bg-[#2E6B6B] text-white border-[#2E6B6B]'
                    : 'bg-slate-50 hover:bg-[#F0F7F7] text-slate-700 border-slate-200'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div className="space-y-1.5">
          <label
            htmlFor="handwriting-title-input"
            className="block text-xs font-bold uppercase tracking-wider text-slate-600"
          >
            2. Worksheet Title
          </label>
          <input
            id="handwriting-title-input"
            type="text"
            maxLength={54}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Sight Word Practice"
            className="w-full px-3.5 py-2.5 text-sm font-medium bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#2E6B6B] focus:border-[#2E6B6B]"
          />
        </div>

        {/* Word List */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="handwriting-words-input"
              className="block text-xs font-bold uppercase tracking-wider text-slate-600"
            >
              3. Custom Words (Up to 18)
            </label>
            <span className="text-[11px] font-bold text-[#2E6B6B]">
              {parsedWords.length} words · {pages.length}{' '}
              {pages.length === 1 ? 'page' : 'pages'}
            </span>
          </div>
          <textarea
            id="handwriting-words-input"
            rows={5}
            value={wordsText}
            onChange={(e) => {
              setSelectedPresetId('custom');
              setWordsText(e.target.value);
              setPreviewIdx(0);
            }}
            placeholder={'the\nand\nsee\ncan\nlook\nplay'}
            className="w-full px-3.5 py-2.5 text-sm font-medium bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#2E6B6B] focus:border-[#2E6B6B]"
          />
          <p className="text-[11px] text-slate-500">
            One word per line or comma-separated (6 words per printable sheet).
          </p>
        </div>

        {/* Layout Mode */}
        <div className="space-y-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
            4. Practice Layout
          </span>
          <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs">
            <button
              type="button"
              onClick={() => setLayoutMode('read-trace-write')}
              className={`py-2 px-2 rounded-lg font-bold transition-colors ${
                layoutMode === 'read-trace-write'
                  ? 'bg-white text-[#2E6B6B] shadow-2xs border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Read · Trace · Write
            </button>
            <button
              type="button"
              onClick={() => setLayoutMode('full-trace')}
              className={`py-2 px-2 rounded-lg font-bold transition-colors ${
                layoutMode === 'full-trace'
                  ? 'bg-white text-[#2E6B6B] shadow-2xs border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Full-Row Tracing
            </button>
          </div>
        </div>

        {/* Case & Paper Size */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              5. Word Case
            </span>
            <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-slate-100 border border-slate-200 text-[11px]">
              {[
                { id: 'preserve' as const, label: 'Typed' },
                { id: 'lower' as const, label: 'lower' },
                { id: 'upper' as const, label: 'UPPER' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setCaseMode(opt.id)}
                  className={`py-2 px-1.5 rounded-lg font-bold transition-colors ${
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

        {/* Starting Dots Checkbox */}
        <label className="flex items-center gap-2.5 p-3 rounded-xl bg-[#F0F7F7]/70 border border-[#d0e3e3] cursor-pointer">
          <input
            type="checkbox"
            checked={showStartingDots}
            onChange={(e) => setShowStartingDots(e.target.checked)}
            className="w-4 h-4 accent-[#2E6B6B] rounded"
          />
          <div>
            <span className="block text-xs font-bold text-slate-800">
              Show teal starting dots on traceable words
            </span>
          </div>
        </label>

        {/* Download & Print Buttons */}
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
                ? 'Creating Printable PDF...'
                : pages.length > 1
                ? `Download Free PDF (${pages.length} Pages)`
                : 'Download Free PDF'}
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
            <strong>100% Browser-Private:</strong> Your weekly spelling lists stay on your device—never uploaded or saved.
          </span>
        </div>
      </div>

      {/* Right Live SVG Preview Panel */}
      <div className="lg:col-span-7 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 px-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Sparkles className="w-3.5 h-3.5 text-[#F2B544]" />
            <span>
              Live Worksheet Preview · {paperLabel} ({activePageWords.length} Words)
            </span>
          </div>

          {pages.length > 1 && (
            <div className="flex items-center gap-1.5 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setPreviewIdx((i) => Math.max(0, i - 1))}
                disabled={safePreviewIdx === 0}
                aria-label="Previous page"
                className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 disabled:opacity-40 hover:bg-slate-50"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="px-2 text-slate-700">
                Page {safePreviewIdx + 1} of {pages.length}
              </span>
              <button
                type="button"
                onClick={() =>
                  setPreviewIdx((i) => Math.min(pages.length - 1, i + 1))
                }
                disabled={safePreviewIdx >= pages.length - 1}
                aria-label="Next page"
                className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 disabled:opacity-40 hover:bg-slate-50"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        <div className="bg-slate-100/90 border border-slate-200 rounded-2xl p-4 sm:p-6 flex items-center justify-center">
          <div className="w-full max-w-[490px] bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
            <WorksheetSvgShell
              pageW={pageW}
              pageH={pageH}
              marginX={marginX}
              topHeaderY={topHeaderY}
              bottomFooterY={bottomFooterY}
              title={sheetTitle}
              subtitle={
                layoutMode === 'read-trace-write'
                  ? 'Read each word aloud, trace the dashed letters, then write it on your own.'
                  : 'Say each word aloud and trace it carefully across the handwriting lines.'
              }
              paperSize={paperSize}
              ariaLabel={`Live sight word handwriting preview for ${sheetTitle}`}
            >
              {layoutMode === 'read-trace-write' ? (
                ['1. READ', '2. TRACE', '3. WRITE ON YOUR OWN'].map((h, idx) => (
                  <text
                    key={h}
                    x={marginX + idx * colWidth + colWidth / 2}
                    y={colHeaderY + 8}
                    fontSize={8.5}
                    fontWeight="700"
                    fontFamily="Helvetica, Arial, sans-serif"
                    fill="#2E6B6B"
                    textAnchor="middle"
                  >
                    {h}
                  </text>
                ))
              ) : (
                <text
                  x={marginX}
                  y={colHeaderY + 8}
                  fontSize={8.5}
                  fontWeight="700"
                  fontFamily="Helvetica, Arial, sans-serif"
                  fill="#2E6B6B"
                >
                  TRACE EACH WORD ACROSS THE LINE
                </text>
              )}

              {activePageWords.map((word, rowIdx) => {
                const boxY = firstRowTop + rowIdx * totalStep;
                const data = buildHandwritingRowRenderData(word, layoutMode, {
                  marginX,
                  boxY,
                  usableW,
                  rowH,
                  colWidth,
                });
                const tw = Math.max(1.4, Math.min(2.3, data.traceScale * 0.035));
                const gw = Math.max(1.4, Math.min(2.3, data.guideScale * 0.036));
                const dotRadius = Math.max(
                  1.9,
                  Math.min(2.8, data.dotScale * 0.042)
                );

                return (
                  <g key={rowIdx}>
                    <SvgHandwritingRow
                      x={marginX}
                      y={boxY}
                      width={usableW}
                      height={rowH}
                      strokes={data.traceStrokes}
                      strokeWidth={tw}
                      strokeColor="#4D5C6E"
                      dashed
                      dotStrokes={data.dotStrokes}
                      dotRadius={dotRadius}
                      showDots={showStartingDots}
                      dividerColumns={
                        layoutMode === 'read-trace-write' ? 3 : undefined
                      }
                    />
                    {data.guideStrokes.map((s, gIdx) => (
                      <path
                        key={`g-${rowIdx}-${gIdx}`}
                        d={strokeCommandsToSvgPath(s.commands)}
                        fill="none"
                        stroke="#C2D6D6"
                        strokeWidth={gw}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    ))}
                  </g>
                );
              })}
            </WorksheetSvgShell>
          </div>
        </div>
      </div>
    </div>
  );
}
