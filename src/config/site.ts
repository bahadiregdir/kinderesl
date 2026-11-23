import siteSettingsData from '@/data/site-settings.json';
import type { SiteSettings } from '@/types/worksheet';

const siteSettings = siteSettingsData as SiteSettings;

export function getContactEmail(): string {
  const envEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL;
  if (envEmail && envEmail.trim() !== '') {
    return envEmail.trim();
  }
  if (siteSettings.contactEmail && siteSettings.contactEmail.trim() !== '') {
    return siteSettings.contactEmail.trim();
  }
  return '[BURAYA GERÇEK E-POSTA]';
}

export function resolveContactEmail(settingsEmail?: string): string {
  const trimmed = settingsEmail?.trim();
  if (trimmed && trimmed.includes('@') && !trimmed.includes('BURAYA')) {
    return trimmed;
  }
  return getContactEmail();
}

export function getSiteUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (envUrl && envUrl.trim() !== '') {
    return envUrl.replace(/\/+$/, '');
  }
  const vercelProdUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercelProdUrl && vercelProdUrl.trim() !== '') {
    return `https://${vercelProdUrl.replace(/\/+$/, '')}`;
  }
  return 'https://kinderesl.com';
}

export function toAbsoluteAssetUrl(assetPath: string, siteUrl: string): string {
  if (!assetPath) return '';
  if (assetPath.startsWith('http://') || assetPath.startsWith('https://')) {
    return assetPath;
  }
  const normalizedPath = assetPath.startsWith('/') ? assetPath : `/${assetPath}`;
  return `${siteUrl.replace(/\/+$/, '')}${normalizedPath}`;
}

export const siteConfig = {
  name: 'KinderESL',
  legalName: 'KinderESL Educational Resources',
  domain: 'kinderesl.com',
  get url() {
    return getSiteUrl();
  },
  get contactEmail() {
    return getContactEmail();
  },
  tagline: 'Free Printable Resources for Preschool, Kindergarten & ESL Educators',
  description:
    'Free printable PDF worksheets, phonics packs, and ESL vocabulary sets for preschool and kindergarten teachers and homeschooling parents. US Letter & A4.',

  author: siteSettings.author,

  pinterest: {
    handle: siteSettings.pinterest.handle,
    url: siteSettings.pinterest.url,
    verificationToken:
      process.env.NEXT_PUBLIC_PINTEREST_VERIFICATION?.trim() ||
      siteSettings.pinterest.verificationToken ||
      '',
  },

  adsense: {
    client:
      process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID?.trim() ||
      siteSettings.adsense.client ||
      '',
    enabled: siteSettings.adsense.enabled,
    slots: siteSettings.adsense.slots,
    rewardedAdEnabled: siteSettings.adsense.rewardedAdEnabled,
  },

  analytics: {
    ga4MeasurementId:
      process.env.NEXT_PUBLIC_GA4_ID?.trim() ||
      siteSettings.analytics?.ga4MeasurementId ||
      '',
  },
};
