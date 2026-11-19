import { Worksheet, WorksheetSubject } from '@/types/worksheet';
import { topics } from './topics';
import worksheetsData from './worksheets.json';

export const worksheets: Worksheet[] = worksheetsData as Worksheet[];

export function getAllWorksheets(): Worksheet[] {
  return worksheets;
}

export function getWorksheetBySlug(slug: string): Worksheet | undefined {
  return worksheets.find((w) => w.slug === slug);
}

export function getWorksheetsBySubject(subject: WorksheetSubject): Worksheet[] {
  return worksheets.filter((w) => w.subject === subject);
}

export function getWorksheetsByTopic(topicSlug: string): Worksheet[] {
  return worksheets.filter((w) => w.topics.includes(topicSlug));
}

export function getWorksheetsByMonth(monthNumber: number): Worksheet[] {
  // Find topics relevant to this month
  const matchingTopics = topics
    .filter((t) => t.curriculumMonths.includes(monthNumber))
    .map((t) => t.slug);

  return worksheets.filter((w) => {
    if (w.months && w.months.includes(monthNumber)) return true;
    return w.topics.some((topic) => matchingTopics.includes(topic));
  });
}

export function getRelatedWorksheets(worksheet: Worksheet, limit = 4): Worksheet[] {
  const others = worksheets.filter((w) => w.id !== worksheet.id);

  // Score by shared topics, subject, and activity types
  const scored = others.map((w) => {
    let score = 0;
    if (w.subject === worksheet.subject) score += 3;
    const sharedTopics = w.topics.filter((t) => worksheet.topics.includes(t));
    score += sharedTopics.length * 2;
    const sharedActivities = w.activityTypes.filter((a) => worksheet.activityTypes.includes(a));
    score += sharedActivities.length;
    return { worksheet: w, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => s.worksheet);
}

// Backwards compatibility for existing components
export function getWorksheetsByCategory(cat: string): Worksheet[] {
  return worksheets.filter((w) => {
    if (w.subject === cat) return true;
    if (w.category === cat) return true;
    if (cat === 'literacy' && (w.subject === 'alphabet' || w.subject === 'phonics')) return true;
    if (cat === 'math' && w.subject === 'numbers-counting') return true;
    if (cat === 'esl-vocabulary' && w.subject === 'vocabulary') return true;
    return false;
  });
}

export function getWorksheetsByTheme(theme: string): Worksheet[] {
  return getWorksheetsByTopic(theme);
}
