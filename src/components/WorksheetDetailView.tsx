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
  relatedWorksheets: Worksheet[];
}

export function WorksheetDetailView({
  worksheet,
  relatedWorksheets,
}: WorksheetDetailViewProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [showStickyBar, setShowStickyBar] = useState(false);

  const { title, description, quickSummary, teacherNote, whatsInside, faqs } = worksheet;

  const siteUrl = getSiteUrl();
  const currentUrl = `${siteUrl}/worksheets/${worksheet.slug}`;

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

  const breadcrumbItems = [
    { label: 'Worksheets', href: '/worksheets' },
    { label: worksheet.subjectName, href: `/worksheets/${worksheet.subject}` },
    { label: title },
  ];

  return (
    <div className="pb-24">
      {/* Breadcrumb Bar */}
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={breadcrumbItems} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Above the Fold: Desktop 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: 58% (7 cols) - Preview & Page Thumbnails */}
          <div className="lg:col-span-7 space-y-4">
            {/* Primary Large Preview Card */}
            <div className="relative group bg-slate-50/80 rounded-2xl border border-slate-200 overflow-hidden shadow-xs flex items-center justify-center p-4 sm:p-8">
              <div className="relative w-full aspect-[1224/1584] max-w-[560px] mx-auto shadow-md rounded-lg overflow-hidden bg-white">
                <Image
                  src={worksheet.previewImages[selectedImage] || worksheet.previewImages[0]}
                  alt={`${title} - Preview Page ${selectedImage + 1}`}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 560px"
                  className="object-contain"
                />

                {/* Floating Pinterest hover button on desktop */}
                <a
                  href={pinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute top-4 right-4 z-20 hidden group-hover:inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#E60023] hover:bg-[#b8001c] text-white text-xs font-bold rounded-full shadow-lg transition-transform hover:scale-105"
                  title="Save to Pinterest"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Pin</span>
                </a>
              </div>
            </div>

            {/* Thumbnail switcher if multi-page */}
            {worksheet.previewImages.length > 1 && (
              <div className="flex items-center gap-3 pt-2">
                <span className="text-xs text-slate-500 font-medium">Pages:</span>
                <div className="flex gap-2.5">
                  {worksheet.previewImages.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedImage(idx)}
                      className={`relative w-14 h-18 rounded-md overflow-hidden border-2 transition-all ${
                        selectedImage === idx
                          ? 'border-[#2E6B6B] shadow-xs scale-105'
                          : 'border-slate-200 hover:border-slate-300 opacity-70 hover:opacity-100'
                      }`}
                      aria-label={`View page ${idx + 1}`}
                    >
                      <Image
                        src={img}
                        alt={`Thumbnail page ${idx + 1}`}
                        fill
                        className="object-cover"
                      />
                      <span className="absolute bottom-0 inset-x-0 bg-slate-900/70 text-white text-[9px] text-center font-bold py-0.5">
                        P.{idx + 1}
                      </span>
                    </button>
                  ))}
                </div>
                <span className="text-xs text-slate-400 ml-auto hidden sm:inline">
                  Click page thumbnail to switch preview
                </span>
              </div>
            )}

            {/* If 2 pages, display second page below on desktop for complete visual review */}
            {worksheet.previewImages.length > 1 && (
              <div className="hidden lg:block pt-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Page 2 Full Preview
                </h3>
                <div className="relative w-full aspect-[1224/1584] max-w-[560px] mx-auto shadow-sm border border-slate-200 rounded-xl overflow-hidden bg-white p-4">
                  <Image
                    src={worksheet.previewImages[1]}
                    alt={`${title} - Page 2`}
                    fill
                    sizes="560px"
                    className="object-contain p-2"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Right Column: 42% (5 cols) - Sticky Meta & Action Sidebar */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
            <div>
              {/* Badges strip */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#F0F7F7] text-[#2E6B6B] border border-[#d0e3e3]">
                  {worksheet.subjectName}
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                  {worksheet.ages}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                  <Layers className="w-3 h-3 text-slate-500" />
                  <span>
                    {worksheet.pages} {worksheet.pages > 1 ? 'Pages' : 'Page'}
                  </span>
                </span>
              </div>

              {/* Title & 1-sentence summary */}
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-heading leading-tight mb-3">
                {title}
              </h1>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                {quickSummary || description}
              </p>
            </div>

            {/* CTA Action Box */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3.5">
              {/* Primary Full-width Download Button */}
              <a
                href={worksheet.pdfPath}
                download
                className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-xl text-white font-bold text-base bg-[#2E6B6B] hover:bg-[#235353] active:scale-[0.99] transition-all shadow-sm"
              >
                <FileDown className="w-5 h-5" />
                <span>Download free PDF</span>
                <span className="text-xs font-normal opacity-80">({worksheet.pdfFileSize})</span>
              </a>

              {/* Secondary Buttons: Print and Pinterest */}
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 active:scale-[0.98] transition-all"
                >
                  <Printer className="w-4 h-4 text-slate-600" />
                  <span>Print</span>
                </button>

                <a
                  href={pinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-[#E60023] hover:bg-[#c9001f] active:scale-[0.98] transition-all"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Save to Pinterest</span>
                </a>
              </div>

              {/* Trust line */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-center gap-1.5 text-xs text-slate-500 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Free for home &amp; classroom use · No registration required</span>
              </div>
            </div>

            {/* What's Inside Checklist Box */}
            {whatsInside && whatsInside.length > 0 && (
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <Bookmark className="w-3.5 h-3.5 text-[#2E6B6B]" />
                  <span>What&apos;s inside</span>
                </h3>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                  {whatsInside.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2E6B6B] mt-2 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Below the Fold: Single Column Container (Max-W 760px) */}
        <div className="max-w-[760px] mx-auto mt-16 lg:mt-24 space-y-12">
          {/* Section: How to use it / Teacher Notes */}
          <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading">
                How to use this worksheet
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Pedagogical guidance and classroom delivery recommendations for early childhood educators.
              </p>
            </div>

            {/* Learning Goal */}
            <div className="flex items-start gap-3 p-4 rounded-xl bg-[#F0F7F7] border border-[#d0e3e3]">
              <Target className="w-5 h-5 text-[#2E6B6B] shrink-0 mt-0.5" />
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#2E6B6B] mb-1">
                  Learning Goal
                </h3>
                <p className="text-sm text-slate-800 font-medium">
                  {teacherNote.learningGoal}
                </p>
              </div>
            </div>

            {/* 1-2-3 Delivery Steps */}
            {teacherNote.steps && teacherNote.steps.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-900">
                  Recommended Steps (1-2-3)
                </h3>
                <ol className="space-y-2.5">
                  {teacherNote.steps.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-slate-700">
                      <span className="w-6 h-6 rounded-full bg-slate-100 text-[#2E6B6B] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 border border-slate-200">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* Teaching Tip */}
            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 mb-1 flex items-center gap-1">
                  <span>Teacher Tip</span>
                </h4>
                <p className="text-xs sm:text-sm text-amber-950 leading-relaxed">
                  {teacherNote.teachingTip}
                </p>
              </div>
            </div>

            {/* Extension Activity */}
            <div className="pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Extension Activity
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                {teacherNote.extensionActivity}
              </p>
            </div>
          </section>

          {/* Ad Slot 1 (Only displays if client ID configured) */}
          <div className="my-6">
            <AdUnit slotType="in-content" />
          </div>

          {/* Vocabulary Tags Section */}
          {worksheet.vocabulary && worksheet.vocabulary.length > 0 && (
            <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900 font-heading">
                  Vocabulary Focus
                </h3>
                <span className="text-xs font-semibold text-slate-500">
                  {worksheet.vocabulary.length} words
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {worksheet.vocabulary.map((vocab, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200"
                  >
                    {vocab}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Next in Series / Topic Section */}
          {worksheet.series && (
            <div className="p-5 rounded-2xl bg-gradient-to-r from-[#F0F7F7] to-white border border-[#d0e3e3] flex items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#2E6B6B]">
                  Curriculum Series
                </span>
                <h4 className="text-base font-bold text-slate-900 mt-0.5">
                  {worksheet.series.name} (Part {worksheet.series.order} of {worksheet.series.total || 26})
                </h4>
              </div>
              <Link
                href="/worksheets/alphabet"
                className="inline-flex items-center gap-1 text-xs font-bold text-[#2E6B6B] hover:underline shrink-0"
              >
                <span>View Full Series</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}

          {/* Frequently Asked Questions */}
          {faqs && faqs.length > 0 && (
            <section className="space-y-4">
              <FAQAccordion
                items={faqs}
                title="Frequently Asked Questions"
              />
            </section>
          )}

          {/* Author Box */}
          <AuthorBox isCompact={false} />

          {/* Save to Pinterest Section */}
          <section className="p-6 rounded-2xl bg-[#FFF5F5] border border-red-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <h4 className="text-base font-bold text-slate-900">
                Save this printable for later
              </h4>
              <p className="text-xs text-slate-600">
                Pin this worksheet to your classroom or homeschooling boards on Pinterest.
              </p>
            </div>
            <a
              href={pinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#E60023] hover:bg-[#b8001c] text-white text-xs font-bold rounded-xl shadow-xs transition-colors shrink-0"
            >
              <Share2 className="w-4 h-4" />
              <span>Save to Pinterest</span>
            </a>
          </section>

          {/* Related Worksheets Section */}
          {relatedWorksheets && relatedWorksheets.length > 0 && (
            <section className="space-y-6 pt-6 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 font-heading">
                    Related Worksheets
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Explore more classroom-ready printables for this age group and subject.
                  </p>
                </div>
                <Link
                  href="/worksheets"
                  className="text-xs font-bold text-[#2E6B6B] hover:underline"
                >
                  View all →
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {relatedWorksheets.slice(0, 2).map((rel) => (
                  <WorksheetCard key={rel.slug} worksheet={rel} />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      {/* Mobile Scroll-Activated Sticky Bottom Download Bar */}
      {showStickyBar && (
        <div className="lg:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 z-50 shadow-2xl flex items-center justify-between gap-3 animate-in slide-in-from-bottom duration-200">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-slate-900 truncate">{title}</p>
            <p className="text-[10px] text-slate-500">{worksheet.pages}p · Free PDF</p>
          </div>
          <a
            href={worksheet.pdfPath}
            download
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#2E6B6B] hover:bg-[#235353] text-white text-xs font-bold rounded-lg shrink-0 shadow-xs"
          >
            <FileDown className="w-4 h-4" />
            <span>Download PDF</span>
          </a>
        </div>
      )}
    </div>
  );
}
