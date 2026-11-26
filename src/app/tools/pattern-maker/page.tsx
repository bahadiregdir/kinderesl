import React from 'react';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { PatternGenerator } from '@/components/PatternGenerator';
import { WorksheetCard } from '@/components/WorksheetCard';
import { FAQAccordion } from '@/components/FAQAccordion';
import { NewsletterBox } from '@/components/NewsletterBox';
import { AdUnit } from '@/components/AdUnit';
import { fetchWorksheetsBySubject } from '@/lib/worksheets-store';
import { buildToolMetadata, buildToolWebAppSchema } from '@/data/tools';
import { CLIPART_COUNT } from '@/lib/clipart';
import type { FAQItem } from '@/types/worksheet';
import { Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

export const metadata = buildToolMetadata('pattern-maker');

const patternFaqs: FAQItem[] = [
  {
    question: 'Which pattern types should preschoolers learn first?',
    answer:
      'Start ages 3–4 with simple AB alternating rows (for example, Cow-Pig-Cow-Pig-Cow) before introducing AAB, ABB, and 3-part ABC sequences in Pre-K and Kindergarten.',
  },
  {
    question: 'Why include 2 extra distractor cut pieces at the bottom?',
    answer:
      'Without distractors, children can glue the last remaining tile by elimination. Adding 2 distractor squares gently checks real pattern comprehension—or uncheck that box for three-year-old beginners.',
  },
  {
    question: 'How do cut-and-paste pattern sheets help ESL learners?',
    answer:
      'Students chant the English picture words rhythmically across each row ("Apple, pumpkin, apple, pumpkin—what comes next?") so math logic and oral vocabulary grow together.',
  },
  {
    question: 'Can I save and print in A4 size instead of US Letter?',
    answer:
      'Yes. Switch Paper Size to A4 Paper before downloading for 210×297mm classrooms worldwide, complete with an optional Page 2 Teacher Answer Key.',
  },
];

export default async function PatternMakerToolPage() {
  const thinkingWorksheets = (await fetchWorksheetsBySubject('thinking-skills')).slice(0, 4);
  const webAppSchema = buildToolWebAppSchema('pattern-maker');

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
              { label: 'Cut & Paste Pattern Maker' },
            ]}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14 space-y-14">
        <header className="max-w-3xl space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#F0F7F7] text-[#2E6B6B] border border-[#d0e3e3]">
            <Sparkles className="w-3.5 h-3.5 text-[#F2B544]" />
            <span>Early Math &amp; Scissors · AB, AAB, ABB, ABC &amp; Mixed</span>
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-heading">
            Free Cut &amp; Paste Pattern Worksheet Maker
          </h1>
          <p className="text-base text-slate-600 leading-relaxed">
            Create custom AB, AAB, ABB, ABC, or mixed cut-and-paste pattern PDF worksheets from {CLIPART_COUNT} coloring-friendly drawings—complete with bottom scissor tiles, optional distractors, and Page 2 Answer Key.
          </p>
        </header>

        <PatternGenerator />

        <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              step: 'Math Tip 1 · Point & Chant Aloud',
              text: 'Have learners point under each square and chant the English nouns rhythmically before cutting so ears help spot the repeating rule.',
            },
            {
              step: 'Math Tip 2 · Check Placement Before Glue',
              text: 'Teach preschool tables to arrange all four cut tiles loosely inside the dashed ? boxes for a quick teacher check before opening glue sticks.',
            },
            {
              step: 'Math Tip 3 · AB for Age 3, Mixed for Age 5',
              text: 'Use AB with 4 cut tiles for early learners, and switch to Mixed + 2 distractors when Pre-K and Kindergarten kids are ready for a challenge.',
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

        {thinkingWorksheets.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading">
                  Related Logic &amp; Fine-Motor Printables
                </h2>
                <p className="text-xs sm:text-sm text-slate-600">
                  Pair pattern worksheets with scissor strips and visual sorting sheets.
                </p>
              </div>
              <Link
                href="/worksheets/thinking-skills"
                className="inline-flex items-center gap-1 text-xs font-bold text-[#2E6B6B] hover:underline"
              >
                <span>All thinking skills</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {thinkingWorksheets.map((ws) => (
                <WorksheetCard key={ws.slug} worksheet={ws} />
              ))}
            </div>
          </section>
        )}

        <div className="max-w-3xl">
          <FAQAccordion
            items={patternFaqs}
            title="Cut & Paste Pattern Maker FAQ"
          />
        </div>

        <NewsletterBox source="tool-pattern-maker" />
      </div>
    </div>
  );
}
