const unavailable = 'This preview is not connected to a newsletter service yet. Please try again once the newsletter is configured.';
const reply = (message: string, status: number) => Response.json({ message }, { status, headers: { 'Cache-Control': 'no-store' } });

export async function POST(request: Request) {
  if (request.headers.get('origin') !== new URL(request.url).origin || request.headers.get('sec-fetch-site') === 'cross-site') return reply('This request must come from this website.', 403);
  if (request.headers.get('content-type')?.split(';')[0].trim().toLowerCase() !== 'application/json') return reply('Please send a JSON request.', 415);
  if (Number(request.headers.get('content-length')) > 2048) return reply('Your request is too large.', 413);
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
      if (size > 2048) { await reader.cancel(); return reply('Your request is too large.', 413); }
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
  if (typeof data.email !== 'string' || data.email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) || data.consent !== true) return reply('Please enter a valid email and agree to receive the newsletter.', 400);
  let destination: URL;
  try {
    destination = new URL(process.env.NEWSLETTER_WEBHOOK_URL || '');
    if (destination.protocol !== 'https:' || destination.username || destination.password) return reply(unavailable, 503);
  } catch { return reply(unavailable, 503); }
  try {
    const response = await fetch(destination, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: data.email.trim(), consent: true }), signal: AbortSignal.timeout(10000), redirect: 'error', cache: 'no-store' });
    await response.body?.cancel();
    if (!response.ok) return reply('Your subscription request could not be sent. Please try again later.', 502);
    return reply('Your subscription request was sent. Please check your inbox for any next steps.', 200);
  } catch { return reply('Your subscription request could not be sent. Please try again later.', 502); }
}
