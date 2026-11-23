import { NextResponse } from 'next/server';
import { getSiteUrl, siteConfig, toAbsoluteAssetUrl } from '@/config/site';
import { subjects } from '@/data/subjects';
import { fetchAllWorksheets } from '@/lib/worksheets-store';

function escapeXml(raw: string): string {
  return raw
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function toRfc2822(dateInput?: string): string {
  if (!dateInput) return new Date().toUTCString();
  const parsed = new Date(dateInput);
  if (Number.isNaN(parsed.getTime())) return new Date().toUTCString();
  return parsed.toUTCString();
}

export async function GET(request: Request) {
  const baseUrl = getSiteUrl();
  const { searchParams } = new URL(request.url);
  const subjectFilter = (searchParams.get('subject') || '').trim().toLowerCase();

  const subjectMeta = subjectFilter
    ? subjects.find((s) => s.slug === subjectFilter)
    : undefined;

  const allWorksheets = await fetchAllWorksheets();
  const items = allWorksheets.filter((ws) => {
    if (ws.pinterest?.autoPublish === false) return false;
    if (subjectFilter && ws.subject !== subjectFilter) return false;
    return true;
  });

  const channelTitle = subjectMeta
    ? `${siteConfig.name} — ${subjectMeta.shortTitle} Free Printables`
    : `${siteConfig.name} — Free Preschool & ESL Printable Worksheets`;
  const channelLink = subjectMeta
    ? `${baseUrl}/worksheets/${subjectMeta.slug}`
    : `${baseUrl}/worksheets`;
  const selfUrl = subjectMeta
    ? `${baseUrl}/rss.xml?subject=${encodeURIComponent(subjectMeta.slug)}`
    : `${baseUrl}/rss.xml`;
  const channelDesc = subjectMeta
    ? subjectMeta.description
    : 'Free printable preschool, kindergarten, and ESL PDF worksheets (US Letter & A4) for classroom teachers and homeschooling parents.';

  const lastBuildDate =
    items.length > 0
      ? toRfc2822(items[0].pinterest?.rssQueuedAt || items[0].dateModified || items[0].datePublished)
      : new Date().toUTCString();

  const itemsXml = items
    .map((ws) => {
      const pageUrl = `${baseUrl}/worksheets/${ws.slug}`;
      const pinImageRaw = ws.pinterestPinImage || ws.previewImages[0] || '/images/og-default.jpg';
      const pinImageUrl = toAbsoluteAssetUrl(pinImageRaw, baseUrl);
      const mimeType = /\.png(\?|$)/i.test(pinImageUrl) ? 'image/png' : 'image/jpeg';
      const descriptionText = `${ws.title} — ${ws.description} (${ws.ages}, ${ws.pages} ${
        ws.pages > 1 ? 'pages' : 'page'
      }, free US Letter & A4 PDF printable for preschool and ESL learners.)`;
      const pubDate = toRfc2822(
        ws.pinterest?.rssQueuedAt || ws.datePublished || ws.dateModified
      );

      return [
        '    <item>',
        `      <title>${escapeXml(ws.title)}</title>`,
        `      <link>${escapeXml(pageUrl)}</link>`,
        `      <guid isPermaLink="true">${escapeXml(pageUrl)}</guid>`,
        `      <pubDate>${escapeXml(pubDate)}</pubDate>`,
        `      <category>${escapeXml(ws.subjectName)}</category>`,
        `      <description>${escapeXml(descriptionText)}</description>`,
        `      <enclosure url="${escapeXml(pinImageUrl)}" type="${mimeType}" length="0" />`,
        '    </item>',
      ].join('\n');
    })
    .join('\n');

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    '  <channel>',
    `    <title>${escapeXml(channelTitle)}</title>`,
    `    <link>${escapeXml(channelLink)}</link>`,
    `    <atom:link href="${escapeXml(selfUrl)}" rel="self" type="application/rss+xml" />`,
    `    <description>${escapeXml(channelDesc)}</description>`,
    '    <language>en-us</language>',
    `    <lastBuildDate>${escapeXml(lastBuildDate)}</lastBuildDate>`,
    itemsXml,
    '  </channel>',
    '</rss>',
    '',
  ].join('\n');

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=300, s-maxage=900',
    },
  });
}
