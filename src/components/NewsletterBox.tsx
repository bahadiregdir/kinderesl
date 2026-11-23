'use client';

import React, { useState } from 'react';
import { Mail, CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';

interface NewsletterBoxProps {
  source: string;
  compact?: boolean;
}

export function NewsletterBox({ source, compact = false }: NewsletterBoxProps) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'teacher' | 'parent' | 'homeschooler'>('teacher');
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{
    type: 'ok' | 'already' | 'err';
    text: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitting(true);
    setStatus(null);

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          role,
          source,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setStatus({
          type: 'err',
          text: data.error || 'Please check your email address and try again.',
        });
      } else if (data.alreadySubscribed) {
        setStatus({
          type: 'already',
          text: "You're already on the list! Watch your inbox for our next weekly printable pack.",
        });
      } else {
        setEmail('');
        setStatus({
          type: 'ok',
          text: "You're in! Your email is saved for our weekly free preschool & ESL printable theme packs.",
        });
      }
    } catch {
      setStatus({
        type: 'err',
        text: 'Network error while saving your email. Please try again.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      className={`rounded-2xl border border-[#cde1e1] bg-gradient-to-br from-[#F0F7F7] via-white to-[#F7FAFA] ${
        compact ? 'p-5 sm:p-6' : 'p-6 sm:p-8 lg:p-10'
      }`}
      aria-label="Weekly Free Theme Pack Newsletter"
    >
      <div className="max-w-3xl mx-auto space-y-5">
        <div className="space-y-2 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#d0e3e3] text-[11px] font-extrabold tracking-wider uppercase text-[#2E6B6B]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>FREE WEEKLY THEME PACK</span>
          </div>
          <h3
            className={`font-extrabold text-slate-900 font-heading tracking-tight ${
              compact ? 'text-xl sm:text-2xl' : 'text-2xl sm:text-3xl'
            }`}
          >
            Get a Free Printable Theme Pack Every Week
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Join ESL &amp; preschool teachers receiving new seasonal worksheets, flashcards, and classroom-ready PDFs (US Letter &amp; A4). No spam — unsubscribe anytime.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address..."
                aria-label="Email address"
                className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-[#2E6B6B]"
              />
            </div>

            <select
              value={role}
              onChange={(e) =>
                setRole(e.target.value as 'teacher' | 'parent' | 'homeschooler')
              }
              aria-label="Your role"
              className="px-3.5 py-3 text-xs sm:text-sm font-semibold rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-[#2E6B6B]"
            >
              <option value="teacher">ESL / Preschool Teacher</option>
              <option value="parent">Parent</option>
              <option value="homeschooler">Homeschooler</option>
            </select>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#2E6B6B] hover:bg-[#235353] text-white text-xs sm:text-sm font-bold shadow-xs transition-colors shrink-0 disabled:opacity-60"
            >
              <span>{submitting ? 'Joining...' : 'Send Me Free Packs'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {status && (
            <div
              role="status"
              className={`flex items-start gap-2 p-3 rounded-xl border text-xs font-semibold ${
                status.type === 'err'
                  ? 'bg-rose-50 border-rose-200 text-rose-800'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-800'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{status.text}</span>
            </div>
          )}
        </form>
      </div>
    </section>
  );
}
