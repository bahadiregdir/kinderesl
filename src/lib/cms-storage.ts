import { promises as fs } from 'fs';
import path from 'path';
import { getAdminPasswordConfig } from './admin-auth';
import { isDatabaseConfigured } from './db';
import { isR2Configured } from './r2-storage';

export type CmsStorageMode = 'local' | 'github' | 'unconfigured';

export interface StorageInfo {
  mode: CmsStorageMode;
  database: 'neon' | 'json';
  assetStorage: 'r2' | 'local' | 'unconfigured';
  repo: string;
  branch: string;
  envStatus: {
    hasDatabaseUrl: boolean;
    hasR2Config: boolean;
    hasAdminPassword: boolean;
    hasGithubToken: boolean;
    hasSiteUrl: boolean;
    enableDomainRedirect: boolean;
  };
}

export type CmsFileChange =
  | { path: string; contentBase64: string; delete?: false }
  | { path: string; delete: true };

export interface CommitResult {
  mode: 'local' | 'github';
  commitSha?: string;
}

const ALLOWED_PREFIXES = ['src/data/', 'public/worksheets/', 'public/images/'];

export function assertSafeRepoPath(relPath: string): string {
  const normalized = relPath.replace(/\\/g, '/').trim();
  if (
    !normalized ||
    normalized.startsWith('/') ||
    normalized.includes('..') ||
    normalized.includes('\0')
  ) {
    throw new Error(`Unsafe repository path rejected: ${relPath}`);
  }
  const allowed = ALLOWED_PREFIXES.some((prefix) => normalized.startsWith(prefix));
  if (!allowed) {
    throw new Error(`Repository path outside allowed CMS roots: ${relPath}`);
  }
  return normalized;
}

export function getStorageInfo(): StorageInfo {
  const repo = process.env.GITHUB_REPO?.trim() || 'bahadiregdir/kinderesl';
  const branch = process.env.GITHUB_BRANCH?.trim() || 'main';
  const hasGithubToken = Boolean(process.env.GITHUB_TOKEN?.trim());
  const hasDatabaseUrl = isDatabaseConfigured();
  const hasR2Config = isR2Configured();
  const isVercel = process.env.VERCEL === '1';
  const forceGithub = process.env.CMS_STORAGE_MODE === 'github';
  const adminCfg = getAdminPasswordConfig();

  let mode: CmsStorageMode = 'local';
  if (hasGithubToken && (isVercel || forceGithub || process.env.NODE_ENV === 'production')) {
    mode = 'github';
  } else if (isVercel && !hasDatabaseUrl) {
    mode = 'unconfigured';
  }

  const database: StorageInfo['database'] = hasDatabaseUrl ? 'neon' : 'json';
  const assetStorage: StorageInfo['assetStorage'] = hasR2Config
    ? 'r2'
    : isVercel
    ? 'unconfigured'
    : 'local';

  return {
    mode,
    database,
    assetStorage,
    repo,
    branch,
    envStatus: {
      hasDatabaseUrl,
      hasR2Config,
      hasAdminPassword: adminCfg.configured && !adminCfg.isDevDefault,
      hasGithubToken,
      hasSiteUrl: Boolean(process.env.NEXT_PUBLIC_SITE_URL?.trim()),
      enableDomainRedirect: process.env.ENABLE_DOMAIN_REDIRECT === 'true',
    },
  };
}

function githubHeaders(token: string): Record<string, string> {
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'KinderESL-Git-CMS',
    'Content-Type': 'application/json',
  };
}

export async function readJsonFile<T>(repoPath: string): Promise<T> {
  const safePath = assertSafeRepoPath(repoPath);
  const info = getStorageInfo();

  if (info.mode === 'github') {
    const token = process.env.GITHUB_TOKEN!.trim();
    const encodedPath = safePath.split('/').map(encodeURIComponent).join('/');
    const url = `https://api.github.com/repos/${info.repo}/contents/${encodedPath}?ref=${encodeURIComponent(info.branch)}`;
    const res = await fetch(url, {
      headers: githubHeaders(token),
      cache: 'no-store',
    });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`GitHub readJsonFile failed (${res.status}) for ${safePath}: ${errText}`);
    }
    const data = (await res.json()) as { content?: string; encoding?: string };
    if (!data.content) {
      throw new Error(`GitHub returned empty content for ${safePath}`);
    }
    const decoded = Buffer.from(data.content.replace(/\n/g, ''), 'base64').toString('utf8');
    return JSON.parse(decoded) as T;
  }

  const absPath = path.join(/*turbopackIgnore: true*/ process.cwd(), safePath);
  const raw = await fs.readFile(/*turbopackIgnore: true*/ absPath, 'utf8');
  return JSON.parse(raw) as T;
}

