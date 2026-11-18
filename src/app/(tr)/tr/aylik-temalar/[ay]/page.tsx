import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { months, getMonthBySlug } from '@/data/months';
import { topics } from '@/data/topics';
import {
  getAllWorksheets,
  getWorksheetsByMonth,
} from '@/data/worksheets';
import { isIndexableCollection } from '@/types/worksheet';
import { WorksheetCard } from '@/components/WorksheetCard';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { FAQAccordion } from '@/components/FAQAccordion';
import { getSiteUrl } from '@/config/site';
import { reverseMonthMap, monthMap, topicMap } from '@/i18n/routes';
import { Sparkles, ArrowRight, Clock, Calendar } from 'lucide-react';

interface Props {
  params: Promise<{
    ay: string;
  }>;
}

export async function generateStaticParams() {
  return Object.values(monthMap).map((slug) => ({
    ay: slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { ay } = await params;
  const enSlug = reverseMonthMap[ay];
  const m = enSlug ? getMonthBySlug(enSlug) : undefined;

  if (!m) {
    return { title: 'Ay Bulunamadı' };
  }

  const siteUrl = getSiteUrl();
  const pageUrl = `${siteUrl}/tr/aylik-temalar/${ay}`;
  const enUrl = `${siteUrl}/preschool-themes/${m.slug}`;
  const worksheets = getWorksheetsByMonth(m.monthNumber);
  const isIndexable = isIndexableCollection(worksheets.length);

  return {
    title: `${m.name} Ayı Okul Öncesi İngilizce Temalar | KinderESL`,
    description: m.description,
    alternates: {
      canonical: pageUrl,
      languages: {
        en: enUrl,
        tr: pageUrl,
        'x-default': enUrl,
      },
    },
    openGraph: {
      title: `${m.name} Ayı İngilizce Etkinlikleri`,
      description: m.description,
      url: pageUrl,
      type: 'website',
      locale: 'tr_TR',
    },
    robots: isIndexable
      ? { index: true, follow: true }
      : { index: false, follow: true },
  };
}

export default async function TurkishMonthDetailPage({ params }: Props) {
  const { ay } = await params;
  const enSlug = reverseMonthMap[ay];
  const m = enSlug ? getMonthBySlug(enSlug) : undefined;

  if (!m) {
    notFound();
  }

  const worksheets = getWorksheetsByMonth(m.monthNumber);
  const otherWorksheets = getAllWorksheets()
    .filter((w) => !worksheets.some((mw) => mw.id === w.id))
    .slice(0, 2);

  const activeTopics = topics.filter((t) => m.topicSlugs.includes(t.slug));

  return (
    <div>
      <div className="bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: 'Aylık Temalar', href: '/tr/aylik-temalar' },
              { label: `${m.name} Temaları` },
            ]}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14 space-y-12">
        <div className="max-w-3xl space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#F0F7F7] text-[#2E6B6B] border border-[#d0e3e3]">
            <Calendar className="w-3.5 h-3.5 text-[#F2B544]" />
            <span>{m.season} Mevsimi Planı</span>
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-heading">
            {m.name} Ayı Okul Öncesi İngilizce Temalar
          </h1>
          <p className="text-base text-slate-600 leading-relaxed">
            {m.description}
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="text-xs font-bold text-slate-700">İlgili temalar:</span>
            {activeTopics.map((t) => {
              const trTopicSlug = topicMap[t.slug] || t.slug;
              return (
                <Link
                  key={t.slug}
                  href={`/tr/konular/${trTopicSlug}`}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-[#F0F7F7] hover:text-[#2E6B6B] text-xs font-medium text-slate-700 transition-colors"
                >
                  {t.title} →
                </Link>
              );
            })}
          </div>
        </div>

        {/* Mevcut Çalışma Sayfaları */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
            <h2 className="text-xl font-bold text-slate-900 font-heading">
              {m.name} Ayı Etkinlikleri ({worksheets.length})
            </h2>
            <span className="text-xs text-slate-500">Ücretsiz PDF İndir</span>
          </div>

          {worksheets.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {worksheets.map((ws) => (
                <WorksheetCard key={ws.slug} worksheet={ws} locale="tr" />
              ))}
            </div>
          )}
        </div>

        {/* 6'dan az içerik fallback */}
        {worksheets.length < 6 && (
          <div className="space-y-8 pt-4">
            <div className="p-6 sm:p-8 rounded-2xl bg-[#F0F7F7]/60 border border-[#d0e3e3] space-y-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#2E6B6B]" />
                <h3 className="text-base font-bold text-slate-900 font-heading">
                  Bu Konuda Yakında Eklenecek Etkinlikler
                </h3>
              </div>
              <p className="text-xs text-slate-600">
                Eğitim ekibimiz şu anda {m.name} ayı müfredatı için yeni materyaller hazırlamaktadır:
              </p>
              <ul className="space-y-2 text-xs text-slate-700 font-medium">
                {m.plannedTitles.map((planned, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-slate-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2E6B6B]" />
                    <span>{planned}</span>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">
                      (Hazırlanıyor)
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {otherWorksheets.length > 0 && (
              <div className="space-y-6 pt-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 font-heading">
                      Diğer Aylardan Önerilen Çalışma Kağıtları
                    </h3>
                    <p className="text-xs text-slate-500">
                      Okul öncesi için popüler mevsimsel İngilizce eğitim materyalleri:
                    </p>
                  </div>
                  <Link
                    href="/tr/calisma-sayfalari"
                    className="text-xs font-bold text-[#2E6B6B] hover:underline"
                  >
                    Tümünü gör →
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {otherWorksheets.map((ws) => (
                    <WorksheetCard key={ws.slug} worksheet={ws} locale="tr" />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {m.faqs && m.faqs.length > 0 && (
          <div className="max-w-3xl pt-6">
            <FAQAccordion items={m.faqs} title={`${m.name} Ayı Eğitim SSS`} />
          </div>
        )}
      </div>
    </div>
  );
}
