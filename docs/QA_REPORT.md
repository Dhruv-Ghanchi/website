# Ghanchi Investments — Implementation Status Report

Session date: 2026-09-24/25. Covers execution against `docs/CURRENT_IMPLEMENTATION_PLAN.md`'s 18-phase roadmap, Phases 1-5, 9, 12, 13 (partial), plus incidental bug fixes surfaced along the way.

---

## 1. What's done, and how

### Phase 1 — Architecture stabilization (COMPLETE)
- **`ghanchi-investments`**: committed all previously-uncommitted Strapi-integration work (48 files — every route/component, `src/lib/strapi.ts` added, `src/lib/site-config.ts` removed). Commit `5b8bdc8`.
- **`ghanchi-cms`**: had zero version control. Ran `git init`, verified `.gitignore` already excluded `.env`/`*.sqlite`/`*.sql`, committed all 20 content types/23 components/bootstrap script. Commit `0833f7e`, branch renamed to `main`.
- Verified via `git status --porcelain` diff review that no secrets/database files entered either commit.

### Phase 2 — Template fidelity (COMPLETE, no regressions)
- Re-ran the project's own `navbar-audit.mjs`/`hover-audit.mjs` scripts against live `https://kora.framer.media/` vs. the local implementation.
- Only differences found were the already-approved, intentional Kora→Ghanchi content swaps (no "Book a call"/"Apply Now"/pricing section/"Koraline" placeholder locally — confirms these were correctly removed, not accidentally dropped).
- One script-measurement artifact identified and correctly dismissed (Framer wraps visible link text in a child `<span>`; reading `.color` off the outer `<a>` returns default browser link-blue — not a real design regression).

### Phase 3 — Branding/content (PARTIAL — founder headshot closed)
- `team-member.headshot` for Chandrakant B. Ghanchi was `null` in Strapi (flagged risk in the audit). Viewed `public/assets/ghanchi-founder-headshot.jpg` directly — genuine candid photo of a real person, not AI-generated/stock.
- Uploaded to Strapi Media Library via the `SEED_API_TOKEN`, set alt text, linked to the founder's `team-member` record.
- Verified via API and rendered HTML on `/` and `/about-us` — real photo now renders in place of `placeholder-founder.svg`.
- **Not done**: fresh hardcoded-string sweep (lower priority — a prior pass already found no business-content leftovers, only cosmetic CSS token names).

### Phase 4 — Strapi schema finalization (COMPLETE)
- Added `verificationState` enum (`unreviewed` / `owner-approved`) to `testimonial` and `gallery-item` content types — closes the content-integrity gap the audit flagged (no way to track which testimonials/awards/certificates were owner-approved).
- Backfilled all 38 existing records (11 testimonials + 27 gallery items) to `unreviewed` via a one-off script (`ghanchi-cms/scripts/backfill-verification-state.mjs`).
- Internal editorial field only — intentionally not exposed on the public frontend. Commit `dd1f371`.

### Phase 5 — Strapi security/permissions (CORS done; admin roles not reviewed)
- CORS was running on Strapi framework defaults (unrestricted). Now driven by a `FRONTEND_URLS` env var allowlist (`config/middlewares.ts`), defaulting to local dev ports.
- Verified live: an unknown `Origin` gets no `Access-Control-Allow-Origin` header back; the local frontend origin does. Commit `704a096`.
- **Not done**: admin panel role review (low priority for a single-editor site).

