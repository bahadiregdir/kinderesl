import React from 'react';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { WordSearchGenerator } from '@/components/WordSearchGenerator';
import { WorksheetCard } from '@/components/WorksheetCard';
import { FAQAccordion } from '@/components/FAQAccordion';
import { NewsletterBox } from '@/components/NewsletterBox';
import { AdUnit } from '@/components/AdUnit';
import { fetchWorksheetsBySubject } from '@/lib/worksheets-store';
import { buildToolMetadata, buildToolWebAppSchema } from '@/data/tools';
import type { FAQItem } from '@/types/worksheet';
import { Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

export const metadata = buildToolMetadata('word-search-maker');

const wsFaqs: FAQItem[] = [
  {
    question: 'Why are words only placed across and down (never backwards or diagonal)?',
    answer:
      'Early readers (ages 4–6) are still mastering left-to-right English print tracking. Keeping words strictly left-to-right or top-to-bottom builds confidence without frustrating beginners.',
  },
  {
    question: 'What makes this a "Picture Word Search"?',
    answer:
      'Below the letter grid, every hidden word is displayed in a Picture Word Bank alongside its black-and-white KinderESL drawing so ESL learners see both the visual meaning and spelling.',
  },
  {
    question: 'Should I choose 6×6 or 8×8 grid size?',
    answer:
      'Choose 6×6 with Across Only directions for preschool (ages 3–4) and short CVC words, or 8×8 Across + Down for kindergarteners (ages 5–6).',
  },
  {
    question: 'Does it include a highlighted Answer Key?',
    answer:
      'Yes. Leave Include Page 2 Highlighted Answer Key checked to generate a second sheet with every hidden word shaded in soft teal.',
  },
];

export default async function WordSearchMakerToolPage() {
  const vocabWorksheets = (await fetchWorksheetsBySubject('vocabulary')).slice(
    0,
    4
  );
  const webAppSchema = buildToolWebAppSchema('word-search-maker');

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
              { label: 'Picture Word Search Maker' },
            ]}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14 space-y-14">
        <header className="max-w-3xl space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#F0F7F7] text-[#2E6B6B] border border-[#d0e3e3]">
            <Sparkles className="w-3.5 h-3.5 text-[#F2B544]" />
            <span>Free Early Reader Puzzle · Picture Word Bank</span>
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-heading">
            Free Easy Picture Word Search Maker
          </h1>
          <p className="text-base text-slate-600 leading-relaxed">
            Create kindergarten-friendly 6×6 and 8×8 word search PDFs with an illustrated Picture Word Bank and Page 2 highlighted Answer Key—words read strictly across or down for early ESL readers.
          </p>
        </header>

        <WordSearchGenerator />

        <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              step: 'Scaffold 1 · Highlighters & Crayons',
              text: 'Give beginners yellow highlighters or dot markers so circling horizontal and vertical words feels playful and low-pressure.',
            },
            {
              step: 'Scaffold 2 · Lowercase CVC Puzzles',
              text: 'Switch Letter Case to lower with the 6×6 CVC Phonics preset to match lowercase book print and emergent phonics decoding.',
            },
            {
              step: 'Scaffold 3 · Color the Word Bank',
              text: 'Encourage ESL students to say each word aloud and color the miniature illustration in the bottom word bank after finding it in the grid.',
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
                  Related ESL Vocabulary Printables
                </h2>
                <p className="text-xs sm:text-sm text-slate-600">
                  Combine picture word searches with thematic ESL vocabulary and flashcard packs.
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
          <FAQAccordion
            items={wsFaqs}
            title="Picture Word Search Maker FAQ"
          />
        </div>

        <NewsletterBox source="tool-word-search-maker" />
      </div>
    </div>
  );
}
