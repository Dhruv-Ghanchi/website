import { readFileSync } from 'node:fs';
import path from 'node:path';
import { expect, test } from '@playwright/test';
import type { FixtureData } from './fixture-data';

// Fetched synchronously at module-load time (see global-setup.ts) rather than via
// top-level await: Playwright's test-file loader require()s this module, which
// cannot coexist with top-level await on an ESM graph.
const fixturePath = path.join(__dirname, '.fixture-data.json');
const { articles, legalPages, services, teamMembers, newsletters }: FixtureData = JSON.parse(readFileSync(fixturePath, 'utf-8'));

const routes = ['/', '/about-us', '/about-us/awards', '/about-us/certificates', '/about-us/our-clients', '/about-us/testimonials', '/contact-us', '/online-services', '/newsletters', '/blog', '/services', ...articles.map(item => `/blog/${item.slug}`), ...services.map(item => `/services/${item.slug}`), ...legalPages.map(item => `/${item.slug}`)];
for (const width of [1440, 1200, 810, 390]) {
  test(`published pages, assets and overflow at ${width}px`, async ({ page }, testInfo) => {
    test.setTimeout(240000);
    await page.setViewportSize({ width, height: width === 390 ? 844 : 1000 });
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error' && /hydrat|server rendered|invalid.*pattern/i.test(message.text())) errors.push(message.text()); });
    for (const route of routes) {
      expect((await page.goto(route))?.status(), route).toBe(200);
      await expect(page.locator('main h1'), route).toHaveCount(1);
      await expect(page.locator('#main'), route).toHaveCount(1);
      await expect(page).toHaveTitle(/Ghanchi Investments/);
      await expect(page.getByRole('button', { name: 'Subscribe to newsletter', exact: true })).toBeEnabled();
      await page.evaluate(() => document.fonts.ready);
      const brokenImages = await page.locator('img').evaluateAll(async images => {
        const results = await Promise.all(images.map(async element => {
          const image = new Image();
          image.src = element.getAttribute('src') || '';
          try { await image.decode(); return null; } catch { return image.src; }
        }));
        return results.filter(Boolean);
      });
      expect(brokenImages, route).toEqual([]);
      expect(await page.evaluate(() => document.documentElement.scrollWidth), route).toBe(width);
      await expect(page.locator('main')).not.toContainText(/Kora|Sitemark|Growth Sprint|casino|Rajesh Mehta|Priya Nair/i);
      if (route === '/' || route === '/about-us' || route === '/contact-us') {
        await page.waitForTimeout(1400);
        await page.screenshot({ path: testInfo.outputPath(`${route.replaceAll('/', '_') || 'home'}-${width}.png`) });
      }
    }
    expect(errors).toEqual([]);
  });
  test(`preserved interactions at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/');
    await expect(page.locator('.contact-form button[type="submit"]')).toBeEnabled();
    for (const title of ['Assess', 'Plan', 'Review', 'Understand']) {
      const button = page.getByRole('button', { name: new RegExp(`Phase \\d: ${title}`) });
      await button.click();
      await expect(button).toHaveAttribute('aria-expanded', 'true');
      await expect(page.locator('.phase-trigger[aria-expanded="true"]')).toHaveCount(1);
    }
    await page.getByRole('button', { name: 'Watch how we work' }).click();
    const processVideo = page.locator('.process-video video');
    if (await processVideo.count()) {
      await expect(processVideo).toHaveJSProperty('paused', false);
      await expect(processVideo).toHaveJSProperty('controls', true);
      await processVideo.evaluate((video: HTMLVideoElement) => video.pause());
      await expect(page.getByRole('button', { name: 'Watch how we work' })).toBeVisible();
    } else {
      await expect(page.getByRole('dialog', { name: 'How we work' })).toBeVisible();
      await page.keyboard.press('Escape');
    }
    const founder = teamMembers[0];
    await expect(page.locator('.team-pill-list')).toBeVisible();
    await expect(page.locator('.team-pill')).toHaveCount(teamMembers.length);
    if (founder?.name) await expect(page.locator('.team-pill').first()).toContainText(founder.name);
    await expect(page.locator('.recognition-block')).toBeVisible();
    await expect(page.locator('a[href="/about-us/awards"]')).toHaveCount(1);
    await expect(page.locator('a[href="/about-us/certificates"]')).toHaveCount(1);
    const testimonial = page.getByRole('button', { name: 'Read testimonial from Ranbir Singh' });
    await testimonial.click();
    await expect(testimonial).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('#pricing')).toHaveCount(0);
    const tab = page.getByRole('tab', { name: 'Protection', exact: true });
    await tab.click();
    const question = page.locator('.faq-item button').first();
    await question.click();
    await expect(question).toHaveAttribute('aria-expanded', 'false');
    await question.click();
    await expect(question).toHaveAttribute('aria-expanded', 'true');
    if (width <= 810) {
      await page.getByRole('button', { name: 'Open navigation' }).click();
      const nav = page.getByRole('navigation', { name: 'Mobile navigation' });
      await nav.getByRole('button', { name: 'Toggle Services links' }).click();
      await expect(nav.getByRole('link', { name: 'Health Insurance', exact: true })).toBeVisible();
      await nav.getByRole('link', { name: 'Health Insurance', exact: true }).click();
      await expect(page).toHaveURL(/\/services\/health-insurance$/);
      await expect(nav).not.toBeVisible();
      await page.getByRole('button', { name: 'Open navigation' }).click();
      await page.keyboard.press('Escape');
      await expect(page.getByRole('button', { name: 'Open navigation' })).toBeFocused();
    }
  });
}
for (const width of [1440, 1200, 1024, 810, 390]) {
  test(`photo service tiles preserve styling and links at ${width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/');
    await expect(page.locator('.contact-form button[type="submit"]')).toBeEnabled();
    const section = page.locator('#services');
    await section.locator('.display-title').scrollIntoViewIfNeeded();
    await expect(section.locator('.display-title').locator('..')).toHaveCSS('opacity', '1');
    await section.locator('.services-intro').scrollIntoViewIfNeeded();
    await expect(section.locator('.services-intro')).toHaveCSS('opacity', '1');
    if (width === 1440) {
      await expect(section.locator('.display-title')).toHaveCSS('font-size', '120px');
      await expect(section.locator('.services-intro p')).toHaveCSS('font-size', '30px');
    }
    const tiles = section.locator('.service-tile');
    await expect(tiles).toHaveCount(services.length);
    for (const service of services) await expect(section.getByRole('link', { name: service.title, exact: true })).toHaveAttribute('href', `/services/${service.slug}`);
    await expect(section.locator('.service-orbit, .service-card')).toHaveCount(0);
    await tiles.first().hover();
    const arrow = tiles.first().locator('.service-arrow-in');
    await expect(arrow).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, 0)');
    await page.mouse.move(0, 0);
    await tiles.first().focus();
    await expect(tiles.first()).toHaveCSS('outline-style', 'solid');
    await expect(arrow).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, 0)');
    await page.keyboard.press('Tab');
    await expect(tiles.nth(1)).toBeFocused();
    for (const tile of await tiles.all()) await tile.scrollIntoViewIfNeeded();
    await expect.poll(() => section.locator('img').evaluateAll(images => images.every(image => (image as HTMLImageElement).complete && (image as HTMLImageElement).naturalWidth > 0))).toBe(true);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
    await section.screenshot({ path: testInfo.outputPath(`services-${width}.png`), style: '.site-header, .skip-link, nextjs-portal { visibility: hidden !important; }' });
    const destination = await tiles.first().getAttribute('href');
    await tiles.first().focus();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(new URL(destination!, page.url()).href);
  });

  test(`phase cards retain previews and testimonial expansion at ${width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/');
    await expect(page.locator('.contact-form button[type="submit"]')).toBeEnabled();
    const row = page.locator('.process-accordion');
    const cards = row.locator('.phase-card-wrap');
    await row.scrollIntoViewIfNeeded();
    await expect(row).toHaveCSS('opacity', '1');
    await expect(cards).toHaveCount(4);
    for (const card of await cards.all()) {
      await expect(card.locator('h3')).toBeVisible();
      await expect(card.locator('.phase-content p')).toBeVisible();
    }
    await row.locator('.phase-content').evaluateAll(elements => elements.forEach(el => el.setAttribute('data-mounted', 'original')));
    await cards.nth(2).hover();
    await expect(cards.nth(2).locator('button')).toHaveAttribute('aria-expanded', 'true');
    await expect(cards.nth(2).locator('.phase-card')).toHaveCSS('background-color', 'rgb(36, 69, 120)');
    await expect(cards.first().locator('.phase-card')).toHaveCSS('background-color', 'rgb(255, 255, 250)');
    await expect(cards.nth(2).locator('h3')).toHaveCSS('font-size', '20px');
    if (width > 810) {
      await expect(cards.nth(2)).toHaveCSS('flex-grow', '2');
      await expect(cards.first()).toHaveCSS('flex-grow', '1');
      await expect.poll(async () => (await cards.nth(2).boundingBox())!.width / (await cards.first().boundingBox())!.width).toBeCloseTo(2, 1);
    }
    await page.mouse.move(0, 0);
    await expect(cards.nth(2).locator('button')).toHaveAttribute('aria-expanded', 'true');
    await cards.first().locator('button').focus();
    await page.keyboard.press('Tab');
    await expect(cards.nth(1).locator('button')).toBeFocused();
    await expect(cards.nth(1).locator('button')).toHaveAttribute('aria-expanded', 'true');
    await cards.last().locator('button').click();
    await expect(cards.last().locator('button')).toHaveAttribute('aria-expanded', 'true');
    await expect(row.locator('.phase-content[data-mounted="original"]')).toHaveCount(4);
    await expect(row.locator('[aria-expanded="true"]')).toHaveCount(1);
    expect(await row.locator('.phase-content h3').evaluateAll(headings => headings.every(el => el.scrollWidth <= el.clientWidth + 1))).toBe(true);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
    await page.waitForTimeout(400);
    await row.screenshot({ path: testInfo.outputPath(`phases-${width}.png`), style: '.site-header, nextjs-portal { visibility: hidden !important; }' });
  });
}

for (const width of [1440, 390]) {
  test(`service tiles and phases respect reduced motion at ${width}px`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await expect(page.locator('.contact-form button[type="submit"]')).toBeEnabled();
    const tile = page.locator('.service-tile').first();
    await tile.hover();
    await expect(tile.locator('img')).toHaveCSS('transform', 'none');
    expect(await tile.locator('.service-arrow-in').evaluate(el => parseFloat(getComputedStyle(el).transitionDuration))).toBeLessThan(.01);
    await page.locator('.phase-trigger').last().click();
    await expect(page.locator('.phase-card-wrap').last()).toHaveCSS('transform', 'none');
    await expect(page.locator('.phase-content')).toHaveCount(4);
  });
}

test('desktop dropdowns work with keyboard and retain parent links', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Subscribe to newsletter', exact: true })).toBeEnabled();
  const nav = page.getByRole('navigation', { name: 'Main navigation' });
  const button = nav.getByRole('button', { name: 'Toggle Services links' });
  await button.focus();
  await page.keyboard.press('Enter');
  await expect(button).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Tab');
  await expect(nav.getByRole('link', { name: 'Financial Planning', exact: true })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(button).toBeFocused();
  await expect(button).toHaveAttribute('aria-expanded', 'false');
  await expect(nav.getByRole('link', { name: 'Services', exact: true })).toHaveAttribute('href', '/services');
});
test('newsletter dates and source links are honest', async ({ page }) => {
  await page.goto('/newsletters');
  await expect(page.getByRole('link', { name: 'Read original edition' })).toHaveCount(newsletters.filter(item => item.url).length);
  await expect(page.getByText('The original link is malformed.', { exact: false })).toHaveCount(2);
});
test('blog filtering and legacy routes', async ({ page }) => {
  await page.goto('/blog?category=insurance');
  await expect(page.getByRole('heading', { name: 'More articles to come.' })).toBeVisible();
  await page.goto('/blog?category=unknown');
  await expect(page.locator('.inner-insight-card')).toHaveCount(articles.length);
  for (const [from, to] of [['/about', '/about-us'], ['/contact?service=health-insurance', '/contact-us?service=health-insurance'], ['/insights', '/blog'], ['/awards', '/about-us/awards']]) {
    await page.goto(from);
    expect(new URL(page.url()).pathname + new URL(page.url()).search).toBe(to);
  }
});
test('mobile Escape closes the entire navigation from an expanded submenu', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Subscribe to newsletter', exact: true })).toBeEnabled();
  await page.getByRole('button', { name: 'Open navigation' }).click();
  const nav = page.getByRole('navigation', { name: 'Mobile navigation' });
  await nav.getByRole('button', { name: 'Toggle Services links' }).click();
  await nav.getByRole('link', { name: 'Financial Planning', exact: true }).focus();
  await page.keyboard.press('Escape');
  await expect(nav).not.toBeVisible();
  await expect(page.getByRole('button', { name: 'Open navigation' })).toBeFocused();
});
test('footer and contact page include both verified emails and social links', async ({ page }) => {
  await page.goto('/contact-us');
  for (const email of ['info@ghanchiinvest.com', 'chandrakant@ghanchiinvest.com']) {
    await expect(page.locator(`footer a[href="mailto:${email}"]`)).toHaveCount(1);
    await expect(page.locator(`main a[href="mailto:${email}"]`)).toHaveCount(1);
  }
  const socials = page.locator('footer .social-links');
  for (const name of ['Facebook', 'Instagram', 'LinkedIn', 'YouTube']) {
    await expect(socials.getByRole('link', { name, exact: true })).toHaveAttribute('target', '_blank');
  }
});
test('service and legal pages expose canonical URLs', async ({ page }) => {
  for (const route of ['/services/financial-planning', '/privacy-policy']) {
    await page.goto(route);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', new RegExp(`${route}$`));
  }
});
test('approved section removals retain the homepage content sequence', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.comparison-scroll, .comparison-cards, .featured-case')).toHaveCount(0);
  await expect(page.locator('.home-intro > #services')).toHaveCount(1);
  await expect(page.locator('.home-intro + .testimonials-section')).toHaveCount(1);
  await expect(page.locator('.testimonials-section + .team-section')).toHaveCount(1);
  await expect(page.locator('.team-section + #process')).toHaveCount(1);
  await expect(page.locator('#process + .faq-section')).toHaveCount(1);
});
test('unknown content returns 404', async ({ page }) => {
  for (const route of ['/cases/not-a-case', '/services/not-a-service', '/blog/not-an-article', '/about-us/not-a-section', '/not-a-page']) expect((await page.goto(route))?.status()).toBe(404);
});
