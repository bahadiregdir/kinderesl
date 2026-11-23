import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getSiteUrl, siteConfig } from '@/config/site';
import { DEFAULT_OG_IMAGE } from '@/lib/seo-meta';
import { fetchAllWorksheets, fetchSiteSettings } from '@/lib/worksheets-store';
import { subjects } from '@/data/subjects';
import { topics } from '@/data/topics';
import { months } from '@/data/months';
import { WorksheetCard } from '@/components/WorksheetCard';
import { AuthorBox } from '@/components/AuthorBox';
import { FAQAccordion } from '@/components/FAQAccordion';
import { NewsletterBox } from '@/components/NewsletterBox';
import { AdUnit } from '@/components/AdUnit';

const siteUrl = getSiteUrl();
const homeTitle = `${siteConfig.name} – Free Printable Preschool & ESL Worksheets`;

export const metadata: Metadata = {
  title: {
    absolute: homeTitle,
  },
  description: siteConfig.description,
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: siteConfig.name,
    title: homeTitle,
    description: siteConfig.description,
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: homeTitle,
    description: siteConfig.description,
    images: [DEFAULT_OG_IMAGE.url],
  },
};
import {
  BookOpen,
  Calculator,
  Brain,
  Languages,
  Shapes,
  Sparkles,
  ArrowRight,
  Search,
  CheckCircle2,
  Calendar,
  Layers,
  FileDown,
} from 'lucide-react';

