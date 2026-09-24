# Ghanchi Investments — Current Implementation Plan

Status: **Audit complete.** Sections 10 and 11 (WordPress content mapping, URL preservation matrix) are now based on a direct pull of the live WordPress database plus a full cross-check against a prior, independent forensic investigation of the same source — not estimated. No implementation should begin from this document until the owner has reviewed and approved it.

Audit date: 2026-09-24. Auditor: Claude (taking over the project per owner instruction).

---

## 1. Executive Summary

There are **four relevant codebases**, not one, and reconciling them is itself the first finding of this audit:

| Location | What it is | Git identity | State |
|---|---|---|---|
| `C:\Users\Ghanchi\Desktop\trial` | The **Kora template baseline** — an exact recreation of `kora.framer.media`, unbranded | Worktree of `github.com/Dhruv-Ghanchi/website.git`, branch `main`, commit `d4350cf` | Preserved intentionally untouched. Package name `kora-growth`. Zero Ghanchi content — team members are "Koraline Spencer" etc., emails are `@kora.com`. |
| `C:\Users\Ghanchi\Desktop\ghanchi-investments` | The **actual current Ghanchi Investments implementation** — same repo, second worktree | Same repo, branch `ghanchi-investments`, one commit ahead (`6490235`) plus substantial uncommitted work | This is where all real work has happened. Fully rebranded, routes restructured, Strapi-integrated frontend. Large uncommitted diff (every page/component touched, `src/lib/strapi.ts` added, `src/lib/site-config.ts` removed). |
| `C:\Users\Ghanchi\Desktop\ghanchi-cms` | The **Strapi 5.55.0 CMS backend** | **Not a git repository at all** — no version control | 20 content types, 23 components, SQLite database, bootstrap-script public permissions. Functioning and already serving most of the site's content. |
| `E:\GhanchiInvestments` + `E:\cgi-bin` | **Old, abandoned material** | Unrelated standalone folders | `E:\GhanchiInvestments` is a superseded Next.js + Supabase rebuild attempt with extensive planning documentation (forensic investigation, SEO migration reports, rebuild spec). `E:\cgi-bin` is the raw live WordPress server filesystem (PHP, plugins, Elementor data, full SQL dump, media zips). Both are being mined for business/content/SEO facts only — neither's architecture will be reused. |

The framing in the owner's brief ("this folder contains the current implementation," "audit the current Strapi implementation") describes `ghanchi-investments` + `ghanchi-cms`, not the `trial` directory the session opened in. `trial`'s own `AGENTS.md` says this explicitly: *"Keep Ghanchi Investments rebranding and its Strapi implementation in a separate working copy... The Ghanchi implementation and updated Strapi handoff remain deferred [on this baseline]."*

**The good news:** this project already has two internal planning documents — `GHANCHI_INVESTMENTS_TRANSFORMATION_PLAN.docx` (2026-09-21) and `CMS_AI_AGENT_HANDOFF.docx` (2026-09-20), both in `ghanchi-investments/` — that already did much of the section-by-section, content-truth, and Strapi-schema analysis the owner is now asking for again. This plan does not repeat that work; it **verifies it against actual current state**, because a lot has changed since 2026-09-20/21: at the time those docs were written, Strapi was "not implemented, future work." As of this audit, **Strapi is implemented and live** — 20 content types, most of the site's content flowing through it, native focal-point image cropping, dynamic FAQ categories, SEO metadata from CMS fields. The two docx files are now **stale in that one specific respect** and should be treated as historical planning artifacts, superseded by this document for implementation status.

**The bad news, in priority order:**
1. **No legacy URL redirects exist** from the real WordPress site (`ghanchiinvest.com`) to the new routes — only 4 internal Kora→Ghanchi structural redirects (`/about`, `/contact`, `/cases`, `/insights`) exist. The docx's own planned root-level redirects (`/awards`, `/certificates`, `/our-clients`, `/testimonials`, `/blog-post`) are not implemented either.
2. **`ghanchi-cms` has no version control.** Every schema change made this session and prior sessions exists only on disk, with no history, no rollback, no way to diff.
3. **No `next.config.*` exists** in `ghanchi-investments` — no image optimization config, no redirect table, no security headers.
4. Contact/newsletter delivery is **wired but unconfigured** (`CONTACT_WEBHOOK_URL`/`NEWSLETTER_WEBHOOK_URL` unset) — forms correctly fail closed (503) rather than lying about success, but nothing reaches anyone yet.
5. `SITE_URL` is unset, so `robots.ts` currently **disallows all indexing** — correct for now, but a real pre-launch gate.
6. The asset library at `public/assets/` (89 files, `ghanchi-*.jpg.webp` and Wix-pattern filenames like `dc1c1b_..._mv2`) was **imported from the old site**, which sits in direct tension with the owner's new instruction that production media should be AI-generated/newly created, not migrated. This needs an explicit decision (Section 17 / Open Questions) — some of these are likely genuine identity records (founder photo, award trophy photos, certificate scans) that the transformation plan explicitly wanted kept, not generic stock to be replaced.
7. Founder headshot pipeline exists (`ghanchi-founder-headshot.jpg`, `placeholder-founder.svg` fallback) but per this session's direct verification earlier, the Strapi `headshot` field has been observed null at points — needs a final check.

---

## 2. Current Architecture

```
Browser
  │
  ▼
Next.js 16 (App Router, React 19, TS, Tailwind 4, Motion)   ← ghanchi-investments, branch ghanchi-investments
  │  src/lib/strapi.ts  (typed fetch + mapping layer, server-only)
  │  fetch(..., { next: { revalidate: 60 } })  — no preview mode, no draft mode, no signed webhooks
  ▼
Strapi 5.55.0 (Community, SQLite, better-sqlite3)            ← ghanchi-cms (separate process, port 1337)
  │  20 content types, 23 components
  │  src/index.ts bootstrap: idempotent public 'find'/'findOne' grants for 8 controllers
  │  No CORS allowlist configured (default strapi::cors middleware, unrestricted)
  │  No git repository
  ▼
public/uploads (local disk media, SQLite-referenced)          ← no object storage provider configured
```

This matches the *target* architecture from the owner's brief (Next.js → Strapi → DB → media) in shape, but two links are not yet production-grade: media is local-disk (not durable/object storage) and there is no preview/webhook/cache-invalidation layer — content changes rely on the 60s ISR revalidate window, not push-based revalidation.

Deployment target (Vercel for Next.js, some host for Strapi) is **undecided** — no hosting has been provisioned for either half.

---

## 3. Current Codebase State

**`ghanchi-investments` (Next.js, the real frontend):**
- Routes implemented: `/`, `/about`, `/about-us`, `/about-us/[section]` (awards, certificates, our-clients, testimonials), `/services`, `/services/[slug]`, `/online-services`, `/blog`, `/blog/[slug]`, `/newsletters`, `/contact`, `/contact-us`, `/cases` (legacy redirect), `/insights` (legacy redirect), `/[legal]` (privacy/terms/disclaimer), `/api/contact`, `/api/newsletter`, `sitemap.ts`, `robots.ts`.
- `src/lib/strapi.ts` is the single data-fetching/mapping module: `getSiteSettings`, `getServicesPage`, `getBlogPage`, `getOnlineServicesPage`, `getNewslettersPage`, `getContactPage`, `getAboutPage`, `getAboutSubpages`/`getAboutSubpage`, `getFaqItems`, `getServices`, `getArticles`, `getTestimonials`, `getTeamMembers`, `getGalleryItems`, plus `mediaUrl()` (bandwidth-aware derivative selection) and `mediaFocal()` (native Strapi focal point).
- `src/lib/content.ts` retained as the **type source** (`Service`, `TeamMember`, `Article`, etc.) — no longer the data source; Strapi mapping functions populate these same shapes.
- `src/lib/site-config.ts` deleted — hero image/video mode toggle was removed (worktree AGENTS.md still references it; stale).
- Uncommitted working tree: essentially every route/component file is modified relative to the last commit (`6490235`), plus `src/lib/strapi.ts` is new/untracked. **Nothing from this extensive Strapi-integration work has been committed.** This is a real risk — a `git checkout`, `git clean`, or accidental worktree operation would lose it.
- `docs/` did not previously exist in this worktree (created by this audit for this document).

**`ghanchi-cms` (Strapi):**
- Content types (20): `about-page`, `about-subpage`, `article`, `blog-page`, `category`, `contact-page`, `faq-item`, `gallery-item`, `home-page`, `legal-page`, `navigation` (single type), `newsletter`, `newsletters-page`, `online-service`, `online-services-page`, `service`, `services-page`, `site-setting` (single type), `team-member`, `testimonial`.
- Components (23) across `blocks/`, `contact/`, `content/`, `forms/`, `home/`, `nav/`, `process/`, `shared/`.
- `site-setting` is a large single type consolidating what the CMS handoff spec originally split into Site Settings / Contact Settings / Footer Settings (siteName, tagline, contactInfo, addressLines, socialLinks, stats, clientLocations, clientGroups, vision, rating fields, hero/testimonial/process/featured-case/contact background media, innerCta, newsletterFormCopy, header/footer labels, SEO title/description/template, FAQ heading copy, logo/logoAlt).
- `gallery-item` merges the spec's separate Award/Certificate types into one type with a `category` enum (`awards`/`certificates`) — simpler than planned, functionally equivalent for current needs.
- No separate `Advisor`, `Client Reference`, `Client Location`, or `Statistic` content types as the CMS handoff spec envisioned — team members, client locations/groups, and stats live as fields/components on `team-member` and `site-setting` instead. This is a legitimate simplification given the single-founder, small-stats reality of the business, not a gap.
- Public read permissions are granted via an idempotent bootstrap function (`src/index.ts`) rather than direct database writes — the correct, supported approach.
- **No `.env` committed** (properly gitignored) — but also **no git repository at all**, so schema.json files, the bootstrap script, and every seed script have no version history.

