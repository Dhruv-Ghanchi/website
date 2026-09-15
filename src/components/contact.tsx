'use client';

import Link from 'next/link';
import { ArrowUpRight, Check } from 'lucide-react';
import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import { images, services } from '@/lib/content';
import { Dots, Logo, Person } from '@/components/ui';

const revenues = ['Under $1M', '$1M–$5M', '$5M–$20M', '$20M+'];
const enquirySuccess = 'Your enquiry was sent. The team will be in touch to arrange a call.';

function useSubmission(endpoint: string, successMessage: string) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const submitting = useRef(false);
  const [ready, setReady] = useState(false);
  useEffect(() => { setReady(true); }, []);
  async function submit(payload: Record<string, unknown>) {
    if (submitting.current) return;
    submitting.current = true;
    setStatus('loading');
    setMessage('');
    try {
      const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), signal: AbortSignal.timeout(15000) });
      const result = await response.json();
      if (!response.ok) throw new Error(typeof result.message === 'string' ? result.message : 'We could not send your details. Please try again.');
      setStatus('success');
      setMessage(successMessage);
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error && error.name === 'Error' ? error.message : 'We could not connect. Please try again in a moment.');
    } finally {
      submitting.current = false;
    }
  }
  return { status, message, submit, ready };
}

function Honeypot() {
  return <label className="form-honeypot" aria-hidden="true">Website<input type="text" name="website" tabIndex={-1} autoComplete="off" maxLength={200} /></label>;
}

