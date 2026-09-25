import type { Metadata } from 'next';
import { Comparison, Hero } from '@/components/home-hero';
import { FeaturedCase, InsightsSection, ProcessSection, ServicesSection, TeamSection, TestimonialsSection } from '@/components/home-sections';
import { FAQ } from '@/components/faq';
import { ContactSection } from '@/components/contact';
import { getArticles, getCategories, getContactPage, getFaqItems, getGalleryItems, getHomePage, getNewsletters, getServices, getSiteSettings, getTeamMembers, getTestimonials } from '@/lib/strapi';

export async function generateMetadata(): Promise<Metadata> {
  return { alternates: { canonical: '/' } };
}

export default async function Home() {
  const [homePage, siteSettings, contactPage, faqItems, services, testimonials, teamMembers, articles, categories, newsletters, awards] = await Promise.all([
    getHomePage(), getSiteSettings(), getContactPage(), getFaqItems(), getServices(), getTestimonials(), getTeamMembers(), getArticles(), getCategories(), getNewsletters(), getGalleryItems('awards'),
  ]);
  const founder = teamMembers[0];
  return <main id="main"><div className="home-intro"><Hero heroHeading={homePage.heroHeading} heroSubheading={homePage.heroSubheading} statementText={homePage.statementText} siteSettings={siteSettings} heroCta={homePage.heroCta} trustBadgeCopy={homePage.trustBadge} newsletterCard={homePage.newsletterCard} testimonials={testimonials} newsletter={newsletters[0]}/><Comparison comparisonBefore={homePage.comparisonBefore} comparisonAfter={homePage.comparisonAfter} copy={homePage.comparisonCopy}/></div><ServicesSection services={services} servicesIntro={homePage.servicesIntro}/><ProcessSection phases={homePage.phases} processHeading={homePage.processHeading} processSubheading={homePage.processSubheading} operatingHeading={homePage.operatingHeading} operatingItems={homePage.operatingItems} processVideo={siteSettings.processVideo} processBackdrop={siteSettings.processBackdrop} videoCopy={homePage.processVideoCopy} logo={siteSettings.logo} logoAlt={siteSettings.logoAlt}/><TeamSection teamMembers={teamMembers} teamHeading={homePage.teamHeading} awardsImage={awards[0]?.image} hiringCopy={homePage.hiringCopy} introLinkLabel={homePage.teamIntroLinkLabel}/><TestimonialsSection testimonials={testimonials} siteSettings={siteSettings} teamMembers={teamMembers} founderCallout={homePage.founderCallout}/><FeaturedCase siteSettings={siteSettings} services={services} testimonials={testimonials} copy={homePage.featuredCase}/><FAQ siteSettings={siteSettings} teamMembers={teamMembers} faqItems={faqItems}/><InsightsSection articles={articles} categories={categories} copy={homePage.insightsCopy}/><ContactSection siteSettings={siteSettings} contactPage={contactPage} services={services} testimonials={testimonials}/></main>;
}
