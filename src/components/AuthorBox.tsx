import React from 'react';
import Link from 'next/link';
import { siteConfig } from '@/config/site';
import { BookOpen, Sparkles } from 'lucide-react';

export function AuthorBox({
  isCompact = false,
  locale = 'en',
}: {
  isCompact?: boolean;
  locale?: 'en' | 'tr';
}) {
  const { author } = siteConfig;
  const isTr = locale === 'tr';

  const roleText = isTr ? 'Kurucu & Erken Çocukluk İngilizce Eğitmeni' : author.role;
  const bioText = isTr
    ? 'Okul öncesi ve anaokulu İngilizce sınıfları ile evde İngilizce öğrenen çocuklar için dikkat dağıtmayan, pedagojik ve yazdırılabilir çalışma sayfaları tasarlıyor.'
    : author.shortBio;
  const fullBioText = isTr
    ? 'Erken çocukluk İngilizce eğitiminde öğretmenlerin ve ebeveynlerin güvenle kullanabileceği, mürekkep dostu, temiz ve pedagojik yazdırılabilir PDF materyalleri tasarlamaktadır.'
    : author.fullBio;

  if (isCompact) {
    return (
      <div className="bg-[#F0F7F7] border border-[#d0e3e3] rounded-xl p-4 my-6">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-full bg-[#2E6B6B] text-white font-bold flex items-center justify-center shrink-0 shadow-xs text-sm">
            {author.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-slate-900 truncate">
                {isTr ? `Hazırlayan: ${author.name}` : `Created by ${author.name}`}
              </h4>
            </div>
            <p className="text-xs text-[#2E6B6B] font-medium mb-1">
              {roleText}
            </p>
            <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
              {bioText}
            </p>
            <div className="mt-2">
              <Link
                href={isTr ? '/tr/hakkimizda' : '/about'}
                className="text-xs font-semibold text-[#2E6B6B] hover:text-[#225151] hover:underline"
              >
                {isTr
                  ? 'Misyonumuz ve eğitim standartlarımız →'
                  : 'Learn more about our mission & standards →'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 my-8 shadow-xs">
      <div className="flex flex-col sm:flex-row items-start gap-5">
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#2E6B6B] text-white text-xl font-bold flex items-center justify-center shrink-0 shadow-xs">
          {author.name.charAt(0)}
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h3 className="text-lg font-bold text-slate-900">
              {author.name}
            </h3>
            <span className="inline-flex items-center gap-1 text-xs text-teal-800 font-semibold bg-[#F0F7F7] border border-[#d0e3e3] px-2 py-0.5 rounded-full">
              <BookOpen className="w-3.5 h-3.5 text-[#2E6B6B]" />
              <span>{roleText}</span>
            </span>
          </div>

          <p className="text-sm text-slate-600 leading-relaxed mb-4">
            {fullBioText}
          </p>

          {author.credentials && author.credentials.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 bg-slate-50 p-3.5 rounded-lg border border-slate-100">
              {author.credentials.map((cred, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#2E6B6B] shrink-0" />
                  <span>{cred}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
