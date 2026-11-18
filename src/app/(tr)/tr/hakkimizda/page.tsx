import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { AuthorBox } from '@/components/AuthorBox';
import { siteConfig, getSiteUrl } from '@/config/site';
import { BookOpen, ShieldCheck, HeartHandshake, Sparkles } from 'lucide-react';

const siteUrl = getSiteUrl();
const pageUrl = `${siteUrl}/tr/hakkimizda`;

export const metadata: Metadata = {
  title: `Hakkımızda & Eğitsel Misyonumuz | ${siteConfig.name}`,
  description: `${siteConfig.name}'in okul öncesi İngilizce öğretmenleri ve veliler için ücretsiz, yüksek kaliteli yazdırılabilir PDF materyalleri sunma misyonu hakkında bilgi edinin.`,
  alternates: {
    canonical: pageUrl,
    languages: {
      en: `${siteUrl}/about`,
      tr: pageUrl,
      'x-default': `${siteUrl}/about`,
    },
  },
  openGraph: {
    title: `Hakkımızda & Eğitsel Misyonumuz | ${siteConfig.name}`,
    description: `${siteConfig.name}'in erken çocukluk İngilizce eğitimi misyonu ve pedagojik standartları.`,
    url: pageUrl,
    type: 'website',
  },
};

export default function TurkishAboutPage() {
  return (
    <>
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: 'Ana Sayfa', href: '/tr' },
              { label: 'Hakkımızda' },
            ]}
          />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        <header className="mb-8">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#2E6B6B] bg-[#F0F7F7] px-2.5 py-1 rounded mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Misyon ve Standartlar</span>
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            KinderESL Hakkında ve Eğitsel Misyonumuz
          </h1>
          <p className="text-base text-slate-600 leading-relaxed">
            KinderESL, okul öncesi ve anaokulu İngilizce öğretmenleri, erken çocukluk eğitimcileri ve çocuklarına evde İngilizce öğreten ebeveynler için dikkat dağıtmayan, yüksek kontrastlı ve ücretsiz yazdırılabilir PDF materyalleri sağlamayı hedefler.
          </p>
        </header>

        <AuthorBox isCompact={false} locale="tr" />

        <section className="my-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            4 Temel Çalışma Sayfası Tasarım İlkemiz
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-[#F0F7F7] text-[#2E6B6B] flex items-center justify-center font-bold text-sm mb-3">
                1
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-2">
                Gereksiz Renk ve Arka Plan Yok (Mürekkep Dostu)
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Ağır renkli dolgular yerine keskin siyah-beyaz vektör çizgileri kullanıyoruz. Böylece yazıcı tonerini tüketmez, fotokopiyle çoğaltıldığında netliğini kaybetmez.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-[#F0F7F7] text-[#2E6B6B] flex items-center justify-center font-bold text-sm mb-3">
                2
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-2">
                Açık ve Yönlendirmeli Çizgiler
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Erken yaş kalem tutuşuna uygun başlangıç noktaları (yeşil yönlendirici noktalar), numaralandırılmış vuruş adımları ve geniş aralıklı kılavuz çizgilerle motor becerileri destekler.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-[#F0F7F7] text-[#2E6B6B] flex items-center justify-center font-bold text-sm mb-3">
                3
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-2">
                ESL ve Fonetik Uyumlu Kelimeler
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                İngilizceyi ikinci dil olarak öğrenen çocuklar için kafa karıştırıcı istisnalar elenir. Açık, kolay görselleştirilebilir ve doğrudan telaffuz edilen temel kelimeler seçilir.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-[#F0F7F7] text-[#2E6B6B] flex items-center justify-center font-bold text-sm mb-3">
                4
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-2">
                Öğretmen ve Veli Kılavuzu
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Her çalışma sayfasının altındaki kılavuz kutusu; kazanım hedefi, derste uygulanabilecek 2 dakikalık pratik ipucu ve hızlı bitiren çocuklar için ek aktivite önerisi içerir.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8">
          <div className="flex items-center gap-2 text-[#2E6B6B] font-bold mb-3">
            <ShieldCheck className="w-5 h-5" />
            <h2 className="text-lg">Kullanım Şartları ve Telif İzni</h2>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed mb-4">
            KinderESL üzerindeki tüm PDF materyalleri; devlet okulları, özel anaokulları, dil kursları ve evde eğitim veren aileler için tamamen ücretsizdir. Kâr amacı gütmeyen eğitim ortamlarında dilediğiniz kadar yazdırabilir ve çoğaltabilirsiniz. Ticari satış veya ücretli paketlerde yeniden dağıtım yasaktır.
          </p>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <HeartHandshake className="w-4 h-4 text-[#2E6B6B]" />
            <span>Erken çocukluk eğitimcilerini desteklemek amacıyla hazırlanmıştır.</span>
          </div>
        </section>
      </div>
    </>
  );
}
