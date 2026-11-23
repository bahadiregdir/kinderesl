import type { FAQItem } from '@/types/worksheet';

export interface GuideSection {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
}

export interface EducatorGuide {
  slug: string;
  title: string;
  seoTitle: string;
  description: string;
  category: string;
  readingTime: string;
  targetAges: string;
  datePublished: string;
  dateModified: string;
  intro: string;
  sections: GuideSection[];
  classroomChecklist: string[];
  relatedWorksheetSlugs: string[];
  faqs: FAQItem[];
}

export const guides: EducatorGuide[] = [
  {
    slug: 'how-to-teach-alphabet-tracing-preschool',
    title: 'How to Teach Alphabet Tracing & Beginning Sounds to ESL Preschoolers',
    seoTitle: 'Teach Alphabet Tracing in Preschool',
    description:
      'Step-by-step preschool alphabet routine combining large-motor air writing, starting-dot letter tracing, phonics anchors, and letter matching.',
    category: 'Alphabet & Phonics',
    readingTime: '5 min read',
    targetAges: 'Ages 3–5',
    datePublished: '2026-11-23',
    dateModified: '2026-11-23',
    intro:
      'Teaching the English alphabet to 3- to 5-year-olds works best when pencil tracing comes after oral sound play and big body movement. Many young ESL learners struggle with tracing sheets simply because their fingers are asked to replicate small lines before their eyes and ears connect the letter shape to a spoken sound and a memorable picture word.',
    sections: [
      {
        heading: '1. Start With One Sound and One Clear Picture Anchor',
        paragraphs: [
          'Avoid introducing letter names, uppercase, lowercase, and five unrelated words all in the same five-minute circle. For preschool beginners—especially English language learners—pick one focus letter and pair its short, crisp sound with a single concrete noun such as /a/ – apple – ant.',
          'Hold up a picture card or draw the anchor on the board. Model the target sound clearly three times while pointing to your mouth, then let children echo the sound as a group at normal volume, in a whisper voice, and in a playful "ant voice." Oral mastery lowers frustration when children sit down to trace.',
        ],
        bullets: [
          'Pronounce /a/ cleanly without adding a trailing "uh" sound ("a," not "ah-uh").',
          'Use one consistent chant line during the week: "A says /a/, /a/ apple!"',
          'Keep the focus letter visible on a carpet chart before handing out paper.',
        ],
      },
      {
        heading: '2. Build Muscle Memory Before Picking Up a Pencil',
        paragraphs: [
          'Preschool hands tire quickly when they hold a standard pencil for too long without warm-up. Spend ninety seconds tracing the giant letter shape in the air using straight elbows ("sky writing") while calling out simple two-word directional cues such as "slant down, slant down, bridge across."',
          'Next, invite children to trace the large demonstration letter on a desk mat or in the palm of their hand with one pointer finger. By the time they see the green or bold starting dot on the worksheet, their arm already knows where to start and which direction the stroke travels.',
        ],
      },
      {
        heading: '3. Run a 10-Minute Guided Tracing Routine',
        paragraphs: [
          'Give each child either thick triangular crayons or short golf pencils, which naturally encourage a relaxed tripod grasp. Have the whole group put their crayon tip on the first starting dot and pause together—a quick visual scan lets you catch backwards top-to-bottom habits in seconds.',
          'After two guided rows of uppercase and lowercase tracing, transition immediately to an interactive application task such as circling beginning-sound pictures or matching capital letters to lowercase partners. Variety keeps fine-motor fatigue low and turns early phonics into a game rather than repetitive handwriting drill.',
        ],
        bullets: [
          'Ages 3–4: Complete 1 focus row plus coloring or circle-and-find items.',
          'Ages 4–5: Trace both uppercase and lowercase rows with starting dots, then finish a beginning-sound check.',
          'Dry-erase sleeves: Reuse the A–Z pack during morning literacy centers.',
        ],
      },
      {
        heading: '4. Spiral Review With Matching and Clip Cards',
        paragraphs: [
          'Letters stick when revisited briefly across three different formats across the week: guided tracing on Monday, uppercase-to-lowercase line matching on Wednesday, and beginning-sound clothespin clip cards in small groups on Friday. Both US Letter and A4 printouts allow international teams and homeschool co-ops to build uniform weekly binders.',
        ],
      },
    ],
    classroomChecklist: [
      'Model the letter sound and picture word orally before distributing worksheets.',
      'Practice two rounds of large sky-writing strokes using simple directional cues.',
      'Check every child’s crayon position on the first starting dot before independent tracing.',
      'Pair tracing with a quick beginning-sound clip card or letter-matching activity.',
    ],
    relatedWorksheetSlugs: [
      'letter-a-tracing-and-phonics',
      'letter-tracing-worksheets-a-to-z',
      'uppercase-lowercase-letter-match',
      'beginning-sounds-clip-cards',
    ],
    faqs: [
      {
        question: 'Should preschoolers learn uppercase or lowercase tracing first?',
        answer:
          'Introducing large uppercase letters first builds stroke confidence because straight and simple curved lines are easier for small hands, then pairing lowercase partners helps connect handwriting to real picture-book print.',
      },
      {
        question: 'How long should an alphabet tracing session last for 3- to 5-year-olds?',
        answer:
          'Plan 8 to 12 minutes total: 3 minutes of oral phonics and air writing, 5 minutes of guided pencil tracing, and 2–4 minutes of picture finding or matching.',
      },
      {
        question: 'How do I support left-handed children during letter tracing?',
        answer:
          'Angle their worksheet slightly clockwise (top-right tilted higher) so their wrist stays below the tracing line without smudging, and place example letters at the top of rows rather than only on the far left.',
      },
    ],
  },
  {
    slug: 'esl-circle-time-routines-preschool',
    title: 'How to Structure a 15-Minute Preschool ESL Circle Time Routine',
    seoTitle: '15-Min ESL Circle Time Routine',
    description:
      'A predictable 15-minute preschool ESL circle time plan using visual schedule cards, greeting chants, weather charts, feelings checks, and TPR.',
    category: 'Circle Time & ESL',
    readingTime: '6 min read',
    targetAges: 'Ages 3–6',
    datePublished: '2026-11-23',
    dateModified: '2026-11-23',
    intro:
      'A predictable circle time routine is one of the fastest ways to turn shy preschool English beginners into confident speakers. When the sequence stays identical every morning, young learners do not waste energy guessing what happens next—they focus their attention on listening, singing, and repeating real functional English phrases.',
    sections: [
      {
        heading: 'Minutes 0–3: Visual Schedule & Hello Chant',
        paragraphs: [
          'Open every session at the carpet with a laminated visual schedule board showing four clear icons: Hello Song, Weather & Day, Feelings Check, and Today’s Game or Worksheet. Point to the first icon before speaking so non-verbal newcomers immediately understand the transition.',
          'Follow right away with a short rhythmic welcome chant accompanied by big hand waves and clapping. Keep chants original, repetitive, and easy to echo line-by-line rather than racing through fast recorded songs.',
        ],
      },
      {
        heading: 'Minutes 3–7: Calendar, Weather & Quick Chants',
        paragraphs: [
          'Invite one classroom helper to look out the window and ask the whole group, "Look outside! Today it is…?" Hold two contrasting weather flashcards side-by-side (for example, sunny vs. rainy) so beginners can still participate by pointing before they memorize every English adjective.',
          'Once the weather card goes onto the board, model the full sentence rhythmically ("Today it is sunny!"). Repeat with the day of the week to anchor spoken time vocabulary in real daily life.',
        ],
        bullets: [
          'Offer binary choices ("Sunny or cloudy?") for early speakers.',
          'Rotate a daily Weather Helper so every child handles the cards.',
          'Pair each weather word with a 2-second hand gesture (wiggling fingers for rain, shivering for cold).',
        ],
      },
      {
        heading: 'Minutes 7–11: Feelings Check-In & Whole-Body TPR',
        paragraphs: [
          'Emotional vocabulary gives preschool ESL learners words they actually care to say aloud. Display six core feeling cards (happy, sad, angry, tired, scared, excited) and ask, "How are you today?" Let children show the matching facial expression first, then echo "I am happy!"',
          'Before restlessness sets in around minute ten, stand up for two minutes of Total Physical Response (TPR) action cards: jump, clap, stomp, turn around, sit down. Moving immediately resets focus and prepares children for calm tabletop work.',
        ],
      },
      {
        heading: 'Minutes 11–15: Preview the Tabletop Activity',
        paragraphs: [
          'Hold up the printable worksheet or flashcard set right there on the carpet and demonstrate Step 1 silently, then aloud. Point to the visual schedule card showing "Table Time" as students walk to seats. Moving from familiar circle-time language directly into printed pages doubles vocabulary retention.',
        ],
      },
    ],
    classroomChecklist: [
      'Post a 4-step Visual Schedule at children’s eye level beside the rug.',
      'Hold 2 contrasting flashcards when asking questions to scaffold silent newcomers.',
      'Mix 2 minutes of standing TPR actions before transitioning to pencils and tables.',
      'Demonstrate the first row of any printable on the rug before children sit down.',
    ],
    relatedWorksheetSlugs: [
      'visual-schedule-cards-preschool',
      'circle-time-board-day-and-weather',
      'preschool-weather-chart-and-cards',
      'feelings-cards-for-circle-time',
      'esl-circle-time-song-lyric-cards',
      'tpr-classroom-command-cards-esl',
    ],
    faqs: [
      {
        question: 'How long can 3- and 4-year-olds sit during ESL circle time?',
        answer:
          'Most 3- to 4-year-olds engage happily for 10 to 15 minutes as long as sitting segments alternate with chanting, holding cards, and brief standing movement.',
      },
      {
        question: 'What if a new ESL student stays silent during morning circle?',
        answer:
          'Respect the silent period. Invite non-verbal participation through pointing to flashcards, acting out feelings, or performing TPR commands until confidence grows.',
      },
      {
        question: 'How should teachers store daily circle-time lyric and command cards?',
        answer:
          'Print cards at 100% scale in US Letter or A4, laminate them, punch one corner hole, and keep the deck on a single loose-leaf metal ring next to your teaching easel.',
      },
    ],
  },
  {
    slug: 'teaching-farm-animals-esl-preschool',
    title: 'Teaching Farm Animals & Animal Sounds to Preschool ESL Learners',
    seoTitle: 'Teach Farm Animals in Preschool ESL',
    description:
      'Complete 3-stage preschool ESL farm animals lesson sequence blending flashcards, animal sounds, cut-and-paste matching, and listening bingo.',
    category: 'Thematic ESL Units',
    readingTime: '5 min read',
    targetAges: 'Ages 3–6',
    datePublished: '2026-11-23',
    dateModified: '2026-11-23',
    intro:
      'Farm animals are a classic first vocabulary unit for preschool and kindergarten ESL classrooms—and for good reason. Every child loves making animal noises, and English onomatopoeia ("moo," "baa," "oink," "cluck") differs enough across home languages that learners find comparing sounds memorable and hilarious.',
    sections: [
      {
        heading: 'Stage 1: Mystery Bag Sound Guessing (Listening First)',
        paragraphs: [
          'Start without showing pictures at all. Place small plastic farm toys or folded animal flashcards inside a cloth bag, peek inside, and make the animal sound ("Moo! Moo!"). Ask the group, "Who says moo?"',
          'Once a student guesses or points to the cow card, reveal the animal and model a short rhythm frame: "A cow says moo!" Repeat for four core animals on Day 1 (cow, sheep, pig, chicken) before adding horse and duck on Day 2. Keeping sets to 4–6 words avoids overload.',
        ],
      },
      {
        heading: 'Stage 2: Match & Cut-and-Paste Vocabulary Reinforcement',
        paragraphs: [
          'Once learners can produce the target nouns and sounds orally, hand out the 2-page Farm Animals Match & Cut-and-Paste printable. On Page 1, students trace the connecting line from each morning barnyard animal to its speech bubble sound word while saying the sentence aloud.',
          'Page 2 turns vocabulary recall into tactile scissor practice: children cut out the bottom speech bubbles, match them cleanly above each animal, and glue them only after checking a partner’s matches.',
        ],
        bullets: [
          'Pre-teach holding scissors "thumbs up" before cutting speech bubble squares.',
          'Have fast finishers color the barn scene while naming animal colors in English.',
          'Read the completed page aloud together as a mini storybook.',
        ],
      },
      {
        heading: 'Stage 3: Listening Assessment With Preschool Farm Bingo',
        paragraphs: [
          'Close the unit with a calm five-minute Farm Animal Bingo game in small groups of 4–6 students. Call out either the animal name ("Find the pig!") for beginners or only the sound ("Who says cluck?") for an extra listening challenge. Two distinct bingo boards let partners compare sheets after every round.',
        ],
      },
    ],
    classroomChecklist: [
      'Limit Day 1 target vocabulary to 4 familiar farm animals (cow, sheep, pig, chicken).',
      'Practice animal sound sentences orally before starting Page 1 line matching.',
      'Verify speech bubble placement before kids apply glue sticks on Page 2.',
      'Wrap up the week with listening-only clues in small-group Farm Animal Bingo.',
    ],
    relatedWorksheetSlugs: [
      'farm-animals-esl-vocabulary-and-tracing',
      'farm-animals-esl-lesson-plan',
      'farm-animal-bingo-preschool',
      'community-helpers-cards-and-match',
    ],
    faqs: [
      {
        question: 'Which farm animal words should ESL preschoolers learn first?',
        answer:
          'Start with four high-contrast animals with distinct silhouettes and sounds: cow (moo), sheep (baa), pig (oink), and chicken (cluck), then add horse (neigh) and duck (quack).',
      },
      {
        question: 'How do I adapt farm animal worksheets for 3-year-olds still learning scissors?',
        answer:
          'Use Page 1 matching and Farm Bingo in week one, or pre-cut the outer border of Page 2 strips so three-year-olds only make four easy straight snips.',
      },
      {
        question: 'Can parents use the farm ESL lesson plan for homeschooling?',
        answer:
          'Yes. The printable includes plain-English callouts, simple game ideas, and a student activity page designed for one-on-one kitchen-table teaching as well as classrooms.',
      },
    ],
  },
  {
    slug: 'preschool-winter-math-and-vocabulary',
    title: 'Preschool Winter Theme Plan: Ten Frames 1–5, Sorting & Clothes ESL',
    seoTitle: 'Preschool Winter Math & ESL Plan',
    description:
      'Combine winter clothes flashcards, odd-one-out seasonal logic, and winter ten-frame counting 1 to 5 into one cohesive preschool ESL week.',
    category: 'Seasonal Curriculum',
    readingTime: '5 min read',
    targetAges: 'Ages 3–6',
    datePublished: '2026-11-23',
    dateModified: '2026-11-23',
    intro:
      'Seasonal winter units shine because you can weave one relatable story—getting dressed for a snowy day—through math counting, critical thinking, fine-motor tracing, and ESL vocabulary all in the same week without forcing disconnected worksheets together.',
    sections: [
      {
        heading: 'Monday–Tuesday: Dressing for Snow (Clothes Cards & Logic)',
        paragraphs: [
          'Introduce winter clothing words (hat, coat, scarf, mittens, boots) with physical props or laminated Winter Clothes ESL Word Cards. Play "Put on your…!" TPR dress-up charades on the carpet so students link each noun to a real action.',
          'Follow up with Winter Odd One Out visual discrimination: children inspect three rows of clothing and seasonal items to find what does not belong in winter (like flip-flops or sunglasses) and trace two high-frequency seasonal words: "snow" and "cold."',
        ],
      },
      {
        heading: 'Wednesday–Thursday: Winter Math With Ten Frames (1 to 5)',
        paragraphs: [
          'Instead of isolated numeral tracing, give preschoolers visual number sense using Winter Ten Frames: Count to 5. Children touch-count snowflakes, mittens, snowmen, penguins, and hats inside the top half of a clean ten-frame grid—helping them instantly recognize groups like "3" and "5" without recounting from one every time.',
          'On Page 2, students shade boxes inside empty ten frames using crayons or winter mini-erasers and match cut-out numerals 1–5 to each completed frame.',
        ],
        bullets: [
          'Place real buttons, pom-poms, or paper squares onto the ten frames before coloring boxes.',
          'Pair number learning with plural English nouns ("four mittens," "two hats").',
          'Download US Letter or A4 directly depending on your classroom paper tray.',
        ],
      },
      {
        heading: 'Friday: Winter Vocabulary Review & Extension',
        paragraphs: [
          'Wrap up Friday with the Penny the Penguin Winter Vocabulary Pack: review all six winter nouns together, color the scenes, and send the stapled 4–5 page winter mini-booklet home so parents can ask their child to name three winter clothes items in English over the weekend.',
        ],
      },
    ],
    classroomChecklist: [
      'Pre-teach 5 winter clothing words with charades before starting table work.',
      'Prompt full-sentence reasoning on Odd One Out ("Flip-flops are for summer!").',
      'Use counters or pom-poms on ten frames before asking kids to color or cut numbers.',
      'Revisit counting words aloud alongside numbers 1–5 ("five snowflakes").',
    ],
    relatedWorksheetSlugs: [
      'preschool-winter-counting-1-5-ten-frames',
      'winter-odd-one-out-visual-discrimination',
      'winter-vocabulary-pack-preschool',
      'winter-clothes-esl-word-cards',
      'counting-1-to-5-ladybug-party',
    ],
    faqs: [
      {
        question: 'Why use ten frames for preschoolers only counting 1 to 5?',
        answer:
          'A ten frame organizes objects in two neat rows of five, teaching children that five fills one complete top row—a foundational benchmark for kindergarten addition later on.',
      },
      {
        question: 'Can kids who live in warm climates enjoy a winter preschool unit?',
        answer:
          'Yes. Children in warm climates often find snowmen, penguins, and winter clothes especially exciting as story-based vocabulary contrasts ("hot summer vs. cold snow").',
      },
      {
        question: 'How can I bundle all winter printables into one download?',
        answer:
          'Click the "+ Pack" icon on each winter worksheet card to collect them in Lesson Pack, then download one merged PDF in US Letter or A4.',
      },
    ],
  },
];

export function getGuideBySlug(slug: string): EducatorGuide | undefined {
  return guides.find((g) => g.slug === slug);
}
