import React from 'react';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { DominoGenerator } from '@/components/DominoGenerator';
import { WorksheetCard } from '@/components/WorksheetCard';
import { FAQAccordion } from '@/components/FAQAccordion';
import { NewsletterBox } from '@/components/NewsletterBox';
import { AdUnit } from '@/components/AdUnit';
import { fetchWorksheetsBySubject } from '@/lib/worksheets-store';
import { buildToolMetadata, buildToolWebAppSchema } from '@/data/tools';
import { CLIPART_COUNT } from '@/lib/clipart';
import type { FAQItem } from '@/types/worksheet';
import { Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

export const metadata = buildToolMetadata('domino-maker');

const dominoFaqs: FAQItem[] = [
  {
    question: 'How do Picture Dominoes work without leftover tiles?',
    answer:
      'Every tile pairs one picture on the left with a different word on the right arranged in a mathematically guaranteed closed cycle—so students always link every tile from start back to finish.',
  },
  {
    question: 'Should I choose Picture↔Word Memory or Picture Pairs for preschoolers?',
    answer:
      'Use Picture Pairs (labeled illustrations) for pre-readers ages 3–4 practicing spoken English naming, and switch to Picture↔Word Memory once ages 5–6 are decoding short words.',
  },
  {
    question: 'Can I print backs onto Memory cards so pictures do not show through?',
    answer:
      'Yes. Leave Include patterned Card Backs page checked and print double-sided (flip on long edge) on standard cardstock.',
  },
  {
    question: 'Does the domino set include a quick teacher check key?',
    answer:
      'Yes. Keeping Teacher Loop Sequence Key checked appends a single-page loop list showing the exact ordered chain across your cards.',
  },
];

export default async function DominoMakerToolPage() {
  const vocabWorksheets = (await fetchWorksheetsBySubject('vocabulary')).slice(0, 4);
  const webAppSchema = buildToolWebAppSchema('domino-maker');

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
              { label: 'Picture Dominoes & Memory Maker' },
            ]}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14 space-y-14">
        <header className="max-w-3xl space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#F0F7F7] text-[#2E6B6B] border border-[#d0e3e3]">
            <Sparkles className="w-3.5 h-3.5 text-[#F2B544]" />
            <span>Literacy &amp; Speaking Centers · Closed-Loop Dominoes &amp; Memory</span>
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-heading">
            Free ESL Picture Dominoes &amp; Memory Match Maker
          </h1>
          <p className="text-base text-slate-600 leading-relaxed">
            Build closed-loop Picture↔Word Domino chains or 3×4 Memory Match card decks from {CLIPART_COUNT} KinderESL drawings—complete with dashed cut guides, card backs, and a Teacher Loop Key in US Letter or A4.
          </p>
        </header>

        <DominoGenerator />

        <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              step: 'Center Tip 1 · Say It Before Laying It Down',
              text: 'During partner dominoes, require kids to read the word and name the matching picture aloud before sliding their tile onto the floor chain.',
            },
            {
              step: 'Center Tip 2 · Start With 6 Pairs in Memory',
              text: 'Twelve cards (6 matching pairs) keep turns brisk and memorable for preschool tables; expand up to 12 pairs for Kindergarten early finishers.',
            },
            {
              step: 'Center Tip 3 · Bagged Year-Round Kits',
              text: 'Print decks on colorful pastel cardstock and store each theme in a small zip pouch for instant rainy-day and substitute centers.',
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
                  Related Matching &amp; Vocabulary Printables
                </h2>
                <p className="text-xs sm:text-sm text-slate-600">
                  Reinforce your domino game words with matching worksheets and flashcards.
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
            items={dominoFaqs}
            title="Picture Dominoes & Memory Maker FAQ"
          />
        </div>

        <NewsletterBox source="tool-domino-maker" />
      </div>
    </div>
  );
}
