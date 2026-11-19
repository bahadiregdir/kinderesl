'use client';

import React, { useEffect, useState } from 'react';
import {
  AD_PREVIEW_EVENT,
  disableAdPreview,
  syncAdPreviewFromUrl,
} from '@/lib/ad-preview';
import { Eye, X } from 'lucide-react';

export function AdPreviewBanner() {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const sync = () => setActive(syncAdPreviewFromUrl());
    sync();
    window.addEventListener(AD_PREVIEW_EVENT, sync);
    return () => window.removeEventListener(AD_PREVIEW_EVENT, sync);
  }, []);

  if (!active) return null;

  return (
    <div
      role="status"
      className="fixed bottom-4 left-4 z-50 flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-slate-900 text-white text-xs font-semibold shadow-xl border border-slate-700"
    >
      <Eye className="w-3.5 h-3.5 text-teal-400 shrink-0" />
      <span>Ad Preview Active</span>
      <button
        type="button"
        onClick={disableAdPreview}
        className="inline-flex items-center gap-1 ml-1 px-2 py-0.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold transition-colors"
      >
        <X className="w-3 h-3" />
        <span>Exit</span>
      </button>
    </div>
  );
}
