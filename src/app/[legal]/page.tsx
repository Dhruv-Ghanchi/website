import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import Link from 'next/link';
import { articles, legalPages, services } from '@/lib/content';
import { PageIntro, RichText } from '@/components/inner-pages';

type Props = { params: Promise<{ legal: string }> };
function legacyDestination(slug: string) {
  if (['awards', 'certificates', 'our-clients', 'testimonials'].includes(slug)) return `/about-us/${slug}`;
  if (slug === 'blog-post') return '/blog';
  if (services.some(item => item.id === slug)) return `/services/${slug}`;
  if (articles.some(item => item.id === slug)) return `/blog/${slug}`;
}
export function generateStaticParams() { return legalPages.map(page => ({ legal: page.id })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { legal } = await params;
  const destination = legacyDestination(legal);
  if (destination) permanentRedirect(destination);
  const page = legalPages.find(item => item.id === legal);
  if (!page) notFound();
  return { title: page.title, description: `${page.title} for Ghanchi Investments. Draft requiring owner review.`, alternates: { canonical: `/${page.id}` }, robots: { index: false, follow: true } };
}
export default async function LegalPage({ params }: Props) {
  const { legal } = await params;
  const destination = legacyDestination(legal);
  if (destination) permanentRedirect(destination);
  const page = legalPages.find(item => item.id === legal);
  if (!page) notFound();
  return <main id="main" className="inner-page inner-legal"><PageIntro eyebrow="The details" title={`${page.title}.`}/><div className="container"><article className="inner-legal-body"><div className="inner-legal-note">Draft policy content. The site owner must review and approve this before launch.</div><RichText blocks={page.content}/><nav className="inner-legal-nav" aria-label="Legal pages">{legalPages.filter(item => item.id !== page.id).map(item => <Link href={`/${item.id}`} key={item.id}>{item.title}</Link>)}<Link href="/contact-us">Contact us</Link></nav></article></div></main>;
}
