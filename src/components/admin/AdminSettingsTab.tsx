'use client';

import React, { useState } from 'react';
import type { SiteSettings } from '@/types/worksheet';
import type { StorageInfo } from '@/lib/cms-storage';
import {
  Save,
  UserCheck,
  Mail,
  BarChart3,
  Share2,
  Plus,
  X,
  CheckCircle2,
  AlertCircle,
  KeyRound,
} from 'lucide-react';

interface AdminSettingsTabProps {
  settings: SiteSettings;
  storage: StorageInfo | null;
  onSaved: (next: SiteSettings, message: string) => void;
}

export function AdminSettingsTab({ settings, storage, onSaved }: AdminSettingsTabProps) {
  const [authorName, setAuthorName] = useState(settings.author.name);
  const [authorRole, setAuthorRole] = useState(settings.author.role);
  const [shortBio, setShortBio] = useState(settings.author.shortBio);
  const [fullBio, setFullBio] = useState(settings.author.fullBio);
  const [credentials, setCredentials] = useState<string[]>(settings.author.credentials || []);
  const [newCred, setNewCred] = useState('');

  const [contactEmail, setContactEmail] = useState(settings.contactEmail || '');
  const [pinterestHandle, setPinterestHandle] = useState(settings.pinterest.handle || '');
  const [pinterestUrl, setPinterestUrl] = useState(settings.pinterest.url || '');
  const [pinterestToken, setPinterestToken] = useState(
    settings.pinterest.verificationToken || ''
  );
  const [ga4Id, setGa4Id] = useState(settings.analytics?.ga4MeasurementId || '');

  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const addCredential = () => {
    const val = newCred.trim();
    if (!val) return;
    setCredentials((prev) => [...prev, val]);
    setNewCred('');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);

    const updated: SiteSettings = {
      ...settings,
      author: {
        ...settings.author,
        name: authorName.trim(),
        role: authorRole.trim(),
        shortBio: shortBio.trim(),
        fullBio: fullBio.trim(),
        credentials,
      },
      contactEmail: contactEmail.trim(),
      pinterest: {
        handle: pinterestHandle.trim(),
        url: pinterestUrl.trim(),
        verificationToken: pinterestToken.trim(),
      },
      analytics: {
        ga4MeasurementId: ga4Id.trim(),
      },
    };

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'Could not save settings.');
      } else {
        const msg =
          data.commit?.mode === 'neon'
            ? 'Site settings saved to Neon Postgres and revalidated live.'
            : data.commit?.mode === 'github'
            ? `Settings committed (${data.commit.commitSha?.slice(0, 7)}) — Vercel rebuild started.`
            : 'Site settings saved to src/data/site-settings.json.';
        onSaved(data.settings, msg);
      }
    } catch {
      setErrorMsg('Network error saving settings.');
    } finally {
      setSaving(false);
    }
  };

  const envItems = [
    {
      name: 'DATABASE_URL',
      ok: storage?.envStatus.hasDatabaseUrl ?? false,
      note: 'Neon Postgres connection string for worksheets, requests, settings & analytics',
    },
    {
      name: 'R2_ACCOUNT_ID / R2_* Keys',
      ok: storage?.envStatus.hasR2Config ?? false,
      note: 'Cloudflare R2 credentials + R2_PUBLIC_URL (https://cdn.kinderesl.com)',
    },
    {
      name: 'ADMIN_PASSWORD',
      ok: storage?.envStatus.hasAdminPassword ?? false,
      note: 'Required in Vercel production to enable /admin login',
    },
    {
      name: 'NEXT_PUBLIC_SITE_URL',
      ok: storage?.envStatus.hasSiteUrl ?? false,
      note: 'Canonical site domain (https://kinderesl.com)',
    },
    {
      name: 'ENABLE_DOMAIN_REDIRECT',
      ok: storage?.envStatus.enableDomainRedirect ?? false,
      note: 'Redirects old kinderesl.vercel.app links to kinderesl.com (301)',
    },
    {
      name: 'GITHUB_TOKEN',
      ok: storage?.envStatus.hasGithubToken ?? false,
      note: 'Optional legacy fallback (not needed when Neon + R2 are active)',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 font-heading">
          Author Profile, Contact &amp; Integrations
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Configure your E-E-A-T educator profile, inbox address, Pinterest verification, and GA4 tracking.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {errorMsg && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Author E-E-A-T Section */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <UserCheck className="w-4 h-4 text-[#2E6B6B]" />
            <h2 className="text-base font-bold text-slate-900 font-heading">
              Author Profile (About &amp; Author Box)
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Author Display Name
              </label>
              <input
                type="text"
                required
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#2E6B6B]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Educator Title / Role
              </label>
              <input
                type="text"
                required
                value={authorRole}
                onChange={(e) => setAuthorRole(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#2E6B6B]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Short Bio (Compact cards &amp; sidebar)
            </label>
            <textarea
              rows={2}
              value={shortBio}
              onChange={(e) => setShortBio(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#2E6B6B]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Full Bio (About page &amp; expanded author box)
            </label>
            <textarea
              rows={3}
              value={fullBio}
              onChange={(e) => setFullBio(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#2E6B6B]"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700">
              Verified Teaching Focus Badges (no exaggerated claims)
            </label>
            <div className="flex flex-wrap gap-2">
              {credentials.map((cred, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F0F7F7] border border-[#d0e3e3] text-xs font-semibold text-[#2E6B6B]"
                >
                  <span>{cred}</span>
                  <button
                    type="button"
                    onClick={() => setCredentials((prev) => prev.filter((_, i) => i !== idx))}
                    className="hover:text-rose-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newCred}
                onChange={(e) => setNewCred(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addCredential();
                  }
                }}
                placeholder="Add real credential or focus area..."
                className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50"
              />
              <button
                type="button"
                onClick={addCredential}
                className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>
          </div>
        </section>

        {/* Contact, Pinterest & GA4 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Mail className="w-4 h-4 text-[#2E6B6B]" />
              <h2 className="text-base font-bold text-slate-900 font-heading">
                Contact &amp; Analytics
              </h2>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Public Contact Email (/contact &amp; legal pages)
              </label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="hello@kinderesl.com"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#2E6B6B]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <BarChart3 className="w-3.5 h-3.5 text-[#2E6B6B]" />
                <span>Google Analytics 4 ID (Privacy-Safe, No Ad Signals)</span>
              </label>
              <input
                type="text"
                value={ga4Id}
                onChange={(e) => setGa4Id(e.target.value)}
                placeholder="G-XXXXXXXXXX"
                className="w-full px-3.5 py-2.5 text-sm font-mono rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#2E6B6B]"
              />
            </div>
          </section>

          <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Share2 className="w-4 h-4 text-red-600" />
              <h2 className="text-base font-bold text-slate-900 font-heading">
                Pinterest Integration
              </h2>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Pinterest Handle
              </label>
              <input
                type="text"
                value={pinterestHandle}
                onChange={(e) => setPinterestHandle(e.target.value)}
                placeholder="@kinderesl"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Pinterest Profile URL (Schema.org sameAs)
              </label>
              <input
                type="url"
                value={pinterestUrl}
                onChange={(e) => setPinterestUrl(e.target.value)}
                placeholder="https://www.pinterest.com/kinderesl"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Domain Verification Token (p:domain_verify)
              </label>
              <input
                type="text"
                value={pinterestToken}
                onChange={(e) => setPinterestToken(e.target.value)}
                placeholder="Paste Pinterest meta content token..."
                className="w-full px-3.5 py-2.5 text-sm font-mono rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
              />
            </div>
          </section>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2E6B6B] hover:bg-[#235353] text-white text-xs sm:text-sm font-bold shadow-xs transition-colors disabled:opacity-60"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Site Settings'}</span>
          </button>
        </div>
      </form>

      {/* Read-only Env Variable Status */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <KeyRound className="w-4 h-4 text-[#2E6B6B]" />
          <h2 className="text-base font-bold text-slate-900 font-heading">
            Server Environment Variables Status (Masked)
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {envItems.map((env) => (
            <div
              key={env.name}
              className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 flex items-start gap-2.5"
            >
              {env.ok ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
              )}
              <div>
                <p className="text-xs font-mono font-bold text-slate-900">{env.name}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{env.note}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
