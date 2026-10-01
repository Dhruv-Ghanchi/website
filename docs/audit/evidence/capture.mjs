import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const out = path.dirname(fileURLToPath(import.meta.url));
mkdirSync(path.join(out, 'screenshots'), { recursive: true });
const browser = await chromium.launch();
const origin = 'http://localhost:3100';
const selectors = ['.site-header', '.hero-scroll', '.hero-statement', '.hero-scroll-space', '.comparison-scroll', '.services-section', '.process-section', '.team-section', '.testimonials-section', '.featured-case', '.faq-section', '.home-insights', '.contact-section', '.site-footer'];
const results = { capturedAt: new Date().toISOString(), origin, homepage: [], routes: [] };
const queue = new Set(['/', '/about-us/awards', '/about-us/certificates', '/about-us/our-clients', '/about-us/testimonials']);
const safePath = s => s.replace(/[^a-z0-9-]/gi, '_') || 'home';
async function ready(page) {
  await page.locator('.newsletter-form button').waitFor();
  await page.waitForFunction(() => !document.querySelector('.newsletter-form button')?.disabled);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1600);
}
async function walk(page, screenshotPrefix) {
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  const step = await page.evaluate(() => Math.round(innerHeight * .8));
  for (let y = 0, n = 0; y < height; y += step, n++) {
    await page.evaluate(y => scrollTo({ top: y, behavior: 'instant' }), y);
    await page.waitForTimeout(180);
    if (screenshotPrefix) {
      await page.waitForTimeout(550);
      await page.screenshot({ path: path.join(out, 'screenshots', `${screenshotPrefix}-${String(n).padStart(2, '0')}.png`) });
    }
  }
}
for (const viewport of [{width:1440,height:900},{width:1200,height:900},{width:810,height:1080},{width:390,height:844}]) {
  const page = await browser.newPage({ viewport });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  const response = await page.goto(origin);
  await ready(page);
  await page.mouse.move(viewport.width - 5, viewport.height - 5);
  const geometry = await page.evaluate(selectors => {
    const rect = el => { const r = el.getBoundingClientRect(); return { top: Math.round(r.top + scrollY), height: Math.round(r.height), width: Math.round(r.width), text: el.innerText, headings: [...el.querySelectorAll('h1,h2,h3')].map(h => h.textContent), links: [...el.querySelectorAll('a')].map(a => ({text:a.innerText,href:a.getAttribute('href')})) }; };
    return { height: document.documentElement.scrollHeight, scrollRange: document.documentElement.scrollHeight - innerHeight, scrollWidth: document.documentElement.scrollWidth, sections: selectors.map(selector => ({ selector, ...document.querySelector(selector) ? rect(document.querySelector(selector)) : {missing:true} })), details: ['.trust-badge','.hero-case','.logo-ticker','.revenue-chart','.service-list','.service-card','.process-video','.recognition-card','.testimonial-feature','.testimonial-list','.stats-grid','.founder-callout','.contact-form','.contact-section-stats'].flatMap(selector => [...document.querySelectorAll(selector)].map(el => ({selector,...rect(el)}))), aboveFold: [...document.querySelectorAll('h1,h2,a,button,.trust-badge')].filter(el => {const r=el.getBoundingClientRect();return r.top>=0 && r.top<innerHeight && r.width>0 && r.height>0;}).map(el=>({tag:el.tagName,text:el.innerText,top:Math.round(el.getBoundingClientRect().top)})) };
  }, selectors);
  const prefix = viewport.width === 1440 || viewport.width === 390 ? `home-${viewport.width}` : null;
  await walk(page, prefix);
  await page.screenshot({ path:path.join(out,'screenshots',`home-${viewport.width}-full.png`),fullPage:true });
  await page.evaluate(() => scrollTo({top:0,behavior:'instant'}));
  await page.waitForTimeout(400);
  const media = await page.locator('img').evaluateAll(async images => Promise.all(images.map(async img => { try {await img.decode();} catch {} return {src:img.src,alt:img.alt,loaded:img.naturalWidth>0,naturalWidth:img.naturalWidth}; })));
  results.homepage.push({viewport,status:response.status(),errors,geometry,media});
  writeFileSync(path.join(out,'measurements.json'), JSON.stringify(results,null,2));
  await page.close();
}
const page = await browser.newPage({viewport:{width:1440,height:900}});
const routeErrors=[];
page.on('pageerror',e=>routeErrors.push(e.message));
for (const route of queue) {
  routeErrors.length=0;
  const response=await page.goto(`${origin}${route}`);
  await ready(page);
  const links=await page.locator('a[href]').evaluateAll(els=>els.map(el=>el.getAttribute('href')));
  for (const href of links) {
    if (href?.startsWith('/') && !href.startsWith('//') && !href.startsWith('/api/') && !href.startsWith('/assets/')) queue.add(href.split(/[?#]/)[0] || '/');
  }
  await walk(page);
  const data=await page.evaluate(()=>({title:document.title,h1:[...document.querySelectorAll('main h1')].map(e=>e.innerText),height:document.documentElement.scrollHeight,width:document.documentElement.scrollWidth,text:document.body.innerText,canonical:document.querySelector('link[rel=canonical]')?.href,robots:document.querySelector('meta[name=robots]')?.content,headings:[...document.querySelectorAll('main h1,main h2,main h3')].map(e=>e.innerText),images:[...document.images].filter(i=>!i.naturalWidth).map(i=>i.src)}));
  if(route!=='/') await page.screenshot({path:path.join(out,'screenshots',`route-${safePath(route)}-desktop.png`),fullPage:true});
  await page.setViewportSize({width:390,height:844});
  await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
  await page.waitForTimeout(300);
  await walk(page);
  const mobile=await page.evaluate(()=>({height:document.documentElement.scrollHeight,width:document.documentElement.scrollWidth}));
  if(route!=='/') await page.screenshot({path:path.join(out,'screenshots',`route-${safePath(route)}-mobile.png`),fullPage:true});
  results.routes.push({route,status:response.status(),finalUrl:page.url(),...data,mobile,errors:[...routeErrors]});
  writeFileSync(path.join(out,'measurements.json'),JSON.stringify(results,null,2));
  console.log(JSON.stringify({route,status:response.status(),height:data.height,mobileHeight:mobile.height,overflow:data.width>1440||mobile.width>390,errors:routeErrors.length}));
  await page.setViewportSize({width:1440,height:900});
  if(queue.size>100) throw new Error('Unexpected route count');
}
await browser.close();
console.log(`Captured ${results.homepage.length} homepage sizes and ${results.routes.length} route visits.`);
