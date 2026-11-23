import { neon, type NeonQueryFunction } from '@neondatabase/serverless';
import type { SiteSettings, Worksheet, WorksheetRequest } from '@/types/worksheet';

let cachedSql: NeonQueryFunction<false, false> | null = null;
let schemaReadyPromise: Promise<void> | null = null;

export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL?.trim());
}

export function getSql(): NeonQueryFunction<false, false> {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) {
    throw new Error('DATABASE_URL is not configured.');
  }
  if (!cachedSql) {
    cachedSql = neon(url);
  }
  return cachedSql;
}

export async function ensureDatabaseSchema(): Promise<void> {
  if (!isDatabaseConfigured()) return;
  if (!schemaReadyPromise) {
    schemaReadyPromise = (async () => {
      const sql = getSql();
      await sql`
        CREATE TABLE IF NOT EXISTS worksheets (
          slug TEXT PRIMARY KEY,
          id TEXT NOT NULL,
          subject TEXT NOT NULL,
          title TEXT NOT NULL,
          data JSONB NOT NULL,
          sort_order INTEGER NOT NULL DEFAULT 0,
          download_count INTEGER NOT NULL DEFAULT 0,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `;
      await sql`
        CREATE INDEX IF NOT EXISTS idx_worksheets_subject ON worksheets (subject)
      `;
      await sql`
        CREATE TABLE IF NOT EXISTS site_settings (
          key TEXT PRIMARY KEY,
          data JSONB NOT NULL,
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `;
      await sql`
        CREATE TABLE IF NOT EXISTS worksheet_requests (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT,
          role TEXT NOT NULL,
          age_group TEXT NOT NULL,
          subject TEXT NOT NULL,
          topic TEXT NOT NULL,
          details TEXT NOT NULL,
          status TEXT NOT NULL DEFAULT 'new',
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `;
      await sql`
        CREATE TABLE IF NOT EXISTS search_queries (
          query TEXT PRIMARY KEY,
          search_count INTEGER NOT NULL DEFAULT 1,
          zero_result_count INTEGER NOT NULL DEFAULT 0,
          last_searched_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `;
      await sql`
        CREATE TABLE IF NOT EXISTS page_views (
          id BIGSERIAL PRIMARY KEY,
          path TEXT NOT NULL,
          referrer_host TEXT,
          session_id TEXT NOT NULL,
          device_type TEXT NOT NULL DEFAULT 'desktop',
          duration_ms INTEGER NOT NULL DEFAULT 0,
          is_exit BOOLEAN NOT NULL DEFAULT FALSE,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `;
      await sql`
        CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON page_views (created_at DESC)
      `;
      await sql`
        CREATE INDEX IF NOT EXISTS idx_page_views_path ON page_views (path)
      `;
      await sql`
        CREATE INDEX IF NOT EXISTS idx_page_views_session ON page_views (session_id, path, created_at DESC)
      `;
    })().catch((err) => {
      schemaReadyPromise = null;
      throw err;
    });
  }
  return schemaReadyPromise;
}

export async function dbListWorksheets(): Promise<Array<Worksheet & { downloadCount?: number }>> {
  await ensureDatabaseSchema();
  const sql = getSql();
  const rows = await sql`
    SELECT data, download_count
    FROM worksheets
    ORDER BY sort_order ASC, created_at DESC
  `;
  return rows.map((row) => ({
    ...(row.data as Worksheet),
    downloadCount: Number(row.download_count || 0),
  }));
}

export async function dbGetWorksheetBySlug(slug: string): Promise<Worksheet | null> {
  await ensureDatabaseSchema();
  const sql = getSql();
  const rows = await sql`
    SELECT data
    FROM worksheets
    WHERE slug = ${slug}
    LIMIT 1
  `;
  if (rows.length === 0) return null;
  return rows[0].data as Worksheet;
}

