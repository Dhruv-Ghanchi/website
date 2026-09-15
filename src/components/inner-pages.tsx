import Link from 'next/link';
import { ArrowUpRight, ArrowLeft, Check } from 'lucide-react';
import { Button, Person, Reveal, ServiceIcon } from '@/components/ui';
import { caseStudies, formatDate, getAuthor, getCaseServices, getCategory, type CaseStudy, type Insight, type RichTextBlock, type Service } from '@/lib/content';

export function PageIntro({ eyebrow, title, description }: { eyebrow?: string; title: string; description?: string }) {
  return <header className="inner-intro container"><Reveal>{eyebrow && <p className="inner-eyebrow">{eyebrow}</p>}<h1>{title}</h1>{description && <p className="inner-lead">{description}</p>}</Reveal></header>;
}

export function BackLink({ href, children }: { href: string; children: React.ReactNode }) {
  return <Link className="inner-back" href={href}><ArrowLeft size={16} aria-hidden="true" />{children}</Link>;
}

export function RichText({ blocks }: { blocks: RichTextBlock[] }) {
  return <div className="inner-prose">{blocks.map((block, index) => <section key={index}>{block.heading && <h2>{block.heading}</h2>}{block.paragraphs.map((paragraph, i) => <p key={i}>{paragraph}</p>)}</section>)}</div>;
}

export function ResultStats({ study }: { study: CaseStudy }) {
  return <div className="inner-stats">{study.resultStats.map(stat => <div key={stat.label}><strong>{stat.prefix}{stat.value}<span>{stat.suffix}</span></strong><p>{stat.label}</p></div>)}</div>;
}

export function Testimonial({ testimonial }: { testimonial: Service['testimonial'] }) {
  return <figure className="inner-quote"><span className="inner-quote-mark" aria-hidden="true">“</span><blockquote>{testimonial.quote}</blockquote><figcaption><Person image={testimonial.image} name={testimonial.name} role={testimonial.role} /></figcaption></figure>;
}

export function CaseCard({ study, compact = false }: { study: CaseStudy; compact?: boolean }) {
  const relatedServices = getCaseServices(study);
  return <Reveal className={`inner-case-card ${compact ? 'inner-case-compact' : ''}`}><div className="inner-case-visual"><Link href={`/cases/${study.id}`} aria-label={`Read the ${study.clientName} case study`}><img src={study.heroImage} alt={`${study.clientName} team at work`} loading="lazy" /><span className="inner-client-wordmark">{study.clientName}<span aria-hidden="true">↗</span></span></Link><div className="inner-case-facts"><div><span>Industry</span><strong>{study.industry}</strong></div><div><span>Company size</span><strong>{study.companySize}</strong></div><div><span>Timeline</span><strong>{study.timeline}</strong></div></div></div><div className="inner-case-copy"><time dateTime={study.publishDate}>{formatDate(study.publishDate)}</time><h2><Link href={`/cases/${study.id}`}>{study.title}</Link></h2><ResultStats study={study} /><div className="inner-service-tags"><span>Services</span>{relatedServices.slice(0, 3).map(service => <Link href={`/services/${service.id}`} key={service.id}>{service.title}</Link>)}{relatedServices.length > 3 && <Link href={`/cases/${study.id}#services`}>+{relatedServices.length - 3}</Link>}</div>{!compact && <div className="inner-case-endorsement"><blockquote>“{study.testimonial.quote}”</blockquote><Person image={study.testimonial.image} name={study.testimonial.name} role={study.testimonial.role} /></div>}<Button href={`/cases/${study.id}`} variant="dark" dot>View Case Study</Button></div></Reveal>;
}

export function InsightCard({ insight, featured = false }: { insight: Insight; featured?: boolean }) {
  const author = getAuthor(insight);
  return <article className={`inner-insight-card ${featured ? 'inner-insight-featured' : ''}`}><Link className="inner-insight-image" href={`/insights/${insight.id}`} aria-label={insight.title}><img src={insight.coverImage} alt="" loading="lazy" /><span className="inner-circle-arrow"><ArrowUpRight size={24} aria-hidden="true" /></span></Link><div className="inner-insight-copy"><div className="inner-meta"><span>{getCategory(insight).name}</span><time dateTime={insight.publishDate}>{formatDate(insight.publishDate)}</time></div><h2><Link href={`/insights/${insight.id}`}>{insight.title}</Link></h2>{featured && <p className="inner-insight-excerpt">{insight.content[0]?.paragraphs[0]}</p>}<Person image={author.headshot} name={author.name} role={author.role} /></div></article>;
}

export function InsightGrid({ items }: { items: Insight[] }) {
  return <div className="inner-insight-grid">{items.map(insight => <Reveal key={insight.id}><InsightCard insight={insight} /></Reveal>)}</div>;
}

export function ServiceCard({ service, index }: { service: Service; index: number }) {
  return <Link className="inner-service-card" href={`/services/${service.id}`}><div className="inner-service-card-top"><span className="inner-service-icon"><ServiceIcon name={service.icon} size={27} /></span><span>{String(index + 1).padStart(2, '0')}</span></div><h2>{service.title}</h2><p>{service.shortDesc}</p><span className="inner-service-more">Explore service <ArrowUpRight size={20} aria-hidden="true" /></span></Link>;
}

export function RelatedStudies({ serviceId }: { serviceId: string }) {
  const studies = caseStudies.filter(study => study.serviceIds.includes(serviceId));
  if (!studies.length) return null;
  return <section className="container page-section"><div className="inner-section-heading"><h2>Strategy, put into practice.</h2><Button href="/cases" variant="ghost" dot>All case studies</Button></div>{studies.map(study => <CaseCard key={study.id} study={study} compact />)}</section>;
}

export function InnerCTA() {
  return <section className="container inner-cta-wrap"><Reveal className="inner-cta"><div><p className="inner-eyebrow">Your next chapter</p><h2>Let’s find your next growth lever.</h2><p>No pitch decks, no pressure. Tell us where you are and we’ll share how we can help.</p><Button href="/contact" variant="dark" dot>Let’s talk growth</Button></div><ul>{['Actionable growth roadmap', 'Channel & funnel diagnostics', 'Clear next steps & timeline'].map(item => <li key={item}><Check size={20} aria-hidden="true" />{item}</li>)}</ul></Reveal></section>;
}
