import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Worksheet } from '@/types/worksheet';
import { FileDown, Layers, CheckCircle2 } from 'lucide-react';

export function WorksheetCard({ worksheet }: { worksheet: Worksheet }) {
  return (
    <article className="group relative flex flex-col bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md hover:border-[#2E6B6B] transition-all duration-200">
      {/* Thumbnail container */}
      <Link
        href={`/worksheets/${worksheet.category}/${worksheet.slug}`}
        className="relative block aspect-[1224/1584] bg-slate-50 overflow-hidden border-b border-slate-100"
      >
        <Image
          src={worksheet.previewImages[0]}
          alt={`${worksheet.title} free printable PDF preview`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 320px"
          className="object-contain p-3 group-hover:scale-[1.02] transition-transform duration-300"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1 pointer-events-none">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-[#2E6B6B] text-white shadow-xs">
            {worksheet.categoryName}
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-white/95 text-slate-700 shadow-xs border border-slate-200">
            <Layers className="w-3 h-3 text-slate-500" />
            <span>{worksheet.pages} {worksheet.pages > 1 ? 'Pages' : 'Page'}</span>
          </span>
        </div>
      </Link>

      {/* Content */}
      <div className="flex-1 flex flex-col p-4">
        {/* Ages & Skill row */}
        <div className="flex items-center justify-between text-xs text-slate-600 mb-1.5 font-medium">
          <span className="text-[#2E6B6B] font-semibold">{worksheet.ages}</span>
          <span>{worksheet.gradeLevel}</span>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-slate-900 group-hover:text-[#2E6B6B] transition-colors line-clamp-2 mb-2">
          <Link href={`/worksheets/${worksheet.category}/${worksheet.slug}`}>
            {worksheet.title}
          </Link>
        </h3>

        {/* Skill summary */}
        <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed flex-1">
          {worksheet.skill}
        </p>

        {/* Footer actions */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Free PDF</span>
          </span>

          <Link
            href={`/worksheets/${worksheet.category}/${worksheet.slug}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#F0F7F7] text-[#2E6B6B] hover:bg-[#2E6B6B] hover:text-white transition-colors"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>Get Printable</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
