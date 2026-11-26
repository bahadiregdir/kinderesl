import React from 'react';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { MatchingGenerator } from '@/components/MatchingGenerator';
import { WorksheetCard } from '@/components/WorksheetCard';
import { FAQAccordion } from '@/components/FAQAccordion';
import { NewsletterBox } from '@/components/NewsletterBox';
import { AdUnit } from '@/components/AdUnit';
import { fetchWorksheetsBySubject } from '@/lib/worksheets-store';
import { buildToolMetadata, buildToolWebAppSchema } from '@/data/tools';
import type { FAQItem } from '@/types/worksheet';
import { Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

export const metadata = buildToolMetadata('matching-maker');

const matchingFaqs: FAQItem[] = [
  {
    question: 'What is the difference between Picture-Word and Picture-Letter matching?',
    answer:
      'Picture ↔ Word matching builds sight vocabulary by connecting drawings to whole English words, while Picture ↔ Beginning Letter matching targets phonemic awareness (e.g., Cow → Cc, Dog → Dd).',
  },
  {
    question: 'Are matching pairs shuffled differently each time?',
    answer:
      'Yes. Clicking Shuffle Column randomizes the right-hand column so no answer sits directly across from its matching picture, and updates the Page 2 Answer Key lines automatically.',
  },
  {
    question: 'Can preschoolers color the matching pictures too?',
    answer:
      'Yes. All 125 illustrations use crisp black-ink coloring-book outlines that save printer ink and let students color each object after drawing their matching lines.',
  },
  {
    question: 'Are both US Letter and A4 paper sizes supported?',
    answer:
      'Yes. Switch between US Letter (8.5×11") and ISO A4 (210×297mm) at any time before downloading or printing.',
  },
];

export default async function MatchingMakerToolPage() {
  const phonicsWorksheets = (await fetchWorksheetsBySubject('phonics')).slice(0, 4);
  const webAppSchema = buildToolWebAppSchema('matching-maker');

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
              { label: 'Picture Matching Maker' },
            ]}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14 space-y-14">
        <header className="max-w-3xl space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#F0F7F7] text-[#2E6B6B] border border-[#d0e3e3]">
            <Sparkles className="w-3.5 h-3.5 text-[#F2B544]" />
            <span>Free Phonics &amp; Vocabulary Tool · Instant PDF</span>
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-heading">
            Free Beginning Sounds &amp; Picture Matching Worksheet Maker
          </h1>
          <p className="text-base text-slate-600 leading-relaxed">
            Create clean draw-a-line matching worksheets in US Letter or A4 from 125 preschool drawings—switch between Picture ↔ Word vocabulary matching and Picture ↔ Beginning Letter phonics with an automatic Answer Key.
          </p>
        </header>

        <MatchingGenerator />

        <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              step: 'Tip 1 · Rainbow Pencil Lines',
              text: 'Have preschoolers trace each matching line with a different crayon color so teachers can check every pair at a quick glance.',
            },
            {
              step: 'Tip 2 · Pre-K Beginning Sounds',
              text: 'Switch to Picture ↔ Letter mode with Both (Cc) labels to reinforce uppercase/lowercase letter recognition alongside initial sounds.',
            },
            {
              step: 'Tip 3 · Instant Exit Tickets',
              text: 'Print 6-pair Picture ↔ Word pages as 3-minute Friday ESL unit check-ins with Page 2 kept on your clipboard for quick grading.',
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
                  Pair custom matching sheets with our illustrated letter-sound packs.
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
            items={matchingFaqs}
            title="Picture Matching Maker FAQ"
          />
        </div>

        <NewsletterBox source="tool-matching-maker" />
      </div>
    </div>
  );
}
