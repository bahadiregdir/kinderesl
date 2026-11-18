export function getContactEmail(): string {
  const envEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL;
  if (envEmail && envEmail.trim() !== '') {
    return envEmail.trim();
  }
  return '[BURAYA GERÇEK E-POSTA]';
}

export function getSiteUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (envUrl && envUrl.trim() !== '') {
    return envUrl.replace(/\/+$/, '');
  }
  const vercelProdUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercelProdUrl && vercelProdUrl.trim() !== '') {
    return `https://${vercelProdUrl.replace(/\/+$/, '')}`;
  }
  return 'https://kinderesl.com';
}

export const siteConfig = {
  name: "KinderESL",
  legalName: "KinderESL Educational Resources",
  domain: "kinderesl.com",
  get url() {
    return getSiteUrl();
  },
  get contactEmail() {
    return getContactEmail();
  },
  tagline: "Free Printable Resources for Preschool, Kindergarten & ESL Educators",
  description:
    "A printable educational resource hub for early childhood educators, preschool & kindergarten teachers, and homeschooling parents. Download free printable PDF worksheets, phonics packs, and ESL vocabulary sets.",

  // Author Profile Template (E-E-A-T)
  // Fill in real credentials and name when ready
  author: {
    name: "KinderESL Teaching Team",
    slug: "kinderesl-team",
    role: "Early Childhood Educator & Content Creator",
    shortBio:
      "Educational materials created for preschool, kindergarten, and early ESL classrooms with a focus on handwriting readiness, phonics, and early math.",
    fullBio:
      "KinderESL resources are created for early childhood teachers and homeschooling parents. The worksheets focus on simple, high-contrast layouts, handwriting stroke directionality, and clear learning milestones for young learners.",
    credentials: [
      "Early Childhood ESL Education Focus",
      "Preschool & Kindergarten Learning Printables",
    ],
    avatar: "/images/author-avatar.jpg",
  },

  // Pinterest settings
  pinterest: {
    handle: "",
    url: "", // Leave empty until real account is configured
    verificationToken: "", // Leave empty until real verification token is provided
  },

  // AdSense & Monetization settings
  adsense: {
    client: "", // Real AdSense publisher ID (e.g. ca-pub-1234567890123456)
    enabled: false,
    slots: {
      inContent: "",
      sidebar: "",
      preDownload: "",
    },
    rewardedAdEnabled: false,
  },

  // Navigation: shapes-colors removed as requested (item 7)
  mainNav: [
    { title: "All Worksheets", href: "/worksheets" },
    { title: "Literacy & Phonics", href: "/worksheets/literacy" },
    { title: "Early Math", href: "/worksheets/math" },
    { title: "Thinking Skills", href: "/worksheets/thinking-skills" },
    { title: "ESL Vocabulary", href: "/worksheets/esl-vocabulary" },
    { title: "Themes", href: "/themes" },
    { title: "Monthly Curriculums", href: "/preschool-themes" },
  ],

  footerNav: {
    worksheets: [
      { title: "Letter A Tracing & Phonics", href: "/worksheets/literacy/letter-a-tracing-and-phonics" },
      { title: "Numbers 1 to 5 Counting", href: "/worksheets/math/counting-1-to-5-ladybug-party" },
      { title: "Winter Discrimination", href: "/worksheets/thinking-skills/winter-odd-one-out-visual-discrimination" },
      { title: "Farm Animals Match & Cut-Paste", href: "/worksheets/esl-vocabulary/farm-animals-esl-vocabulary-and-tracing" },
    ],
    categories: [
      { title: "Literacy & Phonics", href: "/worksheets/literacy" },
      { title: "Early Math", href: "/worksheets/math" },
      { title: "Thinking Skills", href: "/worksheets/thinking-skills" },
      { title: "ESL Vocabulary", href: "/worksheets/esl-vocabulary" },
    ],
    themes: [
      { title: "Winter Theme", href: "/themes/winter" },
      { title: "Farm Animals", href: "/themes/farm-animals" },
      { title: "Insects & Bugs", href: "/themes/insects-bugs" },
      { title: "Alphabet Themes", href: "/themes/alphabet" },
    ],
    company: [
      { title: "About & Pedagogy", href: "/about" },
      { title: "Contact & Teacher Requests", href: "/contact" },
      { title: "Terms of Use", href: "/terms" },
      { title: "Privacy Policy", href: "/privacy-policy" },
      { title: "Cookie Policy", href: "/cookie-policy" },
    ],
  },
};
