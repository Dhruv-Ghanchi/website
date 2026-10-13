# Ghanchi Investments — Second Full Website Audit

**Re-audit of the current implementation after owner changes**  
Date: 12 October 2026
Baseline: [FINAL-AUDIT.md](FINAL-AUDIT.md) (30 September 2026) and its supporting documents 01–04 + IMPLEMENTATION-HANDOFF.
Status: **Audit complete. No production code, CMS content, or environment files were modified.**

Evidence collected this audit: `docs/audit/evidence-second/measurements.json`, `runtime-checks.json`, `screenshots/` (fresh 1440/390 checkpoint captures + full-page route sheets at 1440 and 390), produced by `evidence-second/capture.mjs` and `runtime-checks.mjs`.

---

## 1. Executive summary

**Verdict: substantially improved and structurally close to the recommended architecture, but not yet launch-ready.** The previous audit's two biggest structural problems — the 3,258px comparison scene and the nine full-page service presentations — are gone, and the founder, team, and real award/certificate evidence now appear dramatically earlier. The full Playwright suite is green (55/55, previously 33 pass / 6 fail) and all 25 canonical routes render cleanly at desktop and mobile.

**Biggest improvements**
- Homepage shrank ~39–42%: **22,541 → 13,687px** desktop (25.05 → 15.2 viewport heights) and **24,272 → 14,039px** mobile (28.76 → 16.6 heights).
- Services collapsed from 6,406px / 9,696px to **1,758px / 1,801px** as a CMS-driven gallery of portrait tiles; all nine services remain directly linked.
- Named client proof moved from y15,413 to **y4,458**; the real founder/team + award evidence moved from y14,471 to **y6,312** (desktop).
- The dated November 2021 newsletter card, repeated contact stats/quote, and the duplicated FeaturedCase overview are removed; the test contracts were updated honestly rather than bypassed.

**Remaining concerns**
- **Three previously-confirmed defects are still live**: the reduced-motion Contact page intro is still invisible (reproduced again at 1440 and 390), mint buttons still measure ~2.21:1 contrast, and decorative testimonial/contact videos still carry unconditional `autoplay` attributes.
- **New regression**: the hero is now a ~7MB MP4 that **still autoplays under `prefers-reduced-motion`** (SSR emits the `autoplay` attribute; hydration removes it but playback continues) and downloads unconditionally via `preload="auto"`.
- **New regressions in trust depth**: team pills show a `+` affordance and hover state but are no longer interactive — the founder bio dialog and the link to `/about-us` are gone.
- The 9-item tile grid orphans a lone tile on its own row at every tested width; tiles carry no descriptive copy, so service differentiation depends entirely on names.
- `.env` still points `STRAPI_URL` at an unreachable LAN address — a fresh `npm run dev` without the process-level override breaks every page.

The page is now a credible "identify → see proof → meet the person → understand the process → enquire" journey. What remains is mostly correctness and polish, not restructuring.

---

## 2. Before vs After — status of every previous recommendation

Baseline recommendations are the section decisions in `03-section-decision-matrix.md` / `04-recommended-information-architecture.md` plus the ranked findings in `FINAL-AUDIT.md` §4. All classifications verified against the running site on 12 October 2026.

### Section decisions

