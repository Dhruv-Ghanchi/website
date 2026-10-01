# Implementation handoff — Ghanchi Investments client-first restructuring

**Status: AUDIT COMPLETE. AWAITING OWNER APPROVAL.**  
**Approved target structure: NONE YET.** The proposed target below is the auditor's recommendation, not authorization to implement. Do not mistake the user's request to start local servers for approval to change the website.

This file is self-contained so a different coding agent can continue without the chat. Read `FINAL-AUDIT.md` for evidence/conflict resolution, `01-homepage-scroll-map.md` for current inventory, `03-section-decision-matrix.md` for decisions/scores, and `04-recommended-information-architecture.md` for full target rationale.

## 1. Objective and non-goals

Make an existing working Indian insurance/investment-services website cleaner, meaningfully shorter, more understandable and more trustworthy for first-time investors, insurance customers, families, existing clients and referral visitors. Preserve working routes, forms, contact utilities, responsive behavior, SEO and integrations. Every section must answer a useful client question; do not optimize for developer spectacle.

Not a rebuild/rebrand, CMS replacement, asset purge, infrastructure project, new financial service or fabricated proof exercise. No deployment/push/commit was requested. No production implementation was performed during this audit.

## 2. Workspace, state and safety boundaries

- Frontend: `C:/Users/Ghanchi/Desktop/ghanchi-investments`, branch `ghanchi-investments` (tracking `origin/ghanchi-investments`). Do not edit the separate `trial`/baseline or push to backup main.
- At audit start these **already had uncommitted changes**: `src/app/contact.css`, `src/app/globals.css`, `src/app/page.tsx`, `src/components/contact.tsx`, `src/components/home-sections.tsx`. Baseline diff: 5 files, 66 insertions, 55 deletions. Treat them as owner work; don't overwrite/revert them. Same production diff statistics remained after audit.
- Audit artifacts were added under `docs/audit/`; generated test/build caches are not production edits. Existing CMS git status remained clean after startup.
- CMS location: `C:/Users/Ghanchi/Desktop/ghanchi-cms`, existing **Strapi 5.55.0** application. Owner explicitly authorized starting it to render this audit. Do not seed, migrate, modify schemas, change permissions or mutate hosted/local records without separate authorization.
- Never print `.env`/secrets or make real test submissions to webhooks/reference business. All submitted form tests used local mocks.
- Agency configuration already exists as sixteen source persona documents at `docs/agency-audit/roster/`; no duplicate install or new agent config is necessary. If future new tooling config is approved, use `.devin/`.
- Existing rules protect the shared home-intro/statement pin/reversal and footer wordmark/layered hover. Current phone CSS already diverges from the old pin test: resolve with owner; don't erase tests or force old behavior without a decision.

## 3. Actual architecture — current source overrides stale notes

Next.js 16.3.4 App Router, React 19.2.8, TypeScript 5.9.3, Tailwind 4.2.1/CSS, Motion 12.34.0, Lucide. Read relevant installed Next docs before implementation because this release differs from older API assumptions.

**Strapi is connected and working now.** Older AGENTS/handoff descriptions of six file-backed collections and a future CMS are stale. `src/lib/content.ts` contains types/helpers. `src/lib/strapi.ts` fetches/maps actual services, testimonials, articles/categories, team, gallery, newsletters, legal, navigation, site/home/page content and FAQs, with 60s revalidation. Root layout and pages use concurrent server fetches. Media comes from Strapi upload URLs with derivative/focal-point mapping; local assets still supply fallback/favicon/legacy materials.

### Production component map

