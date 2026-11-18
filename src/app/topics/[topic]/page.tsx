import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { topics, getTopicBySlug } from '@/data/topics';
import {
  getAllWorksheets,
  getWorksheetsByTopic,
} from '@/data/worksheets';
import { isIndexableCollection } from '@/types/worksheet';
import { WorksheetCard } from '@/components/WorksheetCard';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { FAQAccordion } from '@/components/FAQAccordion';
import { getSiteUrl } from '@/config/site';
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
    return { title: 'Topic Not Found' };
  }

  const siteUrl = getSiteUrl();
  const pageUrl = `${siteUrl}/topics/${t.slug}`;
  const topicWorksheets = getWorksheetsByTopic(t.slug);
  const isIndexable = isIndexableCollection(topicWorksheets.length);

  return {
    title: `${t.title} Worksheets for Preschool & Kindergarten | KinderESL`,
    description: t.description,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: `${t.title} Worksheets`,
      description: t.description,
      url: pageUrl,
      type: 'website',
    },
    robots: isIndexable
      ? { index: true, follow: true }
      : { index: false, follow: true },
  };
}

export default async function TopicDetailPage({ params }: Props) {
  const { topic } = await params;
  const t = getTopicBySlug(topic);

  if (!t) {
    notFound();
  }

  const worksheets = getWorksheetsByTopic(t.slug);
  const otherWorksheets = getAllWorksheets()
    .filter((w) => !w.topics.includes(t.slug))
    .slice(0, 2);

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
            <span>Preschool &amp; Kindergarten Topic</span>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {worksheets.map((ws) => (
                <WorksheetCard key={ws.slug} worksheet={ws} />
              ))}
            </div>
          )}
        </div>

        {/* Sparse Content Fallback (< 6 worksheets): Planned Titles & Related Worksheets */}
        {worksheets.length < 6 && (
          <div className="space-y-8 pt-4">
            <div className="p-6 sm:p-8 rounded-2xl bg-[#F0F7F7]/60 border border-[#d0e3e3] space-y-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#2E6B6B]" />
                <h3 className="text-base font-bold text-slate-900 font-heading">
                  Coming next in this topic
                </h3>
              </div>
              <p className="text-xs text-slate-600">
                Our teaching team is illustrating the next set of activities for this topic:
              </p>
              <ul className="space-y-2 text-xs text-slate-700 font-medium">
                {t.plannedTitles.map((planned, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-slate-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2E6B6B]" />
                    <span>{planned}</span>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">
                      (In Development)
                    </span>
                  </li>
                ))}
              </ul>
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
                  {otherWorksheets.map((ws) => (
                    <WorksheetCard key={ws.slug} worksheet={ws} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

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
