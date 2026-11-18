import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { siteConfig, getSiteUrl } from '@/config/site';
import { Cookie } from 'lucide-react';

const siteUrl = getSiteUrl();
const pageUrl = `${siteUrl}/tr/cerez-politikasi`;

export const metadata: Metadata = {
  title: `Çerez Politikası | ${siteConfig.name}`,
  description: `${siteConfig.name} Çerez Politikası. Kullandığımız çerez türleri ve öğretmen ile velilerin tercihlerini nasıl yönetebileceği hakkında bilgi edinin.`,
  alternates: {
    canonical: pageUrl,
    languages: {
      en: `${siteUrl}/cookie-policy`,
      tr: pageUrl,
      'x-default': `${siteUrl}/cookie-policy`,
    },
  },
  openGraph: {
    title: `Çerez Politikası | ${siteConfig.name}`,
    description: `${siteConfig.name} çerez kullanımı ve tercih yönetimi.`,
    url: pageUrl,
    type: 'website',
  },
};

export default function TurkishCookiePolicyPage() {
  return (
    <>
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: 'Ana Sayfa', href: '/tr' },
              { label: 'Çerez Politikası' },
            ]}
          />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        <header className="mb-8 pb-6 border-b border-slate-200">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#2E6B6B] bg-[#F0F7F7] px-2.5 py-1 rounded mb-3">
            <Cookie className="w-3.5 h-3.5" />
            <span>Çerez Şeffaflığı</span>
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
            Çerez Politikası
          </h1>
          <p className="text-xs text-slate-600">
            Son Güncelleme: Kasım 2026
          </p>
        </header>

        <div className="prose prose-slate max-w-none text-sm leading-relaxed space-y-6 text-slate-700">
          <p>
            Bu Çerez Politikası, KinderESL (&quot;biz&quot;, &quot;bize&quot; veya &quot;bizim&quot;) web sitemizi ziyaret ettiğinizde çerezleri ve benzeri izleme teknolojilerini nasıl kullandığımızı açıklar.
          </p>

          <h2 className="text-lg font-bold text-slate-900">1. Çerez Nedir?</h2>
          <p>
            Çerezler, bir web sitesini ziyaret ettiğinizde bilgisayarınıza veya mobil cihazınıza kaydedilen küçük metin dosyalarıdır. Web sitelerinin düzgün çalışması, tercihlerin hatırlanması ve analitik ölçümler için yaygın olarak kullanılır.
          </p>

          <h2 className="text-lg font-bold text-slate-900">2. Hangi Tür Çerezleri Kullanıyoruz?</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Gerekli Çerezler:</strong> Web sitesinin temel fonksiyonlarının çalışması ve güvenlik için zorunlu olan çerezlerdir.
            </li>
            <li>
              <strong>Performans ve Analitik Çerezleri:</strong> Ziyaretçilerin siteyi nasıl kullandığını anonim olarak anlamamıza yardımcı olur.
            </li>
            <li>
              <strong>Reklam Çerezleri:</strong> When advertising is enabled, consent will be collected through a Google-certified Consent Management Platform.
            </li>
          </ul>

          <h2 className="text-lg font-bold text-slate-900">3. Çerez Tercihlerinizi Nasıl Yönetebilirsiniz?</h2>
          <p>
            Tarayıcınızın ayarlarından çerezleri dilediğiniz zaman silebilir veya yeni çerez kabulünü engelleyebilirsiniz. Çerezleri devre dışı bırakmanız halinde sitemizdeki PDF indirme özellikleri etkilenmeden çalışmaya devam eder.
          </p>

          <h2 className="text-lg font-bold text-slate-900">4. İletişim</h2>
          <p>
            Çerez politikamız hakkında sorularınız için bizimle <a href={`mailto:${siteConfig.contactEmail}`} className="text-[#2E6B6B] underline font-semibold">{siteConfig.contactEmail}</a> üzerinden iletişime geçebilirsiniz.
          </p>
        </div>
      </div>
    </>
  );
}