| Previous recommendation | Status | Evidence |
|---|---|---|
| 01 Header — KEEP | No longer relevant (unchanged, still works) | Header present, fixed, phone + Contact Us + dropdowns working; logo enlarged to 52px |
| 02 Hero — KEEP + REDUCE (compact trust, drop newsletter card) | Partially implemented | Newsletter card removed entirely; trust badge + India/UAE/USA ticker retained; no founder micro-proof added; hero is now an autoplaying video (see §9) |
| 03 Statement + spacer — KEEP | Fully implemented | `hero-statement` + `hero-scroll-space` preserved; mobile renders static 230px statement; pin/reversal tests updated and pass |
| 04 Comparison — MERGE into founder/why | Fully implemented | `Comparison` no longer rendered (`page.tsx`); its "coordinated plan" message survives inside `servicesIntro` copy: "We bring planning, protection and investing together around your life." Component code remains but is unused |
| 05 Services — KEEP + REDUCE to grouped selector | Partially implemented (different approved design) | Now a 9-tile portrait image gallery (`ServiceTile`), 1,758px D / 1,801px M vs 6,406/9,696 before. All nine `/services/{slug}` links preserved. No grouping labels, no one-line benefits — deviation from the proposed grouped-rows design, superseded by the owner-approved tile reference |
| 06 Process — KEEP + MOVE DOWN, compact | Partially implemented | Moved after proof + person (now position 7). Height unchanged (2,107px D / 2,219px M); video still a default 743px canvas. Phase cards improved: all four previews always mounted, testimonial-style flex 1→2 hover/focus/tap expansion, reduced-motion respected |
| 07 Founder — KEEP + MOVE UP + merge recognition | Implemented with regression | Moved to y6,312 D / y5,154 M (was y14,471/y14,146). Recognition merged in as a real-scan marquee + Awards/Certificates buttons. **But** the bio dialog was deleted and no replacement link to `/about-us` exists — the founder story is no longer reachable from the homepage |
| 08 Testimonials — KEEP + MOVE UP, compact | Partially implemented | Moved up to y4,458 D / y2,667 M. Still carries feature card + 3-item list + 4-stat grid + founder callout CTA (1,854px D / 2,488px M) — the "compact named proof" reduction was not done |
| 09 FeaturedCase — MERGE | Fully implemented | Removed from rendering; duplicate stats/quote/service-list eliminated. Component remains as dead code |
| 10 FAQ — KEEP + REDUCE to selected questions | Not implemented | Unchanged 4-category tab UI, 888px D / 789px M. Acceptable as-is; the compaction was optional |
| 11 Insights — KEEP + REDUCE | Not implemented | Unchanged two large cards, 729px D / 1,288px M, dates/archive labelling intact |
| 12 Contact — KEEP + REDUCE | Partially implemented | Embedded testimonial and the duplicated 1,200+/15+ stats removed (1,090px D / 1,537px M). Decorative glass-shard video retained; benefits list retained |
| 13 Footer — KEEP + REDUCE | Partially implemented | Repeated vision sentence removed from the footer message; wordmark, layered hover, disclosure, newsletter form all preserved |

### Ranked findings from the previous audit (§4)

| # | Previous finding | Status | Evidence |
|---|---|---|---|
| 1 | Nine full service presentations delay proof (6,406/9,696px) | Resolved | Tile gallery, 1,758/1,801px; services top moved y5,958→y2,700 D, y2,672→y866 M |
| 2 | Reduced-motion Contact intro invisible | **Not fixed — reproduced again** | `runtime-checks.json`: `.contact-intro-copy` and `.contact-intro-details` computed `opacity: 0` at 1440×900 and 390×844 under `prefers-reduced-motion`; `contact.tsx:44-47` unchanged pattern (`initial={reduced ? false : …}` + empty `animate` target vs SSR-rendered `opacity:0`) |
| 3 | Comparison costs 3.62 desktop screens | Resolved | Removed |
| 4 | Mint controls ~2.21:1 text contrast | **Not fixed** | Re-measured identical: `#fffffa` on `#76c143`, 15px/600 "Our Services" hero button |
| 5 | Named proof / founder too late | Resolved positionally | Testimonials y4,458; founder+team y6,312; recognition scans visible in marquee |
| 6 | Lower page repeats the same proof types | Partially resolved | FeaturedCase stats/quote/list removed; contact stats+quote removed. Testimonials still stacks feature + 3 quotes + 4-stat grid + founder CTA — two proof mechanisms in one section remain |
| 7 | Decorative autoplay under reduced motion | **Not fixed — and regressed** | `testimonial-bg` and `contact-bg-video` still render `autoPlay muted loop` unconditionally; **new:** the hero itself is now a video that plays under reduced motion (SSR `autoplay` attr removed only after hydration starts playback) |
| 8 | Dated newsletter given hero prominence | Resolved | `hero-case` card removed; `/newsletters` archive unchanged with honest dates |
| 9 | Form/launch expectations, professional status, legal drafts | Unchanged — still owner gates | `CONTACT_WEBHOOK_URL`/`NEWSLETTER_WEBHOOK_URL` still unconfigured (503 by design); legal pages still `noindex` drafts; credential/role wording still owner-verified ("financial advisor" wording approved per AGENTS.md) |
| 10 | Test contracts out of sync (6 failures) | Resolved | Suite now **55/55 pass** (previously 33/6): process tests handle video-present and dialog-fallback, mobile statement test asserts the real static layout, new specs cover tile gallery dynamics, phases, reduced motion |

### Child-element decisions

