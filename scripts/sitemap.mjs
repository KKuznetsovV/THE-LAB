import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { publicPaths, siteOrigin, withLocale } from './public-routes.mjs';

const mode = process.argv[2] || 'production';
const origin = siteOrigin(mode);
const dist = fileURLToPath(new URL('../frontend/dist', import.meta.url));
const paths = await publicPaths();

function loc(route) {
  return route === '/' ? `${origin}/` : `${origin}${route}`;
}

function entry(bare) {
  const he = loc(withLocale(bare, 'he'));
  const en = loc(withLocale(bare, 'en'));
  const links = [
    `    <xhtml:link rel="alternate" hreflang="he" href="${he}"/>`,
    `    <xhtml:link rel="alternate" hreflang="en" href="${en}"/>`,
    `    <xhtml:link rel="alternate" hreflang="x-default" href="${he}"/>`,
  ].join('\n');
  return [he, en].map((href) => `  <url>\n    <loc>${href}</loc>\n${links}\n  </url>`).join('\n');
}

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
  paths.map(entry).join('\n'),
  '</urlset>',
  '',
].join('\n');

const robots = [
  'User-agent: *',
  'Disallow: /admin',
  'Allow: /',
  '',
  `Sitemap: ${origin}/sitemap.xml`,
  '',
].join('\n');

mkdirSync(dist, { recursive: true });
writeFileSync(new URL('../frontend/dist/sitemap.xml', import.meta.url), xml);
writeFileSync(new URL('../frontend/dist/robots.txt', import.meta.url), robots);
console.log(`sitemap ${paths.length} paths → ${origin}`);
