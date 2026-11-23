'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { subjects } from '@/data/subjects';
import { topics } from '@/data/topics';
import { months } from '@/data/months';
import {
  formatBytesLabel,
  generatePinterestPinBlob,
  renderPdfPagesToPngs,
  type RenderedPdfPage,
} from '@/lib/pdf-client-renderer';
import type {
  ActivityType,
  AgeBand,
  FAQItem,
  Worksheet,
  WorksheetSubject,
} from '@/types/worksheet';
import type { RequestPrefillDraft } from './admin-types';
import {
  Upload,
  FileText,
  Sparkles,
  Download,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Plus,
  X,
  Image as ImageIcon,
  Wand2,
  ArrowLeft,
} from 'lucide-react';

interface AdminUploadFormProps {
  editingWorksheet: Worksheet | null;
  existingWorksheets: Worksheet[];
  prefillDraft: RequestPrefillDraft | null;
  onCancel: () => void;
  onPublished: (worksheet: Worksheet, message: string, isEdit: boolean) => void;
}

const ACTIVITY_OPTIONS: Array<{ value: ActivityType; label: string }> = [
  { value: 'tracing', label: 'Tracing' },
  { value: 'coloring', label: 'Coloring' },
  { value: 'counting', label: 'Counting' },
  { value: 'matching', label: 'Matching' },
  { value: 'cut-and-paste', label: 'Cut & Paste' },
  { value: 'odd-one-out', label: 'Odd One Out' },
  { value: 'flashcards', label: 'Flashcards' },
  { value: 'dot-to-dot', label: 'Dot-to-Dot' },
  { value: 'maze', label: 'Maze' },
];

const AGE_OPTIONS: AgeBand[] = ['3-4', '4-5', '5-6'];

function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

const SUBJECT_TEMPLATES: Record<
  WorksheetSubject,
  {
    skill: string;
    skillFocus: string;
    learningGoal: string;
    teachingTip: string;
    extensionActivity: string;
    activities: ActivityType[];
  }
> = {
  alphabet: {
    skill: 'Uppercase and lowercase letter recognition, stroke order directionality, and initial phonics sound.',
    skillFocus: 'Letter formation and initial phoneme awareness.',
    learningGoal: 'Child traces target letters starting at the dot and names picture words beginning with the letter.',
    teachingTip: 'Say directional strokes aloud together while tracing before picking up a pencil (sky-writing).',
    extensionActivity: 'Circle the target letter inside a short printed classroom sentence strip.',
    activities: ['tracing', 'coloring'],
  },
  phonics: {
    skill: 'Initial sound isolation, phoneme-grapheme mapping, and early blending readiness.',
    skillFocus: 'Phonemic awareness and beginning consonant/vowel sounds.',
    learningGoal: 'Child identifies spoken words matching the target initial sound.',
    teachingTip: 'Model exaggerated mouth shapes for the target phoneme and have students repeat twice.',
    extensionActivity: 'Think of 2 extra classroom objects that share the same beginning sound.',
    activities: ['matching', 'coloring'],
  },
  'numbers-counting': {
    skill: 'One-to-one correspondence, object counting, numeral discrimination, and numeral tracing.',
    skillFocus: 'Touch counting and numeral formation.',
    learningGoal: 'Child counts items aloud one by one and writes the matching numeral.',
    teachingTip: 'Have students touch each illustration with their finger as they count aloud.',
    extensionActivity: 'Draw 1 more object next to a row and recount to preview +1 addition.',
    activities: ['counting', 'tracing'],
  },
  'shapes-colors': {
    skill: 'Geometric attribute recognition, shape tracing, and color vocabulary naming.',
    skillFocus: '2D shape identification and pre-writing curve control.',
    learningGoal: 'Child names target shapes and colors aloud while tracing boundary lines.',
    teachingTip: 'Trace shapes in the air before coloring; count sides and corners together.',
    extensionActivity: 'Go on a classroom scavenger hunt to point out real-world matches.',
    activities: ['tracing', 'coloring', 'matching'],
  },
  vocabulary: {
    skill: 'High-frequency concrete English vocabulary, oral naming, and picture association.',
    skillFocus: 'ESL listening comprehension and thematic word recall.',
    learningGoal: 'Child points to and names key vocabulary words aloud in English.',
    teachingTip: 'Pair each new word with a Total Physical Response (TPR) hand gesture.',
    extensionActivity: 'Use finished cutouts or flashcards for partner call-and-response games.',
    activities: ['matching', 'cut-and-paste'],
  },
  'thinking-skills': {
    skill: 'Visual discrimination, categorical sorting, pattern logic, and oral explanation.',
    skillFocus: 'Compare-and-contrast reasoning and attribute classification.',
    learningGoal: 'Child finds visual similarities or outliers and explains why in a short sentence.',
    teachingTip: 'Encourage students to state their reasoning aloud: "This one does not belong because..."',
    extensionActivity: 'Cut out the pictures and re-sort them into two new groups by color or size.',
    activities: ['odd-one-out', 'matching'],
  },
};

