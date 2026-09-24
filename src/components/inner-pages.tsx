import Link from 'next/link';
import { ArrowUpRight, ArrowLeft, Check } from 'lucide-react';
import { Button, Person, Reveal, ServiceIcon } from '@/components/ui';
import { formatDate, getCategory, type Article, type Category, type RichTextBlock, type Service, type Testimonial as TestimonialRecord } from '@/lib/content';
import type { CtaBlock } from '@/lib/strapi';

export function PageIntro({ eyebrow, title, description }: { eyebrow?: string; title: string; description?: string }) {
  return <header className="inner-intro container"><Reveal>{eyebrow && <p className="inner-eyebrow">{eyebrow}</p>}<h1>{title}</h1>{description && <p className="inner-lead">{description}</p>}</Reveal></header>;
}
export function BackLink({ href, children }: { href: string; children: React.ReactNode }) {
  return <Link className="inner-back" href={href}><ArrowLeft size={16} aria-hidden="true"/>{children}</Link>;
}
export function RichText({ blocks }: { blocks: RichTextBlock[] }) {
  return <div className="inner-prose">{blocks.map((block, index) => <section key={index}>{block.heading && <h2>{block.heading}</h2>}{block.paragraphs.map((paragraph, i) => <p key={i}>{paragraph}</p>)}</section>)}</div>;
}
export function Testimonial({ testimonial }: { testimonial: TestimonialRecord }) {
  return <figure className="inner-quote"><span className="inner-quote-mark" aria-hidden="true">“</span><blockquote>{testimonial.quote}</blockquote><figcaption><Person {...testimonial}/></figcaption></figure>;
}
export function InsightCard({ insight, categories, featured = false }: { insight: Article; categories: Category[]; featured?: boolean }) {
  return <article className={`inner-insight-card ${featured ? 'inner-insight-featured' : ''}`}><Link className="inner-insight-image" href={`/blog/${insight.id}`} aria-label={insight.title}><img src={insight.coverImage} alt="" loading="lazy" style={{ objectPosition: `${insight.coverFocalX}% ${insight.coverFocalY}%` }}/><span className="inner-circle-arrow"><ArrowUpRight size={24} aria-hidden="true"/></span></Link><div className="inner-insight-copy"><div className="inner-meta"><span>{getCategory(insight, categories)?.name}</span><time dateTime={insight.publishDate}>{formatDate(insight.publishDate)}</time></div><h2><Link href={`/blog/${insight.id}`}>{insight.title}</Link></h2>{featured && <p className="inner-insight-excerpt">{insight.content[0]?.paragraphs[0]}</p>}<Person image="" name="Ghanchi Investments" role="From our financial education archive"/></div></article>;
}
export function InsightGrid({ items, categories }: { items: Article[]; categories: Category[] }) {
  return <div className="inner-insight-grid">{items.map(insight => <Reveal key={insight.id}><InsightCard insight={insight} categories={categories}/></Reveal>)}</div>;
}
export function ServiceCard({ service, index }: { service: Service; index: number }) {
  return <Link className="inner-service-card" href={`/services/${service.id}`}><div className="inner-service-card-top"><span className="inner-service-icon"><ServiceIcon name={service.icon} size={27}/></span><span>{String(index + 1).padStart(2, '0')}</span></div><h2>{service.title}</h2><p>{service.shortDesc}</p><span className="inner-service-more">Explore service <ArrowUpRight size={20} aria-hidden="true"/></span></Link>;
}
export function InnerCTA({ cta }: { cta: CtaBlock }) {
  return <section className="container inner-cta-wrap"><Reveal className="inner-cta"><div><p className="inner-eyebrow">{cta.eyebrow}</p><h2>{cta.heading}</h2><p>{cta.description}</p><Button href="/contact-us" variant="dark" dot>{cta.buttonLabel}</Button></div><ul>{cta.checklist.map(item => <li key={item}><Check size={20} aria-hidden="true"/>{item}</li>)}</ul></Reveal></section>;
}
