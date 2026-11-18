import React from 'react';
import Link from 'next/link';
import { siteConfig } from '@/config/site';
import { BookOpen, ShieldCheck, Heart, Sparkles } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand & Mission column */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-[#2E6B6B] flex items-center justify-center text-white">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Kinder<span className="text-teal-400">ESL</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Free, classroom-ready printable worksheets, phonics packs, and ESL vocabulary sets created by early childhood educators for preschool and kindergarten teachers and homeschooling parents.
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0" />
              <span>Teacher & Parent Resource · Classroom Non-Commercial Use</span>
            </div>

            <div className="pt-2 flex items-center gap-3 text-xs">
              <a
                href={siteConfig.pinterest.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-red-700/80 hover:bg-red-700 text-white font-medium transition-colors"
              >
                <span>Follow on Pinterest</span>
              </a>
              <Link
                href="/llms.txt"
                className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              >
                /llms.txt (AI Search)
              </Link>
            </div>
          </div>

          {/* Featured Worksheets */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Featured Worksheets
            </h3>
            <ul className="space-y-2.5 text-sm">
              {siteConfig.footerNav.worksheets.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-slate-400 hover:text-teal-300 transition-colors"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Resource Hubs
            </h3>
            <ul className="space-y-2.5 text-sm">
              {siteConfig.footerNav.categories.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-slate-400 hover:text-teal-300 transition-colors"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/games"
                  className="inline-flex items-center gap-1 text-teal-300 hover:text-teal-200 transition-colors"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Classroom Games</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & About */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Pedagogy & Policies
            </h3>
            <ul className="space-y-2.5 text-sm">
              {siteConfig.footerNav.company.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-slate-400 hover:text-teal-300 transition-colors"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/tr"
                  className="text-slate-400 hover:text-teal-300 transition-colors"
                >
                  Türkçe Versiyon (Bilgi)
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Audience & AdSense / COPPA Legal Notice */}
        <div className="py-6 border-b border-slate-800 text-xs text-slate-400 leading-relaxed space-y-2">
          <p>
            <strong className="text-slate-300">Audience Notice:</strong> KinderESL.com is an educational publishing resource designed exclusively for adult educators, school teachers, curriculum coordinators, and parents. This website does not target or knowingly collect data from children under the age of 13 in compliance with the Children’s Online Privacy Protection Act (COPPA), GDPR, and Google AdSense publisher policies.
          </p>
          <p>
            All PDF learning printables are copyrighted by KinderESL.com and provided free of charge for personal homeschooling and classroom instructional use. Commercial resale, redistribution, or unauthorized file hosting is strictly prohibited.
          </p>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2025 KinderESL.com. All rights reserved.</p>
          <p className="flex items-center gap-1">
            <span>Designed with</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
            <span>for early childhood educators worldwide</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
