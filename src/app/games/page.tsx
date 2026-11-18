import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { GamesInteractive } from './GamesInteractive';
import { getSiteUrl } from '@/config/site';

const siteUrl = getSiteUrl();
const pageUrl = `${siteUrl}/games`;

export const metadata: Metadata = {
  title: 'Classroom Smartboard Educational Games | KinderESL',
  description:
    'Distraction-free, ad-free interactive HTML5 educational games designed for preschool and kindergarten interactive whiteboards and circle time instruction.',
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    title: 'Classroom Smartboard Educational Games | KinderESL',
    description:
      'Ad-free interactive classroom smartboard learning games for early childhood educators.',
    url: pageUrl,
    type: 'website',
  },
  // Item 7: Noindex until content library is expanded (>= 3 games)
  robots: {
    index: false,
    follow: false,
  },
};

export default function GamesPage() {
  return (
    <>
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: 'Classroom Smartboard Games' }]} />
        </div>
      </div>
      <GamesInteractive />
    </>
  );
}
