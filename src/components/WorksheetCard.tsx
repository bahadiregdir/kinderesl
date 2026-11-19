'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Worksheet } from '@/types/worksheet';
import { useLessonPack } from '@/context/LessonPackContext';
import { Layers, Plus, Check } from 'lucide-react';

interface WorksheetCardProps {
  worksheet: Worksheet;
}

export function WorksheetCard({ worksheet }: WorksheetCardProps) {
  const href = `/worksheets/${worksheet.slug}`;
  const pagesText = `${worksheet.pages} ${worksheet.pages > 1 ? 'pages' : 'page'}`;
  const metaLine = `${worksheet.ages} · ${pagesText}`;
  const { hasItem, toggleItem } = useLessonPack();
  const inPack = hasItem(worksheet.slug);

  const handleTogglePack = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem(worksheet);
  };

  return (
    <article className="group relative flex flex-col bg-white rounded-2xl border border-slate-200/80 hover:border-[#2E6B6B] hover:shadow-lg transition-all duration-200 overflow-hidden">
      <Link href={href} className="flex flex-col flex-1">
        {/* Preview Container */}
        <div className="relative aspect-[1224/1584] bg-slate-50/70 overflow-hidden border-b border-slate-100">
          <Image
            src={worksheet.previewImages[0]}
            alt={worksheet.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 320px"
            className="object-contain p-3 group-hover:scale-[1.02] transition-transform duration-300"
            loading="lazy"
          />

          {/* Top category / subject badge */}
          <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1 pointer-events-none">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#F0F7F7] text-[#2E6B6B] border border-[#d0e3e3] shadow-xs">
              {worksheet.subjectName || worksheet.categoryName}
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/95 text-slate-700 shadow-xs border border-slate-200">
              <Layers className="w-3 h-3 text-slate-500" />
              <span>{worksheet.pages}p</span>
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-4">
          <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-[#2E6B6B] transition-colors line-clamp-2 mb-2 font-heading leading-snug">
            {worksheet.title}
          </h3>

          <div className="mt-auto pt-2 text-xs text-slate-500 font-medium flex items-center justify-between gap-2">
            <span>{metaLine}</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleTogglePack}
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold transition-colors ${
                  inPack
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-slate-100 hover:bg-[#F0F7F7] text-slate-700 hover:text-[#2E6B6B] border border-slate-200'
                }`}
                aria-label={inPack ? `Remove ${worksheet.title} from Lesson Pack` : `Add ${worksheet.title} to Lesson Pack`}
              >
                {inPack ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                <span>{inPack ? 'Saved' : 'Pack'}</span>
              </button>
              <span className="text-[#2E6B6B] font-semibold group-hover:underline">
                View →
              </span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
