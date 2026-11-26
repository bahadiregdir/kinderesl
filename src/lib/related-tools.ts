import type { Worksheet } from '@/types/worksheet';

export interface RelatedToolLink {
  href: string;
  title: string;
  subtitle: string;
  badge: string;
}

interface MatchedTheme {
  id: string;
  label: string;
}

const BINGO_THEMES = new Set([
  'farm',
  'winter',
  'classroom',
  'animals',
  'food',
  'routines',
  'fall',
  'halloween',
  'spring',
  'valentines',
  'summer',
  'weather',
  'transport',
  'clothes',
  'nature',
  'pic-winter-christmas',
  'pic-animals-farm',
  'cvc',
]);

const MATCHING_THEMES = new Set([
  'farm',
  'winter',
  'classroom',
  'animals',
  'food',
  'christmas',
  'body',
  'feelings',
  'helpers',
  'fall',
  'halloween',
  'spring',
  'valentines',
  'summer',
  'weather',
  'transport',
  'clothes',
  'nature',
  'cvc',
]);

const WORD_SEARCH_THEMES = MATCHING_THEMES;
const CLIP_CARD_THEMES = MATCHING_THEMES;

const TOPIC_TO_THEME: Array<[string, MatchedTheme]> = [
  ['farm-animals', { id: 'farm', label: 'Farm Animals' }],
  ['winter', { id: 'winter', label: 'Winter' }],
  ['clothes', { id: 'clothes', label: 'Clothes' }],
  ['weather', { id: 'weather', label: 'Weather' }],
  ['body', { id: 'body', label: 'Body Parts' }],
  ['community-helpers', { id: 'helpers', label: 'Community Helpers' }],
  ['transportation', { id: 'transport', label: 'Transportation' }],
  ['food', { id: 'food', label: 'Food' }],
  ['insects', { id: 'animals', label: 'Animals & Bugs' }],
  ['fall', { id: 'fall', label: 'Fall' }],
  ['spring', { id: 'spring', label: 'Spring' }],
  ['summer', { id: 'summer', label: 'Summer' }],
  ['nature', { id: 'nature', label: 'Nature' }],
  ['halloween', { id: 'halloween', label: 'Halloween' }],
  ['valentines', { id: 'valentines', label: 'Valentine’s' }],
  ['christmas', { id: 'christmas', label: 'Christmas' }],
];

