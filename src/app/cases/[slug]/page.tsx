import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { caseStudies, formatDate, getCaseServices } from '@/lib/content';
import { BackLink, InnerCTA, ResultStats, RichText, Testimonial } from '@/components/inner-pages';
import { Reveal } from '@/components/ui';

type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return caseStudies.map(study => ({ slug: study.id })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const study = caseStudies.find(item => item.id === slug);
  if (!study) notFound();
  return { title: `${study.clientName} Case Study`, description: study.title, openGraph: { title: study.title, images: [study.heroImage] } };
}

export default async function CaseDetailPage({ params }: Props) {
  const { slug } = await params;
  const study = caseStudies.find(item => item.id === slug);
  if (!study) notFound();
  return <main className="inner-page inner-case-detail"><header className="container inner-detail-header"><BackLink href="/cases">All case studies</BackLink><Reveal><p className="inner-eyebrow">{study.clientName} / Case study</p><h1>{study.title}</h1><div className="inner-meta"><time dateTime={study.publishDate}>{formatDate(study.publishDate)}</time><span>{study.industry}</span></div></Reveal></header><div className="container"><div className="inner-cover-wrap"><img className="inner-cover" src={study.heroImage} alt={`${study.clientName} team collaborating`} fetchPriority="high" /><span className="inner-client-wordmark">{study.clientName}<span aria-hidden="true">↗</span></span></div></div><section className="container page-section inner-detail-grid"><aside className="inner-detail-sidebar"><h2>The engagement</h2><dl className="inner-fact-list"><div><dt>Client</dt><dd>{study.clientName}</dd></div><div><dt>Industry</dt><dd>{study.industry}</dd></div><div><dt>Company size</dt><dd>{study.companySize}</dd></div><div><dt>Timeline</dt><dd>{study.timeline}</dd></div><div id="services"><dt>Services</dt><dd>{getCaseServices(study).map(service => <Link key={service.id} href={`/services/${service.id}`}>{service.title} ↗</Link>)}</dd></div></dl></aside><div><div className="inner-story-part"><p className="inner-eyebrow">The challenge</p><RichText blocks={study.challenge} /></div><div className="inner-story-part"><p className="inner-eyebrow">The solution</p><RichText blocks={study.solution} /></div><section className="inner-results-panel"><h2>The results.</h2><ResultStats study={study} /></section></div></section><div className="container"><Reveal><Testimonial testimonial={study.testimonial} /></Reveal></div><div className="container page-section"><BackLink href="/cases">Explore all case studies</BackLink></div><InnerCTA /></main>;
}
