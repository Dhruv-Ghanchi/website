"use client";

import { useEffect, useId, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion, MotionConfig, useMotionValueEvent, useScroll, useTransform } from 'motion/react';
import { ArrowUpRight, Check, ChevronDown, Copy, Facebook, Instagram, Linkedin, Mail, Menu, Minus, Phone, Youtube, X } from 'lucide-react';
import type { LegalPage, NavItem, TeamMember } from '@/lib/content';
import type { SiteSettings } from '@/lib/strapi';
import { BrandMark, Logo, Person, useReducedMotion } from './ui';
import { NewsletterForm } from './contact';


const pillTransition = { type: 'spring' as const, stiffness: 500, damping: 40 };
function NavDropdown({ item, mobile = false, onOpenChange, hoveredHref, onHover, registerRef }: { item: NavItem; mobile?: boolean; onOpenChange?: (open: boolean) => void; hoveredHref?: string | null; onHover?: (href: string | null) => void; registerRef?: (href: string, el: HTMLElement | null) => void }) {
  const [pinned, setPinned] = useState(false);
  const [hovering, setHovering] = useState(false);
  const pathname = usePathname();
  const id = useId();
  const button = useRef<HTMLButtonElement>(null);
  const container = useRef<HTMLDivElement>(null);
  const expanded = mobile ? pinned : pinned || hovering;
  useEffect(() => { setPinned(false); setHovering(false); }, [pathname]);
  useEffect(() => { const close = (event: PointerEvent) => { if (!container.current?.contains(event.target as Node)) setPinned(false); }; document.addEventListener('pointerdown', close); return () => document.removeEventListener('pointerdown', close); }, []);
  useEffect(() => { if (!mobile && expanded) { onOpenChange?.(true); return () => onOpenChange?.(false); } }, [expanded, mobile, onOpenChange]);
  const current = pathname === item.href || (item.href !== '/' && pathname.startsWith(`${item.href}/`));
  const active = !mobile && hoveredHref === item.href;
  if (!item.children) return <Link href={item.href} ref={el => registerRef?.(item.href, el)} aria-current={current ? 'page' : undefined} className={`nav-item-link ${active ? 'nav-item-active' : ''}`} onMouseEnter={() => !mobile && onHover?.(item.href)} onMouseLeave={() => !mobile && onHover?.(null)}>
    <span className="nav-item-label">{item.title}</span>{mobile && <ArrowUpRight size={22}/>}
  </Link>;
  return <div ref={container} className={mobile ? 'mobile-nav-group' : 'nav-dropdown'} onMouseEnter={() => { if (!mobile) { setHovering(true); onHover?.(item.href); } }} onMouseLeave={() => { if (!mobile) { setHovering(false); onHover?.(null); } }} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setPinned(false); }} onKeyDown={event => { if (event.key === 'Escape' && expanded && !mobile) { event.stopPropagation(); setPinned(false); setHovering(false); button.current?.focus(); } }}>
    <div ref={el => registerRef?.(item.href, el)} className={`nav-parent ${active ? 'nav-item-active' : ''}`}>
      <Link href={item.href} aria-current={current ? 'page' : undefined} className="nav-item-label" onClick={() => setPinned(false)}>{item.title}</Link>
      <button ref={button} aria-label={`Toggle ${item.title} links`} aria-expanded={expanded} aria-controls={id} onClick={() => setPinned(p => !p)}><ChevronDown size={15}/></button>
    </div>
    <AnimatePresence initial={false}>{expanded && <motion.div id={id} className={mobile ? 'mobile-nav-children' : 'nav-dropdown-menu'} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.15 }}>{item.children.map(child => child.href.startsWith('https:') ? <a key={child.href} href={child.href} target="_blank" rel="noreferrer" onClick={() => setPinned(false)}>{child.title} <ArrowUpRight size={14}/></a> : <Link key={child.href} href={child.href} onClick={() => setPinned(false)}>{child.title}</Link>)}</motion.div>}</AnimatePresence>
  </div>;
}
export function MotionProvider({ children }: { children: React.ReactNode }) { return <MotionConfig reducedMotion="user">{children}</MotionConfig>; }
export function Header({ navigation, founder, siteSettings }: { navigation: NavItem[]; founder?: TeamMember; siteSettings: SiteSettings }) {
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 350], [1, 0]);
  const [ctaHidden, setCtaHidden] = useState(false);
  useMotionValueEvent(scrollY, 'change', value => setCtaHidden(pathname === '/' && value >= 340));
  const [navHovered, setNavHovered] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [hoveredHref, setHoveredHref] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const itemRefs = useRef(new Map<string, HTMLElement>()).current;
  const [pillRect, setPillRect] = useState<{ left: number; top: number; width: number; height: number } | null>(null);
  const registerNavItem = (href: string, el: HTMLElement | null) => { if (el) itemRefs.set(href, el); else itemRefs.delete(href); };
  const handleNavHover = (href: string | null) => {
    setHoveredHref(href);
    const el = href ? itemRefs.get(href) : null;
    if (!el || !navRef.current) { setPillRect(null); return; }
    const navBox = navRef.current.getBoundingClientRect();
    const itemBox = el.getBoundingClientRect();
    setPillRect({ left: itemBox.left - navBox.left, top: itemBox.top - navBox.top, width: itemBox.width, height: itemBox.height });
  };
  useEffect(() => { setNavHovered(false); setActiveDropdown(null); setHoveredHref(null); setPillRect(null); setOpen(false); }, [pathname]);
  const backdropActive = navHovered || Boolean(activeDropdown);
  return <header className="site-header" onKeyDown={event => { if (event.key === 'Escape' && open) { setOpen(false); menuButton.current?.focus(); } }}>
    <a className="skip-link" href="#main">{siteSettings.skipLinkLabel}</a>
    <AnimatePresence>{backdropActive && <motion.div key="navdim" className="nav-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} aria-hidden="true"/>}</AnimatePresence>
    <div className={`nav-pill ${open ? 'nav-pill-expanded' : ''}`} onMouseEnter={() => setNavHovered(true)} onMouseLeave={() => setNavHovered(false)}>
      <Logo src={siteSettings.logo} alt={siteSettings.logoAlt}/>
      <nav ref={navRef} aria-label="Main navigation" className="desktop-nav">
        <AnimatePresence>{pillRect && <motion.div key="navPill" className="nav-hover-pill" initial={{ opacity: 0, left: pillRect.left, top: pillRect.top, width: pillRect.width, height: pillRect.height }} animate={{ opacity: 1, left: pillRect.left, top: pillRect.top, width: pillRect.width, height: pillRect.height }} exit={{ opacity: 0 }} transition={pillTransition} aria-hidden="true"/>}</AnimatePresence>
        {navigation.map(item => <NavDropdown key={item.href} item={item} hoveredHref={hoveredHref} onHover={handleNavHover} registerRef={registerNavItem} onOpenChange={isOpen => setActiveDropdown(prev => isOpen ? item.href : (prev === item.href ? null : prev))}/>)}
      </nav>
      <button ref={menuButton} className="menu-toggle" aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(!open)}>{open ? <X size={24}/> : <Menu size={24}/>}</button>
    </div>
    <motion.div style={{ opacity: pathname === '/' ? opacity : 1, pointerEvents: ctaHidden ? 'none' : 'auto' }} className="header-call">
      <Link href="/contact-us" aria-hidden={ctaHidden || undefined} tabIndex={ctaHidden ? -1 : undefined}><span>{siteSettings.headerCtaLabel}</span><span className="call-minus"><Minus size={17}/></span><img src={founder?.headshot || '/assets/placeholder-founder.svg'} alt="" style={founder?.headshot ? { objectPosition: `${founder.headshotFocalX}% ${founder.headshotFocalY}%` } : undefined}/></Link>
    </motion.div>
    <AnimatePresence>{open && <motion.nav id="mobile-navigation" aria-label="Mobile navigation" className="mobile-navigation" onClick={event => { if ((event.target as Element).closest('a')) setOpen(false); }} initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
      {navigation.map(item => <NavDropdown key={item.href} item={item} mobile/>)}
      <div className="mobile-nav-contact">
        <a href={`tel:${siteSettings.contactInfo.phone1.replaceAll(' ', '')}`}><Phone size={15}/>{siteSettings.contactInfo.phone1}</a>
        <a href={`mailto:${siteSettings.contactInfo.email1}`}><Mail size={15}/>{siteSettings.contactInfo.email1}</a>
      </div>
      <Link href="/contact-us" className="mobile-book">{siteSettings.headerCtaLabel}<BrandMark/></Link>
    </motion.nav>}</AnimatePresence>
  </header>;
}
export function Footer({ navigation, legalPages, siteSettings, founder }: { navigation: NavItem[]; legalPages: LegalPage[]; siteSettings: SiteSettings; founder?: TeamMember }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] });
  const scale = useTransform(scrollYProgress, [0, 1], [0.85, 1]);
  const circleScale = useTransform(scrollYProgress, [0, 1], [1, 10]);
  const [copyStatus, setCopyStatus] = useState('');
  useEffect(() => { if (!copyStatus) return; const timer = window.setTimeout(() => setCopyStatus(''), 2500); return () => window.clearTimeout(timer); }, [copyStatus]);
  const { contactInfo } = siteSettings;
  const copyEmail = async () => { try { await navigator.clipboard.writeText(contactInfo.email1); setCopyStatus('Copied!'); } catch { setCopyStatus('Select the email address to copy it.'); } };
  const socialIcons = { Facebook, Instagram, LinkedIn: Linkedin, YouTube: Youtube };
  return <footer className="site-footer" ref={ref}><div className="footer-reveal" aria-hidden="true"><motion.div className="footer-circle" style={reduced ? {} : { scale: circleScale }}/></div><motion.div className="footer-card" style={reduced ? {} : { scale }}><div className="footer-top"><div><Logo src={siteSettings.logo} alt={siteSettings.logoAlt}/><address>{siteSettings.addressLines.map(line => <span key={line}>{line}<br/></span>)}</address><h2>Subscribe to<br className="desktop-break"/> our newsletter.</h2><NewsletterForm copy={siteSettings.newsletterFormCopy}/></div><div className="footer-message"><h3><span>Making goal-based financial advice accessible to all.</span> Let’s plan your financial future together.</h3><Person image={founder?.headshot || ''} name={founder?.name || 'Chandrakant B. Ghanchi'} role={founder?.role || 'Founder & Financial Planner'} focalX={founder?.headshotFocalX} focalY={founder?.headshotFocalY} badge/><div className="footer-phones"><a href={`tel:${contactInfo.phone1.replaceAll(' ', '')}`} className="footer-phone">{contactInfo.phone1}</a><a href={`tel:${contactInfo.phone2.replaceAll(' ', '')}`} className="footer-phone">{contactInfo.phone2}</a></div><div className="footer-email"><button type="button" onClick={copyEmail} aria-label="Copy email address">{copyStatus === 'Copied!' ? <Check size={17}/> : <Copy size={17}/>}</button><a href={`mailto:${contactInfo.email1}`}>{contactInfo.email1}</a><span className="footer-copy-status" role="status">{copyStatus}</span></div><a className="footer-secondary-email" href={`mailto:${contactInfo.email2}`}>{contactInfo.email2}</a></div></div><div className="footer-links"><div className="footer-social-legal"><p className="eyebrow">{siteSettings.footerSocialsLabel}</p><div className="social-links">{siteSettings.socialLinks.map(({ name, href }) => { const Icon = socialIcons[name as keyof typeof socialIcons]; if (!Icon) return null; return <a key={name} href={href} aria-label={name} target="_blank" rel="noreferrer"><Icon className="social-icon-default" size={20}/><Icon className="social-icon-hover" size={20} aria-hidden="true"/></a>; })}</div><p className="eyebrow legal-label">{siteSettings.footerLegalLabel}</p><div className="legal-links">{legalPages.map(page => <Link href={`/${page.id}`} key={page.id}>{page.title}</Link>)}</div></div><div className="footer-navigation"><p className="eyebrow">{siteSettings.footerNavigationLabel}</p><nav aria-label="Footer navigation">{navigation.map(link => <Link href={link.href} key={link.href}><span className="footer-nav-dot" aria-hidden="true"/><span className="footer-nav-text"><span className="footer-nav-default">{link.title}</span><span className="footer-nav-hover" aria-hidden="true">{link.title}</span></span></Link>)}</nav></div></div><p className="footer-disclosure">{siteSettings.footerDisclosure}</p><div className="footer-bottom"><strong className="footer-wordmark" aria-hidden="true">{siteSettings.footerWordmark}</strong><span>© {new Date().getFullYear()} {siteSettings.siteName}</span></div></motion.div></footer>;
}
