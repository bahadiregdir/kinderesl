'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Worksheet, type SiteSettings } from '@/types/worksheet';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { AuthorBox } from '@/components/AuthorBox';
import { FAQAccordion } from '@/components/FAQAccordion';
import { AdUnit } from '@/components/AdUnit';
import { WorksheetCard } from '@/components/WorksheetCard';
import { PreDownloadModal } from '@/components/PreDownloadModal';
import { NewsletterBox } from '@/components/NewsletterBox';
import { useLessonPack } from '@/context/LessonPackContext';
import { trackEvent } from '@/lib/analytics';
import { getRelatedToolsForWorksheet } from '@/lib/related-tools';
import { getSiteUrl, toAbsoluteAssetUrl } from '@/config/site';
import {
  FileDown,
  Printer,
  CheckCircle2,
  Share2,
  ArrowRight,
  Layers,
  Lightbulb,
  Target,
  Bookmark,
  FolderHeart,
  Check,
  Search,
  ZoomIn,
  X,
  ChevronLeft,
  ChevronRight,
  Link2,
  MessageCircle,
  Wand2,
} from 'lucide-react';

interface WorksheetDetailViewProps {
  worksheet: Worksheet;
  relatedWorksheets: Worksheet[];
  nextInSeriesWorksheet?: Worksheet | null;
  author?: SiteSettings['author'];
}

