import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { getAllWorksheets } from '@/data/worksheets';
import { subjects } from '@/data/subjects';
import { WorksheetsCatalog } from '@/components/WorksheetsCatalog';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { getSiteUrl } from '@/config/site';

const siteUrl = getSiteUrl();
const canonicalUrl = `${siteUrl}/tr/calisma-sayfalari`;

export const metadata: Metadata = {
  title: 'Okul Öncesi İngilizce Etkinlik ve Çalışma Kağıtları PDF | KinderESL',
  description:
    'Okul öncesi ve anaokulu öğretmenleri için ücretsiz indirilebilir İngilizce etkinlik pdf arşivi. Harf çizgi çalışmaları, sayılar ve kelime setleri.',
  alternates: {
    canonical: canonicalUrl,
    languages: {
      en: `${siteUrl}/worksheets`,
      tr: canonicalUrl,
      'x-default': `${siteUrl}/worksheets`,
    },
  },
  openGraph: {
    title: 'Okul Öncesi İngilizce Çalışma Kağıtları PDF',
    description:
      'Okul öncesi ve anaokulu için ücretsiz indirilebilir İngilizce boyama, çizgi ve sayma etkinlikleri.',
    url: canonicalUrl,
    type: 'website',
    locale: 'tr_TR',
  },
};

export default function TurkishWorksheetsCatalogPage() {
  const worksheets = getAllWorksheets();

  return (
    <div>
      {/* Breadcrumbs */}
      <div className="bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: 'Ana Sayfa', href: '/tr' },
              { label: 'Çalışma Sayfaları' },
            ]}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14 space-y-10">
        {/* Page Header */}
        <div className="max-w-3xl space-y-3">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-heading">
            Okul Öncesi İngilizce Çalışma Kağıtları (Ücretsiz PDF)
          </h1>
          <p className="text-base text-slate-600 leading-relaxed font-normal">
            Okul öncesi, anaokulu ve evde İngilizce eğitimi için dikkat dağıtmayan, mürekkep dostu yazdırılabilir PDF etkinlikleri. Konuya, yaşa veya etkinlik türüne göre filtreleyin.
          </p>
        </div>

        {/* Client-Side Interactive Catalog with instant search and filter */}
        <Suspense
          fallback={
            <div className="py-20 text-center text-slate-400">Çalışma kağıtları yükleniyor...</div>
          }
        >
          <WorksheetsCatalog worksheets={worksheets} subjects={subjects} locale="tr" />
        </Suspense>
      </div>
    </div>
  );
}
