import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { GamesInteractive } from '@/app/(en)/games/GamesInteractive';
import { getSiteUrl } from '@/config/site';

const siteUrl = getSiteUrl();
const pageUrl = `${siteUrl}/tr/oyunlar`;

export const metadata: Metadata = {
  title: 'Akıllı Tahta Uyumlu Eğitici Oyunlar | KinderESL',
  description:
    'Okul öncesi sınıflarında akıllı tahtada açılmaya uygun, reklamsız, dikkat dağıtmayan interaktif HTML5 İngilizce öğrenme oyunları.',
  alternates: {
    canonical: pageUrl,
    languages: {
      en: `${siteUrl}/games`,
      tr: pageUrl,
      'x-default': `${siteUrl}/games`,
    },
  },
  openGraph: {
    title: 'Akıllı Tahta Uyumlu Eğitici Oyunlar | KinderESL',
    description:
      'Okul öncesi sınıfları için reklamsız interaktif akıllı tahta oyunları.',
    url: pageUrl,
    type: 'website',
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function TurkishGamesPage() {
  return (
    <>
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: 'Ana Sayfa', href: '/tr' },
              { label: 'Akıllı Tahta Oyunları' },
            ]}
          />
        </div>
      </div>
      <GamesInteractive />
    </>
  );
}
