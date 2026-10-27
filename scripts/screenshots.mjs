import { createRequire } from 'node:module';
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const require = createRequire(new URL('../frontend/package.json', import.meta.url));
const { chromium } = require('playwright');

const outDir = fileURLToPath(new URL('../docs/screenshots/', import.meta.url));
mkdirSync(outDir, { recursive: true });

const base = process.env.SITE_URL || 'http://127.0.0.1:8080';
const email = process.env.THELAB_ADMIN_EMAIL || 'owner@thelabtlv.com';
const password = process.env.THELAB_ADMIN_PASSWORD || 'change-me-strong-password';

const pages = [
  ['home', '/'],
  ['menu', '/menu'],
  ['take-me-home', '/take-me-home'],
  ['visit', '/visit'],
];

const browser = await chromium.launch({ channel: 'chrome', headless: true });

async function shoot(page, name) {
  await page.screenshot({ path: `${outDir}/${name}.png`, fullPage: false });
  console.log(name);
}

try {
  for (const [width, height, size] of [[1440, 900, 'desktop'], [390, 844, 'mobile']]) {
    const context = await browser.newContext({ viewport: { width, height } });
    await context.addInitScript(() => {
      localStorage.setItem('thelab-age-ok', 'yes');
      sessionStorage.setItem('thelab-boot', 'done');
    });
    const page = await context.newPage();

    for (const locale of ['he', 'en']) {
      const prefix = locale === 'en' ? '/en' : '';
      for (const [name, path] of pages) {
        await page.goto(`${base}${prefix}${path}`, { waitUntil: 'networkidle' });
        await page.waitForSelector('h1');
        if (name === 'home') {
          await page.waitForFunction(() => {
            const live = document.querySelector('.type-line-live');
            return (live?.textContent ?? '').includes('UNDERGROUND');
          });
        }
        await shoot(page, `${name}-${locale}-${size}`);
      }
      await page.goto(`${base}${prefix}/menu`, { waitUntil: 'networkidle' });
      await page.locator('#virgin').scrollIntoViewIfNeeded();
      await shoot(page, `menu-filter-${locale}-${size}`);
    }

    await page.goto(`${base}/admin/login`, { waitUntil: 'networkidle' });
    await page.getByRole('textbox', { name: 'אימייל' }).fill(email);
    await page.getByRole('textbox', { name: 'סיסמה' }).fill(password);
    await page.getByRole('button', { name: 'כניסה' }).click();
    await page.waitForURL('**/admin');
    await shoot(page, `admin-he-${size}`);
    await page.getByRole('button', { name: 'EN' }).click();
    await page.waitForTimeout(400);
    await shoot(page, `admin-en-${size}`);
    await context.close();
  }
} finally {
  await browser.close();
}
