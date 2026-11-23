import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { activitiesData, getActivityBySlug } from '@/data/activities';
import {
  fetchAllWorksheets,
  fetchWorksheetsByActivityType,
} from '@/lib/worksheets-store';
import { isIndexableCollection } from '@/types/worksheet';
import { CollectionLandingView } from '@/components/CollectionLandingView';
import { getSiteUrl } from '@/config/site';
import { DEFAULT_OG_IMAGE, buildSeoDescription, buildSeoTitle } from '@/lib/seo-meta';

interface Props {
  params: Promise<{ activity: string }>;
}

export async function generateStaticParams() {
  return activitiesData.map((a) => ({ activity: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { activity } = await params;
  const meta = getActivityBySlug(activity);

  if (!meta) {
    return { title: 'Page not found', robots: { index: false, follow: true } };
  }

  const siteUrl = getSiteUrl();
  const pageUrl = `${siteUrl}/activities/${meta.slug}`;
  const items = await fetchWorksheetsByActivityType(meta.slug);
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

export default async function ActivityTypePage({ params }: Props) {
  const { activity } = await params;
  const meta = getActivityBySlug(activity);
  if (!meta) notFound();

  const [worksheets, allWorksheets] = await Promise.all([
    fetchWorksheetsByActivityType(meta.slug),
    fetchAllWorksheets(),
  ]);

  return (
    <CollectionLandingView
      breadcrumbLabel={meta.shortTitle}
      badgeLabel="Activity Format · Preschool & ESL"
      title={meta.title}
      description={meta.description}
      skillsFocus={meta.skillsFocus}
      classroomTip={meta.classroomTip}
      worksheets={worksheets}
      relatedFallback={allWorksheets.slice(0, 4)}
      siblingHeading="Browse Worksheets by Activity Type"
      siblingLinks={activitiesData.map((a) => ({
        slug: a.slug,
        label: a.shortTitle,
        href: `/activities/${a.slug}`,
      }))}
      activeSlug={meta.slug}
      faqs={meta.faqs}
      faqTitle={`${meta.shortTitle} FAQ`}
      newsletterSource={`activity-${meta.slug}`}
    />
  );
}
