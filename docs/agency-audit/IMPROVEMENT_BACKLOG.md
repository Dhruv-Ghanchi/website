# Improvement Backlog

Every finding from all 6 specialist audits, deduplicated and prioritized. **Nothing in this backlog has been implemented** — per the brief, this audit phase produces specifications only.

Scope note on format: P0/P1 items (the ones worth implementing first) get the full structured entry the brief specified. P2/P3 items are condensed to a table — each still has a real evidence citation and fix location in its source document, but repeating the full 12-field template ~30 times would pad this file without adding information. Every item links back to the source audit file for full detail.

---

## P0 — Broken / critical / severe

### P0-1: White text on `--accent` background fails WCAG contrast sitewide
**Area:** Accessibility · **Page:** All pages with a `.button-mint`/`.team-section` element (primary CTAs, testimonials section, hero) · **Element:** `.button-mint`, `.team-section`, `.services-intro > p > span`, `.case-big-stats strong > span`
**Current State:** `color: var(--white)` (`#fffffa`) on `background: var(--accent)` (`#59c29f`) — measures 2.17:1. Accent-as-text on paper/cream measures 2.12:1.
**Kora Reference:** N/A — this is a Ghanchi-introduced token pairing, not inherited from Kora.
**Evidence:** WCAG relative-luminance formula computed directly against `src/app/globals.css:4`'s hex values; full pair table in `ACCESSIBILITY_AUDIT.md` Issue 1.
**Problem:** Every primary CTA button label and the entire testimonials/team section heading+copy fails WCAG AA 1.4.3 (needs 4.5:1 normal / 3:1 large — fails both).
**Recommended Change:** Switch text-on-accent to `--ink` (measures 7.13:1, passes AA/AAA).
**Why:** Highest-visibility content on the site (primary conversion CTAs) is currently unreadable for low-vision users; this alone blocks WCAG AA conformance.
**Implementation Location:** `src/app/globals.css` (`.button-mint`, `.team-section`, `.team-row small`, `.hiring-card p`, `.services-intro > p > span`, `.case-big-stats strong > span`).
**Dependencies:** None.
**Risk:** Low — pure color-token swap, re-verify contrast on the corrected pairing before shipping (ink vs. accent-dark hover state too).
**Priority:** P0
**Estimated Complexity:** Trivial (CSS-only)
**Agents Supporting Finding:** Accessibility Auditor

### P0-2: No click-to-call phone number anywhere outside the nav; homepage is 25-31 screens to the footer's contact info
**Area:** UX / Information architecture · **Page:** All pages (header gap); homepage specifically (distance gap) · **Element:** Sticky header; homepage length
**Current State:** Header carries no `tel:` link on any of 5 routes tested × 2 viewports (10/10 confirmed via DOM query). Footer has correct, complete contact info, but the homepage measures ~24,869px desktop / ~25,838px mobile tall — roughly 25-31 screens of scrolling to reach it.
**Kora Reference:** N/A — this is a business-urgency gap specific to a local advisory service, not a Kora fidelity question.
**Evidence:** `UX_WALKTHROUGH.md` Persona 4, `docs/agency-audit/evidence/ux-walkthrough-data.json` (`p4_desktop`/`p4_mobile` blocks, all 5 routes).
**Problem:** A visitor with real urgency (wants to call today) who does the ordinary thing — scroll the homepage looking for a number — hits an extreme distance most real users won't tolerate. The only fast path today is knowing to click "Contact Us" in the nav.
**Recommended Change:** Add a persistent `tel:` link/button in the sticky header (desktop) and a sticky "Call" affordance on mobile, reachable in 0 scrolls from any page.
**Why:** For a local financial advisory, a phone call is the highest-intent conversion path available; this gap sits directly on top of it.
**Implementation Location:** `src/components/site-shell.tsx` (`Header`).
**Dependencies:** None — `contactInfo.phone1` is already available to `Header` via `siteSettings`.
**Risk:** Low — additive header element; verify it doesn't crowd the existing nav/CTA layout at narrow desktop widths.
**Priority:** P0
**Estimated Complexity:** Small
**Agents Supporting Finding:** Persona Walkthrough Specialist

