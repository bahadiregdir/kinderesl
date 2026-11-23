'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import type { SiteSettings, Worksheet, WorksheetRequest } from '@/types/worksheet';
import type { StorageInfo } from '@/lib/cms-storage';
import type {
  AdminAnalyticsSummary,
  AdminTabId,
  CollectionStats,
  NewsletterSubscriber,
  RequestPrefillDraft,
} from './admin-types';
import { AdminDashboardTab } from './AdminDashboardTab';
import { AdminWorksheetsTab } from './AdminWorksheetsTab';
import { AdminUploadForm } from './AdminUploadForm';
import { AdminRequestsTab } from './AdminRequestsTab';
import { AdminMonetizationTab } from './AdminMonetizationTab';
import { AdminSettingsTab } from './AdminSettingsTab';
import {
  LayoutDashboard,
  FileText,
  Upload,
  Inbox,
  Megaphone,
  Settings,
  LogOut,
  Lock,
  BookOpen,
  ExternalLink,
  Eye,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export function AdminStudio() {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [passwordConfigured, setPasswordConfigured] = useState(true);
  const [isDevDefaultPassword, setIsDevDefaultPassword] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loggingIn, setLoggingIn] = useState(false);

  const [activeTab, setActiveTab] = useState<AdminTabId>('dashboard');
  const [loadingData, setLoadingData] = useState(false);
  const [toast, setToast] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  const [worksheets, setWorksheets] = useState<Worksheet[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [requests, setRequests] = useState<WorksheetRequest[]>([]);
  const [stats, setStats] = useState<CollectionStats | null>(null);
  const [storage, setStorage] = useState<StorageInfo | null>(null);
  const [analytics, setAnalytics] = useState<AdminAnalyticsSummary | null>(null);
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);

  const [editingWorksheet, setEditingWorksheet] = useState<Worksheet | null>(null);
  const [prefillDraft, setPrefillDraft] = useState<RequestPrefillDraft | null>(null);

  const showToast = (type: 'ok' | 'err', text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 6000);
  };

  const loadAllCmsData = useCallback(async () => {
    setLoadingData(true);
    try {
      const [wsRes, setRes, reqRes, subRes] = await Promise.all([
        fetch('/api/admin/worksheets', { cache: 'no-store' }),
        fetch('/api/admin/settings', { cache: 'no-store' }),
        fetch('/api/admin/requests', { cache: 'no-store' }),
        fetch('/api/admin/subscribers', { cache: 'no-store' }),
      ]);

      if (wsRes.ok) {
        const wsData = await wsRes.json();
        setWorksheets(wsData.worksheets || []);
        setStats(wsData.stats || null);
        if (wsData.analytics) setAnalytics(wsData.analytics);
        if (wsData.storage) setStorage(wsData.storage);
      }
      if (setRes.ok) {
        const setData = await setRes.json();
        setSettings(setData.settings || null);
      }
      if (reqRes.ok) {
        const reqData = await reqRes.json();
        setRequests(reqData.requests || []);
      }
      if (subRes.ok) {
        const subData = await subRes.json();
        setSubscribers(subData.subscribers || []);
      }
    } catch {
      showToast('err', 'CMS verileri yenilenemedi.');
    } finally {
      setLoadingData(false);
    }
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/admin/auth', { cache: 'no-store' });
        const data = await res.json();
        setAuthenticated(Boolean(data.authenticated));
        setPasswordConfigured(data.passwordConfigured !== false);
        setIsDevDefaultPassword(Boolean(data.isDevDefaultPassword));
        if (data.storage) setStorage(data.storage);
        if (data.authenticated) {
          await loadAllCmsData();
        }
      } catch {
        setLoginError('Yetkilendirme sunucusuna ulaşılamadı.');
      } finally {
        setCheckingAuth(false);
      }
    })();
  }, [loadAllCmsData]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoggingIn(true);
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput }),
      });
      const data = await res.json();
      if (!res.ok) {
        setLoginError(data.error || 'Giriş başarısız.');
      } else {
        setAuthenticated(true);
        setPasswordInput('');
        if (data.storage) setStorage(data.storage);
        await loadAllCmsData();
      }
    } catch {
      setLoginError('Giriş sırasında ağ hatası oluştu.');
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    setAuthenticated(false);
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-sm font-semibold text-slate-500">
        KinderESL Yönetim Paneli yükleniyor...
      </div>
    );
  }

  // Yetkisiz Giriş Ekranı
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F0F7F7] via-white to-slate-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-[#2E6B6B] text-white flex items-center justify-center mx-auto shadow-sm">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-extrabold text-slate-900 font-heading">
              KinderESL Yönetim Paneli
            </h1>
            <p className="text-xs text-slate-500">
              PDF çalışma kağıtları yüklemek, Pinterest Pini oluşturmak, AdSense ve SEO ayarlarını yönetmek için giriş yapın.
            </p>
          </div>

          {!passwordConfigured ? (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1.5">
              <p className="font-bold">Üretim Girişi Kilitli</p>
              <p>
                Yönetim Panelinin kilidini açmak için Vercel Proje Environment Variables ayarlarına{' '}
                <code className="font-mono bg-white px-1 rounded">ADMIN_PASSWORD</code> değerini ekleyip projeyi yeniden deploy edin.
              </p>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              {isDevDefaultPassword && (
                <div className="p-3 rounded-xl bg-[#F0F7F7] border border-[#d0e3e3] text-[11px] text-[#2E6B6B] font-medium">
                  Geliştirme varsayılan şifresi aktif: <code className="font-mono font-bold">kinderesl-dev</code>
                </div>
              )}

              {loginError && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Yönetici Şifresi
                </label>
                <input
                  type="password"
                  required
                  autoFocus
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Yönetici şifresini girin..."
                  className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#2E6B6B]"
                />
              </div>

              <button
                type="submit"
                disabled={loggingIn}
                className="w-full py-3 rounded-xl bg-[#2E6B6B] hover:bg-[#235353] text-white text-sm font-bold shadow-xs transition-colors disabled:opacity-60"
              >
                {loggingIn ? 'Giriş yapılıyor...' : 'Panele Giriş Yap'}
              </button>
            </form>
          )}

          <div className="pt-2 border-t border-slate-100 text-center">
            <Link href="/" className="text-xs font-semibold text-slate-500 hover:text-[#2E6B6B]">
              ← kinderesl.com sitesine dön
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const newReqCount = requests.filter((r) => r.status === 'new').length;

  const navItems: Array<{
    id: AdminTabId;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
  }> = [
    { id: 'dashboard', label: 'Genel Bakış', icon: LayoutDashboard },
    { id: 'worksheets', label: 'Çalışma Kağıtları', icon: FileText, badge: worksheets.length },
    { id: 'upload', label: editingWorksheet ? 'Çalışmayı Düzenle' : '+ PDF Yükle', icon: Upload },
    { id: 'requests', label: 'İstekler', icon: Inbox, badge: newReqCount || undefined },
    { id: 'monetization', label: 'Reklam / AdSense', icon: Megaphone },
    { id: 'settings', label: 'Ayarlar', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
      {/* Sidebar */}
      <aside className="w-full lg:w-64 bg-slate-900 text-slate-200 flex flex-col shrink-0">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between lg:justify-start gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#2E6B6B] flex items-center justify-center text-white">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <span className="text-base font-extrabold text-white block leading-tight">
                KinderESL
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400">
                Yönetim Paneli
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            aria-label="Çıkış Yap"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        {/* Nav Links */}
        <nav className="p-3 flex lg:flex-col gap-1 overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  if (item.id === 'upload' && activeTab !== 'upload') {
                    setEditingWorksheet(null);
                    setPrefillDraft(null);
                  }
                  setActiveTab(item.id);
                }}
                className={`flex items-center justify-between gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                  active
                    ? 'bg-[#2E6B6B] text-white shadow-xs'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </span>
                {typeof item.badge === 'number' && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                      active ? 'bg-white/20 text-white' : 'bg-slate-800 text-teal-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Alt Depolama Durumu & Dış Bağlantılar */}
        <div className="mt-auto p-4 border-t border-slate-800 space-y-2.5 hidden lg:block">
          <div className="px-3 py-2.5 rounded-xl bg-slate-800/80 text-[11px] space-y-1">
            <div>
              <span className="text-slate-400 block">Veritabanı</span>
              <span className="font-bold text-emerald-300 block">
                {storage?.database === 'neon' ? 'Neon Postgres (Canlı)' : 'Yerel JSON'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block">PDF &amp; Görsel Depolama</span>
              <span className="font-bold text-teal-300 block">
                {storage?.assetStorage === 'r2'
                  ? 'Cloudflare R2 (CDN)'
                  : storage?.assetStorage === 'local'
                  ? 'Yerel Disk (R2 Bekliyor)'
                  : 'R2 Kurulumu Bekliyor'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-1.5 text-[11px]">
            <Link
              href="/"
              target="_blank"
              className="flex items-center justify-center gap-1 py-2 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold"
            >
              <span>Canlı Site</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
            <Link
              href="/?adpreview=1"
              target="_blank"
              className="flex items-center justify-center gap-1 py-2 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-teal-300 font-semibold"
            >
              <Eye className="w-3 h-3" />
              <span>Reklam Haritası</span>
            </Link>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-bold transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Çıkış Yap</span>
          </button>
        </div>
      </aside>

      {/* Main Workspace */}
      <div className="flex-1 min-w-0 p-4 sm:p-8 lg:p-10 max-w-7xl">
        {toast && (
          <div
            role="status"
            className={`mb-6 p-4 rounded-2xl border flex items-center justify-between gap-3 text-xs font-bold shadow-xs ${
              toast.type === 'ok'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}
          >
            <span className="flex items-center gap-2">
              {toast.type === 'ok' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0" />
              )}
              <span>{toast.text}</span>
            </span>
          </div>
        )}

        {loadingData && !stats ? (
          <div className="py-20 text-center text-sm text-slate-500">Panel verileri yükleniyor...</div>
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <AdminDashboardTab
                worksheets={worksheets}
                settings={settings}
                requests={requests}
                stats={stats}
                storage={storage}
                analytics={analytics}
                subscribers={subscribers}
                onRefresh={loadAllCmsData}
                refreshing={loadingData}
                onNavigateTab={(tab) => {
                  if (tab === 'upload') {
                    setEditingWorksheet(null);
                    setPrefillDraft(null);
                  }
                  setActiveTab(tab);
                }}
              />
            )}

            {activeTab === 'worksheets' && (
              <AdminWorksheetsTab
                worksheets={worksheets}
                onCreateNew={() => {
                  setEditingWorksheet(null);
                  setPrefillDraft(null);
                  setActiveTab('upload');
                }}
                onEdit={(ws) => {
                  setEditingWorksheet(ws);
                  setPrefillDraft(null);
                  setActiveTab('upload');
                }}
                onDeleted={async (_slug, msg) => {
                  showToast('ok', msg);
                  await loadAllCmsData();
                }}
              />
            )}

            {activeTab === 'upload' && (
              <AdminUploadForm
                key={editingWorksheet?.slug || prefillDraft?.titleHint || 'new-upload'}
                editingWorksheet={editingWorksheet}
                existingWorksheets={worksheets}
                prefillDraft={prefillDraft}
                onCancel={() => {
                  setEditingWorksheet(null);
                  setPrefillDraft(null);
                  setActiveTab('worksheets');
                }}
                onPublished={async (_ws, msg) => {
                  showToast('ok', msg);
                  setEditingWorksheet(null);
                  setPrefillDraft(null);
                  await loadAllCmsData();
                  setActiveTab('worksheets');
                }}
              />
            )}

            {activeTab === 'requests' && (
              <AdminRequestsTab
                requests={requests}
                onUpdated={(nextList, msg) => {
                  setRequests(nextList);
                  showToast('ok', msg);
                }}
                onDraftFromRequest={(draft) => {
                  setEditingWorksheet(null);
                  setPrefillDraft(draft);
                  setActiveTab('upload');
                }}
              />
            )}

            {activeTab === 'monetization' && settings && (
              <AdminMonetizationTab
                settings={settings}
                onSaved={(next, msg) => {
                  setSettings(next);
                  showToast('ok', msg);
                }}
              />
            )}

            {activeTab === 'settings' && settings && (
              <AdminSettingsTab
                settings={settings}
                storage={storage}
                onSaved={(next, msg) => {
                  setSettings(next);
                  showToast('ok', msg);
                }}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
