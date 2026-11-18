export const siteConfig = {
  name: "KinderESL",
  legalName: "KinderESL Educational Resources",
  domain: "kinderesl.com",
  url: "https://kinderesl.com",
  tagline: "Free Printable Resources for Preschool, Kindergarten & ESL Educators",
  description:
    "A research-backed curriculum resource hub for early childhood educators, preschool & kindergarten teachers, and homeschooling parents. Download free, classroom-tested printable PDF worksheets, phonics packs, and ESL vocabulary sets.",
  
  // E-E-A-T Author Profile
  // NOTE: You can change the author name and bio here to your spouse's name!
  author: {
    name: "Elena Ross, M.Ed.", // <-- Change this to your spouse's name
    slug: "elena-ross",
    role: "Early Childhood ESL Educator & Curriculum Specialist",
    shortBio:
      "Preschool & Kindergarten ESL educator with over 10 years of classroom experience across international early childhood programs. Specializes in early literacy, phonemic awareness, and fine-motor handwriting development.",
    fullBio:
      "Elena Ross holds a Master of Education (M.Ed.) in Early Childhood Curriculum & Instruction. For over a decade, she has guided multilingual early learners across preschool and kindergarten classrooms in the United States and international schools. She designs pedagogical resources centered on joyful, low-anxiety language acquisition, sensory-rich handwriting strokes, and concrete mathematical foundations. Every worksheet published on KinderESL is classroom-tested with real young learners before release.",
    credentials: [
      "M.Ed. in Early Childhood Curriculum & Instruction",
      "Certified ESL/ELL Early Years Specialist",
      "10+ Years Kindergarten & Preschool Classroom Teaching",
      "Author of Phonics-First Pre-K Learning Pathways",
    ],
    avatar: "/images/author-avatar.jpg",
  },

  // Pinterest & Social
  pinterest: {
    handle: "kinderesl",
    url: "https://pinterest.com/kinderesl",
    // Paste your Pinterest HTML tag verification code here:
    verificationToken: "pinterest-site-verification-code-placeholder",
  },

  // AdSense & Monetization settings
  adsense: {
    client: "ca-pub-XXXXXXXXXXXXXXXX", // Replace with your AdSense publisher ID
    enabled: false, // Set to true once your AdSense account is approved
    slots: {
      inContent: "1234567890",
      sidebar: "2345678901",
      preDownload: "3456789012",
    },
    // AdSense Offerwall / Rewarded Ad Gate (prepared for future activation)
    rewardedAdEnabled: false,
  },

  // Multilingual & i18n roadmap
  i18n: {
    defaultLocale: "en",
    locales: ["en", "tr"],
    localeNames: {
      en: "English",
      tr: "Türkçe (Yakında)",
    },
  },

  mainNav: [
    { title: "All Worksheets", href: "/worksheets" },
    { title: "Literacy & Phonics", href: "/worksheets/literacy" },
    { title: "Early Math", href: "/worksheets/math" },
    { title: "Thinking Skills", href: "/worksheets/thinking-skills" },
    { title: "ESL Vocabulary", href: "/worksheets/esl-vocabulary" },
    { title: "Themes", href: "/themes" },
    { title: "Monthly Curriculums", href: "/preschool-themes" },
    { title: "Classroom Games", href: "/games" },
  ],

  footerNav: {
    worksheets: [
      { title: "Letter A Tracing & Phonics", href: "/worksheets/literacy/letter-a-tracing-and-phonics" },
      { title: "Numbers 1 to 5 Counting", href: "/worksheets/math/counting-1-to-5-ladybug-party" },
      { title: "Winter Discrimination", href: "/worksheets/thinking-skills/winter-odd-one-out-visual-discrimination" },
      { title: "Farm Animals Vocabulary", href: "/worksheets/esl-vocabulary/farm-animals-esl-vocabulary-and-tracing" },
    ],
    categories: [
      { title: "Literacy & Letters", href: "/worksheets/literacy" },
      { title: "Numbers & Math", href: "/worksheets/math" },
      { title: "Logic & Discrimination", href: "/worksheets/thinking-skills" },
      { title: "ESL Vocabulary Sets", href: "/worksheets/esl-vocabulary" },
      { title: "Shapes & Colors", href: "/worksheets/shapes-colors" },
    ],
    themes: [
      { title: "Winter Theme", href: "/themes/winter" },
      { title: "Farm Animals", href: "/themes/farm-animals" },
      { title: "Insects & Bugs", href: "/themes/insects-bugs" },
      { title: "Alphabet Themes", href: "/themes/alphabet" },
    ],
    company: [
      { title: "About Elena & Mission", href: "/about" },
      { title: "Contact & Teacher Requests", href: "/contact" },
      { title: "Terms of Use", href: "/terms" },
      { title: "Privacy Policy", href: "/privacy-policy" },
      { title: "Cookie Policy", href: "/cookie-policy" },
    ],
  },
};
