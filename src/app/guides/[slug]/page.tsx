import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { guides, getGuideBySlug } from '@/data/guides';
import { fetchAllWorksheets, fetchSiteSettings } from '@/lib/worksheets-store';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { WorksheetCard } from '@/components/WorksheetCard';
import { AuthorBox } from '@/components/AuthorBox';
import { FAQAccordion } from '@/components/FAQAccordion';
import { NewsletterBox } from '@/components/NewsletterBox';
import { AdUnit } from '@/components/AdUnit';
import { getSiteUrl, siteConfig, toAbsoluteAssetUrl } from '@/config/site';
import { TOOL_COUNT } from '@/data/tools';
import { DEFAULT_OG_IMAGE, buildSeoDescription, buildSeoTitle } from '@/lib/seo-meta';
import { Clock, BookOpen, CheckCircle2, Sparkles, ArrowLeft, ArrowRight, Wand2 } from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return guides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);

  if (!guide) {
    return { title: 'Page not found', robots: { index: false, follow: true } };
  }

  const siteUrl = getSiteUrl();
  const pageUrl = `${siteUrl}/guides/${guide.slug}`;
  const seoTitle = buildSeoTitle(guide.seoTitle || guide.title);
  const seoDescription = buildSeoDescription(guide.description);

  return {
    title: seoTitle,
    description: seoDescription,
    alternates: { canonical: pageUrl },
    openGraph: {
      title: guide.title,
      description: seoDescription,
      url: pageUrl,
      type: 'article',
      publishedTime: `${guide.datePublished}T00:00:00.000Z`,
      modifiedTime: `${guide.dateModified}T00:00:00.000Z`,
      images: [DEFAULT_OG_IMAGE],
    },
    twitter: {
      card: 'summary_large_image',
      title: guide.title,
      description: seoDescription,
      images: [DEFAULT_OG_IMAGE.url],
    },
    robots: { index: true, follow: true },
  };
}

export default async function GuideDetailPage({ params }: Props) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) notFound();

  const [allWorksheets, settings] = await Promise.all([
    fetchAllWorksheets(),
    fetchSiteSettings(),
  ]);

  const worksheetMap = new Map(allWorksheets.map((w) => [w.slug, w]));
  const relatedWorksheets = guide.relatedWorksheetSlugs
    .map((s) => worksheetMap.get(s))
    .filter((w): w is (typeof allWorksheets)[number] => Boolean(w));

  const siteUrl = getSiteUrl();
  const pageUrl = `${siteUrl}/guides/${guide.slug}`;
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guide.title,
    description: guide.description,
    datePublished: `${guide.datePublished}T00:00:00.000Z`,
    dateModified: `${guide.dateModified}T00:00:00.000Z`,
    author: {
      '@type': 'Person',
      name: settings.author.name || siteConfig.author.name,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.legalName,
      logo: {
        '@type': 'ImageObject',
        url: toAbsoluteAssetUrl(DEFAULT_OG_IMAGE.url, siteUrl),
      },
    },
    image: toAbsoluteAssetUrl(DEFAULT_OG_IMAGE.url, siteUrl),
    mainEntityOfPage: pageUrl,
    inLanguage: 'en-US',
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <div className="bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: 'Teaching Guides', href: '/guides' },
              { label: guide.category },
            ]}
          />
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14 space-y-10">
        <header className="space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-bold bg-[#F0F7F7] text-[#2E6B6B] border border-[#d0e3e3]">
              <Sparkles className="w-3.5 h-3.5 text-[#F2B544]" />
              <span>{guide.category}</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-medium">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>{guide.readingTime}</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-medium">
              <BookOpen className="w-3.5 h-3.5 text-slate-500" />
              <span>{guide.targetAges}</span>
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-heading leading-tight">
            {guide.title}
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed border-l-4 border-[#2E6B6B] pl-4 py-1 bg-[#F0F7F7]/50 rounded-r-lg">
            {guide.intro}
          </p>
        </header>

        {/* Guide Sections */}
        <div className="space-y-8">
          {guide.sections.map((section, idx) => (
            <section key={idx} className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading">
                {section.heading}
              </h2>
              {section.paragraphs.map((para, pIdx) => (
                <p key={pIdx} className="text-sm sm:text-base text-slate-700 leading-relaxed">
                  {para}
                </p>
              ))}
              {section.bullets && section.bullets.length > 0 && (
                <ul className="space-y-2 pt-1 pl-1">
                  {section.bullets.map((b, bIdx) => (
                    <li
                      key={bIdx}
                      className="flex items-start gap-2.5 text-sm text-slate-700"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#2E6B6B] shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        {/* Classroom Checklist */}
        <section className="p-6 rounded-2xl bg-[#F0F7F7] border border-[#d0e3e3] space-y-3">
          <h2 className="text-lg font-bold text-slate-900 font-heading">
            Quick Classroom Checklist
          </h2>
          <ul className="space-y-2">
            {guide.classroomChecklist.map((item, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2.5 text-sm text-slate-800"
              >
                <CheckCircle2 className="w-4 h-4 text-[#2E6B6B] shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Companion Free PDF Tools */}
        {guide.relatedTools && guide.relatedTools.length > 0 && (
          <section className="p-6 rounded-2xl bg-[#F0F7F7] border border-[#d0e3e3] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="space-y-0.5">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#2E6B6B]">
                  <Wand2 className="w-3.5 h-3.5 text-[#F2B544]" />
                  <span>Companion Free PDF Tools</span>
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 font-heading">
                  Companion Free PDF Tools for This Guide
                </h2>
                <p className="text-xs text-slate-600">
                  Generate custom classroom PDFs in US Letter or A4—pre-loaded with matching themes.
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

            <div
              className={`grid grid-cols-1 gap-3 ${
                guide.relatedTools.length === 3
                  ? 'sm:grid-cols-3'
                  : 'sm:grid-cols-2'
              }`}
            >
              {guide.relatedTools.map((tool) => (
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
        )}

        <AdUnit slotType="in-content" />

        {/* Companion Free Printables */}
        {relatedWorksheets.length > 0 && (
          <section className="space-y-5 pt-2">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h2 className="text-xl font-bold text-slate-900 font-heading">
                  Free Printables Used in This Guide
                </h2>
                <p className="text-xs text-slate-500">
                  Download any companion worksheet below in US Letter or A4 PDF format.
                </p>
              </div>
              <Link
                href="/worksheets"
                className="text-xs font-bold text-[#2E6B6B] hover:underline"
              >
                Browse all →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {relatedWorksheets.map((ws) => (
                <WorksheetCard key={ws.slug} worksheet={ws} />
              ))}
            </div>
          </section>
        )}

        <AuthorBox isCompact={false} author={settings.author} />

        {guide.faqs.length > 0 && (
          <FAQAccordion items={guide.faqs} title="Educator FAQ" />
        )}

        <NewsletterBox source={`guide-${guide.slug}`} />

        <div className="pt-4 border-t border-slate-200">
          <Link
            href="/guides"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#2E6B6B] hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to all teaching guides</span>
          </Link>
        </div>
      </article>
    </div>
  );
}
