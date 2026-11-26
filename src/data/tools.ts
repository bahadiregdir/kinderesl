import type { Metadata } from 'next';
import { getSiteUrl } from '@/config/site';
import { buildSeoDescription, buildSeoTitle } from '@/lib/seo-meta';
import { CLIPART_COUNT } from '@/lib/clipart';

export type ToolPreviewKind =
  | 'name-tracing'
  | 'bingo-maker'
  | 'letter-tracing'
  | 'number-tracing'
  | 'handwriting-maker'
  | 'flashcard-maker'
  | 'i-spy-maker'
  | 'matching-maker'
  | 'word-search-maker'
  | 'clip-cards-maker'
  | 'pattern-maker'
  | 'mini-book-maker'
  | 'domino-maker'
  | 'generic';

export interface ToolRegistryItem {
  slug: string;
  path: string;
  seoTitle: string;
  description: string;
  ogTitle: string;
  ogSubtitle: string;
  ogBadges: string[];
  ogAlt: string;
  pinDescription: string;
  sampleHeading: string;
  sampleCaption: string;
  schemaName: string;
  previewKind: ToolPreviewKind;
}

export const TOOL_REGISTRY: Record<string, ToolRegistryItem> = {
  'name-tracing': {
    slug: 'name-tracing',
    path: '/tools/name-tracing',
    seoTitle: 'Free Name Tracing Worksheet Generator',
    description:
      'Create custom printable name tracing PDF worksheets for preschool and kindergarten in seconds. Supports US Letter & A4, batch class lists up to 30 names.',
    ogTitle: 'Free Name Tracing Worksheet Maker',
    ogSubtitle: 'Preschool & Kindergarten · Free PDF',
    ogBadges: ['US Letter & A4', 'Up to 30 Kids'],
    ogAlt:
      'Free Name Tracing Worksheet Maker — Printable dashed EMMA handwriting worksheet preview for preschool and kindergarten',
    pinDescription:
      'Free Custom Name Tracing Worksheet Maker for Preschool & Kindergarten! Type one name or a whole class list (up to 30 kids) and download US Letter or A4 dashed tracing PDFs free at KinderESL.com.',
    sampleHeading: 'Printable Output Preview',
    sampleCaption:
      'Clean ball-and-stick dashed letters with directional starting dots ready for US Letter or A4 printing.',
    schemaName: 'KinderESL Free Name Tracing Worksheet Generator',
    previewKind: 'name-tracing',
  },
  'bingo-maker': {
    slug: 'bingo-maker',
    path: '/tools/bingo-maker',
    seoTitle: 'Free ESL Picture & Word Bingo Card Generator',
    description:
      `Create up to 30 unique shuffled printable ESL picture or word bingo cards in US Letter or A4 PDF with a teacher caller checklist. ${CLIPART_COUNT} illustrations built in.`,
    ogTitle: 'Free ESL Picture Bingo Maker',
    ogSubtitle: 'Pictures & Words · 3×3 & 4×4 Free PDF',
    ogBadges: ['Picture & Word Modes', 'Caller Checklist'],
    ogAlt:
      'Free ESL Picture Bingo Card Generator — Printable 3x3 ESL vocabulary bingo card with FREE center space for preschool and kindergarten',
    pinDescription:
      'Free Printable ESL Picture & Word Bingo Card Generator for Preschool & Kindergarten! Build up to 30 uniquely shuffled 3x3 or 4x4 picture bingo cards plus a Teacher Caller Checklist at KinderESL.com.',
    sampleHeading: 'Printable Output Preview',
    sampleCaption:
      'Uniquely shuffled 3×3 or 4×4 student picture & word bingo boards paired with a printable caller sheet.',
    schemaName: 'KinderESL Free ESL Picture & Word Bingo Card Generator',
    previewKind: 'bingo-maker',
  },
  'flashcard-maker': {
    slug: 'flashcard-maker',
    path: '/tools/flashcard-maker',
    seoTitle: 'Free Printable ESL Picture Flashcard Maker',
    description:
      `Build custom printable ESL picture flashcards in US Letter or A4 PDF from ${CLIPART_COUNT} coloring-friendly drawings or your own uploaded images. Supports 2×2, 2×3, and 3×3 cards.`,
    ogTitle: 'Free ESL Picture Flashcard Maker',
    ogSubtitle: `${CLIPART_COUNT} Drawings + Custom Upload · Free PDF`,
    ogBadges: ['2×2, 2×3 & 3×3 Cards', 'Picture + Trace Mode'],
    ogAlt:
      'Free Printable ESL Picture Flashcard Maker — Printable 2x2 ESL vocabulary flashcards with coloring-friendly line art',
    pinDescription:
      `Free Printable ESL Picture Flashcard Maker! Pick from ${CLIPART_COUNT} coloring-friendly drawings or upload your own images to create 2x2, 2x3, or 3x3 PDF flashcard decks at KinderESL.com.`,
    sampleHeading: 'Printable Output Preview',
    sampleCaption:
      'Clean 2×2, 2×3, and 3×3 printable flashcards with optional traceable words.',
    schemaName: 'KinderESL Free ESL Picture Flashcard Maker',
    previewKind: 'flashcard-maker',
  },
  'i-spy-maker': {
    slug: 'i-spy-maker',
    path: '/tools/i-spy-maker',
    seoTitle: 'Free Printable I Spy Worksheet Maker',
    description:
      `Create custom find-and-count printable I Spy PDF worksheets in US Letter or A4 from ${CLIPART_COUNT} coloring-friendly drawings, complete with counting boxes and a verified Page 2 Answer Key.`,
    ogTitle: 'Free I Spy Worksheet Maker',
    ogSubtitle: 'Find, Color & Count · + Answer Key PDF',
    ogBadges: ['11 Seasonal & CVC Themes', 'Auto Answer Key'],
    ogAlt:
      'Free Printable I Spy Worksheet Maker — Custom find-and-count ESL and preschool I Spy worksheet preview with counting checklist',
    pinDescription:
      'Free Printable I Spy Worksheet Maker for Preschool & Kindergarten! Pick Winter, Christmas, Farm, or CVC Phonics themes, choose difficulty, and print US Letter or A4 PDFs + Answer Key at KinderESL.com.',
    sampleHeading: 'Printable Output Preview',
    sampleCaption:
      'Non-overlapping coloring-book search field with write-in counting boxes and answer key.',
    schemaName: 'KinderESL Free Printable I Spy Worksheet Maker',
    previewKind: 'i-spy-maker',
  },
  'matching-maker': {
    slug: 'matching-maker',
    path: '/tools/matching-maker',
    seoTitle: 'Free Beginning Sounds & Picture Matching Maker',
    description:
      `Create printable draw-a-line matching PDF worksheets in US Letter or A4 from ${CLIPART_COUNT} preschool drawings. Supports Picture-Word and Picture-Beginning Letter modes + Answer Key.`,
    ogTitle: 'Free Picture Matching Maker',
    ogSubtitle: 'Pictures ↔ Words & Letters · Free PDF',
    ogBadges: ['Picture & Phonics Modes', 'Auto Answer Key'],
    ogAlt:
      'Free Beginning Sounds and Picture Matching Maker — Printable draw-a-line matching worksheet with ESL illustrations',
    pinDescription:
      'Free Beginning Sounds & Picture Matching Worksheet Maker! Connect preschool illustrations to English words or beginning letters with automatic Answer Key in US Letter or A4 at KinderESL.com.',
    sampleHeading: 'Printable Output Preview',
    sampleCaption:
      'Clean draw-a-line matching columns with picture cards and beginning letters.',
    schemaName: 'KinderESL Free Beginning Sounds & Picture Matching Maker',
    previewKind: 'matching-maker',
  },
  'word-search-maker': {
    slug: 'word-search-maker',
    path: '/tools/word-search-maker',
    seoTitle: 'Free Easy Picture Word Search Maker (Pre-K & K)',
    description:
      'Generate beginner-friendly 6×6 and 8×8 picture word search PDF puzzles for preschool and kindergarten with strictly across/down words, Picture Word Bank, and Answer Key.',
    ogTitle: 'Free Picture Word Search Maker',
    ogSubtitle: 'Kid-Friendly 6×6 & 8×8 · + Word Bank',
    ogBadges: ['No Backwards Words', 'Picture Word Bank'],
    ogAlt:
      'Free Easy Picture Word Search Maker — Kid-friendly 8x8 word search grid paired with illustrated Picture Word Bank',
    pinDescription:
      'Free Easy Picture Word Search Maker for Preschool & Kindergarten! Build 6x6 or 8x8 across-and-down puzzles with Picture Word Banks and Answer Keys at KinderESL.com.',
    sampleHeading: 'Printable Output Preview',
    sampleCaption:
      'Strictly left-to-right and top-to-bottom word puzzles paired with coloring icons.',
    schemaName: 'KinderESL Free Easy Picture Word Search Maker',
    previewKind: 'word-search-maker',
  },
  'clip-cards-maker': {
    slug: 'clip-cards-maker',
    path: '/tools/clip-cards-maker',
    seoTitle: 'Free Beginning Sounds Clip Cards Maker',
    description:
      `Create printable 2×2 and 2×3 beginning-sound phonics clip cards in US Letter or A4 PDF from ${CLIPART_COUNT} drawings, complete with dashed cut guides and Teacher Answer Key.`,
    ogTitle: 'Free Beginning Sounds Clip Cards',
    ogSubtitle: '2×2 & 2×3 Phonics Cards · Free PDF',
    ogBadges: [`${CLIPART_COUNT} Line-Art Drawings`, 'Dashed Cut Guides'],
    ogAlt:
      'Free Beginning Sounds Clip Cards Maker — Printable clothespin phonics cards with illustrations and 3 letter choices',
    pinDescription:
      `Free Beginning Sounds Clip Cards Maker! Print 2x2 or 2x3 clothespin phonics cards from ${CLIPART_COUNT} preschool drawings with UPPER, lower, or Aa letter choices at KinderESL.com.`,
    sampleHeading: 'Printable Output Preview',
    sampleCaption:
      'Printable phonics clip cards built for wooden clothespins and literacy centers.',
    schemaName: 'KinderESL Free Beginning Sounds Clip Cards Maker',
    previewKind: 'clip-cards-maker',
  },
  'letter-tracing': {
    slug: 'letter-tracing',
    path: '/tools/letter-tracing',
    seoTitle: 'Free Letter Tracing Worksheet Generator (A–Z)',
    description:
      'Generate custom printable A–Z alphabet letter tracing PDF worksheets for preschool and kindergarten. Choose single letters, SATPIN groups, or all 26 letters in US Letter or A4.',
    ogTitle: 'Free Letter Tracing Worksheet Maker',
    ogSubtitle: 'Preschool & Kindergarten · A–Z Free PDF',
    ogBadges: ['Full A–Z or SATPIN', 'Uppercase & Lowercase'],
    ogAlt:
      'Free Letter Tracing Worksheet Maker — Printable dashed Aa and Bb alphabet handwriting sheets with starting dots',
    pinDescription:
      'Free Printable A–Z Letter Tracing Worksheet Generator! Create custom single-letter, SATPIN, or 26-page alphabet tracing PDFs with starting dots in US Letter or A4 at KinderESL.com.',
    sampleHeading: 'Printable Output Preview',
    sampleCaption:
      'Zaner-Bloser uppercase and lowercase dashed letters with phonics word cues.',
    schemaName: 'KinderESL Free Letter Tracing Worksheet Generator',
    previewKind: 'letter-tracing',
  },
  'number-tracing': {
    slug: 'number-tracing',
    path: '/tools/number-tracing',
    seoTitle: 'Free Number Tracing Worksheet Generator (0–20)',
    description:
      'Create free printable number tracing PDF worksheets for numbers 0–10 or 0–20 with built-in Ten-Frame counting grids, dashed number words, and starting dots in US Letter or A4.',
    ogTitle: 'Free Number Tracing Worksheet Maker',
    ogSubtitle: 'Numbers 0–20 & Ten-Frames · Free PDF',
    ogBadges: ['0–10 & 0–20 Packs', 'Ten-Frame Counting'],
    ogAlt:
      'Free Number Tracing Worksheet Maker — Printable dashed numbers 0-20 with Ten-Frame counting grid for preschool and kindergarten',
    pinDescription:
      'Free Printable Number Tracing Worksheet Generator (0–20)! Includes Ten-Frame counting boxes, dashed number words, and teal starting dots in US Letter or A4 PDF at KinderESL.com.',
    sampleHeading: 'Printable Output Preview',
    sampleCaption:
      'Numeral formation practice paired with Ten-Frames and traceable number words.',
    schemaName: 'KinderESL Free Number Tracing Worksheet Generator',
    previewKind: 'number-tracing',
  },
  'handwriting-maker': {
    slug: 'handwriting-maker',
    path: '/tools/handwriting-maker',
    seoTitle: 'Free Sight Word & Handwriting Worksheet Maker',
    description:
      'Turn any sight word, Dolch, CVC phonics, or ESL vocabulary list into Read-Trace-Write or full-row handwriting practice PDFs in US Letter & A4.',
    ogTitle: 'Free Sight Word Handwriting Maker',
    ogSubtitle: 'Read · Trace · Write · Free PDF',
    ogBadges: ['Dolch & CVC Presets', 'Custom Word Lists'],
    ogAlt:
      'Free Sight Word & Handwriting Worksheet Maker — Printable Read, Trace, and Write dashed word practice sheet',
    pinDescription:
      'Free Printable Sight Word & Handwriting Worksheet Maker! Paste up to 18 sight words or pick Dolch & CVC presets to create Read-Trace-Write PDFs in US Letter or A4 at KinderESL.com.',
    sampleHeading: 'Printable Output Preview',
    sampleCaption:
      '3-column Read, Trace & Write layout or full-row word tracing for weekly lists.',
    schemaName: 'KinderESL Free Sight Word & Handwriting Worksheet Maker',
    previewKind: 'handwriting-maker',
  },
  'pattern-maker': {
    slug: 'pattern-maker',
    path: '/tools/pattern-maker',
    seoTitle: 'Free Cut & Paste Pattern Worksheet Maker',
    description:
      `Create printable AB, AAB, ABB, ABC, and mixed cut-and-paste pattern PDF worksheets from ${CLIPART_COUNT} KinderESL drawings in US Letter or A4, with optional distractors and Answer Key.`,
    ogTitle: 'Free Cut & Paste Pattern Maker',
    ogSubtitle: 'AB · AAB · ABB · ABC · Free PDF',
    ogBadges: ['4 Pattern Rows', 'Cut & Glue Tiles'],
    ogAlt:
      'Free Cut & Paste Pattern Worksheet Maker — Printable AB, AAB, ABB, and ABC preschool math sequencing worksheet',
    pinDescription:
      'Free Printable Cut & Paste Pattern Worksheet Maker for Preschool & Kindergarten! Generate AB, AAB, ABB, ABC, or Mixed sequencing sheets in US Letter or A4 at KinderESL.com.',
    sampleHeading: 'Printable Output Preview',
    sampleCaption:
      'Four sequence rows paired with dashed bottom scissor tiles and Page 2 Answer Key.',
    schemaName: 'KinderESL Free Cut & Paste Pattern Worksheet Maker',
    previewKind: 'pattern-maker',
  },
  'mini-book-maker': {
    slug: 'mini-book-maker',
    path: '/tools/mini-book-maker',
    seoTitle: 'Free Foldable ESL Mini-Book Maker (1-Sheet & Half-Page)',
    description:
      `Turn ${CLIPART_COUNT} coloring-friendly illustrations into printable half-page booklets or 1-sheet 8-panel foldable mini-books with "I see a...", "This is a...", or traceable words.`,
    ogTitle: 'Free Foldable Mini-Book Maker',
    ogSubtitle: 'Half-Page & 1-Sheet Zine · Free PDF',
    ogBadges: ['I See / This Is', 'Traceable Word Mode'],
    ogAlt:
      'Free Foldable ESL Mini-Book Maker — Printable half-page and 1-sheet 8-panel emergent reader booklet for preschool and kindergarten',
    pinDescription:
      'Free Foldable ESL Mini-Book Maker for Preschool & Kindergarten! Create Half-Page staple booklets or single-sheet 8-panel foldable books in US Letter or A4 at KinderESL.com.',
    sampleHeading: 'Printable Output Preview',
    sampleCaption:
      'Colorable emergent reader booklets with predictable English sentence frames.',
    schemaName: 'KinderESL Free Foldable ESL Mini-Book Maker',
    previewKind: 'mini-book-maker',
  },
  'domino-maker': {
    slug: 'domino-maker',
    path: '/tools/domino-maker',
    seoTitle: 'Free Picture Dominoes & Memory Match Maker',
    description:
      `Generate closed-loop printable ESL Picture Dominoes or 3×4 Memory Match card decks from ${CLIPART_COUNT} drawings with cut lines, patterned backs, and Loop Key in US Letter or A4.`,
    ogTitle: 'Free Dominoes & Memory Maker',
    ogSubtitle: 'Closed-Loop Dominoes & Pairs · Free PDF',
    ogBadges: ['Picture ↔ Word', 'Card Backs Included'],
    ogAlt:
      'Free Picture Dominoes & Memory Match Maker — Printable ESL picture-word domino tiles and memory match card deck',
    pinDescription:
      'Free Printable ESL Picture Dominoes & Memory Match Maker! Print closed-loop 2x4 picture-word dominoes or 3x4 memory cards + patterned backs at KinderESL.com.',
    sampleHeading: 'Printable Output Preview',
    sampleCaption:
      'Guaranteed closed-loop domino chains and double-sided memory matching cards.',
    schemaName: 'KinderESL Free Picture Dominoes & Memory Match Maker',
    previewKind: 'domino-maker',
  },
};

