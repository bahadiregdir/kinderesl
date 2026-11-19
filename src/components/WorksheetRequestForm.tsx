'use client';

import React, { useState } from 'react';
import { subjects } from '@/data/subjects';
import { siteConfig } from '@/config/site';
import { Send, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

export function WorksheetRequestForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Preschool Teacher');
  const [ageGroup, setAgeGroup] = useState('Ages 3–5');
  const [subject, setSubject] = useState(subjects[0]?.shortTitle || 'Alphabet');
  const [topic, setTopic] = useState('');
  const [details, setDetails] = useState('');
  const [website, setWebsite] = useState(''); // Honeypot

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [result, setResult] = useState<{ saved: boolean; fallbackEmail?: boolean } | null>(
    null
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSubmitting(true);

    try {
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          role,
          ageGroup,
          subject,
          topic,
          details,
          website,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'Could not submit your request. Please try again.');
      } else {
        setResult({ saved: Boolean(data.saved), fallbackEmail: Boolean(data.fallbackEmail) });
        setName('');
        setEmail('');
        setTopic('');
        setDetails('');
      }
    } catch {
      setErrorMsg('Network error. Please use our direct email inbox below.');
    } finally {
      setSubmitting(false);
    }
  };

  if (result) {
    return (
      <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-6 sm:p-8 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 font-heading">
          {result.saved
            ? 'Thank you! Your worksheet request has been logged.'
            : 'Thank you for your suggestion!'}
        </h2>
        <p className="text-sm text-slate-600 max-w-md mx-auto">
          {result.fallbackEmail
            ? `Our direct request queue is currently in email-only mode. Please also forward urgent classroom requests to ${siteConfig.contactEmail}.`
            : 'Our curriculum team reviews teacher and parent requests weekly when planning upcoming printable packs.'}
        </p>
        <button
          type="button"
          onClick={() => setResult(null)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-emerald-300 text-xs font-bold text-emerald-800 hover:bg-emerald-100/60 transition-colors"
        >
          Submit another request
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-5"
    >
      <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[#2E6B6B]">
            <Sparkles className="w-3.5 h-3.5 text-[#F2B544]" />
            <span>Request a Custom Printable</span>
          </span>
          <h2 className="text-xl font-bold text-slate-900 font-heading mt-1">
            Tell Us What You Need for Class
          </h2>
        </div>
      </div>

      {/* Honeypot field invisible to human users */}
      <input
        type="text"
        name="website"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      {errorMsg && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Your Name *
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Sarah Miller"
            className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#2E6B6B]"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Email (Optional, to notify when published)
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="teacher@school.edu"
            className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#2E6B6B]"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Your Role *
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#2E6B6B]"
          >
            <option value="Preschool Teacher">Preschool Teacher</option>
            <option value="Kindergarten Teacher">Kindergarten Teacher</option>
            <option value="ESL / ELL Educator">ESL / ELL Educator</option>
            <option value="Homeschool Parent">Homeschool Parent</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Target Age Group *
          </label>
          <select
            value={ageGroup}
            onChange={(e) => setAgeGroup(e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#2E6B6B]"
          >
            <option value="Ages 3–4">Ages 3–4 (Early Pre-K)</option>
            <option value="Ages 3–5">Ages 3–5 (Preschool &amp; Pre-K)</option>
            <option value="Ages 4–6">Ages 4–6 (Kindergarten)</option>
            <option value="Mixed Early Years">Mixed Early Years</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Subject Domain *
          </label>
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#2E6B6B]"
          >
            {subjects.map((sub) => (
              <option key={sub.slug} value={sub.shortTitle}>
                {sub.shortTitle}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Requested Topic / Skill *
          </label>
          <input
            type="text"
            required
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Letter B Bumblebee, Numbers 6–10"
            className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#2E6B6B]"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1.5">
          Classroom Activity Details *
        </label>
        <textarea
          required
          rows={3}
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          placeholder="Tell us what activities help your students most (tracing lines, cut-and-paste, initial sounds, ESL picture labels)..."
          className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#2E6B6B]"
        />
      </div>

      <div className="flex items-center justify-between gap-4 pt-1">
        <span className="text-[11px] text-slate-500">
          Submitted directly to the KinderESL Educator Queue
        </span>
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2E6B6B] hover:bg-[#235353] text-white text-xs sm:text-sm font-bold shadow-xs transition-all disabled:opacity-60"
        >
          <Send className="w-4 h-4" />
          <span>{submitting ? 'Sending...' : 'Submit Worksheet Request'}</span>
        </button>
      </div>
    </form>
  );
}