| File / component | Responsibility |
|---|---|
| `src/app/page.tsx:12-17` | Fetch ten content sources; homepage composition |
| `src/app/layout.tsx:9-27` | Global metadata, FinancialService/WebSite data, shared Header/Footer |
| `src/components/home-hero.tsx` | TrustBadge, location ticker, Hero/sticky statement/spacer, Comparison |
| `src/components/home-sections.tsx` | PlanningChart, ServicesSection, ProcessSection, TeamSection, Counter, TestimonialsSection, FeaturedCase, InsightsSection |
| `src/components/faq.tsx` | Category tablist/answer accordion |
| `src/components/contact.tsx` | ContactIntro, ContactSection, NewsletterForm, submission state/validation |
| `src/components/site-shell.tsx` | Navigation/dropdowns, MotionProvider, Header, Footer |
| `src/components/ui.tsx` | Shared Button/Reveal/Person/Logo/icons/reduced-motion hook |
| `src/components/inner-pages.tsx` | Existing compact service cards, page intro/CTA, article and testimonial renderers |
| `src/app/globals.css` | Brand tokens, hero/section/interaction/responsive/reduced-motion styling |
| `src/app/contact.css`, `inner.css` | Contact/inner-page layouts |
| `src/lib/strapi.ts`, `content.ts` | Typed content/media shapes and helpers; preserve existing integration |
| `src/lib/structured-data.ts`, app metadata/sitemap/robots | SEO contracts and preview indexing protection |
| `src/app/api/contact/route.ts`, `api/newsletter/route.ts` | Validated, HTTPS-webhook-backed delivery; 503 without configuration |

No analytics provider found in application source. Do not add one without a privacy/data approval decision.

## 4. Running the local environment correctly

At audit completion the intended preview ports are **Strapi 1337** and **Next 3100**. They are separate processes. Original frontend environment/cached data referenced an obsolete private-network host; changing only the CMS process did not fix old frontend URLs. No `.env` file was edited.

Start existing CMS if not running:

```powershell
# Working directory: C:/Users/Ghanchi/Desktop/ghanchi-cms
npm run develop
```

Start frontend with a **session-only** local CMS URL:

```powershell
# Working directory: C:/Users/Ghanchi/Desktop/ghanchi-investments
$env:STRAPI_URL='http://localhost:1337'
npm run dev -- --port 3100
```

Verify actual image URLs start with reachable localhost:1337 and decoded images have positive natural width; lazy images must be scrolled into view. Don't use initial incomplete screenshots as proof of broken components. If port 3100 remains occupied after ending an npm shell, inspect the exact listener's command line; Windows can leave the Next child running. Stop only the verified process belonging to this worktree, never an unrelated server.

Tests start their own port-3100 server and **refuse reuse**. Close preview/stop only this frontend before running tests; leave CMS running. Do not kill the CMS to make tests pass. No persistent configuration change, hosting or CORS/security-policy edit is part of this audit.

## 5. Current homepage structure

Measured normal-motion page height: **22,541px at 1440×900**; **24,272px at 390×844**. Other measurements: 22,332px at 1200×900; 21,409px at 810×1080. Header overlays the page and must not be added to totals.

| Current # | Actual section / component | Height desktop / mobile |
|---|---|---:|
| 01 | Header | fixed 60 / 68px, non-additive |
| 02 | Hero — “A personal financial advisor for Navi Mumbai families, trusted since 2009.” | 900 / 1,055 |
| 03 | “Making goal-based financial advice accessible to all.” + spacer | 1,800 / 230 |
| 04 | “From scattered decisions to one coordinated plan.” / Comparison | 3,258 / 1,387 |
| 05 | Services / chart + nine full cards | 6,406 / 9,696 |
| 06 | “Your goals come first. The plan follows.” / Process | 2,107 / 1,778 |
| 07 | “Meet your advisor. A personal partnership.” / Team + recognition | 942 / 710 |
| 08 | Testimonials + stats + founder callout | 2,152 / 2,651 |
| 09 | “A personal approach, for clients in India and abroad.” / FeaturedCase | 843 / 1,215 |
| 10 | FAQ | 888 / 789 |
| 11 | “Knowledge for your next chapter.” / Insights | 729 / 1,288 |
| 12 | “Let’s plan your next chapter.” / Contact | 1,216 / 1,880 |
| 13 | Footer, newsletter/wordmark | 1,299 / 1,593 |

