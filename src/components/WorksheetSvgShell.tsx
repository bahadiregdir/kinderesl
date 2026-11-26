import React from 'react';
import { getPaperLabel, type PaperSizeOption } from '@/lib/pdf-stroke-utils';
import { strokeCommandsToSvgPath, type StrokePath } from '@/lib/tracing-strokes';

interface WorksheetSvgShellProps {
  pageW: number;
  pageH: number;
  marginX: number;
  topHeaderY: number;
  bottomFooterY: number;
  title: string;
  subtitle: string;
  paperSize: PaperSizeOption;
  ariaLabel: string;
  children: React.ReactNode;
}

export function WorksheetSvgShell({
  pageW,
  pageH,
  marginX,
  topHeaderY,
  bottomFooterY,
  title,
  subtitle,
  paperSize,
  ariaLabel,
  children,
}: WorksheetSvgShellProps) {
  const paperLabel = getPaperLabel(paperSize);

  return (
    <svg
      viewBox={`0 0 ${pageW} ${pageH}`}
      className="w-full h-auto block select-none"
      role="img"
      aria-label={ariaLabel}
    >
      <rect x={0} y={0} width={pageW} height={pageH} fill="#FFFFFF" />

      {/* Header */}
      <text
        x={marginX}
        y={topHeaderY}
        fontSize={19}
        fontWeight="700"
        fontFamily="Helvetica, Arial, sans-serif"
        fill="#0F172A"
      >
        {title}
      </text>
      <text
        x={pageW - marginX}
        y={topHeaderY - 1}
        fontSize={8.5}
        fontFamily="Helvetica, Arial, sans-serif"
        fill="#64748B"
        textAnchor="end"
      >
        {paperLabel}  |  KinderESL.com
      </text>
      <line
        x1={marginX}
        y1={topHeaderY + 17}
        x2={pageW - marginX}
        y2={topHeaderY + 17}
        stroke="#2E6B6B"
        strokeWidth={1.5}
      />
      <text
        x={marginX}
        y={topHeaderY + 34}
        fontSize={9.5}
        fontFamily="Helvetica, Arial, sans-serif"
        fill="#64748B"
      >
        {subtitle}
      </text>
      <text
        x={pageW - marginX}
        y={topHeaderY + 34}
        fontSize={9.5}
        fontFamily="Helvetica, Arial, sans-serif"
        fill="#64748B"
        textAnchor="end"
      >
        Name: _______________________
      </text>

      {children}

      {/* Footer */}
      <line
        x1={marginX}
        y1={bottomFooterY - 12}
        x2={pageW - marginX}
        y2={bottomFooterY - 12}
        stroke="#D1E3E3"
        strokeWidth={0.75}
      />
      <text
        x={pageW / 2}
        y={bottomFooterY + 4}
        fontSize={8.5}
        fontFamily="Helvetica, Arial, sans-serif"
        fill="#64748B"
        textAnchor="middle"
      >
        Free for non-commercial home &amp; classroom use  |  More free printables at KinderESL.com
      </text>
    </svg>
  );
}

interface SvgHandwritingRowProps {
  x: number;
  y: number;
  width: number;
  height: number;
  label?: string;
  strokes?: StrokePath[];
  strokeWidth?: number;
  strokeColor?: string;
  dashed?: boolean;
  dotStrokes?: StrokePath[];
  dotRadius?: number;
  showDots?: boolean;
  dividerColumns?: number;
}

export function SvgHandwritingRow({
  x,
  y,
  width,
  height,
  label,
  strokes = [],
  strokeWidth = 2,
  strokeColor = '#4D5C6E',
  dashed = true,
  dotStrokes,
  dotRadius = 2.6,
  showDots = false,
  dividerColumns,
}: SvgHandwritingRowProps) {
  const midY = y + height * 0.48;
  const baseY = y + height;
  const dotsSource = dotStrokes ?? strokes;

  return (
    <g>
      {label && (
        <text
          x={x}
          y={y - 6}
          fontSize={7.5}
          fontWeight="700"
          fontFamily="Helvetica, Arial, sans-serif"
          fill="#2E6B6B"
        >
          {label.toUpperCase()}
        </text>
      )}
      <line
        x1={x}
        y1={y}
        x2={x + width}
        y2={y}
        stroke="#94ABB8"
        strokeWidth={0.9}
      />
      <line
        x1={x}
        y1={midY}
        x2={x + width}
        y2={midY}
        stroke="#ADC2CF"
        strokeWidth={0.85}
        strokeDasharray="5 4"
      />
      <line
        x1={x}
        y1={baseY}
        x2={x + width}
        y2={baseY}
        stroke="#94ABB8"
        strokeWidth={1.15}
      />

      {dividerColumns &&
        dividerColumns > 1 &&
        Array.from({ length: dividerColumns - 1 }, (_, idx) => {
          const dx = x + ((idx + 1) * width) / dividerColumns;
          return (
            <line
              key={idx}
              x1={dx}
              y1={y - 4}
              x2={dx}
              y2={baseY + 4}
              stroke="#D1E3E3"
              strokeWidth={0.75}
              strokeDasharray="2 3"
            />
          );
        })}

      {strokes.map((s, sIdx) => (
        <path
          key={sIdx}
          d={strokeCommandsToSvgPath(s.commands)}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={dashed ? '3 3.6' : undefined}
        />
      ))}

      {showDots &&
        dotsSource.map((s, sIdx) =>
          s.startDot ? (
            <circle
              key={`d-${sIdx}`}
              cx={s.startDot[0]}
              cy={s.startDot[1]}
              r={dotRadius}
              fill="#2E6B6B"
            />
          ) : null
        )}
    </g>
  );
}
