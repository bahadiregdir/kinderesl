import React from 'react';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { ISpyGenerator } from '@/components/ISpyGenerator';
import { WorksheetCard } from '@/components/WorksheetCard';
import { FAQAccordion } from '@/components/FAQAccordion';
import { NewsletterBox } from '@/components/NewsletterBox';
import { AdUnit } from '@/components/AdUnit';
import { fetchWorksheetsBySubject } from '@/lib/worksheets-store';
import { buildToolMetadata, buildToolWebAppSchema } from '@/data/tools';
import type { FAQItem } from '@/types/worksheet';
import { Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

export const metadata = buildToolMetadata('i-spy-maker');

const ispyFaqs: FAQItem[] = [
  {
    question: 'Does the I Spy Maker automatically create an Answer Key?',
    answer:
      'Yes. Leave Include Page 2 Teacher Answer Key checked to append a verified Page 2 sheet showing exact counts for every target illustration.',
  },
  {
    question: 'Can preschoolers color the I Spy pictures as they count?',
    answer:
      'Yes. Every drawing uses crisp black-ink coloring-book line art on a clean white background so students can color each item as they tally and cross it off.',
  },
  {
    question: 'How do the Easy, Medium, and Busy difficulty levels differ?',
    answer:
      'Easy uses larger illustrations with 2–4 copies each for ages 3–4; Medium places 3–6 copies at mid size for ages 4–5; Busy creates a denser search field with 4–8 copies for kindergarten challenge practice.',
  },
  {
    question: 'Can I generate a fresh I Spy layout using the same theme?',
    answer:
      'Yes. Click Shuffle Layout at any time to re-scatter objects cleanly without overlaps and update the verified Answer Key counts automatically.',
  },
];

export default async function ISpyMakerToolPage() {
  const thinkingWorksheets = (
    await fetchWorksheetsBySubject('thinking-skills')
  ).slice(0, 4);
  const webAppSchema = buildToolWebAppSchema('i-spy-maker');

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
              { label: 'I Spy Worksheet Maker' },
            ]}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14 space-y-14">
        <header className="max-w-3xl space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#F0F7F7] text-[#2E6B6B] border border-[#d0e3e3]">
            <Sparkles className="w-3.5 h-3.5 text-[#F2B544]" />
            <span>Free Visual Discrimination Tool · 125 Drawings</span>
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-heading">
            Free Printable I Spy Worksheet Maker
          </h1>
          <p className="text-base text-slate-600 leading-relaxed">
            Create custom find-and-count I Spy PDF worksheets in US Letter or A4 from 11 preschool themes and 125 coloring-friendly drawings—complete with write-in counting boxes and a verified Page 2 Teacher Answer Key.
          </p>
        </header>

        <ISpyGenerator />

        <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              step: 'Strategy 1 · Color as You Count',
              text: 'Ask children to color all matching items one color (e.g., all mittens blue) before writing the total in the box so they never double-count.',
            },
            {
              step: 'Strategy 2 · Seasonal & CVC Centers',
              text: 'Print Winter, Christmas, Farm, or CVC Phonics I Spy pages and slip them into dry-erase pockets for fast morning work or early-finisher stations.',
            },
            {
              step: 'Strategy 3 · ESL Speaking Practice',
              text: 'Pair students up to take turns calling clues like "I spy 4 snowmen!" to turn visual counting into active English speaking practice.',
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
                  Related Thinking Skills &amp; Visual Discrimination PDFs
                </h2>
                <p className="text-xs sm:text-sm text-slate-600">
                  Combine I Spy search sheets with our printable odd-one-out and fine-motor scissor packs.
                </p>
              </div>
              <Link
                href="/worksheets/thinking-skills"
                className="inline-flex items-center gap-1 text-xs font-bold text-[#2E6B6B] hover:underline"
              >
                <span>All thinking skills PDFs</span>
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
          <FAQAccordion items={ispyFaqs} title="I Spy Worksheet Maker FAQ" />
        </div>

        <NewsletterBox source="tool-i-spy-maker" />
      </div>
    </div>
  );
}
