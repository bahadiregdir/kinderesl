import React from 'react';
import { ImageResponse } from 'next/og';
import { getToolConfig } from '@/data/tools';
import { CLIPART_COUNT } from '@/lib/clipart';
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

function FlashcardMakerPreviewCard() {
  const cards = [
    { word: 'Cow', sub: 'Farm Animals' },
    { word: 'Snowman', sub: 'Winter' },
    { word: 'Cat', sub: 'CVC Phonics' },
    { word: 'Bell', sub: 'Christmas' },
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
          marginBottom: 16,
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
          ESL Picture Flashcards
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
          2×2 · 2×3 · 3×3
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
          width: '100%',
          flex: 1,
        }}
      >
        {[0, 1].map((rowIdx) => (
          <div
            key={rowIdx}
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: 14,
              flex: 1,
            }}
          >
            {cards.slice(rowIdx * 2, rowIdx * 2 + 2).map((card) => (
              <div
                key={card.word}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  flex: 1,
                  border: '2px solid #2E6B6B',
                  borderRadius: 14,
                  backgroundColor: '#FFFFFF',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    height: 10,
                    width: '100%',
                    backgroundColor: '#F0F7F7',
                  }}
                />
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '6px 10px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      fontSize: 12,
                      fontWeight: 700,
                      color: '#2E6B6B',
                      backgroundColor: '#F0F7F7',
                      padding: '3px 10px',
                      borderRadius: 999,
                    }}
                  >
                    {card.sub}
                  </div>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderTop: '1.5px solid #D0E3E3',
                    padding: '8px 10px',
                    fontSize: 22,
                    fontWeight: 700,
                    color: '#0F172A',
                  }}
                >
                  {card.word}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 12,
          fontSize: 13,
          color: '#64748B',
        }}
      >
        <span>{CLIPART_COUNT} Line-Art Drawings + Tracing</span>
        <span style={{ color: '#2E6B6B', fontWeight: 700 }}>kinderesl.com</span>
      </div>
    </div>
  );
}

function ISpyPreviewCard() {
  const spots = [
    { word: 'Snowman', x: 24, y: 18, bg: '#E6F4F2' },
    { word: 'Mitten', x: 220, y: 24, bg: '#FEF3C7' },
    { word: 'Igloo', x: 112, y: 88, bg: '#F1F5F9' },
    { word: 'Sled', x: 256, y: 98, bg: '#E6F4F2' },
    { word: 'Hat', x: 28, y: 152, bg: '#FEF3C7' },
    { word: 'Coat', x: 162, y: 160, bg: '#F1F5F9' },
  ];

  const counts = ['Snowman [ ]', 'Mitten [ ]', 'Igloo [ ]', 'Sled [ ]'];

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
          marginBottom: 14,
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
          Winter I Spy &amp; Count
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
          + Answer Key
        </div>
      </div>

      {/* Scattered Search Box */}
      <div
        style={{
          display: 'flex',
          position: 'relative',
          width: '100%',
          height: 214,
          border: '2px solid #2E6B6B',
          borderRadius: 12,
          backgroundColor: '#FAFCFC',
          marginBottom: 12,
        }}
      >
        {spots.map((s) => (
          <div
            key={s.word}
            style={{
              display: 'flex',
              position: 'absolute',
              left: s.x,
              top: s.y,
              backgroundColor: s.bg,
              border: '1.5px solid #2E6B6B',
              borderRadius: 999,
              padding: '6px 14px',
              fontSize: 15,
              fontWeight: 700,
              color: '#0F172A',
            }}
          >
            {s.word}
          </div>
        ))}
      </div>

      {/* Count Checklist Row */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: 8,
          backgroundColor: '#F0F7F7',
          border: '1px solid #D0E3E3',
          borderRadius: 10,
          padding: '10px',
        }}
      >
        {counts.map((c) => (
          <div
            key={c}
            style={{
              display: 'flex',
              flex: 1,
              justifyContent: 'center',
              backgroundColor: '#FFFFFF',
              border: '1px solid #93B5B5',
              borderRadius: 6,
              padding: '6px 4px',
              fontSize: 11,
              fontWeight: 700,
              color: '#1E293B',
            }}
          >
            {c}
          </div>
        ))}
      </div>

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
        <span>Easy, Medium &amp; Busy Levels</span>
        <span style={{ color: '#2E6B6B', fontWeight: 700 }}>kinderesl.com</span>
      </div>
    </div>
  );
}

