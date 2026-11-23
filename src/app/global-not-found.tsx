import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import '@/app/globals.css';
import { getAllWorksheets } from '@/data/worksheets';
import { siteConfig } from '@/config/site';
import { Search, Compass, ArrowRight, Home, BookOpen } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Page not found | KinderESL',
  description:
    'The page or printable worksheet you are looking for could not be found on KinderESL.',
};

export default function GlobalNotFound() {
  const popularWorksheets = getAllWorksheets().slice(0, 4);

  return (
    <html lang="en" className="h-full scroll-smooth">
      <body className="min-h-screen flex flex-col bg-[#FAFAFA] text-slate-900 antialiased">
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xs border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2 font-extrabold text-xl tracking-tight text-[#2E6B6B]"
            >
              <BookOpen className="w-6 h-6" />
              <span>{siteConfig.name}</span>
            </Link>
            <nav className="flex items-center gap-5 text-sm font-semibold text-slate-700">
              <Link href="/worksheets" className="hover:text-[#2E6B6B] transition-colors">
                Worksheets
              </Link>
              <Link href="/topics" className="hover:text-[#2E6B6B] transition-colors">
                Topics
              </Link>
              <Link href="/about" className="hover:text-[#2E6B6B] transition-colors">
                About
              </Link>
            </nav>
          </div>
        </header>

        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
            <div className="max-w-2xl mx-auto text-center space-y-4 mb-12">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#F0F7F7] text-[#2E6B6B] border border-[#d0e3e3]">
                404 Error
              </span>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
                Page Not Found
              </h1>
              <p className="text-base text-slate-600">
                We couldn’t find the page or printable you were looking for. Try searching for a skill, theme, or letter, or browse our popular printables below.
              </p>

              <form action="/worksheets" method="GET" className="pt-2 max-w-lg mx-auto">
                <div className="relative flex items-center">
                  <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
                  <input
                    type="text"
                    name="q"
                    placeholder="Search worksheets (e.g., Letter A, counting, animals)..."
                    className="w-full pl-11 pr-24 py-3 text-sm bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#2E6B6B] focus:border-[#2E6B6B] shadow-xs"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 px-4 py-1.5 text-xs font-bold bg-[#2E6B6B] hover:bg-[#225151] text-white rounded-lg transition-colors"
                  >
                    Search
                  </button>
                </div>
              </form>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  <Home className="w-3.5 h-3.5" />
                  <span>Return to Homepage</span>
                </Link>
                <Link
                  href="/worksheets"
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-[#2E6B6B] hover:bg-[#225151] rounded-lg transition-colors"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Browse All Worksheets</span>
                </Link>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-10">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Popular Free Worksheets
                  </h2>
                  <p className="text-xs text-slate-600">
                    Hand-picked preschool and kindergarten printables ready to download.
                  </p>
                </div>
                <Link
                  href="/worksheets"
                  className="text-xs font-bold text-[#2E6B6B] hover:underline inline-flex items-center gap-1"
                >
                  <span>View All</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {popularWorksheets.map((ws) => (
                  <article
                    key={ws.slug}
                    className="group flex flex-col bg-white rounded-2xl border border-slate-200/80 hover:border-[#2E6B6B] hover:shadow-lg transition-all duration-200 overflow-hidden"
                  >
                    <Link href={`/worksheets/${ws.slug}`} className="flex flex-col flex-1">
                      <div className="relative aspect-[1224/1584] bg-slate-50/70 overflow-hidden border-b border-slate-100">
                        <Image
                          src={ws.previewImages[0]}
                          alt={ws.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 320px"
                          className="object-contain p-3"
                          loading="lazy"
                        />
                      </div>
                      <div className="p-4 space-y-1.5">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-[#2E6B6B]">
                          {ws.subjectName}
                        </p>
                        <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#2E6B6B] line-clamp-2">
                          {ws.title}
                        </h3>
                        <p className="text-xs text-slate-500">
                          {ws.ages} · {ws.pages} {ws.pages === 1 ? 'page' : 'pages'}
                        </p>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </main>

        <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
          © 2026 {siteConfig.name} ·{' '}
          <Link href="/worksheets" className="hover:underline">
            Worksheets
          </Link>{' '}
          ·{' '}
          <Link href="/privacy-policy" className="hover:underline">
            Privacy Policy
          </Link>
        </footer>
      </body>
    </html>
  );
}
