"use client";

import { useEffect, useId, useRef, useState, type MouseEvent as ReactMouseEvent } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion, MotionConfig, useMotionValueEvent, useScroll, useTransform } from 'motion/react';
import { ArrowUpRight, Check, ChevronDown, Copy, Facebook, Instagram, Linkedin, Mail, Menu, Minus, Phone, Youtube, X } from 'lucide-react';
import { contactInfo, images, legalPages, navigation, socialLinks, type NavItem } from '@/lib/content';
import { BrandMark, Logo, Person, useReducedMotion } from './ui';
import { NewsletterForm } from './contact';

function NavDropdown({ item, mobile = false, onHoverItem }: { item: NavItem; mobile?: boolean; onHoverItem?: (el: HTMLElement | null) => void }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const id = useId();
  const button = useRef<HTMLButtonElement>(null);
  const container = useRef<HTMLDivElement>(null);
  useEffect(() => { const close = (event: PointerEvent) => { if (!container.current?.contains(event.target as Node)) setOpen(false); }; document.addEventListener('pointerdown', close); return () => document.removeEventListener('pointerdown', close); }, []);
  const current = pathname === item.href || (item.href !== '/' && pathname.startsWith(`${item.href}/`));
  const hoverProps = mobile ? {} : { onMouseEnter: (event: ReactMouseEvent<HTMLElement>) => onHoverItem?.(event.currentTarget), onMouseLeave: () => onHoverItem?.(null) };
  if (!item.children) return <Link href={item.href} aria-current={current ? 'page' : undefined} {...hoverProps}>{item.title}{mobile && <ArrowUpRight size={22}/>}</Link>;
  return <div ref={container} className={mobile ? 'mobile-nav-group' : 'nav-dropdown'} onMouseEnter={event => { if (!mobile) { setOpen(true); onHoverItem?.(event.currentTarget); } }} onMouseLeave={() => { if (!mobile) { if (!container.current?.contains(document.activeElement)) setOpen(false); onHoverItem?.(null); } }} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false); }} onKeyDown={event => { if (event.key === 'Escape' && open && !mobile) { event.stopPropagation(); setOpen(false); button.current?.focus(); } }}>
    <div className="nav-parent"><Link href={item.href} aria-current={current ? 'page' : undefined} onClick={() => setOpen(false)}>{item.title}</Link><button ref={button} aria-label={`Toggle ${item.title} links`} aria-expanded={open} aria-controls={id} onClick={() => setOpen(mobile ? !open : true)}><ChevronDown size={15}/></button></div>
    <AnimatePresence initial={false}>{open && <motion.div id={id} className={mobile ? 'mobile-nav-children' : 'nav-dropdown-menu'} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.15 }}>{item.children.map(child => child.href.startsWith('https:') ? <a key={child.href} href={child.href} target="_blank" rel="noreferrer" onClick={() => setOpen(false)}>{child.title} <ArrowUpRight size={14}/></a> : <Link key={child.href} href={child.href} onClick={() => setOpen(false)}>{child.title}</Link>)}</motion.div>}</AnimatePresence>
  </div>;
}
export function MotionProvider({ children }: { children: React.ReactNode }) { return <MotionConfig reducedMotion="user">{children}</MotionConfig>; }
export function Header() {
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 350], [1, 0]);
  const [ctaHidden, setCtaHidden] = useState(false);
  useMotionValueEvent(scrollY, 'change', value => setCtaHidden(pathname === '/' && value >= 340));
  const [pill, setPill] = useState<{ left: number; top: number; width: number; height: number } | null>(null);
  const handleHover = (el: HTMLElement | null) => {
    if (!el || !navRef.current) { setPill(null); return; }
    const navRect = navRef.current.getBoundingClientRect();
    const rect = el.getBoundingClientRect();
    setPill({ left: rect.left - navRect.left, top: rect.top - navRect.top, width: rect.width, height: rect.height });
  };
  return <header className="site-header" onKeyDown={event => { if (event.key === 'Escape' && open) { setOpen(false); menuButton.current?.focus(); } }}>
    <a className="skip-link" href="#main">Skip to content</a>
    <AnimatePresence>{pill && <motion.div key="navdim" className="nav-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} aria-hidden="true"/>}</AnimatePresence>
    <div className={`nav-pill ${open ? 'nav-pill-expanded' : ''}`}>
      <Logo/>
      <nav aria-label="Main navigation" className="desktop-nav" ref={navRef} onMouseLeave={() => handleHover(null)}>
        <AnimatePresence>{pill && <motion.div key="navpill" className="nav-hover-pill" initial={{ opacity: 0 }} animate={{ opacity: 1, left: pill.left, top: pill.top, width: pill.width, height: pill.height }} exit={{ opacity: 0 }} transition={{ type: 'spring', stiffness: 500, damping: 35 }} aria-hidden="true"/>}</AnimatePresence>
        {navigation.map(item => <NavDropdown key={item.href} item={item} onHoverItem={handleHover}/>)}
      </nav>
      <button ref={menuButton} className="menu-toggle" aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(!open)}>{open ? <X size={24}/> : <Menu size={24}/>}</button>
    </div>
    <motion.div style={{ opacity: pathname === '/' ? opacity : 1, pointerEvents: ctaHidden ? 'none' : 'auto' }} className="header-call">
      <Link href="/contact-us" aria-hidden={ctaHidden || undefined} tabIndex={ctaHidden ? -1 : undefined}><span>Get in touch</span><span className="call-minus"><Minus size={17}/></span><img src={images.founder} alt=""/></Link>
    </motion.div>
    <AnimatePresence>{open && <motion.nav id="mobile-navigation" aria-label="Mobile navigation" className="mobile-navigation" onClick={event => { if ((event.target as Element).closest('a')) setOpen(false); }} initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
      {navigation.map(item => <NavDropdown key={item.href} item={item} mobile/>)}
      <div className="mobile-nav-contact">
        <a href={`tel:${contactInfo.phone1.replaceAll(' ', '')}`}><Phone size={15}/>{contactInfo.phone1}</a>
        <a href={`mailto:${contactInfo.email1}`}><Mail size={15}/>{contactInfo.email1}</a>
      </div>
      <Link href="/contact-us" className="mobile-book">Get in touch<BrandMark/></Link>
    </motion.nav>}</AnimatePresence>
  </header>;
}
export function Footer() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] });
  const scale = useTransform(scrollYProgress, [0, 1], [0.85, 1]);
  const circleScale = useTransform(scrollYProgress, [0, 1], [1, 10]);
  const [copyStatus, setCopyStatus] = useState('');
  useEffect(() => { if (!copyStatus) return; const timer = window.setTimeout(() => setCopyStatus(''), 2500); return () => window.clearTimeout(timer); }, [copyStatus]);
  const copyEmail = async () => { try { await navigator.clipboard.writeText(contactInfo.email1); setCopyStatus('Copied!'); } catch { setCopyStatus('Select the email address to copy it.'); } };
  const socialIcons = { Facebook, Instagram, LinkedIn: Linkedin, YouTube: Youtube };
  return <footer className="site-footer" ref={ref}><div className="footer-reveal" aria-hidden="true"><motion.div className="footer-circle" style={reduced ? {} : { scale: circleScale }}/></div><motion.div className="footer-card" style={reduced ? {} : { scale }}><div className="footer-top"><div><Logo/><address>{contactInfo.addressLines.map(line => <span key={line}>{line}<br/></span>)}</address><h2>Subscribe to<br className="desktop-break"/> our newsletter.</h2><NewsletterForm/></div><div className="footer-message"><h3><span>Making goal-based financial advice accessible to all.</span> Let’s plan your financial future together.</h3><Person image={images.founder} name="Chandrakant B. Ghanchi" role="Founder & Financial Planner" badge/><a href={`tel:${contactInfo.phone1.replaceAll(' ', '')}`} className="footer-phone">{contactInfo.phone1}</a><a href={`tel:${contactInfo.phone2.replaceAll(' ', '')}`} className="footer-phone">{contactInfo.phone2}</a><div className="footer-email"><button type="button" onClick={copyEmail} aria-label="Copy email address">{copyStatus === 'Copied!' ? <Check size={17}/> : <Copy size={17}/>}</button><a href={`mailto:${contactInfo.email1}`}>{contactInfo.email1}</a><span className="footer-copy-status" role="status">{copyStatus}</span></div><a className="footer-secondary-email" href={`mailto:${contactInfo.email2}`}>{contactInfo.email2}</a></div></div><div className="footer-links"><div className="footer-social-legal"><p className="eyebrow">Socials</p><div className="social-links">{socialLinks.map(({ name, href }) => { const Icon = socialIcons[name as keyof typeof socialIcons]; return <a key={name} href={href} aria-label={name} target="_blank" rel="noreferrer"><Icon className="social-icon-default" size={20}/><Icon className="social-icon-hover" size={20} aria-hidden="true"/></a>; })}</div><p className="eyebrow legal-label">Legal</p><div className="legal-links">{legalPages.map(page => <Link href={`/${page.id}`} key={page.id}>{page.title}</Link>)}</div></div><div className="footer-navigation"><p className="eyebrow">Navigation</p><nav aria-label="Footer navigation">{navigation.map(link => <Link href={link.href} key={link.href}><span className="footer-nav-dot" aria-hidden="true"/><span className="footer-nav-text"><span className="footer-nav-default">{link.title}</span><span className="footer-nav-hover" aria-hidden="true">{link.title}</span></span></Link>)}</nav></div></div><p className="footer-disclosure">Mutual fund investments are subject to market risks. Read all scheme-related documents carefully. Insurance benefits are subject to policy terms.</p><div className="footer-bottom"><strong className="footer-wordmark" aria-hidden="true">ghanchi</strong><span>© {new Date().getFullYear()} Ghanchi Investments</span></div></motion.div></footer>;
}