function MatchingPreviewCard() {
  const pairs = [
    { left: 'Cow', right: 'Duck' },
    { left: 'Duck', right: 'Pig' },
    { left: 'Pig', right: 'Cow' },
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
          marginBottom: 16,
        }}
      >
        <div style={{ display: 'flex', fontSize: 22, fontWeight: 700, color: '#0F172A' }}>
          Picture Matching
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
          Word &amp; Letter
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 18,
          flex: 1,
          justifyContent: 'center',
        }}
      >
        {pairs.map((row) => (
          <div
            key={row.left}
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div
              style={{
                display: 'flex',
                width: 146,
                height: 68,
                borderRadius: 12,
                border: '2px solid #2E6B6B',
                backgroundColor: '#FFFFFF',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 18,
                fontWeight: 700,
                color: '#2E6B6B',
              }}
            >
              [ {row.left} ]
            </div>
            <div
              style={{
                display: 'flex',
                width: 14,
                height: 14,
                borderRadius: 999,
                backgroundColor: '#2E6B6B',
              }}
            />
            <div
              style={{
                display: 'flex',
                flex: 1,
                height: 2,
                backgroundColor: '#CBD5E1',
                margin: '0 8px',
              }}
            />
            <div
              style={{
                display: 'flex',
                width: 14,
                height: 14,
                borderRadius: 999,
                backgroundColor: '#2E6B6B',
              }}
            />
            <div
              style={{
                display: 'flex',
                width: 146,
                height: 68,
                borderRadius: 12,
                border: '2px solid #2E6B6B',
                backgroundColor: '#F0F7F7',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 21,
                fontWeight: 700,
                color: '#0F172A',
              }}
            >
              {row.right}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 10,
          fontSize: 13,
          color: '#64748B',
        }}
      >
        <span>Draws Lines + Answer Key Page</span>
        <span style={{ color: '#2E6B6B', fontWeight: 700 }}>kinderesl.com</span>
      </div>
    </div>
  );
}

