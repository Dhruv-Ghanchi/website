import type { Metadata } from 'next';
import { Footer, Header, MotionProvider } from '@/components/site-shell';
import './globals.css';
import './inner.css';
import './contact.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL || 'https://ghanchiinvest.com'),
  title: { default: 'Ghanchi Investments — Plan. Protect. Invest.', template: '%s | Ghanchi Investments' },
  description: 'Personalized financial planning, insurance and investment support from Ghanchi Investments, Navi Mumbai. Serving 1,200+ clients in India and abroad.',
  openGraph: { title: 'Ghanchi Investments', description: 'Goal-based financial planning, protection and investment support.', type: 'website', siteName: 'Ghanchi Investments' },
  icons: { icon: '/assets/logo-ghanchi.png', apple: '/assets/logo-ghanchi.png' },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" data-scroll-behavior="smooth"><body><MotionProvider><Header/>{children}<Footer/></MotionProvider></body></html>;
}
