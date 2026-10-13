import { build } from 'esbuild';
import path from 'node:path';
import { expect, test } from '@playwright/test';
import type { Service } from '../src/lib/content';

let fixtureScript: string;

test.beforeAll(async () => {
  const result = await build({
    stdin: {
      contents: `import React from 'react';
        import { createRoot } from 'react-dom/client';
        import { ServicesSection } from './src/components/home-sections';
        const root = createRoot(document.getElementById('fixture'));
        window.renderServices = services => root.render(React.createElement(ServicesSection, { services, servicesIntro: 'Service collection layout test.' }));`,
      resolveDir: path.resolve(__dirname, '..'),
      loader: 'tsx',
    },
    bundle: true,
    write: false,
    platform: 'browser',
    format: 'iife',
    jsx: 'automatic',
    define: { 'process.env.NODE_ENV': '"production"' },
    plugins: [{
      name: 'fixture-link',
      setup(builder) {
        builder.onResolve({ filter: /^next\/link$/ }, () => ({ path: 'link', namespace: 'fixture' }));
        builder.onLoad({ filter: /.*/, namespace: 'fixture' }, () => ({
          contents: `import React from 'react'; export default function Link({ href, children, ...props }) { return React.createElement('a', { ...props, href }, children); }`,
          resolveDir: path.resolve(__dirname, '..'),
          loader: 'js',
        }));
      },
    }],
  });
  fixtureScript = result.outputFiles[0].text;
});

const makeService = (index: number): Service => ({
  id: `fixture-service-${index}`, title: `Test service ${index + 1}`, icon: 'chart', shortDesc: 'Fixture description.', longDesc: '', deliverables: [],
  image: '/assets/logo-ghanchi.png', imageAlt: 'Fixture image', imageFocalX: 50, imageFocalY: 50, sourceUrl: '',
  testimonial: { id: '', quote: '', name: '', role: '', image: '', focalX: 50, focalY: 50, sourceUrl: '' },
});

for (const width of [1440, 810, 390, 320]) {
  test(`service gallery adapts to collection changes at ${width}px`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/');
    const styles = await page.locator('link[rel="stylesheet"]').evaluateAll(links => links.map(link => (link as HTMLLinkElement).href));
    await page.route('**/__service-fixture', route => route.fulfill({ contentType: 'text/html', body: `<html><head>${styles.map(href => `<link rel="stylesheet" href="${href}">`).join('')}</head><body><div id="fixture"></div></body></html>` }));
    await page.goto('/__service-fixture');
    await page.addScriptTag({ content: fixtureScript });
    const render = async (services: Service[]) => {
      await page.evaluate(items => (window as unknown as { renderServices: (records: Service[]) => void }).renderServices(items), services);
      await expect(page.locator('.service-tile')).toHaveCount(services.length);
    };
    for (const count of [0, 1, 4, 8, 9, 10, 12]) {
      const services = Array.from({ length: count }, (_, index) => makeService(index));
      await render(services);
      if (!count) {
        await expect(page.getByRole('link', { name: 'Contact us', exact: true })).toHaveAttribute('href', '/contact-us');
        continue;
      }
      await expect(page.locator('.service-gallery')).toHaveCSS('display', 'grid');
      expect(await page.locator('.service-tile-title').allTextContents()).toEqual(services.map(service => service.title));
      const boxes = await page.locator('.service-tile').evaluateAll(elements => elements.map(el => {
        const box = el.getBoundingClientRect();
        return { left: box.left, right: box.right, top: box.top, bottom: box.bottom, width: box.width };
      }));
      for (let index = 0; index < boxes.length; index++) {
        expect(boxes[index].left).toBeGreaterThanOrEqual(0);
        expect(boxes[index].right).toBeLessThanOrEqual(width);
        expect(boxes[index].width).toBeGreaterThanOrEqual(140);
        for (const other of boxes.slice(index + 1)) expect(boxes[index].left < other.right - 1 && boxes[index].right > other.left + 1 && boxes[index].top < other.bottom - 1 && boxes[index].bottom > other.top + 1).toBe(false);
      }
      if (count === 1) expect(boxes[0].width).toBeLessThanOrEqual(width);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
    }
    const changed = [makeService(8), makeService(2), makeService(11)];
    changed[0].title = 'A longer service name that must remain fully readable without colliding with the arrow';
    changed[0].image = '';
    await render(changed);
    expect(await page.locator('.service-tile').evaluateAll(links => links.map(link => link.getAttribute('href')))).toEqual(changed.map(service => `/services/${service.id}`));
    await expect(page.locator('.service-tile').first().locator('.service-tile-fallback')).toBeVisible();
    expect(await page.locator('.service-tile-title').first().evaluate(el => el.scrollWidth <= el.clientWidth + 1 && el.scrollHeight <= el.clientHeight + 1)).toBe(true);
    await page.route('**/missing-service-image.png', route => route.fulfill({ status: 404, body: '' }));
    const failed = { ...makeService(2), image: '/missing-service-image.png' };
    await render([failed]);
    await page.locator('.service-tile').scrollIntoViewIfNeeded();
    await expect(page.locator('.service-tile-fallback')).toBeVisible();
    await expect(page.locator('.service-tile img')).toHaveCount(0);
    await render([makeService(2)]);
    await expect(page.locator('.service-tile img')).toHaveCount(1);
    await expect.poll(() => page.locator('.service-tile img').evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);
    await render([]);
    await expect(page.locator('.services-empty')).toBeVisible();
  });
}
