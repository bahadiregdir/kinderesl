'use client';

import React from 'react';
import Image from 'next/image';
import { Pin } from 'lucide-react';

interface PinterestShareProps {
  pinImageUrl: string;
  pageUrl: string;
  description: string;
  title: string;
}

export function PinterestShare({
  pinImageUrl,
  pageUrl,
  description,
  title,
}: PinterestShareProps) {
  const pinUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(
    pageUrl
  )}&media=${encodeURIComponent(`https://kinderesl.com${pinImageUrl}`)}&description=${encodeURIComponent(
    `${title} - Free printable educational worksheet for preschool and kindergarten teachers from KinderESL.com`
  )}`;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-red-600 flex items-center justify-center text-white">
            <Pin className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Save to Pinterest
          </span>
        </div>
        <a
          href={pinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-sm transition-colors"
          aria-label="Pin it on Pinterest"
        >
          <Pin className="w-3.5 h-3.5" />
          <span>Pin It</span>
        </a>
      </div>

      <p className="text-xs text-slate-500 mb-3 leading-relaxed">
        Save this 1000×1500 optimized pin to your preschool, kindergarten, or ESL teaching boards for later lesson planning:
      </p>

      {/* 1000x1500 Pin Image preview */}
      <div className="relative aspect-[2/3] max-w-[260px] mx-auto rounded-lg overflow-hidden border border-slate-200 shadow-sm bg-slate-50 group">
        <Image
          src={pinImageUrl}
          alt={`Pinterest Pin for ${title}`}
          fill
          sizes="260px"
          className="object-cover group-hover:scale-[1.02] transition-transform duration-200"
        />
        <a
          href={pinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold text-xs gap-1.5"
        >
          <Pin className="w-4 h-4 text-red-400" />
          <span>Click to Pin</span>
        </a>
      </div>
    </div>
  );
}
