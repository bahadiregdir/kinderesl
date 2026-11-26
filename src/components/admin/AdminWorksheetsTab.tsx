'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { subjects } from '@/data/subjects';
import type { Worksheet } from '@/types/worksheet';
import {
  Search,
  Edit3,
  Trash2,
  ExternalLink,
  Download,
  Eye,
  Plus,
  Layers,
  CheckCircle2,
  AlertCircle,
  Rss,
  Copy,
  Check,
  Send,
  XCircle,
} from 'lucide-react';

interface AdminWorksheetsTabProps {
  worksheets: Worksheet[];
  onCreateNew: () => void;
  onEdit: (ws: Worksheet) => void;
  onDeleted: (slug: string, message: string) => void;
  onUpdated?: (message: string) => void;
}

function getSeoCompleteness(ws: Worksheet): { score: number; label: string } {
  let pts = 0;
  if (ws.title.length >= 25 && ws.title.length <= 75) pts += 20;
  if (ws.description.length >= 90) pts += 20;
  if (ws.vocabulary && ws.vocabulary.length >= 3) pts += 20;
  if (ws.teacherNote?.learningGoal && ws.teacherNote?.teachingTip) pts += 20;
  if (ws.faqs && ws.faqs.length >= 2) pts += 20;
  return { score: pts, label: `${pts}%` };
}

const SUBJECT_TR: Record<string, string> = {
  alphabet: 'Alfabe (Alphabet)',
  phonics: 'Fonik / Ses Bilgisi (Phonics)',
  'numbers-counting': 'Sayılar ve Sayma (Numbers & Counting)',
  'shapes-colors': 'Şekiller ve Renkler (Shapes & Colors)',
  vocabulary: 'Kelime Bilgisi (Vocabulary)',
  'thinking-skills': 'Düşünme Becerileri (Thinking Skills)',
};

