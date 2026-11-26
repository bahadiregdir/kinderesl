import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { BingoGenerator } from '@/components/BingoGenerator';
import { ToolSamplePreview } from '@/components/ToolSamplePreview';
import { WorksheetCard } from '@/components/WorksheetCard';
import { FAQAccordion } from '@/components/FAQAccordion';
import { NewsletterBox } from '@/components/NewsletterBox';
import { AdUnit } from '@/components/AdUnit';
import { fetchWorksheetsBySubject } from '@/lib/worksheets-store';
import { buildToolMetadata, buildToolWebAppSchema } from '@/data/tools';
import type { FAQItem } from '@/types/worksheet';
import { Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

export const metadata = buildToolMetadata('bingo-maker');

const bingoFaqs: FAQItem[] = [
  {
    question: 'Are every student’s bingo cards shuffled differently?',
    answer:
      'Yes. Each generated card uses an independent shuffle so up to 30 students receive unique board layouts from your word list without manual cutting or rearranging.',
  },
  {
    question: 'Should I choose 3×3 or 4×4 bingo grids for preschool?',
    answer:
      'A 3×3 grid (with the optional FREE center space) is ideal for ages 3–5 because short 5-minute rounds keep excitement high; switch to 4×4 for kindergarteners or 16-word unit reviews.',
  },
  {
    question: 'How does the 2-per-page Paper Saver layout work?',
    answer:
      'Selecting 2 Saver places two distinct shuffled bingo boards on each US Letter or A4 page separated by a crisp dashed cut line—cutting classroom printing paper in half.',
  },
  {
    question: 'Is there a teacher word list included in the PDF?',
    answer:
      'Yes. Leave "Add Teacher Caller Checklist page" checked to append a clean checkbox sheet at the end of your PDF so you can mark each word as you call it aloud.',
  },
];

export default async function BingoMakerToolPage() {
  const vocabWorksheets = (await fetchWorksheetsBySubject('vocabulary')).slice(
    0,
    4
  );

  const webAppSchema = buildToolWebAppSchema('bingo-maker');

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
              { label: 'Bingo Card Generator' },
            ]}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14 space-y-14">
        <header className="max-w-3xl space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#F0F7F7] text-[#2E6B6B] border border-[#d0e3e3]">
            <Sparkles className="w-3.5 h-3.5 text-[#F2B544]" />
            <span>Free ESL Classroom Tool · Instant Vector PDF</span>
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-heading">
            Free Printable ESL Bingo Card Generator
          </h1>
          <p className="text-base text-slate-600 leading-relaxed">
            Pick a preset early-childhood topic or type your own vocabulary words to create up to 30 uniquely shuffled bingo boards plus a Teacher Caller Checklist in US Letter or A4.
          </p>
        </header>

        <BingoGenerator />

        <ToolSamplePreview slug="bingo-maker" />

        <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              step: 'Tip 1 · Sound Clues Instead of Direct Words',
              text: 'In ESL farm or weather rounds, call out hints like "Who says moo?" or "Put on your boots!" before confirming the spoken word.',
            },
            {
              step: 'Tip 2 · Reuse All Year With Counters',
              text: 'Print cards once on cardstock or slide them into clear sleeves, then let preschoolers mark squares with buttons, erasers, or counting bears.',
            },
            {
              step: 'Tip 3 · Let Early Readers Take Turns Calling',
              text: 'Hand the Teacher Caller Checklist page to a helper student to practice reading and clear English pronunciation in small-group centers.',
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

        {vocabWorksheets.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading">
                  Companion ESL Vocabulary Worksheets
                </h2>
                <p className="text-xs sm:text-sm text-slate-600">
                  Pre-teach target words with flashcards and tracing packs before playing Bingo.
                </p>
              </div>
              <Link
                href="/worksheets/vocabulary"
                className="inline-flex items-center gap-1 text-xs font-bold text-[#2E6B6B] hover:underline"
              >
                <span>All vocabulary PDFs</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {vocabWorksheets.map((ws) => (
                <WorksheetCard key={ws.slug} worksheet={ws} />
              ))}
            </div>
          </section>
        )}

        <div className="max-w-3xl">
          <FAQAccordion items={bingoFaqs} title="ESL Bingo Generator FAQ" />
        </div>

        <NewsletterBox source="tool-bingo-maker" />
      </div>
    </div>
  );
}