---

## P1 — Major mismatch / high-impact fix

### P1-1: All 9 homepage service-card quotes are the company quoting itself; founder's real photo captioned with the company name instead of his own
**Area:** Content / Brand · **Page:** Homepage `#services` section · **Element:** Service card pull-quote (`Person` component)
**Current State:** `home-sections.tsx:23` hardcodes `<Person image={founder?.headshot} name="Ghanchi Investments" role="Our vision" />` on every one of the 9 cards; the quote text is the service's own `longDesc`, not a testimonial.
**Kora Reference:** `trial/src/lib/content.ts:98-104` — a unique, named, real-sounding testimonial per service (`"...actually made our brand stronger." — James Martin, CEO, Hamilton`).
**Evidence:** `CONTENT_AUDIT.md` Finding 1, `BRAND_AUDIT.md` Finding 2 (same root cause, two angles).
**Problem:** The founder's authentic photo is paired with an impersonal company-as-speaker caption nine times, cutting against the personal-advisor positioning used everywhere else on the site, and the "social proof" slot is filled with self-description instead of a differentiated quote.
**Recommended Change:** Attribute to the founder by name/role (`Chandrakant B. Ghanchi, Founder & Financial Planner`) instead of the company name — no invented facts required, since his photo is already there.
**Why:** Closes both the brand-voice inconsistency and the content-structure gap in one small change; a fuller fix (real per-service testimonials) is P1-2 below and requires more content work.
**Implementation Location:** `src/components/home-sections.tsx:23`.
**Dependencies:** None for the quick fix (name/role swap). The fuller per-service-testimonial fix depends on P1-2's mapping work.
**Risk:** Low.
**Priority:** P1
**Estimated Complexity:** Trivial
**Agents Supporting Finding:** Content Creator, Brand Guardian

### P1-2: All 9 service detail pages repeat one testimonial, each with a disclaimer admitting it doesn't match
**Area:** Content · **Page:** All `/services/[slug]` pages · **Element:** Service-page testimonial block
**Current State:** Every `service` record references the same `testimonial.id = 34` (Neeta Agrawal / Syntel), followed by a disclaimer: *"...The testimonial describes a general client experience, not a result for this specific service."*
**Kora Reference:** 5 distinct services, 5 distinct matched testimonials, no disclaimer needed.
**Evidence:** `CONTENT_AUDIT.md` Finding 2; confirmed via Strapi `services` API, all 9 records.
**Problem:** The page tells the visitor the proof point they just read doesn't relate to what they came for.
**Recommended Change:** Map the 11 real, already-verified testimonials to services by actual quote content where a genuine match exists (e.g. Manju Rajvanshi/Ashu Rajvanshi both reference "LIC and mediclaim" — life/health insurance); leave the disclaimer only where no real match exists.
**Why:** Removes the self-undermining disclaimer wherever a real, honest match is available.
**Implementation Location:** Content mapping in Strapi (`service.testimonial` relation); no code change required.
**Dependencies:** Someone reading all 11 testimonial quotes to judge genuine topical fit — a content task, not engineering.
**Risk:** Low — purely a relation change in the CMS; content-truth policy already satisfied since no new testimonial is invented, only better-matched.
**Priority:** P1
**Estimated Complexity:** Small (content work, not code)
**Agents Supporting Finding:** Content Creator