export async function dbUpsertWorksheet(
  ws: Worksheet,
  isNew: boolean,
  explicitSortOrder?: number
): Promise<void> {
  await ensureDatabaseSchema();
  const sql = getSql();
  const payload = JSON.stringify(ws);

  if (isNew) {
    let order = explicitSortOrder;
    if (order === undefined) {
      const minRows = await sql`SELECT COALESCE(MIN(sort_order), 1) - 1 AS next_order FROM worksheets`;
      order = Number(minRows[0]?.next_order ?? 0);
    }
    await sql`
      INSERT INTO worksheets (slug, id, subject, title, data, sort_order, updated_at)
      VALUES (${ws.slug}, ${ws.id}, ${ws.subject}, ${ws.title}, ${payload}::jsonb, ${order}, NOW())
      ON CONFLICT (slug) DO UPDATE SET
        id = EXCLUDED.id,
        subject = EXCLUDED.subject,
        title = EXCLUDED.title,
        data = EXCLUDED.data,
        updated_at = NOW()
    `;
  } else {
    await sql`
      UPDATE worksheets
      SET
        id = ${ws.id},
        subject = ${ws.subject},
        title = ${ws.title},
        data = ${payload}::jsonb,
        updated_at = NOW()
      WHERE slug = ${ws.slug}
    `;
  }
}

export async function dbDeleteWorksheet(slug: string): Promise<Worksheet | null> {
  await ensureDatabaseSchema();
  const sql = getSql();
  const rows = await sql`
    DELETE FROM worksheets
    WHERE slug = ${slug}
    RETURNING data
  `;
  if (rows.length === 0) return null;
  return rows[0].data as Worksheet;
}

export async function dbGetSiteSettings(): Promise<SiteSettings | null> {
  await ensureDatabaseSchema();
  const sql = getSql();
  const rows = await sql`
    SELECT data
    FROM site_settings
    WHERE key = 'default'
    LIMIT 1
  `;
  if (rows.length === 0) return null;
  return rows[0].data as SiteSettings;
}

export async function dbSaveSiteSettings(settings: SiteSettings): Promise<void> {
  await ensureDatabaseSchema();
  const sql = getSql();
  const payload = JSON.stringify(settings);
  await sql`
    INSERT INTO site_settings (key, data, updated_at)
    VALUES ('default', ${payload}::jsonb, NOW())
    ON CONFLICT (key) DO UPDATE SET
      data = EXCLUDED.data,
      updated_at = NOW()
  `;
}

export async function dbListRequests(): Promise<WorksheetRequest[]> {
  await ensureDatabaseSchema();
  const sql = getSql();
  const rows = await sql`
    SELECT id, name, email, role, age_group, subject, topic, details, status, created_at
    FROM worksheet_requests
    ORDER BY created_at DESC
    LIMIT 200
  `;
  return rows.map((r) => ({
    id: String(r.id),
    name: String(r.name),
    ...(r.email ? { email: String(r.email) } : {}),
    role: String(r.role),
    ageGroup: String(r.age_group),
    subject: String(r.subject),
    topic: String(r.topic),
    details: String(r.details),
    status: (r.status as WorksheetRequest['status']) || 'new',
    createdAt:
      r.created_at instanceof Date ? r.created_at.toISOString() : String(r.created_at),
  }));
}

export async function dbInsertRequest(req: WorksheetRequest): Promise<void> {
  await ensureDatabaseSchema();
  const sql = getSql();
  await sql`
    INSERT INTO worksheet_requests (id, name, email, role, age_group, subject, topic, details, status, created_at)
    VALUES (
      ${req.id},
      ${req.name},
      ${req.email || null},
      ${req.role},
      ${req.ageGroup},
      ${req.subject},
      ${req.topic},
      ${req.details},
      ${req.status},
      ${req.createdAt}::timestamptz
    )
    ON CONFLICT (id) DO NOTHING
  `;
}

export async function dbUpdateRequestStatus(
  id: string,
  status: WorksheetRequest['status']
): Promise<boolean> {
  await ensureDatabaseSchema();
  const sql = getSql();
  const rows = await sql`
    UPDATE worksheet_requests
    SET status = ${status}
    WHERE id = ${id}
    RETURNING id
  `;
  return rows.length > 0;
}

