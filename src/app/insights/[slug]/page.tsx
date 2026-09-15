import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { formatDate, getAuthor, getCategory, insights } from '@/lib/content';
import { BackLink, InsightGrid, RichText } from '@/components/inner-pages';
import { Button, Person, Reveal } from '@/components/ui';

type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return insights.map(insight => ({ slug: insight.id })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const insight = insights.find(item => item.id === slug);
  if (!insight) notFound();
  return { title: insight.title, description: insight.content[0]?.paragraphs[0], authors: [{ name: getAuthor(insight).name }], openGraph: { type: 'article', title: insight.title, images: [insight.coverImage], publishedTime: insight.publishDate } };
}

export default async function InsightDetailPage({ params }: Props) {
  const { slug } = await params;
  const insight = insights.find(item => item.id === slug);
  if (!insight) notFound();
  const author = getAuthor(insight);
  const related = insights.filter(item => item.id !== insight.id).sort((a, b) => Number(b.categoryId === insight.categoryId) - Number(a.categoryId === insight.categoryId) || b.publishDate.localeCompare(a.publishDate)).slice(0, 2);
  return <main className="inner-page article-page"><article><header className="container inner-detail-header inner-article-header"><BackLink href="/insights">All insights</BackLink><Reveal><div className="inner-meta"><span><Link href={`/insights?category=${insight.categoryId}`}>{getCategory(insight).name}</Link></span><time dateTime={insight.publishDate}>{formatDate(insight.publishDate)}</time></div><h1>{insight.title}</h1><Person image={author.headshot} name={author.name} role={author.role} /></Reveal></header><div className="container"><img className="inner-cover" src={insight.coverImage} alt="" fetchPriority="high" /></div><div className="inner-article-body"><RichText blocks={insight.content} /><section className="inner-author-bio" aria-label={`About ${author.name}`}><p className="inner-eyebrow">About the author</p><Person image={author.headshot} name={author.name} role={author.role} /><p>{author.bio}</p>{author.socialLinks.length > 0 && <div className="inner-team-socials">{author.socialLinks.map(social => <a key={social.url} href={social.url} target="_blank" rel="noreferrer">{social.label}</a>)}</div>}</section></div></article>{related.length > 0 && <section className="container page-section inner-related"><div className="inner-section-heading"><h2>Keep exploring.</h2><Button href="/insights" variant="ghost" dot>All insights</Button></div><InsightGrid items={related} /></section>}</main>;
}
