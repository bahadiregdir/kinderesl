import { revalidatePath, revalidateTag } from 'next/cache';

export function revalidateCatalog(slug?: string): void {
  try {
    revalidateTag('worksheets', 'max');
    revalidatePath('/');
    revalidatePath('/worksheets');
    revalidatePath('/worksheets/[slug]', 'page');
    revalidatePath('/topics');
    revalidatePath('/topics/[topic]', 'page');
    revalidatePath('/preschool-themes');
    revalidatePath('/preschool-themes/[month]', 'page');
    revalidatePath('/sitemap.xml');
    if (slug) {
      revalidatePath(`/worksheets/${slug}`);
    }
  } catch (err) {
    console.warn('Revalidation skipped or partial:', err);
  }
}

export function revalidateSettings(): void {
  try {
    revalidateTag('site-settings', 'max');
    revalidatePath('/');
    revalidatePath('/ads.txt');
    revalidatePath('/contact');
    revalidatePath('/about');
  } catch (err) {
    console.warn('Settings revalidation skipped or partial:', err);
  }
}
