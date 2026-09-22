import type { Metadata } from 'next';
import { newsletters } from '@/lib/content';
import { InnerCTA, PageIntro } from '@/components/inner-pages';
import { Reveal } from '@/components/ui';

export const metadata: Metadata = { title: 'Newsletters', description: 'The Ghanchi Investments newsletter archive, with original issue dates.', alternates: { canonical: '/newsletters' } };
export default function NewslettersPage() {
  return <main id="main" className="inner-page"><PageIntro title="Newsletters." description="Explore our original newsletter archive. November 2021 is the latest issue listed on the existing website; these editions are historical, not current market advice."/><section className="container inner-services-grid">{newsletters.map(item => <Reveal className="inner-service-card" key={item.id}><time dateTime={item.issueMonth}>{item.issueMonth}</time><h2>{item.title}</h2>{item.url ? <a className="inner-service-more" href={item.url} target="_blank" rel="noreferrer">Read original edition ↗</a> : <p>The original link is malformed. Please contact us for this edition.</p>}</Reveal>)}</section><InnerCTA/></main>;
}
