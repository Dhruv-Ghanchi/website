"use client";

import Link from 'next/link';
import { motion } from 'motion/react';
import { ArrowUpRight, ChartNoAxesCombined, CircleDollarSign, Crosshair, Network, Package, Plus, ShieldCheck, Heart, TrendingUp, PiggyBank, GraduationCap, AlertTriangle, Umbrella, Building2 } from 'lucide-react';
import { useSyncExternalStore, type ReactNode } from 'react';

const motionQuery = '(prefers-reduced-motion: reduce)';
function subscribeMotion(listener: () => void) {
  const media = window.matchMedia(motionQuery);
  media.addEventListener('change', listener);
  return () => media.removeEventListener('change', listener);
}
export function useReducedMotion() {
  return useSyncExternalStore(subscribeMotion, () => window.matchMedia(motionQuery).matches, () => false);
}

export const appearSpring = { type: 'spring' as const, mass: 1, stiffness: 100, damping: 20 };
export const accordionSpring = { type: 'spring' as const, stiffness: 170, damping: 26 };
export function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduced = useReducedMotion();
  return <motion.div className={`motion-reveal ${className}`} initial={reduced ? false : { opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.08 }} transition={{ ...appearSpring, delay }}>{children}</motion.div>;
}
export function Button({ children, href = '/contact-us', variant = 'mint', className = '', dot = false }: { children: ReactNode; href?: string; variant?: 'mint' | 'dark' | 'cream' | 'ghost'; className?: string; dot?: boolean }) {
  const reduced = useReducedMotion();
  return <motion.div className={`button-motion ${className}`} whileHover={reduced ? {} : { scale: 1.03 }} whileTap={reduced ? {} : { scale: 0.97 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}><Link className={`button button-${variant}`} href={href}><span className="button-label">{children}</span>{dot && <span className="button-dot" aria-hidden="true"><ArrowUpRight size={13} /></span>}</Link></motion.div>;
}
export function BrandMark({ className = '' }: { className?: string }) {
  return <span className={`brand-mark ${className}`} aria-hidden="true"><svg viewBox="0 0 28 28" fill="none"><rect x="9" y="3" width="10" height="22" rx="5" stroke="currentColor" strokeWidth="1.8" transform="rotate(45 14 14)"/><rect x="9" y="3" width="10" height="22" rx="5" stroke="currentColor" strokeWidth="1.8" transform="rotate(-45 14 14)"/></svg></span>;
}
export function Logo({ light = false, link = true }: { light?: boolean; link?: boolean }) {
  const content = <img src="/assets/logo-ghanchi.png" alt="Ghanchi Investments" className={`logo-mark ${light ? 'logo-mark-light' : ''}`} />;
  return link ? <Link aria-label="Ghanchi Investments home" href="/" className="logo">{content}</Link> : <span className="logo">{content}</span>;
}
export function Person({ image, name, role, badge = false }: { image: string; name: string; role: string; badge?: boolean }) {
  return <div className="person"><span className="person-image">{image ? <img src={image} alt={name} loading="lazy" /> : <span className="person-initials" aria-hidden="true">{name.split(' ').slice(0, 2).map(part => part[0]).join('')}</span>}{badge && <BrandMark />}</span><span><strong>{name}</strong><small>{role}</small></span></div>;
}
export function Dots({ count = 5 }: { count?: number }) { return <span className="rating-dots" aria-hidden="true">{Array.from({ length: count }, (_, i) => <i key={i} />)}</span>; }
export function ServiceIcon({ name, size = 18 }: { name: string; size?: number }) {
  const Icon = ({ chart: ChartNoAxesCombined, dollar: CircleDollarSign, target: Crosshair, network: Network, package: Package, shield: ShieldCheck, heart: Heart, trending: TrendingUp, piggy: PiggyBank, graduation: GraduationCap, alert: AlertTriangle, umbrella: Umbrella, building: Building2 } as const)[name as 'network'] || Plus;
  return <Icon size={size} strokeWidth={1.4} aria-hidden="true" />;
}
