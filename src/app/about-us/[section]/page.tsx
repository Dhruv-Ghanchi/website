import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  Gem,
  Building2,
  Globe,
  Rocket,
  Laptop,
  Scale,
  Stethoscope,
  Compass,
  Award,
  Users,
} from 'lucide-react';
import { getAboutSubpage, getAboutSubpages, getGalleryItems, getSiteSettings, getTestimonials } from '@/lib/strapi';
import { InnerCTA, PageIntro } from '@/components/inner-pages';
import { TestimonialRing } from '@/components/testimonial-ring';
import { Reveal } from '@/components/ui';
import { breadcrumbJsonLd } from '@/lib/structured-data';

export const revalidate = 60;

const sectorDetails: Record<string, { icon: typeof Gem; shortDesc: string }> = {
  'hnis': {
    icon: Gem,
    shortDesc: 'Generational wealth preservation and estate planning.',
  },
  'business owners': {
    icon: Building2,
    shortDesc: 'Corporate liquidity and succession strategy.',
  },
  'nris': {
    icon: Globe,
    shortDesc: 'Cross-border wealth management and FEMA compliance.',
  },
  'entrepreneurs': {
    icon: Rocket,
    shortDesc: 'Founder runway protection and equity diversification.',
  },
  'software engineers': {
    icon: Laptop,
    shortDesc: 'RSU / ESOP monetization and compounding.',
  },
  'advocates': {
    icon: Scale,
    shortDesc: 'Retainer cash-flow smoothing and liability reserves.',
  },
  'doctors': {
    icon: Stethoscope,
    shortDesc: 'Medical indemnity shields and passive growth.',
  },
  'architects': {
    icon: Compass,
    shortDesc: 'Studio milestone buffering and asset protection.',
  },
  'ceos & cfos': {
    icon: Award,
    shortDesc: 'Executive remuneration and confidential trusts.',
  },
};

function getSectorInfo(groupName: string, fallbackDesc: string) {
  const norm = groupName.trim().toLowerCase();
  for (const [key, info] of Object.entries(sectorDetails)) {
    if (norm === key || norm.includes(key) || key.includes(norm)) {
      return info;
    }
  }
  if (norm.includes('doctor') || norm.includes('physician')) return sectorDetails['doctors'];
  if (norm.includes('architect')) return sectorDetails['architects'];
  if (norm.includes('ceo') || norm.includes('cfo') || norm.includes('executive')) return sectorDetails['ceos & cfos'];
  if (norm.includes('engineer') || norm.includes('developer') || norm.includes('tech')) return sectorDetails['software engineers'];
  if (norm.includes('lawyer') || norm.includes('advocate')) return sectorDetails['advocates'];

  return {
    icon: Users,
    shortDesc: fallbackDesc || 'Personalized planning for goals, risk appetite and cash flows.',
  };
}

type Props = { params: Promise<{ section: string }> };
export async function generateStaticParams() {
  const subpages = await getAboutSubpages();
  return subpages.map(item => ({ section: item.slug }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { section } = await params;
  const page = await getAboutSubpage(section);
  if (!page) notFound();
  return { title: page.intro.metaTitle || page.intro.title, description: page.intro.metaDescription || page.intro.description, alternates: { canonical: `/about-us/${section}` } };
}
export default async function AboutSection({ params }: Props) {
  const { section } = await params;
  const page = await getAboutSubpage(section);
  if (!page) notFound();
  const [awards, certificates, testimonials, siteSettings] = await Promise.all([
    section === 'awards' ? getGalleryItems('awards') : Promise.resolve([]),
    section === 'certificates' ? getGalleryItems('certificates') : Promise.resolve([]),
    section === 'testimonials' ? getTestimonials() : Promise.resolve([]),
    getSiteSettings(),
  ]);
  const jsonLd = breadcrumbJsonLd([{ name: 'Home', url: '/' }, { name: 'About Us', url: '/about-us' }, { name: page.intro.title, url: `/about-us/${section}` }]);
  return <main id="main" className="inner-page">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    <PageIntro eyebrow="Ghanchi Investments" title={page.intro.title} description={page.intro.description} />
    {section === 'awards' || section === 'certificates' ? (
      <section className="container archive-gallery" aria-label={page.intro.title}>
        {(section === 'awards' ? awards : certificates).map(item => <Reveal key={item.id}><figure><a href={item.image} target="_blank" rel="noreferrer" aria-label={`Open ${item.title} in a new tab`}><img src={item.image} alt={item.title} loading="lazy" /></a><figcaption>{item.title}</figcaption></figure></Reveal>)}
      </section>
    ) : section === 'testimonials' ? (
      <section className="testimonial-showcase-full" aria-label="Customer Reviews">
        <TestimonialRing testimonials={testimonials} rating={siteSettings.rating} />
      </section>
    ) : (
      <>
        <section className="container client-sector-grid" aria-label={page.intro.title}>
          {siteSettings.clientGroups.map((group, index) => {
            const sector = getSectorInfo(group, page.clientGroupsIntro);
            const Icon = sector.icon;
            return (
              <Reveal className="client-sector-card" key={group} delay={index * 0.04}>
                <div className="client-sector-icon-wrap">
                  <div className="client-sector-icon-circle">
                    <Icon size={28} strokeWidth={1.8} />
                  </div>
                </div>
                <h2 className="client-sector-name">{group}</h2>
                <p className="client-sector-desc">{sector.shortDesc}</p>
              </Reveal>
            );
          })}
        </section>
        <section className="container inner-philosophy">
          <p className="inner-eyebrow">{page.crossBorderEyebrow}</p>
          <h2>{siteSettings.clientLocations.join(' · ')}</h2>
          <p>{page.clientsAffiliationNote}</p>
        </section>
      </>
    )}
    <InnerCTA cta={siteSettings.innerCta} />
  </main>;
}
