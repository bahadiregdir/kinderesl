'use client';

import React, { useEffect, useState } from 'react';
import { siteConfig } from '@/config/site';
import { AD_PREVIEW_EVENT, syncAdPreviewFromUrl } from '@/lib/ad-preview';
import { Megaphone } from 'lucide-react';

interface AdUnitProps {
  slotType: 'in-content' | 'sidebar' | 'pre-download';
  className?: string;
}

const SLOT_METADATA: Record<
  AdUnitProps['slotType'],
  { label: string; sizeText: string; minHeight: string }
> = {
  'in-content': {
    label: 'In-Content Banner Slot',
    sizeText: '728×90 Desktop / 336×280 Mobile',
    minHeight: 'min-h-[120px] sm:min-h-[140px]',
  },
  sidebar: {
    label: 'Desktop Sidebar Slot',
    sizeText: '300×250 Medium Rectangle / 300×600',
    minHeight: 'min-h-[250px]',
  },
  'pre-download': {
    label: 'Pre-Download Modal Slot',
    sizeText: '336×280 / Responsive Box',
    minHeight: 'min-h-[110px]',
  },
};

export function AdUnit({ slotType, className = '' }: AdUnitProps) {
  const [adPreview, setAdPreview] = useState(false);

  const isEnabled = siteConfig.adsense.enabled;
  const clientId = siteConfig.adsense.client?.trim() || '';
  const hasValidClient =
    Boolean(isEnabled) &&
    Boolean(clientId) &&
    !clientId.startsWith('ca-pub-XXX') &&
    /^ca-pub-\d+$/.test(clientId);

  let slotId = siteConfig.adsense.slots.inContent;
  if (slotType === 'sidebar') {
    slotId = siteConfig.adsense.slots.sidebar;
  } else if (slotType === 'pre-download') {
    slotId = siteConfig.adsense.slots.preDownload;
  }

  const shouldRenderLiveAd = hasValidClient && Boolean(slotId && slotId.trim() !== '');

  useEffect(() => {
    const updatePreview = () => {
      setAdPreview(syncAdPreviewFromUrl());
    };
    updatePreview();

    window.addEventListener(AD_PREVIEW_EVENT, updatePreview);
    return () => window.removeEventListener(AD_PREVIEW_EVENT, updatePreview);
  }, []);

  useEffect(() => {
    if (!shouldRenderLiveAd || typeof window === 'undefined') return;
    try {
      // @ts-expect-error AdSense adsbygoogle global array
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error('AdSense push error:', e);
    }
  }, [shouldRenderLiveAd, slotType, slotId]);

  if (shouldRenderLiveAd) {
    const liveMinHeight =
      slotType === 'sidebar'
        ? 'min-h-[280px]'
        : slotType === 'pre-download'
        ? 'min-h-[120px]'
        : 'min-h-[250px]';

    return (
      <aside
        aria-label="Advertisement"
        className={`w-full my-6 text-center ${liveMinHeight} ${className}`}
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

  if (adPreview) {
    const meta = SLOT_METADATA[slotType];
    return (
      <aside
        aria-label={`Ad slot preview: ${meta.label}`}
        data-ad-preview={slotType}
        className={`w-full my-5 rounded-xl border-2 border-dashed border-[#2E6B6B]/45 bg-[#F0F7F7]/80 px-4 py-5 flex flex-col items-center justify-center text-center gap-1.5 ${meta.minHeight} ${className}`}
      >
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#2E6B6B] text-white text-[10px] font-bold uppercase tracking-wider">
          <Megaphone className="w-3 h-3" />
          <span>{meta.label}</span>
        </div>
        <p className="text-xs font-semibold text-slate-800">{meta.sizeText}</p>
        <p className="text-[11px] text-slate-500">
          Stealth Mode · Visible only with <code className="font-mono">?adpreview=1</code>
        </p>
      </aside>
    );
  }

  return null;
}
