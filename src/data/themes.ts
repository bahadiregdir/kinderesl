import { ThemeMeta } from '@/types/worksheet';

export const themes: ThemeMeta[] = [
  {
    slug: 'winter',
    title: 'Winter Season Educational Theme',
    description:
      'Curated winter-themed preschool printables covering cold weather vocabulary, snowy day clothing categorization, snowflakes, mittens, and winter animal habitats.',
    bestMonths: ['December', 'January', 'February'],
    skillsCovered: ['Visual discrimination', 'Categorization', 'Winter ESL vocabulary', 'Fine motor coloring'],
    faqs: [
      {
        question: 'What core concepts are explored in the winter preschool theme?',
        answer:
          'Our winter printables integrate seasonal changes, temperature vocabulary (hot vs. cold), appropriate winter attire, and weather-related phonics.',
      },
    ],
  },
  {
    slug: 'farm-animals',
    title: 'Farm Animals & Barnyard Theme',
    description:
      'High-engagement farm animal activities focusing on animal recognition, onomatopoeic animal sounds (moo, baa, oink), and foundational spelling/tracing.',
    bestMonths: ['March', 'April', 'May', 'September'],
    skillsCovered: ['Animal vocabulary', 'Sound matching', 'Word tracing', 'Auditory discrimination'],
    faqs: [
      {
        question: 'Why are farm animals effective for early ESL instruction?',
        answer:
          'Farm animals allow children to connect familiar acoustic sounds (like "quack" and "moo") with newly introduced English nouns, significantly lowering communicative hesitation in young ELL learners.',
      },
    ],
  },
  {
    slug: 'insects-bugs',
    title: 'Insects & Creepy Crawlies Theme',
    description:
      'Delightful ladybug, ant, bee, and butterfly learning resources designed for counting objects 1–10, symmetry, and letter-sound exploration.',
    bestMonths: ['April', 'May', 'June'],
    skillsCovered: ['Counting 1-5', 'Number tracing', 'Bug vocabulary', 'One-to-one correspondence'],
    faqs: [
      {
        question: 'How do bug themes assist in early numeracy development?',
        answer:
          'Counting spots on ladybug wings or legs on insects provides natural, visual groupings that reinforce one-to-one correspondence and early subitizing skills.',
      },
    ],
  },
  {
    slug: 'alphabet',
    title: 'Alphabet & Letter of the Week Hub',
    description:
      'Comprehensive letter-by-letter handwriting and phonemic awareness units, combining uppercase and lowercase letter tracing, picture hunts, and phonics chants.',
    bestMonths: ['Year-round', 'September', 'October'],
    skillsCovered: ['Letter formation', 'Initial sound recognition', 'Pencil grip', 'Visual letter hunt'],
    faqs: [
      {
        question: 'Should children learn uppercase or lowercase letters first?',
        answer:
          'Early childhood research supports introducing both letters together in context. Our printables feature clear side-by-side upper and lowercase stroke guidelines so children recognize both representations.',
      },
    ],
  },
];

export function getThemeBySlug(slug: string): ThemeMeta | undefined {
  return themes.find((t) => t.slug === slug);
}
