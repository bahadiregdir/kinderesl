'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';

export function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('kinderesl_cookie_consent');
    if (!consent) {
      // Small timeout to prevent layout shift on first frame
      const timer = setTimeout(() => setShow(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('kinderesl_cookie_consent', 'accepted');
    setShow(false);
  };

  const handleDecline = () => {
    localStorage.setItem('kinderesl_cookie_consent', 'essential_only');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div
      role="region"
      aria-label="Cookie consent banner"
      className="fixed bottom-0 inset-x-0 z-50 p-4 sm:p-6 bg-slate-900/95 backdrop-blur-md text-white border-t border-slate-800 shadow-2xl animate-fade-in"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3 text-xs text-slate-300 max-w-3xl leading-relaxed">
          <ShieldCheck className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-white mb-1">
              Privacy &amp; Cookie Notice for Educators &amp; Parents
            </p>
            <p>
              KinderESL uses essential cookies and privacy-respecting analytics to ensure reliable PDF downloads and optimize our teaching resources. Third-party advertising partners (such as Google AdSense) may serve non-personalized ads in accordance with GDPR and COPPA regulations.{' '}
              <Link href="/privacy-policy" className="underline hover:text-teal-300">
                Privacy Policy
              </Link>{' '}
              and{' '}
              <Link href="/cookie-policy" className="underline hover:text-teal-300">
                Cookie Policy
              </Link>.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto shrink-0">
          <button
            type="button"
            onClick={handleDecline}
            className="flex-1 md:flex-initial px-4 py-2 text-xs font-semibold rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            Essential Only
          </button>
          <button
            type="button"
            onClick={handleAccept}
            className="flex-1 md:flex-initial px-4 py-2 text-xs font-bold rounded-lg bg-[#2E6B6B] hover:bg-teal-700 text-white shadow-sm transition-colors"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
}
