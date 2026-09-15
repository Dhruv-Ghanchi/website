import type { Metadata } from 'next';
import Link from 'next/link';
import { categories, insights } from '@/lib/content';
import { InsightCard, InsightGrid, PageIntro } from '@/components/inner-pages';
import { Button, Reveal } from '@/components/ui';

export const metadata: Metadata = { title: 'Insights', description: 'Lessons, frameworks, and honest takes on what it actually takes to grow. Explore insights from the Kora team.' };

type Props = { searchParams: Promise<{ category?: string | string[] }> };
export default async function InsightsPage({ searchParams }: Props) {
  const query = await searchParams;
  const requestedCategory = typeof query.category === 'string' ? query.category : '';
  const activeCategory = categories.some(category => category.id === requestedCategory) ? requestedCategory : '';
  const articles = [...insights].filter(insight => !activeCategory || insight.categoryId === activeCategory).sort((a, b) => b.publishDate.localeCompare(a.publishDate));
  return <main className="inner-page"><PageIntro title="Insights." description="Lessons, frameworks, and honest takes on what it actually takes to grow." /><section className="container inner-insights-section" aria-label="Growth insights"><nav className="inner-filters" aria-label="Filter articles by category"><Link href="/insights" scroll={false} className="inner-filter" aria-current={!activeCategory ? 'page' : undefined}>All insights</Link>{categories.map(category => <Link key={category.id} href={`/insights?category=${category.id}`} scroll={false} className="inner-filter" aria-current={activeCategory === category.id ? 'page' : undefined}>{category.name}</Link>)}</nav>{articles.length > 0 ? <>{!activeCategory ? <><Reveal><InsightCard insight={articles[0]} featured /></Reveal><InsightGrid items={articles.slice(1)} /></> : <InsightGrid items={articles} />}</> : <div className="inner-empty"><h2>More insights on the way.</h2><p>No articles in this category yet. Explore the latest thinking from our team.</p><Button href="/insights" variant="dark" dot>View all insights</Button></div>}</section></main>;
}
