import { readFileSync, existsSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import assert from 'node:assert/strict';
const evidence=path.dirname(fileURLToPath(import.meta.url));
const root=path.dirname(evidence);
const files=['01-homepage-scroll-map.md','02-developer-vs-client.md','03-section-decision-matrix.md','04-recommended-information-architecture.md','FINAL-AUDIT.md','IMPLEMENTATION-HANDOFF.md'];
for(const file of files){
 const text=readFileSync(path.join(root,file),'utf8');
 assert(text.length>1000,`${file}: incomplete`);
 for(const [,link] of text.matchAll(/\]\(([^)]+)\)/g)) if(!/^(?:https?:|#)/.test(link)) assert(existsSync(path.resolve(root,link)),`${file}: missing link ${link}`);
 for(const [image] of text.matchAll(/home-\d+-\d+\.png/g)) assert(existsSync(path.join(evidence,'screenshots',image)),`${file}: missing screenshot ${image}`);
}
const matrix=readFileSync(path.join(root,files[2]),'utf8').split('## Child-element decisions')[0];
const rows=matrix.split('\n').filter(line=>/^\| \d{2} /.test(line));
assert.equal(rows.length,13);
const valid=['KEEP','KEEP + REDUCE','KEEP + MOVE UP','KEEP + MOVE DOWN','MERGE','REWRITE','REPLACE','REMOVE'];
for(const row of rows) assert(valid.includes(row.split('|')[3].trim()),`Invalid primary decision ${row}`);
const data=JSON.parse(readFileSync(path.join(evidence,'measurements.json'),'utf8'));
assert.equal(data.homepage.length,4);
assert.equal(data.routes.length,25);
for(const home of data.homepage){assert.equal(home.status,200);assert.equal(home.errors.length,0);assert(home.media.every(m=>m.loaded));assert.equal(home.geometry.scrollWidth,home.viewport.width);}
for(const route of data.routes){assert.equal(route.status,200);assert.equal(route.h1.length,1);assert.equal(route.images.length,0);assert.equal(route.errors.length,0);assert.equal(route.width,1440);assert.equal(route.mobile.width,390);}
const content=JSON.parse(readFileSync(path.join(evidence,'public-content.json'),'utf8'));
assert(Object.values(content).every(value=>value!=null));assert.equal(content.newsletters.length,19);assert.equal(content.services.length,9);assert.equal(content.testimonials.length,11);assert.equal(content['gallery-items'].filter(i=>i.category==='awards').length,8);assert.equal(content['gallery-items'].filter(i=>i.category==='certificates').length,19);
const followup=JSON.parse(readFileSync(path.join(evidence,'final-checks.json'),'utf8'));
assert.equal(followup.interactions.length,4);
for(const row of followup.interactions) for(const key of ['phases','video','founderDialogAndFocus','testimonial','faq']) assert.equal(row[key],'pass');
assert(followup.legacyArticles.every(r=>r.status===308));
const desktop=[900,1800,1100,600,650,650,650,400,1150,1200].reduce((a,b)=>a+b,0);
const mobile=[800,230,1800,700,800,800,700,500,1750,1520].reduce((a,b)=>a+b,0);
assert.equal(desktop,9100);assert.equal(mobile,9600);
const result={date:'2026-09-30',reports:files,inventorySections:13,primaryDecisions:rows.length,canonicalRoutes:25,homepageViewports:4,publicContentCounts:{services:9,testimonials:11,awardPhotos:8,certificateScans:19,newsletters:19},estimatedBudgets:{desktop,mobile,desktopReductionPercent:Number(((22541-desktop)/22541*100).toFixed(1)),mobileReductionPercent:Number(((24272-mobile)/24272*100).toFixed(1))},auditValidation:'pass',typecheck:'pass',build:'pass',fullPlaywright:{passed:33,failed:6},isolated1200RouteRetest:'pass',followupInteractions:'pass at all four widths',legacyContentValidation:'fails: content.validateContent is not a function',implementationApproved:false};
writeFileSync(path.join(evidence,'verification.json'),JSON.stringify(result,null,2));
console.log(JSON.stringify(result,null,2));