Hero contains early contact/actions, reported trust, location ticker and November 2021 newsletter. Do not claim no CTA/trust until the bottom. Founder block/dedicated proof are late, although named quotes appear earlier on service cards. `FeaturedCase` is a company overview, NOT a real client case study.

## 6. Proposed target — explicit approval required

Exact proposed order:

1. **Header** — current working navigation/phone/Online Services.
2. **Hero + integrated compact trust** — concise identity/products; named founder/qualified facts; existing service/contact actions; remove newsletter prominence.
3. **Protected statement scene** — current hero/statement/spacer architecture by default; no casual pin/reversal deletion.
4. **Grouped Services selector** — all nine categories, short benefits and direct links.
5. **Compact Testimonials** — one/two approved attributed originals, archive link, no giant proof stack.
6. **Founder + why + recognition** — actual founder, brief biography, two concrete support/coordination benefits, links to awards AND certificates; audience fit merged here.
7. **Compact Process** — four steps and ongoing support, actual video optional rather than a large default frame.
8. **Selected FAQ** — 4–5 decision questions; preserve remaining answers in suitable indexable destinations.
9. **Compact resources** — two dated article links and newsletter archive link, not oversized image cards.
10. **Contact** — existing functional form, calmer static background, no repeated statistics; telephone alternative.
11. **Footer** — all key utilities/disclosures, compact repeated prose; original large wordmark/layered hover preserved.

### Service grouping (proposed presentation, not new services)
- Plan & invest: Financial Planning, Mutual Funds, Retirement Planning, Child Education Planning.
- Insurance protection: Life Insurance, Health Insurance, Personal Accidental Policy, General Insurance.
- Business protection: Employer Employee Insurance.

Keep canonical service slugs unchanged. SIP is an existing Mutual Funds option, not a tenth service. `/services` is the catalog. `/online-services` contains account/renewal/app links and must not become “View all services”.

### Keep / merge / move / remove map

| Current component/element | Action after approval | Reason / destination |
|---|---|---|
| Header | KEEP | Already has phone/contact/portal navigation; do not rebuild |
| Hero heading/subheading/trust | KEEP + REDUCE / clarify | Concrete products, qualified proof; professional-role wording gate |
| Hero newsletter card | MOVE DOWN | Compact resources → `/newsletters`, dated archive preserved |
| Hero location ticker | Prefer static short text | India/UAE/USA are client geography, not partnership/licence proof |
| Statement + spacer | KEEP by default | Protected timeline; optional retiming separate |
| Comparison | MERGE content; omit standalone homepage render | Two useful coordination benefits → founder/why, not absolute success claims |
| PlanningChart | REMOVE homepage render | Decorative bars not evidence; steps explained elsewhere |
| ServicesSection | KEEP all service routes; REDUCE presentation | Grouped rows, omit repeated homepage image/quote/deliverable stacks |
| TestimonialsSection | MOVE UP + compact | One/two approved excerpts, original identity/source links |
| Stats grid | MERGE into hero evidence | At most two substantiated non-duplicative facts; no multiple count-up grids |
| TeamSection | MOVE UP; merge recognition/founder CTA | Real person/accountability precedes process |
| Recognition panel | Compact within founder | Preserve awards/certificates routes; no invented badge titles |
| ProcessSection | MOVE DOWN after proof/person; condense | Explain working relationship once; retain optional actual video |
| FeaturedCase | MERGE useful audience fit; omit standalone render | Repeated stats/services/quote; no fake case route |
| FAQ | KEEP + REDUCE home selection | All answer content retained appropriately; accessible controls |
| InsightsSection | Compact resources + relocated newsletter | Honest deeper information without another full visual grid |
| ContactSection | KEEP form contract; reduce visual competition | No automatic field/API changes; no autoplay backdrop |
| Footer | KEEP wordmark/hover/utilities, reduce repeated prose | Protected brand closure, essential real reachability |

“Remove” means no longer render that presentation on the homepage. **Do not delete CMS records, original files/media, service/article/legal routes or working integrations.**

