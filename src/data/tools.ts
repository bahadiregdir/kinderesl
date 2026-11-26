import type { Metadata } from 'next';
import { getSiteUrl } from '@/config/site';
import { buildSeoDescription, buildSeoTitle } from '@/lib/seo-meta';

export type ToolPreviewKind = 'name-tracing' | 'bingo-maker' | 'generic';

export interface ToolRegistryItem {
  slug: string;
  path: string;
  seoTitle: string;
  description: string;
  ogTitle: string;
  ogSubtitle: string;
  ogBadges: string[];
  ogAlt: string;
  pinDescription: string;
  sampleHeading: string;
  sampleCaption: string;
  schemaName: string;
  previewKind: ToolPreviewKind;
}

export const TOOL_REGISTRY: Record<string, ToolRegistryItem> = {
  'name-tracing': {
    slug: 'name-tracing',
    path: '/tools/name-tracing',
    seoTitle: 'Free Name Tracing Worksheet Generator',
    description:
      'Create custom printable name tracing PDF worksheets for preschool and kindergarten in seconds. Supports US Letter & A4, batch class lists up to 30 names.',
    ogTitle: 'Free Name Tracing Worksheet Maker',
    ogSubtitle: 'Preschool & Kindergarten · Free PDF',
    ogBadges: ['US Letter & A4', 'Up to 30 Kids'],
    ogAlt:
      'Free Name Tracing Worksheet Maker — Printable dashed EMMA handwriting worksheet preview for preschool and kindergarten',
    pinDescription:
      'Free Custom Name Tracing Worksheet Maker for Preschool & Kindergarten! Type one name or a whole class list (up to 30 kids) and download US Letter or A4 dashed tracing PDFs free at KinderESL.com.',
    sampleHeading: 'Printable Output Preview',
    sampleCaption:
      'Clean ball-and-stick dashed letters with directional starting dots ready for US Letter or A4 printing.',
    schemaName: 'KinderESL Free Name Tracing Worksheet Generator',
    previewKind: 'name-tracing',
  },
  'bingo-maker': {
    slug: 'bingo-maker',
    path: '/tools/bingo-maker',
    seoTitle: 'Free ESL Bingo Card Generator',
    description:
      'Create up to 30 unique shuffled printable ESL bingo cards in US Letter or A4 PDF with a teacher caller checklist. Ready-made word sets or custom lists.',
    ogTitle: 'Free ESL Bingo Card Generator',
    ogSubtitle: 'Preschool & Kindergarten · Free PDF',
    ogBadges: ['3x3 & 4x4 Grids', 'Teacher Caller Sheet'],
    ogAlt:
      'Free ESL Bingo Card Generator — Printable 3x3 ESL vocabulary bingo card with FREE center space for preschool and kindergarten',
    pinDescription:
      'Free Printable ESL Bingo Card Generator for Preschool & Kindergarten! Build up to 30 uniquely shuffled 3x3 or 4x4 vocabulary bingo cards plus a Teacher Caller Checklist in US Letter or A4 PDF at KinderESL.com.',
    sampleHeading: 'Printable Output Preview',
    sampleCaption:
      'Uniquely shuffled 3×3 or 4×4 student bingo boards paired with a printable teacher caller checklist.',
    schemaName: 'KinderESL Free ESL Bingo Card Generator',
    previewKind: 'bingo-maker',
  },
};

export function getToolConfig(slug: string): ToolRegistryItem {
  const existing = TOOL_REGISTRY[slug];
  if (existing) return existing;

  const formatted = slug
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

  return {
    slug,
    path: `/tools/${slug}`,
    seoTitle: `Free ${formatted}`,
    description: `Free printable preschool and kindergarten ${formatted.toLowerCase()} PDF generator in US Letter & A4.`,
    ogTitle: `Free ${formatted}`,
    ogSubtitle: 'Preschool & Kindergarten · Free PDF',
    ogBadges: ['US Letter & A4', '100% Free PDF'],
    ogAlt: `${formatted} — Free Printable Preschool & Kindergarten PDF Tool on KinderESL`,
    pinDescription: `Free ${formatted} for Preschool & Kindergarten educators! Download instant US Letter or A4 printables at KinderESL.com.`,
    sampleHeading: 'Printable Output Preview',
    sampleCaption: 'Instant classroom-ready PDF formatted for US Letter and A4 paper.',
    schemaName: `KinderESL Free ${formatted}`,
    previewKind: 'generic',
  };
}

export function getToolOgImagePath(slug: string): string {
  return `/tools/${slug}/opengraph-image`;
}

export function getToolOgImageUrl(slug: string, siteUrl = getSiteUrl()): string {
  return `${siteUrl.replace(/\/+$/, '')}${getToolOgImagePath(slug)}`;
}

export function buildToolMetadata(slug: string): Metadata {
  const tool = getToolConfig(slug);
  const siteUrl = getSiteUrl();
  const pageUrl = `${siteUrl}${tool.path}`;
  const ogImageUrl = getToolOgImageUrl(tool.slug, siteUrl);
  const pageTitle = buildSeoTitle(tool.seoTitle);
  const pageDescription = buildSeoDescription(tool.description);

  return {
    title: pageTitle,
    description: pageDescription,
    alternates: { canonical: pageUrl },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: pageUrl,
      type: 'website',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: tool.ogAlt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: pageDescription,
      images: [ogImageUrl],
    },
    robots: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
  };
}

export function buildToolWebAppSchema(slug: string) {
  const tool = getToolConfig(slug);
  const siteUrl = getSiteUrl();
  const pageUrl = `${siteUrl}${tool.path}`;
  const ogImageUrl = getToolOgImageUrl(tool.slug, siteUrl);

  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: tool.schemaName,
    url: pageUrl,
    description: buildSeoDescription(tool.description),
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Any',
    isAccessibleForFree: true,
    inLanguage: 'en-US',
    image: ogImageUrl,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };
}
