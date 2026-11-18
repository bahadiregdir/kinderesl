import { MetadataRoute } from 'next';
import { getAllWorksheets } from '@/data/worksheets';
import { getSiteUrl } from '@/config/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteUrl();
  const lastModDate = new Date('2026-11-18');

  // Only indexable pages with full content (Item 7: hubs with <3 items, /tr, /games excluded)
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
      url: `${baseUrl}/worksheets/literacy`,
      lastModified: lastModDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/worksheets/math`,
      lastModified: lastModDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/worksheets/thinking-skills`,
      lastModified: lastModDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/worksheets/esl-vocabulary`,
      lastModified: lastModDate,
      changeFrequency: 'weekly',
      priority: 0.8,
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

  // Individual worksheet pages (Core Content)
  for (const ws of getAllWorksheets()) {
    routes.push({
      url: `${baseUrl}/worksheets/${ws.category}/${ws.slug}`,
      lastModified: new Date(ws.dateModified || '2026-11-18'),
      changeFrequency: 'weekly',
      priority: 0.9,
    });
  }

  return routes;
}
