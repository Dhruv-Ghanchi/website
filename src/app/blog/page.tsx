import type { Metadata } from 'next';
import Link from 'next/link';
import { categories, articles } from '@/lib/content';
import { InsightCard, InsightGrid, PageIntro } from '@/components/inner-pages';
import { Button, Reveal } from '@/components/ui';

export const metadata: Metadata = { title: 'Blog', description: 'Financial education from the Ghanchi Investments archive.', alternates: { canonical: '/blog' } };
type Props = { searchParams: Promise<{ category?: string | string[] }> };
export default async function BlogPage({ searchParams }: Props) {
  const query = await searchParams;
  const requested = typeof query.category === 'string' ? query.category : '';
  const active = categories.some(item => item.id === requested) ? requested : '';
  const items = articles.filter(item => !active || item.categoryId === active).sort((a, b) => b.publishDate.localeCompare(a.publishDate));
  return <main id="main" className="inner-page"><PageIntro title="Financial knowledge." description="Selected financial education from our archive, with original publication dates and clearly labelled adaptations."/><section className="container inner-insights-section" aria-label="Financial education articles"><nav className="inner-filters" aria-label="Filter articles by category"><Link href="/blog" scroll={false} className="inner-filter" aria-current={!active ? 'page' : undefined}>All articles</Link>{categories.map(item => <Link key={item.id} href={`/blog?category=${item.id}`} scroll={false} className="inner-filter" aria-current={active === item.id ? 'page' : undefined}>{item.name}</Link>)}</nav>{items.length ? !active ? <><Reveal><InsightCard insight={items[0]} featured/></Reveal><InsightGrid items={items.slice(1)}/></> : <InsightGrid items={items}/> : <div className="inner-empty"><h2>More articles to come.</h2><p>No reviewed articles are published in this category yet.</p><Button href="/blog" variant="dark" dot>View all articles</Button></div>}</section></main>;
}
