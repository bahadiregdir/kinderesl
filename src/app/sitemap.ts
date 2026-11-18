import { MetadataRoute } from 'next';
import { getAllWorksheets } from '@/data/worksheets';
import { categories } from '@/data/categories';
import { themes } from '@/data/themes';
import { months } from '@/data/months';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://kinderesl.com';
  const now = new Date();

  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/worksheets`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/themes`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/preschool-themes`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/games`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/cookie-policy`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/tr`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ];

  // Category pages
  for (const cat of categories) {
    routes.push({
      url: `${baseUrl}/worksheets/${cat.slug}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.85,
    });
  }

  // Individual worksheet pages: /worksheets/[category]/[slug]
  for (const ws of getAllWorksheets()) {
    routes.push({
      url: `${baseUrl}/worksheets/${ws.category}/${ws.slug}`,
      lastModified: new Date(ws.dateModified || ws.datePublished),
      changeFrequency: 'weekly',
      priority: 0.9,
    });
  }

  // Theme pages: /themes/[theme]
  for (const th of themes) {
    routes.push({
      url: `${baseUrl}/themes/${th.slug}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    });
  }

  // Monthly theme pages: /preschool-themes/[month]
  for (const mo of months) {
    routes.push({
      url: `${baseUrl}/preschool-themes/${mo.slug}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.75,
    });
  }

  return routes;
}
