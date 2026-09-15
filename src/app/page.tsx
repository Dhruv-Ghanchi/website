import { Comparison, Hero } from '@/components/home-hero';
import { FeaturedCase, InsightsSection, PricingSection, ProcessSection, ServicesSection, TeamSection, TestimonialsSection } from '@/components/home-sections';
import { FAQ } from '@/components/faq';
import { ContactSection } from '@/components/contact';

export default function Home() {
  return <main id="main"><div className="home-intro"><Hero/><Comparison/></div><ServicesSection/><ProcessSection/><TeamSection/><TestimonialsSection/><FeaturedCase/><PricingSection/><FAQ/><InsightsSection/><ContactSection/></main>;
}
