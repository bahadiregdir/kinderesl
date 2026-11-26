'use client';

import React, { useMemo, useState } from 'react';
import {
  ALPHABET_LETTERS,
  LETTER_PHONICS_WORDS,
  LETTER_PRESETS,
  buildLetterRowStrokes,
  generateLetterTracingPdf,
  getDisplayPair,
  getLetterRowSpecs,
  getLetterSheetLayout,
  normalizeSelectedLetters,
  type LetterCaseStyle,
} from '@/lib/letter-tracing-pdf';
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

export function LetterTracingGenerator() {
  const [selectedLetters, setSelectedLetters] = useState<string[]>(['A']);
  const [caseStyle, setCaseStyle] = useState<LetterCaseStyle>('mixed');
  const [showStartingDots, setShowStartingDots] = useState(true);
  const [showPhonicsCue, setShowPhonicsCue] = useState(true);
  const [paperSize, setPaperSize] = useState<PaperSizeOption>('letter');
  const [previewIdx, setPreviewIdx] = useState(0);
  const [generating, setGenerating] = useState(false);

  const normalizedLetters = useMemo(
    () => normalizeSelectedLetters(selectedLetters),
    [selectedLetters]
  );

  const safePreviewIdx = Math.min(previewIdx, normalizedLetters.length - 1);
  const activeLetter = normalizedLetters[safePreviewIdx] || 'A';
  const displayPair = getDisplayPair(activeLetter, caseStyle);

  const layout = useMemo(() => getLetterSheetLayout(paperSize), [paperSize]);
  const paperLabel = getPaperLabel(paperSize);

  const toggleLetter = (letter: string) => {
    setSelectedLetters((prev) => {
      if (prev.includes(letter)) {
        if (prev.length === 1) return prev;
        const next = prev.filter((l) => l !== letter);
        return next;
      }
      const combined = new Set([...prev, letter]);
      return ALPHABET_LETTERS.filter((l) => combined.has(l));
    });
    setPreviewIdx(0);
  };

  const applyPreset = (letters: readonly string[]) => {
    setSelectedLetters([...letters]);
    setPreviewIdx(0);
  };

  const buildPdfBytes = async () => {
    return generateLetterTracingPdf({
      letters: normalizedLetters,
      caseStyle,
      showStartingDots,
      showPhonicsCue,
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
        normalizedLetters.length === 26
          ? 'letter-tracing-a-z-26-pages.pdf'
          : normalizedLetters.length > 1
          ? `letter-tracing-${normalizedLetters.length}-letters.pdf`
          : `letter-tracing-${activeLetter.toLowerCase()}.pdf`;

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 15000);

      trackEvent('letter_tracing_pdf_download', {
        count: normalizedLetters.length,
        caseStyle,
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

      trackEvent('letter_tracing_pdf_print', {
        count: normalizedLetters.length,
        caseStyle,
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
      layoutNameStrokes(displayPair, {
        boxX: marginX + 20,
        boxY: bannerY + 13,
        boxWidth: 150,
        rowHeight: 58,
        align: 'center',
      }),
    [displayPair, marginX, bannerY]
  );

  const rowSpecs = useMemo(
    () => getLetterRowSpecs(activeLetter, caseStyle),
    [activeLetter, caseStyle]
  );

  const phonicsInfo = LETTER_PHONICS_WORDS[activeLetter] ?? {
    word: activeLetter,
    prep: 'is for',
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Controls Panel */}
      <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
        {/* Presets */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              1. Quick Letter Sets
            </span>
            <span className="text-[11px] font-bold text-[#2E6B6B]">
              {normalizedLetters.length} / 26 selected
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-1.5">
            {LETTER_PRESETS.map((preset) => {
              const isActive =
                preset.letters.length === normalizedLetters.length &&
                preset.letters.every((l, i) => l === normalizedLetters[i]);
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => applyPreset(preset.letters)}
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

        {/* Interactive A-Z Grid */}
        <div className="space-y-1.5">
          <span className="block text-xs font-bold uppercase tracking-wider text-slate-600">
            2. Pick Individual Letters
          </span>
          <div className="grid grid-cols-7 gap-1.5">
            {ALPHABET_LETTERS.map((letter) => {
              const active = normalizedLetters.includes(letter);
              return (
                <button
                  key={letter}
                  type="button"
                  onClick={() => toggleLetter(letter)}
                  aria-pressed={active}
                  className={`h-9 rounded-lg text-xs font-extrabold border transition-colors ${
                    active
                      ? 'bg-[#F0F7F7] text-[#2E6B6B] border-[#2E6B6B] ring-1 ring-[#2E6B6B]/20'
                      : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:text-slate-800'
                  }`}
                >
                  {letter}
                </button>
              );
            })}
          </div>
        </div>

        {/* Case Style */}
        <div className="space-y-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
            3. Letter Format
          </span>
          <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs">
            {[
              { id: 'mixed' as const, label: 'Aa (Both)' },
              { id: 'upper' as const, label: 'AA (Upper)' },
              { id: 'lower' as const, label: 'aa (Lower)' },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setCaseStyle(opt.id)}
                className={`py-2 px-2 rounded-lg font-bold transition-colors truncate ${
                  caseStyle === opt.id
                    ? 'bg-white text-[#2E6B6B] shadow-2xs border border-slate-200/80'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Paper Size */}
        <div className="space-y-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
            4. Paper Size
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

        {/* Options */}
        <div className="space-y-2">
          <label className="flex items-center gap-2.5 p-3 rounded-xl bg-[#F0F7F7]/70 border border-[#d0e3e3] cursor-pointer">
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
              <span className="block text-[11px] text-slate-500">
                Shows kids where each stroke begins on top-to-bottom letters.
              </span>
            </div>
          </label>

          <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
            <input
              type="checkbox"
              checked={showPhonicsCue}
              onChange={(e) => setShowPhonicsCue(e.target.checked)}
              className="w-4 h-4 accent-[#2E6B6B] rounded"
            />
            <div>
              <span className="block text-xs font-bold text-slate-800">
                Show phonics anchor word (e.g. &quot;Aa is for Apple&quot;)
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
                : normalizedLetters.length > 1
                ? `Download Free PDF (${normalizedLetters.length} Pages)`
                : `Download Free Letter ${displayPair} PDF`}
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
            <strong>100% Browser-Private:</strong> High-resolution Zaner-Bloser vector PDFs render right on your device with zero sign-up.
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

          {normalizedLetters.length > 1 && (
            <div className="flex items-center gap-1.5 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setPreviewIdx((i) => Math.max(0, i - 1))}
                disabled={safePreviewIdx === 0}
                aria-label="Previous letter page"
                className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 disabled:opacity-40 hover:bg-slate-50"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="px-2 text-slate-700">
                Page {safePreviewIdx + 1} of {normalizedLetters.length}:{' '}
                <strong className="text-[#2E6B6B]">{displayPair}</strong>
              </span>
              <button
                type="button"
                onClick={() =>
                  setPreviewIdx((i) => Math.min(normalizedLetters.length - 1, i + 1))
                }
                disabled={safePreviewIdx >= normalizedLetters.length - 1}
                aria-label="Next letter page"
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
              title={`Letter ${displayPair} Tracing Practice`}
              subtitle="Say the letter sound aloud as you trace starting from each dot."
              paperSize={paperSize}
              ariaLabel={`Live letter tracing worksheet preview for ${displayPair}`}
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
                  strokeWidth={2.8}
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

              {showPhonicsCue ? (
                <>
                  <text
                    x={marginX + 196}
                    y={bannerY + 38}
                    fontSize={18}
                    fontWeight="700"
                    fontFamily="Helvetica, Arial, sans-serif"
                    fill="#0F172A"
                  >
                    {`${displayPair} ${phonicsInfo.prep} ${phonicsInfo.word}`}
                  </text>
                  <text
                    x={marginX + 196}
                    y={bannerY + 58}
                    fontSize={9.5}
                    fontFamily="Helvetica, Arial, sans-serif"
                    fill="#64748B"
                  >
                    {`Finger-trace the big letter ${displayPair} above, then trace each row below.`}
                  </text>
                </>
              ) : (
                <>
                  <text
                    x={marginX + 196}
                    y={bannerY + 38}
                    fontSize={16}
                    fontWeight="700"
                    fontFamily="Helvetica, Arial, sans-serif"
                    fill="#0F172A"
                  >
                    {`Letter ${displayPair} Formation Guide`}
                  </text>
                  <text
                    x={marginX + 196}
                    y={bannerY + 58}
                    fontSize={9.5}
                    fontFamily="Helvetica, Arial, sans-serif"
                    fill="#64748B"
                  >
                    Follow the starting dots from top to bottom and left to right.
                  </text>
                </>
              )}

              {/* 5 Practice Rows */}
              {rowSpecs.map((spec, idx) => {
                const boxY = firstRowTop + idx * totalStep;
                const { strokes, scale } = buildLetterRowStrokes(
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
