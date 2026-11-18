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

  let slotId = siteConfig.adsense.slots.inContent;
  let label = 'In-Content Advertisement';
  let minHeight = 'min-h-[250px]';

  if (slotType === 'sidebar') {
    slotId = siteConfig.adsense.slots.sidebar;
    label = 'Sidebar Sponsor';
    minHeight = 'min-h-[280px]';
  } else if (slotType === 'pre-download') {
    slotId = siteConfig.adsense.slots.preDownload;
    label = 'Educational Resource Sponsor (Separated from download)';
    minHeight = 'min-h-[120px]';
  }

  useEffect(() => {
    if (isEnabled && typeof window !== 'undefined') {
      try {
        // @ts-expect-error AdSense adsbygoogle push
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error('AdSense error:', e);
      }
    }
  }, [isEnabled]);

  // If AdSense is not enabled yet, show a clean, unobtrusive structural slot
  if (!isEnabled) {
    return (
      <aside
        aria-label="Advertisement placeholder"
        className={`w-full my-6 bg-slate-50 border border-dashed border-slate-200 rounded-lg p-4 text-center ${minHeight} flex flex-col items-center justify-center text-slate-400 text-xs ${className}`}
      >
        <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 mb-1">
          {label}
        </span>
        <span className="text-[11px] text-slate-400">
          AdSense Ready ({slotType} slot · {clientId})
        </span>
      </aside>
    );
  }

  return (
    <aside
      aria-label="Advertisement"
      className={`w-full my-6 text-center ${minHeight} ${className}`}
    >
      <div className="text-[10px] uppercase tracking-wider text-slate-400 mb-1">
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
