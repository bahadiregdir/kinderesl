export type WorksheetSubject =
  | 'alphabet'
  | 'phonics'
  | 'numbers-counting'
  | 'shapes-colors'
  | 'vocabulary'
  | 'thinking-skills';

export type ActivityType =
  | 'tracing'
  | 'coloring'
  | 'cut-and-paste'
  | 'matching'
  | 'counting'
  | 'odd-one-out'
  | 'flashcards'
  | 'dot-to-dot'
  | 'maze';

export type AgeBand = '3-4' | '4-5' | '5-6';

export type EslLevel = 'beginner' | 'early-reader';

export interface TeacherNote {
  skillFocus: string;
  learningGoal: string;
  teachingTip: string;
  extensionActivity: string;
  steps?: string[];
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface Worksheet {
  id: string;
  title: string;
  slug: string;
  subject: WorksheetSubject;
  subjectName: string;
  topics: string[];
  activityTypes: ActivityType[];
  ageBands: AgeBand[];
  eslLevel?: EslLevel;
  ages: string;
  gradeLevel: string;
  skill: string;
  pages: number;
  description: string;
  quickSummary: string;
  teacherNote: TeacherNote;
  whatsInside: string[];
  pdfPath: string;
  pdfFileSize: string;
  previewImages: string[];
  pinterestPinImage: string;
  vocabulary: string[];
  series?: {
    id: string;
    name: string;
    order: number;
    total?: number;
    nextSlug?: string;
    prevSlug?: string;
  };
  months?: number[];
  relatedSlugs: string[];
  faqs: FAQItem[];
  keywords: string[];
  datePublished: string;
  dateModified: string;

  // Backwards compatibility aliases
  category?: string;
  categoryName?: string;
  theme?: string;
  themeName?: string;
}

export interface SubjectMeta {
  slug: WorksheetSubject;
  title: string;
  shortTitle: string;
  description: string;
  targetAges: string;
  iconName: string;
  faqs: FAQItem[];
  plannedTitles?: string[];
}

export interface TopicMeta {
  slug: string;
  title: string;
  description: string;
  iconName: string;
  curriculumMonths: number[];
  faqs: FAQItem[];
  plannedTitles?: string[];
}

export interface MonthMeta {
  monthNumber: number;
  slug: string;
  name: string;
  season: 'Winter' | 'Spring' | 'Summer' | 'Fall';
  topicSlugs: string[];
  description: string;
  faqs: FAQItem[];
  plannedTitles?: string[];
}

export interface SiteSettings {
  author: {
    name: string;
    slug: string;
    role: string;
    shortBio: string;
    fullBio: string;
    credentials: string[];
    avatar: string;
  };
  contactEmail: string;
  pinterest: {
    handle: string;
    url: string;
    verificationToken: string;
  };
  adsense: {
    client: string;
    enabled: boolean;
    slots: {
      inContent: string;
      sidebar: string;
      preDownload: string;
    };
    rewardedAdEnabled: boolean;
  };
  analytics?: {
    ga4MeasurementId: string;
    googleSiteVerification?: string;
  };
}

export interface WorksheetRequest {
  id: string;
  name: string;
  email?: string;
  role: string;
  ageGroup: string;
  subject: string;
  topic: string;
  details: string;
  status: 'new' | 'planned' | 'done';
  createdAt: string;
}

/**
 * Central indexation rule:
 * Subject, topic, and monthly theme collections require >= 6 worksheets to be indexed
 * and included in sitemap.xml. Otherwise they remain noindex, follow.
 */
export function isIndexableCollection(count: number): boolean {
  return count >= 6;
}
