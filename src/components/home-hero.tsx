"use client";

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react';
import { ArrowRight, Check, X } from 'lucide-react';
import { asset, caseStudies, images } from '@/lib/content';
import { siteConfig } from '@/lib/site-config';
import { Button, Dots, Logo, Reveal } from './ui';

const avatars = ['CLNNeZ7sGt3ywvDzR7D6Mi3TE.jpg', 'aqkakFzIkX11TpipSH4MurMn1c.jpg', 'Y0PKmJR8OR83TST953hq4wrsmtI.jpg', 'dYAD6XIGC1k0IidBb9wX6b7srM.jpg', 'ZCltSDBMvX6dGq8gfKZbNA61y0.jpg'];
export function TrustBadge() {
  return <div className="trust-badge"><div className="trust-avatars">{avatars.map(image => <img key={image} src={asset(image)} alt="" width="34" height="34"/>)}</div><div><Dots/><p>Trusted by 50+ companies</p></div></div>;
}
function LogoTicker() {
  return <div className="logo-ticker" aria-label="Trusted by Venice, Lightspeed, Sitemark, Hamilton, and Theo"><div className="ticker-track">{[0, 1].map(repeat => <div className="ticker-group" key={repeat} aria-hidden="true"><span className="client-venice">venice.</span><span className="client-lightspeed"><i>◖◖●</i> Lightspeed</span><span className="client-sitemark"><i>✱</i> Sitemark</span><span className="client-hamilton">⌁ Hamilton</span><span className="client-theo">theo</span></div>)}</div></div>;
}
const statement = "The strategies that built your company won't scale it.".split(' ');
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
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const heroHeight = useMotionValue(1000);
  const viewportHeight = useMotionValue(1000);
  const reduced = useReducedMotion();
  const [mobile, setMobile] = useState(false);
  const [hidden, setHidden] = useState(false);
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
  const study = caseStudies[0];
  return <><section className="hero-scroll" ref={ref} aria-label="Introduction"><motion.div className="hero-sticky" style={reduced ? {} : { scale }}><motion.div className="hero-background" initial={reduced ? false : { scale: 0.12 }} animate={{ scale: 1 }} transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}><motion.div className="hero-media" style={reduced ? {} : { filter: mediaBlur }} initial={reduced ? false : { scale: 2.2 }} animate={{ scale: 1 }} transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}>{siteConfig.hero.mode === 'video' && siteConfig.hero.video && !reduced ? <video autoPlay loop muted playsInline poster={siteConfig.hero.image} src={siteConfig.hero.video}/> : <img src={siteConfig.hero.image} alt="A translucent orange flower against a soft blue background" fetchPriority="high"/>}</motion.div><div className="hero-shade" style={{ opacity: siteConfig.hero.overlayOpacity }}/><motion.div className="hero-blur" style={{ opacity: reduced ? 0 : blurOpacity }}/></motion.div><motion.div className="hero-foreground" style={reduced ? {} : { y: heroY }} inert={!reduced && hidden}><div className="hero-copy"><h1>{'Your growth partner for companies ready to scale.'.split(' ').map((word, index) => <span key={word}>{index === 4 && <br className="desktop-break"/>}{index === 5 && <br className="mobile-break"/>}<motion.span className="hero-word" initial={reduced ? false : { opacity: 0, filter: 'blur(5px)', y: 20 }} animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }} transition={{ duration: 0.6, delay: 0.15 + index * 0.07 }}>{word}</motion.span>{' '}</span>)}</h1><Reveal delay={0.35}><p>Kora helps leadership teams gain<br/>clarity and build systems that scale.</p></Reveal><Reveal delay={0.5}><div className="hero-actions"><Button href="/#services" dot>Our Services</Button><Link href="/#pricing" className="text-link">Pricing <ArrowRight size={14}/></Link></div></Reveal></div><Reveal className="hero-bottom" delay={0.55}><div className="hero-trust"><TrustBadge/><LogoTicker/></div><Link href={`/cases/${study.id}`} className="hero-case"><div className="hero-case-image"><img src={images.sitemark} alt="Sitemark case study"/><span>✱ Sitemark</span></div><div className="hero-case-copy"><div><span className="dark-tag">New Case Study</span><p>{study.title}</p></div><div className="hero-case-stat"><strong>47%</strong><span>Revenue growth<br/>in 6 months</span><ArrowRight className="hero-case-arrow" size={25}/></div></div></Link></Reveal></motion.div></motion.div></section><section className="hero-statement"><h2>{statement.map((word, index) => <span key={`${word}-${index}`}>{index === 4 && <br className="desktop-break"/>}<StatementWord word={word} index={index} progress={statementProgress} mobile={mobile}/>{index < statement.length - 1 ? ' ' : ''}</span>)}</h2></section><div className="hero-scroll-space" aria-hidden="true"/></>;
}
const before = ['Hiring more reps to fix a conversion problem.', 'Pipeline that looks full but never closes.', 'Pricing based on what competitors charge.', 'Every quarter starts from zero.'];
const after = ['Every dollar of spend tied to revenue.', 'Pipeline that converts predictably.', 'Pricing built on what customers will pay.', 'Compounding growth, quarter over quarter.'];
export function Comparison() {
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
  return <section className="comparison-scroll" ref={ref}><div className="comparison-sticky"><h2 className="comparison-heading"><motion.span style={reduced ? {} : { x: headingX, opacity: headingOpacity }}>What changes when</motion.span><motion.span style={reduced ? {} : { x: headingX2, opacity: headingOpacity }}>you work with us.</motion.span></h2><div className="comparison-cards"><motion.article className="comparison-card before-card" style={reduced ? {} : { x: beforeX, scale: beforeScale, opacity: beforeOpacity }}><small>Before</small><Logo link={false}/><h3>Guessing what<br/>grows revenue.</h3><ul>{before.map(item => <li key={item}><X aria-hidden="true" size={24}/>{item}</li>)}</ul></motion.article><motion.article className="comparison-card after-card" style={reduced ? {} : { x: afterX, opacity: afterOpacity }}><small>After</small><Logo light link={false}/><h3>Knowing exactly<br/>what moves<br/>the number.</h3><ul>{after.map(item => <li key={item}><Check aria-hidden="true" size={24}/>{item}</li>)}</ul></motion.article></div></div></section>;
}
