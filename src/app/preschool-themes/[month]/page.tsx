import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { months, getMonthBySlug } from '@/data/months';
import { topics } from '@/data/topics';
import {
  fetchAllWorksheets,
  fetchWorksheetsByMonth,
} from '@/lib/worksheets-store';
import { isIndexableCollection } from '@/types/worksheet';
import { WorksheetCard } from '@/components/WorksheetCard';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { FAQAccordion } from '@/components/FAQAccordion';
import { AdUnit } from '@/components/AdUnit';
import { getSiteUrl } from '@/config/site';
import { TOOL_COUNT } from '@/data/tools';
import { DEFAULT_OG_IMAGE, buildSeoDescription, buildSeoTitle } from '@/lib/seo-meta';
import { Sparkles, ArrowRight, Clock, Calendar, Wand2 } from 'lucide-react';
import { getRelatedToolsForMonth } from '@/lib/related-tools';

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
    return { title: 'Page not found', robots: { index: false, follow: true } };
  }

  const siteUrl = getSiteUrl();
  const pageUrl = `${siteUrl}/preschool-themes/${m.slug}`;
  const monthWorksheets = await fetchWorksheetsByMonth(m.monthNumber);
  const isIndexable = isIndexableCollection(monthWorksheets.length);
  const seoTitle = buildSeoTitle(`${m.name} Preschool Themes & Worksheets`);
  const seoDescription = buildSeoDescription(m.description);

  return {
    title: seoTitle,
    description: seoDescription,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      url: pageUrl,
      type: 'website',
      images: [DEFAULT_OG_IMAGE],
    },
    twitter: {
      card: 'summary_large_image',
      title: seoTitle,
      description: seoDescription,
      images: [DEFAULT_OG_IMAGE.url],
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

  const worksheets = await fetchWorksheetsByMonth(m.monthNumber);
  const allWorksheets = await fetchAllWorksheets();
  const otherWorksheets = allWorksheets
    .filter((w) => !worksheets.some((mw) => mw.id === w.id))
    .slice(0, 4);

  const activeTopics = topics.filter((t) => m.topicSlugs.includes(t.slug));
  const monthTools = getRelatedToolsForMonth(m.slug);

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

        {/* Seasonal PDF Maker Tools */}
        <section className="p-6 rounded-2xl bg-[#F0F7F7] border border-[#d0e3e3] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="space-y-0.5">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#2E6B6B]">
                <Wand2 className="w-3.5 h-3.5 text-[#F2B544]" />
                <span>Seasonal PDF Makers</span>
              </span>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 font-heading">
                Create Custom {m.name} PDFs Free
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Build custom {m.name.toLowerCase()} flashcards, bingo boards, I Spy sheets, and phonics cards in US Letter or A4.
              </p>
            </div>
            <Link
              href="/tools"
              className="inline-flex items-center gap-1 text-xs font-bold text-[#2E6B6B] hover:underline shrink-0"
            >
              <span>All {TOOL_COUNT} PDF Makers</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {monthTools.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="group p-4 rounded-xl bg-white border border-[#d0e3e3] hover:border-[#2E6B6B] hover:shadow-sm transition-all flex flex-col justify-between gap-3"
              >
                <div className="space-y-1.5">
                  <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#F0F7F7] text-[#2E6B6B]">
                    {tool.badge}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#2E6B6B] transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {tool.subtitle}
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-[#2E6B6B]">
                  <span>Open Tool</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </Link>
            ))}
          </div>
        </section>

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
