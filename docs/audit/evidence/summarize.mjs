import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const out=path.dirname(fileURLToPath(import.meta.url));
const data=JSON.parse(readFileSync(path.join(out,'measurements.json'),'utf8'));
const summary={capturedAt:data.capturedAt,homepage:data.homepage.map(h=>({viewport:h.viewport,status:h.status,height:h.geometry.height,scrollRange:h.geometry.scrollRange,width:h.geometry.scrollWidth,errors:h.errors,brokenImages:h.media.filter(m=>!m.loaded),sections:h.geometry.sections.map(s=>({selector:s.selector,top:s.top,height:s.height,headings:s.headings,words:s.text?.split(/\s+/).length})),details:h.geometry.details.map(d=>({selector:d.selector,top:d.top,height:d.height,text:d.text})),aboveFold:h.geometry.aboveFold})),routes:data.routes.map(({text,images,headings,...r})=>({...r,headings,brokenImages:images}))};
writeFileSync(path.join(out,'summary.json'),JSON.stringify(summary,null,2));
const cms={};
for(const q of ['site-setting?populate=stats&populate=clientLocations','home-page?populate=*','contact-page?populate=stats','services?populate=*&sort=order:asc&pagination[pageSize]=100','testimonials?sort=order:asc&pagination[pageSize]=100','gallery-items?pagination[pageSize]=100','faq-items?sort=order:asc','online-services?sort=order:asc&pagination[pageSize]=100','newsletters?sort=issueMonth:desc&pagination[pageSize]=200','categories']){
 const r=await fetch('http://localhost:1337/api/'+q);
 if(!r.ok) throw new Error(`Public content snapshot failed: ${q} -> ${r.status}`);
 const j=await r.json();
 if(j.data==null) throw new Error(`Missing public content: ${q}`);
 cms[q.split('?')[0]]=j.data;
}
writeFileSync(path.join(out,'public-content.json'),JSON.stringify(cms,null,2));
const brief=summary.homepage.map(h=>({viewport:h.viewport,height:h.height,scrollRange:h.scrollRange,brokenImages:h.brokenImages.length,sections:h.sections.map(({selector,top,height,headings})=>({selector,top,height,headings})),details:h.details.filter(d=>!['.service-card','.service-list','.contact-form'].includes(d.selector))}));
writeFileSync(path.join(out,'home-brief.json'),JSON.stringify(brief,null,2));
console.log(JSON.stringify(summary.homepage.map(h=>({viewport:h.viewport,height:h.height,scrollRange:h.scrollRange,brokenImages:h.brokenImages.length})),null,2));
console.log('Routes captured: '+summary.routes.length);
