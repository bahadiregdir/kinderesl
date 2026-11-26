// Checks that every clipart manifest entry points at a real file.
// Run: node scripts/validate-clipart.mjs
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dir = join(root, 'public', 'clipart');
const items = JSON.parse(readFileSync(join(root, 'src/data/clipart-manifest.json'), 'utf8'));
const errors = [];
const ids = new Set();

for (const item of items) {
  if (ids.has(item.id)) errors.push(`duplicate id: ${item.id}`);
  ids.add(item.id);
  if (!item.file.startsWith(`${item.theme}/`)) errors.push(`${item.id}: file not in theme folder`);
  if (!existsSync(join(dir, item.file))) errors.push(`${item.id}: missing ${item.file}`);
  if (item.svg && !existsSync(join(dir, item.svg))) errors.push(`${item.id}: missing ${item.svg}`);
}
for (const item of items) {
  if (item.variantOf && !ids.has(item.variantOf)) errors.push(`${item.id}: unknown variantOf ${item.variantOf}`);
}
// Files on disk that the manifest does not list
const listed = new Set(items.flatMap((i) => [i.file, i.svg].filter(Boolean)));
for (const theme of readdirSync(dir, { withFileTypes: true }).filter((d) => d.isDirectory())) {
  for (const f of readdirSync(join(dir, theme.name))) {
    if (!listed.has(`${theme.name}/${f}`)) errors.push(`unlisted file: ${theme.name}/${f}`);
  }
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(`clipart OK: ${items.length} items, all files present`);
