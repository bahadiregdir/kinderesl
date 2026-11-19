import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { months, getMonthBySlug } from '@/data/months';
import { topics } from '@/data/topics';
import {
  getAllWorksheets,
  getWorksheetsByMonth,
} from '@/data/worksheets';
import { isIndexableCollection } from '@/types/worksheet';
import { WorksheetCard } from '@/components/WorksheetCard';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { FAQAccordion } from '@/components/FAQAccordion';
import { AdUnit } from '@/components/AdUnit';
import { getSiteUrl } from '@/config/site';
import { Sparkles, ArrowRight, Clock, Calendar } from 'lucide-react';

interface Props {
  params: Promise<{
    month: string;
  }>;
}

export async function generateStaticParams() {
  return months.map((m) => ({
    month: m.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { month } = await params;
  const m = getMonthBySlug(month);

  if (!m) {
    return { title: 'Month Not Found' };
  }

  const siteUrl = getSiteUrl();
  const pageUrl = `${siteUrl}/preschool-themes/${m.slug}`;
  const monthWorksheets = getWorksheetsByMonth(m.monthNumber);
  const isIndexable = isIndexableCollection(monthWorksheets.length);

  return {
    title: `${m.name} Preschool Themes & Worksheets`,
    description: m.description,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: `${m.name} Preschool Themes`,
      description: m.description,
      url: pageUrl,
      type: 'website',
    },
    robots: isIndexable
      ? { index: true, follow: true }
      : { index: false, follow: true },
  };
}

export default async function MonthDetailPage({ params }: Props) {
  const { month } = await params;
  const m = getMonthBySlug(month);

  if (!m) {
    notFound();
  }

  const worksheets = getWorksheetsByMonth(m.monthNumber);
  const otherWorksheets = getAllWorksheets()
    .filter((w) => !worksheets.some((mw) => mw.id === w.id))
    .slice(0, 4);

  const activeTopics = topics.filter((t) => m.topicSlugs.includes(t.slug));

  return (
    <div>
      <div className="bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: 'Monthly Themes', href: '/preschool-themes' },
              { label: `${m.name} Themes` },
            ]}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14 space-y-12">
        {/* Header */}
        <div className="max-w-3xl space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#F0F7F7] text-[#2E6B6B] border border-[#d0e3e3]">
            <Calendar className="w-3.5 h-3.5 text-[#F2B544]" />
            <span>{m.season} Season Curriculum</span>
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-heading">
            {m.name} Preschool Themes &amp; Printables
          </h1>
          <p className="text-base text-slate-600 leading-relaxed">
            {m.description}
          </p>

          {/* Connected Topics Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="text-xs font-bold text-slate-700">Curriculum topics:</span>
            {activeTopics.map((t) => (
              <Link
                key={t.slug}
                href={`/topics/${t.slug}`}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-[#F0F7F7] hover:text-[#2E6B6B] text-xs font-medium text-slate-700 transition-colors"
              >
                {t.title} →
              </Link>
            ))}
          </div>
        </div>

        {/* Current Available Worksheets */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
            <h2 className="text-xl font-bold text-slate-900 font-heading">
              Available {m.name} Printables ({worksheets.length})
            </h2>
            <span className="text-xs text-slate-500">Free PDF Downloads</span>
          </div>

          {worksheets.length > 0 && (
            <div className={`grid gap-6 ${
              worksheets.length === 1
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-2xl'
                : worksheets.length === 2
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 max-w-3xl'
                : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
            }`}>
              {worksheets.map((ws) => (
                <WorksheetCard key={ws.slug} worksheet={ws} />
              ))}
            </div>
          )}
        </div>

        {/* Sparse Content Fallback (< 6 worksheets): Upcoming Notice & Related Worksheets */}
        {worksheets.length < 6 && (
          <div className="space-y-8 pt-4">
            <div className="p-6 rounded-2xl bg-[#F0F7F7]/60 border border-[#d0e3e3] flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-[#2E6B6B] shrink-0" />
                <p className="text-sm text-slate-700 font-medium">
                  More worksheets for this topic are on the way.
                </p>
              </div>
              <Link
                href="/worksheets"
                className="text-xs font-bold text-[#2E6B6B] hover:underline"
              >
                Browse all subjects →
              </Link>
            </div>

            {otherWorksheets.length > 0 && (
              <div className="space-y-6 pt-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 font-heading">
                      Related Learning Printables
                    </h3>
                    <p className="text-xs text-slate-500">
                      Explore complementary worksheets from neighboring seasonal units:
                    </p>
                  </div>
                  <Link
                    href="/worksheets"
                    className="text-xs font-bold text-[#2E6B6B] hover:underline"
                  >
                    Browse all →
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {otherWorksheets.slice(0, 4).map((ws) => (
                    <WorksheetCard key={ws.slug} worksheet={ws} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Ad Slot above Month FAQs */}
        <AdUnit slotType="in-content" />

        {/* Month FAQs */}
        {m.faqs && m.faqs.length > 0 && (
          <div className="max-w-3xl pt-6">
            <FAQAccordion items={m.faqs} title={`${m.name} Curriculum FAQ`} />
          </div>
        )}
      </div>
    </div>
  );
}
