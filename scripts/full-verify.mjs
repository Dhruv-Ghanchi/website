import { chromium } from '@playwright/test';
import { writeFile, mkdir } from 'node:fs/promises';

const OUT = 'reference/full-verify';
await mkdir(OUT, { recursive: true });
await mkdir(`${OUT}/shots`, { recursive: true });

const BASE = 'http://localhost:3100';
const routes = [
  '/', '/about-us', '/about-us/awards', '/about-us/certificates', '/about-us/our-clients', '/about-us/testimonials',
  '/services', '/services/financial-planning', '/services/life-insurance',
  '/online-services', '/blog', '/blog/single-woman-retiring-solo-is-a-dream-retirement-life-but-with-proper-planning',
  '/contact-us', '/newsletters', '/privacy-policy', '/terms-of-service', '/disclaimer',
];
const widths = [1440, 810, 390];

const browser = await chromium.launch();
const report = {};

for (const route of routes) {
  report[route] = { byWidth: {} };
  for (const width of widths) {
    const context = await browser.newContext({ viewport: { width, height: width === 390 ? 900 : 1000 } });
    const page = await context.newPage();
    const consoleErrors = [];
    const pageErrors = [];
    const failedRequests = [];
    page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text().slice(0, 300)); });
    page.on('pageerror', err => pageErrors.push(String(err).slice(0, 300)));
    page.on('requestfailed', req => failedRequests.push(`${req.method()} ${req.url()} :: ${req.failure()?.errorText}`));
    page.on('response', res => { if (res.status() >= 400) failedRequests.push(`${res.status()} ${res.url()}`); });
    let status = null;
    try {
      const resp = await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle', timeout: 20000 });
      status = resp?.status();
      await page.waitForTimeout(900);
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
      await page.waitForTimeout(500);
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(300);
    } catch (e) {
      pageErrors.push('NAV_ERROR: ' + String(e).slice(0, 300));
    }
    const info = await page.evaluate(() => {
      const imgs = [...document.querySelectorAll('img')];
      const brokenImgs = imgs.filter(img => !img.complete || img.naturalWidth === 0).map(img => img.src);
      const missingAlt = imgs.filter(img => img.getAttribute('alt') === null).map(img => img.src);
      const h1s = [...document.querySelectorAll('h1')].map(h => h.textContent?.trim());
      return {
        title: document.title,
        h1Count: document.querySelectorAll('h1').length,
        h1s,
        imgCount: imgs.length,
        brokenImgs,
        missingAlt,
        bodyScrollWidth: document.body.scrollWidth,
        windowInnerWidth: window.innerWidth,
        hasHorizontalOverflow: document.body.scrollWidth > window.innerWidth + 2,
      };
    }).catch(() => null);
    const safeName = route.replaceAll('/', '_') || 'home';
    const shotPath = `${OUT}/shots/${safeName}_${width}.png`;
    try { await page.screenshot({ path: shotPath, fullPage: true, timeout: 15000 }); } catch {}
    report[route].byWidth[width] = { status, consoleErrors, pageErrors, failedRequests, ...info, shot: shotPath };
    console.log(`${route} @ ${width}: status=${status} consoleErr=${consoleErrors.length} pageErr=${pageErrors.length} failedReq=${failedRequests.length} overflow=${info?.hasHorizontalOverflow}`);
    await context.close();
  }
}

await writeFile(`${OUT}/report.json`, JSON.stringify(report, null, 2));
console.log('\nDone ->', `${OUT}/report.json`);
await browser.close();
