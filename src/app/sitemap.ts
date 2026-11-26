import type { MetadataRoute } from 'next';
import { connection } from 'next/server';
import {
  fetchAllWorksheets,
  fetchWorksheetsBySubject,
  fetchWorksheetsByTopic,
  fetchWorksheetsByMonth,
  fetchWorksheetsByAgeBand,
  fetchWorksheetsByActivityType,
} from '@/lib/worksheets-store';
import { subjects } from '@/data/subjects';
import { topics } from '@/data/topics';
import { months } from '@/data/months';
import { ageBandsData } from '@/data/ages';
import { activitiesData } from '@/data/activities';
import { guides } from '@/data/guides';
import { TOOL_REGISTRY } from '@/data/tools';
import { isIndexableCollection, type Worksheet } from '@/types/worksheet';
import { getSiteUrl } from '@/config/site';

function toLastModDate(ws: Worksheet, fallback = new Date()): Date {
  const raw = ws.updatedAt || ws.dateModified;
  if (!raw) return fallback;
  const parsed = new Date(raw);
  return Number.isNaN(parsed.getTime()) ? fallback : parsed;
}

function getLatestDate(list: Worksheet[], fallback: Date): Date {
  if (list.length === 0) return fallback;
  let maxMs = 0;
  for (const ws of list) {
    const ms = toLastModDate(ws, fallback).getTime();
    if (ms > maxMs) maxMs = ms;
  }
  return maxMs > 0 ? new Date(maxMs) : fallback;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await connection();

  const baseUrl = getSiteUrl();
  const allWorksheets = await fetchAllWorksheets();
  const nowFallback = new Date();
  const latestModDate = getLatestDate(allWorksheets, nowFallback);

  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: latestModDate,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/worksheets`,
      lastModified: latestModDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/topics`,
      lastModified: latestModDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/guides`,
      lastModified: latestModDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/tools`,
      lastModified: latestModDate,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    ...Object.values(TOOL_REGISTRY).map((tool) => ({
      url: `${baseUrl}${tool.path}`,
      lastModified: latestModDate,
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    })),
    {
      url: `${baseUrl}/about`,
      lastModified: latestModDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: latestModDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: latestModDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/cookie-policy`,
      lastModified: latestModDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: latestModDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // Subjects (enter sitemap when count >= 1)
  for (const s of subjects) {
    const items = await fetchWorksheetsBySubject(s.slug);
    if (isIndexableCollection(items.length)) {
      routes.push({
        url: `${baseUrl}/worksheets/${s.slug}`,
        lastModified: getLatestDate(items, latestModDate),
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    }
  }

  // Topics (enter sitemap when count >= 1)
  for (const t of topics) {
    const items = await fetchWorksheetsByTopic(t.slug);
    if (isIndexableCollection(items.length)) {
      routes.push({
        url: `${baseUrl}/topics/${t.slug}`,
        lastModified: getLatestDate(items, latestModDate),
        changeFrequency: 'weekly',
        priority: 0.7,
      });
    }
  }

  // Months (enter sitemap when count >= 1; empty months like june/july stay excluded)
  for (const m of months) {
    const items = await fetchWorksheetsByMonth(m.monthNumber);
    if (isIndexableCollection(items.length)) {
      routes.push({
        url: `${baseUrl}/preschool-themes/${m.slug}`,
        lastModified: getLatestDate(items, latestModDate),
        changeFrequency: 'weekly',
        priority: 0.7,
      });
    }
  }

  // Age groups (enter sitemap when count >= 1)
  for (const a of ageBandsData) {
    const items = await fetchWorksheetsByAgeBand(a.slug);
    if (isIndexableCollection(items.length)) {
      routes.push({
        url: `${baseUrl}/ages/${a.slug}`,
        lastModified: getLatestDate(items, latestModDate),
        changeFrequency: 'weekly',
        priority: 0.7,
      });
    }
  }

  // Activity types (enter sitemap when count >= 1)
  for (const act of activitiesData) {
    const items = await fetchWorksheetsByActivityType(act.slug);
    if (isIndexableCollection(items.length)) {
      routes.push({
        url: `${baseUrl}/activities/${act.slug}`,
        lastModified: getLatestDate(items, latestModDate),
        changeFrequency: 'weekly',
        priority: 0.7,
      });
    }
  }

  // Educator teaching guides
  for (const g of guides) {
    const mod = new Date(g.dateModified || latestModDate);
    routes.push({
      url: `${baseUrl}/guides/${g.slug}`,
      lastModified: Number.isNaN(mod.getTime()) ? latestModDate : mod,
      changeFrequency: 'monthly',
      priority: 0.8,
    });
  }

  // Individual published worksheet pages with real updatedAt lastmod
  for (const ws of allWorksheets) {
    routes.push({
      url: `${baseUrl}/worksheets/${ws.slug}`,
      lastModified: toLastModDate(ws, latestModDate),
      changeFrequency: 'weekly',
      priority: 0.9,
    });
  }

  return routes;
}
