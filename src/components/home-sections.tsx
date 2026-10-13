"use client";

import { useEffect, useId, useRef, useState, type CSSProperties } from 'react';
import Link from 'next/link';
import { animate, motion, useInView } from 'motion/react';
import { ArrowUpRight, Check, Headphones, Layers3, Monitor, Network, Play, Plus, RefreshCw, Search, ShieldCheck, X } from 'lucide-react';
import { formatDate, type Article, type Category, type GalleryItem, type Service, type Stat, type TeamMember, type Testimonial } from '@/lib/content';
import type { AboutPageContent, HomePageContent, SiteSettings } from '@/lib/strapi';
import { accordionSpring, Button, Dots, Logo, Person, Reveal, ServiceIcon, useReducedMotion } from './ui';

const phaseIcons: Record<string, typeof Search> = { search: Search, network: Network, layers: Layers3, shield: ShieldCheck };
const operatingIcons: Record<string, typeof Monitor> = { monitor: Monitor, refresh: RefreshCw, headphones: Headphones };

function ServiceTile({ service }: { service: Service }) {
  const [failedImage, setFailedImage] = useState<string>();
  const showImage = service.image && failedImage !== service.image;
  return <Link href={`/services/${service.id}`} className="service-tile" aria-label={service.title}>
    <span className="service-tile-visual">
      {showImage ? <img src={service.image} alt={service.imageAlt} loading="lazy" style={{ objectPosition: `${service.imageFocalX}% ${service.imageFocalY}%` }} onError={() => setFailedImage(service.image)}/> : <span className="service-tile-fallback" aria-hidden="true"><ServiceIcon name={service.icon} size={64}/></span>}
      <span className="service-tile-shade"/>
      <span className="service-tile-title">{service.title}</span>
    </span>
    <span className="service-tile-arrow" aria-hidden="true"><ArrowUpRight className="service-arrow-out" size={24}/><ArrowUpRight className="service-arrow-in" size={24}/></span>
  </Link>;
}

