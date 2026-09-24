import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

const OUT = 'reference/full-verify/shots-hover';
await mkdir(OUT, { recursive: true });
const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
const page = await context.newPage();

async function shotPair(label, selector, { padding = 20 } = {}) {
  const loc = page.locator(selector).first();
  if (!(await loc.count().catch(() => 0))) { console.log('MISSING', label); return; }
  await loc.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  const box = await loc.boundingBox();
  if (!box) { console.log('NO BOX', label); return; }
  const clip = { x: Math.max(0, box.x - padding), y: Math.max(0, box.y - padding), width: box.width + padding * 2, height: box.height + padding * 2 };
  await page.screenshot({ path: `${OUT}/${label}-before.png`, clip });
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${OUT}/${label}-after.png`, clip });
  await page.mouse.move(5, 5);
  console.log('OK', label);
}

async function run(url, prefix, jobs) {
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);
  for (const [label, selector, opts] of jobs) {
    await shotPair(`${prefix}-${label}`, selector, opts);
  }
}

await run('https://kora.framer.media/', 'kora', [
  ['header-cta', 'a:has-text("Book a call")'],
  ['hero-btn', 'a:has-text("Our Services")'],
  ['service-cta', 'a:has-text("Get Started") >> nth=0'],
]);
// footer needs scroll; do separately with explicit scroll to bottom
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await page.waitForTimeout(1000);
await shotPair('kora-footer-social', 'a[aria-label="LinkedIn"]');
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await page.waitForTimeout(500);

await run('http://localhost:3100/', 'ghanchi', [
  ['header-cta', '.header-call a'],
  ['hero-btn', '.hero-actions a >> nth=0'],
  ['service-cta', '.service-cta >> nth=0'],
]);
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await page.waitForTimeout(1000);
await shotPair('ghanchi-footer-social', 'a[aria-label="LinkedIn"]');

console.log('Done');
await browser.close();
