import type { Metadata } from 'next';
import { ContactIntro, ContactSection } from '@/components/contact';
import { FAQ } from '@/components/faq';

export const metadata: Metadata = { title: 'Contact Us', description: 'Contact Ghanchi Investments in CBD Belapur, Navi Mumbai, to discuss your financial goals.', alternates: { canonical: '/contact-us' } };
export default function ContactPage() {
  return <main id="main" className="contact-page"><ContactIntro/><ContactSection asPage/><FAQ contact/></main>;
}
