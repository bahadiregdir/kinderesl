import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { siteConfig, getSiteUrl } from '@/config/site';
import { FileText, CheckCircle2, AlertCircle } from 'lucide-react';

const siteUrl = getSiteUrl();
const pageUrl = `${siteUrl}/tr/kullanim-kosullari`;

export const metadata: Metadata = {
  title: `Kullanım Koşulları & Lisans | ${siteConfig.name}`,
  description: `${siteConfig.name} Kullanım Koşulları. Öğretmenler, sınıflar ve aileler için ücretsiz eğitim lisansı şartları ve ticari kısıtlamalar.`,
  alternates: {
    canonical: pageUrl,
    languages: {
      en: `${siteUrl}/terms`,
      tr: pageUrl,
      'x-default': `${siteUrl}/terms`,
    },
  },
  openGraph: {
    title: `Kullanım Koşulları & Lisans | ${siteConfig.name}`,
    description: `${siteConfig.name} eğitim lisansı ve kullanım şartları.`,
    url: pageUrl,
    type: 'website',
  },
};

export default function TurkishTermsPage() {
  return (
    <>
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: 'Ana Sayfa', href: '/tr' },
              { label: 'Kullanım Koşulları' },
            ]}
          />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        <header className="mb-8 pb-6 border-b border-slate-200">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#2E6B6B] bg-[#F0F7F7] px-2.5 py-1 rounded mb-3">
            <FileText className="w-3.5 h-3.5" />
            <span>Sınıf Lisansı ve Telif Hakları</span>
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
            Kullanım Koşulları ve Eğitim Lisansı
          </h1>
          <p className="text-xs text-slate-600">
            Son Güncelleme: Kasım 2026
          </p>
        </header>

        <div className="prose prose-slate max-w-none text-sm leading-relaxed space-y-6 text-slate-700">
          <section className="bg-emerald-50/60 border border-emerald-200 p-5 rounded-xl text-emerald-950 font-medium">
            <h2 className="text-base font-bold text-emerald-800 mt-0 mb-2 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Özet: Sınıf ve Ev Kullanımı İçin %100 Ücretsiz</span>
            </h2>
            <p className="text-sm m-0">
              KinderESL üzerindeki tüm PDF materyalleri; öğretmenlerin sınıflarında öğrencilerine dağıtması, okul öncesi eğitim kurumları ve çocuklarına evde eğitim veren ebeveynler için tamamen ücretsizdir.
            </p>
          </section>

          <h2 className="text-lg font-bold text-slate-900">1. İzin Verilen Kullanımlar</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>PDF dosyalarını sınıfınızda, okulunuzda veya evinizde dilediğiniz sayıda yazdırmak ve çoğaltmak.</li>
            <li>Materyalleri kâr amacı gütmeyen eğitim etkinliklerinde ve ödevlerde kullanmak.</li>
            <li>Okul öncesi sınıflarında akıllı tahta veya projeksiyonda görüntülemek.</li>
          </ul>

          <h2 className="text-lg font-bold text-slate-900">2. Yasaklanan Faaliyetler (Ticari Kısıtlamalar)</h2>
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-amber-950 space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-900">
              <AlertCircle className="w-4 h-4 text-amber-700" />
              <span>Lütfen Dikkat Edin</span>
            </div>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Materyalleri satamaz, ücretli paketlerin parçası haline getiremezsiniz.</li>
              <li>PDF dosyalarımızı başka sitelere, pazar yerlerine veya dosya paylaşım sitelerine doğrudan yükleyemezsiniz.</li>
              <li>Dosyalardaki KinderESL telif ve web adresi yazılarını kaldıramaz veya değiştiremezsiniz.</li>
            </ul>
          </div>

          <h2 className="text-lg font-bold text-slate-900">3. Fikri Mülkiyet</h2>
          <p>
            KinderESL üzerindeki tüm çizimler, karakterler, çalışma sayfası düzenleri ve tasarımlar KinderESL mülkiyetindedir ve telif hakları yasaları ile korunmaktadır.
          </p>

          <h2 className="text-lg font-bold text-slate-900">4. İletişim</h2>
          <p>
            Lisans izinleri ve kullanım koşullarıyla ilgili her türlü soru için bize <a href={`mailto:${siteConfig.contactEmail}`} className="text-[#2E6B6B] underline font-semibold">{siteConfig.contactEmail}</a> üzerinden ulaşabilirsiniz.
          </p>
        </div>
      </div>
    </>
  );
}
