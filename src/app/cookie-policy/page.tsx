import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { siteConfig, getSiteUrl } from '@/config/site';
import { DEFAULT_OG_IMAGE, buildSeoDescription } from '@/lib/seo-meta';
import { Cookie } from 'lucide-react';

const siteUrl = getSiteUrl();
const pageUrl = `${siteUrl}/cookie-policy`;
const pageDescription = buildSeoDescription(
  `Cookie Policy for ${siteConfig.name}. Explains the types of cookies we use and how teachers and parents can control preferences.`
);

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description: pageDescription,
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    title: 'Cookie Policy',
    description: pageDescription,
    url: pageUrl,
    type: 'website',
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cookie Policy',
    description: pageDescription,
    images: [DEFAULT_OG_IMAGE.url],
  },
};

export default function CookiePolicyPage() {
  return (
    <>
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: 'Cookie Policy' }]} />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        <header className="mb-8 pb-6 border-b border-slate-200">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#2E6B6B] bg-[#F0F7F7] px-2.5 py-1 rounded mb-3">
            <Cookie className="w-3.5 h-3.5" />
            <span>Cookie Transparency</span>
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
            Cookie Policy
          </h1>
          <p className="text-xs text-slate-600">
            Last Updated: November 2026
          </p>
        </header>

        <div className="prose prose-slate max-w-none text-sm leading-relaxed space-y-6 text-slate-700">
          <p>
            This Cookie Policy explains how KinderESL (&quot;we&quot;, &quot;us&quot;, and &quot;our&quot;) uses cookies and similar technologies when you visit our website at <a href="https://kinderesl.com" className="text-[#2E6B6B] underline">kinderesl.com</a>.
          </p>

          <section>
            <h2 className="text-xl font-bold text-slate-900">1. What Are Cookies?</h2>
            <p>
              Cookies are small data files placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners in order to make their websites work, or to work more efficiently, as well as to provide reporting information.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900">2. Categories of Cookies We Use</h2>
            <div className="space-y-4">
              <div className="bg-white border border-slate-200 p-4 rounded-lg">
                <h3 className="font-bold text-slate-900 text-sm mb-1">
                  A. Strictly Necessary / Essential Cookies
                </h3>
                <p className="text-xs text-slate-600">
                  These cookies are essential for you to browse the website and download PDF documents securely.
                </p>
              </div>

              <div className="bg-white border border-slate-200 p-4 rounded-lg">
                <h3 className="font-bold text-slate-900 text-sm mb-1">
                  B. Performance &amp; Analytics Cookies
                </h3>
                <p className="text-xs text-slate-600">
                  These cookies allow us to count visits and traffic sources so we can measure and improve the speed and usability of our learning resources. All information collected is aggregated and anonymous.
                </p>
              </div>

              <div className="bg-white border border-slate-200 p-4 rounded-lg">
                <h3 className="font-bold text-slate-900 text-sm mb-1">
                  C. Advertising &amp; Sponsor Cookies (Google AdSense)
                </h3>
                <p className="text-xs text-slate-600">
                  These cookies may be set by Google AdSense to deliver non-intrusive advertisements that support our free educational printable model. When advertising is enabled, consent will be collected through a Google-certified Consent Management Platform.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900">3. How Can You Control Cookies?</h2>
            <p>
              You can set or amend your web browser controls to accept or refuse cookies. If you choose to reject cookies, you may still use our website and download PDF files without restriction.
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
