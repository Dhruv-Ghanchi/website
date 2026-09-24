import { chromium } from '@playwright/test';
import { writeFile, mkdir } from 'node:fs/promises';

const LIVE = 'https://kora.framer.media/';
const LOCAL = 'http://localhost:3100/';
const OUT = 'reference/full-verify';
await mkdir(OUT, { recursive: true });

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
const page = await context.newPage();

async function styleOf(locator) {
  return locator.evaluate(el => {
    const s = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    return { cursor: s.cursor, background: s.backgroundColor, transform: s.transform, boxShadow: s.boxShadow, opacity: s.opacity, borderRadius: s.borderRadius, w: Math.round(r.width), h: Math.round(r.height) };
  }).catch(() => null);
}

async function probe(url, label, targets) {
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);
  const results = {};
  for (const t of targets) {
    const loc = page.locator(t.selector);
    const count = await loc.count().catch(() => 0);
    if (!count) { results[t.name] = { found: false }; continue; }
    const el = loc.first();
    try {
      await el.scrollIntoViewIfNeeded();
      await page.waitForTimeout(300);
      const before = await styleOf(el);
      const box = await el.boundingBox();
      if (box) await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.waitForTimeout(500);
      const after = await styleOf(el);
      results[t.name] = { found: true, before, after, changed: JSON.stringify(before) !== JSON.stringify(after) };
    } catch (e) {
      results[t.name] = { found: true, error: String(e).slice(0, 150) };
    }
  }
  await writeFile(`${OUT}/${label}.json`, JSON.stringify(results, null, 2));
  return results;
}

const targets = [
  { name: 'nav-case-studies', selector: 'nav a >> nth=0' },
  { name: 'header-cta', selector: '.header-call a, header a:has-text("Book"), header a:has-text("Get in touch")' },
  { name: 'hero-services-btn', selector: '.hero-actions a >> nth=0' },
  { name: 'hero-textlink', selector: '.hero-actions a >> nth=1, .text-link >> nth=0' },
  { name: 'hero-case-card', selector: '.hero-case' },
  { name: 'service-get-started-1', selector: '.service-cta, .service-wrap a:has-text("Get Started") >> nth=0' },
  { name: 'phase-trigger-1', selector: '.phase-trigger >> nth=0' },
  { name: 'testimonial-accordion-1', selector: '.testimonial-item button >> nth=0' },
  { name: 'footer-social-linkedin', selector: 'a[aria-label="LinkedIn"]' },
  { name: 'footer-nav-1', selector: '.footer-links nav a >> nth=0, footer nav a >> nth=0' },
  { name: 'footer-copy-email', selector: 'button[aria-label*="Copy" i]' },
];

console.log('Probing live...');
await probe(LIVE, 'compare-live', targets);
console.log('Probing local...');
await probe(LOCAL, 'compare-local', targets);
console.log('Done.');
await browser.close();
