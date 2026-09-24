import type { MetadataRoute } from 'next';
import { getArticles, getServices } from '@/lib/strapi';
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.SITE_URL || 'https://ghanchiinvest.com';
  const [services, articles] = await Promise.all([getServices(), getArticles()]);
  return ['/', '/about-us', '/about-us/awards', '/about-us/certificates', '/about-us/our-clients', '/about-us/testimonials', '/services', '/online-services', '/newsletters', '/blog', '/contact-us', ...services.map(item => `/services/${item.id}`), ...articles.map(item => `/blog/${item.id}`)].map(path => ({ url: new URL(path, base).href }));
}
