import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { themes, getThemeBySlug } from '@/data/themes';
import { getWorksheetsByTheme } from '@/data/worksheets';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { WorksheetCard } from '@/components/WorksheetCard';
import { FAQAccordion } from '@/components/FAQAccordion';
import { AdUnit } from '@/components/AdUnit';
import { getSiteUrl } from '@/config/site';
import { Sparkles, Calendar, Target } from 'lucide-react';

interface Props {
  params: Promise<{
    theme: string;
  }>;
}

export async function generateStaticParams() {
  return themes.map((t) => ({
    theme: t.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { theme } = await params;
  const th = getThemeBySlug(theme);

  if (!th) {
    return {
      title: 'Theme Not Found',
    };
  }

  const siteUrl = getSiteUrl();
  const pageUrl = `${siteUrl}/themes/${th.slug}`;
  const metaTitle = `Free ${th.title} Worksheets & Activities`;
  const metaDesc = `${th.description} Free printable PDF educational resources for preschool and kindergarten.`;

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
      type: 'website',
    },
    // Item 7: Noindex until this theme has >= 3 worksheets
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function ThemeDetailPage({ params }: Props) {
  const { theme } = await params;
  const th = getThemeBySlug(theme);

  if (!th) {
    notFound();
  }

  const worksheets = getWorksheetsByTheme(th.slug);

  return (
    <>
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: 'Themes', href: '/themes' },
              { label: th.title },
            ]}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <div className="max-w-3xl mb-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#2E6B6B] bg-[#F0F7F7] px-2.5 py-1 rounded">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Thematic Teaching Unit</span>
            </span>
            <span className="text-xs text-slate-600 font-medium flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>Recommended Months: {th.bestMonths.join(', ')}</span>
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            {th.title}
          </h1>

          <p className="text-base text-slate-600 leading-relaxed mb-6">
            {th.description}
          </p>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1">
              <Target className="w-3 h-3 text-[#2E6B6B]" />
              <span>Target Skills:</span>
            </span>
            {th.skillsCovered.map((skill, idx) => (
              <span
                key={idx}
                className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Worksheets Grid */}
        <section className="mb-14">
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-900">
              Thematic Printables ({worksheets.length})
            </h2>
            <span className="text-xs text-slate-600">Free PDF Downloads</span>
          </div>

          {worksheets.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {worksheets.map((ws) => (
                <WorksheetCard key={ws.slug} worksheet={ws} />
              ))}
            </div>
          ) : (
            <div className="bg-slate-50 rounded-xl p-8 text-center text-slate-600 text-sm">
              More {th.title} printables will be added here soon.
            </div>
          )}
        </section>

        <AdUnit slotType="in-content" />

        <FAQAccordion items={th.faqs} title={`${th.title} Planning FAQ`} />
      </div>
    </>
  );
}
