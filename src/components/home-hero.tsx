"use client";

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useMotionValue, useMotionValueEvent, useScroll, useTransform, type MotionValue } from 'motion/react';
import { ArrowRight, Check, Target, Waypoints, X } from 'lucide-react';
import { formatIssue, type Newsletter, type Testimonial } from '@/lib/content';
import type { HomePageContent, SiteSettings } from '@/lib/strapi';
import { Button, Dots, Reveal, useReducedMotion } from './ui';

export function TrustBadge({ testimonials, rating, copy }: { testimonials: Testimonial[]; rating: SiteSettings['rating']; copy: HomePageContent['trustBadge'] }) {
  return <div className="trust-badge"><div className="trust-avatars" aria-hidden="true">{testimonials.slice(0, 5).map(person => <span className="trust-initials" key={person.id}>{person.name.split(' ').slice(0, 2).map(part => part[0]).join('')}</span>)}</div><div><Dots/><p>{copy.badgeText}</p><small title={rating.note}>{rating.value.toFixed(1)}/{rating.max} · {copy.ratingContext}</small></div></div>;
}
function LogoTicker({ clientLocations }: { clientLocations: string[] }) {
  return <div className="logo-ticker" aria-label={`Serving clients in ${clientLocations.join(', ')}`}><div className="ticker-track">{[0, 1].map(repeat => <div className="ticker-group" key={repeat} aria-hidden="true">{clientLocations.map(location => <span key={location} className="client-location">{location}</span>).reduce((acc: React.ReactNode[], el, i) => { acc.push(el); if (i < clientLocations.length - 1) acc.push(<span key={`dot-${i}`} className="ticker-dot">•</span>); return acc; }, [])}</div>)}</div></div>;
}
function StatementWord({ word, index, progress, mobile }: { word: string; index: number; progress: MotionValue<number>; mobile: boolean }) {
  const reduced = useReducedMotion();
  const center = (mobile ? 0.5 : 0) + (index - 4) * 0.075;
  const opacity = useTransform(() => {
    const position = progress.get() - center;
    const stops = [-0.225, -0.175, -0.15, -0.1, -0.075, -0.05, -0.025, 0, 0.025, 0.05, 0.075, 0.1, 0.15, 0.175, 0.225];
    const values = [0, 0.0032, 0.0128, 0.067, 0.1048, 0.1556, 0.2696, 0.5, 0.7304, 0.8444, 0.8952, 0.933, 0.9872, 0.9968, 1];
    const next = stops.findIndex(stop => stop > position);
    if (next === 0) return 0;
    if (next === -1) return 1;
    const fraction = (position - stops[next - 1]) / (stops[next] - stops[next - 1]);
    return values[next - 1] + fraction * (values[next] - values[next - 1]);
  });
  const filter = useTransform(opacity, [0, 1], ['blur(5px)', 'blur(0px)']);
  return <motion.span className="statement-word" style={reduced ? {} : { opacity, filter }}>{word}</motion.span>;
}
type HeroProps = {
  heroHeading: string; heroSubheading: string; statementText: string;
  siteSettings: SiteSettings; heroCta: HomePageContent['heroCta']; trustBadgeCopy: HomePageContent['trustBadge'];
  newsletterCard: HomePageContent['newsletterCard']; testimonials: Testimonial[]; newsletter?: Newsletter;
};
export function Hero({ heroHeading, heroSubheading, statementText, siteSettings, heroCta, trustBadgeCopy, newsletterCard, testimonials, newsletter }: HeroProps) {
  const ref = useRef<HTMLElement>(null);
  const heroHeight = useMotionValue(1000);
  const viewportHeight = useMotionValue(1000);
  const reduced = useReducedMotion();
  const [mobile, setMobile] = useState(false);
  const [hidden, setHidden] = useState(false);
  const statement = statementText.split(' ');
  useEffect(() => {
    const query = window.matchMedia('(max-width: 560px)');
    const update = () => {
      setMobile(query.matches);
      heroHeight.set(ref.current?.offsetHeight ?? window.innerHeight);
      viewportHeight.set(window.innerHeight);
    };
    update();
    const observer = new ResizeObserver(update);
    if (ref.current) observer.observe(ref.current);
    window.addEventListener('resize', update);
    return () => { observer.disconnect(); window.removeEventListener('resize', update); };
  }, [heroHeight, viewportHeight]);
  const { scrollY } = useScroll();
  const zoomProgress = useTransform(() => (scrollY.get() - heroHeight.get() + viewportHeight.get() * 0.5) / (viewportHeight.get() * 0.5));
  const blurProgress = useTransform(() => (scrollY.get() - heroHeight.get() + viewportHeight.get() * 0.6) / (viewportHeight.get() * 0.1));
  const statementProgress = useTransform(() => (scrollY.get() - heroHeight.get()) / viewportHeight.get());
  const scale = useTransform(zoomProgress, [0, 1], [1, 1.4]);
  const heroY = useTransform(scrollY, value => -value * (mobile ? 0.75 : 1.75));
  const blurOpacity = useTransform(blurProgress, [0, 1], [0, 1]);
  const mediaBlur = useTransform(blurProgress, [0, 1], ['blur(0px)', 'blur(10px)']);
  useMotionValueEvent(scrollY, 'change', value => setHidden(value > (ref.current?.offsetHeight ?? 1000) / (mobile ? 0.75 : 1.75)));
  return <><section className="hero-scroll" ref={ref} aria-label="Introduction"><motion.div className="hero-sticky" style={reduced ? {} : { scale }}><motion.div className="hero-background" initial={reduced ? false : { scale: 0.12 }} animate={{ scale: 1 }} transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}><motion.div className="hero-media" style={reduced ? {} : { filter: mediaBlur }} initial={reduced ? false : { scale: 2.2 }} animate={{ scale: 1 }} transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}><img src={siteSettings.heroImage} alt="" fetchPriority="high"/></motion.div><div className="hero-shade" style={{ opacity: siteSettings.heroOverlayOpacity }}/><motion.div className="hero-blur" style={{ opacity: reduced ? 0 : blurOpacity }}/></motion.div><motion.div className="hero-foreground" style={reduced ? {} : { y: heroY }} inert={!reduced && hidden}><div className="hero-copy"><h1>{heroHeading.split(' ').map((word, index) => <span key={word}>{index === 4 && <br className="desktop-break"/>}{index === 5 && <br className="mobile-break"/>}<motion.span className="hero-word" initial={reduced ? false : { opacity: 0, filter: 'blur(5px)', y: 20 }} animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }} transition={{ duration: 0.6, delay: 0.15 + index * 0.07 }}>{word}</motion.span>{' '}</span>)}</h1><Reveal delay={0.35}><p>{heroSubheading}</p></Reveal><Reveal delay={0.5}><div className="hero-actions"><Button href="/#services" dot>{heroCta.primaryLabel}</Button><Link href="/contact-us" className="text-link">{heroCta.secondaryLabel} <ArrowRight size={14}/></Link></div></Reveal></div><Reveal className="hero-bottom" delay={0.55}><div className="hero-trust"><TrustBadge testimonials={testimonials} rating={siteSettings.rating} copy={trustBadgeCopy}/><LogoTicker clientLocations={siteSettings.clientLocations}/></div>{newsletter && <Link href="/newsletters" className="hero-case"><div className="hero-case-image"><img src={newsletter.coverImage} alt={newsletter.title}/><span>{newsletterCard.badgeLabel}</span></div><div className="hero-case-copy"><div><span className="dark-tag">{newsletterCard.latestLabel}</span><p>{newsletter.title}</p></div><div className="hero-case-stat"><strong className="hero-case-archive-label">{newsletterCard.readLabel}</strong><span>{formatIssue(newsletter.issueMonth)} {newsletterCard.issueSuffixLabel}</span><ArrowRight className="hero-case-arrow" size={25}/></div></div></Link>}</Reveal></motion.div></motion.div></section><section className="hero-statement"><h2>{statement.map((word, index) => <span key={`${word}-${index}`}>{index === 4 && <br className="desktop-break"/>}<StatementWord word={word} index={index} progress={statementProgress} mobile={mobile}/>{index < statement.length - 1 ? ' ' : ''}</span>)}</h2></section><div className="hero-scroll-space" aria-hidden="true"/></>;
}
export function Comparison({ comparisonBefore, comparisonAfter, copy }: { comparisonBefore: string[]; comparisonAfter: string[]; copy: HomePageContent['comparisonCopy'] }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const headingX = useTransform(scrollYProgress, [0, 0.25], ['0%', '-105%']);
  const headingX2 = useTransform(scrollYProgress, [0, 0.25], ['0%', '105%']);
  const headingOpacity = useTransform(scrollYProgress, [0, 0.22], [1, 0]);
  const beforeX = useTransform(scrollYProgress, [0, 0.42, 0.7], ['52%', '52%', '0%']);
  const beforeScale = useTransform(scrollYProgress, [0.12, 0.38], [0.7, 1]);
  const beforeOpacity = useTransform(scrollYProgress, [0, 0.16, 0.34, 0.53, 0.72], [0, 0, 1, 1, 0.5]);
  const afterOpacity = useTransform(scrollYProgress, [0.48, 0.7], [0, 1]);
  const afterX = useTransform(scrollYProgress, [0.48, 0.7], [120, 0]);
  return <section className="comparison-scroll" ref={ref}><div className="comparison-sticky"><h2 className="comparison-heading"><motion.span style={reduced ? {} : { x: headingX, opacity: headingOpacity }}>{copy.headingLine1}</motion.span><motion.span style={reduced ? {} : { x: headingX2, opacity: headingOpacity }}>{copy.headingLine2}</motion.span></h2><div className="comparison-cards"><motion.article className="comparison-card before-card" style={reduced ? {} : { x: beforeX, scale: beforeScale, opacity: beforeOpacity }}><small>{copy.beforeLabel}</small><h3>{copy.beforeHeading.split('\n').map((line, i) => <span key={i}>{line}<br/></span>)}</h3><Waypoints className="comparison-icon" size={64} strokeWidth={1.2} aria-hidden="true"/><ul>{comparisonBefore.map(item => <li key={item}><X aria-hidden="true" size={24}/>{item}</li>)}</ul></motion.article><motion.article className="comparison-card after-card" style={reduced ? {} : { x: afterX, opacity: afterOpacity }}><small>{copy.afterLabel}</small><h3>{copy.afterHeading.split('\n').map((line, i) => <span key={i}>{line}<br/></span>)}</h3><Target className="comparison-icon" size={64} strokeWidth={1.2} aria-hidden="true"/><ul>{comparisonAfter.map(item => <li key={item}><Check aria-hidden="true" size={24}/>{item}</li>)}</ul></motion.article></div></div></section>;
}
