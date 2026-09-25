# Brand Authenticity Audit — Is Ghanchi Investments the Designer, or the Content?

**Persona applied**: Brand Guardian (`docs/agency-audit/roster/design-brand-guardian.md`) — brand personality, voice, positioning, and protection of brand value, evaluated against the live rendered site and the verified evidence set at `docs/brand-authenticity-audit/EVIDENCE.md` and `docs/brand-authenticity-audit/evidence/evidence-data.json`. No brand asset, CSS, or copy was changed as part of this audit — findings only, per the brief. This audit was written **after** re-reading the current state of `src/components/home-hero.tsx`, `src/components/home-sections.tsx`, and `src/components/site-shell.tsx` directly (not from the cached `docs/agency-audit/BRAND_AUDIT.md` findings alone) — two of that document's findings (the service-card byline attribution, and the footer vision-text drift) have since been fixed in the working tree; this document notes that explicitly where relevant rather than re-flagging stale issues.

Method: side-by-side reading of Kora's and Ghanchi's full extracted body text (`evidence-data.json`), direct visual comparison of matched screenshot folds, and source-level citation of the React components and CSS that produce each pattern.

---

## 1. Verdict

**Ghanchi Investments is, today, the content inserted into Kora's experience — not the designer of its own.** Every rhetorical device a visitor actually *feels* — the hero's sentence template ("Your [adjective] partner for [noun phrase]."), the sticky mid-scroll statement, the Before/After comparison scene, the nine-times-repeated "numbered service card ending in a human pull-quote" structure, the "founder callout" CTA block, the single testimonial-expansion widget, the stats-counter row, the footer's rhythm and copy pattern — is Kora's own authored rhetoric with Ghanchi's real facts swapped into the blanks. The swap test fails almost everywhere at the structural level: replace "Chandrakant B. Ghanchi, Founder & Financial Planner, Navi Mumbai, since 2009" with any other Indian financial advisor's equivalent facts, and the page reads identically, because nothing about *how* each section argues its point — only *what* facts it cites — changes. What keeps this from being a total loss is that the facts themselves are real and well-chosen: a genuine founder with 15+ years and a real address, 11 named testimonials, real phone numbers, real service list. Ghanchi is authentically represented in the *content layer*; it has not yet authored its own *voice* or *structural argument* — those still belong to a B2B growth-consultancy template that was never written with a family-facing Indian financial advisor in mind.

---

## 2. Dimension-by-dimension findings

Severity key (matching `docs/agency-audit/KORA_VS_GHANCHI_COMPARISON.md`): **P0** brand-identity-breaking · **P1** major — a visitor notices this is "someone else's voice" · **P2** meaningful — dilutes distinctiveness but doesn't actively mislead · **P3** nice-to-have polish.

### 2.1 Brand personality

**Evidence**: Kora's personality is confrontational-strategic — it opens with "The strategies that built your company won't scale it." (a challenge), structures its FAQ as opinionated point-of-view ("We are not an agency that runs campaigns... most of the time, the problem is not a lack of tactics"), and its stats block leads with hard numbers (`47%`, `$14.2M avg ARR`). Ghanchi's personality, as written, is warm-reassuring — "Your goals are personal. Your plan should be too." (`evidence-data.json → ghanchi.founderCallout`) — which is the *correct* personality for a family financial advisor and genuinely different in tone from Kora's aggression. But it is delivered through Kora's exact confrontational two-panel comparison mechanic (`Comparison` component, `src/components/home-hero.tsx:70-83`) — a device built to dramatize "old way bad / new way good" for a B2B buyer deciding between vendors, repurposed here to contrast "financial decisions made in isolation" vs. "every decision aligned with your goals" for a family, a much lower-stakes, higher-trust conversation that doesn't naturally need an adversarial before/after structure at all.

**Swap test**: Fail on structure, pass on word choice. Any advisory brand's tagline could sit in the same panel shape; the panel shape itself is not doing anything Ghanchi-specific.

**Severity**: P1

