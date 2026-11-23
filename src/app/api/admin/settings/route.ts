import { NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { commitFiles, getStorageInfo, readJsonFile } from '@/lib/cms-storage';
import { dbGetSiteSettings, dbSaveSiteSettings, isDatabaseConfigured } from '@/lib/db';
import { revalidateSettings } from '@/lib/revalidation';
import type { SiteSettings } from '@/types/worksheet';

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    let settings: SiteSettings | null = null;
    if (isDatabaseConfigured()) {
      settings = await dbGetSiteSettings();
    }
    if (!settings) {
      settings = await readJsonFile<SiteSettings>('src/data/site-settings.json');
    }
    return NextResponse.json({
      settings,
      storage: getStorageInfo(),
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to load site settings';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = (await request.json()) as SiteSettings;
    if (!body?.author?.name || !body?.author?.role) {
      return NextResponse.json(
        { error: 'Author name and role are required.' },
        { status: 400 }
      );
    }

    const sanitized: SiteSettings = {
      author: {
        name: String(body.author.name).trim(),
        slug: String(body.author.slug || 'kinderesl-team').trim(),
        role: String(body.author.role).trim(),
        shortBio: String(body.author.shortBio || '').trim(),
        fullBio: String(body.author.fullBio || '').trim(),
        credentials: Array.isArray(body.author.credentials)
          ? body.author.credentials.map((c) => String(c).trim()).filter(Boolean)
          : [],
        avatar: String(body.author.avatar || '/images/author-avatar.jpg').trim(),
      },
      contactEmail: String(body.contactEmail || '').trim(),
      pinterest: {
        handle: String(body.pinterest?.handle || '').trim(),
        url: String(body.pinterest?.url || '').trim(),
        verificationToken: String(body.pinterest?.verificationToken || '').trim(),
      },
      adsense: {
        client: String(body.adsense?.client || '').trim(),
        enabled: Boolean(body.adsense?.enabled),
        slots: {
          inContent: String(body.adsense?.slots?.inContent || '').trim(),
          sidebar: String(body.adsense?.slots?.sidebar || '').trim(),
          preDownload: String(body.adsense?.slots?.preDownload || '').trim(),
        },
        rewardedAdEnabled: body.adsense?.rewardedAdEnabled !== false,
      },
      analytics: {
        ga4MeasurementId: String(body.analytics?.ga4MeasurementId || '').trim(),
      },
    };

    if (isDatabaseConfigured()) {
      await dbSaveSiteSettings(sanitized);
      revalidateSettings();
      return NextResponse.json({ settings: sanitized, commit: { mode: 'neon' } });
    }

    const contentBase64 = Buffer.from(
      JSON.stringify(sanitized, null, 2) + '\n',
      'utf8'
    ).toString('base64');

    const commit = await commitFiles(
      [{ path: 'src/data/site-settings.json', contentBase64 }],
      'cms: update site settings'
    );

    return NextResponse.json({ settings: sanitized, commit });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to save site settings';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
