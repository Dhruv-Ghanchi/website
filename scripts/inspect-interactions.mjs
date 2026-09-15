import { chromium } from '@playwright/test';
import { writeFile } from 'node:fs/promises';
const browser=await chromium.launch();const page=await browser.newPage({viewport:{width:1440,height:1000}});
await page.goto('https://kora.framer.media/',{waitUntil:'networkidle'});
const result={};
for (const label of ['General','Pricing','Process','Results']) {
 const tabs=page.getByText(label,{exact:true});
 const tab=label==='Pricing'?tabs.last():tabs.first();
 await tab.click();await page.waitForTimeout(600);
 result[label]=await page.getByRole('heading',{name:'FAQ',exact:true}).evaluate(el=>el.closest('section')?.innerText);
}
await page.getByRole('heading',{name:'Design',exact:true}).click({force:true}).catch(()=>{});
await page.getByRole('heading',{name:'Diagnose',exact:true}).scrollIntoViewIfNeeded();await page.waitForTimeout(800);
await page.screenshot({path:'reference/process-interaction.png'});
const video=page.locator('[data-framer-name="Play"]');console.log('PLAY',await video.count());
console.log('PLAY CANDIDATES',await page.locator('[data-framer-name]').evaluateAll(els=>els.filter(el=>/play|video/i.test(el.dataset.framerName)).map(el=>({name:el.dataset.framerName,tag:el.tagName,html:el.outerHTML.slice(0,700)}))));
await writeFile('reference/faq.json',JSON.stringify(result,null,2));
await page.getByRole('heading',{name:'Koraline Spencer',exact:true}).click();await page.waitForTimeout(700);await page.screenshot({path:'reference/team-open.png'});
await page.getByRole('heading',{name:'Launches that land and scale.',exact:true}).scrollIntoViewIfNeeded();await page.waitForTimeout(1400);await page.screenshot({path:'reference/service-live.png'});
await browser.close();
