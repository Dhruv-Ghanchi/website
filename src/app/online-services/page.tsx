import type { Metadata } from 'next';
import { ArrowUpRight } from 'lucide-react';
import { getOnlineServices, getOnlineServicesPage, getSiteSettings } from '@/lib/strapi';
import { InnerCTA, PageIntro } from '@/components/inner-pages';
import { Reveal } from '@/components/ui';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getOnlineServicesPage();
  return { title: page.intro.metaTitle, description: page.intro.metaDescription, alternates: { canonical: '/online-services' } };
}
export default async function OnlineServicesPage() {
  const [onlineServices, page, siteSettings] = await Promise.all([getOnlineServices(), getOnlineServicesPage(), getSiteSettings()]);
  return <main id="main" className="inner-page"><PageIntro title={page.intro.title} description={page.intro.description}/><section className="container inner-services-grid">{onlineServices.map((item, index) => <Reveal key={item.id}><a className="inner-service-card" href={item.url} target={item.type === 'external' ? '_blank' : undefined} rel={item.type === 'external' ? 'noreferrer' : undefined}><div className="inner-service-card-top"><span>{String(index + 1).padStart(2, '0')}</span><ArrowUpRight size={24}/></div><h2>{item.title}</h2><p>{item.description}</p><span className="inner-service-more">{item.type === 'external' ? 'Open provider website' : 'Explore archive'}</span></a></Reveal>)}</section><div className="container"><p className="inner-legal-note">{page.legalDisclaimer}</p></div><InnerCTA cta={siteSettings.innerCta}/></main>;
}