| Element | Previous decision | Status |
|---|---|---|
| Hero November 2021 newsletter card | Move downward | Implemented — removed from hero entirely |
| PlanningChart | Remove from homepage | Implemented — no longer rendered |
| Service photos/quote overlays/deliverable stacks on home | Remove | Implemented — replaced by title-only tiles |
| 01–09 service numbering | Remove | Implemented |
| Large process video frame | Collapse from default flow | **Not implemented** — still a ~743px default canvas |
| Recognition panel | Merge into founder block with both archive links | Implemented + exceeded — adds a real-scan marquee (27 items, `showOnHomepage` flag) |
| Four-stat grid | Consolidate | Not implemented — still inside testimonials |
| Founder CTA under testimonials | Merge | Not implemented — founder callout retained |
| Decorative testimonial/contact video backgrounds | Replace with static surface | **Not implemented** |
| Footer wordmark/layered hover | Keep | Implemented — preserved |

**Net assessment:** 6 of 13 section decisions fully implemented, 6 partially, 1 not (FAQ — optional). Of the ten ranked findings: 4 resolved, 2 partially resolved, 3 not fixed, 1 unchanged owner-gate — plus one genuine new regression (hero video under reduced motion) and two smaller regressions (dead pill affordance, unreachable founder bio).

---

## 3. Current homepage scroll map (measured 12 Oct 2026)

Rendered at `localhost:3100` against local Strapi (`localhost:1337`). Heights include padding; viewport equivalents = height ÷ viewport height.

### Desktop 1440×900 — total 13,687px / 15.2 viewport heights

| # | Section | y-range | Height / vh% | Purpose | Verdict on position |
|---|---|---|---|---|---|
| 01 | Header (fixed overlay) | — | 60px overlay | Nav, dropdowns, phone, Contact Us, founder-photo "Get in touch" | Correct |
| 02 | Hero — "A personal financial advisor for Navi Mumbai families, trusted since 2009." | 0–900 | 900 / 100% | Identity, promise, two CTAs, trust badge (1,200+ clients, 5.0/5 qualified), geography ticker | Correct; now video-backed |
| 03 | Statement — "Making goal-based financial advice accessible to all." + spacer | 900–2,700 | 1,800 / 200% | Protected pinned brand moment | Intentional tradeoff; unchanged per rules |
| 04 | Services — "Services." | 2,700–4,458 | 1,758 / 195% | 9 portrait image tiles → detail pages; coordinated-planning intro copy | Correct position (was the recommendation: ~y2,700) |
| 05 | Testimonials | 4,458–6,312 | 1,854 / 206% | Neeta Agrawal feature quote + 3 expandable quotes + rating + 4-stat grid + founder CTA | Right place, still oversized |
| 06 | Team — "Meet your advisor. A personal partnership." | 6,312–7,574 | 1,262 / 140% | 3 named team members + "Recognition. Built on service." + scan marquee + archive links | Correct; depth regressed (see §5) |
| 07 | Process — "Your goals come first. The plan follows." | 7,574–9,681 | 2,107 / 234% | 4 phase cards (all previews mounted) + "How we work" video canvas + 3 operating principles | Correct order; height unchanged — biggest remaining block |
| 08 | FAQ | 9,681–10,569 | 888 / 99% | 4 categories, 11 questions | Correct |
| 09 | Insights — "Knowledge for your next chapter." | 10,569–11,298 | 729 / 81% | 2 dated March-2021 article cards | Correct |
| 10 | Contact — "Let's plan your next chapter." | 11,298–12,388 | 1,090 / 121% | Benefits + enquiry form (consent, service pills, validation) | Correct; calmer than before |
| 11 | Footer — "Subscribe to our newsletter." | 12,388–13,687 | 1,299 / 144% | Address, phones, emails, socials, legal, disclosure, wordmark | Correct |

### Mobile 390×844 — total 14,039px / 16.6 viewport heights

| # | Section | y-range | Height / vh% | Note |
|---|---|---|---|---|
| 01–02 | Header + Hero | 0–635 | 635 / 75% | Trust badge visible in first viewport (y490) |
| 03 | Statement (static, no pin) | 635–865 | 230 / 27% | Protected mobile adaptation |
| 04 | Services | 866–2,667 | 1,801 / 213% | 2-col tiles; 9th tile orphans onto its own row |
| 05 | Testimonials | 2,667–5,154 | 2,488 / 295% | Largest mobile block; feature + 3 stacked quote cards + stats + callout |
| 06 | Team | 5,154–6,665 | 1,511 / 179% | Pill role text wraps to 4 lines; marquee works |
| 07 | Process | 6,665–8,884 | 2,219 / 263% | Phase cards stack vertically, all previews readable |
| 08 | FAQ | 8,884–9,673 | 789 / 93% | Correct |
| 09 | Insights | 9,673–10,961 | 1,288 / 153% | Two stacked cards |
| 10 | Contact | 10,961–12,498 | 1,537 / 182% | Form stacks cleanly |
| 11 | Footer | 12,498–14,039 | 1,541 / 183% | Correct |

