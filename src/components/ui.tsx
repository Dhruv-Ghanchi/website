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
  return <motion.div className={`button-motion ${className}`} whileHover={reduced ? {} : { scale: 1.03 }} whileTap={reduced ? {} : { scale: 0.97 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
    <Link className={`button button-${variant}`} href={href}>
      <span className="button-label button-text">
        <span className="button-text-default">{children}</span>
        <span className="button-text-hover" aria-hidden="true">{children}</span>
      </span>
      {dot && <span className="button-dot" aria-hidden="true"><ArrowUpRight size={13} /></span>}
    </Link>
  </motion.div>;
}
export function BrandMark({ className = '' }: { className?: string }) {
  return <span className={`brand-mark ${className}`} aria-hidden="true"><svg viewBox="0 0 28 28" fill="none"><rect x="9" y="3" width="10" height="22" rx="5" stroke="currentColor" strokeWidth="1.8" transform="rotate(45 14 14)"/><rect x="9" y="3" width="10" height="22" rx="5" stroke="currentColor" strokeWidth="1.8" transform="rotate(-45 14 14)"/></svg></span>;
}
export function WhatsAppIcon({ size = 18 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.372-.01-.571-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.993c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413"/></svg>;
}
export function Logo({ src, alt, light = false, link = true }: { src: string; alt: string; light?: boolean; link?: boolean }) {
  const content = <img src={src} alt={alt} className={`logo-mark ${light ? 'logo-mark-light' : ''}`} />;
  return link ? <Link aria-label={`${alt} home`} href="/" className="logo">{content}</Link> : <span className="logo">{content}</span>;
}
export function Person({ image, name, role, badge = false, focalX = 50, focalY = 50 }: { image: string; name: string; role: string; badge?: boolean; focalX?: number; focalY?: number }) {
  return <div className="person"><span className="person-image">{image ? <img src={image} alt={name} loading="lazy" style={{ objectPosition: `${focalX}% ${focalY}%` }} /> : <span className="person-initials" aria-hidden="true">{name.split(' ').slice(0, 2).map(part => part[0]).join('')}</span>}{badge && <BrandMark />}</span><span><strong>{name}</strong><small>{role}</small></span></div>;
}
export function Dots({ count = 5 }: { count?: number }) { return <span className="rating-dots" aria-hidden="true">{Array.from({ length: count }, (_, i) => <i key={i} />)}</span>; }
export function ServiceIcon({ name, size = 18 }: { name: string; size?: number }) {
  const Icon = ({ chart: ChartNoAxesCombined, dollar: CircleDollarSign, target: Crosshair, network: Network, package: Package, shield: ShieldCheck, heart: Heart, trending: TrendingUp, piggy: PiggyBank, graduation: GraduationCap, alert: AlertTriangle, umbrella: Umbrella, building: Building2 } as const)[name as 'network'] || Plus;
  return <Icon size={size} strokeWidth={1.4} aria-hidden="true" />;
}
