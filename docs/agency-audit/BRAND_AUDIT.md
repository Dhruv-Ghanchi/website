# Brand Audit — Consistency vs. Kora

**No brand asset, CSS, or copy was changed as part of this audit.** Findings only. Recommendations that would require creating new imagery or a new logo are flagged for owner decision, not executed — consistent with `docs/CURRENT_IMPLEMENTATION_PLAN.md` §5 and §17 (no fabricated assets; media classification is a separate, owner-gated step).

Method: applied the `design-brand-guardian` roster persona (`docs/agency-audit/roster/design-brand-guardian.md`) — brand consistency, logo/typography/color usage, voice consistency — against the live rendered site. This complements, and does not duplicate, `MEDIA_AUDIT.md` (which already did the authoritative per-asset KEEP/REPLACE classification) and `docs/MEDIA_INVENTORY.md` (which already verified `logo-ghanchi.png` and the founder headshot as authentic, live-wired assets — authenticity is settled; this audit looks at visual/tonal *fit*, a different question).

Evidence gathered directly for this audit:
- Live Playwright screenshots at 1440×900 and a 3×-scale crop of the header logo (`localhost:3100`), taken for this audit.
- Direct comparison against the existing `docs/agency-audit/evidence/screenshots/kora-home-desktop.png`.
- Live Strapi API responses (`site-setting`, `team-members`, `home-page`, `about-page`) to separate CMS-driven copy from hardcoded strings in `src/components/site-shell.tsx`, `src/components/home-sections.tsx`, `src/components/inner-pages.tsx`.
- `src/app/globals.css` logo/sizing rules (`.logo-mark`, `.comparison-card .logo-mark`, `.process-video > .logo`).
- Template-remnant grep (`Kora|kora.framer|koraline|Lorem ipsum|placeholder`) across all 8 required routes' rendered HTML.

---

## Findings

### 1. The logo is a legacy small-business mark inside an otherwise fully modernized design system

**What**: `logo-ghanchi.png` — a circular green figure-in-motion icon, a blue/purple gradient serif "Ghanchi Investments" wordmark, and a thin serif tagline ("Insurance & Investment Consultancy") beneath — renders visibly soft/low-resolution even at small on-page sizes, and reads stylistically as a 2010s WordPress-era logo-generator mark.

**Where**: Present sitewide (header 34px, comparison scene 70px, footer, process-video overlay). Zoomed capture (3× device scale) confirms compression softness independent of CSS sizing.

**Why**: Every other visual element on the site (Manrope type, mint/cream/ink palette, rounded-pill nav, generous whitespace, subtle spring motion) is a faithful, deliberate Kora-fidelity execution — confirmed by direct comparison with `kora-home-desktop.png`, which shows the same layout grammar. The logo is the one element that did not go through that modernization; it's the literal original small-business mark, unedited. `docs/MEDIA_INVENTORY.md` already confirmed this file is authentic and correctly wired (not a template remnant, not fabricated) — this finding doesn't dispute that. It's a distinct question: authenticity is settled, visual fit with the rest of the 2026 redesign is not.

**Kora reference**: `kora™` wordmark — a clean two-color icon + lowercase sans-serif type, matching the rest of the interface's typographic system exactly.

**Ghanchi current**: A five-color, serif/script, tagline-carrying mark with a different type family from the rest of the site (Manrope nowhere in the logo itself).

**Recommended change**: Not something this audit should execute (a logo redraw is a real design deliverable requiring owner sign-off, not a content/brand audit action). Flag to the owner as a candidate for a like-for-like vector redraw (same icon concept, same colors, same name) rather than a rebrand — a production-quality upgrade, not a strategy change.

### 2. Self-referential "Ghanchi Investments / Our vision" byline paired with the founder's real photo

**What**: All 9 homepage service-card quotes use `<Person image={founder?.headshot} name="Ghanchi Investments" role="Our vision" />` — the founder's actual photograph, captioned with the company's name rather than his.

**Where**: `home-sections.tsx` line 23; visually confirmed via screenshot (`service-quote-zoom.png` equivalent capture) — Chandrakant's photo sits next to "Ghanchi Investments — Our vision" nine times.

**Why**: The rest of the site invests deliberately in personal-advisor positioning — "Meet your advisor. A personal partnership.", a named founder bio, a real signature-style byline on the About page. Pairing his real photo with an impersonal company-as-speaker caption cuts against that established brand device and reads as an unfinished placeholder rather than an intentional pattern. (Same underlying issue as `CONTENT_AUDIT.md` Finding 1; recorded here specifically as a voice/persona-consistency break, not a testimonial-sourcing gap.)

**Recommended change**: Attribute to the founder by name/role, consistent with every other instance of his photo on the site.

### 3. Footer tagline is a hardcoded near-duplicate of the CMS-managed vision statement, and has already drifted from it

**What**: The About Us page correctly renders the CMS `site-setting.vision` field verbatim: *"Making Goal-based customized Financial Advice accessible to all and spread Financial Literacy."* The global footer (rendered on every page) instead uses a **hardcoded literal string** in `site-shell.tsx` line 100: *"Making goal-based financial advice accessible to all."* — different capitalization, and missing "customized" and "and spread Financial Literacy" entirely.

