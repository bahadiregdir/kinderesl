import { NextResponse } from 'next/server';
import { subjects } from '@/data/subjects';
import { requireAdminApiAccess } from '@/lib/admin-api-guard';
import { createPresignedR2UploadUrl, isR2Configured } from '@/lib/r2-storage';
import { sanitizeFilename } from '@/lib/worksheet-cms-helper';

const RESERVED_SUBJECT_SLUGS = new Set<string>(subjects.map((s) => s.slug));
const MAX_PDF_BYTES = 20 * 1024 * 1024;
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

function imageExtensionFromMime(mime: string): string {
  if (mime === 'image/png') return 'png';
  if (mime === 'image/webp') return 'webp';
  return 'jpg';
}

export async function POST(request: Request) {
  const access = await requireAdminApiAccess(request);
  if (!access.authorized) return access.response;

  try {
    const body = (await request.json()) as {
      slug?: string;
      kind?: string;
      filename?: string;
      contentType?: string;
      sizeBytes?: number;
      pageIndex?: number;
    };

    const errors: Record<string, string> = {};
    const slug = typeof body.slug === 'string' ? body.slug.trim() : '';

    if (!slug || slug.length < 3 || !/^[a-z0-9-]+$/.test(slug)) {
      errors.slug = 'Slug must match ^[a-z0-9-]+$ and be at least 3 characters.';
    } else if (RESERVED_SUBJECT_SLUGS.has(slug)) {
      errors.slug = `Slug "${slug}" conflicts with a reserved subject route.`;
    }

    const kind = body.kind;
    if (kind !== 'pdf' && kind !== 'preview' && kind !== 'pin') {
      errors.kind = 'kind must be one of: pdf, preview, pin.';
    }

    const contentType =
      typeof body.contentType === 'string' ? body.contentType.trim().toLowerCase() : '';

    if (kind === 'pdf') {
      if (contentType !== 'application/pdf') {
        errors.contentType = 'PDF contentType must be application/pdf.';
      }
      if (
        body.sizeBytes !== undefined &&
        (typeof body.sizeBytes !== 'number' ||
          body.sizeBytes <= 0 ||
          body.sizeBytes > MAX_PDF_BYTES)
      ) {
        errors.sizeBytes = 'PDF sizeBytes must be > 0 and <= 20 MB (20971520 bytes).';
      }
    } else if (kind === 'preview' || kind === 'pin') {
      if (!/^image\/(png|jpeg|jpg|webp)$/.test(contentType)) {
        errors.contentType = 'Image contentType must be image/png, image/jpeg, or image/webp.';
      }
      if (
        body.sizeBytes !== undefined &&
        (typeof body.sizeBytes !== 'number' ||
          body.sizeBytes <= 0 ||
          body.sizeBytes > MAX_IMAGE_BYTES)
      ) {
        errors.sizeBytes = 'Image sizeBytes must be > 0 and <= 10 MB (10485760 bytes).';
      }
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        { error: 'Validation failed', errors },
        { status: 400, headers: access.headers }
      );
    }

    if (!isR2Configured()) {
      return NextResponse.json(
        { error: 'Cloudflare R2 storage is not configured on this environment.' },
        { status: 503, headers: access.headers }
      );
    }

    let objectKey = '';
    if (kind === 'pdf') {
      const rawName = typeof body.filename === 'string' ? body.filename.trim() : `${slug}.pdf`;
      const pdfName = sanitizeFilename(
        rawName.toLowerCase().endsWith('.pdf') ? rawName : `${rawName}.pdf`,
        `${slug}.pdf`
      );
      objectKey = `worksheets/${slug}/${pdfName}`;
    } else if (kind === 'preview') {
      const ext = imageExtensionFromMime(contentType);
      const rawPage = Number(body.pageIndex);
      const pageNum = Number.isFinite(rawPage) && rawPage >= 1 ? Math.floor(rawPage) : 1;
      objectKey = `worksheets/${slug}/preview-page-${pageNum}.${ext}`;
    } else {
      const ext = imageExtensionFromMime(contentType);
      objectKey = `worksheets/${slug}/pinterest-pin.${ext}`;
    }

    const signed = await createPresignedR2UploadUrl(objectKey, contentType, 600);

    return NextResponse.json(
      {
        uploadUrl: signed.uploadUrl,
        publicUrl: signed.publicUrl,
        objectKey: signed.objectKey,
        method: 'PUT',
        headers: {
          'Content-Type': contentType,
        },
        expiresIn: 600,
      },
      { status: 200, headers: access.headers }
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to create presigned upload URL';
    return NextResponse.json({ error: msg }, { status: 500, headers: access.headers });
  }
}
