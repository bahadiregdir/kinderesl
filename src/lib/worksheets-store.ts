import { cacheLife, cacheTag } from 'next/cache';
import { worksheets as fallbackWorksheets } from '@/data/worksheets';
import { topics } from '@/data/topics';
import siteSettingsFallback from '@/data/site-settings.json';
import {
  dbGetSiteSettings,
  dbListWorksheets,
  isDatabaseConfigured,
} from '@/lib/db';
import type {
  SiteSettings,
  Worksheet,
  WorksheetSubject,
} from '@/types/worksheet';

export async function fetchAllWorksheets(): Promise<Worksheet[]> {
  'use cache';
  cacheTag('worksheets');
  cacheLife('hours');

  if (isDatabaseConfigured()) {
    try {
      const rows = await dbListWorksheets();
      if (rows.length > 0) {
        return rows;
      }
    } catch (err) {
      console.error('Neon fetchAllWorksheets failed, falling back to local JSON:', err);
    }
  }

  return fallbackWorksheets;
}

export async function fetchWorksheetBySlug(
  slug: string
): Promise<Worksheet | undefined> {
  const all = await fetchAllWorksheets();
  return all.find((w) => w.slug === slug);
}

export async function fetchWorksheetsBySubject(
  subject: WorksheetSubject
): Promise<Worksheet[]> {
  const all = await fetchAllWorksheets();
  return all.filter((w) => w.subject === subject);
}

export async function fetchWorksheetsByTopic(
  topicSlug: string
): Promise<Worksheet[]> {
  const all = await fetchAllWorksheets();
  return all.filter((w) => w.topics.includes(topicSlug));
}

export async function fetchWorksheetsByMonth(
  monthNumber: number
): Promise<Worksheet[]> {
  const all = await fetchAllWorksheets();
  const matchingTopics = topics
    .filter((t) => t.curriculumMonths.includes(monthNumber))
    .map((t) => t.slug);

  return all.filter((w) => {
    if (w.months && w.months.includes(monthNumber)) return true;
    return w.topics.some((topic) => matchingTopics.includes(topic));
  });
}

export async function fetchRelatedWorksheets(
  worksheet: Worksheet,
  limit = 4
): Promise<Worksheet[]> {
  const all = await fetchAllWorksheets();
  const others = all.filter((w) => w.id !== worksheet.id);

  const scored = others.map((w) => {
    let score = 0;
    if (w.subject === worksheet.subject) score += 3;
    const sharedTopics = w.topics.filter((t) => worksheet.topics.includes(t));
    score += sharedTopics.length * 2;
    const sharedActivities = w.activityTypes.filter((a) =>
      worksheet.activityTypes.includes(a)
    );
    score += sharedActivities.length;
    return { worksheet: w, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => s.worksheet);
}

export async function fetchSiteSettings(): Promise<SiteSettings> {
  'use cache';
  cacheTag('site-settings');
  cacheLife('hours');

  if (isDatabaseConfigured()) {
    try {
      const dbSettings = await dbGetSiteSettings();
      if (dbSettings) {
        return dbSettings;
      }
    } catch (err) {
      console.error('Neon fetchSiteSettings failed, falling back to local JSON:', err);
    }
  }

  return siteSettingsFallback as SiteSettings;
}
