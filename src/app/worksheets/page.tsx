import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllWorksheets } from '@/data/worksheets';
import { categories } from '@/data/categories';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { WorksheetCard } from '@/components/WorksheetCard';
import { AdUnit } from '@/components/AdUnit';
import { siteConfig } from '@/config/site';
import { BookOpen, Layers, Sparkles, Filter } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Free Printable Worksheets Library for Preschool & Kindergarten',
  description:
    'Browse our complete directory of free printable PDF worksheets for preschool, kindergarten, and early ESL classrooms. Phonics, math, logic, and vocabulary sets.',
  alternates: {
    canonical: `${siteConfig.url}/worksheets`,
  },
};

export default function AllWorksheetsPage() {
  const worksheets = getAllWorksheets();

  return (
    <>
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: 'All Worksheets' }]} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        {/* Header */}
        <div className="max-w-3xl mb-10">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#2E6B6B] bg-[#F0F7F7] px-2.5 py-1 rounded mb-3">
            <Layers className="w-3.5 h-3.5" />
            <span>Curriculum Directory</span>
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            Printable Worksheets for Preschool &amp; Kindergarten
          </h1>
          <p className="text-base text-slate-600 leading-relaxed">
            Every worksheet is thoughtfully formatted for standard 8.5×11&quot; US Letter paper, optimized for black &amp; white or full-color printing, and designed to support foundational milestones without overstimulating visual clutter.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 mb-8 pb-4 border-b border-slate-200">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1 mr-2">
            <Filter className="w-3 h-3" />
            <span>Hubs:</span>
          </span>
          <Link
            href="/worksheets"
            className="px-3 py-1.5 rounded-full text-xs font-bold bg-[#2E6B6B] text-white shadow-xs"
          >
            All Resources ({worksheets.length})
          </Link>
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/worksheets/${c.slug}`}
              className="px-3 py-1.5 rounded-full text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:border-[#2E6B6B] hover:text-[#2E6B6B] transition-colors"
            >
              {c.shortTitle}
            </Link>
          ))}
        </div>

        {/* Worksheets Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {worksheets.map((ws) => (
            <WorksheetCard key={ws.slug} worksheet={ws} />
          ))}
        </div>

        <AdUnit slotType="in-content" />
      </div>
    </>
  );
}
