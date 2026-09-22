import type { Metadata } from 'next';
import { ArrowUpRight } from 'lucide-react';
import { onlineServices } from '@/lib/content';
import { InnerCTA, PageIntro } from '@/components/inner-pages';
import { Reveal } from '@/components/ui';

export const metadata: Metadata = { title: 'Online Services', description: 'Access LIC, Fundz Bazar, NJ account portals, insurance renewals, newsletters and My Wealth apps.', alternates: { canonical: '/online-services' } };
export default function OnlineServicesPage() {
  return <main id="main" className="inner-page"><PageIntro title="Online Services." description="Useful account, renewal and learning links in one place. External links open provider websites in a new tab; never share your login credentials with us."/><section className="container inner-services-grid">{onlineServices.map((item, index) => <Reveal key={item.id}><a className="inner-service-card" href={item.url} target={item.type === 'external' ? '_blank' : undefined} rel={item.type === 'external' ? 'noreferrer' : undefined}><div className="inner-service-card-top"><span>{String(index + 1).padStart(2, '0')}</span><ArrowUpRight size={24}/></div><h2>{item.title}</h2><p>{item.description}</p><span className="inner-service-more">{item.type === 'external' ? 'Open provider website' : 'Explore archive'}</span></a></Reveal>)}</section><div className="container"><p className="inner-legal-note">These links come from the existing Ghanchi Investments website. Provider availability and renewal eligibility may change; contact us if you need assistance.</p></div><InnerCTA/></main>;
}
