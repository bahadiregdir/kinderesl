import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { topics } from '@/data/topics';
import { getWorksheetsByTopic } from '@/data/worksheets';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { getSiteUrl } from '@/config/site';
import { Sparkles, ArrowRight, BookOpen } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Preschool & Kindergarten Learning Topics',
  description:
    'Explore free printable worksheets organized by theme and vocabulary topic: farm animals, winter, food, insects, weather, and more.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function TopicsIndexPage() {
  return (
    <div>
      <div className="bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: 'Topics' }]} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14 space-y-10">
        <div className="max-w-3xl space-y-3">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-heading">
            Learning Topics &amp; Themes
          </h1>
          <p className="text-base text-slate-600 leading-relaxed">
            Connect letters, numbers, and vocabulary to engaging thematic units. Designed to support preschool curriculum planning and ESL thematic oral repetition.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics.map((topic) => {
            const count = getWorksheetsByTopic(topic.slug).length;
            return (
              <Link
                key={topic.slug}
                href={`/topics/${topic.slug}`}
                className="group p-6 rounded-2xl border border-slate-200/80 hover:border-[#2E6B6B] hover:shadow-md transition-all bg-white flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-[#2E6B6B] uppercase tracking-wider">
                      {topic.curriculumMonths.length > 0 ? 'Seasonal Unit' : 'General Topic'}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      {count} {count === 1 ? 'printable' : 'printables'}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#2E6B6B] transition-colors mb-2 font-heading">
                    {topic.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {topic.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-[#2E6B6B] font-bold">
                  <span>Explore topic</span>
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
