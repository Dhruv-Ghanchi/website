import { notFound, permanentRedirect } from 'next/navigation';
import { getArticles } from '@/lib/strapi';
export default async function LegacyInsight({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const articles = await getArticles();
  if (!articles.some(item => item.id === slug)) notFound();
  permanentRedirect(`/blog/${slug}`);
}
