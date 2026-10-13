import type { Metadata } from 'next';
import { ContactIntro, ContactSection } from '@/components/contact';
import { getContactPage, getServices, getSiteSettings } from '@/lib/strapi';

export const metadata: Metadata = { title: 'Contact Us', description: 'Contact Ghanchi Investments in CBD Belapur, Navi Mumbai, to discuss your financial goals.', alternates: { canonical: '/contact-us' } };
export default async function ContactPage() {
  const [siteSettings, contactPage, services] = await Promise.all([
    getSiteSettings(), getContactPage(), getServices(),
  ]);
  return <main id="main" className="contact-page"><ContactIntro siteSettings={siteSettings} contactPage={contactPage}/><ContactSection asPage siteSettings={siteSettings} contactPage={contactPage} services={services}/></main>;
}