### Target scroll budgets

Central desktop allocation (px): Hero900 + statement1800 + services1100 + proof600 + founder650 + process650 + FAQ650 + resources400 + contact1150 + footer1200 = **9,100**.

Central mobile allocation: Hero800 + statement230 + services1800 + proof700 + founder800 + process800 + FAQ700 + resources500 + contact1750 + footer1520 = **9,600**.

Acceptance bands: **9,000–10,500 desktop / 9,500–11,500 mobile**, approximately 53–61% reduction depending on final layout. These are estimates, not permission to hide content or shrink type. Baseline/target same viewports, fonts and default expanded states. Hero/statement preservation means desktop service discovery still starts ~3 viewport heights down by scrolling; anchor jump remains immediate. Require separate approval if an earlier scroll position mandates retiming hero.

## 7. Content, trust and media constraints

- Source snapshot at `evidence/public-content.json`: **9 services, 11 testimonials, 8 award photos, 19 certificate scans, 19 newsletters**. Live CMS may change later; requery before implementation.
- Current reported stats: **15+ years, 1,200+ clients, 12+ awards, historical 5.0/5**; hero “since 2009”. These are not independently verified business metrics. Reconfirm basis/date; never change clients to families/policies or invent assets managed.
- “Since 2009” and “15+” are compatible but redundant. Prefer one; no automatic age increment.
- 12+ awards is not established by eight photos/nineteen scans. Photos may depict duplicates or multiple items; transcription needed. No partner or registration claims inferred from them.
- Historical Google rating is explicitly not a live feed. Prefer named proof if current source/date cannot be substantiated. Don't remove qualification merely to improve polish.
- Financial advisor/financial planning/Founder & Financial Planner terminology needs actual professional-capacity confirmation; historical certificates do not prove current authorization. Do not declare illegality or insert invented ARN/SEBI/IRDAI numbers.
- Quote candidates: Neeta Agrawal (planning), Manju Rajvanshi (insurance). Approval required for excerpts/permission. Keep exact meaning/name/source, initials where no real portrait. Employer affiliations are not corporate endorsement.
- Do not “correct” Sumit's health to wealth. Money-making/new-website wording belongs to Firoz, not Parvez; avoid promoting it.
- Newsletter newest source issue is November 2021. Two unavailable issues: November 2020 and June 2020. Do not guess URLs or dates. Two current article adaptations preserve March 2021 dates/source notes. Do not import unrelated/gambling posts from legacy blog.
- Real founder/awards/certificates protected. Flower/stock/AI family/office/glass media are illustrations, not proof of actual clients.
- **Actual process video is currently configured and plays**; fallback dialog is only for absent media. Test both states deliberately. No text tracks currently provided; inspect audio/meaning before specifying text alternative/captions.
- Testimonial/contact decorative videos autoplay under reduced motion; replacing those surfaces is recommended. Retaining process video does not require retaining decorative autoplay.

## 8. Visual, responsive, CTA and SEO implementation guidance

- Keep blue/green/cream identity, typography and rounded vocabulary; no generic dashboard redesign. Correct contrast using measured combinations, not global palette replacement.
- Homepage services become compact rows/groups; detail pages retain their current explanatory content/images. Prefer adapting existing conventions in `inner-pages.tsx`, not a new component library/dependency.
- On mobile all group/service labels visible without horizontal-only navigation. No nine full-image stacks, oversized empty minimum heights or auto-advancing review carousels. Check 810px contact two-column behavior independently.
- Static trust facts avoid transient zeros and animation demand; current counters aren't stuck/broken. Don't implement complicated counter fallbacks to solve a capture artifact.
- Preserve keyboard/focus/Escape semantics, native dialogs, FAQ control names/states, reduced-motion hero fallback, tel/mailto/clipboard behavior.
- One dominant service discovery path, obvious contact alternative at hero/nav, contextual contact after proof/process, existing final form. Don't add a CTA every screen or invent free appointments/WhatsApp.
- Contact payload unchanged by default: name, email, phone, services[], goal, message, consent, website honeypot; services validated against Strapi. Do not drop server validation/privacy consent/body limits/timeouts.
- No real submissions during tests. Preserve 503 for unconfigured delivery and distinct loading/success/error/retry behavior. A success mock is not proof of production email delivery.
- Keep all 25 canonical pages and existing redirects, query preselection, titles/canonicals and indexing boundaries. Move detailed copy to existing routes only when appropriate; don't delete SEO intent just to shorten home.
- Organization JSON-LD deliberately excludes fabricated rating/awards. Article URL is already absolute. Home canonical already exists. No false “fix” of old audit findings. No promise of FAQ rich-result eligibility.
- Default preview robots disallows indexing without SITE_URL. Do not enable indexing or change security headers/deployment settings in this restructuring task.

