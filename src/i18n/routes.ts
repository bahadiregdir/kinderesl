// Two-way route mapping between English and Turkish (Faz 1 & Faz 5)

export const subjectMap: Record<string, string> = {
  'alphabet': 'alfabe',
  'phonics': 'sesler-fonetik',
  'numbers-counting': 'sayilar-sayma',
  'shapes-colors': 'sekiller-renkler',
  'vocabulary': 'kelimeler',
  'thinking-skills': 'dusunme-becerileri',
};

export const reverseSubjectMap: Record<string, string> = Object.entries(subjectMap).reduce(
  (acc, [en, tr]) => ({ ...acc, [tr]: en }),
  {}
);

export const topicMap: Record<string, string> = {
  'farm-animals': 'ciftlik-hayvanlari',
  'winter': 'kis',
  'insects': 'bocekler',
  'food': 'yiyecekler',
  'family': 'aile',
  'body': 'vucut',
  'clothes': 'giysiler',
  'weather': 'hava-durumu',
  'transportation': 'ulasim',
  'spring': 'ilkbahar',
  'summer': 'yaz',
  'fall': 'sonbahar',
  'holidays': 'tatiller',
};

export const reverseTopicMap: Record<string, string> = Object.entries(topicMap).reduce(
  (acc, [en, tr]) => ({ ...acc, [tr]: en }),
  {}
);

export const monthMap: Record<string, string> = {
  'january': 'ocak',
  'february': 'subat',
  'march': 'mart',
  'april': 'nisan',
  'may': 'mayis',
  'june': 'haziran',
  'july': 'temmuz',
  'august': 'agustos',
  'september': 'eylul',
  'october': 'ekim',
  'november': 'kasim',
  'december': 'aralik',
};

export const reverseMonthMap: Record<string, string> = Object.entries(monthMap).reduce(
  (acc, [en, tr]) => ({ ...acc, [tr]: en }),
  {}
);

export const staticPageMap: Record<string, string> = {
  '/': '/tr',
  '/worksheets': '/tr/calisma-sayfalari',
  '/about': '/tr/hakkimizda',
  '/contact': '/tr/iletisim',
  '/games': '/tr/oyunlar',
  '/privacy-policy': '/tr/gizlilik-politikasi',
  '/terms': '/tr/kullanim-kosullari',
  '/cookie-policy': '/tr/cerez-politikasi',
  '/topics': '/tr/konular',
  '/preschool-themes': '/tr/aylik-temalar',
};

export const reverseStaticPageMap: Record<string, string> = Object.entries(staticPageMap).reduce(
  (acc, [en, tr]) => ({ ...acc, [tr]: en }),
  {}
);

export const worksheetSlugMap: Record<string, string> = {
  'letter-a-tracing-and-phonics': 'ingilizce-a-harfi-yazma-etkinligi',
  'counting-1-to-5-ladybug-party': '1-5-sayma-etkinligi-ugurbocegi-lily',
  'winter-odd-one-out-visual-discrimination': 'kis-mevsimi-farkli-olani-bul-etkinligi',
  'farm-animals-esl-vocabulary-and-tracing': 'ciftlik-hayvanlari-eslestirme-ve-kes-yapistir',
};

export const reverseWorksheetSlugMap: Record<string, string> = Object.entries(worksheetSlugMap).reduce(
  (acc, [en, tr]) => ({ ...acc, [tr]: en }),
  {}
);

/**
 * Returns the corresponding route in the other language.
 * Falls back to '/' or '/tr' if no matching route is found.
 */
export function getOppositeLocalePath(pathname: string): string {
  const cleanPath = pathname.replace(/\/+$/, '') || '/';

  // Turkish -> English
  if (cleanPath.startsWith('/tr')) {
    if (cleanPath === '/tr') return '/';
    if (reverseStaticPageMap[cleanPath]) return reverseStaticPageMap[cleanPath];

    // Detail: /tr/calisma-sayfalari/[trSlug]
    const trDetailMatch = cleanPath.match(/^\/tr\/calisma-sayfalari\/([^/]+)$/);
    if (trDetailMatch) {
      const trSlug = trDetailMatch[1];
      // Check subject first
      if (reverseSubjectMap[trSlug]) return `/worksheets/${reverseSubjectMap[trSlug]}`;
      // Check worksheet slug
      if (reverseWorksheetSlugMap[trSlug]) return `/worksheets/${reverseWorksheetSlugMap[trSlug]}`;
      return '/worksheets';
    }

    // Topic: /tr/konular/[trTopic]
    const trTopicMatch = cleanPath.match(/^\/tr\/konular\/([^/]+)$/);
    if (trTopicMatch && reverseTopicMap[trTopicMatch[1]]) {
      return `/topics/${reverseTopicMap[trTopicMatch[1]]}`;
    }

    // Month: /tr/aylik-temalar/[ay]
    const trMonthMatch = cleanPath.match(/^\/tr\/aylik-temalar\/([^/]+)$/);
    if (trMonthMatch && reverseMonthMap[trMonthMatch[1]]) {
      return `/preschool-themes/${reverseMonthMap[trMonthMatch[1]]}`;
    }

    // Annual curriculum: /tr/okul-oncesi-ingilizce-yillik-plan
    if (cleanPath === '/tr/okul-oncesi-ingilizce-yillik-plan') {
      return '/preschool-themes';
    }

    return '/';
  }

  // English -> Turkish
  if (staticPageMap[cleanPath]) return staticPageMap[cleanPath];

  // Old category/slug format redirect handled elsewhere, but match new format:
  // Detail: /worksheets/[slug] (could be subject or worksheet slug)
  const enWsMatch = cleanPath.match(/^\/worksheets\/([^/]+)$/);
  if (enWsMatch) {
    const slug = enWsMatch[1];
    if (subjectMap[slug]) return `/tr/calisma-sayfalari/${subjectMap[slug]}`;
    if (worksheetSlugMap[slug]) return `/tr/calisma-sayfalari/${worksheetSlugMap[slug]}`;
    return '/tr/calisma-sayfalari';
  }

  // Old format: /worksheets/[category]/[slug]
  const oldWsMatch = cleanPath.match(/^\/worksheets\/[^/]+\/([^/]+)$/);
  if (oldWsMatch && worksheetSlugMap[oldWsMatch[1]]) {
    return `/tr/calisma-sayfalari/${worksheetSlugMap[oldWsMatch[1]]}`;
  }

  // Topic: /topics/[topic]
  const enTopicMatch = cleanPath.match(/^\/topics\/([^/]+)$/);
  if (enTopicMatch && topicMap[enTopicMatch[1]]) {
    return `/tr/konular/${topicMap[enTopicMatch[1]]}`;
  }

  // Old themes: /themes/[theme]
  const oldThemeMatch = cleanPath.match(/^\/themes\/([^/]+)$/);
  if (oldThemeMatch && topicMap[oldThemeMatch[1]]) {
    return `/tr/konular/${topicMap[oldThemeMatch[1]]}`;
  }

  // Month: /preschool-themes/[month]
  const enMonthMatch = cleanPath.match(/^\/preschool-themes\/([^/]+)$/);
  if (enMonthMatch && monthMap[enMonthMatch[1]]) {
    return `/tr/aylik-temalar/${monthMap[enMonthMatch[1]]}`;
  }

  return '/tr';
}