**Where**: `src/components/site-shell.tsx` line 100 (`<h3><span>Making goal-based financial advice accessible to all.</span> Let's plan your financial future together.</h3>`) vs. `src/app/about-us/page.tsx` line 16 (`<h2>"{siteSettings.vision}"</h2>`, sourced from `getSiteSettings().vision`). Confirmed via `grep` — `vision` (the Strapi field) is referenced in exactly 2 files (`about-us/page.tsx`, `home-sections.tsx`'s type import); the footer's near-identical sentence is not one of them.

**Why**: This is exactly the "Strapi-managed vs. hardcoded tone mismatch" the brand-consistency review is meant to catch. Two renderings of what should be the same core brand statement, sitewide, already say slightly different things. If the owner edits the vision statement in Strapi (a field they were specifically given editorial control over), the footer — seen on literally every page — will silently continue showing the old, truncated wording.

**Recommended change**: Have the footer consume `siteSettings.vision` (or a dedicated CMS field for the shorter footer-length version, if the full sentence is too long for that slot) instead of a separately hardcoded string.

### 4. Meta-disclosure copy undercuts an otherwise confident, consistent brand voice

**What**: See `CONTENT_AUDIT.md` Finding 3 in detail. From the brand-voice-consistency angle specifically: the site's primary voice is confident and benefit-led ("Let's plan for what matters to you.", "Your goals are personal. Your plan should be too.", "A personal approach from the first conversation to your annual review."). Several inline strings break that register with dry, compliance-note phrasing visible to the end visitor ("Reported on our existing website. Not a live Google feed.", "From our client testimonial archive.", "The testimonial describes a general client experience, not a result for this specific service.").

**Why it's a brand (not just content) issue**: these aren't isolated copy slips — they form a recognizable second voice (cautious, self-annotating) that appears at every social-proof touchpoint (ratings, testimonials, articles), which is precisely where a financial-advisory brand most needs to sound confident and established.

**Recommended change**: Same as `CONTENT_AUDIT.md` Finding 3 — relocate the disclosure to a footnote/tooltip register; keep primary copy slots in the site's established voice.

### 5. Founder headshot: consistently and prominently used, but no focal point configured

**What**: The founder's headshot (`ghanchi-founder-headshot.jpg`) is used prominently and correctly across the header CTA avatar, the About Us page (large, sharp, well-lit — confirmed via screenshot), the homepage founder callout, and the FAQ help widget. This is a genuine strength: a real, high-quality, appropriately prominent photo, not stock imagery.

**Where**: Confirmed via Strapi `team-members` API — `headshot.focalPoint: null` (defaults to center per `mediaFocal()` in `src/lib/strapi.ts`).

**Why it's worth noting (low severity)**: the image happens to crop acceptably in every context checked because the subject is roughly centered in the source photo — but that's incidental, not configured. Strapi 5's native focal-point picker is already wired end-to-end (`docs/CURRENT_IMPLEMENTATION_PLAN.md` §16) and unused for this specific asset.

**Recommended change**: Set an explicit focal point on the founder headshot in the Strapi Media Library so future crop contexts don't depend on the photo's incidental centering.

### 6. No literal Kora business copy or template remnants found in rendered output

**What**: A grep for `Kora|kora.framer|koraline|Lorem ipsum|placeholder` across all 8 required routes' rendered HTML returns only: (a) the `with-kora`/`without-kora` CSS class names on the planning-journey chart bars (cosmetic, non-rendered, already classified as a non-issue in `docs/CURRENT_IMPLEMENTATION_PLAN.md` §9 — not re-flagged here), and (b) `placeholder="..."` form-input attributes (expected HTML, not template leftovers).

**Why this is included**: confirms, independently, the plan's existing claim that no Kora business copy, fake team members, or fake statistics remain in rendered content. The imagery-level remnants (Kora stock photos still live in several image slots, including the homepage/About-Us hero) are real and already fully catalogued with replacement briefs in `MEDIA_AUDIT.md` — this audit adds one piece of new evidence to that existing finding: the Kora hero photo (`IaiFRY4S4OYymE10NQ9ipQb5dwc.jpg`) is not only the homepage hero background but also renders identically as the About Us page's cover image (`src/app/about-us/page.tsx` line 16, `<img src={siteSettings.heroImage} .../>`), since both consume the same `site-setting.heroImage` field. Its visible footprint is two primary pages, not one.

**Recommended change**: None beyond what `MEDIA_AUDIT.md` already specifies — noted here only to correct the scope of that finding's exposure.

---

## Prioritized Findings

- **P1** — Finding 1: Logo is a legacy, low-resolution, stylistically mismatched mark inside an otherwise fully modernized visual system.
- **P1** — Finding 2: Founder's real photo captioned with the company name instead of his own, on all 9 homepage service cards.
- **P2** — Finding 3: Footer's brand tagline is a hardcoded string that has already drifted from the CMS-managed `vision` field it's supposed to echo.
- **P2** — Finding 4: Compliance/provenance-style copy breaks the site's confident brand voice at every social-proof touchpoint.
- **P3** — Finding 6 (addendum): Kora stock hero image's rendered footprint is two pages (home + About Us), not one — scope correction to the existing `MEDIA_AUDIT.md` REPLACE finding, no new action beyond what's already specified there.
- **P3** — Finding 5: Founder headshot focal point unconfigured (currently harmless; preventive fix only).
