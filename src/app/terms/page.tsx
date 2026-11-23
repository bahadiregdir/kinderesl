import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { siteConfig, getSiteUrl } from '@/config/site';
import { DEFAULT_OG_IMAGE, buildSeoDescription } from '@/lib/seo-meta';
import { FileText, CheckCircle2, AlertCircle } from 'lucide-react';

const siteUrl = getSiteUrl();
const pageUrl = `${siteUrl}/terms`;
const pageDescription = buildSeoDescription(
  `Terms of Use for ${siteConfig.name}. Free license terms for teachers, classrooms, and homeschooling families. Commercial resale restrictions.`
);

export const metadata: Metadata = {
  title: 'Terms of Use',
  description: pageDescription,
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    title: 'Terms of Use',
    description: pageDescription,
    url: pageUrl,
    type: 'website',
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Terms of Use',
    description: pageDescription,
    images: [DEFAULT_OG_IMAGE.url],
  },
};

export default function TermsPage() {
  return (
    <>
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: 'Terms of Use' }]} />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        <header className="mb-8 pb-6 border-b border-slate-200">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#2E6B6B] bg-[#F0F7F7] px-2.5 py-1 rounded mb-3">
            <FileText className="w-3.5 h-3.5" />
            <span>Classroom License &amp; Copyright</span>
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
            Terms of Use &amp; Educational Licensing
          </h1>
          <p className="text-xs text-slate-600">
            Last Updated: November 2026
          </p>
        </header>

        <div className="prose prose-slate max-w-none text-sm leading-relaxed space-y-6 text-slate-700">
          <section className="bg-emerald-50/60 border border-emerald-200 p-5 rounded-xl text-emerald-950 font-medium">
            <h2 className="text-base font-bold text-emerald-800 mt-0 mb-2 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Summary: Free for Classroom &amp; Homeschool Use</span>
            </h2>
            <p className="text-xs sm:text-sm mb-0">
              All printable PDF files, worksheets, and teaching aids on KinderESL.com are 100% free to download and print for your personal classroom students, daycare groups, tutoring sessions, and homeschooling children.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900">1. What You CAN Do (Permitted Uses)</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Print unlimited paper copies for your students in public, private, or homeschool classrooms.</li>
              <li>Save downloaded PDF files on your computer, external drive, or classroom smartboard.</li>
              <li>Share direct links to our webpage (e.g. <code>kinderesl.com/worksheets/...</code>) with other teachers, colleagues, and parents.</li>
              <li>Display our interactive HTML5 classroom games on smartboards or school projectors during instruction.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900">2. What You CANNOT Do (Prohibited Commercial Uses)</h2>
            <div className="bg-rose-50 border border-rose-200 p-4 rounded-lg text-rose-950 text-xs sm:text-sm space-y-2">
              <div className="flex items-center gap-2 font-bold text-rose-800">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Commercial Protection Notice</span>
              </div>
              <ul className="list-disc pl-5 space-y-1 text-rose-900">
                <li>You may <strong>NOT</strong> sell, resell, bundle, or distribute our PDF files for monetary compensation (including on Teachers Pay Teachers, Etsy, Amazon, or eBay).</li>
                <li>You may <strong>NOT</strong> host our PDF files directly on external websites, cloud storage, Google Drives, or torrents without prior written authorization.</li>
                <li>You may <strong>NOT</strong> modify, alter, crop out, or remove our website brand copyright watermark (<code>KinderESL.com</code>) from printed materials.</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900">3. Disclaimer of Warranties</h2>
            <p>
              KinderESL materials are provided &quot;as is&quot; for educational enrichment. We do not guarantee specific academic test outcomes.
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
