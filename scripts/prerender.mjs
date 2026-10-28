import { createRequire } from 'node:module';
import { createServer } from 'node:http';
import { mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { publicPaths, withLocale } from './public-routes.mjs';
import { fallbackBody } from './seed-fallback.mjs';

if (process.env.SKIP_PRERENDER === '1') {
  console.log('prerender skipped (SKIP_PRERENDER=1)');
  process.exit(0);
}

const require = createRequire(new URL('../frontend/package.json', import.meta.url));
const { chromium } = require('playwright');

const dist = fileURLToPath(new URL('../frontend/dist', import.meta.url));
const shell = readFileSync(path.join(dist, 'index.html'));
const port = Number(process.env.PRERENDER_PORT || 4177);

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.woff2': 'font/woff2',
  '.ico': 'image/x-icon',
  '.json': 'application/json',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml',
  '.map': 'application/json',
};

function inside(root, target) {
  return target === root || target.startsWith(root + path.sep);
}

function resolveFile(root, pathname) {
  const decoded = decodeURIComponent(pathname);
  const candidate = path.resolve(root, `.${decoded}`);
  if (!inside(root, candidate)) return null;
  try {
    const stat = statSync(candidate);
    if (stat.isDirectory()) {
      const index = path.join(candidate, 'index.html');
      return statSync(index).isFile() ? index : null;
    }
    return stat.isFile() ? candidate : null;
  } catch {
    return null;
  }
}

const contentOrigin = process.env.CONTENT_URL || 'http://127.0.0.1:3109';

function startServer() {
  const root = path.resolve(dist);
  const server = createServer((req, res) => {
    const url = new URL(req.url ?? '/', 'http://127.0.0.1');
    if (url.pathname.startsWith('/api/')) {
      const target = new URL(`${url.pathname}${url.search}`, contentOrigin);
      const sendFallback = () => {
        const body = fallbackBody(url.pathname);
        if (body === null) {
          res.writeHead(502);
          res.end('content api unavailable');
          return;
        }
        res.writeHead(200, { 'content-type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify(body));
      };
      fetch(target)
        .then(async (upstream) => {
          if (upstream.status >= 500) {
            sendFallback();
            return;
          }
          const body = Buffer.from(await upstream.arrayBuffer());
          res.writeHead(upstream.status, {
            'content-type': upstream.headers.get('content-type') ?? 'application/json',
          });
          res.end(body);
        })
        .catch(() => {
          sendFallback();
        });
      return;
    }
    if (!path.extname(url.pathname)) {
      res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
      res.end(shell);
      return;
    }
    const file = resolveFile(root, url.pathname);
    if (!file || !inside(root, file)) {
      res.writeHead(404);
      res.end('not found');
      return;
    }
    const body = readFileSync(file);
    res.writeHead(200, { 'content-type': TYPES[path.extname(file).toLowerCase()] ?? 'application/octet-stream' });
    res.end(body);
  });
  return new Promise((resolve) => {
    server.listen(port, '127.0.0.1', () => resolve(server));
  });
}

function outputFile(route) {
  if (route === '/') return path.join(dist, 'index.html');
  return path.join(dist, route.replace(/^\//, ''), 'index.html');
}

const server = await startServer();
const browser = await chromium.launch({
  headless: true,
  ...(process.env.PLAYWRIGHT_USE_BUNDLED === '1' ? {} : { channel: 'chrome' }),
});
const context = await browser.newContext();
await context.addInitScript(() => {
  localStorage.setItem('thelab-age-ok', 'yes');
  sessionStorage.setItem('thelab-boot', 'done');
});
const page = await context.newPage();
const paths = await publicPaths();
let written = 0;

try {
  for (const bare of paths) {
    for (const locale of ['he', 'en']) {
      const route = withLocale(bare, locale);
      const lang = locale;
      await page.goto(`http://127.0.0.1:${port}${route}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
      try {
        await page.waitForFunction((expected) => {
          const description = document.querySelector('meta[name="description"]');
          const text = description?.getAttribute('content') ?? '';
          return document.documentElement.lang === expected && text.length > 0 && document.title.includes('THE LAB');
        }, lang, { timeout: 20000 });
      } catch (error) {
        const state = await page.evaluate(() => ({
          lang: document.documentElement.lang,
          title: document.title,
          description: document.querySelector('meta[name="description"]')?.getAttribute('content') ?? '',
          text: document.body.innerText.slice(0, 180),
        }));
        console.error(`prerender failed for ${route}`, state);
        throw error;
      }
      if (bare.startsWith('/menu/') && bare !== '/menu') {
        await page.waitForSelector('#cocktail-dialog-title', { timeout: 15000 });
      }
      const html = (await page.content()).replaceAll(`http://127.0.0.1:${port}`, '');
      const file = outputFile(route);
      mkdirSync(path.dirname(file), { recursive: true });
      writeFileSync(file, html);
      written += 1;
    }
  }
} finally {
  await browser.close();
  await new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())));
}

console.log(`prerendered ${written} pages`);
