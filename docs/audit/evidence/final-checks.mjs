import { chromium, expect } from '@playwright/test';
import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const out=path.dirname(fileURLToPath(import.meta.url));
const browser=await chromium.launch();
const results={interactions:[],legacyArticles:[],reducedContact:[]};
try {
 for(const width of [1440,1200,810,390]){
  const page=await browser.newPage({viewport:{width,height:width===390?844:1000}});
  await page.route('**/api/contact',r=>r.abort());
  await page.route('**/api/newsletter',r=>r.abort());
  await page.goto('http://localhost:3100');
  await expect(page.locator('.contact-form button[type=submit]')).toBeEnabled();
  await page.waitForTimeout(1700);
  const firstQuote=await page.locator('.service-quote').first().evaluate(e=>({top:Math.round(e.getBoundingClientRect().top+scrollY),text:e.innerText}));
  for(const title of ['Assess','Plan','Review','Understand']){
   const button=page.getByRole('button',{name:new RegExp(`Phase \\d: ${title}`)});
   await button.click();
   await expect(button).toHaveAttribute('aria-expanded','true');
  }
  await page.getByRole('button',{name:'Watch how we work'}).click();
  await expect.poll(()=>page.locator('.process-video video').evaluate(v=>!v.paused&&v.controls)).toBe(true);
  const founder=page.locator('.team-row button').first();
  await founder.click();
  await expect(page.locator('.team-dialog[open]')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(founder).toBeFocused();
  const quote=page.getByRole('button',{name:'Read testimonial from Ranbir Singh'});
  await quote.click();
  await expect(quote).toHaveAttribute('aria-expanded','true');
  await page.getByRole('tab',{name:'Protection',exact:true}).click();
  const question=page.locator('.faq-item button').first();
  await question.click();await expect(question).toHaveAttribute('aria-expanded','false');
  await question.click();await expect(question).toHaveAttribute('aria-expanded','true');
  results.interactions.push({width,firstQuote,phases:'pass',video:'pass',founderDialogAndFocus:'pass',testimonial:'pass',faq:'pass'});
  await page.close();
 }
 const {data:articles}=await (await fetch('http://localhost:1337/api/articles')).json();
 for(const article of articles){
  const route='/insights/'+article.slug;
  const r=await fetch('http://localhost:3100'+route,{redirect:'manual'});
  results.legacyArticles.push({route,status:r.status,location:r.headers.get('location')});
 }
 for(const width of [1440,390]){
  const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
  await page.goto('http://localhost:3100/contact-us');await page.waitForTimeout(2500);
  results.reducedContact.push({width,containers:await page.locator('.contact-intro-copy,.contact-intro-details').evaluateAll(es=>es.map(e=>({class:e.className,opacity:getComputedStyle(e).opacity})))});
  await page.close();
 }
} finally {
 writeFileSync(path.join(out,'final-checks.json'),JSON.stringify(results,null,2));
 await browser.close();
}
console.log(JSON.stringify(results,null,2));