export const TOOL_COUNT = Object.keys(TOOL_REGISTRY).length;

export function getToolConfig(slug: string): ToolRegistryItem {
  const existing = TOOL_REGISTRY[slug];
  if (existing) return existing;

  const formatted = slug
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

  return {
    slug,
    path: `/tools/${slug}`,
    seoTitle: `Free ${formatted}`,
    description: `Free printable preschool and kindergarten ${formatted.toLowerCase()} PDF generator in US Letter & A4.`,
    ogTitle: `Free ${formatted}`,
    ogSubtitle: 'Preschool & Kindergarten · Free PDF',
    ogBadges: ['US Letter & A4', '100% Free PDF'],
    ogAlt: `${formatted} — Free Printable Preschool & Kindergarten PDF Tool on KinderESL`,
    pinDescription: `Free ${formatted} for Preschool & Kindergarten educators! Download instant US Letter or A4 printables at KinderESL.com.`,
    sampleHeading: 'Printable Output Preview',
    sampleCaption: 'Instant classroom-ready PDF formatted for US Letter and A4 paper.',
    schemaName: `KinderESL Free ${formatted}`,
    previewKind: 'generic',
  };
}

export function getToolOgImagePath(slug: string): string {
  return `/tools/${slug}/opengraph-image`;
}

