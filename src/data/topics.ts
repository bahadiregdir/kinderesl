import { TopicMeta } from '@/types/worksheet';

export const topics: TopicMeta[] = [
  {
    slug: 'farm-animals',
    title: 'Farm Animals',
    description: 'Barnyard animal vocabulary, animal sounds, matching, and cut-and-paste fine-motor printables.',
    iconName: 'Sparkles',
    curriculumMonths: [3, 4, 9], // Spring & Fall farm units
    plannedTitles: [
      'Baby Farm Animals: Match Mother and Baby',
      'Barnyard Counting: 1 to 5 with Farm Friends',
      'What Do Farm Animals Eat? Food Matching Activity',
    ],
    faqs: [
      {
        question: 'Why are farm animals popular in early ESL classrooms?',
        answer: 'Animal sounds (moo, baa, oink) provide low-stress, engaging phonetic practice for young multilingual learners before formal reading instruction.',
      },
    ],
  },
  {
    slug: 'winter',
    title: 'Winter & Cold Weather',
    description: 'Snow, penguins, warm clothing, winter sports, and visual discrimination activities.',
    iconName: 'Snowflake',
    curriculumMonths: [12, 1, 2], // December, January, February
    plannedTitles: [
      'Winter Clothes Tracing: Mitten, Hat, Scarf',
      'Snowman Counting & Dot-to-Dot Numbers 1–10',
      'Winter Animals Hibernation & Arctic Match',
    ],
    faqs: [
      {
        question: 'How do seasonal winter printables support cognitive sorting?',
        answer: 'Children compare winter clothing and weather with warm-weather items, developing feature analysis and categorization skills.',
      },
    ],
  },
  {
    slug: 'insects',
    title: 'Insects & Bugs',
    description: 'Ladybugs, ants, butterflies, bees, counting, and symmetry activities for young learners.',
    iconName: 'Bug',
    curriculumMonths: [4, 5], // April & May
    plannedTitles: [
      'Butterfly Wing Symmetry & Dot-to-Dot Tracing',
      'Beehive Number Matching 1 to 10',
      'Caterpillar Word Family Crawl',
    ],
    faqs: [
      {
        question: 'What fine-motor benefits do insect printables offer?',
        answer: 'Small insect counting spots and antennae tracing encourage pencil tip precision and fine finger control.',
      },
    ],
  },
  {
    slug: 'food',
    title: 'Food & Nutrition',
    description: 'Fruits, vegetables, healthy snacks, counting, and letter sound association printables.',
    iconName: 'Apple',
    curriculumMonths: [9, 10, 11], // Fall harvest
    plannedTitles: [
      'Fruit Salad Counting & Color Sorting',
      'Vegetable Patch Beginning Sounds Match',
      'Healthy vs. Treat Food Sorting Mats',
    ],
    faqs: [
      {
        question: 'How are food themes integrated into early phonics?',
        answer: 'Everyday foods (apple for A, banana for B, carrot for C) offer instant concrete anchors for phonemic awareness.',
      },
    ],
  },
  {
    slug: 'clothes',
    title: 'Clothes & Dressing',
    description: 'Seasonal apparel, shoes, weather-appropriate dressing, and color word tracing.',
    iconName: 'Shirt',
    curriculumMonths: [1, 9, 11],
    plannedTitles: [
      'Dress for the Weather: Summer vs. Winter Outfits',
      'Matching Pairs: Shoes, Socks, and Mittens',
      'Color the Clothes: Color Words Reading Activity',
    ],
    faqs: [
      {
        question: 'How does the clothing theme build everyday functional vocabulary?',
        answer: 'Clothing vocabulary directly connects to daily self-help routines (putting on boots, zipping jackets, wearing hats).',
      },
    ],
  },
  {
    slug: 'weather',
    title: 'Weather & Seasons',
    description: 'Sun, rain, clouds, snow, wind, and daily weather calendar tracing printables.',
    iconName: 'CloudSun',
    curriculumMonths: [3, 9, 11],
    plannedTitles: [
      'Daily Weather Chart & Trace the Words',
      'Four Seasons Tree Tracing & Coloring Pack',
      'Rainy Day Counting: Puddles and Umbrellas',
    ],
    faqs: [
      {
        question: 'How do daily weather worksheets fit into morning circle time?',
        answer: 'Children observe window conditions and match corresponding weather vocabulary cards or trace the daily weather icon.',
      },
    ],
  },
  {
    slug: 'family',
    title: 'Family & Home',
    description: 'Family members, home rooms, daily routines, and caring relationships printables.',
    iconName: 'Users',
    curriculumMonths: [2, 5],
    plannedTitles: [
      'My Family Tree: Trace & Draw Mom, Dad, Siblings',
      'Rooms in My House Vocabulary Match',
      'Helping at Home: Chore & Action Verbs Match',
    ],
    faqs: [
      {
        question: 'Why is the family theme introduced early in preschool?',
        answer: 'Family units allow children to share personal experiences while learning high-frequency relationship vocabulary in English.',
      },
    ],
  },
  {
    slug: 'body',
    title: 'Body & Five Senses',
    description: 'Body parts, facial expressions, hygiene, and five senses exploration printables.',
    iconName: 'Activity',
    curriculumMonths: [9, 10],
    plannedTitles: [
      'Label My Body Parts: Head, Shoulders, Knees, Toes',
      'The Five Senses Match & Cut-and-Paste',
      'Facial Expressions & Feelings Matching Mats',
    ],
    faqs: [
      {
        question: 'How does Total Physical Response (TPR) work with body vocabulary?',
        answer: 'Teachers sing chants like "Head, Shoulders, Knees and Toes" while pointing to body parts, accelerating muscle memory recall.',
      },
    ],
  },
  {
    slug: 'transportation',
    title: 'Transportation & Vehicles',
    description: 'Cars, buses, airplanes, boats, trains, and land-air-water sorting sheets.',
    iconName: 'Car',
    curriculumMonths: [1, 5],
    plannedTitles: [
      'Land, Air, and Water Vehicle Sorting Mats',
      'Trace the Vehicle Paths: Straight & Zig-Zag Lines',
      'Traffic Light Colors & Safety Words Activity',
    ],
    faqs: [
      {
        question: 'What pre-writing skills are developed through vehicle paths?',
        answer: 'Following road paths, airplane flight loops, and train tracks strengthens horizontal line tracking and eye-hand coordination.',
      },
    ],
  },
  {
    slug: 'spring',
    title: 'Spring Season',
    description: 'Flowers, rain, birds, gardening, and green nature renewal activities.',
    iconName: 'Flower2',
    curriculumMonths: [3, 4, 5],
    plannedTitles: [
      'Spring Flower Tracing & Number Counting 1–5',
      'Bird Nest Egg Counting & Numeral Match',
      'Life Cycle of a Plant: Cut-and-Paste Sequence',
    ],
    faqs: [
      {
        question: 'When is the best time to introduce spring worksheets?',
        answer: 'Typically between March and May, aligning with outdoor nature observations and changes in classroom weather calendars.',
      },
    ],
  },
  {
    slug: 'summer',
    title: 'Summer Season',
    description: 'Beach, ocean animals, sunshine, camping, and warm weather activities.',
    iconName: 'Sun',
    curriculumMonths: [6, 7, 8],
    plannedTitles: [
      'Beach Day Counting: Seashells & Sandcastles',
      'Ocean Animals Vocabulary & Shadow Match',
      'Summer Campfire Shape Tracing',
    ],
    faqs: [
      {
        question: 'Are summer worksheets useful for summer camps and homeschool review?',
        answer: 'Yes, lightweight one-sheet activities prevent the "summer slide" while keeping learning playful and thematic.',
      },
    ],
  },
  {
    slug: 'fall',
    title: 'Fall & Autumn',
    description: 'Leaves, acorns, pumpkins, squirrels, and harvest season printables.',
    iconName: 'Leaf',
    curriculumMonths: [9, 10, 11],
    plannedTitles: [
      'Autumn Leaves Color-by-Number Activity',
      'Acorn Counting & Tracing with Sammy Squirrel',
      'Pumpkin Patch Size Sorting: Small, Medium, Large',
    ],
    faqs: [
      {
        question: 'How do fall printables connect with back-to-school routines?',
        answer: 'They bridge the classroom transition in September with familiar natural autumn themes that spark conversational curiosity.',
      },
    ],
  },
  {
    slug: 'holidays',
    title: 'Holidays & Celebrations',
    description: 'Festive cultural milestones, greeting cards, gratitude, and holiday vocabulary printables.',
    iconName: 'Gift',
    curriculumMonths: [10, 11, 12],
    plannedTitles: [
      'Gratitude Turkey Feathers Writing & Coloring',
      'Holiday Gift Box Shape Tracing',
      'New Year Clock Counting & Celebration Signs',
    ],
    faqs: [
      {
        question: 'Are holiday activities designed to be inclusive?',
        answer: 'Yes, our seasonal printables focus on universal seasonal celebrations, kindness, gratitude, and community sharing.',
      },
    ],
  },
];

export function getTopicBySlug(slug: string): TopicMeta | undefined {
  return topics.find((t) => t.slug === slug);
}