### P1-3: `/about-us/our-clients` repeats the identical sentence verbatim across all 9 client-type cards
**Area:** Content · **Page:** `/about-us/our-clients` · **Element:** Client-segment cards
**Current State:** All 9 cards (HNIs, Business owners, NRIs, Entrepreneurs, Software engineers, Advocates, Doctors, Architects, CEOs & CFOs) show the exact same sentence: "Personalized planning in the context of your goals, risk appetite and cash flows."
**Evidence:** `UX_WALKTHROUGH.md` Persona 3, `p3-clients-desktop-fold0.png`.
**Problem:** On the one page whose entire purpose is proving "we understand people like you," identical boilerplate nine times reads as unfinished/templated — the fastest credibility-killer found across all five UX walkthroughs.
**Recommended Change:** Write distinct 1-2 sentence descriptions per client segment (e.g. what NRIs specifically need vs. what doctors specifically need).
**Why:** Directly undermines trust exactly where a skeptical, money-trusting visitor is looking hardest for differentiation.
**Implementation Location:** `about-subpage` (our-clients) content in Strapi, or wherever `siteSettings.clientGroups` descriptions are sourced (`page.clientGroupsIntro` per `src/app/about-us/[section]/page.tsx`).
**Dependencies:** Content work — needs real, specific descriptions per segment, not invented statistics.
**Risk:** Low.
**Priority:** P1
**Estimated Complexity:** Small (content work)
**Agents Supporting Finding:** Persona Walkthrough Specialist

### P1-4: Before/after comparison scene shows the same Ghanchi logo on both the negative and positive cards
**Area:** Content/Visual · **Page:** Homepage comparison scene · **Element:** Comparison "Before"/"After" cards
**Current State:** Both cards display the identical Ghanchi Investments logo.
**Evidence:** `UX_WALKTHROUGH.md` Persona 1, `p1-home-desktop-fold5.png`.
**Problem:** Reads as a branding error on first glance ("why is their own logo on the bad example?") rather than intentional framing — a Kora comparison-scene pattern repurposed without adapting which mark sits on which side.
**Recommended Change:** Remove the logo from the "Before" (negative) card, or replace with a neutral/no-brand treatment; keep it only on "After" if a brand mark belongs in this scene at all.
**Why:** Costs trust at a moment (fold 5, ~2 screens into a low-information-density scroll) where an impatient first-time visitor is already at risk of bouncing.
**Implementation Location:** `src/components/home-sections.tsx` (`Comparison`).
**Dependencies:** None.
**Risk:** Low.
**Priority:** P1
**Estimated Complexity:** Trivial
**Agents Supporting Finding:** Persona Walkthrough Specialist

