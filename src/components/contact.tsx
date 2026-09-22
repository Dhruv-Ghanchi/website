'use client';

import Link from 'next/link';
import { ArrowUpRight, Check, Copy } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import { contactInfo, images, services, testimonials } from '@/lib/content';
import { Dots, Logo, Person, useReducedMotion } from '@/components/ui';

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
    } finally { submitting.current = false; }
  }
  return { status, message, submit, ready };
}
function Honeypot() {
  return <label className="form-honeypot" aria-hidden="true">Website<input type="text" name="website" tabIndex={-1} autoComplete="off" maxLength={200}/></label>;
}
export function ContactIntro() {
  const reduced = useReducedMotion();
  const [copyStatus, setCopyStatus] = useState('');
  useEffect(() => { if (!copyStatus) return; const timer = window.setTimeout(() => setCopyStatus(''), 2500); return () => window.clearTimeout(timer); }, [copyStatus]);
  const copyEmail = async () => { try { await navigator.clipboard.writeText(contactInfo.email1); setCopyStatus('Copied!'); } catch { setCopyStatus('Select the email address to copy it.'); } };
  const reveal = reduced ? {} : { opacity: 1, y: 0, scale: 1 };
  return <section className="contact-intro" aria-labelledby="contact-title"><div className="contact-intro-inner">
    <motion.div className="contact-intro-copy" initial={reduced ? false : { opacity: 0, y: 20, scale: .98 }} animate={reveal} transition={{ duration: .65, ease: [0.22, 1, 0.36, 1] }}><h1 id="contact-title">Contact.</h1><p>Call us or send us a message about your financial goals. We’re here to help.</p></motion.div>
    <motion.div className="contact-intro-details" initial={reduced ? false : { opacity: 0, y: 22 }} animate={reduced ? {} : { opacity: 1, y: 0 }} transition={{ duration: .65, delay: .12, ease: [0.22, 1, 0.36, 1] }}>
      <div className="contact-intro-primary"><a href={`tel:${contactInfo.phone1.replaceAll(' ', '')}`}>{contactInfo.phone1}</a><a className="contact-intro-extra" href={`tel:${contactInfo.phone2.replaceAll(' ', '')}`}>{contactInfo.phone2}</a><div className="contact-intro-email"><button type="button" onClick={copyEmail} aria-label={`Copy ${contactInfo.email1}`}>{copyStatus === 'Copied!' ? <Check size={15}/> : <Copy size={15}/>}</button><a href={`mailto:${contactInfo.email1}`}>{contactInfo.email1}</a><span role="status">{copyStatus}</span></div><a className="contact-intro-extra" href={`mailto:${contactInfo.email2}`}>{contactInfo.email2}</a></div>
      <div className="contact-intro-address-hours"><address><span>Address</span><strong>{contactInfo.addressLines.map(line => <span key={line}>{line}</span>)}</strong></address><div><span>Office Hours</span><strong>Monday to Friday:<br/>9:00 AM – 6:00 PM</strong></div></div>
    </motion.div>
  </div></section>;
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
  const Heading = 'h2';
  const { status, message, submit, ready } = useSubmission('/api/contact', enquirySuccess);
  const testimonial = testimonials[4];
  const busy = status === 'loading';
  const reduced = useReducedMotion();
  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const selected = data.getAll('services');
    form.querySelector<HTMLInputElement>('input[name="services"]')?.setCustomValidity(selected.length ? '' : 'Please select at least one service.');
    const nameInput = form.elements.namedItem('name') as HTMLInputElement;
    nameInput.setCustomValidity(String(data.get('name') || '').trim().length >= 2 ? '' : 'Please enter your full name.');
    const messageInput = form.elements.namedItem('message') as HTMLTextAreaElement;
    messageInput.setCustomValidity(String(data.get('message') || '').trim().length >= 10 ? '' : 'Please tell us a little more (at least 10 characters).');
    if (!form.reportValidity()) return;
    void submit({ name: data.get('name'), email: data.get('email'), phone: data.get('phone'), services: selected, goal: data.get('goal'), message: data.get('message'), consent: data.get('consent') === 'on', website: data.get('website') });
  }
  return <section className={`contact-section ${asPage ? 'contact-section-page' : ''}`} id="contact" aria-labelledby={`${id}-heading`} style={{ backgroundImage: `linear-gradient(90deg, rgba(29, 76, 89, .24), rgba(26, 75, 108, .15)), url("${images.contact}")` }}>
    <motion.div className="contact-section-copy" initial={reduced ? false : { opacity: 0, y: 36 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .1 }} transition={{ duration: .7, ease: [0.22, 1, 0.36, 1] }}><div><Heading id={`${id}-heading`}>Let’s plan<br/>your next<br/>chapter.</Heading><ul className="contact-section-benefits">{['Goal-based financial planning', 'Protection for your family', 'Implementation & annual review'].map(benefit => <li key={benefit}><span><Check size={14} aria-hidden="true"/></span>{benefit}</li>)}</ul></div><div className="contact-section-testimonial"><Dots/><blockquote>“{testimonial.quote}”</blockquote><Person {...testimonial}/></div></motion.div>
    <motion.div className="contact-section-right" initial={reduced ? false : { opacity: 0, y: 40, scale: .98 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true, amount: .08 }} transition={{ duration: .7, delay: .08, ease: [0.22, 1, 0.36, 1] }}><form ref={formRef} className="contact-form" action="/api/contact" method="post" onSubmit={onSubmit} noValidate={ready} aria-label="Contact Ghanchi Investments" aria-busy={busy}>
      <Logo link={false}/><p className="contact-form-intro">Tell us about your goals and the support you are looking for.</p><Honeypot/>
      <div className="contact-form-fields"><div className="contact-form-row"><label htmlFor={`${id}-name`}>Name<input id={`${id}-name`} name="name" placeholder="Your full name" autoComplete="name" required minLength={2} maxLength={100} onInput={event => event.currentTarget.setCustomValidity('')}/></label><label htmlFor={`${id}-email`}>Email<input id={`${id}-email`} name="email" type="email" placeholder="Your email address" autoComplete="email" required maxLength={254}/></label></div>
      <label htmlFor={`${id}-phone`}>Phone<input id={`${id}-phone`} name="phone" type="tel" autoComplete="tel" placeholder="Include your country code" required minLength={7} maxLength={25} pattern={String.raw`[+0-9 \(\)\-]{7,25}`}/></label>
      <fieldset><legend>What services are you interested in?</legend><div className="contact-form-pills">{services.map(service => <label className="contact-form-pill" key={service.id}><input type="checkbox" name="services" value={service.id} onChange={event => event.currentTarget.form?.querySelector<HTMLInputElement>('input[name="services"]')?.setCustomValidity('')}/><span>{service.title}</span></label>)}</div></fieldset>
      <label htmlFor={`${id}-goal`}>Financial goal (optional)<input id={`${id}-goal`} name="goal" maxLength={200} placeholder="For example, planning for retirement"/></label>
      <label htmlFor={`${id}-message`}>Your enquiry<textarea id={`${id}-message`} name="message" placeholder="How can we help? Please do not include account credentials or sensitive documents." required minLength={10} maxLength={3000} rows={4} onInput={event => event.currentTarget.setCustomValidity('')}/></label>
      <label className="contact-form-consent"><input type="checkbox" name="consent" required/><span>By submitting, you consent to being contacted about this enquiry and accept our <Link href="/privacy-policy">privacy policy</Link> and <Link href="/terms-of-service">terms of service</Link>.</span></label></div>
      <div className="contact-form-actions"><p>Let’s start with a conversation.<br/>No commitment required.</p><button type="submit" disabled={!ready || busy || status === 'success'}>{busy ? 'Sending…' : status === 'success' ? 'Enquiry sent' : 'Send enquiry'}<span aria-hidden="true"><ArrowUpRight size={13}/></span></button></div><div className={`contact-form-message ${status}`} role={status === 'error' ? 'alert' : 'status'} aria-live={status === 'error' ? 'assertive' : 'polite'}>{message}</div>
    </form><div className="contact-section-stats"><div><strong>1,200+</strong><span>Clients<br/>served.</span></div><div><strong>15+</strong><span>Years of<br/>experience.</span></div></div></motion.div>
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
  return <form className="newsletter-form" action="/api/newsletter" method="post" aria-label="Newsletter subscription" aria-busy={busy} onSubmit={onSubmit}><Honeypot/><label className="newsletter-form-label" htmlFor={`${id}-email`}>Email address</label><div className="newsletter-form-row"><input id={`${id}-email`} name="email" type="email" placeholder="Your email address" autoComplete="email" required maxLength={254}/><button type="submit" disabled={!ready || busy || status === 'success'} aria-label={busy ? 'Subscribing' : 'Subscribe to newsletter'}>{busy ? 'Sending…' : status === 'success' ? 'Sent' : 'Subscribe'}</button></div><label className="newsletter-form-consent"><input type="checkbox" name="consent" required/><span>I agree to receive the newsletter and accept the <Link href="/privacy-policy">privacy policy</Link>.</span></label><div className={`newsletter-form-message ${status}`} role={status === 'error' ? 'alert' : 'status'} aria-live={status === 'error' ? 'assertive' : 'polite'}>{message}</div></form>;
}
