import React from 'react';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { MiniBookGenerator } from '@/components/MiniBookGenerator';
import { WorksheetCard } from '@/components/WorksheetCard';
import { FAQAccordion } from '@/components/FAQAccordion';
import { NewsletterBox } from '@/components/NewsletterBox';
import { AdUnit } from '@/components/AdUnit';
import { fetchWorksheetsBySubject } from '@/lib/worksheets-store';
import { buildToolMetadata, buildToolWebAppSchema } from '@/data/tools';
import { CLIPART_COUNT } from '@/lib/clipart';
import type { FAQItem } from '@/types/worksheet';
import { Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

export const metadata = buildToolMetadata('mini-book-maker');

const miniBookFaqs: FAQItem[] = [
  {
    question: 'What is the difference between Half-Page Booklet and 1-Sheet Foldable (8p)?',
    answer:
      'Half-Page Booklet prints two pages side-by-side per landscape sheet—just cut down the center line and staple the left edge. 1-Sheet Foldable prints all 8 panels on a single piece of paper with one center slit and no staples needed.',
  },
  {
    question: 'How do I fold the 1-Sheet 8-Panel Zine mini-book?',
    answer:
      'Fold the paper in half lengthwise (hot dog), open it, fold in half crosswise (hamburger), cut only the middle teal dashed slit, then pinch and push outward so all 8 numbered pages fold cleanly with the Cover on front.',
  },
  {
    question: 'Why are repeated frames like "I see a..." effective for ESL beginners?',
    answer:
      'Predictable sentence stems let non-reading 3- to 6-year-olds "read" a whole mini-book with pride on Day 1 simply by combining one familiar stem with crisp picture clues.',
  },
  {
    question: 'Can children color and trace words inside these mini-books?',
    answer:
      'Yes. Every illustration uses high-contrast black-ink coloring line art, and switching Sentence Pattern to Traceable Word adds handwriting guidelines on half-page booklets.',
  },
];

export default async function MiniBookMakerToolPage() {
  const vocabWorksheets = (await fetchWorksheetsBySubject('vocabulary')).slice(0, 4);
  const webAppSchema = buildToolWebAppSchema('mini-book-maker');

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
              { label: 'Foldable Mini-Book Maker' },
            ]}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14 space-y-14">
        <header className="max-w-3xl space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#F0F7F7] text-[#2E6B6B] border border-[#d0e3e3]">
            <Sparkles className="w-3.5 h-3.5 text-[#F2B544]" />
            <span>Emergent ESL Readers · Half-Page &amp; 1-Sheet Zine</span>
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-heading">
            Free Foldable ESL Mini-Book Maker
          </h1>
          <p className="text-base text-slate-600 leading-relaxed">
            Turn {CLIPART_COUNT} coloring-friendly illustrations into take-home emergent reader mini-books in seconds—choose Half-Page Staple booklets or single-sheet 8-panel foldable zines with &ldquo;I see a...&rdquo;, &ldquo;This is a...&rdquo;, or traceable words.
          </p>
        </header>

        <MiniBookGenerator />

        <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              step: 'Reading Tip 1 · Finger-Pointing Fluency',
              text: 'Ask students to tap under each English word as they read "I see a cow" aloud so spoken rhythm matches printed word boundaries.',
            },
            {
              step: 'Reading Tip 2 · Paper-Saving 1-Sheet Zine',
              text: 'Print the 1-Sheet 8-Panel Zine for whole classes when copy budgets are tight—one single landscape page becomes an 8-page take-home book.',
            },
            {
              step: 'Reading Tip 3 · 3× Read Homework Bag',
              text: 'Children color the black-ink art in class, read the booklet three times to family members over the weekend, and fill the 1x, 2x, 3x stars.',
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
                  Combine student mini-books with matching flashcards and circle-time packs.
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
            items={miniBookFaqs}
            title="Foldable Mini-Book Maker FAQ"
          />
        </div>

        <NewsletterBox source="tool-mini-book-maker" />
      </div>
    </div>
  );
}