## 9. Files expected to change after approval

Likely core scope:
- `src/app/page.tsx` — approved composition/props; no route rewrite.
- `src/components/home-hero.tsx` — compact trust/relocated newsletter/Comparison presentation; protect timeline.
- `src/components/home-sections.tsx` — services grouping, compact proof/founder/process/resources, remove redundant render paths without destroying useful media/content.
- `src/components/faq.tsx` — optional selected-home variant without breaking other consumers.
- `src/components/contact.tsx` and `src/app/contact.css` — confirmed reduced-motion fix, calmer homepage presentation; preserve shared contact route/form.
- `src/components/site-shell.tsx` only if footer copy/layout or explicit nav label approved; preserve menus/wordmark.
- `src/app/globals.css` — scoped layout/spacing/responsive/contrast/media changes; audit shared selectors before edits.
- `tests/home-motion.spec.ts`, `tests/pages.spec.ts`, `tests/forms.spec.ts` — failing regression tests first; approved behavior and media-state fixtures, not blanket deleted assertions.

Only when needed/approved:
- `src/components/inner-pages.tsx`, selected service/About/Online Services pages — existing content destinations/FAQ answers. Avoid modifying every page simply because a shared type exists.
- `src/lib/strapi.ts`, `content.ts` — only for agreed new typed fields; existing data can support most layout changes. No second CMS/page-builder.
- CMS source/schema/content — **separate authorization required**, despite repository location now known. Draft proposed text in review; do not write hosted content with an admin tool.

### Files/systems NOT to unnecessarily change

`package.json`/lockfile, Next/TypeScript/PostCSS configs, deployment/DNS/security policies, `.env*`, API transport/validation, source URLs/redirects, structured-data policy, original images/video, unrelated inner pages, CMS bootstrap/permissions/database. No new dependencies needed for this plan. Do not edit `trial`/backup main. Don't purge unused components/assets without specific approval and dependency checks.

## 10. Baseline defects and verification results (before implementation)

| Check | Result / action needed |
|---|---|
| `npm run typecheck` | PASS |
| `npm run build` with local CMS URL | PASS; production bundle built locally, not deployed |
| Browser canonical crawl | 25 pages desktop/mobile: all 200, loaded images, no observed overflow/pageerror |
| Homepage geometry | Four requested widths; all homepage images decoded successfully |
| Full `npm test` | **33 PASS, 6 FAIL** (39 total) |
| Four process failures | `tests/pages.spec.ts:56` expects fallback dialog with real process video configured. Update tests for both explicit content states only after approval |
| Mobile hero failure | `home-motion.spec.ts:23`, 390px statement y≈−1,100 rather than 0; current normal-flow mobile CSS conflicts with protected test. Owner decision required |
| Parallel `/blog` 500 at 1200px | One full-suite failure; isolated all-route/asset/overflow 1200px rerun **PASS (1 test)**. Transient cause unconfirmed, not declared fixed |
| Old content validator | `node scripts/complete-content.mjs --validate` FAILS at line11: `content.validateContent is not a function`; stale file-backed validation incompatible with current types/Strapi source |
| Current stat counters | PASS settlement in normal/reduced motion: 15+,1,200+,12+,5.0/5 |
| Process video | PASS click-to-play/controls; no text tracks |
| Mobile nav | Service submenu visible; Escape closes and returns focus to toggle |
| Independent four-width follow-up | `evidence/final-checks.json`: phase selection, actual video playback/controls, founder dialog/Escape focus, testimonial and FAQ all PASS at 1440/1200/810/390px. Covers later checks skipped by stale process-dialog expectations |
| Reduced-motion Contact repeat | Same opacity0 defect reproduced at 390px as well as 1440px |
| Reduced-motion Contact intro | **Confirmed defect:** copy/details opacity0 after 2.5s; normal mode opacity1. Source initial vs empty-final targets mismatch |
| Green CTA/after-card/chart text | **Confirmed ~2.21:1 contrast**; threshold4.5 for small text |
| Reduced-motion decorative video | **Confirmed autoplay when scrolled into view**, no user pause control, at 1440 and390 |
| Real delivery / current external portals | NOT certified; no real submissions, login or payment |
| Screen reader / full accessibility conformance | NOT certified; targeted checks only |

