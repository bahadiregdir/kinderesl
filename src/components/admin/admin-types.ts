import type { SiteSettings, Worksheet, WorksheetRequest, WorksheetSubject } from '@/types/worksheet';
import type { StorageInfo } from '@/lib/cms-storage';

export type AdminTabId =
  | 'dashboard'
  | 'worksheets'
  | 'upload'
  | 'requests'
  | 'monetization'
  | 'settings';

export interface CollectionStats {
  totalWorksheets: number;
  totalPages: number;
  indexedSubjects: number;
  indexedTopics: number;
  indexedMonths: number;
  subjectStats: Array<{
    slug: WorksheetSubject;
    title: string;
    fullTitle: string;
    count: number;
    indexed: boolean;
    remainingForIndex: number;
  }>;
  topicStats: Array<{
    slug: string;
    title: string;
    count: number;
    indexed: boolean;
    remainingForIndex: number;
  }>;
  monthStats: Array<{
    slug: string;
    name: string;
    monthNumber: number;
    count: number;
    indexed: boolean;
    remainingForIndex: number;
  }>;
}

export interface AdminAnalyticsSummary {
  totalDownloads: number;
  topDownloaded: Array<{
    slug: string;
    title: string;
    subject: string;
    downloads: number;
  }>;
  topSearches: Array<{
    query: string;
    count: number;
    zeroResults: number;
  }>;
  traffic?: {
    totalPageViews: number;
    todayPageViews: number;
    uniqueSessions30d: number;
    todaySessions: number;
    avgDurationSec: number;
    dailyVisits: Array<{ date: string; views: number; sessions: number }>;
    topPages: Array<{ path: string; views: number; exits: number; avgDurationSec: number }>;
    topReferrers: Array<{ source: string; views: number }>;
  };
}

export interface NewsletterSubscriber {
  email: string;
  role: string;
  source: string;
  createdAt: string;
}

export interface RequestPrefillDraft {
  subject: WorksheetSubject;
  titleHint: string;
  ages: string;
  skillHint: string;
}

export interface AdminBootstrapData {
  worksheets: Worksheet[];
  settings: SiteSettings | null;
  requests: WorksheetRequest[];
  stats: CollectionStats | null;
  storage: StorageInfo | null;
}
