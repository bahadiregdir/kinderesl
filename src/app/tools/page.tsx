import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { NewsletterBox } from '@/components/NewsletterBox';
import { AdUnit } from '@/components/AdUnit';
import { getSiteUrl } from '@/config/site';
import {
  DEFAULT_OG_IMAGE,
  buildSeoDescription,
  buildSeoTitle,
} from '@/lib/seo-meta';
import {
  Sparkles,
  PenTool,
  Grid3X3,
  Type,
  Hash,
  BookOpenText,
  Images,
  Search,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

const siteUrl = getSiteUrl();
const pageUrl = `${siteUrl}/tools`;
const pageTitle = buildSeoTitle('Free Printable Teacher Tools');
const pageDescription = buildSeoDescription(
  'Free browser-private PDF generators for preschool and ESL teachers: I Spy find-and-count sheets, picture flashcards, picture ESL bingo, name tracing, A–Z letter tracing, 0–20 number tracing, and sight word handwriting in US Letter & A4.'
);

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: { canonical: pageUrl },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: pageUrl,
    type: 'website',
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: pageTitle,
    description: pageDescription,
    images: [DEFAULT_OG_IMAGE.url],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ToolsHubPage() {
  const tools = [
    {
      href: '/tools/name-tracing',
      badge: 'Handwriting · Single & Batch (30)',
      title: 'Custom Name Tracing Worksheet Generator',
      description:
        'Generate ball-and-stick dashed name tracing PDFs for one student or a whole class list of up to 30 names with optional starting dots.',
      features: ['US Letter & A4', 'Landscape & Portrait', 'Title / UPPER / lower'],
      cta: 'Create Name Tracing PDF',
      icon: PenTool,
    },
    {
      href: '/tools/letter-tracing',
      badge: 'Alphabet · Single or Full A–Z',
      title: 'Letter Tracing Worksheet Generator',
      description:
        'Build Zaner-Bloser A–Z tracing sheets for single letters, SATPIN phonics groups, or a complete 26-page alphabet workbook with starting dots.',
      features: ['Aa / AA / aa Formats', 'Phonics Anchor Words', 'Up to 26 Pages'],
      cta: 'Create Letter Tracing PDF',
      icon: Type,
    },
    {
      href: '/tools/number-tracing',
      badge: 'Early Math · 0–20 + Ten-Frames',
      title: 'Number Tracing Worksheet Generator',
      description:
        'Create printable 0–10 and 0–20 numeral formation sheets paired with vector Ten-Frame counting grids and dashed English number words.',
      features: ['0–10 & 0–20 Ranges', 'Visual Ten-Frames', 'Dashed Number Words'],
      cta: 'Create Number Tracing PDF',
      icon: Hash,
    },
    {
      href: '/tools/handwriting-maker',
      badge: 'Sight Words · Read · Trace · Write',
      title: 'Sight Word & Handwriting Worksheet Maker',
      description:
        'Turn Dolch sight words, CVC word families, or your own weekly spelling list into structured 3-column Read, Trace & Write practice PDFs.',
      features: ['6 Dolch & CVC Sets', 'Read · Trace · Write', 'Up to 18 Words'],
      cta: 'Create Handwriting PDF',
      icon: BookOpenText,
    },
    {
      href: '/tools/flashcard-maker',
      badge: 'Vocabulary · 125 Drawings + Upload',
      title: 'ESL Picture Flashcard Maker',
      description:
        'Mix and match 125 coloring-friendly KinderESL drawings or upload your own images to build 2×2, 2×3, or 3×3 picture and traceable flashcards.',
      features: ['125 Built-In Drawings', 'Custom Image Upload', 'Picture + Trace Mode'],
      cta: 'Create Flashcards PDF',
      icon: Images,
    },
    {
      href: '/tools/i-spy-maker',
      badge: 'Visual Counting · 11 Themes + Answer Key',
      title: 'Printable I Spy & Count Worksheet Maker',
      description:
        'Generate non-overlapping find, color, and count I Spy PDFs from 125 coloring-friendly drawings across 11 seasonal & CVC themes plus a verified Page 2 Answer Key.',
      features: ['Easy, Medium & Busy', 'Auto Answer Key', 'Color-Friendly Line Art'],
      cta: 'Create I Spy PDF',
      icon: Search,
    },
    {
      href: '/tools/bingo-maker',
      badge: 'ESL Speaking · Picture & Word Modes',
      title: 'Custom ESL Picture & Word Bingo Maker',
      description:
        'Pick from 125 line-art drawings or custom vocabulary words to build up to 30 uniquely shuffled 3×3 or 4×4 bingo boards plus a visual caller sheet.',
      features: ['Picture & Word Bingo', '1 or 2 Cards / Sheet', 'Visual Caller Sheet'],
      cta: 'Create Bingo Cards PDF',
      icon: Grid3X3,
    },
  ];

  return (
    <div>
      <div className="bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: 'Teacher Tools' }]} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14 space-y-12">
        <header className="max-w-3xl space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#F0F7F7] text-[#2E6B6B] border border-[#d0e3e3]">
            <Sparkles className="w-3.5 h-3.5 text-[#F2B544]" />
            <span>100% Free · Instant Browser PDF Tools</span>
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-heading">
            Free Printable Teacher Tools
          </h1>
          <p className="text-base text-slate-600 leading-relaxed">
            Build personalized classroom printables in seconds—no sign-up required. Every PDF is generated locally inside your browser so student names and classroom lists stay completely private.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.href}
                href={tool.href}
                className="group p-6 sm:p-8 rounded-2xl border border-slate-200/90 hover:border-[#2E6B6B] hover:shadow-md transition-all bg-white flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="w-12 h-12 rounded-xl bg-[#F0F7F7] border border-[#d0e3e3] text-[#2E6B6B] flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#2E6B6B] bg-[#F0F7F7] px-2.5 py-1 rounded-full border border-[#d0e3e3]">
                      {tool.badge}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-xl font-bold text-slate-900 group-hover:text-[#2E6B6B] transition-colors font-heading">
                      {tool.title}
                    </h2>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {tool.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {tool.features.map((feat) => (
                      <span
                        key={feat}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-100 text-slate-700"
                      >
                        {feat}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-sm font-bold text-[#2E6B6B]">
                  <span>{tool.cta}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>

        <div className="p-5 rounded-2xl bg-[#F0F7F7]/70 border border-[#d0e3e3] flex items-center gap-3 text-xs sm:text-sm text-slate-700">
          <ShieldCheck className="w-5 h-5 text-[#2E6B6B] shrink-0" />
          <span>
            <strong>COPPA &amp; Classroom Privacy First:</strong> All PDF files are generated on your device—no student names or custom lists are ever sent to or stored on our servers.
          </span>
        </div>

        <AdUnit slotType="in-content" />

        <NewsletterBox source="tools-hub" />
      </div>
    </div>
  );
}
