import React from 'react';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { ClipCardsGenerator } from '@/components/ClipCardsGenerator';
import { WorksheetCard } from '@/components/WorksheetCard';
import { FAQAccordion } from '@/components/FAQAccordion';
import { NewsletterBox } from '@/components/NewsletterBox';
import { AdUnit } from '@/components/AdUnit';
import { fetchWorksheetsBySubject } from '@/lib/worksheets-store';
import { buildToolMetadata, buildToolWebAppSchema } from '@/data/tools';
import { CLIPART_COUNT } from '@/lib/clipart';
import type { FAQItem } from '@/types/worksheet';
import { Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

export const metadata = buildToolMetadata('clip-cards-maker');

const clipFaqs: FAQItem[] = [
  {
    question: 'How do Beginning Sounds Clip Cards work in preschool?',
    answer:
      'Cut along the dashed lines (or laminate cards for year-round centers). Students name the picture aloud—such as Cow or Duck—and clip a clothespin onto the matching initial letter at the bottom.',
  },
  {
    question: 'What if I don’t have clothespins in the classroom?',
    answer:
      'Students can mark the correct letter box with a mini eraser, pom-pom, Bingo chip, or dry-erase marker inside clear laminating pouches.',
  },
  {
    question: 'Can I switch between uppercase, lowercase, and mixed Aa letters?',
    answer:
      'Yes. Choose UPPER (C), lower (c), or Both (Cc) to match your students’ current phonics stage.',
  },
  {
    question: 'Is there an Answer Key included for independent centers?',
    answer:
      'Yes. Leave Include Teacher Answer Key page checked to append a quick-reference key—or place sticker dots on the back of laminated cards for self-checking centers.',
  },
];

export default async function ClipCardsMakerToolPage() {
  const phonicsWorksheets = (await fetchWorksheetsBySubject('phonics')).slice(0, 4);
  const webAppSchema = buildToolWebAppSchema('clip-cards-maker');

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
              { label: 'Beginning Sounds Clip Cards' },
            ]}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14 space-y-14">
        <header className="max-w-3xl space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#F0F7F7] text-[#2E6B6B] border border-[#d0e3e3]">
            <Sparkles className="w-3.5 h-3.5 text-[#F2B544]" />
            <span>Free Phonics Center · Clothespin &amp; Fine-Motor Cards</span>
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-heading">
            Free Beginning Sounds Clip Cards Maker
          </h1>
          <p className="text-base text-slate-600 leading-relaxed">
            Build 2×2 or 2×3 beginning-sound phonics clip cards from {CLIPART_COUNT} coloring-friendly drawings in US Letter or A4—complete with dashed cut lines, randomized letter choices, and a Teacher Answer Key.
          </p>
        </header>

        <ClipCardsGenerator />

        <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              step: 'Center Tip 1 · Pinch & Strengthen Hands',
              text: 'Squeezing wooden clothespins onto letter boxes builds the exact pincer grip muscles preschoolers need for comfortable pencil holding.',
            },
            {
              step: 'Center Tip 2 · Self-Checking Dot Hack',
              text: 'Before laminating, place a small star sticker or dot behind the correct letter box on the back of each card so kids can flip to self-check.',
            },
            {
              step: 'Center Tip 3 · ESL CVC Phonics Bins',
              text: 'Use the 12-card CVC Phonics set in lowercase mode to connect spoken initial consonant sounds with crisp reading-font letters.',
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
                  Related Phonics &amp; Beginning Sounds Printables
                </h2>
                <p className="text-xs sm:text-sm text-slate-600">
                  Combine custom clip cards with our ready-to-print initial sound packs.
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
            items={clipFaqs}
            title="Beginning Sounds Clip Cards FAQ"
          />
        </div>

        <NewsletterBox source="tool-clip-cards-maker" />
      </div>
    </div>
  );
}
