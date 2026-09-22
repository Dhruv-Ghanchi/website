import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { articles, formatDate, getCategory } from '@/lib/content';
import { BackLink, InsightGrid, RichText } from '@/components/inner-pages';
import { Button, Person, Reveal } from '@/components/ui';

type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return articles.map(item => ({ slug: item.id })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = articles.find(item => item.id === slug);
  if (!article) notFound();
  return { title: article.title, description: article.content[0].paragraphs[0], alternates: { canonical: `/blog/${slug}` }, openGraph: { type: 'article', title: article.title, images: [article.coverImage], publishedTime: article.publishDate } };
}
export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = articles.find(item => item.id === slug);
  if (!article) notFound();
  const related = articles.filter(item => item.id !== slug);
  return <main id="main" className="inner-page article-page"><article><header className="container inner-detail-header inner-article-header"><BackLink href="/blog">All articles</BackLink><Reveal><div className="inner-meta"><span><Link href={`/blog?category=${article.categoryId}`}>{getCategory(article).name}</Link></span><time dateTime={article.publishDate}>{formatDate(article.publishDate)}</time></div><h1>{article.title}</h1><Person image="" name="Ghanchi Investments" role="Financial education archive"/></Reveal></header><div className="container"><img className="inner-cover" src={article.coverImage} alt="Illustrative editorial photography" fetchPriority="high"/></div><div className="inner-article-body"><p className="inner-legal-note">{article.editorialNote}</p><RichText blocks={article.content}/><section className="inner-author-bio"><p className="inner-eyebrow">About this article</p><p>Adapted from the Ghanchi Investments archive. Original publication date shown above. Speak with us about your current circumstances before making a financial decision.</p><a href={article.sourceUrl} target="_blank" rel="noreferrer">Original source ↗</a></section></div></article>{related.length > 0 && <section className="container page-section inner-related"><div className="inner-section-heading"><h2>Keep exploring.</h2><Button href="/blog" variant="ghost" dot>All articles</Button></div><InsightGrid items={related}/></section>}</main>;
}
