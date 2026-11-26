import React from 'react';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { HandwritingGenerator } from '@/components/HandwritingGenerator';
import { WorksheetCard } from '@/components/WorksheetCard';
import { FAQAccordion } from '@/components/FAQAccordion';
import { NewsletterBox } from '@/components/NewsletterBox';
import { AdUnit } from '@/components/AdUnit';
import { fetchWorksheetsBySubject } from '@/lib/worksheets-store';
import { buildToolMetadata, buildToolWebAppSchema } from '@/data/tools';
import type { FAQItem } from '@/types/worksheet';
import { Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

export const metadata = buildToolMetadata('handwriting-maker');

const handwritingFaqs: FAQItem[] = [
  {
    question: 'How does the Read, Trace & Write layout work?',
    answer:
      'Each sight word gets its own 3-column handwriting row: students first read the solid guide word aloud, trace the dashed word starting from each teal dot, and then write the word independently on the blank 3-line guide.',
  },
  {
    question: 'Are Dolch sight words and CVC word families built in?',
    answer:
      'Yes. Click any of the 6 preset buttons—including Dolch Pre-Primer, Dolch Primer, CVC -at Family, CVC -an & -ig, and ESL Classroom words—or paste up to 18 of your own weekly spelling words.',
  },
  {
    question: 'What happens if I paste more than 6 words?',
    answer:
      'The generator automatically paginates up to 18 words cleanly across 1, 2, or 3 printable PDF pages (6 words per sheet) so lines stay large enough for kindergarten hands.',
  },
  {
    question: 'Are my custom word lists saved or uploaded?',
    answer:
      'No. All PDFs are generated directly inside your browser so your classroom spelling lists stay private with zero sign-up required.',
  },
];

export default async function HandwritingMakerToolPage() {
  const phonicsWorksheets = (await fetchWorksheetsBySubject('phonics')).slice(0, 4);
  const webAppSchema = buildToolWebAppSchema('handwriting-maker');

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
              { label: 'Sight Word & Handwriting Maker' },
            ]}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14 space-y-14">
        <header className="max-w-3xl space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#F0F7F7] text-[#2E6B6B] border border-[#d0e3e3]">
            <Sparkles className="w-3.5 h-3.5 text-[#F2B544]" />
            <span>Free Sight Words Tool · Weekly Spelling PDF</span>
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-heading">
            Free Sight Word &amp; Handwriting Worksheet Maker
          </h1>
          <p className="text-base text-slate-600 leading-relaxed">
            Paste your weekly sight words, CVC phonics families, or ESL vocabulary list (up to 18 words) to generate instant Read · Trace · Write or Full-Row Tracing PDFs in US Letter and A4.
          </p>
        </header>

        <HandwritingGenerator />

        <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              step: 'Routine 1 · Say It, Trace It, Write It',
              text: 'Have learners tap each word in Column 1, whisper-read it while tracing Column 2, and cover the sample before writing independently in Column 3.',
            },
            {
              step: 'Routine 2 · Weekly CVC Word Families',
              text: 'Swap in rhyming CVC sets (-at, -an, -ig, -op) every Monday so ESL and emergent readers connect phonics patterns to neat handwriting.',
            },
            {
              step: 'Routine 3 · Differentiated Take-Home Packets',
              text: 'Use Read · Trace · Write for independent learners and Full-Row Tracing for beginners who need extra fine-motor repetition.',
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

        {phonicsWorksheets.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading">
                  Related Phonics &amp; Early Reading Printables
                </h2>
                <p className="text-xs sm:text-sm text-slate-600">
                  Pair sight word handwriting sheets with our beginning sounds and phonemic awareness packs.
                </p>
              </div>
              <Link
                href="/worksheets/phonics"
                className="inline-flex items-center gap-1 text-xs font-bold text-[#2E6B6B] hover:underline"
              >
                <span>All phonics PDFs</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {phonicsWorksheets.map((ws) => (
                <WorksheetCard key={ws.slug} worksheet={ws} />
              ))}
            </div>
          </section>
        )}

        <div className="max-w-3xl">
          <FAQAccordion
            items={handwritingFaqs}
            title="Sight Word & Handwriting Maker FAQ"
          />
        </div>

        <NewsletterBox source="tool-handwriting-maker" />
      </div>
    </div>
  );
}
