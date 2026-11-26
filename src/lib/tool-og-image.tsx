import React from 'react';
import { ImageResponse } from 'next/og';
import { getToolConfig } from '@/data/tools';
import {
  layoutNameStrokes,
  strokeCommandsToSvgPath,
} from '@/lib/tracing-strokes';

export const TOOL_OG_SIZE = {
  width: 1200,
  height: 630,
} as const;

export const TOOL_OG_CONTENT_TYPE = 'image/png';

function NameTracingPreviewCard() {
  const svgW = 416;
  const svgH = 316;
  const rows = [
    { label: 'READ & TRACE', y: 24, rowH: 72, stroke: '#B8D0D0', dashed: false, dots: true },
    { label: 'TRACE', y: 128, rowH: 72, stroke: '#334155', dashed: true, dots: true },
    { label: 'TRACE ALONE', y: 232, rowH: 72, stroke: '#64748B', dashed: true, dots: false },
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: '24px 28px',
        boxShadow: '0 24px 48px rgba(10, 32, 32, 0.35)',
        border: '2px solid #D0E3E3',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '2px solid #2E6B6B',
          paddingBottom: 10,
          marginBottom: 12,
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: 22,
            fontWeight: 700,
            color: '#0F172A',
          }}
        >
          Name Tracing Practice
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 13,
            fontWeight: 700,
            color: '#2E6B6B',
            backgroundColor: '#F0F7F7',
            padding: '4px 10px',
            borderRadius: 999,
          }}
        >
          US Letter &amp; A4
        </div>
      </div>

      <svg width={svgW} height={svgH} viewBox={`0 0 ${svgW} ${svgH}`}>
        {rows.map((row, idx) => {
          const midY = row.y + row.rowH * 0.48;
          const baseY = row.y + row.rowH;
          const layout = layoutNameStrokes('EMMA', {
            boxX: 16,
            boxY: row.y,
            boxWidth: svgW - 32,
            rowHeight: row.rowH,
            align: 'center',
          });

          return (
            <g key={idx}>
              <line
                x1={0}
                y1={row.y}
                x2={svgW}
                y2={row.y}
                stroke="#94A3B8"
                strokeWidth={1.5}
              />
              <line
                x1={0}
                y1={midY}
                x2={svgW}
                y2={midY}
                stroke="#CBD5E1"
                strokeWidth={1.4}
                strokeDasharray="7 6"
              />
              <line
                x1={0}
                y1={baseY}
                x2={svgW}
                y2={baseY}
                stroke="#64748B"
                strokeWidth={1.8}
              />

              {layout.strokes.map((s, sIdx) => (
                <path
                  key={sIdx}
                  d={strokeCommandsToSvgPath(s.commands)}
                  fill="none"
                  stroke={row.stroke}
                  strokeWidth={3.2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray={row.dashed ? '5 6' : undefined}
                />
              ))}

              {row.dots &&
                layout.strokes.map((s, sIdx) =>
                  s.startDot ? (
                    <circle
                      key={`d-${sIdx}`}
                      cx={s.startDot[0]}
                      cy={s.startDot[1]}
                      r={4.2}
                      fill="#2E6B6B"
                    />
                  ) : null
                )}
            </g>
          );
        })}
      </svg>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 'auto',
          paddingTop: 8,
          fontSize: 13,
          color: '#64748B',
        }}
      >
        <span>Custom Student &amp; Class Sheets</span>
        <span style={{ color: '#2E6B6B', fontWeight: 700 }}>kinderesl.com</span>
      </div>
    </div>
  );
}

