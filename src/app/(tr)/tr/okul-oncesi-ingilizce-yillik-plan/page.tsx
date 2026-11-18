import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { months } from '@/data/months';
import { topics } from '@/data/topics';
import { getWorksheetsByMonth } from '@/data/worksheets';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { monthMap, topicMap } from '@/i18n/routes';
import { getSiteUrl } from '@/config/site';
import {
  Calendar,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  FileDown,
  Sparkles,
} from 'lucide-react';

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: 'Okul Öncesi İngilizce Yıllık Plan (12 Aylık Müfredat Rehberi) | KinderESL',
  description:
    'Okul öncesi ve anaokulu İngilizce öğretmenleri için 12 aylık tematik yıllık plan rehberi. Ay ay kelime hedefleri, mevsimsel üniteler ve ücretsiz indirilebilir PDF etkinlikler.',
  alternates: {
    canonical: `${siteUrl}/tr/okul-oncesi-ingilizce-yillik-plan`,
    languages: {
      en: `${siteUrl}/preschool-themes`,
      tr: `${siteUrl}/tr/okul-oncesi-ingilizce-yillik-plan`,
      'x-default': `${siteUrl}/preschool-themes`,
    },
  },
  openGraph: {
    title: 'Okul Öncesi İngilizce Yıllık Plan (12 Aylık Müfredat Rehberi)',
    description:
      'Okul öncesi ve anaokulu öğretmenleri için hazırlanmış aylık tematik İngilizce yıllık plan ve ücretsiz PDF çalışma kağıtları.',
    url: `${siteUrl}/tr/okul-oncesi-ingilizce-yillik-plan`,
    type: 'article',
    locale: 'tr_TR',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function TurkishAnnualCurriculumPage() {
  // Sort school year order: September (9) through June (6) then summer
  const schoolYearOrder = [9, 10, 11, 12, 1, 2, 3, 4, 5, 6, 7, 8];
  const sortedMonths = schoolYearOrder
    .map((num) => months.find((m) => m.monthNumber === num))
    .filter(Boolean) as typeof months;

  const monthNamesTr: Record<string, string> = {
    january: 'Ocak',
    february: 'Şubat',
    march: 'Mart',
    april: 'Nisan',
    may: 'Mayıs',
    june: 'Haziran',
    july: 'Temmuz',
    august: 'Ağustos',
    september: 'Eylül',
    october: 'Ekim',
    november: 'Kasım',
    december: 'Aralık',
  };

  return (
    <div>
      <div className="bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: 'Aylık Temalar', href: '/tr/aylik-temalar' },
              { label: 'Yıllık Plan' },
            ]}
          />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 space-y-12">
        {/* Header */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-[#F0F7F7] text-[#2E6B6B] border border-[#d0e3e3]">
            <Sparkles className="w-3.5 h-3.5 text-[#F2B544]" />
            <span>Okul Öncesi Öğretmenleri İçin Yıllık Müfredat Kılavuzu</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight font-heading">
            Okul Öncesi İngilizce Yıllık Plan
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
            Türkiye&apos;deki anaokulu ve okul öncesi İngilizce öğretmenleri için Eylül&apos;den Haziran&apos;a kadar 12 aylık tematik ders planı. Her ayın odak kelime grupları, fonetik hedefleri ve sınıfta kullanabileceğiniz ücretsiz çalışma kağıtları.
          </p>
        </div>

        {/* 12-Aylık Plan Tablosu / Akışı */}
        <div className="space-y-6">
          {sortedMonths.map((m) => {
            const trMonthSlug = monthMap[m.slug];
            const monthTopics = topics.filter((t) => m.topicSlugs.includes(t.slug));
            const count = getWorksheetsByMonth(m.monthNumber).length;
            const isSchoolMonth = m.monthNumber >= 9 || m.monthNumber <= 6;

            return (
              <div
                key={m.slug}
                className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 hover:border-[#2E6B6B] hover:shadow-xs transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-xl bg-[#F0F7F7] text-[#2E6B6B] font-bold text-sm flex items-center justify-center shrink-0 border border-[#d0e3e3]">
                      {m.monthNumber}
                    </span>
                    <div>
                      <h2 className="text-xl font-bold text-slate-900 font-heading">
                        {monthNamesTr[m.slug] || m.name} Ayı İngilizce Teması
                      </h2>
                      <span className="text-xs text-slate-500 font-medium">
                        {m.season} Mevsimi {isSchoolMonth ? '· Eğitim Dönemi' : '· Yaz Tatili / Tekrar'}
                      </span>
                    </div>
                  </div>

                  <Link
                    href={`/tr/aylik-temalar/${trMonthSlug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2E6B6B] hover:underline"
                  >
                    <span>Bu Ayın Etkinlikleri ({count})</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <p className="text-sm text-slate-600 leading-relaxed">
                  {m.description}
                </p>

                {/* Temalar ve Planlanan Başlıklar */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                      Önerilen Konular &amp; Kelime Grupları:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {monthTopics.map((t) => {
                        const trTopicSlug = topicMap[t.slug] || t.slug;
                        return (
                          <Link
                            key={t.slug}
                            href={`/tr/konular/${trTopicSlug}`}
                            className="px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 hover:text-[#2E6B6B] hover:bg-[#F0F7F7]"
                          >
                            {t.title}
                          </Link>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                      Sınıf İçi Etkinlik Önerileri:
                    </span>
                    <ul className="text-xs text-slate-600 space-y-1">
                      {m.plannedTitles.slice(0, 2).map((title, idx) => (
                        <li key={idx} className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{title}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Card */}
        <div className="bg-[#F0F7F7] border border-[#d0e3e3] rounded-2xl p-8 text-center space-y-4">
          <h3 className="text-xl font-bold text-slate-900 font-heading">
            Tüm Okul Öncesi İngilizce Çalışma Kağıtlarını İndirin
          </h3>
          <p className="text-sm text-slate-600 max-w-xl mx-auto">
            Sınıfınız için hemen kullanabileceğiniz ücretsiz PDF harf çizgi çalışmaları, rakamlar ve kelime kartlarına arşivimizden ulaşabilirsiniz.
          </p>
          <div className="pt-2">
            <Link
              href="/tr/calisma-sayfalari"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#2E6B6B] hover:bg-[#225151] text-white font-bold text-sm shadow-sm transition-all"
            >
              <FileDown className="w-4 h-4" />
              <span>Çalışma Kağıtları Arşivini Aç</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
