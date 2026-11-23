import type { Worksheet } from '@/types/worksheet';

export interface WorksheetFilterParams {
  q?: string;
  subject?: string;
  activity?: string;
  age?: string;
}

export function filterWorksheets(
  worksheets: Worksheet[],
  filters: WorksheetFilterParams
): Worksheet[] {
  const q = (filters.q || '').trim().toLowerCase();
  const subject = (filters.subject || '').trim().toLowerCase();
  const activity = (filters.activity || '').trim().toLowerCase();
  const age = (filters.age || '').trim().toLowerCase();

  return worksheets.filter((w) => {
    if (q) {
      const titleMatch = w.title.toLowerCase().includes(q);
      const descMatch = w.description.toLowerCase().includes(q);
      const skillMatch = w.skill.toLowerCase().includes(q);
      const slugMatch = w.slug.toLowerCase().includes(q);
      const vocabMatch = w.vocabulary?.some((v) => v.toLowerCase().includes(q));
      const kwMatch = w.keywords?.some((k) => k.toLowerCase().includes(q));

      if (
        !titleMatch &&
        !descMatch &&
        !skillMatch &&
        !slugMatch &&
        !vocabMatch &&
        !kwMatch
      ) {
        return false;
      }
    }

    if (subject && w.subject.toLowerCase() !== subject) {
      return false;
    }

    if (
      activity &&
      !w.activityTypes.some((a) => a.toLowerCase() === activity)
    ) {
      return false;
    }

    if (age && !w.ageBands.some((b) => b.toLowerCase() === age)) {
      return false;
    }

    return true;
  });
}
