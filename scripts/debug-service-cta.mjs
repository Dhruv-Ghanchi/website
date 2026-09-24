import { chromium } from '@playwright/test';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
await page.goto('http://localhost:3100/', { waitUntil: 'networkidle' });
await page.waitForTimeout(1200);
const all = await page.locator('.service-cta').evaluateAll(els => els.map((el, i) => {
  const a = el.querySelector('a');
  return { i, wrapperClass: el.className, aClass: a?.className, bg: a ? getComputedStyle(a).backgroundColor : null, text: a?.textContent };
}));
console.log(JSON.stringify(all, null, 2));
await browser.close();
