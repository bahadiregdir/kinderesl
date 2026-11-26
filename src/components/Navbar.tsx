'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  BookOpen,
  Sparkles,
  Search,
  ChevronDown,
  Layers,
  Sparkle,
  FolderHeart,
} from 'lucide-react';
import { useLessonPack } from '@/context/LessonPackContext';

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const pathname = usePathname();
  const megaMenuRef = useRef<HTMLDivElement>(null);
  const { items: packItems, openDrawer } = useLessonPack();

  // Close menus on outside click or route change
  useEffect(() => {
    setMegaMenuOpen(false);
    setMobileOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (megaMenuRef.current && !megaMenuRef.current.contains(e.target as Node)) {
        setMegaMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { title: 'Worksheets', href: '/worksheets', isMega: true },
    { title: 'Teacher Tools', href: '/tools' },
    { title: 'Topics', href: '/topics' },
    { title: 'Guides', href: '/guides' },
    { title: 'Monthly Themes', href: '/preschool-themes' },
    { title: 'Games', href: '/games' },
    { title: 'About', href: '/about' },
  ];

  const subjectsList = [
    { title: 'Alphabet', href: '/worksheets/alphabet' },
    { title: 'Phonics', href: '/worksheets/phonics' },
    { title: 'Numbers & Counting', href: '/worksheets/numbers-counting' },
    { title: 'Shapes & Colors', href: '/worksheets/shapes-colors' },
    { title: 'Vocabulary', href: '/worksheets/vocabulary' },
    { title: 'Thinking Skills', href: '/worksheets/thinking-skills' },
  ];

  const agesList = [
    { title: 'Ages 3–4 (Preschool)', href: '/ages/3-4' },
    { title: 'Ages 4–5 (Pre-K)', href: '/ages/4-5' },
    { title: 'Ages 5–6 (Kindergarten)', href: '/ages/5-6' },
  ];

  const activitiesList = [
    { title: 'Letter & Line Tracing', href: '/activities/tracing' },
    { title: 'Coloring Pages', href: '/activities/coloring' },
    { title: 'Cut & Paste Worksheets', href: '/activities/cut-and-paste' },
    { title: 'Matching Activities', href: '/activities/matching' },
    { title: 'Counting Worksheets', href: '/activities/counting' },
    { title: 'Odd One Out Logic', href: '/activities/odd-one-out' },
    { title: 'ESL Flashcards', href: '/activities/flashcards' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Top educator announcement bar */}
      <div className="bg-[#2E6B6B] text-white text-xs py-1.5 px-4 text-center font-medium tracking-wide">
        <span className="inline-flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#F2B544]" />
          <span>Free Printable Educational Resources for Preschool, Kindergarten &amp; ESL Educators</span>
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-9 h-9 rounded-xl bg-[#2E6B6B] flex items-center justify-center text-white shadow-xs transition-transform group-hover:scale-105">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-slate-900 group-hover:text-[#2E6B6B] transition-colors font-heading leading-tight">
                Kinder<span className="text-[#2E6B6B]">ESL</span>
              </span>
              <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 leading-none">
                Teacher &amp; Parent Resource
              </span>
            </div>
          </Link>

          {/* Desktop 5-Item Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              if (item.isMega) {
                const isActive = pathname === item.href;
                return (
                  <div key={item.href} className="relative" ref={megaMenuRef}>
                    <button
                      type="button"
                      onClick={() => setMegaMenuOpen(!megaMenuOpen)}
                      className={`inline-flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive || megaMenuOpen
                          ? 'bg-[#F0F7F7] text-[#2E6B6B] font-semibold'
                          : 'text-slate-700 hover:text-[#2E6B6B] hover:bg-slate-50'
                      }`}
                      aria-expanded={megaMenuOpen}
                    >
                      <span>{item.title}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          megaMenuOpen ? 'rotate-180 text-[#2E6B6B]' : 'text-slate-400'
                        }`}
                      />
                    </button>

                    {/* Mega Menu Dropdown */}
                    {megaMenuOpen && (
                      <div className="absolute left-0 mt-2 w-[680px] bg-white rounded-2xl shadow-xl border border-slate-200/90 p-6 grid grid-cols-3 gap-6 animate-in fade-in slide-in-from-top-2 duration-150 z-50">
                        {/* By Subject */}
                        <div className="space-y-3">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-1.5 flex items-center gap-1.5">
                            <BookOpen className="w-3.5 h-3.5 text-[#2E6B6B]" />
                            <span>By Subject</span>
                          </h4>
                          <ul className="space-y-1.5 text-xs">
                            {subjectsList.map((s) => (
                              <li key={s.href}>
                                <Link
                                  href={s.href}
                                  className="block py-1 px-2 rounded-md text-slate-600 hover:text-[#2E6B6B] hover:bg-[#F0F7F7] font-medium transition-colors"
                                >
                                  {s.title}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* By Age */}
                        <div className="space-y-3">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-1.5 flex items-center gap-1.5">
                            <Layers className="w-3.5 h-3.5 text-[#F2B544]" />
                            <span>By Age Band</span>
                          </h4>
                          <ul className="space-y-1.5 text-xs">
                            {agesList.map((a) => (
                              <li key={a.href}>
                                <Link
                                  href={a.href}
                                  className="block py-1 px-2 rounded-md text-slate-600 hover:text-[#2E6B6B] hover:bg-[#F0F7F7] font-medium transition-colors"
                                >
                                  {a.title}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* By Activity */}
                        <div className="space-y-3">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-1.5 flex items-center gap-1.5">
                            <Sparkle className="w-3.5 h-3.5 text-[#2E6B6B]" />
                            <span>By Activity Type</span>
                          </h4>
                          <ul className="space-y-1.5 text-xs">
                            {activitiesList.map((act) => (
                              <li key={act.href}>
                                <Link
                                  href={act.href}
                                  className="block py-1 px-2 rounded-md text-slate-600 hover:text-[#2E6B6B] hover:bg-[#F0F7F7] font-medium transition-colors"
                                >
                                  {act.title}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Mega Menu Footer */}
                        <div className="col-span-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-xs text-slate-500">
                            All early childhood learning resources in standard printable PDF.
                          </span>
                          <Link
                            href="/worksheets"
                            className="text-xs font-bold text-[#2E6B6B] hover:underline"
                          >
                            View all printable worksheets →
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#F0F7F7] text-[#2E6B6B] font-semibold'
                      : 'text-slate-700 hover:text-[#2E6B6B] hover:bg-slate-50'
                  }`}
                >
                  {item.title}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons: Lesson Pack, Search & Mobile Menu Button */}
          <div className="flex items-center gap-2">
            {/* My Lesson Pack Button */}
            <button
              type="button"
              onClick={openDrawer}
              className="relative inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold text-[#2E6B6B] bg-[#F0F7F7] hover:bg-[#e1efef] border border-[#d0e3e3] transition-colors"
              aria-label="Open My Lesson Pack"
              title="My Lesson Pack"
            >
              <FolderHeart className="w-4 h-4" />
              <span className="hidden sm:inline">Pack</span>
              {packItems.length > 0 && (
                <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-[#2E6B6B] text-white text-[10px] font-bold">
                  {packItems.length}
                </span>
              )}
            </button>

            {/* Quick search button */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 rounded-lg text-slate-600 hover:text-[#2E6B6B] hover:bg-slate-100 transition-colors"
                aria-label="Search worksheets"
                title="Search worksheets"
              >
                <Search className="w-4 h-4" />
              </button>

              {searchOpen && (
                <form
                  action="/worksheets"
                  method="GET"
                  className="absolute right-0 top-12 w-72 sm:w-80 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50 flex items-center gap-2"
                >
                  <Search className="w-4 h-4 text-slate-400 ml-2 shrink-0" />
                  <input
                    type="text"
                    name="q"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search printables (e.g., Letter A, counting)..."
                    autoFocus
                    className="w-full text-xs py-1.5 px-1 bg-transparent focus:outline-hidden text-slate-800"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1 bg-[#2E6B6B] text-white rounded-md text-xs font-bold hover:bg-[#225151]"
                  >
                    Search
                  </button>
                </form>
              )}
            </div>

            {/* Mobile menu toggle button */}
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors ml-1"
              aria-label="Toggle navigation menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 max-h-[80vh] overflow-y-auto">
          {/* Mobile search bar */}
          <form action="/worksheets" method="GET" className="relative mb-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            <input
              type="text"
              name="q"
              placeholder="Search printables..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-[#2E6B6B]"
            />
          </form>

          <div className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`block px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  pathname === item.href
                    ? 'bg-[#F0F7F7] text-[#2E6B6B]'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {item.title}
              </Link>
            ))}
          </div>

          {/* Quick Subject Links in Mobile */}
          <div className="pt-3 border-t border-slate-100">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3">
              Browse by Subject
            </span>
            <div className="grid grid-cols-2 gap-1.5 mt-2">
              {subjectsList.map((s) => (
                <Link
                  key={s.href}
                  href={s.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-3 py-1.5 rounded-md text-xs text-slate-600 hover:bg-[#F0F7F7] hover:text-[#2E6B6B]"
                >
                  {s.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
