import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Worksheet } from '@/types/worksheet';
import { Layers } from 'lucide-react';

interface WorksheetCardProps {
  worksheet: Worksheet;
  locale?: 'en' | 'tr';
}

export function WorksheetCard({ worksheet, locale = 'en' }: WorksheetCardProps) {
  const isTr = locale === 'tr';
  const trData = worksheet.i18n?.tr;

  const title = isTr && trData ? trData.title : worksheet.title;
  const href = isTr && trData
    ? `/tr/calisma-sayfalari/${trData.slug}`
    : `/worksheets/${worksheet.slug}`;

  const pagesText = isTr
    ? `${worksheet.pages} sayfa`
    : `${worksheet.pages} ${worksheet.pages > 1 ? 'pages' : 'page'}`;

  const metaLine = `${worksheet.ages} · ${pagesText}`;

  return (
    <article className="group relative flex flex-col bg-white rounded-2xl border border-slate-200/80 hover:border-[#2E6B6B] hover:shadow-lg transition-all duration-200 overflow-hidden">
      <Link href={href} className="flex flex-col flex-1">
        {/* Preview Container */}
        <div className="relative aspect-[1224/1584] bg-slate-50/70 overflow-hidden border-b border-slate-100">
          <Image
            src={worksheet.previewImages[0]}
            alt={title}
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
            {title}
          </h3>

          <div className="mt-auto pt-2 text-xs text-slate-500 font-medium flex items-center justify-between">
            <span>{metaLine}</span>
            <span className="text-[#2E6B6B] font-semibold group-hover:translate-x-0.5 transition-transform">
              {isTr ? 'Görüntüle →' : 'View →'}
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
