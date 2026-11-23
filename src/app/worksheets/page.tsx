import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { fetchAllWorksheets } from '@/lib/worksheets-store';
import { subjects } from '@/data/subjects';
import { WorksheetsCatalog } from '@/components/WorksheetsCatalog';
import { NewsletterBox } from '@/components/NewsletterBox';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { AdUnit } from '@/components/AdUnit';
import { getSiteUrl } from '@/config/site';
import { DEFAULT_OG_IMAGE, buildSeoDescription, buildSeoTitle } from '@/lib/seo-meta';

const siteUrl = getSiteUrl();
const canonicalUrl = `${siteUrl}/worksheets`;
const pageTitle = buildSeoTitle('Free Printable Preschool & ESL Worksheets');
const pageDescription = buildSeoDescription(
  'Browse our complete library of free printable US Letter & A4 PDF worksheets for early childhood educators and parents. Filter by subject, theme, or age.'
);

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: {
    canonical: canonicalUrl,
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: canonicalUrl,
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

interface WorksheetsPageProps {
  searchParams: Promise<{
    q?: string | string[];
    subject?: string | string[];
    activity?: string | string[];
    age?: string | string[];
  }>;
}

function firstParam(val?: string | string[]): string {
  if (Array.isArray(val)) return val[0] || '';
  return val || '';
}

async function WorksheetsCatalogSection({
  searchParams,
}: WorksheetsPageProps) {
  const [worksheets, resolvedParams] = await Promise.all([
    fetchAllWorksheets(),
    searchParams,
  ]);

  return (
    <WorksheetsCatalog
      worksheets={worksheets}
      subjects={subjects}
      initialQuery={firstParam(resolvedParams.q)}
      initialSubject={firstParam(resolvedParams.subject)}
      initialActivity={firstParam(resolvedParams.activity)}
      initialAge={firstParam(resolvedParams.age)}
    />
  );
}

export default function WorksheetsPage({ searchParams }: WorksheetsPageProps) {
  return (
    <div>
      {/* Breadcrumbs */}
      <div className="bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: 'Worksheets' }]} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14 space-y-10">
        {/* Page Header */}
        <div className="max-w-3xl space-y-3">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-heading">
            Free Printable Worksheets
          </h1>
          <p className="text-base text-slate-600 leading-relaxed font-normal">
            Browse our classroom-ready printable PDFs for preschool, kindergarten, and ESL learners. Filter by learning domain, seasonal theme, activity format, or age group.
          </p>
        </div>

        {/* Server-Filtered Interactive Catalog */}
        <Suspense
          fallback={
            <div className="py-12 text-center text-sm text-slate-500">
              Loading printable worksheets...
            </div>
          }
        >
          <WorksheetsCatalogSection searchParams={searchParams} />
        </Suspense>

        <NewsletterBox source="worksheets-catalog" />

        <AdUnit slotType="in-content" />
      </div>
    </div>
  );
}
