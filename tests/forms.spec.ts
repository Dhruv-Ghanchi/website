import { expect, test, type Page } from '@playwright/test';
import { POST as contactPOST } from '../src/app/api/contact/route';
import { POST as newsletterPOST } from '../src/app/api/newsletter/route';

const bookingUnavailable = 'This preview is not connected to a booking service yet. Please try again once booking is configured.';
const newsletterUnavailable = 'This preview is not connected to a newsletter service yet. Please try again once the newsletter is configured.';
const enquirySuccess = 'Your enquiry was sent. The team will be in touch to arrange a call.';
const validContact = { name: 'Test Person', email: 'person@example.test', services: ['growth-strategy'], revenue: '$1M–$5M', challenge: 'We want a more predictable growth strategy.', consent: true, website: '' };

async function fillContact(page: Page) {
  const form = page.getByRole('form', { name: 'Book a call' });
  await form.getByLabel('Name', { exact: true }).fill(validContact.name);
  await form.getByLabel('Email', { exact: true }).fill(validContact.email);
  await form.getByRole('checkbox', { name: 'Growth Strategy', exact: true }).check();
  await form.getByRole('radio', { name: '$1M–$5M', exact: true }).check();
  await form.getByLabel('Biggest growth challenge?').fill(validContact.challenge);
  await form.getByRole('checkbox', { name: /By submitting/ }).check();
  return form;
}

test.beforeEach(async ({ page }) => {
  await page.route('**/api/contact', route => route.fulfill({ status: 503, json: { message: bookingUnavailable } }));
  await page.route('**/api/newsletter', route => route.fulfill({ status: 503, json: { message: newsletterUnavailable } }));
});

test('contact requires fields, services and explicit consent before sending', async ({ page }) => {
  let requests = 0;
  await page.route('**/api/contact', route => { requests++; return route.fulfill({ status: 200, json: { message: enquirySuccess } }); });
  await page.goto('/contact');
  const form = page.getByRole('form', { name: 'Book a call' });
  await form.getByRole('button', { name: 'Book a call', exact: true }).click();
  await expect(form.getByLabel('Name', { exact: true })).toBeFocused();
  expect(requests).toBe(0);
  await fillContact(page);
  await form.getByRole('checkbox', { name: 'Growth Strategy', exact: true }).uncheck();
  await form.getByRole('button', { name: 'Book a call', exact: true }).click();
  await expect(form.getByRole('checkbox', { name: 'Go-to-Market', exact: true })).toBeFocused();
  expect(requests).toBe(0);
  await form.getByRole('checkbox', { name: 'Growth Strategy', exact: true }).check();
  await form.getByRole('checkbox', { name: /By submitting/ }).uncheck();
  await form.getByRole('button', { name: 'Book a call', exact: true }).click();
  await expect(form.getByRole('checkbox', { name: /By submitting/ })).toBeFocused();
  expect(requests).toBe(0);
  await expect(form.getByRole('link', { name: 'terms of service' })).toHaveAttribute('href', '/terms-of-service');
});

test('forms prevent native navigation and keep personal details out of URLs before hydration', async ({ page }) => {
  let release!: () => void;
  const gate = new Promise<void>(resolve => { release = resolve; });
  await page.route('**/_next/**/*.js*', async route => { await gate; await route.continue(); });
  const navigations: string[] = [];
  const submissions: unknown[] = [];
  page.on('request', request => { if (request.isNavigationRequest()) navigations.push(request.url()); });
  await page.route('**/api/contact', route => {
    submissions.push(route.request().postDataJSON());
    return route.fulfill({ status: 200, json: { message: enquirySuccess } });
  });
  try {
    await page.goto('/contact', { waitUntil: 'commit' });
    const form = await fillContact(page);
    const button = form.getByRole('button', { name: 'Book a call', exact: true });
    const newsletter = page.getByRole('form', { name: 'Newsletter subscription' });
    await newsletter.getByLabel('Email address', { exact: true }).fill('reader@example.test');
    await newsletter.getByRole('checkbox').check();
    for (const target of [form, newsletter]) {
      await expect(target).toHaveAttribute('method', 'post');
      await expect(target.getByRole('button')).toBeDisabled();
      await target.getByRole('button').evaluate((element: HTMLButtonElement) => element.click());
    }
    await form.getByLabel('Name', { exact: true }).press('Enter');
    await newsletter.getByLabel('Email address', { exact: true }).press('Enter');
    await expect(page).toHaveURL('http://localhost:3000/contact');
    expect(navigations).toEqual(['http://localhost:3000/contact']);
    expect(submissions).toEqual([]);
    release();
    await expect(button).toBeEnabled();
    await button.click();
    await expect(form.getByRole('status')).toHaveText(enquirySuccess);
    expect(submissions).toEqual([validContact]);
    await expect(page).toHaveURL('http://localhost:3000/contact');
    expect(navigations).toEqual(['http://localhost:3000/contact']);
  } finally {
    release();
  }
});

