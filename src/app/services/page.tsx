import type { Metadata } from 'next';
import { getServices, getServicesPage, getSiteSettings } from '@/lib/strapi';
import { InnerCTA, PageIntro, ServiceCard } from '@/components/inner-pages';
export async function generateMetadata(): Promise<Metadata> {
  const page = await getServicesPage();
  return { title: page.intro.metaTitle, description: page.intro.metaDescription, alternates: { canonical: '/services' } };
}
export default async function ServicesPage() {
  const [services, page, siteSettings] = await Promise.all([getServices(), getServicesPage(), getSiteSettings()]);
  return <main id="main" className="inner-page"><PageIntro eyebrow={page.intro.eyebrow} title={page.intro.title} description={page.intro.description}/><section className="container inner-services-grid" aria-label="Our services">{services.map((service, index) => <ServiceCard key={service.id} service={service} index={index}/>)}</section><InnerCTA cta={siteSettings.innerCta}/></main>;
}
