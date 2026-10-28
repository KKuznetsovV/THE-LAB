import { createRequire } from 'node:module';

const require = createRequire(new URL('../frontend/package.json', import.meta.url));
const { chromium } = require('playwright');
const AxeBuilder = require('@axe-core/playwright').default;

const base = process.env.SITE_URL || 'http://127.0.0.1:8080';
const paths = [
  '/', '/en', '/menu', '/en/menu', '/take-me-home', '/en/take-me-home',
  '/visit', '/en/visit', '/events', '/en/events', '/archive', '/en/archive',
  '/about', '/en/about', '/accessibility', '/en/accessibility', '/privacy', '/en/privacy',
];

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const context = await browser.newContext();
const page = await context.newPage();
await page.addInitScript(() => {
  localStorage.setItem('thelab-age-ok', 'yes');
  sessionStorage.setItem('thelab-boot', 'done');
});

let failed = 0;
try {
  for (const route of paths) {
    await page.goto(`${base}${route}`, { waitUntil: 'networkidle' });
    await page.locator('h1').first().waitFor();
    const results = await new AxeBuilder({ page }).analyze();
    const blocking = results.violations.filter((item) => item.impact === 'serious' || item.impact === 'critical');
    if (blocking.length > 0) {
      failed += 1;
      console.log(route, blocking.map((item) => `${item.impact} ${item.id}`).join(', '));
    } else {
      console.log(`ok ${route}`);
    }
  }
} finally {
  await browser.close();
}
if (failed > 0) process.exit(1);
