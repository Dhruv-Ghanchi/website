# Agency Implementation Roadmap

**Purpose of this document**: convert the completed Agency Audit (`docs/agency-audit/`) into a single, executable, prioritized plan for closing the identified gaps. This is a roadmap, not a redesign — every item below closes a gap against the existing Kora-fidelity implementation. Nothing here proposes a new design direction, a new component system, or a rewrite.

**Status**: Specification only. Nothing in this document has been implemented. No code has been changed to produce it.

**Sources reconciled**: `docs/agency-audit/IMPROVEMENT_BACKLOG.md`, `FINAL_AGENCY_REVIEW.md`, `KORA_VS_GHANCHI_COMPARISON.md`, `KORA_MOTION_AUDIT.md`, `MEDIA_AUDIT.md`, `PERFORMANCE_AUDIT.md`, `ACCESSIBILITY_AUDIT.md`, `CONTENT_AUDIT.md`, `BRAND_AUDIT.md`, `UX_WALKTHROUGH.md`, `FRONTEND_ARCHITECTURE_AUDIT.md`, `STRAPI_CONTENT_AUDIT.md`, `SEO_AUDIT.md`, `docs/MEDIA_INVENTORY.md`, `docs/CURRENT_IMPLEMENTATION_PLAN.md`, `docs/QA_REPORT.md`.

---

## 1. Current Verified State

As of 2026-09-25 (confirmed by the audit, cross-checked against `git status` and `QA_REPORT.md`):

- **Kora template fidelity**: confirmed essentially complete. Motion system is byte-identical to the verified Kora recreation (`C:\Users\Ghanchi\Desktop\trial`) across all six shared component files plus `globals.css` — verified by direct `diff`, not assumed. Typography, color tokens, buttons, cards, and hover treatments on the homepage are exact matches.
- **Strapi architecture**: implemented and live. 20 content types, 23 components, typed-fetch data layer (`src/lib/strapi.ts`), no request waterfalls (all `Promise.all`), correct least-privilege public permissions, CORS tightened, native focal-point cropping working.
- **Both repos have git history**: `ghanchi-investments` (branch `ghanchi-investments`) and `ghanchi-cms` (branch `main`, initialized this project) are both committed and clean as of the last commit in each. Nothing is pushed to a remote.
- **39/39 Playwright tests + `tsc --noEmit` pass.**
- **Media**: 41 files confirmed authentic Ghanchi business records (founder photo, 8 award photos, 19 certificate scans, logo, 12 idle-but-genuine about-us photos). 3 services already have correct, on-brand AI-generated imagery (Financial Planning, Life Insurance, Health Insurance). 9 Kora-original stock photos remain live in production (hero, 6 services, 2 articles, newsletter cover) — specified for replacement in `MEDIA_AUDIT.md`, not yet generated. 33 files are fully orphaned (not live anywhere).
- **Accessibility**: does not conform to WCAG 2.2 AA today — blocked primarily by one critical contrast failure that touches every primary CTA sitewide.
- **Production readiness**: not production-ready — no hosting decided, no legal-page final text, form delivery unconfigured, canonical hostname unresolved, no DNS work started (correctly, per policy).

This roadmap addresses the **audit-surfaced gaps only** (visual/content/UX/a11y/performance/SEO fidelity). It does not re-litigate the pre-existing production-readiness blockers already tracked in `docs/CURRENT_IMPLEMENTATION_PLAN.md` §34 and `docs/QA_REPORT.md` §3A (hosting, legal text, DNS, form delivery) — those are listed once in §7 below for completeness since several genuinely gate "launch," but their execution plan lives in the existing implementation plan, not here.

---

## 2. What Is Already Correct — Do Not Touch

Confirmed by direct diff/computed-style/live comparison against `kora.framer.media` and the verified `trial` recreation. Re-flagging any of these in a future pass wastes a cycle — they are closed findings, not open items.

