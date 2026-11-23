'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { LessonPackProvider } from '@/context/LessonPackContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { LessonPackDrawer } from '@/components/LessonPackDrawer';
import { AdPreviewBanner } from '@/components/AdPreviewBanner';
import { SiteAnalyticsTracker } from '@/components/SiteAnalyticsTracker';

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '/';
  const isAdmin = pathname.startsWith('/admin');

  return (
    <LessonPackProvider>
      {isAdmin ? (
        <>{children}</>
      ) : (
        <>
          <SiteAnalyticsTracker />
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <LessonPackDrawer />
          <AdPreviewBanner />
        </>
      )}
    </LessonPackProvider>
  );
}
