import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { siteConfig, getSiteUrl } from '@/config/site';
import { Mail, MessageSquare, Clock, ShieldCheck, Heart } from 'lucide-react';

const siteUrl = getSiteUrl();
const pageUrl = `${siteUrl}/tr/iletisim`;

export const metadata: Metadata = {
  title: 'İletişim & Materyal Talepleri | KinderESL',
  description:
    'Okul öncesi veya anaokulu İngilizce çalışma sayfası öneriniz mi var? KinderESL ekibiyle e-posta yoluyla doğrudan iletişime geçin.',
  alternates: {
    canonical: pageUrl,
    languages: {
      en: `${siteUrl}/contact`,
      tr: pageUrl,
      'x-default': `${siteUrl}/contact`,
    },
  },
  openGraph: {
    title: 'İletişim & Materyal Talepleri | KinderESL',
    description:
      'Öğretmen ve veli materyal talepleri için KinderESL ekibiyle iletişime geçin.',
    url: pageUrl,
    type: 'website',
  },
};

export default function TurkishContactPage() {
  return (
    <>
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: 'Ana Sayfa', href: '/tr' },
              { label: 'İletişim' },
            ]}
          />
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#2E6B6B] bg-[#F0F7F7] px-2.5 py-1 rounded mb-3">
            <Mail className="w-3.5 h-3.5" />
            <span>Öğretmen &amp; Veli İletişimi</span>
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            KinderESL ile İletişime Geçin
          </h1>
          <p className="text-base text-slate-600 leading-relaxed max-w-xl mx-auto">
            Okul öncesi İngilizce öğretmenlerinden ve ebeveynlerden geri bildirim almaktan mutluluk duyuyoruz. Yeni tema veya çalışma sayfası isteklerinizi doğrudan bize iletebilirsiniz.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 shadow-xs space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-xl bg-[#F0F7F7] border border-[#d0e3e3]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#2E6B6B] shadow-xs">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#2E6B6B]">Doğrudan E-posta</p>
                <a
                  href={`mailto:${siteConfig.contactEmail}`}
                  className="text-base sm:text-lg font-bold text-slate-900 hover:text-[#2E6B6B] transition-colors break-all"
                >
                  {siteConfig.contactEmail}
                </a>
              </div>
            </div>
            <a
              href={`mailto:${siteConfig.contactEmail}?subject=KinderESL%20Materyal%20Talebi`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#2E6B6B] hover:bg-[#255757] text-white font-semibold rounded-lg text-sm transition-colors shadow-xs"
            >
              <MessageSquare className="w-4 h-4" />
              <span>E-posta Gönder</span>
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
              <Clock className="w-5 h-5 text-[#2E6B6B] shrink-0 mt-0.5" />
              <div>
                <h2 className="text-sm font-bold text-slate-900">Yanıt Süresi</h2>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Öğretmen ve veli mesajlarını genellikle 1-2 iş günü içinde yanıtlıyoruz.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
              <ShieldCheck className="w-5 h-5 text-[#2E6B6B] shrink-0 mt-0.5" />
              <div>
                <h2 className="text-sm font-bold text-slate-900">Gizlilik Güvencesi</h2>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  E-posta adresiniz yalnızca sorunuzu yanıtlamak için kullanılır, asla paylaşılmaz.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
