import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

let cachedR2Client: S3Client | null = null;

function getR2Env() {
  const accountId = process.env.R2_ACCOUNT_ID?.trim() || '';
  const accessKeyId = process.env.R2_ACCESS_KEY_ID?.trim() || '';
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY?.trim() || '';
  const bucket = process.env.R2_BUCKET_NAME?.trim() || 'kinderesl-assets';
  const publicUrl = (process.env.R2_PUBLIC_URL?.trim() || '').replace(/\/+$/, '');
  return { accountId, accessKeyId, secretAccessKey, bucket, publicUrl };
}

export function isR2Configured(): boolean {
  const env = getR2Env();
  return Boolean(
    env.accountId && env.accessKeyId && env.secretAccessKey && env.publicUrl
  );
}

export function getR2Info() {
  const env = getR2Env();
  return {
    configured: isR2Configured(),
    bucket: env.bucket,
    publicUrl: env.publicUrl,
  };
}

function getR2Client(): S3Client {
  const env = getR2Env();
  if (!isR2Configured()) {
    throw new Error(
      'Cloudflare R2 is not configured. Set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, and R2_PUBLIC_URL.'
    );
  }
  if (!cachedR2Client) {
    cachedR2Client = new S3Client({
      region: 'auto',
      endpoint: `https://${env.accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: env.accessKeyId,
        secretAccessKey: env.secretAccessKey,
      },
    });
  }
  return cachedR2Client;
}

export async function uploadBufferToR2(
  objectKey: string,
  body: Buffer,
  contentType: string
): Promise<string> {
  const { bucket, publicUrl } = getR2Env();
  const cleanKey = objectKey.replace(/^\/+/, '');
  const client = getR2Client();

  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: cleanKey,
      Body: body,
      ContentType: contentType,
      CacheControl: 'public, max-age=31536000, immutable',
    })
  );

  return `${publicUrl}/${cleanKey}`;
}

export async function deleteFromR2ByUrl(url: string): Promise<void> {
  if (!url || !isR2Configured()) return;
  const { bucket, publicUrl } = getR2Env();
  const prefix = `${publicUrl}/`;
  if (!url.startsWith(prefix)) return;

  const key = url.slice(prefix.length).replace(/^\/+/, '');
  if (!key) return;

  try {
    const client = getR2Client();
    await client.send(
      new DeleteObjectCommand({
        Bucket: bucket,
        Key: key,
      })
    );
  } catch (err) {
    console.warn(`Failed to delete R2 object ${key}:`, err);
  }
}
