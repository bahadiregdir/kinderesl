import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ageBandsData, getAgeBandBySlug } from '@/data/ages';
import {
  fetchAllWorksheets,
  fetchWorksheetsByAgeBand,
} from '@/lib/worksheets-store';
import { isIndexableCollection } from '@/types/worksheet';
import { CollectionLandingView } from '@/components/CollectionLandingView';
import { getSiteUrl } from '@/config/site';
import { DEFAULT_OG_IMAGE, buildSeoDescription, buildSeoTitle } from '@/lib/seo-meta';

interface Props {
  params: Promise<{ age: string }>;
}

export async function generateStaticParams() {
  return ageBandsData.map((a) => ({ age: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { age } = await params;
  const meta = getAgeBandBySlug(age);

  if (!meta) {
    return { title: 'Page not found', robots: { index: false, follow: true } };
  }

  const siteUrl = getSiteUrl();
  const pageUrl = `${siteUrl}/ages/${meta.slug}`;
  const items = await fetchWorksheetsByAgeBand(meta.slug);
  const seoTitle = buildSeoTitle(meta.title);
  const seoDescription = buildSeoDescription(meta.description);

  return {
    title: seoTitle,
    description: seoDescription,
    alternates: { canonical: pageUrl },
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
    robots: isIndexableCollection(items.length)
      ? { index: true, follow: true }
      : { index: false, follow: true },
  };
}

export default async function AgeBandPage({ params }: Props) {
  const { age } = await params;
  const meta = getAgeBandBySlug(age);
  if (!meta) notFound();

  const [worksheets, allWorksheets] = await Promise.all([
    fetchWorksheetsByAgeBand(meta.slug),
    fetchAllWorksheets(),
  ]);

  return (
    <CollectionLandingView
      breadcrumbLabel={meta.shortTitle}
      badgeLabel={meta.stageLabel}
      title={meta.title}
      description={meta.description}
      skillsFocus={meta.skillsFocus}
      classroomTip={meta.classroomTip}
      worksheets={worksheets}
      relatedFallback={allWorksheets.slice(0, 4)}
      siblingHeading="Browse Worksheets by Age Group"
      siblingLinks={ageBandsData.map((a) => ({
        slug: a.slug,
        label: a.shortTitle,
        href: `/ages/${a.slug}`,
      }))}
      activeSlug={meta.slug}
      faqs={meta.faqs}
      faqTitle={`${meta.shortTitle} Worksheets FAQ`}
      newsletterSource={`age-${meta.slug}`}
    />
  );
}
