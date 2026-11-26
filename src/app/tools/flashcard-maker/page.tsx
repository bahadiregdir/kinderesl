import React from 'react';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { FlashcardGenerator } from '@/components/FlashcardGenerator';
import { WorksheetCard } from '@/components/WorksheetCard';
import { FAQAccordion } from '@/components/FAQAccordion';
import { NewsletterBox } from '@/components/NewsletterBox';
import { AdUnit } from '@/components/AdUnit';
import { fetchWorksheetsBySubject } from '@/lib/worksheets-store';
import { buildToolMetadata, buildToolWebAppSchema } from '@/data/tools';
import type { FAQItem } from '@/types/worksheet';
import { Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

export const metadata = buildToolMetadata('flashcard-maker');

const flashcardFaqs: FAQItem[] = [
  {
    question: 'What drawings are included in the ESL Flashcard Maker?',
    answer:
      'All 125 original black-and-white KinderESL line-art illustrations are built in—including farm animals, winter clothes, classroom objects, food, daily routines, body parts, feelings, community helpers, and 31 CVC phonics words.',
  },
  {
    question: 'Can I upload my own pictures or edit the English card labels?',
    answer:
      'Yes. Click Upload Your Own Pictures to add your own PNG or JPG images directly inside your browser, and click any word input to customize labels in uppercase, lowercase, or different unit terms.',
  },
  {
    question: 'How does Picture + Trace mode work on flashcards?',
    answer:
      'Selecting Picture + Trace places clean Zaner-Bloser 3-line dashed handwriting strokes under every illustration so preschoolers can both name the picture and trace its English word.',
  },
  {
    question: 'What is the Matching Word-Only Cards option for?',
    answer:
      'Enabling Matching Word-Only Cards appends a second set of text-only cards in the exact same grid layout so students can play memory, slap-the-card, or picture-to-word matching in centers.',
  },
];

export default async function FlashcardMakerToolPage() {
  const vocabWorksheets = (await fetchWorksheetsBySubject('vocabulary')).slice(
    0,
    4
  );
  const webAppSchema = buildToolWebAppSchema('flashcard-maker');

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
              { label: 'Picture Flashcard Maker' },
            ]}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14 space-y-14">
        <header className="max-w-3xl space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#F0F7F7] text-[#2E6B6B] border border-[#d0e3e3]">
            <Sparkles className="w-3.5 h-3.5 text-[#F2B544]" />
            <span>Free ESL Flashcards · 125 Illustrated Drawings</span>
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-heading">
            Free Printable ESL Picture Flashcard Maker
          </h1>
          <p className="text-base text-slate-600 leading-relaxed">
            Mix and match 125 crisp, coloring-friendly KinderESL line drawings—or upload your own pictures—to print 2×2, 2×3, or 3×3 classroom flashcards with optional traceable words and matching word decks in US Letter or A4.
          </p>
        </header>

        <FlashcardGenerator />

        <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              step: 'Idea 1 · Color-It-Yourself Vocabulary Cards',
              text: 'Clean black-ink illustrations save printer toner and let students color each card while repeating the English vocabulary word aloud.',
            },
            {
              step: 'Idea 2 · Picture-to-Word Memory Games',
              text: 'Check Add Matching Word-Only Cards with 3×3 mini grids to instantly print memory pairs and literacy center matching trays.',
            },
            {
              step: 'Idea 3 · Trace-the-Word Phonics Cards',
              text: 'Switch Card Style to Picture + Trace with our CVC Phonics set so early readers connect beginning sounds, pictures, and pencil strokes.',
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
                  Pair custom picture flashcards with our ready-to-print thematic ESL lesson packs.
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
            items={flashcardFaqs}
            title="Picture Flashcard Maker FAQ"
          />
        </div>

        <NewsletterBox source="tool-flashcard-maker" />
      </div>
    </div>
  );
}
