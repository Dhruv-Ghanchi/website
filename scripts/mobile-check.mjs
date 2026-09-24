import { chromium } from '@playwright/test';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 375, height: 667 } }); // iPhone SE
const dir = 'C:/Users/Ghanchi/AppData/Local/Temp/claude/c--Users-Ghanchi-Desktop-trial/ea432c13-c7a5-4198-baf3-837347e926e6/scratchpad';

for (const path of ['/about-us', '/blog/single-woman-retiring-solo-is-a-dream-retirement-life-but-with-proper-planning', '/']) {
  await page.goto(`http://localhost:3000${path}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
  console.log(path, 'scrollWidth:', scrollWidth, 'clientWidth:', clientWidth, scrollWidth > clientWidth ? '*** HORIZONTAL OVERFLOW ***' : 'OK');
}

await page.goto('http://localhost:3000/about-us', { waitUntil: 'networkidle' });
await page.locator('.inner-founder').scrollIntoViewIfNeeded();
await page.waitForTimeout(400);
const box = await page.locator('.inner-founder-photo').boundingBox();
console.log('inner-founder-photo box at 375px viewport:', box);
await page.screenshot({ path: `${dir}/mobile-founder.png` });

await browser.close();