| System | Verified state |
|---|---|
| Kora design system (typography, color tokens, spacing, container/section rules) | Home hero typography is an exact computed-style match to Kora. Brand color tokens (`--accent`, `--ink`, `--cream`, `--white`, etc.) exactly match Kora's rendered values. `.container`/`.section-space` rules are byte-identical. |
| Kora layout/structure | Card nesting (40px outer/30px inner/10px gutter), button geometry (`border-radius: 40px`), and section composition are byte-identical to `trial`. |
| Motion language | Hero pin/scale/blur, word-by-word reveal, sticky-statement 15-point piecewise easing, comparison scene, process/FAQ accordion springs, footer circle reveal — all byte-identical, verified via direct `diff`, not assumed. `prefers-reduced-motion` handling is a genuine superset of Kora's own coverage (both JS `useReducedMotion()` gating and a CSS fallback). |
| Ghanchi branding | Logo, brand voice, founder positioning, and the nine-service catalog are correctly and consistently represented site-wide (aside from the specific attribution/tagline-drift items in §3). |
| Strapi architecture | Typed per-content-type fetch layer with an explicit mapping module — confirmed the right call over a dynamic-zone page builder, no rework needed. |
| Verified genuine Ghanchi assets | Founder headshot, logo, 8 award photos, 19 certificate scans (all cross-matched against real WordPress attachment filenames) — none of these are in scope for replacement, ever. |
| Responsive implementation | Zero horizontal overflow confirmed at 1440/1200/810/390/375×667 across sampled routes. |
| Nav-dropdown/hover-pill system | A justified, functionally-necessary addition beyond Kora's flat nav — Kora has no sub-navigation to compare against. Uses Kora's own visual vocabulary (accent color, blur, radii). Keep as-is (one opacity value inside it needs a fix — see §3 P2-2). |
| Card image aspect-ratio fix, `.motion-reveal` reduced-motion coverage | Both are genuine improvements *over* the `trial` baseline, not regressions — worth back-porting to `trial` eventually, not something to "fix" in `ghanchi-investments`. |

---

## 3. Prioritized Issues

Every item below carries its backlog ID from `IMPROVEMENT_BACKLOG.md` for full detail/evidence. IDs are preserved verbatim so this roadmap and the backlog stay cross-referenceable.

### MUST FIX
*Launch-blocking severity, or a hard WCAG AA failure, or a real bug. All are code-only, low-risk, no owner input required.*

| ID | Finding | File(s) |
|---|---|---|
| P0-1 | White text on `--accent` fails WCAG contrast (2.17:1 vs 4.5:1 required) on every primary CTA, the Testimonials/team section, and two highlight-text rules | `src/app/globals.css` (`.button-mint`, `.team-section`, `.team-row small`, `.hiring-card p`, `.services-intro > p > span`, `.case-big-stats strong > span`) |
| P0-2 | No `tel:` link anywhere outside the footer; homepage is ~25–31 screens to reach contact info | `src/components/site-shell.tsx` (`Header`) |
| A11y Issue 3 | Back-link and header "Get in touch" target sizes fall below the WCAG-mandatory 24×24px minimum (2.5.8) at 390px — this is a hard AA failure, not a best-practice miss (the 36px hamburger is separately tracked as SHOULD FIX under P2-19) | `src/components/inner-pages.tsx` (`BackLink`), `src/components/site-shell.tsx` (header CTA) |
| P1-1 | All 9 homepage service-card quotes are attributed to "Ghanchi Investments" instead of the founder by name; his real photo is captioned with the company name | `src/components/home-sections.tsx:23` |
| P1-4 | Before/after comparison scene shows the identical Ghanchi logo on both the negative and positive cards | `src/components/home-sections.tsx` (`Comparison`) |
| P1-7 | `alternativeText` is fetched from Strapi but discarded; every image uses a hardcoded generic alt string instead | `src/lib/strapi.ts` (`mapService`, `mapArticle`), `src/components/home-sections.tsx`, `src/app/services/[slug]/page.tsx`, `src/app/blog/[slug]/page.tsx` |
| P1-8 | Article JSON-LD `url` field is relative; schema.org requires absolute | `src/lib/structured-data.ts:54` |
| P1-9 | Homepage has no `rel="canonical"` — every other route has one | `src/app/page.tsx` or `src/app/layout.tsx` |
| P1-11 | Footer tagline is hardcoded and has already drifted from the CMS-managed `vision` field | `src/components/site-shell.tsx:100` |

### SHOULD FIX
*Real, well-evidenced gaps. Meaningful user/brand/SEO/performance impact, but not launch-blocking. Some need a short content decision (noted); the rest are code-only.*

