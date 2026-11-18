import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { AuthorBox } from '@/components/AuthorBox';
import { siteConfig } from '@/config/site';
import { GraduationCap, CheckCircle2, ShieldCheck, HeartHandshake, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: `About the Author & Curriculum Philosophy | ${siteConfig.name}`,
  description: `Learn about ${siteConfig.author.name}, early childhood ESL curriculum specialist. Discover our pedagogical standards, classroom testing process, and mission.`,
  alternates: {
    canonical: `${siteConfig.url}/about`,
  },
};

export default function AboutPage() {
  const { author } = siteConfig;

  return (
    <>
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: 'About & Pedagogy' }]} />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        <header className="mb-8">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#2E6B6B] bg-[#F0F7F7] px-2.5 py-1 rounded mb-3">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Curriculum Authority &amp; E-E-A-T</span>
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            Meet the Teacher &amp; Editorial Mission
          </h1>
          <p className="text-base text-slate-600 leading-relaxed">
            KinderESL was established to bridge the gap between heavy, commercialized curriculum packages and busy teachers in need of clean, classroom-tested printables.
          </p>
        </header>

        {/* Full Author Box */}
        <AuthorBox isCompact={false} />

        {/* 4 Core Editorial Pillars */}
        <section className="my-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Our 4 Editorial &amp; Pedagogical Standards
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-[#F0F7F7] text-[#2E6B6B] flex items-center justify-center font-bold text-sm mb-3">
                1
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5">
                Classroom-Tested First
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Every worksheet is piloted in actual preschool and kindergarten classrooms with real students to confirm stroke line heights, icon spacing, and attention span suitability before publication.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-[#F0F7F7] text-[#2E6B6B] flex items-center justify-center font-bold text-sm mb-3">
                2
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5">
                Multi-Sensory Phonics &amp; Kinesthetics
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                We align handwriting directionality with oral sound articulation and visual cue anchors. Children trace with explicit numbered starting dots rather than guessing stroke order.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-[#F0F7F7] text-[#2E6B6B] flex items-center justify-center font-bold text-sm mb-3">
                3
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5">
                Low-Visual Clutter Architecture
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Excessive decorative borders and neon colors distract early learners. Our printables prioritize clean white space, high-contrast black line art, and printer-ink efficiency.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-[#F0F7F7] text-[#2E6B6B] flex items-center justify-center font-bold text-sm mb-3">
                4
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5">
                Inclusive for ESL &amp; Multilingual Learners
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Language prompts incorporate Total Physical Response (TPR) strategies and familiar universal imagery so children from any linguistic background can succeed.
              </p>
            </div>
          </div>
        </section>

        {/* Commitment to Free Access */}
        <div className="bg-[#F0F7F7] border border-[#d0e3e3] rounded-xl p-6 sm:p-8 flex items-start gap-4">
          <HeartHandshake className="w-8 h-8 text-[#2E6B6B] shrink-0" />
          <div className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Our 100% Free Educational Pledge
            </h3>
            <p>
              We believe quality early learning materials should be accessible to every public school teacher, private educator, and homeschooling parent without paywalls, email barriers, or subscriptions. Non-obtrusive advertisements on the website allow us to maintain this free library.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
