import { NextResponse } from 'next/server';
import { connection } from 'next/server';
import { getSiteUrl, siteConfig } from '@/config/site';
import { subjects } from '@/data/subjects';
import { guides } from '@/data/guides';
import { fetchAllWorksheets } from '@/lib/worksheets-store';

export async function GET() {
  await connection();

  const baseUrl = getSiteUrl();
  const allWorksheets = await fetchAllWorksheets();
  const totalPrintables = allWorksheets.length;
  const totalPages = allWorksheets.reduce((sum, w) => sum + (w.pages || 1), 0);

  const lines: string[] = [
    `# ${siteConfig.name}: Free Printable Educational Resources for Preschool & Kindergarten Teachers`,
    '',
    `> [${siteConfig.name}](${baseUrl}) is a collection of free printable PDF worksheets, phonics packs, flashcard sets, thematic early learning activities, and instructional guides designed for early childhood educators, preschool teachers, kindergarten instructors, and homeschooling parents across the United States, Canada, the United Kingdom, and internationally.`,
    '',
    '## Pedagogical Philosophy & Positioning',
    'KinderESL is an instructional and curricular resource platform for adults—teachers, educators, curriculum coordinators, and parents. The content emphasizes phonemic awareness, fine-motor pencil control, one-to-one number correspondence, visual discrimination, and foundational English language acquisition (ESL/ELL).',
    '',
    `- Primary Domain: [KinderESL.com](${baseUrl})`,
    '- Editorial Focus: Early Childhood ESL and Kindergarten Educational Printables',
    '- Access: 100% Free downloadable high-resolution US Letter & A4 PDF printables for non-commercial classroom and home use.',
    '',
    '## Core Learning Subjects',
    `- [Alphabet & Letters](${baseUrl}/worksheets/alphabet): Letter tracing, Letter of the Week curriculum, starting dot stroke guides, uppercase and lowercase handwriting formation.`,
    `- [Phonics & Sounds](${baseUrl}/worksheets/phonics): Phonemic awareness, beginning sounds, clip cards, and early decoding printables.`,
    `- [Numbers & Counting](${baseUrl}/worksheets/numbers-counting): Number recognition, counting 1 to 10, one-to-one correspondence, ten frames, numeral tracing.`,
    `- [Shapes & Colors](${baseUrl}/worksheets/shapes-colors): Geometric shape tracing, color flashcards, and pre-writing motor control.`,
    `- [ESL Vocabulary](${baseUrl}/worksheets/vocabulary): Thematic English word cards, circle-time charts, classroom commands, and animal sound packs.`,
    `- [Thinking Skills](${baseUrl}/worksheets/thinking-skills): Visual discrimination, odd-one-out categorizing, seasonal sorting, and fine-motor scissor skills.`,
    '',
    `## Full Printable Library (${totalPrintables} Printables · ${totalPages} Pages)`,
    '',
  ];

  for (const subject of subjects) {
    const items = allWorksheets.filter((w) => w.subject === subject.slug);
    if (items.length === 0) continue;

    lines.push(`### ${subject.title}`);
    for (const ws of items) {
      const pageCount = ws.pages || 1;
      const pageLabel = `${pageCount} ${pageCount === 1 ? 'page' : 'pages'}`;
      const summary = (ws.description || ws.quickSummary || '').replace(/\s+/g, ' ').trim();
      lines.push(
        `- [${ws.title}](${baseUrl}/worksheets/${ws.slug}) (${pageLabel}, ${ws.ages}): ${summary}`
      );
    }
    lines.push('');
  }

  lines.push('## Free Interactive Educator Tools');
  lines.push(
    `- [Free Printable Teacher Tools Hub](${baseUrl}/tools): Overview of all browser-private preschool and ESL PDF generators.`
  );
  lines.push(
    `- [Custom Name Tracing Worksheet Generator](${baseUrl}/tools/name-tracing): Create personalized preschool and kindergarten ball-and-stick name tracing PDFs in US Letter or A4 (single student or whole class batch up to 30 names, 100% browser-private).`
  );
  lines.push(
    `- [Free Letter Tracing Worksheet Generator (A–Z)](${baseUrl}/tools/letter-tracing): Generate printable Zaner-Bloser A–Z alphabet tracing PDFs for single letters, SATPIN phonics groups, or full 26-letter workbooks in US Letter or A4.`
  );
  lines.push(
    `- [Free Number Tracing Worksheet Generator (0–20)](${baseUrl}/tools/number-tracing): Create printable 0–10 and 0–20 numeral tracing PDFs paired with visual Ten-Frame counting grids and dashed English number words.`
  );
  lines.push(
    `- [Free Sight Word & Handwriting Worksheet Maker](${baseUrl}/tools/handwriting-maker): Turn Dolch sight word presets, CVC families, or custom spelling lists (up to 18 words) into Read-Trace-Write or full-row handwriting practice PDFs.`
  );
  lines.push(
    `- [Free Printable ESL Picture Flashcard Maker](${baseUrl}/tools/flashcard-maker): Build 2x2, 2x3, or 3x3 classroom flashcard PDFs in US Letter or A4 from 125 built-in KinderESL line-art drawings or custom uploaded images, with optional traceable words and matching word decks.`
  );
  lines.push(
    `- [Custom ESL Picture & Word Bingo Card Generator](${baseUrl}/tools/bingo-maker): Build up to 30 uniquely shuffled 3x3 or 4x4 ESL picture or word bingo boards plus a visual Teacher Caller Checklist in US Letter or A4 PDF.`
  );
  lines.push('');

  lines.push('## Educator Teaching Guides');
  for (const guide of guides) {
    lines.push(
      `- [${guide.title}](${baseUrl}/guides/${guide.slug}) (${guide.targetAges}, ${guide.readingTime}): ${guide.description}`
    );
  }
  lines.push('');

  lines.push('## Inquiries & Feedback');
  lines.push(`- Website: [${siteConfig.name}](${baseUrl})`);
  lines.push(`- Educator Catalog: [All Printable Worksheets](${baseUrl}/worksheets)`);
  lines.push(`- Learning Topics: [Preschool Topics & Themes](${baseUrl}/topics)`);
  lines.push(`- Inquiries: [Contact KinderESL](${baseUrl}/contact)`);
  lines.push(
    `- Terms of Use: [Terms of Use](${baseUrl}/terms) (Free for home and classroom non-commercial educational use)`
  );
  lines.push('');

  return new NextResponse(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=300, s-maxage=900',
    },
  });
}
