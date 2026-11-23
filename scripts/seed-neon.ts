import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config();

import fs from 'fs';
import path from 'path';
import {
  ensureDatabaseSchema,
  getSql,
  isDatabaseConfigured,
} from '@/lib/db';
import type { SiteSettings, Worksheet, WorksheetRequest } from '@/types/worksheet';

async function main() {
  if (!isDatabaseConfigured()) {
    console.error('ERROR: DATABASE_URL is not set in .env.local or environment.');
    process.exit(1);
  }

  console.log('Ensuring Neon Postgres schema...');
  await ensureDatabaseSchema();
  const sql = getSql();

  const worksheetsPath = path.join(process.cwd(), 'src/data/worksheets.json');
  const settingsPath = path.join(process.cwd(), 'src/data/site-settings.json');
  const requestsPath = path.join(process.cwd(), 'src/data/requests.json');

  const worksheets = JSON.parse(
    fs.readFileSync(worksheetsPath, 'utf8')
  ) as Worksheet[];
  const settings = JSON.parse(
    fs.readFileSync(settingsPath, 'utf8')
  ) as SiteSettings;
  const requests = JSON.parse(
    fs.readFileSync(requestsPath, 'utf8')
  ) as WorksheetRequest[];

  let wsInserted = 0;
  for (let i = 0; i < worksheets.length; i++) {
    const ws = worksheets[i];
    const rows = await sql`
      INSERT INTO worksheets (slug, id, subject, title, data, sort_order)
      VALUES (${ws.slug}, ${ws.id}, ${ws.subject}, ${ws.title}, ${JSON.stringify(ws)}::jsonb, ${i})
      ON CONFLICT (slug) DO NOTHING
      RETURNING slug
    `;
    if (rows.length > 0) wsInserted++;
  }

  await sql`
    INSERT INTO site_settings (key, data)
    VALUES ('default', ${JSON.stringify(settings)}::jsonb)
    ON CONFLICT (key) DO NOTHING
  `;

  let reqInserted = 0;
  for (const req of requests) {
    const rows = await sql`
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
      RETURNING id
    `;
    if (rows.length > 0) reqInserted++;
  }

  const totalWs = await sql`SELECT COUNT(*)::int AS cnt FROM worksheets`;
  const totalSettings = await sql`SELECT COUNT(*)::int AS cnt FROM site_settings`;
  const totalReq = await sql`SELECT COUNT(*)::int AS cnt FROM worksheet_requests`;

  console.log(`Seed complete!`);
  console.log(`- Worksheets: inserted ${wsInserted}, total in Neon DB = ${totalWs[0]?.cnt}`);
  console.log(`- Site settings rows = ${totalSettings[0]?.cnt}`);
  console.log(`- Requests: inserted ${reqInserted}, total in Neon DB = ${totalReq[0]?.cnt}`);
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