export function ContactSection({ asPage = false }: { asPage?: boolean }) {
  const id = useId();
  const formRef = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (!asPage) return;
    const serviceId = new URLSearchParams(window.location.search).get('service');
    const service = services.find(item => item.id === serviceId);
    if (!service) return;
    const input = formRef.current?.querySelector<HTMLInputElement>(`input[name="services"][value="${service.id}"]`);
    if (input) input.checked = true;
  }, [asPage]);
  const Heading = asPage ? 'h1' : 'h2';
  const { status, message, submit, ready } = useSubmission('/api/contact', enquirySuccess);
  const testimonial = services.find(service => service.id === 'sales-optimization')!.testimonial;
  const busy = status === 'loading';
  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const selected = data.getAll('services');
    const firstService = form.querySelector<HTMLInputElement>('input[name="services"]');
    firstService?.setCustomValidity(selected.length ? '' : 'Please select at least one service.');
    const nameInput = form.elements.namedItem('name') as HTMLInputElement;
    nameInput.setCustomValidity(String(data.get('name') || '').trim().length >= 2 ? '' : 'Please enter your full name.');
    const challengeInput = form.elements.namedItem('challenge') as HTMLTextAreaElement;
    challengeInput.setCustomValidity(String(data.get('challenge') || '').trim().length >= 10 ? '' : 'Please tell us a little more (at least 10 characters).');
    if (!form.reportValidity()) return;
    void submit({ name: data.get('name'), email: data.get('email'), services: selected, revenue: data.get('revenue'), challenge: data.get('challenge'), consent: data.get('consent') === 'on', website: data.get('website') });
  }
  return <section className="contact-section" id="contact" aria-labelledby={`${id}-heading`} style={{ backgroundImage: `linear-gradient(90deg, rgba(29, 76, 89, .24), rgba(26, 75, 108, .15)), url("${images.contact}")` }}>
    <div className="contact-section-copy">
      <div>
        <Heading id={`${id}-heading`}>Let’s find<br />your next<br />growth lever.</Heading>
        <ul className="contact-section-benefits">
          {['Actionable growth roadmap', 'Channel & funnel diagnostics', 'Clear next steps & timeline'].map(benefit => <li key={benefit}><span><Check size={14} aria-hidden="true" /></span>{benefit}</li>)}
        </ul>
      </div>
      <div className="contact-section-testimonial"><Dots /><blockquote>“What sets Kora apart is their commitment to building our capabilities, not creating dependency.”</blockquote><Person image={testimonial.image} name={testimonial.name} role={testimonial.role} /></div>
    </div>
    <div className="contact-section-right">
      <form ref={formRef} className="contact-form" action="/api/contact" method="post" onSubmit={onSubmit} noValidate={ready} aria-label="Book a call" aria-busy={busy}>
        <Logo link={false} />
        <p className="contact-form-intro">No pitch decks, no pressure. Tell us where you are and we’ll share how we can help.</p>
        <Honeypot />
        <div className="contact-form-fields">
          <div className="contact-form-row">
            <label htmlFor={`${id}-name`}>Name<input id={`${id}-name`} name="name" placeholder="Your full name" autoComplete="name" required minLength={2} maxLength={100} onInput={event => event.currentTarget.setCustomValidity('')} /></label>
            <label htmlFor={`${id}-email`}>Email<input id={`${id}-email`} name="email" type="email" placeholder="name@company.com" autoComplete="email" required maxLength={254} /></label>
          </div>
          <fieldset><legend>What services are you interested in?</legend><div className="contact-form-pills">{services.map(service => <label className="contact-form-pill" key={service.id}><input type="checkbox" name="services" value={service.id} onChange={event => event.currentTarget.form?.querySelector<HTMLInputElement>('input[name="services"]')?.setCustomValidity('')} /><span>{service.title}</span></label>)}</div></fieldset>
          <fieldset><legend>Annual revenue</legend><div className="contact-form-pills">{revenues.map(revenue => <label className="contact-form-pill" key={revenue}><input type="radio" name="revenue" value={revenue} required /><span>{revenue}</span></label>)}</div></fieldset>
          <label htmlFor={`${id}-challenge`}>Biggest growth challenge?<textarea id={`${id}-challenge`} name="challenge" placeholder="We’ve plateaued at $8M ARR…" required minLength={10} maxLength={3000} rows={4} onInput={event => event.currentTarget.setCustomValidity('')} /></label>
          <label className="contact-form-consent"><input type="checkbox" name="consent" required /><span>By submitting, you agree to our <Link href="/terms-of-service">terms of service</Link>.</span></label>
        </div>
        <div className="contact-form-actions"><p>Let’s start with a conversation.<br />No commitment required.</p><button type="submit" disabled={!ready || busy || status === 'success'}>{busy ? 'Sending…' : status === 'success' ? 'Enquiry sent' : 'Book a call'}<span aria-hidden="true"><ArrowUpRight size={13} /></span></button></div>
        <div className={`contact-form-message ${status}`} role={status === 'error' ? 'alert' : 'status'} aria-live={status === 'error' ? 'assertive' : 'polite'}>{message}</div>
      </form>
      <div className="contact-section-stats"><div><strong>40+</strong><span>Long-term<br />partnerships.</span></div><div><strong>99%</strong><span>Satisfaction<br />Rate.</span></div></div>
    </div>
  </section>;
}

export function NewsletterForm() {
  const id = useId();
  const { status, message, submit, ready } = useSubmission('/api/newsletter', 'Your subscription request was sent. Please check your inbox for any next steps.');
  const busy = status === 'loading';
  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    void submit({ email: data.get('email'), consent: data.get('consent') === 'on', website: data.get('website') });
  }
  return <form className="newsletter-form" action="/api/newsletter" method="post" aria-label="Newsletter subscription" aria-busy={busy} onSubmit={onSubmit}>
    <Honeypot />
    <label className="newsletter-form-label" htmlFor={`${id}-email`}>Email address</label>
    <div className="newsletter-form-row"><input id={`${id}-email`} name="email" type="email" placeholder="Your email address" autoComplete="email" required maxLength={254} /><button type="submit" disabled={!ready || busy || status === 'success'} aria-label={busy ? 'Subscribing' : 'Subscribe to newsletter'}>{busy ? 'Sending…' : status === 'success' ? 'Sent' : 'Subscribe'}</button></div>
    <label className="newsletter-form-consent"><input type="checkbox" name="consent" required /><span>I agree to receive the newsletter and accept the <Link href="/privacy-policy">privacy policy</Link>.</span></label>
    <div className={`newsletter-form-message ${status}`} role={status === 'error' ? 'alert' : 'status'} aria-live={status === 'error' ? 'assertive' : 'polite'}>{message}</div>
  </form>;
}
