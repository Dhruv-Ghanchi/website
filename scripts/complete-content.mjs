import { chromium } from 'playwright';
import { readFile, writeFile, access } from 'node:fs/promises';
import { basename, resolve } from 'node:path';
import ts from 'typescript';

const root = resolve(import.meta.dirname, '..');
const contentPath = resolve(root, 'src/lib/content.ts');
let source = await readFile(contentPath, 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ES2022 } }).outputText;
const current = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);
if (process.argv.includes('--validate')) {
  current.validateContent();
  const expectedCases = ['sitemark', 'milano', 'hamilton', 'elevance', 'theo'];
  const expectedDates = ['2026-03-18', '2026-03-12', '2026-03-05', '2026-02-11', '2026-01-22'];
  const expectedInsightDates = ['2026-03-04', '2026-03-03', '2026-03-02', '2026-02-20', '2026-02-03'];
  if (JSON.stringify(current.caseStudies.map(item => item.id)) !== JSON.stringify(expectedCases)) throw new Error('Unexpected case routes or order');
  if (JSON.stringify(current.caseStudies.map(item => item.publishDate)) !== JSON.stringify(expectedDates)) throw new Error('Case date mismatch');
  if (JSON.stringify(current.insights.map(item => item.publishDate)) !== JSON.stringify(expectedInsightDates)) throw new Error('Insight date mismatch');
  if (current.insights[1].authorId !== 'james-okoro') throw new Error('Incorrect second insight author');
  const imagePaths = new Set(JSON.stringify(current).match(/\/assets\/[^"\\]+/g));
  for (const image of imagePaths) await access(resolve(root, `public${image}`));
  console.log(`Validated ${current.caseStudies.length} cases, ${current.insights.length} insights, ${current.teamMembers.length} team members, and ${imagePaths.size} local images.`);
  process.exit(0);
}
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const slug = text => text.toLowerCase().replace(/&/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const lines = text => text.split('\n').map(line => line.trim()).filter(Boolean);
const datePattern = /(?:January|February|March|April|May|June|July|August|September|October|November|December) \d{1,2}, \d{4}/;
const isoDate = text => new Date(`${text.match(datePattern)[0]} 00:00:00 UTC`).toISOString().slice(0, 10);
async function visit(path) {
  await page.goto(`https://kora.framer.media${path}`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1100);
}
async function localImage(url) {
  const clean = url.split('?')[0];
  const name = basename(new URL(clean).pathname);
  const target = resolve(root, 'public/assets', name);
  try { await access(target); } catch {
    const response = await page.request.get(clean);
    if (!response.ok()) throw new Error(`Image fetch failed: ${clean}`);
    await writeFile(target, await response.body());
    console.log(`Downloaded ${name}`);
  }
  return `/assets/${name}`;
}
async function routes(index, prefix) {
  await visit(index);
  return [...new Set(await page.locator('a[href]').evaluateAll((elements, prefix) => elements.map(element => new URL(element.href).pathname).filter(path => path.startsWith(prefix)), prefix))];
}
function replaceCollection(name, type, data) {
  const expression = new RegExp(`export const ${name}: ${type}\\[\\] = [\\s\\S]*?(?=export const )`);
  if (!expression.test(source)) throw new Error(`Missing collection ${name}`);
  source = source.replace(expression, () => `export const ${name}: ${type}[] = ${JSON.stringify(data, null, 2)};\n`);
}
try {
  const searchIndex = await page.request.get('https://framerusercontent.com/sites/3J0CUow514gIYvBbwyhv0Q/searchIndex-RRyqUAfB8uAs.json');
  if (!searchIndex.ok()) throw new Error('Reference search index is unavailable');
  console.log(`Reference search index verified (${(await searchIndex.body()).length} bytes)`);
  const caseRoutes = await routes('/cases', '/cases/');
  const insightRoutes = await routes('/insights', '/insights/');
  const indexRows = lines(await page.locator('body').innerText());
  const categoryNames = indexRows.slice(indexRows.indexOf('All') + 1, indexRows.indexOf('All') + 5);
  if (caseRoutes.length !== 5 || insightRoutes.length !== 5) throw new Error('Unexpected live collection size');
  console.log({ caseRoutes, insightRoutes });
  const caseStudies = [];
  for (const path of caseRoutes) {
    await visit(path);
    const text = (await page.locator('body').innerText()).split('More cases.')[0].trim();
    const rows = lines(text);
    const clientName = rows[0];
    const title = rows.find(line => line.startsWith('How '));
    const challengeStart = rows.indexOf('The challenge');
    const approachStart = rows.indexOf('The approach');
    const resultsStart = rows.indexOf('The Results');
    const quoteIndex = rows.length - 3;
    if ([challengeStart, approachStart, resultsStart, quoteIndex].some(index => index < 0)) throw new Error(`Missing case sections: ${path}`);
    const statRows = rows.slice(rows.indexOf('Timeline') + 2, rows.findIndex(line => datePattern.test(line)));
    const resultStats = [];
    for (let index = 0; index < statRows.length; index += 3) {
      const raw = statRows[index];
      resultStats.push({ value: Number(raw.replace('$', '')), suffix: statRows[index + 1], label: statRows[index + 2] });
    }
    const imageUrls = await page.locator('img').evaluateAll(elements => elements.map(element => element.src));
    const knownTestimonial = current.services.find(service => service.testimonial.name === rows[quoteIndex + 1])?.testimonial;
    const testimonialImage = imageUrls.find(url => knownTestimonial && url.includes(basename(knownTestimonial.image)));
    if (!testimonialImage) throw new Error(`Missing verified testimonial image: ${path}`);
    const testimonial = {
      quote: rows[quoteIndex].replace(/^[“"]|[”"]$/g, ''),
      name: rows[quoteIndex + 1],
      role: rows[quoteIndex + 2],
      image: await localImage(testimonialImage),
    };
    const serviceNames = rows.slice(rows.indexOf('Services') + 1, rows.indexOf('Industry'));
    const serviceIds = serviceNames.map(name => {
      const service = current.services.find(service => service.title === name);
      if (!service) throw new Error(`Unrecognized service: ${name}`);
      return service.id;
    });
    caseStudies.push({
      id: path.split('/').pop(), clientName, title,
      heroImage: await localImage(imageUrls[0]),
      industry: rows[rows.indexOf('Industry') + 1],
      companySize: rows[rows.indexOf('Company Size') + 1],
      timeline: rows[rows.indexOf('Timeline') + 1],
      publishDate: isoDate(text), serviceIds, resultStats, testimonial,
      challenge: [{ paragraphs: [rows[1]] }, { heading: 'The challenge', paragraphs: rows.slice(challengeStart + 1, approachStart) }],
      solution: [{ heading: 'The approach', paragraphs: rows.slice(approachStart + 1, resultsStart) }, { heading: 'The Results', paragraphs: rows.slice(resultsStart + 1, quoteIndex) }],
    });
    console.log(`Sourced ${path}: ${clientName}, ${resultStats.map(stat => `${stat.value}${stat.suffix}`).join(', ')}`);
  }
  const categories = categoryNames.map(name => ({ id: slug(name), name }));
  const insights = [];
  for (const path of insightRoutes) {
    await visit(path);
    const text = (await page.locator('body').innerText()).split('More insights.')[0].trim();
    const rows = lines(text);
    const title = await page.locator('h1').first().innerText();
    const author = current.teamMembers.find(member => member.name === rows[2]);
    if (!author) throw new Error(`Missing author for ${path}: ${rows[2]}`);
    const categoryName = rows[1];
    const categoryId = slug(categoryName);
    if (!categories.some(category => category.id === categoryId)) categories.push({ id: categoryId, name: categoryName });
    const body = await page.locator('[data-framer-component-type="RichTextContainer"]').evaluateAll(elements => {
      const container = elements.find(element => element.querySelector('h3[id]'));
      if (!container) throw new Error('Article body not found');
      const blocks = [];
      let block = { paragraphs: [] };
      for (const child of container.children) {
        if (/^H[1-6]$/.test(child.tagName)) {
          if (block.heading || block.paragraphs.length) blocks.push(block);
          block = { heading: child.innerText.trim(), paragraphs: [] };
        } else if (child.querySelector('table') || child.tagName === 'TABLE') {
          const rows = [...child.querySelectorAll('tr')].map(row => [...row.querySelectorAll('th,td')].map(cell => cell.innerText.trim()));
          const headers = rows.shift();
          for (const row of rows) block.paragraphs.push(row.map((value, index) => `${headers[index]}: ${value}`).join('; ') + '.');
        } else if (child.tagName === 'UL' || child.tagName === 'OL') {
          for (const item of child.querySelectorAll('li')) block.paragraphs.push(item.innerText.trim());
        } else if (child.innerText?.trim()) {
          const paragraph = child.innerText.trim();
          block.paragraphs.push(child.tagName === 'BLOCKQUOTE' ? `“${paragraph}”` : paragraph);
        }
      }
      if (block.heading || block.paragraphs.length) blocks.push(block);
      return blocks;
    });
    const titleIndex = rows.indexOf(title);
    const description = rows.slice(titleIndex + 1, rows.indexOf('Table of contents')).join('\n');
    const dateIndex = rows.findIndex(row => datePattern.test(row));
    const introductionEnd = rows.findIndex((row, index) => index > dateIndex && row === body[0].heading);
    const introduction = rows.slice(dateIndex + 1, introductionEnd);
    if (description) introduction.unshift(description);
    const image = await page.locator('img').first().getAttribute('src');
    insights.push({ id: path.split('/').pop(), title, coverImage: await localImage(image), publishDate: isoDate(text), authorId: author.id, categoryId, content: [{ paragraphs: introduction }, ...body] });
    console.log(`Sourced ${path}: ${author.name}, ${categoryName}, ${body.length} sections`);
  }
  const teamMembers = [];
  for (const member of current.teamMembers) {
    await visit('/about');
    await page.getByRole('heading', { name: member.name, exact: true }).click();
    await page.waitForTimeout(650);
    const text = await page.locator('body').innerText();
    const detail = lines(text.slice(text.lastIndexOf(member.name) + member.name.length));
    const emailIndex = detail.indexOf('Email');
    if (emailIndex < 1) throw new Error(`Team biography missing: ${member.name}`);
    const bio = detail.slice(0, emailIndex).join('\n\n');
    const email = detail[emailIndex + 1];
    teamMembers.push({ ...member, bio, socialLinks: [{ label: 'Email', url: `mailto:${email}` }] });
    console.log(`Sourced team dialog ${member.name}: ${bio}`);
  }
  replaceCollection('teamMembers', 'TeamMember', teamMembers);
  replaceCollection('caseStudies', 'CaseStudy', caseStudies);
  replaceCollection('categories', 'Category', categories);
  replaceCollection('insights', 'Insight', insights);
  await writeFile(contentPath, source);
  console.log('Updated src/lib/content.ts with five cases, five insights, four categories, and six live team biographies.');
} finally {
  await browser.close();
}
