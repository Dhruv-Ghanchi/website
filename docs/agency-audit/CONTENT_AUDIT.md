# Content Audit — Copy Structure vs. Kora

**No copy was rewritten as part of this audit.** Findings only — content changes require the owner's content-truth review per `docs/CURRENT_IMPLEMENTATION_PLAN.md` §5 (no invented statistics, no corporate-client claims inferred from an individual's employer, no fabricated review counts, no guaranteed-return language).

Method: applied the `marketing-content-creator` roster persona (`docs/agency-audit/roster/marketing-content-creator.md`) — content strategy, storytelling structure, messaging architecture — against Kora's actual copy density/hierarchy, not its business subject matter. This complements `MEDIA_AUDIT.md` (imagery) and does not repeat its findings.

Evidence gathered directly for this audit:
- Rendered HTML of all 8 required routes (`/`, `/about-us`, `/services`, `/services/life-insurance`, `/online-services`, `/blog`, `/contact-us`, `/newsletters`), fetched live from `localhost:3100` and reduced to visible text (script discarded after use, not committed).
- Live Strapi content via REST (`site-setting`, `home-page`, `about-page`, `services`, `testimonials`, `team-members`, `faq-items`) — confirms what is CMS-driven vs. hardcoded.
- `kora.framer.media` browsed directly (structure/density only) and cross-checked against `trial/src/lib/content.ts` — the byte-identical Kora replica's own content model, which is the more reliable structural reference since it shares Ghanchi's exact component code.
- `docs/agency-audit/evidence/screenshots/kora-home-desktop.png` vs. a fresh `ghanchi-home-desktop.png`-equivalent capture at the same 1440×900 viewport, for direct hero-copy line-wrap comparison.
- Source: `src/components/home-sections.tsx`, `src/components/inner-pages.tsx`, `src/components/faq.tsx`, `src/lib/strapi.ts`.

---

## Findings

### 1. Per-service "quote" is the company quoting itself, not a testimonial — every one of the 9 homepage service cards

**What**: Each service card's glass-panel pull-quote is the service's own `longDesc` (first sentence, self-quoted) attributed to `name="Ghanchi Investments"`, `role="Our vision"` — hardcoded in `home-sections.tsx` line 23 (`<Person image={founder?.headshot || ''} name="Ghanchi Investments" role="Our vision" .../>`), not sourced from Strapi per-service.

**Where**: Homepage, all 9 service cards (`#services` section). Confirmed in rendered text (e.g. `home-text.txt` lines 96–100, 112–116, repeating identically for all 9 services) and in the Strapi `services` API response, where every one of the 9 records also carries the *identical* `testimonial` relation (id 34, Neeta Agrawal/Syntel) regardless of service.

**Why**: In Kora's own content model (`trial/src/lib/content.ts` lines 98–104), this exact slot holds a unique, named, real-sounding testimonial per service (`"Kora designed something that actually made our brand stronger." — James Martin, CEO, Hamilton`), differentiated service-to-service. Ghanchi's implementation downgrades that slot from "distinct social proof per offering" to "the company describing itself," repeated verbatim nine times with the same generic byline.

**Kora reference**: `service.testimonial = { quote, name: "James Martin", role: "CEO, Hamilton" }` — a real name, a real (if fictional-for-template) company, specific to that one service.

**Ghanchi current**: `Person name="Ghanchi Investments" role="Our vision"` — same two-word byline nine times; quote is a re-cut of copy already visible two lines above it in the same card.

**Recommended change** (content-truth-compliant — no invented names): either attribute the quote to the founder by name/role (`Chandrakant B. Ghanchi, Founder & Financial Planner`) instead of the impersonal company name, or replace the self-quote with a short line from one of the 11 real, already-verified testimonials that happens to reference that type of service.

### 2. Service detail pages repeat one testimonial across all 9 services, with a disclaimer admitting the mismatch

