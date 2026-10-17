import type { NextConfig } from 'next';

/**
 * Legacy-URL redirects, from the audited WordPress URL manifest
 * (docs/audit/OLD-SITE-WORDPRESS-INVENTORY.md). Only rows with an
 * unambiguous, already-decided destination are here -- the ~23 category/tag
 * archive URLs have no equivalent page on the new site (articles are
 * filtered via /blog?category=, not per-category archive routes) and are
 * intentionally left to fall through to a plain 404, not guessed at here.
 */
const legacyRedirects: NonNullable<NextConfig['redirects']> = async () => [
  { source: '/awards', destination: '/about-us/awards', permanent: true },
  { source: '/certificates', destination: '/about-us/certificates', permanent: true },
  { source: '/our-clients', destination: '/about-us/our-clients', permanent: true },
  { source: '/testimonials', destination: '/about-us/testimonials', permanent: true },

  // Legacy footer links used the bare service slug without the /services/ prefix.
  { source: '/financial-planning', destination: '/services/financial-planning', permanent: true },
  { source: '/life-insurance', destination: '/services/life-insurance', permanent: true },
  { source: '/health-insurance', destination: '/services/health-insurance', permanent: true },
  { source: '/employer-employee-insurance', destination: '/services/employer-employee-insurance', permanent: true },
  { source: '/mutual-funds', destination: '/services/mutual-funds', permanent: true },
  { source: '/retirement-planning', destination: '/services/retirement-planning', permanent: true },
  { source: '/general-insurance', destination: '/services/general-insurance', permanent: true },
  { source: '/child-education-planning', destination: '/services/child-education-planning', permanent: true },
  { source: '/personal-accidental-policy', destination: '/services/personal-accidental-policy', permanent: true },

  // Legacy WordPress article URLs lived at the site root; slugs are preserved 1:1 in the
  // migrated Strapi `article` collection, so these map directly onto /blog/<slug>.
  ...[
    'attention-indian-parents-your-children-are-not-your-retirement-plan',
    'single-woman-retiring-solo-is-a-dream-retirement-life-but-with-proper-planning',
    'you-dont-have-to-be-rich-to-retire-rich',
    'why-health-insurance-is-required-even-if-you-have-coverage-from-your-office',
    'indian-parents-dreams-future-pichai-nadella-child-education-planning',
    'cryptocurrency-as-investment-good-bad-analysis-financial-portfolio',
    'biggest-wealth-concerns-individuals-and-couples-face',
    'financial-empower-for-women',
    'buying-senior-citizen-health-policy',
    'equity-markets-highs',
    'will-vasiyat-testament-legal-document',
    'life-insurance-term-plan-protection',
    'asset-allocation-asset-class',
    'questions-ask-before-investing',
    'major-reasons-for-insurance-claim-rejections',
    'regularly-growing-sip-wealth',
    'investors-reacting-response-market-movement-correction',
    'gold-diversification-india-assetclass-sovereign-gold-bonds',
    'assessment-review-planning-bonus-investment-insurance',
    'why-are-we-not-saving-for-retirement',
    'importance-health-insurance',
    'investors-behaviour-swing-market',
    'investment-mantra-for-wealth-creation',
    'the-behavioural-gap-why-investors-do-not-get-the-returns-they-should',
    'why-your-portfolio-may-be-underperforming',
  ].map(slug => ({ source: `/${slug}`, destination: `/blog/${slug}`, permanent: true })),
];

const nextConfig: NextConfig = {
  redirects: legacyRedirects,
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },
};

export default nextConfig;
