import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { topics, getTopicBySlug } from '@/data/topics';
import {
  fetchAllWorksheets,
  fetchWorksheetsByTopic,
} from '@/lib/worksheets-store';
import { isIndexableCollection } from '@/types/worksheet';
import { WorksheetCard } from '@/components/WorksheetCard';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { FAQAccordion } from '@/components/FAQAccordion';
import { AdUnit } from '@/components/AdUnit';
import { getSiteUrl } from '@/config/site';
import { TOOL_COUNT } from '@/data/tools';
import { DEFAULT_OG_IMAGE, buildSeoDescription, buildSeoTitle } from '@/lib/seo-meta';
import { Sparkles, ArrowRight, Clock, BookOpen } from 'lucide-react';

interface Props {
  params: Promise<{
    topic: string;
  }>;
}

export async function generateStaticParams() {
  return topics.map((t) => ({
    topic: t.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { topic } = await params;
  const t = getTopicBySlug(topic);

  if (!t) {
    return { title: 'Page not found', robots: { index: false, follow: true } };
  }

  const siteUrl = getSiteUrl();
  const pageUrl = `${siteUrl}/topics/${t.slug}`;
  const topicWorksheets = await fetchWorksheetsByTopic(t.slug);
  const isIndexable = isIndexableCollection(topicWorksheets.length);
  const seoTitle = buildSeoTitle(`${t.title} Preschool Worksheets`);
  const seoDescription = buildSeoDescription(t.description);

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

const TOPIC_TO_TOOL_THEME: Record<string, string> = {
  'farm-animals': 'farm',
  winter: 'winter',
  insects: 'animals',
  food: 'food',
  body: 'body',
  clothes: 'clothes',
  weather: 'weather',
  transportation: 'transport',
  fall: 'fall',
  spring: 'spring',
  summer: 'summer',
  family: 'routines',
  halloween: 'halloween',
  valentines: 'valentines',
  christmas: 'christmas',
  nature: 'nature',
};

export default async function TopicDetailPage({ params }: Props) {
  const { topic } = await params;
  const t = getTopicBySlug(topic);

  if (!t) {
    notFound();
  }

  const worksheets = await fetchWorksheetsByTopic(t.slug);
  const allWorksheets = await fetchAllWorksheets();
  const otherWorksheets = allWorksheets
    .filter((w) => !w.topics.includes(t.slug))
    .slice(0, 4);

  const presetTheme = TOPIC_TO_TOOL_THEME[t.slug];
  const themeQuery = presetTheme ? `?theme=${presetTheme}` : '';

  return (
    <div>
      <div className="bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: 'Topics', href: '/topics' },
              { label: t.title },
            ]}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14 space-y-12">
        {/* Header */}
        <div className="max-w-3xl space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#F0F7F7] text-[#2E6B6B] border border-[#d0e3e3]">
            <Sparkles className="w-3.5 h-3.5 text-[#F2B544]" />
            <span>Preschool & Kindergarten Topic</span>
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-heading">
            {t.title} Worksheets
          </h1>
          <p className="text-base text-slate-600 leading-relaxed">
            {t.description}
          </p>
        </div>

        {/* Current Available Worksheets */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
            <h2 className="text-xl font-bold text-slate-900 font-heading">
              Available {t.title} Printables ({worksheets.length})
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
                      Explore companion worksheets from related preschool themes:
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

        {/* Contextual Teacher Tools Strip */}
        <div className="p-6 rounded-2xl bg-[#F0F7F7] border border-[#d0e3e3] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900 font-heading">
                Create Custom {t.title} PDFs Free
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Build personalized {t.title.toLowerCase()} flashcards, bingo boards, I Spy sheets, or matching activities in seconds.
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
          <div className="flex flex-wrap gap-2">
            {[
              { href: `/tools/flashcard-maker${themeQuery}`, label: 'Picture Flashcards' },
              { href: `/tools/bingo-maker${themeQuery}`, label: 'Picture Bingo' },
              { href: `/tools/i-spy-maker${themeQuery}`, label: 'I Spy & Count' },
              { href: `/tools/matching-maker${themeQuery}`, label: 'Picture Matching' },
              { href: `/tools/word-search-maker${themeQuery}`, label: 'Word Search' },
              { href: `/tools/clip-cards-maker${themeQuery}`, label: 'Clip Cards' },
              { href: `/tools/pattern-maker${themeQuery}`, label: 'Patterns' },
              { href: `/tools/mini-book-maker${themeQuery}`, label: 'Mini-Book' },
              { href: `/tools/domino-maker${themeQuery}`, label: 'Dominoes' },
            ].map((toolLink) => (
              <Link
                key={toolLink.href}
                href={toolLink.href}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-[#2E6B6B] text-[#2E6B6B] hover:text-white border border-[#d0e3e3] text-xs font-bold transition-colors shadow-2xs"
              >
                <span>{toolLink.label}</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            ))}
          </div>
        </div>

        {/* Ad Slot above Topic FAQ */}
        <AdUnit slotType="in-content" />

        {/* Topic FAQ */}
        {t.faqs && t.faqs.length > 0 && (
          <div className="max-w-3xl pt-6">
            <FAQAccordion items={t.faqs} title={`${t.title} Learning FAQ`} />
          </div>
        )}
      </div>
    </div>
  );
}