export function ServicesSection({ services, servicesIntro }: { services: Service[]; servicesIntro: string }) {
  return <section id="services" className="services-section section-space" aria-labelledby="services-heading"><div className="container">
    <Reveal><h2 id="services-heading" className="display-title">Services.</h2></Reveal>
    <Reveal className="services-intro"><p>{servicesIntro}</p></Reveal>
    {services.length ? <div className="service-gallery" style={{ '--service-count': services.length } as CSSProperties}>{services.map(service => <ServiceTile key={service.id} service={service}/>)}</div> : <div className="services-empty"><p>Contact us to discuss the support you need.</p><Button href="/contact-us" variant="dark">Contact us</Button></div>}
  </div></section>;
}
export function ProcessSection({ phases, processHeading, processSubheading, operatingHeading, operatingItems, processVideo, processBackdrop, videoCopy, logo, logoAlt }: {
  phases: HomePageContent['phases']; processHeading: string; processSubheading: string;
  operatingHeading: string; operatingItems: HomePageContent['operatingItems'];
  processVideo?: string; processBackdrop?: string; videoCopy: HomePageContent['processVideoCopy'];
  logo: string; logoAlt: string;
}) {
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();
  const [playing, setPlaying] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  return <section className="process-section container section-space" id="process"><Reveal><h2 className="section-title">{processHeading}</h2><p className="section-subtitle">{processSubheading}</p></Reveal><Reveal className="process-accordion">{phases.map((phase, i) => { const Icon = phaseIcons[phase.icon] || Search; return <motion.div layout={!reduced} transition={reduced ? { duration: 0 } : accordionSpring} key={phase.title} className={`phase-card-wrap ${active === i ? 'selected' : ''}`} onMouseEnter={() => setActive(i)}><div className={`phase-card ${active === i ? 'active' : ''}`}><button onClick={() => setActive(i)} onFocus={() => setActive(i)} aria-expanded={active === i} aria-controls={`phase-panel-${i}`} aria-label={`Phase ${i + 1}: ${phase.title}`} className="phase-trigger"><span>{active === i && 'Phase '}{String(i + 1).padStart(2, '0')}</span>{active === i && <span className="phase-dots">{phases.map((_, dot) => <i className={dot === i ? 'selected' : ''} key={dot}/>)}</span>}<span className="phase-mobile-title">{phase.title}</span></button><div id={`phase-panel-${i}`} className="phase-content"><h3><Icon size={24} strokeWidth={1.4} aria-hidden="true"/>{phase.title}</h3><p>{phase.text}</p></div></div></motion.div>; })}</Reveal><Reveal><div className="process-video">{processVideo ? <video ref={video} src={processVideo} poster={processBackdrop} playsInline controls={playing} style={{ filter: playing ? 'none' : 'brightness(.68)' }} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => setPlaying(false)}/> : processBackdrop && <img src={processBackdrop} alt="" loading="lazy"/>}{!playing && <><Logo src={logo} alt={logoAlt} light/><button className="play-button" aria-label={videoCopy.watchAriaLabel} onClick={() => processVideo ? video.current?.play() : dialog.current?.showModal()}><Play fill="currentColor" size={24}/></button><div className="process-video-label"><span>{videoCopy.approachLabel}</span><h3>{videoCopy.heading}</h3><p>{videoCopy.subtext}</p></div></>}</div></Reveal><dialog ref={dialog} className="video-dialog" aria-label={videoCopy.heading} onClick={event => { if (event.target === dialog.current) dialog.current.close(); }}><button className="dialog-close" aria-label="Close process video" onClick={() => dialog.current?.close()}><X/></button><div className="process-preview"><Logo src={logo} alt={logoAlt}/><h2>{videoCopy.heading}</h2><p>{videoCopy.notConnectedText}</p><ol>{phases.map(phase => <li key={phase.title}><h3>{phase.title}</h3><p>{phase.text}</p></li>)}</ol><Button href="https://www.youtube.com/@ghanchiinvestments4939">{videoCopy.watchVideosLabel}</Button></div></dialog><Reveal className="operating-heading"><h3>{operatingHeading}</h3></Reveal><Reveal className="operating-grid">{operatingItems.map(item => { const Icon = operatingIcons[item.icon] || Monitor; return <div key={item.title}><Icon size={24} strokeWidth={1.3}/><p><strong>{item.title}</strong> {item.text}</p></div>; })}</Reveal></section>;
}
function initials(name: string) { return name.split(' ').slice(0, 2).map(part => part[0]).join(''); }
export function TeamSection({ teamMembers, teamHeading, hiringCopy, recognition }: { teamMembers: TeamMember[]; teamHeading: string; hiringCopy: HomePageContent['hiringCopy']; recognition: GalleryItem[] }) {
  return <section className="team-section rounded-section section-space" id="team"><div className="container">
    <Reveal><h2 className="section-title">{teamHeading}</h2></Reveal>
    <Reveal className="team-pill-wrap"><h3 className="team-pill-heading">Our team</h3><div className="team-pill-list">{teamMembers.map((member, i) => <div className="team-pill" key={member.id}><div className="team-pill-avatar">{member.headshot ? <img src={member.headshot} alt={member.name} loading="lazy"/> : <span aria-hidden="true">{initials(member.name)}</span>}</div><span className="team-pill-name"><strong>{member.name}</strong><small>{member.role}</small></span><small className="team-pill-number">{String(i + 1).padStart(2, '0')}</small><Plus className="team-pill-plus" size={21} aria-hidden="true"/></div>)}</div></Reveal>
    <Reveal className="recognition-block">
      <div className="recognition-intro"><div><h3>{hiringCopy.heading.split('\n').map((line, i) => <span key={i}>{line}<br/></span>)}</h3><p>{hiringCopy.text}</p></div><div className="recognition-actions"><Button variant="dark" href="/about-us/awards" dot>View Awards</Button><Button variant="dark" href="/about-us/certificates" dot>View Certificates</Button></div></div>
      {recognition.length > 0 && <div className="recognition-marquee" aria-label="Recognition and certificates"><div className="recognition-track">{recognition.map(item => <a href={item.image} target="_blank" rel="noreferrer" key={item.id} className="recognition-thumb" title={item.title}><img src={item.image} alt={item.title}/></a>)}{recognition.map(item => <a href={item.image} target="_blank" rel="noreferrer" key={`dup-${item.id}`} className="recognition-thumb" title={item.title} aria-hidden="true"><img src={item.image} alt=""/></a>)}</div></div>}
    </Reveal>
  </div></section>;
}
function Counter({ value, suffix, decimals = 0 }: Stat) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduced = useReducedMotion();
  const [number, setNumber] = useState(0);
  useEffect(() => { if (!inView) return; const control = animate(0, value, { duration: reduced ? 0 : 1.7, onUpdate: latest => setNumber(latest) }); return () => control.stop(); }, [inView, value, reduced]);
  return <span ref={ref}>{number.toLocaleString('en-IN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}</span>;
}
export function TestimonialsSection({ testimonials, siteSettings, teamMembers, founderCallout }: { testimonials: Testimonial[]; siteSettings: SiteSettings; teamMembers: TeamMember[]; founderCallout: HomePageContent['founderCallout'] }) {
  const [active, setActive] = useState(0);
  const id = useId();
  const featured = testimonials[0];
  const founder = teamMembers[0];
  if (!featured) return null;
  return <section className="testimonials-section container section-space"><Reveal><div className="testimonial-feature">{siteSettings.testimonialBackground && (/\.(mp4|webm|mov)$/i.test(siteSettings.testimonialBackground) ? <video className="testimonial-bg" src={siteSettings.testimonialBackground} autoPlay muted loop playsInline aria-hidden="true"/> : <img className="testimonial-bg" src={siteSettings.testimonialBackground} alt="" loading="lazy"/>)}<h2 className="display-title">Testimonials</h2><div className="testimonial-feature-card glass-panel"><h3>“{featured.quote}”</h3><p>From our client testimonial archive.</p><Person {...featured}/></div><div className="review-score"><div>{siteSettings.rating.value.toFixed(1)}<small>/{siteSettings.rating.max}</small></div><p>{siteSettings.rating.note}</p><Dots/></div></div></Reveal><div className="testimonial-list">{testimonials.slice(1, 4).map((item, i) => <motion.div layout transition={accordionSpring} key={item.id} className={`testimonial-item-wrap ${active === i ? 'selected' : ''}`} onMouseEnter={() => setActive(i)}><div className={`testimonial-item ${active === i ? 'open' : ''}`}><Dots/><button onClick={() => setActive(i)} onFocus={() => setActive(i)} aria-label={`Read testimonial from ${item.name}`} aria-expanded={active === i} aria-controls={`${id}-quote-${i}`}><span>“{item.quote}”</span><Plus size={20}/></button><Person {...item}/><motion.div id={`${id}-quote-${i}`} animate={{ opacity: active === i ? 1 : 0 }} transition={accordionSpring} className="testimonial-detail" aria-hidden={active !== i}><Link href="/about-us/testimonials" tabIndex={active === i ? 0 : -1}>More client experiences <ArrowUpRight size={16}/></Link></motion.div></div></motion.div>)}</div><div className="stats-grid">{siteSettings.stats.map(stat => <div className="stat" key={stat.label}><Counter {...stat}/><p>{stat.label}</p></div>)}</div><div className="founder-callout"><div><h3>{founderCallout.heading.split('\n').map((line, i) => <span key={i}>{line}<br/></span>)}</h3><p>{founderCallout.text}</p><Person image={founder?.headshot || ''} name={founder?.name || 'Chandrakant B. Ghanchi'} role={founder?.role || 'Founder & Financial Planner'} focalX={founder?.headshotFocalX} focalY={founder?.headshotFocalY}/></div><Button href="/contact-us" variant="dark" dot>{founderCallout.buttonLabel}</Button></div></section>;
}
export function FeaturedCase({ siteSettings, services, testimonials, copy }: { siteSettings: SiteSettings; services: Service[]; testimonials: Testimonial[]; copy: HomePageContent['featuredCase'] }) {
  const stats = siteSettings.stats;
  const featured = testimonials[0];
  const clientStat = stats.find(stat => stat.label.toLowerCase().includes('client')) || stats[1];
  if (!featured) return null;
  return <section className="featured-case container section-space"><Reveal><div className="featured-case-grid"><div className="case-narrative"><small>{copy.eyebrow}</small><h2>{copy.heading}</h2><dl><div><dt>{copy.focusLabel}</dt><dd>{copy.focusValue}</dd></div><div><dt>{copy.clientsLabel}</dt><dd>{copy.clientsValue}</dd></div><div><dt>{copy.reviewLabel}</dt><dd>{copy.reviewValue}</dd></div></dl><div className="case-big-stats">{stats.slice(0, 2).map(stat => <div key={stat.label}><strong>{stat.value.toLocaleString('en-IN')}<span>{stat.suffix}</span></strong><p>{stat.label}</p></div>)}</div></div><div className="case-media-column"><Link href="/about-us/our-clients" className="featured-case-image image-hover">{siteSettings.featuredCaseImage ? <img src={siteSettings.featuredCaseImage} alt="" loading="lazy"/> : <div className="featured-case-fallback"><div className="fallback-avatars" aria-hidden="true">{testimonials.slice(0, 5).map(person => <span className="fallback-avatar" key={person.id}>{person.name.split(' ').slice(0, 2).map(part => part[0]).join('')}</span>)}</div>{clientStat && <strong><Counter {...clientStat}/></strong>}<small>Clients served across India &amp; abroad</small></div>}</Link><div className="case-services"><span>{copy.servicesLabel}</span><div>{services.map(service => <Link key={service.id} href={`/services/${service.id}`}>{service.title}</Link>)}</div></div><div className="case-small-quote"><blockquote>“{featured.quote}”</blockquote><Person {...featured}/></div><Button variant="dark" href="/about-us/our-clients" dot>{copy.buttonLabel}</Button></div></div></Reveal></section>;
}
export function InsightsSection({ articles, categories, copy }: { articles: Article[]; categories: Category[]; copy: HomePageContent['insightsCopy'] }) {
  return <section className="home-insights container section-space"><Reveal className="insights-intro"><h2 className="section-title">{copy.headingLine1}<br/><span>{copy.headingLine2}</span></h2><p>{copy.text}</p><Button href="/blog" variant="dark" dot>{copy.buttonLabel}</Button></Reveal>{articles.slice(0, 2).map((article, i) => <Reveal key={article.id} delay={i * 0.1}><Link href={`/blog/${article.id}`} className="insight-cover-card image-hover">{article.coverImage && <img src={article.coverImage} alt="" loading="lazy" style={{ objectPosition: `${article.coverFocalX}% ${article.coverFocalY}%` }}/>}<span className="insight-category">{categories.find(c => c.id === article.categoryId)?.name}</span><div><small>{formatDate(article.publishDate)}</small><h3>{article.title}</h3></div><ArrowUpRight className="insight-arrow" size={24}/></Link></Reveal>)}</section>;
}
