import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { months } from '@/data/months';
import { topics } from '@/data/topics';
import { getWorksheetsByMonth } from '@/data/worksheets';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { monthMap } from '@/i18n/routes';
import { getSiteUrl } from '@/config/site';
import { Calendar, ArrowRight } from 'lucide-react';

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: 'Aylık Okul Öncesi İngilizce Temalar (12 Aylık Plan) | KinderESL',
  description:
    'Okul öncesi ve anaokulu İngilizce müfredatına göre hazırlanmış 12 aylık tema ve etkinlik takvimi. Her ay için ücretsiz PDF çalışma kağıtları.',
  alternates: {
    canonical: `${siteUrl}/tr/aylik-temalar`,
    languages: {
      en: `${siteUrl}/preschool-themes`,
      tr: `${siteUrl}/tr/aylik-temalar`,
      'x-default': `${siteUrl}/preschool-themes`,
    },
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function TurkishMonthlyThemesPage() {
  return (
    <div>
      <div className="bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: 'Aylık Temalar' }]} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14 space-y-10">
        <div className="max-w-3xl space-y-3">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-heading">
            Aylık Okul Öncesi İngilizce Temalar
          </h1>
          <p className="text-base text-slate-600 leading-relaxed font-normal">
            Okul öncesi ve anaokulu İngilizce eğitiminde yıl boyu uygulayabileceğiniz 12 aylık tematik müfredat planı ve etkinlik önerileri.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {months.map((m) => {
            const count = getWorksheetsByMonth(m.monthNumber).length;
            const trSlug = monthMap[m.slug] || m.slug;
            const monthTopics = topics.filter((t) => m.topicSlugs.includes(t.slug));

            return (
              <Link
                key={m.slug}
                href={`/tr/aylik-temalar/${trSlug}`}
                className="group p-6 rounded-2xl border border-slate-200/80 hover:border-[#2E6B6B] hover:shadow-md transition-all bg-white flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-[#2E6B6B] uppercase tracking-wider">
                      {m.season === 'Winter'
                        ? 'Kış'
                        : m.season === 'Spring'
                        ? 'İlkbahar'
                        : m.season === 'Summer'
                        ? 'Yaz'
                        : 'Sonbahar'}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      {count} etkinlik
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-[#2E6B6B] transition-colors mb-2 font-heading">
                    {m.name === 'January'
                      ? 'Ocak'
                      : m.name === 'February'
                      ? 'Şubat'
                      : m.name === 'March'
                      ? 'Mart'
                      : m.name === 'April'
                      ? 'Nisan'
                      : m.name === 'May'
                      ? 'Mayıs'
                      : m.name === 'June'
                      ? 'Haziran'
                      : m.name === 'July'
                      ? 'Temmuz'
                      : m.name === 'August'
                      ? 'Ağustos'
                      : m.name === 'September'
                      ? 'Eylül'
                      : m.name === 'October'
                      ? 'Ekim'
                      : m.name === 'November'
                      ? 'Kasım'
                      : 'Aralık'}{' '}
                    Temaları
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {m.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {monthTopics.map((t) => (
                      <span
                        key={t.slug}
                        className="px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200 text-[11px] text-slate-600 font-medium"
                      >
                        {t.title}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-[#2E6B6B] font-bold">
                  <span>Etkinlikleri Gör</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
