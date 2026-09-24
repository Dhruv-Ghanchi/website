import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Check } from 'lucide-react';
import { getServices, getServicesPage, getSiteSettings } from '@/lib/strapi';
import { BackLink, InnerCTA, ServiceCard, Testimonial } from '@/components/inner-pages';
import { Button, Reveal } from '@/components/ui';
import { breadcrumbJsonLd } from '@/lib/structured-data';

type Props = { params: Promise<{ slug: string }> };
export async function generateStaticParams() { const services = await getServices(); return services.map(service => ({ slug: service.id })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const services = await getServices();
  const service = services.find(item => item.id === slug);
  if (!service) notFound();
  return { title: service.title, description: service.longDesc, alternates: { canonical: `/services/${service.id}` }, openGraph: { title: service.title, description: service.shortDesc, images: [service.image] } };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const [services, page, siteSettings] = await Promise.all([getServices(), getServicesPage(), getSiteSettings()]);
  const service = services.find(item => item.id === slug);
  if (!service) notFound();
  const otherServices = services.filter(item => item.id !== service.id).slice(0, 3);
  const jsonLd = breadcrumbJsonLd([{ name: 'Home', url: '/' }, { name: 'Services', url: '/services' }, { name: service.title, url: `/services/${service.id}` }]);
  return <main id="main" className="inner-page"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} /><header className="container inner-service-hero"><Reveal><BackLink href="/services">{page.allServicesLabel}</BackLink><p className="inner-eyebrow">{service.shortDesc}</p><h1>{service.title}.</h1><p className="inner-lead">{service.longDesc}</p><Button href={`/contact-us?service=${service.id}`} variant="dark" dot>{page.discussGoalsLabel}</Button></Reveal><img src={service.image} alt={`${service.title} collaboration`} fetchPriority="high" style={{ objectPosition: `${service.imageFocalX}% ${service.imageFocalY}%` }} /></header><section className="inner-values-wrap"><div className="container page-section inner-deliverables"><div><p className="inner-eyebrow">{page.deliverablesEyebrow}</p><h2>{page.deliverablesHeading}</h2><p>{service.shortDesc}{page.deliverablesText}</p></div><ul className="inner-deliverable-list">{service.deliverables.map(deliverable => <li key={deliverable}><Check size={20} aria-hidden="true" />{deliverable}</li>)}</ul></div></section>{service.testimonial?.quote && <div className="container page-section"><Reveal><Testimonial testimonial={service.testimonial} /></Reveal></div>}<div className="container"><p className="inner-legal-note">{page.disclaimerText}</p></div><section className="container"><div className="inner-section-heading"><h2>{page.connectedHeading}</h2><Button href="/services" variant="ghost" dot>{page.allServicesLabel}</Button></div><div className="inner-services-grid">{otherServices.map((item, index) => <ServiceCard key={item.id} service={item} index={index} />)}</div></section><InnerCTA cta={siteSettings.innerCta} /></main>;
}
