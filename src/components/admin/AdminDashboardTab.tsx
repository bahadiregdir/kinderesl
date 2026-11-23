'use client';

import React from 'react';
import type { SiteSettings, Worksheet, WorksheetRequest } from '@/types/worksheet';
import type { StorageInfo } from '@/lib/cms-storage';
import type {
  AdminAnalyticsSummary,
  AdminTabId,
  CollectionStats,
} from './admin-types';
import {
  FileText,
  Layers,
  Globe,
  Inbox,
  CheckCircle2,
  AlertTriangle,
  Megaphone,
  Upload,
  ExternalLink,
  HardDrive,
  Download,
  Search,
  Database,
} from 'lucide-react';

interface AdminDashboardTabProps {
  worksheets: Worksheet[];
  settings: SiteSettings | null;
  requests: WorksheetRequest[];
  stats: CollectionStats | null;
  storage: StorageInfo | null;
  analytics: AdminAnalyticsSummary | null;
  onNavigateTab: (tab: AdminTabId) => void;
}

export function AdminDashboardTab({
  worksheets,
  settings,
  requests,
  stats,
  storage,
  analytics,
  onNavigateTab,
}: AdminDashboardTabProps) {
  const newRequestsCount = requests.filter((r) => r.status === 'new').length;
  const totalIndexableHubs =
    (stats?.indexedSubjects || 0) +
    (stats?.indexedTopics || 0) +
    (stats?.indexedMonths || 0);

  const hasCustomAuthor =
    Boolean(settings?.author?.name) && settings?.author?.name !== 'KinderESL Teaching Team';
  const hasRealEmail =
    Boolean(settings?.contactEmail) &&
    !settings?.contactEmail.includes('BURAYA') &&
    settings?.contactEmail.includes('@');
  const hasAdsenseClient = Boolean(settings?.adsense?.client?.startsWith('ca-pub-'));
  const hasMinimumLibrary = worksheets.length >= 15;

  const readinessChecks = [
    {
      label: '15+ Original PDF Worksheets Published',
      detail: `${worksheets.length} / 15 published (${Math.max(0, 15 - worksheets.length)} more recommended before AdSense application)`,
      ok: hasMinimumLibrary,
      actionTab: 'upload' as AdminTabId,
      actionLabel: 'Add PDF',
    },
    {
      label: 'At Least One Subject Collection Indexed (>= 6 sheets)',
      detail: `${stats?.indexedSubjects || 0} / 6 subjects indexable in Google & sitemap.xml`,
      ok: (stats?.indexedSubjects || 0) >= 1,
      actionTab: 'upload' as AdminTabId,
      actionLabel: 'Grow a Subject',
    },
    {
      label: 'Real Educator Author Profile (E-E-A-T)',
      detail: hasCustomAuthor
        ? `Author: ${settings?.author.name}`
        : 'Still using default "KinderESL Teaching Team" template',
      ok: hasCustomAuthor,
      actionTab: 'settings' as AdminTabId,
      actionLabel: 'Edit Profile',
    },
    {
      label: 'Real Contact Email Configured',
      detail: hasRealEmail
        ? settings!.contactEmail
        : 'Set contact email in Settings or NEXT_PUBLIC_CONTACT_EMAIL',
      ok: hasRealEmail,
      actionTab: 'settings' as AdminTabId,
      actionLabel: 'Set Email',
    },
    {
      label: 'Legal Pages (/privacy-policy, /terms, /cookie-policy) & /ads.txt Live',
      detail: 'Dynamic /ads.txt endpoint and CMP-ready disclosures active',
      ok: true,
    },
    {
      label: 'AdSense Publisher ID Connected',
      detail: hasAdsenseClient
        ? `${settings?.adsense.client} (${settings?.adsense.enabled ? 'Active' : 'Disabled / Stealth'})`
        : 'Pending approval (Stealth mode hides empty boxes until approved)',
      ok: hasAdsenseClient,
      actionTab: 'monetization' as AdminTabId,
      actionLabel: 'Monetization',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 font-heading">
            Curriculum &amp; Growth Overview
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Monitor collection indexability, educator requests, and AdSense approval readiness.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigateTab('upload')}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2E6B6B] hover:bg-[#235353] text-white text-xs font-bold shadow-xs transition-colors"
        >
          <Upload className="w-4 h-4" />
          <span>Upload New PDF Worksheet</span>
        </button>
      </div>

      {/* Connection Status Strip: Neon Postgres + Cloudflare R2 */}
      <div className="flex flex-wrap items-center gap-2.5 text-xs">
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold border ${
            storage?.database === 'neon'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-amber-50 text-amber-800 border-amber-200'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>
            Neon Postgres: {storage?.database === 'neon' ? 'Connected' : 'Local JSON Fallback'}
          </span>
        </span>

        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold border ${
            storage?.assetStorage === 'r2'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-amber-50 text-amber-800 border-amber-200'
          }`}
        >
          <HardDrive className="w-3.5 h-3.5" />
          <span>
            Cloudflare R2:{' '}
            {storage?.assetStorage === 'r2'
              ? 'Connected'
              : storage?.assetStorage === 'local'
              ? 'Pending setup (using local disk)'
              : 'Pending setup'}
          </span>
        </span>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-1.5">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Worksheets</span>
            <FileText className="w-4 h-4 text-[#2E6B6B]" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900">{stats?.totalWorksheets ?? worksheets.length}</p>
          <p className="text-[11px] text-slate-500">{stats?.totalPages ?? 0} total printable pages</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-1.5">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Real PDF Downloads</span>
            <Download className="w-4 h-4 text-sky-600" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900">{analytics?.totalDownloads ?? 0}</p>
          <p className="text-[11px] text-slate-500">
            Anonymous download counter in Neon DB
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-1.5">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Indexed Hubs (&gt;=6)</span>
            <Globe className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900">{totalIndexableHubs}</p>
          <p className="text-[11px] text-slate-500">
            Subjects/Topics/Months meeting SEO threshold
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigateTab('requests')}
          className="bg-white border border-slate-200 hover:border-[#2E6B6B] rounded-2xl p-5 space-y-1.5 text-left transition-colors"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Teacher Requests</span>
            <Inbox className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900">{newRequestsCount}</p>
          <p className="text-[11px] text-slate-500">{requests.length} total submissions in queue</p>
        </button>
      </div>

      {/* Two Column: Hub Progress + AdSense Readiness */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subject SEO Indexability */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 font-heading">
                Subject Indexability Progress
              </h2>
              <p className="text-[11px] text-slate-500">
                Hubs switch from <code className="font-mono">noindex</code> to <code className="font-mono">index</code> at 6 worksheets.
              </p>
            </div>
            <Layers className="w-4 h-4 text-[#2E6B6B]" />
          </div>

          <div className="space-y-3.5">
            {(stats?.subjectStats || []).map((sub) => {
              const pct = Math.min(100, Math.round((sub.count / 6) * 100));
              return (
                <div key={sub.slug} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800">{sub.title}</span>
                    <span
                      className={`font-semibold ${
                        sub.indexed ? 'text-emerald-700' : 'text-slate-500'
                      }`}
                    >
                      {sub.count} / 6{' '}
                      {sub.indexed ? '(Indexed ✓)' : `(${sub.remainingForIndex} more to index)`}
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        sub.indexed ? 'bg-emerald-500' : 'bg-[#2E6B6B]'
                      }`}
                      style={{ width: `${Math.max(4, pct)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* AdSense Launch Checklist */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 font-heading">
                AdSense &amp; Launch Readiness
              </h2>
              <p className="text-[11px] text-slate-500">
                Automated verification of pre-approval policy signals.
              </p>
            </div>
            <Megaphone className="w-4 h-4 text-[#2E6B6B]" />
          </div>

          <div className="space-y-2.5">
            {readinessChecks.map((chk, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-xl border flex items-start justify-between gap-3 ${
                  chk.ok
                    ? 'bg-emerald-50/50 border-emerald-200/70'
                    : 'bg-amber-50/50 border-amber-200/70'
                }`}
              >
                <div className="flex items-start gap-2.5 min-w-0">
                  {chk.ok ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                  )}
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900">{chk.label}</p>
                    <p className="text-[11px] text-slate-600 mt-0.5">{chk.detail}</p>
                  </div>
                </div>

                {chk.actionTab && (
                  <button
                    type="button"
                    onClick={() => onNavigateTab(chk.actionTab!)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-[#2E6B6B] text-[11px] font-bold text-slate-700 shrink-0"
                  >
                    <span>{chk.actionLabel}</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Live Analytics Row: Top Downloads & Teacher Searches */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 font-heading">
                Top Downloaded Printables
              </h2>
              <p className="text-[11px] text-slate-500">
                Real teacher and parent PDF downloads tracked anonymously.
              </p>
            </div>
            <Download className="w-4 h-4 text-sky-600" />
          </div>

          {analytics && analytics.topDownloaded.length > 0 ? (
            <div className="space-y-2.5">
              {analytics.topDownloaded.map((item) => (
                <div
                  key={item.slug}
                  className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs"
                >
                  <div className="min-w-0">
                    <p className="font-bold text-slate-800 truncate">{item.title}</p>
                    <p className="text-[11px] text-slate-500">{item.subject}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-sky-100 text-sky-800 font-extrabold shrink-0">
                    {item.downloads}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 py-6 text-center">
              No downloads recorded in Neon DB yet.
            </p>
          )}
        </section>

        <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 font-heading">
                Teacher Catalog Searches
              </h2>
              <p className="text-[11px] text-slate-500">
                Zero-result queries spotlight high-demand PDF topics to create next.
              </p>
            </div>
            <Search className="w-4 h-4 text-[#2E6B6B]" />
          </div>

          {analytics && analytics.topSearches.length > 0 ? (
            <div className="space-y-2">
              {analytics.topSearches.map((item) => (
                <div
                  key={item.query}
                  className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-bold text-slate-800 truncate">&ldquo;{item.query}&rdquo;</span>
                    {item.zeroResults > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold shrink-0">
                        {item.zeroResults} zero-result
                      </span>
                    )}
                  </div>
                  <span className="text-slate-600 font-bold shrink-0">{item.count}×</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 py-6 text-center">
              No search queries logged yet.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
