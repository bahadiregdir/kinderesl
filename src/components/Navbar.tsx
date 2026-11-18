'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { siteConfig } from '@/config/site';
import { Menu, X, BookOpen, Sparkles, Globe } from 'lucide-react';

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const isTR = pathname.startsWith('/tr');

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      {/* Top educator announcement bar */}
      <div className="bg-[#2E6B6B] text-white text-xs py-1.5 px-4 text-center font-medium tracking-wide">
        <span className="inline-flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-teal-200" />
          <span>Free Printable Educational Resources for Preschool, Kindergarten &amp; ESL Educators</span>
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg bg-[#2E6B6B] flex items-center justify-center text-white shadow-xs transition-transform group-hover:scale-105">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-[#2E6B6B] transition-colors">
                Kinder<span className="text-[#2E6B6B]">ESL</span>
              </span>
              <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">
                Teacher &amp; Parent Resource
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {siteConfig.mainNav.map((item) => {
              const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    active
                      ? 'bg-[#F0F7F7] text-[#2E6B6B] font-semibold'
                      : 'text-slate-700 hover:text-[#2E6B6B] hover:bg-slate-50'
                  }`}
                >
                  {item.title}
                </Link>
              );
            })}
          </nav>

          {/* Right Action: Language Switch & About */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href={isTR ? '/' : '/tr'}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border border-slate-200 text-slate-700 hover:border-[#2E6B6B] hover:text-[#2E6B6B] transition-colors"
              title={isTR ? 'Switch to English' : 'Türkçe sürüm bilgisi'}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{isTR ? 'EN' : 'TR'}</span>
            </Link>

            <Link
              href="/about"
              className="text-xs font-semibold px-3.5 py-2 rounded-lg bg-[#F0F7F7] text-[#2E6B6B] hover:bg-[#E2EFEF] transition-colors"
            >
              About KinderESL
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center gap-2">
            <Link
              href={isTR ? '/' : '/tr'}
              className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium border border-slate-200 text-slate-700"
            >
              <Globe className="w-3 h-3" />
              <span>{isTR ? 'EN' : 'TR'}</span>
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-md text-slate-700 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Toggle navigation menu"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileOpen && (
        <div className="lg:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1 shadow-lg">
          {siteConfig.mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-[#2E6B6B] hover:bg-[#F0F7F7]"
            >
              {item.title}
            </Link>
          ))}
          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <Link
              href="/about"
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 text-sm font-semibold text-[#2E6B6B] bg-[#F0F7F7] rounded-md text-center"
            >
              About KinderESL
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
