import React from 'react';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { NumberTracingGenerator } from '@/components/NumberTracingGenerator';
import { WorksheetCard } from '@/components/WorksheetCard';
import { FAQAccordion } from '@/components/FAQAccordion';
import { NewsletterBox } from '@/components/NewsletterBox';
import { AdUnit } from '@/components/AdUnit';
import { fetchWorksheetsBySubject } from '@/lib/worksheets-store';
import { buildToolMetadata, buildToolWebAppSchema } from '@/data/tools';
import type { FAQItem } from '@/types/worksheet';
import { Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

export const metadata = buildToolMetadata('number-tracing');

const numberFaqs: FAQItem[] = [
  {
    question: 'Does this generator cover numbers 0–10 and teen numbers 11–20?',
    answer:
      'Yes. You can pick 1–10, 0–10, 11–20, all numbers 0–20, or click individual number buttons to create a custom counting and numeral formation packet.',
  },
  {
    question: 'Why are Ten-Frames included on every number tracing sheet?',
    answer:
      'Pairing numeral tracing with a 2×5 Ten-Frame (or double Ten-Frame for numbers 11–20) helps preschool and kindergarten learners connect the written symbol to real quantity.',
  },
  {
    question: 'Can students also practice tracing English number words?',
    answer:
      'Yes. Keep the Include dashed number word row option checked to add a traceable row for zero through twenty right below the numeral rows—great for ESL and kindergarten literacy.',
  },
  {
    question: 'Can I print these number worksheets in both US Letter and A4?',
    answer:
      'Yes. Select US Letter (8.5×11") or ISO A4 (210×297mm) at any time before downloading or printing directly in your browser.',
  },
];

export default async function NumberTracingToolPage() {
  const numberWorksheets = (
    await fetchWorksheetsBySubject('numbers-counting')
  ).slice(0, 4);
  const webAppSchema = buildToolWebAppSchema('number-tracing');

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
              { label: 'Number Tracing Generator' },
            ]}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14 space-y-14">
        <header className="max-w-3xl space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#F0F7F7] text-[#2E6B6B] border border-[#d0e3e3]">
            <Sparkles className="w-3.5 h-3.5 text-[#F2B544]" />
            <span>Free Early Math Tool · Numbers 0–20 PDF</span>
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-heading">
            Free Number Tracing Worksheet Generator (0–20)
          </h1>
          <p className="text-base text-slate-600 leading-relaxed">
            Build crisp preschool &amp; kindergarten number formation sheets for 0–10 or 0–20 with built-in Ten-Frame counting grids, optional English number words, and teal starting dots—formatted for US Letter and A4.
          </p>
        </header>

        <NumberTracingGenerator />

        <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              step: 'Step 1 · Touch & Count the Ten-Frame',
              text: 'Before writing, have children tap each filled circle in the Ten-Frame with a finger or mini eraser to count aloud with one-to-one correspondence.',
            },
            {
              step: 'Step 2 · Dot-Guided Numeral Formation',
              text: 'Teal starting dots prevent flipped numerals (like backwards 2, 3, and 5) by anchoring the exact pencil starting point for each stroke.',
            },
            {
              step: 'Step 3 · ESL Number Word Literacy',
              text: 'Keep the number word row enabled for kindergarten and ESL groups so students connect numerals (5), quantity, and written English spelling (five).',
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

        {numberWorksheets.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading">
                  Related Numbers &amp; Counting Worksheets
                </h2>
                <p className="text-xs sm:text-sm text-slate-600">
                  Pair numeral tracing practice with illustrated counting packs for classroom math centers.
                </p>
              </div>
              <Link
                href="/worksheets/numbers-counting"
                className="inline-flex items-center gap-1 text-xs font-bold text-[#2E6B6B] hover:underline"
              >
                <span>All counting PDFs</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {numberWorksheets.map((ws) => (
                <WorksheetCard key={ws.slug} worksheet={ws} />
              ))}
            </div>
          </section>
        )}

        <div className="max-w-3xl">
          <FAQAccordion items={numberFaqs} title="Number Tracing Generator FAQ" />
        </div>

        <NewsletterBox source="tool-number-tracing" />
      </div>
    </div>
  );
}