const MONTH_TOOLS: Record<string, RelatedToolLink[]> = {
  january: [
    {
      href: '/tools/i-spy-maker?theme=winter',
      title: 'Winter I Spy & Count',
      subtitle: 'Find and count snowflakes, mittens, hats, and snowmen with a Page 2 Answer Key.',
      badge: 'Winter',
    },
    {
      href: '/tools/flashcard-maker?theme=winter',
      title: 'Winter Picture Flashcards',
      subtitle: 'Print 2×2 or 3×3 winter picture and traceable word decks in US Letter or A4.',
      badge: 'Flashcards',
    },
    {
      href: '/tools/bingo-maker?theme=winter',
      title: 'Winter Picture Bingo',
      subtitle: 'Generate up to 30 unique shuffled winter bingo cards plus a caller checklist.',
      badge: 'Bingo',
    },
    {
      href: '/tools/word-search-maker?theme=clothes',
      title: 'Winter Clothes Word Search',
      subtitle: 'Kid-friendly across/down word puzzle with illustrated Picture Word Bank.',
      badge: 'Word Search',
    },
  ],
  february: [
    {
      href: '/tools/clip-cards-maker?theme=valentines',
      title: 'Valentine’s Beginning Sounds Clip Cards',
      subtitle: 'Clothespin phonics cards featuring hearts, cards, roses, and friendship words.',
      badge: 'Valentine’s',
    },
    {
      href: '/tools/i-spy-maker?theme=valentines',
      title: 'Valentine’s I Spy & Count',
      subtitle: 'Count and color Valentine icons on one cozy printable sheet + Answer Key.',
      badge: 'I Spy',
    },
    {
      href: '/tools/flashcard-maker?theme=helpers',
      title: 'Community Helpers Flashcards',
      subtitle: 'Printable doctor, firefighter, teacher, and helper vocabulary cards.',
      badge: 'Helpers',
    },
    {
      href: '/tools/matching-maker?theme=feelings',
      title: 'Feelings Picture Matching',
      subtitle: 'Draw-a-line social-emotional matching for happy, sad, excited, and calm.',
      badge: 'SEL',
    },
  ],
  march: [
    {
      href: '/tools/flashcard-maker?theme=weather',
      title: 'Spring Weather Flashcards',
      subtitle: 'Introduce sunny, windy, rainy, cloudy, and rainbow vocabulary at circle time.',
      badge: 'Weather',
    },
    {
      href: '/tools/bingo-maker?theme=spring',
      title: 'Spring Picture Bingo',
      subtitle: 'Small-group listening bingo pre-loaded with spring flowers, bees, and kites.',
      badge: 'Spring',
    },
    {
      href: '/tools/i-spy-maker?theme=farm',
      title: 'Farm Animals I Spy & Count',
      subtitle: 'Visual discrimination and counting practice with classic barnyard animals.',
      badge: 'Farm',
    },
    {
      href: '/tools/matching-maker?theme=spring',
      title: 'Spring Picture Matching',
      subtitle: 'Connect spring drawings to printed words or beginning letters.',
      badge: 'Phonics',
    },
  ],
  april: [
    {
      href: '/tools/i-spy-maker?theme=spring',
      title: 'Spring Garden I Spy & Count',
      subtitle: 'Find, color, and count spring flowers, umbrellas, butterflies, and frogs.',
      badge: 'Spring',
    },
    {
      href: '/tools/flashcard-maker?theme=nature',
      title: 'Nature & Earth Day Flashcards',
      subtitle: 'Teach tree, leaf, sun, river, and mountain words with coloring-friendly line art.',
      badge: 'Nature',
    },
    {
      href: '/tools/word-search-maker?theme=spring',
      title: 'Spring Picture Word Search',
      subtitle: 'Gentle 6×6 or 8×8 word search with spring picture clues for early readers.',
      badge: 'Word Search',
    },
    {
      href: '/tools/clip-cards-maker?theme=weather',
      title: 'Weather Clip Cards',
      subtitle: 'Match beginning consonant sounds to rainy, sunny, cloudy, and snowy cards.',
      badge: 'Weather',
    },
  ],
  may: [
    {
      href: '/tools/bingo-maker?theme=animals',
      title: 'Animals & Bugs Picture Bingo',
      subtitle: 'Pre-loaded animal and bug boards ready for end-of-spring ESL circle games.',
      badge: 'Animals',
    },
    {
      href: '/tools/flashcard-maker?theme=transport',
      title: 'Transportation Flashcards',
      subtitle: 'Teach bus, train, boat, airplane, and bike words for May travel themes.',
      badge: 'Transport',
    },
    {
      href: '/tools/matching-maker?theme=spring',
      title: 'Spring Picture Matching',
      subtitle: 'Pair colorful spring drawings with beginner words or starting letters.',
      badge: 'Matching',
    },
    {
      href: '/tools/i-spy-maker?theme=nature',
      title: 'Outdoor Nature I Spy',
      subtitle: 'Count outdoor nature drawings for Earth and spring science centers.',
      badge: 'Nature',
    },
  ],
  june: [
    {
      href: '/tools/i-spy-maker?theme=summer',
      title: 'Summer Beach I Spy & Count',
      subtitle: 'Count shells, sun hats, beach balls, and popsicles with included Answer Key.',
      badge: 'Summer',
    },
    {
      href: '/tools/bingo-maker?theme=summer',
      title: 'Summer Picture Bingo',
      subtitle: 'Shuffled 3×3 or 4×4 summer vocabulary boards for camps and review weeks.',
      badge: 'Bingo',
    },
    {
      href: '/tools/flashcard-maker?theme=summer',
      title: 'Summer Vocabulary Flashcards',
      subtitle: 'Coloring-friendly beach and warm-weather flashcards in 2×2 or 3×3 layouts.',
      badge: 'Flashcards',
    },
    {
      href: '/tools/word-search-maker?theme=summer',
      title: 'Summer Picture Word Search',
      subtitle: 'Low-stress 6×6 or 8×8 summer word hunt with visual Word Bank.',
      badge: 'Word Search',
    },
  ],
  july: [
    {
      href: '/tools/bingo-maker?theme=summer',
      title: 'Summer Camp Picture Bingo',
      subtitle: 'Print up to 30 unique summer bingo sheets with a teacher caller guide.',
      badge: 'Summer',
    },
    {
      href: '/tools/i-spy-maker?theme=food',
      title: 'Picnic & Food I Spy & Count',
      subtitle: 'Engaging summer picnic counting sheet featuring favorite kid food drawings.',
      badge: 'Food',
    },
    {
      href: '/tools/word-search-maker?theme=summer',
      title: 'Summer Fun Word Search',
      subtitle: 'Screen-free summer word puzzle with left-to-right and top-to-bottom words.',
      badge: 'Word Search',
    },
    {
      href: '/tools/number-tracing',
      title: 'Number Tracing 0–20 & Ten-Frames',
      subtitle: 'Keep preschool math warm all summer with Ten-Frame counting and tracing.',
      badge: 'Math',
    },
  ],
  august: [
    {
      href: '/tools/name-tracing',
      title: 'Custom Name Tracing Maker',
      subtitle: 'Batch-generate personalized name tracing sheets for your whole new class list.',
      badge: 'Back to School',
    },
    {
      href: '/tools/flashcard-maker?theme=classroom',
      title: 'Classroom Objects Flashcards',
      subtitle: 'Label cubbies and teach crayon, desk, book, and scissors from Day 1.',
      badge: 'Classroom',
    },
    {
      href: '/tools/bingo-maker?theme=classroom',
      title: 'Back-to-School Picture Bingo',
      subtitle: 'Warm-up school supplies bingo to build listening confidence in week one.',
      badge: 'Bingo',
    },
    {
      href: '/tools/flashcard-maker?theme=routines',
      title: 'Daily Routines Flashcards',
      subtitle: 'Build a visual morning schedule for circle time, snack, and clean-up.',
      badge: 'Routines',
    },
  ],
  september: [
    {
      href: '/tools/letter-tracing',
      title: 'A–Z Letter Tracing Generator',
      subtitle: 'Launch Letter of the Week with SATPIN groups or the full 26-letter pack.',
      badge: 'Alphabet',
    },
    {
      href: '/tools/name-tracing',
      title: 'Class Name Tracing Pack',
      subtitle: 'Create daily morning sign-in tracing sheets for up to 30 students at once.',
      badge: 'Names',
    },
    {
      href: '/tools/i-spy-maker?theme=fall',
      title: 'Fall & Apple Harvest I Spy',
      subtitle: 'Find and count apples, acorns, leaves, and pumpkins with auto Answer Key.',
      badge: 'Fall',
    },
    {
      href: '/tools/bingo-maker?theme=farm',
      title: 'Farm Animals Picture Bingo',
      subtitle: 'Classic September farm animal vocabulary bingo in 3×3 or 4×4 grids.',
      badge: 'Farm',
    },
  ],
  october: [
    {
      href: '/tools/i-spy-maker?theme=halloween',
      title: 'Halloween I Spy & Count',
      subtitle: 'Kid-friendly pumpkins, bats, owls, and ghosts in a clean counting puzzle.',
      badge: 'Halloween',
    },
    {
      href: '/tools/bingo-maker?theme=halloween',
      title: 'Halloween Picture Bingo',
      subtitle: 'Shuffled classroom Halloween bingo boards plus a printable caller sheet.',
      badge: 'Bingo',
    },
    {
      href: '/tools/flashcard-maker?theme=fall',
      title: 'Fall & Autumn Flashcards',
      subtitle: 'Teach autumn leaves, squirrel, acorn, apple, and sweater vocabulary.',
      badge: 'Fall',
    },
    {
      href: '/tools/word-search-maker?theme=halloween',
      title: 'Halloween Picture Word Search',
      subtitle: 'Easy 6×6 or 8×8 Halloween word search paired with a Picture Word Bank.',
      badge: 'Word Search',
    },
  ],
  november: [
    {
      href: '/tools/i-spy-maker?theme=fall',
      title: 'Fall Harvest I Spy & Count',
      subtitle: 'Spot and count autumn harvest icons while building 1-to-1 counting.',
      badge: 'Fall',
    },
    {
      href: '/tools/flashcard-maker?theme=food',
      title: 'Food & Meals Flashcards',
      subtitle: 'Introduce healthy food words for November gratitude and family table units.',
      badge: 'Food',
    },
    {
      href: '/tools/bingo-maker?theme=fall',
      title: 'Autumn Picture Bingo',
      subtitle: 'Listening review bingo featuring cozy fall nature and harvest words.',
      badge: 'Bingo',
    },
    {
      href: '/tools/matching-maker?theme=food',
      title: 'Food Picture Matching',
      subtitle: 'Connect familiar fruit and meal illustrations to printed English words.',
      badge: 'Matching',
    },
  ],
  december: [
    {
      href: '/tools/i-spy-maker?theme=christmas',
      title: 'Christmas I Spy & Count',
      subtitle: 'Count bells, trees, stockings, stars, and gifts with an included Answer Key.',
      badge: 'Christmas',
    },
    {
      href: '/tools/bingo-maker?theme=pic-winter-christmas',
      title: 'Winter & Christmas Picture Bingo',
      subtitle: 'Festive winter & holiday bingo deck ready for December classroom parties.',
      badge: 'Bingo',
    },
    {
      href: '/tools/word-search-maker?theme=christmas',
      title: 'Christmas Picture Word Search',
      subtitle: 'Beginner-friendly holiday word search with illustrated Picture Word Bank.',
      badge: 'Word Search',
    },
    {
      href: '/tools/flashcard-maker?theme=winter',
      title: 'Winter & Snow Flashcards',
      subtitle: 'Printable snowman, mitten, sled, and snowflake cards in US Letter or A4.',
      badge: 'Winter',
    },
  ],
};

