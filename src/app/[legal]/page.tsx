import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { legalPages } from '@/lib/content';
import { PageIntro, RichText } from '@/components/inner-pages';

type Props = { params: Promise<{ legal: string }> };
export function generateStaticParams() { return legalPages.map(page => ({ legal: page.id })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { legal } = await params;
  const page = legalPages.find(item => item.id === legal);
  if (!page) notFound();
  return { title: page.title, description: `${page.title} for the Kora website.`, robots: { index: false, follow: true } };
}

export default async function LegalPage({ params }: Props) {
  const { legal } = await params;
  const page = legalPages.find(item => item.id === legal);
  if (!page) notFound();
  return <main className="inner-page inner-legal"><PageIntro eyebrow="The details" title={`${page.title}.`} /><div className="container"><article className="inner-legal-body"><div className="inner-legal-note">This is draft policy content for this website implementation. It must be reviewed and approved by the site owner before publishing.</div><RichText blocks={page.content} /><nav className="inner-legal-nav" aria-label="Legal pages">{legalPages.filter(item => item.id !== page.id).map(item => <Link href={`/${item.id}`} key={item.id}>{item.title}</Link>)}<Link href="/contact">Contact us</Link></nav></article></div></main>;
}
