import Link from 'next/link';
import { getAllWorksheets } from '@/data/worksheets';
import { categories } from '@/data/categories';
import { themes } from '@/data/themes';
import { months } from '@/data/months';
import { siteConfig } from '@/config/site';
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
  ShieldCheck,
  Calendar,
  Layers,
  GraduationCap,
} from 'lucide-react';

export default function HomePage() {
  const worksheets = getAllWorksheets();

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
      case 'shapes-colors':
        return <Shapes className="w-6 h-6 text-[#2E6B6B]" />;
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
      question: 'Who creates and reviews the learning printables?',
      answer:
        `All materials are designed and vetted by ${siteConfig.author.name}, a veteran Early Childhood ESL educator holding a Master of Education (M.Ed.) with over 10 years of classroom teaching experience.`,
    },
    {
      question: 'How are these printables formatted for printing?',
      answer:
        'Every worksheet is crafted in standard 8.5×11" US Letter format (which also prints seamlessly on standard A4 paper). High-contrast black line art ensures clear printing on standard classroom black-and-white copy machines.',
    },
    {
      question: 'Are the resources appropriate for multilingual and ESL learners?',
      answer:
        'Yes. In addition to native English curriculum pacing, our worksheets incorporate explicit visual anchors, initial sound phoneme chants, and Total Physical Response (TPR) cues specifically designed for early English language learners.',
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
              Classroom-Tested Printable Resources for{' '}
              <span className="text-[#2E6B6B] underline decoration-[#2E6B6B]/30 decoration-wavy">
                Early Childhood Educators
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-8 max-w-2xl mx-auto font-normal">
              High-resolution printable PDF worksheets crafted by certified early childhood educators. Clean, purposeful designs that build phonics fluency, handwriting muscle memory, and early number sense without visual clutter.
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
                <span>Classroom-Tested Pedagogy</span>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => (
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
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                  <span>{cat.targetAges}</span>
                  <span className="text-[#2E6B6B] font-bold group-hover:translate-x-0.5 transition-transform">
                    Explore Hub →
                  </span>
                </div>
              </Link>
            ))}

            {/* Smartboard Games Hub Card */}
            <Link
              href="/games"
              className="group p-6 rounded-xl border-2 border-dashed border-[#2E6B6B]/40 bg-[#F0F7F7]/50 hover:bg-[#F0F7F7] hover:border-[#2E6B6B] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-lg bg-[#2E6B6B] text-white flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded mb-2">
                  <span>Ad-Free Screen</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#2E6B6B] transition-colors mb-2">
                  Classroom Smartboard Games
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Interactive HTML5 educational games designed for preschool smartboards and classroom projectors with zero distracting ads.
                </p>
              </div>
              <div className="pt-3 border-t border-teal-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>Circle Time / Projector</span>
                <span className="text-[#2E6B6B] font-bold">Launch Games →</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured / Newly Added Worksheets */}
      <section className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#2E6B6B] block mb-1">
                Teacher Favorites
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Featured &amp; Newly Released Worksheets
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

      {/* Mid-Page Isolated Ad Unit */}
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
              Explore interconnected themes that weave phonics, counting, and science together across your monthly classroom calendar.
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

          {/* Monthly Curriculums Banner */}
          <div className="mt-10 bg-[#F0F7F7] border border-[#d0e3e3] rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-xs font-bold uppercase tracking-wider text-[#2E6B6B] flex items-center justify-center sm:justify-start gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>Annual Teaching Calendar</span>
              </span>
              <h3 className="text-lg font-bold text-slate-900">
                12-Month Preschool Theme Curriculum Guide
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
                Access curated monthly plans from January through December with milestone checklists and thematic printables.
              </p>
            </div>
            <Link
              href="/preschool-themes"
              className="shrink-0 px-5 py-3 rounded-xl bg-[#2E6B6B] hover:bg-[#225151] text-white font-bold text-xs shadow-xs transition-colors"
            >
              Browse 12-Month Calendar →
            </Link>
          </div>
        </div>
      </section>

      {/* Author & E-E-A-T Section */}
      <section className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2E6B6B] block mb-1">
              Curriculum Pedagogy
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Created by Early Childhood Educators
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              Every resource on KinderESL is designed with developmental intentionality and tested with real learners.
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
