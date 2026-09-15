import { expect, test } from '@playwright/test';
import { caseStudies, insights, legalPages, services, teamMembers } from '../src/lib/content';

const routes = ['/', '/about', '/contact', '/cases', '/insights', '/services', ...caseStudies.map(item => `/cases/${item.id}`), ...insights.map(item => `/insights/${item.id}`), ...services.map(item => `/services/${item.id}`), ...legalPages.map(item => `/${item.id}`)];

for (const width of [1440, 810, 390]) {
  test(`all published pages render without broken images or overflow at ${width}px`, async ({ page }, testInfo) => {
    test.setTimeout(180000);
    await page.setViewportSize({ width, height: width === 390 ? 844 : 1000 });
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    for (const route of routes) {
      const response = await page.goto(route);
      expect(response?.status(), route).toBe(200);
      await expect(page.locator('main h1'), route).toHaveCount(1);
      await expect(page).toHaveTitle(/Kora/);
      await page.evaluate(() => document.fonts.ready);
      await page.evaluate(async () => {
        const images = [...document.querySelectorAll('img')];
        images.forEach(image => { image.loading = 'eager'; });
        await Promise.all(images.map(image => image.decode().catch(() => undefined)));
      });
      expect(await page.locator('img').evaluateAll(images => images.filter(image => image instanceof HTMLImageElement && !image.naturalWidth).map(image => image.getAttribute('src'))), route).toEqual([]);
      expect(await page.evaluate(() => document.documentElement.scrollWidth), route).toBe(width);
      await page.waitForTimeout(route === '/' ? 1500 : 600);
      await page.screenshot({ path: testInfo.outputPath(`${route.replaceAll('/', '_') || 'home'}-${width}.png`) });
    }
    expect(errors).toEqual([]);
  });

  test(`process, team, pricing, testimonials and FAQ work at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/');
    await expect(page.locator('.contact-form button[type="submit"]')).toBeEnabled();
    for (const title of ['Design', 'Build', 'Transfer', 'Diagnose']) {
      const button = page.getByRole('button', { name: new RegExp(`Phase \\d: ${title}`) });
      await button.click();
      await expect(button).toHaveAttribute('aria-expanded', 'true');
      await expect(page.locator('.phase-trigger[aria-expanded="true"]')).toHaveCount(1);
    }
    await page.getByRole('button', { name: 'Watch how we work' }).click();
    await expect(page.locator('.video-dialog')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('.video-dialog')).not.toBeVisible();
    for (const member of teamMembers) {
      const button = page.locator('.team-row button').filter({ hasText: member.name });
      await button.click();
      await expect(page.getByRole('dialog', { name: member.name })).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(button).toBeFocused();
    }
    await page.getByRole('button', { name: 'Read testimonial from David Kim' }).click();
    await expect(page.getByRole('button', { name: 'Read testimonial from David Kim' })).toHaveAttribute('aria-expanded', 'true');
    await page.getByRole('tab', { name: /Growth Partnership/ }).click();
    await expect(page.locator('#plan-panel')).toContainText('$8500');
    await page.getByRole('tab', { name: /Custom/ }).click();
    await expect(page.locator('#plan-panel')).toContainText('Let’s talk.');
    const faq = page.getByRole('tab', { name: 'Results', exact: true });
    await faq.click();
    await expect(faq).toHaveAttribute('aria-selected', 'true');
    const question = page.locator('.faq-item button').first();
    await question.click();
    await expect(question).toHaveAttribute('aria-expanded', 'false');
    await question.click();
    await expect(question).toHaveAttribute('aria-expanded', 'true');
    if (width <= 810) {
      await page.getByRole('button', { name: 'Open navigation' }).click();
      await expect(page.getByRole('navigation', { name: 'Mobile navigation' })).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(page.getByRole('navigation', { name: 'Mobile navigation' })).not.toBeVisible();
    }
  });
}

test('unknown content routes return 404', async ({ page }) => {
  for (const route of ['/cases/not-a-case', '/services/not-a-service', '/insights/not-an-insight', '/not-a-page']) {
    expect((await page.goto(route))?.status()).toBe(404);
  }
});
