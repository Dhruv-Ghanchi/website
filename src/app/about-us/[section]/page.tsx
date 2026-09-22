import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { awards, certificates, clientGroups, clientLocations, testimonials } from '@/lib/content';
import { InnerCTA, PageIntro, Testimonial } from '@/components/inner-pages';
import { Reveal } from '@/components/ui';

const pages = {
  awards: { title: 'Awards', description: 'Photographs from the Ghanchi Investments awards archive.' },
  certificates: { title: 'Certificates', description: 'Historical certificates from our existing website. These archive images do not establish current licence validity.' },
  'our-clients': { title: 'Our Clients', description: 'Serving 1,200+ clients across India and abroad, with plans built around individual needs.' },
  testimonials: { title: 'Testimonials', description: 'Experiences shared by our clients on the existing Ghanchi Investments website. Employer names describe individuals’ affiliations, not corporate endorsements.' },
};
type Props = { params: Promise<{ section: string }> };
export function generateStaticParams() { return Object.keys(pages).map(section => ({ section })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { section } = await params;
  const page = pages[section as keyof typeof pages];
  if (!page) notFound();
  return { title: page.title, description: page.description, alternates: { canonical: `/about-us/${section}` } };
}
export default async function AboutSection({ params }: Props) {
  const { section } = await params;
  const page = pages[section as keyof typeof pages];
  if (!page) notFound();
  return <main id="main" className="inner-page"><PageIntro eyebrow="Ghanchi Investments" {...page}/>{section === 'awards' || section === 'certificates' ? <section className="container archive-gallery" aria-label={page.title}>{(section === 'awards' ? awards : certificates).map(item => <Reveal key={item.id}><figure><a href={item.image} target="_blank" rel="noreferrer" aria-label={`Open ${item.title} in a new tab`}><img src={item.image} alt={item.title} loading="lazy"/></a><figcaption>{item.title}</figcaption></figure></Reveal>)}</section> : section === 'testimonials' ? <section className="container testimonial-archive">{testimonials.map(item => <Reveal key={item.id}><Testimonial testimonial={item}/></Reveal>)}</section> : <><section className="container inner-services-grid">{clientGroups.map(group => <Reveal className="inner-service-card" key={group}><h2>{group}</h2><p>Personalized planning in the context of your goals, risk appetite and cash flows.</p></Reveal>)}</section><section className="container inner-philosophy"><p className="inner-eyebrow">Across borders</p><h2>{clientLocations.join(' · ')}</h2><p>Our clients include individuals working at organizations such as L&T Infotech, Syntel, Oberoi Realty and TCS. These affiliations are not claims that the organizations themselves are clients.</p></section></>}<InnerCTA/></main>;
}
