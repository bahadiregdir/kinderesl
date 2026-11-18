'use client';

import React, { useState, useMemo, useTransition } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Worksheet, SubjectMeta } from '@/types/worksheet';
import { WorksheetCard } from '@/components/WorksheetCard';
import { Search, X, SlidersHorizontal, BookOpen, Sparkles } from 'lucide-react';

interface WorksheetsCatalogProps {
  worksheets: Worksheet[];
  subjects: SubjectMeta[];
  locale?: 'en' | 'tr';
}

export function WorksheetsCatalog({
  worksheets,
  subjects,
  locale = 'en',
}: WorksheetsCatalogProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [, startTransition] = useTransition();

  const isTr = locale === 'tr';

  const initialQ = searchParams?.get('q') || '';
  const initialSubject = searchParams?.get('subject') || '';
  const initialActivity = searchParams?.get('activity') || '';
  const initialAge = searchParams?.get('age') || '';

  const [searchQuery, setSearchQuery] = useState(initialQ);
  const [selectedSubject, setSelectedSubject] = useState(initialSubject);
  const [selectedActivity, setSelectedActivity] = useState(initialActivity);
  const [selectedAge, setSelectedAge] = useState(initialAge);

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

  const subjectLabelsTr: Record<string, string> = {
    alphabet: 'Alfabe (A–Z)',
    phonics: 'Fonetik & Sesler',
    'numbers-counting': 'Sayılar & Sayma',
    'shapes-colors': 'Şekiller & Renkler',
    vocabulary: 'İngilizce Kelimeler',
    'thinking-skills': 'Düşünme Becerileri',
  };

  const filteredWorksheets = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return worksheets.filter((w) => {
      if (q) {
        const isTrAndHasTr = isTr && Boolean(w.i18n?.tr);
        const title = isTrAndHasTr ? w.i18n!.tr!.title : w.title;
        const desc = isTrAndHasTr ? w.i18n!.tr!.description : w.description;
        const titleMatch = title.toLowerCase().includes(q);
        const descMatch = desc.toLowerCase().includes(q);
        const skillMatch = w.skill.toLowerCase().includes(q);
        const vocabMatch = w.vocabulary?.some((v) => v.toLowerCase().includes(q));
        const trVocabMatch = w.i18n?.tr?.vocabularyWithTranslations?.some(
          (vt: { en: string; tr: string }) =>
            vt.en.toLowerCase().includes(q) || vt.tr.toLowerCase().includes(q)
        );
        const kwMatch = (isTrAndHasTr ? w.i18n!.tr!.keywords : w.keywords)?.some((k) =>
          k.toLowerCase().includes(q)
        );

        if (!titleMatch && !descMatch && !skillMatch && !vocabMatch && !trVocabMatch && !kwMatch) {
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
  }, [worksheets, searchQuery, selectedSubject, selectedActivity, selectedAge, isTr]);

  const hasActiveFilters = Boolean(
    searchQuery || selectedSubject || selectedActivity || selectedAge
  );

  const activityOptions = [
    { value: 'tracing', labelEn: 'Tracing', labelTr: 'Çizgi Çalışması' },
    { value: 'coloring', labelEn: 'Coloring', labelTr: 'Boyama' },
    { value: 'cut-and-paste', labelEn: 'Cut & Paste', labelTr: 'Kes-Yapıştır' },
    { value: 'counting', labelEn: 'Counting', labelTr: 'Sayma' },
    { value: 'matching', labelEn: 'Matching', labelTr: 'Eşleştirme' },
    { value: 'odd-one-out', labelEn: 'Odd One Out', labelTr: 'Farklı Olanı Bul' },
  ];

  const ageOptions = [
    { value: '3-4', labelEn: 'Ages 3–4', labelTr: '3–4 Yaş' },
    { value: '4-5', labelEn: 'Ages 4–5', labelTr: '4–5 Yaş' },
    { value: '5-6', labelEn: 'Ages 5–6', labelTr: '5–6 Yaş' },
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
            placeholder={
              isTr
                ? 'Etkinlik ara (örn. A harfi, 1-5 sayma, çiftlik hayvanları)...'
                : 'Search worksheets by letter, number, theme, or skill (e.g. Letter A, counting)...'
            }
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
              <span>{isTr ? 'Konu:' : 'Subject:'}</span>
            </span>
            <button
              onClick={() => handleSubjectChange('')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                !selectedSubject
                  ? 'bg-[#2E6B6B] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {isTr ? 'Tümü' : 'All Subjects'}
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
                  {isTr ? (subjectLabelsTr[sub.slug] || sub.title) : sub.title}
                </button>
              );
            })}
          </div>

          {/* Activity Types & Age Bands */}
          <div className="flex flex-wrap items-center gap-4 text-xs pt-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="font-semibold text-slate-500 mr-1">
                {isTr ? 'Format:' : 'Activity:'}
              </span>
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
                    {isTr ? act.labelTr : act.labelEn}
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <span className="font-semibold text-slate-500 mr-1">
                {isTr ? 'Yaş:' : 'Age:'}
              </span>
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
                    {isTr ? age.labelTr : age.labelEn}
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
                <span>{isTr ? 'Filtreleri Temizle' : 'Reset Filters'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results Count Bar */}
      <div className="flex items-center justify-between text-sm text-slate-600 px-1">
        <div>
          {isTr ? (
            <span>
              Toplam <strong>{filteredWorksheets.length}</strong> çalışma kağıdı listeleniyor
            </span>
          ) : (
            <span>
              Showing <strong>{filteredWorksheets.length}</strong> printable worksheets
            </span>
          )}
        </div>
      </div>

      {/* Grid of Worksheets */}
      {filteredWorksheets.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredWorksheets.map((ws) => (
            <WorksheetCard key={ws.slug} worksheet={ws} locale={locale} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-4 bg-white border border-dashed border-slate-300 rounded-2xl max-w-2xl mx-auto space-y-4">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900">
            {isTr ? 'Aramanızla eşleşen materyal bulunamadı' : 'No worksheets found matching your filters'}
          </h3>
          <p className="text-sm text-slate-600">
            {isTr
              ? 'Farklı bir arama terimi deneyebilir veya filtreleri sıfırlayabilirsiniz.'
              : 'Try adjusting your search terms or clearing one or more active filters.'}
          </p>
          <button
            onClick={handleClearAll}
            className="inline-flex items-center justify-center px-4 py-2 bg-[#2E6B6B] hover:bg-[#255757] text-white text-sm font-semibold rounded-lg transition-colors shadow-xs"
          >
            {isTr ? 'Filtreleri Sıfırla' : 'Reset All Filters'}
          </button>
        </div>
      )}
    </div>
  );
}
