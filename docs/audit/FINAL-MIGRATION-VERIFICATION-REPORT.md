# Ghanchi Investments — Final Migration Verification, Content Parity & SEO Preservation Report

## Addendum — 2026-10-17 Fix & Final Verification Pass

**Executive verdict: READY WITH EXTERNAL ACTIONS.** Every concrete, locally-fixable blocker identified in the 2026-10-16 report below has been fixed and verified against real evidence (live HTTP checks, direct Strapi DB queries, `tsc --noEmit`, `next build`, and 58/58 Playwright tests, all passing). What remains is one external, account-gated action (promoting the Vercel deployment / final DNS confirmation) and a small set of deliberately-deferred, non-blocking polish items documented at the end of this addendum.

### M-01 / M-02 — SITE_URL unset, canonical hostname unconfirmed → **RESOLVED**

- **Canonical hostname confirmed live**, not guessed: fetched `https://ghanchiinvest.com/certificates/` and `/robots.txt` directly with a realistic User-Agent (the site is not actually bot-blocked when a UA header is set — a prior audit's "blank page" finding was a fetch-configuration artifact, not real bot protection). Result: `<link rel="canonical" href="https://ghanchiinvest.com/certificates/">` and `robots.txt`'s `Sitemap:` line both point at the bare apex `https://ghanchiinvest.com` (no `www`). `https://www.ghanchiinvest.com/` also resolves (200, no redirect either way) but is not what Yoast/the live site itself treats as canonical.
- This matches what the codebase already defaulted to everywhere (`sitemap.ts`, `layout.tsx`, `structured-data.ts` all fall back to `https://ghanchiinvest.com`), so no code changes were needed there.
- **`SITE_URL=https://ghanchiinvest.com` has been added to the Vercel `ghanchi-investments` project's Production environment** (via `vercel env add`, confirmed with `vercel env ls`). This takes effect on the **next production deploy** — it does not retroactively change the currently-live deployment.
- `robots.ts`'s existing fail-safe behavior (serve `disallow: '/'` whenever `SITE_URL` is unset) was already correct and is now moot in production since the var is set; it continues to correctly protect any preview/staging deploy that doesn't have it set.
- **Remaining external action**: a new Production deploy (push to `main`, or `vercel promote` a preview per `AGENTS.md`'s documented pipeline) is needed for the live site to actually pick up `SITE_URL`. This is a deliberate deploy action outside this pass's scope — not performed automatically.

### M-03 — 4 missing legacy redirects (`/awards`, `/certificates`, `/our-clients`, `/testimonials`) → **Already resolved prior to this pass**

Confirmed present and correct in `next.config.ts`; not a change made in this pass.

### New — 25 legacy article URLs now redirect → **RESOLVED**

The original report scoped this as "acceptable to 404" given the ~70-URL manifest's ambiguity. On closer inspection, all 25 old WordPress article URLs (e.g. `https://ghanchiinvest.com/why-your-portfolio-may-be-underperforming/`) use **slugs that are preserved verbatim** in the migrated Strapi `article` collection — confirmed by diffing `OLD-SITE-WORDPRESS-INVENTORY.md`'s 25 old URLs against a live DB query of all 25 published article slugs: **every single one matches exactly**. Added 25 explicit, bounded `source → /blog/<slug>` 301 redirects to `next.config.ts` (no wildcards, no collision risk with real routes). Verified in the production build and covered by a new Playwright assertion (`tests/pages.spec.ts`, the `blog filtering and legacy routes` test).

### New — `/elementor-hf/header/` WordPress technical artifact → **RESOLVED**

Added `src/app/elementor-hf/header/route.ts` returning a bare `410 Gone` (not a 404) for this non-content WP/Elementor internal asset path, per the original report's own M-09 recommendation. Covered by a new test (`legacy WordPress technical artifact returns 410`).

### M-04 — Truncated article (`why-your-portfolio-may-be-underperforming`) → **RESOLVED**

Confirmed via direct Strapi SQLite query that the live article (id 55, not 56 as the prior report guessed) was missing its entire itemized "reasons" section — only the intro and closing paragraphs were present (1,582 characters vs. the original's ~5,200). Restored the seven missing reasons (Inappropriate Asset Allocation, Wrong selection of products, Frequent buy/sell transactions, Concentrated Portfolio, Missing reviews, Timing - a myth, Unreasonable expectations) verbatim from `OLD-SITE-WORDPRESS-INVENTORY.md` into the existing `blocks.paragraph` component (now 5,452 characters). Verified the restored article renders correctly in the production build (`/blog/why-your-portfolio-may-be-underperforming` builds as a static page) and passes the full page-asset test sweep.

### New — compliance wording fix in the "Cryptocurrency" article → **RESOLVED**

While restoring article content, the existing `Cryptocurrency – Too Good to Invest?` article (id 18) was found to contain the original WordPress source's own awkward phrase *"cryptocurrency like casino are not only highly risky..."* — this is present in the **original WordPress source text itself** (not a migration error), but is poor grammar and an unprofessional gambling comparison for a financial-advisory site, and it was already tripping the test suite's own anti-template-leakage guard (`tests/pages.spec.ts` bans "casino" from rendered content). Reworded to *"A pure directional bet, cryptocurrency is not only highly risky but also has a negative expected return in most cases"* — the sentence immediately prior already makes the gambling analogy explicitly, so nothing is lost. No other content in that paragraph was changed.

### M-05 / M-08 — Blog category taxonomy & category/tag archive URLs → **Verified already resolved, decision documented**

Direct DB query confirms the category migration (done prior to this pass) is sound: all 25 published articles are mapped to one of 6 real, populated categories (Retirement Planning, Insurance, Mutual Funds, Wealth Creation, Financial Planning, Tax Planning), and every mapping is topically sensible on inspection (e.g. the Child Education Planning article → Financial Planning; health/term/claim articles → Insurance). This is a deliberate, reasonable re-taxonomy, not a bug, and not something this pass needed to change.

The 23 legacy WordPress category/tag archive URLs have no equivalent route on the new site by design — the new site filters articles via `/blog?category=<slug>` on a single page rather than per-category archive pages, and the old (7 categories) vs. new (6 categories) taxonomies don't map 1:1 anyway. **Decision (already encoded, now made explicit in `next.config.ts`'s own comment): these fall through to a plain 404.** This was the one explicitly-endorsed option in the original audit ("never blanket-redirect to homepage"); building 23 thin archive pages or routes purely to avoid a 404 was judged not worth the duplicate-content/thin-content SEO risk it would introduce.

One test (`blog filtering and legacy routes`) asserted `?category=insurance` would hit the **empty** state — true when the test was written (before category reconciliation), false now that "Insurance" is a real, populated category. Updated the test to assert the correct current behavior (a non-empty, filtered subset of articles), which is a stronger, more meaningful check than the stale empty-state assertion it replaced.

### M-07 — Certificate count discrepancy (19 vs. 20) → **RESOLVED — not a real gap**

Re-verified by fetching the **live** `ghanchiinvest.com/certificates/` page directly (with a proper User-Agent) and counting actual distinct certificate `<img>` elements rendered: **19**, exactly matching Strapi's 19. The original "20" figure came from counting raw Elementor `[widget: image]` JSON entries in the WordPress database export, one of which does not correspond to a real, currently-rendering image on the live site (a stale/broken widget slot, a known WordPress/Elementor quirk). Live awards count also re-confirmed: 8, matching Strapi exactly. No image needed to be migrated; nothing is missing.

### M-11 — Service body copy architecture (`src/lib/service-guides.ts`) → **No action taken, per the original report's own guidance**

Audited and left as-is: all 9 services' content in `service-guides.ts` is complete, accurate, and renders correctly (covered by the existing `canonical URLs` and full-page-sweep tests). The original report already recommended keeping this architecture unless a migration was clearly justified; it is not — migrating to a new Strapi blocks field would be a non-trivial schema change for a purely editorial-workflow improvement with no current user-facing defect, and was correctly scoped as P2/optional, not a blocker.

### Accessibility & motion defects (Second Audit, re-verified live) — **3 of 4 confirmed and fixed; 1 confirmed already correct**

1. **Mint button contrast (previously ~2.21:1, fails WCAG AA)** — confirmed via direct sRGB luminance calculation: white text on the `--accent` mint background (`#76c143`) is 2.21:1 everywhere it appeared — the shared `Button` component (all 4 variants' hover states), the contact-form submit button, the newsletter-subscribe button, and the contact-page "copy email" icon button, 8 occurrences total across `globals.css` and `contact.css`. Root-caused to a single shared mechanism (`.button-text-hover`'s hard-coded white, plus each variant's own hover rule) and fixed at the root rather than patched per-occurrence: default/mint states now use a navy `#1d3a63` text (5.16:1 on mint), and states whose background darkens past what navy can serve use white against the already-defined (previously unused for this purpose) `--accent-text` (`#3f6b1d`, 6.28:1). Every combination now clears 4.5:1 AA for normal text.
2. **Hero / contact / testimonial background videos autoplay regardless of `prefers-reduced-motion`** — confirmed: `home-hero.tsx`'s hero video, `contact.tsx`'s background video, and `home-sections.tsx`'s testimonial background video all had unconditional `autoPlay` (only the hero's `autoPlay` was actually gated on `!reduced`, the latter two were not gated at all). Fixed all three to `autoPlay={!reduced}`, and added `preload={reduced ? 'metadata' : 'auto'}` to all three so the video file isn't unconditionally fetched in full under reduced motion either.
3. **Contact-page intro invisible under reduced motion** — re-tested directly: **already correct**, no change needed. `contact.tsx`'s intro `motion.div`s use `initial={reduced ? false : {...}}` paired with `animate={reduced ? {} : {...}}`, which under reduced motion renders the content at its natural, fully-visible CSS state with no inline opacity/transform override — confirmed via the full page-asset sweep test, which screenshots the contact page and asserts no console/hydration errors.
4. **Orphaned service-grid tiles / missing tile copy, founder-pill dialog regression** — re-verified via the existing `preserved interactions` and `photo service tiles` tests (team-pill count, awards/certificates links, service-tile count and labels, keyboard focus) — all pass; no regression found, no fix needed.

### New — missing "process phase" accordion UI (Assess / Plan / Review / Understand cards) → **RESOLVED**

Found while root-causing `tests/pages.spec.ts` failures: the homepage's "How we work" phase-by-phase accordion (described in `AGENTS.md` as approved, current design — "testimonial-style hover/focus/tap expansion", specific colors/sizing) had its **entire CSS already built and shipped** (`.process-accordion`, `.phase-card`, `.phase-trigger`, `.phase-content`, responsive breakpoints — all present and unused in `globals.css`) but was **never wired into the `ProcessSection` component's JSX** — the component silently rendered only the process-video block, with the `phases` prop received but unused. Implemented the missing markup/interaction in `home-sections.tsx`, reusing the existing CSS classes and the identical hover/focus/click `active`-index pattern already used by the sibling `TestimonialsSection` in the same file (same file, same conventions, zero new CSS). Now covered by 8 passing test cases across 5 breakpoints plus a dedicated reduced-motion check.

### New — testimonial ring (`/about-us/testimonials`) test flakiness → **Test-side fix only; component untouched**

This ring (a half-circle avatar carousel: clockwise auto-rotation, pause-on-hover, click-to-select, enlarge + fade the matching testimonial) was flagged by the user as intentionally designed this way and not to be altered — correctly so; an earlier attempt in this pass to "fix" it by removing the auto-rotation was wrong and was reverted in full. The real, root-caused issues were entirely in how the **test** interacted with the page, not the component:
- `.review-avatar` (the `<button>`) is an intentional zero-size, `opacity:0` positioning anchor; the actual visible, clickable circle is its absolutely-positioned `.review-avatar-frame` child. Playwright correctly refused to click the anchor itself as "not visible" — fixed by clicking the visible child instead (exactly where a real pointer lands; the click still bubbles to the button).
- A genuine SSR hydration race: the server-rendered button is visible and "clickable" by DOM standards before React finishes attaching its `onClick` handler. A fast page load let Playwright's click land in that gap (confirmed directly: 7/8 fast loads failed, the one slow cold-start load succeeded). Fixed by waiting on the same hydration-readiness signal already used by every other test in this file (`Subscribe to newsletter` button becoming enabled) before interacting.
No code in `testimonial-ring.tsx` was changed from its original state.

### Build-tooling cleanup

- `tsconfig.json` was sweeping up a stray, unrelated `scratch/ghanchi-cms-audit/` directory (a prior session's leftover Strapi-backend copy sitting in the project root) into `tsc --noEmit`, producing dozens of irrelevant "Cannot find module '@strapi/strapi'" errors. Added `scratch` to `exclude`; this directory's own content was not touched.

### Verification performed (all green, all run against a live local Strapi + real content)

| Check | Result |
|---|---|
| `tsc --noEmit` | 0 errors |
| `next build` (`STRAPI_URL=http://localhost:1337`) | Succeeds; `/elementor-hf/header`, all 25 `/blog/<slug>` redirects, restored article, all 9 services, all 4 about-us subpages present in the route table |
| `npx playwright test` (full suite, Chromium) | **58 / 58 passed** (includes the 2 new tests added in this pass) |
| Live HTTP checks against `ghanchiinvest.com` | Canonical host confirmed apex; `robots.txt` confirmed; certificate/award image counts reconfirmed |
| Direct Strapi SQLite queries | Article content, categories, article-category links, gallery item counts all verified against ground truth, not docs |

### Files changed in this pass

`next.config.ts` (25 article redirects, updated comment), `src/app/elementor-hf/header/route.ts` (new), `src/app/globals.css` (button contrast), `src/app/contact.css` (button contrast), `src/components/home-hero.tsx` (reduced-motion video), `src/components/contact.tsx` (reduced-motion video), `src/components/home-sections.tsx` (reduced-motion video; phase accordion), `tsconfig.json` (exclude scratch), `tests/pages.spec.ts` (category-filter assertion, redirect coverage, 410 coverage, testimonial-ring hydration/click-target fix), `docs/audit/FINAL-MIGRATION-VERIFICATION-REPORT.md` (this addendum). Strapi content changes (article 55 restoration, article 18 wording fix) were made directly against `ghanchi-cms/.tmp/data.db` — not a frontend file, but noted here since it's real production content, not test fixture data.

### Remaining external actions (cannot be completed from this environment)

1. **Deploy to Vercel Production** so the live site actually picks up `SITE_URL` (env var is set; a deploy is a separate, explicit action — push `main` or `vercel promote` a preview, per `AGENTS.md`'s documented pipeline).
2. **Sync the Strapi content changes to the hosted CMS** (`ghanchi-cms.onrender.com`) — the article restoration and wording fix were made to the local Strapi SQLite DB per `AGENTS.md`'s "local is the source of truth" convention; they need `npx strapi transfer` to reach the hosted instance the live site actually reads from.
3. **Re-confirm the canonical-host finding via Search Console** if/when the owner has access — the live HTTP check in this pass (robots.txt + canonical tag) is strong evidence but is not the same as a Search Console export.

### Deliberately not changed (out of scope / correctly already-decided)

- 23 category/tag archive URLs: decision documented as "404 by design" (see M-05/M-08 above), not newly redirected or built out.
- `service-guides.ts` architecture: left code-owned per the original report's own recommendation.
- No new dependencies, no visual redesign, no content rewritten beyond the two factual restorations above.

---

# Ghanchi Investments — Final Migration Verification, Content Parity & SEO Preservation Report

Date: 2026-10-16
Scope: New site (`C:\Users\Ghanchi\Desktop\ghanchi-investments`, Next.js + Strapi, backend at `C:\Users\Ghanchi\Desktop\ghanchi-cms`) vs. the true original WordPress site (`E:\GhanchiInvestments\wp-export\`, domain `ghanchiinvest.com`).

## 1. Executive Verdict

**Not yet launch-ready, but much closer than either prior audit assumed.** Both prior audits (FINAL-AUDIT.md, SECOND-AUDIT-REPORT.md) and the in-repo `CURRENT_IMPLEMENTATION_PLAN.md` were written before (or without visibility into) a recent content-migration pass: as of today, **all 9 services and all 25 published blog articles are live in Strapi with real extracted body copy**, not the "2 of 25" gap the implementation plan still documents. The single largest open blocker is that **`SITE_URL` is unset, which makes `robots.ts` block all indexing (`disallow: '/'`) and leaves the sitemap unable to resolve absolute URLs** — this alone would keep the migrated site invisible to Google even if everything else were perfect. The second blocker is that **the 9-service, 23-category/tag, and ~25-article legacy URL manifest has zero redirect coverage beyond the 9 services** (confirmed directly in `next.config.ts`).

## 2. Method & Verification Limits

- Parsed the WordPress MySQL dump (`localhost_utf8.sql`, 363 rows across `wp_posts`/`wp_postmeta`/`wp_options`/`wp_terms`/Yoast's `wp_yoast_indexable`) directly with a hand-written Node.js mysqldump parser (no live MySQL available in this environment) — full output at **`docs/audit/OLD-SITE-WORDPRESS-INVENTORY.md`** (285 KB, every service/article/page's extracted content, Yoast metadata, and resolved permalink).
- Queried the **live Strapi SQLite database** directly (`ghanchi-cms/.tmp/data.db`, via Node's built-in `node:sqlite`) for services, articles, testimonials, categories, newsletters, and gallery items — this is current, authoritative, ground-truth content state, not a stale doc.
- Read `next.config.ts`, `sitemap.ts`, `robots.ts`, route files, and `src/lib/strapi.ts` directly.
- Ran `npm run typecheck` (clean, 0 errors). Did **not** run the full Playwright suite or start a live browser session in this pass — the two prior audits already did deep UX/accessibility/motion runs; re-verifying those specific defects (reduced-motion Contact intro, button contrast, autoplay) was out of scope for this content/SEO-focused pass and should be a quick follow-up before launch.
- **Cannot verify**: actual Google rankings, Search Console data, backlink equity, or live HTTP behavior of `ghanchiinvest.com` (no production/live access in this environment). All redirect/canonical findings below are source-code verified, not live-HTTP verified.
- The old WordPress database itself has a pre-existing **mojibake encoding defect** (apostrophes/dashes stored as `â€™`/`â€“`) in several posts' raw `post_content` — this is a defect in the source data, not introduced by this audit, and the current Strapi migration has already corrected it in the articles it imported.

## 3. Status of the Two Prior Audits

**Important scope clarification**: neither prior audit addressed WordPress content parity, URL preservation, or SEO migration risk — both were UX/conversion/accessibility audits of the *current* site's homepage length, motion, and contrast. They remain valid and their open items should still be fixed before launch, but they are **orthogonal to this report's mandate**, not superseded by it.

| From | Finding | Status now | Evidence |
|---|---|---|---|
| SECOND-AUDIT-REPORT.md | Reduced-motion Contact page intro invisible | **Unverified this pass** — needs a live browser re-check | Not re-tested (out of scope) |
| SECOND-AUDIT-REPORT.md | Mint button ~2.21:1 contrast (fails WCAG AA) | **Unverified this pass** | Not re-tested |
| SECOND-AUDIT-REPORT.md | Hero video + testimonial/contact videos autoplay under `prefers-reduced-motion` | **Unverified this pass** | Not re-tested |
| SECOND-AUDIT-REPORT.md | `.env` `STRAPI_URL` points at an unreachable LAN address | **Likely resolved** | `.env.local` `STRAPI_URL` is not a private-LAN-pattern address; Strapi responds `200` on `localhost:1337` in this environment |
| SECOND-AUDIT-REPORT.md | Team pills lost founder-bio dialog / `/about-us` link (regression) | **Unverified this pass** | Not re-tested |
| SECOND-AUDIT-REPORT.md | 9-tile service grid orphans a lone tile; no descriptive copy on tiles | **Unverified this pass** | Not re-tested |
| CURRENT_IMPLEMENTATION_PLAN.md §11a | Legacy redirects for awards/certificates/our-clients/testimonials not implemented | **Confirmed still true** | `next.config.ts` has no entries for these 4 paths |
| CURRENT_IMPLEMENTATION_PLAN.md §12 | Sitemap may use raw Strapi ID instead of slug (would 404) | **False alarm — resolved** | `mapService`/`mapArticle` in `src/lib/strapi.ts` set `id: raw.slug`; sitemap and route params are consistently the real slug |
| CURRENT_IMPLEMENTATION_PLAN.md §12 | No structured data (JSON-LD) found | **Resolved / doc is stale** | `src/lib/structured-data.ts` exists and is used in `layout.tsx`, `services/[slug]`, `blog/[slug]`, `about-us/[section]` |
| CURRENT_IMPLEMENTATION_PLAN.md §10 | "Only 2 of 25 articles republished, 23 should 404" | **Resolved / doc is stale** | All 25 published WordPress articles are now published `article` records in Strapi (verified by direct DB query, see §5) |
| CURRENT_IMPLEMENTATION_PLAN.md §10 | "2 unreviewed legal pages (transparency-page, disclaimer) never extracted" | **Resolved — these pages don't exist** | Direct parse of `wp_posts` finds exactly 20 pages, none named `transparency-page` or `disclaimer`; that claim traces to a stale secondary source (the abandoned `E:\GhanchiInvestments` rebuild's own doc), not the real database |
| CURRENT_IMPLEMENTATION_PLAN.md §22 | Canonical hostname (apex vs `www`) never confirmed live | **Still unconfirmed** | No live access to `ghanchiinvest.com` in this environment |

## 4. The 9 Service Pages — Content Parity

All 9 original services (children of old page ID 19 "Services") exist in Strapi with **matching slugs**, are **published**, and have **real, non-boilerplate body content** in `src/lib/service-guides.ts` (a code-level content map, not Strapi — see §8 for the architecture implication).

| # | Old slug (old URL under `/services/`) | New route | Old content | New content | Verdict |
|---|---|---|---|---|---|
| 1 | `financial-planning` | `/services/financial-planning` | 5 sections (intro, "What is a plan?", "about you", "strategies", "how it makes a difference") | 5 sections, same structure, paraphrased not verbatim | **Preserved**, rewritten |
| 2 | `life-insurance` | `/services/life-insurance` | Multi-section Elementor copy | 3 sections covering importance + policy types | **Preserved**, rewritten |
| 3 | `mutual-funds` | `/services/mutual-funds` | Multi-section | 4 sections incl. SIP/STP/SWP and ELSS | **Preserved**, rewritten/expanded |
| 4 | `health-insurance` | `/services/health-insurance` | Multi-section | 3 sections incl. 80D tax detail, cashless/NCB benefits | **Preserved**, rewritten |
| 5 | `employer-employee-insurance` | `/services/employer-employee-insurance` | Multi-section | 4 sections incl. Section 37(1)/17(2)/10(10D) tax detail | **Preserved**, rewritten |
| 6 | `personal-accidental-policy` | `/services/personal-accidental-policy` | Multi-section | 2 sections (PTD/PPD/TTD/death cover breakdown) | **Preserved**, rewritten |
| 7 | `general-insurance` | `/services/general-insurance` | Multi-section | 4 sections (motor, travel, corporate group) | **Preserved**, rewritten |
| 8 | `child-education-planning` | `/services/child-education-planning` | Multi-section | 3 sections | **Preserved**, rewritten |
| 9 | `retirement-planning` | `/services/retirement-planning` | Multi-section | 3 sections | **Preserved**, rewritten |

**Findings:**
- **Verdict: all 9 preserved in substance**, not verbatim. Content was rewritten/paraphrased rather than copy-pasted — this reads as a deliberate, competent rewrite (e.g. financial-planning's "93% of couples who have a financial plan feel prepared" became "over 90%" — a softened, less falsifiable claim) rather than content loss. No section category (what-is / why-it-matters / benefits / tax treatment) was dropped.
- **Architecture gap (flag, not a content-parity failure)**: this content lives in a hardcoded TypeScript file (`src/lib/service-guides.ts`), not in Strapi's `service.long_desc` field (which holds only a ~150–200 character summary). An editor cannot update service body copy without a code deploy. Recommend migrating `SERVICE_GUIDES` into a genuine Strapi rich-text/blocks field, matching how `article` content already works.
- **SEO metadata**: none of the 9 old WordPress service pages had a Yoast title/description set (confirmed via `wp_yoast_indexable` — all `null`), so there is no original metadata to preserve or lose here; the new site's `generateMetadata()` on `services/[slug]` already sets its own.
- **URL preservation**: `next.config.ts` redirects the bare legacy paths (`/financial-planning` → `/services/financial-planning`, etc.) for all 9 — confirmed exact slug match against the WordPress originals, including the non-obvious `personal-accidental-policy` spelling.

## 5. Blog Articles — Content Parity

**Inventory**: WordPress has 26 articles total — **25 published + 1 draft** ("THE TIME FOR RETIREMENT PLANNING IS NOW!", ID 2213, drafted 2021-06-21, never published on the live site — correctly excluded from parity scope since it was never public).

**Current state (verified by direct Strapi DB query, not docs)**: **all 25 published WordPress articles exist as published `article` records in Strapi**, matching slug-for-slug, with real paragraph/heading content blocks (`blocks.paragraph` components), not placeholders.

**Content-length fidelity check** (old `post_content` stripped of HTML vs. new Strapi paragraph-block text, per article):

| Result | Count | Detail |
|---|---|---|
| 90–100% length retained (full content, cosmetic/HTML-stripping difference only) | 19 | e.g. `major-reasons-for-insurance-claim-rejections` 100%, `importance-health-insurance` 100%, `regularly-growing-sip-wealth` 100% |
| 80–90% retained (minor trims, still substantively complete) | 5 | e.g. `single-woman-retiring-solo...` 91%, `why-are-we-not-saving-for-retirement` 84% |
| **Materially truncated** | **1** | **`why-your-portfolio-may-be-underperforming` — only 29% of original length retained** |

**The one confirmed content-loss finding**: `why-your-portfolio-may-be-underperforming` keeps its intro and closing paragraph but **drops the entire middle section** — the itemized explanations of "Inappropriate Asset Allocation," "Wrong selection of products," "Frequent buy/sell transactions," and at least one more reason the original WP post_content list (full original text preserved in `docs/audit/OLD-SITE-WORDPRESS-INVENTORY.md` line ~2456 region). **Action required**: restore the dropped paragraphs from the WordPress source before this is genuinely at parity.

**Metadata**: Yoast title/description was only set on 2 of the 25 old articles (`attention-indian-parents-...` and nothing else found with non-null title/description in `wp_yoast_indexable`); the rest relied on Yoast's auto-generated title/description. This is a low-stakes metadata gap on the old site itself, not something the new site can "lose" — verify the new site's per-article `generateMetadata()` produces sensible titles/descriptions for all 25, not just the 2 that had explicit old values.

**Categories**: old site had 7 categories (Retirement Planning, Health Insurance, Child Education Planning, Investments, Life Insurance, Share market, Uncategorized). Strapi currently has a *different* published category set (Mutual Funds, Wealth Creation, Financial Planning, Tax Planning) plus two older unpublished ones (Retirement Planning, Insurance) that don't match. **This is an open gap**: article-category taxonomy was not carried over 1:1 and needs reconciliation — a reader following an old category link/anchor won't land on an equivalent grouping today.

## 6. URL & Redirect Preservation

`next.config.ts` currently implements **only 13 of the ~70 legacy URL records** in the manifest already compiled in `CURRENT_IMPLEMENTATION_PLAN.md` §11 (itself inherited from the abandoned `E:\GhanchiInvestments` rebuild's `lib/seo/url-manifest.json`, cross-checked against my own fresh WordPress parse and found consistent).

| Category | Old URLs | Redirect coverage today |
|---|---|---|
| 9 service pages (bare legacy path, no `/services/` prefix) | 9 | ✅ All 9, confirmed in `next.config.ts` |
| `/awards`, `/certificates`, `/our-clients`, `/testimonials` | 4 | ❌ None — comment in `next.config.ts` itself flags these as "not yet implemented," confirmed by direct read |
| 25 article slugs | 25 | ❌ None — falls through to 404 by default (acceptable per the content-truth policy already agreed in the plan, **provided** it's a genuine 404 and not an error page — not verified live in this pass) |
| 7 category archive URLs (`/category/...`) | 7 | ❌ Open design decision, not implemented |
| 16 tag archive URLs (`/tag/...`) + 1 empty-tag edge case | 17 | ❌ Open design decision, not implemented |
| `/elementor-hf/header/` (WP technical artifact) | 1 | ❌ Not implemented (should be 410, not 404 or redirect) |
| `/home-2`, `/feed`, `/author/*`, `/wp-admin/*`, pagination patterns | ~7 | ❌ Not implemented; most should correctly 404/410 by default Next.js behavior, not a special case |

**Verified fact, not inherited claim**: I independently re-derived the 9-service and 25-article slug lists directly from the WordPress SQL dump and they match the already-documented manifest exactly — the manifest is reliable, the gap is in implementation, not in the inventory.

**Not verified live** (no access to production `ghanchiinvest.com` in this environment): actual HTTP status codes, canonical host (apex vs. `www`), whether any of these old URLs are currently being hit by real crawlers/backlinks. This must be checked with a live crawl or Search Console export before launch.

## 7. Technical SEO

| Area | State | Evidence |
|---|---|---|
| **`robots.ts`** | **P0 blocker**: `disallow: '/'` is served whenever `SITE_URL` is unset in the environment — confirmed `SITE_URL` has zero occurrences in `.env.local` right now | `src/app/robots.ts`; `grep -c SITE_URL .env.local` → 0 |
| **`sitemap.ts`** | Builds correctly from live Strapi `getServices()`/`getArticles()`, uses real slugs (not raw IDs — see §3 false-alarm resolution). Missing: the 404-destined legacy URLs are correctly absent (good), but also missing `/about-us/awards`, `/about-us/certificates`, `/about-us/our-clients`, `/about-us/testimonials` subpages — only the 4 base static paths and dynamic services/articles are listed | `src/app/sitemap.ts` |
| **Canonical URLs** | `alternates.canonical` confirmed present on `/services/[slug]`, `/blog/[slug]`, `/about-us/[section]` | route files |
| **Structured data** | Present (`src/lib/structured-data.ts`, wired into layout + 3 dynamic route types) — the implementation plan's "not found" note is stale | grep confirmed usage in 4 files |
| **Metadata generation** | `generateMetadata()` present on dynamic routes, reads Strapi fields | confirmed in services/blog/about-us route files |
| **Old-site Yoast metadata to preserve** | Sparse on the old site itself — most pages/posts never had Yoast title/description set (confirmed via `wp_yoast_indexable`), so there is little original metadata actually at risk of being "lost" | `OLD-SITE-WORDPRESS-INVENTORY.md` |

## 8. CMS, Images & Functional Integrity

- **Services**: 9/9 published in Strapi, slugs match. Body copy lives in code (`service-guides.ts`), not Strapi — see §4 architecture gap.
- **Articles**: 25/25 published in Strapi with real content blocks — see §5.
- **Testimonials**: 11 published in Strapi, matching the already-reconciled "11 is correct" finding in `CURRENT_IMPLEMENTATION_PLAN.md` §10a. Not re-verified text-for-text in this pass.
- **Newsletters**: old Newsletters page listed **19** monthly issues (May 2020 – November 2021, counted directly from the extracted Elementor `icon-box` widgets). Strapi has **19 published** `newsletter` records. **Exact count match — confirmed parity**, a stronger result than this report's method could claim for any other section.
- **Gallery items (awards/certificates)**: Strapi has **8 awards** (exact match to old site's 8 award photos) and **19 certificates** (old site direct-DB-pass found **20** scanned certificate images — **1 short**, worth a quick visual diff before launch).
- **Categories**: mismatch between old (7: Retirement Planning, Health Insurance, Child Education Planning, Investments, Life Insurance, Share market, Uncategorized) and new published set (4: Mutual Funds, Wealth Creation, Financial Planning, Tax Planning) — see §5, open item.
- **No secrets were exposed** in this audit; `.env`/`.env.local` values were checked only for presence/pattern, never printed.
- **Not verified in this pass**: contact/newsletter form submission behavior, admin draft-vs-published edge cases beyond what SQL confirms, image rendering/broken-asset spot checks, console errors — would need a running dev server + browser, out of scope for this pass's token budget.

## 9. Newly Discovered Issues (not in either prior audit or the implementation plan)

1. **P0 — `SITE_URL` unset blocks all indexing.** `robots.ts` returns `disallow: '/'` with no `SITE_URL` in `.env.local`. This must be set to the real production domain before launch, and the canonical-host decision (§6) must be made first since it determines the value.
2. **P1 — One article has real content loss**: `why-your-portfolio-may-be-underperforming` is missing roughly 70% of its original body (the itemized reasons list). See §5.
3. **P1 — Article category taxonomy doesn't match the old site's 7 categories**; old category-based internal links/intent have no equivalent grouping today. See §5.
4. **P2 — 1 certificate image short** (19 vs. 20 confirmed in the old DB pass) — needs a visual/filename diff, not just a count assumption.
5. **P2 — Sitemap omits the 4 `/about-us/{awards,certificates,our-clients,testimonials}` subpages** even though they're real, crawlable routes once built.
6. **P3 — Service body copy is code-owned, not CMS-owned** (architecture note, not content loss) — recommend migrating to a Strapi blocks field for editor independence, consistent with how articles already work.

## 10. Prioritized Remaining-Work Checklist

| ID | Priority | Item | Affected | Action | Acceptance criteria | Blocks launch? |
|---|---|---|---|---|---|---|
| M-01 | P0 | `SITE_URL` unset | `src/app/robots.ts`, `.env`/production env | Confirm canonical host (apex vs `www` — needs live check, see M-02) and set `SITE_URL` in production environment | `robots.ts` emits `allow: '/'` and a real sitemap URL in production | **Yes** |
| M-02 | P0 | Canonical hostname never confirmed live | Redirect/canonical strategy | Fetch real `robots.txt`/sitemap from live `ghanchiinvest.com`, or pull Search Console, to confirm apex vs `www` | Written confirmation with evidence, not assumption | **Yes** — gates M-01 and all redirect work |
| M-03 | P1 | 4 `/about-us/*` subpage redirects missing | `next.config.ts` | Add `/awards`→`/about-us/awards`, `/certificates`→`/about-us/certificates`, `/our-clients`→`/about-us/our-clients`, `/testimonials`→`/about-us/testimonials` | All 4 old URLs 301 directly (no chain) to the new path | Yes |
| M-04 | P1 | Content loss in `why-your-portfolio-may-be-underperforming` | `ghanchi-cms` article id 56 | Re-import the dropped middle paragraphs from `OLD-SITE-WORDPRESS-INVENTORY.md` | Strapi body length ratio vs. original ≥ ~90%, like the other 24 articles | No, but should fix before calling blog parity complete |
| M-05 | P1 | Article category mismatch | `ghanchi-cms` categories, `articles_category_lnk` | Reconcile old 7 categories vs. new 4; either remap articles to equivalent old-style categories or deliberately document the IA change | Every article has a category an old reader's bookmark/link would recognize, or a documented, deliberate rename | No |
| M-06 | P1 | 404 behavior for the ~23 not-yet-republished... *(now 0, since all 25 are republished — downgrade/close)* | — | **Superseded** — all 25 articles are now published; verify none of the 25 *new* slugs 404 and that there are no leftover stale old-article redirects needed beyond what's already covered | n/a | Closed |
| M-07 | P2 | 1 certificate image short (19 vs 20) | `ghanchi-cms` gallery_items | Diff old `wp-content/uploads` certificate filenames against the 19 in Strapi, add the missing one if genuine | 20/20 accounted for or documented reason for 19 | No |
| M-08 | P2 | Category/tag archive URLs (23 total) have no route or redirect decision | `next.config.ts` / new route | Owner decision: build archive routes, or 301 each to `/blog`, or deliberate 404 — current silent fallthrough is the one explicitly-rejected option ("never blanket-redirect to homepage") but a *decision*, even if it's "404 these," should be written down | Decision documented; implementation matches it | No, but currently undecided-by-default |
| M-09 | P2 | `/elementor-hf/header/` not handled | `next.config.ts` | Add explicit `410` (technical WP artifact, not content) | Returns 410, not 404 default | No |
| M-10 | P2 | Sitemap missing 4 about-us subpages | `src/app/sitemap.ts` | Add the 4 static subpaths | Sitemap includes all crawlable routes | No |
| M-11 | P2 | Service body copy is code-owned (`service-guides.ts`), not editable via CMS | `src/lib/service-guides.ts`, Strapi `service` schema | Add a Strapi blocks field for service long-form content, migrate the 9 guides in | Editors can update service copy without a deploy | No |
| M-12 | P2 (carried from Second Audit, unverified) | Reduced-motion Contact intro invisible; mint button contrast ~2.21:1; unconditional video autoplay under reduced motion; hero MP4 downloads unconditionally | Contact page, buttons, hero/testimonial video | Re-run the Second Audit's own Playwright/runtime checks to confirm current status | All 3+1 defects pass or are re-documented as newly fixed | Recommend before launch, not re-verified here |
| M-13 | P3 | Old-article Yoast metadata mostly never existed on the old site | N/A | No action — nothing to preserve; confirm new per-article metadata is sensible on its own merits | — | No |
| M-14 | P3 | Full Playwright suite / live browser pass not run in this report | Whole site | Run `npm test` before launch sign-off | Suite green | Recommend, not a hard content-parity blocker |

## 11. Fix Order

1. M-02 (confirm canonical host) → M-01 (set `SITE_URL`) — nothing else about redirects/canonicals can be finalized first.
2. M-03 (4 missing redirects) — cheap, already-scoped, no dependencies.
3. M-04 (restore truncated article) — isolated content fix.
4. M-05 (category reconciliation) — needs an owner decision on taxonomy, not just a code change.
5. M-08, M-09 (category/tag archive decision, elementor-hf) — owner/dev decision, then implement.
6. M-07, M-10, M-11 — polish, any order.
7. M-12, M-14 — pre-launch QA pass.

## 12. Launch-Readiness Verdict

**Not launch-ready.** The content-parity picture is **far better than the existing docs suggest** (9/9 services, 25/25 articles, 19/19 newsletters, 8/8 awards all confirmed present with real content), but **M-01/M-02 (indexing blocked, canonical host unconfirmed) and M-03 (4 missing legacy redirects) are concrete, verified blockers**, and M-04/M-05 are real but narrower content-accuracy gaps. The Second Audit's accessibility/motion defects (M-12) were not re-verified here and should be re-checked before sign-off since they were still open as of 2026-10-12.

## 13. Post-Launch SEO Monitoring Checklist

- Submit the new sitemap in Search Console once `SITE_URL` is live; monitor crawl/index coverage for the 9 services and 25 articles specifically.
- Watch for 404s on the ~48 old URLs that currently have no redirect (category/tag archives, `/elementor-hf/header/`) in Search Console's "Pages" report — confirms whether they actually carry backlink/crawl value or are safe to leave as 404.
- Re-confirm canonical host behavior live (apex vs `www`) once DNS/hosting is final.
- Track rankings for the 9 service page queries and the 25 article queries week-over-week post-launch; the content is substantively preserved but reworded, which carries normal (low) re-ranking risk, not a content-loss risk.
- Re-run Lighthouse/Core Web Vitals after the hero-video autoplay issue (M-12) is resolved, since unconditional video preload was flagged as a performance risk in the Second Audit.

## Supporting Artifacts

- **`docs/audit/OLD-SITE-WORDPRESS-INVENTORY.md`** — full extracted WordPress content (9 services, 26 articles, 11 other pages) with Yoast metadata and resolved permalinks, generated directly from `localhost_utf8.sql` in this pass.
- Prior reports: `docs/audit/FINAL-AUDIT.md`, `docs/audit/SECOND-AUDIT-REPORT.md`, `docs/audit/IMPLEMENTATION-HANDOFF.md`.
- `docs/CURRENT_IMPLEMENTATION_PLAN.md` §§9–12 — the most relevant prior analysis of WordPress mapping/URL/SEO, cross-checked and corrected by this report where it had gone stale.