export default async function HomePage() {
  const [worksheets, settings] = await Promise.all([
    fetchAllWorksheets(),
    fetchSiteSettings(),
  ]);
  const showcaseSlugs = [
    'letter-tracing-worksheets-a-to-z',
    'beginning-sounds-clip-cards',
    'counting-1-to-5-ladybug-party',
    'colors-esl-flashcards-preschool',
    'body-parts-flashcards-and-song',
    'visual-schedule-cards-preschool',
    'winter-odd-one-out-visual-discrimination',
    'farm-animals-esl-vocabulary-and-tracing',
  ];
  const bySlug = new Map(worksheets.map((w) => [w.slug, w]));
  const picked = showcaseSlugs
    .map((slug) => bySlug.get(slug))
    .filter((w): w is (typeof worksheets)[number] => Boolean(w));
  const pickedSet = new Set(picked.map((w) => w.slug));
  const featuredWorksheets = [
    ...picked,
    ...worksheets.filter((w) => !pickedSet.has(w.slug)),
  ].slice(0, 8);
  const popularTopics = topics.slice(0, 6);

  const getSubjectIcon = (slug: string) => {
    switch (slug) {
      case 'alphabet':
        return <BookOpen className="w-5 h-5 text-[#2E6B6B]" />;
      case 'phonics':
        return <Languages className="w-5 h-5 text-[#2E6B6B]" />;
      case 'numbers-counting':
        return <Calculator className="w-5 h-5 text-[#2E6B6B]" />;
      case 'shapes-colors':
        return <Shapes className="w-5 h-5 text-[#2E6B6B]" />;
      case 'vocabulary':
        return <Languages className="w-5 h-5 text-[#2E6B6B]" />;
      case 'thinking-skills':
        return <Brain className="w-5 h-5 text-[#2E6B6B]" />;
      default:
        return <Layers className="w-5 h-5 text-[#2E6B6B]" />;
    }
  };

  const homeFaqs = [
    {
      question: 'Are all printable worksheets on KinderESL completely free?',
      answer:
        'Yes, 100% free. Every printable PDF can be downloaded directly without membership fees, email opt-ins, or subscriptions. They are licensed for personal home and school classroom instructional use.',
    },
    {
      question: 'What format are the worksheets provided in?',
      answer:
        'Every worksheet is available as a one-click download in both US Letter (8.5×11") and ISO A4 (210×297mm) PDF formats. High-contrast black line art ensures crisp results on standard black-and-white classroom copy machines.',
    },
    {
      question: 'How do these printables support ESL / ELL students?',
      answer:
        'Visual anchors, clear illustrations, animal sound associations, and simple sentence frames help early English learners build vocabulary and phonetic confidence in low-anxiety contexts.',
    },
    {
      question: 'Can I print these worksheets for all the students in my classroom?',
      answer:
        'Yes. You are fully permitted to print as many copies as needed for your classroom students, tutoring sessions, or homeschooling children.',
    },
  ];

  return (
    <div className="space-y-16 lg:space-y-24">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#F0F7F7] via-[#F8FAFC] to-white border-b border-slate-200/80 pt-12 pb-16 lg:pt-16 lg:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content Column (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-white text-[#2E6B6B] border border-[#d0e3e3] shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-[#F2B544]" />
                <span>Free Printables for Teachers &amp; Parents</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight font-heading">
                Printable Worksheets for{' '}
                <span className="text-[#2E6B6B]">Early Learners</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl font-normal">
                High-contrast, stroke-guided PDF printables designed for preschool, kindergarten, and early ESL classrooms. Always 100% free with no sign-up or paywalls.
              </p>

              {/* Search Box */}
              <form action="/worksheets" method="GET" className="max-w-lg">
                <div className="relative flex items-center">
                  <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
                  <input
                    type="text"
                    name="q"
                    placeholder="Search by letter, skill, or theme (e.g. Letter A, counting 1-5, farm animals)..."
                    className="w-full pl-11 pr-28 py-3.5 text-sm bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#2E6B6B] focus:border-[#2E6B6B] shadow-xs text-slate-800"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 px-4 py-2 text-xs font-bold bg-[#2E6B6B] hover:bg-[#225151] text-white rounded-lg transition-colors shadow-xs"
                  >
                    Search
                  </button>
                </div>
              </form>

              {/* Direct Link Button */}
              <div className="flex flex-wrap items-center gap-4 pt-1">
                <Link
                  href="/worksheets"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#2E6B6B] hover:bg-[#225151] text-white font-bold text-sm shadow-sm transition-all"
                >
                  <FileDown className="w-4 h-4" />
                  <span>Browse worksheets</span>
                </Link>
                <Link
                  href="/topics"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm border border-slate-200 shadow-2xs transition-colors"
                >
                  <span>Explore topics</span>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </Link>
              </div>

              {/* Key Trust Signals */}
              <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-500 font-medium pt-2">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>100% Free PDF downloads</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>US Letter &amp; A4 PDFs</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>No login or account needed</span>
                </span>
              </div>
            </div>

            {/* Right Collage Column (5 cols) - 3 tilted printable paper preview sheets */}
            <div className="lg:col-span-5 relative flex items-center justify-center pt-6 lg:pt-0">
              <div className="relative w-[300px] sm:w-[360px] h-[400px] sm:h-[460px]">
                {/* Sheet 1 (back left, rotated -6deg) */}
                <div className="absolute top-4 left-0 w-[210px] sm:w-[250px] aspect-[1224/1584] rounded-xl overflow-hidden shadow-lg border border-slate-200/90 -rotate-6 transition-transform hover:rotate-0 duration-300 bg-white">
                  <Image
                    src="/worksheets/counting-1-to-5-ladybug-party/preview-page-1.png"
                    alt="Counting 1 to 5 Lily Ladybug worksheet preview"
                    fill
                    sizes="(max-width: 640px) 210px, 250px"
                    className="object-contain p-2"
                    priority
                  />
                </div>

                {/* Sheet 2 (back right, rotated +5deg) */}
                <div className="absolute top-6 right-0 w-[210px] sm:w-[250px] aspect-[1224/1584] rounded-xl overflow-hidden shadow-lg border border-slate-200/90 rotate-6 transition-transform hover:rotate-0 duration-300 bg-white">
                  <Image
                    src="/worksheets/farm-animals-esl-vocabulary-and-tracing/preview-page-1.png"
                    alt="Farm animals match and cut-paste worksheet preview"
                    fill
                    sizes="(max-width: 640px) 210px, 250px"
                    className="object-contain p-2"
                    priority
                  />
                </div>

                {/* Sheet 3 (front center, subtle shadow-2xl, centered) */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[220px] sm:w-[260px] aspect-[1224/1584] rounded-xl overflow-hidden shadow-2xl border-2 border-slate-300/80 bg-white z-10 transition-transform hover:scale-105 duration-300">
                  <Image
                    src="/worksheets/letter-a-tracing-and-phonics/preview-page-1.png"
                    alt="Letter A Andy the Ant tracing worksheet preview"
                    fill
                    sizes="(max-width: 640px) 220px, 260px"
                    className="object-contain p-2"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Popular Subjects Horizontal Strip */}
          <div className="mt-14 pt-8 border-t border-slate-200/70">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-700 font-heading">
                Popular subjects:
              </span>
              <Link
                href="/worksheets"
                className="text-xs font-semibold text-[#2E6B6B] hover:underline"
              >
                All subjects →
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {subjects.map((s) => (
                <Link
                  key={s.slug}
                  href={`/worksheets/${s.slug}`}
                  className="group flex items-center gap-2.5 p-3 rounded-xl bg-white border border-slate-200/90 hover:border-[#2E6B6B] hover:shadow-xs transition-all"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#F0F7F7] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    {getSubjectIcon(s.slug)}
                  </div>
                  <span className="text-xs font-bold text-slate-800 group-hover:text-[#2E6B6B] transition-colors truncate">
                    {s.shortTitle}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Browse by Subject Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-heading">
              Browse by subject
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Foundational learning areas designed for preschool, kindergarten, and ESL instruction.
            </p>
          </div>
          <Link
            href="/worksheets"
            className="text-xs font-bold text-[#2E6B6B] hover:underline inline-flex items-center gap-1"
          >
            <span>View all subjects</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((sub) => (
            <Link
              key={sub.slug}
              href={`/worksheets/${sub.slug}`}
              className="group p-6 rounded-2xl border border-slate-200/90 hover:border-[#2E6B6B] hover:shadow-md transition-all bg-white flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#F0F7F7] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  {getSubjectIcon(sub.slug)}
                </div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#2E6B6B] transition-colors mb-2 font-heading">
                  {sub.shortTitle}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {sub.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>{sub.targetAges}</span>
                <span className="text-[#2E6B6B] font-bold group-hover:translate-x-0.5 transition-transform">
                  Explore →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Worksheets Grid */}
      <section className="bg-slate-50 border-y border-slate-200/80 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-heading">
                Featured Worksheets
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Ready-to-print resources available in both US Letter &amp; A4 formats for crisp classroom printing worldwide.
              </p>
            </div>
            <Link
              href="/worksheets"
              className="text-xs font-bold text-[#2E6B6B] hover:underline inline-flex items-center gap-1"
            >
              <span>See full catalog</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredWorksheets.map((ws) => (
              <WorksheetCard key={ws.slug} worksheet={ws} />
            ))}
          </div>
        </div>
      </section>

      {/* Isolated AdSlot Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdUnit slotType="in-content" />
      </div>

      {/* Monthly Themes Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-heading">
              Monthly Themes
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Seasonal themes and vocabulary collections organized for preschool calendar units.
            </p>
          </div>
          <Link
            href="/preschool-themes"
            className="text-xs font-bold text-[#2E6B6B] hover:underline inline-flex items-center gap-1"
          >
            <span>View 12-month calendar</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 12 Months Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          {months.map((m) => (
            <Link
              key={m.slug}
              href={`/preschool-themes/${m.slug}`}
              className="p-3.5 rounded-xl border border-slate-200/80 hover:border-[#2E6B6B] hover:bg-[#F0F7F7]/50 bg-white transition-all text-center group"
            >
              <div className="text-[11px] font-bold text-[#2E6B6B] uppercase tracking-wider mb-0.5">
                {m.season}
              </div>
              <div className="text-sm font-bold text-slate-900 group-hover:text-[#2E6B6B] font-heading">
                {m.name}
              </div>
            </Link>
          ))}
        </div>

        {/* Popular Topics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {popularTopics.map((t) => (
            <Link
              key={t.slug}
              href={`/topics/${t.slug}`}
              className="group p-5 rounded-xl border border-slate-200 hover:border-[#2E6B6B] hover:shadow-sm transition-all bg-white flex flex-col justify-between"
            >
              <div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-[#2E6B6B] transition-colors mb-1.5 font-heading">
                  {t.title}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {t.description}
                </p>
              </div>
              <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs text-[#2E6B6B] font-bold">
                <span>View Printables</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Author & Mission Section */}
      <section className="bg-slate-50 border-t border-slate-200/80 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-heading">
              Created by Educators for Early Learners
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-xl mx-auto">
              KinderESL printables are crafted with high-contrast lines, directional stroke guides, and clear pictorial anchors for preschool and ESL classrooms.
            </p>
          </div>

          <AuthorBox isCompact={false} author={settings.author} />
        </div>
      </section>

      {/* Weekly Theme Pack Lead Magnet */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <NewsletterBox source="homepage" />
      </section>

      {/* Educator FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <FAQAccordion items={homeFaqs} title="Preschool & Kindergarten Curriculum FAQ" />
      </section>
    </div>
  );
}
