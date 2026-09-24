import type { NextConfig } from 'next';

/**
 * Legacy-URL redirects, from the audited WordPress URL manifest
 * (docs/CURRENT_IMPLEMENTATION_PLAN.md, Section 11). Only rows with an
 * unambiguous, already-decided destination are here -- category/tag
 * archives and the ~23 not-yet-republished article slugs are an open
 * content/IA decision and are intentionally left to fall through to a
 * plain 404, not guessed at here.
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
