import React from 'react';
import Link from 'next/link';
import type { FAQItem, Worksheet } from '@/types/worksheet';
import type { RelatedToolLink } from '@/lib/related-tools';
import { TOOL_COUNT } from '@/data/tools';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { WorksheetCard } from '@/components/WorksheetCard';
import { FAQAccordion } from '@/components/FAQAccordion';
import { NewsletterBox } from '@/components/NewsletterBox';
import { AdUnit } from '@/components/AdUnit';
import { Sparkles, CheckCircle2, Lightbulb, ArrowRight, Wand2 } from 'lucide-react';

interface SiblingLink {
  slug: string;
  label: string;
  href: string;
}

interface CollectionLandingViewProps {
  breadcrumbLabel: string;
  badgeLabel: string;
  title: string;
  description: string;
  skillsFocus: string[];
  classroomTip: string;
  worksheets: Worksheet[];
  relatedFallback: Worksheet[];
  relatedTools?: RelatedToolLink[];
  relatedToolsHeading?: string;
  relatedToolsSubtitle?: string;
  siblingHeading: string;
  siblingLinks: SiblingLink[];
  activeSlug: string;
  faqs: FAQItem[];
  faqTitle: string;
  newsletterSource: string;
}

export function CollectionLandingView({
  breadcrumbLabel,
  badgeLabel,
  title,
  description,
  skillsFocus,
  classroomTip,
  worksheets,
  relatedFallback,
  relatedTools,
  relatedToolsHeading,
  relatedToolsSubtitle,
  siblingHeading,
  siblingLinks,
  activeSlug,
  faqs,
  faqTitle,
  newsletterSource,
}: CollectionLandingViewProps) {
  return (
    <div>
      <div className="bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: 'Worksheets', href: '/worksheets' },
              { label: breadcrumbLabel },
            ]}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14 space-y-12">
        {/* Header */}
        <div className="max-w-3xl space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#F0F7F7] text-[#2E6B6B] border border-[#d0e3e3]">
            <Sparkles className="w-3.5 h-3.5 text-[#F2B544]" />
            <span>{badgeLabel}</span>
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-heading">
            {title}
          </h1>
          <p className="text-base text-slate-600 leading-relaxed">
            {description}
          </p>

          {skillsFocus.length > 0 && (
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
              {skillsFocus.map((skill, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 text-xs sm:text-sm text-slate-700"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#2E6B6B] shrink-0 mt-0.5" />
                  <span>{skill}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Worksheets Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
            <h2 className="text-xl font-bold text-slate-900 font-heading">
              Printable {breadcrumbLabel} PDFs ({worksheets.length})
            </h2>
            <span className="text-xs text-slate-500">US Letter &amp; A4 Ready</span>
          </div>

          {worksheets.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {worksheets.map((ws) => (
                <WorksheetCard key={ws.slug} worksheet={ws} />
              ))}
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-[#F0F7F7]/60 border border-[#d0e3e3] space-y-4">
              <p className="text-sm text-slate-700 font-medium">
                New worksheets for this category are being added soon. Meanwhile, explore these popular printables:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedFallback.slice(0, 4).map((ws) => (
                  <WorksheetCard key={ws.slug} worksheet={ws} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Classroom Teaching Tip */}
        <div className="p-6 rounded-2xl bg-[#F0F7F7]/70 border border-[#d0e3e3] flex items-start gap-3.5">
          <Lightbulb className="w-5 h-5 text-[#2E6B6B] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-900">Educator Tip</h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {classroomTip}
            </p>
          </div>
        </div>

        {/* Context-Matched Free PDF Maker Tools */}
        {relatedTools && relatedTools.length > 0 && (
          <section className="p-6 rounded-2xl bg-[#F0F7F7] border border-[#d0e3e3] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="space-y-0.5">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#2E6B6B]">
                  <Wand2 className="w-3.5 h-3.5 text-[#F2B544]" />
                  <span>Free Interactive PDF Makers</span>
                </span>
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 font-heading">
                  {relatedToolsHeading || `Create Custom ${breadcrumbLabel} PDFs Free`}
                </h2>
                {relatedToolsSubtitle && (
                  <p className="text-xs sm:text-sm text-slate-600">
                    {relatedToolsSubtitle}
                  </p>
                )}
              </div>
              <Link
                href="/tools"
                className="inline-flex items-center gap-1 text-xs font-bold text-[#2E6B6B] hover:underline shrink-0"
              >
                <span>All {TOOL_COUNT} PDF Makers</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {relatedTools.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="group p-4 rounded-xl bg-white border border-[#d0e3e3] hover:border-[#2E6B6B] hover:shadow-sm transition-all flex flex-col justify-between gap-3"
                >
                  <div className="space-y-1.5">
                    <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#F0F7F7] text-[#2E6B6B]">
                      {tool.badge}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#2E6B6B] transition-colors">
                      {tool.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {tool.subtitle}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-[#2E6B6B]">
                    <span>Open Tool</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Cross-navigation to sibling collections */}
        {siblingLinks.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 font-heading">
                {siblingHeading}
              </h3>
              <Link
                href="/worksheets"
                className="inline-flex items-center gap-1 text-xs font-bold text-[#2E6B6B] hover:underline"
              >
                <span>All Worksheets</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {siblingLinks.map((item) => {
                const isActive = item.slug === activeSlug;
                return (
                  <Link
                    key={item.slug}
                    href={item.href}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border transition-colors ${
                      isActive
                        ? 'bg-[#2E6B6B] text-white border-[#2E6B6B]'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-[#2E6B6B] hover:text-[#2E6B6B]'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        <AdUnit slotType="in-content" />

        {faqs.length > 0 && (
          <div className="max-w-3xl pt-2">
            <FAQAccordion items={faqs} title={faqTitle} />
          </div>
        )}

        <NewsletterBox source={newsletterSource} />
      </div>
    </div>
  );
}
