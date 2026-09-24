import { chromium } from '@playwright/test';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [];
page.on('pageerror', e => errors.push(String(e)));
page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });

const routes = ['/', '/about-us', '/about-us/awards', '/about-us/certificates', '/about-us/our-clients', '/about-us/testimonials', '/services', '/services/financial-planning', '/services/life-insurance', '/online-services', '/blog', '/blog/single-woman-retiring-solo-is-a-dream-retirement-life-but-with-proper-planning', '/contact-us', '/newsletters', '/privacy-policy', '/terms-of-service', '/disclaimer'];
for (const route of routes) {
  errors.length = 0;
  let status;
  try {
    const resp = await page.goto(`http://localhost:3000${route}`, { waitUntil: 'networkidle', timeout: 20000 });
    status = resp?.status();
    await page.waitForTimeout(500);
  } catch (e) {
    console.log(route, 'NAV ERROR', String(e).slice(0, 200));
    continue;
  }
  const h1 = await page.locator('main h1').count();
  console.log(route, 'status=' + status, 'h1=' + h1, errors.length ? 'ERRORS: ' + errors.slice(0, 2).join(' | ') : 'OK');
}
await browser.close();