function detectWorksheetTheme(worksheet: Worksheet): MatchedTheme | null {
  const haystack = `${worksheet.slug} ${worksheet.title}`.toLowerCase();

  if (haystack.includes('valentine')) {
    return { id: 'valentines', label: 'Valentine’s' };
  }
  if (haystack.includes('christmas')) {
    return { id: 'christmas', label: 'Christmas' };
  }
  if (haystack.includes('halloween')) {
    return { id: 'halloween', label: 'Halloween' };
  }
  if (haystack.includes('feeling')) {
    return { id: 'feelings', label: 'Feelings' };
  }
  if (haystack.includes('schedule') || haystack.includes('routine')) {
    return { id: 'routines', label: 'Daily Routines' };
  }
  if (haystack.includes('classroom') || haystack.includes('tpr')) {
    return { id: 'classroom', label: 'Classroom' };
  }

  for (const [topicSlug, theme] of TOPIC_TO_THEME) {
    if (worksheet.topics.includes(topicSlug)) {
      return theme;
    }
  }

  return null;
}

export function getRelatedToolsForMonth(monthSlug: string): RelatedToolLink[] {
  const key = monthSlug.toLowerCase();
  return MONTH_TOOLS[key] ?? MONTH_TOOLS.september;
}

export function getRelatedToolsForWorksheet(worksheet: Worksheet): RelatedToolLink[] {
  const theme = detectWorksheetTheme(worksheet);
  const haystack = `${worksheet.slug} ${worksheet.title}`.toLowerCase();

  if (worksheet.subject === 'alphabet') {
    return [
      {
        href: '/tools/letter-tracing',
        title: 'A–Z Letter Tracing Generator',
        subtitle: 'Print single letters, SATPIN groups, or the full 26-letter tracing pack.',
        badge: 'Alphabet',
      },
      {
        href: '/tools/clip-cards-maker',
        title: 'Beginning Sounds Clip Cards',
        subtitle: 'Pair tracing with hands-on clothespin initial letter sound cards.',
        badge: 'Phonics',
      },
      {
        href: '/tools/name-tracing',
        title: 'Custom Name Tracing Maker',
        subtitle: 'Turn each student’s own name into daily dashed letter practice.',
        badge: 'Names',
      },
    ];
  }

  if (worksheet.subject === 'phonics') {
    return [
      {
        href: '/tools/clip-cards-maker?theme=cvc',
        title: 'CVC Beginning Sounds Clip Cards',
        subtitle: 'Build 2×2 or 2×3 clothespin phonics cards with a teacher Answer Key.',
        badge: 'CVC Phonics',
      },
      {
        href: '/tools/matching-maker?theme=cvc',
        title: 'CVC Picture & Letter Matching',
        subtitle: 'Match CVC pictures to target words or beginning consonant letters.',
        badge: 'Matching',
      },
      {
        href: '/tools/handwriting-maker',
        title: 'Sight Word & CVC Handwriting Maker',
        subtitle: 'Generate Read-Trace-Write practice sheets from CVC word families.',
        badge: 'Handwriting',
      },
    ];
  }

  if (worksheet.subject === 'numbers-counting') {
    return [
      {
        href: '/tools/number-tracing',
        title: 'Number Tracing 0–20 & Ten-Frames',
        subtitle: 'Practice numeral formation alongside Ten-Frames and number words.',
        badge: 'Counting',
      },
      {
        href: theme ? `/tools/i-spy-maker?theme=${theme.id}` : '/tools/i-spy-maker',
        title: theme ? `${theme.label} I Spy & Count` : 'I Spy & Count Worksheet Maker',
        subtitle: 'Reinforce 1-to-1 counting with a custom find-and-count picture puzzle.',
        badge: 'I Spy',
      },
      {
        href: '/tools/handwriting-maker',
        title: 'Number Words Handwriting Maker',
        subtitle: 'Create Read-Trace-Write rows for one, two, three, four, and five.',
        badge: 'Writing',
      },
    ];
  }

  if (worksheet.subject === 'shapes-colors') {
    if (haystack.includes('shape')) {
      return [
        {
          href: '/tools/flashcard-maker',
          title: 'Shapes Picture Flashcards',
          subtitle: 'Pick shapes drawings to print custom 2×2 or 3×3 classroom flashcard decks.',
          badge: 'Flashcards',
        },
        {
          href: '/tools/matching-maker',
          title: 'Shapes Picture Matching',
          subtitle: 'Create draw-a-line matching sheets pairing shape illustrations and names.',
          badge: 'Matching',
        },
        {
          href: '/tools/i-spy-maker',
          title: 'Shapes I Spy & Count',
          subtitle: 'Build a visual find-and-count sheet from preschool shape illustrations.',
          badge: 'I Spy',
        },
      ];
    }

    return [
      {
        href: '/tools/flashcard-maker',
        title: 'ESL Picture Flashcard Maker',
        subtitle: 'Build custom visual decks for color-sorting and circle-time games.',
        badge: 'Flashcards',
      },
      {
        href: '/tools/handwriting-maker',
        title: 'Color Words Handwriting Maker',
        subtitle: 'Turn red, blue, yellow, green, and orange into Read-Trace-Write rows.',
        badge: 'Writing',
      },
      {
        href: '/tools/bingo-maker',
        title: 'Picture & Word Bingo Maker',
        subtitle: 'Run quick listening color and vocabulary bingo rounds for small groups.',
        badge: 'Bingo',
      },
    ];
  }

  if (worksheet.subject === 'thinking-skills') {
    if (theme) {
      return [
        {
          href: `/tools/pattern-maker?theme=${theme.id}`,
          title: `${theme.label} Cut & Paste Patterns`,
          subtitle: 'Build AB, AAB, or ABC cut-and-paste sequencing rows with themed drawings.',
          badge: 'Patterns',
        },
        {
          href: `/tools/i-spy-maker?theme=${theme.id}`,
          title: `${theme.label} I Spy & Count`,
          subtitle: 'Build visual scanning and counting accuracy with themed line art.',
          badge: 'Visual Scan',
        },
        MATCHING_THEMES.has(theme.id)
          ? {
              href: `/tools/matching-maker?theme=${theme.id}`,
              title: `${theme.label} Picture Matching`,
              subtitle: 'Draw lines connecting matching pictures to printed words or letters.',
              badge: 'Matching',
            }
          : {
              href: `/tools/flashcard-maker?theme=${theme.id}`,
              title: `${theme.label} Picture Flashcards`,
              subtitle: 'Print sorting and odd-one-out discussion cards for centers.',
              badge: 'Flashcards',
            },
      ];
    }

    return [
      {
        href: '/tools/pattern-maker',
        title: 'Cut & Paste Pattern Maker',
        subtitle: 'Follow scissor strips with AB, AAB, ABB, and ABC cut-and-glue patterns.',
        badge: 'Cut & Paste',
      },
      {
        href: '/tools/mini-book-maker',
        title: 'Foldable Mini-Book Maker',
        subtitle: 'Cut and fold a personal coloring and early reading mini-booklet.',
        badge: 'Mini-Books',
      },
      {
        href: '/tools/name-tracing',
        title: 'Custom Name Tracing Maker',
        subtitle: 'Extend fine-motor pencil control to every child’s own printed name.',
        badge: 'Fine Motor',
      },
    ];
  }

  // Vocabulary and fallback
  if (theme) {
    const label = theme.label;
    const isBingoSheet = haystack.includes('bingo');
    const isFlashcardSheet = worksheet.activityTypes.includes('flashcards');

    if (isBingoSheet) {
      return [
        {
          href: `/tools/flashcard-maker?theme=${theme.id}`,
          title: `${label} Picture Flashcards`,
          subtitle: 'Pre-teach the exact target vocabulary before playing small-group bingo.',
          badge: 'Flashcards',
        },
        {
          href: `/tools/i-spy-maker?theme=${theme.id}`,
          title: `${label} I Spy & Count`,
          subtitle: 'Follow listening bingo with a calm find-and-count review sheet.',
          badge: 'I Spy',
        },
        MATCHING_THEMES.has(theme.id)
          ? {
              href: `/tools/matching-maker?theme=${theme.id}`,
              title: `${label} Picture Matching`,
              subtitle: 'Turn the same themed nouns into a draw-a-line worksheet.',
              badge: 'Matching',
            }
          : {
              href: `/tools/bingo-maker?theme=${theme.id}`,
              title: `Custom ${label} Bingo Decks`,
              subtitle: 'Generate up to 30 fresh shuffled bingo cards for larger classes.',
              badge: 'Bingo',
            },
      ];
    }

    if (theme.id === 'routines') {
      return [
        {
          href: '/tools/flashcard-maker?theme=routines',
          title: 'Daily Routines Flashcards',
          subtitle: 'Customize 2×2 or 3×3 routine cards to match your exact class schedule.',
          badge: 'Routines',
        },
        {
          href: '/tools/bingo-maker?theme=routines',
          title: 'Daily Routines Picture Bingo',
          subtitle: 'Review morning, snack, story, and tidy-up phrases with 3×3 bingo.',
          badge: 'Bingo',
        },
        {
          href: '/tools/i-spy-maker?theme=routines',
          title: 'Daily Routines I Spy & Count',
          subtitle: 'Reinforce everyday action nouns on a quick coloring & counting page.',
          badge: 'I Spy',
        },
      ];
    }

    if (theme.id === 'christmas') {
      return [
        {
          href: '/tools/i-spy-maker?theme=christmas',
          title: 'Christmas I Spy & Count',
          subtitle: 'Count stars, bells, gifts, and trees with an included Page 2 Answer Key.',
          badge: 'Christmas',
        },
        {
          href: '/tools/bingo-maker?theme=pic-winter-christmas',
          title: 'Winter & Christmas Picture Bingo',
          subtitle: 'Play inclusive holiday listening bingo with up to 30 shuffled boards.',
          badge: 'Bingo',
        },
        {
          href: '/tools/word-search-maker?theme=christmas',
          title: 'Christmas Picture Word Search',
          subtitle: 'Easy 6×6 or 8×8 festive word search with Picture Word Bank.',
          badge: 'Word Search',
        },
      ];
    }

    if (BINGO_THEMES.has(theme.id)) {
      if (isFlashcardSheet) {
        return [
          {
            href: `/tools/bingo-maker?theme=${theme.id}`,
            title: `${label} Picture Bingo`,
            subtitle: 'Practice these flashcards aloud in a lively 3×3 or 4×4 bingo round.',
            badge: 'Bingo',
          },
          {
            href: `/tools/i-spy-maker?theme=${theme.id}`,
            title: `${label} I Spy & Count`,
            subtitle: 'Count and color the same unit vocabulary on an independent center sheet.',
            badge: 'I Spy',
          },
          {
            href: `/tools/matching-maker?theme=${theme.id}`,
            title: `${label} Picture Matching`,
            subtitle: 'Check retention by matching pictures to words or starting letters.',
            badge: 'Matching',
          },
        ];
      }

      return [
        {
          href: `/tools/flashcard-maker?theme=${theme.id}`,
          title: `${label} Picture Flashcards`,
          subtitle: 'Print large 2×2 or 3×3 picture cards for carpet introductions and TPR.',
          badge: 'Flashcards',
        },
        {
          href: `/tools/bingo-maker?theme=${theme.id}`,
          title: `${label} Picture Bingo`,
          subtitle: 'Create up to 30 unique listening bingo boards + caller checklist.',
          badge: 'Bingo',
        },
        {
          href: `/tools/i-spy-maker?theme=${theme.id}`,
          title: `${label} I Spy & Count`,
          subtitle: 'Wrap up the unit with find-and-count practice + Page 2 Answer Key.',
          badge: 'I Spy',
        },
      ];
    }

    // Themes supported by matching/i-spy/clip-cards/word-search/flashcards (e.g. body, feelings, helpers)
    return [
      {
        href: `/tools/i-spy-maker?theme=${theme.id}`,
        title: `${label} I Spy & Count`,
        subtitle: `Let children spot, color, and count ${label.toLowerCase()} drawings.`,
        badge: 'I Spy',
      },
      {
        href: `/tools/matching-maker?theme=${theme.id}`,
        title: `${label} Picture Matching`,
        subtitle: 'Draw lines from crisp illustrations to words or beginning letters.',
        badge: 'Matching',
      },
      isFlashcardSheet && CLIP_CARD_THEMES.has(theme.id)
        ? {
            href: `/tools/clip-cards-maker?theme=${theme.id}`,
            title: `${label} Clip Cards`,
            subtitle: 'Turn the unit vocabulary into tactile beginning-sound clothespin cards.',
            badge: 'Clip Cards',
          }
        : {
            href: `/tools/flashcard-maker?theme=${theme.id}`,
            title: `${label} Picture Flashcards`,
            subtitle: 'Generate 2×2, 2×3, or 3×3 printable cards with optional traceable words.',
            badge: 'Flashcards',
          },
    ];
  }

  return [
    {
      href: '/tools/flashcard-maker',
      title: 'ESL Picture Flashcard Maker',
      subtitle: 'Pick from 176 line-art drawings or upload custom photos in 2×2 to 3×3 cards.',
      badge: 'Flashcards',
    },
    {
      href: '/tools/bingo-maker',
      title: 'ESL Picture & Word Bingo Maker',
      subtitle: 'Generate up to 30 shuffled student boards with a Teacher Caller Checklist.',
      badge: 'Bingo',
    },
    {
      href: '/tools/matching-maker',
      title: 'Picture & Phonics Matching Maker',
      subtitle: 'Build custom draw-a-line vocabulary sheets with an automatic Answer Key.',
      badge: 'Matching',
    },
  ];
}

