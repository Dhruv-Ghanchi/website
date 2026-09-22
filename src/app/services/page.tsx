import type { Metadata } from 'next';
import { services } from '@/lib/content';
import { InnerCTA, PageIntro, ServiceCard } from '@/components/inner-pages';
export const metadata: Metadata = { title: 'Services', description: 'Explore nine financial planning, investment and insurance services from Ghanchi Investments.', alternates: { canonical: '/services' } };
export default function ServicesPage() {
  return <main id="main" className="inner-page"><PageIntro eyebrow="How we help" title="Plan. Protect. Invest." description="Personalized support for the financial decisions that matter to you and your family."/><section className="container inner-services-grid" aria-label="Our services">{services.map((service, index) => <ServiceCard key={service.id} service={service} index={index}/>)}</section><InnerCTA/></main>;
}
