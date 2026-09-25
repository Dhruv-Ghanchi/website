import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { formatDate, getCategory } from '@/lib/content';
import { getArticles, getBlogPage, getCategories } from '@/lib/strapi';
import { BackLink, InsightGrid, RichText } from '@/components/inner-pages';
import { Button, Person, Reveal } from '@/components/ui';
import { articleJsonLd, breadcrumbJsonLd } from '@/lib/structured-data';

type Props = { params: Promise<{ slug: string }> };
export async function generateStaticParams() { const articles = await getArticles(); return articles.map(item => ({ slug: item.id })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const articles = await getArticles();
  const article = articles.find(item => item.id === slug);
  if (!article) notFound();
  return { title: article.title, description: article.content[0]?.paragraphs[0], alternates: { canonical: `/blog/${slug}` }, openGraph: { type: 'article', title: article.title, images: [article.coverImage], publishedTime: article.publishDate } };
}
export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const [articles, categories, page] = await Promise.all([getArticles(), getCategories(), getBlogPage()]);
  const article = articles.find(item => item.id === slug);
  if (!article) notFound();
  const related = articles.filter(item => item.id !== slug);
  const category = getCategory(article, categories);
  const jsonLd = [
    articleJsonLd(article, `/blog/${slug}`),
    breadcrumbJsonLd([{ name: 'Home', url: '/' }, { name: 'Blog', url: '/blog' }, { name: article.title, url: `/blog/${slug}` }]),
  ];
  return <main id="main" className="inner-page article-page"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} /><article><header className="container inner-detail-header inner-article-header"><BackLink href="/blog">{page.allArticlesLabel}</BackLink><Reveal><div className="inner-meta"><span><Link href={`/blog?category=${article.categoryId}`}>{category?.name}</Link></span><time dateTime={article.publishDate}>{formatDate(article.publishDate)}</time></div><h1>{article.title}</h1><Person image="" name="Ghanchi Investments" role="Financial education archive"/></Reveal></header><div className="container"><img className="inner-cover" src={article.coverImage} alt={article.coverImageAlt} fetchPriority="high" style={{ objectPosition: `${article.coverFocalX}% ${article.coverFocalY}%` }}/></div><div className="inner-article-body"><p className="inner-legal-note">{article.editorialNote}</p><RichText blocks={article.content}/><section className="inner-author-bio"><p className="inner-eyebrow">{page.aboutHeading}</p><p>{page.aboutText}</p><a href={article.sourceUrl} target="_blank" rel="noreferrer">{page.originalSourceLabel}</a></section></div></article>{related.length > 0 && <section className="container page-section inner-related"><div className="inner-section-heading"><h2>{page.keepExploringHeading}</h2><Button href="/blog" variant="ghost" dot>{page.allArticlesLabel}</Button></div><InsightGrid items={related} categories={categories}/></section>}</main>;
}