function BingoMakerPreviewCard() {
  const rows = [
    ['Cow', 'Pig', 'Hat'],
    ['Sun', 'FREE', 'Snow'],
    ['Red', 'Book', 'Star'],
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: '24px 28px',
        boxShadow: '0 24px 48px rgba(10, 32, 32, 0.35)',
        border: '2px solid #D0E3E3',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '2px solid #2E6B6B',
          paddingBottom: 10,
          marginBottom: 18,
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: 22,
            fontWeight: 700,
            color: '#0F172A',
          }}
        >
          ESL Vocabulary Bingo
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 14,
            fontWeight: 700,
            color: '#2E6B6B',
            backgroundColor: '#F0F7F7',
            padding: '4px 12px',
            borderRadius: 999,
          }}
        >
          Card #1
        </div>
      </div>

      {/* 3x3 Grid built purely with Flexbox rows for Satori */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: 318,
          height: 318,
          alignSelf: 'center',
          border: '3px solid #2E6B6B',
          borderRadius: 10,
          overflow: 'hidden',
        }}
      >
        {rows.map((row, rIdx) => (
          <div
            key={rIdx}
            style={{
              display: 'flex',
              flexDirection: 'row',
              width: '100%',
              height: 104,
            }}
          >
            {row.map((word, cIdx) => {
              const isFree = word === 'FREE';
              const isAlt = (rIdx + cIdx) % 2 === 1;
              return (
                <div
                  key={cIdx}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 104,
                    height: 104,
                    backgroundColor: isFree
                      ? '#DFF2EF'
                      : isAlt
                      ? '#F8FAFC'
                      : '#FFFFFF',
                    borderRight: cIdx < 2 ? '1.5px solid #93B5B5' : 'none',
                    borderBottom: rIdx < 2 ? '1.5px solid #93B5B5' : 'none',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      fontSize: isFree ? 24 : 21,
                      fontWeight: 700,
                      color: isFree ? '#2E6B6B' : '#0F172A',
                    }}
                  >
                    {word}
                  </div>
                  {isFree && (
                    <div
                      style={{
                        display: 'flex',
                        fontSize: 11,
                        fontWeight: 700,
                        color: '#2E6B6B',
                        marginTop: 2,
                      }}
                    >
                      SPACE
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 'auto',
          paddingTop: 10,
          fontSize: 13,
          color: '#64748B',
        }}
      >
        <span>Up to 30 Shuffled Cards + Caller Sheet</span>
        <span style={{ color: '#2E6B6B', fontWeight: 700 }}>kinderesl.com</span>
      </div>
    </div>
  );
}

function GenericToolPreviewCard({ title }: { title: string }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: '32px',
        boxShadow: '0 24px 48px rgba(10, 32, 32, 0.35)',
        border: '2px solid #D0E3E3',
      }}
    >
      <div
        style={{
          display: 'flex',
          fontSize: 28,
          fontWeight: 700,
          color: '#2E6B6B',
          textAlign: 'center',
        }}
      >
        {title}
      </div>
      <div
        style={{
          display: 'flex',
          marginTop: 14,
          fontSize: 18,
          color: '#475569',
        }}
      >
        Instant Printable PDF · US Letter &amp; A4
      </div>
    </div>
  );
}

export function renderToolOgImage(slug: string): ImageResponse {
  const tool = getToolConfig(slug);

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          height: '100%',
          background:
            'linear-gradient(135deg, #1A4444 0%, #2E6B6B 55%, #235555 100%)',
          padding: '48px 56px',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Left Branding & Copy Column */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            width: 570,
            height: '100%',
            paddingRight: 28,
          }}
        >
          {/* Top Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              alignSelf: 'flex-start',
              backgroundColor: 'rgba(255, 255, 255, 0.14)',
              border: '1.5px solid rgba(255, 255, 255, 0.25)',
              borderRadius: 999,
              padding: '8px 18px',
            }}
          >
            <div
              style={{
                display: 'flex',
                width: 10,
                height: 10,
                borderRadius: 999,
                backgroundColor: '#F2B544',
                marginRight: 10,
              }}
            />
            <div
              style={{
                display: 'flex',
                fontSize: 16,
                fontWeight: 700,
                color: '#FDE68A',
                letterSpacing: 1.1,
              }}
            >
              FREE EDUCATOR TOOL
            </div>
          </div>

          {/* Title + Subtitle + Badges */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 18,
            }}
          >
            <div
              style={{
                display: 'flex',
                fontSize: 52,
                fontWeight: 700,
                color: '#FFFFFF',
                lineHeight: 1.12,
              }}
            >
              {tool.ogTitle}
            </div>

            <div
              style={{
                display: 'flex',
                fontSize: 25,
                fontWeight: 600,
                color: '#D5EDED',
              }}
            >
              {tool.ogSubtitle}
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                gap: 12,
                marginTop: 6,
              }}
            >
              {tool.ogBadges.map((badge) => (
                <div
                  key={badge}
                  style={{
                    display: 'flex',
                    backgroundColor: '#FFFFFF',
                    color: '#1F4E4E',
                    fontSize: 16,
                    fontWeight: 700,
                    padding: '8px 16px',
                    borderRadius: 10,
                  }}
                >
                  {badge}
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Domain Footer */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 36,
                height: 36,
                borderRadius: 10,
                backgroundColor: '#F2B544',
                color: '#1A4444',
                fontSize: 20,
                fontWeight: 700,
              }}
            >
              K
            </div>
            <div
              style={{
                display: 'flex',
                fontSize: 22,
                fontWeight: 700,
                color: '#FFFFFF',
              }}
            >
              kinderesl.com
            </div>
          </div>
        </div>

        {/* Right Sample Output Card */}
        <div
          style={{
            display: 'flex',
            width: 472,
            height: 454,
          }}
        >
          {tool.previewKind === 'name-tracing' ? (
            <NameTracingPreviewCard />
          ) : tool.previewKind === 'bingo-maker' ? (
            <BingoMakerPreviewCard />
          ) : (
            <GenericToolPreviewCard title={tool.ogTitle} />
          )}
        </div>
      </div>
    ),
    {
      ...TOOL_OG_SIZE,
    }
  );
}
