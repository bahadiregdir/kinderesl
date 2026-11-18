import React from 'react';
import Link from 'next/link';
import { siteConfig } from '@/config/site';
import { GraduationCap, Award, CheckCircle2 } from 'lucide-react';

export function AuthorBox({ isCompact = false }: { isCompact?: boolean }) {
  const { author } = siteConfig;

  if (isCompact) {
    return (
      <div className="bg-[#F0F7F7] border border-[#d0e3e3] rounded-xl p-4 my-6">
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-full bg-[#2E6B6B] text-white font-bold flex items-center justify-center shrink-0 shadow-sm text-sm">
            {author.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-slate-900 truncate">
                Curriculum Design by {author.name}
              </h4>
              <span className="inline-flex items-center gap-0.5 text-[10px] text-teal-800 font-semibold bg-teal-100/80 px-1.5 py-0.5 rounded">
                <CheckCircle2 className="w-3 h-3 text-[#2E6B6B]" />
                <span>Verified Educator</span>
              </span>
            </div>
            <p className="text-xs text-[#2E6B6B] font-medium mb-1">
              {author.role}
            </p>
            <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
              {author.shortBio}
            </p>
            <div className="mt-2">
              <Link
                href="/about"
                className="text-xs font-semibold text-[#2E6B6B] hover:text-[#225151] hover:underline"
              >
                Read full credentials &amp; pedagogical philosophy →
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 my-8 shadow-sm">
      <div className="flex flex-col sm:flex-row items-start gap-5">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#2E6B6B] text-white text-2xl font-bold flex items-center justify-center shrink-0 shadow-sm">
          {author.name.charAt(0)}
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h3 className="text-lg font-bold text-slate-900">
              {author.name}
            </h3>
            <span className="inline-flex items-center gap-1 text-xs text-teal-800 font-semibold bg-[#F0F7F7] border border-[#d0e3e3] px-2 py-0.5 rounded-full">
              <GraduationCap className="w-3.5 h-3.5 text-[#2E6B6B]" />
              <span>Lead Curriculum Designer</span>
            </span>
          </div>

          <p className="text-xs font-semibold text-[#2E6B6B] mb-3">
            {author.role}
          </p>

          <p className="text-sm text-slate-600 leading-relaxed mb-4">
            {author.fullBio}
          </p>

          {/* Credentials bullets */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 bg-slate-50 p-3.5 rounded-lg border border-slate-100">
            {author.credentials.map((cred, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-[#2E6B6B] shrink-0" />
                <span>{cred}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
