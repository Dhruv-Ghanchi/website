import type { Metadata } from 'next';
import { ContactIntro, ContactSection } from '@/components/contact';
import { FAQ } from '@/components/faq';
import { getContactPage, getFaqItems, getServices, getSiteSettings, getTeamMembers, getTestimonials } from '@/lib/strapi';

export const metadata: Metadata = { title: 'Contact Us', description: 'Contact Ghanchi Investments in CBD Belapur, Navi Mumbai, to discuss your financial goals.', alternates: { canonical: '/contact-us' } };
export default async function ContactPage() {
  const [siteSettings, contactPage, faqItems, services, testimonials, teamMembers] = await Promise.all([
    getSiteSettings(), getContactPage(), getFaqItems(), getServices(), getTestimonials(), getTeamMembers(),
  ]);
  return <main id="main" className="contact-page"><ContactIntro siteSettings={siteSettings} contactPage={contactPage}/><ContactSection asPage siteSettings={siteSettings} contactPage={contactPage} services={services} testimonials={testimonials}/><FAQ contact siteSettings={siteSettings} teamMembers={teamMembers} faqItems={faqItems}/></main>;
}