### P1-5: 9 Kora template stock photos are live in production (homepage/about-us hero, 6 of 9 service images, 2 article covers, 1 newsletter cover)
**Area:** Media · **Page:** Homepage, About Us, 6 service pages, 2 blog articles, newsletter teaser · **Element:** See full table
**Current State:** Fully specified with per-image replacement briefs in `MEDIA_AUDIT.md` — not repeated here in full. Headline: the homepage/about-us hero photo is confirmed pixel-identical to Kora's own unmodified template stock (an abstract tulip macro shot), 6 of 9 services use generic, culturally mismatched stock (e.g. a payment-terminal close-up for "Retirement Planning," European tourists for "Child Education Planning"), and one photo is duplicated across two unrelated services.
**Evidence:** `MEDIA_AUDIT.md` (full table with per-image replacement direction, informed by the 3 already-live AI images' established visual language).
**Problem:** These are the most visible images on the highest-traffic pages of the site, and none of them connect to the actual subject matter, culture, or brand palette.
**Recommended Change:** Generate 9 new images per the detailed briefs already written in `MEDIA_AUDIT.md` (composition/lighting/color-grade/aspect specified per slot) — **as a separate, later execution step**, not part of this backlog's implementation.
**Why:** Directly undermines both Kora-fidelity (the hero is literally unedited Kora stock) and brand authenticity (wrong culture, wrong mood, wrong palette).
**Implementation Location:** Strapi media library + relevant `service`/`article`/`newsletter`/`site-setting` records; no application code change needed (the pipeline already works, proven by the 3 live AI images).
**Dependencies:** Owner approval to proceed with generation (per the brief's explicit "actual generation happens after this audit, as a separate controlled step").
**Risk:** Low technically (proven pipeline); the only real risk is generation quality/consistency, mitigated by the detailed briefs already written.
**Priority:** P1
**Estimated Complexity:** Medium (content generation, not code)
**Agents Supporting Finding:** Image Prompt Engineer, Brand Guardian

### P1-6: Three AI-generated service images are unoptimized, serving 1-2MB PNGs at full resolution
**Area:** Performance · **Page:** Homepage, `/services/life-insurance`, `/services/health-insurance`, `/services/financial-planning` · **Element:** `service.image`
**Current State:** `ghanchi-service-life-insurance.png` (2.18MB), `ghanchi-service-health-insurance.png` (2.06MB), `ghanchi-service-financial-planning.png` (1.03MB) all serve at full original resolution (confirmed: life-insurance hero ships a 768×1376px ~2.1MB PNG rendered at only 625×540 CSS px) because Strapi's auto-generated derivatives re-encode *larger* than these specific source files, so `mediaUrl()`'s smaller-of-the-two fallback logic serves the untouched original.
**Evidence:** `PERFORMANCE_AUDIT.md` Bottleneck #2, direct file-size measurement + live DOM `naturalWidth`/`naturalHeight` check.
**Problem:** This is the single largest LCP risk on the site, on exactly the pages most likely to convert a visitor.
**Recommended Change:** Re-export the 3 source PNGs to WebP/AVIF or at a sane max dimension (~1200px) before re-upload — a content/asset task, not a code change.
**Why:** Cheapest, highest-leverage performance fix available; cuts ~2MB off the heaviest single-page payload.
**Implementation Location:** `public/assets/` source files (or wherever the next-generated replacement images from P1-5 originate — worth doing this compression step regardless of the P1-5 regeneration timeline).
**Dependencies:** None — independent of P1-5's broader media regeneration.
**Risk:** None if done correctly (re-export, re-upload, verify Strapi's `mediaUrl()` now picks the derivative).
**Priority:** P1
**Estimated Complexity:** Trivial (asset re-export)
**Agents Supporting Finding:** Performance Benchmarker

### P1-7: Strapi's `alternativeText` field is fetched into the type system but never actually used anywhere
**Area:** Frontend architecture / Accessibility · **Page:** Homepage service cards, service detail pages, blog articles · **Element:** `StrapiMedia.alternativeText`, `mapService`/`mapArticle`
**Current State:** `src/lib/strapi.ts:28` defines and fetches `alternativeText`, and 3 of 9 services already have real, specific CMS alt text filled in — but `mediaUrl()` discards it, and every consuming component uses a different hardcoded generic string instead (`"Illustrative financial planning imagery"` for every service card regardless of which service; `"${title} collaboration"` on the detail page; `"Illustrative editorial photography"` for every article cover).
**Evidence:** `FRONTEND_ARCHITECTURE_AUDIT.md` P1; `ACCESSIBILITY_AUDIT.md` Issue 2; `STRAPI_CONTENT_AUDIT.md` P1 (same root cause from three angles).
**Problem:** Editorial effort already spent filling in real alt text has zero effect on what ships; screen reader users hear wrong/generic descriptions on 8 of 9 service cards and both articles.
**Recommended Change:** Extend `StrapiMedia`'s mapped output to carry `alt` through `mapService`/`mapArticle` (fallback to a sensible default only when the CMS field is empty); use it in place of the hardcoded strings across all three components.
**Why:** One code fix closes an accessibility gap and makes the CMS field editors already have access to actually work.
**Implementation Location:** `src/lib/strapi.ts` (`mapService`, `mapArticle`), `src/components/home-sections.tsx`, `src/app/services/[slug]/page.tsx`, `src/app/blog/[slug]/page.tsx`.
**Dependencies:** None for the code fix. Remaining CMS-side gap (6/9 services, 2/2 articles still blank) is a separate content task — see P2 table.
**Risk:** Low.
**Priority:** P1
**Estimated Complexity:** Small
**Agents Supporting Finding:** Frontend Developer, Accessibility Auditor, Strapi Content Auditor

### P1-8: Article structured data emits a relative URL where schema.org requires absolute
**Area:** SEO · **Page:** All blog article pages · **Element:** `articleJsonLd()`
**Current State:** `src/lib/structured-data.ts:42-54` passes `url` straight through unresolved; confirmed live output: `"url": "/blog/single-woman-retiring-solo-..."` (relative), while the same object's `image` field and the sibling `breadcrumbJsonLd()` both correctly resolve via `new URL(..., SITE_URL).href`.
**Evidence:** `SEO_AUDIT.md` P1, live JSON-LD fetched and parsed from the running article page.
**Problem:** Google's Rich Results Test and Search Console both flag non-absolute `url` fields as invalid structured data.
**Recommended Change:** Resolve `url` through `new URL(url, SITE_URL).href` the same way `image` and `breadcrumbJsonLd` already do.
**Why:** One-line fix for a real structured-data validity bug in code added this same implementation session.
**Implementation Location:** `src/lib/structured-data.ts:54`.
**Dependencies:** None.
**Risk:** None.
**Priority:** P1
**Estimated Complexity:** Trivial
**Agents Supporting Finding:** SEO Specialist

### P1-9: Home page has no canonical URL
**Area:** SEO · **Page:** `/` · **Element:** `generateMetadata`
**Current State:** Every inner route sets `alternates: { canonical: ... }`; `/` has no `generateMetadata` export at all and `layout.tsx`'s `generateMetadata` never sets `alternates.canonical`. Confirmed: zero `rel="canonical"` matches on the fetched homepage HTML vs. one match on every other route sampled.
**Evidence:** `SEO_AUDIT.md` P1.
**Problem:** The single most important page on the site is the one missing a canonical tag.
**Recommended Change:** Add `alternates: { canonical: '/' }` to `page.tsx`'s own `generateMetadata`, or conditionally in the layout for the root route.
**Why:** `metadataBase` is already set, so this resolves correctly once declared — pure omission, not a harder problem.
**Implementation Location:** `src/app/page.tsx` or `src/app/layout.tsx`.
**Dependencies:** None.
**Risk:** None.
**Priority:** P1
**Estimated Complexity:** Trivial
**Agents Supporting Finding:** SEO Specialist

### P1-10: Logo is a legacy low-resolution mark inside an otherwise fully modernized Kora-fidelity system
**Area:** Brand · **Page:** Sitewide (header, footer, comparison scene, process-video overlay) · **Element:** `logo-ghanchi.png`
**Current State:** A 5-color raster mark with a serif wordmark + tagline, visibly soft even when small, rendering in a typeface (serif) used nowhere else on the site (everything else is Manrope).
**Kora Reference:** `kora™` — a code-rendered SVG icon + sans-serif wordmark in the site's own typeface, scaling losslessly.
**Evidence:** `KORA_VS_GHANCHI_COMPARISON.md` (Typography/Logo row), `BRAND_AUDIT.md` Finding 1.
**Problem:** Every other element on the site went through deliberate Kora-fidelity modernization; the logo is the one unedited legacy holdover, and it's illegible at header size (34px) due to the 3-part composition + tagline.
**Recommended Change:** **Not something to execute in this backlog** — this is a real design deliverable requiring owner sign-off (it's a protected, verified-authentic business asset per `docs/MEDIA_INVENTORY.md`, not something to regenerate unilaterally). Flagged as a candidate for a like-for-like vector redraw (same icon concept, same colors, same name, no tagline at small sizes) — a production-quality upgrade, not a rebrand.
**Why:** Visual-fit issue distinct from the already-settled authenticity question.
**Implementation Location:** N/A — owner decision required before any execution.
**Dependencies:** Owner approval; a designer/vectorization pass.
**Risk:** Medium if rushed (a brand mark redraw done poorly is worse than the status quo) — explicitly flagged as out of scope for this audit's execution.
**Priority:** P1 (as a decision to make; not P1 as "implement now")
**Estimated Complexity:** Medium-Large (real design work)
**Agents Supporting Finding:** UI Designer, Brand Guardian

### P1-11: Footer brand tagline is hardcoded and has already drifted from the CMS-managed `vision` field
**Area:** Frontend architecture / Brand · **Page:** Sitewide footer · **Element:** `site-shell.tsx` footer message
**Current State:** About Us page correctly renders `siteSettings.vision` verbatim ("Making Goal-based customized Financial Advice accessible to all and spread Financial Literacy."). The footer (every page) instead hardcodes a different, shorter string in `site-shell.tsx:100` ("Making goal-based financial advice accessible to all.") — different capitalization, missing "customized" and "and spread Financial Literacy."
**Evidence:** `BRAND_AUDIT.md` Finding 3, direct `grep` confirming `vision` is referenced in exactly 2 files, neither of which is `site-shell.tsx`.
**Problem:** Two renderings of the same core brand statement, sitewide, already say different things — and if the owner edits the CMS `vision` field (a field they have editorial control over specifically to keep this current), the footer will silently keep showing stale wording.
**Recommended Change:** Have the footer consume `siteSettings.vision` directly (or add a dedicated shorter CMS field if the full sentence doesn't fit the footer's layout).
**Why:** Closes a real content-governance gap before it causes visible drift the owner didn't intend.
**Implementation Location:** `src/components/site-shell.tsx:100`.
**Dependencies:** None.
**Risk:** Low — verify the footer layout still reads well if the full (longer) vision sentence is used instead of the current shorter hardcoded one.
**Priority:** P1
**Estimated Complexity:** Trivial
**Agents Supporting Finding:** Brand Guardian

---

## P2 — Meaningful polish

| ID | Area | Finding | Source |
|---|---|---|---|
| P2-1 | Design | Inner-page headings (service/about-us) render at 500 weight with tighter tracking vs. Kora's consistent 400-weight/-0.04em ratio — traced to `inner.css:7,11`, confirmed pre-existing in the `trial` baseline too, not a rebrand regression | `KORA_VS_GHANCHI_COMPARISON.md` |
| P2-2 | Design | Nav pill lost its ~93%-opacity frosted-glass translucency (now fully opaque `--white`); radius softened from a true stadium pill — plausibly deliberate given the added dropdown content, but worth confirming | `KORA_VS_GHANCHI_COMPARISON.md` |
| P2-3 | Design | Footer vertical rhythm compressed >3x (`margin-top` 80px→25px on two major gaps) — verify deliberate vs. unreviewed | `KORA_VS_GHANCHI_COMPARISON.md` |
| P2-4 | Content/Brand | Internal provenance language ("Reported on our existing website, not a live Google feed", "From our client testimonial archive") used as primary stat labels/bylines sitewide instead of a footnote | `CONTENT_AUDIT.md` F3, `BRAND_AUDIT.md` F4 |
| P2-5 | Content | Shared service-page disclaimer names "mutual funds" even on unrelated services (Life Insurance, Personal Accidental Policy, etc.) | `CONTENT_AUDIT.md` F5 |
| P2-6 | SEO | Home page `openGraph` has no `images` — social shares of the homepage show no preview image; `siteSettings.heroImage` is already available as a natural default | `SEO_AUDIT.md` |
| P2-7 | SEO | `Article` JSON-LD omits `author` (Google requires it for Article eligibility) — fix as `{"@type":"Organization","name":"Ghanchi Investments"}`, not a fabricated byline | `SEO_AUDIT.md` |
| P2-8 | SEO | The 2 live articles and the matching `retirement-planning` service are never cross-linked despite an exact taxonomy match already in the data model | `SEO_AUDIT.md` |
| P2-9 | Frontend | `/contact-us` hardcodes its metadata instead of sourcing `contactPage.intro.metaTitle`/`metaDescription` like every other route (fields already exist in Strapi, currently blank) | `FRONTEND_ARCHITECTURE_AUDIT.md`, `STRAPI_CONTENT_AUDIT.md` |
| P2-10 | Frontend | Duplicated copy-to-clipboard logic in `site-shell.tsx` and `contact.tsx` — extract to a shared `useCopyToClipboard()` hook in `ui.tsx` | `FRONTEND_ARCHITECTURE_AUDIT.md` |
| P2-11 | Frontend | Contact and newsletter API routes duplicate ~20 lines of origin-check/body-parsing boilerplate — extract `parseJsonBody`/`verifySameOrigin` to `src/lib/` | `FRONTEND_ARCHITECTURE_AUDIT.md` |
| P2-12 | Content | 6 of 9 services and 2 of 2 articles still have blank `alternativeText` in Strapi (companion content task to P1-7's code fix) | `STRAPI_CONTENT_AUDIT.md` |
| P2-13 | Content | `testimonial.image` field is 0% populated across all 11 records (schema supports client photos, none exist) — needs an explicit owner decision: source real photos, or document as intentionally unused | `STRAPI_CONTENT_AUDIT.md` |
| P2-14 | Accessibility | `Person` component sets `alt={name}` on a photo directly adjacent to the same name as visible text — screen readers announce it twice; set `alt=""` instead (photo is decorative relative to the adjacent text) | `ACCESSIBILITY_AUDIT.md` Issue 5 |
| P2-15 | Accessibility | FAQ tablist accepts all 4 arrow keys regardless of declared `aria-orientation` — should branch on the `contact` flag per WAI-ARIA APG | `ACCESSIBILITY_AUDIT.md` Issue 6 |
| P2-16 | UX | Header founder-photo avatar (next to "Get in touch") has empty `alt`, no label, ambiguous first-impression ("is that a chat button?") | `UX_WALKTHROUGH.md` |
| P2-17 | UX | Awards page captions are generic ("Awards archive — photograph 1/2/3") instead of explaining what was won, from whom, when | `UX_WALKTHROUGH.md` |
| P2-18 | UX | Certificates wall mixes genuine financial credentials (MDRT, LIC) with unrelated recognitions (COVID "Corona Warrior", Human Rights pledge) with no grouping, diluting the financial-authority signal | `UX_WALKTHROUGH.md` |
| P2-19 | UX | Mobile hamburger toggle measures 36×36px, under the commonly-recommended 44×44px touch target | `UX_WALKTHROUGH.md`, `ACCESSIBILITY_AUDIT.md` Issue 3 (BackLink/header-CTA also under the *WCAG-mandatory* 24px minimum — that part is the P1-adjacent accessibility issue; the 36px hamburger is a best-practice miss, not a hard AA failure) |
| P2-20 | UX | Mobile services listing requires ~2-3 screens of scroll to reach the 3rd of 9 cards vs. zero scrolling on desktop | `UX_WALKTHROUGH.md` |
| P2-21 | Performance | Logo served at ~10x its rendered resolution (738×333 natural vs. ~75×34 CSS px in the header) — use Strapi's existing `small`/`thumbnail` derivatives, currently unconsumed by `mediaUrl()`'s medium/large-only check | `PERFORMANCE_AUDIT.md` |
| P2-22 | Media | 3 already-generated AI service images need alt text and quality review before wider reuse as the established precedent (alt text was added this session per `docs/QA_REPORT.md`; a fuller design QA pass on them is still worth doing before generating 9 more in the same style) | `MEDIA_AUDIT.md` |

---

## P3 — Nice-to-have refinement

| ID | Area | Finding | Source |
|---|---|---|---|
| P3-1 | Design | FAQ icon-morph differs from Kora's rotate-45° treatment (Ghanchi scales the bar instead) — both communicate "expanded" correctly, optional to revert | `KORA_MOTION_AUDIT.md` |
| P3-2 | Design | Trust badge uses initials instead of real client photos (already an approved, correct content-truth substitution — not a defect) | `KORA_VS_GHANCHI_COMPARISON.md` |
| P3-3 | Design | Logo ticker uses one flat typographic voice vs. Kora's 5 distinct per-brand treatments (approved content substitution, optional typographic variation available) | `KORA_VS_GHANCHI_COMPARISON.md` |
| P3-4 | Content | Hero headline sets on 3 lines vs. Kora's 2 at the same viewport (longer average word length); trust badge is 2 lines vs. Kora's 1 | `CONTENT_AUDIT.md` F4 |
| P3-5 | Content | All current live-article touchpoints show the same single category (data backlog issue, not a copy defect — resolves once the 23-article backlog is addressed) | `CONTENT_AUDIT.md` F6 |
| P3-6 | Content | Two ratings/returns-disclaimer FAQs miscategorized under "Online Services" instead of "General" | `CONTENT_AUDIT.md` F7 |
| P3-7 | Brand | Founder headshot has no explicit focal point configured in Strapi (currently harmless — the source photo happens to be roughly centered) | `BRAND_AUDIT.md` F5 |
| P3-8 | Accessibility | No native `width`/`height` on any `<img>` — CSS-mitigated today, but not guaranteed for future content images with different aspect ratios | `ACCESSIBILITY_AUDIT.md` Issue 7 |
| P3-9 | Frontend | Dead code: `asset()`/`safeUrl()` in `content.ts` have zero call sites | `FRONTEND_ARCHITECTURE_AUDIT.md` |
| P3-10 | Frontend | `insights/[slug]/page.tsx` fetches the full article collection just to check existence before redirecting — `getArticle(slug)` already does a filtered query | `FRONTEND_ARCHITECTURE_AUDIT.md` |
| P3-11 | Frontend | Tailwind is wired into the build (`@theme inline` block) but zero utility classes are actually used anywhere — either adopt it or drop the dependency | `FRONTEND_ARCHITECTURE_AUDIT.md` |
| P3-12 | Frontend | `mapService`'s `testimonial: ({} as Testimonial)` cast is type-unsafe (works only because every call site uses `?.`) — should be typed `Testimonial \| null` | `FRONTEND_ARCHITECTURE_AUDIT.md` |
| P3-13 | Frontend | Breakpoint convention drift: `globals.css` uses `max-width: 1200px`, `contact.css` uses `1199px` for unrelated concerns — no live bug, just inconsistency | `FRONTEND_ARCHITECTURE_AUDIT.md` |
| P3-14 | Content/Strapi | Category taxonomy (2 records) is thin relative to the 9-service catalog — worth expanding when the article backlog is addressed | `STRAPI_CONTENT_AUDIT.md` |
| P3-15 | UX | Contact page "Office Hours" lists only Monday-Friday, no weekend status | `UX_WALKTHROUGH.md` |
| P3-16 | UX | Secondary phone/email on `/contact-us` render as 1×1px at desktop width — confirm intentional hidden-duplicate, not a stray focusable zero-size element for assistive tech | `UX_WALKTHROUGH.md` |
| P3-17 | UX | "India • UAE • USA" trust marquee text clips at the mobile viewport edge mid-animation | `UX_WALKTHROUGH.md` |
| P3-18 | UX | Health Insurance page's "Connected expertise" cross-sell isn't tailored to aging-parent context (Retirement Planning would pair better than the current generic 3) | `UX_WALKTHROUGH.md` |
| P3-19 | Performance | Client JS bundle ~795KB uncompressed shared baseline, downstream of the P1-adjacent heavy `"use client"` boundary finding — not independently actionable until that's addressed | `PERFORMANCE_AUDIT.md` |

---

## Explicitly not-a-finding (verified and correctly dismissed)

Recorded so a future reader doesn't re-flag these: home hero typography is an exact computed-style match to Kora; brand color tokens exactly match Kora's rendered values; buttons, cards, image-hover treatment, and footer hover micro-interactions are byte-identical to the verified Kora recreation; the new nav-dropdown/hover-pill system is a justified, functionally-necessary addition (Kora has no sub-navigation to compare against); the shared motion system (hero pin/scale/blur, sticky-statement reveal, comparison scene, process/FAQ accordions, footer circle reveal) is byte-identical, verified via direct diff, not assumed; `prefers-reduced-motion` is genuinely implemented at both JS and CSS layers and is a strict superset of Kora's own coverage; the Strapi request-fetching pattern has no waterfall (all `Promise.all`); no WordPress route can be reintroduced (`/wp-admin` etc. all correctly 404); heading hierarchy and metadata uniqueness both checked clean across the sampled routes; the current simple typed-fetch architecture (no dynamic-zone page builder) is confirmed still the right call, no new evidence to revisit it.
