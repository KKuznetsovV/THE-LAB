import { createRequire } from 'node:module';
import { mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';

const require = createRequire(new URL('../frontend/package.json', import.meta.url));
const { chromium } = require('playwright');

const root = fileURLToPath(new URL('../frontend/public', import.meta.url));
const outDir = fileURLToPath(new URL('../frontend/public/og', import.meta.url));
const card = fileURLToPath(new URL('../frontend/public/og/card.html', import.meta.url));

const html = `<!doctype html>
<meta charset="utf-8">
<title>THE LAB</title>
<style>
  html, body { margin: 0; background: #020B05; }
  .card { position: relative; width: 1200px; height: 630px; overflow: hidden; background: #020B05; }
  .maze { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0.55; }
  .logo { position: absolute; left: 50%; top: 50%; width: 760px; transform: translate(-50%, -50%);
    filter: drop-shadow(0 0 12px #00ff0d) drop-shadow(0 0 36px #00ff0d); }
</style>
<div class="card">
  <img class="maze" src="../brand/patterns/pattern-maze-black-thumb.webp" alt="">
  <img class="logo" src="../brand/logo/the-lab-logo-horizontal-white.svg" alt="THE LAB">
</div>
`;

mkdirSync(outDir, { recursive: true });
writeFileSync(card, html);

const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  await page.goto(pathToFileURL(card).href, { waitUntil: 'networkidle' });
  await page.locator('.card').screenshot({ path: `${outDir}/the-lab.png`, type: 'png' });
} finally {
  await browser.close();
  rmSync(card);
}

console.log(`wrote ${root}/og/the-lab.png`);
