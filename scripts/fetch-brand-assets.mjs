#!/usr/bin/env node
// Idempotent download of brand assets listed in docs/BRAND.md §8.
// Node 24 fetch, no dependencies. Re-running skips files that already exist.

import { createWriteStream } from 'node:fs';
import { mkdir, stat } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { pipeline } from 'node:stream/promises';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PUBLIC = join(ROOT, 'frontend', 'public', 'brand');
const BASE = 'https://eliezer.house/the-lab';

const logos = ['stacked', 'horizontal'].flatMap((layout) =>
  ['black', 'white', 'green'].flatMap((colour) =>
    ['svg', 'png'].map((ext) => ({
      url: `${BASE}/brand/the-lab-logo-${layout}-${colour}.${ext}`,
      dest: join(PUBLIC, 'logo', `the-lab-logo-${layout}-${colour}.${ext}`),
    })),
  ),
);

const flavours = [
  'fruity', 'floral', 'spicy', 'chocolate', 'herbal', 'sweet', 'anise', 'deep',
  'strong', 'sour', 'oumami', 'na', 'tangy', 'smokey', 'bitter', 'fresh', 'sparkling',
];

const icons = flavours.map((name) => ({
  url: `${BASE}/brand/icons/${name}.svg`,
  dest: join(PUBLIC, 'icons', `${name}.svg`),
}));

const patterns = ['green', 'black', 'grey'].flatMap((tone) => [
  {
    url: `${BASE}/brand/pattern-maze-${tone}.png`,
    dest: join(PUBLIC, 'patterns', `pattern-maze-${tone}.png`),
  },
  {
    url: `${BASE}/brand/pattern-maze-${tone}-thumb.webp`,
    dest: join(PUBLIC, 'patterns', `pattern-maze-${tone}-thumb.webp`),
  },
]);

const tile = {
  url: `${BASE}/assets/maze-tile.webp`,
  dest: join(PUBLIC, 'patterns', 'maze-tile.webp'),
};

const files = [...logos, ...icons, ...patterns, tile];

async function download(url, dest) {
  await mkdir(dirname(dest), { recursive: true });
  try {
    const existing = await stat(dest);
    if (existing.size > 0) return { url, dest, status: 'skipped' };
  } catch {
    // missing — download
  }

  const response = await fetch(url);
  if (!response.ok || !response.body) {
    return { url, dest, status: 'failed', detail: `HTTP ${response.status}` };
  }
  await pipeline(response.body, createWriteStream(dest));
  const info = await stat(dest);
  return { url, dest, status: 'downloaded', bytes: info.size };
}

const rows = [];
for (const file of files) {
  try {
    rows.push(await download(file.url, file.dest));
  } catch (error) {
    const detail = error instanceof Error ? error.message : 'unknown error';
    rows.push({ url: file.url, dest: file.dest, status: 'failed', detail });
  }
}

const counts = { downloaded: 0, skipped: 0, failed: 0 };
console.log('\nfile                                      status       bytes');
for (const row of rows) {
  counts[row.status] += 1;
  const name = row.dest.slice(PUBLIC.length + 1).padEnd(42);
  const extra = row.bytes ? String(row.bytes) : (row.detail ?? '');
  console.log(`${name}${row.status.padEnd(13)}${extra}`);
}
console.log(`\ndownloaded ${counts.downloaded}   skipped ${counts.skipped}   failed ${counts.failed}`);
process.exit(counts.failed > 0 ? 1 : 0);