**To close**: Content/structural rewrite requiring design + copy collaboration, not a code fix alone — decide whether Ghanchi's actual personality (patient, personal, generational-trust — see §3 "genuinely Ghanchi" below) is better served by a different section mechanic than an adversarial comparison scene. Owner input needed on how the business wants to describe itself unprompted (see gap in §2.2).

### 2.2 Brand voice

**Evidence**: Direct line-by-line comparison (`EVIDENCE.md` item 1): Kora's H1 — *"Your growth partner for companies ready to scale."* — and Ghanchi's — *"Your trusted partner for financial planning and protection."* — are the same template: `Your [adjective] partner for [noun phrase].` Confirmed visually identical in `evidence/screenshots/kora/home-fold0.png` vs `evidence/screenshots/ghanchi/home-fold0.png` (same tulip photo, same layout, same headline cadence, even the same bottom-right "teaser card" pattern — Kora's "New Case Study" card and Ghanchi's "Latest Newsletter" card share one CSS component, `hero-case`).

**Swap test**: Explicit fail. Search-replace "financial planning and protection" → "wealth management and retirement" and the sentence is indistinguishable from a template.

**Severity**: P1

**To close**: Content rewrite. This needs a hero line that doesn't scan as `Your [X] partner for [Y].` — something built from how Ghanchi's own clients describe him (the testimonials already contain the raw material for this, see §2.9) rather than the template's cadence. Code change is trivial once new copy exists (`HomePageContent.heroHeading` in Strapi, consumed by `src/components/home-hero.tsx:38`).

### 2.3 Founder presence

**Evidence — genuinely strong, and largely already fixed.** The founder (Chandrakant B. Ghanchi) appears with his real name, real role, and real photo in: the header CTA avatar (`evidence/screenshots/ghanchi/home-fold0.png`, top right), the team section ("Meet your advisor. A personal partnership." / "Chandrakant B. Ghanchi / Founder & Financial Planner / 01" — `ghanchi.teamHeading`, `ghanchi.teamRows`), all nine service-card pull-quotes (confirmed live in `home-sections.tsx:22-25` — `founderName = founder?.name || 'Chandrakant B. Ghanchi'`, rendered via `<Person image={founder?.headshot} name={founderName} role={founderRole}/>` — visually confirmed in `evidence/screenshots/ghanchi/home-fold9.png` and `home-fold10.png`, both showing "Chandrakant B. Ghanchi / Founder & Financial Planner" captioning his own photo, not the company name), the founder-callout block, and the About Us page's first-person-adjacent letter section (`src/app/about-us/page.tsx:16`, `founder.bio` + `page.founderExtraParagraphs`).

