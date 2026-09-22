import { readFile, access } from 'node:fs/promises';
import { resolve } from 'node:path';
import ts from 'typescript';

if (!process.argv.includes('--validate')) throw new Error('This worktree only supports --validate; automatic reference-content overwrites are disabled.');
const root = resolve(import.meta.dirname, '..');
const data = JSON.parse(await readFile(resolve(root, 'src/lib/ghanchi-source.json'), 'utf8'));
const source = (await readFile(resolve(root, 'src/lib/content.ts'), 'utf8')).replace("import source from './ghanchi-source.json';", `const source = ${JSON.stringify(data)};`);
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ES2022 } }).outputText;
const content = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);
content.validateContent();
const serialized = JSON.stringify(content);
if (/Kora|Sitemark|Rajesh Mehta|Priya Nair|casino|gambling/i.test(serialized)) throw new Error('Unapproved content remains');
const assets = new Set(serialized.match(/\/assets\/[^"\\]+/g));
for (const asset of assets) await access(resolve(root, `public${asset}`));
if (content.newsletters[0].issueMonth !== '2021-11') throw new Error('Review the source before changing the latest newsletter');
if (content.stats[1].value !== 1200) throw new Error('The owner approved 1,200+ clients');
if (content.clientLocations.join(',') !== 'India,UAE,USA') throw new Error('Additional client locations need source verification');
console.log(`Validated ${content.services.length} services, ${content.articles.length} articles, ${content.newsletters.length} newsletters, ${content.testimonials.length} testimonials and ${assets.size} local assets.`);
