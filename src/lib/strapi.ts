import type { Article, Category, GalleryItem, LegalPage, NavItem, Newsletter, OnlineService, RichTextBlock, Service, Stat, TeamMember, Testimonial } from './content';

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const REVALIDATE_SECONDS = 60;

// Strapi auto-generates resized derivatives (thumbnail/small/medium/large) on upload, but PNG
// re-encoding can sometimes bloat past the original (seen on our AI-generated service images),
// so we only use a derivative when it's actually smaller than the file it was resized from.
// `large` (max 1000px) is used for full-bleed background images so they stay crisp on big
// screens; `medium` (max 750px) is used everywhere else, since no card on this site renders
// wider than ~590px.
export function mediaUrl(media: StrapiMedia | null | undefined, preferLarge = false): string {
  if (!media?.url) return '';
  const candidate = preferLarge ? media.formats?.large : media.formats?.medium;
  const url = candidate && candidate.size < media.size ? candidate.url : media.url;
  return url.startsWith('http') ? url : `${STRAPI_URL}${url}`;
}

// Strapi 5's Media Library has a native focal-point picker (drag a circle on the image, or type
// X/Y) — set per-asset via fileInfo.focalPoint, returned here as media.focalPoint. We read it
// instead of maintaining our own per-record fields; defaults to center when never set.
export function mediaFocal(media: StrapiMedia | null | undefined): { x: number; y: number } {
  return { x: media?.focalPoint?.x ?? 50, y: media?.focalPoint?.y ?? 50 };
}

type StrapiMediaFormat = { url: string; size: number };
type StrapiMedia = {
  id: number; url: string; size: number; alternativeText?: string | null;
  focalPoint?: { x: number; y: number } | null;
  formats?: { medium?: StrapiMediaFormat; large?: StrapiMediaFormat };
};
type StrapiComponent<T> = T & { id: number };

