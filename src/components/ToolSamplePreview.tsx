import React from 'react';
import { getToolConfig, getToolOgImagePath } from '@/data/tools';

interface ToolSamplePreviewProps {
  slug: string;
}

export function ToolSamplePreview({ slug }: ToolSamplePreviewProps) {
  const tool = getToolConfig(slug);
  const imageSrc = getToolOgImagePath(slug);

  return (
    <section className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading">
            {tool.sampleHeading}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            {tool.sampleCaption}
          </p>
        </div>
        <span className="text-xs font-semibold text-[#2E6B6B]">
          1200×630 Printable Overview · Pinterest Ready
        </span>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3 sm:p-5">
        {/* Native eager <img> (~1000px wide) so Pinterest's Save button detects the preview cleanly */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageSrc}
          alt={tool.ogAlt}
          width={1200}
          height={630}
          loading="eager"
          decoding="async"
          data-pin-description={tool.pinDescription}
          className="w-full max-w-[1000px] h-auto mx-auto block rounded-xl border border-slate-200 shadow-sm bg-white"
        />
      </div>
    </section>
  );
}
