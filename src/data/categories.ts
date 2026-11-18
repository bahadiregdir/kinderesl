import { CategoryMeta } from '@/types/worksheet';

export const categories: CategoryMeta[] = [
  {
    slug: 'literacy',
    title: 'Literacy & Phonics Worksheets',
    shortTitle: 'Literacy',
    description:
      'Printable activities for early letter recognition, uppercase and lowercase handwriting formation, initial sound phonemic awareness, and foundational pre-reading fluency.',
    pedagogicalFocus:
      'Multi-sensory stroke formation, phonics letter-sound mapping, and fine-motor pencil grip development for preschool and kindergarten learners.',
    targetAges: 'Ages 3–6 (Pre-K to Kindergarten)',
    iconName: 'BookOpen',
    faqs: [
      {
        question: 'How do these literacy worksheets support early phonemic awareness?',
        answer:
          'Each worksheet pairs visual letter tracing with concrete picture anchors (e.g. Andy the Ant and apples) and explicit teacher prompts to vocalize initial phonemes (/a/), anchoring speech-sound connections before reading.',
      },
      {
        question: 'Are stroke direction arrows included for beginner handwriting?',
        answer:
          'Yes, handwriting exercises feature starting dots and directional stroke sequences (downward pulls and horizontal crossbars) aligned with standard Zaner-Bloser and D’Nealian handwriting progression.',
      },
      {
        question: 'Can these printables be used in ESL / ELL classrooms?',
        answer:
          'Absolutely. Visual repetition, clear illustration anchors, and simplified verbal cues make these ideal for English language learners acquiring their first phonetic foundations.',
      },
    ],
  },
  {
    slug: 'math',
    title: 'Early Math & Number Sense Worksheets',
    shortTitle: 'Early Math',
    description:
      'Structured printables designed to build early numeracy, one-to-one correspondence, numeral handwriting, subitizing, and spatial mathematical understanding.',
    pedagogicalFocus:
      'Concrete counting before abstract notation, touch-point counting reinforcement, and accurate numeral formation.',
    targetAges: 'Ages 3–6 (Preschool to Kindergarten)',
    iconName: 'Calculator',
    faqs: [
      {
        question: 'What is one-to-one correspondence and why is it prioritized?',
        answer:
          'One-to-one correspondence is the ability to match each counted object with one, and only one, number word. Our worksheets use distinct, spaced icons that children can physically touch while counting aloud.',
      },
      {
        question: 'Do these math printables progress from counting to writing?',
        answer:
          'Yes. Each counting row incorporates multiple-choice numeral discrimination followed immediately by guided dotted numeral tracing to build muscle memory.',
      },
    ],
  },
  {
    slug: 'thinking-skills',
    title: 'Critical Thinking & Visual Discrimination Worksheets',
    shortTitle: 'Thinking Skills',
    description:
      'Cognitive sorting, odd-one-out categorization, seasonal attribute comparisons, and visual discrimination activities that cultivate early logical reasoning.',
    pedagogicalFocus:
      'Feature analysis, categorical rule deduction, and verbal justification for early learners.',
    targetAges: 'Ages 4–6 (Pre-K to 1st Grade)',
    iconName: 'Brain',
    faqs: [
      {
        question: 'How do odd-one-out worksheets foster critical reasoning?',
        answer:
          'Instead of rote memorization, children must evaluate three or four objects, identify shared categorical attributes (e.g., winter apparel vs. summer gear), and verbally articulate why the outlier does not belong.',
      },
      {
        question: 'How can teachers extend these discrimination worksheets in the classroom?',
        answer:
          'Teachers can use the embedded "Teacher Tip" to ask open-ended questions like: "What season does this item belong to?" or have students draw their own third item that fits the category.',
      },
    ],
  },
  {
    slug: 'esl-vocabulary',
    title: 'ESL / ELL Thematic Vocabulary Sets',
    shortTitle: 'ESL Vocabulary',
    description:
      'Targeted English language acquisition printables featuring high-frequency thematic nouns, Total Physical Response (TPR) prompts, phonics-sound associations, and word tracing.',
    pedagogicalFocus:
      'Oral vocabulary repetition, visual-word association, phoneme articulation, and basic sight word formation.',
    targetAges: 'Ages 3–6 (Multilingual Pre-K & Kindergarten)',
    iconName: 'Languages',
    faqs: [
      {
        question: 'How do ESL vocabulary worksheets differ from standard literacy sheets?',
        answer:
          'ESL worksheets feature larger contextual illustrations, explicit oral sound prompts (such as animal sounds or everyday action words), and integrated TPR physical gestures designed for non-native English speakers.',
      },
      {
        question: 'Are these suitable for bilingual preschool classrooms?',
        answer:
          'Yes. The layout enables educators and parents to present target English words alongside native language comparisons while keeping English phonemic modeling front and center.',
      },
    ],
  },
  {
    slug: 'shapes-colors',
    title: 'Shapes & Colors Early Learning Sheets',
    shortTitle: 'Shapes & Colors',
    description:
      'Fine-motor geometry and color recognition worksheets designed for toddlers, preschoolers, and early kindergarten students.',
    pedagogicalFocus:
      'Geometric attribute recognition (sides, corners), fine-motor line control, and primary/secondary color discrimination.',
    targetAges: 'Ages 3–5 (Toddler to Pre-K)',
    iconName: 'Shapes',
    faqs: [
      {
        question: 'How do shape tracing worksheets support fine motor development?',
        answer:
          'Tracing straight lines, sharp corners, and smooth curves develops the intrinsic hand muscles required for pencil grip, scissor skills, and letter writing.',
      },
    ],
  },
];

export function getCategoryBySlug(slug: string): CategoryMeta | undefined {
  return categories.find((c) => c.slug === slug);
}
