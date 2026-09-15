"use client";

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion, MotionConfig, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { ArrowUpRight, Check, Copy, Facebook, Instagram, Linkedin, Menu, Minus, X } from 'lucide-react';
import { asset, images, legalPages } from '@/lib/content';
import { BrandMark, Logo, Person } from './ui';
import { NewsletterForm } from './contact';

const navigation = [{ title: 'Case studies', href: '/cases' }, { title: 'Insights', href: '/insights' }, { title: 'About us', href: '/about' }, { title: 'Contact', href: '/contact' }];
export function MotionProvider({ children }: { children: React.ReactNode }) { return <MotionConfig reducedMotion="user">{children}</MotionConfig>; }
export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 350], [1, 0]);
  useEffect(() => { const close = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false); }; window.addEventListener('keydown', close); return () => window.removeEventListener('keydown', close); }, []);
  return <header className="site-header"><a className="skip-link" href="#main">Skip to content</a><div className="nav-pill"><Logo /><nav aria-label="Main navigation" className="desktop-nav">{navigation.map(link => <Link key={link.href} href={link.href} aria-current={pathname === link.href ? 'page' : undefined}>{link.title}</Link>)}</nav><button className="menu-toggle" aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(!open)}>{open ? <X size={24} /> : <Menu size={24} />}</button></div><motion.div style={{ opacity: pathname === '/' ? opacity : 1 }} className="header-call"><Link href="/contact"><span>Book a call</span><span className="call-minus"><Minus size={17} /></span><img src={asset('JDU4AEuAWM8QYjfyZ91Xs9q0Cu8.jpg')} alt="" /></Link></motion.div><AnimatePresence>{open && <motion.nav id="mobile-navigation" aria-label="Mobile navigation" className="mobile-navigation" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>{navigation.map(link => <Link href={link.href} key={link.href} onClick={() => setOpen(false)}>{link.title}<ArrowUpRight size={22}/></Link>)}<Link href="/#services" onClick={() => setOpen(false)}>Our services<ArrowUpRight size={22}/></Link><Link href="/contact" className="mobile-book" onClick={() => setOpen(false)}>Book a call<BrandMark/></Link></motion.nav>}</AnimatePresence></header>;
}
export function Footer() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] });
  const scale = useTransform(scrollYProgress, [0, 1], [0.85, 1]);
  const circleScale = useTransform(scrollYProgress, [0, 1], [1, 10]);
  const [copyStatus, setCopyStatus] = useState('');
  useEffect(() => {
    if (!copyStatus) return;
    const timer = window.setTimeout(() => setCopyStatus(''), 2500);
    return () => window.clearTimeout(timer);
  }, [copyStatus]);
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText('hello@kora.com');
      setCopyStatus('Copied!');
    } catch {
      setCopyStatus('Select the email address to copy it.');
    }
  };
  return <footer className="site-footer" ref={ref}><div className="footer-reveal" aria-hidden="true"><motion.div className="footer-circle" style={reduced ? {} : { scale: circleScale }}/></div><motion.div className="footer-card" style={reduced ? {} : { scale }}><div className="footer-top"><div><Logo/><address>2847 Mission Street<br/>San Francisco, CA 94110</address><h2>Subscribe to<br className="desktop-break"/> our newsletter.</h2><NewsletterForm/></div><div className="footer-message"><h3><span>Stalled revenue, leaky funnels, stretched leadership.</span> Whatever’s holding you back, let’s solve it.</h3><Person image={images.founder} name="Koraline Spencer" role="Founder & CEO" badge/><a href="tel:5108956500" className="footer-phone">(510) 895-6500</a><div className="footer-email"><button type="button" onClick={copyEmail} aria-label="Copy email address">{copyStatus === 'Copied!' ? <Check size={17}/> : <Copy size={17}/>}</button><a href="mailto:hello@kora.com">hello@kora.com</a><span className="footer-copy-status" role="status">{copyStatus}</span></div></div></div><div className="footer-links"><div className="footer-social-legal"><p className="eyebrow">Socials</p><div className="social-links">{[{ name: 'X', href: 'https://x.com/', Icon: X }, { name: 'LinkedIn', href: 'https://linkedin.com/', Icon: Linkedin }, { name: 'Instagram', href: 'https://instagram.com/', Icon: Instagram }, { name: 'Facebook', href: 'https://facebook.com/', Icon: Facebook }].map(({ name, href, Icon }) => <a key={name} href={href} aria-label={name}><Icon className="social-icon-default" size={20}/><Icon className="social-icon-hover" size={20} aria-hidden="true"/></a>)}</div><p className="eyebrow legal-label">Legal</p><div className="legal-links">{legalPages.map(page => <Link href={`/${page.id}`} key={page.id}>{page.title}</Link>)}</div></div><div className="footer-navigation"><p className="eyebrow">Navigation</p><nav aria-label="Footer navigation">{navigation.map(link => <Link href={link.href} key={link.href} aria-label={link.title}><span className="footer-nav-dot"/><span className="footer-nav-text"><span className="footer-nav-default">{link.title === 'Case studies' ? 'Case Studies' : link.title}</span><span className="footer-nav-hover" aria-hidden="true">{link.title === 'Case studies' ? 'Case Studies' : link.title}</span></span></Link>)}</nav></div></div><div className="footer-bottom"><Link href="/" className="footer-wordmark" aria-label="Kora home">kora</Link><span>© {new Date().getFullYear()} Kora All rights reserved.</span></div></motion.div></footer>;
}
