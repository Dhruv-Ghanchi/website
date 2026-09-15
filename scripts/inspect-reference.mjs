import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
if (process.argv.includes('--motion')) {
  await inspectMotion();
  process.exit(0);
}
const out = new URL('../reference/', import.meta.url);
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
await page.goto('https://kora.framer.media/', { waitUntil: 'networkidle' });
await page.waitForTimeout(2500);
await page.screenshot({ path: new URL('hero.png', out).pathname.replace(/^\/(\w:)/, '$1') });
const data = await page.evaluate(() => {
  const info = el => { const s = getComputedStyle(el), r = el.getBoundingClientRect(); return { tag: el.tagName, text: el.innerText?.slice(0, 250), name: el.getAttribute('data-framer-name'), x:r.x,y:r.y,width:r.width,height:r.height,font:s.fontFamily,fontSize:s.fontSize,weight:s.fontWeight,lineHeight:s.lineHeight,letterSpacing:s.letterSpacing,color:s.color,background:s.background,borderRadius:s.borderRadius,position:s.position }; };
  return { title: document.title, headings: [...document.querySelectorAll('h1,h2,h3')].map(info), links:[...document.querySelectorAll('a')].map(el=>({text:el.innerText,href:el.href})), images:[...document.querySelectorAll('img')].map(el=>({alt:el.alt,src:el.currentSrc || el.src,...info(el)})), videos:[...document.querySelectorAll('video')].map(el=>({src:el.currentSrc,poster:el.poster,autoplay:el.autoplay})), fonts:[...document.fonts].map(f=>({family:f.family,weight:f.weight})), sections:[...document.querySelectorAll('main > *, header, nav, footer')].map(info) };
});
await writeFile(new URL('home.json',out), JSON.stringify(data,null,2));
await writeFile(new URL('home.html',out), await page.content());
for(let y=700;y<await page.evaluate(()=>document.body.scrollHeight);y+=750){await page.evaluate(y=>scrollTo(0,y),y);await page.waitForTimeout(350);}
await page.waitForTimeout(1500);
await page.screenshot({path:new URL('home-full.png',out).pathname.replace(/^\/(\w:)/,'$1'),fullPage:true});
for(const [name,text] of [['services','Services.'],['process','Most consultancies'],['team','Meet the team'],['testimonials','Testimonials'],['pricing','Pricing for your'],['faq','FAQ']]){
 const el=page.getByRole('heading').filter({hasText:text}).first();
 if(await el.count()){await el.scrollIntoViewIfNeeded();await page.waitForTimeout(1300);await page.screenshot({path:new URL(`${name}.png`,out).pathname.replace(/^\/(\w:)/,'$1')});}
}
await page.setViewportSize({width:390,height:844});
await page.goto('https://kora.framer.media/',{waitUntil:'networkidle'});
await page.waitForTimeout(1800);
await page.screenshot({path:new URL('mobile-hero.png',out).pathname.replace(/^\/(\w:)/,'$1')});
console.log(JSON.stringify({title:data.title, videos:data.videos,headings:data.headings.slice(0,6),links:[...new Set(data.links.map(l=>l.href))]},null,2));
await browser.close();

async function inspectMotion() {
  const local = process.argv.includes('--local');
  const source = local ? 'local' : 'live';
  const output = `reference/motion/${source}`;
  await mkdir(output, { recursive: true });
  const browser = await chromium.launch();
  const report = [];
  try {
    for (const width of [1440, 810, 390]) {
      const page = await browser.newPage({ viewport: { width, height: width === 390 ? 844 : 1000 } });
      await page.goto(local ? 'http://localhost:3000/' : 'https://kora.framer.media/', { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(1800);
      const snapshot = async (label, y) => {
        await page.evaluate(y => window.scrollTo({ top: y, behavior: 'instant' }), y);
        await page.waitForTimeout(1400);
        const state = await page.evaluate(({ local, label, width }) => {
          const hero = document.querySelector(local ? '.hero-sticky' : '[data-framer-name="Hero"]');
          const footer = document.querySelector(local ? '.site-footer' : '[data-framer-name="Footer"]');
          const roots = label.startsWith('footer') ? [footer?.parentElement, footer] : [hero?.parentElement, hero];
          const nodes = new Set();
          const walk = (el, depth) => {
            if (!el || depth < 0) return;
            nodes.add(el);
            [...el.children].forEach(child => walk(child, depth - 1));
          };
          roots.forEach(root => walk(root, 3));
          return { width, label, scrollY, pageHeight: document.documentElement.scrollHeight, elements: [...nodes].map(el => {
            const s = getComputedStyle(el), r = el.getBoundingClientRect();
            return { name: el.getAttribute('data-framer-name'), tag: el.tagName, class: el.className, text: el.innerText?.slice(0, 90), x: r.x, y: r.y, width: r.width, height: r.height, position: s.position, transform: s.transform, opacity: s.opacity, filter: s.filter, background: s.backgroundColor, radius: s.borderRadius, font: s.fontFamily, size: s.fontSize, weight: s.fontWeight, variation: s.fontVariationSettings, spacing: s.letterSpacing, padding: s.padding, overflow: s.overflow };
          }) };
        }, { local, label, width });
        report.push(state);
        await page.screenshot({ path: `${output}/${label}-${width}.png` });
      };
      for (const y of width === 1440 ? [0, 250, 500, 1000, 1500, 2000, 2500, 3000, 4000, 5000, 5600] : [0, 500, 1000, 1500, 2200]) await snapshot(`hero-${y}`, y);
      const footer = page.locator(local ? '.site-footer' : '[data-framer-name="Footer"]').first();
      const top = await footer.evaluate(el => el.getBoundingClientRect().top + scrollY);
      for (const offset of [-1000, -500, 0, 500, 1100]) await snapshot(`footer-${offset}`, top + offset);
      await page.close();
    }
    await writeFile(`${output}/states.json`, JSON.stringify(report, null, 2));
    console.log(`Captured ${report.length} motion states in ${output}`);
  } finally {
    await browser.close();
  }
}
