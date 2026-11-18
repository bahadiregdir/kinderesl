import { notFound } from 'next/navigation';
import Image from 'next/image';
import type { Metadata } from 'next';
import { getAllWorksheets, getWorksheetBySlug, getRelatedWorksheets } from '@/data/worksheets';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { DownloadButton } from '@/components/DownloadButton';
import { PinterestShare } from '@/components/PinterestShare';
import { AdUnit } from '@/components/AdUnit';
import { AuthorBox } from '@/components/AuthorBox';
import { FAQAccordion } from '@/components/FAQAccordion';
import { WorksheetCard } from '@/components/WorksheetCard';
import { siteConfig } from '@/config/site';
import {
  Sparkles,
  BookOpen,
  Calendar,
  Layers,
  CheckCircle2,
  Lightbulb,
  Target,
  GraduationCap,
} from 'lucide-react';

interface Props {
  params: Promise<{
    category: string;
    slug: string;
  }>;
}

// Generate static params for all worksheets (SSG)
export async function generateStaticParams() {
  const worksheets = getAllWorksheets();
  return worksheets.map((w) => ({
    category: w.category,
    slug: w.slug,
  }));
}

// Generate rich SEO metadata for each worksheet
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const worksheet = getWorksheetBySlug(slug);

  if (!worksheet) {
    return {
      title: 'Worksheet Not Found',
    };
  }

  const pageUrl = `${siteConfig.url}/worksheets/${worksheet.category}/${worksheet.slug}`;
  const metaTitle = `Free ${worksheet.title} Printable (${worksheet.ages})`;
  const metaDesc = `${worksheet.quickSummary} Free PDF download for teachers and parents.`;

  return {
    title: metaTitle,
    description: metaDesc,
    keywords: worksheet.keywords,
    alternates: {
      canonical: pageUrl,
      languages: {
        'en-US': pageUrl,
        'tr-TR': `${siteConfig.url}/tr`,
      },
    },
    openGraph: {
      title: metaTitle,
      description: metaDesc,
      url: pageUrl,
      type: 'article',
      publishedTime: worksheet.datePublished,
      modifiedTime: worksheet.dateModified,
      authors: [`${siteConfig.url}/about`],
      images: [
        {
          url: worksheet.previewImages[0],
          width: 800,
          height: 1035,
          alt: `${worksheet.title} free printable worksheet preview`,
        },
        {
          url: worksheet.pinterestPinImage,
          width: 1000,
          height: 1500,
          alt: `${worksheet.title} Pinterest Pin`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDesc,
      images: [worksheet.previewImages[0]],
    },
  };
}

export default async function WorksheetDetailPage({ params }: Props) {
  const { slug } = await params;
  const worksheet = getWorksheetBySlug(slug);

  if (!worksheet) {
    notFound();
  }

  const related = getRelatedWorksheets(worksheet.slug, 3);
  const pageUrl = `${siteConfig.url}/worksheets/${worksheet.category}/${worksheet.slug}`;

  // Schema.org LearningResource & CreativeWork JSON-LD
  const learningResourceSchema = {
    '@context': 'https://schema.org',
    '@type': 'LearningResource',
    name: worksheet.title,
    description: worksheet.description,
    learningResourceType: 'Worksheet',
    educationalLevel: worksheet.gradeLevel,
    audience: {
      '@type': 'EducationalAudience',
      educationalRole: ['teacher', 'parent', 'educator'],
    },
    teaches: worksheet.skill,
    author: {
      '@type': 'Person',
      name: siteConfig.author.name,
      jobTitle: siteConfig.author.role,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.legalName,
      url: siteConfig.url,
    },
    isAccessibleForFree: true,
    inLanguage: 'en-US',
    datePublished: worksheet.datePublished,
    dateModified: worksheet.dateModified,
    image: `${siteConfig.url}${worksheet.previewImages[0]}`,
    url: pageUrl,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(learningResourceSchema) }}
      />

      <div className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: 'Worksheets', href: '/worksheets' },
              { label: worksheet.categoryName, href: `/worksheets/${worksheet.category}` },
              { label: worksheet.title },
            ]}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Main Content Column (8 cols) */}
          <article className="lg:col-span-8">
            {/* GEO 2-3 sentence overview card at top */}
            <div className="bg-[#F0F7F7] border-l-4 border-[#2E6B6B] p-4 sm:p-5 rounded-r-xl mb-6 shadow-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#2E6B6B] block mb-1">
                Pedagogical Overview for Teachers &amp; Parents
              </span>
              <p className="text-sm text-slate-700 leading-relaxed font-medium">
                {worksheet.quickSummary}
              </p>
            </div>

            {/* Header info */}
            <header className="mb-6">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-semibold bg-[#2E6B6B] text-white">
                  {worksheet.categoryName}
                </span>
                <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200">
                  {worksheet.ages}
                </span>
                <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200">
                  {worksheet.gradeLevel}
                </span>
                <span className="inline-flex items-center gap-1 text-xs text-slate-500 ml-auto">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Updated: {worksheet.dateModified}</span>
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
                {worksheet.title}
              </h1>

              {/* Core Skill Badge Box */}
              <div className="flex items-start gap-2.5 bg-white border border-slate-200 p-3.5 rounded-lg text-xs text-slate-700">
                <Target className="w-4 h-4 text-[#2E6B6B] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900">Target Skill: </strong>
                  <span>{worksheet.skill}</span>
                </div>
              </div>
            </header>

            {/* Primary PNG/WebP Previews Gallery */}
            <section aria-label="Worksheet Preview" className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#2E6B6B]" />
                  <span>
                    Printable Preview ({worksheet.pages} {worksheet.pages > 1 ? 'Pages' : 'Page'})
                  </span>
                </h2>
                <span className="text-xs text-slate-500 font-medium">Standard 8.5&quot; × 11&quot; US Letter</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {worksheet.previewImages.map((imgSrc, idx) => (
                  <div
                    key={idx}
                    className="relative bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="p-2 border-b border-slate-100 bg-slate-50 text-center text-xs font-semibold text-slate-600">
                      Page {idx + 1} of {worksheet.pages}
                    </div>
                    <div className="relative aspect-[3/4] p-4 bg-white flex items-center justify-center">
                      <Image
                        src={imgSrc}
                        alt={`${worksheet.title} - Printable Page ${idx + 1}`}
                        fill
                        sizes="(max-width: 640px) 100vw, 50vw"
                        className="object-contain p-2"
                        priority={idx === 0}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* In-Content Ad Slot 1 (Compliant & Isolated) */}
            <AdUnit slotType="in-content" />

            {/* Detailed Description */}
            <section className="prose prose-slate max-w-none my-8">
              <h2 className="text-xl font-bold text-slate-900 mb-3">About This Printable Resource</h2>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed mb-4">
                {worksheet.description}
              </p>
            </section>

            {/* Dedicated Teacher's Note (E-E-A-T Pedagogical Guidance) */}
            <section className="bg-slate-50 border border-slate-200 rounded-xl p-6 sm:p-7 my-8 shadow-xs">
              <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-slate-200">
                <GraduationCap className="w-5 h-5 text-[#2E6B6B]" />
                <h3 className="text-lg font-bold text-slate-900">
                  Teacher &amp; Parent Instructional Notes
                </h3>
              </div>

              <dl className="grid grid-cols-1 gap-4 text-xs sm:text-sm">
                <div>
                  <dt className="font-bold text-slate-900 mb-0.5 flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5 text-[#2E6B6B]" />
                    <span>Skill Focus:</span>
                  </dt>
                  <dd className="text-slate-700 leading-relaxed pl-5">
                    {worksheet.teacherNote.skillFocus}
                  </dd>
                </div>

                <div>
                  <dt className="font-bold text-slate-900 mb-0.5 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Learning Goal:</span>
                  </dt>
                  <dd className="text-slate-700 leading-relaxed pl-5">
                    {worksheet.teacherNote.learningGoal}
                  </dd>
                </div>

                <div>
                  <dt className="font-bold text-slate-900 mb-0.5 flex items-center gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                    <span>Educator Teaching Tip:</span>
                  </dt>
                  <dd className="text-slate-700 leading-relaxed pl-5">
                    {worksheet.teacherNote.teachingTip}
                  </dd>
                </div>

                <div>
                  <dt className="font-bold text-slate-900 mb-0.5 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#2E6B6B]" />
                    <span>Classroom &amp; Home Extension Activity:</span>
                  </dt>
                  <dd className="text-slate-700 leading-relaxed pl-5">
                    {worksheet.teacherNote.extensionActivity}
                  </dd>
                </div>
              </dl>
            </section>

            {/* Pre-Download Ad Slot (Separated from download button as specified) */}
            <AdUnit slotType="pre-download" />

            {/* Download Button Component */}
            <DownloadButton
              pdfUrl={worksheet.pdfPath}
              pdfTitle={worksheet.title}
              pdfSize={worksheet.pdfFileSize}
              pageCount={worksheet.pages}
            />

            {/* Author Box (E-E-A-T) */}
            <AuthorBox isCompact={true} />

            {/* Educator Q&A FAQ */}
            <FAQAccordion items={worksheet.faqs} />
          </article>

          {/* Sidebar Column (4 cols) */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Quick Metadata Box */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3 pb-2 border-b border-slate-100 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#2E6B6B]" />
                <span>Resource Specification</span>
              </h3>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Category:</span>
                  <span className="font-semibold text-slate-900">{worksheet.categoryName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Target Ages:</span>
                  <span className="font-semibold text-slate-900">{worksheet.ages}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Grade Level:</span>
                  <span className="font-semibold text-slate-900">{worksheet.gradeLevel}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Page Count:</span>
                  <span className="font-semibold text-slate-900">{worksheet.pages} Pages</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">File Type:</span>
                  <span className="font-semibold text-slate-900">Printable PDF</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">File Size:</span>
                  <span className="font-semibold text-slate-900">{worksheet.pdfFileSize}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Licensing:</span>
                  <span className="font-semibold text-emerald-700">Free for Classroom Use</span>
                </div>
              </div>
            </div>

            {/* Pinterest Share & 1000x1500 Pin Component */}
            <PinterestShare
              pinImageUrl={worksheet.pinterestPinImage}
              pageUrl={pageUrl}
              description={worksheet.description}
              title={worksheet.title}
            />

            {/* Sidebar Ad Slot (Cleanly isolated) */}
            <AdUnit slotType="sidebar" />
          </aside>
        </div>

        {/* Related Worksheets Section */}
        {related.length > 0 && (
          <section className="mt-16 pt-10 border-t border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                  Related Early Learning Worksheets
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  More free printable activities tailored for preschool and kindergarten classrooms.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((ws) => (
                <WorksheetCard key={ws.slug} worksheet={ws} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