### Other widths
- 1200×900: 13,387px (was 22,332, –40%). Same 4-4-1 tile rows as 1440.
- 810×1080 tablet: 15,542px (was 21,409, –27%). Statement keeps its pinned scene; tiles run 2-col; phases stack. Tablet is now the *tallest* page in absolute px — the pinned intro is proportionally heavier there.

### Where proof now sits
- Services discovery: y2,700 D / y866 M (before: y5,958 / y2,672). **Matches the recommended position almost exactly.**
- First dedicated named testimonial: y4,458 D / y2,667 M (before: y15,413 / y14,856).
- Founder/team identity: y6,312 D / y5,154 M (before: y14,471 / y14,146).
- Real award/certificate imagery: y7,319 D / y6,475 M (before: link-only, no images).
- Embedded enquiry form: y11,298 D / y10,961 M (before: y20,026 / y20,799) — roughly halved the scroll distance.

---

## 4. Client perspective review

**What a first-time visitor now understands quickly:** a Navi Mumbai advisory firm since 2009, with named real staff, nine clearly-titled service categories reachable within ~1 mobile screen / ~3 desktop screens, named client quotes, genuine-looking award scans, a 4-step engagement process, and multiple contact routes (header phone, hero CTA, mid-page callout, end form).

**What they will trust:** the founder photo and real team names; the certificate/award marquee (actual scans beat badge claims); attributed testimonials with archive links; the honest rating qualifier; the office address/phones/hours in footer and contact page.

**What they may question:**
- *"Why is there a lone card on the last row?"* — the 9th tile (Employer Employee Insurance) sits alone at every width; reads as an accident, not a design choice.
- *"What does Personal Accidental Policy actually cover?"* — tiles are name-only; two insurance categories are hard to distinguish without clicking through. The old cards' one-line benefit copy is gone entirely.
- *"Can I click these people?"* — the team pills show a `+` icon and light up on hover but do nothing. A clicked-plus expectation is created and then denied; there is also no "read Chandrakant's story" path from the homepage at all.
- *"5.0/5 · Google rating on existing site"* — the honest qualifier still reads like developer notes rather than client-facing copy.
- *"Is this video relevant?"* — the hero motion graphic is abstract fintech animation; the testimonials background shows a visibly non-Indian family (the handoff already flags this asset for replacement).
- *Certificate thumbnails open raw image files* in a new tab with no caption — usable, but context-free and they point at the CMS origin.

**Likely behaviour:** an insurance/investment client can now find their category, see named proof and a real person before being asked anything, and reach the form or phone without the old 20,000px journey. The remaining friction is mostly credibility nitpicks and the accessibility defects below — not navigation.

---

## 5. Section-by-section audit

### 01 Header
- **Works:** fixed pill nav, dropdowns with real parent links, phone icon, Contact Us, mobile hamburger + submenu + Escape handling (tested), skip link. Larger logo improves identity.
- **Issue:** none new.
- **Action:** keep.

### 02 Hero
- **Works:** clear local identity + since-2009 + two CTAs + qualified trust badge in first viewport on all widths. Newsletter card removed as recommended. Video-mode support is implemented (`home-hero.tsx` renders `<video>` for mp4/webm/mov).
- **Does not work:** (a) under `prefers-reduced-motion` the video **still plays** — SSR emits `autoplay` because `useReducedMotion()`'s server snapshot is `false`; hydration strips the attribute but playback already started (verified: `paused: false` at 1440 and 390 under reduced motion). (b) ~7MB MP4 with `preload="auto"` downloads for everyone including reduced-motion users; (c) no poster/fallback image if video fails or is suppressed; (d) the "Google rating on existing site" phrasing.
- **Action:** render the hero `<video>` without the `autoplay` attribute at SSR level (or gate on a client media query before mount), add a poster image field, drop `preload="auto"` to `metadata`, and consider `lazy` delivery on mobile. Reword the rating qualifier for clients.

### 03 Statement + spacer
- **Works:** protected pin/reversal intact desktop/tablet; static short block ≤560px; tests now encode this intentionally.
- **Action:** keep; no change recommended.