Initial test trace folder was excluded by ignore-based read permissions. Do not work around this. Terminal failure detail is recorded; isolated rerun artifacts were generated under approved `docs/audit/evidence/retest-results`. If deeper trace investigation is needed, request specific access or reproduce into an approved location.

### Source-supported risks to keep separate from reproduced bugs

CMS-unavailable fresh-render/contact error behavior; no custom root error fallback; hardcoded About sitemap slugs can drift from CMS; optional empty OG media; no rate limiter/analytics found. Cached pages can still serve during outages. Do not claim every page instantly fails or a specific vulnerability was exploited. No fault injection against CMS was performed.

## 11. Acceptance criteria for future implementation

### UX / content
- [ ] WHO/WHAT/locality/next action understandable from initial viewport, without long reading.
- [ ] Early trust uses verified or clearly qualified facts/real identity, not fabricated authority.
- [ ] All nine existing service categories quickly scannable; each links to correct canonical detail.
- [ ] One compact proof block and one founder/why block; no duplicate FeaturedCase/stat/quote stack.
- [ ] Further detail remains available; no silent deletion of useful FAQ/education/source material.
- [ ] Actual client or staff feedback validates understanding; no invented research scores.

### Visual / scroll
- [ ] Fewer competing cards/images/animations; deliberate whitespace and comfortable type.
- [ ] ~9,000–10,500px desktop at1440×900; ~9,500–11,500px mobile390×844 in default states, or document justified variance.
- [ ] Earlier service/proof coordinates verified against baseline; no hiding content to hit budgets.
- [ ] Protected hero/statement pin/reversal and footer wordmark/hover preserved unless explicitly approved otherwise.
- [ ] Shared shell/inner pages not accidentally restyled by broad CSS selectors.

### Trust / conversion
- [ ] Date/clients/rating/award/role claims approved and substantiated to stated level.
- [ ] No current licence from old certificate, employer endorsement, guaranteed returns, fake reviews or free-call promise.
- [ ] Contact actions clear at logical decision points; no manipulative urgency/spam.
- [ ] Form validates and routes identically unless separately approved; real deployment delivery later verified with owner authorization.
- [ ] Readable privacy/terms/consent and direct phone/email fallback.

### Mobile / accessibility
- [ ] Four target widths plus zoom checked; no unintended horizontal overflow or truncated service labels.
- [ ] No horizontal-only service discovery, long repeated mobile cards or unnecessary minimum heights.
- [ ] Contact intro visible under reduced motion; decorative media static or user-controlled.
- [ ] Text contrast at least4.5:1 normal /3:1 large; visible focus and adequately sized/spaced targets evaluated.
- [ ] Keyboard/dropdowns/tablist/dialog/Escape/focus restoration and form error announcements verified.
- [ ] Process media has appropriate accessible alternatives after actual content review.