### Phase 9 — SEO + URL migration (PARTIAL — everything decidable without you is done)
- Added `next.config.ts` (didn't exist before) with the 13 unambiguous redirects from the plan's own legacy-URL manifest: 4 About-Us subpage moves (`/awards`, `/certificates`, `/our-clients`, `/testimonials`) + 9 unprefixed legacy service-slug links (`/financial-planning` etc. → `/services/...`). All verified live (308 redirects to the correct destination).
- Verified the 9 service slugs in `next.config.ts` match exactly what's live in Strapi (the plan flagged this as unverified).
- Verified WordPress infrastructure paths (`/wp-admin`, `/wp-json`, `/xmlrpc.php`, `/elementor-hf/header`) and undecided paths (category/tag archives, the ~23 not-yet-republished article slugs) correctly fall through to a plain 404 — not recreated, not redirected to homepage, per the plan's explicit rule.
- Checked the plan's flagged "sitemap uses numeric id instead of slug" concern directly against the running sitemap — **false alarm, no bug**. `Service.id`/`Article.id` are already mapped from `raw.slug` in `strapi.ts` by design.
- Added baseline security headers (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`) in the same `next.config.ts`, since the file didn't exist at all before.
- Added structured data (`application/ld+json`) — previously completely absent:
  - Global `FinancialService` (Organization) + `WebSite` schema in `layout.tsx`, built only from verified `site-setting` facts (name, address, phone, email, social links). **No rating/review data included** — the plan's content-truth rule explicitly forbids fabricating ratings/reviews in structured data, and the existing `ratingValue` field is an unaudited static value, not real aggregate review data.
  - `Article` schema on blog posts.
  - `BreadcrumbList` on the three nested dynamic route types (blog articles, service detail, about-us subpages).
  - Found and fixed a real bug while building this: address lines from Strapi already end in commas, and a naive `.join(', ')` produced doubled commas in the `streetAddress` field. Fixed.
- Tried to resolve the **canonical-hostname question** (apex `ghanchiinvest.com` vs. `www.`) via a live check, as the plan recommended — the real site returns blank content to both `curl` and a full headless-browser fetch (bot-protection), so this is **genuinely unresolved from outside** and was not guessed at.
- **Still open**: canonical hostname (needs your Search Console access or a manual logged-in browser check), category/tag archive routing decision, the 23-article content-migration backlog, and giving `/elementor-hf/header` a proper `410` instead of the current `404` (cosmetic SEO nicety, needs middleware, low priority).

### Phase 12 — Performance (font-loading item checked)
- Manrope is already self-hosted as a local variable `.woff2` with `font-display: swap` — no Google Fonts CDN round-trip. This was the one open question flagged in the plan's third-party audit; it's already correctly implemented, no action needed.

### Phase 13 — Security audit (dependency portion COMPLETE)
- `ghanchi-investments`: `npm audit` → **0 vulnerabilities**.
- `ghanchi-cms`: 24 vulnerabilities (20 moderate, 4 high), all transitive inside `@strapi/strapi@5.55.0`'s own dependency tree (`sharp`, `qs`, `react-router`, `stream-json`). `npm audit fix` applied with zero changes available. The only fix npm offers is `--force`, which would **downgrade Strapi itself to 4.26.2** — a framework downgrade, not a patch. Did not run it. This is normal for a current Strapi 5.x install and will resolve when Strapi ships a patch; tracked as an accepted, upstream-dependent risk, not something introduced this session.

### Incidental: test infrastructure + real bugs found along the way
The project's Playwright suite (`npm test`) was **completely broken** before this session touched it — `tests/pages.spec.ts` used a top-level `await` to prefetch Strapi data, which Playwright's test loader can't run (`require() cannot be used on an ESM graph with top-level await`). This predates my changes; I hadn't touched that file. Fixed by moving the prefetch into a `tests/global-setup.ts` that writes a fixture file, read synchronously at module load instead (`tests/fixture-data.ts` + `playwright.config.ts` wiring).

With the suite runnable again, it caught two real, previously-invisible bugs:
1. **Duplicate mailto link on `/contact-us`**: `faq.tsx`'s "contact" variant re-rendered the same copy-email widget already shown in `contact.tsx`'s own intro block. Removed the duplicate — the FAQ section shows no extra CTA on that page now, since full contact detail is already directly above it.
2. **A test that looked broken was actually hiding a real integration hole**: the "mocked transport" API test globally mocked `fetch()`, which also intercepted the contact route's *internal* call to Strapi (used to validate submitted service IDs). Fixed by scoping the mock to only the webhook transport, passing real Strapi calls through.
3. One test was simply **stale, not the app**: it asserted color theming on a `.brand-mark` glyph inside the contact form that had been deliberately replaced by the real Ghanchi logo image as part of the rebrand (a raster `<img>`, not a colorable SVG — there's nothing to theme-test there anymore). Updated the test to match the correct, intentional design.

**All 39 Playwright tests + `tsc --noEmit` pass as of the last run.**

---

## 2. Full commit history this session

**`ghanchi-investments`** (branch `ghanchi-investments`):
```
2d48561 Fix test-infra breakage and two real bugs it was hiding
81c7591 Add structured data: Organization/FinancialService, WebSite, Article, BreadcrumbList
c3ccf5f Add next.config.ts: legacy-URL redirect table and baseline security headers
5b8bdc8 Integrate Strapi CMS as the live data source across the frontend
```
(plus pre-existing `6490235`, `d4350cf`)

**`ghanchi-cms`** (branch `main`, newly initialized):
```
dd1f371 Add verificationState to testimonial and gallery-item
704a096 Tighten CORS to an explicit frontend-origin allowlist
0833f7e Initial commit: Strapi 5 CMS for Ghanchi Investments
```

Nothing is pushed to any remote — these are local commits only. No remote is currently configured for either repo (not checked/set up this session).

---

## 3. What's left, organized by why it's not done

### A. Genuinely blocked on you (I will not guess/fabricate these)
| Item | What's needed from you |
|---|---|
| Contact/newsletter delivery | Recipient email(s), delivery mechanism (SMTP relay / form service / CRM webhook), retention policy. Forms currently fail closed (503) correctly — no submissions are silently lost, but none reach anyone yet. |
| Legal page text | Final-approved Privacy Policy, Terms of Service, Disclaimer (current versions are drafts, `AGENTS.md` already flags this). |
| Media classification | Which of the 89 files in `public/assets/` are genuine business records (founder photo, awards, certificates — keep as-is) vs. decorative/stock imagery in scope for AI regeneration. Some are already strongly evidenced as genuine (the `dc1c1b_*_mv2` award photos match WordPress media filenames directly), most are unclassified. |
| Canonical hostname | Apex `ghanchiinvest.com` vs `www.ghanchiinvest.com` — live site returns blank content to automated checks (bot protection); needs your Search Console access or a manual logged-in browser check. |
| Category/tag archive pages | Build them as real routes, or redirect into `/blog`? No decision exists. |
| Hosting/infrastructure | Strapi host, production database engine (SQLite is dev-only), media/object storage provider, Next.js hosting (Vercel assumed, not confirmed), Strapi licensing tier if Content History/Review Workflows are wanted. |
| DNS/registrar access | Needed to snapshot current MX/SPF/DKIM/DMARC before any cutover planning — nothing touches DNS until this. |
| Regulatory/registration confirmation | Any current designations, certificate validity status, registration numbers referenced in legal/about copy. |
| Newsletter archive gaps | Correct source URLs for the malformed Nov 2020 / Jun 2020 entries, or confirmation they stay marked unavailable. |
| Awards/certificates transcription | Issuer, date, title, current-validity per item, to replace the current neutral archive captions. |
| WhatsApp click-to-chat widget | Present on the old WordPress site, absent from the new one — keep or intentionally drop? |
| 23-article content backlog | Whether/when to migrate the remaining ~23 legitimate (non-spam) WordPress articles beyond the 2 currently republished. |

### B. Not blocked, just not done yet (I can keep going on these)
- **Accessibility pass** (Phase 11): full keyboard/contrast/screen-reader verification. Partial coverage exists from prior sessions (dropdown/dialog/accordion keyboard behavior spot-verified in the test suite), but no dedicated contrast audit or screen-reader pass has been done against the real (non-Kora-stock) imagery and content.
- **`/elementor-hf/header` → proper 410** instead of the current 404 (cosmetic SEO nicety; needs a small `middleware.ts`).
- **Admin role review** in Strapi (Phase 5 remainder) — low priority, single-editor site.
- **Fresh hardcoded-string sweep** (Phase 3 remainder) — a prior pass found nothing but cosmetic CSS-token names; a fast re-check given everything else that's changed.
- **JS bundle / API-waterfall performance audit** (Phase 12 remainder) — font-loading is confirmed good; bundle size and whether `strapi.ts`'s per-section fetches cause request waterfalls on a single page render haven't been checked.
- **Expanded automated test coverage** for the things this session added (redirect tests, structured-data validity tests) — the manual verification I did (curling each redirect, parsing the JSON-LD) isn't captured as a regression test yet.
- **`npm audit` remediation path for `ghanchi-cms`** — no action possible right now without a Strapi downgrade; revisit when Strapi publishes a 5.x patch.

### C. Structurally deferred by design (not gaps — decisions already made and documented in the plan)
- Preview/draft mode, signed webhook revalidation, Strapi Content History/Releases — deferred, no current need.
- Dynamic-zone/page-builder CMS architecture — deliberately not built; current typed-field model is the safer, correct choice per the plan.

---

## 4. Current running state (as of this report)

- Strapi CMS: running locally on port 1337.
- Next.js dev server: running locally on port 3100.
- Both git repos are clean (no uncommitted changes) as of the last commit in each.
- No deployment, staging, or production environment exists yet for either service.
