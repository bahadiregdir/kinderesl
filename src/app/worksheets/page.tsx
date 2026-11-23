import React from 'react';
import type { Metadata } from 'next';
import { fetchAllWorksheets } from '@/lib/worksheets-store';
import { subjects } from '@/data/subjects';
import { WorksheetsCatalog } from '@/components/WorksheetsCatalog';
import { NewsletterBox } from '@/components/NewsletterBox';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { AdUnit } from '@/components/AdUnit';
import { getSiteUrl } from '@/config/site';

const siteUrl = getSiteUrl();
const canonicalUrl = `${siteUrl}/worksheets`;

export const metadata: Metadata = {
  title: 'Free Printable Worksheets for Preschool & Kindergarten',
  description:
    'Browse our complete library of free educational PDF worksheets for early childhood educators and parents. Filter by subject, theme, activity type, and age.',
  alternates: {
    canonical: canonicalUrl,
  },
  openGraph: {
    title: 'Free Printable Worksheets for Preschool & Kindergarten',
    description:
      'Complete library of free printable worksheets. Alphabet, numbers, phonics, and ESL vocabulary sets.',
    url: canonicalUrl,
    type: 'website',
  },
};

export default async function WorksheetsPage() {
  const worksheets = await fetchAllWorksheets();

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

        {/* Server-Rendered Interactive Catalog with instant client search and filter */}
        <WorksheetsCatalog worksheets={worksheets} subjects={subjects} />

        <NewsletterBox source="worksheets-catalog" />

        <AdUnit slotType="in-content" />
      </div>
    </div>
  );
}
