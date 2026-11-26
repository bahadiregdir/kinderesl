import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { NameTracingGenerator } from '@/components/NameTracingGenerator';
import { WorksheetCard } from '@/components/WorksheetCard';
import { FAQAccordion } from '@/components/FAQAccordion';
import { NewsletterBox } from '@/components/NewsletterBox';
import { AdUnit } from '@/components/AdUnit';
import { fetchWorksheetsByActivityType } from '@/lib/worksheets-store';
import { buildToolMetadata, buildToolWebAppSchema } from '@/data/tools';
import type { FAQItem } from '@/types/worksheet';
import { Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

export const metadata = buildToolMetadata('name-tracing');

const toolFaqs: FAQItem[] = [
  {
    question: 'Is this custom name tracing worksheet generator completely free?',
    answer:
      'Yes. You can create and download unlimited single-student or whole-class name tracing PDF packets for free for classroom, tutoring, and homeschooling use.',
  },
  {
    question: 'Can I generate worksheets for my entire preschool class at once?',
    answer:
      'Yes. Switch to Whole Class (30) mode, paste up to 30 student names (one per line), and download one multi-page PDF with an individual practice sheet for every child.',
  },
  {
    question: 'Are student names stored on KinderESL servers?',
    answer:
      'No. All vector handwriting paths and PDF files are generated locally inside your web browser—names never leave your device, keeping student data 100% private and COPPA safe.',
  },
  {
    question: 'Does the PDF support both US Letter and A4 paper sizes?',
    answer:
      'Yes. Choose between US Letter (8.5×11") and ISO A4 (210×297mm) in either Landscape (4 extra-large rows) or Portrait (5 rows) before clicking Download Free PDF.',
  },
];

export default async function NameTracingToolPage() {
  const tracingWorksheets = (await fetchWorksheetsByActivityType('tracing')).slice(
    0,
    4
  );

  const webAppSchema = buildToolWebAppSchema('name-tracing');

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />

      <div className="bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: 'Teacher Tools', href: '/tools' },
              { label: 'Name Tracing Generator' },
            ]}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14 space-y-14">
        {/* Header */}
        <header className="max-w-3xl space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#F0F7F7] text-[#2E6B6B] border border-[#d0e3e3]">
            <Sparkles className="w-3.5 h-3.5 text-[#F2B544]" />
            <span>Free Educator Tool · Instant Vector PDF</span>
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-heading">
            Free Custom Name Tracing Worksheet Generator
          </h1>
          <p className="text-base text-slate-600 leading-relaxed">
            Build personalized preschool &amp; kindergarten name handwriting sheets in seconds. Choose US Letter or A4, ball-and-stick dashed strokes, optional starting dots, or paste up to 30 names for your whole class.
          </p>
        </header>

        {/* Interactive Generator */}
        <NameTracingGenerator />

        {/* 3-Step Classroom Usage Tips */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              step: 'Step 1 · Rainbow Trace',
              text: 'On Row 1, have students finger-trace each letter starting on the teal dot, then trace with 2–3 crayon colors while saying each letter aloud.',
            },
            {
              step: 'Step 2 · Guided Dashed Practice',
              text: 'Rows 2 and 3 fade scaffolding from starting dots to plain dashed guides so young learners build smooth left-to-right spacing.',
            },
            {
              step: 'Step 3 · Independent Row & Laminating',
              text: 'Use the bottom 3-line guide for independent writing—or slip sheets into dry-erase sleeves for reusable morning arrival stations.',
            },
          ].map((tip) => (
            <div
              key={tip.step}
              className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-2"
            >
              <div className="flex items-center gap-2 text-sm font-bold text-[#2E6B6B]">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{tip.step}</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {tip.text}
              </p>
            </div>
          ))}
        </section>

        <AdUnit slotType="in-content" />

        {/* Companion Tracing Worksheets */}
        {tracingWorksheets.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading">
                  Companion Tracing Worksheets
                </h2>
                <p className="text-xs sm:text-sm text-slate-600">
                  Pair personalized name sheets with our free A–Z alphabet and pre-writing printables.
                </p>
              </div>
              <Link
                href="/activities/tracing"
                className="inline-flex items-center gap-1 text-xs font-bold text-[#2E6B6B] hover:underline"
              >
                <span>All tracing PDFs</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {tracingWorksheets.map((ws) => (
                <WorksheetCard key={ws.slug} worksheet={ws} />
              ))}
            </div>
          </section>
        )}

        <div className="max-w-3xl">
          <FAQAccordion items={toolFaqs} title="Name Tracing Generator FAQ" />
        </div>

        <NewsletterBox source="tool-name-tracing" />
      </div>
    </div>
  );
}
