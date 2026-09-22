import { notFound, permanentRedirect } from 'next/navigation';
import { articles } from '@/lib/content';
export default async function LegacyInsight({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!articles.some(item => item.id === slug)) notFound();
  permanentRedirect(`/blog/${slug}`);
}
