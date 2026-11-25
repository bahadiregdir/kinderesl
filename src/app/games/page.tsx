import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { NewsletterBox } from '@/components/NewsletterBox';
import { getSiteUrl } from '@/config/site';
import {
  DEFAULT_OG_IMAGE,
  buildSeoDescription,
  buildSeoTitle,
} from '@/lib/seo-meta';
import {
  Sparkles,
  Gamepad2,
  Languages,
  Calculator,
  BookOpen,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

const siteUrl = getSiteUrl();
const pageUrl = `${siteUrl}/games`;
const pageTitle = buildSeoTitle('Classroom Smartboard Games');
const pageDescription = buildSeoDescription(
  'Ad-free interactive smartboard and circle-time ESL games for preschool and kindergarten teachers are in development and launching soon on KinderESL.'
);

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: {
    canonical: pageUrl,
  },
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
  // Noindex until interactive games library is launched
  robots: {
    index: false,
    follow: false,
  },
};

export default function GamesPage() {
  const upcomingTracks = [
    {
      title: 'Phonics & Letter Sounds',
      description:
        'Tap-to-hear beginning sound challenges and large uppercase-lowercase matching rounds for carpet time.',
      icon: BookOpen,
    },
    {
      title: 'ESL Vocabulary & Circle Time',
      description:
        'Big, clear picture prompts for farm animals, weather, feelings, colors, and classroom routines.',
      icon: Languages,
    },
    {
      title: 'Early Counting & Visual Logic',
      description:
        'Hands-on ten-frame counting games (1–5) and seasonal odd-one-out activities built for group play.',
      icon: Calculator,
    },
  ];

  return (
    <>
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: 'Classroom Smartboard Games' }]} />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-10">
        <section className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-xs text-center space-y-6">
          <div className="flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-[#F0F7F7] border border-[#d0e3e3] text-[#2E6B6B] flex items-center justify-center shadow-2xs">
              <Gamepad2 className="w-7 h-7" />
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#F0F7F7] text-[#2E6B6B] border border-[#d0e3e3]">
              <Sparkles className="w-3.5 h-3.5 text-[#F2B544]" />
              <span>Coming Soon · In Development</span>
            </span>
          </div>

          <div className="max-w-2xl mx-auto space-y-3">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-heading">
              Interactive Classroom Games Are on the Way
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              We are actively building and classroom-testing a brand-new set of distraction-free interactive games for preschool, kindergarten, and ESL circle time. Check back soon as we finish polishing our first activities for whiteboards and tablets.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left pt-2">
            {upcomingTracks.map((track) => {
              const Icon = track.icon;
              return (
                <div
                  key={track.title}
                  className="p-4 rounded-2xl bg-slate-50/90 border border-slate-200/80 space-y-2"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#F0F7F7] text-[#2E6B6B] border border-[#d0e3e3] flex items-center justify-center">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h2 className="text-sm font-bold text-slate-900 font-heading">
                    {track.title}
                  </h2>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {track.description}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/worksheets"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#2E6B6B] hover:bg-[#225151] text-white text-sm font-bold shadow-xs transition-colors"
            >
              <span>Browse Free Printable Worksheets</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/guides"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-bold transition-colors"
            >
              <span>Explore Teaching Guides</span>
            </Link>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-center gap-1.5 text-xs text-slate-500 font-medium">
            <ShieldCheck className="w-4 h-4 text-[#2E6B6B]" />
            <span>100% ad-free · Designed for interactive whiteboards &amp; tablets</span>
          </div>
        </section>

        <NewsletterBox source="games-coming-soon" />
      </div>
    </>
  );
}