### Function / SEO
- [ ] All25 canonical pages, blog categories, aliases and unknown404 behavior remain correct.
- [ ] Service-query preselection and external portal destinations preserved.
- [ ] Forms tested with mocks for validation, errors, retry, loading, success and pre-hydration privacy.
- [ ] OneH1, canonical/title/description/structured data and preview robots preserved.
- [ ] Typecheck/build pass; all tests pass or remaining baseline issues clearly documented—no assertion bypass.
- [ ] No newly logged personal form data, new deployment or unauthorized CMS writes.

## 12. Verification commands and evidence reproduction

With Strapi already running, frontend stopped for Playwright:

```powershell
$env:STRAPI_URL='http://localhost:1337'
npm run typecheck
npm run build
npm test
```

The legacy `node scripts/complete-content.mjs --validate` is currently broken; do not fix it by restoring the obsolete content architecture. A read-only Strapi-aware validation approach should be designed after approval.

With frontend3100 running (do not run concurrently with `npm test`):

```powershell
node docs/audit/evidence/capture.mjs
node docs/audit/evidence/summarize.mjs
node docs/audit/evidence/inspect.mjs
python docs/audit/evidence/contact-sheets.py
node docs/audit/evidence/final-checks.mjs
node docs/audit/evidence/validate-audit.mjs
```

These overwrite generated **audit evidence only**. `capture.mjs` measures normal-motion homepage and crawls canonical links; `inspect.mjs` adds reduced-motion route screenshots and supplemental interactions/redirects. Python uses installed Pillow. External content research is cited in FINAL; no competitor claims copied.

For motion-specific existing checkpoints (if needed after approved retiming): `node scripts/inspect-reference.mjs --motion --local`. Scroll before screenshots and wait for settles; don't call untriggered counters zero clients or full-page sticky artifacts layout bugs.

## 13. Suggested staged implementation AFTER approval

1. Confirm claim/role/motion/content decisions; re-read current git diff/CMS data. Record approval exactly.
2. Add regression tests for reduced-motion Contact visibility, media preference and relevant contrast checks; resolve baseline test fixture expectations intentionally. Don't change production until authorized.
3. Implement compact service presentation retaining routes, shared data and form preselection. Re-measure main scroll win before changing decorative systems.
4. Move compact proof/founder up; merge comparison/overview useful copy. Preserve shared hero/statement mechanics and footer behavior; verify reversal/resize.
5. Compact process/FAQ/resources and relocate newsletter. Ensure content destinations and media controls remain accessible.
6. Simplify contact/footer surroundings, fix verified readability/motion issues, keep payload/consent/utility contracts.
7. Run all route/form/motion tests, build/typecheck, four-width browser review and SEO checks; review production diff for scope creep.
8. Obtain separate launch/compliance/delivery approval. No silent deployment.

## 14. Continuation status / unresolved owner decisions

**Completed:** graph/code inspection, actual CMS startup/reachable media, four-width homepage inventory, all25 canonical route inspection, seven independent Agency reviews + supporting technical/industry reviews, source-backed claim ledger, current competitor references, scores/decision matrix, target architecture/budgets, six requested documents, build/typecheck/full test and isolated rerun. Production code/content unchanged by audit.

**No implementation started.** Next agent's first task is approval, not coding. Still unresolved:
1. Approve eleven-block target and presentation-only removals/merges.
2. Confirm regulated role/current credentials, reportable metrics and testimonial excerpts/permissions.
3. Choose mobile hero intended behavior against the existing protected test; optionally approve desktop timeline shortening.
4. Approve optional process-video placement/static decorative backgrounds and moving newsletter below primary decision content.
5. Confirm desired form requirements/response promise and actual delivery configuration for launch.
6. Resolve initial intermittent `/blog`500 if it recurs; update obsolete validation/test assumptions through an approved task.
7. Approve legal text, indexing/deployment origin and any future analytics separately.

The agency review corrections in FINAL are important: early CTAs DO exist; counters settle; there are nine services/eight award photos/eleven testimonials; `/cases/[slug]` is not a real case route; actual process video is connected. Do not reuse uncorrected agent hypotheses as facts.
