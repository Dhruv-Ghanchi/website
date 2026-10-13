// Runtime checks for second audit: reduced-motion regressions, contrast,
// tile layout symmetry, marquee, forms.
import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const out = path.dirname(fileURLToPath(import.meta.url));
mkdirSync(path.join(out, 'screenshots'), { recursive: true });
const origin = 'http://localhost:3100';
const browser = await chromium.launch();
const results = {};

// ---------- 1. Reduced motion: contact intro visibility (previous P2 bug) ----------
for (const vp of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
  const ctx = await browser.newContext({ viewport: vp, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto(`${origin}/contact-us`);
  await page.waitForTimeout(2500);
  const intro = await page.evaluate(() => {
    const copy = document.querySelector('.contact-intro-copy');
    const details = document.querySelector('.contact-intro-details');
    const o = el => el ? parseFloat(getComputedStyle(el).opacity) : null;
    return { copyOpacity: o(copy), detailsOpacity: o(details), h1: copy?.querySelector('h1')?.textContent };
  });
  // check every autoplay video's actual playing state on homepage under reduced motion
  await page.goto(origin);
  await page.waitForTimeout(3000);
  const videos = await page.evaluate(async () => {
    const scrollH = document.documentElement.scrollHeight;
    for (let y = 0; y < scrollH; y += Math.round(innerHeight * .8)) { scrollTo({ top: y }); await new Promise(r => setTimeout(r, 250)); }
    scrollTo({ top: 0 });
    await new Promise(r => setTimeout(r, 500));
    return [...document.querySelectorAll('video')].map(v => ({ cls: v.className || '(hero/process)', autoplayAttr: v.autoplay, paused: v.paused, src: (v.currentSrc || v.src).split('/').pop() }));
  });
  const marquee = await page.evaluate(() => {
    const t = document.querySelector('.recognition-track');
    return t ? { animationName: getComputedStyle(t).animationName, animating: getComputedStyle(t).animationPlayState } : null;
  });
  const contactVideos = await page.evaluate(() => [...document.querySelectorAll('.contact-bg-video')].map(v => ({ paused: v.paused })));
  results[`reduced-${vp.width}`] = { contactIntro: intro, videos, marquee, contactVideos };
  console.log(`reduced ${vp.width}: contact copy opacity=${intro.copyOpacity} details=${intro.detailsOpacity}`);
  console.log('  videos:', JSON.stringify(videos));
  console.log('  marquee:', JSON.stringify(marquee), 'contactBg:', JSON.stringify(contactVideos));
  await ctx.close();
}

// ---------- 2. Normal motion: full video audit ----------
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(origin);
  await page.waitForTimeout(2500);
  const heroVideo = await page.evaluate(() => { const v = document.querySelector('.hero-media video, .hero-scroll video'); return v ? { paused: v.paused, autoplay: v.autoplay } : null; });
  // scroll through page to trigger any in-view autoplay
  await page.evaluate(async () => {
    const h = document.documentElement.scrollHeight;
    for (let y = 0; y < h; y += 700) { scrollTo({ top: y }); await new Promise(r => setTimeout(r, 200)); }
  });
  await page.waitForTimeout(1200);
  const videos = await page.evaluate(() => [...document.querySelectorAll('video')].map(v => ({ cls: v.className || '(unnamed)', autoplay: v.autoplay, paused: v.paused, controls: v.controls, src: (v.currentSrc || v.src).split('/').pop() })));
  results.normalMotion = { heroVideo, videosAfterScroll: videos };
  console.log('normal-motion videos:', JSON.stringify(videos));
  await page.close();
}

// ---------- 3. Contrast: computed colors of key text/button surfaces ----------
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(origin);
  await page.waitForTimeout(1800);
  const contrast = await page.evaluate(() => {
    const probe = sel => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const cs = getComputedStyle(el);
      return { sel, color: cs.color, bg: cs.backgroundColor, fontSize: cs.fontSize, text: (el.innerText || '').slice(0, 60) };
    };
    return [
      probe('.hero-actions .button'),
      probe('.button-mint'),
      probe('.contact-form button[type="submit"]'),
      probe('.service-tile-title'),
      probe('.trust-badge'),
      probe('.nav-call'),
      probe('.team-pill-name small'),
      probe('.footer-disclosure'),
      probe('.recognition-intro p'),
    ];
  });
  results.contrast = contrast;
  console.log('contrast probes:', JSON.stringify(contrast, null, 1));
  await page.close();
}

