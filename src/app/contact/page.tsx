import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { WorksheetRequestForm } from '@/components/WorksheetRequestForm';
import { siteConfig, getSiteUrl } from '@/config/site';
import { Mail, MessageSquare, Clock, ShieldCheck } from 'lucide-react';

const siteUrl = getSiteUrl();
const pageUrl = `${siteUrl}/contact`;

export const metadata: Metadata = {
  title: 'Contact Us & Educator Resource Requests',
  description:
    'Have a suggestion for a preschool or kindergarten worksheet? Contact the KinderESL team directly via email for teacher resource requests and feedback.',
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    title: 'Contact Us & Educator Resource Requests',
    description:
      'Contact the KinderESL curriculum team directly via email for early childhood printable suggestions and inquiries.',
    url: pageUrl,
    type: 'website',
  },
};

export default function ContactPage() {
  return (
    <>
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: 'Contact & Requests' }]} />
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#2E6B6B] bg-[#F0F7F7] px-2.5 py-1 rounded mb-3">
            <Mail className="w-3.5 h-3.5" />
            <span>Teacher &amp; Parent Inquiries</span>
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            Get in Touch with KinderESL
          </h1>
          <p className="text-base text-slate-600 leading-relaxed max-w-xl mx-auto">
            We love hearing from preschool teachers, kindergarten educators, and homeschooling families. Send us your printable requests, feedback, or curriculum suggestions directly.
          </p>
        </div>

        {/* Request a Worksheet Interactive Form */}
        <div className="mb-8">
          <WorksheetRequestForm />
        </div>

        {/* Email Direct Contact Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 shadow-sm space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-xl bg-[#F0F7F7] border border-[#d0e3e3]">
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#2E6B6B]">
                Direct Educator Inbox
              </span>
              <h2 className="text-xl font-bold text-slate-900 break-all">
                {siteConfig.contactEmail}
              </h2>
              <p className="text-xs text-slate-600">
                For printable requests, bug reports, and copyright inquiries.
              </p>
            </div>
            <a
              href={`mailto:${siteConfig.contactEmail}?subject=KinderESL%20Teacher%20Inquiry`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#2E6B6B] hover:bg-[#225151] text-white text-xs font-bold shadow-xs transition-colors shrink-0"
            >
              <Mail className="w-4 h-4" />
              <span>Send Email</span>
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-slate-600">
            <div className="space-y-2 p-4 rounded-lg bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-1.5 font-bold text-slate-900 text-sm">
                <Clock className="w-4 h-4 text-[#2E6B6B]" />
                <span>Response Time</span>
              </div>
              <p className="leading-relaxed">
                We review emails regularly and strive to respond to educator questions within 24 to 48 business hours.
              </p>
            </div>

            <div className="space-y-2 p-4 rounded-lg bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-1.5 font-bold text-slate-900 text-sm">
                <MessageSquare className="w-4 h-4 text-[#2E6B6B]" />
                <span>Custom Printable Requests</span>
              </div>
              <p className="leading-relaxed">
                Need a specific letter tracing sheet, seasonal theme, or ESL vocabulary unit? Tell us what grade and theme you teach!
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#2E6B6B]" />
              <span>Your email will never be shared or used for spam.</span>
            </span>
            <span className="font-semibold text-slate-700">kinderesl.com</span>
          </div>
        </div>
      </div>
    </>
  );
}
