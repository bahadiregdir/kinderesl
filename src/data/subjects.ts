import { SubjectMeta, WorksheetSubject } from '@/types/worksheet';

export const subjects: SubjectMeta[] = [
  {
    slug: 'alphabet',
    title: 'Alphabet & Letter Worksheets',
    shortTitle: 'Alphabet',
    description:
      'Printable letter tracing, uppercase and lowercase recognition, starting dot stroke guides, and Letter of the Week activity packs for preschool and kindergarten learners.',
    targetAges: 'Ages 3–5 (Pre-K & Kindergarten)',
    iconName: 'Type',
    plannedTitles: [],
    faqs: [
      {
        question: 'How do these alphabet worksheets teach stroke directionality?',
        answer:
          'Each letter features numbered starting dots and directional arrows adhering to standard handwriting development sequences (top-to-bottom vertical strokes followed by left-to-right crossbars).',
      },
      {
        question: 'Are both uppercase and lowercase letters practiced together?',
        answer:
          'Yes, each Letter of the Week pack pairs uppercase and lowercase tracing so children learn visual pairing and letter discrimination in context.',
      },
      {
        question: 'Can these alphabet printables be used in ESL classrooms?',
        answer:
          'Yes. Every letter is anchored with high-contrast, universally recognizable visual illustrations (e.g. apple, ant, ball) to build vocabulary alongside letter recognition.',
      },
    ],
  },
  {
    slug: 'phonics',
    title: 'Phonics & Beginning Sounds Worksheets',
    shortTitle: 'Phonics',
    description:
      'Foundational phonemic awareness activities, initial sound identification, rhyming pairs, and CVC word family blending sheets designed for early readers.',
    targetAges: 'Ages 4–6 (Kindergarten & ESL Early Readers)',
    iconName: 'Volume2',
    plannedTitles: [],
    faqs: [
      {
        question: 'How do beginning sound activities build reading readiness?',
        answer:
          'By isolating the initial phoneme of spoken words and matching it to letter symbols, children establish the phonological awareness needed for early decoding.',
      },
      {
        question: 'How can educators adapt these for English Language Learners?',
        answer:
          'Use exaggerated mouth modeling for target phonemes and encourage children to touch the picture anchors while repeating the sound aloud.',
      },
    ],
  },
  {
    slug: 'numbers-counting',
    title: 'Numbers & Counting Worksheets',
    shortTitle: 'Numbers & Counting',
    description:
      'Early math printables developing one-to-one correspondence, number recognition, touch counting, and numeral handwriting formation from 1 to 20.',
    targetAges: 'Ages 3–6 (Preschool & Kindergarten)',
    iconName: 'Hash',
    plannedTitles: [],
    faqs: [
      {
        question: 'What is one-to-one correspondence and why is it important?',
        answer:
          'One-to-one correspondence is the ability to pair each physical object with exactly one spoken numeral. Our printables feature generously spaced items ideal for physical finger counting.',
      },
      {
        question: 'Do these counting sheets include number handwriting practice?',
        answer:
          'Yes, counting sections are paired with dotted number tracing rows with directional start dots to reinforce correct numeral formation.',
      },
    ],
  },
  {
    slug: 'shapes-colors',
    title: 'Shapes & Colors Worksheets',
    shortTitle: 'Shapes & Colors',
    description:
      'Geometric attribute recognition, color identification, pattern completion, and fine-motor tracing activities designed for young learners.',
    targetAges: 'Ages 3–5 (Toddlers & Preschoolers)',
    iconName: 'Shapes',
    plannedTitles: [],
    faqs: [
      {
        question: 'How do shape tracing worksheets prepare children for writing?',
        answer:
          'Tracing straight lines, corners, and curved boundaries exercises the hand and finger muscles required for a functional pencil grasp.',
      },
    ],
  },
  {
    slug: 'vocabulary',
    title: 'ESL Vocabulary Worksheets',
    shortTitle: 'Vocabulary',
    description:
      'High-frequency thematic word sets, match-and-paste cutouts, sound chants, and oral vocabulary printables curated for preschool and ESL classrooms.',
    targetAges: 'Ages 3–6 (Pre-K, Kindergarten & Early ESL)',
    iconName: 'Languages',
    plannedTitles: [],
    faqs: [
      {
        question: 'How are vocabulary words selected for ESL preschool printables?',
        answer:
          'Words focus on high-frequency concrete nouns and actions relevant to children’s immediate physical environment (animals, food, body, classroom objects).',
      },
      {
        question: 'Are teacher prompts included for classroom dialogue?',
        answer:
          'Yes, each sheet includes dedicated Teacher & Parent notes with suggested questions, sound modeling, and TPR gestures.',
      },
    ],
  },
  {
    slug: 'thinking-skills',
    title: 'Thinking Skills Worksheets',
    shortTitle: 'Thinking Skills',
    description:
      'Odd-one-out discrimination, categorization, seasonal sorting, shadow matching, and visual reasoning printables.',
    targetAges: 'Ages 4–6 (Pre-K to 1st Grade)',
    iconName: 'Brain',
    plannedTitles: [],
    faqs: [
      {
        question: 'How do visual discrimination activities build problem solving?',
        answer:
          'Children must analyze visual attributes (shape, function, season, category) and articulate why certain items belong together while others are outliers.',
      },
    ],
  },
];

export function getSubjectBySlug(slug: string): SubjectMeta | undefined {
  return subjects.find((s) => s.slug === slug);
}
