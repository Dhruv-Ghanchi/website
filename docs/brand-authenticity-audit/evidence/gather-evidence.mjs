// One-off evidence-gathering script for the brand-authenticity audit.
// Captures full-page + section screenshots and extracted text for:
//   - live Kora (https://kora.framer.media/)
//   - local Ghanchi dev build (http://localhost:3100/)
//   - the live production Ghanchi site (both hostname spellings, best-effort)
// Not part of the app; run once, evidence is committed to evidence/, then this
// script can be deleted per the project's "no throwaway scripts left behind" norm.
import { chromium } from 'playwright-core';
import { writeFileSync, mkdirSync } from 'fs';

const OUT = 'docs/brand-authenticity-audit/evidence';

async function captureFolds(page, dir, prefix, maxFolds = 10) {
  const height = await page.evaluate(() => document.body.scrollHeight);
  const viewport = page.viewportSize().height;
  const folds = Math.min(maxFolds, Math.ceil(height / viewport));
  for (let i = 0; i < folds; i++) {
    await page.evaluate(y => window.scrollTo(0, y), i * viewport);
    await page.waitForTimeout(350);
    await page.screenshot({ path: `${dir}/${prefix}-fold${i}.png` });
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(200);
}

async function extractText(page, selector) {
  return page.$$eval(selector, els => els.map(el => el.innerText?.trim()).filter(Boolean));
}

async function main() {
  const browser = await chromium.launch();
  const results = {};

  // ---------- Kora (live reference) ----------
  {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto('https://kora.framer.media/', { waitUntil: 'networkidle', timeout: 45000 });
    await page.waitForTimeout(1500);
    mkdirSync(`${OUT}/screenshots/kora`, { recursive: true });
    await page.screenshot({ path: `${OUT}/screenshots/kora/home-full.png`, fullPage: true });
    await captureFolds(page, `${OUT}/screenshots/kora`, 'home', 9);
    results.kora = {
      url: page.url(),
      title: await page.title(),
      bodyText: (await page.evaluate(() => document.body.innerText)).slice(0, 20000),
    };
    // Try inner pages too, for section-language comparison
    for (const path of ['/about', '/cases/sitemark', '/insights']) {
      try {
        await page.goto(`https://kora.framer.media${path}`, { waitUntil: 'networkidle', timeout: 30000 });
        await page.waitForTimeout(1000);
        const shot = path.replace(/\//g, '_') || 'root';
        await page.screenshot({ path: `${OUT}/screenshots/kora/inner${shot}.png`, fullPage: true });
        results.kora[`page${shot}`] = (await page.evaluate(() => document.body.innerText)).slice(0, 8000);
      } catch (e) { results.kora[`page_${path}_error`] = String(e); }
    }
    await page.close();
  }

  // ---------- Ghanchi (local dev, current implementation) ----------
  {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto('http://localhost:3100/', { waitUntil: 'networkidle', timeout: 45000 });
    await page.waitForTimeout(1500);
    mkdirSync(`${OUT}/screenshots/ghanchi`, { recursive: true });
    await page.screenshot({ path: `${OUT}/screenshots/ghanchi/home-full.png`, fullPage: true });
    await captureFolds(page, `${OUT}/screenshots/ghanchi`, 'home', 12);
    results.ghanchi = {
      url: page.url(),
      title: await page.title(),
      heroH1: await page.$eval('.hero-copy h1', el => el.innerText).catch(() => null),
      heroSub: await page.$eval('.hero-copy p', el => el.innerText).catch(() => null),
      trustBadge: await page.$eval('.trust-badge', el => el.innerText).catch(() => null),
      servicesIntro: await page.$eval('.services-intro', el => el.innerText).catch(() => null),
      statement: await page.$eval('.hero-statement h2', el => el.innerText).catch(() => null),
      comparisonBefore: await page.$eval('.before-card', el => el.innerText).catch(() => null),
      comparisonAfter: await page.$eval('.after-card', el => el.innerText).catch(() => null),
      teamHeading: await page.$eval('.team-section .section-title', el => el.innerText).catch(() => null),
      teamRows: await extractText(page, '.team-row'),
      hiringCard: await page.$eval('.hiring-card', el => el.innerText).catch(() => null),
      testimonialFeature: await page.$eval('.testimonial-feature', el => el.innerText).catch(() => null),
      founderCallout: await page.$eval('.founder-callout', el => el.innerText).catch(() => null),
      featuredCase: await page.$eval('.featured-case', el => el.innerText).catch(() => null),
      insightsIntro: await page.$eval('.insights-intro', el => el.innerText).catch(() => null),
      footerMessage: await page.$eval('.footer-message', el => el.innerText).catch(() => null),
      footerTop: await page.$eval('.footer-top', el => el.innerText).catch(() => null),
      bodyText: (await page.evaluate(() => document.body.innerText)).slice(0, 20000),
    };
    // inner pages for comparison
    for (const path of ['/about-us', '/services/life-insurance', '/about-us/awards', '/about-us/our-clients', '/about-us/testimonials', '/contact-us']) {
      try {
        await page.goto(`http://localhost:3100${path}`, { waitUntil: 'networkidle', timeout: 30000 });
        await page.waitForTimeout(800);
        const shot = path.replace(/\//g, '_');
        await page.screenshot({ path: `${OUT}/screenshots/ghanchi/inner${shot}.png`, fullPage: true });
        results.ghanchi[`page${shot}`] = (await page.evaluate(() => document.body.innerText)).slice(0, 6000);
      } catch (e) { results.ghanchi[`page_${path}_error`] = String(e); }
    }
    await page.close();
  }

  // ---------- Live production site (best-effort; may be bot-protected) ----------
  for (const host of ['https://ghanchiinvest.com/', 'https://www.ghanchiinvest.com/', 'https://www.ghanciinvest.com/']) {
    try {
      const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36' });
      await page.goto(host, { waitUntil: 'networkidle', timeout: 25000 });
      await page.waitForTimeout(1500);
      mkdirSync(`${OUT}/screenshots/live`, { recursive: true });
      const safe = host.replace(/[^a-z0-9]/gi, '_');
      await page.screenshot({ path: `${OUT}/screenshots/live/${safe}.png`, fullPage: true });
      results[`live_${host}`] = {
        title: await page.title(),
        bodyTextLength: (await page.evaluate(() => document.body.innerText)).length,
        bodyText: (await page.evaluate(() => document.body.innerText)).slice(0, 15000),
      };
      await page.close();
    } catch (e) {
      results[`live_${host}_error`] = String(e);
    }
  }

  writeFileSync(`${OUT}/evidence-data.json`, JSON.stringify(results, null, 2));
  await browser.close();
  console.log('Done. Wrote evidence-data.json and screenshots.');
}
main().catch(e => { console.error(e); process.exit(1); });
