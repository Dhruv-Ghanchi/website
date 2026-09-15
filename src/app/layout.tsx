import type { Metadata } from 'next';
import { Footer, Header, MotionProvider } from '@/components/site-shell';
import './globals.css';
import './inner.css';
import './contact.css';

export const metadata: Metadata = {
  title: { default: 'Kora — Your growth partner', template: '%s | Kora' },
  description: 'Kora helps leadership teams gain clarity and build systems that scale. Growth strategy, go-to-market, revenue operations, and a hands-on partner for your next stage.',
  openGraph: { title: 'Kora — Your growth partner', description: 'Clear strategy. Predictable revenue. Lasting growth.', type: 'website' },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><MotionProvider><Header/>{children}<Footer/></MotionProvider></body></html>;
}
