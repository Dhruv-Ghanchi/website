import { services } from '@/lib/content';

const unavailable = 'This preview is not connected to a booking service yet. Please try again once booking is configured.';
const reply = (message: string, status: number) => Response.json({ message }, { status, headers: { 'Cache-Control': 'no-store' } });
const text = (value: unknown, min: number, max: number): value is string => typeof value === 'string' && value.trim().length >= min && value.length <= max;

export async function POST(request: Request) {
  if (request.headers.get('origin') !== new URL(request.url).origin || request.headers.get('sec-fetch-site') === 'cross-site') return reply('This request must come from this website.', 403);
  if (request.headers.get('content-type')?.split(';')[0].trim().toLowerCase() !== 'application/json') return reply('Please send a JSON request.', 415);
  if (Number(request.headers.get('content-length')) > 16384) return reply('Your request is too large.', 413);
  let data: Record<string, unknown>;
  try {
    const reader = request.body?.getReader();
    if (!reader) return reply('Please complete the form.', 400);
    const chunks: Uint8Array[] = [];
    let size = 0;
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 16384) { await reader.cancel(); return reply('Your request is too large.', 413); }
      chunks.push(value);
    }
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
    const parsed: unknown = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes));
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return reply('Please complete the form.', 400);
    data = parsed as Record<string, unknown>;
  } catch { return reply('We could not read your request. Please try again.', 400); }
  if (data.website !== undefined && data.website !== '') return reply('Unable to accept this submission.', 400);
  if (!text(data.name, 2, 100) || !text(data.email, 3, 254) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) || !text(data.message, 10, 3000) || data.consent !== true) return reply('Please enter your name, a valid email, your enquiry, and agree to the terms of service.', 400);
  if (!Array.isArray(data.services) || data.services.length < 1 || data.services.length > services.length || new Set(data.services).size !== data.services.length || !data.services.every(id => typeof id === 'string' && services.some(service => service.id === id))) return reply('Please choose at least one valid service.', 400);
  if (!text(data.phone, 7, 25) || !/^[+0-9 ()-]+$/.test(data.phone) || data.phone.replace(/\D/g, '').length < 7) return reply('Please enter a valid phone number including your country code.', 400);
  if (!text(data.goal, 0, 200)) return reply('Please keep your financial goal under 200 characters.', 400);
  let destination: URL;
  try {
    destination = new URL(process.env.CONTACT_WEBHOOK_URL || '');
    if (destination.protocol !== 'https:' || destination.username || destination.password) return reply(unavailable, 503);
  } catch { return reply(unavailable, 503); }
  try {
    const response = await fetch(destination, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: data.name.trim(), email: data.email.trim(), services: data.services, phone: data.phone.trim(), goal: data.goal.trim(), message: data.message.trim(), consent: true }), signal: AbortSignal.timeout(10000), redirect: 'error', cache: 'no-store' });
    await response.body?.cancel();
    if (!response.ok) return reply('Your enquiry could not be sent. Please try again later.', 502);
    return reply('Your enquiry was sent. The team will be in touch to arrange a call.', 200);
  } catch { return reply('Your enquiry could not be sent. Please try again later.', 502); }
}
