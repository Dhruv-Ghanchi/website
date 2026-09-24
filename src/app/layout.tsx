import type { Metadata } from 'next';
import { Footer, Header, MotionProvider } from '@/components/site-shell';
import { getLegalPages, getNavigation, getSiteSettings, getTeamMembers } from '@/lib/strapi';
import { organizationJsonLd, websiteJsonLd } from '@/lib/structured-data';
import './globals.css';
import './inner.css';
import './contact.css';

export async function generateMetadata(): Promise<Metadata> {
  const siteSettings = await getSiteSettings();
  return {
    metadataBase: new URL(process.env.SITE_URL || 'https://ghanchiinvest.com'),
    title: { default: siteSettings.siteMetaTitle, template: siteSettings.siteTitleTemplate },
    description: siteSettings.siteMetaDescription,
    openGraph: { title: siteSettings.siteName, description: siteSettings.tagline, type: 'website', siteName: siteSettings.siteName },
    icons: { icon: '/assets/logo-ghanchi.png', apple: '/assets/logo-ghanchi.png' },
  };
}
export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const [navigation, siteSettings, legalPages, teamMembers] = await Promise.all([
    getNavigation(), getSiteSettings(), getLegalPages(), getTeamMembers(),
  ]);
  const founder = teamMembers[0];
  const jsonLd = [organizationJsonLd(siteSettings), websiteJsonLd(siteSettings)];
  return <html lang="en" data-scroll-behavior="smooth"><body>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    <MotionProvider><Header navigation={navigation} founder={founder} siteSettings={siteSettings}/>{children}<Footer navigation={navigation} legalPages={legalPages} siteSettings={siteSettings} founder={founder}/></MotionProvider></body></html>;
}
