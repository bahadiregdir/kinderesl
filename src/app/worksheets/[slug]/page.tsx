import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  fetchAllWorksheets,
  fetchWorksheetBySlug,
  fetchWorksheetsBySubject,
  fetchRelatedWorksheets,
} from '@/lib/worksheets-store';
import { subjects, getSubjectBySlug } from '@/data/subjects';
import { isIndexableCollection } from '@/types/worksheet';
import { WorksheetDetailView } from '@/components/WorksheetDetailView';
import { WorksheetCard } from '@/components/WorksheetCard';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { FAQAccordion } from '@/components/FAQAccordion';
import { AdUnit } from '@/components/AdUnit';
import { getSiteUrl, toAbsoluteAssetUrl } from '@/config/site';
import {
  BookOpen,
  Sparkles,
  ArrowRight,
  Layers,
  Clock,
  Compass,
} from 'lucide-react';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const subjectParams = subjects.map((s) => ({ slug: s.slug }));
  const allWorksheets = await fetchAllWorksheets();
  const worksheetParams = allWorksheets.map((w) => ({ slug: w.slug }));
  return [...subjectParams, ...worksheetParams];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const siteUrl = getSiteUrl();

  // 1. Is it a Subject?
  const subject = getSubjectBySlug(slug);
  if (subject) {
    const subjectWorksheets = await fetchWorksheetsBySubject(subject.slug);
    const isIndexable = isIndexableCollection(subjectWorksheets.length);
    const pageUrl = `${siteUrl}/worksheets/${subject.slug}`;
    return {
      title: subject.title,
      description: subject.description,
      alternates: {
        canonical: pageUrl,
      },
      openGraph: {
        title: `${subject.title} | Free Preschool Worksheets`,
        description: subject.description,
        url: pageUrl,
        type: 'website',
      },
      robots: isIndexable
        ? { index: true, follow: true }
        : { index: false, follow: true },
    };
  }

  // 2. Is it a Worksheet?
  const worksheet = await fetchWorksheetBySlug(slug);
  if (worksheet) {
    const pageUrl = `${siteUrl}/worksheets/${worksheet.slug}`;
    const previewImgUrl = toAbsoluteAssetUrl(worksheet.previewImages[0], siteUrl);

    return {
      title: `${worksheet.title} | Free Printable PDF`,
      description: worksheet.description,
      alternates: {
        canonical: pageUrl,
      },
      openGraph: {
        title: worksheet.title,
        description: worksheet.description,
        url: pageUrl,
        type: 'article',
        publishedTime: `${worksheet.datePublished}T00:00:00.000Z`,
        modifiedTime: `${worksheet.dateModified}T00:00:00.000Z`,
        images: [
          {
            url: previewImgUrl,
            width: 1224,
            height: 1584,
            alt: `${worksheet.title} Printable PDF Preview`,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: worksheet.title,
        description: worksheet.description,
        images: [previewImgUrl],
      },
      robots: {
        index: true,
        follow: true,
      },
    };
  }

  return {
    title: 'Worksheet Not Found',
  };
}

export default async function WorksheetOrSubjectPage({ params }: PageProps) {
  const { slug } = await params;
  const siteUrl = getSiteUrl();

  // 1. Check if slug matches a Subject
  const subject = getSubjectBySlug(slug);
  if (subject) {
    const subjectWorksheets = await fetchWorksheetsBySubject(subject.slug);
    const allWorksheets = await fetchAllWorksheets();
    const otherWorksheets = allWorksheets
      .filter((w) => w.subject !== subject.slug)
      .slice(0, 4);

    const availableLettersMap = new Map<string, { letter: string; slug: string; title: string }>();
    for (const ws of subjectWorksheets) {
      const m = /^letter-([a-z])(?:-|$)/i.exec(ws.slug);
      if (m) {
        const letter = m[1].toUpperCase();
        if (!availableLettersMap.has(letter)) {
          availableLettersMap.set(letter, { letter, slug: ws.slug, title: ws.title });
        }
      }
    }
    const availableLetterItems = Array.from(availableLettersMap.values()).sort((a, b) =>
      a.letter.localeCompare(b.letter)
    );
    const fullAzPack = subjectWorksheets.find(
      (w) => w.slug === 'letter-tracing-worksheets-a-to-z'
    );

    return (
      <div>
        {/* Breadcrumbs */}
        <div className="bg-slate-50 border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Breadcrumbs
              items={[
                { label: 'Worksheets', href: '/worksheets' },
                { label: subject.shortTitle },
              ]}
            />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14 space-y-12">
          {/* Header */}
          <div className="max-w-3xl space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#F0F7F7] text-[#2E6B6B] border border-[#d0e3e3]">
              <Sparkles className="w-3.5 h-3.5 text-[#F2B544]" />
              <span>{subject.targetAges}</span>
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-heading">
              {subject.title}
            </h1>
            <p className="text-base text-slate-600 leading-relaxed">
              {subject.description}
            </p>
          </div>

          {/* Special A–Z Letter Selector for Alphabet Subject */}
          {subject.slug === 'alphabet' && (
            <div className="p-6 rounded-2xl bg-white border border-slate-200/90 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-heading">
                  Letter of the Week Series
                </h3>
                <span className="text-xs text-slate-500">A–Z Alphabet</span>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {fullAzPack && (
                  <Link
                    href={`/worksheets/${fullAzPack.slug}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#2E6B6B] hover:bg-[#235353] text-white text-xs sm:text-sm font-bold shadow-xs transition-colors"
                  >
                    <span>Complete A–Z Pack ({fullAzPack.pages} Pages)</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
                <div className="flex flex-wrap items-center gap-2">
                  {availableLetterItems.map((item) => (
                    <Link
                      key={item.letter}
                      href={`/worksheets/${item.slug}`}
                      className="w-10 h-10 rounded-lg bg-[#F0F7F7] hover:bg-[#2E6B6B] text-[#2E6B6B] hover:text-white border border-[#d0e3e3] text-base font-bold flex items-center justify-center shadow-2xs transition-colors"
                      title={item.title}
                    >
                      {item.letter}
                    </Link>
                  ))}
                  <span className="text-xs text-slate-500 font-medium italic">
                    Individual letter packs coming soon
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Current Available Worksheets */}
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
              <h2 className="text-xl font-bold text-slate-900 font-heading">
                Available Printables ({subjectWorksheets.length})
              </h2>
              <span className="text-xs text-slate-500">Free PDF Downloads</span>
            </div>

            <div className={`grid gap-6 ${
              subjectWorksheets.length === 1
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-2xl'
                : subjectWorksheets.length === 2
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 max-w-3xl'
                : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
            }`}>
              {subjectWorksheets.map((ws) => (
                <WorksheetCard key={ws.slug} worksheet={ws} />
              ))}
            </div>
          </div>

          {/* Sparse Content Fallback (< 6 worksheets): Upcoming Notice & Related Worksheets */}
          {subjectWorksheets.length < 6 && (
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
                        Explore foundational worksheets from neighboring preschool subjects:
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

          {/* Ad Slot above Subject FAQs */}
          <AdUnit slotType="in-content" />

          {/* Subject FAQs */}
          {subject.faqs && subject.faqs.length > 0 && (
            <div className="max-w-3xl pt-6">
              <FAQAccordion
                items={subject.faqs}
                title={`${subject.shortTitle} Curriculum & Instruction FAQ`}
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  // 2. Check if slug matches a Worksheet
  const worksheet = await fetchWorksheetBySlug(slug);
  if (worksheet) {
    const relatedWorksheets = await fetchRelatedWorksheets(worksheet, 4);
    const nextInSeriesWorksheet = worksheet.series?.nextSlug
      ? (await fetchWorksheetBySlug(worksheet.series.nextSlug)) ?? null
      : null;

    // Schema.org Structured Data
    const pageUrl = `${siteUrl}/worksheets/${worksheet.slug}`;
    const learningResourceSchema = {
      '@context': 'https://schema.org',
      '@type': 'LearningResource',
      name: worksheet.title,
      description: worksheet.description,
      educationalLevel: worksheet.gradeLevel,
      typicalAgeRange: worksheet.ages,
      learningResourceType: 'worksheet',
      inLanguage: 'en-US',
      url: pageUrl,
      isAccessibleForFree: true,
      encodingFormat: 'application/pdf',
      datePublished: `${worksheet.datePublished}T00:00:00.000Z`,
      dateModified: `${worksheet.dateModified}T00:00:00.000Z`,
      image: toAbsoluteAssetUrl(worksheet.previewImages[0], siteUrl),
    };

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(learningResourceSchema),
          }}
        />
        <WorksheetDetailView
          worksheet={worksheet}
          relatedWorksheets={relatedWorksheets}
          nextInSeriesWorksheet={nextInSeriesWorksheet}
        />
      </>
    );
  }

  notFound();
}
