import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { siteConfig } from '@/config/site';
import { ShieldCheck, Lock, Eye, FileText } from 'lucide-react';

export const metadata: Metadata = {
  title: `Privacy Policy | ${siteConfig.name}`,
  description: `Privacy Policy for ${siteConfig.name}. Explains our data collection practices, adult teacher/parent target audience, COPPA compliance, and AdSense disclosures.`,
  alternates: {
    canonical: `${siteConfig.url}/privacy-policy`,
  },
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: 'Privacy Policy' }]} />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        <header className="mb-8 pb-6 border-b border-slate-200">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#2E6B6B] bg-[#F0F7F7] px-2.5 py-1 rounded mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Compliance &amp; Data Transparency</span>
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
            Privacy Policy
          </h1>
          <p className="text-xs text-slate-500">
            Last Updated: February 2025 · Effective Date: January 1, 2025
          </p>
        </header>

        <div className="prose prose-slate max-w-none text-sm leading-relaxed space-y-6 text-slate-700">
          <section className="bg-[#F0F7F7] border border-[#d0e3e3] p-5 rounded-xl text-slate-800 font-medium">
            <h2 className="text-base font-bold text-[#2E6B6B] mt-0 mb-2 flex items-center gap-2">
              <Lock className="w-4 h-4" />
              <span>Crucial Notice: Site Audience &amp; COPPA Compliance</span>
            </h2>
            <p className="text-xs sm:text-sm mb-0">
              KinderESL.com is an educational publishing resource intended strictly for adult educators, school teachers, curriculum coordinators, and parents. <strong>This website is NOT directed to children under the age of 13</strong> in compliance with the Children’s Online Privacy Protection Act (COPPA), GDPR, and international privacy standards. All PDF downloads and instructional materials are designed for adults to print and administer in classroom or home learning environments. We do not knowingly collect personal information from children under 13.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900">1. Information We Collect</h2>
            <p>
              When you browse KinderESL.com, we may collect standard non-personally identifiable log information:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Browser type, device specifications, operating system, and screen resolution.</li>
              <li>Referral URLs, pages visited, time spent on pages, and PDF download interactions.</li>
              <li>Internet Protocol (IP) addresses anonymized for general diagnostic and geographical analytics.</li>
              <li>Information you voluntarily submit via our Contact Form (such as name, email address, and teacher message).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900">2. Cookies and Third-Party Advertising (Google AdSense)</h2>
            <p>
              KinderESL.com uses cookies to improve website functionality, remember educator preferences, and serve non-intrusive advertisements that fund our free educational printables.
            </p>
            <p>
              <strong>Google AdSense &amp; Third-Party Vendors:</strong> Google, as a third-party vendor, uses cookies to serve ads on our site. Google’s use of advertising cookies enables it and its partners to serve ads to our adult users based on their visit to our site and/or other sites on the Internet.
            </p>
            <p>
              Users in the European Economic Area (EEA), United Kingdom (UK), and California may manage their consent preferences via our Cookie Consent banner at any time. You may also opt out of personalized advertising by visiting Google Ads Settings (<a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-[#2E6B6B] underline">adssettings.google.com</a>) or www.aboutads.info.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900">3. Analytics and Performance</h2>
            <p>
              We may utilize privacy-conscious web analytics tools to analyze aggregate website traffic, optimize Core Web Vitals, and assess popular curriculum themes. These tools do not profile individual children or link analytical data to personal identities.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900">4. Your Data Protection Rights (GDPR / CCPA)</h2>
            <p>
              Depending on your location, you hold legal rights regarding your personal data:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Right to Access:</strong> Request copies of any personal data we hold about you.</li>
              <li><strong>Right to Rectification:</strong> Request correction of inaccurate information.</li>
              <li><strong>Right to Erasure:</strong> Request deletion of your contact form messages or stored records.</li>
              <li><strong>Right to Opt-Out:</strong> Decline non-essential cookies via our consent management tool.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900">5. Contact Information</h2>
            <p>
              If you have any questions or privacy inquiries regarding our educational resource platform, please contact us at:
            </p>
            <p className="font-semibold text-slate-900">
              KinderESL Educational Resources<br />
              Email: privacy@kinderesl.com<br />
              Website: <a href="https://kinderesl.com/contact" className="text-[#2E6B6B] underline">kinderesl.com/contact</a>
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
