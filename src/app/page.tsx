import Link from 'next/link';
import { getAllWorksheets } from '@/data/worksheets';
import { categories } from '@/data/categories';
import { themes } from '@/data/themes';
import { siteConfig, getSiteUrl } from '@/config/site';
import { WorksheetCard } from '@/components/WorksheetCard';
import { AuthorBox } from '@/components/AuthorBox';
import { FAQAccordion } from '@/components/FAQAccordion';
import { AdUnit } from '@/components/AdUnit';
import {
  BookOpen,
  Calculator,
  Brain,
  Languages,
  Shapes,
  CheckCircle2,
  FileDown,
  Sparkles,
  ArrowRight,
  Calendar,
  Layers,
  GraduationCap,
} from 'lucide-react';

export default function HomePage() {
  const worksheets = getAllWorksheets();
  // Filter out shapes-colors (Item 7)
  const activeCategories = categories.filter((c) => c.slug !== 'shapes-colors');

  const getCategoryIcon = (slug: string) => {
    switch (slug) {
      case 'literacy':
        return <BookOpen className="w-6 h-6 text-[#2E6B6B]" />;
      case 'math':
        return <Calculator className="w-6 h-6 text-[#2E6B6B]" />;
      case 'thinking-skills':
        return <Brain className="w-6 h-6 text-[#2E6B6B]" />;
      case 'esl-vocabulary':
        return <Languages className="w-6 h-6 text-[#2E6B6B]" />;
      default:
        return <Layers className="w-6 h-6 text-[#2E6B6B]" />;
    }
  };

  const homeFaqs = [
    {
      question: 'Are all printable worksheets on KinderESL completely free?',
      answer:
        'Yes, 100% free. Every printable PDF can be downloaded directly without membership fees, email opt-ins, or subscriptions. They are licensed for personal home and school classroom instructional use.',
    },
    {
      question: 'What formats are provided for the worksheets?',
      answer:
        'Every worksheet is provided as a standard 8.5×11" US Letter vector PDF (which also prints cleanly on A4 paper). High-contrast black line art ensures clear results on standard black-and-white classroom copy machines.',
    },
    {
      question: 'How do these printables support ESL / ELL students?',
      answer:
        'Visual anchors, clear illustrations, animal sound associations, and simple sentence frames help early English learners build vocabulary and phonetic confidence in low-anxiety contexts.',
    },
    {
      question: 'Can I print these worksheets for all the students in my classroom?',
      answer:
        'Yes. You are fully permitted to print as many copies as needed for your classroom students, tutoring sessions, or homeschooling children.',
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#F0F7F7] via-[#F8FAFC] to-white border-b border-slate-200 py-16 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            {/* Audience Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-white text-[#2E6B6B] border border-[#d0e3e3] shadow-xs mb-6">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Dedicated Resource for Preschool, Kindergarten &amp; ESL Educators</span>
            </div>

            {/* H1 Value Proposition */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-6">
              Printable Learning Resources for{' '}
              <span className="text-[#2E6B6B] underline decoration-[#2E6B6B]/30 decoration-wavy">
                Teachers &amp; Parents
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-8 max-w-2xl mx-auto font-normal">
              High-resolution printable PDF worksheets for preschool and kindergarten. Clean, purposeful designs that build phonics awareness, handwriting readiness, and early number sense without visual clutter.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-10">
              <Link
                href="/worksheets"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-[#2E6B6B] hover:bg-[#225151] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all"
              >
                <FileDown className="w-4 h-4" />
                <span>Browse All Worksheets</span>
              </Link>
              <Link
                href="/themes"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm border border-slate-300 shadow-xs transition-colors"
              >
                <Sparkles className="w-4 h-4 text-[#2E6B6B]" />
                <span>Explore Thematic Units</span>
              </Link>
            </div>

            {/* Feature points */}
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-xs text-slate-600 pt-6 border-t border-slate-200/60 font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>100% Free PDF Downloads</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Standard 8.5×11&quot; US Letter</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Clean High-Contrast Layouts</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>No Paywalls or Login</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum Resource Hubs (Categories) */}
      <section className="py-16 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#2E6B6B] block mb-1">
                Core Domains
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Curriculum Resource Hubs
              </h2>
            </div>
            <Link
              href="/worksheets"
              className="inline-flex items-center gap-1 text-xs font-bold text-[#2E6B6B] hover:text-[#225151]"
            >
              <span>View all categories</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {activeCategories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/worksheets/${cat.slug}`}
                className="group p-6 rounded-xl border border-slate-200 hover:border-[#2E6B6B] hover:shadow-sm transition-all bg-white flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-lg bg-[#F0F7F7] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                    {getCategoryIcon(cat.slug)}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#2E6B6B] transition-colors mb-2">
                    {cat.shortTitle}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {cat.description}
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 font-medium">
                  <span>{cat.targetAges}</span>
                  <span className="text-[#2E6B6B] font-bold group-hover:translate-x-0.5 transition-transform">
                    Explore Hub →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured / Newly Added Worksheets */}
      <section className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#2E6B6B] block mb-1">
                Printables
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Featured Worksheets
              </h2>
            </div>
            <Link
              href="/worksheets"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2E6B6B] hover:text-[#225151]"
            >
              <span>See full printables catalog</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {worksheets.map((ws) => (
              <WorksheetCard key={ws.slug} worksheet={ws} />
            ))}
          </div>
        </div>
      </section>

      {/* Mid-Page Isolated Ad Unit (Returns null until AdSense is configured) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdUnit slotType="in-content" />
      </div>

      {/* Popular Thematic Units & Seasonal Hubs */}
      <section className="py-16 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2E6B6B] block mb-1">
              Curricular Units
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-3">
              Popular Preschool Learning Themes
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Explore thematic printables that connect phonics, counting, and seasonal vocabulary.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {themes.map((theme) => (
              <Link
                key={theme.slug}
                href={`/themes/${theme.slug}`}
                className="group p-5 rounded-xl border border-slate-200 hover:border-[#2E6B6B] hover:shadow-sm transition-all bg-white"
              >
                <span className="text-[11px] font-bold text-[#2E6B6B] uppercase tracking-wider block mb-1">
                  {theme.bestMonths[0]} Unit
                </span>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-[#2E6B6B] transition-colors mb-2">
                  {theme.title}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
                  {theme.description}
                </p>
                <span className="text-xs font-bold text-[#2E6B6B] inline-flex items-center gap-1">
                  <span>View Printables</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Author & Mission Section */}
      <section className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2E6B6B] block mb-1">
              Curriculum Background
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Created for Early Childhood Educators
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              Every resource on KinderESL is designed to support foundational learning with clean, print-friendly materials.
            </p>
          </div>

          <AuthorBox isCompact={false} />
        </div>
      </section>

      {/* Educator FAQ / GEO Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FAQAccordion items={homeFaqs} title="Preschool &amp; Kindergarten Curriculum FAQ" />
        </div>
      </section>
    </div>
  );
}
