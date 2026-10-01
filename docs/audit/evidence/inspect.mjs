import { chromium } from '@playwright/test';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const out=path.dirname(fileURLToPath(import.meta.url));
const data=JSON.parse(readFileSync(path.join(out,'measurements.json'),'utf8'));
const browser=await chromium.launch();
const results={routes:[],interactions:{},redirects:[]};
const page=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'reduce'});
for(const {route} of data.routes){
 await page.goto('http://localhost:3100'+route);
 await page.waitForFunction(()=>!document.querySelector('.newsletter-form button')?.disabled);
 await page.evaluate(()=>document.fonts.ready);
 await page.waitForTimeout(400);
 const name=route.replace(/[^a-z0-9-]/gi,'_')||'home';
 await page.screenshot({path:path.join(out,'screenshots',`readable-${name}-top.png`)});
 await page.evaluate(()=>scrollTo({top:750,behavior:'instant'}));
 await page.waitForTimeout(400);
 await page.screenshot({path:path.join(out,'screenshots',`readable-${name}-mid.png`)});
 results.routes.push({route,overflow:await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),height:await page.evaluate(()=>document.documentElement.scrollHeight)});
}
await page.goto('http://localhost:3100');
await page.waitForFunction(()=>!document.querySelector('.newsletter-form button')?.disabled);
await page.locator('.stats-grid').scrollIntoViewIfNeeded();
await page.waitForTimeout(1900);
results.interactions.reducedMotionStats=await page.locator('.stats-grid').innerText();
results.interactions.processVideos=await page.locator('.process-video video').count();
await page.getByRole('button',{name:'Watch how we work'}).click();
if (results.interactions.processVideos) {
 await page.waitForTimeout(1000);
 results.interactions.processVideoState=await page.locator('.process-video video').evaluate(v=>({paused:v.paused,controls:v.controls,readyState:v.readyState,tracks:v.textTracks.length}));
} else {
 results.interactions.processDialog=await page.locator('dialog[open]').innerText();
 await page.keyboard.press('Escape');
}
results.interactions.reducedBackgroundVideos=await page.locator('video[autoplay]').evaluateAll(videos=>videos.map(v=>({class:v.className,paused:v.paused,loop:v.loop,muted:v.muted,controls:v.controls})));
results.interactions.colors=await page.locator('.button-mint,.after-card,.chart-bar-primary,.team-section,.contact-form').evaluateAll(es=>es.slice(0,15).map(e=>{const s=getComputedStyle(e);return {selector:e.className,color:s.color,background:s.backgroundColor,fontSize:s.fontSize,fontWeight:s.fontWeight};}));
await page.emulateMedia({reducedMotion:'no-preference'});
await page.reload();
await page.waitForTimeout(1800);
await page.locator('.stats-grid').scrollIntoViewIfNeeded();
await page.waitForTimeout(2200);
results.interactions.normalMotionStats=await page.locator('.stats-grid').innerText();
await page.setViewportSize({width:390,height:844});
await page.goto('http://localhost:3100');
await page.waitForFunction(()=>!document.querySelector('.newsletter-form button')?.disabled);
await page.getByRole('button',{name:'Open navigation'}).click();
await page.getByRole('navigation',{name:'Mobile navigation'}).getByRole('button',{name:'Toggle Services links'}).click();
results.interactions.mobileServiceLink=await page.getByRole('navigation',{name:'Mobile navigation'}).getByRole('link',{name:'Health Insurance',exact:true}).isVisible();
await page.screenshot({path:path.join(out,'screenshots','mobile-nav-open.png')});
await page.keyboard.press('Escape');
results.interactions.escapeFocus=await page.evaluate(()=>document.activeElement?.getAttribute('aria-label'));
const paths=['/about','/contact?service=health-insurance','/insights','/cases','/cases/not-a-published-case','/awards','/certificates','/our-clients','/testimonials','/financial-planning','/life-insurance','/health-insurance','/employer-employee-insurance','/mutual-funds','/retirement-planning','/general-insurance','/child-education-planning','/personal-accidental-policy','/not-a-real-page','/blog?category=not-a-category','/robots.txt','/sitemap.xml'];
for(const route of paths){const r=await fetch('http://localhost:3100'+route,{redirect:'manual'});results.redirects.push({route,status:r.status,location:r.headers.get('location'),body:route.endsWith('.txt')||route.endsWith('.xml')?await r.text():undefined});}
writeFileSync(path.join(out,'inspection.json'),JSON.stringify(results,null,2));
await browser.close();
console.log(JSON.stringify(results.interactions,null,2));
console.log('Supplemental route screenshots and redirects complete');
