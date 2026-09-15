import type { Metadata } from 'next';
import { ContactSection } from '@/components/contact';

export const metadata: Metadata = { title: 'Contact', description: 'Find your next growth lever. Tell Kora about your business and start a conversation about sustainable growth.' };

export default function ContactPage() {
  return <main className="inner-page"><ContactSection asPage /></main>;
}
