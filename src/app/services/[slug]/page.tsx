import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Check } from 'lucide-react';
import { getService, services } from '@/lib/content';
import { BackLink, InnerCTA, ServiceCard, Testimonial } from '@/components/inner-pages';
import { Button, Reveal } from '@/components/ui';

type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return services.map(service => ({ slug: service.id })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();
  return { title: service.title, description: service.longDesc, alternates: { canonical: `/services/${service.id}` }, openGraph: { title: service.title, description: service.shortDesc, images: [service.image] } };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();
  const otherServices = services.filter(item => item.id !== service.id).slice(0, 3);
  return <main id="main" className="inner-page"><header className="container inner-service-hero"><Reveal><BackLink href="/services">All services</BackLink><p className="inner-eyebrow">{service.shortDesc}</p><h1>{service.title}.</h1><p className="inner-lead">{service.longDesc}</p><Button href={`/contact-us?service=${service.id}`} variant="dark" dot>Discuss your goals</Button></Reveal><img src={service.image} alt={`${service.title} collaboration`} fetchPriority="high" /></header><section className="inner-values-wrap"><div className="container page-section inner-deliverables"><div><p className="inner-eyebrow">What we work on</p><h2>A clear path forward.</h2><p>{service.shortDesc} Here’s what we can build together.</p></div><ul className="inner-deliverable-list">{service.deliverables.map(deliverable => <li key={deliverable}><Check size={20} aria-hidden="true" />{deliverable}</li>)}</ul></div></section><div className="container page-section"><Reveal><Testimonial testimonial={service.testimonial} /></Reveal></div><div className="container"><p className="inner-legal-note">Solutions depend on your circumstances and applicable product terms. Mutual funds are subject to market risks. Insurance benefits depend on policy conditions. The testimonial describes a general client experience, not a result for this specific service.</p></div><section className="container"><div className="inner-section-heading"><h2>Connected expertise.</h2><Button href="/services" variant="ghost" dot>All services</Button></div><div className="inner-services-grid">{otherServices.map((item, index) => <ServiceCard key={item.id} service={item} index={index} />)}</div></section><InnerCTA /></main>;
}
