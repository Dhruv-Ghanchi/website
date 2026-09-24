'use client';

import Link from 'next/link';
import { ArrowUpRight, Check, Copy } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import type { Service, Testimonial as TestimonialRecord } from '@/lib/content';
import type { ContactPageContent, NewsletterFormCopy, SiteSettings } from '@/lib/strapi';
import { Dots, Logo, Person, useReducedMotion } from '@/components/ui';

function useSubmission(endpoint: string, successMessage: string, genericErrorMessage: string) {
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
      setMessage(error instanceof Error && error.name === 'Error' ? error.message : genericErrorMessage);
    } finally { submitting.current = false; }
  }
  return { status, message, submit, ready };
}
function Honeypot() {
  return <label className="form-honeypot" aria-hidden="true">Website<input type="text" name="website" tabIndex={-1} autoComplete="off" maxLength={200}/></label>;
}
export function ContactIntro({ siteSettings, contactPage }: { siteSettings: SiteSettings; contactPage: ContactPageContent }) {
  const reduced = useReducedMotion();
  const [copyStatus, setCopyStatus] = useState('');
  const { contactInfo } = siteSettings;
  useEffect(() => { if (!copyStatus) return; const timer = window.setTimeout(() => setCopyStatus(''), 2500); return () => window.clearTimeout(timer); }, [copyStatus]);
  const copyEmail = async () => { try { await navigator.clipboard.writeText(contactInfo.email1); setCopyStatus('Copied!'); } catch { setCopyStatus('Select the email address to copy it.'); } };
  const reveal = reduced ? {} : { opacity: 1, y: 0, scale: 1 };
  return <section className="contact-intro" aria-labelledby="contact-title"><div className="contact-intro-inner">
    <motion.div className="contact-intro-copy" initial={reduced ? false : { opacity: 0, y: 20, scale: .98 }} animate={reveal} transition={{ duration: .65, ease: [0.22, 1, 0.36, 1] }}><h1 id="contact-title">{contactPage.intro.title}</h1><p>{contactPage.intro.description}</p></motion.div>
    <motion.div className="contact-intro-details" initial={reduced ? false : { opacity: 0, y: 22 }} animate={reduced ? {} : { opacity: 1, y: 0 }} transition={{ duration: .65, delay: .12, ease: [0.22, 1, 0.36, 1] }}>
      <div className="contact-intro-primary"><a href={`tel:${contactInfo.phone1.replaceAll(' ', '')}`}>{contactInfo.phone1}</a><a className="contact-intro-extra" href={`tel:${contactInfo.phone2.replaceAll(' ', '')}`}>{contactInfo.phone2}</a><div className="contact-intro-email"><button type="button" onClick={copyEmail} aria-label={`Copy ${contactInfo.email1}`}>{copyStatus === 'Copied!' ? <Check size={15}/> : <Copy size={15}/>}</button><a href={`mailto:${contactInfo.email1}`}>{contactInfo.email1}</a><span role="status">{copyStatus}</span></div><a className="contact-intro-extra" href={`mailto:${contactInfo.email2}`}>{contactInfo.email2}</a></div>
      <div className="contact-intro-address-hours"><address><span>Address</span><strong>{siteSettings.addressLines.map(line => <span key={line}>{line}</span>)}</strong></address><div><span>{contactPage.officeHoursLabel}</span><strong>{contactPage.officeHoursText.split('\n').map((line, i) => <span key={i}>{line}<br/></span>)}</strong></div></div>
    </motion.div>
  </div></section>;
}
export function ContactSection({ asPage = false, siteSettings, contactPage, services, testimonials }: { asPage?: boolean; siteSettings: SiteSettings; contactPage: ContactPageContent; services: Service[]; testimonials: TestimonialRecord[] }) {
  const id = useId();
  const formRef = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (!asPage) return;
    const serviceId = new URLSearchParams(window.location.search).get('service');
    const service = services.find(item => item.id === serviceId);
    if (!service) return;
    const input = formRef.current?.querySelector<HTMLInputElement>(`input[name="services"][value="${service.id}"]`);
    if (input) input.checked = true;
  }, [asPage, services]);
  const Heading = 'h2';
  const form = contactPage.formCopy;
  const { status, message, submit, ready } = useSubmission('/api/contact', form.successMessage, form.genericErrorMessage);
  const testimonial = testimonials[Math.min(4, testimonials.length - 1)];
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
  return <section className={`contact-section ${asPage ? 'contact-section-page' : ''}`} id="contact" aria-labelledby={`${id}-heading`} style={siteSettings.contactBackground ? { backgroundImage: `linear-gradient(90deg, rgba(29, 76, 89, .24), rgba(26, 75, 108, .15)), url("${siteSettings.contactBackground}")` } : undefined}>
    <motion.div className="contact-section-copy" initial={reduced ? false : { opacity: 0, y: 36 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .1 }} transition={{ duration: .7, ease: [0.22, 1, 0.36, 1] }}><div><Heading id={`${id}-heading`}>{contactPage.sectionHeading.split('\n').map((line, i) => <span key={i}>{line}<br/></span>)}</Heading><ul className="contact-section-benefits">{contactPage.benefits.map(benefit => <li key={benefit}><span><Check size={14} aria-hidden="true"/></span>{benefit}</li>)}</ul></div>{testimonial && <div className="contact-section-testimonial"><Dots/><blockquote>“{testimonial.quote}”</blockquote><Person {...testimonial}/></div>}</motion.div>
    <motion.div className="contact-section-right" initial={reduced ? false : { opacity: 0, y: 40, scale: .98 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true, amount: .08 }} transition={{ duration: .7, delay: .08, ease: [0.22, 1, 0.36, 1] }}><form ref={formRef} className="contact-form" action="/api/contact" method="post" onSubmit={onSubmit} noValidate={ready} aria-label="Contact Ghanchi Investments" aria-busy={busy}>
      <Logo src={siteSettings.logo} alt={siteSettings.logoAlt} link={false}/><p className="contact-form-intro">{form.introText}</p><Honeypot/>
      <div className="contact-form-fields"><div className="contact-form-row"><label htmlFor={`${id}-name`}>{form.nameLabel}<input id={`${id}-name`} name="name" placeholder={form.namePlaceholder} autoComplete="name" required minLength={2} maxLength={100} onInput={event => event.currentTarget.setCustomValidity('')}/></label><label htmlFor={`${id}-email`}>{form.emailLabel}<input id={`${id}-email`} name="email" type="email" placeholder={form.emailPlaceholder} autoComplete="email" required maxLength={254}/></label></div>
      <label htmlFor={`${id}-phone`}>{form.phoneLabel}<input id={`${id}-phone`} name="phone" type="tel" autoComplete="tel" placeholder={form.phonePlaceholder} required minLength={7} maxLength={25} pattern={String.raw`[+0-9 \(\)\-]{7,25}`}/></label>
      <fieldset><legend>{form.servicesLegend}</legend><div className="contact-form-pills">{services.map(service => <label className="contact-form-pill" key={service.id}><input type="checkbox" name="services" value={service.id} onChange={event => event.currentTarget.form?.querySelector<HTMLInputElement>('input[name="services"]')?.setCustomValidity('')}/><span>{service.title}</span></label>)}</div></fieldset>
      <label htmlFor={`${id}-goal`}>{form.goalLabel}<input id={`${id}-goal`} name="goal" maxLength={200} placeholder={form.goalPlaceholder}/></label>
      <label htmlFor={`${id}-message`}>{form.messageLabel}<textarea id={`${id}-message`} name="message" placeholder={form.messagePlaceholder} required minLength={10} maxLength={3000} rows={4} onInput={event => event.currentTarget.setCustomValidity('')}/></label>
      <label className="contact-form-consent"><input type="checkbox" name="consent" required/><span>{form.consentText} <Link href="/privacy-policy">privacy policy</Link> and <Link href="/terms-of-service">terms of service</Link>.</span></label></div>
      <div className="contact-form-actions"><p>{form.actionsNote.split('\n').map((line, i) => <span key={i}>{line}<br/></span>)}</p><button type="submit" disabled={!ready || busy || status === 'success'}>{busy ? form.sendingLabel : status === 'success' ? form.successLabel : form.submitLabel}<span aria-hidden="true"><ArrowUpRight size={13}/></span></button></div><div className={`contact-form-message ${status}`} role={status === 'error' ? 'alert' : 'status'} aria-live={status === 'error' ? 'assertive' : 'polite'}>{message}</div>
    </form><div className="contact-section-stats">{contactPage.stats.map(stat => <div key={stat.label}><strong>{stat.value.toLocaleString('en-IN')}{stat.suffix}</strong><span>{stat.label.split('\n').map((line, i) => <span key={i}>{line}<br/></span>)}</span></div>)}</div></motion.div>
  </section>;
}
export function NewsletterForm({ copy }: { copy: NewsletterFormCopy }) {
  const id = useId();
  const { status, message, submit, ready } = useSubmission('/api/newsletter', copy.successMessage, copy.genericErrorMessage);
  const busy = status === 'loading';
  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    void submit({ email: data.get('email'), consent: data.get('consent') === 'on', website: data.get('website') });
  }
  return <form className="newsletter-form" action="/api/newsletter" method="post" aria-label="Newsletter subscription" aria-busy={busy} onSubmit={onSubmit}><Honeypot/><label className="newsletter-form-label" htmlFor={`${id}-email`}>{copy.label}</label><div className="newsletter-form-row"><input id={`${id}-email`} name="email" type="email" placeholder={copy.placeholder} autoComplete="email" required maxLength={254}/><button type="submit" disabled={!ready || busy || status === 'success'} aria-label={busy ? 'Subscribing' : 'Subscribe to newsletter'}>{busy ? copy.sendingLabel : status === 'success' ? copy.successLabel : copy.submitLabel}</button></div><label className="newsletter-form-consent"><input type="checkbox" name="consent" required/><span>{copy.consentText} <Link href="/privacy-policy">privacy policy</Link>.</span></label><div className={`newsletter-form-message ${status}`} role={status === 'error' ? 'alert' : 'status'} aria-live={status === 'error' ? 'assertive' : 'polite'}>{message}</div></form>;
}