export async function dbDeleteRequest(id: string): Promise<boolean> {
  await ensureDatabaseSchema();
  const sql = getSql();
  const rows = await sql`
    DELETE FROM worksheet_requests
    WHERE id = ${id}
    RETURNING id
  `;
  return rows.length > 0;
}

export async function dbIncrementDownload(slug: string): Promise<void> {
  await ensureDatabaseSchema();
  const sql = getSql();
  await sql`
    UPDATE worksheets
    SET download_count = download_count + 1
    WHERE slug = ${slug}
  `;
}

export async function dbRecordSearch(query: string, resultCount: number): Promise<void> {
  const clean = query.trim().toLowerCase().slice(0, 120);
  if (clean.length < 2) return;
  await ensureDatabaseSchema();
  const sql = getSql();
  const isZero = resultCount <= 0 ? 1 : 0;
  await sql`
    INSERT INTO search_queries (query, search_count, zero_result_count, last_searched_at)
    VALUES (${clean}, 1, ${isZero}, NOW())
    ON CONFLICT (query) DO UPDATE SET
      search_count = search_queries.search_count + 1,
      zero_result_count = search_queries.zero_result_count + ${isZero},
      last_searched_at = NOW()
  `;
}

export async function dbRecordPageView(input: {
  path: string;
  referrerHost: string | null;
  sessionId: string;
  deviceType: 'mobile' | 'desktop';
}): Promise<void> {
  const cleanPath = input.path.trim().slice(0, 200) || '/';
  const cleanSession = input.sessionId.trim().slice(0, 64);
  if (!cleanSession) return;
  const cleanReferrer = input.referrerHost
    ? input.referrerHost.trim().toLowerCase().slice(0, 120) || null
    : null;
  const device = input.deviceType === 'mobile' ? 'mobile' : 'desktop';

  await ensureDatabaseSchema();
  const sql = getSql();
  await sql`
    INSERT INTO page_views (path, referrer_host, session_id, device_type)
    VALUES (${cleanPath}, ${cleanReferrer}, ${cleanSession}, ${device})
  `;
}

export async function dbRecordPageExit(input: {
  path: string;
  sessionId: string;
  durationMs: number;
}): Promise<void> {
  const cleanPath = input.path.trim().slice(0, 200);
  const cleanSession = input.sessionId.trim().slice(0, 64);
  if (!cleanPath || !cleanSession) return;
  const clampedMs = Math.max(0, Math.min(1800000, Math.round(Number(input.durationMs) || 0)));

  await ensureDatabaseSchema();
  const sql = getSql();
  await sql`
    UPDATE page_views
    SET
      duration_ms = GREATEST(duration_ms, ${clampedMs}),
      is_exit = TRUE
    WHERE id = (
      SELECT id
      FROM page_views
      WHERE session_id = ${cleanSession}
        AND path = ${cleanPath}
        AND created_at >= NOW() - INTERVAL '6 hours'
      ORDER BY created_at DESC
      LIMIT 1
    )
  `;
}

