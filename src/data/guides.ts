import type { FAQItem } from '@/types/worksheet';
import type { RelatedToolLink } from '@/lib/related-tools';

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
  relatedTools: RelatedToolLink[];
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
    relatedTools: [
      {
        href: '/tools/letter-tracing',
        title: 'A–Z Letter Tracing Generator',
        subtitle: 'Create single-letter, SATPIN group, or full 26-page tracing sheets with starting dots.',
        badge: 'Tracing',
      },
      {
        href: '/tools/clip-cards-maker',
        title: 'Beginning Sounds Clip Cards',
        subtitle: 'Print 2×2 or 2×3 clothespin phonics cards from preschool line-art illustrations.',
        badge: 'Phonics',
      },
      {
        href: '/tools/matching-maker',
        title: 'Picture & Letter Matching Maker',
        subtitle: 'Build draw-a-line beginning letter sound worksheets complete with an Answer Key.',
        badge: 'Matching',
      },
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
    relatedTools: [
      {
        href: '/tools/flashcard-maker?theme=weather',
        title: 'Weather Picture Flashcards',
        subtitle: 'Print sunny, rainy, cloudy, windy, and snowy cards ready for morning carpet helpers.',
        badge: 'Weather',
      },
      {
        href: '/tools/flashcard-maker?theme=feelings',
        title: 'Feelings Check-In Flashcards',
        subtitle: 'Generate large happy, sad, tired, and excited cards for daily emotional check-ins.',
        badge: 'SEL',
      },
      {
        href: '/tools/flashcard-maker?theme=routines',
        title: 'Daily Schedule & Routine Cards',
        subtitle: 'Customize visual transitions for circle time, snack, story, and tidy-up.',
        badge: 'Routines',
      },
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
    relatedTools: [
      {
        href: '/tools/flashcard-maker?theme=farm',
        title: 'Farm Animals Flashcards',
        subtitle: 'Pre-loaded cow, pig, sheep, chicken, horse, and duck cards with traceable labels.',
        badge: 'Farm',
      },
      {
        href: '/tools/bingo-maker?theme=farm',
        title: 'Farm Animals Picture Bingo',
        subtitle: 'Create up to 30 shuffled farm bingo boards plus a printable caller checklist.',
        badge: 'Bingo',
      },
      {
        href: '/tools/i-spy-maker?theme=farm',
        title: 'Farm Animals I Spy & Count',
        subtitle: 'Find and count barnyard animals in a non-overlapping search field + Answer Key.',
        badge: 'I Spy',
      },
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
    relatedTools: [
      {
        href: '/tools/i-spy-maker?theme=winter',
        title: 'Winter I Spy & Count',
        subtitle: 'Spot and count snowflakes, mittens, hats, and snowmen with a Page 2 Answer Key.',
        badge: 'Winter',
      },
      {
        href: '/tools/flashcard-maker?theme=clothes',
        title: 'Winter Clothes Flashcards',
        subtitle: 'Build 2×2 or 3×3 coat, scarf, boots, and hat cards for charades and dressing routines.',
        badge: 'Clothes',
      },
      {
        href: '/tools/number-tracing',
        title: 'Number Tracing 0–20 & Ten-Frames',
        subtitle: 'Pair seasonal winter counting with guided numeral formation and Ten-Frames.',
        badge: 'Math',
      },
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
  {
    slug: 'dolch-sight-words-list-preschool-kindergarten',
    title: 'Dolch Sight Words List for Preschool & Kindergarten (Pre-Primer + Weekly Routine)',
    seoTitle: 'Dolch Sight Words List Pre-K & K',
    description:
      'Complete 40 Pre-Primer Dolch sight words grouped into weekly sets of 5, plus a 10-minute multisensory Read-Trace-Write ESL classroom routine.',
    category: 'Reading & Sight Words',
    readingTime: '6 min read',
    targetAges: 'Ages 4–6',
    datePublished: '2026-11-26',
    dateModified: '2026-11-26',
    intro:
      'High-frequency words make up more than half of early picture-book print, yet asking 4- and 5-year-olds to memorize random flashcards without sound links often leads to guessing. Grouping the 40 Dolch Pre-Primer words into tiny weekly sets—and pairing them with phonics clues and handwriting—turns early reading into a confident daily habit.',
    sections: [
      {
        heading: '1. The Complete 40 Pre-Primer Dolch List in 8 Weekly Sets',
        paragraphs: [
          'Instead of sending home a giant 40-word chart in September, introduce five high-utility words each week so children meet every target word in songs, morning message sentences, and tabletop tracing before Friday review.',
          'Teaching color, pronoun, and helper verbs together lets ESL learners build real sentences ("I see a red ball!") right away rather than reciting isolated strings.',
        ],
        bullets: [
          'Weeks 1–2: a, I, see, the, can | in, is, it, my, to',
          'Weeks 3–4: and, big, for, go, me | come, down, find, here, look',
          'Weeks 5–6: jump, little, make, play, run | up, we, you, help, said',
          'Weeks 7–8: away, blue, funny, not, one | red, three, two, where, yellow',
        ],
      },
      {
        heading: '2. Connect Phonics Clues Instead of Pure Memorization',
        paragraphs: [
          'Nearly every Dolch Pre-Primer word already follows predictable letter-sound rules: "in," "it," "can," "big," and "red" are completely decodable once children know basic short vowels and consonants.',
          'For partial sight words like "the," "said," and "you," underline the unexpected vowel spelling in a bright marker ("heart part") while sounding out the regular consonants normally. This builds decoding habits rather than visual guessing.',
        ],
      },
      {
        heading: '3. Run a 10-Minute Daily Read-Trace-Write Routine',
        paragraphs: [
          'Consistent five-day micro-practice beats long Friday drills. Spend three minutes Monday showing the five new words inside short illustrated sentences, then give students 5 minutes Tuesday through Thursday on a Read-Trace-Write handwriting sheet.',
        ],
        bullets: [
          'Monday: Oral echo reading with finger pointing under each word.',
          'Tuesday–Wednesday: Trace and copy the week’s 5 target words on primary guidelines.',
          'Thursday: Spot-and-circle the words inside a kid-friendly across/down word search.',
          'Friday: Mix old and new cards into a 3-minute partner flashcard race.',
        ],
      },
      {
        heading: '4. Supporting ESL Learners With Picture Context',
        paragraphs: [
          'Young English learners grasp abstract Dolch words ("in," "up," "down," "look," "where") much faster when every card lives beside a concrete visual anchor or movement cue. Pair "jump," "run," and "play" with TPR actions at the rug, and tuck color and number words directly into classroom craft centers.',
        ],
      },
    ],
    classroomChecklist: [
      'Introduce at most 4–5 new Dolch sight words per week.',
      'Highlight regular consonant sounds before marking tricky vowel spellings.',
      'Use Read-Trace-Write lines so decoding and handwriting reinforce each other.',
      'Spiral words from previous weeks into Friday partner word searches and flashcards.',
    ],
    relatedWorksheetSlugs: [
      'letter-tracing-worksheets-a-to-z',
      'uppercase-lowercase-letter-match',
      'beginning-sounds-clip-cards',
      'classroom-objects-esl-flashcards',
    ],
    relatedTools: [
      {
        href: '/tools/handwriting-maker',
        title: 'Sight Word & Handwriting Maker',
        subtitle: 'Turn any Dolch Pre-Primer list into Read-Trace-Write PDFs in US Letter or A4.',
        badge: 'Sight Words',
      },
      {
        href: '/tools/word-search-maker?theme=cvc',
        title: 'Easy Picture Word Search Maker',
        subtitle: 'Create gentle 6×6 or 8×8 left-to-right puzzles paired with a Picture Word Bank.',
        badge: 'Word Search',
      },
      {
        href: '/tools/flashcard-maker?theme=cvc',
        title: 'ESL Picture Flashcard Maker',
        subtitle: 'Print decodable word and picture cards for quick small-group reading warm-ups.',
        badge: 'Flashcards',
      },
    ],
    faqs: [
      {
        question: 'When should preschoolers start learning Dolch sight words?',
        answer:
          'Wait until a child recognizes most consonant letter names/sounds and can track words left to right—usually around ages 4.5 to 5.5 in late Pre-K or early Kindergarten.',
      },
      {
        question: 'How many Dolch Pre-Primer words are there in total?',
        answer:
          'There are 40 Dolch Pre-Primer words, followed by 52 Primer words in Kindergarten.',
      },
      {
        question: 'Should ESL children trace sight words or build them with tiles first?',
        answer:
          'Do both: building the 2- to 4-letter word orally and visually first makes Read-Trace-Write handwriting practice far more meaningful.',
      },
    ],
  },
  {
    slug: 'cvc-words-list-kindergarten-phonics-guide',
    title: 'CVC Words List & Short Vowel Phonics Guide for Kindergarten & ESL',
    seoTitle: 'CVC Words List & Phonics Guide',
    description:
      'Grouped short-vowel CVC word families (-at, -en, -ig, -op, -ug), Tap-Blend-Read steps, ESL vowel contrast tips, and printable literacy centers.',
    category: 'Alphabet & Phonics',
    readingTime: '6 min read',
    targetAges: 'Ages 4–6',
    datePublished: '2026-11-26',
    dateModified: '2026-11-26',
    intro:
      'Consonant-Vowel-Consonant (CVC) words like "cat," "pig," and "bus" are the true bridge between knowing letter sounds and reading real English books. When children blend three crisp sounds together independently for the first time, reading confidence skyrockets.',
    sections: [
      {
        heading: '1. Short Vowel CVC Word Families to Teach First',
        paragraphs: [
          'Begin with Short A word families (-at, -an, -ap) once students master continuous consonants like s, m, n, f, and r alongside crisp stops like t and p. Grouping words by rime lets learners spot reliable spelling patterns right away.',
        ],
        bullets: [
          'Short A (-at, -an, -ap): cat, bat, hat, mat | fan, man, pan, van | cap, map',
          'Short E (-ed, -en, -et): bed, red | hen, pen, ten | jet, net, pet, wet',
          'Short I (-ig, -in, -it): big, dig, pig, wig | bin, fin, pin | sit, hit',
          'Short O (-og, -op, -ot): dog, frog, log | hop, mop, top | hot, pot',
          'Short U (-ug, -un, -ut): bug, hug, mug, rug | bun, run, sun | cut, hut, nut',
        ],
      },
      {
        heading: '2. Use the 3-Step Tap-Blend-Read Technique',
        paragraphs: [
          'Ask students to tap one finger per sound on the table—/k/, /a/, /t/—before sweeping their index finger smoothly across the word from left to right: "cat!" Continuous initial sounds like /m/ in "mat" and /s/ in "sun" are easiest to stretch without breaking the blend.',
        ],
      },
      {
        heading: '3. Coaching ESL Learners Through Short E vs. Short I',
        paragraphs: [
          'Many home languages do not separate English short /e/ ("pen," "bed") from short /i/ ("pin," "big"), or short /a/ ("bat") from short /u/ ("but"). Use mirror mouth checks during circle time: smile slightly for /e/, relax the mouth high for /i/, and drop the jaw wide for /a/.',
          'Contrast minimal picture pairs aloud ("Show me the pen / Show me the pin!") before expecting children to write the medial vowel independently.',
        ],
      },
      {
        heading: '4. Build a 4-Station Friday CVC Phonics Rotation',
        paragraphs: [
          'Keep practice playful by rotating four 6-minute small-group stations on Friday using identical CVC vocabulary across different skills.',
        ],
        bullets: [
          'Station 1: Picture Flashcards—blend and read aloud to reveal the matching drawing.',
          'Station 2: Beginning Sounds Clip Cards—pin wooden clothespins onto the initial consonant.',
          'Station 3: Draw-a-Line Picture Matching—connect CVC illustrations to printed words.',
          'Station 4: Beginner 6×6 Picture Word Search—spot 5 target CVC words horizontally or vertically.',
        ],
      },
    ],
    classroomChecklist: [
      'Start with continuous consonant onsets (m, s, n, f) before stops (b, d, t, p).',
      'Practice Tap-Blend-Read finger tapping before showing spelling strips.',
      'Teach short /e/ and short /i/ with mirror mouth cues and picture pairs.',
      'Reinforce the week’s CVC family with clip cards, matching, and picture flashcards.',
    ],
    relatedWorksheetSlugs: [
      'beginning-sounds-clip-cards',
      'letter-a-tracing-and-phonics',
      'letter-tracing-worksheets-a-to-z',
      'uppercase-lowercase-letter-match',
    ],
    relatedTools: [
      {
        href: '/tools/flashcard-maker?theme=cvc',
        title: 'CVC Picture Flashcards',
        subtitle: 'Pre-loaded CVC noun cards in 2×2 or 3×3 layouts with optional traceable labels.',
        badge: 'CVC Deck',
      },
      {
        href: '/tools/clip-cards-maker?theme=cvc',
        title: 'CVC Beginning Sounds Clip Cards',
        subtitle: 'Tactile clothespin cards targeting initial consonants of short-vowel words.',
        badge: 'Clip Cards',
      },
      {
        href: '/tools/matching-maker?theme=cvc',
        title: 'CVC Picture Matching Maker',
        subtitle: 'Pair clear CVC drawings with printed words or beginning letters + Answer Key.',
        badge: 'Matching',
      },
      {
        href: '/tools/word-search-maker?theme=cvc',
        title: 'CVC Picture Word Search',
        subtitle: 'Beginner 6×6 across/down puzzle with Picture Word Bank for confidence.',
        badge: 'Word Search',
      },
    ],
    faqs: [
      {
        question: 'In what order should I introduce short vowels in CVC words?',
        answer:
          'Most phonics scopes start with Short A, then separate Short E and Short I with Short O or Short U in between so learners do not confuse /e/ and /i/.',
      },
      {
        question: 'Should ESL students know all 26 letter names before reading CVC words?',
        answer:
          'No! Students only need 6 to 8 high-utility letter sounds—such as s, a, t, p, i, n—before they can immediately blend words like "sat," "pat," "pin," and "tap."',
      },
      {
        question: 'Why avoid diagonal or backwards words in Kindergarten CVC word searches?',
        answer:
          'Kindergarteners are just mastering left-to-right English tracking; backwards or diagonal letters work against early reading directionality.',
      },
    ],
  },
  {
    slug: 'how-to-teach-name-writing-preschool',
    title: 'How to Teach Name Writing in Preschool: Developmental Stages (Ages 3–5)',
    seoTitle: 'Teach Name Writing in Preschool',
    description:
      'Guide ages 3–5 from name recognition and first-letter tracing to independent title-case name writing using a 2-minute daily sign-in routine.',
    category: 'Handwriting & Fine Motor',
    readingTime: '5 min read',
    targetAges: 'Ages 3–5',
    datePublished: '2026-11-26',
    dateModified: '2026-11-26',
    intro:
      'A child’s own name is the single most meaningful word in a preschool classroom. When name practice feels gentle, tactile, and connected to real classroom ownership—signing in for arrival, labeling cubbies, and signing artwork—children gain letter-formation confidence without endless forced drills.',
    sections: [
      {
        heading: '1. Know the 4 Developmental Stages of Name Writing',
        paragraphs: [
          'Expecting a three-year-old to write neatly across narrow notebook lines leads directly to fist grips and frustration. Meet each learner where their hand strength actually sits.',
        ],
        bullets: [
          'Stage 1 (Visual Recognition): Spotting their first letter and printed name card beside a personal photo on their cubby.',
          'Stage 2 (Marks & Mock Letters): Scribbles, circles, and big vertical sticks moving roughly left to right.',
          'Stage 3 (Capital First Letter + Mixed Letters): Clearly tracing or writing the initial uppercase letter followed by familiar shapes.',
          'Stage 4 (Controlled Title-Case Tracing): Tracing and copying all letters smoothly from top to bottom with starting dots.',
        ],
      },
      {
        heading: '2. ALL CAPS vs. Title Case: When to Switch',
        paragraphs: [
          'Many 3-year-olds start happily with large uppercase letters because straight lines and big curves match their shoulder-to-wrist motor control. Once a child recognizes their first initial easily—typically age 4—switch name tracing sheets to natural Title Case ("Emma," not "EMMA") so school print aligns with picture books and Kindergarten expectations.',
        ],
      },
      {
        heading: '3. Set Up a 2-Minute Morning Sign-In Station',
        paragraphs: [
          'Slide each child’s personalized name tracing sheet inside a heavy-duty dry-erase pocket beside the classroom door. As families drop off, students pick up a thin dry-erase marker, trace their name once with starting dots, and wipe clean.',
          'Because the routine happens in two relaxed minutes during arrival, children accumulate nearly 180 repetitions across the school year without losing playtime.',
        ],
      },
      {
        heading: '4. Multi-Sensory Pencil Grip & Fine-Motor Warm-Ups',
        paragraphs: [
          'If a child tires mid-name or squeezes tightly, strengthen finger arches first using clothespin clip cards, scissor snipping strips, or short half-length crayons that encourage a natural tripod pinch.',
        ],
        bullets: [
          'Try "Rainbow Name Tracing": trace once in red, once in orange, and once in blue.',
          'Teach top-down strokes gently ("Start at the teal dot, pull straight down!").',
          'Celebrate legible letter starts and correct order before worrying about perfect line size.',
        ],
      },
    ],
    classroomChecklist: [
      'Anchor every cubby and name card with a clear student photo in month one.',
      'Print Title-Case dashed sheets with starting dots for ages 4–5.',
      'Slip custom name sheets into wipe-clean dry-erase sleeves for morning arrival.',
      'Warm up tired hands with clothespin clip cards or short golf pencils.',
    ],
    relatedWorksheetSlugs: [
      'letter-tracing-worksheets-a-to-z',
      'letter-a-tracing-and-phonics',
      'preschool-cutting-practice-strips',
      'uppercase-lowercase-letter-match',
    ],
    relatedTools: [
      {
        href: '/tools/name-tracing',
        title: 'Custom Name Tracing Maker',
        subtitle: 'Generate personalized dashed name sheets—or batch up to 30 class names at once.',
        badge: 'Names',
      },
      {
        href: '/tools/letter-tracing',
        title: 'A–Z Letter Tracing Generator',
        subtitle: 'Zoom in on tricky individual letters in a student’s name with guided stroke dots.',
        badge: 'Letters',
      },
      {
        href: '/tools/handwriting-maker',
        title: 'Sight Word & Handwriting Maker',
        subtitle: 'Bridge from name tracing to full-name, family words, and starter sight words.',
        badge: 'Handwriting',
      },
    ],
    faqs: [
      {
        question: 'Should 3-year-olds trace their first name in all capitals or title case?',
        answer:
          'Starting with their single bold first initial or all-capital name works well at age 3, while transitioning to Title Case ("Liam") by age 4 prepares children smoothly for Kindergarten.',
      },
      {
        question: 'What if a child still holds the marker with a full fist grip?',
        answer:
          'Offer broken 2-inch crayons or short golf pencils and build pincer strength with playdough rolling, clothespins, and short vertical tracing lines before pushing full-name copying.',
      },
      {
        question: 'How fast can teachers prepare a whole class set of name sheets?',
        answer:
          'Paste all student names—one per line—into the KinderESL batch Name Tracing Maker to generate one merged multi-page PDF ready to print in seconds.',
      },
    ],
  },
  {
    slug: '15-free-esl-games-for-preschool-circle-time',
    title: '15 Zero-Prep ESL Games for Preschool Circle Time & Small Groups',
    seoTitle: '15 Preschool ESL Circle Time Games',
    description:
      'Fifteen low-prep preschool ESL games across flashcards, TPR movement, and tabletop centers—complete with silent-period adaptations.',
    category: 'Circle Time & ESL',
    readingTime: '7 min read',
    targetAges: 'Ages 3–6',
    datePublished: '2026-11-26',
    dateModified: '2026-11-26',
    intro:
      'Preschoolers remember English words they move to, touch, hunt for, and laugh over. You do not need batteries or expensive kits—just one shuffled flashcard deck, a laminated picture bingo set, and a handful of crisp 3-minute circle-time games you can launch anytime energy dips.',
    sections: [
      {
        heading: '5 Calm Flashcard Games for Carpet Time',
        paragraphs: [
          'Keep circle time crisp by alternating calm listening focus with quick playful reveals.',
        ],
        bullets: [
          '1. Slow Reveal: Slide a picture flashcard slowly out from behind a folder until children guess the noun.',
          '2. What’s Missing?: Lay 4 cards on the rug, have kids close their eyes, hide 1 card, and ask "What is missing?"',
          '3. Whisper or Roar: Flash a card high for a loud lion voice or low by the floor for a quiet mouse whisper.',
          '4. Stand Up If…: Give each child 1 picture card; call out a word and let holders stand up and wiggle.',
          '5. Pass the Hat: Pass one card around the circle to a soft beat; when clapping stops, the holder names it.',
        ],
      },
      {
        heading: '5 Active TPR Movement Games (Reset Restless Energy)',
        paragraphs: [
          'Total Physical Response pairs physical action directly with English listening so even brand-new silent learners succeed on Day 1.',
        ],
        bullets: [
          '6. Four Corners Card Hop: Tape 4 theme flashcards on classroom walls; kids walk or tiptoe to the word you call.',
          '7. Freeze & Pose: Show a TPR action card (jump, sleep, swim); children act it out until you shout "Freeze!"',
          '8. Bridge Stepping Stones: Lay laminated flashcards across the rug as stepping stones; name each picture to cross safely.',
          '9. Mystery Bag Sound Hunt: Pull a toy or card by touch alone and make the sound or clue before showing it.',
          '10. Teacher Says (Gentle Version): Replace elimination with silly freezes so shy 3-year-olds stay in the game.',
        ],
      },
      {
        heading: '5 Small-Group Tabletop & Partner Games',
        paragraphs: [
          'Transition smoothly from carpet energy to quiet seated focus with hands-on visual printables.',
        ],
        bullets: [
          '11. Sound-Clue Picture Bingo: Call animal noises, weather sounds, or short clues instead of plain nouns.',
          '12. Partner I Spy Races: Give two learners one shared I Spy sheet and colored pencils to spot-and-count together.',
          '13. Clothespin Sound Clip: Race gently to clip wooden clothespins onto beginning consonant letters.',
          '14. Memory Match Flip: Print two copies of a 2×3 flashcard deck face-down for classic turn-and-name memory pairs.',
          '15. Flyswatter Tap: Place 6 printed flashcards on the table; call a word and let kids gently tap with plastic swatters.',
        ],
      },
      {
        heading: 'Pacing Tips for Mixed-Level ESL Beginners',
        paragraphs: [
          'Keep rounds short (2 to 4 minutes), skip elimination rules where early mistakes knock kids out, and celebrate both pointing and spoken replies so every student builds courage at their own speed.',
        ],
      },
    ],
    classroomChecklist: [
      'Cap active flashcard sets at 4–6 words for ages 3–4 and 6–9 words for ages 5–6.',
      'Avoid elimination rules—everyone keeps playing and hearing English input.',
      'Pair carpet TPR games directly with matching tabletop flashcards or bingo.',
      'Keep one laminated card ring by the rug for zero-prep transitions.',
    ],
    relatedWorksheetSlugs: [
      'tpr-classroom-command-cards-esl',
      'farm-animal-bingo-preschool',
      'classroom-objects-esl-flashcards',
      'feelings-cards-for-circle-time',
    ],
    relatedTools: [
      {
        href: '/tools/bingo-maker?theme=farm',
        title: 'Picture & Word Bingo Maker',
        subtitle: 'Generate up to 30 unique shuffled ESL bingo cards plus a caller checklist.',
        badge: 'Bingo',
      },
      {
        href: '/tools/flashcard-maker?theme=classroom',
        title: 'ESL Picture Flashcard Maker',
        subtitle: 'Print 2×2 or 3×3 visual decks across 21 themes for Memory Match and Four Corners.',
        badge: 'Flashcards',
      },
      {
        href: '/tools/i-spy-maker?theme=classroom',
        title: 'I Spy & Count Worksheet Maker',
        subtitle: 'Turn restless finishers into calm seated counters with auto Page 2 Answer Keys.',
        badge: 'I Spy',
      },
    ],
    faqs: [
      {
        question: 'How many words should be in a preschool ESL circle-time game?',
        answer:
          'Aim for 4 to 6 words for 3-year-olds and up to 8 or 9 words for 4- to 6-year-olds so games feel fast, upbeat, and winnable.',
      },
      {
        question: 'What is the easiest game for silent newcomers on Day 1?',
        answer:
          'Four Corners Card Hop, Stand Up If, and Freeze & Pose let silent learners demonstrate listening comprehension accurately with zero speaking pressure.',
      },
      {
        question: 'How can I turn printable flashcards into reusable tabletop games?',
        answer:
          'Print two identical sets of 3×3 picture flashcards on cardstock to create instant Memory Match, Go Fish, and Partner Tap games.',
      },
    ],
  },
  {
    slug: 'ten-frame-counting-activities-preschool-kindergarten',
    title: 'Ten-Frame Counting Activities for Preschool & Kindergarten (Numbers 0–20)',
    seoTitle: 'Ten-Frame Counting Guide (0–20)',
    description:
      'Build subitizing and number sense from 5-frames to teen numbers (11–20) using hands-on counters, Ten-Frame tracing, and I Spy counting.',
    category: 'Early Math & Counting',
    readingTime: '6 min read',
    targetAges: 'Ages 3–6',
    datePublished: '2026-11-26',
    dateModified: '2026-11-26',
    intro:
      'A ten frame—two neat rows of five boxes—does far more than hold pom-poms or mini-erasers. It teaches children to recognize quantities visually ("subitize") and quietly builds the mental math structure behind adding to ten and understanding teen numbers like 14 as "ten and four more."',
    sections: [
      {
        heading: '1. Why Five-Frames & Ten-Frames Beat Loose Line Counting',
        paragraphs: [
          'When preschoolers count scattered buttons, they often double-count items or lose track past five. Placing counters left-to-right across the top row of a ten frame locks in "5" as a crystal-clear visual anchor.',
          'Before long, a child glances at one full top row plus two extra counters on the bottom row and announces "Seven!" without recounting from one.',
        ],
      },
      {
        heading: '2. Developmental Progression: 0–5, 6–10 & Teen Numbers (11–20)',
        paragraphs: [
          'Respect each age band’s pace so numerals always connect to real counted sets rather than rote chanting.',
        ],
        bullets: [
          'Ages 3–4 (0 to 5): Fill only the top row; practice one-to-one touch counting and quick "How many?" flashes.',
          'Ages 4–5 (6 to 10): Fill top row first, then add counters left-to-right on the bottom row; ask "How many empty spaces to make 10?"',
          'Ages 5–6 (11 to 20): Place two ten frames side-by-side so learners see 13 as "one full ten and 3 ones."',
        ],
      },
      {
        heading: '3. Four Hands-On Ten-Frame Counter Routines',
        paragraphs: [
          'Warm up fingers and English number words simultaneously with everyday classroom manipulatives before handing out pencils.',
        ],
        bullets: [
          'Flash & Build: Hold up a dot card for 3 seconds; children rebuild the matching amount on desk frames.',
          'Roll & Fill: Roll a large foam die, count aloud in English, and place counters left-to-right.',
          'Mystery Empty Spaces: Fill 7 boxes with buttons and ask ESL learners, "How many empty boxes are left?"',
          'Theme Counters: Match seasonal manipulatives (acorns in fall, cotton-ball snowmen in winter) to themed math pages.',
        ],
      },
      {
        heading: '4. Connecting Manipulatives to Numeral Tracing & I Spy Counting',
        paragraphs: [
          'Once students build numbers physically, bridge straight onto guided Number Tracing sheets with built-in ten frames and dashed number words ("zero" through "twenty"). Follow up at small-group centers with visual I Spy & Count sheets where children scan mixed pictures, tally totals, and write numerals cleanly in counting boxes.',
        ],
      },
    ],
    classroomChecklist: [
      'Always model filling the top row left-to-right before moving to the bottom row.',
      'Pair spoken English plural nouns ("six frogs") with every ten-frame count.',
      'Highlight teen numbers (11–20) as "ten and some more" using double ten frames.',
      'Follow hands-on counters with guided numeral tracing and I Spy count-and-write pages.',
    ],
    relatedWorksheetSlugs: [
      'counting-1-to-5-ladybug-party',
      'shapes-flashcards-and-tracing',
      'winter-odd-one-out-visual-discrimination',
      'farm-animals-esl-vocabulary-and-tracing',
    ],
    relatedTools: [
      {
        href: '/tools/number-tracing',
        title: 'Number Tracing 0–20 & Ten-Frames',
        subtitle: 'Generate 0–10 or 0–20 sheets with Ten-Frame counting grids and dashed number words.',
        badge: 'Ten-Frames',
      },
      {
        href: '/tools/i-spy-maker?theme=animals',
        title: 'Animals I Spy & Count Maker',
        subtitle: 'Practice 1-to-1 scanning and write-in tallying with a Page 2 Answer Key.',
        badge: 'I Spy Count',
      },
      {
        href: '/tools/handwriting-maker',
        title: 'Number Words Handwriting Maker',
        subtitle: 'Build Read-Trace-Write lines for one through ten or eleven through twenty.',
        badge: 'Number Words',
      },
    ],
    faqs: [
      {
        question: 'Should kids fill a ten frame across rows or down columns?',
        answer:
          'Fill the top row completely from left to right (1–5) before starting the bottom row left to right (6–10). That makes the benchmark of 5 immediately visible.',
      },
      {
        question: 'When are children ready for teen numbers 11–20 on ten frames?',
        answer:
          'Once a learner counts 0–10 reliably with one-to-one correspondence and recognizes a full row of 5 instantly—commonly mid-to-late Pre-K or early Kindergarten.',
      },
      {
        question: 'How do ten frames help ESL preschoolers specifically?',
        answer:
          'Ten frames pair visual quantity patterns directly with spoken English number phrases ("one ten and four more") without heavy verbal instructions.',
      },
    ],
  },
  {
    slug: 'seasonal-preschool-esl-lesson-plans-fall-halloween-spring',
    title: 'Year-Round Seasonal Preschool ESL Lesson Plans: Fall, Halloween, Winter & Spring',
    seoTitle: 'Seasonal Preschool ESL Lesson Plans',
    description:
      'Reusable 4-day seasonal center plan and concrete 8-word vocabulary banks across Fall, Halloween, Christmas, Valentine’s, Spring, and Summer.',
    category: 'Seasonal Curriculum',
    readingTime: '6 min read',
    targetAges: 'Ages 3–6',
    datePublished: '2026-11-26',
    dateModified: '2026-11-26',
    intro:
      'Planning fresh preschool ESL lessons every week does not mean reinventing your classroom format every time the calendar flips. When you keep one familiar 4-day center structure and swap in seasonal themes—Fall, Halloween, Winter, Valentine’s, Spring, and Summer—children already know the rules and dive straight into new vocabulary.',
    sections: [
      {
        heading: '1. The Reusable 4-Day Seasonal ESL Center Rhythm',
        paragraphs: [
          'Keep your teaching structure identical year-round while rotating themed illustrations and target nouns:',
        ],
        bullets: [
          'Day 1 (Introduce & Act): Preview 6–8 themed picture flashcards at circle time with props or movement.',
          'Day 2 (Listen & Play): Run 3×3 Picture Bingo using simple spoken sentences ("Find the orange pumpkin!").',
          'Day 3 (Phonics & Matching): Practice initial letter sounds with seasonal Clip Cards or Picture Matching.',
          'Day 4 (Count & Review): Wrap up with a find-and-count I Spy worksheet or gentle 6×6 Picture Word Search.',
        ],
      },
      {
        heading: '2. Ready-to-Teach Seasonal 8-Word Vocabulary Banks',
        paragraphs: [
          'Pick 6 to 8 concrete, visual nouns per seasonal unit so flashcards, bingo cards, and counting sheets reinforce the exact same words all week.',
        ],
        bullets: [
          'Fall & Harvest: apple, pumpkin, acorn, leaf, squirrel, rake, pie, sweater',
          'Halloween (Kid-Friendly): pumpkin, ghost, bat, witch hat, spider, candy, owl, moon',
          'Winter & Christmas: snowman, snowflake, mitten, sled, bell, gift, star, stocking',
          'Valentine’s & Kindness: heart, card, rose, balloon, teddy, envelope, smile, friend',
          'Spring & Weather: flower, butterfly, umbrella, rain, rainbow, bee, frog, kite',
          'Summer & Beach: sun, beach ball, shell, sunglasses, popsicle, sandcastle, crab, boat',
        ],
      },
      {
        heading: '3. Inclusive Holiday Adaptations for Diverse Classrooms',
        paragraphs: [
          'In international or multicultural schools, combine universal nature themes alongside cultural holidays—pair October pumpkins with autumn leaves, December celebrations with snowmen and winter clothes, and February friendship units with feelings check-ins.',
        ],
      },
      {
        heading: '4. Build Reusable Seasonal Center Bins in 15 Minutes',
        paragraphs: [
          'Once you download a themed flashcard set, bingo pack, and I Spy sheet in US Letter or A4, slip the cards into one labeled seasonal zip pouch alongside 10 wooden clothespins. Next year’s planning takes thirty seconds.',
        ],
      },
    ],
    classroomChecklist: [
      'Keep your 4-day Flashcards → Bingo → Clip Cards → I Spy structure consistent all year.',
      'Select 6–8 concrete nouns per seasonal theme to avoid vocabulary overload.',
      'Use kid-friendly autumn, weather, and friendship pairings in diverse ESL groups.',
      'Store laminated cards + clothespins in labeled monthly pouches for next year.',
    ],
    relatedWorksheetSlugs: [
      'winter-vocabulary-pack-preschool',
      'winter-clothes-esl-word-cards',
      'valentines-day-preschool-printables',
      'preschool-weather-chart-and-cards',
    ],
    relatedTools: [
      {
        href: '/tools/i-spy-maker?theme=halloween',
        title: 'Seasonal I Spy & Count Maker',
        subtitle: 'Switch seamlessly between Halloween, Fall, Winter, Valentine’s, Spring, and Summer.',
        badge: 'I Spy',
      },
      {
        href: '/tools/bingo-maker?theme=fall',
        title: 'Seasonal Picture Bingo Maker',
        subtitle: 'Print up to 30 shuffled boards for seasonal classroom parties and reviews.',
        badge: 'Bingo',
      },
      {
        href: '/tools/flashcard-maker?theme=spring',
        title: 'Seasonal Picture Flashcards',
        subtitle: 'Create coloring-friendly seasonal decks with optional traceable labels.',
        badge: 'Flashcards',
      },
      {
        href: '/tools/clip-cards-maker?theme=valentines',
        title: 'Seasonal Beginning Sounds Clip Cards',
        subtitle: 'Practice phonics all year long with holiday and weather clothespin sets.',
        badge: 'Clip Cards',
      },
    ],
    faqs: [
      {
        question: 'How long should a seasonal preschool ESL theme run?',
        answer:
          'One to two weeks works well for holidays like Halloween or Valentine’s, while broader seasons like Fall, Winter, and Spring can anchor 3–4 sub-themes across the month.',
      },
      {
        question: 'Are the Halloween and Christmas drawings preschool-friendly?',
        answer:
          'Yes—every seasonal drawing on KinderESL uses cheerful, smiling black-ink line art designed specifically for ages 3 to 6.',
      },
      {
        question: 'Can I mix seasonal themes with alphabet or counting practice?',
        answer:
          'Yes! Use seasonal Clip Cards for beginning sounds and seasonal I Spy worksheets for 1-to-1 counting inside the exact same theme.',
      },
    ],
  },
];

export function getGuideBySlug(slug: string): EducatorGuide | undefined {
  return guides.find((g) => g.slug === slug);
}
