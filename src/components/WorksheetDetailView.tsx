'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Worksheet } from '@/types/worksheet';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { AuthorBox } from '@/components/AuthorBox';
import { FAQAccordion } from '@/components/FAQAccordion';
import { AdUnit } from '@/components/AdUnit';
import { WorksheetCard } from '@/components/WorksheetCard';
import { getSiteUrl } from '@/config/site';
import {
  FileDown,
  Printer,
  CheckCircle2,
  Share2,
  Sparkles,
  ArrowRight,
  BookOpen,
  Layers,
  HelpCircle,
  Lightbulb,
  Target,
  Bookmark,
} from 'lucide-react';

interface WorksheetDetailViewProps {
  worksheet: Worksheet;
  locale?: 'en' | 'tr';
  relatedWorksheets: Worksheet[];
}

export function WorksheetDetailView({
  worksheet,
  locale = 'en',
  relatedWorksheets,
}: WorksheetDetailViewProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [showStickyBar, setShowStickyBar] = useState(false);

  const isTr = locale === 'tr';
  const tr = worksheet.i18n?.tr;

  const title = isTr && tr ? tr.title : worksheet.title;
  const description = isTr && tr ? tr.description : worksheet.description;
  const quickSummary = isTr && tr ? tr.quickSummary : worksheet.quickSummary;
  const teacherNote = isTr && tr ? tr.teacherNote : worksheet.teacherNote;
  const whatsInside = isTr && tr ? tr.whatsInside : worksheet.whatsInside;
  const faqs = isTr && tr ? tr.faqs : worksheet.faqs;

  const siteUrl = getSiteUrl();
  const currentUrl = isTr && tr
    ? `${siteUrl}/tr/calisma-sayfalari/${tr.slug}`
    : `${siteUrl}/worksheets/${worksheet.slug}`;

  // Pinterest URL
  const pinMediaUrl = `${siteUrl}${worksheet.pinterestPinImage}`;
  const pinDescription = encodeURIComponent(
    `${title} - Free printable PDF for preschool and kindergarten teachers.`
  );
  const pinUrl = `https://www.pinterest.com/pin/create/button/?url=${encodeURIComponent(
    currentUrl
  )}&media=${encodeURIComponent(pinMediaUrl)}&description=${pinDescription}`;

  // Scroll detection for mobile sticky download bar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 480) {
        setShowStickyBar(true);
      } else {
        setShowStickyBar(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handlePrint = () => {
    const printWindow = window.open(worksheet.pdfPath, '_blank');
    if (printWindow) {
      printWindow.focus();
    }
  };

  const breadcrumbItems = isTr
    ? [
        { label: 'Çalışma Sayfaları', href: '/tr/calisma-sayfalari' },
        { label: worksheet.subjectName, href: `/tr/calisma-sayfalari/${worksheet.subject}` },
        { label: title },
      ]
    : [
        { label: 'Worksheets', href: '/worksheets' },
        { label: worksheet.subjectName, href: `/worksheets/${worksheet.subject}` },
        { label: title },
      ];

  return (
    <div className="pb-24">
      {/* Breadcrumb Bar */}
      <div className="bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={breadcrumbItems} />
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {/* ABOVE THE FOLD: 2-Column Desktop Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column (58% / 7 cols): Large Preview & Thumbnails */}
          <div className="lg:col-span-7">
            {/* Primary Large Preview Card */}
            <div className="relative group bg-slate-50 rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm aspect-[1224/1584]">
              <Image
                src={worksheet.previewImages[selectedImage] || worksheet.previewImages[0]}
                alt={`${title} - Page ${selectedImage + 1} Preview`}
                fill
                priority
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 58vw, 650px"
                className="object-contain p-4 sm:p-6"
              />

              {/* Hover Pinterest Pin Button (top-right of preview) */}
              <a
                href={pinUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Save this worksheet to Pinterest"
                className="absolute top-4 right-4 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-200 z-20"
              >
                <Bookmark className="w-3.5 h-3.5 fill-white" />
                <span>Save</span>
              </a>

              {/* Page Number Indicator */}
              {worksheet.pages > 1 && (
                <div className="absolute bottom-4 right-4 px-2.5 py-1 rounded-md bg-slate-900/80 text-white text-[11px] font-semibold backdrop-blur-xs">
                  {selectedImage + 1} / {worksheet.pages}
                </div>
              )}
            </div>

            {/* Thumbnail Row (if 2+ pages) */}
            {worksheet.pages > 1 && (
              <div className="flex items-center gap-3 mt-4">
                {worksheet.previewImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImage(idx)}
                    className={`relative w-20 aspect-[1224/1584] rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === idx
                        ? 'border-[#2E6B6B] ring-2 ring-[#2E6B6B]/20 scale-102'
                        : 'border-slate-200 hover:border-slate-300 opacity-80'
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`Thumbnail page ${idx + 1}`}
                      fill
                      sizes="80px"
                      className="object-contain p-1 bg-slate-50"
                    />
                  </button>
                ))}
                <span className="text-xs text-slate-500 font-medium ml-2">
                  {isTr ? 'Önizlemek için sayfaya tıklayın' : 'Click page thumbnail to switch preview'}
                </span>
              </div>
            )}
          </div>

          {/* Right Column (42% / 5 cols): Sticky Action Column */}
          <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-5">
            {/* Subject badge */}
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#F0F7F7] text-[#2E6B6B] border border-[#d0e3e3]">
                <Sparkles className="w-3 h-3 text-[#F2B544]" />
                <span>{worksheet.subjectName}</span>
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {worksheet.ages}
              </span>
            </div>

            {/* H1 Title */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight font-heading">
              {title}
            </h1>

            {/* 1-Sentence Quick Summary */}
            <p className="text-sm text-slate-600 leading-relaxed font-normal">
              {quickSummary}
            </p>

            {/* Attribute Badges */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-medium">
                {worksheet.ages}
              </span>
              <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-medium">
                {worksheet.pages} {worksheet.pages > 1 ? (isTr ? 'Sayfa' : 'Pages') : (isTr ? 'Sayfa' : 'Page')}
              </span>
              <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-medium">
                US Letter
              </span>
              <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-medium">
                {worksheet.subjectName}
              </span>
              {worksheet.topics[0] && (
                <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-medium capitalize">
                  {worksheet.topics[0].replace('-', ' ')}
                </span>
              )}
            </div>

            {/* Primary Action Button: Large Full Width */}
            <div className="pt-2 space-y-2.5">
              <a
                href={worksheet.pdfPath}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl bg-[#2E6B6B] hover:bg-[#225151] text-white font-bold text-base shadow-sm hover:shadow-md transition-all group"
              >
                <FileDown className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>
                  {isTr ? 'Ücretsiz PDF İndir' : 'Download free PDF'}
                </span>
                <span className="text-xs font-normal opacity-90">
                  ({worksheet.pdfFileSize})
                </span>
              </a>

              {/* Secondary Buttons Row: Print & Pinterest */}
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors"
                >
                  <Printer className="w-4 h-4 text-slate-500" />
                  <span>{isTr ? 'Yazdır' : 'Print'}</span>
                </button>

                <a
                  href={pinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-red-200 hover:bg-red-50 text-red-700 text-xs font-bold transition-colors"
                >
                  <Bookmark className="w-4 h-4 fill-red-600 text-red-600" />
                  <span>{isTr ? "Pinterest'e Kaydet" : 'Save to Pinterest'}</span>
                </a>
              </div>

              {/* Trust Signal Line */}
              <p className="text-center text-[11px] text-slate-500 font-medium pt-1 flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>
                  {isTr
                    ? 'Sınıf ve ev kullanımı için ücretsizdir · Kayıt gerekmez'
                    : 'Free for classroom & home use · no sign-up required'}
                </span>
              </p>
            </div>

            {/* What's Inside Box */}
            {whatsInside && whatsInside.length > 0 && (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 mt-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-heading">
                  {isTr ? 'İçerikte Neler Var?' : "What's inside"}
                </h3>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  {whatsInside.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-[#2E6B6B] font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* BELOW THE FOLD: Single Column (max-w 760px) */}
        <div className="max-w-[760px] mx-auto mt-16 lg:mt-24 space-y-14">
          {/* Section 1: How to use it (Teacher Notes) */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
              <BookOpen className="w-5 h-5 text-[#2E6B6B]" />
              <h2 className="text-xl font-bold text-slate-900 font-heading">
                {isTr ? 'Öğretmen ve Veli Kılavuzu' : 'How to use this worksheet'}
              </h2>
            </div>

            {/* Goal */}
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#2E6B6B]">
                {isTr ? 'Öğrenme Hedefi' : 'Learning Goal'}
              </span>
              <p className="text-sm text-slate-700 leading-relaxed font-medium">
                {teacherNote.learningGoal}
              </p>
            </div>

            {/* Steps (1-2-3) */}
            {teacherNote.steps && teacherNote.steps.length > 0 && (
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  {isTr ? 'Uygulama Adımları (1-2-3)' : 'Recommended Steps (1-2-3)'}
                </span>
                <ol className="space-y-2.5 text-sm text-slate-600">
                  {teacherNote.steps.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-[#F0F7F7] text-[#2E6B6B] text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 border border-[#d0e3e3]">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* Teaching Tip */}
            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                <Lightbulb className="w-4 h-4 text-amber-700" />
                <span>{isTr ? 'Öğretmen İpucu' : 'Teacher Tip'}</span>
              </div>
              <p className="text-xs text-amber-800 leading-relaxed">
                {teacherNote.teachingTip}
              </p>
            </div>

            {/* Extension Activity */}
            <div className="space-y-1 pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                {isTr ? 'Geliştirme & İleri Düzey Etkinlik' : 'Extension Activity'}
              </span>
              <p className="text-xs text-slate-600 leading-relaxed">
                {teacherNote.extensionActivity}
              </p>
            </div>
          </section>

          {/* Ad Slot 1: Far down, >= 1 full viewport below download button */}
          <div className="py-2">
            <AdUnit slotType="in-content" />
          </div>

          {/* Section 2: English Words in this Worksheet */}
          {worksheet.vocabulary && worksheet.vocabulary.length > 0 && (
            <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-lg font-bold text-slate-900 font-heading">
                  {isTr
                    ? 'Bu Çalışma Sayfasındaki İngilizce Kelimeler'
                    : 'English words in this worksheet'}
                </h3>
                <span className="text-xs text-slate-500">
                  {worksheet.vocabulary.length} {isTr ? 'kelime' : 'words'}
                </span>
              </div>

              {isTr && tr?.vocabularyWithTranslations ? (
                <div className="flex flex-wrap gap-2">
                  {tr.vocabularyWithTranslations.map((item, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800"
                    >
                      <strong className="text-[#2E6B6B]">{item.en}</strong>
                      <span className="text-slate-400">–</span>
                      <span>{item.tr}</span>
                    </span>
                  ))}
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {worksheet.vocabulary.map((word, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-bold text-[#2E6B6B]"
                    >
                      {word}
                    </span>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* Section 3: Next in the Series / More in this Topic */}
          {worksheet.series && (
            <section className="bg-gradient-to-r from-[#F0F7F7] to-white border border-[#d0e3e3] rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#2E6B6B]">
                  {worksheet.series.name} (Part {worksheet.series.order} of {worksheet.series.total || 26})
                </span>
                <h4 className="text-base font-bold text-slate-900 font-heading">
                  {isTr
                    ? 'Serideki Diğer Harfler ve Etkinlikler'
                    : 'Continue with the Next Letter in the Series'}
                </h4>
                <p className="text-xs text-slate-600">
                  {isTr
                    ? 'Müfredat sıralamasına göre harf çizgi ve fonetik serisi.'
                    : 'Follow our structured stroke progression from A through Z.'}
                </p>
              </div>

              {worksheet.series.nextSlug && (
                <Link
                  href={isTr ? '/tr/calisma-sayfalari/alfabe' : '/worksheets/alphabet'}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2E6B6B] hover:bg-[#225151] text-white text-xs font-bold transition-colors shrink-0"
                >
                  <span>{isTr ? 'Tüm Seriyi Gör' : 'View Full Series'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </section>
          )}

          {/* Section 4: FAQ Accordion */}
          {faqs && faqs.length > 0 && (
            <section>
              <FAQAccordion
                items={faqs}
                title={isTr ? 'Sıkça Sorulan Sorular' : 'Frequently Asked Questions'}
              />
            </section>
          )}

          {/* Section 5: Author Box */}
          <section>
            <AuthorBox isCompact={false} />
          </section>

          {/* Section 6: Pinterest Save Banner */}
          <section className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6">
            <div className="relative w-28 aspect-[1000/1500] rounded-xl overflow-hidden shadow-md shrink-0 border border-slate-200 bg-white">
              <Image
                src={worksheet.pinterestPinImage}
                alt={`${title} Pinterest Pin`}
                fill
                sizes="112px"
                className="object-cover"
              />
            </div>
            <div className="space-y-2 text-center sm:text-left flex-1">
              <h3 className="text-base font-bold text-slate-900 font-heading">
                {isTr ? 'Daha Sonra Kullanmak İçin Kaydedin' : 'Save this printable for later'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {isTr
                  ? 'Bu etkinliği Pinterest panonuza sabitleyerek okul öncesi sınıf planlarınıza kolayca erişin.'
                  : 'Pin this worksheet to your preschool, kindergarten, or homeschooling board on Pinterest.'}
              </p>
              <div className="pt-2">
                <a
                  href={pinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs transition-colors"
                >
                  <Bookmark className="w-3.5 h-3.5 fill-white" />
                  <span>{isTr ? "Pinterest'e Kaydet" : 'Save to Pinterest'}</span>
                </a>
              </div>
            </div>
          </section>

          {/* Section 7: Related Worksheets */}
          {relatedWorksheets && relatedWorksheets.length > 0 && (
            <section className="space-y-6 pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 font-heading">
                    {isTr ? 'İlgili Çalışma Kağıtları' : 'Related Worksheets'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {isTr
                      ? 'Benzer yaş ve beceri grupları için önerilen ücretsiz materyaller.'
                      : 'Recommended free printables for similar ages and skills.'}
                  </p>
                </div>
                <Link
                  href={isTr ? '/tr/calisma-sayfalari' : '/worksheets'}
                  className="text-xs font-bold text-[#2E6B6B] hover:underline"
                >
                  {isTr ? 'Tümünü Gör →' : 'View all →'}
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {relatedWorksheets.map((r) => (
                  <WorksheetCard key={r.slug} worksheet={r} locale={locale} />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      {/* MOBILE STICKY BOTTOM BAR */}
      {showStickyBar && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 z-40 shadow-2xl animate-in slide-in-from-bottom duration-200">
          <div className="max-w-md mx-auto flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-900 truncate font-heading">
                {title}
              </p>
              <p className="text-[10px] text-slate-500">
                {worksheet.pdfFileSize} · PDF · {worksheet.pages}p
              </p>
            </div>
            <a
              href={worksheet.pdfPath}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#2E6B6B] hover:bg-[#225151] text-white text-xs font-bold shrink-0 shadow-sm transition-colors"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>{isTr ? 'İndir' : 'Download PDF'}</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