export async function dbGetAnalyticsSummary(): Promise<{
  totalDownloads: number;
  topDownloaded: Array<{ slug: string; title: string; subject: string; downloads: number }>;
  topSearches: Array<{ query: string; count: number; zeroResults: number }>;
  traffic: {
    totalPageViews: number;
    todayPageViews: number;
    uniqueSessions30d: number;
    todaySessions: number;
    avgDurationSec: number;
    dailyVisits: Array<{ date: string; views: number; sessions: number }>;
    topPages: Array<{ path: string; views: number; exits: number; avgDurationSec: number }>;
    topReferrers: Array<{ source: string; views: number }>;
  };
}> {
  await ensureDatabaseSchema();
  const sql = getSql();
  const [
    sumRows,
    topWsRows,
    searchRows,
    trafficAggRows,
    dailyRows,
    topPageRows,
    referrerRows,
  ] = await Promise.all([
    sql`SELECT COALESCE(SUM(download_count), 0) AS total_downloads FROM worksheets`,
    sql`
      SELECT slug, title, subject, download_count
      FROM worksheets
      WHERE download_count > 0
      ORDER BY download_count DESC, updated_at DESC
      LIMIT 6
    `,
    sql`
      SELECT query, search_count, zero_result_count
      FROM search_queries
      ORDER BY last_searched_at DESC, search_count DESC
      LIMIT 10
    `,
    sql`
      SELECT
        COUNT(*)::int AS total_views,
        COUNT(*) FILTER (WHERE created_at >= DATE_TRUNC('day', NOW()))::int AS today_views,
        COUNT(DISTINCT session_id) FILTER (WHERE created_at >= NOW() - INTERVAL '30 days')::int AS sessions_30d,
        COUNT(DISTINCT session_id) FILTER (WHERE created_at >= DATE_TRUNC('day', NOW()))::int AS today_sessions,
        COALESCE(ROUND(AVG(duration_ms) FILTER (WHERE duration_ms > 0 AND created_at >= NOW() - INTERVAL '30 days') / 1000.0), 0)::int AS avg_duration_sec
      FROM page_views
    `,
    sql`
      SELECT
        TO_CHAR(DATE_TRUNC('day', created_at), 'YYYY-MM-DD') AS day,
        COUNT(*)::int AS views,
        COUNT(DISTINCT session_id)::int AS sessions
      FROM page_views
      WHERE created_at >= DATE_TRUNC('day', NOW()) - INTERVAL '6 days'
      GROUP BY DATE_TRUNC('day', created_at)
      ORDER BY DATE_TRUNC('day', created_at) ASC
    `,
    sql`
      SELECT
        path,
        COUNT(*)::int AS views,
        COUNT(*) FILTER (WHERE is_exit = TRUE)::int AS exits,
        COALESCE(ROUND(AVG(duration_ms) FILTER (WHERE duration_ms > 0) / 1000.0), 0)::int AS avg_duration_sec
      FROM page_views
      WHERE created_at >= NOW() - INTERVAL '30 days'
      GROUP BY path
      ORDER BY views DESC, path ASC
      LIMIT 8
    `,
    sql`
      SELECT
        COALESCE(NULLIF(referrer_host, ''), 'Doğrudan Giriş') AS source,
        COUNT(*)::int AS views
      FROM page_views
      WHERE created_at >= NOW() - INTERVAL '30 days'
      GROUP BY COALESCE(NULLIF(referrer_host, ''), 'Doğrudan Giriş')
      ORDER BY views DESC, source ASC
      LIMIT 6
    `,
  ]);

  const tAgg = trafficAggRows[0] || {};

  return {
    totalDownloads: Number(sumRows[0]?.total_downloads ?? 0),
    topDownloaded: topWsRows.map((r) => ({
      slug: String(r.slug),
      title: String(r.title),
      subject: String(r.subject),
      downloads: Number(r.download_count || 0),
    })),
    topSearches: searchRows.map((r) => ({
      query: String(r.query),
      count: Number(r.search_count || 0),
      zeroResults: Number(r.zero_result_count || 0),
    })),
    traffic: {
      totalPageViews: Number(tAgg.total_views ?? 0),
      todayPageViews: Number(tAgg.today_views ?? 0),
      uniqueSessions30d: Number(tAgg.sessions_30d ?? 0),
      todaySessions: Number(tAgg.today_sessions ?? 0),
      avgDurationSec: Number(tAgg.avg_duration_sec ?? 0),
      dailyVisits: dailyRows.map((r) => ({
        date: String(r.day),
        views: Number(r.views || 0),
        sessions: Number(r.sessions || 0),
      })),
      topPages: topPageRows.map((r) => ({
        path: String(r.path),
        views: Number(r.views || 0),
        exits: Number(r.exits || 0),
        avgDurationSec: Number(r.avg_duration_sec || 0),
      })),
      topReferrers: referrerRows.map((r) => ({
        source: String(r.source),
        views: Number(r.views || 0),
      })),
    },
  };
}
