import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAboutSubpage, getAboutSubpages, getGalleryItems, getSiteSettings, getTestimonials } from '@/lib/strapi';
import { InnerCTA, PageIntro, Testimonial } from '@/components/inner-pages';
import { Reveal } from '@/components/ui';
import { breadcrumbJsonLd } from '@/lib/structured-data';

type Props = { params: Promise<{ section: string }> };
export async function generateStaticParams() {
  const subpages = await getAboutSubpages();
  return subpages.map(item => ({ section: item.slug }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { section } = await params;
  const page = await getAboutSubpage(section);
  if (!page) notFound();
  return { title: page.intro.metaTitle || page.intro.title, description: page.intro.metaDescription || page.intro.description, alternates: { canonical: `/about-us/${section}` } };
}
export default async function AboutSection({ params }: Props) {
  const { section } = await params;
  const page = await getAboutSubpage(section);
  if (!page) notFound();
  const [awards, certificates, testimonials, siteSettings] = await Promise.all([
    section === 'awards' ? getGalleryItems('awards') : Promise.resolve([]),
    section === 'certificates' ? getGalleryItems('certificates') : Promise.resolve([]),
    section === 'testimonials' ? getTestimonials() : Promise.resolve([]),
    getSiteSettings(),
  ]);
  const jsonLd = breadcrumbJsonLd([{ name: 'Home', url: '/' }, { name: 'About Us', url: '/about-us' }, { name: page.intro.title, url: `/about-us/${section}` }]);
  return <main id="main" className="inner-page"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} /><PageIntro eyebrow="Ghanchi Investments" title={page.intro.title} description={page.intro.description}/>{section === 'awards' || section === 'certificates' ? <section className="container archive-gallery" aria-label={page.intro.title}>{(section === 'awards' ? awards : certificates).map(item => <Reveal key={item.id}><figure><a href={item.image} target="_blank" rel="noreferrer" aria-label={`Open ${item.title} in a new tab`}><img src={item.image} alt={item.title} loading="lazy"/></a><figcaption>{item.title}</figcaption></figure></Reveal>)}</section> : section === 'testimonials' ? <section className="container testimonial-archive">{testimonials.map(item => <Reveal key={item.id}><Testimonial testimonial={item}/></Reveal>)}</section> : <><section className="container inner-services-grid">{siteSettings.clientGroups.map(group => <Reveal className="inner-service-card" key={group}><h2>{group}</h2><p>{page.clientGroupsIntro}</p></Reveal>)}</section><section className="container inner-philosophy"><p className="inner-eyebrow">{page.crossBorderEyebrow}</p><h2>{siteSettings.clientLocations.join(' · ')}</h2><p>{page.clientsAffiliationNote}</p></section></>}<InnerCTA cta={siteSettings.innerCta}/></main>;
}
