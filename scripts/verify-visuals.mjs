import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';

await mkdir('reference/local', { recursive: true });
const browser = await chromium.launch();
const reports = [];
for (const width of [1440, 1200, 810, 390]) {
  const page = await browser.newPage({ viewport: { width, height: width === 390 ? 844 : 1000 } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('http://localhost:3100/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1400);
  await page.screenshot({ path: `reference/local/hero-${width}.png` });
  const sections = ['.comparison-scroll', '.services-section', '.service-card', '.process-section', '.team-section', '.testimonials-section', '.featured-case', '.faq-section', '.home-insights', '.contact-section', '.site-footer'];
  for (const selector of sections) {
    const element = page.locator(selector).first();
    await element.evaluate(el => window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 120, behavior: 'instant' }));
    await page.waitForTimeout(1200);
    await page.screenshot({ path: `reference/local/${selector.slice(1)}-${width}.png` });
  }
  const overflow = await page.evaluate(() => [...document.querySelectorAll('body *')].filter(el => {
    const rect = el.getBoundingClientRect();
    if (!rect.width || getComputedStyle(el).position === 'fixed') return false;
    let left = rect.left, right = rect.right;
    for (let parent = el.parentElement; parent && parent !== document.body; parent = parent.parentElement) {
      if (['hidden', 'clip', 'auto', 'scroll'].includes(getComputedStyle(parent).overflowX)) {
        const clip = parent.getBoundingClientRect();
        left = Math.max(left, clip.left);
        right = Math.min(right, clip.right);
      }
    }
    return right > left && (right > innerWidth + 2 || left < -2);
  }).map(el => ({ tag: el.tagName, class: el.className, width: el.getBoundingClientRect().width, left: el.getBoundingClientRect().left })).slice(0, 20));
  reports.push({ width, errors, overflow, documentWidth: await page.evaluate(() => document.documentElement.scrollWidth) });
  if (width === 1440) {
    await page.getByRole('button', { name: /Chandrakant B. Ghanchi Founder/ }).click();
    await page.waitForTimeout(700);
    await page.screenshot({ path: 'reference/local/team-dialog.png' });
    await page.keyboard.press('Escape');
  }
  await page.close();
}
await writeFile('reference/local/report.json', JSON.stringify(reports, null, 2));
console.log(JSON.stringify(reports, null, 2));
await browser.close();
