import type { Metadata } from 'next';
import { Facebook, Instagram, Linkedin, Mail } from 'lucide-react';
import { getAboutPage, getNavigation, getSiteSettings, getTeamMembers } from '@/lib/strapi';
import { InnerCTA, PageIntro } from '@/components/inner-pages';
import { Button, Reveal } from '@/components/ui';

const founderSocialIcons = { Facebook, Instagram, LinkedIn: Linkedin, Email: Mail };
const FOUNDER_EXTRA_SOCIAL_LINKS = [
  { label: 'Instagram', url: 'https://www.instagram.com/ghanchichandrakant/' },
  { label: 'Facebook', url: 'https://www.facebook.com/chandrakantlic/' },
];

export async function generateMetadata(): Promise<Metadata> {
  const page = await getAboutPage();
  return { title: page.intro.metaTitle, description: page.intro.metaDescription, alternates: { canonical: '/about-us' } };
}
export default async function AboutPage() {
  const [teamMembers, siteSettings, navigation, page] = await Promise.all([
    getTeamMembers(), getSiteSettings(), getNavigation(), getAboutPage(),
  ]);
  const founder = teamMembers[0];
  const aboutUsNav = navigation.find(item => item.href === '/about-us');
  const heroIsVideo = /\.(mp4|webm|mov)$/i.test(siteSettings.heroImage);
  return <main id="main" className="inner-page"><section className="inner-about-cover">{heroIsVideo ? <video src={siteSettings.heroImage} autoPlay muted loop playsInline aria-hidden="true"/> : <img src={siteSettings.heroImage} alt="" fetchPriority="high"/>}<div className="inner-about-intro"><PageIntro title={page.intro.title} description={page.intro.description}/><div className="container"><Button href={`#${founder?.id}`} dot>{page.meetAdvisorLabel}</Button></div></div></section>{founder && <section id={founder.id} className="container page-section inner-founder"><Reveal>{founder.headshot && <img className="inner-founder-photo" src={founder.headshot} alt={founder.name} loading="lazy" style={{ objectPosition: `${founder.headshotFocalX}% ${founder.headshotFocalY}%` }}/>}<div className="inner-founder-label"><strong>{founder.name}</strong><span>{founder.role}</span><div className="social-links">{[...FOUNDER_EXTRA_SOCIAL_LINKS, ...founder.socialLinks].map(link => { const Icon = founderSocialIcons[link.label as keyof typeof founderSocialIcons]; if (!Icon) return null; return <a key={link.url} href={link.url} aria-label={link.label} target="_blank" rel="noreferrer"><Icon className="social-icon-default" size={18}/><Icon className="social-icon-hover" size={18} aria-hidden="true"/></a>; })}</div></div></Reveal><Reveal className="inner-founder-letter"><p className="inner-eyebrow">{page.founderIntroEyebrow}</p><h2>{page.founderIntroHeading.split('\n').map((line, i) => <span key={i}>{line}<br/></span>)}</h2><p>{founder.bio}</p>{page.founderExtraParagraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</Reveal></section>}<section className="inner-values-wrap"><div className="container page-section"><div className="inner-section-heading"><h2>{page.valuesHeading}</h2></div><div className="inner-values">{page.values.map((value, index) => <Reveal className="inner-value" key={value.title} delay={index * .05}><span>{String(index + 1).padStart(2, '0')}</span><h3>{value.title}</h3><p>{value.description}</p></Reveal>)}</div></div></section><section className="container inner-philosophy"><p className="inner-eyebrow">{page.visionEyebrow}</p><h2>“{siteSettings.vision}”</h2><p>{page.visionFollowup}</p></section><section className="container inner-services-grid" aria-label="Explore Ghanchi Investments">{aboutUsNav?.children?.slice(1).map(item => <a className="inner-service-card" href={item.href} key={item.href}><h2>{item.title}</h2><span className="inner-service-more">{page.exploreLabel}</span></a>)}</section><InnerCTA cta={siteSettings.innerCta}/></main>;
}