test('contact preselects only valid service query values and lets visitors change them', async ({ page }) => {
  await page.goto('/contact?service=growth-strategy');
  const form = page.getByRole('form', { name: 'Book a call' });
  const growth = form.getByRole('checkbox', { name: 'Growth Strategy', exact: true });
  await expect(growth).toBeChecked();
  await expect(form.locator('input[name="services"]:checked')).toHaveCount(1);
  await growth.uncheck();
  await expect(growth).not.toBeChecked();
  await page.goto('/contact?service=unknown-service');
  await expect(form.getByRole('button', { name: 'Book a call', exact: true })).toBeEnabled();
  await expect(form.locator('input[name="services"]:checked')).toHaveCount(0);
  await page.goto('/?service=growth-strategy');
  await expect(form.getByRole('button', { name: 'Book a call', exact: true })).toBeEnabled();
  await expect(form.locator('input[name="services"]:checked')).toHaveCount(0);
});

test('contact and newsletter inherit root theme colors while the logo glyph stays white', async ({ page }) => {
  await page.goto('/contact');
  await page.evaluate(() => {
    document.documentElement.style.setProperty('--accent', '#123456');
    document.documentElement.style.setProperty('--ink', '#654321');
  });
  await expect(page.locator('.contact-form .brand-mark')).toHaveCSS('color', 'rgb(255, 255, 255)');
  await expect(page.locator('.contact-form .brand-mark')).toHaveCSS('background-color', 'rgb(18, 52, 86)');
  await expect(page.locator('.contact-form')).toHaveCSS('color', 'rgb(101, 67, 33)');
  await expect(page.locator('.newsletter-form-row button')).toHaveCSS('background-color', 'rgb(18, 52, 86)');
  await expect(page.locator('.newsletter-form')).toHaveCSS('color', 'rgb(101, 67, 33)');
});

test('contact sends selected service IDs and shows honest success and loading states', async ({ page }) => {
  let release!: () => void;
  const gate = new Promise<void>(resolve => { release = resolve; });
  let submitted: unknown;
  await page.route('**/api/contact', async route => {
    submitted = route.request().postDataJSON();
    await gate;
    await route.fulfill({ status: 200, json: { message: enquirySuccess } });
  });
  await page.goto('/contact');
  const form = await fillContact(page);
  await form.getByRole('checkbox', { name: 'Go-to-Market', exact: true }).check();
  await form.getByRole('button', { name: 'Book a call', exact: true }).click();
  await expect(form.getByRole('button', { name: 'Sending…' })).toBeDisabled();
  await expect(form).toHaveAttribute('aria-busy', 'true');
  release();
  await expect(form.getByRole('status')).toHaveText(enquirySuccess);
  expect(submitted).toEqual({ ...validContact, services: ['go-to-market', 'growth-strategy'] });
  await expect(form.getByRole('button', { name: 'Enquiry sent' })).toBeDisabled();
});

test('contact displays unconfigured service error and preserves details for retry', async ({ page }) => {
  await page.goto('/contact');
  const form = await fillContact(page);
  await form.getByRole('button', { name: 'Book a call', exact: true }).click();
  await expect(form.getByRole('alert')).toHaveText(bookingUnavailable);
  await expect(form.getByLabel('Name', { exact: true })).toHaveValue(validContact.name);
  await expect(form.getByRole('button', { name: 'Book a call', exact: true })).toBeEnabled();
  await page.route('**/api/contact', route => route.abort('failed'));
  await form.getByRole('button', { name: 'Book a call', exact: true }).click();
  await expect(form.getByRole('alert')).toHaveText('We could not connect. Please try again in a moment.');
});

test('newsletter requires consent and handles unavailable and success responses', async ({ page }) => {
  await page.goto('/contact');
  const form = page.getByRole('form', { name: 'Newsletter subscription' });
  await form.getByLabel('Email address', { exact: true }).fill('reader@example.test');
  await form.getByRole('button', { name: 'Subscribe to newsletter' }).click();
  await expect(form.getByRole('checkbox')).toBeFocused();
  await form.getByRole('checkbox').check();
  await form.getByRole('button', { name: 'Subscribe to newsletter' }).click();
  await expect(form.getByRole('alert')).toHaveText(newsletterUnavailable);
  await page.route('**/api/newsletter', route => {
    expect(route.request().postDataJSON()).toEqual({ email: 'reader@example.test', consent: true, website: '' });
    return route.fulfill({ status: 200, json: { message: 'Subscription request sent.' } });
  });
  await form.getByRole('button', { name: 'Subscribe to newsletter' }).click();
  await expect(form.getByRole('status')).toHaveText('Your subscription request was sent. Please check your inbox for any next steps.');
  await expect(form.getByRole('link', { name: 'privacy policy' })).toHaveAttribute('href', '/privacy-policy');
});