**Note on a stale finding**: `docs/agency-audit/BRAND_AUDIT.md` Finding 2 (P1, dated to that audit's pass) flagged the service-card quotes as captioned "Ghanchi Investments / Our vision" instead of the founder's name. Re-reading `home-sections.tsx` directly for this audit shows that is no longer the case — the component now attributes every quote to the founder by name and role. This is a real, positive fix; it should not be re-reported as an open issue.

**Remaining gap — voice register, not presence**: Kora's founder callout is written in the first person: *"I've personally led 40+ growth engagements. Let me show you what's possible for yours."* (`evidence-data.json → kora.bodyText`). Ghanchi's equivalent (`founderCallout`) is company-voice throughout — *"Your goals are personal. Your plan should be too. Let's start with a conversation."* — never "I," even though the section is structurally built as a personal, one-to-one founder moment (single portrait, single name, "Talk about your goals" CTA) and the whole point of the section is to sound like Chandrakant talking directly to a prospective client.

**Swap test**: Founder *identity* passes (his real name/photo can't be swapped for anyone else's without it being obviously wrong — that's the correct outcome). Founder *voice* fails — the callout text itself has no first-person markers and could be attributed to any advisory firm's about-us page without editing a word.

**Severity**: P2 (presence is genuinely solid; only the voice register of the callout text is templated)

**To close**: Content rewrite only — change `founderCallout.text` from company-voice to first-person ("I start with your goals, not a product." or similar, in Chandrakant's actual words if available). No code change needed; field already exists and is CMS-driven.

### 2.4 Business story / about-company storytelling

**Evidence**: `ghanchi.page_about-us` (evidence-data.json) carries real, specific facts — incorporated 2009, 1,200+ clients across India and abroad, named client categories (HNIs, business owners, NRIs, entrepreneurs, software engineers, advocates, doctors, architects, CEOs & CFOs), a stated mission ("educate people about retirement planning, support planning for children's futures and help adults understand adequate insurance protection"). This is real content, not fabricated (cross-checked against `docs/CURRENT_IMPLEMENTATION_PLAN.md` §4's verified-facts table). But structurally the About page is Kora's About page unchanged: same hero-cover-image-plus-intro pattern, the same "What we value" 4-item grid (Kora: "Clarity over complexity / Speed over perfection / Outcomes over outputs / Partnership over dependency" — punchy, paired-contrast aphorisms; Ghanchi: "Trust & integrity / Focus / Excellence / Consistency" — single words with one-line elaborations, a noticeably flatter, less distinctive rhetorical form even though the underlying values are presumably real), the same "founded year / stat / stat" trio (Kora: 2019 founded / 140+ engagements / 92% retention; Ghanchi: uses the site's global stats instead of an about-page-specific set), and the same team-bench section that in Kora shows 6 named specialists and in Ghanchi shows exactly one row (the founder) — an honest reflection of company size, but the section chrome (a horizontal list designed to hold a multi-person bench) doesn't visually adapt to holding one, and reads as an unfinished team roster rather than a deliberately solo-practice presentation.

**Swap test**: The four-value grid fails outright — "Trust & integrity / Focus / Excellence / Consistency" is not written in a way that couldn't belong to literally any professional-services firm (insurance, law, accounting, consulting). Nothing in the value *names themselves* signals financial planning, India, family, or Ghanchi specifically.

**Severity**: P1 (the values grid), P2 (single-row team section chrome)

**To close**: Content rewrite for the values (owner input ideal — what does Chandrakant actually tell clients he does differently?); the team-section chrome for a solo practice is a design decision (collapse to a single large founder card rather than a one-row list) — **code change**, not content.

### 2.5 Service presentation

**Evidence**: Both sites use an identical nine/five-card mechanic: numbered card, icon-tagged category, headline, body copy, a "what we discuss/offer" bullet list, a CTA, and an image with an overlaid pull-quote from a named person (`ServicesSection`, `home-sections.tsx:22-26`). Kora's version closes each card with a *different* named external client with a *quantified* outcome ("James Martin, CEO, Hamilton" / "Sarah Bouchard, Founder & CEO, Lightspeed" — a new voice every card). Ghanchi's version closes every one of its nine cards with the *same* person (the founder, quoting a sentence from his own service description back to the reader — see `home-sections.tsx:25`, `<p>"{service.longDesc.split('.')[0]}."</p>`) — already flagged correctly in `EVIDENCE.md` item 3 as "correctly so, since Ghanchi has no comparable audited outcome data to quote (inventing one would violate the project's own content-truth policy)." That is the right call under the content-truth constraint, but it leaves the section mechanic doing something it wasn't built to do: a slot designed to prove "different real clients got different real results" is instead used to have the advisor paraphrase himself nine times, which reads as padding once a visitor notices the pattern (all nine pull-quotes are literally the first sentence of the paragraph directly to their left).

**Swap test**: The bullet-list/numbered-card chrome passes no test — it's unchanged Kora structure. The self-quoting device is Ghanchi's own adaptation (not Kora's), but it's a workaround forced by the template's shape rather than a device chosen for its own sake.

**Severity**: P2

**To close**: Either a content change (real, consented client quotes per service, if/when available — matches the existing testimonials-archive content-truth approach) or a design change (drop the pull-quote card for services that have no service-specific quote, rather than manufacturing one from the body copy). Owner input needed on whether per-service testimonials exist anywhere in the 11-testimonial archive that could be reassigned to the matching service.

### 2.6 Financial-advisor positioning

**Evidence**: The actual positioning claim in the copy — a *personal*, relationship-based, goal-first advisor for individuals and families, not a corporate consultancy — is genuinely differentiated from Kora's B2B growth-partner positioning, and is not itself a copy-paste (compare Kora's audience: "B2B companies between $2M and $50M in revenue," `kora.bodyText` FAQ, vs. Ghanchi's audience: "HNIs, business owners, NRIs, entrepreneurs..." individuals, `ghanchi.page_about-us`). This is a real point in Ghanchi's favor — the *substance* of the positioning is correct and true.

**Swap test**: Passes at the fact level (the audience described is genuinely Ghanchi's, not Kora's B2B one). Fails at the delivery level — see §2.1/§2.2 — because the mechanisms used to *argue* that positioning (comparison scene, stats counters, "Trusted by X" badge) are unchanged B2B-consultancy argument patterns applied to a relationship business where they don't obviously fit as well (a family choosing a financial advisor is not comparison-shopping ARR multiples).

**Severity**: P2 (content is right, delivery mechanism is inherited)

**To close**: This is the deepest, hardest-to-fix item in the audit and is fundamentally a **design decision**, not a copy edit — it requires deciding whether Ghanchi's homepage should keep Kora's B2B-consultancy section inventory (comparison scene, stats bar, hiring-card-as-"Recognition") at all, or replace some sections with mechanics built for a relationship-first advisory brand (e.g., a multi-generational client story, a "how a first meeting works" walkthrough). Not something to execute without the owner's explicit sign-off given the scope.

### 2.7 Trust signals

**Evidence**: `KORA_VS_GHANCHI_COMPARISON.md`'s "Trust badge — avatars" row: Kora shows 4-5 real circular **photo** avatars of real people plus "Trusted by 50+ companies" (one line). Ghanchi shows 5 circular **2-letter initials** on mint backgrounds (`.trust-initials`, `home-hero.tsx:11-13`, `TrustBadge` component) plus a two-line caption: "Trusted by 1,200+ clients" / "5.0/5 · Google rating on existing site" (`ghanchi.trustBadge`). The initials-not-photos choice is an honest, content-truth-driven substitution (no fabricated client photos without consent — same judgment call already validated in the prior audit) and is a genuine, correct adaptation, not a template leftover. The caption growing to two lines, and the second line's self-qualifying "on existing site" / "Not a live Google feed" phrasing (also present at `ghanchi.testimonialFeature`: *"Reported on our existing website. Not a live Google feed."*), is a different issue — see §2.15 microcopy.

**Swap test**: The initials-avatar mechanic itself (a row of colored circles) is visually Kora's exact `.trust-avatars` container repurposed with different content — passes the swap test as *a container*, but the choice of what to put in it (initials vs. photos) is Ghanchi-specific and honest, which is the right call.

**Severity**: P3 (an accepted, justified substitution, not a defect — carried over from `KORA_VS_GHANCHI_COMPARISON.md`'s own conclusion)

**To close**: No action unless/until real, consented client photos become available.

### 2.8 Local / Indian business context

**Evidence — mixed, genuinely improved in places.** Some imagery is correctly and specifically localized: the Life Insurance service card shows an Indian father carrying his daughter on his shoulders in what reads as an Indian park setting (`evidence/screenshots/ghanchi/home-fold8.png`, bottom), and the Health Insurance service card shows a specifically Indian family scene (a woman in a sari, three generations, an Indian-styled office) (`evidence/screenshots/ghanchi/home-fold10.png`, top-right/continuing card). But other service-card images are still generic Western stock: the Mutual Funds card shows two people who read as a Western/non-Indian office setting (`evidence/screenshots/ghanchi/home-fold10.png`, bottom), and the Retirement Planning card shows a close-up of a hand tapping a card on a POS terminal with a Visa card visible — an image about payment, not retirement, and with no visible Indian context at all (`evidence/screenshots/ghanchi/home-fold11.png`, top). Address, phone numbers (+91), and currency-adjacent language ("Shop no. 27, Sector 11, Balaji Bhavan, CBD Belapur, Navi Mumbai, Maharashtra 400614") are real and correctly Indian throughout the footer and contact page (`ghanchi.footerMessage`, `ghanchi.page_contact-us`). Per-asset classification of which images are authentic vs. Kora stock is the authoritative subject of `docs/MEDIA_INVENTORY.md`, not this audit — flagged here only for its brand-fit effect: the inconsistency (some cards feel authentically Indian, others feel like unedited B2B stock) reads as patchwork rather than a deliberate, consistent visual identity.

**Swap test**: Address/phone/name block passes fully (unmistakably, specifically Ghanchi). Roughly half the service-card photography fails (could illustrate any Western B2B service page unchanged).

**Severity**: P2 (address/contact data is a clear pass; imagery inconsistency is a real, visible gap)

**To close**: Media work (owner-gated per `MEDIA_AUDIT.md`'s existing classification approach), not a content or structural fix — outside this audit's scope to execute, but worth flagging as a Brand Guardian concern since it's precisely the kind of inconsistency that produces the "pasted-on logo" impression the brief describes.

### 2.9 Client relationship storytelling / testimonials as brand proof

**Evidence — this is Ghanchi's strongest, most genuinely-its-own asset on the entire site.** Eleven real, named testimonials exist (`ghanchi.page_about-us_testimonials`), several with vivid, specific, non-generic language that could not plausibly be written by a template or an agency: *"Chandrakant is not an agent for me, nor I'm a client for him... he provides his valuable suggestion after good research to me not thinking of me as his client but as a FAMILY member"* (Sumit Jain, L&T Infotech); *"I am looking forward to their new website. I am sure that it will improve my ability to get the necessary work done"* (Firoz Shaikh, Firoz Dance Academy — note this quote is dated enough to reference an *old* website redesign, further evidence of its authenticity as unedited legacy content); testimonials spanning India, Dubai/UAE, and the USA, matching the verified client-geography fact. This is real brand proof, and it's more emotionally specific and distinctive than anything in Kora's own testimonial set (which, being template demo content, uses generic SaaS-executive language — "we're at $52M and just closed our Series B").

**However**, only one testimonial is surfaced per homepage service-card/section slot, and the *presentation* mechanic (a large "featured" quote plus 3 expandable smaller ones, `TestimonialsSection`, `home-sections.tsx:50-56`) is unchanged from Kora's identical component. The self-annotating disclosure line *"From our client testimonial archive"* / *"Reported on our existing website. Not a live Google feed"* sits directly under the most emotionally powerful content on the page and visibly undercuts it (see §2.15).

**Swap test**: Content passes decisively — these quotes cannot be swapped for any other company's without being obviously wrong (they name Chandrakant directly, by name, repeatedly). Presentation mechanic and surrounding microcopy fail the test (unchanged Kora component + a disclosure register that could apply to any migrated site's testimonial archive).

**Severity**: P1 for the microcopy override specifically (this is the single highest-value trust asset on the site and it's the one place the "cautious second voice" from `docs/agency-audit/BRAND_AUDIT.md` Finding 4 does the most damage); no severity assigned to the testimonial content itself, which is a strength, not a gap.

**To close**: Content/copy fix — move "Reported on our existing website. Not a live Google feed." to a tooltip/footnote register instead of inline body text (same fix already specified in `CONTENT_AUDIT.md` Finding 3 and `BRAND_AUDIT.md` Finding 4 — this audit concurs and does not duplicate the recommendation, only re-confirms its severity from the brand-voice angle).

### 2.10 Color usage as brand signal

**Evidence**: `src/app/globals.css:4` — `--accent:#59c29f; --ink:#242424; --cream:#f5f5e9; --white:#fffffa`. Per `KORA_VS_GHANCHI_COMPARISON.md`'s direct computed-style comparison, this is an **exact hex match** to Kora's rendered hero text color and mint accent — there is no Ghanchi-specific color decision anywhere in the palette. The one place a distinct Ghanchi color identity exists at all is the logo itself (navy "G," mint figure, gold/green stars — `public/assets/logo-ghanchi.png`), which is visually disconnected from the site's own mint/cream/ink system (already documented as `BRAND_AUDIT.md` Finding 1, P1).

**Swap test**: Fails completely — the entire color system is Kora's, unedited, confirmed by exact hex match.

**Severity**: P2 (color fidelity to Kora is not inherently wrong — it's a deliberate, functional design system — but as a *brand signal specifically*, Ghanchi has made zero color decisions of its own; the only brand-specific color statement on the site is the mismatched legacy logo)

**To close**: A strategic brand decision, not a bug — does Ghanchi want its own accent color distinct from Kora's mint, or is inheriting a clean, functional palette an acceptable trade against a costly redesign? Owner decision required; not something to execute unilaterally.

### 2.11 Content hierarchy as brand signal

**Evidence**: Section order and relative visual weight are unchanged from Kora across the entire homepage — hero → trust badge/logo ticker → statement → comparison → services (with embedded chart) → process → team/"hiring card" → testimonials/stats → founder callout → featured case → insights → footer (cross-referenced against `kora.bodyText`'s structural sequence and `ghanchi.bodyText`'s, which follow the identical order). Nothing has been reprioritized to reflect what should matter *more* for a solo financial advisor versus a multi-person consultancy — e.g., the founder/team section is exactly as small a share of the page (one section, mid-scroll) as Kora's, even though for a one-person relationship business the founder arguably deserves the dominant, not incidental, position.

**Swap test**: Fails — the order and proportion of sections is identical to Kora's own, unchanged section-for-section.

**Severity**: P2

**To close**: Would require restructuring which sections exist and in what order/weight — a genuine information-architecture decision, code + content work together, and one with real cost; flagged for owner awareness, not proposed as an immediate action.

### 2.12 CTA language

**Evidence**: The nine service cards all use the literal string "Get Started" (`ghanchi.bodyText`, repeated nine times, and directly matching Kora's own "Get Started" button label used on every one of its five service cards, `kora.bodyText`) — byte-identical CTA copy, not a coincidence of both being generic English. Elsewhere Ghanchi does write its own CTA language that is genuinely distinct and better-fitted: "Talk about your goals" (founder callout), "Let's start with a conversation. No commitment required." (contact form), "View Awards," "Meet Our Clients" — all specific, warm, and appropriately lower-pressure than Kora's transactional "Book a call" / "Get a quote" register.

**Swap test**: "Get Started" fails outright (literal match). The others pass — genuinely Ghanchi-appropriate CTA voice exists elsewhere on the same page, which shows the team *can* write distinct CTA copy; it just didn't happen for the highest-repetition CTA slot on the page.

**Severity**: P2

**To close**: Content-only fix — replace "Get Started" across all nine service CTAs (`service.title` loop in `ServicesSection`, `home-sections.tsx:25`) with something in the register already established elsewhere ("Discuss this with us," "Talk to Chandrakant," etc.). No code change beyond a copy string.

### 2.13 Testimonials as brand proof — see §2.9 (merged; both dimensions point to the same evidence and the same finding).

### 2.14 Awards/certificates as brand proof

**Evidence**: The "hiring card" slot (Kora: "Join us, we're hiring... Apply Now" — a recruiting CTA) is repurposed as "Recognition. Built on service. Explore our awards and certificates archive, reflecting our journey in financial services." (`ghanchi.hiringCard`, `home-sections.tsx:37` `hiringCopy`). Per `docs/CURRENT_IMPLEMENTATION_PLAN.md` §4, this points to 8 real award photos and 19 real certificate scans, currently captioned only as "Awards archive — photograph 1" through "photograph 8" (`ghanchi.page_about-us_awards`) — neutral placeholder captions pending individual transcription, an explicit, deliberate content-truth decision (issuer/date/validity per item is unconfirmed, so nothing is invented) rather than an oversight.

**Swap test**: The photographs themselves are real Ghanchi Investments awards (pass) but the section as experienced by a visitor is inert as *proof* — a wall of uncaptioned photographs asserts nothing specific (no "Awarded X by Y, 2019" claims a visitor could evaluate), so as delivered it functions closer to decoration than evidence, which is not a swap-test failure in the usual sense but is a missed-opportunity failure: real proof exists and isn't being used as proof yet.

**Severity**: P2

**To close**: Content work requiring **owner input** specifically (the transcription/approval step is explicitly gated on the owner per §4 — this is not something to invent even partially) — once award details are confirmed, add real captions ("Awarded [X] by [Y], [year]") to convert the archive from decoration into evidence.

### 2.15 Microcopy

**Evidence**: Already the subject of `docs/agency-audit/BRAND_AUDIT.md` Finding 4 and `CONTENT_AUDIT.md` Finding 3, re-confirmed here from the voice-consistency angle: the site's primary voice is warm and confident ("Let's plan for what matters to you.", "Your goals are personal. Your plan should be too.") but at every point where it needs to sound *most* established — ratings, testimonials, stats — a second, dry, self-annotating voice appears: *"Reported on our existing website. Not a live Google feed."* / *"From our client testimonial archive."* / *"The testimonial describes a general client experience, not a result for this specific service."* (`ghanchi.page_services_life-insurance`) / *"These affiliations are not claims that the organizations themselves are clients."* (`ghanchi.page_about-us_our-clients`). Each instance individually is defensible (accurate, avoids misleading claims), but the cumulative effect — a compliance footnote surfacing in primary body copy at every trust touchpoint — is a legibly different voice from the rest of the site, and Kora's equivalent slots never do this (Kora's stats and testimonials are stated as flat fact with no self-qualification, because they're template placeholder numbers with nothing to disclose).

**Swap test**: N/A in the usual sense — this voice doesn't come from Kora at all (Kora has no equivalent register anywhere in its copy) or from Ghanchi's warm primary voice; it's a third, disclosure-driven voice introduced during the rebuild, and it's the most identifiably *not* Kora and *not* the site's own established personality of anything on the page.

**Severity**: P1 (per `BRAND_AUDIT.md`'s existing prioritization — concur)

**To close**: Content-only fix, already specified in both prior documents — relocate disclosure text to a footnote/tooltip register (e.g., a small `(i)` info affordance) rather than inline sentence-case body copy in the primary reading flow.

### 2.16 Overall emotional impression

**Evidence**: Taken together — identical hero photo and headline cadence (§2.2), identical section sequence and proportion (§2.11), identical color system (§2.10), an adversarial comparison mechanic built for B2B vendor selection applied to a family choosing an advisor (§2.1/§2.6), a "Get Started" CTA repeated nine times verbatim from the template (§2.12), and a disclosure voice that undercuts the site's own trust proof at exactly the moments it should feel most confident (§2.15) — the aggregate visitor experience is one of touring a well-executed B2B growth-consultancy site that happens to have Ghanchi Investments' name, photo, and facts inserted into it. This matches, point for point, the reaction described in the brief: *"It feels like someone else's website with the Ghanchi Investments logo pasted onto it."* The genuinely distinctive material that does exist — real testimonials with real emotional specificity (§2.9), a real founder consistently and correctly attributed (§2.3), real local imagery in some (not all) service cards (§2.8) — is not yet load-bearing enough, structurally, to overcome the template's own personality, because it is delivered through mechanisms authored for a different kind of company answering a different kind of question ("will this consultancy grow my revenue" vs. "can I trust this person with my family's future").

**Severity**: P0 (this is the compounding effect of nearly every P1/P2 above, and is the actual subject of the brief's complaint)

**To close**: Not a single fix — see §2.6's note that the deepest layer here (which sections exist, in what order, with what argumentative shape) is a real design decision requiring the owner's sign-off, not something this audit should execute. The highest-leverage, lowest-cost individual fixes are §2.2 (hero headline), §2.9/§2.15 (testimonial disclosure register), and §2.12 (CTA copy) — all pure content changes that would measurably shift the emotional impression without touching layout, CSS, or the section inventory.

---

## 3. What's already genuinely Ghanchi, not Kora

The critique above should not read as "nothing here is real." Several things are already authentically, verifiably Ghanchi's own and should be named as strengths, not gaps:

- **The founder is real, named, and consistently, correctly attributed** across the header, team section, every service card, the founder callout, and the About Us letter — with his real photo, not stock imagery (§2.3). This was a documented gap in an earlier audit pass and has since been fixed in the current codebase (`home-sections.tsx:22-25`).
- **The eleven testimonials are real, specific, and often vividly personal** — language like being treated "as a FAMILY member," spanning three countries, naming real employers (with an explicit, correct disclaimer that employer names are individual affiliations, not corporate endorsements) — and are more emotionally distinctive than anything in Kora's own demo testimonial content (§2.9).
- **The contact information is completely real and Indian-specific**: the CBD Belapur, Navi Mumbai address, two real phone numbers, two real email addresses, appearing correctly and consistently in the footer, contact page, and site settings (§2.8).
- **The business facts are accurate and specific, not inflated or invented**: founded 2009, 1,200+ clients, named client categories (HNIs, NRIs, doctors, architects, CEOs), and a real geography (India, UAE, USA) — cross-verified against `docs/CURRENT_IMPLEMENTATION_PLAN.md` §4's sourcing from a direct WordPress database pull, not guesswork.
- **The nine services are Ghanchi's actual real service list**, not Kora's five B2B service categories relabeled — a genuinely different, correctly-scoped offering (Financial Planning, Life/Health/General Insurance, Mutual Funds, Retirement, Child Education, Personal Accident, Employer-Employee Insurance).
- **Some service imagery is correctly, specifically localized** — the Life Insurance and Health Insurance cards show real Indian family scenes, not generic stock (§2.8) — proving the team can and does source appropriate imagery when it happens; the inconsistency (other cards still Kora stock) is the gap, not the capability.
- **The trust-badge substitution (initials instead of fabricated client photos) is a genuinely correct, content-truth-driven design decision**, not a placeholder oversight (§2.7).
- **The award/certificate photographs are real** — the gap is that they aren't yet captioned as evidence, not that they're fabricated or borrowed (§2.14).

## 4. OWNER / BUSINESS VERIFICATION REQUIRED

The following are genuinely unknown from anything in this project's documentation, and this audit does not invent an answer for them:

- **What Chandrakant would say, unprompted and in his own words, if asked "what makes your practice different from any other financial advisor"** — the raw material closest to this in the existing evidence is the testimonials (§2.9), which describe the *effect* of working with him (treated like family, patient, thorough) but are client voices, not his own stated philosophy. Nothing in the project's sourced documents (`CURRENT_IMPLEMENTATION_PLAN.md` §4, the testimonials archive, the About Us copy) captures this directly from him. This is the single most valuable piece of content that could genuinely differentiate the hero and founder-callout copy (§2.2, §2.3), and it does not exist anywhere in the current source material — it would need to come from the owner directly, not be drafted on his behalf.
- **Whether the four "What we value" items on the About page** (Trust & integrity / Focus / Excellence / Consistency, §2.4) are the business's own stated values or were authored during the rebuild — no sourcing is cited for them in `CURRENT_IMPLEMENTATION_PLAN.md` §4's verified-facts table, unlike the address/phone/founder/testimonial facts, which are explicitly sourced.
- **Award/certificate specifics** (issuer, year, validity per item) — explicitly flagged in `CURRENT_IMPLEMENTATION_PLAN.md` §4 as "unconfirmed per item," required before §2.14's captioning fix can happen.