export function getRelatedToolsForActivity(activitySlug: string): RelatedToolLink[] {
  switch (activitySlug.toLowerCase()) {
    case 'tracing':
      return [
        {
          href: '/tools/letter-tracing',
          title: 'A–Z Letter Tracing Generator',
          subtitle: 'Single letters, SATPIN groups, or all 26 pages with directional starting dots.',
          badge: 'Letters',
        },
        {
          href: '/tools/name-tracing',
          title: 'Custom Name Tracing Maker',
          subtitle: 'Batch up to 30 student names with Title Case, UPPER, and starting dots.',
          badge: 'Names',
        },
        {
          href: '/tools/number-tracing',
          title: 'Number Tracing 0–20 & Ten-Frames',
          subtitle: 'Practice 0–10 or 0–20 numerals paired with Ten-Frames and number words.',
          badge: 'Numbers',
        },
        {
          href: '/tools/handwriting-maker',
          title: 'Sight Word & Handwriting Maker',
          subtitle: 'Create Read-Trace-Write practice rows for Dolch words and CVC lists.',
          badge: 'Sight Words',
        },
      ];
    case 'coloring':
      return [
        {
          href: '/tools/mini-book-maker',
          title: 'Foldable Mini-Book Maker',
          subtitle: 'Create colorable Half-Page or 1-Sheet 8-Panel emergent ESL readers.',
          badge: 'Mini-Book',
        },
        {
          href: '/tools/i-spy-maker',
          title: 'I Spy & Count Worksheet Maker',
          subtitle: 'Find, color, and count black-ink illustrations with an included Answer Key.',
          badge: 'I Spy',
        },
        {
          href: '/tools/flashcard-maker',
          title: 'ESL Picture Flashcard Maker',
          subtitle: 'Print coloring-friendly vocabulary decks from 176 original drawings.',
          badge: 'Flashcards',
        },
        {
          href: '/tools/pattern-maker',
          title: 'Cut & Paste Pattern Maker',
          subtitle: 'Color, cut, and glue AB, AAB, ABB, and ABC math pattern sequences.',
          badge: 'Patterns',
        },
      ];
    case 'cut-and-paste':
      return [
        {
          href: '/tools/pattern-maker',
          title: 'Cut & Paste Pattern Maker',
          subtitle: 'Generate AB, AAB, ABB, and ABC sequencing sheets with scissor cut tiles.',
          badge: 'Patterns',
        },
        {
          href: '/tools/mini-book-maker',
          title: 'Foldable Mini-Book Maker',
          subtitle: 'Cut along center guides to build Half-Page booklets or 8-panel zines.',
          badge: 'Mini-Books',
        },
        {
          href: '/tools/clip-cards-maker',
          title: 'Beginning Sounds Clip Cards',
          subtitle: 'Print and cut 2×2 or 2×3 clothespin phonics cards with dashed guides.',
          badge: 'Clip Cards',
        },
        {
          href: '/tools/domino-maker',
          title: 'Picture Dominoes & Memory Maker',
          subtitle: 'Cut apart closed-loop domino chains or 3×4 Memory Match card decks.',
          badge: 'Dominoes',
        },
      ];
    case 'matching':
      return [
        {
          href: '/tools/matching-maker',
          title: 'Picture & Phonics Matching Maker',
          subtitle: 'Build draw-a-line Picture↔Word and Picture↔Letter sheets + Answer Key.',
          badge: 'Matching',
        },
        {
          href: '/tools/domino-maker',
          title: 'Picture Dominoes & Memory Maker',
          subtitle: 'Turn vocabulary into closed-loop Picture↔Word dominoes or Memory pairs.',
          badge: 'Dominoes',
        },
        {
          href: '/tools/clip-cards-maker',
          title: 'Beginning Sounds Clip Cards',
          subtitle: 'Match clear illustrations to beginning letter sounds with clothespins.',
          badge: 'Clip Cards',
        },
        {
          href: '/tools/flashcard-maker',
          title: 'ESL Picture Flashcard Maker',
          subtitle: 'Print matching picture and word sets for tabletop memory and sorting.',
          badge: 'Flashcards',
        },
      ];
    case 'counting':
      return [
        {
          href: '/tools/number-tracing',
          title: 'Number Tracing 0–20 & Ten-Frames',
          subtitle: 'Pair guided numeral formation with visual Ten-Frame counting grids.',
          badge: 'Ten-Frames',
        },
        {
          href: '/tools/i-spy-maker',
          title: 'I Spy & Count Worksheet Maker',
          subtitle: 'Practice 1-to-1 counting on scattered picture sheets + Answer Key.',
          badge: 'I Spy',
        },
        {
          href: '/tools/pattern-maker',
          title: 'Cut & Paste Pattern Maker',
          subtitle: 'Develop early algebraic sequence reasoning with AB and ABC patterns.',
          badge: 'Patterns',
        },
        {
          href: '/tools/bingo-maker',
          title: 'ESL Picture & Word Bingo Maker',
          subtitle: 'Build visual recognition in small groups up to 30 unique boards.',
          badge: 'Bingo',
        },
      ];
    case 'odd-one-out':
      return [
        {
          href: '/tools/pattern-maker',
          title: 'Cut & Paste Pattern Maker',
          subtitle: 'Spot repeating visual rules (AB, AAB, ABB, ABC) and glue what comes next.',
          badge: 'Logic',
        },
        {
          href: '/tools/i-spy-maker',
          title: 'I Spy & Count Worksheet Maker',
          subtitle: 'Sharpen visual discrimination in busy themed picture search fields.',
          badge: 'Visual Scan',
        },
        {
          href: '/tools/matching-maker',
          title: 'Picture & Phonics Matching Maker',
          subtitle: 'Compare features across columns to match pictures to words or sounds.',
          badge: 'Matching',
        },
        {
          href: '/tools/word-search-maker',
          title: 'Easy Picture Word Search Maker',
          subtitle: 'Scan 6×6 and 8×8 letter grids paired with an illustrated Word Bank.',
          badge: 'Word Search',
        },
      ];
    case 'flashcards':
      return [
        {
          href: '/tools/flashcard-maker',
          title: 'ESL Picture Flashcard Maker',
          subtitle: 'Create 2×2, 2×3, or 3×3 decks from 176 drawings or your own images.',
          badge: 'Flashcards',
        },
        {
          href: '/tools/domino-maker',
          title: 'Picture Dominoes & Memory Maker',
          subtitle: 'Turn the same flashcards into Memory Match pairs and Picture Dominoes.',
          badge: 'Games',
        },
        {
          href: '/tools/bingo-maker',
          title: 'ESL Picture & Word Bingo Maker',
          subtitle: 'Practice listening comprehension with up to 30 shuffled picture boards.',
          badge: 'Bingo',
        },
        {
          href: '/tools/mini-book-maker',
          title: 'Foldable Mini-Book Maker',
          subtitle: 'Put your target flashcards into a take-home "I see a..." reading booklet.',
          badge: 'Mini-Book',
        },
      ];
    default:
      return [
        {
          href: '/tools/flashcard-maker',
          title: 'ESL Picture Flashcard Maker',
          subtitle: 'Create custom 2×2 or 3×3 classroom picture flashcards in seconds.',
          badge: 'Flashcards',
        },
        {
          href: '/tools/pattern-maker',
          title: 'Cut & Paste Pattern Maker',
          subtitle: 'Generate AB, AAB, ABB, and ABC scissor pattern worksheets.',
          badge: 'Patterns',
        },
        {
          href: '/tools/mini-book-maker',
          title: 'Foldable Mini-Book Maker',
          subtitle: 'Build Half-Page or 1-Sheet 8-Panel emergent ESL reading books.',
          badge: 'Mini-Book',
        },
        {
          href: '/tools/i-spy-maker',
          title: 'I Spy & Count Worksheet Maker',
          subtitle: 'Print custom find-and-count worksheets complete with Answer Key.',
          badge: 'I Spy',
        },
      ];
  }
}

