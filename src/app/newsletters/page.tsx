import type { Metadata } from 'next';
import { getNewsletters, getNewslettersPage, getSiteSettings } from '@/lib/strapi';
import { InnerCTA, PageIntro } from '@/components/inner-pages';
import { Reveal } from '@/components/ui';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getNewslettersPage();
  return { title: page.intro.metaTitle, description: page.intro.metaDescription, alternates: { canonical: '/newsletters' } };
}
export default async function NewslettersPage() {
  const [newsletters, page, siteSettings] = await Promise.all([getNewsletters(), getNewslettersPage(), getSiteSettings()]);
  return <main id="main" className="inner-page"><PageIntro title={page.intro.title} description={page.intro.description}/><section className="container inner-services-grid">{newsletters.map(item => <Reveal className="inner-service-card" key={item.id}><time dateTime={item.issueMonth}>{item.issueMonth}</time><h2>{item.title}</h2>{item.url ? <a className="inner-service-more" href={item.url} target="_blank" rel="noreferrer">Read original edition ↗</a> : <p>The original link is malformed. Please contact us for this edition.</p>}</Reveal>)}</section><InnerCTA cta={siteSettings.innerCta}/></main>;
}
