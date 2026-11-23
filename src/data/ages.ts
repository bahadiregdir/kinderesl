import type { AgeBand, FAQItem } from '@/types/worksheet';

export interface AgeBandMeta {
  slug: AgeBand;
  title: string;
  shortTitle: string;
  stageLabel: string;
  description: string;
  skillsFocus: string[];
  classroomTip: string;
  faqs: FAQItem[];
}

export const ageBandsData: AgeBandMeta[] = [
  {
    slug: '3-4',
    title: 'Ages 3–4 Preschool Worksheets',
    shortTitle: 'Ages 3–4 (Preschool)',
    stageLabel: 'Early Preschool · Age 3–4',
    description:
      'Free printable US Letter & A4 worksheets for ages 3–4 featuring large tracing paths, circle-time cards, basic shapes, and counting 1 to 5.',
    skillsFocus: [
      'Large-grip pre-writing lines & simple curves',
      'Counting 1–5 with concrete visual anchors',
      'Core ESL words: colors, body parts, animals',
      'Safe straight-line scissor & glue motor control',
    ],
    classroomTip:
      'At age 3–4, keep table tasks to 5–8 minutes after movement or song routines. Let children finger-trace big outlines before picking up a thick crayon.',
    faqs: [
      {
        question: 'What printable format works best for 3- and 4-year-olds?',
        answer:
          'Pages with wide tracing paths, few items per page, and high-contrast line art work best. Print any KinderESL sheet in US Letter or A4 without edge cropping.',
      },
      {
        question: 'Can ESL beginners use these ages 3–4 worksheets without reading?',
        answer:
          'Yes. Every preschool sheet relies on clear picture prompts and single spoken target words so teachers and parents can model the vocabulary orally first.',
      },
      {
        question: 'How many pages should a preschooler complete in one session?',
        answer:
          'One single-sided page per sitting is plenty. Pair the printable with real classroom objects or flashcards for spoken repetition.',
      },
    ],
  },
  {
    slug: '4-5',
    title: 'Ages 4–5 Pre-K Worksheets',
    shortTitle: 'Ages 4–5 (Pre-K)',
    stageLabel: 'Pre-Kindergarten · Age 4–5',
    description:
      'Free printable Pre-K PDF worksheets for ages 4–5 covering A–Z letter formation, beginning sounds, ten-frame counting, and thematic ESL vocabulary.',
    skillsFocus: [
      'Uppercase & lowercase letter stroke guides',
      'Initial consonant & short-vowel phonemic awareness',
      'One-to-one counting to 5 and ten-frame fluency',
      'Visual discrimination, sorting, and cut-and-paste',
    ],
    classroomTip:
      'Model one row on the board using the exact directional cue you expect children to copy, then circulate during the first 60 seconds to catch awkward pencil grips early.',
    faqs: [
      {
        question: 'What skills do ages 4–5 Pre-K worksheets focus on?',
        answer:
          'Ages 4–5 printables bridge oral English vocabulary with early print awareness: A–Z letter tracing, beginning sounds, visual odd-one-out logic, and ten-frame counting.',
      },
      {
        question: 'Are these Pre-K worksheets available in both US Letter and A4?',
        answer:
          'Yes. Every worksheet page includes a toggle to download high-resolution PDF files sized cleanly for either 8.5×11" US Letter or 210×297mm A4 paper.',
      },
      {
        question: 'Can I laminate the flashcard pages for repeated classroom centers?',
        answer:
          'Yes. Cut-apart flashcards, clip cards, and weather charts hold up across the whole term when printed on cardstock and laminated for dry-erase or clothespin centers.',
      },
    ],
  },
  {
    slug: '5-6',
    title: 'Ages 5–6 Kindergarten Worksheets',
    shortTitle: 'Ages 5–6 (Kindergarten)',
    stageLabel: 'Kindergarten & Early ESL · Age 5–6',
    description:
      'Free printable Kindergarten PDF worksheets for ages 5–6 building phonics decoding, independent letter writing, logic sorting, and classroom ESL fluency.',
    skillsFocus: [
      'Consistent uppercase & lowercase handwriting control',
      'Beginning-sound discrimination & picture-word matching',
      'Independent categorizing & multi-step cut-and-paste',
      'Full-sentence ESL speaking & role-play prompts',
    ],
    classroomTip:
      'Turn finished 5–6 sheets into a two-minute pair-share routine: have students point to each picture and tell a partner the English word or short sentence before transitioning.',
    faqs: [
      {
        question: 'How do KinderESL sheets support 5- to 6-year-old ESL students?',
        answer:
          'Kindergarten learners practice both phonics accuracy and structured oral output using visual prompts, command cards, and guided word-tracing lines.',
      },
      {
        question: 'Are answer choices clear enough for independent morning work?',
        answer:
          'Yes. Clean white space and numbered rows help five- and six-year-olds complete independent centers with minimal teacher interruption after a brief group demo.',
      },
      {
        question: 'Can teachers combine multiple sheets into a take-home packet?',
        answer:
          'Use the Lesson Pack button on any worksheet card to bundle multiple printables into one merged US Letter or A4 PDF download for weekly homework or sub plans.',
      },
    ],
  },
];

export function getAgeBandBySlug(slug: string): AgeBandMeta | undefined {
  return ageBandsData.find((a) => a.slug === slug);
}
