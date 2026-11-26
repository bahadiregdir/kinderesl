import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { guides } from '@/data/guides';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { NewsletterBox } from '@/components/NewsletterBox';
import { getSiteUrl } from '@/config/site';
import { DEFAULT_OG_IMAGE, buildSeoDescription, buildSeoTitle } from '@/lib/seo-meta';
import { BookOpen, Clock, ArrowRight, Sparkles } from 'lucide-react';

const siteUrl = getSiteUrl();
const pageUrl = `${siteUrl}/guides`;
const pageTitle = buildSeoTitle('Preschool & ESL Teaching Guides');
const pageDescription = buildSeoDescription(
  'Practical classroom guides for preschool and ESL teachers covering alphabet tracing, Dolch sight words, CVC phonics, name writing, ten-frame counting, circle time games, and seasonal plans.'
);

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: { canonical: pageUrl },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: pageUrl,
    type: 'website',
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: pageTitle,
    description: pageDescription,
    images: [DEFAULT_OG_IMAGE.url],
  },
};

export default function GuidesIndexPage() {
  return (
    <div>
      <div className="bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: 'Teaching Guides' }]} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14 space-y-10">
        <div className="max-w-3xl space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#F0F7F7] text-[#2E6B6B] border border-[#d0e3e3]">
            <Sparkles className="w-3.5 h-3.5 text-[#F2B544]" />
            <span>Classroom Playbooks &amp; Pacing Guides</span>
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-heading">
            Preschool &amp; ESL Teaching Guides
          </h1>
          <p className="text-base text-slate-600 leading-relaxed">
            Practical, step-by-step routines showing teachers and homeschooling parents how to pair oral repetition, movement, and printable PDF worksheets in real classrooms.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {guides.map((guide) => (
            <Link
              key={guide.slug}
              href={`/guides/${guide.slug}`}
              className="group p-6 rounded-2xl border border-slate-200/80 hover:border-[#2E6B6B] hover:shadow-md transition-all bg-white flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="font-bold uppercase tracking-wider text-[#2E6B6B] bg-[#F0F7F7] px-2.5 py-0.5 rounded-full border border-[#d0e3e3]">
                    {guide.category}
                  </span>
                  <span className="inline-flex items-center gap-1 text-slate-500 font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{guide.readingTime}</span>
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-[#2E6B6B] transition-colors font-heading">
                  {guide.title}
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {guide.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#2E6B6B]">
                <span className="inline-flex items-center gap-1.5 text-slate-500 font-medium">
                  <BookOpen className="w-3.5 h-3.5 text-[#2E6B6B]" />
                  <span>
                    {guide.targetAges} · {guide.relatedTools.length} free tools ·{' '}
                    {guide.relatedWorksheetSlugs.length} printables
                  </span>
                </span>
                <span className="inline-flex items-center gap-1">
                  <span>Read guide</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        <NewsletterBox source="guides-index" />
      </div>
    </div>
  );
}
