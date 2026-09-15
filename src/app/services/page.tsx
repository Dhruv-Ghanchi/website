import type { Metadata } from 'next';
import { services } from '@/lib/content';
import { InnerCTA, PageIntro, ServiceCard } from '@/components/inner-pages';

export const metadata: Metadata = { title: 'Services', description: 'Growth strategy, go-to-market, revenue operations, sales optimization, and pricing. Find the right support for your next stage of growth.' };

export default function ServicesPage() {
  return <main className="inner-page"><PageIntro eyebrow="How we help" title="Clear strategy. Real growth." description="From your next market to your next stage of growth. Focused expertise for the challenges that matter most." /><section className="container inner-services-grid" aria-label="Our services">{services.map((service, index) => <ServiceCard key={service.id} service={service} index={index} />)}</section><InnerCTA /></main>;
}
