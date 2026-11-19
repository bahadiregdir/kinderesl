'use client';

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { Worksheet } from '@/types/worksheet';
import { trackEvent } from '@/lib/analytics';

const STORAGE_KEY = 'kinderesl_lesson_pack_v1';

export interface PackWorksheetItem {
  id: string;
  slug: string;
  title: string;
  subjectName: string;
  ages: string;
  pages: number;
  pdfPath: string;
  pdfFileSize: string;
  previewImage: string;
}

interface LessonPackContextValue {
  items: PackWorksheetItem[];
  isOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleItem: (ws: Worksheet | PackWorksheetItem) => void;
  removeItem: (slug: string) => void;
  clearPack: () => void;
  hasItem: (slug: string) => boolean;
}

const LessonPackContext = createContext<LessonPackContextValue | null>(null);

function toPackItem(ws: Worksheet | PackWorksheetItem): PackWorksheetItem {
  if ('previewImage' in ws) {
    return ws;
  }
  return {
    id: ws.id,
    slug: ws.slug,
    title: ws.title,
    subjectName: ws.subjectName,
    ages: ws.ages,
    pages: ws.pages,
    pdfPath: ws.pdfPath,
    pdfFileSize: ws.pdfFileSize,
    previewImage: ws.previewImages[0] || '/images/og-default.jpg',
  };
}

export function LessonPackProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<PackWorksheetItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      }
    } catch {
      // Ignore corrupt storage
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ignore storage quota errors
    }
  }, [items, hydrated]);

  const openDrawer = useCallback(() => setIsOpen(true), []);
  const closeDrawer = useCallback(() => setIsOpen(false), []);

  const toggleItem = useCallback((ws: Worksheet | PackWorksheetItem) => {
    const item = toPackItem(ws);
    setItems((prev) => {
      const exists = prev.some((p) => p.slug === item.slug);
      if (exists) {
        trackEvent('lesson_pack_remove', { slug: item.slug });
        return prev.filter((p) => p.slug !== item.slug);
      }
      trackEvent('lesson_pack_add', { slug: item.slug });
      return [...prev, item];
    });
  }, []);

  const removeItem = useCallback((slug: string) => {
    trackEvent('lesson_pack_remove', { slug });
    setItems((prev) => prev.filter((p) => p.slug !== slug));
  }, []);

  const clearPack = useCallback(() => {
    setItems([]);
  }, []);

  const hasItem = useCallback(
    (slug: string) => items.some((item) => item.slug === slug),
    [items]
  );

  return (
    <LessonPackContext.Provider
      value={{
        items,
        isOpen,
        openDrawer,
        closeDrawer,
        toggleItem,
        removeItem,
        clearPack,
        hasItem,
      }}
    >
      {children}
    </LessonPackContext.Provider>
  );
}

export function useLessonPack(): LessonPackContextValue {
  const ctx = useContext(LessonPackContext);
  if (!ctx) {
    throw new Error('useLessonPack must be used inside LessonPackProvider');
  }
  return ctx;
}
