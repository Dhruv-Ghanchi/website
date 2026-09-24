import { chromium } from '@playwright/test';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
await page.goto('http://localhost:3100/', { waitUntil: 'networkidle' });
await page.waitForTimeout(1000);
for (const sel of ['#process .process-video', '.featured-case-image', '.team-section', '#services .service-card >> nth=0']) {
  const loc = page.locator(sel).first();
  if (!(await loc.count())) { console.log('missing', sel); continue; }
  await loc.scrollIntoViewIfNeeded();
  await page.waitForTimeout(700);
  const safe = sel.replace(/[^a-z0-9]/gi, '_');
  await loc.screenshot({ path: `reference/full-verify/shots-hover/section-${safe}.png` }).catch(e => console.log('shot fail', sel, String(e).slice(0,100)));
  console.log('ok', sel);
}
await browser.close();
