import { readFileSync, writeFileSync } from 'node:fs';

const env = readFileSync(new URL('../.env.local', import.meta.url), 'utf8');
const key = env.match(/GEMINI_API_KEY=(.+)/)[1].trim();
const model = process.argv[2] || 'gemini-3-pro-image';

const prompt = 'A warm, photorealistic image of an Indian financial advisor in his 40s, wearing a light blue formal shirt, sitting at a wooden desk in a modest Navi Mumbai office, reviewing documents with an Indian couple in their 30s across the table. Natural daylight, candid, documentary style, no text or logos in the image, 16:9 aspect ratio.';

const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    contents: [{ parts: [{ text: prompt }] }],
  }),
});
const data = await res.json();
if (!res.ok) {
  console.log('STATUS', res.status, JSON.stringify(data).slice(0, 2000));
  process.exit(1);
}
const parts = data.candidates?.[0]?.content?.parts || [];
console.log('Part types:', parts.map(p => Object.keys(p)));
const imgPart = parts.find(p => p.inlineData);
if (imgPart) {
  const buf = Buffer.from(imgPart.inlineData.data, 'base64');
  writeFileSync('reference/gemini-test-output.png', buf);
  console.log('Saved reference/gemini-test-output.png', buf.length, 'bytes', imgPart.inlineData.mimeType);
} else {
  console.log('No image part.', JSON.stringify(data).slice(0, 2000));
}
