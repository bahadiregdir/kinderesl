import type { Metadata } from 'next';
import Link from 'next/link';
import { months } from '@/data/months';
import { getWorksheetsByMonth } from '@/data/worksheets';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { getSiteUrl } from '@/config/site';
import { Calendar, ArrowRight, Sun, Snowflake, CloudRain, Leaf } from 'lucide-react';

const siteUrl = getSiteUrl();
const pageUrl = `${siteUrl}/preschool-themes`;

export const metadata: Metadata = {
  title: 'Monthly Preschool & Kindergarten Curriculum Calendar (Jan–Dec)',
  description:
    'A full year of preschool themes and printable lesson plans organized month-by-month from January to December.',
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    title: 'Monthly Preschool & Kindergarten Curriculum Calendar (Jan–Dec)',
    description: 'A full year of preschool themes organized month-by-month.',
    url: pageUrl,
    type: 'website',
  },
  // Item 7: Noindex until monthly themes are fully populated
  robots: {
    index: false,
    follow: false,
  },
};

export default function MonthlyThemesIndexPage() {
  const getSeasonIcon = (season: string) => {
    switch (season) {
      case 'Winter':
        return <Snowflake className="w-4 h-4 text-sky-500" />;
      case 'Spring':
        return <CloudRain className="w-4 h-4 text-emerald-500" />;
      case 'Summer':
        return <Sun className="w-4 h-4 text-amber-500" />;
      case 'Fall':
        return <Leaf className="w-4 h-4 text-orange-500" />;
      default:
        return <Calendar className="w-4 h-4 text-[#2E6B6B]" />;
    }
  };

  return (
    <>
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: 'Monthly Curriculums' }]} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <div className="max-w-3xl mb-10">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#2E6B6B] bg-[#F0F7F7] px-2.5 py-1 rounded mb-3">
            <Calendar className="w-3.5 h-3.5" />
            <span>Annual Planning Guide</span>
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            Preschool Monthly Themes &amp; Lesson Calendars
          </h1>
          <p className="text-base text-slate-600 leading-relaxed">
            Plan your classroom curriculum month-by-month. Each month provides focus topics, seasonal vocabulary, and matching printable worksheets.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {months.map((m) => {
            const count = getWorksheetsByMonth(m.slug).length;
            return (
              <div
                key={m.slug}
                className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs hover:border-[#2E6B6B] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                      {getSeasonIcon(m.season)}
                      <span>{m.season}</span>
                    </span>
                    {count > 0 && (
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#F0F7F7] text-[#2E6B6B]">
                        {count} {count > 1 ? 'Resources' : 'Resource'}
                      </span>
                    )}
                  </div>

                  <h2 className="text-xl font-bold text-slate-900 mb-2">
                    <Link href={`/preschool-themes/${m.slug}`} className="hover:text-[#2E6B6B]">
                      {m.name} Themes
                    </Link>
                  </h2>

                  <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-2">
                    {m.description}
                  </p>

                  <div className="space-y-1 mb-4">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500 block">
                      Curriculum Topics:
                    </span>
                    <p className="text-xs text-slate-700 font-medium">
                      {m.curriculumThemes.slice(0, 3).join(' · ')}
                    </p>
                  </div>
                </div>

                <Link
                  href={`/preschool-themes/${m.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#2E6B6B] hover:text-[#225151] pt-3 border-t border-slate-100"
                >
                  <span>View {m.name} Curriculum Plan</span>
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
