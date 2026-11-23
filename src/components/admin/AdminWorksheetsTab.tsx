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
  Plus,
  Layers,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

interface AdminWorksheetsTabProps {
  worksheets: Worksheet[];
  onCreateNew: () => void;
  onEdit: (ws: Worksheet) => void;
  onDeleted: (slug: string, message: string) => void;
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

export function AdminWorksheetsTab({
  worksheets,
  onCreateNew,
  onEdit,
  onDeleted,
}: AdminWorksheetsTabProps) {
  const [query, setQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return worksheets.filter((w) => {
      if (subjectFilter && w.subject !== subjectFilter) return false;
      if (q) {
        return (
          w.title.toLowerCase().includes(q) ||
          w.slug.toLowerCase().includes(q) ||
          w.keywords.some((k) => k.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [worksheets, query, subjectFilter]);

  const handleDelete = async (ws: Worksheet) => {
    const confirmed = window.confirm(
      `Delete "${ws.title}"?\n\nThis removes its entry from worksheets.json and deletes its PDF and preview files.`
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
        setErrorMsg(data.error || 'Delete failed.');
      } else {
        const msg =
          data.commit?.mode === 'neon'
            ? 'Worksheet deleted from Neon Postgres and site updated live.'
            : data.commit?.mode === 'github'
            ? `Deleted & committed to GitHub (${data.commit.commitSha?.slice(0, 7)}) — Vercel rebuild started.`
            : 'Worksheet deleted from local repository.';
        onDeleted(ws.slug, msg);
      }
    } catch {
      setErrorMsg('Network error deleting worksheet.');
    } finally {
      setDeletingSlug(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 font-heading">
            Worksheet Library ({worksheets.length})
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Inspect SEO health, download generated Pinterest Pins, edit metadata, or remove printables.
          </p>
        </div>
        <button
          type="button"
          onClick={onCreateNew}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2E6B6B] hover:bg-[#235353] text-white text-xs font-bold shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add New PDF</span>
        </button>
      </div>

      {errorMsg && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Search & Subject Filter */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter by title, slug, or keyword..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#2E6B6B]"
          />
        </div>
        <select
          value={subjectFilter}
          onChange={(e) => setSubjectFilter(e.target.value)}
          className="px-3 py-2 text-xs font-semibold rounded-xl bg-slate-50 border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#2E6B6B]"
        >
          <option value="">All Subjects</option>
          {subjects.map((sub) => (
            <option key={sub.slug} value={sub.slug}>
              {sub.shortTitle}
            </option>
          ))}
        </select>
      </div>

      {/* Table / Cards */}
      <div className="space-y-3">
        {filtered.map((ws) => {
          const seo = getSeoCompleteness(ws);
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
                      {ws.subjectName}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                      <Layers className="w-3 h-3" /> {ws.pages}p · {ws.pdfFileSize}
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
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 truncate">{ws.title}</h3>
                  <p className="text-[11px] font-mono text-slate-400 truncate">
                    /worksheets/{ws.slug}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 shrink-0 w-full md:w-auto justify-end">
                <Link
                  href={`/worksheets/${ws.slug}`}
                  target="_blank"
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>View</span>
                </Link>

                {ws.pinterestPinImage && (
                  <a
                    href={ws.pinterestPinImage}
                    download={`${ws.slug}-pinterest-pin.jpg`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold border border-red-200/70"
                    title="Download vertical Pinterest Pin image"
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
                  <span>Edit</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(ws)}
                  disabled={deletingSlug === ws.slug}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold border border-rose-200 disabled:opacity-50"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{deletingSlug === ws.slug ? 'Deleting...' : 'Delete'}</span>
                </button>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="py-12 text-center bg-white border border-slate-200 rounded-2xl text-xs text-slate-500">
            No worksheets match your search or filter.
          </div>
        )}
      </div>
    </div>
  );
}
