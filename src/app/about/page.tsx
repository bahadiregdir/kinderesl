import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { AuthorBox } from '@/components/AuthorBox';
import { siteConfig, getSiteUrl } from '@/config/site';
import { BookOpen, ShieldCheck, HeartHandshake, Sparkles } from 'lucide-react';

const siteUrl = getSiteUrl();
const pageUrl = `${siteUrl}/about`;

export const metadata: Metadata = {
  title: `About & Pedagogical Mission | ${siteConfig.name}`,
  description: `Learn about ${siteConfig.name}'s mission to provide free, high-quality printable worksheets for preschool and kindergarten teachers and parents.`,
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    title: `About & Pedagogical Mission | ${siteConfig.name}`,
    description: `Learn about ${siteConfig.name}'s mission and printable design principles.`,
    url: pageUrl,
    type: 'website',
  },
};

export default function AboutPage() {
  return (
    <>
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: 'About & Mission' }]} />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        <header className="mb-8">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#2E6B6B] bg-[#F0F7F7] px-2.5 py-1 rounded mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Mission &amp; Standards</span>
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            About KinderESL &amp; Our Educational Mission
          </h1>
          <p className="text-base text-slate-600 leading-relaxed">
            KinderESL is dedicated to providing free, high-contrast, distraction-free printable PDF resources for early childhood educators, preschool teachers, and homeschooling parents.
          </p>
        </header>

        {/* Clean Author Box */}
        <AuthorBox isCompact={false} />

        {/* Core Design Pillars (Fabricated claims removed as requested in Item 2) */}
        <section className="my-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Our 4 Core Learning Resource Standards
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-[#F0F7F7] text-[#2E6B6B] flex items-center justify-center font-bold text-sm mb-3">
                1
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5">
                Developmentally Appropriate Progression
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Worksheets are sequenced to introduce concrete counting, visual discrimination, and letter recognition with appropriate line heights and touch targets for young learners.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-[#F0F7F7] text-[#2E6B6B] flex items-center justify-center font-bold text-sm mb-3">
                2
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5">
                Multi-Sensory Phonics &amp; Fine-Motor Practice
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Handwriting directionality is reinforced with numbered starting dots and clear pictorial anchors to build pencil grip and letter formation confidence.
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
                Excessive decorative borders distract early learners. Our printables prioritize clean white space, high-contrast black line art, and printer ink efficiency.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-[#F0F7F7] text-[#2E6B6B] flex items-center justify-center font-bold text-sm mb-3">
                4
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5">
                Accessible for Multilingual &amp; ESL Learners
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Visual anchors and oral prompts (such as familiar animal sounds and simple sentence frames) lower anxiety for children acquiring English as an additional language.
              </p>
            </div>
          </div>
        </section>

        {/* Commitment to Free Access */}
        <div className="bg-[#F0F7F7] border border-[#d0e3e3] rounded-xl p-6 sm:p-8 flex items-start gap-4">
          <HeartHandshake className="w-8 h-8 text-[#2E6B6B] shrink-0" />
          <div className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Free Access for Teachers and Parents
            </h3>
            <p>
              We believe foundational learning printables should be freely accessible without paywalls, email barriers, or subscriptions. All PDF materials on KinderESL are free to download and print for classroom and home educational use.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
