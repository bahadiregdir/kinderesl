import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  getAllWorksheets,
  getWorksheetByTurkishSlug,
  getWorksheetsBySubject,
  getRelatedWorksheets,
} from '@/data/worksheets';
import { subjects, getSubjectBySlug } from '@/data/subjects';
import { isIndexableCollection, WorksheetSubject } from '@/types/worksheet';
import { WorksheetDetailView } from '@/components/WorksheetDetailView';
import { WorksheetCard } from '@/components/WorksheetCard';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { FAQAccordion } from '@/components/FAQAccordion';
import { getSiteUrl } from '@/config/site';
import { reverseSubjectMap, subjectMap } from '@/i18n/routes';
import {
  BookOpen,
  Sparkles,
  ArrowRight,
  Clock,
  Info,
} from 'lucide-react';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  // 1. Turkish subject slugs
  const subjectSlugs = Object.values(subjectMap).map((slug) => ({ slug }));

  // 2. Turkish worksheet slugs
  const worksheetSlugs = getAllWorksheets()
    .filter((w) => w.i18n?.tr?.slug)
    .map((w) => ({ slug: w.i18n!.tr!.slug }));

  return [...subjectSlugs, ...worksheetSlugs];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const siteUrl = getSiteUrl();

  // 1. Is it a Turkish Subject?
  const enSubjectKey = reverseSubjectMap[slug] as WorksheetSubject | undefined;
  if (enSubjectKey) {
    const subject = getSubjectBySlug(enSubjectKey);
    if (subject) {
      const subjectWorksheets = getWorksheetsBySubject(enSubjectKey);
      const isIndexable = isIndexableCollection(subjectWorksheets.length);
      const pageUrl = `${siteUrl}/tr/calisma-sayfalari/${slug}`;
      const enUrl = `${siteUrl}/worksheets/${subject.slug}`;

      return {
        title: `${subject.title} (Türkçe) | KinderESL`,
        description: subject.description,
        alternates: {
          canonical: pageUrl,
          languages: {
            en: enUrl,
            tr: pageUrl,
            'x-default': enUrl,
          },
        },
        openGraph: {
          title: `${subject.title} | Okul Öncesi İngilizce`,
          description: subject.description,
          url: pageUrl,
          type: 'website',
          locale: 'tr_TR',
        },
        robots: isIndexable
          ? { index: true, follow: true }
          : { index: false, follow: true },
      };
    }
  }

  // 2. Is it a Turkish Worksheet?
  const worksheet = getWorksheetByTurkishSlug(slug);
  if (worksheet && worksheet.i18n?.tr) {
    const trData = worksheet.i18n.tr;
    const pageUrl = `${siteUrl}/tr/calisma-sayfalari/${trData.slug}`;
    const enUrl = `${siteUrl}/worksheets/${worksheet.slug}`;

    return {
      title: `${trData.title} | Ücretsiz İndirilebilir PDF`,
      description: trData.description,
      alternates: {
        canonical: pageUrl,
        languages: {
          en: enUrl,
          tr: pageUrl,
          'x-default': enUrl,
        },
      },
      openGraph: {
        title: trData.title,
        description: trData.description,
        url: pageUrl,
        type: 'article',
        publishedTime: `${worksheet.datePublished}T00:00:00.000Z`,
        modifiedTime: `${worksheet.dateModified}T00:00:00.000Z`,
        locale: 'tr_TR',
        images: [
          {
            url: `${siteUrl}${worksheet.previewImages[0]}`,
            width: 1224,
            height: 1584,
            alt: `${trData.title} PDF Önizleme`,
          },
        ],
      },
      robots: trData.reviewed
        ? { index: true, follow: true }
        : { index: false, follow: true },
    };
  }

  return { title: 'Sayfa Bulunamadı' };
}