**What**: `/services/life-insurance` (and, per the Strapi data, every other service detail page) shows the same Neeta Agrawal / Syntel testimonial, followed by: *"Solutions depend on your circumstances and applicable product terms. Mutual funds are subject to market risks. Insurance benefits depend on policy conditions. The testimonial describes a general client experience, not a result for this specific service."*

**Where**: `life-insurance-text.txt` lines 25–30; confirmed in Strapi `services` API — all 9 records reference `testimonial.id = 34`.

**Why**: The page explicitly tells the visitor the proof point they just read doesn't relate to the service they're looking at. That's honest (good, per content-truth policy) but it's also a content-structure gap, not a acceptable end state — Kora's model avoids the problem entirely by having a different, relevant testimonial per service.

**Kora reference**: 5 distinct services, 5 distinct testimonials, no disclaimer needed because each one is actually about that service.

**Ghanchi current**: 9 services, 1 shared testimonial, disclaimer required to stay honest.

**Recommended change**: Of the 11 verified real testimonials, several reference specific service types by context (e.g. Manju Rajvanshi and Ashu Rajvanshi both reference "LIC and mediclaim" — life/health insurance). Map testimonials to services by actual quote content where a genuine match exists; leave the disclaimer in place for services where no real testimonial matches rather than force a mismatch.

### 3. Internal/provenance language leaking into customer-facing copy

**What**: Several visible strings read as internal editorial notes rather than brand copy:
- "From our client testimonial archive." (homepage testimonials section, below the featured quote)
- "Reported on our existing website. Not a live Google feed." (visible under the 5.0/5 rating)
- "Google rating reported on our existing website" — used as the literal **stat label** in the homepage stats grid (i.e., the visitor reads "0.0/5 Google rating reported on our existing website" as if it were a metric name)
- "From our financial education archive" — appears as the byline/role text under every article card (About Us "Learn with us", Blog listing, homepage Insights)

**Where**: `home-text.txt` lines 279, 286, 318; `about-us-text.txt` lines 56, 62; `blog-text.txt` lines 21, 27; `home-sections.tsx` (`InsightCard` in `inner-pages.tsx` line 20 hardcodes `role="From our financial education archive"`).

**Why**: These are accurate and honest (correctly disclose that content is archival/non-live, satisfying the content-truth policy) — the problem is register, not truthfulness. Kora's structurally equivalent elements (`"4.9/5 Based on 300 verified reviews"`, named article authors) never carry a visible internal caveat; the disclosure Ghanchi needs can live in a footnote or the existing footer disclosure line instead of inline in the primary copy slot.

**Kora reference**: Rating stat label is a crisp count ("Based on 300 verified reviews"); article bylines are named individuals ("James Okoro"), not a repeated apology for where the content came from.

**Ghanchi current**: The caveat *is* the stat label / *is* the byline, on every instance, sitewide.

**Recommended change**: Move the provenance disclosure to a single tooltip/footnote or the existing `footerDisclosure` line; restore short, confident labels ("Google Rating", author name or simply "Ghanchi Investments") in the primary copy slots.

### 4. Hero headline wraps to 3 lines vs. Kora's 2 at the same viewport, and the trust badge is denser than Kora's

**What**: At identical 1440×900 capture, Kora's hero headline ("Your growth partner for companies ready to scale.") sets on 2 lines; Ghanchi's ("Your trusted partner for financial planning and protection.") sets on 3 lines at the same font scale/column width.

**Where**: `docs/agency-audit/evidence/screenshots/kora-home-desktop.png` vs. this audit's own `home-top.png` capture, both 1440px wide.

**Why**: Same word count (8 words each) but Ghanchi's average word length is longer ("financial", "planning", "protection" vs. "growth", "ready", "scale"), softening the tight 2-line punch Kora's hero relies on for impact. The hero trust badge compounds this: Kora shows a single clean line ("Trusted by 50+ companies"); Ghanchi's badge adds an inline rating caveat ("5.0/5 · Google rating on existing site") in the same compact space, making the busiest part of the hero busier than Kora's equivalent.

**Kora reference**: 2-line headline; one-line trust badge.