export function AdminWorksheetsTab({
  worksheets,
  onCreateNew,
  onEdit,
  onDeleted,
  onUpdated,
}: AdminWorksheetsTabProps) {
  const [query, setQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');
  const [pinterestFilter, setPinterestFilter] = useState<'all' | 'rss' | 'none'>('all');
  const [sortBy, setSortBy] = useState<'default' | 'downloads' | 'views'>('default');
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);
  const [togglingSlug, setTogglingSlug] = useState<string | null>(null);
  const [copiedRss, setCopiedRss] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const rssUrl = 'https://kinderesl.com/rss.xml';
  const rssCount = useMemo(
    () => worksheets.filter((w) => w.pinterest?.autoPublish !== false).length,
    [worksheets]
  );
  const totalViews = useMemo(
    () => worksheets.reduce((sum, w) => sum + (w.viewCount ?? 0), 0),
    [worksheets]
  );
  const totalDownloads = useMemo(
    () => worksheets.reduce((sum, w) => sum + (w.downloadCount ?? 0), 0),
    [worksheets]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = worksheets.filter((w) => {
      if (subjectFilter && w.subject !== subjectFilter) return false;
      const inRss = w.pinterest?.autoPublish !== false;
      if (pinterestFilter === 'rss' && !inRss) return false;
      if (pinterestFilter === 'none' && inRss) return false;
      if (q) {
        return (
          w.title.toLowerCase().includes(q) ||
          w.slug.toLowerCase().includes(q) ||
          w.keywords.some((k) => k.toLowerCase().includes(q))
        );
      }
      return true;
    });
    if (sortBy === 'downloads') {
      return [...list].sort(
        (a, b) => (b.downloadCount ?? 0) - (a.downloadCount ?? 0) || (b.viewCount ?? 0) - (a.viewCount ?? 0)
      );
    }
    if (sortBy === 'views') {
      return [...list].sort(
        (a, b) => (b.viewCount ?? 0) - (a.viewCount ?? 0) || (b.downloadCount ?? 0) - (a.downloadCount ?? 0)
      );
    }
    return list;
  }, [worksheets, query, subjectFilter, pinterestFilter, sortBy]);

  const handleCopyRss = async () => {
    try {
      await navigator.clipboard.writeText(rssUrl);
      setCopiedRss(true);
      setTimeout(() => setCopiedRss(false), 2500);
    } catch {
      // ignore clipboard errors
    }
  };

  const handleTogglePinterest = async (ws: Worksheet) => {
    const currentlyInRss = ws.pinterest?.autoPublish !== false;
    const nextState = !currentlyInRss;
    setTogglingSlug(ws.slug);
    setErrorMsg(null);

    try {
      const res = await fetch(`/api/admin/worksheets/${encodeURIComponent(ws.slug)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pinterestAutoPublish: nextState }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'Pinterest RSS durumu güncellenemedi.');
      } else {
        const msg = nextState
          ? `"${ws.title}" Pinterest RSS beslemesine eklendi.`
          : `"${ws.title}" Pinterest RSS beslemesinden çıkarıldı.`;
        onUpdated?.(msg);
      }
    } catch {
      setErrorMsg('Pinterest RSS durumu güncellenirken ağ hatası oluştu.');
    } finally {
      setTogglingSlug(null);
    }
  };

  const handleDelete = async (ws: Worksheet) => {
    const confirmed = window.confirm(
      `"${ws.title}" çalışma kağıdı silinsin mi?\n\nBu işlem kaydı veritabanından ve PDF/önizleme dosyalarını depolamadan kalıcı olarak kaldırır.`
    );
    if (!confirmed) return;

    setDeletingSlug(ws.slug);
    setErrorMsg(null);

    try {
      const res = await fetch(`/api/admin/worksheets/${encodeURIComponent(ws.slug)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'Silme işlemi başarısız oldu.');
      } else {
        const msg =
          data.commit?.mode === 'neon'
            ? "Çalışma kağıdı Neon Postgres'ten silindi ve site canlı olarak güncellendi."
            : data.commit?.mode === 'github'
            ? `GitHub'dan silindi ve commit'lendi (${data.commit.commitSha?.slice(0, 7)}) — Vercel yeniden derleme başlatıldı.`
            : 'Çalışma kağıdı yerel depodan silindi.';
        onDeleted(ws.slug, msg);
      }
    } catch {
      setErrorMsg('Çalışma kağıdı silinirken ağ hatası oluştu.');
    } finally {
      setDeletingSlug(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 font-heading">
            Çalışma Kağıdı Kütüphanesi ({worksheets.length})
          </h1>
          <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-500">
            <span>
              SEO durumunu inceleyin, görüntülenme ve indirmeleri takip edin, Pin indirin veya düzenleyin.
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-bold border border-indigo-200/80 text-[11px]">
              <Eye className="w-3 h-3" /> {totalViews} görüntülenme
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 font-bold border border-sky-200/80 text-[11px]">
              <Download className="w-3 h-3" /> {totalDownloads} indirme
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={onCreateNew}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2E6B6B] hover:bg-[#235353] text-white text-xs font-bold shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Yeni PDF Ekle</span>
        </button>
      </div>

      {/* Pinterest Otomatik RSS Beslemesi Bilgi Çubuğu */}
      <div className="bg-[#FFF5F5] border border-red-200/80 rounded-2xl p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-red-700">
              <Rss className="w-4 h-4" />
              <span>Pinterest Otomatik RSS Beslemesi</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-white border border-red-200 text-[11px] font-bold text-red-700">
              {rssCount} / {worksheets.length} çalışma kağıdı RSS&apos;te
            </span>
          </div>
          <p className="text-[11px] text-slate-600">
            Pinterest Business → Ayarlar → Toplu Pin Oluştur (RSS Feed) alanına ekleyin:{' '}
            <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-red-100 text-slate-800">
              {rssUrl}
            </code>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleCopyRss}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-red-50 border border-red-200 text-xs font-bold text-red-700 transition-colors"
          >
            {copiedRss ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedRss ? 'Kopyalandı!' : 'RSS Linkini Kopyala'}</span>
          </button>
          <Link
            href="/rss.xml"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors"
          >
            <span>RSS&apos;i Aç</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {errorMsg && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Arama, Konu ve Pinterest Filtresi */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Başlık, slug veya anahtar kelime ile ara..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#2E6B6B]"
          />
        </div>
        <select
          value={subjectFilter}
          onChange={(e) => setSubjectFilter(e.target.value)}
          className="px-3 py-2 text-xs font-semibold rounded-xl bg-slate-50 border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#2E6B6B]"
        >
          <option value="">Tüm Konular</option>
          {subjects.map((sub) => (
            <option key={sub.slug} value={sub.slug}>
              {SUBJECT_TR[sub.slug] || sub.shortTitle}
            </option>
          ))}
        </select>
        <select
          value={pinterestFilter}
          onChange={(e) =>
            setPinterestFilter(e.target.value as 'all' | 'rss' | 'none')
          }
          className="px-3 py-2 text-xs font-semibold rounded-xl bg-slate-50 border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#2E6B6B]"
        >
          <option value="all">Tüm Pinterest Durumları</option>
          <option value="rss">RSS&apos;te (Gönderildi)</option>
          <option value="none">Gönderilmedi</option>
        </select>
        <select
          value={sortBy}
          onChange={(e) =>
            setSortBy(e.target.value as 'default' | 'downloads' | 'views')
          }
          aria-label="Çalışma kağıtlarını sırala"
          className="px-3 py-2 text-xs font-semibold rounded-xl bg-slate-50 border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#2E6B6B]"
        >
          <option value="default">Varsayılan Sıra</option>
          <option value="downloads">En Çok İndirilen</option>
          <option value="views">En Çok Görüntülenen</option>
        </select>
      </div>

      {/* Tablo / Kartlar */}
      <div className="space-y-3">
        {filtered.map((ws) => {
          const seo = getSeoCompleteness(ws);
          const inRss = ws.pinterest?.autoPublish !== false;
          return (
            <div
              key={ws.slug}
              className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-slate-300 transition-colors"
            >
              <div className="flex items-start gap-4 min-w-0 flex-1">
                <img
                  src={ws.previewImages[0]}
                  alt={ws.title}
                  className="w-16 h-20 object-contain rounded-lg border border-slate-200 bg-slate-50 shrink-0 p-1"
                />
                <div className="min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#F0F7F7] text-[#2E6B6B] border border-[#d0e3e3]">
                      {SUBJECT_TR[ws.subject] || ws.subjectName}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                      <Layers className="w-3 h-3" /> {ws.pages} s. · {ws.pdfFileSize}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        seo.score >= 80
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      SEO {seo.label}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        inRss
                          ? 'bg-red-50 text-red-700 border border-red-200/80'
                          : 'bg-slate-100 text-slate-500 border border-slate-200'
                      }`}
                    >
                      <Rss className="w-3 h-3" />
                      {inRss ? "Pinterest RSS'te ✓" : "Pinterest'e Gönderilmedi"}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/80">
                      <Eye className="w-3 h-3" />
                      {ws.viewCount ?? 0} görüntülenme
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-50 text-sky-700 border border-sky-200/80">
                      <Download className="w-3 h-3" />
                      {ws.downloadCount ?? 0} indirme
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 truncate">{ws.title}</h3>
                  <p className="text-[11px] font-mono text-slate-400 truncate">
                    /worksheets/{ws.slug}
                  </p>
                </div>
              </div>

              {/* İşlem Butonları */}
              <div className="flex flex-wrap items-center gap-2 shrink-0 w-full md:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => handleTogglePinterest(ws)}
                  disabled={togglingSlug === ws.slug}
                  className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors disabled:opacity-50 ${
                    inRss
                      ? 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200'
                      : 'bg-red-600 hover:bg-red-700 text-white border-red-600'
                  }`}
                >
                  {inRss ? (
                    <>
                      <XCircle className="w-3.5 h-3.5" />
                      <span>{togglingSlug === ws.slug ? 'İşleniyor...' : "RSS'ten Çıkar"}</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>{togglingSlug === ws.slug ? 'Gönderiliyor...' : "Pinterest'e Gönder"}</span>
                    </>
                  )}
                </button>

                <Link
                  href={`/worksheets/${ws.slug}`}
                  target="_blank"
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Görüntüle</span>
                </Link>

                {ws.pinterestPinImage && (
                  <a
                    href={ws.pinterestPinImage}
                    download={`${ws.slug}-pinterest-pin.jpg`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold border border-red-200/70"
                    title="Dikey Pinterest Pin görselini indir"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Pin JPG</span>
                  </a>
                )}

                <button
                  type="button"
                  onClick={() => onEdit(ws)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#F0F7F7] hover:bg-[#dceeee] text-[#2E6B6B] text-xs font-bold border border-[#d0e3e3]"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Düzenle</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(ws)}
                  disabled={deletingSlug === ws.slug}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold border border-rose-200 disabled:opacity-50"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{deletingSlug === ws.slug ? 'Siliniyor...' : 'Sil'}</span>
                </button>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="py-12 text-center bg-white border border-slate-200 rounded-2xl text-xs text-slate-500">
            Aramanızla veya filtrenizle eşleşen çalışma kağıdı bulunamadı.
          </div>
        )}
      </div>
    </div>
  );
}
