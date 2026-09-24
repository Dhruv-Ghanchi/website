import type { Metadata } from 'next';
import Link from 'next/link';
import { getArticles, getBlogPage, getCategories } from '@/lib/strapi';
import { InsightCard, InsightGrid, PageIntro } from '@/components/inner-pages';
import { Button, Reveal } from '@/components/ui';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getBlogPage();
  return { title: page.intro.metaTitle, description: page.intro.metaDescription, alternates: { canonical: '/blog' } };
}
type Props = { searchParams: Promise<{ category?: string | string[] }> };
export default async function BlogPage({ searchParams }: Props) {
  const query = await searchParams;
  const [categories, articles, page] = await Promise.all([getCategories(), getArticles(), getBlogPage()]);
  const requested = typeof query.category === 'string' ? query.category : '';
  const active = categories.some(item => item.id === requested) ? requested : '';
  const items = articles.filter(item => !active || item.categoryId === active).sort((a, b) => b.publishDate.localeCompare(a.publishDate));
  return <main id="main" className="inner-page"><PageIntro title={page.intro.title} description={page.intro.description}/><section className="container inner-insights-section" aria-label="Financial education articles"><nav className="inner-filters" aria-label="Filter articles by category"><Link href="/blog" scroll={false} className="inner-filter" aria-current={!active ? 'page' : undefined}>All articles</Link>{categories.map(item => <Link key={item.id} href={`/blog?category=${item.id}`} scroll={false} className="inner-filter" aria-current={active === item.id ? 'page' : undefined}>{item.name}</Link>)}</nav>{items.length ? !active ? <><Reveal><InsightCard insight={items[0]} categories={categories} featured/></Reveal><InsightGrid items={items.slice(1)} categories={categories}/></> : <InsightGrid items={items} categories={categories}/> : <div className="inner-empty"><h2>{page.emptyStateTitle}</h2><p>{page.emptyStateDescription}</p><Button href="/blog" variant="dark" dot>View all articles</Button></div>}</section></main>;
}