export function WorksheetDetailView({
  worksheet,
  relatedWorksheets,
  nextInSeriesWorksheet: providedNextInSeries = null,
  author,
}: WorksheetDetailViewProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [paperSize, setPaperSize] = useState<'letter' | 'a4'>('letter');
  const { hasItem, toggleItem } = useLessonPack();
  const inPack = hasItem(worksheet.slug);
  const relatedTools = getRelatedToolsForWorksheet(worksheet);

  const siteUrl = getSiteUrl();
  const currentUrl = `${siteUrl}/worksheets/${worksheet.slug}`;
  const directPdfUrl = toAbsoluteAssetUrl(worksheet.pdfPath, siteUrl);
  const activePdfUrl =
    paperSize === 'a4'
      ? `/api/pdf/a4?slug=${encodeURIComponent(worksheet.slug)}`
      : directPdfUrl;

  const { title, description, quickSummary, teacherNote, whatsInside, faqs } = worksheet;

  // Pinterest URL
  const pinMediaUrl = toAbsoluteAssetUrl(worksheet.pinterestPinImage, siteUrl);
  const pinDescription = encodeURIComponent(
    `${title} - Free printable PDF for preschool and kindergarten teachers.`
  );
  const pinUrl = `https://www.pinterest.com/pin/create/button/?url=${encodeURIComponent(
    currentUrl
  )}&media=${encodeURIComponent(pinMediaUrl)}&description=${pinDescription}`;

  const whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(
    `Free printable preschool worksheet: ${title} (${currentUrl})`
  )}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
    } catch {
      const input = document.createElement('input');
      input.value = currentUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
    }
    setCopied(true);
    trackEvent('worksheet_share', { method: 'copy_link', slug: worksheet.slug });
    setTimeout(() => setCopied(false), 2500);
  };

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightboxOpen(false);
      } else if (e.key === 'ArrowRight' && worksheet.previewImages.length > 1) {
        setSelectedImage((i) => (i + 1) % worksheet.previewImages.length);
      } else if (e.key === 'ArrowLeft' && worksheet.previewImages.length > 1) {
        setSelectedImage((i) =>
          (i - 1 + worksheet.previewImages.length) % worksheet.previewImages.length
        );
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [lightboxOpen, worksheet.previewImages.length]);

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
    trackEvent('worksheet_print', { slug: worksheet.slug, subject: worksheet.subject, paperSize });
    fetch('/api/analytics/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'download', slug: worksheet.slug }),
      keepalive: true,
    }).catch(() => {});
    const printWindow = window.open(activePdfUrl, '_blank');
    if (printWindow) {
      printWindow.focus();
    }
  };

  const breadcrumbItems = [
    { label: 'Worksheets', href: '/worksheets' },
    { label: worksheet.subjectName, href: `/worksheets/${worksheet.subject}` },
    { label: title },
  ];

  // Check if series next item exists
  const nextWorksheetInSeries =
    providedNextInSeries ||
    (worksheet.series?.nextSlug
      ? relatedWorksheets.find((w) => w.slug === worksheet.series?.nextSlug)
      : null);

  return (
    <div className="pb-24">
      {/* Breadcrumb Bar */}
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={breadcrumbItems} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {/* MOBILE ONLY badges + shared H1 (one per page) + mobile CTA */}
        <div className="space-y-3.5 mb-6">
          {/* Badges strip (mobile); desktop badges stay in the sidebar */}
          <div className="flex flex-wrap items-center gap-2 lg:hidden">
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
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/80">
              US Letter &amp; A4
            </span>
          </div>

          {/* Single H1 for all breakpoints */}
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight font-heading leading-tight">
            {title}
          </h1>
          <p className="text-xs sm:text-sm lg:text-base text-slate-600 leading-relaxed font-normal lg:max-w-3xl">
            {quickSummary || description}
          </p>

          {/* Mobile Download CTA Button */}
          <div className="pt-1 lg:hidden space-y-2.5">
            <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs">
              <button
                type="button"
                onClick={() => setPaperSize('letter')}
                className={`py-2 px-3 rounded-lg font-bold transition-colors ${
                  paperSize === 'letter'
                    ? 'bg-white text-[#2E6B6B] shadow-2xs border border-slate-200/80'
                    : 'text-slate-600'
                }`}
              >
                US Letter (8.5×11&quot;)
              </button>
              <button
                type="button"
                onClick={() => setPaperSize('a4')}
                className={`py-2 px-3 rounded-lg font-bold transition-colors ${
                  paperSize === 'a4'
                    ? 'bg-white text-[#2E6B6B] shadow-2xs border border-slate-200/80'
                    : 'text-slate-600'
                }`}
              >
                A4 (210×297mm)
              </button>
            </div>

            <a
              id="mobile-download-btn"
              href={activePdfUrl}
              target="_blank"
              rel="noopener"
              onClick={(e) => {
                e.preventDefault();
                setDownloadModalOpen(true);
              }}
              className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-xl text-white font-bold text-base bg-[#2E6B6B] hover:bg-[#235353] active:scale-[0.99] transition-all shadow-sm"
            >
              <FileDown className="w-5 h-5" />
              <span>{paperSize === 'a4' ? 'Download A4 PDF' : 'Download free PDF'}</span>
              <span className="text-xs font-normal opacity-80">({worksheet.pdfFileSize})</span>
            </a>
            <div className="pt-1 flex items-center justify-center gap-1.5 text-[11px] text-slate-500 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Free for home &amp; classroom use · No registration required</span>
            </div>
          </div>
        </div>

        {/* Desktop 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: 58% (7 cols) - Preview & Page Thumbnails */}
          <div className="lg:col-span-7 space-y-4">
            {/* Primary Large Preview Card */}
            <div
              role="button"
              tabIndex={0}
              onClick={() => setLightboxOpen(true)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setLightboxOpen(true);
                }
              }}
              aria-label={`Enlarge preview of ${title}`}
              className="relative group bg-slate-50/80 rounded-2xl border border-slate-200 hover:border-[#2E6B6B] overflow-hidden shadow-xs flex items-center justify-center p-3 sm:p-8 cursor-zoom-in transition-colors"
            >
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
                  onClick={(e) => e.stopPropagation()}
                  className="absolute top-4 right-4 z-20 hidden group-hover:inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#E60023] hover:bg-[#b8001c] text-white text-xs font-bold rounded-full shadow-lg transition-transform hover:scale-105"
                  title="Save to Pinterest"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Pin</span>
                </a>

                {/* Bottom-right click to enlarge pill */}
                <span className="absolute bottom-3 right-3 z-20 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900/75 text-white text-[11px] font-semibold backdrop-blur-xs shadow-sm group-hover:bg-[#2E6B6B] transition-colors">
                  <ZoomIn className="w-3 h-3" />
                  <span>Click to enlarge</span>
                </span>
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
                  Click thumbnail to switch preview
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

          {/* Right Column: 42% (5 cols) - Sticky Meta & Action Sidebar (Desktop view) */}
          <div className="hidden lg:block lg:col-span-5 lg:sticky lg:top-24 space-y-6">
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
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/80">
                  US Letter &amp; A4
                </span>
              </div>

              {/* Title lives in the shared H1 above the grid; avoid a second H1 */}
            </div>

            {/* CTA Action Box */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3.5">
              {/* Paper Size Toggle */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
                  <span>Paper format</span>
                  <span>{paperSize === 'a4' ? 'Europe / Global' : 'US / North America'}</span>
                </div>
                <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs">
                  <button
                    type="button"
                    onClick={() => setPaperSize('letter')}
                    className={`py-2 px-3 rounded-lg font-bold transition-colors ${
                      paperSize === 'letter'
                        ? 'bg-white text-[#2E6B6B] shadow-2xs border border-slate-200/80'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    US Letter (8.5×11&quot;)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaperSize('a4')}
                    className={`py-2 px-3 rounded-lg font-bold transition-colors ${
                      paperSize === 'a4'
                        ? 'bg-white text-[#2E6B6B] shadow-2xs border border-slate-200/80'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    A4 (210×297mm)
                  </button>
                </div>
              </div>

              {/* Primary Full-width Download CTA Link */}
              <a
                id="desktop-download-btn"
                href={activePdfUrl}
                target="_blank"
                rel="noopener"
                onClick={(e) => {
                  e.preventDefault();
                  setDownloadModalOpen(true);
                }}
                className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-xl text-white font-bold text-base bg-[#2E6B6B] hover:bg-[#235353] active:scale-[0.99] transition-all shadow-sm"
              >
                <FileDown className="w-5 h-5" />
                <span>{paperSize === 'a4' ? 'Download A4 PDF' : 'Download free PDF'}</span>
                <span className="text-xs font-normal opacity-80">({worksheet.pdfFileSize})</span>
              </a>

              {/* Secondary Buttons: Print, Save to Pack & Pinterest */}
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

              <button
                type="button"
                onClick={() => toggleItem(worksheet)}
                className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all border ${
                  inPack
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-[#F0F7F7]/80 hover:bg-[#e1efef] text-[#2E6B6B] border-[#d0e3e3]'
                }`}
              >
                {inPack ? <Check className="w-4 h-4" /> : <FolderHeart className="w-4 h-4" />}
                <span>{inPack ? 'Saved in My Lesson Pack' : 'Add to My Lesson Pack'}</span>
              </button>

              {/* Quick Share: Copy Link & WhatsApp */}
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Link Copied!</span>
                    </>
                  ) : (
                    <>
                      <Link2 className="w-3.5 h-3.5 text-slate-500" />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>

                <a
                  href={whatsappShareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    trackEvent('worksheet_share', {
                      method: 'whatsapp',
                      slug: worksheet.slug,
                    })
                  }
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-700" />
                  <span>WhatsApp</span>
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

            {/* Ad Slot 2: Desktop Sidebar Slot */}
            <AdUnit slotType="sidebar" className="my-2!" />
          </div>
        </div>

        {/* Below the Fold: Single Column Container (Max-W 760px) */}
        <div className="max-w-[760px] mx-auto mt-12 lg:mt-24 space-y-10 sm:space-y-12">
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

          {/* Ad Slot 1 (Item 6: AdUnit handles self-contained rendering; no empty wrapper) */}
          <AdUnit slotType="in-content" />

          {/* English Words in this Worksheet (Item 6: only shown if >= 3 words) */}
          {worksheet.vocabulary && worksheet.vocabulary.length >= 3 && (
            <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-heading">
                    English words in this worksheet
                  </h3>
                  <p className="text-xs text-slate-500">
                    Click any word to find matching worksheets
                  </p>
                </div>
                <span className="text-xs font-semibold text-slate-500 shrink-0">
                  {worksheet.vocabulary.length} words
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {worksheet.vocabulary.map((vocab, idx) => {
                  const searchTerm =
                    vocab.replace(/\s*\([^)]*\)/g, '').trim() || vocab.trim();
                  return (
                    <Link
                      key={idx}
                      href={`/worksheets?q=${encodeURIComponent(searchTerm)}`}
                      title={`Find worksheets with "${searchTerm}"`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200 hover:bg-[#F0F7F7] hover:text-[#2E6B6B] hover:border-[#2E6B6B] transition-colors"
                    >
                      <span>{vocab}</span>
                      <Search className="w-3 h-3 opacity-50" />
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          {/* Next in Series Section (Item 6: only shown if valid next worksheet exists) */}
          {nextWorksheetInSeries && (
            <div className="p-5 rounded-2xl bg-gradient-to-r from-[#F0F7F7] to-white border border-[#d0e3e3] flex items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#2E6B6B]">
                  Continue with the Next Letter
                </span>
                <h4 className="text-base font-bold text-slate-900 mt-0.5">
                  {nextWorksheetInSeries.title}
                </h4>
              </div>
              <Link
                href={`/worksheets/${nextWorksheetInSeries.slug}`}
                className="inline-flex items-center gap-1 text-xs font-bold text-[#2E6B6B] hover:underline shrink-0"
              >
                <span>Next Printable</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}

          {/* Context-Matched Free PDF Makers */}
          {relatedTools.length > 0 && (
            <section className="p-5 sm:p-6 rounded-2xl bg-[#F0F7F7]/80 border border-[#d0e3e3] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-0.5">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#2E6B6B]">
                    <Wand2 className="w-3.5 h-3.5 text-[#F2B544]" />
                    <span>Companion PDF Makers</span>
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 font-heading">
                    Make Matching Custom PDFs Free
                  </h3>
                  <p className="text-xs text-slate-600">
                    Turn this topic into custom flashcards, bingo boards, or extra tracing sheets.
                  </p>
                </div>
                <Link
                  href="/tools"
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#2E6B6B] hover:underline shrink-0"
                >
                  <span>All 10 Tools</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {relatedTools.map((tool) => (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    className="group p-4 rounded-xl bg-white border border-[#d0e3e3] hover:border-[#2E6B6B] hover:shadow-sm transition-all flex flex-col justify-between gap-2.5"
                  >
                    <div className="space-y-1">
                      <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#F0F7F7] text-[#2E6B6B]">
                        {tool.badge}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#2E6B6B] transition-colors">
                        {tool.title}
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {tool.subtitle}
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-[#2E6B6B]">
                      <span>Create PDF</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </Link>
                ))}
              </div>
            </section>
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
          <AuthorBox isCompact={false} author={author} />

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

          {/* Weekly Theme Pack Lead Magnet */}
          <NewsletterBox source="worksheet-detail" compact />

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
            <p className="text-[10px] text-slate-500">
              {worksheet.pages}p · Free {paperSize === 'a4' ? 'A4' : 'US Letter'} PDF
            </p>
          </div>
          <a
            href={activePdfUrl}
            target="_blank"
            rel="noopener"
            onClick={(e) => {
              e.preventDefault();
              setDownloadModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#2E6B6B] hover:bg-[#235353] text-white text-xs font-bold rounded-lg shrink-0 shadow-xs"
          >
            <FileDown className="w-4 h-4" />
            <span>{paperSize === 'a4' ? 'Download A4' : 'Download PDF'}</span>
          </a>
        </div>
      )}

      {/* 3-Second Pre-Download Modal */}
      <PreDownloadModal
        isOpen={downloadModalOpen}
        onClose={() => setDownloadModalOpen(false)}
        worksheet={worksheet}
        relatedWorksheets={relatedWorksheets}
        paperSize={paperSize}
        onPaperSizeChange={setPaperSize}
      />

      {/* Fullscreen Preview Zoom Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/90 backdrop-blur-xs flex flex-col items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`${title} full-size preview`}
          onClick={() => setLightboxOpen(false)}
        >
          <div
            className="w-full max-w-4xl flex items-center justify-between text-white pb-3 px-1 gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="min-w-0">
              <p className="text-sm font-bold truncate">{title}</p>
              <p className="text-xs text-slate-300">
                Page {selectedImage + 1} of {worksheet.previewImages.length} · US Letter &amp; A4 PDF
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setLightboxOpen(false);
                  setDownloadModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#2E6B6B] hover:bg-[#235353] text-white text-xs font-bold transition-colors"
              >
                <FileDown className="w-3.5 h-3.5" />
                <span>Download PDF</span>
              </button>
              <button
                type="button"
                onClick={() => setLightboxOpen(false)}
                aria-label="Close preview"
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div
            className="relative flex items-center justify-center w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            {worksheet.previewImages.length > 1 && (
              <button
                type="button"
                onClick={() =>
                  setSelectedImage(
                    (i) =>
                      (i - 1 + worksheet.previewImages.length) %
                      worksheet.previewImages.length
                  )
                }
                aria-label="Previous preview page"
                className="absolute left-2 sm:left-4 z-10 p-2.5 rounded-full bg-slate-900/80 hover:bg-[#2E6B6B] text-white border border-white/20 shadow-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}

            <img
              src={worksheet.previewImages[selectedImage] || worksheet.previewImages[0]}
              alt={`${title} - Full Size Page ${selectedImage + 1}`}
              className="max-h-[82vh] w-auto max-w-full rounded-xl bg-white shadow-2xl object-contain"
            />

            {worksheet.previewImages.length > 1 && (
              <button
                type="button"
                onClick={() =>
                  setSelectedImage((i) => (i + 1) % worksheet.previewImages.length)
                }
                aria-label="Next preview page"
                className="absolute right-2 sm:right-4 z-10 p-2.5 rounded-full bg-slate-900/80 hover:bg-[#2E6B6B] text-white border border-white/20 shadow-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
