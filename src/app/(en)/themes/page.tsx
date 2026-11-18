import type { Metadata } from 'next';
import Link from 'next/link';
import { themes } from '@/data/themes';
import { getWorksheetsByTheme } from '@/data/worksheets';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { getSiteUrl } from '@/config/site';
import { Sparkles, Calendar, ArrowRight } from 'lucide-react';

const siteUrl = getSiteUrl();
const pageUrl = `${siteUrl}/themes`;

export const metadata: Metadata = {
  title: 'Preschool & Kindergarten Thematic Units and Learning Themes',
  description:
    'Explore thematic preschool printables: Winter, Farm Animals, Insects & Bugs, Alphabet, and Seasonal units designed for early childhood classrooms.',
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    title: 'Preschool & Kindergarten Thematic Units and Learning Themes',
    description: 'Explore thematic preschool printables and seasonal units.',
    url: pageUrl,
    type: 'website',
  },
  // Item 7: Noindex until themes contain >= 3 worksheets each
  robots: {
    index: false,
    follow: false,
  },
};

export default function ThemesIndexPage() {
  return (
    <>
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: 'Themes' }]} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <div className="max-w-3xl mb-10">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#2E6B6B] bg-[#F0F7F7] px-2.5 py-1 rounded mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Thematic Teaching Units</span>
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            Curriculum Themes for Early Learners
          </h1>
          <p className="text-base text-slate-600 leading-relaxed">
            Thematic instruction anchors vocabulary, mathematics, and critical thinking into meaningful real-world concepts that young children can easily conceptualize.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {themes.map((theme) => {
            const count = getWorksheetsByTheme(theme.slug).length;
            return (
              <div
                key={theme.slug}
                className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs hover:border-[#2E6B6B] hover:shadow-sm transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-600 mb-2">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      <span>Best Months: {theme.bestMonths.join(', ')}</span>
                    </span>
                    <span className="font-semibold text-[#2E6B6B]">{count} Printables</span>
                  </div>

                  <h2 className="text-xl font-bold text-slate-900 mb-2">
                    <Link href={`/themes/${theme.slug}`} className="hover:text-[#2E6B6B]">
                      {theme.title}
                    </Link>
                  </h2>

                  <p className="text-sm text-slate-600 leading-relaxed mb-4">
                    {theme.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {theme.skillsCovered.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <Link
                  href={`/themes/${theme.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2E6B6B] hover:text-[#225151]"
                >
                  <span>Explore {theme.title} Printables</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