**Ghanchi current**: 3-line headline; two-line trust badge (rating line wraps under the client count).

**Recommended change**: Not a rewrite (headline content is already approved per the transformation plan) — a tightening pass on word choice could reclaim the 2-line hero if desired; lower priority than findings 1–3 since it's a visual density nit, not a truth or structure problem.

### 5. Generic disclaimer text references mutual funds on service pages that aren't about mutual funds

**What**: The service-detail disclaimer ("...Mutual funds are subject to market risks...") is a single shared `disclaimerText` field applied verbatim to every service page, including Life Insurance, Personal Accidental Policy, and others that have nothing to do with mutual funds.

**Where**: `life-insurance-text.txt` line 30; confirmed as a single shared field in `src/lib/strapi.ts` (`ServicesPageContent.disclaimerText`, not per-service).

**Why**: Reads as a copy-pasted, one-size-fits-all disclaimer rather than a page tailored to the specific service, undercutting the "personalized" positioning used everywhere else in the copy (services intro literally says "Personalized solutions based on your needs").

**Recommended change**: Either generalize the sentence to not name a specific product category ("Product terms and benefits vary by policy; some products carry market risk"), or make the disclaimer conditional per service type.

### 6. Content backlog concentration: both live articles share one category

**What**: The only 2 currently-republished articles ("Single Woman, Retiring Solo…", "You Don't Have to Be Rich to Retire Rich!") are both tagged "Retirement Planning." They appear together, identically, in three separate places: homepage Insights, About Us "Learn with us", and the Blog listing.

**Where**: `home-text.txt` lines 368–373; `about-us-text.txt` lines 51–59; `blog-text.txt` lines 13–27.

**Why**: Not a copy-quality defect (both articles are legitimately verified per `docs/CURRENT_IMPLEMENTATION_PLAN.md` §10a) — but it means every "knowledge/insights" touchpoint on the site currently signals one topic only, which narrows the site's apparent editorial range. This is a known, already-flagged gap (23 more legitimate WordPress articles are documented as backlog in the plan, §10) — flagging here only to note it surfaces three times, not once.

**Recommended change**: Prioritize republishing at least one article from a different category (e.g. life insurance or child education) from the existing 23-article backlog before the next content push.

### 7. FAQ taxonomy: two disclaimer-style questions filed under "Online Services"

**What**: "Are the ratings updated live?" and "Do you guarantee investment returns?" are categorized under **Online Services** in Strapi, alongside the one question that's actually about online portals ("Where can I access my investments or renew a policy?").

**Where**: `faq2.json` — items id 20, 22 (category: "Online Services") vs. id 18 (the genuine online-services question).

**Why**: Minor IA mismatch — a visitor tabbing to "Online Services" expecting portal/account help instead finds a ratings-methodology disclaimer and a returns-guarantee disclaimer. Low-impact since all 11 FAQ items are visible somewhere regardless of tab.

**Recommended change**: Recategorize the two disclaimer questions under "General" (where the ratings/stats claims are actually made, on the homepage).

---

## Prioritized Findings

- **P1** — Finding 1: Self-quoted "Ghanchi Investments / Our vision" attribution on all 9 homepage service cards, replacing Kora's differentiated per-service testimonial slot.
- **P1** — Finding 2: Identical single testimonial + mismatch disclaimer repeated across all 9 service detail pages.
- **P2** — Finding 3: Internal-sounding provenance/disclosure copy used as primary stat labels and bylines sitewide (ratings label, testimonial-archive line, article bylines).
- **P2** — Finding 5: Shared disclaimer text names "mutual funds" on service pages unrelated to mutual funds.
- **P3** — Finding 4: Hero headline/trust-badge density slightly higher than Kora's equivalent (3-line vs. 2-line hero, denser badge).
- **P3** — Finding 6: All current live-article touchpoints show the same single content category (data backlog issue, not a copy defect).
- **P3** — Finding 7: Two ratings/returns disclaimer FAQs miscategorized under "Online Services" instead of "General."
