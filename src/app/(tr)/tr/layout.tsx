import type { Metadata, Viewport } from 'next';
import '@/app/globals.css';
import { siteConfig, getSiteUrl } from '@/config/site';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const viewport: Viewport = {
  themeColor: '#2E6B6B',
  width: 'device-width',
  initialScale: 1,
};

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'KinderESL Türkçe - Okul Öncesi İngilizce Öğretmen & Ebeveyn Kaynakları',
    template: `%s | ${siteConfig.name}`,
  },
  description:
    'Okul öncesi ve anaokulu öğretmenleri ile ebeveynler için ücretsiz indirilebilir İngilizce çalışma sayfaları, fonetik materyalleri ve tema planları.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function TurkishRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className="h-full scroll-smooth">
      <body className="min-h-full flex flex-col bg-white text-slate-800 antialiased selection:bg-[#2E6B6B] selection:text-white">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
