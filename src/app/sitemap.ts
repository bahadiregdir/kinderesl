import { MetadataRoute } from 'next';
import {
  getAllWorksheets,
  getWorksheetsBySubject,
  getWorksheetsByTopic,
  getWorksheetsByMonth,
} from '@/data/worksheets';
import { subjects } from '@/data/subjects';
import { topics } from '@/data/topics';
import { months } from '@/data/months';
import { isIndexableCollection } from '@/types/worksheet';
import { getSiteUrl } from '@/config/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteUrl();
  const lastModDate = new Date('2026-11-18');

  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: lastModDate,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/worksheets`,
      lastModified: lastModDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: lastModDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: lastModDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: lastModDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/cookie-policy`,
      lastModified: lastModDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: lastModDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // Subjects (enter sitemap only when count >= 6)
  for (const s of subjects) {
    const count = getWorksheetsBySubject(s.slug).length;
    if (isIndexableCollection(count)) {
      routes.push({
        url: `${baseUrl}/worksheets/${s.slug}`,
        lastModified: lastModDate,
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    }
  }

  // Topics (enter sitemap only when count >= 6)
  for (const t of topics) {
    const count = getWorksheetsByTopic(t.slug).length;
    if (isIndexableCollection(count)) {
      routes.push({
        url: `${baseUrl}/topics/${t.slug}`,
        lastModified: lastModDate,
        changeFrequency: 'weekly',
        priority: 0.7,
      });
    }
  }

  // Months (enter sitemap only when count >= 6)
  for (const m of months) {
    const count = getWorksheetsByMonth(m.monthNumber).length;
    if (isIndexableCollection(count)) {
      routes.push({
        url: `${baseUrl}/preschool-themes/${m.slug}`,
        lastModified: lastModDate,
        changeFrequency: 'weekly',
        priority: 0.7,
      });
    }
  }

  // Individual worksheet pages
  for (const ws of getAllWorksheets()) {
    const enUrl = `${baseUrl}/worksheets/${ws.slug}`;
    const modDate = new Date(ws.dateModified || '2026-11-18');

    routes.push({
      url: enUrl,
      lastModified: modDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    });
  }

  return routes;
}
