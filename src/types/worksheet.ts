export type WorksheetCategory =
  | 'literacy'
  | 'math'
  | 'thinking-skills'
  | 'esl-vocabulary'
  | 'shapes-colors';

export interface TeacherNote {
  skillFocus: string;
  learningGoal: string;
  teachingTip: string;
  extensionActivity: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface Worksheet {
  id: string;
  title: string;
  slug: string;
  category: WorksheetCategory;
  categoryName: string;
  ages: string;
  gradeLevel: string;
  skill: string;
  pages: number;
  description: string;
  quickSummary: string; // 2-3 sentences for GEO/AI at top of page
  teacherNote: TeacherNote;
  pdfPath: string;
  pdfFileSize: string;
  previewImages: string[];
  pinterestPinImage: string;
  keywords: string[];
  theme: string;
  themeName: string;
  monthTheme?: string;
  relatedSlugs: string[];
  faqs: FAQItem[];
  datePublished: string;
  dateModified: string;
}

export interface CategoryMeta {
  slug: WorksheetCategory;
  title: string;
  shortTitle: string;
  description: string;
  pedagogicalFocus: string;
  targetAges: string;
  iconName: string;
  faqs: FAQItem[];
}

export interface ThemeMeta {
  slug: string;
  title: string;
  description: string;
  bestMonths: string[];
  skillsCovered: string[];
  faqs: FAQItem[];
}

export interface MonthMeta {
  slug: string;
  name: string;
  season: 'Winter' | 'Spring' | 'Summer' | 'Fall';
  curriculumThemes: string[];
  description: string;
  learningMilestones: string[];
  faqs: FAQItem[];
}
