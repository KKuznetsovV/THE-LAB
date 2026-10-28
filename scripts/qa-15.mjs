import { createRequire } from 'node:module';
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const require = createRequire(new URL('../frontend/package.json', import.meta.url));
const { chromium } = require('playwright');

const phase = process.argv[2] === 'before' ? 'before' : 'after';
const outDir = fileURLToPath(new URL(`../docs/screenshots/qa-15/${phase}/`, import.meta.url));
mkdirSync(outDir, { recursive: true });

const base = process.env.SITE_URL || 'http://127.0.0.1:8080';
const viewports = [[1440, 900, '1440'], [375, 812, '375']];

const browser = await chromium.launch({ channel: 'chrome', headless: true });

async function shot(page, name) {
  await page.screenshot({ path: `${outDir}/${name}.png`, fullPage: false });
  console.log(name);
}

try {
  for (const [width, height, size] of viewports) {
    const context = await browser.newContext({ viewport: { width, height } });
    await context.addInitScript(() => {
      localStorage.setItem('thelab-age-ok', 'yes');
      sessionStorage.setItem('thelab-boot', 'done');
    });
    const page = await context.newPage();
    for (const locale of ['he', 'en']) {
      const prefix = locale === 'en' ? '/en' : '';
      await page.goto(`${base}${prefix || '/'}`, { waitUntil: 'networkidle' });
      await page.waitForFunction(() => (document.querySelector('.type-line-live')?.textContent ?? '').includes('UNDERGROUND'));
      await shot(page, `home-top-${locale}-${size}`);
      for (const [name, selector] of [
        ['home-index', '.menu-teaser'],
        ['home-bottles', '.bottles-teaser'],
        ['home-visit', '.visit-teaser'],
        ['home-footer', '.site-footer'],
      ]) {
        await page.locator(selector).scrollIntoViewIfNeeded();
        await shot(page, `${name}-${locale}-${size}`);
      }
      await page.goto(`${base}${prefix}/menu`, { waitUntil: 'networkidle' });
      await page.waitForSelector('.menu-list, .menu-index');
      await shot(page, `menu-list-${locale}-${size}`);
      await page.goto(`${base}${prefix}/menu?v=index`, { waitUntil: 'networkidle' });
      await page.waitForSelector('.menu-index');
      await shot(page, `menu-index-${locale}-${size}`);
      await page.locator('[data-cocktail]').first().click();
      await page.waitForSelector('dialog[open]');
      await shot(page, `menu-dialog-${locale}-${size}`);
      await page.goto(`${base}${prefix}/take-me-home`, { waitUntil: 'networkidle' });
      await shot(page, `take-me-home-${locale}-${size}`);
      await page.goto(`${base}${prefix}/visit`, { waitUntil: 'networkidle' });
      await shot(page, `visit-${locale}-${size}`);
      await page.goto(`${base}${prefix}/no-such-page`, { waitUntil: 'networkidle' });
      await shot(page, `not-found-${locale}-${size}`);
    }
    await context.close();

    const gated = await browser.newContext({ viewport: { width, height } });
    await gated.addInitScript(() => {
      localStorage.removeItem('thelab-age-ok');
      sessionStorage.setItem('thelab-boot', 'done');
    });
    const gate = await gated.newPage();
    for (const locale of ['he', 'en']) {
      const prefix = locale === 'en' ? '/en' : '';
      await gate.goto(`${base}${prefix || '/'}`, { waitUntil: 'networkidle' });
      await gate.waitForSelector('dialog[open]');
      await shot(gate, `age-gate-${locale}-${size}`);
    }
    await gated.close();
  }
} finally {
  await browser.close();
}