for (const width of [810, 390]) {
  test(`contact stacks without overflow at ${width}px and pills support keyboard input`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/contact');
    const section = page.locator('.contact-section');
    await expect(section).toBeVisible();
    const copy = await section.locator('.contact-section-copy').boundingBox();
    const right = await section.locator('.contact-section-right').boundingBox();
    expect(right!.y).toBeGreaterThan(copy!.y + copy!.height - 1);
    expect(await section.evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    const pill = section.getByRole('checkbox', { name: 'Growth Strategy', exact: true });
    await pill.focus();
    await page.keyboard.press('Space');
    await expect(pill).toBeChecked();
  });
}

test('API validation, configuration and delivery stay local with a mocked transport', async () => {
  const originalFetch = globalThis.fetch;
  const originalContact = process.env.CONTACT_WEBHOOK_URL;
  const originalNewsletter = process.env.NEWSLETTER_WEBHOOK_URL;
  let calls = 0;
  let upstreamStatus = 200;
  let lastInit: RequestInit | undefined;
  globalThis.fetch = async (_input, init) => { calls++; lastInit = init; return new Response(null, { status: upstreamStatus }); };
  const request = (path: string, data: unknown, origin = 'http://localhost:3000') => new Request(`http://localhost:3000/api/${path}`, { method: 'POST', headers: { origin, 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
  try {
    delete process.env.CONTACT_WEBHOOK_URL;
    delete process.env.NEWSLETTER_WEBHOOK_URL;
    const unavailable = await contactPOST(request('contact', validContact));
    expect(unavailable.status).toBe(503);
    expect((await unavailable.json()).message).toBe(bookingUnavailable);
    expect((await newsletterPOST(request('newsletter', { email: 'reader@example.test', consent: true }))).status).toBe(503);
    expect((await contactPOST(request('contact', validContact, 'https://other.example'))).status).toBe(403);
    for (const invalid of [{ consent: false }, { consent: 'true' }, { services: ['unknown-service'] }, { services: [] }, { services: ['growth-strategy', 'growth-strategy'] }, { name: 'x'.repeat(101) }, { email: 'invalid' }, { revenue: 'invalid' }, { challenge: 'short' }, { challenge: 'x'.repeat(3001) }, { website: 'spam' }]) {
      expect((await contactPOST(request('contact', { ...validContact, ...invalid }))).status).toBe(400);
    }
    expect((await contactPOST(request('contact', { ...validContact, challenge: 'x'.repeat(17000) }))).status).toBe(413);
    expect((await contactPOST(new Request('http://localhost:3000/api/contact', { method: 'POST', headers: { origin: 'http://localhost:3000', 'Content-Type': 'application/json' }, body: '{' }))).status).toBe(400);
    for (const invalid of [{ email: 'bad', consent: true }, { email: 'reader@example.test', consent: false }, { email: 'reader@example.test', consent: true, website: 'spam' }]) {
      expect((await newsletterPOST(request('newsletter', invalid))).status).toBe(400);
    }
    expect((await newsletterPOST(request('newsletter', { email: 'x'.repeat(3000), consent: true }))).status).toBe(413);
    process.env.CONTACT_WEBHOOK_URL = 'http://example.invalid/contact';
    expect((await contactPOST(request('contact', validContact))).status).toBe(503);
    expect(calls).toBe(0);
    process.env.CONTACT_WEBHOOK_URL = 'https://example.invalid/contact';
    process.env.NEWSLETTER_WEBHOOK_URL = 'https://example.invalid/newsletter';
    expect((await contactPOST(request('contact', validContact))).status).toBe(200);
    expect(lastInit?.redirect).toBe('error');
    expect(lastInit?.signal).toBeInstanceOf(AbortSignal);
    expect(JSON.parse(String(lastInit?.body))).not.toHaveProperty('website');
    expect((await newsletterPOST(request('newsletter', { email: 'reader@example.test', consent: true }))).status).toBe(200);
    upstreamStatus = 500;
    expect((await contactPOST(request('contact', validContact))).status).toBe(502);
    expect((await newsletterPOST(request('newsletter', { email: 'reader@example.test', consent: true }))).status).toBe(502);
    globalThis.fetch = async () => { throw new DOMException('Timed out', 'TimeoutError'); };
    expect((await contactPOST(request('contact', validContact))).status).toBe(502);
    expect((await newsletterPOST(request('newsletter', { email: 'reader@example.test', consent: true }))).status).toBe(502);
  } finally {
    globalThis.fetch = originalFetch;
    if (originalContact === undefined) delete process.env.CONTACT_WEBHOOK_URL; else process.env.CONTACT_WEBHOOK_URL = originalContact;
    if (originalNewsletter === undefined) delete process.env.NEWSLETTER_WEBHOOK_URL; else process.env.NEWSLETTER_WEBHOOK_URL = originalNewsletter;
  }
});
