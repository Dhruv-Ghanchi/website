import source from './ghanchi-source.json';

export type RichTextBlock = { heading?: string; paragraphs: string[] };
export type Testimonial = { id: string; quote: string; name: string; role: string; image: string; sourceUrl: string };
export type Service = { id: string; title: string; icon: string; shortDesc: string; longDesc: string; deliverables: string[]; image: string; testimonial: Testimonial; sourceUrl: string };
export type TeamMember = { id: string; name: string; role: string; headshot: string; bio: string; socialLinks: { label: string; url: string }[] };
export type Category = { id: string; name: string };
export type Article = { id: string; title: string; coverImage: string; publishDate: string; content: RichTextBlock[]; categoryId: string; sourceUrl: string; editorialNote: string };
export type Newsletter = { id: string; title: string; issueMonth: string; coverImage: string; url: string | null };
export type GalleryItem = { id: string; title: string; image: string; sourceUrl: string };
export type OnlineService = { id: string; title: string; description: string; url: string; type: 'internal' | 'external' };
export type LegalPage = { id: string; title: string; content: RichTextBlock[] };
export type NavItem = { title: string; href: string; children?: { title: string; href: string }[] };
export type Stat = { value: number; suffix: string; label: string; decimals?: number };
export const asset = (name: string) => `/assets/${name}`;
export const images = {
  hero: asset('IaiFRY4S4OYymE10NQ9ipQb5dwc.jpg'),
  contact: asset('YLqSXPwuRjvZniqgw49AQYJMSzM.png'),
  process: source['about-us'].images[0].local,
  awards: source.awards.images[0].local,
  testimonial: asset('F1UsC3Qy2MBxr7spZdOv8SWIZpQ.jpg'),
  founder: source['about-us'].images[0].local,
};
export const contactInfo = {
  phone1: '+91 9820926446', phone2: '+91 7977061717',
  email1: 'info@ghanchiinvest.com', email2: 'chandrakant@ghanchiinvest.com',
  addressLines: ['Shop no. 27, Sector 11, Balaji Bhavan,', 'CBD Belapur, Navi Mumbai,', 'Maharashtra 400614'],
};
export const socialLinks = [
  { name: 'Facebook', href: 'https://www.facebook.com/ghanchiinvestments' },
  { name: 'Instagram', href: 'https://www.instagram.com/ghanchiinvestments/' },
  { name: 'LinkedIn', href: 'https://www.linkedin.com/in/chandrakant-ghanchi-financial-planner-insurance-investments/' },
  { name: 'YouTube', href: 'https://www.youtube.com/@ghanchiinvestments4939' },
];
export const clientLocations = ['India', 'UAE', 'USA'];
export const clientGroups = ['HNIs', 'Business owners', 'NRIs', 'Entrepreneurs', 'Software engineers', 'Advocates', 'Doctors', 'Architects', 'CEOs & CFOs'];
export const stats: Stat[] = [
  { value: 15, suffix: '+', label: 'Years of experience' },
  { value: 1200, suffix: '+', label: 'Clients served' },
  { value: 12, suffix: '+', label: 'Awards received' },
  { value: 5, suffix: '/5', decimals: 1, label: 'Google rating reported on our existing website' },
];
export const rating = { value: 5, max: 5, note: 'Reported on our existing website. Not a live Google feed.' };
export const vision = 'Making Goal-based customized Financial Advice accessible to all and spread Financial Literacy.';
export const teamMembers: TeamMember[] = [{
  id: 'chandrakant-ghanchi', name: 'Chandrakant B. Ghanchi', role: 'Founder & Financial Planner', headshot: images.founder,
  bio: 'Ghanchi Investments was incorporated in 2009 and serves 1,200+ clients across India and abroad. Led by Chandrakant B. Ghanchi, our approach considers your goals, concerns, risk appetite and cash flows. We customize solutions to your specific needs, assist with implementation and conduct an annual review.',
  socialLinks: [{ label: 'Email', url: 'mailto:chandrakant@ghanchiinvest.com' }, { label: 'LinkedIn', url: socialLinks[2].href }],
}];
export const testimonials: Testimonial[] = [
  { id: 'neeta-agrawal', name: 'Neeta Agrawal', role: 'Syntel', image: '', quote: 'Ghanchi investments have been great in designing a comprehensive investment plan for me and plotting milestones. I don’t think I can ask for better services, the expertise and attention to detail with which you have handled our financial affairs could not be faulted. May you prosper, along with your client.', sourceUrl: 'https://ghanchiinvest.com/testimonials/' },
  { id: 'sumit-jain', name: 'Sumit Jain', role: 'L&T Infotech', image: '', quote: 'I want to make it short and sweet. Chandrakant is not an agent for me, nor I’m a client for him. I say this because he provides his valuable suggestion after good research to me not thinking of me as his client but as a FAMILY member and I too in return take it without questioning as I trust him with my family’s health.', sourceUrl: 'https://ghanchiinvest.com/testimonials/' },
  { id: 'ranbir-singh', name: 'Ranbir Singh', role: 'USA', image: '', quote: 'Thank you for all the financial planning help you provided for the last 6 yrs, Chandrakant is a great person and with great character. He is very trustworthy and provides excellent service. Chandrakant has made the process of dealing with financial planning easy and painless. This is a process I normally dread but he made it easy. He is a great man and I would recommend Chandrakant to any of my friends and family.', sourceUrl: 'https://ghanchiinvest.com/testimonials/' },
  { id: 'vikram-sawant', name: 'Vikram Sawant', role: 'Senior Planner, Max Fashion, Landmark Group, Dubai, UAE', image: '', quote: 'I’m a active investor from Dubai and using Mr Chandrakant’s service since last 4 years. He is a very professional financial advisor who understands your need and provide you customised investment solutions. He would never push you to sell something rather guide you to invest wisely.', sourceUrl: 'https://ghanchiinvest.com/' },
  { id: 'manju-rajvanshi', name: 'Manju Rajvanshi', role: 'St. Xavier’s High School', image: '', quote: 'Due to excellent knowledge of LIC and mediclaim, Chandrakant Ghanchi guided me and made me independent. I have excellent LIC and mediclaim cover.', sourceUrl: 'https://ghanchiinvest.com/testimonials/' },
  { id: 'aaloak-singh-negi', name: 'Aaloak Singh Negi', role: 'TCS', image: '', quote: 'Once you are with Ghanch investments, rest assured you are financially in safe hands. When I wanted to buy insurance I was confused with all kinds of products available in the market, Chandrakant explained to me whatever I wanted to know with patience, answering all my questions and clearing all my doubts. I was able to make an informed decision and choose the right product for me and my family.', sourceUrl: 'https://ghanchiinvest.com/testimonials/' },
  { id: 'parvez-shaikh', name: 'Parvez Shaikh', role: 'East-west Freight Carriers Ltd', image: '', quote: 'The level of service and professionalism I’ve received from Ghanchi’s and the experienced professionals with them is unparalleled. I’ve purchased several insurance products from them over the years and I have always felt confident that I was making a wise investment. Admittedly, I don’t know much about insurance or investments, but Chandrakant has always taken the time to educate me and inform me about my various options. You can take heart in the fact that Ghanchi Investments isn’t just trying to sell you something, they legitimately care about their clients and their well-being.', sourceUrl: 'https://ghanchiinvest.com/testimonials/' },
  { id: 'deepak-salunkhe', name: 'Deepak Salunkhe', role: 'Oberoi Realty', image: '', quote: 'My wife and I came to you to discuss the options that were available for our future financial planning. We were very impressed with the personalized professional service and advice that was given to us, and how you have tailored this specifically to suit our situation and future needs. We felt very comfortable to put our finances in your care and for you to guide us in the right direction. We found you to be the most professional of those we interviewed. I have no hesitation in recommending your services with complete trust and I look forward to a continued relationship with you.', sourceUrl: 'https://ghanchiinvest.com/testimonials/' },
  { id: 'begum-dilshad', name: 'Begum Dilshad', role: 'Home Maker', image: '', quote: 'It is so reassuring to know that all our insurance cover is now in place given the different elements involved. Before getting in touch with you I checked out other insurance companies for the necessary cover, but I must say they fell short compared with your wonderful ‘customer service’ and ‘great attention to detail’. One ‘very satisfied customer’.', sourceUrl: 'https://ghanchiinvest.com/testimonials/' },
  { id: 'ashu-rajvanshi', name: 'Ashu Rajvanshi', role: 'Acupressure Therapist', image: '', quote: 'Chandrakant Ghanchi has very good knowledge regarding LIC and mediclaim. His advice made me confident as my life and health; both were covered in an excellent manner.', sourceUrl: 'https://ghanchiinvest.com/testimonials/' },
  { id: 'firoz-shaikh', name: 'Firoz Shaikh', role: 'Firoz Dance Academy', image: '', quote: 'I appreciate Ghanchi Investments’ attention to my needs as a broker. Almost every time I talk with Mr. Ghanchi Chandrakant, he gives me an idea that makes me money. Ghanchi Investments makes it easy to want to do business with them. I am looking forward to their new website. I am sure that it will improve my ability to get the necessary work done in a quick and efficient manner.', sourceUrl: 'https://ghanchiinvest.com/testimonials/' },
];
const serviceRecords = [
  { id: 'financial-planning', title: 'Financial Planning', icon: 'chart', shortDesc: 'Your life goals. A plan built around you.', longDesc: 'A personal financial plan connects your income, expenses, investments and debt with your short-term needs and long-term goals. We help you define your dreams, plan for them and review your progress.', deliverables: ['Understand your financial situation', 'Goal-based planning', 'Risk and cash-flow assessment', 'Implementation assistance', 'Annual review'], image: asset('OqCGYrjHIzy11F9CWaDgfYAzKQ.jpg') },
  { id: 'life-insurance', title: 'Life Insurance', icon: 'shield', shortDesc: 'Protection for the people who depend on you.', longDesc: 'Life insurance helps provide financial protection for your family. We help you understand the available options in the context of your dependants, needs and financial goals.', deliverables: ['Family protection needs', 'Understand policy options', 'Premium considerations', 'Policy servicing', 'Claim assistance'], image: asset('3NdwQXmM1SRuYwMwOwL4wEa9Y.jpg') },
  { id: 'health-insurance', title: 'Health Insurance', icon: 'heart', shortDesc: 'Plan for healthcare, before you need it.', longDesc: 'Health insurance can help manage eligible medical expenses. Understand coverage, exclusions, waiting periods and policy conditions before choosing protection for yourself and your family.', deliverables: ['Coverage needs', 'Family and individual options', 'Policy terms and exclusions', 'Renewal assistance', 'Claim support'], image: asset('NF5tRpn3xrpV81CGf1SDQo60Lk.jpg') },
  { id: 'mutual-funds', title: 'Mutual Funds', icon: 'trending', shortDesc: 'Invest with your goals in mind.', longDesc: 'Explore mutual funds with your time horizon, cash flow and risk appetite in mind. Mutual fund investments are subject to market risks; returns are not guaranteed.', deliverables: ['Investment goals', 'Risk profile', 'SIP and lump-sum options', 'Portfolio review', 'Online account access'], image: asset('Xg3naOB3jlkrgVdI79zfTGmUpxo.jpg') },
  { id: 'retirement-planning', title: 'Retirement Planning', icon: 'piggy', shortDesc: 'Make room for life after work.', longDesc: 'Plan for your future lifestyle, expenses and income needs. A customized retirement plan considers the resources you have today and the goals you want to work towards.', deliverables: ['Retirement goals', 'Future expense planning', 'Income needs', 'Available investment options', 'Annual review'], image: asset('qkntRVyDFXSavXk2fE20yVB6CU.jpg') },
  { id: 'child-education-planning', title: 'Child Education Planning', icon: 'graduation', shortDesc: 'Give their ambitions a financial plan.', longDesc: 'Prepare for your child’s future education needs with a goal-based approach that considers the time available, expected costs and your family’s finances.', deliverables: ['Education goals', 'Time horizon', 'Cash-flow planning', 'Suitable solutions', 'Progress review'], image: asset('OqCGYrjHIzy11F9CWaDgfYAzKQ.jpg') },
  { id: 'personal-accidental-policy', title: 'Personal Accidental Policy', icon: 'alert', shortDesc: 'Prepare for the unexpected.', longDesc: 'Understand personal accident protection and the benefits available under policy terms for accidental injury, disability or death. Coverage depends on the selected policy.', deliverables: ['Protection needs', 'Benefit options', 'Policy exclusions', 'Documentation assistance', 'Claim support'], image: asset('3NdwQXmM1SRuYwMwOwL4wEa9Y.jpg') },
  { id: 'general-insurance', title: 'General Insurance', icon: 'umbrella', shortDesc: 'Protect the things you have worked for.', longDesc: 'Explore insurance for your assets and other non-life risks. We help you understand your protection needs and the terms of the options available.', deliverables: ['Risk assessment', 'Available cover options', 'Policy conditions', 'Renewal assistance', 'Claim support'], image: asset('NF5tRpn3xrpV81CGf1SDQo60Lk.jpg') },
  { id: 'employer-employee-insurance', title: 'Employer Employee Insurance', icon: 'building', shortDesc: 'Consider protection for your employees.', longDesc: 'Explore employer–employee insurance arrangements in the context of your business and employees’ needs. Eligibility, benefits and conditions depend on the selected policy.', deliverables: ['Business needs', 'Employee protection', 'Policy structure', 'Documentation', 'Ongoing servicing'], image: asset('Xg3naOB3jlkrgVdI79zfTGmUpxo.jpg') },
];
export const services: Service[] = serviceRecords.map(service => ({ ...service, testimonial: testimonials[0], sourceUrl: `https://ghanchiinvest.com/services/${service.id}/` }));
export const categories: Category[] = [{ id: 'retirement-planning', name: 'Retirement Planning' }, { id: 'insurance', name: 'Insurance' }];
export const articles: Article[] = [
  { id: 'single-woman-retiring-solo-is-a-dream-retirement-life-but-with-proper-planning', title: 'Single Woman, Retiring Solo Is a Dream Retirement Life (but) With Proper Planning!', coverImage: asset('IXWqaCHPbvPQKcyZ9Mch2cWh9hU.jpg'), publishDate: '2021-03-24', categoryId: 'retirement-planning', sourceUrl: 'https://ghanchiinvest.com/single-woman-retiring-solo-is-a-dream-retirement-life-but-with-proper-planning/', editorialNote: 'A condensed adaptation of our March 2021 archive article. Illustrative photography. Planning does not guarantee a particular income or outcome.', content: [
    { paragraphs: ['Retiring independently calls for a plan that considers your lifestyle, healthcare and future income needs. The original article explores how retirement planning can support an active life after work.'] },
    { heading: 'Plan for more than everyday bills', paragraphs: ['Consider your essential expenses alongside the things you value: travel, hobbies, learning, social activities and giving back to the community. These are all part of the retirement you want to prepare for.'] },
    { heading: 'Healthcare and independence', paragraphs: ['Review insurance protection alongside the funds you may need for expenses outside your cover. Policy conditions, exclusions and personal circumstances should inform your plan.'] },
    { heading: 'A plan tailored to you', paragraphs: ['Your goals, dependants, resources and time horizon are individual. Talk with Ghanchi Investments about a retirement plan that considers your specific needs, rather than relying on a single rule of thumb.'] },
  ] },
  { id: 'you-dont-have-to-be-rich-to-retire-rich', title: 'You Don’t Have to Be Rich to Retire Rich!', coverImage: asset('IQe1Ak6IQCv8JGUh2qx9RiQCBQ.jpg'), publishDate: '2021-03-11', categoryId: 'retirement-planning', sourceUrl: 'https://ghanchiinvest.com/you-dont-have-to-be-rich-to-retire-rich/', editorialNote: 'A condensed adaptation of our March 2021 archive article. Illustrative photography. Product suitability and current terms require individual review.', content: [
    { paragraphs: ['The central message of our original article is that retirement planning matters regardless of your current income. What you earn today is only part of the picture; how you plan for the future matters too.'] },
    { heading: 'Think about income after work', paragraphs: ['Running out of money is a concern for many retirees. Consider how your savings and available retirement options could support expenses once your salary stops. The original article discusses regular income and annuity planning in this context.'] },
    { heading: 'Start with your own circumstances', paragraphs: ['A retirement plan should consider your goals, present finances and future needs. There are different retirement planning options; suitability, benefits and limitations should be reviewed before you decide.'] },
    { heading: 'Take the next step', paragraphs: ['Contact Ghanchi Investments to discuss a customized solution. We consider your risk appetite and cash flow, assist with implementation and review your plan annually.'] },
  ] },
];
export const newsletters: Newsletter[] = source.newsletters.newsletters.map(item => {
  const date = new Date(`${item.title} 1 00:00:00 UTC`);
  const valid = new URL(item.url).hostname === 'www.njwebnest.in' && /^\/newsletter\/[A-Za-z]+-\d{4}\.php$/.test(new URL(item.url).pathname);
  return { id: item.title.toLowerCase().replace(' ', '-'), title: `${item.title} Newsletter`, issueMonth: date.toISOString().slice(0, 7), coverImage: asset('MuKacYjazqkYtwK8LUQanQB1xg.jpeg'), url: valid ? item.url : null };
}).sort((a, b) => b.issueMonth.localeCompare(a.issueMonth));
export const awards: GalleryItem[] = source.awards.images.map((image, i) => ({ id: `award-${i + 1}`, title: `Awards archive — photograph ${i + 1}`, image: image.local, sourceUrl: source.awards.source }));
export const certificates: GalleryItem[] = source.certificates.images.map((image, i) => ({ id: `certificate-${i + 1}`, title: `Certificates archive — document ${i + 1}`, image: image.local, sourceUrl: source.certificates.source }));
export const onlineServices: OnlineService[] = [
  { id: 'newsletters', title: 'Newsletters', description: 'Browse our dated newsletter archive.', url: '/newsletters', type: 'internal' },
  { id: 'lic-registered-user', title: 'LIC Registered User', description: 'Access LIC policy services.', url: 'https://ebiz.licindia.in/D2CPM/#Login', type: 'external' },
  { id: 'lic-pay-premium', title: 'LIC Pay Premium Direct', description: 'Go to LIC’s direct premium payment portal.', url: 'https://ebiz.licindia.in/D2CPM/#DirectPay', type: 'external' },
  { id: 'fundz-bazar', title: 'Fundz Bazar', description: 'Sign in to your investment account.', url: 'https://www.fundzbazar.com/signin', type: 'external' },
  { id: 'nj-e-wealth', title: 'NJ E-Wealth Account', description: 'Access your NJ investment account.', url: 'https://www.njindiaonline.com/onlinetrading/login.fin?action=showLoginForm', type: 'external' },
  { id: 'nj-client-desk', title: 'NJ Client Desk', description: 'Access portfolio information and reports.', url: 'https://www.njindiaonline.in/cdesk/login.fin', type: 'external' },
  { id: 'niva-bupa-renewal', title: 'Niva Bupa Renewal', description: 'Renew with Niva Bupa, formerly Max Bupa.', url: 'https://transactions.nivabupa.com/renewal/renewpolicies.aspx', type: 'external' },
  { id: 'star-health-renewal', title: 'Star Health Renewal', description: 'Visit Star Health’s renewal portal.', url: 'https://retail.starhealth.in/renewal', type: 'external' },
  { id: 'hdfc-ergo-renewal', title: 'HDFC Ergo Renewal', description: 'Visit the renewal link listed by Ghanchi Investments.', url: 'https://www.hdfcergo.com/OnlineInsurance/AHealthRWOnline/Integration/RenewalIndex/Ug3YxwhW8M3PqSP0TAQm0eIocenTPxdc9s9ne,Flu7Ch6PwBAV4gFGH,IhT0mnMI', type: 'external' },
  { id: 'android-app', title: 'Android App', description: 'My Wealth on Google Play.', url: 'https://play.google.com/store/apps/details?id=mobi.mywealth', type: 'external' },
  { id: 'ios-app', title: 'iOS App', description: 'My Wealth on the App Store.', url: 'https://apps.apple.com/in/app/my-wealth/id1116107323', type: 'external' },
];
export const legalPages: LegalPage[] = [
  { id: 'privacy-policy', title: 'Privacy Policy', content: [{ heading: 'Information you share', paragraphs: ['The contact form asks for your name, email, phone number, service interests and enquiry. Once delivery is configured, these details are sent to the configured provider so the team can respond. Newsletter subscriptions require separate consent. Do not submit account credentials or sensitive financial documents through these forms.'] }, { heading: 'Owner review required', paragraphs: ['This draft must be reviewed before launch to identify the actual processors, retention periods, privacy rights and contact process. Contact info@ghanchiinvest.com with questions.'] }] },
  { id: 'terms-of-service', title: 'Terms of Service', content: [{ heading: 'General information', paragraphs: ['Website information is educational and does not replace advice based on your circumstances. An enquiry does not establish an advisory agreement. Any scope, fees and responsibilities must be agreed separately.'] }, { heading: 'Owner review required', paragraphs: ['These are draft terms requiring legal review before launch. External services have their own terms and privacy policies.'] }] },
  { id: 'disclaimer', title: 'Disclaimer', content: [{ heading: 'Investments and insurance', paragraphs: ['Mutual fund investments are subject to market risks. Read all scheme-related documents carefully. Past performance does not guarantee future results. Insurance is the subject matter of solicitation; benefits depend on policy terms, exclusions and eligibility.'] }, { heading: 'Archive and testimonials', paragraphs: ['Articles and newsletters retain their original dates and are not current product or tax recommendations. Testimonials reflect individual experiences, not guaranteed outcomes or endorsements by their employers. Gallery images are historical records, not confirmation of current licence status.'] }, { heading: 'Before launch', paragraphs: ['The business owner must approve current regulatory disclosures, registration details and legal wording before publishing this website.'] }] },
];
export const navigation: NavItem[] = [
  { title: 'Home', href: '/' },
  { title: 'About Us', href: '/about-us', children: [{ title: 'Our Introduction', href: '/about-us' }, ...['Awards', 'Certificates', 'Our Clients', 'Testimonials'].map(title => ({ title, href: `/about-us/${title.toLowerCase().replaceAll(' ', '-')}` }))] },
  { title: 'Services', href: '/services', children: services.map(item => ({ title: item.title, href: `/services/${item.id}` })) },
  { title: 'Online Services', href: '/online-services', children: onlineServices.map(item => ({ title: item.title, href: item.url })) },
  { title: 'Blog', href: '/blog' }, { title: 'Contact Us', href: '/contact-us' },
];
export const getService = (id: string) => services.find(item => item.id === id);
export const getCategory = (article: Article) => categories.find(item => item.id === article.categoryId)!;
export const formatDate = (value: string) => new Intl.DateTimeFormat('en-IN', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(new Date(value));
export const formatIssue = (value: string) => new Intl.DateTimeFormat('en-IN', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${value}-01`));
export function safeUrl(value: string) {
  if (/^\/(?!\/)/.test(value) && !/[\\\s]/.test(value)) return true;
  try { const url = new URL(value); return url.protocol === 'https:' && !url.username && !url.password; } catch { return false; }
}
export function validateContent() {
  for (const collection of [services, articles, teamMembers, categories, legalPages, newsletters, onlineServices, awards, certificates, testimonials]) {
    if (new Set(collection.map(item => item.id)).size !== collection.length) throw new Error('Duplicate content ID');
  }
  if (services.length !== 9) throw new Error('Expected nine services');
  for (const article of articles) {
    if (!getCategory(article) || !article.content.length || !Number.isFinite(Date.parse(article.publishDate))) throw new Error(`Invalid article: ${article.id}`);
  }
  for (const item of onlineServices) if (!safeUrl(item.url)) throw new Error(`Unsafe destination: ${item.id}`);
  for (const item of newsletters) if (item.url && !safeUrl(item.url)) throw new Error(`Unsafe newsletter: ${item.id}`);
  for (const item of testimonials) if (!item.quote || !item.sourceUrl) throw new Error(`Unsourced testimonial: ${item.id}`);
}
validateContent();