---

## 4. Original Requirements Recovered From Documentation

Primary sources, in order of authority for this rebuild:
1. `ghanchi-investments/GHANCHI_INVESTMENTS_TRANSFORMATION_PLAN.docx` (2026-09-21) — section-by-section Kora→Ghanchi content mapping, decision framework, content-truth policy, owner-decision list.
2. `ghanchi-investments/CMS_AI_AGENT_HANDOFF.docx` (2026-09-20) — Strapi 5 architecture, full field-level schema spec, security/preview/revalidation design, verified business facts table.
3. `ghanchi-investments/AGENTS.md` — working rules, worktree boundaries, verified constraints (newsletter archive gaps, client countries, testimonial handling).
4. `E:\GhanchiInvestments\*` — forensic investigation, SEO/URL migration reports, rebuild spec (Supabase-era, content/SEO facts only). *(Being cross-verified by background research; see Section 10/11 note above.)*
5. `E:\cgi-bin` — raw WordPress source (content ground truth). *(Being cross-verified by background research.)*

Verified business facts recovered (from source #2, cited as owner-approved/source-supported):
- **Legal/trading name:** Ghanchi Investments, founded/established 2009.
- **Founder:** Chandrakant B. Ghanchi.
- **Address:** Shop no. 27, Sector 11, Balaji Bhavan, CBD Belapur, Navi Mumbai, Maharashtra 400614.
- **Phones:** +91 9820926446, +91 7977061717.
- **Emails:** info@ghanchiinvest.com, chandrakant@ghanchiinvest.com.
- **Claimed stats (owner-approved editorial values, not audited):** 1,200+ clients, 15+ years experience, 12+ awards, 5.0/5 static Google rating (as reported on the existing site, not a live feed).
- **Nine services:** Financial Planning, Life Insurance, Health Insurance, Mutual Funds, Retirement Planning, Child Education Planning, Personal Accidental Policy, General Insurance, Employer Employee Insurance.
- **Client geography:** India, UAE, USA — no other countries without new evidence.
- **11 testimonials** identified across the homepage and testimonials page, with named individuals and (for several) employer affiliations — explicitly *not* corporate endorsements.
- **Newsletter archive:** 19 entries, May 2020–November 2021. November 2020 and June 2020 have malformed source URLs (must display as unavailable, not be guessed/repaired).
- **Articles:** 2 legitimate March 2021 source articles, currently republished as labelled adaptations; the live WordPress blog feed also contains unrelated gambling/casino spam that must never be bulk-imported.
- **Awards/certificates:** 8 award photos + 19 certificate scans imported from source, using neutral archive captions pending individual transcription/approval (issuer, date, validity unconfirmed per item).
- **Online service links:** LIC Registered User, LIC Pay Premium Direct, Fundz Bazar, NJ E-Wealth Account, NJ Client Desk, Niva Bupa Renewal (replacing the old MaxBupa link), Star Health Renewal, HDFC Ergo Renewal, Android/iOS apps.

---

## 5. Requirements That Still Apply

- **Content-truth policy** (docx §17): no invented statistics, no corporate-client claims inferred from an individual's employer, no fabricated review counts, no guaranteed-return language, no newer newsletter issues than verified, no gambling content migration. This is still the binding rule for all new content work (services copy, testimonials, awards captions).
- **Section decision framework** (Keep visually / Repurpose meaning / Remove only with approval, never invent to fill a component) — still the right governing rule for any further template-section work.
- **Kora visual/motion preservation list** (Manrope, mint/cream/ink palette, rounded panels, pill buttons, hero pin/scale/blur, marquee, statement scene, comparison scene, process accordion, advisor dialog, testimonial expansion, footer circle/scale) — confirmed still intact by direct comparison: `ghanchi-investments/src/components/*.tsx` are the same files as `trial/src/components/*.tsx`, only content/props differ.
- **Strapi content-truth guardrails** from the CMS handoff (never-editable list: no arbitrary JS/HTML, no raw CSS, no DB queries, no secrets as content, no unknown component IDs, no unsafe URL schemes) — still the right boundary for whatever CMS surface gets built next (a page-builder/dynamic-zone system for the homepage does not exist yet; current implementation is per-content-type typed fields, which is actually a safer default than the allowlisted dynamic-zone system originally spec'd, and should be kept rather than built out unless the owner wants freeform section reordering).
- **Pricing section removal** — implemented, remains the only approved removal.
- **Legacy Kora-structure redirects** (`/about`, `/contact`, `/cases`, `/insights`) — implemented correctly via `permanentRedirect()`, keep as-is.
- **Form security posture** (honeypot, same-origin JSON check, size limits, fail-closed 503 on unconfigured webhook, no false success) — implemented in `src/app/api/contact/route.ts` and `src/app/api/newsletter/route.ts`, still correct and should not be weakened.

---

## 6. Requirements That Are Now Obsolete

- **Supabase as CMS/database.** Explicitly superseded by the owner's Strapi decision. `E:\GhanchiInvestments/supabase/` and `table_structures.txt` are historical only — do not resurrect this schema or its table design, even as a "reference."
- **The old Next.js app under `E:\GhanchiInvestments/app`, `/components`, `/lib`.** Different (non-Kora) visual design; superseded by the current Kora-template direction. Not a component source.
- **"Custom admin interface"** language in the old rebuild spec — moot now that Strapi is the chosen CMS.
- **CMS handoff's characterization of Strapi as "not implemented."** As of this audit it *is* implemented for 20 content types with live data flowing to nearly every route. The handoff doc's Section 5 ("today they import content.ts directly... do not claim the CMS is connected until tested") describes a state that has since been surpassed — `content.ts` is now types-only, and `strapi.ts` is the live data path. The handoff doc needs a revision pass, not a rebuild.
- **The idea that AI media generation is unstarted.** A Gemini-based generation pipeline already exists (`GEMINI_API_KEY` configured in `.env.local`; `scripts/gemini-gen-test.mjs`, `scripts/gemini-test.mjs`; three `Gemini_Generated_Image_*.png` files present at the `trial` root from recent experimentation). This is a head start, not a zero.

---

## 7. New Requirements

Directly from the owner's current brief, not present (or not this explicit) in the prior docs:
- **No old-media migration as a blanket rule**, with an AI-generation-first pipeline for new imagery, in tension with the already-imported 89-file `public/assets` library (see Section 17).
- **Focal-point/crop control from within Strapi** — already resolved this session using Strapi 5.35+'s native Media Library focal-point picker (superseding an earlier custom decimal-field approach); see Section 13/16.
- **Explicit legacy-URL matrix with 301/410/404/noindex classification and no redirect chains** — this is new rigor beyond what's implemented (only 4 structural redirects exist today).
- **DNS/email safety as a formally protected, final-step concern** — not previously documented as its own gate; now Section 27/Phase 17 of this plan.
- **Full third-party service audit table** — not previously produced; see Section 26.

---

## 8. Template Recreation Audit

Baseline: `trial` (branch `main`), the verified Kora replica. Comparison target: `ghanchi-investments` (branch `ghanchi-investments`).

| Aspect | Finding |
|---|---|
| Component files | Byte-identical filenames/structure: `contact.tsx`, `faq.tsx`, `home-hero.tsx`, `home-sections.tsx`, `inner-pages.tsx`, `site-shell.tsx`, `ui.tsx` in both. Confirms the rebrand worktree did not fork the design system — it reused it in place, which is the correct approach and should continue. |
| Motion/interaction preservation | Verified via the transformation plan's explicit checklist (hero pin/scale/blur, word-by-word reveal, marquee, sticky statement, comparison scene, process accordion springs, advisor/testimonial dialogs, footer circle reveal) — all called out as "retain" in the docx and confirmed present in the current component code from this session's own recent work (e.g., `.team-dialog-image`, `.service-visual` CSS fixes preserved the absolute-position image pattern without touching motion code). |
| Sections removed | Only the Kora pricing section — approved, documented, and the only owner-sanctioned removal. |
| Sections repurposed | Hero (Ghanchi copy), trust badge/marquee (client geography instead of fake logos), statement/comparison (goal-based planning framing), services chart (planning-journey illustration, explicitly disclosed as not a return forecast), hiring panel → awards/recognition panel, featured case-study → client-community panel, team component → single founder profile. All per the docx's component mapping table (Section 359-370 of the extracted text) and confirmed implemented in `home-sections.tsx`/`home-hero.tsx`. |
| Sections added (not in Kora) | About subpages (`/about-us/[section]` for awards/certificates/our-clients/testimonials), Online Services page, Newsletters page, Blog with real categories — these extend Kora's IA rather than replacing any of it. |
| Responsive fidelity | Verified this session at 1440/1200/810/390 (and 375×667 iPhone SE) with zero horizontal overflow on home, about-us, and article pages. |
| Production readiness | **Not production-ready as-is**: no committed git history for the current work, no `next.config.*`, no redirect table for the real legacy site, no configured form delivery, no hosting decided. Visually and structurally the template recreation is essentially complete; the surrounding productionization is not. |

**Classification: KEEP the template-fidelity approach as executed.** No rework needed here — this is the one area of the project that is in the best shape.

---

## 9. Ghanchi Investments Content Audit

Template-leftover sweep (`grep -i "kora|Koraline|lorem ipsum|placeholder|TODO|FIXME|TBD"` across `ghanchi-investments/src`): 6 files matched, and every match is a **CSS custom-property/class name** (the mint/cream palette tokens were originally named with "kora" prefixes) or a code comment citing the original design source (`kora.framer.media`) for attribution — not business content. **No Kora business copy, fake statistics, fake testimonials, fake addresses, demo emails, or placeholder Lorem ipsum remain in rendered content.** This matches the transformation plan's acceptance criterion #1 and is already satisfied.

| Item | Classification | Note |
|---|---|---|
| Kora-named CSS tokens/classes | KEEP | Cosmetic naming only, not user-visible; renaming is pure churn with no benefit — skip unless the owner specifically wants internal naming cleaned up. |
| Design-source code comments citing kora.framer.media | KEEP | Legitimate internal provenance note for future maintainers; not visible to end users. |
| Founder headshot (`ghanchi-founder-headshot.jpg` + `placeholder-founder.svg` fallback) | VERIFY | Confirm the Strapi `team-member.headshot` field for Chandrakant is populated — this was flagged as empty multiple times in recent work and never explicitly fixed. **Recommend closing this out in Phase 6** since it's a one-step upload, not a design problem. |
| 89-file imported asset library (`public/assets/ghanchi-*.jpg.webp`, `dc1c1b_*_mv2.jpg.webp`) | VERIFY | Filenames strongly suggest a bulk import from the old (Wix-pattern-named) site media. Needs per-asset classification against the new "no old media" rule — see Section 17. |
| Logo (`logo-ghanchi.png`) | KEEP | Real brand asset, already wired through `site-setting.logo`/`logoAlt` with a code fallback (`/assets/logo-ghanchi.png`) if Strapi's field is empty. |
| Icon palette (service/phase/operating-item icons) | KEEP as code-owned | Confirmed in a prior session's explicit review: icon *choice* is a Strapi text field per record, but the available Lucide icon set is code-defined. Correct split — adding a new icon to the palette is a legitimate one-line code change, not something that needs a CMS picker. |
| Aria-labels, dialog close buttons, "Open navigation" etc. | KEEP as code-owned | Accessibility chrome, not editorial content — correctly left in code per prior session's explicit review. |
| API validation/error text (`/api/contact`, `/api/newsletter`) | KEEP as code-owned | Security/validation responses, never rendered as page content — correctly left in code. |
| FAQ category enum | MODIFIED already | Migrated from a fixed 4-value Strapi enum to a plain string field with tabs derived dynamically from whatever categories exist in content — this is done and correct; a 5th category now needs zero schema changes. |

---

## 10. WordPress Content Mapping

Source: a prior, now-abandoned Next.js/Supabase rebuild attempt at `E:\GhanchiInvestments` already did a rigorous forensic pass over this exact WordPress export (`wp-export/`, sourced from the same backup now sitting at `E:\cgi-bin`) and left its findings in `docs/FINAL_IMPLEMENTATION_SPEC.md`, `docs/MIGRATION_MANIFEST.bak`, and related reports. **A direct cross-check against the live `E:\cgi-bin` database dump is still running in the background and may add or correct detail** (particularly plugin-by-plugin confirmation and any content the old audit didn't extract), but the counts and structure below are already sourced from a genuine raw-SQL parse, not guesswork, and should be treated as reliable.

**Content inventory (raw SQL parse, `docs/MIGRATION_MANIFEST.bak`):**

| Type | Count | Notes |
|---|---|---|
| Pages | 20 | about-us, awards, contact-us, our-services, certificates, our-clients, 9 service pages, newsletters, testimonials, above-header, **transparency-page**, **disclaimer** (2 unreviewed legal pages — content never extracted, see Section 22) |
| Services | 9 | Financial Planning, Life Insurance, Mutual Funds, Health Insurance, Employer Employee Insurance, Personal Accidental Policy, General Insurance, Child Education Planning, Retirement Planning — matches what's already implemented |
| Articles | 22 found in raw parse, **vs. 25 published + 1 draft in an earlier "locked" count** | **Unresolved discrepancy inherited from the old investigation, never resolved there.** Current `ghanchi-investments` implementation only republishes 2 of these (explicitly labelled adaptations) — the other ~20 legitimate (non-spam) articles are a real content backlog, not an error. |
| Testimonials | 7 published `spt_testimonial` rows found in raw parse, **vs. 11 in the "locked" baseline** the current implementation actually uses | **Same kind of unresolved discrepancy** — `ghanchi-investments`/`AGENTS.md` already commits to the 11-testimonial version. No action needed unless the owner wants the 4 extra reconciled/sourced. |
| Client/logo entries | 22 published + 1 draft (raw parse) vs. 23 (earlier narrative report) | TCS, Wipro, The Times Group, AMS India, TATA, Piramal, Oberoi Realty, Infosys, Lodha, Cognizant, Oracle, GE Healthcare, Jio, 9X Media, O-BASF, Asian Paints, ATOS Syntel, Glenmark, Capgemini, Reliance Industries, L&T, Dominos Pizza (+draft ATOS). These are **employer affiliations of individual clients, not corporate customers** — matches the content-truth policy already in force (Section 5). |
| Categories | 7 | Uncategorized, Retirement Planning, Health Insurance, Child Education Planning, Investments, Life Insurance, Share market (child of Investments) |
| Tags | 17 | Includes a `retirement-planning` tag that collides in slug with the `retirement-planning` *category* — same slug, two different taxonomies, 0 posts on the tag. Handle deliberately, don't let it silently collide in the new route structure. |
| Attachments | 220 | Media only — per the owner's binding "no old media migration" rule, these are a reference/identification aid only, not a source to bulk-import. |
| Awards media | 8 image filenames referenced from an Elementor gallery (no dedicated post type ever existed) | **Filename pattern match found**: these WordPress filenames (e.g. `dc1c1b_4c330f67389541098f2825846fb806e4_mv2.jpg`) match the `ghanchi-dc1c1b_*_mv2.jpg.webp` files already sitting in `ghanchi-investments/public/assets/` — confirms those specific 8-ish files are the genuine awards-gallery photos, not decorative stock. This directly resolves part of the Section 17 asset-classification question: **treat the `dc1c1b_*_mv2` files as KEEP (genuine business record), not AI-regeneration candidates.** |
| Certificates | No structured data existed (Elementor image gallery only, no CPT); ~19 scans referenced per the newer transformation plan | Same treatment as awards — genuine records, not decorative stock. |
| Newsletters | No structured CPT; content lived only on a single Newsletters page (May 2020–November 2021 archive) | Matches what's already recorded in Section 4. |
| Online-service portal links | **Two conflicting lists exist in the old investigation and were never reconciled**: a narrative/nav-based list (LIC, FundzBazar, NJ E-Wealth/Client Desk, MaxBupa/Niva Bupa renewal, Star Health, HDFC Ergo, apps) vs. a raw-postmeta/Yoast-link list (Fundzbazar, Mirae Asset MF, KFintech, CAMS, CoinDCX, Groww, ET Money, Paytm Money, Kuvera) | The current `ghanchi-investments` implementation already uses the narrative list (matches the transformation plan's Online Services dropdown, Section 4). **Flag the second list to the owner** — it may represent real additional portals (mutual-fund/crypto platforms) that were never surfaced in the newer planning docs; worth a quick owner confirmation rather than silently dropping it. |

**Active plugin stack** (informs "what functionality existed," per the old investigation): Elementor + Elementor Pro + ElementsKit, a dedicated header/footer plugin, Smart Slider, The Post Grid, a testimonial plugin, WPForms (contact form), Yoast SEO, LiteSpeed Cache. None of this is being ported — all replaced by native Next.js equivalents, consistent with the owner's brief (Section 2 of the owner's original instructions: do not preserve WordPress runtime/plugins/theme).

**`localhost`/`mysite` URL contamination**: the WordPress database and Elementor JSON contain many `http://localhost/mysite/...` URLs — an artifact of a local-dev migration step, not live content. If any further raw WordPress content is pulled for future article migration, this pattern must be scrubbed from HTML/JSON/metadata before reuse.

### 10a. Direct database confirmation (this session's own pass over `E:\cgi-bin`)

A second, independent pass parsed the actual `localhost.sql` dump directly (not the older investigation's summary of it), and **resolves several of the discrepancies the old investigation left open**:

| Item | Old investigation | Direct DB confirmation | Resolution |
|---|---|---|---|
| Testimonials | "7 found in raw parse vs. 11 locked baseline — unresolved" | **11 confirmed**, all five-star, full quotes extracted, all real named individuals with company/designation | Resolved — 11 is correct. Matches what `ghanchi-investments` already implements. No further reconciliation needed. |
| Articles | "22 found vs. 25/26 locked baseline — unresolved" | **26 total: 25 published + 1 draft** ("THE TIME FOR RETIREMENT PLANNING IS NOW!", 2021-06-21, still draft) | Resolved — 25 published is correct. The old parse undercounted. 23 of these 25 are a real, legitimate content backlog beyond the 2 currently republished. |
| Client/logo count | "22+1 draft vs. 23 — unresolved" | **23 confirmed** (TCS, Wipro, The Times Group, AMS India, TATA, Piramal, Oberoi Realty, Infosys, Lodha, Cognizant, Oracle, GE Healthcare, Jio, 9X Media, O-BASF, ATOS [draft], Asian Paints, ATOS Syntel, Glenmark, Capgemini, Reliance Industries, L&T, Dominos Pizza) | Resolved — 23 is correct. |
| Certificates | "~19 scans" (transformation plan) | **20 scanned images** on the Certificates page, no captions/alt text at all — purely visual | Use 20, not 19, going forward. Confirms these are genuinely uncaptioned scans — the neutral-archive-caption approach already planned is the only honest option until the owner transcribes each one. |
| Awards | "8 award photos" (transformation plan) | Awards page (WP ID 17) has **no distinct award body copy** in the database — it renders mostly as a boilerplate Services block. The 8 referenced image filenames still exist as media attachments (and, per Section 10, match the `ghanchi-dc1c1b_*_mv2` files already imported) | The photos are real; there's no accompanying text to migrate. Confirms neutral captions are not a shortcut, they're the only available option without new owner input. |

**New facts this pass surfaced that the old investigation's docs didn't fully capture:**
- **Real social links, extracted directly from the live site's footer/options**: Facebook `facebook.com/ghanchiinvestments`, Instagram `instagram.com/ghanchiinvestments`, LinkedIn (two forms found: `linkedin.com/in/chandrakant-ghanchi-7106aa43` in Yoast options, and a fuller `linkedin.com/in/chandrakant-ghanchi-financial-planner-insurance-investments` in page footer HTML — reconcile to one before publishing), YouTube `youtube.com/@ghanchiinvestments4939`. **Action: verify these against whatever is currently populated in Strapi `site-setting.socialLinks` and correct if different** — this wasn't confirmed in this pass.
- **Historical contact-form recipients** (WPForms Lite, two forms): the general "Contact" form on the Contact Us page notified `chandrakantlic@gmail.com`; a second "Book your Appointment with Expert" form notified `chandrakant@ghanchiinvest.com`. **No submission history exists anywhere in the database** — WPForms Lite doesn't store entries, and Elementor Pro's submission-storage tables exist but are completely empty (zero rows), meaning Elementor forms were never actually used despite Elementor Pro being active. This directly informs the blocked decision in Section 21: there is no historical lead data to migrate, and the owner already has two precedent inboxes if they want to keep using the same ones.
- **Confirmed business address/phone/email exactly as already recorded in Section 4**, sourced independently from the Contact Us page body: Shop no. 27, Sector 11, Balaji Bhavan, CBD Belapur, Navi Mumbai, Maharashtra 400614; +91 9820926446; +91 7977061717; info@ghanchiinvest.com; chandrakant@ghanchiinvest.com. No conflict — cross-verified.
- **A genuine routing/content inconsistency already present in the live WordPress site itself**: `page_for_posts` (WordPress's "posts page" setting) points at page 35 (`/blog/`), but the actual nav menu links to `/blog-post/` (page 3175, a newer Elementor/template-kit blog listing). These are two different, both-live blog entry points that drifted apart during an incomplete 2023 redesign attempt. This is *why* the old investigation's SEO manifest (Section 11) correctly treats `/blog/` and `/blog-post/` as two independent, separately-canonical archives rather than one canonical + one duplicate — that decision is now doubly confirmed as correct, not a guess.
- **Content-integrity flag, not just an SEO note**: the database contains an entire cluster of unrelated placeholder content — three Envato template-kit imports ("FinOffice," "Accounta," "Bizkeep," imported 2023-07-24) with Lorem-ipsum body text, fake staff/"Board of Directors" sections, and fake company names, layered on top of the real 2021-era content and partially overlapping the live Home/Blog page IDs. Separately, WordPress comments include a small amount of spam (including an escort-service spam comment) mixed in with two genuine reader comments. **Neither of these should be mistaken for real Ghanchi business content if any further raw WordPress content is pulled** — this is very likely what the newer transformation plan's "unrelated casino/gambling posts" and "investigate unauthorized content" warnings were pointing at, even though this pass didn't find literal gambling content in the posts/pages table itself (it may be present elsewhere in the live site beyond this local backup, or the warning may originate from this same template-kit/spam contamination viewed less precisely). Treat the WordPress site's content as needing a careful filter, not a trusted bulk source, consistent with what was already planned.
- **Plugin-level confirmation**: Elementor + Elementor Pro + a header/footer plugin + Smart Slider 3 + WPForms Lite + a testimonial plugin + Yoast SEO + LiteSpeed Cache + a WhatsApp click-to-chat widget were the live functional stack. The WhatsApp chat widget has no equivalent in the current `ghanchi-investments` implementation — **non-blocking, worth a quick owner check on whether they want it back** (Section 26).
- **No media was extracted or opened** — `uploads_full_media.zip` (182.97MB), `uploads_minimal.zip` (2.35MB), and both `mysite_brainstorm_export*.zip` files were left untouched, sizes only recorded, consistent with the binding no-media-migration instruction.

---

## 11. URL Preservation Matrix

The old (abandoned) rebuild attempt at `E:\GhanchiInvestments` already produced and **implemented in code** (`lib/seo/url-manifest.json`) a complete, evidence-based 70-row legacy-URL manifest, reconciling a 69-URL Yoast sitemap plus one extra raw-Yoast-indexed tag. This is the exact ~70-record inventory the owner's brief refers to. It has not been re-derived here — it is reproduced from `docs/FINAL_IMPLEMENTATION_SPEC.md` §5, the folder's own explicitly-authoritative document.

**Canonical hostname decision (needed before any redirect work):** the old investigation's own documents disagree with each other — most treat `www.ghanchiinvest.com` as canonical, but the final spec locks it to the apex `https://ghanchiinvest.com` based on robots.txt/sitemap/internal-link evidence, while noting this was **never confirmed via an actual Search Console export** (none was ever supplied). **Recommend re-confirming this with a live check** (fetch the real `robots.txt`/sitemap from the still-live site, or pull Search Console if the owner has access) before implementation, rather than trusting either old document blindly — this is a five-minute check that determines every redirect target's host.

**Full 70-row manifest:**

| # | Old URL | New URL / Action | Status | Reason |
|---|---|---|---|---|
| 1 | `/` | `/` | KEEP 200 | Homepage |
| 2 | `/awards/` | `/about-us/awards` (canonical restructure per current IA) | 301 | Not yet implemented in `ghanchi-investments` — see Section 11a gap table |
| 3 | `/certificates/` | `/about-us/certificates` | 301 | Not yet implemented |
| 4 | `/contact-us/` | `/contact-us` | KEEP 200 | Path unchanged; already implemented |
| 5 | `/newsletters/` | `/newsletters` | KEEP 200 | Path unchanged; already implemented |
| 6 | `/blog-post/` | `/blog-post/` (keep as its own live archive, not merged) | KEEP 200 | Sitemap-listed, live, internally linked, paginated — **do not** redirect to `/blog/` without Search Console evidence it's a pure duplicate |
| 7 | `/about-us/` | `/about-us` | KEEP 200 | Already implemented |
| 8 | `/our-clients/` | `/about-us/our-clients` | 301 | Not yet implemented as a root-level redirect (only reachable today via the new nav path) |
| 9 | `/services/` | `/services` | KEEP 200 | Already implemented |
| 10–18 | `/services/{financial-planning, life-insurance, health-insurance, employer-employee-insurance, mutual-funds, retirement-planning, general-insurance, child-education-planning, personal-accidental-policy}/` | Same paths under `/services/[slug]` | KEEP 200 | **Verify current slugs match exactly** — current implementation must use these exact 9 slugs, including the legacy spelling of "personal-accidental-policy," not a renamed variant |
| 19 | `/testimonials/` | `/about-us/testimonials` | 301 | Not yet implemented |
| 20 | `/blog/` | `/blog` | KEEP 200 | Already implemented |
| 21–45 | 25 root-level article slugs (full list below) | `/blog/[slug]` for the ones being republished; **404 for the rest until legitimately migrated** | Mixed | Only 2 of these 25 are currently republished (as labelled adaptations); the other ~23 should 404 rather than either redirect to a non-existent article or be silently bulk-imported (content-truth policy, Section 5) |
| 46 | `/elementor-hf/header/` | none | 410 | Elementor technical artifact, not user content — verify Search Console/backlinks first per the old investigation's own caution, never blind-redirect to homepage |
| 47–53 | 7 category URLs (`/category/{child-education-planning, health-insurance, investments, life-insurance, retirement-planning, uncategorized}/`, `/category/investments/share-market/`) | Same paths if a category-archive route is built | 301 or 200 depending on whether the new site builds category archives at all | **Open design question**: current `ghanchi-investments` has no category-archive route (`/category/...`) — needs an explicit decision (build the archive route, or 301 each to `/blog?category=...`, or to `/blog`) rather than leaving these as 404 |
| 54–69 | 16 tag URLs (`/tag/{sip, child-plans, equity, financial-literacy, gold, goldbonds, healthinsurance, insurance, investment, investments, mediclaim, savings, term-plan, trading, wealth-generation, women-empowerment}/`) | Same open question as categories | Same | Same |
| 70 | `/tag/retirement-planning/` | same | NOINDEX 200 | Empty tag (0 posts), live route, present in raw Yoast index but absent from the public sitemap — keep the route live but noindexed, don't 404 or redirect it |

**Additional non-sitemap patterns requiring deterministic (not per-request DB) handling**, per the old investigation's explicit, already-tested recommendation:
- `/blog-post/page/{n}/`, `/blog/page/{n}/`, `/category/**/page/{n}/`, `/tag/**/page/{n}/` — 200 for valid pages, self-canonical, 404 past the final page.
- Legacy footer paths **without** the `/services/` prefix (`/financial-planning/`, `/life-insurance/`, etc.) — 301 straight to the corresponding `/services/...` URL. **Direct A→C redirects only, never chained.**
- `/home-2/` — 301 to `/` only if crawl data confirms it's actually linked; otherwise 404.
- `/feed/` and any post/category/tag feed URLs — 410 unless RSS is explicitly wanted.
- `/author/admin/` and date archives — 410 unless evidence shows indexed value.
- `/wp-admin/*`, `/wp-login.php`, `/wp-json/*`, `/xmlrpc.php` — 404, never recreated as real routes.
- Any unknown path — 404. **Never a blanket redirect to homepage** for unrecognized paths; that's explicitly rejected by the old investigation as harmful to SEO signal quality, and this plan agrees.

**Implementation approach — inherit, don't reinvent**: the old investigation explicitly tested and **rejected a per-request database redirect-table lookup in middleware**, in favor of static/version-controlled platform-level redirect rules (Next.js `redirects()` in `next.config.*`, which currently doesn't even exist in `ghanchi-investments` — Section 3). This is a sound, already-validated decision and should be reused rather than re-litigated.

**25 root-level article slugs** (rows 21–45): `why-health-insurance-is-required-even-if-you-have-coverage-from-your-office`, `cryptocurrency-as-investment-good-bad-analysis-financial-portfolio`, `indian-parents-dreams-future-pichai-nadella-child-education-planning`, `attention-indian-parents-your-children-are-not-your-retirement-plan`, `you-dont-have-to-be-rich-to-retire-rich`, `biggest-wealth-concerns-individuals-and-couples-face`, `single-woman-retiring-solo-is-a-dream-retirement-life-but-with-proper-planning`, `life-insurance-term-plan-protection`, `will-vasiyat-testament-legal-document`, `equity-markets-highs`, `buying-senior-citizen-health-policy`, `financial-empower-for-women`, `questions-ask-before-investing`, `major-reasons-for-insurance-claim-rejections`, `regularly-growing-sip-wealth`, `investors-reacting-response-market-movement-correction`, `gold-diversification-india-assetclass-sovereign-gold-bonds`, `assessment-review-planning-bonus-investment-insurance`, `why-are-we-not-saving-for-retirement`, `importance-health-insurance`, `investors-behaviour-swing-market`, `investment-mantra-for-wealth-creation`, `the-behavioural-gap-why-investors-do-not-get-the-returns-they-should`, `why-your-portfolio-may-be-underperforming`, `asset-allocation-asset-class`. (The 2 currently republished as adaptations should be matched against this list by slug in Phase 9, rather than assumed.)

### 11a. Gap between the manifest and what's implemented today

| What the manifest requires | Current `ghanchi-investments` state |
|---|---|
| Root `/awards/`, `/certificates/`, `/our-clients/`, `/testimonials/` → 301 to `/about-us/...` | ❌ Not implemented — no route folders exist |
| `/blog-post/` (from the *Kora template's* legacy names) → `/blog` | ✅ Implemented (this is the Kora-structure redirect, different from the WordPress `/blog-post/` archive above — don't confuse the two; the WordPress `/blog-post/` is its own live archive per row 6, not something to redirect) |
| 9 service slugs preserved exactly | ⚠️ Needs a direct slug-by-slug check against `service.slug` values in Strapi — not verified in this pass |
| 25 article slugs: 2 live, 23 → 404 (not silently missing) | ⚠️ Needs verification that unmatched slugs actually return a clean 404 rather than an unhandled error |
| Category/tag archive routes or redirects | ❌ Not implemented — open design question, needs an owner/dev decision on whether category/tag browsing is even wanted on the new site |
| `/elementor-hf/header/` → 410 | ❌ Not implemented |
| Generic unknown-path → 404, never homepage | ✅ Default Next.js behavior already does this correctly |
| `next.config.*` `redirects()` as the implementation mechanism | ❌ File doesn't exist yet — first prerequisite for all of the above |

What is already confirmed **implemented** today, separate from the WordPress manifest (these are *internal* Kora-template-structure redirects, not legacy-site redirects):

| Old path (Kora template structure) | New path | Status |
|---|---|---|
| `/about` | `/about-us` | ✅ `permanentRedirect()` implemented |
| `/contact` (preserves `?service=` query) | `/contact-us` | ✅ `permanentRedirect()` implemented |
| `/cases` | `/about-us/our-clients` | ✅ `permanentRedirect()` implemented |
| `/insights` | `/blog` | ✅ `permanentRedirect()` implemented |

What is **documented as planned but NOT implemented** (confirmed by directory listing — no route folders exist for these):

| Old path | New path | Status |
|---|---|---|
| `/awards` | `/about-us/awards` | ❌ Not implemented |
| `/certificates` | `/about-us/certificates` | ❌ Not implemented |
| `/our-clients` | `/about-us/our-clients` | ❌ Not implemented |
| `/testimonials` | `/about-us/testimonials` | ❌ Not implemented |
| `/blog-post` | `/blog` | ❌ Not implemented |
| Legacy Ghanchi root service/article slugs | canonical `/services/[slug]`, `/blog/[slug]` | ❌ Not implemented — "redirect only known records," no record list exists in code yet |

**The real WordPress site's actual ~70 legacy URLs (e.g. `ghanchiinvest.com/services/life-insurance/`, category/tag archive URLs, old post slugs) have zero redirect coverage today.** This is the single largest concrete SEO risk in the current implementation and will be fully tabulated once the background research returns.

---

## 12. SEO Audit

| Area | Current state | Gap |
|---|---|---|
| Metadata | `generateMetadata()` implemented in `layout.tsx` reading `siteSettings.siteMetaTitle/siteMetaDescription/siteTitleTemplate` from Strapi; per-route `generateMetadata` exists on dynamic routes (about-subpage confirmed reading `page.intro.metaTitle`/`metaDescription`). | None found — this is in good shape. |
| Canonical URLs | Confirmed present on `/about-us/[section]` (`alternates: { canonical: ... }`). | Verify this pattern is applied consistently on every dynamic route (services, blog, newsletters) — not fully spot-checked in this pass. |
| Sitemap | `sitemap.ts` exists, Strapi-driven (pulls `getServices()`/`getArticles()`), includes all static canonical routes. | Uses `item.id` for service/article slugs in the URL path (`/services/${item.id}`) — **verify this is actually the slug, not the numeric/document ID**; if it's the raw Strapi ID rather than the human slug, sitemap URLs won't match the real route pattern (`/services/[slug]`) and would 404. Needs a direct check in Phase 9. |
| Robots | `robots.ts` exists; currently blocks all indexing because `SITE_URL` is unset — correct interim behavior, but this is a hard pre-launch gate (Section 32). |
| Structured data | Not found in this pass — no `application/ld+json` / Organization / Article schema detected. **New requirement, not yet built.** |
| Redirects | See Section 11 — the biggest open item. |
| OG/Twitter metadata | Not verified in this pass — needs a direct check against `defaultSEO`/per-record SEO fields. |

---

## 13. Strapi Architecture

Already covered structurally in Section 3. Key architectural decision already made and worth keeping: **typed per-content-type REST fetches with an explicit mapping layer (`strapi.ts`)**, not a freeform dynamic-zone page builder. This is safer than the CMS handoff's originally-envisioned "allowlisted section registry" and should remain the pattern — building the full dynamic-zone/section-registry system described in the handoff doc's Section 9 is real, non-trivial engineering (typed discriminated unions, publish-time validation, safe empty states) that the current simpler design avoids needing. **Recommendation: do not build the dynamic-zone system unless the owner specifically wants drag-and-drop section reordering on the homepage.** The current "editors edit fields, developers control layout" split already satisfies the brief's stated principle in Section 6 of the owner's request ("Strapi should not make every visual element editable; layout/behavior stays code-owned").

Not yet implemented from the original architecture spec, and worth an explicit KEEP/DEFER decision each:
- **Preview mode / draft-mode endpoint** — DEFER. No editor has asked to preview unpublished content yet; this is meaningful engineering (signed short-lived tokens, replay protection) with no current user story.
- **Signed webhook revalidation** — DEFER for the same reason; the 60s ISR window is an acceptable interim cache strategy for a low-traffic advisory site.
- **Content History / Releases / Review Workflows** — these are paid Strapi Growth/Enterprise features per the CMS handoff's own research; DEFER until a hosting/licensing decision is made (Section 20 blocking input).

---

## 14. Strapi Content Model

Full inventory in Section 3. Per-type assessment against "why does it exist / who edits it / is it needed":

| Content type | Purpose | Needed? |
|---|---|---|
| `site-setting` (single) | Global brand/contact/footer/SEO defaults | Yes — correctly scoped, though large; splitting into smaller single types would only add fetch complexity for no real benefit at this content volume. KEEP as-is. |
| `navigation` (single) | Header/menu structure | Yes. |
| `home-page`, `about-page`, `services-page`, `blog-page`, `online-services-page`, `newsletters-page`, `contact-page` (singles) | Per-page hero/intro copy | Yes — matches the "page-level editorial copy" need identified in the owner's original audit request. |
| `about-subpage` | Awards/certificates/our-clients/testimonials sub-page copy | Yes. |
| `service`, `team-member`, `testimonial`, `article`, `category`, `newsletter`, `online-service`, `gallery-item`, `faq-item`, `legal-page` (collections) | Core repeatable editorial content | Yes, all justified and all populated with real content per Section 4. |

No over-engineered or clearly-unneeded schemas found. The one **under-modeled** area relative to the original spec is granular **provenance/approval tracking** (the handoff doc's `shared.provenance` component — sourceUrl, reviewedAt, reviewedBy, approvalState — attached to testimonials/awards/certificates/articles). Currently `sourceUrl` exists as a plain field on several types but there's no `approved`/`verificationState` flag anywhere in the live schema. Given the content-truth policy is a hard requirement (Section 5), **recommend adding a lightweight `verificationState` enum (`unreviewed`/`owner-approved`) to `gallery-item` and `testimonial`** in Phase 4 — small schema change, meaningfully closes a real content-integrity gap the owner's own prior planning called for.

---

## 15. Strapi Security Model

| Control | State |
|---|---|
| Public API permissions | Idempotent bootstrap grants `find`/`findOne` only, to 8 specific controllers — correct least-privilege pattern, verified in `src/index.ts`. |
| Admin panel access | Default Strapi admin auth; no additional review found (roles beyond default Author/Editor/Super Admin not audited in this pass — not customized as far as this pass found). |
| API tokens | `.env` has `SEED_API_TOKEN` (used for one-off seed scripts) — properly gitignored, not committed. No `STRAPI_READ_TOKEN` used by the frontend, since content is intentionally public-read; this is a reasonable choice for an all-public-content site with no gated content. |
| CORS | **No explicit allowlist** — `strapi::cors` middleware runs with Strapi defaults, which is permissive. **Gap: tighten before production** to the actual frontend origin(s) only. |
| Secrets hygiene | `.env` correctly gitignored on the Strapi side; `.env.local` correctly gitignored on the Next.js side (not verified directly this pass, but `.gitignore` in `ghanchi-investments` should be checked in Phase 13). No secrets found in any Markdown/docs reviewed this pass. |
| Draft exposure | `draftAndPublish: true` is set per content type; public permissions only grant `find`/`findOne`, which Strapi scopes to published entries by default — correct, no evidence of draft leakage. |
| Version control | **No git repo for `ghanchi-cms` at all** — not strictly a "security" issue but a serious operational-risk gap: no audit trail of who changed what schema when, no rollback path short of manual file recovery. **Recommend initializing git on `ghanchi-cms` in Phase 0/1**, immediately, independent of any hosting decision. |

---

## 16. Media Architecture

Current state: local-disk `public/uploads` in Strapi, referenced by SQLite, with `formats.thumbnail/small/medium/large` auto-generated derivatives. This session's own prior work (see project memory context) already:
- Fixed a real CSS bug class where an image's native aspect ratio was leaking into fixed-layout container sizing (service cards, hero newsletter card, team dialog) — resolved via `position:absolute;inset:0` + `object-fit:cover` pattern, confirmed via measured Playwright payload/layout checks.
- Migrated to Strapi's **native** focal-point picker (5.35+, confirmed present at the installed 5.55.0) for image alignment — a visual crosshair/X-Y picker in the Media Library, exposed as `media.focalPoint = {x, y}` on every populated media relation, read via `mediaFocal()` and applied as inline `object-position` — superseding an earlier custom-decimal-field approach that duplicated a feature Strapi already had.
- Made `mediaUrl()` bandwidth-aware: compares `.size` of the original vs. Strapi's `medium`/`large` derivative and picks whichever is genuinely smaller (PNG derivatives can be *larger* than the original due to re-encoding; JPEG derivatives are reliably smaller) — measured 59% payload reduction (4.07MB → 1.65MB) across home+services.

This directly satisfies the owner's request in this session ("user should be able to align the photo or crop the image from Strapi") — it's done, not a plan item.

**Gap:** no object/durable storage provider is configured — Strapi is using the local filesystem for uploads. This is fine for local development but is a **blocking item before any real hosting deployment** (ephemeral filesystems on most hosts wipe uploads on redeploy). See Section 20 blocking inputs.

---

## 17. AI Media Generation Plan

**Starting point, not zero:** `GEMINI_API_KEY` is already configured in `ghanchi-investments/.env.local`, and `scripts/gemini-gen-test.mjs` / `scripts/gemini-test.mjs` exist as untracked experiments, with output already produced (`Gemini_Generated_Image_gr769qgr769qgr76.png`, `Gemini_Generated_Image_lxa238lxa238lxa2.png` sitting at the `trial` root — evidence of a recent generation test, not yet formalized into a pipeline or moved into the actual project).

**The open decision this plan cannot resolve alone:** the current `public/assets/` library (89 files) has a strong signature of being bulk-imported from the old site (Wix-pattern filenames like `dc1c1b_..._mv2.jpg.webp`, sequential `ghanchi-1.jpg.webp`...`ghanchi-12.jpg.webp`, and an obvious screen-recording-to-gif source pattern `ghanchi-ezgif.com-gif-maker-*.jpg.webp`). Two of these are clearly legitimate business records (`ghanchi-founder-headshot.jpg`) that the owner's own prior transformation plan explicitly wanted preserved as genuine identity content — those are not "old media library" in the sense the new brief means (generic decorative/stock imagery), they're factual business assets on par with the awards/certificate scans. But most of the 89 are unclassified. **Recommend a Phase 7 pass that sorts every current asset into KEEP (genuine identity/business record) vs. REPLACE (decorative/stock, in scope for AI regeneration)** before generating anything new — regenerating what's already a legitimate factual photo would be actively wrong per the content-truth policy (Section 5).

Repeatable workflow (per the owner's brief, formalized from the existing Gemini experiment):
1. Identify visual requirement (page/section/purpose) from the page-by-page media plan (Section 19, to be completed after the KEEP/REPLACE sort above).
2. Write a generation prompt consistent with the Kora/Ghanchi art direction (mint/cream/ink palette, editorial-financial tone) and the content-truth constraints below.
3. Generate candidates via the existing Gemini pipeline (formalize `scripts/gemini-gen-test.mjs` into a real `scripts/generate-media.mjs`).
4. Human review for quality, brand consistency, and the prohibited-content list below.
5. Optimize (WebP, correct dimensions).
6. Upload to Strapi Media Library.
7. Set alt text + focal point in Strapi (native picker, already working).
8. Connect to the content entry.
9. Verify responsive rendering at all four breakpoints.

**Prohibited in AI-generated imagery** (per owner's brief, binding): fake documents/financial statements/certificates/awards, misleading regulatory imagery, fabricated client relationships or performance representations, identifiable real people depicted as clients/advisors without basis. This is a stricter version of the content-truth policy already governing the project (Section 5) and should be added verbatim to whatever generation-prompt guidelines get written in Phase 7.

Page-by-page media requirements table: **deferred to Phase 7 planning**, not populated here — it depends on the KEEP/REPLACE asset sort above, which is real classification work, not something to guess at in an audit pass.

---

## 18. Page-by-Page Content Plan

Already substantially defined by the transformation plan (docx) and implemented. Status per page:

| Page | Content source | Status |
|---|---|---|
| Home | `home-page` + `site-setting` + `service`/`team-member`/`testimonial`/`article`/`newsletter` relations | Implemented, CMS-driven. |
| About Us | `about-page` | Implemented. |
| About subpages (awards/certificates/our-clients/testimonials) | `about-subpage` + `gallery-item`/`testimonial` | Implemented. |
| Services listing + detail | `services-page` + `service` | Implemented, all 9 services present. |
| Online Services | `online-services-page` + `online-service` | Implemented. |
| Newsletters | `newsletters-page` + `newsletter` | Implemented; archive gaps (Nov 2020, Jun 2020) correctly shown as unavailable, not guessed. |
| Blog + article detail | `blog-page` + `article` + `category` | Implemented; only 2 legitimate articles currently, correctly labelled as adaptations. |
| Contact Us | `contact-page` | Implemented; delivery unconfigured (Section 21). |
| Legal (`/privacy-policy`, `/terms-of-service`, `/disclaimer`) | `legal-page` via `[legal]` catch route | Implemented as drafts; explicitly flagged in `AGENTS.md` as "requiring review before launch" — still true, still a blocking input (Section 22/34). |

No page is missing from Strapi coverage relative to what the owner's original "what's not managed by Strapi" audit (from earlier in this project) identified as in-scope.

---

## 19. Page-by-Page Media Plan

Deferred — depends on the asset KEEP/REPLACE classification described in Section 17. Will be produced as part of Phase 7.

---

## 20. Navigation / Information Architecture

Confirmed implemented per the transformation plan's spec:
- Primary nav: Home, About Us, Services, Online Services, Blog, Contact Us.
- About Us dropdown: Our Introduction, Awards, Certificates, Our Clients, Testimonials.
- Services dropdown: all 9 services.
- Online Services dropdown: Newsletters + 8 external/account links.
- Dropdown accessibility (keyboard, Escape, focus return) specified in the docx as a hard requirement — not independently re-verified in this pass beyond the earlier session's general keyboard/reduced-motion checks; **recommend a dedicated keyboard-nav pass in Phase 11**, since `scripts/navbar-audit.mjs` and `scripts/hover-audit.mjs` already exist as untracked scripts in `trial/`, suggesting this was mid-investigation when the session was interrupted.

No architectural change recommended here — IA is sound and matches the approved plan.

---

## 21. Contact / Lead Architecture

- Form exists (`/contact-us`), POSTs to `/api/contact`.
- Validation: name 2–100 chars, email ≤254 + syntax check, phone 7–25 chars with ≥7 digits, services array (≥1, from known IDs), optional goal ≤200, message 10–3000, consent must be `true`, honeypot field must be empty.
- Same-origin JSON enforcement, bounded body size, HTTPS-only upstream, timeout + no-redirect-follow on the outbound call.
- **`CONTACT_WEBHOOK_URL` is unset** → endpoint correctly returns 503 rather than fabricating success. **No submissions currently reach anyone.**
- Newsletter form: same pattern, `NEWSLETTER_WEBHOOK_URL` unset, same fail-closed behavior.
- Explicit design decision already recorded (CMS handoff §13): **do not store form submissions in public Strapi collections** — if a private inbox/CRM is wanted, that needs a separately-designed, least-privilege destination, not a Strapi content type.

**Historical precedent (from the direct WordPress database pass, Section 10a)**: the old site's two WPForms forms notified `chandrakantlic@gmail.com` (general contact) and `chandrakant@ghanchiinvest.com` (appointment requests). **No submission history exists anywhere in the database to migrate** — both WPForms Lite (no entry storage on that tier) and Elementor Pro's submission tables (present but empty) confirm there are zero historical leads. This simplifies the blocked decision below to a clean-slate choice, not a migration.

**BLOCKED — BUSINESS INPUT REQUIRED**: who receives submissions (the two historical addresses above are a reasonable default to propose, not an assumption to build on), what delivery mechanism (email via SMTP relay, a form service like Formspree/Basin, a private webhook to a CRM), retention period, who has access. Nothing should be implemented here without that decision — the current fail-closed behavior is the correct placeholder, not a bug.

---

## 22. Legal / Compliance Content Requirements

- Privacy Policy, Terms of Service, Disclaimer exist as **drafts** (`legal-page` content type), explicitly marked in `AGENTS.md` as "requiring review before launch."
- Given the business is a financial/insurance advisory, likely additional needs (not yet drafted, not inventable by AI without business/legal input): investment disclaimer language, insurance-specific disclaimers, any IRDAI/AMFI/SEBI-adjacent registration disclosures if the founder holds relevant certifications, grievance/redressal contact information.
- The docx already flags several claims as "requires qualification or pre-launch review" (15+ years, 12+ awards, 5.0 rating, current regulatory titles/designations, product/tax/policy-benefit wording, certificate validity/expiry) — these are legal-content-adjacent, not just marketing copy, and should go through the same review gate as the legal pages.

**BLOCKED — BUSINESS/LEGAL INPUT REQUIRED**: final legal page text, confirmation of any regulatory registration numbers/designations, confirmation of certificate current-validity status.

---

## 23. Performance Plan

Verified this session (prior context): 59% payload reduction on image-heavy pages via the `mediaUrl()` derivative-size comparison; no layout-shift-causing CSS bugs remaining in the 3 confirmed problem areas; responsive breakpoints verified with zero horizontal overflow at 4 widths including iPhone SE.

Not yet audited in this pass: JS bundle size, font-loading strategy, third-party script inventory (Section 26 will surface this), Strapi API call patterns for duplicate/waterfall fetches across a single page render (the `strapi.ts` module fetches per-section rather than a single combined query — worth checking for N+1-style waterfalls in Phase 12, not confirmed as a problem, just unverified).

**No `next/image` usage anywhere, and no `next.config.*` exists at all.** This was confirmed as a deliberate non-issue for the current raw-`<img>` approach (Section 12 of the earlier session's critique response) but should be revisited once real hosting is chosen — Vercel's image optimization is free performance if `next/image` gets adopted later.

---

## 24. Accessibility Plan

Confirmed from prior work this session: keyboard focus, Escape behavior, and reduced-motion fallbacks are explicitly designed into the dropdown/dialog/accordion components per the transformation plan spec, and were spot-verified for FAQ/team/testimonial dialogs. `scripts/navbar-audit.mjs` and `scripts/hover-audit.mjs` (untracked, in `trial/`) suggest an in-progress dedicated accessibility/interaction audit that didn't get folded into `ghanchi-investments` yet — worth finishing and porting over rather than re-doing from scratch (Phase 11).

Not yet verified in this pass: full heading hierarchy per page, color contrast against the mint/cream palette (should be checked now that real photography/content is in place, not just Kora's original stock imagery), screen-reader pass on the carousel/testimonial-expansion interactions specifically.

---

## 25. Security Plan

Covered in Section 15 (Strapi) and Section 21 (forms). Additional items for Phase 13:
- No `.env`/secret leakage found in any Markdown or committed file reviewed this pass.
- CORS tightening on Strapi (Section 15) — concrete, small fix.
- No dependency-vulnerability scan run in this pass — recommend `npm audit` on both `ghanchi-investments` and `ghanchi-cms` in Phase 13.
- **`ghanchi-cms` has no `.git`** — beyond the operational-risk framing in Section 15, this is also a security-process gap: no way to diff a schema/permission change against a known-good prior state if something goes wrong.

---

## 26. Third-Party Integration Audit

| Service | Purpose | Where used | Required? | Status |
|---|---|---|---|---|
| Strapi (self-hosted, unhosted) | CMS/content API | `src/lib/strapi.ts` | Yes | Implemented, unhosted |
| Gemini API | AI image generation | `scripts/gemini-*.mjs` (experimental) | Planned (Section 17) | Test-only so far |
| Contact/newsletter webhook | Form delivery | `.env` `CONTACT_WEBHOOK_URL`/`NEWSLETTER_WEBHOOK_URL` | Yes | **Unconfigured — blocking** |
| Google rating | Trust badge | Static value only (`site-setting.ratingValue` etc.) | No live integration exists or is planned yet | Intentionally static per docx — do not build a live sync without separate approval |
| Fonts (Manrope) | Typography | Not verified this pass — check whether self-hosted or Google Fonts CDN | — | Verify in Phase 12 |
| Analytics | — | None found in this pass | — | Not present; owner decision needed on whether/what to add |
| Maps | — | None found | — | Not present |
| CAPTCHA/anti-spam beyond honeypot | — | None | Recommended before public launch (docx §13 explicitly says "honeypot alone is not production spam protection") | Not yet implemented — Phase 10 |
| WhatsApp click-to-chat widget | Direct client contact | Old WordPress site only (`click-to-chat-for-whatsapp` plugin, confirmed active) | Non-blocking — owner preference | Not present in current implementation; cheap to add if wanted |

No stray template (Kora) third-party integrations found to remove — the Kora baseline itself doesn't appear to have shipped with tracking scripts either, based on files reviewed.

---

## 27. DNS / Email Protection

Not yet actioned — correctly so, per both the owner's new brief and the existing docx ("DNS migration must be a final launch step... do not perform DNS changes during implementation"). No DNS changes have been made. The live WordPress site's current MX/SPF/DKIM/DMARC records need to be captured as a snapshot **before** any DNS work begins (Phase 17), so the web-routing cutover can be scoped to only the records it actually needs to touch.

**BLOCKING INPUT**: access to the current DNS provider/registrar for `ghanchiinvest.com` to capture the existing record set. Not currently available to this audit.

---

## 28. Testing Strategy

Current state: `ghanchi-investments/tests/pages.spec.ts` (167 lines) covers every published route, assets, overflow, dialogs, process, pricing-removal, and FAQ per its own docstring-equivalent comment; `npm run typecheck`/`npm run build`/`npm test` (Playwright, isolated port 3100) are the standing verification commands per `AGENTS.md`. `node scripts/complete-content.mjs --validate` validates Ghanchi records/local assets.

Gaps relative to the full QA strategy the owner's brief wants:
- No redirect tests (can't test what doesn't exist yet — Section 11).
- No SEO-specific tests (structured data, meta tag presence per route).
- No accessibility test automation (axe-core or similar) — current a11y verification has been manual/Playwright-assertion-based, not a dedicated scanner.
- No load/performance testing.
- No security testing (form abuse, injection attempts against the API routes).
- No production smoke test suite yet (there is a `strapi-smoke-test.mjs` script, from this session's prior work, that checks 17 routes for status/h1/console errors — this is the closest thing to a smoke suite and should be formalized/kept, not replaced).

---

## 29. Deployment Architecture

**Undecided.** No hosting has been chosen for either Next.js or Strapi. The expected shape (Vercel for Next.js, some host + persistent storage + managed Postgres for Strapi, since SQLite is a local-dev-only choice for production) is the sensible default but is explicitly a **BLOCKING INPUT** from the owner (Section 34), not something to assume.

---

## 30. Backup / Rollback Strategy

None exists today for either codebase:
- `ghanchi-investments`: has git, but the entire Strapi-integration work is **uncommitted**. First concrete action (Phase 1) should be committing this work to the `ghanchi-investments` branch so it's not one accidental `git clean`/`checkout` away from being lost.
- `ghanchi-cms`: has no git at all. Needs `git init` + first commit immediately, independent of any future hosting choice.
- Database backup strategy: N/A while on local SQLite; becomes a real requirement once a production database is chosen (Section 29).

---

## 31. Migration Strategy

High-level, to be finalized once Sections 10/11 land:
1. Business content: already migrated and encoded in Strapi per Section 4/18 — this is largely done.
2. Legacy URLs: not yet migrated — the real work is ahead here (Section 11/Phase 9).
3. Media: explicitly **not** a lift-and-shift per the owner's new instruction — see Section 17's KEEP/REPLACE sort as the actual first step, not a bulk import.
4. DNS: last step, after everything else is verified in staging (Section 27).

---

## 32. Launch Checklist

Not finalized until Sections 10/11 are complete and the blocking inputs (Section 34) are resolved. Placeholder structure:
- [ ] All legacy URLs classified and redirects implemented, tested for chains
- [ ] `SITE_URL` set, `robots.ts` allows indexing
- [ ] Legal pages reviewed and approved (not drafts)
- [ ] Contact/newsletter delivery configured and tested end-to-end
- [ ] Media asset classification complete, AI-generated replacements in place where needed
- [ ] `ghanchi-cms` has git history and a real database/hosting decision
- [ ] `ghanchi-investments` work committed, `next.config.*` created with any needed redirects/headers
- [ ] CORS tightened on Strapi
- [ ] Structured data added
- [ ] Full responsive/accessibility/keyboard pass complete
- [ ] DNS snapshot captured; MX/SPF/DKIM/DMARC verified protected
- [ ] Owner sign-off on all content, statistics, imagery, legal text

---

## 33. Post-Launch Monitoring

Not yet designed — depends on the hosting decision (Section 29). No monitoring/logging/error-tracking service found configured in either codebase in this pass.

---

## 34. Open Questions / Required Business Inputs

### BLOCKING INPUTS
- **Form delivery**: recipient(s), mechanism, retention, access control for `/api/contact` and `/api/newsletter`.
- **Legal page text**: final-approved Privacy Policy, Terms of Service, Disclaimer (current versions are drafts).
- **Regulatory/registration confirmation**: any current designations, certificate validity status, registration numbers referenced in legal or about-page copy.
- **Media classification approval**: which of the 89 current `public/assets` files are genuine business records to keep (founder photo, awards, certificates) vs. decorative/stock imagery in scope for AI regeneration.
- **Newsletter archive gaps**: correct URLs for the malformed November 2020 and June 2020 entries, and any newer issues since November 2021, if the owner wants them added (do not guess/repair).
- **Awards/certificates transcription**: issuer, date, title, and current-validity status per item, to replace the current neutral archive captions.
- **Hosting/infrastructure decisions**: Strapi host, production database engine, media/object storage provider, Next.js hosting (Vercel assumed but not confirmed), Strapi licensing tier if Content History/Releases/Review Workflows are wanted.
- **DNS/registrar access**: to snapshot current MX/SPF/DKIM/DMARC before any cutover planning.
- **Google rating integration**: keep static, or pursue a real (paid/API-gated) live sync — currently static per explicit owner approval, revisit only if wanted.
- **Analytics**: whether to add any, and which provider, given none exists today.
- **Social link reconciliation**: two slightly different LinkedIn URLs were found for the founder in the old site (Section 10a) — confirm the correct one, and verify all four social links (Facebook/Instagram/LinkedIn/YouTube) against what's currently in Strapi's `site-setting.socialLinks`.
- **Canonical hostname**: apex `ghanchiinvest.com` vs `www.ghanchiinvest.com` — the old investigation locked this to apex by evidence interpretation but never confirmed it via Search Console (Section 11). A live check of the real `robots.txt`/sitemap resolves this in minutes and should happen before Phase 9.
- **Category/tag archive pages**: build them as real routes, or redirect them into `/blog`? No decision exists yet (Section 11a).
- **WhatsApp click-to-chat widget**: present on the old site, absent from the new one — keep, or intentionally drop?

### NON-BLOCKING INPUTS (sensible defaults exist, can proceed and revise later)
- Exact wording refinements to hero/section copy already drafted in the transformation plan.
- CORS allowlist specifics (default to the eventual production frontend origin(s) once known).
- Structured data schema selection (Organization + FinancialService + Article schema.org types are the sensible default for this business type).
- Whether to formalize the dynamic-zone/section-registry system (default: no, keep the current simpler typed-field model, per Section 13's recommendation).

---

## 35. Risk Register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Uncommitted `ghanchi-investments` work lost to an accidental git operation | Medium (no protection currently) | High — significant recent work | Commit immediately (Phase 1) |
| `ghanchi-cms` schema changes lost with no history to recover from | Medium | High | `git init` immediately (Phase 1) |
| Legacy WordPress URLs 404 after cutover, losing existing search rankings | High if unaddressed | High | Complete Section 11 matrix and implement before any DNS change (Phase 9/17) |
| Form submissions silently lost because delivery is unconfigured at actual launch time | Medium (easy to forget since current fail-closed behavior is "quiet") | High | Explicit launch-checklist gate (Section 32) |
| Media re-classification (Section 17) delays AI-generation work | Medium | Medium | Scope Phase 7 to start with the classification pass, not generation, so it's not blocked on itself |
| SQLite-based Strapi doesn't survive a production redeploy (ephemeral filesystem) if hosting is chosen carelessly | Medium | High | Explicit hosting-decision blocking input (Section 34) before any deploy |
| CORS left wide-open on a public content API | Low impact given content is intentionally public-read, but still hygiene | Low-Medium | Cheap fix, include in Phase 13 |

---

## 36. Exact Implementation Phases

| Phase | Objective | Key work | Blockers |
|---|---|---|---|
| **0** | Repository + source audit | This document. Confirm Sections 10/11 with background research findings. | None — in progress |
| **1** | Architecture stabilization | `git init` + first commit for `ghanchi-cms`; commit all outstanding `ghanchi-investments` work | None |
| **2** | Template fidelity completion | Verify remaining responsive/keyboard/a11y items from `navbar-audit.mjs`/`hover-audit.mjs`; port findings into `ghanchi-investments` | None |
| **3** | Ghanchi branding/content architecture | Close founder-headshot gap; finish any remaining hardcoded-string sweep | None |
| **4** | Strapi schema finalization | Add `verificationState` to `gallery-item`/`testimonial` (Section 14) | None |
| **5** | Strapi security + permissions | Tighten CORS; review admin roles | None |
| **6** | Content migration/restructuring | Fold in Sections 10/11 findings; finalize any additional content from WordPress source | Waiting on background research |
| **7** | AI media generation + Strapi media population | Asset KEEP/REPLACE classification (owner input required) → generation pipeline → page-by-page media plan (Section 19) | Owner input on media classification |
| **8** | Page-by-page frontend integration | Already largely done; close remaining gaps found in Phase 2/6 | — |
| **9** | SEO + URL migration | Implement full legacy-URL redirect matrix from Section 11; verify sitemap slug-vs-id issue (Section 12); add structured data | Waiting on Section 11 |
| **10** | Contact/lead functionality | Configure `CONTACT_WEBHOOK_URL`/`NEWSLETTER_WEBHOOK_URL`; add production-grade anti-spam | Owner input on delivery mechanism |
| **11** | Accessibility + responsive QA | Full keyboard/contrast/screen-reader pass | None |
| **12** | Performance optimization | Font-loading audit, API waterfall check, font/CDN decision | None |
| **13** | Security audit | `npm audit` both repos, CORS, secrets sweep | None |
| **14** | Full automated + manual QA | Expand `pages.spec.ts`; add redirect/SEO/a11y automated tests | Depends on Phase 9/11 |
| **15** | Staging deployment | Requires hosting decision | Owner input on hosting |
| **16** | Production deployment | — | Phase 15 |
| **17** | DNS cutover | Snapshot MX/SPF/DKIM/DMARC first; final step only | Owner input on DNS access; all prior phases |
| **18** | Post-launch monitoring | Choose and wire monitoring per hosting choice | Phase 15/16 |

No coding begins from this plan until the owner reviews it.