### 04 Services (tile gallery)
- **Works:** 9 tiles, all canonical links, CMS `order`-driven, image focal points, `onError` → icon fallback, empty-collection state, focus-visible ring, arrow animation suppressed under reduced motion, dynamic-collection tests exist (`home-sections.spec.ts`). 1,758px vs 6,406px.
- **Does not work / gaps:** (a) measured 4-4-1 tile rows at 1440 and 1200 — the 9th tile sits alone on a mostly-empty row at every tested width (tiles measured at x164/448/732/1016 row 3 → only x164 occupied); (b) titles only — no benefit line, no grouping; "Personal Accidental Policy" vs "Health Insurance" is not differentiable from the tile alone; (c) no section-level CTA (old cards had nine `?service=` contact links); (d) tile text sits over arbitrary photography — shade helps, verified readable in captures.
- **Action:** keep the gallery (owner-approved). Either force 3 columns (3×3) or let the grid reach 5 columns ≥1,396px so rows are 5-4 or 3-3-3; add one short descriptor per tile (re-use `shortDesc`) and a single "Can't find what you need? Contact us" line under the grid.

### 05 Testimonials
- **Works:** moved before the founder block — proof now precedes the person, matching the recommended order; real names + employer context + archive links retained; honest rating note.
- **Does not work:** still three stacked mechanisms — 628px feature card, 356–922px list, 236–327px stats grid, 294–348px founder callout — 1,854px D / 2,488px M. The count-up stats and "Talk about your goals" callout repeat proof the page has already made (and now duplicates what the recognition marquee does better). The autoplaying background video is unchanged under reduced motion, and its footage is the non-Indian family clip flagged in the CMS handoff.
- **Action:** compact to feature + list OR feature + stats — not both plus a callout. Drop or merge `founder-callout` (team section now covers the person). Replace or statically poster the background video; swap footage when the approved Indian asset exists.

### 06 Team / founder / recognition
- **Works:** real three-person team (Chandrakant B. Ghanchi — Director, Founder and Financial Advisor; Hitesh Mhadaye — CRM; Faiziya Tazeemtark — Office Administrator), real headshot + initials fallback, awards + certificates buttons, marquee of 27 genuine scans, hover-pause, reduced-motion disables animation.
- **Does not work:** (a) pills carry a `+` icon and hover background but are inert `<div>`s — affordance without behaviour; the previous bio dialog was deleted and nothing replaced it: **the founder biography is unreachable from the homepage**; (b) marquee thumbs open raw `…/uploads/*.webp` in a new tab — no caption, exposes CMS origin; (c) mobile pills squeeze role text into a narrow column (4-line wrap); (d) dead `.founder-grid`/`.team-row`/`.team-dialog` CSS remains.
- **Action:** make each pill a link to `/about-us#{member.id}` (or restore a dialog); link thumbnails to the archive pages or add a lightbox with the record title; tighten mobile pill layout.

### 07 Process
- **Works:** all four phase previews mounted (no hover-only discovery), flex 1→2 expansion works on hover/focus/click, reduced-motion disables layout animation, operating principles retained, click-to-play video with native controls works, dialog fallback retained for missing media.
- **Does not work:** height unchanged — the 743px 16:9 video canvas is still a full default screen; heading + accordion + video + operating row is still four stacked units.
- **Action:** optionally collapse the video into a smaller inline player or move behind the play affordance; keep everything else.

### 08 FAQ
- **Works:** unchanged, accessible tabs, real answers (claim support, portals, no-guaranteed-returns).
- **Action:** keep; optional future compaction to the top 4–5 questions.

### 09 Insights
- **Works:** two honestly-dated adapted articles, archive positioning, View All.
- **Action:** optional compaction to rows; fine as-is.

### 10 Contact
- **Works:** testimonial + duplicate stats removed; benefits retained; validation, consent, honeypot, service pills, async states all functioning (suite covers them); 503-by-design when unconfigured.
- **Does not work:** reduced-motion invisibility bug persists on `/contact-us` intro (P1); `contact-bg-video` still autoplays in view under reduced motion.
- **Action:** fix the `initial`/`animate` reduced-motion branch; gate the background video or provide a static surface.

### 11 Footer
- **Works:** mission copy trimmed; address/phones/emails/socials/legal/disclosure/wordmark intact; newsletter consent flow tested.
- **Action:** keep.

---

## 6. Trust & credibility audit

**Improved since baseline:**
- Real award and certificate scans are now *visible* on the homepage (27-item marquee) — the strongest new trust surface; previously recognition was a text link only.
- The team is now three real named people with roles, not a single founder row.
- Founder identity arrives ~8 desktop viewports earlier than before.
- All claims remain qualified (archive wording, "reported on our existing website" rating note, honest newsletter dates).

