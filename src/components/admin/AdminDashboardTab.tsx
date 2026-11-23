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
  RefreshCw,
  Activity,
  Users,
  Clock,
  ArrowUpRight,
} from 'lucide-react';

interface AdminDashboardTabProps {
  worksheets: Worksheet[];
  settings: SiteSettings | null;
  requests: WorksheetRequest[];
  stats: CollectionStats | null;
  storage: StorageInfo | null;
  analytics: AdminAnalyticsSummary | null;
  onRefresh?: () => void;
  refreshing?: boolean;
  onNavigateTab: (tab: AdminTabId) => void;
}

const SUBJECT_TR: Record<string, string> = {
  alphabet: 'Alfabe (Alphabet)',
  phonics: 'Fonik / Ses Bilgisi (Phonics)',
  'numbers-counting': 'Sayılar ve Sayma (Numbers & Counting)',
  'shapes-colors': 'Şekiller ve Renkler (Shapes & Colors)',
  vocabulary: 'Kelime Bilgisi (Vocabulary)',
  'thinking-skills': 'Düşünme Becerileri (Thinking Skills)',
};

export function AdminDashboardTab({
  worksheets,
  settings,
  requests,
  stats,
  storage,
  analytics,
  onRefresh,
  refreshing,
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
      label: '15+ Özgün PDF Çalışma Kağıdı Yayında',
      detail: `${worksheets.length} / 15 yayınlandı (AdSense başvurusu öncesi önerilen: ${Math.max(0, 15 - worksheets.length)} adet kaldı)`,
      ok: hasMinimumLibrary,
      actionTab: 'upload' as AdminTabId,
      actionLabel: 'PDF Ekle',
    },
    {
      label: 'En Az Bir Ana Konu İndekslenebilir Durumda (≥ 6 kağıt)',
      detail: `${stats?.indexedSubjects || 0} / 6 konu Google & sitemap.xml için indekslenebilir`,
      ok: (stats?.indexedSubjects || 0) >= 1,
      actionTab: 'upload' as AdminTabId,
      actionLabel: 'Konu Büyüt',
    },
    {
      label: 'Gerçek Eğitmen / Yazar Profili (E-E-A-T)',
      detail: hasCustomAuthor
        ? `Yazar: ${settings?.author.name}`
        : 'Hala varsayılan "KinderESL Teaching Team" şablonu kullanılıyor',
      ok: hasCustomAuthor,
      actionTab: 'settings' as AdminTabId,
      actionLabel: 'Profili Düzenle',
    },
    {
      label: 'Gerçek İletişim E-postası Tanımlı',
      detail: hasRealEmail
        ? settings!.contactEmail
        : 'Ayarlar bölümünden veya NEXT_PUBLIC_CONTACT_EMAIL ile iletişim e-postası ekleyin',
      ok: hasRealEmail,
      actionTab: 'settings' as AdminTabId,
      actionLabel: 'E-posta Ekle',
    },
    {
      label: 'Yasal Sayfalar (/privacy-policy, /terms, /cookie-policy) ve /ads.txt Aktif',
      detail: 'Dinamik /ads.txt uç noktası ve CMP uyumlu yasal metinler çalışıyor',
      ok: true,
    },
    {
      label: 'AdSense Yayıncı Kimliği (Publisher ID) Bağlı',
      detail: hasAdsenseClient
        ? `${settings?.adsense.client} (${settings?.adsense.enabled ? 'Aktif' : 'Kapalı / Gizli Mod'})`
        : 'Onay bekleniyor (Onaylanana kadar boş reklam kutuları gizli tutulur)',
      ok: hasAdsenseClient,
      actionTab: 'monetization' as AdminTabId,
      actionLabel: 'Reklam Ayarları',
    },
  ];

  const traffic = analytics?.traffic;
  const maxDailyViews = Math.max(
    1,
    ...(traffic?.dailyVisits?.map((d) => d.views) || [0])
  );

  return (
    <div className="space-y-8">
      {/* Üst Başlık ve Hızlı İşlem */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 font-heading">
            Müfredat ve Büyüme Özeti
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Koleksiyon indekslenebilirliğini, öğretmen taleplerini, site trafiğini ve AdSense onay hazırlığını buradan takip edin.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              disabled={refreshing}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 hover:border-[#2E6B6B] text-slate-700 text-xs font-bold shadow-xs transition-colors disabled:opacity-60"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
              <span>{refreshing ? 'Yenileniyor...' : 'Yenile'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => onNavigateTab('upload')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2E6B6B] hover:bg-[#235353] text-white text-xs font-bold shadow-xs transition-colors"
          >
            <Upload className="w-4 h-4" />
            <span>Yeni PDF Çalışma Kağıdı Yükle</span>
          </button>
        </div>
      </div>

      {/* Bağlantı Durumu Şeridi: Neon Postgres + Cloudflare R2 */}
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
            Neon Postgres: {storage?.database === 'neon' ? 'Bağlı' : 'Yerel JSON Yedeği'}
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
              ? 'Bağlı'
              : storage?.assetStorage === 'local'
              ? 'Kurulum bekliyor (yerel disk)'
              : 'Kurulum bekliyor'}
          </span>
        </span>
      </div>

      {/* KPI Kartları */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-1.5">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Çalışma Kağıtları</span>
            <FileText className="w-4 h-4 text-[#2E6B6B]" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900">{stats?.totalWorksheets ?? worksheets.length}</p>
          <p className="text-[11px] text-slate-500">{stats?.totalPages ?? 0} toplam yazdırılabilir sayfa</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-1.5">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Gerçek PDF İndirmeleri</span>
            <Download className="w-4 h-4 text-sky-600" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900">{analytics?.totalDownloads ?? 0}</p>
          <p className="text-[11px] text-slate-500">
            Neon veritabanında anonim sayaç
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-1.5">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Site Ziyaretleri</span>
            <Activity className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900">{traffic?.todayPageViews ?? 0}</p>
          <p className="text-[11px] text-slate-500">
            bugün · {traffic?.totalPageViews ?? 0} toplam görüntüleme
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-1.5">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Tekil Ziyaretçi (30g)</span>
            <Users className="w-4 h-4 text-teal-600" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900">{traffic?.uniqueSessions30d ?? 0}</p>
          <p className="text-[11px] text-slate-500">
            oturum · ort. {traffic?.avgDurationSec ?? 0} sn kalış
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-1.5">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>İndekslenen Kategoriler (≥6)</span>
            <Globe className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900">{totalIndexableHubs}</p>
          <p className="text-[11px] text-slate-500">
            SEO eşiğini geçen konu/tema/ay sayısı
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigateTab('requests')}
          className="bg-white border border-slate-200 hover:border-[#2E6B6B] rounded-2xl p-5 space-y-1.5 text-left transition-colors"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Öğretmen İstekleri</span>
            <Inbox className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900">{newRequestsCount}</p>
          <p className="text-[11px] text-slate-500">{requests.length} toplam talep sırada</p>
        </button>
      </div>

      {/* İki Sütun: Konu İndeksleme + AdSense Hazırlığı */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Konu SEO İndeksleme */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 font-heading">
                Konu İndeksleme İlerlemesi
              </h2>
              <p className="text-[11px] text-slate-500">
                Kategoriler 6 çalışma kağıdına ulaşınca <code className="font-mono">noindex</code>&apos;ten{' '}
                <code className="font-mono">index</code>&apos;e geçer.
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
                    <span className="font-bold text-slate-800">
                      {SUBJECT_TR[sub.slug] || sub.title}
                    </span>
                    <span
                      className={`font-semibold ${
                        sub.indexed ? 'text-emerald-700' : 'text-slate-500'
                      }`}
                    >
                      {sub.count} / 6{' '}
                      {sub.indexed ? '(İndekslendi ✓)' : `(indeks için ${sub.remainingForIndex} adet daha)`}
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

        {/* AdSense Yayın Kontrol Listesi */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 font-heading">
                AdSense ve Yayın Hazırlığı
              </h2>
              <p className="text-[11px] text-slate-500">
                Başvuru öncesi politika sinyallerinin otomatik kontrolü.
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

      {/* Canlı Analitik Satırı: En Çok İndirilenler & Öğretmen Aramaları */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 font-heading">
                En Çok İndirilen Çalışma Kağıtları
              </h2>
              <p className="text-[11px] text-slate-500">
                Anonim olarak takip edilen gerçek öğretmen ve veli PDF indirmeleri.
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
                    <p className="text-[11px] text-slate-500">{SUBJECT_TR[item.subject] || item.subject}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-sky-100 text-sky-800 font-extrabold shrink-0">
                    {item.downloads}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 py-6 text-center">
              Henüz Neon veritabanında kayıtlı indirme yok.
            </p>
          )}
        </section>

        <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 font-heading">
                Öğretmen Katalog Aramaları
              </h2>
              <p className="text-[11px] text-slate-500">
                Sonuç bulunamayan aramalar sıradaki yüksek talepli PDF konularını gösterir.
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
                        {item.zeroResults} sonuçsuz
                      </span>
                    )}
                  </div>
                  <span className="text-slate-600 font-bold shrink-0">{item.count}×</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 py-6 text-center">
              Henüz arama kaydı yok.
            </p>
          )}
        </section>
      </div>

      {/* Site Trafiği: Giriş, Çıkış ve Kaynak Analizi */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 font-heading">
              Site Trafiği: Giriş, Çıkış ve Kaynak Analizi
            </h2>
            <p className="text-[11px] text-slate-500">
              Çerez kullanmadan Neon veritabanında tutulan anonim ziyaret, sayfa kalış süresi ve yönlendirme özeti (botlar hariç).
            </p>
          </div>
          <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-600">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200">
              <Users className="w-3.5 h-3.5 text-[#2E6B6B]" />
              Bugün {traffic?.todaySessions ?? 0} oturum
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200">
              <Clock className="w-3.5 h-3.5 text-indigo-600" />
              Ort. {traffic?.avgDurationSec ?? 0} sn
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Son 7 Gün Ziyaretleri */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Son 7 Gün Ziyaretleri
            </h3>
            {traffic && traffic.dailyVisits.length > 0 ? (
              <div className="space-y-2.5">
                {traffic.dailyVisits.map((day) => {
                  const widthPct = Math.max(8, Math.round((day.views / maxDailyViews) * 100));
                  return (
                    <div key={day.date} className="space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-semibold text-slate-700">{day.date}</span>
                        <span className="text-[11px] text-slate-600 font-bold">
                          {day.views} giriş · {day.sessions} oturum
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-indigo-500"
                          style={{ width: `${widthPct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-slate-500 py-4">Henüz günlük ziyaret verisi yok.</p>
            )}
          </div>

          {/* En Çok Ziyaret Edilen ve Çıkış Yapılan Sayfalar */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              En Çok Ziyaret ve Çıkış Alan Sayfalar (30g)
            </h3>
            {traffic && traffic.topPages.length > 0 ? (
              <div className="space-y-2">
                {traffic.topPages.map((pg) => (
                  <div
                    key={pg.path}
                    className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs"
                  >
                    <span className="font-mono text-slate-800 truncate">{pg.path}</span>
                    <div className="flex items-center gap-2 shrink-0 text-[11px]">
                      <span className="font-bold text-indigo-700">{pg.views} giriş</span>
                      <span className="text-slate-400">·</span>
                      <span className="text-slate-600">{pg.exits} çıkış</span>
                      <span className="text-slate-400">·</span>
                      <span className="text-slate-500">{pg.avgDurationSec}s</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 py-4">Henüz sayfa ziyareti kaydedilmedi.</p>
            )}
          </div>

          {/* Trafik Kaynakları */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Trafik Kaynakları (30g)
            </h3>
            {traffic && traffic.topReferrers.length > 0 ? (
              <div className="space-y-2">
                {traffic.topReferrers.map((ref) => (
                  <div
                    key={ref.source}
                    className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs"
                  >
                    <span className="inline-flex items-center gap-1.5 font-semibold text-slate-800 truncate">
                      <ArrowUpRight className="w-3.5 h-3.5 text-[#2E6B6B] shrink-0" />
                      <span className="truncate">{ref.source}</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-teal-50 text-[#2E6B6B] font-extrabold shrink-0">
                      {ref.views}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 py-4">Henüz yönlendirme kaynağı verisi yok.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
