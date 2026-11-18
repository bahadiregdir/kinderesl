import React from 'react';
import Link from 'next/link';
import { getAllWorksheets } from '@/data/worksheets';
import { WorksheetCard } from '@/components/WorksheetCard';
import { Search, Compass, ArrowRight, Home } from 'lucide-react';

export default function TurkishNotFound() {
  const popularWorksheets = getAllWorksheets().slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <div className="max-w-2xl mx-auto text-center space-y-4 mb-12">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#F0F7F7] text-[#2E6B6B] border border-[#d0e3e3]">
          404 Hatası
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Sayfa Bulunamadı
        </h1>
        <p className="text-base text-slate-600">
          Aradığınız sayfa veya çalışma kağıdı taşınmış ya da silinmiş olabilir. Aşağıdaki arama kutusundan istediğiniz konuyu arayabilir veya popüler materyallere göz atabilirsiniz.
        </p>

        {/* Arama kutusu */}
        <form action="/tr/calisma-sayfalari" method="GET" className="pt-2 max-w-lg mx-auto">
          <div className="relative flex items-center">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
            <input
              type="text"
              name="q"
              placeholder="Etkinlik ara (ör. A harfi, sayılar, hayvanlar)..."
              className="w-full pl-11 pr-24 py-3 text-sm bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#2E6B6B] focus:border-[#2E6B6B] shadow-xs"
            />
            <button
              type="submit"
              className="absolute right-2 px-4 py-1.5 text-xs font-bold bg-[#2E6B6B] hover:bg-[#225151] text-white rounded-lg transition-colors"
            >
              Ara
            </button>
          </div>
        </form>

        {/* Aksiyon butonları */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/tr"
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Ana Sayfaya Dön</span>
          </Link>
          <Link
            href="/tr/calisma-sayfalari"
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-[#2E6B6B] hover:bg-[#225151] rounded-lg transition-colors"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Tüm Çalışma Kağıtları</span>
          </Link>
        </div>
      </div>

      {/* Popüler çalışma kağıtları */}
      <div className="border-t border-slate-200 pt-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Popüler Ücretsiz Çalışma Kağıtları
            </h2>
            <p className="text-xs text-slate-600">
              Okul öncesi ve anaokulu için özenle seçilmiş, indirilebilir PDF materyaller.
            </p>
          </div>
          <Link
            href="/tr/calisma-sayfalari"
            className="text-xs font-bold text-[#2E6B6B] hover:underline inline-flex items-center gap-1"
          >
            <span>Tümünü Gör</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularWorksheets.map((ws) => (
            <WorksheetCard key={ws.slug} worksheet={ws} />
          ))}
        </div>
      </div>
    </div>
  );
}
