# Brand Authenticity Implementation — Final Report

Implementation pass against `docs/brand-authenticity-audit/IMPLEMENTATION_BACKLOG.md`, executed 2026-09-25. Scope: all 6 P0 items and all 6 P1 items — every item the backlog marked as having no owner-input dependency. P2/P3 items and both owner-gated media items (P2-7, P2-8) were left untouched, per the backlog's own scoping. See `OWNER_INPUT_REQUIRED.md` for what's still blocked and why.

Before starting: confirmed via `git diff` that a separate, earlier pass this session had already closed the Phase 1-3 items from the *other* roadmap (`docs/AGENCY_IMPLEMENTATION_ROADMAP.md` — contrast fix, `tel:` link, founder-name service-card attribution, duplicate comparison logo, alt-text pipeline, canonical/JSON-LD fixes, footer tagline). That work is untouched and unrelated to what follows.

## What changed

### Code (`ghanchi-investments`)

| File | Change | Backlog item |
|---|---|---|
| `src/components/home-hero.tsx` | Newsletter teaser's big-stat slot no longer shows a bare stale year; shows "Read edition" label + real issue date | P0-1 |
| `src/components/home-sections.tsx`, `src/app/globals.css` | `with-kora`/`without-kora` classes renamed to `chart-bar-primary`/`chart-bar-secondary` everywhere, including the CSS rules that actually color the bars (these were missed on the first pass and would have silently broken the chart's colors — caught by a follow-up `grep`, not assumed fixed) | P0-2 |
| `src/components/home-sections.tsx` | Service-card CTA: "Get Started" → "Talk about your goals" (matches the register already used elsewhere on the site) | P0-5 |
| `src/components/home-sections.tsx`, `src/app/globals.css` | `hiring-card`/`hiring-image` renamed to `.recognition-card`/`.recognition-image` sitewide (all breakpoints) | P0-6 |
| `src/components/home-sections.tsx` | Service-card quote box now reads from `service.testimonial` (a real, per-service-matched testimonial — see below) instead of the service quoting its own description back at itself; the box doesn't render at all for the 2 services with no genuine topical match | P1-1 |
| `src/components/home-sections.tsx` | Team-row "01" numbering only renders when more than one team member exists | P1-2 |
| `src/components/home-sections.tsx`, `src/app/globals.css` | Added a large (≥300px, responsive down to mobile), unclickable-required founder portrait to the homepage team section, using the existing real headshot asset | P1-4 |
| `src/app/page.tsx` | Removed the now-unused `founder` prop threaded into `ServicesSection` (dead after the P1-1 fix) | — cleanup |

### Content (`ghanchi-cms` — Strapi, via authenticated API, published immediately)

| Field | Before | After | Backlog item |
|---|---|---|---|
| `home-page.heroHeading` | "Your trusted partner for financial planning and protection." (Kora's "Your [adjective] partner for [noun phrase]." template, word-swapped) | "A personal financial advisor for Navi Mumbai families, trusted since 2009." — built entirely from verified facts (name/location/founding year), no invented philosophy or slogan | P0-3 |
| `home-page.comparisonCopy.headingLine1/2` | "What changes when" / "you plan with us." (Kora's "What changes when you work with us." template, word-swapped — this is where the audit's flagged sentence actually lives on the live site; the `statementText` field it cited had already been fixed in an earlier pass) | "From scattered decisions" / "to one coordinated plan." — reframed around the comparison scene's own real before/after content | P0-4 |
| `about-page.visionFollowup` | Rebuild-era paraphrase ("Financial decisions should be made in the context of your life, not in isolation.") | The real WordPress source's own "fiduciary"/"best interests at heart" language, quoted from `CONTENT_AUTHENTICITY_AUDIT.md` §3 (one typo corrected: "personalize" → "personalized") | P1-3 |
| `about-page.values[0]` ("Trust & integrity") | "A personal relationship built around understanding your needs." | "We won't push you to buy — clients describe being guided, not sold to, and treated like family rather than a transaction." — synthesizes the pattern independently stated by 4 real testimonials (Jain, Sawant, Shaikh, Ranbir Singh) | P1-6 |
| `about-page.founderExtraParagraphs` | 2 existing paragraphs, unchanged | Added a 3rd: "Client relationships often run for years, not one transaction — our testimonials describe working with us for 4 to 6 years and counting." — cites Sawant's "4 years" and Ranbir Singh's "6 yrs" | P1-5 |
| `service.testimonial` relation (all 9 services) | All 9 pointed at the same testimonial (Neeta Agrawal) with a disclaimer admitting the mismatch — this was the live state confirmed via `GET /api/services?populate=testimonial` before any change | Re-matched by genuine topical content (see table below); 2 services left with no testimonial rather than forcing a match | P1-1 (content half), and closes the *other* roadmap's P1-2 as a side effect |

**Service → testimonial re-matching** (fetched all 11 real testimonials from Strapi, read each in full, matched by actual subject matter — not proximity or order):

| Service | Testimonial | Why it's a genuine match |
|---|---|---|
| Financial Planning | Neeta Agrawal | "comprehensive investment plan... plotting milestones" — general planning language |
| Life Insurance | Manju Rajvanshi | explicitly cites "excellent LIC and mediclaim cover" — LIC = life insurance |
| Health Insurance | Sumit Jain | "trust him with my family's health" |
| Mutual Funds | Vikram Sawant | "active investor... customised investment solutions... guide you to invest wisely" |
| Retirement Planning | Deepak Salunkhe | "future financial planning... tailored to our situation and future needs" |
| Personal Accidental Policy | Begum Dilshad | "all our insurance cover is now in place," individual/home context |
| General Insurance | Aaloak Singh Negi | describes choosing the right insurance product among many options |
| Child Education Planning | *(none)* | no testimonial mentions children's education — left without a quote box rather than forcing one |
| Employer Employee Insurance | *(none)* | no testimonial discusses employer-provided coverage — same |

3 testimonials (Ranbir Singh, Parvez Shaikh, Firoz Shaikh) weren't a clean enough topical fit for any of the 9 and are unused here; they remain live on `/about-us/testimonials` and in the general testimonial rotation elsewhere on the site.

## Verification performed

- `grep -ri "with-kora\|without-kora" src/` → 0 matches (confirmed only after fixing a CSS-only miss the first grep pass didn't catch)
- `grep -ri "hiring-card\|hiring-image" src/` → 0 matches
- `grep -n "Get Started" src/` (as a CTA label) → 0 matches
- `npx tsc --noEmit` → clean
- `npm run build` → succeeds, all 35 routes generate
- `npm test` (Playwright, 39 tests) → 39/39 pass
- Live Strapi API re-fetch of `home-page`, `about-page`, and all 9 `services?populate=testimonial` after publish → confirmed every field change is live and published (not left in draft)
- Visual QA via Playwright screenshots at 1440px: hero headline renders with reasonable line breaks; newsletter card no longer shows a bare year in the stat slot; planning chart bars still render in their correct colors (green/gray) after the class rename; Mutual Funds service card shows the real Vikram Sawant quote in place of the old self-quote; team section shows the founder's real photo at large size alongside the real MDRT award photo in the (renamed) recognition panel

## What's still open

Everything in `OWNER_INPUT_REQUIRED.md`, plus the P2/P3 backlog items (comparison-scene framing, review-score styling, featured-case single-story framing, LIC-specific copy in service descriptions, positioning strategy, process-section weight, article-brief locality anchors) — all explicitly lower-severity, several explicitly owner-gated, none blocking. No further re-audit pass (persona walkthrough, blind-brand retest) was run this session; the verification above is build/test/grep/API-level, not a fresh qualitative re-audit.
