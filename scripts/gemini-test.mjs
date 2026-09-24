import { readFileSync } from 'node:fs';

const env = readFileSync(new URL('../.env.local', import.meta.url), 'utf8');
const key = env.match(/GEMINI_API_KEY=(.+)/)[1].trim();

const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
const data = await res.json();
if (!res.ok) {
  console.log('STATUS', res.status);
  console.log(JSON.stringify(data).slice(0, 1500));
} else {
  const names = data.models.map(m => m.name).filter(n => /image|imagen/i.test(n));
  console.log('Image-capable models:', names);
  console.log('Total models:', data.models.length);
}
