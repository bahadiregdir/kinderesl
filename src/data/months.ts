import { MonthMeta } from '@/types/worksheet';
import { topics } from './topics';

const monthData: Omit<MonthMeta, 'topicSlugs'>[] = [
  {
    monthNumber: 1,
    slug: 'january',
    name: 'January',
    season: 'Winter',
    description: 'Winter weather, arctic animals, cold-weather clothing, and cozy indoor learning printables.',
    plannedTitles: [
      'January Morning Calendar & Weather Wheel',
      'Arctic Animals Cut-and-Paste Habitat Mat',
      'Winter Mittens Color Matching Activity',
    ],
    faqs: [
      {
        question: 'What are the core preschool themes for January?',
        answer: 'January focuses on winter exploration, penguins, polar bears, snow experiments, and winter gear vocabulary.',
      },
    ],
  },
  {
    monthNumber: 2,
    slug: 'february',
    name: 'February',
    season: 'Winter',
    description: 'Friendship, kindness, community helpers, dental health, and groundhog winter predictions.',
    plannedTitles: [
      'Friendship Heart Counting & Tracing 1–10',
      'Dental Health Smile & Teeth Brushing Chart',
      'Community Helpers Matching Mats: Doctor, Firefighter, Teacher',
    ],
    faqs: [
      {
        question: 'Which themes work best for February in ESL kindergarten?',
        answer: 'February is ideal for social-emotional vocabulary (sharing, kindness, feelings) and health routines.',
      },
    ],
  },
  {
    monthNumber: 3,
    slug: 'march',
    name: 'March',
    season: 'Spring',
    description: 'Windy weather, kites, early spring renewal, green plants, and farm introduction.',
    plannedTitles: [
      'Windy Day Kite Number Tracing 1 to 10',
      'Spring Seed Sprout Observation Log',
      'Farm Animals First Words Picture Cards',
    ],
    faqs: [
      {
        question: 'How to transition curriculum from winter to spring in March?',
        answer: 'Introduce weather observations comparing cold blizzards to windy, rainy spring days and initial garden vocabulary.',
      },
    ],
  },
  {
    monthNumber: 4,
    slug: 'april',
    name: 'April',
    season: 'Spring',
    description: 'Spring rain showers, growing gardens, blooming flowers, insects, and Earth Day awareness.',
    plannedTitles: [
      'Raindrop Number Tracing: Count the Showers',
      'Earth Day Recycling Sort: Paper, Plastic, Can',
      'Ladybug Spot Counting & Math Ten-Frames',
    ],
    faqs: [
      {
        question: 'What fine-motor spring activities are recommended in April?',
        answer: 'Cut-and-paste flower petals, raindrop vertical line tracing, and garden planting sequence sheets.',
      },
    ],
  },
  {
    monthNumber: 5,
    slug: 'may',
    name: 'May',
    season: 'Spring',
    description: 'Butterflies, garden bugs, Mother’s Day cards, transportation, and family themes.',
    plannedTitles: [
      'Mother’s Day Handprint Poem & Flower Tracing',
      'Butterfly Life Cycle Ordering Worksheet',
      'Vehicles on the Go: Cars, Buses, Bikes Match',
    ],
    faqs: [
      {
        question: 'Why are insect and bug themes emphasized in May?',
        answer: 'Warmer weather enables outdoor recess bug hunts, providing immediate physical anchors for insect vocabulary.',
      },
    ],
  },
  {
    monthNumber: 6,
    slug: 'june',
    name: 'June',
    season: 'Summer',
    description: 'Summer season welcome, beach trips, ocean marine life, picnics, and warm weather.',
    plannedTitles: [
      'Ocean Marine Animals Vocabulary Tracing',
      'Beach Bag Packing: Circle the Summer Items',
      'Sun Safety Words & Hat Tracing Sheet',
    ],
    faqs: [
      {
        question: 'How to keep preschool skills active during June transitions?',
        answer: 'Engage children with lightweight color-and-trace sheets celebrating ocean and beach topics.',
      },
    ],
  },
  {
    monthNumber: 7,
    slug: 'july',
    name: 'July',
    season: 'Summer',
    description: 'Sunshine, camping, picnics, fireworks, water play, and ice cream counting.',
    plannedTitles: [
      'Ice Cream Cone Scoop Counting 1–5',
      'Camping Tent & Forest Animal Tracing',
      'Summer Fruit Salad Pattern Cards',
    ],
    faqs: [
      {
        question: 'Are July worksheets designed for homeschool and camp settings?',
        answer: 'Yes, quick 10-minute printable exercises provide structured learning without screen fatigue.',
      },
    ],
  },
  {
    monthNumber: 8,
    slug: 'august',
    name: 'August',
    season: 'Summer',
    description: 'Back-to-school preparation, classroom routines, friendship rules, and pencil grip practice.',
    plannedTitles: [
      'School Backpack Essentials Tracing & Match',
      'Classroom Rules & Sharing Manners Picture Cards',
      'Pencil Control Lines: Back to School Pre-Writing',
    ],
    faqs: [
      {
        question: 'What preschool skills should be reinforced in late August?',
        answer: 'Fine-motor pencil grasp, listening to simple teacher instructions, and recognizing personal cubby names.',
      },
    ],
  },
  {
    monthNumber: 9,
    slug: 'september',
    name: 'September',
    season: 'Fall',
    description: 'Letter of the Week launch, apple harvest, school routines, and farm animals.',
    plannedTitles: [
      'Apple Tree Counting & Color by Number',
      'Meet the Teacher Introduction & All About Me Mat',
      'School Bus Shape & Path Tracing Practice',
    ],
    faqs: [
      {
        question: 'Why start the formal Letter of the Week series in September?',
        answer: 'September aligns with the official school year launch across US, UK, and Canadian preschool curriculums.',
      },
    ],
  },
  {
    monthNumber: 10,
    slug: 'october',
    name: 'October',
    season: 'Fall',
    description: 'Autumn leaves, pumpkins, nocturnal animals (owls, bats), and harvest celebrations.',
    plannedTitles: [
      'Pumpkin Patch Number Tracing 1 to 10',
      'Nocturnal Forest Animals Flashcards',
      'Autumn Leaf Color Sorting Activity',
    ],
    faqs: [
      {
        question: 'How do autumn sensory themes benefit ESL vocabulary building?',
        answer: 'Sensory words like crunchy leaves, orange pumpkins, and cool winds anchor rich adjective usage.',
      },
    ],
  },
  {
    monthNumber: 11,
    slug: 'november',
    name: 'November',
    season: 'Fall',
    description: 'Gratitude, family meals, turkey themes, squirrels, acorns, and food appreciation.',
    plannedTitles: [
      'Thankful Feathers Writing & Drawing Sheet',
      'Squirrel & Acorn Pre-Math Maze 1–10',
      'Healthy Feast Food Classification Mats',
    ],
    faqs: [
      {
        question: 'What values are emphasized in November preschool units?',
        answer: 'Gratitude, table manners, recognizing healthy family foods, and seasonal wildlife preparation.',
      },
    ],
  },
  {
    monthNumber: 12,
    slug: 'december',
    name: 'December',
    season: 'Winter',
    description: 'Winter solstice, gingerbread, gift sharing, bells, snowflakes, and festive celebrations.',
    plannedTitles: [
      'Gingerbread Person Button Counting & Match',
      'Snowflake Symmetry & Dot Tracing Sheet',
      'Holiday Gift Box Geometric Shape Match',
    ],
    faqs: [
      {
        question: 'How do December activities support inclusive multicultural classrooms?',
        answer: 'They emphasize seasonal cheer, kindness, gifting, and universal winter wonder.',
      },
    ],
  },
];

export const months: MonthMeta[] = monthData.map((m) => {
  const matchingTopicSlugs = topics
    .filter((t) => t.curriculumMonths.includes(m.monthNumber))
    .map((t) => t.slug);

  return {
    ...m,
    topicSlugs: matchingTopicSlugs,
  };
});

export function getMonthBySlug(slug: string): MonthMeta | undefined {
  return months.find((m) => m.slug.toLowerCase() === slug.toLowerCase());
}

export function getMonthByNumber(num: number): MonthMeta | undefined {
  return months.find((m) => m.monthNumber === num);
}