**Unchanged claim risks (still owner-verification items, not new findings):**
- `12+ awards` — still displayed in the stats grid; 8 award photos + 19 certificate scans still don't substantiate "12 distinct awards". The marquee now makes this *checkable* rather than resolved.
- `1,200+ clients`, `since 2009`, `15+ years`, `5.0/5` — owner-approved promotional claims (per AGENTS.md); rating remains site-reported, not a live feed.
- Role wording is now "Director, Founder and Financial Advisor" (CMS) — owner-approved wording per AGENTS; regulatory-capacity framing remains an owner/compliance item, not a design defect.
- No fabricated stats were introduced — verified.

**New trust concerns:**
- Founder bio unreachable from the homepage (see §5.06) — name/role visible but the "who is this person" answer now requires navigating to `/about-us` with no pointer.
- Marquee scans are unlabelled on the homepage (title attribute only) — a visitor sees imagery but not what each item certifies; keep archive captions authoritative.
- Testimonial video still shows a non-Indian family — an authenticity mismatch next to otherwise Indian imagery (already tracked in the CMS handoff).

---

## 7. Design & UX audit

- **Hierarchy:** dramatically better — each section now answers a different question instead of re-answering "personal goals-based planning". Remaining repetition: stats grid + founder callout inside testimonials.
- **Spacing:** still airy (large `section-space`, oversized display titles) but no longer punishing; the lone-tile row creates the only visually broken whitespace.
- **Typography:** Manrope/display scale consistent; services intro carries the merged comparison message elegantly.
- **Visual consistency:** the mint-green rounded team panel is loud next to cream/paper neighbours but consistent with the inherited Kora language; tile radius/arrow/cutout treatment is distinctive and well executed.
- **Motion:** statement pin, reveals, tile arrows, phase expansion, marquee — all respect reduced motion *except* the three video surfaces (hero now included).
- **Cognitive load:** much lower. The busiest remaining surfaces are the testimonial stack and the hero video's abstract chart animation.
- **Mobile:** tiles read well at 2 columns; team pill role text wraps awkwardly; testimonial block remains the longest mobile section (295% of viewport).

---

## 8. Conversion & content audit

- **CTAs:** header phone + Contact Us at all times, hero "Our Services"/"Get in touch", testimonials callout → `/contact-us`, contact form, footer contacts. Slightly *fewer* CTAs than before (nine per-service buttons removed) — acceptable since service pages carry their own contact preselection links; a single services-section-level contact line would restore balance.
- **Forms:** contact + newsletter unchanged — validation, consent, honeypot, 503-when-unconfigured all verified by the suite; `/api/contact` origin/JSON/size/honeypot/field validation intact in `route.ts`.
- **Service discovery:** much faster to scan; weaker at differentiating similar products (name-only tiles).
- **Repeated messaging:** FeaturedCase duplication eliminated; contact duplication eliminated. Testimonials still self-repeats (quote + rating + stats + founder pitch).
- **Barriers:** the reduced-motion contact bug literally hides phones/address/hours from a subset of users — the single most damaging remaining issue. No required-field changes made or recommended.

---

## 9. Technical & regression audit

| Check | Result | Evidence |
|---|---|---|
| Playwright suite | **55/55 pass** (was 33 pass / 6 fail) | Full run, `STRAPI_URL=http://localhost:1337 npm test`, 1.7m |
| Typecheck | Pass | `tsc --noEmit` clean |
| 25 canonical routes | All 200 at 1440 and 390; 0 broken images; 0 horizontal overflow; 0 pageerrors | `measurements.json` |
| Canonicals / titles / H1 | Present on all 25; legal pages `noindex` | `measurements.json` route table |
| robots.txt | `Disallow: /` (preview, intended; `SITE_URL` unset) | curl |
| sitemap.xml | Serves canonical ghanchiinvest.com URLs | curl |
| Nine services | All reachable + linked from home tiles and `/services` catalog | capture + tiles test |
| Strapi integration | Working; `showOnHomepage` flag drives marquee; 9 services, 27 gallery items, 3 team members | runtime-checks.json |
| Forms | Client validation + API validation verified; delivery intentionally 503 unconfigured | suite + route.ts review |
| Reduced motion | **3 defects**: contact intro invisible (reproduced), hero video autoplays (reproduced), testimonial/contact bg videos still `autoplay` in code | runtime-checks.json |
| Contrast | Mint button `#fffffa` on `#76c143` = 2.21:1 — unchanged | computed styles |
| Dead code | `Comparison`, `FeaturedCase`, `PlanningChart`, `team-row/dialog`, `.service-card` stack, `.founder-grid` block, unused `AboutPageContent` type import, unused `newsletter`/`newsletterCard` hero props + `getNewsletters()` fetch, stray `nul` file | grep + diff review |
| `.env` | `STRAPI_URL=http://192.168.1.203:1337` unreachable — any dev/test run without the process-level override breaks every page (strapiFetch throws, no error boundary) | curl 000 |
| Hero media weight | `hero-background.mp4` = 6.98MB, `preload="auto"` | curl content-length |