// ---------- 4. Tile grid x-positions (orphan tile check) ----------
for (const w of [1440, 810, 390]) {
  const page = await browser.newPage({ viewport: { width: w, height: 900 } });
  await page.goto(origin);
  await page.waitForTimeout(1500);
  const tiles = await page.evaluate(() => [...document.querySelectorAll('.service-tile')].map(el => { const r = el.getBoundingClientRect(); return { x: Math.round(r.x), y: Math.round(r.y + scrollY), w: Math.round(r.width) }; }));
  results[`tiles-${w}`] = tiles;
  console.log(`tiles ${w}:`, JSON.stringify(tiles));
  await page.close();
}

// ---------- 5. Forms: newsletter + contact API behaviour ----------
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(`${origin}/contact-us`);
  await page.waitForTimeout(2000);
  const contactIntroVisible = await page.evaluate(() => {
    const el = document.querySelector('.contact-intro-copy');
    return el ? parseFloat(getComputedStyle(el).opacity) : null;
  });
  // submit empty form to confirm validation
  await page.locator('.contact-form button[type="submit"]').click();
  await page.waitForTimeout(400);
  const validity = await page.evaluate(() => {
    const form = document.querySelector('.contact-form');
    const invalid = [...form.querySelectorAll('input,textarea')].filter(i => !i.checkValidity()).map(i => i.name);
    return { invalid, msg: document.querySelector('.contact-form-message')?.textContent };
  });
  // POST to api/contact without webhook config to check 503
  const apiNoConsent = await page.evaluate(async () => {
    const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: 'Audit Test', email: 'audit@example.com', phone: '9876543210', service: 'financial-planning', message: 'This is an audit test message.', consent: 'on' }) });
    return { status: res.status, body: await res.text() };
  });
  results.forms = { contactIntroVisible, validity, apiNoConsent };
  console.log('contact intro opacity (normal):', contactIntroVisible, '| invalid fields:', JSON.stringify(validity), '| api:', JSON.stringify(apiNoConsent));
  await page.close();
}

// ---------- 6. Strapi content snapshot ----------
{
  const res = await fetch('http://localhost:1337/api/gallery-items?populate=*&pagination[pageSize]=100').then(r => r.json()).catch(e => ({ error: String(e) }));
  const items = res.data || res;
  results.galleryItems = Array.isArray(items) ? items.map(i => ({ title: i.title, category: i.category, showOnHomepage: i.showOnHomepage, hasImage: !!i.image })) : items;
  const svc = await fetch('http://localhost:1337/api/services?pagination[pageSize]=100').then(r => r.json()).catch(e => ({ error: String(e) }));
  results.serviceCount = Array.isArray(svc.data || svc) ? (svc.data || svc).length : svc;
  const tm = await fetch('http://localhost:1337/api/team-members?pagination[pageSize]=100').then(r => r.json()).catch(e => ({}));
  results.teamMembers = (tm.data || []).map(t => ({ name: t.name, role: t.role }));
  console.log('gallery items:', Array.isArray(results.galleryItems) ? results.galleryItems.length : results.galleryItems, '| services:', results.serviceCount, '| team:', JSON.stringify(results.teamMembers));
}

writeFileSync(path.join(out, 'runtime-checks.json'), JSON.stringify(results, null, 2));
await browser.close();
console.log('Done -> runtime-checks.json');
