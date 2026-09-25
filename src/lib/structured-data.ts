import type { SiteSettings } from '@/lib/strapi';

/**
 * JSON-LD builders. Only verified facts go in here -- no ratings, review
 * counts, or awards (see docs/CURRENT_IMPLEMENTATION_PLAN.md Section 15:
 * structured data must never fabricate reviews/ratings/statistics).
 */

const SITE_URL = process.env.SITE_URL || 'https://ghanchiinvest.com';

export function organizationJsonLd(siteSettings: SiteSettings) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FinancialService',
    name: siteSettings.siteName,
    url: SITE_URL,
    logo: new URL(siteSettings.logo || '/assets/logo-ghanchi.png', SITE_URL).href,
    description: siteSettings.tagline,
    telephone: siteSettings.contactInfo.phone1,
    email: siteSettings.contactInfo.email1,
    address: {
      '@type': 'PostalAddress',
      streetAddress: siteSettings.addressLines.map(line => line.replace(/,\s*$/, '')).join(', '),
      addressLocality: 'Navi Mumbai',
      addressRegion: 'Maharashtra',
      postalCode: '400614',
      addressCountry: 'IN',
    },
    sameAs: siteSettings.socialLinks.map(link => link.href),
  };
}

export function websiteJsonLd(siteSettings: SiteSettings) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteSettings.siteName,
    url: SITE_URL,
  };
}

export function articleJsonLd(article: {
  title: string; coverImage: string; publishDate: string; sourceUrl: string;
}, url: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    image: article.coverImage ? [new URL(article.coverImage, SITE_URL).href] : undefined,
    datePublished: article.publishDate,
    url: new URL(url, SITE_URL).href,
    isBasedOn: article.sourceUrl || undefined,
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: new URL(item.url, SITE_URL).href,
    })),
  };
}
