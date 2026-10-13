import type { Metadata } from 'next';
import { Hero } from '@/components/home-hero';
import { InsightsSection, ProcessSection, ServicesSection, TeamSection, TestimonialsSection } from '@/components/home-sections';
import { FAQ } from '@/components/faq';
import { ContactSection } from '@/components/contact';
import { getArticles, getCategories, getContactPage, getFaqItems, getRecognitionGallery, getHomePage, getNewsletters, getServices, getSiteSettings, getTeamMembers, getTestimonials } from '@/lib/strapi';

export async function generateMetadata(): Promise<Metadata> {
  return { alternates: { canonical: '/' } };
}

export default async function Home() {
  const [homePage, siteSettings, contactPage, faqItems, services, testimonials, teamMembers, articles, categories, newsletters, recognition] = await Promise.all([
    getHomePage(), getSiteSettings(), getContactPage(), getFaqItems(), getServices(), getTestimonials(), getTeamMembers(), getArticles(), getCategories(), getNewsletters(), getRecognitionGallery(),
  ]);
  return <main id="main"><div className="home-intro"><Hero heroHeading={homePage.heroHeading} heroSubheading={homePage.heroSubheading} statementText={homePage.statementText} siteSettings={siteSettings} heroCta={homePage.heroCta} trustBadgeCopy={homePage.trustBadge} newsletterCard={homePage.newsletterCard} testimonials={testimonials} newsletter={newsletters[0]}/><ServicesSection services={services} servicesIntro={homePage.servicesIntro}/></div><TestimonialsSection testimonials={testimonials} siteSettings={siteSettings} teamMembers={teamMembers} founderCallout={homePage.founderCallout}/><TeamSection teamMembers={teamMembers} teamHeading={homePage.teamHeading} hiringCopy={homePage.hiringCopy} recognition={recognition}/><ProcessSection phases={homePage.phases} processHeading={homePage.processHeading} processSubheading={homePage.processSubheading} operatingHeading={homePage.operatingHeading} operatingItems={homePage.operatingItems} processVideo={siteSettings.processVideo} processBackdrop={siteSettings.processBackdrop} videoCopy={homePage.processVideoCopy} logo={siteSettings.logo} logoAlt={siteSettings.logoAlt}/><FAQ siteSettings={siteSettings} teamMembers={teamMembers} faqItems={faqItems}/><InsightsSection articles={articles} categories={categories} copy={homePage.insightsCopy}/><ContactSection siteSettings={siteSettings} contactPage={contactPage} services={services}/></main>;
}
