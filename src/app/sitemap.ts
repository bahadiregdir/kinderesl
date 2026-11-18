import { MetadataRoute } from 'next';
import { getAllWorksheets, getWorksheetsBySubject, getWorksheetsByTopic, getWorksheetsByMonth } from '@/data/worksheets';
import { subjects } from '@/data/subjects';
import { topics } from '@/data/topics';
import { months } from '@/data/months';
import { isIndexableCollection } from '@/types/worksheet';
import { getSiteUrl } from '@/config/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteUrl();
  const lastModDate = new Date('2026-11-18');

  const routes: MetadataRoute.Sitemap = [
    // English static pages
    {
      url: baseUrl,
      lastModified: lastModDate,
      changeFrequency: 'weekly',
      priority: 1.0,
      alternates: {
        languages: {
          en: baseUrl,
          tr: `${baseUrl}/tr`,
        },
      },
    },
    {
      url: `${baseUrl}/worksheets`,
      lastModified: lastModDate,
      changeFrequency: 'daily',
      priority: 0.9,
      alternates: {
        languages: {
          en: `${baseUrl}/worksheets`,
          tr: `${baseUrl}/tr/calisma-sayfalari`,
        },
      },
    },
    {
      url: `${baseUrl}/about`,
      lastModified: lastModDate,
      changeFrequency: 'monthly',
      priority: 0.6,
      alternates: {
        languages: {
          en: `${baseUrl}/about`,
          tr: `${baseUrl}/tr/hakkimizda`,
        },
      },
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: lastModDate,
      changeFrequency: 'monthly',
      priority: 0.5,
      alternates: {
        languages: {
          en: `${baseUrl}/contact`,
          tr: `${baseUrl}/tr/iletisim`,
        },
      },
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: lastModDate,
      changeFrequency: 'yearly',
      priority: 0.3,
      alternates: {
        languages: {
          en: `${baseUrl}/privacy-policy`,
          tr: `${baseUrl}/tr/gizlilik-politikasi`,
        },
      },
    },
    {
      url: `${baseUrl}/cookie-policy`,
      lastModified: lastModDate,
      changeFrequency: 'yearly',
      priority: 0.3,
      alternates: {
        languages: {
          en: `${baseUrl}/cookie-policy`,
          tr: `${baseUrl}/tr/cerez-politikasi`,
        },
      },
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: lastModDate,
      changeFrequency: 'yearly',
      priority: 0.3,
      alternates: {
        languages: {
          en: `${baseUrl}/terms`,
          tr: `${baseUrl}/tr/kullanim-kosullari`,
        },
      },
    },

    // Turkish static pages
    {
      url: `${baseUrl}/tr`,
      lastModified: lastModDate,
      changeFrequency: 'weekly',
      priority: 0.9,
      alternates: {
        languages: {
          en: baseUrl,
          tr: `${baseUrl}/tr`,
        },
      },
    },
    {
      url: `${baseUrl}/tr/calisma-sayfalari`,
      lastModified: lastModDate,
      changeFrequency: 'daily',
      priority: 0.9,
      alternates: {
        languages: {
          en: `${baseUrl}/worksheets`,
          tr: `${baseUrl}/tr/calisma-sayfalari`,
        },
      },
    },
    {
      url: `${baseUrl}/tr/okul-oncesi-ingilizce-yillik-plan`,
      lastModified: lastModDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/tr/hakkimizda`,
      lastModified: lastModDate,
      changeFrequency: 'monthly',
      priority: 0.5,
      alternates: {
        languages: {
          en: `${baseUrl}/about`,
          tr: `${baseUrl}/tr/hakkimizda`,
        },
      },
    },
    {
      url: `${baseUrl}/tr/iletisim`,
      lastModified: lastModDate,
      changeFrequency: 'monthly',
      priority: 0.5,
      alternates: {
        languages: {
          en: `${baseUrl}/contact`,
          tr: `${baseUrl}/tr/iletisim`,
        },
      },
    },
    {
      url: `${baseUrl}/tr/gizlilik-politikasi`,
      lastModified: lastModDate,
      changeFrequency: 'yearly',
      priority: 0.3,
      alternates: {
        languages: {
          en: `${baseUrl}/privacy-policy`,
          tr: `${baseUrl}/tr/gizlilik-politikasi`,
        },
      },
    },
    {
      url: `${baseUrl}/tr/cerez-politikasi`,
      lastModified: lastModDate,
      changeFrequency: 'yearly',
      priority: 0.3,
      alternates: {
        languages: {
          en: `${baseUrl}/cookie-policy`,
          tr: `${baseUrl}/tr/cerez-politikasi`,
        },
      },
    },
    {
      url: `${baseUrl}/tr/kullanim-kosullari`,
      lastModified: lastModDate,
      changeFrequency: 'yearly',
      priority: 0.3,
      alternates: {
        languages: {
          en: `${baseUrl}/terms`,
          tr: `${baseUrl}/tr/kullanim-kosullari`,
        },
      },
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

  // Individual worksheet pages (Core Content - both English and Turkish)
  for (const ws of getAllWorksheets()) {
    const enUrl = `${baseUrl}/worksheets/${ws.slug}`;
    const trSlug = ws.i18n?.tr?.slug;
    const trUrl = trSlug ? `${baseUrl}/tr/calisma-sayfalari/${trSlug}` : null;
    const modDate = new Date(ws.dateModified || '2026-11-18');

    // English worksheet page
    routes.push({
      url: enUrl,
      lastModified: modDate,
      changeFrequency: 'weekly',
      priority: 0.9,
      ...(trUrl
        ? {
            alternates: {
              languages: {
                en: enUrl,
                tr: trUrl,
              },
            },
          }
        : {}),
    });

    // Turkish worksheet page (if localized)
    if (trUrl) {
      routes.push({
        url: trUrl,
        lastModified: modDate,
        changeFrequency: 'weekly',
        priority: 0.85,
        alternates: {
          languages: {
            en: enUrl,
            tr: trUrl,
          },
        },
      });
    }
  }

  return routes;
}
