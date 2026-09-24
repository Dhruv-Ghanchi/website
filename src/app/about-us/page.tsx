import type { Metadata } from 'next';
import { getAboutPage, getArticles, getCategories, getNavigation, getSiteSettings, getTeamMembers } from '@/lib/strapi';
import { InnerCTA, InsightGrid, PageIntro } from '@/components/inner-pages';
import { Button, Reveal } from '@/components/ui';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getAboutPage();
  return { title: page.intro.metaTitle, description: page.intro.metaDescription, alternates: { canonical: '/about-us' } };
}
export default async function AboutPage() {
  const [teamMembers, siteSettings, navigation, articles, categories, page] = await Promise.all([
    getTeamMembers(), getSiteSettings(), getNavigation(), getArticles(), getCategories(), getAboutPage(),
  ]);
  const founder = teamMembers[0];
  const aboutUsNav = navigation.find(item => item.href === '/about-us');
  return <main id="main" className="inner-page"><section className="inner-about-cover"><img src={siteSettings.heroImage} alt="" fetchPriority="high"/><div className="inner-about-intro"><PageIntro title={page.intro.title} description={page.intro.description}/><div className="container"><Button href={`#${founder?.id}`} dot>{page.meetAdvisorLabel}</Button></div></div></section>{founder && <section id={founder.id} className="container page-section inner-founder"><Reveal>{founder.headshot && <img className="inner-founder-photo" src={founder.headshot} alt={founder.name} loading="lazy" style={{ objectPosition: `${founder.headshotFocalX}% ${founder.headshotFocalY}%` }}/>}<div className="inner-founder-label"><strong>{founder.name}</strong><span>{founder.role}</span></div></Reveal><Reveal className="inner-founder-letter"><p className="inner-eyebrow">{page.founderIntroEyebrow}</p><h2>{page.founderIntroHeading.split('\n').map((line, i) => <span key={i}>{line}<br/></span>)}</h2><p>{founder.bio}</p>{page.founderExtraParagraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}<span className="inner-founder-signature">{founder.name}</span><div className="inner-team-socials">{founder.socialLinks.map(link => <a href={link.url} key={link.url}>{link.label}</a>)}</div></Reveal></section>}<section className="inner-values-wrap"><div className="container page-section"><div className="inner-section-heading"><h2>{page.valuesHeading}</h2></div><div className="inner-values">{page.values.map((value, index) => <Reveal className="inner-value" key={value.title} delay={index * .05}><span>{String(index + 1).padStart(2, '0')}</span><h3>{value.title}</h3><p>{value.description}</p></Reveal>)}</div></div></section><section className="container inner-philosophy"><p className="inner-eyebrow">{page.visionEyebrow}</p><h2>“{siteSettings.vision}”</h2><p>{page.visionFollowup}</p></section><section className="container inner-services-grid" aria-label="Explore Ghanchi Investments">{aboutUsNav?.children?.slice(1).map(item => <a className="inner-service-card" href={item.href} key={item.href}><h2>{item.title}</h2><span className="inner-service-more">{page.exploreLabel}</span></a>)}</section><section className="container page-section"><div className="inner-section-heading"><h2>{page.learnHeading}</h2></div><InsightGrid items={articles} categories={categories}/></section><InnerCTA cta={siteSettings.innerCta}/></main>;
}
