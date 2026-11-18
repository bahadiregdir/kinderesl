import { MetadataRoute } from 'next';
import { getAllWorksheets, getWorksheetsByCategory } from '@/data/worksheets';
import { categories } from '@/data/categories';
import { getSiteUrl } from '@/config/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteUrl();
  const lastModDate = new Date('2026-11-18');

  // Core indexable static routes (hub pages with < 3 items, /tr, and /games excluded until populated)
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

  // Category hub pages: automatically enter sitemap when worksheet count reaches >= 3 (Item 6)
  for (const cat of categories) {
    const wsCount = getWorksheetsByCategory(cat.slug).length;
    if (wsCount >= 3) {
      routes.push({
        url: `${baseUrl}/worksheets/${cat.slug}`,
        lastModified: lastModDate,
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    }
  }

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
