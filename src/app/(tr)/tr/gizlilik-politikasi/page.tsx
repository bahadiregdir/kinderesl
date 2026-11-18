import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { siteConfig, getSiteUrl } from '@/config/site';
import { ShieldCheck, Lock } from 'lucide-react';

const siteUrl = getSiteUrl();
const pageUrl = `${siteUrl}/tr/gizlilik-politikasi`;

export const metadata: Metadata = {
  title: `Gizlilik Politikası | ${siteConfig.name}`,
  description: `${siteConfig.name} Gizlilik Politikası. Veri toplama uygulamaları, yetişkin öğretmen/veli hedef kitlesi, COPPA uyumu ve reklam bildirimleri.`,
  alternates: {
    canonical: pageUrl,
    languages: {
      en: `${siteUrl}/privacy-policy`,
      tr: pageUrl,
      'x-default': `${siteUrl}/privacy-policy`,
    },
  },
  openGraph: {
    title: `Gizlilik Politikası | ${siteConfig.name}`,
    description: `${siteConfig.name} veri uygulamaları ve gizlilik politikası.`,
    url: pageUrl,
    type: 'website',
  },
};

export default function TurkishPrivacyPolicyPage() {
  return (
    <>
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: 'Ana Sayfa', href: '/tr' },
              { label: 'Gizlilik Politikası' },
            ]}
          />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        <header className="mb-8 pb-6 border-b border-slate-200">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#2E6B6B] bg-[#F0F7F7] px-2.5 py-1 rounded mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Veri Şeffaflığı ve Güvenliği</span>
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
            Gizlilik Politikası
          </h1>
          <p className="text-xs text-slate-600">
            Son Güncelleme: Kasım 2026 · Yürürlük Tarihi: 18 Kasım 2026
          </p>
        </header>

        <div className="prose prose-slate max-w-none space-y-6 text-slate-600 text-sm sm:text-base leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">1. Yetişkin Kitleye Yönelik Konumlandırma ve COPPA Uyumu</h2>
            <p>
              {siteConfig.name}, okul öncesi ve anaokulu İngilizce öğretmenleri, eğitimciler ve çocuklarına evde eğitim veren yetişkin ebeveynler için bir kaynak sitesidir. Sitemiz 13 yaşın altındaki çocuklara yönelik değildir ve doğrudan çocukları hedeflemez.
            </p>
            <p>
              Çocukların Çevrimiçi Gizliliğini Koruma Yasası (COPPA) uyarınca, 13 yaşından küçük çocuklardan bilerek hiçbir kişisel bilgi toplamıyoruz. Bir çocuğun bize kişisel veri sağladığını fark edersek, bu veriyi sistemlerimizden derhal sileriz.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">2. Toplanan Bilgiler</h2>
            <p>
              Sitemiz üyelik veya hesap oluşturma gerektirmez. Tüm PDF çalışma sayfalarımız kayıt olmadan doğrudan indirilebilir. Aşağıdaki sınırlı veriler toplanabilir:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Doğrudan İletişim:</strong> Bize e-posta gönderdiğinizde ilettiğiniz isim ve e-posta adresi, yalnızca sorunuzu yanıtlamak için kullanılır.</li>
              <li><strong>Otomatik Sunucu Günlükleri:</strong> IP adresi, tarayıcı türü, ziyaret saati gibi standart teknik kayıtlar sunucu güvenliği ve performans takibi için saklanır.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">3. Çerezler ve Reklam Uygulamaları</h2>
            <p>
              When advertising is enabled, consent will be collected through a Google-certified Consent Management Platform.
            </p>
            <p>
              Reklam ortakları, sitenin ziyaret edildiğini anlamak amacıyla çerez (cookie) ve web işaretçileri kullanabilir. Sitemizdeki tüm içerikler yetişkin öğretmen ve ebeveynlere yöneliktir.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">4. İletişim</h2>
            <p>
              Gizlilik politikamız hakkındaki tüm soru ve talepleriniz için bize ulaşabilirsiniz:
            </p>
            <p className="font-semibold text-slate-900">
              E-posta: <a href={`mailto:${siteConfig.contactEmail}`} className="text-[#2E6B6B] underline">{siteConfig.contactEmail}</a>
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
