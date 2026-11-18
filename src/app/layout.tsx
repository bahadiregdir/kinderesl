import type { Metadata, Viewport } from 'next';
import './globals.css';
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
    default: `${siteConfig.name} - Free Printable Educational Resources for Teachers & Parents`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.author.name, url: `${siteUrl}/about` }],
  creator: siteConfig.author.name,
  publisher: siteConfig.legalName,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: siteUrl,
    // hreflang removed as requested (Item 9)
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: siteConfig.name,
    title: `${siteConfig.name} - Free Printable Worksheets for Teachers & Parents`,
    description: siteConfig.description,
    images: [
      {
        url: '/images/og-default.jpg',
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} Printable Classroom Resources`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.name} - Free Printable Resources for Educators`,
    description: siteConfig.description,
    images: ['/images/og-default.jpg'],
  },
  other: {
    // Only include p:domain_verify if a real token is provided (Item 12)
    ...(siteConfig.pinterest.verificationToken && siteConfig.pinterest.verificationToken.trim() !== ''
      ? { 'p:domain_verify': siteConfig.pinterest.verificationToken }
      : {}),
    'pinterest-rich-pin': 'true',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentSiteUrl = getSiteUrl();

  const orgSchema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.legalName,
    url: currentSiteUrl,
    logo: `${currentSiteUrl}/images/og-default.jpg`,
  };

  // Only add sameAs if Pinterest url is configured (Item 12)
  if (siteConfig.pinterest.url && siteConfig.pinterest.url.trim() !== '') {
    orgSchema.sameAs = [siteConfig.pinterest.url];
  }

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    url: currentSiteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${currentSiteUrl}/worksheets?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  const isRealAdSense =
    siteConfig.adsense.enabled &&
    siteConfig.adsense.client &&
    !siteConfig.adsense.client.startsWith('ca-pub-XXX') &&
    siteConfig.adsense.client.trim() !== '';

  return (
    <html lang="en" className="h-full scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        {/* Google AdSense CMP Script - only loaded when real AdSense client ID is active (Item 11) */}
        {isRealAdSense && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${siteConfig.adsense.client}`}
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body className="min-h-full flex flex-col bg-white text-slate-800 antialiased selection:bg-[#2E6B6B] selection:text-white">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
