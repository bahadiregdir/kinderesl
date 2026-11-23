import type { ActivityType, FAQItem } from '@/types/worksheet';

export interface ActivityMeta {
  slug: ActivityType;
  title: string;
  shortTitle: string;
  description: string;
  skillsFocus: string[];
  classroomTip: string;
  faqs: FAQItem[];
}

export const activitiesData: ActivityMeta[] = [
  {
    slug: 'tracing',
    title: 'Preschool Tracing Worksheets',
    shortTitle: 'Letter & Line Tracing',
    description:
      'Free printable tracing worksheets for preschool and kindergarten featuring starting dots, A–Z letters, numbers 1–5, shapes, and ESL topic words.',
    skillsFocus: [
      'Fine-motor pencil grip & stroke directionality',
      'Uppercase & lowercase letter formation',
      'Numeral and basic shape control',
    ],
    classroomTip:
      'Have students say the letter sound or target ESL word aloud every time their crayon touches the starting dot so writing and speaking stay connected.',
    faqs: [
      {
        question: 'Do KinderESL tracing worksheets include directional starting dots?',
        answer:
          'Yes. Alphabet and number tracing sheets include clear starting dots and wide dotted paths scaled for preschool and kindergarten hands.',
      },
      {
        question: 'Can children reuse these tracing PDFs in dry-erase sleeves?',
        answer:
          'Yes. Slip any printed US Letter or A4 tracing sheet into a clear plastic sheet protector for daily literacy center warm-ups.',
      },
      {
        question: 'Which ages benefit most from tracing worksheets?',
        answer:
          'Ages 3–4 begin with large shape and word traces, while ages 4–6 build fluency across full A–Z letter packs and numeral lines.',
      },
    ],
  },
  {
    slug: 'coloring',
    title: 'Preschool Coloring Worksheets',
    shortTitle: 'Coloring Pages',
    description:
      'Free printable ESL coloring worksheets combining clean black-and-white illustrations with targeted phonics, color words, counting, and listening tasks.',
    skillsFocus: [
      'Hand strength and boundary awareness',
      'Listen-and-color ESL vocabulary comprehension',
      'Ink-friendly crisp line art for home or school',
    ],
    classroomTip:
      'Turn any coloring page into a guided listening activity: call out "Color the cow brown" or "Find the apple" before opening free coloring time.',
    faqs: [
      {
        question: 'Are KinderESL coloring worksheets printer ink friendly?',
        answer:
          'Yes. Pages use crisp black line art on open white space without heavy dark backgrounds so home and school printers save ink.',
      },
      {
        question: 'How do coloring worksheets support English language learners?',
        answer:
          'Guided coloring gives beginners a low-stress way to demonstrate receptive vocabulary comprehension before they feel ready to speak full sentences.',
      },
      {
        question: 'Can I download coloring sheets in A4 size?',
        answer:
          'Yes. Choose A4 (210×297mm) or US Letter (8.5×11") right before downloading on any worksheet page.',
      },
    ],
  },
  {
    slug: 'cut-and-paste',
    title: 'Cut & Paste Preschool Worksheets',
    shortTitle: 'Cut & Paste',
    description:
      'Free printable cut-and-paste worksheets for preschool and kindergarten building scissor control, bilateral hand coordination, and ESL matching skills.',
    skillsFocus: [
      'Beginner straight-line and curved scissor practice',
      'Hands-on vocabulary sorting & matching',
      'Spatial placement and glue-stick control',
    ],
    classroomTip:
      'Teach "thumb up toward the ceiling" before cutting begins, and ask children to arrange all cut pieces on the target boxes before picking up glue sticks.',
    faqs: [
      {
        question: 'What ages are cut-and-paste worksheets designed for?',
        answer:
          'Straight-line cutting strips are gentle enough for 3-year-olds starting scissor skills, while topic matching cut-and-paste sheets suit ages 4–6.',
      },
      {
        question: 'Can students prepare cut pieces in small groups?',
        answer:
          'Yes. Having each child place trimmed cards in a small tray prevents stray pieces from mixing across shared classroom tables.',
      },
      {
        question: 'Do cut-and-paste pages work in US Letter and A4?',
        answer:
          'Yes. Both paper formats scale cleanly with safe margins so dashed cut boxes never get clipped by home or school printers.',
      },
    ],
  },
  {
    slug: 'matching',
    title: 'Preschool Matching Worksheets',
    shortTitle: 'Matching Activities',
    description:
      'Free printable matching worksheets for early childhood and ESL learners covering uppercase-lowercase letters, animal sounds, and community helpers.',
    skillsFocus: [
      'Visual scanning & cross-page line drawing',
      'Picture-to-concept association & ESL recall',
      'Alphabet case recognition (uppercase to lowercase)',
    ],
    classroomTip:
      'Have young children point from the left item to the right match with their finger and say both words aloud before drawing the connecting line.',
    faqs: [
      {
        question: 'What concepts do your matching worksheets teach?',
        answer:
          'KinderESL matching printables cover uppercase-lowercase letter pairs, farm animals to sound words, tools to community helpers, and weather symbols.',
      },
      {
        question: 'Are non-readers able to complete matching sheets?',
        answer:
          'Yes. Clear illustrated anchors allow non-reading preschoolers to solve visual and thematic matches alongside teacher-modeled spoken English.',
      },
      {
        question: 'How can teachers reuse matching worksheets in centers?',
        answer:
          'Slide a page into a dry-erase pocket with thin whiteboard markers, or place counters/buttons on matching pairs instead of drawing permanent lines.',
      },
    ],
  },
  {
    slug: 'counting',
    title: 'Preschool Counting Worksheets',
    shortTitle: 'Counting Worksheets',
    description:
      'Free printable counting worksheets for preschool and Pre-K focused on numbers 1 to 5, ten frames, one-to-one correspondence, and numeral tracing.',
    skillsFocus: [
      'One-to-one object touch-counting accuracy',
      'Ten-frame visual number sense (1–5)',
      'Numeral recognition & stroke tracing',
    ],
    classroomTip:
      'Encourage children to tap each illustration lightly with one fingertip—or cover each counted item with a cube—before circling or writing the final total.',
    faqs: [
      {
        question: 'Why do KinderESL math sheets focus heavily on numbers 1 to 5?',
        answer:
          'Deep mastery of 1–5 with ten frames and subitizing builds solid one-to-one correspondence before rushing preschoolers to larger teen numbers.',
      },
      {
        question: 'How do counting printables support ESL classrooms?',
        answer:
          'Number activities combine spoken English plurals and seasonal nouns (like mittens, snowflakes, or ladybugs) with clear visual math prompts.',
      },
      {
        question: 'Are counting worksheets available as single PDFs or bundles?',
        answer:
          'Download any counting worksheet individually in US Letter or A4, or combine multiple sheets using Lesson Pack.',
      },
    ],
  },
  {
    slug: 'odd-one-out',
    title: 'Odd One Out Logic Worksheets',
    shortTitle: 'Odd One Out Logic',
    description:
      'Free printable odd-one-out visual discrimination worksheets for preschool and kindergarten developing categorization, critical thinking, and ESL naming.',
    skillsFocus: [
      'Visual discrimination across rows of items',
      'Category reasoning (e.g., winter vs. summer gear)',
      'Spoken explanation of "why it does not belong"',
    ],
    classroomTip:
      'Ask every child to explain *why* the crossed-out item does not belong in simple English (for example, "Shorts are for summer, not snow!").',
    faqs: [
      {
        question: 'Why are odd-one-out activities valuable in preschool ESL?',
        answer:
          'They develop classification logic while prompting genuine oral English practice as students name items in each set and identify the outlier.',
      },
      {
        question: 'What age group works best with odd-one-out worksheets?',
        answer:
          'Children ages 4–6 excel at visual row discrimination, especially when pictures connect to real seasonal or classroom topics.',
      },
      {
        question: 'Can odd-one-out pages be used as quick assessment checks?',
        answer:
          'Yes. Reviewing a 3-row or 4-row sheet shows immediately which students recognize category rules and target vocabulary words.',
      },
    ],
  },
  {
    slug: 'flashcards',
    title: 'ESL Flashcards for Preschool',
    shortTitle: 'ESL Flashcards',
    description:
      'Free printable ESL flashcards and visual schedule cards for preschool circle time covering colors, body parts, weather, feelings, clothes, and TPR actions.',
    skillsFocus: [
      'Rapid oral recall & carpet-time choral chants',
      'Classroom routine & visual schedule cues',
      'Multisensory TPR games (flash, slap, hide-and-seek)',
    ],
    classroomTip:
      'Print two copies of any flashcard sheet on cardstock to unlock instant memory-match, grab-the-card, and partner swap games in large or small groups.',
    faqs: [
      {
        question: 'What topics are covered in KinderESL printable flashcards?',
        answer:
          'Our collection includes colors, classroom objects, feelings, weather, body parts, winter vocabulary, winter clothes, community helpers, and TPR commands.',
      },
      {
        question: 'How big should preschool ESL flashcards be printed?',
        answer:
          'For carpet circle time, print at 100% scale on US Letter or A4 cardstock; for tabletop partner games, use your PDF viewer to print 2 pages per sheet.',
      },
      {
        question: 'Are flashcard packs free for school and homeschool use?',
        answer:
          'Yes. All printable flashcards on KinderESL are 100% free for teachers, tutors, and parents for non-commercial classroom and home instruction.',
      },
    ],
  },
];

export function getActivityBySlug(slug: string): ActivityMeta | undefined {
  return activitiesData.find((a) => a.slug === slug);
}
