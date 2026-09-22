import { chromium } from '@playwright/test';
import { writeFile } from 'node:fs/promises';
import { basename, resolve } from 'node:path';

if (!process.argv.includes('--ghanchi')) throw new Error('Use --ghanchi to import the approved business galleries only.');
const root = resolve(import.meta.dirname, '..');
const browser = await chromium.launch();
const result = {};
try {
  const page = await browser.newPage();
  for (const slug of ['about-us', 'awards', 'certificates', 'newsletters']) {
    await page.goto(`https://ghanchiinvest.com/${slug}/`, { waitUntil: 'domcontentloaded' });
    const data = await page.evaluate(() => ({
      images: [...document.querySelectorAll('img')].map(img => ({ url: img.src, alt: img.alt })),
      backgrounds: [...document.querySelectorAll('[data-settings]')].flatMap(el => { try { const settings = JSON.parse(el.getAttribute('data-settings')); return settings.background_image?.url ? [{ url: settings.background_image.url, alt: '' }] : []; } catch { return []; } }),
      links: [...document.querySelectorAll('a[href]')].map(a => ({ title: a.textContent.trim(), url: a.href })),
    }));
    const images = [];
    for (const image of [...data.images, ...data.backgrounds]) {
      const url = new URL(image.url);
      if (url.hostname !== 'ghanchiinvest.com' || !/\.(png|jpe?g|webp)$/i.test(url.pathname) || /logo|6293820530fb|avatar/i.test(url.pathname)) continue;
      if (images.some(item => item.url === image.url)) continue;
      const response = await page.request.get(image.url);
      if (!response.ok() || !response.headers()['content-type']?.startsWith('image/')) throw new Error(`Invalid image: ${image.url}`);
      const local = `/assets/ghanchi-${basename(url.pathname)}`;
      await writeFile(resolve(root, `public${local}`), await response.body());
      images.push({ ...image, local });
    }
    result[slug] = { source: page.url(), images, newsletters: data.links.filter(link => /^(January|February|March|April|May|June|July|August|September|October|November|December) \d{4}$/.test(link.title)) };
    console.log(slug, JSON.stringify(images), JSON.stringify(result[slug].newsletters));
  }
  await writeFile(resolve(root, 'src/lib/ghanchi-source.json'), JSON.stringify(result, null, 2) + '\n');
} finally {
  await browser.close();
}
