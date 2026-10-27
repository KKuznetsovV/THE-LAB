import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const paths = [
  '/',
  '/en',
  '/menu',
  '/en/menu',
  '/take-me-home',
  '/en/take-me-home',
  '/visit',
  '/en/visit',
  '/events',
  '/en/events',
  '/archive',
  '/en/archive',
  '/about',
  '/en/about',
  '/accessibility',
  '/en/accessibility',
  '/privacy',
  '/en/privacy',
  '/admin/login',
];

for (const route of paths) {
  test(`axe ${route}`, async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('thelab-age-ok', 'yes');
      sessionStorage.setItem('thelab-boot', 'done');
    });
    await page.goto(route);
    await page.locator('h1').first().waitFor();
    const results = await new AxeBuilder({ page }).analyze();
    const blocking = results.violations.filter((item) => item.impact === 'serious' || item.impact === 'critical');
    expect(blocking.map((item) => `${item.id}: ${item.help}`)).toEqual([]);
  });
}