export async function commitFiles(
  changes: CmsFileChange[],
  message: string
): Promise<CommitResult> {
  const info = getStorageInfo();
  const validated = changes.map((c) => ({
    ...c,
    path: assertSafeRepoPath(c.path),
  }));

  if (info.mode === 'unconfigured') {
    throw new Error(
      'CMS storage is unconfigured in Vercel production. Please set GITHUB_TOKEN in Vercel Environment Variables to enable automatic GitHub commits.'
    );
  }

  if (info.mode === 'local') {
    const touchedWorksheetDirs = new Set<string>();

    for (const change of validated) {
      const absPath = path.join(/*turbopackIgnore: true*/ process.cwd(), change.path);
      if (change.delete) {
        await fs.unlink(/*turbopackIgnore: true*/ absPath).catch(() => undefined);
        const parts = change.path.split('/');
        if (parts[0] === 'public' && parts[1] === 'worksheets' && parts[2]) {
          touchedWorksheetDirs.add(`public/worksheets/${parts[2]}`);
        }
      } else {
        await fs.mkdir(/*turbopackIgnore: true*/ path.dirname(absPath), { recursive: true });
        const buf = Buffer.from(change.contentBase64, 'base64');
        await fs.writeFile(/*turbopackIgnore: true*/ absPath, buf);
      }
    }

    // Remove empty worksheet subdirectories cleanly on delete
    for (const wsDir of touchedWorksheetDirs) {
      const safeDir = assertSafeRepoPath(`${wsDir}/_check`).replace(/\/_check$/, '');
      const absDir = path.join(/*turbopackIgnore: true*/ process.cwd(), safeDir);
      try {
        const entries = await fs.readdir(/*turbopackIgnore: true*/ absDir);
        if (entries.length === 0) {
          await fs.rmdir(/*turbopackIgnore: true*/ absDir);
        }
      } catch {
        // Directory may already be absent
      }
    }

    return { mode: 'local' };
  }

  // GitHub atomic Git Data API commit
  const token = process.env.GITHUB_TOKEN!.trim();
  const headers = githubHeaders(token);
  const apiBase = `https://api.github.com/repos/${info.repo}`;

  // 1. Get branch ref
  const refRes = await fetch(
    `${apiBase}/git/ref/heads/${encodeURIComponent(info.branch)}`,
    { headers, cache: 'no-store' }
  );
  if (!refRes.ok) {
    throw new Error(`GitHub ref lookup failed (${refRes.status}): ${await refRes.text()}`);
  }
  const refData = (await refRes.json()) as { object: { sha: string } };
  const latestCommitSha = refData.object.sha;

  // 2. Get base commit -> base tree
  const commitRes = await fetch(`${apiBase}/git/commits/${latestCommitSha}`, {
    headers,
    cache: 'no-store',
  });
  if (!commitRes.ok) {
    throw new Error(`GitHub commit lookup failed (${commitRes.status}): ${await commitRes.text()}`);
  }
  const commitData = (await commitRes.json()) as { tree: { sha: string } };
  const baseTreeSha = commitData.tree.sha;

  // If any deletions are requested, check existing paths in the base tree so sha:null is only sent for existing blobs
  let existingTreePaths: Set<string> | null = null;
  if (validated.some((c) => c.delete)) {
    const treeRes = await fetch(`${apiBase}/git/trees/${baseTreeSha}?recursive=1`, {
      headers,
      cache: 'no-store',
    });
    if (treeRes.ok) {
      const treeJson = (await treeRes.json()) as { tree?: Array<{ path: string; type: string }> };
      existingTreePaths = new Set(
        (treeJson.tree || []).filter((t) => t.type === 'blob').map((t) => t.path)
      );
    }
  }

  // 3. Create blobs & prepare tree entries (deduplicated by path, last wins)
  const dedupedMap = new Map<string, CmsFileChange>();
  for (const ch of validated) {
    dedupedMap.set(ch.path, ch);
  }

  const treeEntries: Array<{
    path: string;
    mode: '100644';
    type: 'blob';
    sha: string | null;
  }> = [];

  for (const change of dedupedMap.values()) {
    if (change.delete) {
      if (!existingTreePaths || existingTreePaths.has(change.path)) {
        treeEntries.push({
          path: change.path,
          mode: '100644',
          type: 'blob',
          sha: null,
        });
      }
      continue;
    }

    const blobRes = await fetch(`${apiBase}/git/blobs`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        content: change.contentBase64,
        encoding: 'base64',
      }),
    });
    if (!blobRes.ok) {
      throw new Error(`GitHub blob creation failed (${blobRes.status}) for ${change.path}: ${await blobRes.text()}`);
    }
    const blobData = (await blobRes.json()) as { sha: string };
    treeEntries.push({
      path: change.path,
      mode: '100644',
      type: 'blob',
      sha: blobData.sha,
    });
  }

  if (treeEntries.length === 0) {
    return { mode: 'github', commitSha: latestCommitSha };
  }

  // 4. Create new tree
  const newTreeRes = await fetch(`${apiBase}/git/trees`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      base_tree: baseTreeSha,
      tree: treeEntries,
    }),
  });
  if (!newTreeRes.ok) {
    throw new Error(`GitHub tree creation failed (${newTreeRes.status}): ${await newTreeRes.text()}`);
  }
  const newTreeData = (await newTreeRes.json()) as { sha: string };

  // 5. Create new commit
  const newCommitRes = await fetch(`${apiBase}/git/commits`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      message,
      tree: newTreeData.sha,
      parents: [latestCommitSha],
    }),
  });
  if (!newCommitRes.ok) {
    throw new Error(`GitHub commit creation failed (${newCommitRes.status}): ${await newCommitRes.text()}`);
  }
  const newCommitData = (await newCommitRes.json()) as { sha: string };

  // 6. Update branch ref
  const updateRefRes = await fetch(
    `${apiBase}/git/refs/heads/${encodeURIComponent(info.branch)}`,
    {
      method: 'PATCH',
      headers,
      body: JSON.stringify({
        sha: newCommitData.sha,
        force: false,
      }),
    }
  );
  if (!updateRefRes.ok) {
    throw new Error(`GitHub ref update failed (${updateRefRes.status}): ${await updateRefRes.text()}`);
  }

  return { mode: 'github', commitSha: newCommitData.sha };
}
