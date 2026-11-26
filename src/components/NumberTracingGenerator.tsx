'use client';

import React, { useMemo, useState } from 'react';
import {
  ALL_NUMBERS,
  NUMBER_PRESETS,
  NUMBER_WORDS,
  buildNumberRowStrokes,
  generateNumberTracingPdf,
  getNumberRowSpecs,
  getNumberSheetLayout,
  getTenFrameMetrics,
  normalizeSelectedNumbers,
} from '@/lib/number-tracing-pdf';
import { getPaperLabel, type PaperSizeOption } from '@/lib/pdf-stroke-utils';
import { layoutNameStrokes, strokeCommandsToSvgPath } from '@/lib/tracing-strokes';
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

export function NumberTracingGenerator() {
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
  ]);
  const [showTenFrame, setShowTenFrame] = useState(true);
  const [includeNumberWord, setIncludeNumberWord] = useState(true);
  const [showStartingDots, setShowStartingDots] = useState(true);
  const [paperSize, setPaperSize] = useState<PaperSizeOption>('letter');
  const [previewIdx, setPreviewIdx] = useState(0);
  const [generating, setGenerating] = useState(false);

  const normalizedNumbers = useMemo(
    () => normalizeSelectedNumbers(selectedNumbers),
    [selectedNumbers]
  );

  const safePreviewIdx = Math.min(previewIdx, normalizedNumbers.length - 1);
  const activeNum = normalizedNumbers[safePreviewIdx] ?? 1;
  const word = NUMBER_WORDS[activeNum] ?? String(activeNum);
  const titleWord = word.charAt(0).toUpperCase() + word.slice(1);

  const layout = useMemo(() => getNumberSheetLayout(paperSize), [paperSize]);
  const paperLabel = getPaperLabel(paperSize);

  const toggleNumber = (n: number) => {
    setSelectedNumbers((prev) => {
      if (prev.includes(n)) {
        if (prev.length === 1) return prev;
        return prev.filter((item) => item !== n);
      }
      const combined = new Set([...prev, n]);
      return ALL_NUMBERS.filter((item) => combined.has(item));
    });
    setPreviewIdx(0);
  };

  const applyPreset = (nums: readonly number[]) => {
    setSelectedNumbers([...nums]);
    setPreviewIdx(0);
  };

  const buildPdfBytes = async () => {
    return generateNumberTracingPdf({
      numbers: normalizedNumbers,
      showTenFrame,
      includeNumberWord,
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

      const fileName =
        normalizedNumbers.length > 1
          ? `number-tracing-${normalizedNumbers[0]}-to-${
              normalizedNumbers[normalizedNumbers.length - 1]
            }-${normalizedNumbers.length}-pages.pdf`
          : `number-tracing-${activeNum}.pdf`;

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 15000);

      trackEvent('number_tracing_pdf_download', {
        count: normalizedNumbers.length,
        showTenFrame,
        includeNumberWord,
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

      trackEvent('number_tracing_pdf_print', {
        count: normalizedNumbers.length,
        showTenFrame,
        includeNumberWord,
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
    bannerY,
    bannerH,
    firstRowTop,
    totalStep,
    rowH,
  } = layout;

  const showcaseRes = useMemo(
    () =>
      layoutNameStrokes(String(activeNum), {
        boxX: marginX + 18,
        boxY: bannerY + 16,
        boxWidth: 132,
        rowHeight: 62,
        align: 'center',
      }),
    [activeNum, marginX, bannerY]
  );

  const tenFrames = useMemo(
    () =>
      getTenFrameMetrics(
        activeNum,
        marginX + 178,
        bannerY + 28,
        usableW - 196,
        bannerH - 38
      ),
    [activeNum, marginX, bannerY, usableW, bannerH]
  );

  const rowSpecs = useMemo(
    () => getNumberRowSpecs(activeNum, includeNumberWord),
    [activeNum, includeNumberWord]
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Controls Panel */}
      <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
        {/* Presets */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              1. Quick Number Ranges
            </span>
            <span className="text-[11px] font-bold text-[#2E6B6B]">
              {normalizedNumbers.length} / 21 selected
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-1.5">
            {NUMBER_PRESETS.map((preset) => {
              const isActive =
                preset.numbers.length === normalizedNumbers.length &&
                preset.numbers.every((n, i) => n === normalizedNumbers[i]);
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => applyPreset(preset.numbers)}
                  className={`py-2 px-2.5 rounded-xl text-xs font-bold border transition-colors ${
                    isActive
                      ? 'bg-[#2E6B6B] text-white border-[#2E6B6B]'
                      : 'bg-slate-50 hover:bg-[#F0F7F7] text-slate-700 border-slate-200'
                  }`}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Interactive 0-20 Grid */}
        <div className="space-y-1.5">
          <span className="block text-xs font-bold uppercase tracking-wider text-slate-600">
            2. Pick Numbers (0–20)
          </span>
          <div className="grid grid-cols-7 gap-1.5">
            {ALL_NUMBERS.map((n) => {
              const active = normalizedNumbers.includes(n);
              return (
                <button
                  key={n}
                  type="button"
                  onClick={() => toggleNumber(n)}
                  aria-pressed={active}
                  className={`h-9 rounded-lg text-xs font-extrabold border transition-colors ${
                    active
                      ? 'bg-[#F0F7F7] text-[#2E6B6B] border-[#2E6B6B] ring-1 ring-[#2E6B6B]/20'
                      : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:text-slate-800'
                  }`}
                >
                  {n}
                </button>
              );
            })}
          </div>
        </div>

        {/* Paper Size */}
        <div className="space-y-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
            3. Paper Size
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
              US Letter (8.5×11&quot;)
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
              ISO A4
            </button>
          </div>
        </div>

        {/* Visual & Literacy Options */}
        <div className="space-y-2">
          <label className="flex items-center gap-2.5 p-3 rounded-xl bg-[#F0F7F7]/70 border border-[#d0e3e3] cursor-pointer">
            <input
              type="checkbox"
              checked={showTenFrame}
              onChange={(e) => setShowTenFrame(e.target.checked)}
              className="w-4 h-4 accent-[#2E6B6B] rounded"
            />
            <div>
              <span className="block text-xs font-bold text-slate-800">
                Include visual Ten-Frame counting grid
              </span>
              <span className="block text-[11px] text-slate-500">
                Builds one-to-one counting sense (uses 2 ten-frames for 11–20).
              </span>
            </div>
          </label>

          <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
            <input
              type="checkbox"
              checked={includeNumberWord}
              onChange={(e) => setIncludeNumberWord(e.target.checked)}
              className="w-4 h-4 accent-[#2E6B6B] rounded"
            />
            <div>
              <span className="block text-xs font-bold text-slate-800">
                Include dashed number word row (e.g. &quot;one&quot;, &quot;five&quot;)
              </span>
            </div>
          </label>

          <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
            <input
              type="checkbox"
              checked={showStartingDots}
              onChange={(e) => setShowStartingDots(e.target.checked)}
              className="w-4 h-4 accent-[#2E6B6B] rounded"
            />
            <div>
              <span className="block text-xs font-bold text-slate-800">
                Show teal starting dots
              </span>
            </div>
          </label>
        </div>

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
                : normalizedNumbers.length > 1
                ? `Download Free PDF (${normalizedNumbers.length} Pages)`
                : `Download Free Number ${activeNum} PDF`}
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
            <strong>100% Browser-Private:</strong> Instant print-ready US Letter &amp; A4 math sheets with zero sign-up.
          </span>
        </div>
      </div>

      {/* Right Live SVG Preview Panel */}
      <div className="lg:col-span-7 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 px-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Sparkles className="w-3.5 h-3.5 text-[#F2B544]" />
            <span>
              Live Worksheet Preview · {paperLabel}
            </span>
          </div>

          {normalizedNumbers.length > 1 && (
            <div className="flex items-center gap-1.5 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setPreviewIdx((i) => Math.max(0, i - 1))}
                disabled={safePreviewIdx === 0}
                aria-label="Previous number page"
                className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 disabled:opacity-40 hover:bg-slate-50"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="px-2 text-slate-700">
                Page {safePreviewIdx + 1} of {normalizedNumbers.length}:{' '}
                <strong className="text-[#2E6B6B]">
                  {activeNum} ({titleWord})
                </strong>
              </span>
              <button
                type="button"
                onClick={() =>
                  setPreviewIdx((i) =>
                    Math.min(normalizedNumbers.length - 1, i + 1)
                  )
                }
                disabled={safePreviewIdx >= normalizedNumbers.length - 1}
                aria-label="Next number page"
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
              title={`Number ${activeNum} (${titleWord}) Tracing`}
              subtitle="Count the dots in the ten-frame, then trace the number starting at the dot."
              paperSize={paperSize}
              ariaLabel={`Live number tracing worksheet preview for ${activeNum}`}
            >
              {/* Top Showcase Banner */}
              <rect
                x={marginX}
                y={bannerY}
                width={usableW}
                height={bannerH}
                fill="#F0F7F7"
                stroke="#D1E3E3"
                strokeWidth={1}
              />

              {showcaseRes.strokes.map((s, sIdx) => (
                <path
                  key={`sc-${sIdx}`}
                  d={strokeCommandsToSvgPath(s.commands)}
                  fill="none"
                  stroke="#2E6B6B"
                  strokeWidth={3}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ))}

              {showStartingDots &&
                showcaseRes.strokes.map((s, sIdx) =>
                  s.startDot ? (
                    <circle
                      key={`scd-${sIdx}`}
                      cx={s.startDot[0]}
                      cy={s.startDot[1]}
                      r={3.2}
                      fill="#0F172A"
                    />
                  ) : null
                )}

              {showTenFrame ? (
                <g>
                  <text
                    x={marginX + 178}
                    y={bannerY + 20}
                    fontSize={11}
                    fontWeight="700"
                    fontFamily="Helvetica, Arial, sans-serif"
                    fill="#0F172A"
                  >
                    {`Count & Color: ${titleWord} (${activeNum})`}
                  </text>

                  {tenFrames.frames.map((frame, fIdx) => (
                    <g key={fIdx}>
                      <rect
                        x={frame.x}
                        y={frame.y}
                        width={frame.w}
                        height={frame.h}
                        fill="#FFFFFF"
                        stroke="#2E6B6B"
                        strokeWidth={1.2}
                      />
                      {[1, 2, 3, 4].map((c) => (
                        <line
                          key={c}
                          x1={frame.x + c * frame.cellSize}
                          y1={frame.y}
                          x2={frame.x + c * frame.cellSize}
                          y2={frame.y + frame.h}
                          stroke="#94ABB8"
                          strokeWidth={0.8}
                        />
                      ))}
                      <line
                        x1={frame.x}
                        y1={frame.y + frame.cellSize}
                        x2={frame.x + frame.w}
                        y2={frame.y + frame.cellSize}
                        stroke="#94ABB8"
                        strokeWidth={0.8}
                      />
                      {Array.from({ length: frame.filledDots }, (_, d) => {
                        const row = Math.floor(d / 5);
                        const col = d % 5;
                        const cx =
                          frame.x + col * frame.cellSize + frame.cellSize / 2;
                        const cy =
                          frame.y + row * frame.cellSize + frame.cellSize / 2;
                        return (
                          <circle
                            key={d}
                            cx={cx}
                            cy={cy}
                            r={Math.max(4, frame.cellSize * 0.29)}
                            fill="#2E6B6B"
                          />
                        );
                      })}
                    </g>
                  ))}
                </g>
              ) : (
                <g>
                  <text
                    x={marginX + 184}
                    y={bannerY + 42}
                    fontSize={18}
                    fontWeight="700"
                    fontFamily="Helvetica, Arial, sans-serif"
                    fill="#0F172A"
                  >
                    {`Number ${activeNum} — "${titleWord}"`}
                  </text>
                  <text
                    x={marginX + 184}
                    y={bannerY + 62}
                    fontSize={9.5}
                    fontFamily="Helvetica, Arial, sans-serif"
                    fill="#64748B"
                  >
                    Trace every dashed numeral carefully, then write it on your own.
                  </text>
                </g>
              )}

              {/* 5 Practice Rows */}
              {rowSpecs.map((spec, idx) => {
                const boxY = firstRowTop + idx * totalStep;
                const { strokes, scale } = buildNumberRowStrokes(
                  spec,
                  marginX,
                  boxY,
                  usableW,
                  rowH
                );
                const strokeW = Math.max(1.5, Math.min(2.4, scale * 0.034));
                const dotRadius = Math.max(2.1, Math.min(3.1, scale * 0.042));
                const strokeColor =
                  spec.mode === 'write-own'
                    ? '#C2D6D6'
                    : spec.mode === 'trace-dots'
                    ? '#4D5C6E'
                    : '#788590';

                return (
                  <SvgHandwritingRow
                    key={idx}
                    x={marginX}
                    y={boxY}
                    width={usableW}
                    height={rowH}
                    label={spec.label}
                    strokes={strokes}
                    strokeWidth={strokeW}
                    strokeColor={strokeColor}
                    dashed={spec.mode !== 'write-own'}
                    dotRadius={dotRadius}
                    showDots={showStartingDots && spec.mode === 'trace-dots'}
                  />
                );
              })}
            </WorksheetSvgShell>
          </div>
        </div>
      </div>
    </div>
  );
}
