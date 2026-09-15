import { expect, test, type Page } from '@playwright/test';

async function scrollTo(page: Page, top: number) {
  await page.evaluate(top => window.scrollTo({ top, behavior: 'instant' }), top);
  await page.waitForTimeout(250);
}

for (const width of [1440, 1200, 810, 390]) {
  test(`hero keeps the background pinned and reveals the statement at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 1000 });
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('/');
    await expect(page.locator('.contact-form button[type="submit"]')).toBeEnabled();
    await expect(page.locator('.hero-copy h1')).toHaveCSS('font-variation-settings', '"wght" 585');
    const height = await page.locator('.hero-scroll').evaluate(el => el.getBoundingClientRect().height);
    await scrollTo(page, height + 1100);
    await expect(page.locator('.hero-statement')).toBeVisible();
    const words = page.locator('.hero-statement .statement-word');
    await expect(words).toHaveCount(9);
    await expect(words.last()).toHaveCSS('opacity', '1');
    const statement = await page.locator('.hero-statement').boundingBox();
    expect(statement?.y).toBeCloseTo(0, 0);
    const background = await page.locator('.hero-background').boundingBox();
    expect(background!.y).toBeLessThanOrEqual(0);
    expect(background!.y + background!.height).toBeGreaterThanOrEqual(width === 390 ? 844 : 1000);
    const comparison = await page.locator('.comparison-scroll').evaluate(el => el.getBoundingClientRect().top + window.scrollY);
    await scrollTo(page, comparison - 300);
    expect((await page.locator('.hero-statement').boundingBox())?.y).toBeCloseTo(0, 0);
    expect((await page.locator('.comparison-scroll').boundingBox())?.y).toBeCloseTo(300, 0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
    await scrollTo(page, 0);
    await expect(words.first()).toHaveCSS('opacity', '0');
    expect(errors).toEqual([]);
  });
}

test('footer scales with scroll, reverses, and animates navigation on hover and focus', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/');
  const footer = page.locator('.site-footer');
  const card = page.locator('.footer-card');
  const top = await footer.evaluate(el => el.getBoundingClientRect().top + scrollY);
  const scale = () => card.evaluate(el => new DOMMatrixReadOnly(getComputedStyle(el).transform).a);
  await scrollTo(page, top - 1000);
  await expect.poll(scale).toBeCloseTo(0.85, 2);
  await scrollTo(page, await page.evaluate(() => document.documentElement.scrollHeight));
  await expect.poll(scale).toBeCloseTo(1, 2);
  const link = page.getByRole('navigation', { name: 'Footer navigation' }).getByRole('link', { name: 'Case studies', exact: true });
  await link.hover();
  await expect(link.locator('.footer-nav-hover')).toHaveCSS('opacity', '1');
  await page.mouse.move(0, 0);
  await link.focus();
  await expect(link.locator('.footer-nav-hover')).toHaveCSS('opacity', '1');
  await link.blur();
  await scrollTo(page, top - 1000);
  await expect.poll(scale).toBeCloseTo(0.85, 2);
});

for (const width of [1440, 390]) {
  test(`reduced motion keeps all introduction content readable at ${width}px`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await expect(page.locator('.hero-statement')).toBeVisible();
    await expect(page.locator('.hero-statement .statement-word').last()).toHaveCSS('opacity', '1');
    await expect(page.locator('.hero-scroll')).not.toHaveCSS('position', 'sticky');
    await expect(page.locator('.ticker-track')).toHaveCSS('animation-name', 'none');
    await expect(page.locator('.footer-card')).toHaveCSS('transform', 'none');
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
  });
}
