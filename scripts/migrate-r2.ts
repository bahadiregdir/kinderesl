import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config();

import fs from 'fs';
import path from 'path';
import { dbListWorksheets, dbUpsertWorksheet, isDatabaseConfigured } from '@/lib/db';
import { getR2Info, isR2Configured, uploadBufferToR2 } from '@/lib/r2-storage';
import type { Worksheet } from '@/types/worksheet';

function inferContentType(filePath: string): string {
  const lower = filePath.toLowerCase();
  if (lower.endsWith('.pdf')) return 'application/pdf';
  if (lower.endsWith('.png')) return 'image/png';
  if (lower.endsWith('.webp')) return 'image/webp';
  if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return 'image/jpeg';
  return 'application/octet-stream';
}

async function uploadLocalAsset(webPath: string): Promise<string> {
  if (!webPath.startsWith('/worksheets/')) return webPath;
  const relRepo = `public${webPath}`;
  const absPath = path.join(process.cwd(), relRepo);
  if (!fs.existsSync(absPath)) {
    throw new Error(`Missing local asset file: ${absPath}`);
  }
  const objectKey = webPath.replace(/^\/+/, '');
  const buf = fs.readFileSync(absPath);
  const contentType = inferContentType(absPath);
  return uploadBufferToR2(objectKey, buf, contentType);
}

async function main() {
  if (!isDatabaseConfigured()) {
    console.error('ERROR: DATABASE_URL is not configured in .env.local.');
    process.exit(1);
  }
  if (!isR2Configured()) {
    console.error(
      'ERROR: Cloudflare R2 is not configured. Please set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, and R2_PUBLIC_URL in .env.local.'
    );
    process.exit(1);
  }

  const r2 = getR2Info();
  console.log(`Migrating local assets to Cloudflare R2 bucket "${r2.bucket}" (${r2.publicUrl})...`);

  const allWorksheets = await dbListWorksheets();
  let migratedWorksheets = 0;
  let uploadedFiles = 0;

  for (const ws of allWorksheets) {
    const needsMigration =
      ws.pdfPath.startsWith('/worksheets/') ||
      ws.pinterestPinImage.startsWith('/worksheets/') ||
      ws.previewImages.some((p) => p.startsWith('/worksheets/'));

    if (!needsMigration) continue;

    console.log(`Uploading assets for: ${ws.slug}`);
    const nextPdf = await uploadLocalAsset(ws.pdfPath);
    if (nextPdf !== ws.pdfPath) uploadedFiles++;

    const nextPreviews: string[] = [];
    for (const img of ws.previewImages) {
      const nextImg = await uploadLocalAsset(img);
      if (nextImg !== img) uploadedFiles++;
      nextPreviews.push(nextImg);
    }

    const nextPin = await uploadLocalAsset(ws.pinterestPinImage);
    if (nextPin !== ws.pinterestPinImage) uploadedFiles++;

    const updated: Worksheet = {
      ...ws,
      pdfPath: nextPdf,
      previewImages: nextPreviews,
      pinterestPinImage: nextPin,
    };

    await dbUpsertWorksheet(updated, false);
    migratedWorksheets++;
  }

  console.log(
    `\nR2 migration complete! Updated ${migratedWorksheets} worksheets and uploaded ${uploadedFiles} files.`
  );
}

main().catch((err) => {
  console.error('R2 migration failed:', err);
  process.exit(1);
});
