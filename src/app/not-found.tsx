import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllWorksheets } from '@/data/worksheets';
import { WorksheetCard } from '@/components/WorksheetCard';
import { Search, Compass, ArrowRight, Home } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Page not found',
  description:
    'The page or printable worksheet you are looking for could not be found on KinderESL.',
  openGraph: {
    title: 'Page not found | KinderESL',
    description:
      'The page or printable worksheet you are looking for could not be found on KinderESL.',
    type: 'website',
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  const popularWorksheets = getAllWorksheets().slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <div className="max-w-2xl mx-auto text-center space-y-4 mb-12">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#F0F7F7] text-[#2E6B6B] border border-[#d0e3e3]">
          404 Error
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Page Not Found
        </h1>
        <p className="text-base text-slate-600">
          We couldn’t find the page or printable you were looking for. Try searching for a skill, theme, or letter, or browse our popular printables below.
        </p>

        {/* Search bar */}
        <form action="/worksheets" method="GET" className="pt-2 max-w-lg mx-auto">
          <div className="relative flex items-center">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
            <input
              type="text"
              name="q"
              placeholder="Search worksheets (e.g., Letter A, counting, animals)..."
              className="w-full pl-11 pr-24 py-3 text-sm bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#2E6B6B] focus:border-[#2E6B6B] shadow-xs"
            />
            <button
              type="submit"
              className="absolute right-2 px-4 py-1.5 text-xs font-bold bg-[#2E6B6B] hover:bg-[#225151] text-white rounded-lg transition-colors"
            >
              Search
            </button>
          </div>
        </form>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Return to Homepage</span>
          </Link>
          <Link
            href="/worksheets"
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-[#2E6B6B] hover:bg-[#225151] rounded-lg transition-colors"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Browse All Worksheets</span>
          </Link>
        </div>
      </div>

      {/* Popular worksheets */}
      <div className="border-t border-slate-200 pt-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Popular Free Worksheets
            </h2>
            <p className="text-xs text-slate-600">
              Hand-picked preschool and kindergarten printables ready to download.
            </p>
          </div>
          <Link
            href="/worksheets"
            className="text-xs font-bold text-[#2E6B6B] hover:underline inline-flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularWorksheets.map((ws) => (
            <WorksheetCard key={ws.slug} worksheet={ws} />
          ))}
        </div>
      </div>
    </div>
  );
}
