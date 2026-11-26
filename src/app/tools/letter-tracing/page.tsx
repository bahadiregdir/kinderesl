import React from 'react';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { LetterTracingGenerator } from '@/components/LetterTracingGenerator';
import { WorksheetCard } from '@/components/WorksheetCard';
import { FAQAccordion } from '@/components/FAQAccordion';
import { NewsletterBox } from '@/components/NewsletterBox';
import { AdUnit } from '@/components/AdUnit';
import { fetchWorksheetsBySubject } from '@/lib/worksheets-store';
import { buildToolMetadata, buildToolWebAppSchema } from '@/data/tools';
import type { FAQItem } from '@/types/worksheet';
import { Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

export const metadata = buildToolMetadata('letter-tracing');

const letterFaqs: FAQItem[] = [
  {
    question: 'Can I download all 26 A–Z alphabet tracing pages in one PDF?',
    answer:
      'Yes. Click the Full A–Z (26) preset button to select every letter from A to Z, then click Download Free PDF to generate a single 26-page alphabet workbook packet.',
  },
  {
    question: 'Can I teach phonics letter order like SATPIN instead of A–Z?',
    answer:
      'Yes. Click the SATPIN (6) preset button or toggle any combination of individual letters (such as vowels A, E, I, O, U or Letter of the Week targets) to print only the letters your class needs.',
  },
  {
    question: 'Are both uppercase and lowercase letters included on every page?',
    answer:
      'In the default Aa (Both) format, each worksheet includes uppercase tracing, lowercase tracing, combined Aa pairs, and an independent writing row. You can also switch to AA (Upper only) or aa (Lower only).',
  },
  {
    question: 'What paper sizes are supported for classroom printing?',
    answer:
      'You can switch between US Letter (8.5×11") and ISO A4 (210×297mm) with one click before downloading or printing directly from your browser.',
  },
];

export default async function LetterTracingToolPage() {
  const alphabetWorksheets = (await fetchWorksheetsBySubject('alphabet')).slice(0, 4);
  const webAppSchema = buildToolWebAppSchema('letter-tracing');

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
              { label: 'Letter Tracing Generator' },
            ]}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14 space-y-14">
        <header className="max-w-3xl space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#F0F7F7] text-[#2E6B6B] border border-[#d0e3e3]">
            <Sparkles className="w-3.5 h-3.5 text-[#F2B544]" />
            <span>Free Alphabet Tool · A–Z Vector PDF</span>
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-heading">
            Free Printable Letter Tracing Worksheet Generator
          </h1>
          <p className="text-base text-slate-600 leading-relaxed">
            Create clean Zaner-Bloser alphabet tracing pages for any single letter, SATPIN phonics group, or the full A–Z alphabet in seconds. Print in US Letter or A4 with uppercase, lowercase, starting dots, and phonics word cues.
          </p>
        </header>

        <LetterTracingGenerator />

        <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              step: 'Step 1 · Rainbow Finger Tracing',
              text: 'Have preschoolers trace the large reference letter in the top banner with a finger while saying the target phonics sound aloud before picking up a pencil.',
            },
            {
              step: 'Step 2 · Dot-Guided Strokes',
              text: 'Teal starting dots teach consistent top-to-bottom letter formation so learners build smooth habits instead of drawing letters backwards.',
            },
            {
              step: 'Step 3 · Dry-Erase Literacy Centers',
              text: 'Slip your printed SATPIN or A–Z pages into clear sheet protectors with low-odor dry-erase markers for reusable morning arrival stations.',
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

        {alphabetWorksheets.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading">
                  Related Alphabet &amp; Letter Printables
                </h2>
                <p className="text-xs sm:text-sm text-slate-600">
                  Combine your custom letter tracing sheets with our illustrated phonics and matching packs.
                </p>
              </div>
              <Link
                href="/worksheets/alphabet"
                className="inline-flex items-center gap-1 text-xs font-bold text-[#2E6B6B] hover:underline"
              >
                <span>All alphabet PDFs</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {alphabetWorksheets.map((ws) => (
                <WorksheetCard key={ws.slug} worksheet={ws} />
              ))}
            </div>
          </section>
        )}

        <div className="max-w-3xl">
          <FAQAccordion items={letterFaqs} title="Letter Tracing Generator FAQ" />
        </div>

        <NewsletterBox source="tool-letter-tracing" />
      </div>
    </div>
  );
}
