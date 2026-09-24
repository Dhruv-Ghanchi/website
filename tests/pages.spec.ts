import { expect, test } from '@playwright/test';

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
async function fetchAll(path: string): Promise<{ id: number; slug?: string; title?: string; name?: string; url?: string | null }[]> {
  const res = await fetch(`${STRAPI_URL}/api/${path}`);
  const json = await res.json();
  return json.data;
}
const [articles, legalPagesData, services, teamMembersData, newsletters] = await Promise.all([
  fetchAll('articles?pagination[pageSize]=100'),
  fetchAll('legal-pages?pagination[pageSize]=100'),
  fetchAll('services?pagination[pageSize]=100'),
  fetchAll('team-members?pagination[pageSize]=100'),
  fetchAll('newsletters?pagination[pageSize]=200'),
]);
const legalPages = legalPagesData;
const teamMembers = teamMembersData;

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
    await expect(page.getByRole('dialog', { name: 'How we work' })).toBeVisible();
    await page.keyboard.press('Escape');
    for (const member of teamMembers) {
      const button = page.locator('.team-row button').filter({ hasText: member.name });
      await button.click();
      await expect(page.getByRole('dialog', { name: member.name })).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(button).toBeFocused();
    }
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
  await page.goto('/');
  await expect(page.locator('.hero-case')).toContainText('November 2021');
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
test('comparison uses the approved non-guaranteed planning language', async ({ page }) => {
  await page.goto('/');
  const comparison = page.locator('.comparison-cards');
  await expect(comparison).toContainText('Retirement approached without a clear plan.');
  await expect(comparison).toContainText('Protection considered for the family.');
  await expect(comparison).toContainText('A portfolio aligned with risk profile.');
});
test('unknown content returns 404', async ({ page }) => {
  for (const route of ['/cases/not-a-case', '/services/not-a-service', '/blog/not-an-article', '/about-us/not-a-section', '/not-a-page']) expect((await page.goto(route))?.status()).toBe(404);
});
