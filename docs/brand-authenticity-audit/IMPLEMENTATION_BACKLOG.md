# Implementation Backlog — Brand Authenticity

Every item traces to `BRAND_DIFFERENTIATION_STRATEGY.md`'s KEEP/STRENGTHEN/REPLACE/ADD split and to the specialist audit that found it. **Nothing in this backlog has been implemented** — specification only, per the brief. P0/P1 get full entries; P2/P3 are condensed to a table, matching the format already established in `docs/agency-audit/IMPROVEMENT_BACKLOG.md` for consistency with the existing fidelity backlog.

Severity key (as specified in the brief): **P0** identity-breaking · **P1** major brand-authenticity issue · **P2** meaningful differentiation improvement · **P3** polish.

---

## P0 — Identity-breaking issues

### P0-1: Newsletter teaser card displays a stale "2021" in the site's highest-visibility stat slot
**Page**: Homepage, hero corner (all viewports) **Section**: Hero, bottom-right teaser card **Component/file**: `src/components/home-hero.tsx:68` (`newsletter.issueMonth.slice(0,4)`)
**Current state**: The exact CSS slot Kora built for its single biggest proof number ("47%," 30px/600-weight, `.hero-case-stat strong`, `globals.css:151`) displays "2021" — a five-year-stale newsletter issue year, the first thing a visitor's eye lands on after the headline.
**Change**: content. Either replace with a real current proof point that fits the same visual promise (years in business, client count — both already exist elsewhere on the page), or restyle the card to a plainer "read our archive" treatment that doesn't imply a stat claim.
**Dependency**: none for the restyle option; the "replace with a newer newsletter" option depends on whether a more recent issue exists (owner input, per `CURRENT_IMPLEMENTATION_PLAN.md`'s existing newsletter-archive-gap blocker).
**Expected brand impact**: removes the single most damaging "this feels stale/borrowed" signal in the first three seconds on the page.
**Verification**: re-screenshot the hero fold; confirm the big-number slot shows either a genuinely current stat or no longer visually promises one.

### P0-2: `with-kora`/`without-kora` literal class names still ship in production, driving a meaningless chart
**Page**: Homepage **Section**: Services intro (`PlanningChart`) **Component/file**: `src/components/home-sections.tsx:14-20`, `src/app/globals.css:182-183`
**Current state**: Kora's ARR-comparison bar chart was mechanically repurposed into a 4-phase process illustration; the JSX still assigns `className="chart-bar with-kora"` / `"chart-bar without-kora"`, and one bar animates to a hardcoded, meaningless `67.6%`, defused by a disclaimer ("not a return forecast or performance comparison").
**Change**: code. Minimum: rename the classes to content-neutral names (`chart-bar-primary`/`chart-bar-secondary`). Fuller fix: replace the bar-chart shape with a connected-step/timeline diagram that actually represents a 4-phase sequence instead of a magnitude comparison.
**Dependency**: none.
**Expected brand impact**: closes both a code-hygiene issue (the literal word "kora" in shipped Ghanchi code) and a legibility issue (a chart with an unexplained 67.6% and no axis units).
**Verification**: `grep -ri "with-kora\|without-kora" src/` returns zero matches; the chart (or its replacement) no longer requires a disclaiming caption to make sense.

### P0-3: Hero headline is Kora's exact sentence template, word-swapped
**Page**: Homepage (and `/about-us`, which shares the same hero image) **Section**: Hero H1 **Component/file**: `HomePageContent.heroHeading` (Strapi `home-page` content type), rendered `src/components/home-hero.tsx:38`
**Current state**: "Your trusted partner for financial planning and protection." — confirmed identical in structure to Kora's own "Your growth partner for companies ready to scale." (`Your [adjective] partner for [noun phrase].`), verified via direct text extraction, not impression (`EVIDENCE.md` item 1).
**Change**: content. New headline that doesn't scan as the template — built from how real clients describe Chandrakant (the testimonial bank already contains usable raw material: "not an agent... a FAMILY member," "never push you to sell").
**Dependency**: none technically; benefits from, but doesn't require, the owner's first-person input (P0-1 through P0-6 can all proceed on existing verified content).
**Expected brand impact**: the single highest-leverage individual copy change in this audit — the first sentence every visitor reads.
**Verification**: re-run a side-by-side sentence-structure comparison against Kora's H1; confirm no shared template pattern remains.

### P0-4: Sticky mid-scroll statement is a one-word swap of Kora's own sentence
**Page**: Homepage **Section**: Sticky statement (second full-bleed scroll beat) **Component/file**: `HomePageContent.statementText` (Strapi), rendered `src/components/home-hero.tsx:17-32`
**Current state**: "What changes when you plan with us." vs. Kora's "What changes when you work with us." — one verb changed.
**Change**: content only — the scroll-linked word-blur reveal mechanic stays untouched, only the sentence itself changes.
**Dependency**: none.
**Expected brand impact**: closes the second-clearest single piece of "content inserted into Kora's sentence" evidence in the whole audit.
**Verification**: direct text comparison against Kora's equivalent; confirm no shared template.

### P0-5: "Get Started" repeated verbatim, nine times, matching Kora's own button label
**Page**: Homepage **Section**: All 9 service cards **Component/file**: `src/components/home-sections.tsx:25` (`ServiceCta`/`Button` loop)
**Current state**: Byte-identical to Kora's own "Get Started" label used on all 5 of its service cards.
**Change**: content. Replace with the warmer, already-established register used elsewhere on the same site ("Talk about your goals," "Discuss this with us," etc.).
**Dependency**: none.
**Expected brand impact**: removes a literal, checkable copy match to the template, repeated at the highest frequency of any CTA on the page.
**Verification**: `grep` for the replacement string across all 9 service cards; confirm "Get Started" no longer appears as the CTA label (may remain elsewhere if genuinely appropriate, but not as a 9x-repeated template match).

### P0-6: `hiring-card` component — Kora's recruitment-CTA class and shape reused, unmarked, for the awards teaser
**Page**: Homepage **Section**: Team section, "Recognition" panel **Component/file**: `src/components/home-sections.tsx:37-40`, CSS `.hiring-card` (`globals.css:278-282`)
**Current state**: The DOM class name, grid proportions (`1.8fr 1fr`), and button slot are unchanged from Kora's "Join us, we're hiring / Apply Now" panel, positioned directly under the solo-founder team intro — reads as a tonal non-sequitur even before considering the class name itself.
**Change**: code (rename class) + design (reconsider placement — this exact content might sit more naturally near the About page's existing clean Awards/Certificates/Our-Clients/Testimonials grid than directly under the one-person team intro).
**Dependency**: none for the rename; the placement question is a design call, not owner-gated.
**Expected brand impact**: removes a literal template-residue class name and a visual non-sequitur immediately following the site's one "who is this business" moment.
**Verification**: `grep -ri "hiring-card" src/` returns zero or only a renamed, content-neutral match; visual QA confirms the panel no longer reads as an unrelated tonal shift.

---

## P1 — Major brand-authenticity issues

### P1-1: Nine service-card "testimonials" are the founder quoting his own service description back at himself
**Page**: Homepage **Section**: All 9 service cards' floating quote panel **Component/file**: `src/components/home-sections.tsx:25` (`service.longDesc.split('.')[0]`, attributed via `<Person>`)
**Current state**: Every card's proof-shaped quote box contains the first sentence of the card's own body copy, restated, attributed to Chandrakant — not a third-party outcome, unlike Kora's per-card named-client-quote pattern it visually mimics.
**Change**: content. Match real, consented, topically-relevant testimonials from the existing 11-testimonial archive to the services they actually discuss (several already reference "LIC and mediclaim" — life/health insurance) where a genuine match exists; drop the proof-card device (let the description stand as normal body copy) for services with no real match, rather than manufacturing one.
**Dependency**: someone reading all 11 testimonials for genuine topical fit — content work, not code (mirrors the already-planned P1-2 item in the prior fidelity backlog for service-detail pages; this extends the same fix to the homepage cards).
**Expected brand impact**: converts 9 visually-proof-shaped boxes from padding into either real social proof or honest first-party copy.
**Verification**: spot-check each card no longer shows the founder quoting his own preceding sentence; where a real testimonial is used, confirm it's a genuine topical match, not a forced one.

### P1-2: Team section's "01" numbering implies a roster that doesn't exist
**Page**: Homepage **Section**: Team/founder section **Component/file**: `src/components/home-sections.tsx:40`, `.team-row .team-number` (`globals.css:270`)
**Current state**: A component built to hold Kora's 6-person bench (`01` through `06`) holds exactly one row, independently read as "looks incomplete" by 4 of 6 personas walked through in `UX_PERSONA_WALKTHROUGH.md`.
**Change**: design. Drop the roster-implying numbering, or reframe the section as a straightforward solo-founder profile block.
**Dependency**: none.
**Expected brand impact**: removes the clearest single "this template expected more than it got" visual tell on the homepage.
**Verification**: visual QA confirms the section no longer implies a missing "02" onward.

### P1-3: Real, more specific "Our Vision" text sits unused in favor of a thinner rebuild-era paraphrase
**Page**: `/about-us` **Section**: "Our Vision" **Component/file**: `about-page.visionFollowup` (Strapi content field)
**Current state**: Live text ("Financial decisions should be made in the context of your life, not in isolation.") is a paraphrase of the site's own comparison-scene copy. The real WordPress site's original "Our Vision" text — recovered directly from the raw database export — is more specific: *"A well-informed advisor with your best interests at heart is crucial... Everyone is entitled to personalize, unbiased, fiduciary advice."*
**Change**: content only — swap the Strapi field value to the real, sourced text. No new facts invented; this is the business's own original language.
**Dependency**: none — the source text is already fully quoted in `CONTENT_AUTHENTICITY_AUDIT.md` §3.
**Expected brand impact**: the word "fiduciary" alone is a real, specific, differentiating positioning claim absent from the current generic paraphrase.
**Verification**: confirm the live `/about-us` page renders the sourced text verbatim (or a light edit of it, not a further paraphrase).

### P1-4: Founder photo never exceeds 60px anywhere on the homepage
**Page**: Homepage **Section**: Team section or founder-callout **Component/file**: `src/components/home-sections.tsx:40` / `:56`, CSS `.person-image > img` (`globals.css:49`)
**Current state**: The real founder headshot — the single most "genuinely Ghanchi" visual asset in the project — renders no larger than 60×60px anywhere a homepage visitor sees without clicking; the only large-format (540px) rendering is on the secondary `/about-us` page.
**Change**: design. Give the real photo large-format, primary-visual-weight placement in the team section or founder-callout, on the homepage itself, matching or exceeding the About page's treatment.
**Dependency**: none — uses the existing asset, no new photography required.
**Expected brand impact**: directly counteracts the imagery audit's core finding — the site's largest visual real estate currently goes to invented or borrowed imagery while its one authentic face stays avatar-sized.
**Verification**: confirm a ≥300px rendering of the real founder photo appears on the homepage without requiring a click.

### P1-5: Relationship-length claim stated three times, developed zero times
**Page**: Homepage, `/about-us` **Section**: Team heading, founder callout, featured case **Component/file**: `home-page.teamHeading`, `home-page.founderCallout`, `home-page.featuredCase` (Strapi)
**Current state**: "Since 2009" / "A personal partnership" appear as flat restatements; real multi-year testimonial data (Vikram Sawant: "4 years," Ranbir Singh: "6 yrs") sits unused in testimonial content rendered on the same page.
**Change**: content. Cross-reference the real duration data from the testimonials already live on the page into the sections making the abstract long-term-relationship claim.
**Dependency**: none — both source quotes are already live and verified.
**Expected brand impact**: turns a repeated abstract claim into evidence-backed specificity, using content already on the page.
**Verification**: confirm at least one section pairs the "personal partnership"/"since 2009" claim with a real, cited client-duration data point.

### P1-6: Real client-cited differentiator (low-pressure, relationship-first advice) never stated in the company's own voice
**Page**: `/about-us` or FAQ **Section**: "What we value," or a new FAQ item **Component/file**: `about-page.values` (Strapi)
**Current state**: 4 independent testimonials (Sumit Jain, Vikram Sawant, Parvez Shaikh, Ranbir Singh) converge on the same real, evidence-backed differentiator — never synthesized into the company's own stated claim; the current "values" grid ("Trust & integrity / Focus / Excellence / Consistency") is generic enough to belong to any professional-services firm.
**Change**: content. Synthesize the corroborated testimonial pattern into a stated claim, sourced explicitly from real client language, not invented.
**Dependency**: none — all 4 source quotes are already live and verified.
**Expected brand impact**: the strongest available real content upgrade to the About page's weakest section (`BRAND_AUTHENTICITY_AUDIT.md` §2.4 rates the current values grid a swap-test failure).
**Verification**: confirm the new claim is traceable to the cited testimonial pattern, not a freshly-invented statement.

---

## P2 — Meaningful differentiation improvements

| ID | Area | Finding | Fix type | Source |
|---|---|---|---|---|
| P2-1 | Content | LIC/mediclaim-specific language appears in real testimonials but never in the company's own service copy, despite real LIC portal integrations already live | Content | `CONTENT_AUTHENTICITY_AUDIT.md` §5 |
| P2-2 | Design | Comparison scene's adversarial before/after framing may not match how Chandrakant actually opens a client conversation — a relationship-first practice may need a credibility-first frame instead | Content, **owner input required** | `VISUAL_IDENTITY_AUDIT.md` §5 |
| P2-3 | Design | Review-score's 120px numeral slot is visually calibrated for a bold, current claim but holds a caveated historical figure ("not a live Google feed") | Design | `VISUAL_IDENTITY_AUDIT.md` §9 |
| P2-4 | Design | "Featured Case" panel is a single-client case-study shape holding firm-wide summary facts instead of one real story | Design or content, **owner input on whether a real case-study-worthy story exists** | `VISUAL_IDENTITY_AUDIT.md` §10 |
| P2-5 | Design | Trust marquee ("India • UAE • USA") occupies a proof-shaped slot with geography instead of a verifiable claim | Content, optional | `VISUAL_IDENTITY_AUDIT.md` §3 |
| P2-6 | Content | Founder-callout stays in company voice throughout, in a slot structurally built for a personal, first-person statement | Content, **owner input required (comfort with first-person copy)** | `BRAND_AUTHENTICITY_AUDIT.md` §2.3, `VISUAL_IDENTITY_AUDIT.md` §9 |
| P2-7 | Media | Financial Planning and Health Insurance AI images depict invented "advisor" characters that don't resemble the real founder | Media, **owner-gated per the existing media-generation approval process** | `IMAGERY_AUTHENTICITY_AUDIT.md` §3-VI |
| P2-8 | Media | Hero image and 6 remaining Kora-stock slots — already scheduled for replacement in the prior fidelity backlog (P1-5); this audit adds locality-signal and no-invented-advisor-face direction | Media, **owner-gated** | `IMAGERY_AUTHENTICITY_AUDIT.md` §3 |
| P2-9 | Content | Positioning tension: site frames the business as a broad "financial planning" consultancy, but real testimonial evidence skews toward LIC/insurance-specific expertise as the actual reputation driver | Strategic, **owner input required** | `UX_PERSONA_WALKTHROUGH.md` Persona 5 |
| P2-10 | Content | Child Education Planning (and other services) have no matched testimonial even though real testimonials exist for other specific needs | Content | `UX_PERSONA_WALKTHROUGH.md` Persona 2 |

---

## P3 — Polish

| ID | Area | Finding | Fix type | Source |
|---|---|---|---|---|
| P3-1 | Design | Process section's "numbered-phase-methodology" apparatus (large "Phase 01" numerals, dedicated explainer video) may be heavier than the actual 4-step process warrants for a one-person practice | Design, **owner confirmation on whether a formal branded process exists** | `VISUAL_IDENTITY_AUDIT.md` §7 |
| P3-2 | Media | Sticky-statement section reuses the exact same hero photo for a second full-bleed scroll beat | Media (asset) | `VISUAL_IDENTITY_AUDIT.md` §4 |
| P3-3 | Content | About page's 4 "What we value" single-word items (Trust & integrity / Focus / Excellence / Consistency) are generic — sourcing unconfirmed | Content, **owner input on whether these are the business's actual stated values** | `BRAND_AUTHENTICITY_AUDIT.md` §2.4 |
| P3-4 | Content | Article covers' image briefs lack a locality anchor (optional polish, not a structural problem) | Media, **owner-gated** | `IMAGERY_AUTHENTICITY_AUDIT.md` §3-IV |
| P3-5 | Content | Minor spelling inconsistency in one live testimonial ("Ghanch investments") — flagged for awareness, not necessarily to be silently corrected (may be authentic to the source) | Content, **owner decision on whether to correct or preserve as-submitted** | `UX_PERSONA_WALKTHROUGH.md` Persona 4 |

---

## Explicitly out of scope for this backlog

Per the brief and per `BRAND_DIFFERENTIATION_STRATEGY.md`'s REMOVE section: no real Ghanchi asset, verified fact, or content is proposed for deletion anywhere in this backlog. Media generation (P2-7, P2-8) is specified but not executed, consistent with the existing `docs/agency-audit/IMPROVEMENT_BACKLOG.md` P1-5 media-approval gate — this backlog does not duplicate that approval request, only adds sharpened direction for when it's granted.
