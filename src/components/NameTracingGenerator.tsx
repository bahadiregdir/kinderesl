'use client';

import React, { useMemo, useState } from 'react';
import {
  applyCaseMode,
  generateNameTracingPdf,
  getSheetMetrics,
  type CaseModeOption,
  type OrientationOption,
  type PaperSizeOption,
} from '@/lib/name-tracing-pdf';
import {
  layoutNameStrokes,
  strokeCommandsToSvgPath,
} from '@/lib/tracing-strokes';
import { trackEvent } from '@/lib/analytics';
import {
  FileDown,
  Printer,
  ShieldCheck,
  Users,
  User,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export function NameTracingGenerator() {
  const [mode, setMode] = useState<'single' | 'batch'>('single');
  const [singleName, setSingleName] = useState('Emma');
  const [batchText, setBatchText] = useState('Emma\nNoah\nSofia\nLiam');
  const [caseMode, setCaseMode] = useState<CaseModeOption>('title');
  const [paperSize, setPaperSize] = useState<PaperSizeOption>('letter');
  const [orientation, setOrientation] = useState<OrientationOption>('landscape');
  const [showStartingDots, setShowStartingDots] = useState(true);
  const [previewIdx, setPreviewIdx] = useState(0);
  const [generating, setGenerating] = useState(false);

  const parsedNames = useMemo(() => {
    if (mode === 'single') {
      const clean = singleName.trim() || 'Emma';
      return [applyCaseMode(clean, caseMode)];
    }
    const list = batchText
      .split(/[\n,;]+/)
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 30)
      .map((n) => applyCaseMode(n, caseMode));
    return list.length > 0 ? list : [applyCaseMode('Emma', caseMode)];
  }, [mode, singleName, batchText, caseMode]);

  const safePreviewIdx = Math.min(previewIdx, parsedNames.length - 1);
  const activePreviewName = parsedNames[safePreviewIdx] || 'Emma';

  const metrics = useMemo(
    () => getSheetMetrics(paperSize, orientation),
    [paperSize, orientation]
  );

  const buildPdfBytes = async () => {
    return generateNameTracingPdf({
      names: parsedNames,
      paperSize,
      orientation,
      caseMode,
      showStartingDots,
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

      const safeSlug = activePreviewName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      const fileName =
        parsedNames.length > 1
          ? `class-name-tracing-${parsedNames.length}-pages.pdf`
          : `name-tracing-${safeSlug || 'worksheet'}.pdf`;

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 15000);

      trackEvent('name_tracing_pdf_download', {
        count: parsedNames.length,
        paperSize,
        orientation,
        caseMode,
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

      trackEvent('name_tracing_pdf_print', {
        count: parsedNames.length,
        paperSize,
        orientation,
        caseMode,
      });
    } finally {
      setGenerating(false);
    }
  };

  const { pageW, pageH, rows, marginX, topHeaderY, firstRowTop, bottomFooterY, usableW, totalStep, rowH } =
    metrics;
  const paperLabel =
    paperSize === 'a4' ? 'A4 (210×297mm)' : 'US Letter (8.5×11")';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Controls Panel */}
      <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
        {/* Single vs Batch Toggle */}
        <div className="space-y-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
            1. Student Mode
          </span>
          <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs">
            <button
              type="button"
              onClick={() => {
                setMode('single');
                setPreviewIdx(0);
              }}
              className={`inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg font-bold transition-colors ${
                mode === 'single'
                  ? 'bg-white text-[#2E6B6B] shadow-2xs border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Single Name</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('batch');
                setPreviewIdx(0);
              }}
              className={`inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg font-bold transition-colors ${
                mode === 'batch'
                  ? 'bg-white text-[#2E6B6B] shadow-2xs border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Whole Class (30)</span>
            </button>
          </div>
        </div>

        {/* Name Input */}
        {mode === 'single' ? (
          <div className="space-y-1.5">
            <label
              htmlFor="single-name-input"
              className="block text-xs font-bold uppercase tracking-wider text-slate-600"
            >
              2. Child&apos;s Name
            </label>
            <input
              id="single-name-input"
              type="text"
              maxLength={36}
              value={singleName}
              onChange={(e) => setSingleName(e.target.value)}
              placeholder="Type a name (e.g., Emma, Sofía, Ömer)..."
              className="w-full px-3.5 py-2.5 text-sm font-medium bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#2E6B6B] focus:border-[#2E6B6B]"
            />
          </div>
        ) : (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="batch-names-input"
                className="block text-xs font-bold uppercase tracking-wider text-slate-600"
              >
                2. Class List (1 name per line)
              </label>
              <span className="text-[11px] font-bold text-[#2E6B6B]">
                {parsedNames.length} / 30 names
              </span>
            </div>
            <textarea
              id="batch-names-input"
              rows={5}
              value={batchText}
              onChange={(e) => {
                setBatchText(e.target.value);
                setPreviewIdx(0);
              }}
              placeholder={'Emma\nNoah\nSofia\nLiam'}
              className="w-full px-3.5 py-2.5 text-sm font-medium bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#2E6B6B] focus:border-[#2E6B6B]"
            />
            <p className="text-[11px] text-slate-500">
              Creates 1 full-page tracing sheet per student in a single PDF packet.
            </p>
          </div>
        )}

        {/* Case Style */}
        <div className="space-y-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
            3. Letter Case
          </span>
          <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs">
            {[
              { id: 'title' as const, label: 'Title (Emma)' },
              { id: 'upper' as const, label: 'UPPER (EMMA)' },
              { id: 'lower' as const, label: 'lower (emma)' },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setCaseMode(opt.id)}
                className={`py-2 px-2 rounded-lg font-bold transition-colors truncate ${
                  caseMode === opt.id
                    ? 'bg-white text-[#2E6B6B] shadow-2xs border border-slate-200/80'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Paper Size & Orientation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              5. Orientation
            </span>
            <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs">
              <button
                type="button"
                onClick={() => setOrientation('landscape')}
                className={`py-2 px-2 rounded-lg font-bold transition-colors ${
                  orientation === 'landscape'
                    ? 'bg-white text-[#2E6B6B] shadow-2xs border border-slate-200/80'
                    : 'text-slate-600'
                }`}
              >
                Landscape
              </button>
              <button
                type="button"
                onClick={() => setOrientation('portrait')}
                className={`py-2 px-2 rounded-lg font-bold transition-colors ${
                  orientation === 'portrait'
                    ? 'bg-white text-[#2E6B6B] shadow-2xs border border-slate-200/80'
                    : 'text-slate-600'
                }`}
              >
                Portrait
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
              Show starting dots on guided rows
            </span>
            <span className="block text-[11px] text-slate-500">
              Teal starting dots help young writers start strokes in the right spot.
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
                : parsedNames.length > 1
                ? `Download Free Class PDF (${parsedNames.length} Pages)`
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

        {/* Privacy Notice */}
        <div className="pt-3 border-t border-slate-100 flex items-start gap-2 text-[11px] text-slate-600 leading-relaxed">
          <ShieldCheck className="w-4 h-4 text-[#2E6B6B] shrink-0 mt-0.5" />
          <span>
            <strong>100% Private &amp; COPPA Safe:</strong> Student names are rendered directly inside your browser and are never uploaded or stored on our servers.
          </span>
        </div>
      </div>

      {/* Right Live SVG Preview Panel */}
      <div className="lg:col-span-7 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 px-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Sparkles className="w-3.5 h-3.5 text-[#F2B544]" />
            <span>
              Live Worksheet Preview · {paperLabel} ({orientation === 'landscape' ? '4 Rows' : '5 Rows'})
            </span>
          </div>

          {parsedNames.length > 1 && (
            <div className="flex items-center gap-1.5 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setPreviewIdx((i) => Math.max(0, i - 1))}
                disabled={safePreviewIdx === 0}
                aria-label="Previous student page"
                className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 disabled:opacity-40 hover:bg-slate-50"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="px-2 text-slate-700">
                Page {safePreviewIdx + 1} of {parsedNames.length}:{' '}
                <strong className="text-[#2E6B6B]">{activePreviewName}</strong>
              </span>
              <button
                type="button"
                onClick={() =>
                  setPreviewIdx((i) => Math.min(parsedNames.length - 1, i + 1))
                }
                disabled={safePreviewIdx >= parsedNames.length - 1}
                aria-label="Next student page"
                className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 disabled:opacity-40 hover:bg-slate-50"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        <div className="bg-slate-100/90 border border-slate-200 rounded-2xl p-4 sm:p-6 flex items-center justify-center">
          <div
            className={`w-full bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden ${
              orientation === 'portrait' ? 'max-w-[460px]' : 'max-w-[680px]'
            }`}
          >
            <svg
              viewBox={`0 0 ${pageW} ${pageH}`}
              className="w-full h-auto block select-none"
              role="img"
              aria-label={`Live name tracing preview for ${activePreviewName}`}
            >
              <rect x={0} y={0} width={pageW} height={pageH} fill="#FFFFFF" />

              {/* Header */}
              <text
                x={marginX}
                y={topHeaderY}
                fontSize={20}
                fontWeight="700"
                fontFamily="Helvetica, Arial, sans-serif"
                fill="#0F172A"
              >
                Name Tracing Practice
              </text>
              <text
                x={pageW - marginX}
                y={topHeaderY - 1}
                fontSize={9}
                fontFamily="Helvetica, Arial, sans-serif"
                fill="#64748B"
                textAnchor="end"
              >
                {paperLabel}  |  KinderESL.com
              </text>
              <line
                x1={marginX}
                y1={topHeaderY + 18}
                x2={pageW - marginX}
                y2={topHeaderY + 18}
                stroke="#2E6B6B"
                strokeWidth={1.5}
              />
              <text
                x={marginX}
                y={topHeaderY + 36}
                fontSize={10}
                fontFamily="Helvetica, Arial, sans-serif"
                fill="#64748B"
              >
                Say each letter sound aloud as you trace starting from the dot.
              </text>

              {/* Rows */}
              {rows.map((row, idx) => {
                const boxY = firstRowTop + idx * totalStep;
                const midY = boxY + rowH * 0.48;
                const baseY = boxY + rowH;

                const layout =
                  row.mode === 'blank'
                    ? null
                    : layoutNameStrokes(activePreviewName, {
                        boxX: marginX + 12,
                        boxY,
                        boxWidth: usableW - 24,
                        rowHeight: rowH,
                        align: 'left',
                      });

                const strokeW = layout
                  ? Math.max(1.5, Math.min(2.6, layout.scale * 0.036))
                  : 2;
                const dotR = layout
                  ? Math.max(2.1, Math.min(3.3, layout.scale * 0.044))
                  : 2.5;
                const strokeColor =
                  row.mode === 'guide'
                    ? '#C2D6D6'
                    : row.mode === 'trace-dots'
                    ? '#526170'
                    : '#788590';
                const isDashed = row.mode !== 'guide';

                return (
                  <g key={idx}>
                    <text
                      x={marginX}
                      y={boxY - 6}
                      fontSize={7.5}
                      fontWeight="700"
                      fontFamily="Helvetica, Arial, sans-serif"
                      fill="#2E6B6B"
                    >
                      {row.label.toUpperCase()}
                    </text>
                    <line
                      x1={marginX}
                      y1={boxY}
                      x2={pageW - marginX}
                      y2={boxY}
                      stroke="#94ABB8"
                      strokeWidth={0.9}
                    />
                    <line
                      x1={marginX}
                      y1={midY}
                      x2={pageW - marginX}
                      y2={midY}
                      stroke="#ADC2CF"
                      strokeWidth={0.85}
                      strokeDasharray="5 4"
                    />
                    <line
                      x1={marginX}
                      y1={baseY}
                      x2={pageW - marginX}
                      y2={baseY}
                      stroke="#94ABB8"
                      strokeWidth={1.15}
                    />

                    {layout &&
                      layout.strokes.map((s, sIdx) => (
                        <path
                          key={sIdx}
                          d={strokeCommandsToSvgPath(s.commands)}
                          fill="none"
                          stroke={strokeColor}
                          strokeWidth={strokeW}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeDasharray={isDashed ? '3 3.6' : undefined}
                        />
                      ))}

                    {showStartingDots &&
                      layout &&
                      (row.mode === 'guide' || row.mode === 'trace-dots') &&
                      layout.strokes.map((s, sIdx) =>
                        s.startDot ? (
                          <circle
                            key={`dot-${sIdx}`}
                            cx={s.startDot[0]}
                            cy={s.startDot[1]}
                            r={dotR}
                            fill="#2E6B6B"
                          />
                        ) : null
                      )}
                  </g>
                );
              })}

              {/* Footer */}
              <line
                x1={marginX}
                y1={bottomFooterY - 14}
                x2={pageW - marginX}
                y2={bottomFooterY - 14}
                stroke="#D1E3E3"
                strokeWidth={0.75}
              />
              <text
                x={marginX}
                y={bottomFooterY}
                fontSize={8.5}
                fontFamily="Helvetica, Arial, sans-serif"
                fill="#64748B"
              >
                Free for classroom &amp; home use · kinderesl.com
              </text>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
