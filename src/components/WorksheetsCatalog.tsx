'use client';

import React, { useState, useMemo, useTransition, useEffect, useRef } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Worksheet, SubjectMeta } from '@/types/worksheet';
import { WorksheetCard } from '@/components/WorksheetCard';
import { trackEvent } from '@/lib/analytics';
import { Search, X, SlidersHorizontal, BookOpen } from 'lucide-react';

interface WorksheetsCatalogProps {
  worksheets: Worksheet[];
  subjects: SubjectMeta[];
}

export function WorksheetsCatalog({
  worksheets,
  subjects,
}: WorksheetsCatalogProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [, startTransition] = useTransition();

  const initialQ = searchParams?.get('q') || '';
  const initialSubject = searchParams?.get('subject') || '';
  const initialActivity = searchParams?.get('activity') || '';
  const initialAge = searchParams?.get('age') || '';

  const [searchQuery, setSearchQuery] = useState(initialQ);
  const [selectedSubject, setSelectedSubject] = useState(initialSubject);
  const [selectedActivity, setSelectedActivity] = useState(initialActivity);
  const [selectedAge, setSelectedAge] = useState(initialAge);
  const filteredCountRef = useRef(worksheets.length);

  useEffect(() => {
    const trimmed = searchQuery.trim();
    if (trimmed.length < 2) return;
    const timer = setTimeout(() => {
      trackEvent('catalog_search', { query: trimmed });
      fetch('/api/analytics/event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'search',
          query: trimmed,
          resultCount: filteredCountRef.current,
        }),
        keepalive: true,
      }).catch(() => {});
    }, 800);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const updateUrlParams = (q: string, subject: string, activity: string, age: string) => {
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (subject) params.set('subject', subject);
    if (activity) params.set('activity', activity);
    if (age) params.set('age', age);

    const queryString = params.toString();
    startTransition(() => {
      router.replace(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false });
    });
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    updateUrlParams(val, selectedSubject, selectedActivity, selectedAge);
  };

  const handleSubjectChange = (slug: string) => {
    const next = selectedSubject === slug ? '' : slug;
    setSelectedSubject(next);
    updateUrlParams(searchQuery, next, selectedActivity, selectedAge);
  };

  const handleActivityChange = (act: string) => {
    const next = selectedActivity === act ? '' : act;
    setSelectedActivity(next);
    updateUrlParams(searchQuery, selectedSubject, next, selectedAge);
  };

  const handleAgeChange = (age: string) => {
    const next = selectedAge === age ? '' : age;
    setSelectedAge(next);
    updateUrlParams(searchQuery, selectedSubject, selectedActivity, next);
  };

  const handleClearAll = () => {
    setSearchQuery('');
    setSelectedSubject('');
    setSelectedActivity('');
    setSelectedAge('');
    startTransition(() => {
      router.replace(pathname, { scroll: false });
    });
  };

  const filteredWorksheets = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return worksheets.filter((w) => {
      if (q) {
        const titleMatch = w.title.toLowerCase().includes(q);
        const descMatch = w.description.toLowerCase().includes(q);
        const skillMatch = w.skill.toLowerCase().includes(q);
        const vocabMatch = w.vocabulary?.some((v) => v.toLowerCase().includes(q));
        const kwMatch = w.keywords?.some((k) => k.toLowerCase().includes(q));

        if (!titleMatch && !descMatch && !skillMatch && !vocabMatch && !kwMatch) {
          return false;
        }
      }

      if (selectedSubject && w.subject !== selectedSubject) {
        return false;
      }

      if (selectedActivity && !w.activityTypes.includes(selectedActivity as any)) {
        return false;
      }

      if (selectedAge && !w.ageBands.includes(selectedAge as any)) {
        return false;
      }

      return true;
    });
  }, [worksheets, searchQuery, selectedSubject, selectedActivity, selectedAge]);

  filteredCountRef.current = filteredWorksheets.length;

  const hasActiveFilters = Boolean(
    searchQuery || selectedSubject || selectedActivity || selectedAge
  );

  const activityOptions = [
    { value: 'tracing', label: 'Tracing' },
    { value: 'coloring', label: 'Coloring' },
    { value: 'cut-and-paste', label: 'Cut & Paste' },
    { value: 'counting', label: 'Counting' },
    { value: 'matching', label: 'Matching' },
    { value: 'odd-one-out', label: 'Odd One Out' },
  ];

  const ageOptions = [
    { value: '3-4', label: 'Ages 3–4' },
    { value: '4-5', label: 'Ages 4–5' },
    { value: '5-6', label: 'Ages 5–6' },
  ];

  return (
    <div className="space-y-8">
      {/* Search & Filter Toolbar */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-5">
        {/* Search Input Bar */}
        <div className="relative flex items-center">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search worksheets by letter, number, theme, or skill (e.g. Letter A, counting)..."
            className="w-full pl-11 pr-10 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#2E6B6B] focus:border-[#2E6B6B] text-slate-800 placeholder-slate-400 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => handleSearchChange('')}
              className="absolute right-3 p-1.5 text-slate-400 hover:text-slate-600 rounded-md"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="space-y-3 pt-1 border-t border-slate-100">
          {/* Subjects */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 mr-1 flex items-center gap-1">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Subject:</span>
            </span>
            <button
              onClick={() => handleSubjectChange('')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                !selectedSubject
                  ? 'bg-[#2E6B6B] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All Subjects
            </button>
            {subjects.map((sub) => {
              const active = selectedSubject === sub.slug;
              return (
                <button
                  key={sub.slug}
                  onClick={() => handleSubjectChange(sub.slug)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    active
                      ? 'bg-[#2E6B6B] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {sub.shortTitle}
                </button>
              );
            })}
          </div>

          {/* Activity Types & Age Bands */}
          <div className="flex flex-wrap items-center gap-4 text-xs pt-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="font-semibold text-slate-500 mr-1">Activity:</span>
              {activityOptions.map((act) => {
                const active = selectedActivity === act.value;
                return (
                  <button
                    key={act.value}
                    onClick={() => handleActivityChange(act.value)}
                    className={`px-2.5 py-1 rounded-md transition-colors ${
                      active
                        ? 'bg-[#2E6B6B] text-white font-semibold'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {act.label}
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <span className="font-semibold text-slate-500 mr-1">Age:</span>
              {ageOptions.map((age) => {
                const active = selectedAge === age.value;
                return (
                  <button
                    key={age.value}
                    onClick={() => handleAgeChange(age.value)}
                    className={`px-2.5 py-1 rounded-md transition-colors ${
                      active
                        ? 'bg-[#2E6B6B] text-white font-semibold'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {age.label}
                  </button>
                );
              })}
            </div>

            {hasActiveFilters && (
              <button
                onClick={handleClearAll}
                className="inline-flex items-center gap-1 text-[#2E6B6B] hover:text-[#235353] font-semibold underline underline-offset-2 ml-auto"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results Count Bar */}
      <div className="flex items-center justify-between text-sm text-slate-600 px-1">
        <div>
          Showing <strong>{filteredWorksheets.length}</strong> printable worksheets
        </div>
      </div>

      {/* Grid of Worksheets */}
      {filteredWorksheets.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredWorksheets.map((ws) => (
            <WorksheetCard key={ws.slug} worksheet={ws} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-4 bg-white border border-dashed border-slate-300 rounded-2xl max-w-2xl mx-auto space-y-4">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900">
            No worksheets found matching your filters
          </h3>
          <p className="text-sm text-slate-600">
            Try adjusting your search terms or clearing one or more active filters.
          </p>
          <button
            onClick={handleClearAll}
            className="inline-flex items-center justify-center px-4 py-2 bg-[#2E6B6B] hover:bg-[#255757] text-white text-sm font-semibold rounded-lg transition-colors shadow-xs"
          >
            Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
}