**Content & brand** (needs a short content pass, no invented facts):
| ID | Finding | Location |
|---|---|---|
| P1-2 | All 9 service detail pages repeat one testimonial with a disclaimer admitting it doesn't match | Strapi `service.testimonial` relation |
| P1-3 | `/about-us/our-clients` repeats the identical sentence across all 9 client-type cards | `about-subpage` (our-clients) content, `siteSettings.clientGroups` |
| P2-4 | Internal provenance language ("Reported on our existing website...") used as a primary stat label/byline instead of a footnote | Sitewide stat/testimonial captions |
| P2-5 | Shared service-page disclaimer names "mutual funds" even on unrelated services | Service-page disclaimer content |
| P2-12 | 6 of 9 services and 2 of 2 articles still have blank `alternativeText` in Strapi (content companion to P1-7's code fix) | Strapi content |
| P2-17 | Awards page captions are generic ("Awards archive — photograph 1/2/3") instead of explaining what was won | `gallery-item` (awards) captions |
| P2-18 | Certificates wall mixes genuine financial credentials with unrelated recognitions, no grouping | `gallery-item` (certificates) ordering/grouping |

**Visual system** (confirm intent first, then fix — see Phase 5):
| ID | Finding | Location |
|---|---|---|
| P2-1 | Inner-page headings render at 500 weight / tighter tracking vs. Kora's uniform 400/-0.04em — pre-existing gap in the `trial` baseline, not a rebrand regression | `src/app/inner.css:7,11` (fix in `trial` first, then port) |
| P2-2 | Nav pill lost its ~93%-opacity frosted-glass translucency (now fully opaque) | `src/app/globals.css` (`.nav-pill`) |
| P2-3 | Footer vertical rhythm compressed >3x (80px→25px on two major gaps) | `src/app/globals.css` (`.footer-links`, `.footer-bottom`, `.footer-message .person`) |

**Accessibility & responsive:**
| ID | Finding | Location |
|---|---|---|
| P2-14 | `Person` component duplicates visible names as image `alt`, causing double announcement | `src/components/ui.tsx:36` |
| P2-15 | FAQ tablist accepts all 4 arrow keys regardless of declared orientation | `src/components/faq.tsx:21` |
| P2-16 | Header founder-photo avatar has empty `alt`, no label — ambiguous first impression | `src/components/site-shell.tsx` |
| P2-19 | Mobile hamburger toggle measures 36×36px, under the recommended 44×44px | `src/components/site-shell.tsx`, CSS |
| P2-20 | Mobile services listing needs ~2-3 screens of scroll to reach card 3 of 9 vs. zero on desktop | `src/components/home-sections.tsx` / CSS |

**Performance:**
| ID | Finding | Location |
|---|---|---|
| P1-6 | 3 AI-generated service images serve as unoptimized 1–2MB PNGs at full resolution — largest LCP risk on the site | `public/assets/ghanchi-service-{life-insurance,health-insurance,financial-planning}.png` (asset re-export, no code change) |
| P2-21 | Logo served at ~10x its rendered resolution (738×333 natural vs. ~75×34 CSS px) | `src/lib/strapi.ts` (`mediaUrl()` — extend to `small`/`thumbnail` derivatives) |
| P2-22 | The 3 already-live AI images need a fuller design QA pass before their style is reused for 9 more | `MEDIA_AUDIT.md` reference set |

**SEO:**
| ID | Finding | Location |
|---|---|---|
| P2-6 | Home page `openGraph` has no `images` | `src/app/page.tsx` `generateMetadata` |
| P2-7 | `Article` JSON-LD omits `author` | `src/lib/structured-data.ts` |
| P2-8 | The 2 live articles and the matching `retirement-planning` service are never cross-linked | `src/app/blog/[slug]/page.tsx`, `src/app/services/[slug]/page.tsx` |

### POLISH
*Real findings, low impact, safe to batch and defer without risk to launch readiness.*

| ID | Finding |
|---|---|
| P2-9 | `/contact-us` hardcodes metadata instead of sourcing `contactPage.intro.metaTitle`/`metaDescription` |
| P2-10 | Duplicated copy-to-clipboard logic (`site-shell.tsx`, `contact.tsx`) — extract to a shared hook |
| P2-11 | Contact/newsletter API routes duplicate origin-check/body-parsing boilerplate — extract to `src/lib/` |
| P3-1 | FAQ icon-morph differs from Kora's rotate-45° (both read correctly; optional revert) |
| P3-2, P3-3 | Trust-badge initials, logo-ticker flat typography — already-approved content-truth substitutions, not defects |
| P3-4 | Hero headline/trust badge line-count differs from Kora at the same viewport — a direct, correct consequence of accurate (shorter) copy |
| P3-5 | All live articles show the same category — resolves once the article backlog is addressed, not a copy defect |
| P3-6 | Two FAQs miscategorized under "Online Services" instead of "General" |
| P3-7 | Founder headshot has no explicit focal point configured (currently harmless) |
| P3-8 | No native `width`/`height` on any `<img>` — CSS-mitigated today, watch for future content images |
| P3-9 | Dead code: `asset()`/`safeUrl()` in `content.ts`, zero call sites |
| P3-10 | `insights/[slug]/page.tsx` fetches the full article collection just to check existence |
| P3-11 | Tailwind wired into the build but zero utility classes used — adopt or drop |
| P3-12 | `mapService`'s `testimonial` cast is type-unsafe |
| P3-13 | Breakpoint convention drift (`1200px` vs `1199px`) — no live bug |
| P3-14 | Category taxonomy (2 records) thin relative to the 9-service catalog |
| P3-15 | Contact page "Office Hours" lists only Mon–Fri, no weekend status |
| P3-16 | Secondary phone/email on `/contact-us` render as 1×1px — confirm intentional |
| P3-17 | "India • UAE • USA" trust marquee clips at mobile viewport edge |
| P3-18 | Health Insurance page's cross-sell isn't tailored to aging-parent context |
| P3-19 | ~795KB client JS baseline — downstream of the client-boundary architecture finding, not independently actionable |

### OWNER DECISION REQUIRED
*Nothing here should be executed without explicit sign-off. Sourced from the agency audit (media/logo) plus the pre-existing, still-open blockers from `CURRENT_IMPLEMENTATION_PLAN.md`/`QA_REPORT.md` that this roadmap's scope touches or depends on.*

**From the agency audit directly:**
1. **P1-5 — Go-ahead to generate 9 replacement images** per the detailed briefs in `MEDIA_AUDIT.md` (hero, 6 services, 2 article covers, newsletter cover). Generation is explicitly a separate, later, controlled step — not part of this roadmap's execution.
2. **P1-10 — Logo redraw decision.** The current raster logo is a legitimate, protected business asset (per `docs/MEDIA_INVENTORY.md`) with a real visual-fit issue (illegible at 34px header height, off-palette serif typeface). Commission a like-for-like vector redraw, or leave as-is. Not something to execute unilaterally.
3. **P2-13 — Testimonial photo sourcing.** `testimonial.image` is 0% populated across all 11 records. Source real client photos, or formally document the field as intentionally text-only.
4. **D2 asset cleanup — 33 orphaned Kora-leftover files.** Safe to delete per `MEDIA_INVENTORY.md` (preserved in `trial` and git history regardless), but a bulk delete needs a go-ahead, not an assumption.

**Pre-existing, still open (tracked in full in `CURRENT_IMPLEMENTATION_PLAN.md` §34 — listed here only where this roadmap's phases touch them):**
5. Contact/newsletter delivery — recipient(s), mechanism, retention (blocks nothing in this roadmap, but blocks real-world usefulness of the P0-2 phone/contact fixes).
6. Legal page final text (Privacy/Terms/Disclaimer currently drafts).
7. Canonical hostname (`ghanchiinvest.com` vs `www.`) — relevant if/when the legacy-URL redirect matrix (outside this roadmap's scope) is implemented.
8. Hosting/infrastructure decisions — relevant to Phase 10's performance verification (a real Lighthouse/CWV pass needs a deployed target).

---

## 4. Exact Implementation Phases

Each phase is independently shippable. Phases 1–9 have no owner-decision dependency and can proceed in sequence or in parallel by a small team. Phases 10–11 are owner-gated and should not start until the relevant sign-off in §3 is received.

### Phase 1 — Accessibility & Conversion Critical (MUST FIX)
**Items**: P0-1, P0-2, A11y Issue 3
**Files**: `src/app/globals.css`, `src/components/site-shell.tsx`, `src/components/inner-pages.tsx`
**Dependencies**: None.
**Work**:
- Swap text-on-`--accent` color to `--ink` on all six flagged selectors; re-verify contrast on both the base and hover (`--accent-dark`) states.
- Add a persistent `tel:` element to the sticky header (desktop) and a reachable mobile "Call" affordance, sourced from `siteSettings.contactInfo.phone1` (already available to `Header`).
- Increase padding on `.inner-back` and the header "Get in touch" link so rendered height reaches ≥24px (target 44px).
**Verification**:
- Re-run the WCAG relative-luminance formula against the corrected token pairs; all must clear 4.5:1 normal / 3:1 large.
- Confirm a `tel:` link is present and reachable in 0 scrolls on all 5 routes × 2 viewports.
- Re-measure `BackLink`/header-CTA bounding boxes at 390px; both must report height ≥24px.

### Phase 2 — Content/Brand Attribution Fixes (MUST FIX)
**Items**: P1-1, P1-4, P1-11
**Files**: `src/components/home-sections.tsx`, `src/components/site-shell.tsx`
**Dependencies**: None.
**Work**:
- Attribute the 9 service-card pull-quotes to the founder by name/role instead of the company name.
- Remove or neutralize the Ghanchi logo on the comparison scene's "Before" (negative) card.
- Point the footer tagline at `siteSettings.vision` directly instead of a second hardcoded string.
**Verification**: Visual diff of the 9 service cards, the comparison scene, and the footer against the corrected copy; confirm no second hardcoded vision string remains (`grep` for the old literal string returns zero matches).

### Phase 3 — Alt-Text Pipeline & SEO Correctness (MUST FIX)
**Items**: P1-7 (code), P1-8, P1-9
**Files**: `src/lib/strapi.ts`, `src/components/home-sections.tsx`, `src/app/services/[slug]/page.tsx`, `src/app/blog/[slug]/page.tsx`, `src/lib/structured-data.ts`, `src/app/page.tsx`
**Dependencies**: None. (P2-12's content fill is a separate, later content task — Phase 4.)
**Work**:
- Extend `StrapiMedia`'s mapped output to carry `alt` through `mapService`/`mapArticle` (fallback to a sensible default only when the CMS field is empty); replace the three hardcoded generic strings.
- Resolve `articleJsonLd()`'s `url` field through `new URL(url, SITE_URL).href`, matching the existing pattern already used for `image` and `breadcrumbJsonLd`.
- Add `alternates: { canonical: '/' }` to the homepage's own metadata.
**Verification**: `page.locator('.service-card img').evaluateAll(imgs => imgs.map(i => i.alt))` returns distinct, service-matching strings; live JSON-LD `url` field is absolute; homepage HTML contains exactly one `rel="canonical"`.

### Phase 4 — Content Work (SHOULD FIX, content-only)
**Items**: P1-2, P1-3, P2-4, P2-5, P2-12, P2-17, P2-18
**Files**: Strapi content records only — no code change.
**Dependencies**: A person reading all 11 testimonials for genuine topical fit (P1-2); 9 short written client-segment descriptions (P1-3); award/certificate transcription where available (P2-17/P2-18, may partially depend on the pre-existing "Awards/certificates transcription" owner input if issuer/date details aren't already known).
**Work**: Map real testimonials to services by actual content match; write distinct client-segment descriptions; move provenance language to a footnote treatment; scope disclaimers per-service instead of a shared "mutual funds" string; fill remaining blank `alternativeText` fields; write specific award captions; group certificates by category (financial credentials vs. other recognitions).
**Verification**: Spot-check each of the 9 service pages no longer shows the generic disclaimer where a real match exists; `/about-us/our-clients` shows 9 distinct sentences; re-run the alt-text DOM check from Phase 3 with 100% of services/articles populated.

### Phase 5 — Visual System Fidelity (SHOULD FIX)
**Items**: P2-1, P2-2, P2-3
**Files**: `trial/src/app/inner.css` (fix baseline first), then port to `src/app/inner.css`; `src/app/globals.css` (`.nav-pill`, `.footer-links`, `.footer-bottom`, `.footer-message .person`)
**Dependencies**: Confirm P2-2/P2-3 were unintentional before changing them — both are plausibly deliberate adaptations (nav pill radius softened for added dropdown content; footer rhythm tightened for shorter content) and should get a quick "was this deliberate?" check against whoever made the original call before reverting.
**Work**: Change `.inner-page h1, h2, h3` from `font-weight: 500` to `400`; align `.inner-intro h1`/`.inner-service-hero h1` letter-spacing to `-.04em`. Restore `.nav-pill` background to ~90–95% opacity white if unintentional. Restore footer `margin-top` values toward Kora's 80px/50px if unintentional.
**Verification**: Re-run computed-style extraction on inner-page headings across `/services/[slug]`, `/about-us`, and confirm 400 weight / -0.04em letter-spacing ratio matches Kora's live values.

### Phase 6 — Responsive & Accessibility Polish (SHOULD FIX)
**Items**: P2-14, P2-15, P2-16, P2-19, P2-20
**Files**: `src/components/ui.tsx`, `src/components/faq.tsx`, `src/components/site-shell.tsx`, `src/components/home-sections.tsx`, CSS
**Dependencies**: None.
**Work**: Set `alt=""` on `Person`'s photo (name already adjacent as visible text). Branch FAQ arrow-key handling on the `contact` orientation flag. Add a label/larger touch area to the header avatar. Increase the mobile hamburger to ≥44×44px. Investigate reducing mobile scroll depth to the 3rd service card (e.g., a 2-column mobile grid or horizontal scroll for the services list).
**Verification**: Screen-reader spot-check (NVDA/VoiceOver) confirms a name is announced once, not twice; FAQ arrow-key behavior matches declared `aria-orientation` on both `/` and `/contact-us`; hamburger bounding box ≥44×44px at 390px.

### Phase 7 — Performance (SHOULD FIX)
**Items**: P1-6, P2-21, P2-22
**Files**: `public/assets/ghanchi-service-*.png` (re-export, no code), `src/lib/strapi.ts` (`mediaUrl()`)
**Dependencies**: None — independent of the Phase 10 media regeneration; worth doing now regardless of timing since these 3 images may or may not be superseded later.
**Work**: Re-export the 3 oversized service PNGs to WebP/AVIF or a sane max dimension (~1200px) before re-upload. Extend `mediaUrl()` to consider `small`/`thumbnail` derivatives for the logo specifically. Do a design QA pass on the 3 existing AI images (composition/quality/brand-consistency) since they're the established precedent for Phase 10's 9 new images.
**Verification**: Confirm `mediaUrl()` now selects a Strapi derivative smaller than the original for all 3 images; measure the life-insurance service page's total image payload before/after (target: cut ~2MB).

### Phase 8 — Frontend Code Hygiene (POLISH)
**Items**: P2-9, P2-10, P2-11, P3-9, P3-10, P3-11, P3-12, P3-13
**Files**: `src/app/contact-us/page.tsx`, `src/components/ui.tsx`, `src/app/api/contact/route.ts`, `src/app/api/newsletter/route.ts`, `src/lib/content.ts`, `src/app/insights/[slug]/page.tsx`, `src/app/globals.css`, `src/app/contact.css`
**Dependencies**: None. Batchable in one pass — all are small, independent, code-only cleanups.
**Work**: Source `/contact-us` metadata from `contactPage.intro`; extract a shared `useCopyToClipboard()` hook; extract `parseJsonBody`/`verifySameOrigin` helpers; remove dead `asset()`/`safeUrl()`; use `getArticle(slug)` instead of fetching the full collection; decide Tailwind adopt-or-drop; type `mapService`'s testimonial field as `Testimonial | null`; unify the `1200px`/`1199px` breakpoint convention.
**Verification**: `tsc --noEmit` and the full Playwright suite still pass; no behavior change, pure refactor — diff review is the verification.

### Phase 9 — Remaining Content & Design Polish (POLISH)
**Items**: P2-6, P2-7, P2-8, P3-1, P3-4 through P3-8, P3-14 through P3-19
**Files**: Varies — `src/app/page.tsx` (P2-6), `src/lib/structured-data.ts` (P2-7), `src/app/blog/[slug]/page.tsx` + `src/app/services/[slug]/page.tsx` (P2-8), plus scattered small items.
**Dependencies**: None; batch opportunistically.
**Work**: Add `openGraph.images` to the homepage; add `author: {"@type":"Organization","name":"Ghanchi Investments"}` to Article JSON-LD; cross-link the `retirement-planning` service and its matching articles; fix the "India • UAE • USA" marquee mobile clipping; tailor the Health Insurance cross-sell; set an explicit focal point on the founder headshot; add native `width`/`height` to any new image type going forward.
**Verification**: Social share preview (Facebook/LinkedIn debugger) shows an image for the homepage; Google Rich Results Test passes Article eligibility; marquee no longer clips at 390px.

### Phase 10 — Media Generation (OWNER-GATED)
**Items**: P1-5
**Files**: Strapi media library + `service`/`article`/`newsletter`/`site-setting` records. No application code change.
**Dependencies**: **Owner go-ahead** (§3 item 1). Do not start without it.
**Work**: Generate the 9 replacement images exactly per the briefs already written in `MEDIA_AUDIT.md` (hero, Mutual Funds, Employer Employee Insurance, Retirement Planning, Child Education Planning, Personal Accidental Policy, General Insurance, 2 article covers, 1 newsletter cover), matching the established visual language of the 3 live AI precedents (candid/documentary, Indian representation, warm color grade, correct aspect ratio per slot). Human review each against the content-truth prohibited list before upload. Set alt text + focal point in Strapi. Connect to the content entry.
**Verification**: Side-by-side comparison against each brief's subject/environment/lighting/aspect spec; re-run the pixel-comparison-to-Kora check on the hero specifically to confirm it no longer matches `kora.framer.media`'s stock photo; confirm no image exceeds a sane file size before upload (learn from Phase 7's finding — export correctly the first time).

### Phase 11 — Logo Redraw (OWNER-GATED)
**Items**: P1-10
**Files**: `public/assets/logo-ghanchi.png` (or its vector source) + `site-setting.logo`.
**Dependencies**: **Owner decision** (§3 item 2) — commission or decline.
**Work**: If approved: a designer/vectorization pass producing a simplified single-weight header lockup (icon + "Ghanchi Investments," no tagline) for small header sizes, reserving the full 3-part tagline lockup for footer/print contexts. Same icon concept, same colors, same name — a production-quality upgrade, not a rebrand.
**Verification**: New lockup legible at 34px header height; no typeface introduced that isn't already in the site's type system (Manrope) unless the owner explicitly wants to retain a distinct wordmark treatment.

### Phase 12 — Final Visual QA & Re-Audit
**Dependencies**: Phases 1–9 complete at minimum (10–11 optional, owner-timeline-dependent).
**Work**: Re-run the same evidence-gathering method the original audit used (`docs/agency-audit/VISUAL_EVIDENCE.md`'s Playwright pattern against `kora.framer.media` and the live local build) to confirm each fix actually closed its finding rather than assuming it did. Re-run `FINAL_AGENCY_REVIEW.md`'s six reality-check questions against the post-fix state.
**Verification criteria**: See §6 below.

---

## 5. Dependency Summary

```
Phase 1 (MUST) ─┐
Phase 2 (MUST)  ├─ no dependencies, can run in parallel
Phase 3 (MUST) ─┘
                                  Phase 4 (content) ─── independent, needs a content-literate reviewer
Phase 5 (visual) ─── needs a "was this deliberate?" check before reverting P2-2/P2-3
Phase 6 (a11y/responsive) ─── no dependencies
Phase 7 (performance) ─── no dependencies, do regardless of Phase 10 timing
Phase 8 (code hygiene) ─── no dependencies, purely internal
Phase 9 (remaining polish) ─── no dependencies
                                        ↓
Phase 10 (media gen) ─── BLOCKED on owner go-ahead
Phase 11 (logo redraw) ─── BLOCKED on owner decision
                                        ↓
Phase 12 (final QA + re-audit) ─── depends on Phases 1–9 minimum
```

Phases 1–9 have zero cross-dependencies on each other and can be executed in any order, by multiple people simultaneously, or fully sequentially — the ordering above is by severity/leverage, not by a technical requirement.

---

## 6. Verification Criteria — Final Kora Comparison / Re-Audit Procedure

Run this after Phase 9 (or after Phases 10–11 if/when they land) to confirm the roadmap actually closed what it claims to, rather than assuming success:

1. **Re-run the evidence script.** Use the same Playwright-based method as `docs/agency-audit/VISUAL_EVIDENCE.md` (live navigation to `https://kora.framer.media/` + the local build, both at 1440×900 and 390px) to re-capture computed styles and screenshots for: home, one service detail page, about-us, one about-subpage, contact-us.
2. **Re-check every MUST FIX item's specific verification criterion** listed in its Phase above (contrast ratios, `tel:` reachability, touch-target sizes, alt-text distinctness, canonical tag presence, JSON-LD absolute URLs).
3. **Re-run the WCAG relative-luminance formula** against every color pairing that changed, not just the ones flagged — confirm no new contrast regression was introduced by any fix.
4. **Re-run the full Playwright suite** (`npm test`) and `tsc --noEmit` — must remain 100% passing.
5. **Diff the inner-page heading computed styles** against Kora's live `/about`, `/insights/[slug]`, `/cases/[slug]` values (fresh fetch, not cached) to confirm Phase 5's weight/tracking fix actually landed at 400/-0.04em.
6. **Re-measure the 3 (or 12, if Phase 10 ran) service/article images'** file size and confirm Strapi's `mediaUrl()` is serving a derivative smaller than the original in every case.
7. **If Phase 10 ran**: re-run the pixel-comparison-to-Kora check specifically on the hero image to confirm it's no longer Kora's stock photo; confirm all 9 new images pass the content-truth prohibited list (no fake documents, no fabricated client relationships, no identifiable real people without basis).
8. **Re-run `FINAL_AGENCY_REVIEW.md`'s six reality-check questions** (evidence-based? technically realistic? rests on the live site? contradicts a locked constraint? backlog implementable? "visually complete" by default?) against the post-fix state, producing a new dated verdict — do not reuse the original verdict.
9. **Update `docs/agency-audit/IMPROVEMENT_BACKLOG.md`** to mark each closed item, or archive it in favor of this roadmap once every MUST/SHOULD item is closed — whichever the owner prefers as the durable record going forward.

A phase is considered **done** only when its own Phase-level "Verification" line passes — not when the code change is merged. A phase is considered **safe to mark closed in the backlog** only after step 9 above confirms it against the live re-audit, not against the developer's own testing alone.

---

## 7. Files/Components Touch Map (Quick Reference)

| File | Phases that touch it |
|---|---|
| `src/app/globals.css` | 1, 5 |
| `src/components/site-shell.tsx` | 1, 2, 6 |
| `src/components/inner-pages.tsx` | 1 |
| `src/components/home-sections.tsx` | 2, 3, 6 |
| `src/lib/strapi.ts` | 3, 7 |
| `src/lib/structured-data.ts` | 3, 9 |
| `src/app/page.tsx` | 3, 9 |
| `src/app/services/[slug]/page.tsx` | 3, 9 |
| `src/app/blog/[slug]/page.tsx` | 3, 9 |
| `src/app/inner.css` (+ `trial` counterpart) | 5 |
| `src/components/ui.tsx` | 6, 8 |
| `src/components/faq.tsx` | 6 |
| `public/assets/ghanchi-service-*.png` | 7 |
| `src/app/contact-us/page.tsx` | 8 |
| `src/app/api/contact/route.ts`, `src/app/api/newsletter/route.ts` | 8 |
| `src/lib/content.ts` | 8 |
| `src/app/insights/[slug]/page.tsx` | 8 |
| Strapi content records (no code) | 4, 10, 11 |

---

## 8. Explicitly Out of Scope for This Roadmap

Per the governing instruction — do not invent new design directions, do not redesign. Also excluded because they are separately tracked, larger architectural investments already correctly scoped as their own future work in `PERFORMANCE_AUDIT.md`/`FRONTEND_ARCHITECTURE_AUDIT.md`, not part of "closing gaps":

- Adopting `next/image` sitewide.
- Restructuring the homepage's client/server component boundary to reduce the ~795KB shared JS baseline.
- Building a dynamic-zone/page-builder CMS system (confirmed correctly not needed).
- Preview mode, signed webhook revalidation, Strapi Content History/Releases.
- The full legacy-WordPress-URL redirect matrix, category/tag archive routing decision, DNS cutover, hosting selection, and legal-page final text — all pre-existing blockers tracked in `CURRENT_IMPLEMENTATION_PLAN.md`, orthogonal to the agency-audit fidelity gaps this roadmap closes.
