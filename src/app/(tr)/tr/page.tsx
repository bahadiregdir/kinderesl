import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getAllWorksheets } from '@/data/worksheets';
import { subjects } from '@/data/subjects';
import { topics } from '@/data/topics';
import { months } from '@/data/months';
import { subjectMap, topicMap, monthMap } from '@/i18n/routes';
import { WorksheetCard } from '@/components/WorksheetCard';
import { AuthorBox } from '@/components/AuthorBox';
import { FAQAccordion } from '@/components/FAQAccordion';
import { AdUnit } from '@/components/AdUnit';
import { getSiteUrl } from '@/config/site';
import {
  BookOpen,
  Calculator,
  Brain,
  Languages,
  Shapes,
  Sparkles,
  ArrowRight,
  Search,
  CheckCircle2,
  Calendar,
  Layers,
  FileDown,
} from 'lucide-react';

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: 'Okul Öncesi İngilizce Etkinlik ve Çalışma Sayfaları | KinderESL',
  description:
    'Okul öncesi ve anaokulu öğretmenleri ile veliler için ücretsiz indirilebilir İngilizce etkinlik pdf materyalleri, harf çizgi çalışmaları, sayılar ve kelime kartları.',
  alternates: {
    canonical: `${siteUrl}/tr`,
    languages: {
      en: siteUrl,
      tr: `${siteUrl}/tr`,
      'x-default': siteUrl,
    },
  },
  openGraph: {
    title: 'Okul Öncesi İngilizce Etkinlik ve Çalışma Sayfaları | KinderESL',
    description:
      'Okul öncesi İngilizce öğretmenleri ve veliler için ücretsiz yazdırılabilir PDF eğitim materyalleri.',
    url: `${siteUrl}/tr`,
    type: 'website',
    locale: 'tr_TR',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function TurkishHomePage() {
  const worksheets = getAllWorksheets();
  const featuredWorksheets = worksheets.slice(0, 4);
  const popularTopics = topics.slice(0, 6);

  const getSubjectIcon = (slug: string) => {
    switch (slug) {
      case 'alphabet':
        return <BookOpen className="w-5 h-5 text-[#2E6B6B]" />;
      case 'phonics':
        return <Languages className="w-5 h-5 text-[#2E6B6B]" />;
      case 'numbers-counting':
        return <Calculator className="w-5 h-5 text-[#2E6B6B]" />;
      case 'shapes-colors':
        return <Shapes className="w-5 h-5 text-[#2E6B6B]" />;
      case 'vocabulary':
        return <Languages className="w-5 h-5 text-[#2E6B6B]" />;
      case 'thinking-skills':
        return <Brain className="w-5 h-5 text-[#2E6B6B]" />;
      default:
        return <Layers className="w-5 h-5 text-[#2E6B6B]" />;
    }
  };

  const trFaqs = [
    {
      question: 'Sitedeki tüm okul öncesi İngilizce çalışma kağıtları ücretsiz mi?',
      answer:
        'Evet, tamamen ücretsizdir. KinderESL üzerindeki tüm PDF materyalleri üyelik ücreti veya e-posta zorunluluğu olmadan doğrudan indirilebilir. Sınıf ve evde kişisel eğitim amacıyla dilediğiniz kadar yazdırabilirsiniz.',
    },
    {
      question: 'Etkinlik PDF’leri hangi dildedir?',
      answer:
        'Çalışma sayfalarındaki görsel etkinlikler uluslararası okul öncesi standartlarında İngilizcedir. Bu sayfadaki yönergeler, öğretmen notları ve veli rehberleri ise Türkçedir.',
    },
    {
      question: 'Çıktı alırken standart A4 yazıcılar kullanılabilir mi?',
      answer:
        'Evet. Materyallerimiz yüksek kontrastlı siyah-beyaz çizimlerle hazırlanmıştır; standart A4 yazıcılarda ve fotokopi makinelerinde mükemmel netlikte basılır.',
    },
    {
      question: 'Evde çocuğuma İngilizce öğretirken bu materyalleri nasıl kullanabilirim?',
      answer:
        'Her etkinliğin altındaki "Öğretmen ve Veli Notları" bölümünde adım adım uygulama rehberi (1-2-3 adımları), eğlenceli ipuçları ve telaffuz tekerlemeleri yer almaktadır.',
    },
  ];

  return (
    <div className="space-y-16 lg:space-y-24">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#F0F7F7] via-[#F8FAFC] to-white border-b border-slate-200/80 pt-12 pb-16 lg:pt-16 lg:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Sol Kolon */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-white text-[#2E6B6B] border border-[#d0e3e3] shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-[#F2B544]" />
                <span>Öğretmenler ve Veliler İçin Ücretsiz İngilizce Materyaller</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight font-heading">
                Okul Öncesi İngilizce{' '}
                <span className="text-[#2E6B6B]">Çalışma Sayfaları</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl font-normal">
                Anaokulu ve erken çocukluk sınıfları için yüksek çözünürlüklü, yönlendirmeli ücretsiz İngilizce çalışma kağıtları. Üyelik veya kayıt gerekmez.
              </p>

              {/* Arama Kutusu */}
              <form action="/tr/calisma-sayfalari" method="GET" className="max-w-lg">
                <div className="relative flex items-center">
                  <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
                  <input
                    type="text"
                    name="q"
                    placeholder="Harf, konu veya tema ara (ör. A harfi, 1-5 sayma, çiftlik)..."
                    className="w-full pl-11 pr-28 py-3.5 text-sm bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#2E6B6B] focus:border-[#2E6B6B] shadow-xs text-slate-800"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 px-4 py-2 text-xs font-bold bg-[#2E6B6B] hover:bg-[#225151] text-white rounded-lg transition-colors shadow-xs"
                  >
                    Ara
                  </button>
                </div>
              </form>

              {/* Butonlar */}
              <div className="flex flex-wrap items-center gap-4 pt-1">
                <Link
                  href="/tr/calisma-sayfalari"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#2E6B6B] hover:bg-[#225151] text-white font-bold text-sm shadow-sm transition-all"
                >
                  <FileDown className="w-4 h-4" />
                  <span>Çalışma kağıtlarını incele</span>
                </Link>
                <Link
                  href="/tr/okul-oncesi-ingilizce-yillik-plan"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm border border-slate-200 shadow-2xs transition-colors"
                >
                  <span>12 Aylık Yıllık Plan</span>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </Link>
              </div>

              {/* Güven Sinyalleri */}
              <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-500 font-medium pt-2">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>%100 Ücretsiz PDF İndirme</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>A4 ve Letter Yazıcı Uyumlu</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Kayıt ve Üyelik Gerekmez</span>
                </span>
              </div>
            </div>

            {/* Sağ Kolaj: 3'lü kağıt kolajı */}
            <div className="lg:col-span-5 relative flex items-center justify-center pt-6 lg:pt-0">
              <div className="relative w-[300px] sm:w-[360px] h-[400px] sm:h-[460px]">
                {/* 1. Sayfa (arkada solda, -6deg) */}
                <div className="absolute top-4 left-0 w-[210px] sm:w-[250px] aspect-[1224/1584] rounded-xl overflow-hidden shadow-lg border border-slate-200/90 -rotate-6 transition-transform hover:rotate-0 duration-300 bg-white">
                  <Image
                    src="/worksheets/counting-1-to-5-ladybug-party/preview-page-1.png"
                    alt="1-5 Sayma etkinliği önizleme"
                    fill
                    sizes="(max-width: 640px) 210px, 250px"
                    className="object-contain p-2"
                    priority
                  />
                </div>

                {/* 2. Sayfa (arkada sağda, +6deg) */}
                <div className="absolute top-6 right-0 w-[210px] sm:w-[250px] aspect-[1224/1584] rounded-xl overflow-hidden shadow-lg border border-slate-200/90 rotate-6 transition-transform hover:rotate-0 duration-300 bg-white">
                  <Image
                    src="/worksheets/farm-animals-esl-vocabulary-and-tracing/preview-page-1.png"
                    alt="Çiftlik hayvanları kes yapıştır önizleme"
                    fill
                    sizes="(max-width: 640px) 210px, 250px"
                    className="object-contain p-2"
                    priority
                  />
                </div>

                {/* 3. Sayfa (önde ortada) */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[220px] sm:w-[260px] aspect-[1224/1584] rounded-xl overflow-hidden shadow-2xl border-2 border-slate-300/80 bg-white z-10 transition-transform hover:scale-105 duration-300">
                  <Image
                    src="/worksheets/letter-a-tracing-and-phonics/preview-page-1.png"
                    alt="İngilizce A harfi yazma etkinliği önizleme"
                    fill
                    sizes="(max-width: 640px) 220px, 260px"
                    className="object-contain p-2"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Konular Yatay Şeridi */}
          <div className="mt-14 pt-8 border-t border-slate-200/70">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-700 font-heading">
                Popüler konular:
              </span>
              <Link
                href="/tr/calisma-sayfalari"
                className="text-xs font-semibold text-[#2E6B6B] hover:underline"
              >
                Tüm konular →
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {subjects.map((s) => {
                const trSlug = subjectMap[s.slug];
                return (
                  <Link
                    key={s.slug}
                    href={`/tr/calisma-sayfalari/${trSlug}`}
                    className="group flex items-center gap-2.5 p-3 rounded-xl bg-white border border-slate-200/90 hover:border-[#2E6B6B] hover:shadow-xs transition-all"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#F0F7F7] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      {getSubjectIcon(s.slug)}
                    </div>
                    <span className="text-xs font-bold text-slate-800 group-hover:text-[#2E6B6B] transition-colors truncate">
                      {s.shortTitle}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Konulara Göre İnceleyin Bölümü */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-heading">
              Konulara Göre İnceleyin
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Okul öncesi İngilizce eğitiminde temel gelişim alanlarına göre ayrılmış çalışma kağıtları.
            </p>
          </div>
          <Link
            href="/tr/calisma-sayfalari"
            className="text-xs font-bold text-[#2E6B6B] hover:underline inline-flex items-center gap-1"
          >
            <span>Tüm konuları gör</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((sub) => {
            const trSlug = subjectMap[sub.slug];
            return (
              <Link
                key={sub.slug}
                href={`/tr/calisma-sayfalari/${trSlug}`}
                className="group p-6 rounded-2xl border border-slate-200/90 hover:border-[#2E6B6B] hover:shadow-md transition-all bg-white flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#F0F7F7] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                    {getSubjectIcon(sub.slug)}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#2E6B6B] transition-colors mb-2 font-heading">
                    {sub.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {sub.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                  <span>{sub.targetAges}</span>
                  <span className="text-[#2E6B6B] font-bold group-hover:translate-x-0.5 transition-transform">
                    İncele →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Öne Çıkan Çalışma Kağıtları */}
      <section className="bg-slate-50 border-y border-slate-200/80 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-heading">
                Öne Çıkan Çalışma Kağıtları
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Yazıcı dostu, standart boyutta yüksek çözünürlüklü ücretsiz PDF çıktıları.
              </p>
            </div>
            <Link
              href="/tr/calisma-sayfalari"
              className="text-xs font-bold text-[#2E6B6B] hover:underline inline-flex items-center gap-1"
            >
              <span>Tüm arşivi gör</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredWorksheets.map((ws) => (
              <WorksheetCard key={ws.slug} worksheet={ws} locale="tr" />
            ))}
          </div>
        </div>
      </section>

      {/* AdSlot (AdSense tanımlı değilse null döner) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdUnit slotType="in-content" />
      </div>

      {/* Aylık Temalar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-heading">
              Aylık Temalar ve Müfredat
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Okul öncesi yıllık müfredatına ve mevsimlere göre düzenlenen aylık İngilizce tema planları.
            </p>
          </div>
          <Link
            href="/tr/okul-oncesi-ingilizce-yillik-plan"
            className="text-xs font-bold text-[#2E6B6B] hover:underline inline-flex items-center gap-1"
          >
            <span>Yıllık planı gör</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 12 Ay Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          {months.map((m) => {
            const trMonthSlug = monthMap[m.slug];
            return (
              <Link
                key={m.slug}
                href={`/tr/aylik-temalar/${trMonthSlug}`}
                className="p-3.5 rounded-xl border border-slate-200/80 hover:border-[#2E6B6B] hover:bg-[#F0F7F7]/50 bg-white transition-all text-center group"
              >
                <div className="text-[11px] font-bold text-[#2E6B6B] uppercase tracking-wider mb-0.5">
                  {m.season === 'Winter'
                    ? 'Kış'
                    : m.season === 'Spring'
                    ? 'İlkbahar'
                    : m.season === 'Summer'
                    ? 'Yaz'
                    : 'Sonbahar'}
                </div>
                <div className="text-sm font-bold text-slate-900 group-hover:text-[#2E6B6B] font-heading">
                  {m.name === 'January'
                    ? 'Ocak'
                    : m.name === 'February'
                    ? 'Şubat'
                    : m.name === 'March'
                    ? 'Mart'
                    : m.name === 'April'
                    ? 'Nisan'
                    : m.name === 'May'
                    ? 'Mayıs'
                    : m.name === 'June'
                    ? 'Haziran'
                    : m.name === 'July'
                    ? 'Temmuz'
                    : m.name === 'August'
                    ? 'Ağustos'
                    : m.name === 'September'
                    ? 'Eylül'
                    : m.name === 'October'
                    ? 'Ekim'
                    : m.name === 'November'
                    ? 'Kasım'
                    : 'Aralık'}
                </div>
              </Link>
            );
          })}
        </div>

        {/* Popüler Temalar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {popularTopics.map((t) => {
            const trTopicSlug = topicMap[t.slug];
            return (
              <Link
                key={t.slug}
                href={`/tr/konular/${trTopicSlug}`}
                className="group p-5 rounded-xl border border-slate-200 hover:border-[#2E6B6B] hover:shadow-sm transition-all bg-white flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-[#2E6B6B] transition-colors mb-1.5 font-heading">
                    {t.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {t.description}
                  </p>
                </div>
                <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs text-[#2E6B6B] font-bold">
                  <span>Çalışma Kağıtlarını Gör</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Yazar & Vizyon Bölümü */}
      <section className="bg-slate-50 border-t border-slate-200/80 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-heading">
              Eğitimciler Tarafından Erken Öğrenenler İçin Hazırlandı
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-xl mx-auto">
              KinderESL materyalleri, yüksek kontrastlı siyah-beyaz çizgiler ve net görsel sembollerle okul öncesi sınıflar için özel olarak tasarlanır.
            </p>
          </div>

          <AuthorBox isCompact={false} />
        </div>
      </section>

      {/* SSS Bölümü */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <FAQAccordion items={trFaqs} title="Okul Öncesi İngilizce Eğitimi Sıkça Sorulan Sorular" />
      </section>
    </div>
  );
}
