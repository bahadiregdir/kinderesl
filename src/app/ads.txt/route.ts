import { siteConfig } from '@/config/site';

export async function GET() {
  const clientId = siteConfig.adsense.client?.trim() || '';
  const match = /^ca-(pub-\d+)$/.exec(clientId);

  const body = match
    ? `google.com, ${match[1]}, DIRECT, f08c47fec0942fa0\n`
    : '# KinderESL ads.txt - AdSense publisher ID pending configuration\n';

  return new Response(body, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
