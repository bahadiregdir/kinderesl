import React from 'react';
import Link from 'next/link';
import { siteConfig } from '@/config/site';
import { getDictionary } from '@/i18n/get-dictionary';
import { BookOpen, Heart, Sparkles } from 'lucide-react';

interface FooterProps {
  locale?: 'en' | 'tr';
}

export function Footer({ locale = 'en' }: FooterProps) {
  const isTr = locale === 'tr';
  const dict = getDictionary(isTr ? 'tr' : 'en');

  const homeHref = isTr ? '/tr' : '/';
  const worksheetsHref = isTr ? '/tr/calisma-sayfalari' : '/worksheets';

  const featuredWorksheets = isTr
    ? [
        { title: 'A Harfi Yazma & Fonetik', href: '/tr/calisma-sayfalari/ingilizce-a-harfi-yazma-etkinligi' },
        { title: '1-5 Sayma & Rakam Çizimi', href: '/tr/calisma-sayfalari/1-5-sayma-etkinligi-ugurbocegi-lily' },
        { title: 'Kış Görsel Farklı Olanı Bul', href: '/tr/calisma-sayfalari/kis-mevsimi-farkli-olani-bul-etkinligi' },
        { title: 'Çiftlik Hayvanları Eşleştirme', href: '/tr/calisma-sayfalari/ciftlik-hayvanlari-eslestirme-ve-kes-yapistir' },
      ]
    : [
        { title: 'Letter A Tracing & Phonics', href: '/worksheets/letter-a-tracing-and-phonics' },
        { title: 'Numbers 1 to 5 Counting', href: '/worksheets/counting-1-to-5-ladybug-party' },
        { title: 'Winter Discrimination', href: '/worksheets/winter-odd-one-out-visual-discrimination' },
        { title: 'Farm Animals Match & Cut', href: '/worksheets/farm-animals-esl-vocabulary-and-tracing' },
      ];

  const subjects = isTr
    ? [
        { title: 'Alfabe & Harfler', href: '/tr/calisma-sayfalari/alfabe' },
        { title: 'Sesler & Fonetik', href: '/tr/calisma-sayfalari/sesler-fonetik' },
        { title: 'Sayılar & Sayma', href: '/tr/calisma-sayfalari/sayilar-sayma' },
        { title: 'Şekiller & Renkler', href: '/tr/calisma-sayfalari/sekiller-renkler' },
        { title: 'ESL Kelimeler', href: '/tr/calisma-sayfalari/kelimeler' },
        { title: 'Düşünme Becerileri', href: '/tr/calisma-sayfalari/dusunme-becerileri' },
      ]
    : [
        { title: 'Alphabet & Phonics', href: '/worksheets/alphabet' },
        { title: 'Phonics & Sounds', href: '/worksheets/phonics' },
        { title: 'Numbers & Counting', href: '/worksheets/numbers-counting' },
        { title: 'Shapes & Colors', href: '/worksheets/shapes-colors' },
        { title: 'ESL Vocabulary', href: '/worksheets/vocabulary' },
        { title: 'Thinking Skills', href: '/worksheets/thinking-skills' },
      ];

  const popularTopics = isTr
    ? [
        { title: 'Çiftlik Hayvanları', href: '/tr/konular/ciftlik-hayvanlari' },
        { title: 'Kış Mevsimi', href: '/tr/konular/kis' },
        { title: 'Böcekler & Minik Canlılar', href: '/tr/konular/bocekler' },
        { title: 'Yiyecekler & Beslenme', href: '/tr/konular/yiyecekler' },
        { title: 'Yıllık Plan (Aylık Temalar)', href: '/tr/okul-oncesi-ingilizce-yillik-plan' },
      ]
    : [
        { title: 'Farm Animals', href: '/topics/farm-animals' },
        { title: 'Winter & Snow', href: '/topics/winter' },
        { title: 'Insects & Bugs', href: '/topics/insects' },
        { title: 'Food & Nutrition', href: '/topics/food' },
        { title: 'Monthly Themes', href: '/preschool-themes' },
      ];

  const legalLinks = isTr
    ? [
        { title: 'Hakkımızda', href: '/tr/hakkimizda' },
        { title: 'İletişim & İstek', href: '/tr/iletisim' },
        { title: 'Gizlilik Politikası', href: '/tr/gizlilik-politikasi' },
        { title: 'Çerez Politikası', href: '/tr/cerez-politikasi' },
        { title: 'Kullanım Koşulları', href: '/tr/kullanim-kosullari' },
      ]
    : [
        { title: 'About KinderESL', href: '/about' },
        { title: 'Contact & Requests', href: '/contact' },
        { title: 'Privacy Policy', href: '/privacy-policy' },
        { title: 'Cookie Policy', href: '/cookie-policy' },
        { title: 'Terms of Use', href: '/terms' },
      ];

  return (
    <footer className="bg-slate-900 text-slate-300 mt-auto border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10 pb-12 border-b border-slate-800">
          {/* Brand & mission */}
          <div className="lg:col-span-1 space-y-4">
            <Link href={homeHref} className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-[#2E6B6B] flex items-center justify-center text-white shadow-xs">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white font-heading">
                Kinder<span className="text-teal-400">ESL</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              {isTr
                ? 'Okul öncesi ve anaokulu öğretmenleri ile ebeveynler için ücretsiz yazdırılabilir İngilizce çalışma kağıtları.'
                : 'Free printable PDF educational resources for preschool, kindergarten, and ESL teachers worldwide.'}
            </p>
            <div className="pt-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-800 text-teal-300 border border-slate-700">
                <Sparkles className="w-3 h-3 text-[#F2B544]" />
                <span>100% Free Resources</span>
              </span>
            </div>
          </div>

          {/* Featured Worksheets */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              {dict.footer.headers.featured}
            </h3>
            <ul className="space-y-2 text-xs">
              {featuredWorksheets.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-slate-400 hover:text-teal-300 transition-colors">
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Subjects */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              {dict.footer.headers.subjects}
            </h3>
            <ul className="space-y-2 text-xs">
              {subjects.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-slate-400 hover:text-teal-300 transition-colors">
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Topics */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              {dict.footer.headers.topics}
            </h3>
            <ul className="space-y-2 text-xs">
              {popularTopics.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-slate-400 hover:text-teal-300 transition-colors">
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & About */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              {dict.footer.headers.legal}
            </h3>
            <ul className="space-y-2 text-xs">
              {legalLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-slate-400 hover:text-teal-300 transition-colors">
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Audience Notice (COPPA / Teacher Resource) */}
        <div className="py-6 border-b border-slate-800 text-xs text-slate-400 leading-relaxed space-y-2">
          <p>
            <strong className="text-slate-200">{dict.footer.audienceNotice}:</strong>{' '}
            {dict.footer.audienceNoticeText}
          </p>
          <p>{dict.footer.copyrightNotice}</p>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>{dict.footer.copyright}</p>
          <p className="flex items-center gap-1">
            <span>Designed with</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
            <span>{dict.footer.tagline}</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