export function AdminUploadForm({
  editingWorksheet,
  existingWorksheets,
  prefillDraft,
  onCancel,
  onPublished,
}: AdminUploadFormProps) {
  const isEdit = Boolean(editingWorksheet);

  const [title, setTitle] = useState(
    editingWorksheet?.title || prefillDraft?.titleHint || ''
  );
  const [slug, setSlug] = useState(
    editingWorksheet?.slug || (prefillDraft ? slugify(prefillDraft.titleHint) : '')
  );
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [subject, setSubject] = useState<WorksheetSubject>(
    editingWorksheet?.subject || prefillDraft?.subject || 'alphabet'
  );
  const [selectedTopics, setSelectedTopics] = useState<string[]>(
    editingWorksheet?.topics || []
  );
  const [activityTypes, setActivityTypes] = useState<ActivityType[]>(
    editingWorksheet?.activityTypes || ['tracing']
  );
  const [ageBands, setAgeBands] = useState<AgeBand[]>(
    editingWorksheet?.ageBands || ['3-4', '4-5']
  );
  const [eslLevel, setEslLevel] = useState<'beginner' | 'early-reader'>(
    editingWorksheet?.eslLevel || 'beginner'
  );
  const [ages, setAges] = useState(
    editingWorksheet?.ages || prefillDraft?.ages || 'Ages 3–5'
  );
  const [gradeLevel, setGradeLevel] = useState(
    editingWorksheet?.gradeLevel || 'Pre-K & Kindergarten'
  );
  const [selectedMonths, setSelectedMonths] = useState<number[]>(
    editingWorksheet?.months || []
  );

  const [quickSummary, setQuickSummary] = useState(editingWorksheet?.quickSummary || '');
  const [description, setDescription] = useState(
    editingWorksheet?.description || prefillDraft?.skillHint || ''
  );
  const [skill, setSkill] = useState(editingWorksheet?.skill || '');

  const [skillFocus, setSkillFocus] = useState(editingWorksheet?.teacherNote?.skillFocus || '');
  const [learningGoal, setLearningGoal] = useState(
    editingWorksheet?.teacherNote?.learningGoal || ''
  );
  const [teachingTip, setTeachingTip] = useState(
    editingWorksheet?.teacherNote?.teachingTip || ''
  );
  const [extensionActivity, setExtensionActivity] = useState(
    editingWorksheet?.teacherNote?.extensionActivity || ''
  );
  const [steps, setSteps] = useState<string[]>(
    editingWorksheet?.teacherNote?.steps || ['']
  );
  const [whatsInside, setWhatsInside] = useState<string[]>(
    editingWorksheet?.whatsInside || ['']
  );

  const [vocabulary, setVocabulary] = useState<string[]>(
    editingWorksheet?.vocabulary || []
  );
  const [vocabInput, setVocabInput] = useState('');
  const [keywords, setKeywords] = useState<string[]>(editingWorksheet?.keywords || []);
  const [kwInput, setKwInput] = useState('');

  const [seriesName, setSeriesName] = useState(editingWorksheet?.series?.name || '');
  const [seriesId, setSeriesId] = useState(editingWorksheet?.series?.id || '');
  const [seriesOrder, setSeriesOrder] = useState(
    String(editingWorksheet?.series?.order || '')
  );
  const [seriesTotal, setSeriesTotal] = useState(
    String(editingWorksheet?.series?.total || '')
  );
  const [seriesPrevSlug, setSeriesPrevSlug] = useState(
    editingWorksheet?.series?.prevSlug || ''
  );
  const [seriesNextSlug, setSeriesNextSlug] = useState(
    editingWorksheet?.series?.nextSlug || ''
  );

  const [faqs, setFaqs] = useState<FAQItem[]>(
    editingWorksheet?.faqs || [{ question: '', answer: '' }]
  );

  // PDF + Rendered PNGs + Pinterest Pin state
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [renderedPages, setRenderedPages] = useState<RenderedPdfPage[]>([]);
  const [renderingPdf, setRenderingPdf] = useState(false);

  const [pinBadge, setPinBadge] = useState('FREE PRINTABLE · PRE-K & KINDERGARTEN');
  const [pinTitle, setPinTitle] = useState(editingWorksheet?.title || '');
  const [pinSubtitle, setPinSubtitle] = useState('');
  const [pinBlob, setPinBlob] = useState<Blob | null>(null);
  const [pinDataUrl, setPinDataUrl] = useState<string>(
    editingWorksheet?.pinterestPinImage || ''
  );
  const [customPinUploaded, setCustomPinUploaded] = useState(false);
  const [generatingPin, setGeneratingPin] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  const activePreviewSrcs = useMemo(() => {
    if (renderedPages.length > 0) return renderedPages.map((p) => p.dataUrl);
    return editingWorksheet?.previewImages || [];
  }, [renderedPages, editingWorksheet]);

  const effectivePages =
    renderedPages.length > 0 ? renderedPages.length : editingWorksheet?.pages || 1;

  const effectiveSizeLabel = pdfFile
    ? formatBytesLabel(pdfFile.size)
    : editingWorksheet?.pdfFileSize || '—';

  const defaultPinSub = useMemo(() => {
    const acts = activityTypes
      .slice(0, 3)
      .map((a) => a.charAt(0).toUpperCase() + a.slice(1).replace(/-/g, ' '))
      .join(' · ');
    return `${acts || 'Print · Learn'} | ${effectivePages}-page PDF`;
  }, [activityTypes, effectivePages]);

  const totalUploadBytes = useMemo(() => {
    let total = pdfFile ? pdfFile.size : 0;
    for (const p of renderedPages) total += p.blob.size;
    if (pinBlob) total += pinBlob.size;
    return total;
  }, [pdfFile, renderedPages, pinBlob]);

  useEffect(() => {
    if (!slugTouched && !isEdit) {
      setSlug(slugify(title));
    }
    if (!pinTitle && title) {
      setPinTitle(title);
    }
  }, [title, slugTouched, isEdit, pinTitle]);

  const buildPinCanvas = async (
    srcs: string[],
    customTitle?: string,
    customSub?: string,
    customBadge?: string
  ) => {
    if (srcs.length === 0) return;
    setGeneratingPin(true);
    try {
      const { blob, dataUrl } = await generatePinterestPinBlob({
        title: customTitle || pinTitle || title || 'Free Printable Worksheet',
        subtitle: customSub || pinSubtitle || defaultPinSub,
        badgeText: customBadge || pinBadge,
        pageImages: srcs,
        domainLabel: 'KinderESL.com',
      });
      setPinBlob(blob);
      setPinDataUrl(dataUrl);
      setCustomPinUploaded(false);
    } catch (err) {
      console.error(err);
    } finally {
      setGeneratingPin(false);
    }
  };

  const handlePdfSelected = async (file: File) => {
    setErrorMsg(null);
    if (file.size > 4 * 1024 * 1024) {
      setErrorMsg('Selected PDF is larger than 4 MB. Please compress it before uploading.');
      return;
    }
    setPdfFile(file);
    setRenderingPdf(true);
    try {
      const result = await renderPdfPagesToPngs(file);
      setRenderedPages(result.previews);
      const nextSub = `${activityTypes
        .slice(0, 3)
        .map((a) => a.charAt(0).toUpperCase() + a.slice(1).replace(/-/g, ' '))
        .join(' · ')} | ${result.numPages}-page PDF`;
      if (!pinSubtitle) setPinSubtitle(nextSub);
      await buildPinCanvas(
        result.previews.map((p) => p.dataUrl),
        pinTitle || title || file.name.replace(/\.pdf$/i, ''),
        pinSubtitle || nextSub,
        pinBadge
      );
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to render PDF preview pages.');
    } finally {
      setRenderingPdf(false);
    }
  };

  const handleCustomPinSelected = async (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setPinDataUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
    setPinBlob(file);
    setCustomPinUploaded(true);
  };

  const applySubjectTemplate = () => {
    const tpl = SUBJECT_TEMPLATES[subject];
    if (!skill) setSkill(tpl.skill);
    if (!skillFocus) setSkillFocus(tpl.skillFocus);
    if (!learningGoal) setLearningGoal(tpl.learningGoal);
    if (!teachingTip) setTeachingTip(tpl.teachingTip);
    if (!extensionActivity) setExtensionActivity(tpl.extensionActivity);
    setActivityTypes(tpl.activities);
    if (whatsInside.length === 1 && !whatsInside[0]) {
      setWhatsInside(
        effectivePages > 1
          ? [
              'Page 1: Guided primary learning activity with clear instructions.',
              'Page 2: Independent review and reinforcement activity.',
            ]
          : ['1-page US Letter printable PDF with high-contrast classroom illustrations.']
      );
    }
  };

  // SEO & Quality Score Checklist
  const qualityChecks = [
    { label: 'Title (25–75 chars)', ok: title.trim().length >= 25 && title.trim().length <= 75 },
    { label: 'Description (>= 90 chars)', ok: description.trim().length >= 90 },
    { label: 'PDF Attached', ok: Boolean(pdfFile || editingWorksheet?.pdfPath) },
    { label: 'PNG Previews Ready', ok: activePreviewSrcs.length > 0 },
    { label: 'Pinterest Pin Ready', ok: Boolean(pinBlob || editingWorksheet?.pinterestPinImage) },
    { label: 'Vocabulary (>= 3 English words)', ok: vocabulary.length >= 3 },
    { label: 'Teacher Goal & Tip Filled', ok: Boolean(learningGoal.trim() && teachingTip.trim()) },
    {
      label: 'FAQs (>= 2 Q&As)',
      ok: faqs.filter((f) => f.question.trim() && f.answer.trim()).length >= 2,
    },
  ];
  const scorePct = Math.round(
    (qualityChecks.filter((c) => c.ok).length / qualityChecks.length) * 100
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!isEdit && !pdfFile) {
      setErrorMsg('Please upload a PDF file first.');
      return;
    }
    if (renderedPages.length === 0 && !isEdit) {
      setErrorMsg('Please wait for the PDF pages to render into PNG previews.');
      return;
    }
    if (totalUploadBytes > 4.3 * 1024 * 1024) {
      setErrorMsg('Total payload exceeds 4.3 MB Vercel limit. Please use a smaller PDF.');
      return;
    }

    setSubmitting(true);

    const metadataPayload = {
      title: title.trim(),
      slug: slugify(slug || title),
      subject,
      topics: selectedTopics,
      activityTypes,
      ageBands,
      eslLevel,
      ages: ages.trim(),
      gradeLevel: gradeLevel.trim(),
      skill: skill.trim(),
      pages: effectivePages,
      description: description.trim(),
      quickSummary: quickSummary.trim() || description.trim(),
      whatsInside: whatsInside.map((s) => s.trim()).filter(Boolean),
      teacherNote: {
        skillFocus: skillFocus.trim() || skill.trim(),
        learningGoal: learningGoal.trim(),
        teachingTip: teachingTip.trim(),
        extensionActivity: extensionActivity.trim(),
        steps: steps.map((s) => s.trim()).filter(Boolean),
      },
      vocabulary,
      keywords,
      months: selectedMonths,
      series: seriesName.trim()
        ? {
            id: slugify(seriesId || seriesName),
            name: seriesName.trim(),
            order: Number(seriesOrder) || 1,
            ...(seriesTotal ? { total: Number(seriesTotal) } : {}),
            ...(seriesPrevSlug ? { prevSlug: slugify(seriesPrevSlug) } : {}),
            ...(seriesNextSlug ? { nextSlug: slugify(seriesNextSlug) } : {}),
          }
        : undefined,
      faqs: faqs.filter((f) => f.question.trim() && f.answer.trim()),
    };

    try {
      const formData = new FormData();
      formData.append('metadata', JSON.stringify(metadataPayload));

      if (pdfFile) {
        formData.append('pdf', pdfFile, pdfFile.name);
      }
      renderedPages.forEach((p, idx) => {
        formData.append(`preview_${idx}`, p.blob, `preview-page-${idx + 1}.png`);
      });
      if (pinBlob) {
        formData.append(
          'pinterestPin',
          pinBlob,
          customPinUploaded ? 'custom-pin.jpg' : 'pinterest-pin.jpg'
        );
      }

      const endpoint = isEdit
        ? `/api/admin/worksheets/${encodeURIComponent(editingWorksheet!.slug)}`
        : '/api/admin/worksheets';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(endpoint, { method, body: formData });
      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || 'Failed to publish worksheet.');
      } else {
        const msg =
          data.commit?.mode === 'neon'
            ? `${isEdit ? 'Updated' : 'Published'} to Neon Postgres & live immediately!`
            : data.commit?.mode === 'github'
            ? `${isEdit ? 'Updated' : 'Published'} & committed to GitHub (${data.commit.commitSha?.slice(0, 7)}) — Vercel rebuild started.`
            : `Worksheet ${isEdit ? 'updated' : 'saved'} locally!`;
        onPublished(data.worksheet, msg, isEdit);
      }
    } catch {
      setErrorMsg('Network error submitting worksheet.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-600"
            aria-label="Back to worksheets"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 font-heading">
              {isEdit ? `Edit: ${editingWorksheet!.title}` : 'PDF Worksheet Upload & Pin Studio'}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Drop a US Letter PDF to auto-render crisp page previews and a 1000×1500 Pinterest Pin.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={applySubjectTemplate}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-xs font-bold"
        >
          <Wand2 className="w-3.5 h-3.5" />
          <span>Quick-Fill Subject Template</span>
        </button>
      </div>

      {errorMsg && (
        <div className="flex items-center gap-2 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* LEFT MAIN: PDF Drop + Metadata Form (8 cols) */}
        <div className="xl:col-span-8 space-y-6">
          {/* Step A: PDF Upload */}
          <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 font-heading flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#2E6B6B]" />
                <span>1. Printable PDF File &amp; Auto-Rendered Pages</span>
              </h2>
              <span className="text-xs font-semibold text-slate-500">
                {effectivePages} {effectivePages > 1 ? 'pages' : 'page'} · {effectiveSizeLabel}
              </span>
            </div>

            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const file = e.dataTransfer.files?.[0];
                if (file) handlePdfSelected(file);
              }}
              onClick={() => pdfInputRef.current?.click()}
              className="border-2 border-dashed border-[#2E6B6B]/40 hover:border-[#2E6B6B] bg-[#F0F7F7]/50 hover:bg-[#F0F7F7] rounded-2xl p-6 text-center cursor-pointer transition-colors"
            >
              <input
                ref={pdfInputRef}
                type="file"
                accept=".pdf,application/pdf"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handlePdfSelected(file);
                }}
              />
              <Upload className="w-8 h-8 text-[#2E6B6B] mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-900">
                {renderingPdf
                  ? 'Rendering vector PDF pages in browser...'
                  : pdfFile
                  ? `Selected: ${pdfFile.name} (${formatBytesLabel(pdfFile.size)})`
                  : isEdit
                  ? 'Optional: Drop a new PDF to replace existing file'
                  : 'Drop printable PDF here or click to browse'}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                Recommended: US Letter vector PDF under 3 MB (PNG previews render locally at zero server cost)
              </p>
            </div>

            {activePreviewSrcs.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {activePreviewSrcs.map((src, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-slate-200 bg-slate-50 p-2 space-y-1.5"
                  >
                    <img
                      src={src}
                      alt={`Rendered Page ${idx + 1}`}
                      className="w-full aspect-[1224/1584] object-contain bg-white rounded border border-slate-100"
                    />
                    <p className="text-[11px] font-bold text-center text-slate-600">
                      Page {idx + 1} PNG ✓
                    </p>
                  </div>
                ))}
              </div>
            )}

            {totalUploadBytes > 0 && (
              <div className="flex items-center justify-between text-[11px] px-3 py-2 rounded-lg bg-slate-50 border border-slate-200">
                <span className="font-semibold text-slate-600">
                  Combined upload payload (PDF + PNGs + Pin JPG):
                </span>
                <span
                  className={`font-bold ${
                    totalUploadBytes > 3.8 * 1024 * 1024 ? 'text-rose-600' : 'text-emerald-700'
                  }`}
                >
                  {formatBytesLabel(totalUploadBytes)} / 4.5 MB limit
                </span>
              </div>
            )}
          </section>

          {/* Step B: Core Metadata */}
          <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
            <h2 className="text-base font-bold text-slate-900 font-heading border-b border-slate-100 pb-3">
              2. SEO Title, Taxonomy &amp; Classification
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Worksheet Title (H1 &amp; SEO Title) *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Letter B Tracing & Phonics: Benny Bear Picks Blueberries"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#2E6B6B] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  URL Slug (/worksheets/[slug]) *
                </label>
                <input
                  type="text"
                  required
                  readOnly={isEdit}
                  value={slug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    setSlug(slugify(e.target.value));
                  }}
                  className={`w-full px-3.5 py-2.5 text-xs font-mono rounded-xl border border-slate-200 ${
                    isEdit ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : 'bg-slate-50 focus:bg-white'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Subject *</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value as WorksheetSubject)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
                >
                  {subjects.map((s) => (
                    <option key={s.slug} value={s.slug}>
                      {s.shortTitle}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Ages Label *</label>
                <input
                  type="text"
                  required
                  value={ages}
                  onChange={(e) => setAges(e.target.value)}
                  placeholder="Ages 3–5"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Grade Level *</label>
                <input
                  type="text"
                  required
                  value={gradeLevel}
                  onChange={(e) => setGradeLevel(e.target.value)}
                  placeholder="Pre-K & Kindergarten"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50"
                />
              </div>
            </div>

            {/* Age Bands & ESL Level */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Age Filter Bands *</label>
                <div className="flex flex-wrap gap-2">
                  {AGE_OPTIONS.map((band) => {
                    const active = ageBands.includes(band);
                    return (
                      <button
                        key={band}
                        type="button"
                        onClick={() =>
                          setAgeBands((prev) =>
                            prev.includes(band) ? prev.filter((x) => x !== band) : [...prev, band]
                          )
                        }
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${
                          active
                            ? 'bg-[#2E6B6B] text-white border-[#2E6B6B]'
                            : 'bg-slate-50 text-slate-600 border-slate-200'
                        }`}
                      >
                        Ages {band}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">ESL Level</label>
                <div className="flex gap-2">
                  {(['beginner', 'early-reader'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setEslLevel(lvl)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border capitalize ${
                        eslLevel === lvl
                          ? 'bg-[#2E6B6B] text-white border-[#2E6B6B]'
                          : 'bg-slate-50 text-slate-600 border-slate-200'
                      }`}
                    >
                      {lvl.replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Activity Types */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Activity Types</label>
              <div className="flex flex-wrap gap-1.5">
                {ACTIVITY_OPTIONS.map((act) => {
                  const active = activityTypes.includes(act.value);
                  return (
                    <button
                      key={act.value}
                      type="button"
                      onClick={() =>
                        setActivityTypes((prev) =>
                          prev.includes(act.value)
                            ? prev.filter((x) => x !== act.value)
                            : [...prev, act.value]
                        )
                      }
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                        active
                          ? 'bg-[#F0F7F7] text-[#2E6B6B] border-[#2E6B6B]'
                          : 'bg-slate-50 text-slate-600 border-slate-200'
                      }`}
                    >
                      {act.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Topics & Curriculum Months */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Topics / Themes</label>
                <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-2 rounded-xl border border-slate-200 bg-slate-50/70">
                  {topics.map((t) => {
                    const active = selectedTopics.includes(t.slug);
                    return (
                      <button
                        key={t.slug}
                        type="button"
                        onClick={() =>
                          setSelectedTopics((prev) =>
                            prev.includes(t.slug)
                              ? prev.filter((x) => x !== t.slug)
                              : [...prev, t.slug]
                          )
                        }
                        className={`px-2 py-1 rounded-md text-[11px] font-semibold border ${
                          active
                            ? 'bg-[#2E6B6B] text-white border-[#2E6B6B]'
                            : 'bg-white text-slate-600 border-slate-200'
                        }`}
                      >
                        {t.title}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Curriculum Months
                </label>
                <div className="grid grid-cols-4 gap-1.5 p-2 rounded-xl border border-slate-200 bg-slate-50/70">
                  {months.map((m) => {
                    const active = selectedMonths.includes(m.monthNumber);
                    return (
                      <button
                        key={m.monthNumber}
                        type="button"
                        onClick={() =>
                          setSelectedMonths((prev) =>
                            prev.includes(m.monthNumber)
                              ? prev.filter((x) => x !== m.monthNumber)
                              : [...prev, m.monthNumber]
                          )
                        }
                        className={`py-1 rounded-md text-[11px] font-bold border ${
                          active
                            ? 'bg-[#2E6B6B] text-white border-[#2E6B6B]'
                            : 'bg-white text-slate-600 border-slate-200'
                        }`}
                      >
                        {m.name.slice(0, 3)}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          {/* Step C: Descriptions, Teacher Notes, Vocabulary, Series & FAQs */}
          <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
            <h2 className="text-base font-bold text-slate-900 font-heading border-b border-slate-100 pb-3">
              3. Classroom Guide, Vocabulary &amp; FAQs
            </h2>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Meta Description &amp; Intro Paragraph *
              </label>
              <textarea
                required
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="1–2 crisp sentences explaining what educators get in this printable PDF..."
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Quick Above-the-Fold Summary (1 sentence)
              </label>
              <input
                type="text"
                value={quickSummary}
                onChange={(e) => setQuickSummary(e.target.value)}
                placeholder="Defaults to description if left empty"
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Target Skill Summary *</label>
              <input
                type="text"
                required
                value={skill}
                onChange={(e) => setSkill(e.target.value)}
                placeholder="e.g. Initial phonics sound /b/, letter formation, and vocabulary recall"
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
              />
            </div>

            {/* Teacher Note fields */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-[#2E6B6B]">
                How to Use (Teacher &amp; Parent Methodology)
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Learning Goal *
                  </label>
                  <input
                    type="text"
                    required
                    value={learningGoal}
                    onChange={(e) => setLearningGoal(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Skill Focus
                  </label>
                  <input
                    type="text"
                    value={skillFocus}
                    onChange={(e) => setSkillFocus(e.target.value)}
                    placeholder="Defaults to target skill"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Teacher Tip *
                </label>
                <textarea
                  required
                  rows={2}
                  value={teachingTip}
                  onChange={(e) => setTeachingTip(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Extension Activity
                </label>
                <input
                  type="text"
                  value={extensionActivity}
                  onChange={(e) => setExtensionActivity(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white"
                />
              </div>
            </div>

            {/* What's Inside dynamic list */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">What&apos;s Inside Checklist</label>
              {whatsInside.map((item, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => {
                      const next = [...whatsInside];
                      next[idx] = e.target.value;
                      setWhatsInside(next);
                    }}
                    placeholder={`Bullet ${idx + 1}...`}
                    className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50"
                  />
                  <button
                    type="button"
                    onClick={() => setWhatsInside((prev) => prev.filter((_, i) => i !== idx))}
                    className="px-2 text-slate-400 hover:text-rose-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setWhatsInside((prev) => [...prev, ''])}
                className="inline-flex items-center gap-1 text-xs font-bold text-[#2E6B6B] hover:underline"
              >
                <Plus className="w-3.5 h-3.5" /> Add item
              </button>
            </div>

            {/* Vocabulary & Keywords */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">
                  English Vocabulary Words (need &gt;= 3 to display)
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {vocabulary.map((word, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-slate-100 text-xs font-semibold text-slate-800"
                    >
                      {word}
                      <button
                        type="button"
                        onClick={() => setVocabulary((p) => p.filter((_, i) => i !== idx))}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={vocabInput}
                    onChange={(e) => setVocabInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ',') {
                        e.preventDefault();
                        const words = vocabInput
                          .split(',')
                          .map((w) => w.trim())
                          .filter(Boolean);
                        if (words.length) setVocabulary((p) => [...p, ...words]);
                        setVocabInput('');
                      }
                    }}
                    placeholder="Type word + Enter (or comma-separated)"
                    className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const words = vocabInput
                        .split(',')
                        .map((w) => w.trim())
                        .filter(Boolean);
                      if (words.length) setVocabulary((p) => [...p, ...words]);
                      setVocabInput('');
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-100 text-xs font-bold"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">SEO Keywords</label>
                <div className="flex flex-wrap gap-1.5">
                  {keywords.map((kw, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#F0F7F7] text-xs font-semibold text-[#2E6B6B]"
                    >
                      {kw}
                      <button
                        type="button"
                        onClick={() => setKeywords((p) => p.filter((_, i) => i !== idx))}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={kwInput}
                    onChange={(e) => setKwInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ',') {
                        e.preventDefault();
                        const items = kwInput
                          .split(',')
                          .map((w) => w.trim())
                          .filter(Boolean);
                        if (items.length) setKeywords((p) => [...p, ...items]);
                        setKwInput('');
                      }
                    }}
                    placeholder="Add SEO phrase + Enter"
                    className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const items = kwInput
                        .split(',')
                        .map((w) => w.trim())
                        .filter(Boolean);
                      if (items.length) setKeywords((p) => [...p, ...items]);
                      setKwInput('');
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-100 text-xs font-bold"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>

            {/* Series Linking */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <p className="text-xs font-bold text-slate-700">
                Optional Series Connection (e.g. Letter of the Week)
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                <input
                  type="text"
                  value={seriesName}
                  onChange={(e) => setSeriesName(e.target.value)}
                  placeholder="Series Name"
                  className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                />
                <input
                  type="text"
                  value={seriesId}
                  onChange={(e) => setSeriesId(e.target.value)}
                  placeholder="series-id (optional)"
                  className="px-3 py-1.5 text-xs font-mono rounded-lg border border-slate-200 bg-white"
                />
                <input
                  type="number"
                  value={seriesOrder}
                  onChange={(e) => setSeriesOrder(e.target.value)}
                  placeholder="Order (e.g. 2)"
                  className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                />
                <input
                  type="number"
                  value={seriesTotal}
                  onChange={(e) => setSeriesTotal(e.target.value)}
                  placeholder="Total (e.g. 26)"
                  className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                />
                <select
                  value={seriesPrevSlug}
                  onChange={(e) => setSeriesPrevSlug(e.target.value)}
                  className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                >
                  <option value="">Previous in series (none)</option>
                  {existingWorksheets
                    .filter((w) => w.slug !== slug)
                    .map((w) => (
                      <option key={w.slug} value={w.slug}>
                        Prev: {w.slug}
                      </option>
                    ))}
                </select>
                <select
                  value={seriesNextSlug}
                  onChange={(e) => setSeriesNextSlug(e.target.value)}
                  className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                >
                  <option value="">Next in series (none)</option>
                  {existingWorksheets
                    .filter((w) => w.slug !== slug)
                    .map((w) => (
                      <option key={w.slug} value={w.slug}>
                        Next: {w.slug}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            {/* FAQs */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700">
                Worksheet FAQs (Generates FAQ Schema)
              </label>
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2"
                >
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={faq.question}
                      onChange={(e) => {
                        const next = [...faqs];
                        next[idx] = { ...next[idx], question: e.target.value };
                        setFaqs(next);
                      }}
                      placeholder={`Question ${idx + 1}`}
                      className="flex-1 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setFaqs((p) => p.filter((_, i) => i !== idx))}
                      className="px-2 text-slate-400 hover:text-rose-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <textarea
                    rows={2}
                    value={faq.answer}
                    onChange={(e) => {
                      const next = [...faqs];
                      next[idx] = { ...next[idx], answer: e.target.value };
                      setFaqs(next);
                    }}
                    placeholder="Clear answer for parents and teachers..."
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={() => setFaqs((p) => [...p, { question: '', answer: '' }])}
                className="inline-flex items-center gap-1 text-xs font-bold text-[#2E6B6B] hover:underline"
              >
                <Plus className="w-3.5 h-3.5" /> Add FAQ
              </button>
            </div>
          </section>
        </div>

        {/* RIGHT SIDEBAR: Auto Pinterest Pin Studio + Live SEO Score (4 cols) */}
        <div className="xl:col-span-4 space-y-6 xl:sticky xl:top-6">
          {/* Pinterest Pin Studio */}
          <section className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-red-600" />
                <h3 className="text-sm font-bold text-slate-900 font-heading">
                  Auto Pinterest Pin (1000×1500)
                </h3>
              </div>
              {pinDataUrl && (
                <a
                  href={pinDataUrl}
                  download={`${slug || 'kinderesl'}-pinterest-pin.jpg`}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-red-600 hover:underline"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download JPG</span>
                </a>
              )}
            </div>

            {pinDataUrl ? (
              <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-50 shadow-xs">
                <img
                  src={pinDataUrl}
                  alt="Generated Pinterest Pin preview"
                  className="w-full aspect-[2/3] object-contain"
                />
              </div>
            ) : (
              <div className="aspect-[2/3] rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center p-6 text-center text-xs text-slate-400">
                <Sparkles className="w-6 h-6 mb-2 text-slate-300" />
                <span>Upload a PDF to auto-generate your vertical Pinterest Pin canvas.</span>
              </div>
            )}

            <div className="space-y-2.5 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Pin Kicker</label>
                <input
                  type="text"
                  value={pinBadge}
                  onChange={(e) => setPinBadge(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Pin Display Title
                </label>
                <input
                  type="text"
                  value={pinTitle}
                  onChange={(e) => setPinTitle(e.target.value)}
                  placeholder={title || 'Free Letter Tracing Worksheet'}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Pin Subtitle</label>
                <input
                  type="text"
                  value={pinSubtitle}
                  onChange={(e) => setPinSubtitle(e.target.value)}
                  placeholder={defaultPinSub}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  disabled={activePreviewSrcs.length === 0 || generatingPin}
                  onClick={() => buildPinCanvas(activePreviewSrcs)}
                  className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${generatingPin ? 'animate-spin' : ''}`} />
                  <span>Regenerate Pin</span>
                </button>

                <label className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold cursor-pointer">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Custom Pin</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleCustomPinSelected(f);
                    }}
                  />
                </label>
              </div>
            </div>
          </section>

          {/* Live Quality & SEO Score */}
          <section className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 font-heading">SEO &amp; Quality Score</h3>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold ${
                  scorePct >= 80
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {scorePct}%
              </span>
            </div>

            <div className="space-y-2">
              {qualityChecks.map((chk, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs">
                  {chk.ok ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  )}
                  <span className={chk.ok ? 'text-slate-700 font-medium' : 'text-slate-500'}>
                    {chk.label}
                  </span>
                </div>
              ))}
            </div>

            <button
              type="submit"
              disabled={submitting || renderingPdf}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl bg-[#2E6B6B] hover:bg-[#235353] text-white text-sm font-bold shadow-sm transition-colors disabled:opacity-60"
            >
              <Upload className="w-4 h-4" />
              <span>
                {submitting
                  ? 'Publishing...'
                  : isEdit
                  ? 'Save Changes & Publish'
                  : 'Publish Worksheet to Site'}
              </span>
            </button>
          </section>
        </div>
      </div>
    </form>
  );
}
