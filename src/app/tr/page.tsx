import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { getSiteUrl } from '@/config/site';
import { Globe, BookOpen, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

const siteUrl = getSiteUrl();
const pageUrl = `${siteUrl}/tr`;

export const metadata: Metadata = {
  title: 'KinderESL Türkçe - Okul Öncesi İngilizce Öğretmen & Ebeveyn Kaynakları',
  description:
    'Okul öncesi ve anaokulu öğretmenleri ile ebeveynler için ücretsiz indirilebilir İngilizce çalışma sayfaları, fonetik materyalleri ve tema planları.',
  alternates: {
    canonical: pageUrl,
    // Item 9: hreflang removed until translations are fully completed
  },
  openGraph: {
    title: 'KinderESL Türkçe - Okul Öncesi İngilizce Öğretmen & Ebeveyn Kaynakları',
    description:
      'Okul öncesi İngilizce öğretmenleri ve ebeveynler için ücretsiz yazdırılabilir PDF eğitim materyalleri.',
    url: pageUrl,
    type: 'website',
  },
  // Item 7: Noindex until Turkish content library is populated
  robots: {
    index: false,
    follow: false,
  },
};

export default function TurkishLandingPage() {
  return (
    <>
      {/* Item 9: Set lang to tr for this page */}
      <script
        dangerouslySetInnerHTML={{
          __html: `if(typeof document !== 'undefined') { document.documentElement.lang = 'tr'; }`,
        }}
      />

      <div className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: 'Türkçe Sürüm' }]} />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        {/* Badge & Title */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#F0F7F7] text-[#2E6B6B] border border-[#d0e3e3] mb-4">
            <Globe className="w-3.5 h-3.5" />
            <span>KinderESL Türkiye &amp; İki Dilli Eğitim Altyapısı</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            Okul Öncesi İngilizce Öğretmenleri ve Ebeveynler İçin Ücretsiz Kaynaklar
          </h1>

          <p className="text-base text-slate-600 leading-relaxed">
            KinderESL, erken çocukluk döneminde İngilizce öğrenen minikler için yüksek çözünürlüklü ve ücretsiz PDF çalışma kağıtları sunar. Sitemizdeki tüm içerikler doğrudan İngilizce olarak sınıfta ve evde kullanıma hazırdır.
          </p>
        </div>

        {/* Info card */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-xs mb-8 space-y-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#2E6B6B]" />
            <span>Neler Sunuyoruz?</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-700">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#2E6B6B] shrink-0 mt-0.5" />
              <span><strong>Harf ve Fonetik:</strong> Doğru el yazısı yönlendirmeli harf çizgi çalışmaları (Letter of the Week).</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#2E6B6B] shrink-0 mt-0.5" />
              <span><strong>Erken Matematik:</strong> 1-5 ve 1-10 arası birebir eşleme ve sayı çizgi çalışmaları.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#2E6B6B] shrink-0 mt-0.5" />
              <span><strong>Görsel Ayırt Etme:</strong> Mevsimsel &quot;farklı olanı bul&quot; ve mantıksal sınıflandırma kağıtları.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#2E6B6B] shrink-0 mt-0.5" />
              <span><strong>ESL Kelime Setleri:</strong> Çiftlik hayvanları, renkler, şekiller ve ses eşleştirmeleri.</span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 text-xs text-slate-600 leading-relaxed">
            * Tüm PDF materyallerimiz uluslararası standartlarda hazırlanmış olup, hem anadili İngilizce olan hem de İngilizceyi ikinci dil olarak edinen okul öncesi sınıflarda ve evde eğitime uygundur.
          </div>
        </div>

        {/* CTA to main English library */}
        <div className="bg-[#F0F7F7] border border-[#d0e3e3] rounded-xl p-6 text-center space-y-3">
          <h3 className="text-base font-bold text-slate-900">
            Hemen Ücretsiz İngilizce Çalışma Kağıtlarını İndirin
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
            İçeriklerimizi incelemek, önizlemelerine bakmak ve tek tıkla PDF olarak indirmek için ana arşivimize göz atabilirsiniz:
          </p>
          <div className="pt-2">
            <Link
              href="/worksheets"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#2E6B6B] hover:bg-[#225151] text-white font-bold text-sm shadow-sm transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              <span>Çalışma Sayfaları Arşivine Git (All Worksheets)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
