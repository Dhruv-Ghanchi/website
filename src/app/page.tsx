import { Comparison, Hero } from '@/components/home-hero';
import { FeaturedCase, InsightsSection, ProcessSection, ServicesSection, TeamSection, TestimonialsSection } from '@/components/home-sections';
import { FAQ } from '@/components/faq';
import { ContactSection } from '@/components/contact';

export default function Home() {
  return <main id="main"><div className="home-intro"><Hero/><Comparison/></div><ServicesSection/><ProcessSection/><TeamSection/><TestimonialsSection/><FeaturedCase/><FAQ/><InsightsSection/><ContactSection/></main>;
}