export default async function TurkishWorksheetOrSubjectPage({ params }: PageProps) {
  const { slug } = await params;
  const siteUrl = getSiteUrl();

  // 1. Turkish Subject Check
  const enSubjectKey = reverseSubjectMap[slug] as WorksheetSubject | undefined;
  if (enSubjectKey) {
    const subject = getSubjectBySlug(enSubjectKey);
    if (subject) {
      const subjectWorksheets = getWorksheetsBySubject(enSubjectKey);
      const otherWorksheets = getAllWorksheets()
        .filter((w) => w.subject !== enSubjectKey)
        .slice(0, 2);

      const alphabetLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

      return (
        <div>
          <div className="bg-slate-50 border-b border-slate-200/80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <Breadcrumbs
                items={[
                  { label: 'Çalışma Sayfaları', href: '/tr/calisma-sayfalari' },
                  { label: subject.title },
                ]}
              />
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14 space-y-12">
            <div className="max-w-3xl space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#F0F7F7] text-[#2E6B6B] border border-[#d0e3e3]">
                <Sparkles className="w-3.5 h-3.5 text-[#F2B544]" />
                <span>{subject.targetAges}</span>
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-heading">
                {subject.title}
              </h1>
              <p className="text-base text-slate-600 leading-relaxed">
                {subject.description}
              </p>
            </div>

            {/* A–Z Harf Seçici (Alfabe için) */}
            {enSubjectKey === 'alphabet' && (
              <div className="p-6 rounded-2xl bg-white border border-slate-200/90 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-heading">
                    Haftanın Harfi A–Z Seçici
                  </h3>
                  <span className="text-xs text-slate-500">26 Harflik İngilizce Serisi</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {alphabetLetters.map((letter) => {
                    const hasWorksheet = letter === 'A';
                    return hasWorksheet ? (
                      <Link
                        key={letter}
                        href="/tr/calisma-sayfalari/ingilizce-a-harfi-yazma-etkinligi"
                        className="w-9 h-9 rounded-lg bg-[#2E6B6B] text-white text-sm font-bold flex items-center justify-center shadow-xs transition-transform hover:scale-105"
                        title={`İngilizce ${letter} Harfi Yazma Etkinliği`}
                      >
                        {letter}
                      </Link>
                    ) : (
                      <span
                        key={letter}
                        className="w-9 h-9 rounded-lg bg-slate-100 text-slate-400 text-sm font-bold flex items-center justify-center cursor-not-allowed select-none"
                        title={`${letter} harfi yakında`}
                      >
                        {letter}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Mevcut Çalışma Sayfaları */}
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
                <h2 className="text-xl font-bold text-slate-900 font-heading">
                  Mevcut Etkinlikler ({subjectWorksheets.length})
                </h2>
                <span className="text-xs text-slate-500">Ücretsiz PDF İndir</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {subjectWorksheets.map((ws) => (
                  <WorksheetCard key={ws.slug} worksheet={ws} locale="tr" />
                ))}
              </div>
            </div>

            {/* 6'dan Az İçerik Durumu: Yakında Eklenecek Başlıklar + İlgili Materyaller */}
            {subjectWorksheets.length < 6 && (
              <div className="space-y-8 pt-4">
                <div className="p-6 sm:p-8 rounded-2xl bg-[#F0F7F7]/60 border border-[#d0e3e3] space-y-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#2E6B6B]" />
                    <h3 className="text-base font-bold text-slate-900 font-heading">
                      Bu Konuda Yakında Eklenecek Etkinlikler
                    </h3>
                  </div>
                  <p className="text-xs text-slate-600">
                    Eğitim ekibimiz şu anda bu kategori için yeni çalışma kağıtları hazırlamaktadır:
                  </p>
                  <ul className="space-y-2 text-xs text-slate-700 font-medium">
                    {subject.plannedTitles.map((planned, idx) => (
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
                          Diğer Konulardan Önerilen Çalışma Kağıtları
                        </h3>
                        <p className="text-xs text-slate-500">
                          Okul öncesi yaş grubuna uygun diğer popüler ücretsiz materyaller:
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

            {/* Konu SSS */}
            {subject.faqs && subject.faqs.length > 0 && (
              <div className="max-w-3xl pt-6">
                <FAQAccordion
                  items={subject.faqs}
                  title={`${subject.shortTitle} Eğitim ve Müfredat SSS`}
                />
              </div>
            )}
          </div>
        </div>
      );
    }
  }

  // 2. Turkish Worksheet Check
  const worksheet = getWorksheetByTurkishSlug(slug);
  if (worksheet && worksheet.i18n?.tr) {
    const trData = worksheet.i18n.tr;
    const relatedWorksheets = getRelatedWorksheets(worksheet, 4);

    const pageUrl = `${siteUrl}/tr/calisma-sayfalari/${trData.slug}`;
    const learningResourceSchema = {
      '@context': 'https://schema.org',
      '@type': 'LearningResource',
      name: trData.title,
      description: trData.description,
      educationalLevel: worksheet.gradeLevel,
      typicalAgeRange: worksheet.ages,
      learningResourceType: 'worksheet',
      inLanguage: 'tr-TR',
      url: pageUrl,
      isAccessibleForFree: true,
      encodingFormat: 'application/pdf',
      datePublished: `${worksheet.datePublished}T00:00:00.000Z`,
      dateModified: `${worksheet.dateModified}T00:00:00.000Z`,
      image: `${siteUrl}${worksheet.previewImages[0]}`,
    };

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(learningResourceSchema),
          }}
        />

        {/* Bilgilendirme Kutusu: Etkinlik İngilizce, Öğretmen Notları Türkçe */}
        <div className="bg-[#F0F7F7] border-b border-[#d0e3e3] py-2 px-4 text-center text-xs text-[#2E6B6B] font-semibold flex items-center justify-center gap-1.5">
          <Info className="w-3.5 h-3.5 shrink-0" />
          <span>
            Etkinlik sayfası İngilizcedir; öğretmen ve veli kılavuz notları Türkçedir.
          </span>
        </div>

        <WorksheetDetailView
          worksheet={worksheet}
          locale="tr"
          relatedWorksheets={relatedWorksheets}
        />
      </>
    );
  }

  notFound();
}
