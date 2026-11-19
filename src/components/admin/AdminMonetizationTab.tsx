'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import type { SiteSettings } from '@/types/worksheet';
import { Save, Megaphone, Eye, ExternalLink, ShieldCheck, AlertCircle } from 'lucide-react';

interface AdminMonetizationTabProps {
  settings: SiteSettings;
  onSaved: (next: SiteSettings, message: string) => void;
}

export function AdminMonetizationTab({ settings, onSaved }: AdminMonetizationTabProps) {
  const [enabled, setEnabled] = useState(settings.adsense.enabled);
  const [client, setClient] = useState(settings.adsense.client || '');
  const [inContent, setInContent] = useState(settings.adsense.slots.inContent || '');
  const [sidebar, setSidebar] = useState(settings.adsense.slots.sidebar || '');
  const [preDownload, setPreDownload] = useState(settings.adsense.slots.preDownload || '');
  const [rewardedAdEnabled, setRewardedAdEnabled] = useState(
    settings.adsense.rewardedAdEnabled !== false
  );
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const pubMatch = /^ca-(pub-\d+)$/.exec(client.trim());
  const adsTxtPreview = pubMatch
    ? `google.com, ${pubMatch[1]}, DIRECT, f08c47fec0942fa0`
    : '# KinderESL ads.txt - AdSense publisher ID pending configuration';

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);

    const updated: SiteSettings = {
      ...settings,
      adsense: {
        enabled,
        client: client.trim(),
        slots: {
          inContent: inContent.trim(),
          sidebar: sidebar.trim(),
          preDownload: preDownload.trim(),
        },
        rewardedAdEnabled,
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
        setErrorMsg(data.error || 'Could not save monetization settings.');
      } else {
        const msg =
          data.commit?.mode === 'github'
            ? `AdSense settings committed (${data.commit.commitSha?.slice(0, 7)}) — Vercel rebuild started.`
            : 'AdSense monetization settings saved.';
        onSaved(data.settings, msg);
      }
    } catch {
      setErrorMsg('Network error saving settings.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 font-heading">
          AdSense &amp; Placement Control
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          All ad slots stay completely hidden (0px) until enabled with a verified publisher ID.
        </p>
      </div>

      {/* Live Preview Launcher */}
      <div className="bg-[#F0F7F7] border border-[#d0e3e3] rounded-2xl p-5 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#2E6B6B]">
          <Eye className="w-4 h-4" />
          <span>Visual Ad Slot Inspector (?adpreview=1)</span>
        </div>
        <p className="text-xs text-slate-700 leading-relaxed">
          Want to see exactly where ads will appear on desktop and mobile before AdSense approval? Open any route below with <code className="font-mono bg-white px-1.5 py-0.5 rounded">?adpreview=1</code>:
        </p>
        <div className="flex flex-wrap gap-2.5">
          {[
            { label: 'Homepage In-Content', href: '/?adpreview=1' },
            {
              label: 'Worksheet Detail (In-Content + Sidebar + Modal)',
              href: '/worksheets/letter-a-tracing-and-phonics?adpreview=1',
            },
            { label: 'Alphabet Subject Page', href: '/worksheets/alphabet?adpreview=1' },
            { label: 'Games (Verify ZERO Ads)', href: '/games?adpreview=1' },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-bold text-[#2E6B6B] shadow-2xs"
            >
              <span>{link.label}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          ))}
        </div>
      </div>

      {/* Config Form */}
      <form
        onSubmit={handleSave}
        className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6"
      >
        {errorMsg && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div>
            <p className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-[#2E6B6B]" />
              <span>Enable Live Google AdSense</span>
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              Keep disabled until Google AdSense approves kinderesl.com.
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-300 peer-checked:bg-[#2E6B6B] rounded-full peer transition-colors after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              AdSense Publisher Client ID
            </label>
            <input
              type="text"
              value={client}
              onChange={(e) => setClient(e.target.value)}
              placeholder="ca-pub-1234567890123456"
              className="w-full px-3.5 py-2.5 text-sm font-mono rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#2E6B6B]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Slot 1: In-Content Banner ID
            </label>
            <input
              type="text"
              value={inContent}
              onChange={(e) => setInContent(e.target.value)}
              placeholder="e.g. 1234567890"
              className="w-full px-3.5 py-2.5 text-sm font-mono rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#2E6B6B]"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Homepage, Subject hubs, Topic/Month pages, &amp; Worksheet reading body
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Slot 2: Desktop Sidebar ID
            </label>
            <input
              type="text"
              value={sidebar}
              onChange={(e) => setSidebar(e.target.value)}
              placeholder="e.g. 2345678901"
              className="w-full px-3.5 py-2.5 text-sm font-mono rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#2E6B6B]"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Right column sticky sidebar below &ldquo;What&apos;s inside&rdquo;
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Slot 3: Pre-Download 3s Modal ID
            </label>
            <input
              type="text"
              value={preDownload}
              onChange={(e) => setPreDownload(e.target.value)}
              placeholder="e.g. 3456789012"
              className="w-full px-3.5 py-2.5 text-sm font-mono rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#2E6B6B]"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Shown during the 3-second &ldquo;Preparing your PDF&rdquo; countdown
            </p>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50">
            <div>
              <p className="text-xs font-bold text-slate-800">Pre-Download Countdown Hook</p>
              <p className="text-[11px] text-slate-500">3s wait screen before PDF triggers</p>
            </div>
            <input
              type="checkbox"
              checked={rewardedAdEnabled}
              onChange={(e) => setRewardedAdEnabled(e.target.checked)}
              className="w-4 h-4 accent-[#2E6B6B]"
            />
          </div>
        </div>

        {/* Live ads.txt Preview */}
        <div className="p-4 rounded-xl bg-slate-900 text-slate-200 space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-bold uppercase tracking-wider text-teal-300 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> Live /ads.txt Output
            </span>
            <Link href="/ads.txt" target="_blank" className="text-slate-400 hover:text-white underline">
              Open /ads.txt
            </Link>
          </div>
          <pre className="text-xs font-mono text-emerald-300 overflow-x-auto">{adsTxtPreview}</pre>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2E6B6B] hover:bg-[#235353] text-white text-xs sm:text-sm font-bold shadow-xs transition-colors disabled:opacity-60"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Monetization Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