export function getRelatedToolsForAgeBand(ageSlug: string): RelatedToolLink[] {
  switch (ageSlug.toLowerCase()) {
    case '3-4':
      return [
        {
          href: '/tools/name-tracing',
          title: 'Custom Name Tracing Maker',
          subtitle: 'Print personalized ALL CAPS or Title Case name sheets with starting dots.',
          badge: 'Names',
        },
        {
          href: '/tools/pattern-maker',
          title: 'Cut & Paste AB Patterns',
          subtitle: 'Simple 2-part AB picture sequencing with large dashed scissor tiles.',
          badge: 'Patterns',
        },
        {
          href: '/tools/flashcard-maker',
          title: 'ESL Picture Flashcards',
          subtitle: 'Print big 2×2 picture cards for gentle carpet pointing and chants.',
          badge: 'Flashcards',
        },
        {
          href: '/tools/mini-book-maker',
          title: 'Foldable Picture Mini-Books',
          subtitle: 'Colorable 1-sentence "I see a..." booklets for early preschool readers.',
          badge: 'Mini-Books',
        },
      ];
    case '4-5':
      return [
        {
          href: '/tools/letter-tracing',
          title: 'A–Z Letter Tracing Generator',
          subtitle: 'Uppercase & lowercase guided strokes with SATPIN or full A–Z packs.',
          badge: 'Alphabet',
        },
        {
          href: '/tools/number-tracing',
          title: 'Number Tracing 0–20 & Ten-Frames',
          subtitle: 'Build one-to-one counting sense with visual Ten-Frames and numerals.',
          badge: 'Math',
        },
        {
          href: '/tools/clip-cards-maker',
          title: 'Beginning Sounds Clip Cards',
          subtitle: 'Strengthen pincer grip while clipping initial consonant sounds.',
          badge: 'Phonics',
        },
        {
          href: '/tools/i-spy-maker',
          title: 'I Spy & Count Worksheet Maker',
          subtitle: 'Engaging find-and-count puzzles across 20 seasonal and ESL themes.',
          badge: 'I Spy',
        },
      ];
    case '5-6':
    default:
      return [
        {
          href: '/tools/handwriting-maker',
          title: 'Sight Word & CVC Handwriting',
          subtitle: 'Create Read-Trace-Write practice rows for Dolch words and phonics lists.',
          badge: 'Sight Words',
        },
        {
          href: '/tools/word-search-maker',
          title: 'Easy Picture Word Search',
          subtitle: 'Gentle 6×6 and 8×8 across/down puzzles paired with a Picture Word Bank.',
          badge: 'Word Search',
        },
        {
          href: '/tools/domino-maker',
          title: 'Picture Dominoes & Memory',
          subtitle: 'Play closed-loop Picture↔Word dominoes and 3×4 Memory Match pairs.',
          badge: 'Games',
        },
        {
          href: '/tools/matching-maker',
          title: 'Picture & Letter Matching',
          subtitle: 'Connect illustrations to full English words or beginning consonants.',
          badge: 'Matching',
        },
      ];
  }
}