**Cannot verify in this audit (same as before):** real webhook delivery, analytics, screen-reader certification, regulatory-register status, live external portal availability, actual client behaviour/conversion.

---

## 10. Priority issue list

| Priority | Issue | Location / evidence | User impact | Fix |
|---|---|---|---|---|
| **P1** | Reduced-motion visitors see a blank Contact intro (phones, address, hours all `opacity:0`) | `contact.tsx:44-47`; reproduced 1440+390 | Reduced-motion users lose the primary contact information | Make the animate target explicit (`animate={{opacity:1, y:0, scale:1}}` under reduced, or render static when `reduced` — and verify SSR initial state) |
| **P1** | Hero video autoplays under reduced motion; 7MB, `preload="auto"`, no poster | `home-hero.tsx` hero-media block; runtime-checks `paused:false` under RM | Motion-sensitivity violation on the largest surface; heavy mobile download | Emit `autoPlay` only after a client-side media query resolves; add poster/still; drop preload to `metadata` |
| **P1** | `.env` `STRAPI_URL` points at unreachable LAN IP | `.env`; curl 000 | Any fresh `npm run dev`/`npm test` without env override 500s every page; same risk class in deployment if unset | Update env to a reachable value (`localhost:1337` locally) or document the override; launch needs a public HTTPS Strapi origin |
| **P2** | Mint buttons ~2.21:1 contrast | `.button-mint`, hero "Our Services", nav hover pill | Low-vision readability on primary CTAs | Darken text/background combination (e.g. ink text on accent, or use `--accent-dark` bg) — test per element |
| **P2** | Team pills are inert: `+` icon + hover but no click; founder bio unreachable from home | `home-sections.tsx` TeamSection | Broken expectation; the "who is this person" answer is hidden | Make pills links to `/about-us#{id}` or restore the dialog |
| **P2** | Orphan 9th tile row at all widths (4-4-1 / 2-2-2-2-1) | `.service-gallery` grid math | Looks unfinished; weakens the business-service offering | Constrain to 3 columns (3×3) or widen max-width so ≥1,396px viewports get 5-4; alternatively let the last tile span/center |
| **P2** | Recognition thumbs open raw Strapi media URLs with no caption | `TeamSection` marquee | Context-free evidence; exposes CMS origin | Link to `/about-us/awards`/`certificates` anchors or add a captioned lightbox |
| **P2** | Testimonials still stacks feature + list + stats + founder callout (1,854/2,488px) | section geometry | Repeated proof fatigues before process | Drop `stats-grid` + `founder-callout` from this section (both exist elsewhere — trust badge/hero and team block) |
| **P2** | `testimonial-bg` / `contact-bg-video` autoplay under reduced motion | `home-sections.tsx:72`, `contact.tsx` | Same class of a11y defect as hero | Gate autoplay on `useReducedMotion` (client-side render, not SSR attr) or swap to static image when reduced |
| **P3** | Tiles carry no service description | `ServiceTile` | Similar products indistinguishable pre-click | Add `shortDesc` as a subtitle/tooltip line |
| **P3** | No section-level CTA in services | `ServicesSection` | Dead-end after scanning | One line: "Not sure which fits? Talk to us" → `/contact-us` |
| **P3** | Dead code & CSS (~several hundred lines): `Comparison`, `FeaturedCase`, chart/team-row/service-card/founder-grid styles, unused imports/props, `nul` file | `home-hero.tsx`, `home-sections.tsx`, `globals.css`, repo root | Maintenance drag, confusion for future agents | Delete components, CSS blocks, unused fetch/props; remove `nul` |
| **P3** | "5.0/5 · Google rating on existing site" copy | hero trust badge | Reads like internal notes | Reword to client-facing honest phrasing ("as reported on our previous website") or drop pending verification |
| **P3** | `getNewsletters()` still fetched for the unused hero card | `page.tsx` | Wasted CMS call per render | Remove prop/fetch (or reuse for a compact resources link in Insights) |
| **P3** | FAQ / Insights unchanged (compaction optional) | sections 08–09 | Minor extra scroll | Optional future pass |
| **P3** | Non-Indian family footage behind testimonials | `siteSettings.testimonialBackground` | Authenticity mismatch | Replace asset when ready (already in CMS handoff) |
| **P3** | Strapi media `alternativeText` gaps on some service/recognition images | CMS records (generated fallbacks used) | Screen-reader quality on evidence imagery | Author alt text + focal points per handoff notes |

