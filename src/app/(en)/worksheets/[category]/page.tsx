import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { categories, getCategoryBySlug } from '@/data/categories';
import { getWorksheetsByCategory } from '@/data/worksheets';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { WorksheetCard } from '@/components/WorksheetCard';
import { FAQAccordion } from '@/components/FAQAccordion';
import { AdUnit } from '@/components/AdUnit';
import { getSiteUrl } from '@/config/site';
import { BookOpen, Target } from 'lucide-react';

interface Props {
  params: Promise<{
    category: string;
  }>;
}

export async function generateStaticParams() {
  return categories.map((c) => ({
    category: c.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const cat = getCategoryBySlug(category);

  if (!cat) {
    return {
      title: 'Category Not Found',
    };
  }

  const worksheets = getWorksheetsByCategory(cat.slug);
  const siteUrl = getSiteUrl();
  const pageUrl = `${siteUrl}/worksheets/${cat.slug}`;
  const metaTitle = `Free ${cat.title} for Preschool & Kindergarten`;
  const metaDesc = `Download free printable ${cat.title.toLowerCase()}. Curated for preschool, kindergarten, and early ESL teachers. High-resolution PDF downloads.`;

  // Item 6: Categories with < 3 worksheets are noindex, follow until content reaches 3+
  const isLowContent = worksheets.length < 3;

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
    robots: isLowContent
      ? {
          index: false,
          follow: true,
        }
      : {
          index: true,
          follow: true,
        },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const cat = getCategoryBySlug(category);

  if (!cat) {
    notFound();
  }

  const worksheets = getWorksheetsByCategory(cat.slug);

  return (
    <>
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: 'Worksheets', href: '/worksheets' },
              { label: cat.shortTitle },
            ]}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        {/* Category Header */}
        <div className="max-w-3xl mb-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#2E6B6B] bg-[#F0F7F7] px-2.5 py-1 rounded">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Curriculum Resource Hub</span>
            </span>
            <span className="text-xs text-slate-600 font-medium">
              {cat.targetAges}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            {cat.title}
          </h1>

          <p className="text-base text-slate-600 leading-relaxed mb-6">
            {cat.description}
          </p>

          <div className="bg-white border border-slate-200 rounded-lg p-4 text-xs text-slate-700 flex items-start gap-3">
            <Target className="w-4 h-4 text-[#2E6B6B] shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900">Pedagogical Framework: </strong>
              <span>{cat.pedagogicalFocus}</span>
            </div>
          </div>
        </div>

        {/* Worksheets Grid */}
        <section className="mb-14">
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-900">
              Available Printables ({worksheets.length})
            </h2>
            <span className="text-xs text-slate-600">100% Free PDF Downloads</span>
          </div>

          {worksheets.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {worksheets.map((ws) => (
                <WorksheetCard key={ws.slug} worksheet={ws} />
              ))}
            </div>
          ) : (
            <div className="bg-slate-50 rounded-xl p-8 text-center text-slate-600 text-sm">
              New printables are being prepared for this category. Check back soon!
            </div>
          )}
        </section>

        {/* Mid-page Ad Slot */}
        <AdUnit slotType="in-content" />

        {/* Educator FAQ */}
        <FAQAccordion items={cat.faqs} title={`${cat.shortTitle} Curriculum & Instruction FAQ`} />
      </div>
    </>
  );
}
