import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  getAllWorksheets,
  getWorksheetBySlug,
  getWorksheetsBySubject,
  getRelatedWorksheets,
} from '@/data/worksheets';
import { subjects, getSubjectBySlug } from '@/data/subjects';
import { isIndexableCollection, WorksheetSubject } from '@/types/worksheet';
import { WorksheetDetailView } from '@/components/WorksheetDetailView';
import { WorksheetCard } from '@/components/WorksheetCard';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { FAQAccordion } from '@/components/FAQAccordion';
import { AdUnit } from '@/components/AdUnit';
import { getSiteUrl } from '@/config/site';
import { subjectMap } from '@/i18n/routes';
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
  const worksheetParams = getAllWorksheets().map((w) => ({ slug: w.slug }));
  return [...subjectParams, ...worksheetParams];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const siteUrl = getSiteUrl();

  // 1. Is it a Subject?
  const subject = getSubjectBySlug(slug);
  if (subject) {
    const subjectWorksheets = getWorksheetsBySubject(subject.slug);
    const isIndexable = isIndexableCollection(subjectWorksheets.length);
    const pageUrl = `${siteUrl}/worksheets/${subject.slug}`;
    const trSubjectSlug = subjectMap[subject.slug];
    const trUrl = trSubjectSlug ? `${siteUrl}/tr/calisma-sayfalari/${trSubjectSlug}` : undefined;

    return {
      title: `${subject.title} | KinderESL`,
      description: subject.description,
      alternates: {
        canonical: pageUrl,
        languages: trUrl
          ? {
              en: pageUrl,
              tr: trUrl,
              'x-default': pageUrl,
            }
          : undefined,
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
  const worksheet = getWorksheetBySlug(slug);
  if (worksheet) {
    const pageUrl = `${siteUrl}/worksheets/${worksheet.slug}`;
    const trData = worksheet.i18n?.tr;
    const trUrl = trData ? `${siteUrl}/tr/calisma-sayfalari/${trData.slug}` : undefined;

    return {
      title: `${worksheet.title} | Free Printable PDF`,
      description: worksheet.description,
      alternates: {
        canonical: pageUrl,
        languages: trUrl
          ? {
              en: pageUrl,
              tr: trUrl,
              'x-default': pageUrl,
            }
          : undefined,
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
            url: `${siteUrl}${worksheet.previewImages[0]}`,
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
        images: [`${siteUrl}${worksheet.previewImages[0]}`],
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
    const subjectWorksheets = getWorksheetsBySubject(subject.slug);
    const otherWorksheets = getAllWorksheets()
      .filter((w) => w.subject !== subject.slug)
      .slice(0, 2);

    const alphabetLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

    return (
      <div>
        {/* Breadcrumbs */}
        <div className="bg-slate-50 border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Breadcrumbs
              items={[
                { label: 'Worksheets', href: '/worksheets' },
                { label: subject.title },
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
                  Letter of the Week A–Z Selector
                </h3>
                <span className="text-xs text-slate-500">26 Letters Series</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {alphabetLetters.map((letter) => {
                  const hasWorksheet = letter === 'A';
                  return hasWorksheet ? (
                    <Link
                      key={letter}
                      href="/worksheets/letter-a-tracing-and-phonics"
                      className="w-9 h-9 rounded-lg bg-[#2E6B6B] text-white text-sm font-bold flex items-center justify-center shadow-xs transition-transform hover:scale-105"
                      title={`Letter ${letter} Tracing Worksheet`}
                    >
                      {letter}
                    </Link>
                  ) : (
                    <span
                      key={letter}
                      className="w-9 h-9 rounded-lg bg-slate-100 text-slate-400 text-sm font-bold flex items-center justify-center cursor-not-allowed select-none"
                      title={`Letter ${letter} coming soon`}
                    >
                      {letter}
                    </span>
                  );
                })}
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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {subjectWorksheets.map((ws) => (
                <WorksheetCard key={ws.slug} worksheet={ws} />
              ))}
            </div>
          </div>

          {/* Sparse Content Fallback (< 6 worksheets): Planned Titles & Related Worksheets */}
          {subjectWorksheets.length < 6 && (
            <div className="space-y-8 pt-4">
              {/* Coming next in this topic */}
              <div className="p-6 sm:p-8 rounded-2xl bg-[#F0F7F7]/60 border border-[#d0e3e3] space-y-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#2E6B6B]" />
                  <h3 className="text-base font-bold text-slate-900 font-heading">
                    Coming next in this topic
                  </h3>
                </div>
                <p className="text-xs text-slate-600">
                  Our teaching team is currently illustrating the next resources for this collection:
                </p>
                <ul className="space-y-2 text-xs text-slate-700 font-medium">
                  {subject.plannedTitles.map((planned, idx) => (
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

              {/* Related worksheets from nearby subjects */}
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
                    {otherWorksheets.map((ws) => (
                      <WorksheetCard key={ws.slug} worksheet={ws} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Subject FAQs */}
          {subject.faqs && subject.faqs.length > 0 && (
            <div className="max-w-3xl pt-6">
              <FAQAccordion
                items={subject.faqs}
                title={`${subject.shortTitle} Curriculum &amp; Instruction FAQ`}
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  // 2. Check if slug matches a Worksheet
  const worksheet = getWorksheetBySlug(slug);
  if (worksheet) {
    const relatedWorksheets = getRelatedWorksheets(worksheet, 4);

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
      image: `${siteUrl}${worksheet.previewImages[0]}`,
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
          locale="en"
          relatedWorksheets={relatedWorksheets}
        />
      </>
    );
  }

  notFound();
}