---

## 11. Recommended final homepage structure

The current order is already the right order — do not reshuffle. Recommended final shape:

01 Header → 02 Hero (video fixed for RM + poster; keep badge) → 03 protected statement → 04 Services tile gallery (balanced rows + one-line benefit + one contact line) → 05 Testimonials **compact** (feature + list; stats/callout removed) → 06 Team + recognition (clickable pills, captioned marquee) → 07 Process (phases + optional video) → 08 FAQ → 09 Insights → 10 Contact → 11 Footer.

Expected height if P1/P2 land: roughly **12,300px D / 12,500px M** — ~14 viewport heights — without touching the protected intro. Going below that requires the separately-approved decision to shorten the hero/statement timeline or collapse the process video canvas; neither is recommended unilaterally.

---

## 12. Implementation roadmap

**Phase A — Correctness (do first, all independent, all previously-verified defects)**
1. Fix reduced-motion Contact intro visibility; add a regression test asserting `opacity:1` under `prefers-reduced-motion` at 1440+390.
2. Render hero video `autoPlay` client-side only after reduced-motion check resolves; add `poster`/still; `preload="metadata"`. Same gating for `testimonial-bg` and `contact-bg-video`.
3. Fix `.env` `STRAPI_URL` (localhost for dev; document the deployment requirement).
4. Fix mint-button contrast (ink-on-accent or accent-dark background; verify ≥4.5:1 at 15px).

*Acceptance:* new RM tests pass; `npm test` stays 55+ green; fresh `npm run dev` works without env override; contrast re-measured.

**Phase B — Trust depth & polish**
5. Team pills → real links (`/about-us#{member.id}`) or restored dialog; remove fake `+` affordance if left inert; tighten mobile pill text.
6. Balance service grid (3×3 or 5-4); add `shortDesc` subtitle; add one section-level contact line.
7. Compact testimonials: remove stats grid + founder callout; keep feature + expandable list.
8. Recognition marquee: link thumbs to archive pages or captioned lightbox; keep `showOnHomepage` curation.

*Acceptance:* pills keyboard-reachable and announced correctly; no orphan tile at 1440/1200/810/390; testimonials ≤ ~1,300px D / ~1,700px M.

**Phase C — Hygiene & launch gates**
9. Remove dead components/CSS/props and the `nul` file; drop the unused `getNewsletters()` homepage fetch.
10. Reword the rating qualifier; author missing `alternativeText` in Strapi; replace testimonial footage when the approved asset exists.
11. Owner gates (unchanged from first audit): webhook delivery config, `SITE_URL` for launch indexing, legal draft review, claims substantiation (12+ awards, rating basis, client count definition), Strapi public media origin.
12. Optional: FAQ/Insights compaction; process-video default collapse.

*Regression checks after each phase:* `npm run typecheck`, `npm test`, and a fresh four-width homepage capture — compare scroll map and section order against §3.

---

## 13. Final verdict

**Genuinely good now:** the information architecture is fixed — a client reaches their service category, named proof, a real team, and genuine award evidence in the first half of a page that is 40% shorter; the suite is fully green; all 25 routes, forms, canonicals, and the Strapi integration verify cleanly; the tile gallery and recognition marquee are distinctive and CMS-driven.

**Must change before real clients:** the three reduced-motion defects (P1 — one of which is brand-new on the biggest visual surface), the unreachable founder bio with fake affordances, the mint-button contrast, and the broken local `STRAPI_URL`.

**Ready for real clients?** Structurally yes — after Phase A and the Phase B trust fixes. The remaining open gates (webhook delivery, `SITE_URL`, legal review, claim substantiation) are business/configuration items carried over from the first audit, not new website problems.

---

*Evidence files: `docs/audit/evidence-second/measurements.json` (4-width geometry + 25-route crawl), `runtime-checks.json` (reduced-motion, video, contrast, forms, CMS state), `screenshots/` (checkpoint + full-page captures). Scripts `capture.mjs` / `runtime-checks.mjs` reproduce the measurements against a dev server on :3100 with `STRAPI_URL=http://localhost:1337`.*