export function getToolOgImageUrl(slug: string, siteUrl = getSiteUrl()): string {
  return `${siteUrl.replace(/\/+$/, '')}${getToolOgImagePath(slug)}`;
}

export function buildToolMetadata(slug: string): Metadata {
  const tool = getToolConfig(slug);
  const siteUrl = getSiteUrl();
  const pageUrl = `${siteUrl}${tool.path}`;
  const ogImageUrl = getToolOgImageUrl(tool.slug, siteUrl);
  const pageTitle = buildSeoTitle(tool.seoTitle);
  const pageDescription = buildSeoDescription(tool.description);

  return {
    title: pageTitle,
    description: pageDescription,
    alternates: { canonical: pageUrl },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: pageUrl,
      type: 'website',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: tool.ogAlt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: pageDescription,
      images: [ogImageUrl],
    },
    robots: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
  };
}

export function buildToolWebAppSchema(slug: string) {
  const tool = getToolConfig(slug);
  const siteUrl = getSiteUrl();
  const pageUrl = `${siteUrl}${tool.path}`;
  const ogImageUrl = getToolOgImageUrl(tool.slug, siteUrl);

  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: tool.schemaName,
    url: pageUrl,
    description: buildSeoDescription(tool.description),
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Any',
    isAccessibleForFree: true,
    inLanguage: 'en-US',
    image: ogImageUrl,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };
}
