'use client';

import React, { useMemo, useState } from 'react';
import { subjects } from '@/data/subjects';
import type { WorksheetRequest, WorksheetSubject } from '@/types/worksheet';
import type { RequestPrefillDraft } from './admin-types';
import { Inbox, Trash2, Sparkles, Mail, Clock, AlertCircle } from 'lucide-react';

interface AdminRequestsTabProps {
  requests: WorksheetRequest[];
  onUpdated: (nextList: WorksheetRequest[], message: string) => void;
  onDraftFromRequest: (draft: RequestPrefillDraft) => void;
}

const STATUS_LABELS: Record<'all' | WorksheetRequest['status'], string> = {
  all: 'Tümü',
  new: 'Yeni',
  planned: 'Planlandı',
  done: 'Tamamlandı',
};

export function AdminRequestsTab({
  requests,
  onUpdated,
  onDraftFromRequest,
}: AdminRequestsTabProps) {
  const [statusFilter, setStatusFilter] = useState<'all' | WorksheetRequest['status']>('all');
  const [busyId, setBusyId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (statusFilter === 'all') return requests;
    return requests.filter((r) => r.status === statusFilter);
  }, [requests, statusFilter]);

  const handleStatusChange = async (id: string, status: WorksheetRequest['status']) => {
    setBusyId(id);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/admin/requests', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'İstek güncellenemedi.');
      } else {
        onUpdated(data.requests, `İstek "${STATUS_LABELS[status]}" olarak işaretlendi.`);
      }
    } catch {
      setErrorMsg('İstek güncellenirken ağ hatası oluştu.');
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (id: string) => {
    setBusyId(id);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/admin/requests', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, delete: true }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'İstek silinemedi.');
      } else {
        onUpdated(data.requests, 'İstek listeden kaldırıldı.');
      }
    } catch {
      setErrorMsg('İstek silinirken ağ hatası oluştu.');
    } finally {
      setBusyId(null);
    }
  };

  const handleCreateDraft = (req: WorksheetRequest) => {
    const matchedSubject =
      subjects.find(
        (s) =>
          s.shortTitle.toLowerCase() === req.subject.toLowerCase() ||
          s.slug === req.subject.toLowerCase()
      )?.slug || 'alphabet';

    onDraftFromRequest({
      subject: matchedSubject as WorksheetSubject,
      titleHint: req.topic,
      ages: req.ageGroup.replace(/\s*\(.*?\)/, ''),
      skillHint: req.details,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 font-heading">
            Öğretmen İstek Kutusu ({requests.length})
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Sitedeki /contact iletişim sayfasından gönderilen sınıf içi materyal talepleri.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-white border border-slate-200 p-1 rounded-xl text-xs font-semibold">
          {(['all', 'new', 'planned', 'done'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                statusFilter === tab
                  ? 'bg-[#2E6B6B] text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {STATUS_LABELS[tab]}
            </button>
          ))}
        </div>
      </div>

      {errorMsg && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl py-16 px-6 text-center space-y-2">
          <Inbox className="w-8 h-8 text-slate-300 mx-auto" />
          <p className="text-sm font-bold text-slate-700">Bu görünümde çalışma kağıdı isteği yok</p>
          <p className="text-xs text-slate-500">
            /contact sayfasından gönderilen öğretmen talepleri burada otomatik olarak listelenir.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((req) => (
            <div
              key={req.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase ${
                        req.status === 'new'
                          ? 'bg-amber-100 text-amber-800'
                          : req.status === 'planned'
                          ? 'bg-sky-100 text-sky-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {STATUS_LABELS[req.status]}
                    </span>
                    <span className="text-xs font-bold text-[#2E6B6B] bg-[#F0F7F7] px-2.5 py-0.5 rounded-full">
                      {req.subject}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">{req.ageGroup}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{req.topic}</h3>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={req.status}
                    disabled={busyId === req.id}
                    onChange={(e) =>
                      handleStatusChange(req.id, e.target.value as WorksheetRequest['status'])
                    }
                    className="px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 bg-slate-50"
                  >
                    <option value="new">Yeni</option>
                    <option value="planned">Planlandı</option>
                    <option value="done">Tamamlandı</option>
                  </select>

                  <button
                    type="button"
                    onClick={() => handleCreateDraft(req)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#2E6B6B] hover:bg-[#235353] text-white text-xs font-bold"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Taslak Oluştur</span>
                  </button>

                  <button
                    type="button"
                    disabled={busyId === req.id}
                    onClick={() => handleDelete(req.id)}
                    aria-label="İsteği sil"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                {req.details}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500">
                <span>
                  Talep eden: <strong>{req.name}</strong> ({req.role})
                </span>
                {req.email && (
                  <a
                    href={`mailto:${req.email}`}
                    className="inline-flex items-center gap-1 text-[#2E6B6B] font-semibold hover:underline"
                  >
                    <Mail className="w-3 h-3" />
                    <span>{req.email}</span>
                  </a>
                )}
                <span className="inline-flex items-center gap-1 ml-auto">
                  <Clock className="w-3 h-3" />
                  {new Date(req.createdAt).toLocaleDateString('tr-TR', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
