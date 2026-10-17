import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Check } from 'lucide-react';
import { getServices, getServicesPage, getSiteSettings } from '@/lib/strapi';
import { BackLink, InnerCTA, RichText, ServiceCard } from '@/components/inner-pages';
import { Button, Reveal } from '@/components/ui';
import { breadcrumbJsonLd } from '@/lib/structured-data';
import { SERVICE_GUIDES } from '@/lib/service-guides';

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
  const guide = SERVICE_GUIDES[slug];
  const jsonLd = breadcrumbJsonLd([{ name: 'Home', url: '/' }, { name: 'Services', url: '/services' }, { name: service.title, url: `/services/${service.id}` }]);
  return (
    <main id="main" className="inner-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <header className="container inner-service-hero">
        <Reveal>
          <BackLink href="/services">{page.allServicesLabel}</BackLink>
          <p className="inner-eyebrow">{service.shortDesc}</p>
          <h1>{service.title}.</h1>
          <p className="inner-lead">{service.longDesc}</p>
          <Button href={`/contact-us?service=${service.id}`} variant="dark" dot>{page.discussGoalsLabel}</Button>
        </Reveal>
        <img src={service.image} alt={service.imageAlt} fetchPriority="high" style={{ objectPosition: `${service.imageFocalX}% ${service.imageFocalY}%` }} />
      </header>

      <section className="inner-values-wrap">
        <div className="container page-section inner-deliverables">
          <div>
            <p className="inner-eyebrow">{page.deliverablesEyebrow}</p>
            <h2>{page.deliverablesHeading}</h2>
            <p>{service.shortDesc}{page.deliverablesText}</p>
          </div>
          <ul className="inner-deliverable-list">
            {service.deliverables.map(deliverable => <li key={deliverable}><Check size={20} aria-hidden="true" />{deliverable}</li>)}
          </ul>
        </div>
      </section>

      {guide && guide.length > 0 && (
        <section className="container page-section inner-service-guide">
          <article className="inner-legal-body">
            <header className="inner-guide-header">
              <p className="inner-eyebrow">Comprehensive Advisory Guide</p>
              <h2>Everything you need to know about {service.title.toLowerCase()}.</h2>
            </header>
            <RichText blocks={guide} />
          </article>
        </section>
      )}

      <section className="container page-section">
        <div className="inner-section-heading">
          <h2>{page.connectedHeading}</h2>
          <Button href="/services" variant="dark" dot>{page.allServicesLabel}</Button>
        </div>
        <div className="inner-services-grid">
          {otherServices.map((item, index) => <ServiceCard key={item.id} service={item} index={index} />)}
        </div>
      </section>

      <InnerCTA cta={siteSettings.innerCta} />
    </main>
  );
}
