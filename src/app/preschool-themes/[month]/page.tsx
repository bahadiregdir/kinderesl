import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { months, getMonthBySlug } from '@/data/months';
import { getWorksheetsByMonth } from '@/data/worksheets';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { WorksheetCard } from '@/components/WorksheetCard';
import { FAQAccordion } from '@/components/FAQAccordion';
import { AdUnit } from '@/components/AdUnit';
import { siteConfig } from '@/config/site';
import { Calendar, CheckCircle2, Target, Sparkles } from 'lucide-react';

interface Props {
  params: Promise<{
    month: string;
  }>;
}

export async function generateStaticParams() {
  return months.map((m) => ({
    month: m.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { month } = await params;
  const m = getMonthBySlug(month);

  if (!m) {
    return {
      title: 'Month Not Found',
    };
  }

  const pageUrl = `${siteConfig.url}/preschool-themes/${m.slug}`;
  const metaTitle = `${m.name} Preschool Themes & Printable Worksheets`;
  const metaDesc = `Free ${m.name} preschool curriculum resources, lesson plan ideas, and printable worksheets. Focus on ${m.curriculumThemes.join(', ')}.`;

  return {
    title: metaTitle,
    description: metaDesc,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: metaTitle,
      description: metaDesc,
      url: pageUrl,
    },
  };
}

export default async function MonthDetailPage({ params }: Props) {
  const { month } = await params;
  const m = getMonthBySlug(month);

  if (!m) {
    notFound();
  }

  const worksheets = getWorksheetsByMonth(m.slug);

  return (
    <>
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: 'Monthly Curriculums', href: '/preschool-themes' },
              { label: `${m.name} Themes` },
            ]}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <div className="max-w-3xl mb-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#2E6B6B] bg-[#F0F7F7] px-2.5 py-1 rounded">
              <Calendar className="w-3.5 h-3.5" />
              <span>{m.season} Season Curriculum</span>
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            {m.name} Preschool Themes &amp; Lesson Plans
          </h1>

          <p className="text-base text-slate-600 leading-relaxed mb-6">
            {m.description}
          </p>

          {/* Curriculum Focus Topics */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 mb-6 shadow-xs">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#2E6B6B]" />
              <span>Key Curricular Themes for {m.name}</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {m.curriculumThemes.map((topic, idx) => (
                <div key={idx} className="flex items-center gap-2 text-slate-700">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#2E6B6B]" />
                  <span className="font-medium">{topic}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Developmental Milestones */}
          <div className="bg-[#F0F7F7] border border-[#d0e3e3] rounded-xl p-5 shadow-xs">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#2E6B6B] mb-3 flex items-center gap-1.5">
              <Target className="w-4 h-4 text-[#2E6B6B]" />
              <span>Target Developmental Milestones</span>
            </h2>
            <div className="space-y-1.5 text-xs text-slate-700">
              {m.learningMilestones.map((milestone, mIdx) => (
                <div key={mIdx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2E6B6B] shrink-0 mt-0.5" />
                  <span>{milestone}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Worksheets Grid */}
        <section className="mb-14">
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-900">
              Printables Recommended for {m.name} ({worksheets.length})
            </h2>
            <span className="text-xs text-slate-500">Free PDF Downloads</span>
          </div>

          {worksheets.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {worksheets.map((ws) => (
                <WorksheetCard key={ws.slug} worksheet={ws} />
              ))}
            </div>
          ) : (
            <div className="bg-slate-50 rounded-xl p-8 text-center text-slate-600 text-sm">
              Explore our core categories or check back as we add new {m.name} seasonal units.
            </div>
          )}
        </section>

        <AdUnit slotType="in-content" />

        <FAQAccordion items={m.faqs} title={`${m.name} Preschool Planning FAQ`} />
      </div>
    </>
  );
}
