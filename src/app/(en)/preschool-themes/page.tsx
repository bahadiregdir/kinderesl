import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { months } from '@/data/months';
import { topics } from '@/data/topics';
import { getWorksheetsByMonth } from '@/data/worksheets';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Sparkles, Calendar, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Preschool Themes by Month (12-Month Curriculum) | KinderESL',
  description:
    'Plan your preschool and kindergarten calendar with our 12-month thematic curriculum guide. Free printable PDF worksheets for each seasonal month.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function PreschoolThemesIndexPage() {
  return (
    <div>
      <div className="bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: 'Monthly Themes' }]} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14 space-y-10">
        <div className="max-w-3xl space-y-3">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-heading">
            Monthly Preschool Themes
          </h1>
          <p className="text-base text-slate-600 leading-relaxed font-normal">
            A structured 12-month curriculum calendar mapping seasonal topics, vocabulary sets, and phonics units to every month of the school year.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {months.map((m) => {
            const count = getWorksheetsByMonth(m.monthNumber).length;
            const monthTopics = topics.filter((t) => m.topicSlugs.includes(t.slug));

            return (
              <Link
                key={m.slug}
                href={`/preschool-themes/${m.slug}`}
                className="group p-6 rounded-2xl border border-slate-200/80 hover:border-[#2E6B6B] hover:shadow-md transition-all bg-white flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-[#2E6B6B] uppercase tracking-wider">
                      {m.season}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      {count} {count === 1 ? 'printable' : 'printables'}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-[#2E6B6B] transition-colors mb-2 font-heading">
                    {m.name} Themes
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {m.description}
                  </p>

                  {/* Active topics pills */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {monthTopics.map((t) => (
                      <span
                        key={t.slug}
                        className="px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200 text-[11px] text-slate-600 font-medium capitalize"
                      >
                        {t.title}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-[#2E6B6B] font-bold">
                  <span>View {m.name} printables</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