function WordSearchPreviewCard() {
  const rows = [
    ['S', 'N', 'O', 'W', 'Q', 'M'],
    ['C', 'O', 'A', 'T', 'B', 'I'],
    ['A', 'H', 'A', 'T', 'E', 'T'],
    ['R', 'L', 'B', 'O', 'O', 'T'],
    ['F', 'S', 'L', 'E', 'D', 'E'],
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
          marginBottom: 14,
        }}
      >
        <div style={{ display: 'flex', fontSize: 22, fontWeight: 700, color: '#0F172A' }}>
          Picture Word Search
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
          6×6 &amp; 8×8
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignSelf: 'center',
          border: '2.5px solid #2E6B6B',
          borderRadius: 10,
          overflow: 'hidden',
          marginBottom: 12,
        }}
      >
        {rows.map((r, rIdx) => (
          <div key={rIdx} style={{ display: 'flex', flexDirection: 'row' }}>
            {r.map((ch, cIdx) => {
              const hit = (rIdx === 0 && cIdx < 4) || (rIdx === 1 && cIdx < 4);
              return (
                <div
                  key={cIdx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 48,
                    height: 44,
                    backgroundColor: hit ? '#DFF2EF' : '#FFFFFF',
                    borderRight: cIdx < 5 ? '1px solid #CBD5E1' : 'none',
                    borderBottom: rIdx < 4 ? '1px solid #CBD5E1' : 'none',
                    fontSize: 20,
                    fontWeight: 700,
                    color: hit ? '#2E6B6B' : '#0F172A',
                  }}
                >
                  {ch}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-around',
          backgroundColor: '#F0F7F7',
          borderRadius: 10,
          padding: '8px 12px',
          fontSize: 13,
          fontWeight: 700,
          color: '#0F172A',
        }}
      >
        <span>SNOW</span>
        <span>COAT</span>
        <span>HAT</span>
        <span>BOOT</span>
        <span>SLED</span>
      </div>

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
        <span>Across &amp; Down Only + Answer Key</span>
        <span style={{ color: '#2E6B6B', fontWeight: 700 }}>kinderesl.com</span>
      </div>
    </div>
  );
}

function ClipCardsPreviewCard() {
  const sampleCards = [
    { word: 'Cat', choices: ['C', 'M', 'S'], ans: 'C' },
    { word: 'Dog', choices: ['B', 'D', 'T'], ans: 'D' },
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
          marginBottom: 16,
        }}
      >
        <div style={{ display: 'flex', fontSize: 22, fontWeight: 700, color: '#0F172A' }}>
          Beginning Sounds Clips
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
          2×2 &amp; 2×3
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'row', gap: 16, flex: 1 }}>
        {sampleCards.map((c) => (
          <div
            key={c.word}
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              flex: 1,
              border: '2.5px solid #2E6B6B',
              borderRadius: 16,
              padding: 14,
              backgroundColor: '#FFFFFF',
            }}
          >
            <div
              style={{
                display: 'flex',
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 28,
                fontWeight: 700,
                color: '#2E6B6B',
                backgroundColor: '#F8FAFC',
                borderRadius: 10,
                marginBottom: 12,
              }}
            >
              {c.word}
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', gap: 8 }}>
              {c.choices.map((ch) => (
                <div
                  key={ch}
                  style={{
                    display: 'flex',
                    flex: 1,
                    height: 52,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 8,
                    border: '2px solid #2E6B6B',
                    backgroundColor: ch === c.ans ? '#DFF2EF' : '#F0F7F7',
                    fontSize: 22,
                    fontWeight: 700,
                    color: '#0F172A',
                  }}
                >
                  {ch}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 14,
          fontSize: 13,
          color: '#64748B',
        }}
      >
        <span>{CLIPART_COUNT} Drawings · Upper, lower &amp; Aa</span>
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

function LetterTracingPreviewCard() {
  const svgW = 416;
  const svgH = 316;
  const rows = [
    { token: 'Aa  Aa  Aa', y: 26, rowH: 72, stroke: '#2E6B6B', dashed: false },
    { token: 'Aa  Aa  Aa', y: 128, rowH: 72, stroke: '#334155', dashed: true },
    { token: 'Bb  Bb  Bb', y: 230, rowH: 72, stroke: '#334155', dashed: true },
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
          Letter Tracing A–Z
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
          A–Z · 26 Pages
        </div>
      </div>

      <svg width={svgW} height={svgH} viewBox={`0 0 ${svgW} ${svgH}`}>
        {rows.map((row, idx) => {
          const midY = row.y + row.rowH * 0.48;
          const baseY = row.y + row.rowH;
          const layout = layoutNameStrokes(row.token, {
            boxX: 12,
            boxY: row.y,
            boxWidth: svgW - 24,
            rowHeight: row.rowH,
            align: 'center',
          });

          return (
            <g key={idx}>
              <line x1={0} y1={row.y} x2={svgW} y2={row.y} stroke="#94A3B8" strokeWidth={1.5} />
              <line
                x1={0}
                y1={midY}
                x2={svgW}
                y2={midY}
                stroke="#CBD5E1"
                strokeWidth={1.4}
                strokeDasharray="7 6"
              />
              <line x1={0} y1={baseY} x2={svgW} y2={baseY} stroke="#64748B" strokeWidth={1.8} />

              {layout.strokes.map((s, sIdx) => (
                <path
                  key={sIdx}
                  d={strokeCommandsToSvgPath(s.commands)}
                  fill="none"
                  stroke={row.stroke}
                  strokeWidth={3}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray={row.dashed ? '5 6' : undefined}
                />
              ))}

              {layout.strokes.map((s, sIdx) =>
                s.startDot ? (
                  <circle
                    key={`d-${sIdx}`}
                    cx={s.startDot[0]}
                    cy={s.startDot[1]}
                    r={3.8}
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
        <span>Single Letters, SATPIN &amp; Full A–Z</span>
        <span style={{ color: '#2E6B6B', fontWeight: 700 }}>kinderesl.com</span>
      </div>
    </div>
  );
}

function NumberTracingPreviewCard() {
  const svgW = 416;
  const svgH = 200;
  const rows = [
    { token: '1   2   3', y: 16, rowH: 70 },
    { token: '4   5   6', y: 112, rowH: 70 },
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
          Number Tracing 0–20
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
          + Ten-Frames
        </div>
      </div>

      {/* Mini 2x5 Ten-Frame showing 5 */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#F0F7F7',
          border: '1.5px solid #D0E3E3',
          borderRadius: 12,
          padding: '10px 16px',
          marginBottom: 12,
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ display: 'flex', fontSize: 18, fontWeight: 700, color: '#0F172A' }}>
            Five (5)
          </div>
          <div style={{ display: 'flex', fontSize: 12, color: '#475569' }}>
            Ten-Frame + Number Word
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            border: '2px solid #2E6B6B',
            borderRadius: 6,
            backgroundColor: '#FFFFFF',
            overflow: 'hidden',
          }}
        >
          {[0, 1].map((r) => (
            <div key={r} style={{ display: 'flex', flexDirection: 'row' }}>
              {[0, 1, 2, 3, 4].map((c) => {
                const idx = r * 5 + c;
                const filled = idx < 5;
                return (
                  <div
                    key={c}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 32,
                      height: 30,
                      borderRight: c < 4 ? '1px solid #94A3B8' : 'none',
                      borderBottom: r === 0 ? '1px solid #94A3B8' : 'none',
                    }}
                  >
                    {filled && (
                      <div
                        style={{
                          display: 'flex',
                          width: 16,
                          height: 16,
                          borderRadius: 999,
                          backgroundColor: '#2E6B6B',
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <svg width={svgW} height={svgH} viewBox={`0 0 ${svgW} ${svgH}`}>
        {rows.map((row, idx) => {
          const midY = row.y + row.rowH * 0.48;
          const baseY = row.y + row.rowH;
          const layout = layoutNameStrokes(row.token, {
            boxX: 16,
            boxY: row.y,
            boxWidth: svgW - 32,
            rowHeight: row.rowH,
            align: 'center',
          });

          return (
            <g key={idx}>
              <line x1={0} y1={row.y} x2={svgW} y2={row.y} stroke="#94A3B8" strokeWidth={1.5} />
              <line
                x1={0}
                y1={midY}
                x2={svgW}
                y2={midY}
                stroke="#CBD5E1"
                strokeWidth={1.4}
                strokeDasharray="7 6"
              />
              <line x1={0} y1={baseY} x2={svgW} y2={baseY} stroke="#64748B" strokeWidth={1.8} />

              {layout.strokes.map((s, sIdx) => (
                <path
                  key={sIdx}
                  d={strokeCommandsToSvgPath(s.commands)}
                  fill="none"
                  stroke="#334155"
                  strokeWidth={3.2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="5 6"
                />
              ))}

              {layout.strokes.map((s, sIdx) =>
                s.startDot ? (
                  <circle
                    key={`d-${sIdx}`}
                    cx={s.startDot[0]}
                    cy={s.startDot[1]}
                    r={4}
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
          paddingTop: 6,
          fontSize: 13,
          color: '#64748B',
        }}
      >
        <span>0–10 &amp; 0–20 Math Packets</span>
        <span style={{ color: '#2E6B6B', fontWeight: 700 }}>kinderesl.com</span>
      </div>
    </div>
  );
}

function HandwritingPreviewCard() {
  const svgW = 416;
  const svgH = 304;
  const words = ['the', 'see', 'play'];
  const colW = svgW / 3;

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
          marginBottom: 10,
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
          Sight Word Practice
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 12,
            fontWeight: 700,
            color: '#2E6B6B',
            backgroundColor: '#F0F7F7',
            padding: '4px 10px',
            borderRadius: 999,
          }}
        >
          Read · Trace · Write
        </div>
      </div>

      <svg width={svgW} height={svgH} viewBox={`0 0 ${svgW} ${svgH}`}>
        {words.map((word, idx) => {
          const y = 22 + idx * 96;
          const rowH = 66;
          const midY = y + rowH * 0.48;
          const baseY = y + rowH;

          const guide = layoutNameStrokes(word, {
            boxX: 8,
            boxY: y,
            boxWidth: colW - 16,
            rowHeight: rowH,
            align: 'center',
          });
          const trace = layoutNameStrokes(word, {
            boxX: colW + 8,
            boxY: y,
            boxWidth: colW - 16,
            rowHeight: rowH,
            align: 'center',
          });

          return (
            <g key={word}>
              <line x1={0} y1={y} x2={svgW} y2={y} stroke="#94A3B8" strokeWidth={1.4} />
              <line
                x1={0}
                y1={midY}
                x2={svgW}
                y2={midY}
                stroke="#CBD5E1"
                strokeWidth={1.2}
                strokeDasharray="6 5"
              />
              <line x1={0} y1={baseY} x2={svgW} y2={baseY} stroke="#64748B" strokeWidth={1.6} />

              <line
                x1={colW}
                y1={y - 4}
                x2={colW}
                y2={baseY + 4}
                stroke="#D1E3E3"
                strokeWidth={1.2}
                strokeDasharray="3 4"
              />
              <line
                x1={colW * 2}
                y1={y - 4}
                x2={colW * 2}
                y2={baseY + 4}
                stroke="#D1E3E3"
                strokeWidth={1.2}
                strokeDasharray="3 4"
              />

              {guide.strokes.map((s, sIdx) => (
                <path
                  key={`g-${sIdx}`}
                  d={strokeCommandsToSvgPath(s.commands)}
                  fill="none"
                  stroke="#B8D0D0"
                  strokeWidth={2.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ))}

              {trace.strokes.map((s, sIdx) => (
                <path
                  key={`t-${sIdx}`}
                  d={strokeCommandsToSvgPath(s.commands)}
                  fill="none"
                  stroke="#334155"
                  strokeWidth={2.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="4 5"
                />
              ))}

              {trace.strokes.map((s, sIdx) =>
                s.startDot ? (
                  <circle
                    key={`d-${sIdx}`}
                    cx={s.startDot[0]}
                    cy={s.startDot[1]}
                    r={3.2}
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
          paddingTop: 6,
          fontSize: 13,
          color: '#64748B',
        }}
      >
        <span>Dolch Sight Words &amp; CVC Families</span>
        <span style={{ color: '#2E6B6B', fontWeight: 700 }}>kinderesl.com</span>
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
          ) : tool.previewKind === 'letter-tracing' ? (
            <LetterTracingPreviewCard />
          ) : tool.previewKind === 'number-tracing' ? (
            <NumberTracingPreviewCard />
          ) : tool.previewKind === 'handwriting-maker' ? (
            <HandwritingPreviewCard />
          ) : tool.previewKind === 'flashcard-maker' ? (
            <FlashcardMakerPreviewCard />
          ) : tool.previewKind === 'i-spy-maker' ? (
            <ISpyPreviewCard />
          ) : tool.previewKind === 'matching-maker' ? (
            <MatchingPreviewCard />
          ) : tool.previewKind === 'word-search-maker' ? (
            <WordSearchPreviewCard />
          ) : tool.previewKind === 'clip-cards-maker' ? (
            <ClipCardsPreviewCard />
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
