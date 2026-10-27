import { readFileSync } from 'node:fs';

export const STATIC_PATHS = [
  '/',
  '/menu',
  '/take-me-home',
  '/visit',
  '/events',
  '/archive',
  '/about',
  '/accessibility',
  '/privacy',
];

export function withLocale(path, locale) {
  if (locale === 'he') return path;
  return path === '/' ? '/en' : `/en${path}`;
}

export function siteOrigin(mode) {
  const fromEnv = process.env.SITE_URL?.trim().replace(/\/$/, '');
  if (fromEnv) return fromEnv;
  try {
    const text = readFileSync(new URL(`../frontend/.env.${mode}`, import.meta.url), 'utf8');
    const line = text.split(/\r?\n/).find((row) => row.startsWith('VITE_SITE_URL='));
    const value = line?.slice('VITE_SITE_URL='.length).trim().replace(/\/$/, '');
    if (value) return value;
  } catch {
    // Fall through to the public host.
  }
  return 'https://thelabtlv.com';
}

async function readList(url, pick) {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(4000) });
    if (!response.ok) return [];
    const body = await response.json();
    if (!Array.isArray(body)) return [];
    const paths = [];
    for (const row of body) {
      if (!row || typeof row !== 'object') continue;
      const value = pick(row);
      if (value) paths.push(value);
    }
    return paths;
  } catch {
    return [];
  }
}

/** Static pages plus published cocktail and event URLs when the content API is up. */
export async function publicPaths() {
  const base = process.env.CONTENT_URL || 'http://127.0.0.1:3109';
  const cocktails = await readList(`${base}/api/cocktails`, (row) => (
    typeof row.code === 'string' && /^[A-Z0-9-]{1,6}$/.test(row.code) ? `/menu/${row.code}` : ''
  ));
  const events = await readList(`${base}/api/events`, (row) => (
    typeof row.slug === 'string' && /^[a-z0-9-]{1,80}$/.test(row.slug) ? `/events/${row.slug}` : ''
  ));
  return [...STATIC_PATHS, ...cocktails, ...events];
}
