'use client';

import React, { useEffect } from 'react';
import { siteConfig } from '@/config/site';

interface AdUnitProps {
  slotType: 'in-content' | 'sidebar' | 'pre-download';
  className?: string;
}

export function AdUnit({ slotType, className = '' }: AdUnitProps) {
  const isEnabled = siteConfig.adsense.enabled;
  const clientId = siteConfig.adsense.client;

  // If not enabled or no valid client ID (placeholder or empty), render NOTHING
  if (!isEnabled || !clientId || clientId.startsWith('ca-pub-XXX') || clientId.trim() === '') {
    return null;
  }

  let slotId = siteConfig.adsense.slots.inContent;
  let minHeight = 'min-h-[250px]';

  if (slotType === 'sidebar') {
    slotId = siteConfig.adsense.slots.sidebar;
    minHeight = 'min-h-[280px]';
  } else if (slotType === 'pre-download') {
    slotId = siteConfig.adsense.slots.preDownload;
    minHeight = 'min-h-[120px]';
  }

  if (!slotId || slotId.trim() === '') {
    return null;
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        // @ts-expect-error AdSense adsbygoogle push
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error('AdSense error:', e);
      }
    }
  }, []);

  return (
    <aside
      aria-label="Advertisement"
      className={`w-full my-6 text-center ${minHeight} ${className}`}
    >
      <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">
        Advertisement
      </div>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={clientId}
        data-ad-slot={slotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </aside>
  );
}