async function strapiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${STRAPI_URL}/api/${path}`, { next: { revalidate: REVALIDATE_SECONDS } });
  if (!res.ok) throw new Error(`Strapi request failed: ${path} -> ${res.status}`);
  const json = await res.json();
  return json.data as T;
}

function blocksToRichText(content: unknown[] | null | undefined): RichTextBlock[] {
  if (!content) return [];
  return content.map((raw) => {
    const block = raw as { heading?: string | null; body?: string };
    return { heading: block.heading || undefined, paragraphs: (block.body || '').split('\n\n').filter(Boolean) };
  });
}

// ---------- Services ----------
type RawService = {
  id: number; title: string; slug: string; icon: string; shortDesc: string; longDesc: string;
  deliverables: StrapiComponent<{ value: string }>[]; image: StrapiMedia | null;
  testimonial: RawTestimonial | null; order: number; sourceUrl: string;
};
function mapService(raw: RawService): Service {
  const focal = mediaFocal(raw.image);
  return {
    id: raw.slug, title: raw.title, icon: raw.icon, shortDesc: raw.shortDesc, longDesc: raw.longDesc,
    deliverables: raw.deliverables.map(d => d.value), image: mediaUrl(raw.image),
    imageAlt: raw.image?.alternativeText || `Illustrative ${raw.title.toLowerCase()} imagery`,
    imageFocalX: focal.x, imageFocalY: focal.y,
    testimonial: raw.testimonial ? mapTestimonial(raw.testimonial) : ({} as Testimonial),
    sourceUrl: raw.sourceUrl,
  };
}
export async function getServices(): Promise<Service[]> {
  const data = await strapiFetch<RawService[]>('services?populate=*&sort=order:asc&pagination[pageSize]=100');
  return data.map(mapService);
}
export async function getService(slug: string): Promise<Service | undefined> {
  const data = await strapiFetch<RawService[]>(`services?populate=*&filters[slug][$eq]=${encodeURIComponent(slug)}`);
  return data[0] ? mapService(data[0]) : undefined;
}

// ---------- Testimonials ----------
type RawTestimonial = { id: number; name: string; role: string; quote: string; image: StrapiMedia | null; sourceUrl: string; featured: boolean; order: number };
function mapTestimonial(raw: RawTestimonial): Testimonial {
  const focal = mediaFocal(raw.image);
  return { id: String(raw.id), name: raw.name, role: raw.role, quote: raw.quote, image: mediaUrl(raw.image), focalX: focal.x, focalY: focal.y, sourceUrl: raw.sourceUrl };
}
export async function getTestimonials(): Promise<Testimonial[]> {
  const data = await strapiFetch<RawTestimonial[]>('testimonials?populate=*&sort=order:asc&pagination[pageSize]=100');
  return data.map(mapTestimonial);
}

// ---------- Categories ----------
type RawCategory = { id: number; name: string; slug: string };
function mapCategory(raw: RawCategory): Category { return { id: raw.slug, name: raw.name }; }
export async function getCategories(): Promise<Category[]> {
  const data = await strapiFetch<RawCategory[]>('categories?pagination[pageSize]=100');
  return data.map(mapCategory);
}

// ---------- Articles ----------
type RawArticle = {
  id: number; title: string; slug: string; coverImage: StrapiMedia | null;
  publishDate: string; category: RawCategory | null; content: unknown[]; editorialNote: string; sourceUrl: string;
};
function mapArticle(raw: RawArticle): Article {
  const focal = mediaFocal(raw.coverImage);
  return {
    id: raw.slug, title: raw.title, coverImage: mediaUrl(raw.coverImage),
    coverImageAlt: raw.coverImage?.alternativeText || 'Illustrative editorial photography',
    coverFocalX: focal.x, coverFocalY: focal.y, publishDate: raw.publishDate,
    content: blocksToRichText(raw.content), categoryId: raw.category?.slug || '', sourceUrl: raw.sourceUrl,
    editorialNote: raw.editorialNote,
  };
}
export async function getArticles(): Promise<Article[]> {
  const data = await strapiFetch<RawArticle[]>('articles?populate=*&sort=publishDate:desc&pagination[pageSize]=100');
  return data.map(mapArticle);
}
export async function getArticle(slug: string): Promise<Article | undefined> {
  const data = await strapiFetch<RawArticle[]>(`articles?populate=*&filters[slug][$eq]=${encodeURIComponent(slug)}`);
  return data[0] ? mapArticle(data[0]) : undefined;
}

// ---------- Newsletters ----------
type RawNewsletter = { id: number; title: string; issueMonth: string; coverImage: StrapiMedia | null; url: string | null };
function mapNewsletter(raw: RawNewsletter): Newsletter {
  return { id: String(raw.id), title: raw.title, issueMonth: raw.issueMonth, coverImage: mediaUrl(raw.coverImage), url: raw.url };
}
export async function getNewsletters(): Promise<Newsletter[]> {
  const data = await strapiFetch<RawNewsletter[]>('newsletters?populate=*&sort=issueMonth:desc&pagination[pageSize]=200');
  return data.map(mapNewsletter);
}

// ---------- Team ----------
type RawTeamMember = { id: number; name: string; role: string; headshot: StrapiMedia | null; bio: string; socialLinks: StrapiComponent<{ label: string; url: string }>[] };
function mapTeamMember(raw: RawTeamMember): TeamMember {
  const focal = mediaFocal(raw.headshot);
  return {
    id: String(raw.id), name: raw.name, role: raw.role, headshot: mediaUrl(raw.headshot),
    headshotFocalX: focal.x, headshotFocalY: focal.y,
    bio: raw.bio, socialLinks: raw.socialLinks.map(l => ({ label: l.label, url: l.url })),
  };
}
export async function getTeamMembers(): Promise<TeamMember[]> {
  const data = await strapiFetch<RawTeamMember[]>('team-members?populate=*&sort=order:asc&pagination[pageSize]=100');
  return data.map(mapTeamMember);
}

// ---------- Legal pages ----------
type RawLegalPage = { id: number; title: string; slug: string; content: unknown[] };
function mapLegalPage(raw: RawLegalPage): LegalPage {
  return { id: raw.slug, title: raw.title, content: blocksToRichText(raw.content) };
}
export async function getLegalPages(): Promise<LegalPage[]> {
  const data = await strapiFetch<RawLegalPage[]>('legal-pages?populate=*&pagination[pageSize]=100');
  return data.map(mapLegalPage);
}
export async function getLegalPage(slug: string): Promise<LegalPage | undefined> {
  const data = await strapiFetch<RawLegalPage[]>(`legal-pages?populate=*&filters[slug][$eq]=${encodeURIComponent(slug)}`);
  return data[0] ? mapLegalPage(data[0]) : undefined;
}

// ---------- Online services ----------
type RawOnlineService = { id: number; title: string; description: string; url: string; type: 'internal' | 'external'; order: number };
function mapOnlineService(raw: RawOnlineService): OnlineService {
  return { id: String(raw.id), title: raw.title, description: raw.description, url: raw.url, type: raw.type };
}
export async function getOnlineServices(): Promise<OnlineService[]> {
  const data = await strapiFetch<RawOnlineService[]>('online-services?sort=order:asc&pagination[pageSize]=100');
  return data.map(mapOnlineService);
}

// ---------- Gallery ----------
type RawGalleryItem = { id: number; title: string; image: StrapiMedia | null; category: 'awards' | 'certificates'; sourceUrl: string; order: number };
function mapGalleryItem(raw: RawGalleryItem): GalleryItem {
  return { id: String(raw.id), title: raw.title, image: mediaUrl(raw.image), sourceUrl: raw.sourceUrl };
}
export async function getGalleryItems(category: 'awards' | 'certificates'): Promise<GalleryItem[]> {
  const data = await strapiFetch<RawGalleryItem[]>(`gallery-items?filters[category][$eq]=${category}&populate=*&sort=order:asc&pagination[pageSize]=100`);
  return data.map(mapGalleryItem);
}

// ---------- Navigation ----------
type RawNavItem = { id: number; title: string; href: string; children: StrapiComponent<{ title: string; href: string }>[] };
export async function getNavigation(): Promise<NavItem[]> {
  const data = await strapiFetch<{ items: RawNavItem[] }>('navigation?populate[items][populate]=children');
  return (data?.items || []).map(item => ({
    title: item.title, href: item.href,
    children: item.children?.length ? item.children.map(c => ({ title: c.title, href: c.href })) : undefined,
  }));
}

// ---------- Site settings ----------
export type CtaBlock = { eyebrow: string; heading: string; description: string; checklist: string[]; buttonLabel: string };
export type ContactFormCopy = {
  introText: string; nameLabel: string; namePlaceholder: string; emailLabel: string; emailPlaceholder: string;
  phoneLabel: string; phonePlaceholder: string; servicesLegend: string; goalLabel: string; goalPlaceholder: string;
  messageLabel: string; messagePlaceholder: string; consentText: string; submitLabel: string; sendingLabel: string;
  successLabel: string; successMessage: string; genericErrorMessage: string; actionsNote: string;
};
export type NewsletterFormCopy = {
  label: string; placeholder: string; consentText: string; submitLabel: string; sendingLabel: string;
  successLabel: string; successMessage: string; genericErrorMessage: string;
};
export type SiteSettings = {
  siteName: string; tagline: string;
  contactInfo: { phone1: string; phone2: string; email1: string; email2: string };
  addressLines: string[]; socialLinks: { name: string; href: string }[];
  stats: Stat[]; clientLocations: string[]; clientGroups: string[];
  vision: string; rating: { value: number; max: number; note: string };
  footerDisclosure: string; heroImage: string; heroOverlayOpacity: number; processVideo: string;
  testimonialBackground: string; processBackdrop: string; featuredCaseImage: string; contactBackground: string;
  innerCta: CtaBlock; newsletterFormCopy: NewsletterFormCopy;
  headerCtaLabel: string; footerWordmark: string; footerSocialsLabel: string; footerLegalLabel: string;
  footerNavigationLabel: string; skipLinkLabel: string;
  siteMetaTitle: string; siteMetaDescription: string; siteTitleTemplate: string;
  faqHeading: string; moreQuestionsLabel: string; moreQuestionsSubtext: string; talkLinkLabel: string;
  logo: string; logoAlt: string;
};
type RawSiteSettings = {
  siteName: string; tagline: string;
  contactInfo: { phone1: string; phone2: string; email1: string; email2: string };
  addressLines: StrapiComponent<{ value: string }>[];
  socialLinks: StrapiComponent<{ label: string; url: string }>[];
  stats: StrapiComponent<{ value: number; suffix: string; label: string; decimals: number }>[];
  clientLocations: StrapiComponent<{ value: string }>[];
  clientGroups: StrapiComponent<{ value: string }>[];
  vision: string; ratingValue: number; ratingMax: number; ratingNote: string;
  footerDisclosure: string; heroImage: StrapiMedia | null; heroOverlayOpacity: number; processVideo: StrapiMedia | null;
  testimonialBackground: StrapiMedia | null; processBackdrop: StrapiMedia | null; featuredCaseImage: StrapiMedia | null;
  contactBackground: StrapiMedia | null;
  innerCta: StrapiComponent<{ eyebrow: string; heading: string; description: string; checklist: StrapiComponent<{ value: string }>[]; buttonLabel: string }>;
  newsletterFormCopy: StrapiComponent<NewsletterFormCopy>;
  headerCtaLabel: string; footerWordmark: string; footerSocialsLabel: string; footerLegalLabel: string;
  footerNavigationLabel: string; skipLinkLabel: string;
  siteMetaTitle: string; siteMetaDescription: string; siteTitleTemplate: string;
  faqHeading: string; moreQuestionsLabel: string; moreQuestionsSubtext: string; talkLinkLabel: string;
  logo: StrapiMedia | null; logoAlt: string;
};
export async function getSiteSettings(): Promise<SiteSettings> {
  const raw = await strapiFetch<RawSiteSettings>(
    'site-setting?' +
    'populate[contactInfo]=true&populate[addressLines]=true&populate[socialLinks]=true&populate[stats]=true&' +
    'populate[clientLocations]=true&populate[clientGroups]=true&populate[heroImage]=true&populate[processVideo]=true&' +
    'populate[testimonialBackground]=true&populate[processBackdrop]=true&populate[featuredCaseImage]=true&populate[contactBackground]=true&' +
    'populate[innerCta][populate]=checklist&populate[newsletterFormCopy]=true&populate[logo]=true'
  );
  return {
    siteName: raw.siteName, tagline: raw.tagline, contactInfo: raw.contactInfo,
    addressLines: raw.addressLines.map(a => a.value),
    socialLinks: raw.socialLinks.map(s => ({ name: s.label, href: s.url })),
    stats: raw.stats.map(s => ({ value: s.value, suffix: s.suffix, label: s.label, decimals: s.decimals })),
    clientLocations: raw.clientLocations.map(c => c.value), clientGroups: raw.clientGroups.map(c => c.value),
    vision: raw.vision, rating: { value: raw.ratingValue, max: raw.ratingMax, note: raw.ratingNote },
    footerDisclosure: raw.footerDisclosure, heroImage: mediaUrl(raw.heroImage, true),
    heroOverlayOpacity: raw.heroOverlayOpacity, processVideo: mediaUrl(raw.processVideo),
    testimonialBackground: mediaUrl(raw.testimonialBackground, true), processBackdrop: mediaUrl(raw.processBackdrop, true),
    featuredCaseImage: mediaUrl(raw.featuredCaseImage, true), contactBackground: mediaUrl(raw.contactBackground, true),
    innerCta: { ...raw.innerCta, checklist: raw.innerCta.checklist.map(c => c.value) },
    newsletterFormCopy: raw.newsletterFormCopy,
    headerCtaLabel: raw.headerCtaLabel, footerWordmark: raw.footerWordmark, footerSocialsLabel: raw.footerSocialsLabel,
    footerLegalLabel: raw.footerLegalLabel, footerNavigationLabel: raw.footerNavigationLabel, skipLinkLabel: raw.skipLinkLabel,
    siteMetaTitle: raw.siteMetaTitle, siteMetaDescription: raw.siteMetaDescription, siteTitleTemplate: raw.siteTitleTemplate,
    faqHeading: raw.faqHeading, moreQuestionsLabel: raw.moreQuestionsLabel, moreQuestionsSubtext: raw.moreQuestionsSubtext,
    talkLinkLabel: raw.talkLinkLabel,
    logo: mediaUrl(raw.logo) || '/assets/logo-ghanchi.png', logoAlt: raw.logoAlt || 'Ghanchi Investments',
  };
}

// ---------- Home page ----------
export type HomePageContent = {
  heroHeading: string; heroSubheading: string; statementText: string; servicesIntro: string;
  processHeading: string; processSubheading: string;
  phases: { title: string; icon: string; text: string }[];
  operatingHeading: string; operatingItems: { icon: string; title: string; text: string }[];
  comparisonBefore: string[]; comparisonAfter: string[]; teamHeading: string;
  heroCta: { primaryLabel: string; secondaryLabel: string };
  trustBadge: { badgeText: string; ratingContext: string };
  newsletterCard: { badgeLabel: string; latestLabel: string; issueSuffixLabel: string; readLabel: string };
  comparisonCopy: { headingLine1: string; headingLine2: string; beforeLabel: string; beforeHeading: string; afterLabel: string; afterHeading: string };
  hiringCopy: { heading: string; text: string; buttonLabel: string };
  founderCallout: { heading: string; text: string; buttonLabel: string };
  featuredCase: {
    eyebrow: string; heading: string; focusLabel: string; focusValue: string; clientsLabel: string; clientsValue: string;
    reviewLabel: string; reviewValue: string; servicesLabel: string; buttonLabel: string;
  };
  insightsCopy: { headingLine1: string; headingLine2: string; text: string; buttonLabel: string };
  processVideoCopy: { approachLabel: string; heading: string; subtext: string; watchAriaLabel: string; notConnectedText: string; watchVideosLabel: string };
  teamIntroLinkLabel: string;
};
type RawHomePage = {
  heroHeading: string; heroSubheading: string; statementText: string; servicesIntro: string;
  processHeading: string; processSubheading: string;
  phases: StrapiComponent<{ title: string; icon: string; text: string }>[];
  operatingHeading: string; operatingItems: StrapiComponent<{ icon: string; title: string; text: string }>[];
  comparisonBefore: StrapiComponent<{ value: string }>[]; comparisonAfter: StrapiComponent<{ value: string }>[];
  teamHeading: string;
  heroCta: StrapiComponent<HomePageContent['heroCta']>;
  trustBadge: StrapiComponent<HomePageContent['trustBadge']>;
  newsletterCard: StrapiComponent<HomePageContent['newsletterCard']>;
  comparisonCopy: StrapiComponent<HomePageContent['comparisonCopy']>;
  hiringCopy: StrapiComponent<HomePageContent['hiringCopy']>;
  founderCallout: StrapiComponent<HomePageContent['founderCallout']>;
  featuredCase: StrapiComponent<HomePageContent['featuredCase']>;
  insightsCopy: StrapiComponent<HomePageContent['insightsCopy']>;
  processVideoCopy: StrapiComponent<HomePageContent['processVideoCopy']>;
  teamIntroLinkLabel: string;
};
export async function getHomePage(): Promise<HomePageContent> {
  const raw = await strapiFetch<RawHomePage>('home-page?populate=*');
  return {
    heroHeading: raw.heroHeading, heroSubheading: raw.heroSubheading, statementText: raw.statementText,
    servicesIntro: raw.servicesIntro, processHeading: raw.processHeading, processSubheading: raw.processSubheading,
    phases: raw.phases.map(p => ({ title: p.title, icon: p.icon, text: p.text })),
    operatingHeading: raw.operatingHeading, operatingItems: raw.operatingItems.map(o => ({ icon: o.icon, title: o.title, text: o.text })),
    comparisonBefore: raw.comparisonBefore.map(c => c.value), comparisonAfter: raw.comparisonAfter.map(c => c.value),
    teamHeading: raw.teamHeading,
    heroCta: raw.heroCta, trustBadge: raw.trustBadge, newsletterCard: raw.newsletterCard,
    comparisonCopy: raw.comparisonCopy, hiringCopy: raw.hiringCopy, founderCallout: raw.founderCallout,
    featuredCase: raw.featuredCase, insightsCopy: raw.insightsCopy,
    processVideoCopy: raw.processVideoCopy, teamIntroLinkLabel: raw.teamIntroLinkLabel,
  };
}

// ---------- Page intro shape (shared by static pages) ----------
export type PageIntroContent = { eyebrow: string; title: string; description: string; metaTitle: string; metaDescription: string };
type RawPageIntro = StrapiComponent<PageIntroContent>;

// ---------- Services page ----------
export type ServicesPageContent = {
  intro: PageIntroContent; deliverablesEyebrow: string; deliverablesHeading: string; deliverablesText: string;
  disclaimerText: string; connectedHeading: string; discussGoalsLabel: string; allServicesLabel: string;
};
export async function getServicesPage(): Promise<ServicesPageContent> {
  const raw = await strapiFetch<{
    intro: RawPageIntro; deliverablesEyebrow: string; deliverablesHeading: string; deliverablesText: string;
    disclaimerText: string; connectedHeading: string; discussGoalsLabel: string; allServicesLabel: string;
  }>('services-page?populate=*');
  return { ...raw, intro: raw.intro };
}

// ---------- Blog page ----------
export type BlogPageContent = {
  intro: PageIntroContent; emptyStateTitle: string; emptyStateDescription: string;
  aboutHeading: string; aboutText: string; originalSourceLabel: string; keepExploringHeading: string; allArticlesLabel: string;
};
export async function getBlogPage(): Promise<BlogPageContent> {
  return strapiFetch<BlogPageContent>('blog-page?populate=*');
}

// ---------- Online services page ----------
export type OnlineServicesPageContent = { intro: PageIntroContent; legalDisclaimer: string };
export async function getOnlineServicesPage(): Promise<OnlineServicesPageContent> {
  return strapiFetch<OnlineServicesPageContent>('online-services-page?populate=*');
}

// ---------- Newsletters page ----------
export type NewslettersPageContent = { intro: PageIntroContent };
export async function getNewslettersPage(): Promise<NewslettersPageContent> {
  return strapiFetch<NewslettersPageContent>('newsletters-page?populate=*');
}

// ---------- Contact page ----------
export type ContactPageContent = {
  intro: PageIntroContent; officeHoursLabel: string; officeHoursText: string; sectionHeading: string;
  benefits: string[]; stats: Stat[]; formCopy: ContactFormCopy;
};
export async function getContactPage(): Promise<ContactPageContent> {
  const raw = await strapiFetch<{
    intro: RawPageIntro; officeHoursLabel: string; officeHoursText: string; sectionHeading: string;
    benefits: StrapiComponent<{ value: string }>[];
    stats: StrapiComponent<{ value: number; suffix: string; label: string; decimals: number }>[];
    formCopy: StrapiComponent<ContactFormCopy>;
  }>('contact-page?populate=*');
  return {
    intro: raw.intro, officeHoursLabel: raw.officeHoursLabel, officeHoursText: raw.officeHoursText,
    sectionHeading: raw.sectionHeading, benefits: raw.benefits.map(b => b.value),
    stats: raw.stats.map(s => ({ value: s.value, suffix: s.suffix, label: s.label, decimals: s.decimals })),
    formCopy: raw.formCopy,
  };
}

// ---------- About page ----------
export type AboutPageContent = {
  intro: PageIntroContent; meetAdvisorLabel: string; founderExtraParagraphs: string[];
  valuesHeading: string; values: { title: string; description: string }[];
  visionEyebrow: string; visionFollowup: string; learnHeading: string; exploreLabel: string;
  founderIntroEyebrow: string; founderIntroHeading: string;
};
export async function getAboutPage(): Promise<AboutPageContent> {
  const raw = await strapiFetch<{
    intro: RawPageIntro; meetAdvisorLabel: string; founderExtraParagraphs: StrapiComponent<{ value: string }>[];
    valuesHeading: string; values: StrapiComponent<{ title: string; description: string }>[];
    visionEyebrow: string; visionFollowup: string; learnHeading: string; exploreLabel: string;
    founderIntroEyebrow: string; founderIntroHeading: string;
  }>('about-page?populate=*');
  return {
    intro: raw.intro, meetAdvisorLabel: raw.meetAdvisorLabel,
    founderExtraParagraphs: raw.founderExtraParagraphs.map(p => p.value),
    valuesHeading: raw.valuesHeading, values: raw.values.map(v => ({ title: v.title, description: v.description })),
    visionEyebrow: raw.visionEyebrow, visionFollowup: raw.visionFollowup,
    learnHeading: raw.learnHeading, exploreLabel: raw.exploreLabel,
    founderIntroEyebrow: raw.founderIntroEyebrow, founderIntroHeading: raw.founderIntroHeading,
  };
}

// ---------- About subpages ----------
export type AboutSubpage = {
  slug: string; intro: PageIntroContent; clientGroupsIntro: string; clientsAffiliationNote: string; crossBorderEyebrow: string;
};
export async function getAboutSubpages(): Promise<AboutSubpage[]> {
  const data = await strapiFetch<{
    slug: string; intro: RawPageIntro; clientGroupsIntro: string; clientsAffiliationNote: string; crossBorderEyebrow: string;
  }[]>('about-subpages?populate=*&pagination[pageSize]=100');
  return data.map(item => ({
    slug: item.slug, intro: item.intro, clientGroupsIntro: item.clientGroupsIntro,
    clientsAffiliationNote: item.clientsAffiliationNote, crossBorderEyebrow: item.crossBorderEyebrow,
  }));
}
export async function getAboutSubpage(slug: string): Promise<AboutSubpage | undefined> {
  const items = await getAboutSubpages();
  return items.find(item => item.slug === slug);
}

// ---------- FAQ ----------
export type FaqItem = { id: string; question: string; answer: string; category: string; order: number };
export async function getFaqItems(): Promise<FaqItem[]> {
  const data = await strapiFetch<{ id: number; question: string; answer: string; category: string; order: number }[]>(
    'faq-items?sort=category:asc,order:asc&pagination[pageSize]=100'
  );
  return data.map(item => ({ id: String(item.id), question: item.question, answer: item.answer, category: item.category, order: item.order }));
}
