# Kora → Ghanchi Identity Leak Audit

Per-section classification, per the brief: **KORA DNA THAT SHOULD REMAIN** / **GHANCHI DNA THAT IS MISSING** / **KORA DNA THAT IS TOO DOMINANT** / **GHANCHI CONTENT THAT IS TOO WEAK** / **GHANCHI CONTENT PRESENTED LIKE GENERIC TEMPLATE CONTENT**, plus the swap test for each section: *"Could I replace Ghanchi's logo, founder name and company copy with another financial company's and would this section still look almost identical?"*

Evidence: `EVIDENCE.md`, `evidence/evidence-data.json`, screenshots in `evidence/screenshots/{kora,ghanchi}/`. Cross-referenced against the specialist agents' deeper dives (`BRAND_AUTHENTICITY_AUDIT.md`, `VISUAL_IDENTITY_AUDIT.md`, `IMAGERY_AUTHENTICITY_AUDIT.md`, `CONTENT_AUTHENTICITY_AUDIT.md`, `UX_PERSONA_WALKTHROUGH.md`) once available; this document was drafted from direct evidence first, then reconciled — see `FINAL_BRAND_AUTHENTICITY_REPORT.md` for any place another agent's finding sharpened or corrected a classification made here.

---

## Homepage — Hero

**Evidence**: `screenshots/kora/home-fold0.png` vs `screenshots/ghanchi/home-fold0.png`.

- **KORA DNA THAT SHOULD REMAIN**: the scroll-pinned zoom/blur mechanic, the pill nav, the pill CTA buttons, the trust-badge/marquee position, the general two-line-headline-plus-subhead-plus-two-CTA layout grammar.
- **KORA DNA THAT IS TOO DOMINANT**: (1) the hero image itself is Kora's own unedited stock tulip photo — already flagged P1-5 in the prior fidelity audit, not yet fixed; it is literally Kora's, not adapted at all. (2) The headline follows Kora's exact sentence template — "Your growth partner for companies ready to scale." → "Your trusted partner for financial planning and protection." (`Your [adjective] partner for [noun phrase].`) — a template swap, not an independently-written headline. (3) The bottom-right "teaser card" (Kora: a case-study card with a real client photo and a 47% stat; Ghanchi: a "Latest Newsletter" card using the identical visual container over a different piece of Kora stock photography — a moody art-gallery installation shot, also flagged P1-5) borrows Kora's specific "look, proof, right here" affordance for a lower-stakes newsletter link, which is a weaker fit for that visually prominent slot.
- **GHANCHI DNA THAT IS MISSING**: nothing in the hero establishes place (Navi Mumbai / India), person (no founder presence in the hero at all — the founder photo only appears as a small header avatar, not here), or specificity beyond "financial planning and protection," a category description any advisor could use.
- **Swap test**: **YES** — replace "Ghanchi Investments" with any financial-advisory brand name and the hero is unchanged. Nothing in it (image, headline, subhead, CTA labels) is Ghanchi-specific.

## Homepage — Trust badge / marquee

**Evidence**: `evidence-data.json → ghanchi.trustBadge`; `screenshots/*/home-fold0.png`.

- **KORA DNA THAT SHOULD REMAIN**: the overlapping-avatar + rating + marquee mechanic itself is a sound, compact trust pattern.
- **KORA DNA THAT IS TOO DOMINANT / GHANCHI CONTENT PRESENTED LIKE GENERIC TEMPLATE CONTENT**: Kora's avatars are real photographed people; Ghanchi's are 2-letter initials on a mint circle (already flagged and *correctly* defended in the prior audit as a content-truth-driven substitution, not a defect — no fabricated client photos without consent — `docs/agency-audit/KORA_VS_GHANCHI_COMPARISON.md`). Kept here as a re-confirmed non-issue, not re-litigated.
- **GHANCHI DNA THAT IS MISSING**: the marquee itself ("India • UAE • USA") is genuinely Ghanchi-specific (real client geography) and works — this is one of the few hero-zone elements that would fail the swap test in Ghanchi's favor. Flagged as a **KEEP**, not a gap.
- **Swap test**: **PARTIAL** — the initials avatars and "1,200+ clients" stat are genuric-feeling in isolation, but the India/UAE/USA marquee is specific enough to fail the swap test. Net: mostly swappable, with one real anchor.

## Homepage — Services

**Evidence**: `screenshots/ghanchi/home-fold8.png`, `fold9.png`, `fold10.png`, `fold11.png`; `evidence-data.json → ghanchi.servicesIntro`.

- **KORA DNA THAT SHOULD REMAIN**: the numbered-card layout, the "What we discuss/offer" bullet-chip pattern, the image-with-overlaid-quote-card composition.
- **KORA DNA THAT IS TOO DOMINANT**: every one of Kora's 5 service cards ends in a **different named, titled, quoted person** (a real social-proof structure — a distinct outcome, from a distinct client, per service). Ghanchi's 9 cards each carry the exact same visual slot, but it is filled by the **same one person** (Chandrakant B. Ghanchi) nine times, quoting the service's own description back at itself rather than a client outcome (already flagged as P1-1 in the prior fidelity audit and partially remediated — the quote is now correctly attributed to the founder by name rather than "Ghanchi Investments," but the underlying structural mismatch, one person standing in nine times for what Kora built as nine-distinct-voices, remains). Directly visible in `home-fold9.png`: the Retirement Planning card pairs a generic stock photo of a hand tapping a payment terminal (already flagged, unrelated to retirement) with Chandrakant's photo and a quote about retirement planning — the founder's real identity pasted onto imagery that has nothing to do with him or the service.
- **GHANCHI DNA THAT IS MISSING**: none of the 9 services state a real differentiator — why a client should discuss retirement planning with Ghanchi specifically rather than any advisor. The "What we discuss" bullet lists are procedurally accurate but generic to the category (e.g. "Retirement goals, Future expense planning, Income needs" — true of any retirement-planning conversation with any advisor anywhere).
- **Swap test**: **YES for 8 of 9 cards** (Retirement Planning, Child Education Planning, Personal Accidental Policy, General Insurance, Employer Employee Insurance, Mutual Funds carry Kora-stock imagery already flagged for replacement, and generic category bullet lists). **PARTIAL for Financial Planning, Life Insurance, Health Insurance** — these 3 have the already-correct AI-generated Indian-context imagery, which weakens (but doesn't eliminate) the swap test.

## Homepage — Comparison scene ("Before / After")

**Evidence**: `screenshots/ghanchi/home-fold5.png` (static rest state, confirms the Phase-1 fix removing the duplicate logo from the "Before" card already landed).

- **KORA DNA THAT SHOULD REMAIN**: the scroll-driven split-exit/slide-in scene mechanic itself — a genuinely distinctive, well-executed piece of motion design, confirmed byte-identical and functioning correctly.
- **KORA DNA THAT IS TOO DOMINANT**: the *content* of the before/after lists is Kora's rhetorical structure (a list of generic pain points → a list of generic resolutions) with financial-planning nouns substituted for growth-consulting nouns. "Financial decisions made in isolation" / "Goals planned but never implemented" / "Insurance coverage that leaves gaps" read as textbook financial-advisory pain points, not anything that signals a specific advisor's actual diagnostic process.
- **GHANCHI CONTENT PRESENTED LIKE GENERIC TEMPLATE CONTENT**: yes — this is the single clearest instance of "the shape survived, the content is templated into it" on the homepage.
- **Swap test**: **YES** — every bullet on both cards could sit on any financial-advisory site's comparison scene unchanged.

## Homepage — Sticky mid-scroll statement

**Evidence**: `screenshots/kora/home-fold2.png`/`fold3.png` vs `screenshots/ghanchi/home-fold3.png`/`fold6.png`.

- **KORA DNA THAT SHOULD REMAIN**: the scroll-driven per-word blur reveal is Kora's single most technically distinctive effect and is confirmed faithfully preserved (`docs/agency-audit/KORA_MOTION_AUDIT.md`) — a genuine Kora-system asset, not a content decision, and should stay.
- **KORA DNA THAT IS TOO DOMINANT**: the sentence itself is a direct template copy — Kora: "What changes when you work with us." Ghanchi: "What changes when you plan with us." — one word substituted. This is the sharpest single piece of evidence in this whole audit for "content inserted into Kora's sentence, not a sentence Ghanchi wrote."
- **Swap test**: **YES**, trivially — the sentence is Kora's, word-for-word except one verb.

## Homepage — Founder / "team" section

**Evidence**: `evidence-data.json → ghanchi.teamHeading` ("Meet your advisor. A personal partnership."), `ghanchi.teamRows` (one row only), `ghanchi.founderCallout`.

- **KORA DNA THAT SHOULD REMAIN**: the dialog-based "click a row to see a fuller bio" interaction pattern is a sound, reusable UI idea regardless of team size.
- **KORA DNA THAT IS TOO DOMINANT**: the section is still visually and structurally built as a *team grid* (2-column list of rows) holding exactly one entry — the container's own shape ("Meet the team behind the growth" energy, even after the heading was rewritten) implies a bench that doesn't exist. This is a structural leftover from Kora's 6-person team, not something Ghanchi chose.
- **GHANCHI DNA THAT IS MISSING**: this is the one section of the entire site whose *entire job* is "who is the person I'd be trusting with my money," and the founder callout copy ("Your goals are personal. Your plan should be too. Let's start with a conversation.") never actually says anything about Chandrakant as a person — no years of experience stated here, no first-person voice (contrast Kora's "I've personally led 40+ growth engagements"), no specific credential, no story.
- **GHANCHI CONTENT THAT IS TOO WEAK**: the founder callout is generic encouragement copy, not founder content.
- **Swap test**: **PARTIAL** — the real name and real photo mean this section is not fully swappable (a competitor's site wouldn't have "Chandrakant B. Ghanchi" in it), but the *copy* around that name is entirely generic and would read identically with any other advisor's name substituted.

## Homepage — Recognition panel (Kora's "we're hiring" repurposed)

**Evidence**: `evidence-data.json → ghanchi.hiringCard`.

- **KORA DNA THAT IS TOO DOMINANT**: this panel's entire layout (large image + heading + short paragraph + single CTA, in the exact visual weight Kora gave to "join us, we're hiring") is unchanged; only the words were swapped. The copy itself — "Recognition. Built on service. Explore our awards and certificates archive, reflecting our journey in financial services." — reads as a caption written to fit an existing box, not as a section conceived from Ghanchi's actual, genuinely strong asset here (12+ awards, 20 real certificates, one independently verified as a named 2020 recognition from Bima Gurukul).
- **GHANCHI DNA THAT IS MISSING**: none of that specific, real, verifiable credibility (Bima Gurukul, MDRT if applicable, LIC recognitions — see `docs/agency-audit/VISUAL_EVIDENCE.md`/`UX_WALKTHROUGH.md` P2-18 on the certificates wall mixing financial credentials with unrelated recognitions) surfaces here or anywhere on the homepage. This is Ghanchi's single most under-leveraged authentic asset.
- **Swap test**: **YES** as currently worded — "Recognition. Built on service." could caption any professional-services awards page.

## Homepage — Testimonials

**Evidence**: `evidence-data.json → ghanchi.testimonialFeature`.

- **KORA DNA THAT SHOULD REMAIN**: the featured-quote + review-score + expandable-list layout.
- **GHANCHI DNA PRESENT AND GENUINE**: the featured quote (Neeta Agrawal, Syntel) is a real, named, verified testimonial — this is one of the strongest authentically-Ghanchi elements on the page, correctly not fabricated.
- **KORA DNA THAT IS TOO DOMINANT / GHANCHI CONTENT PRESENTED LIKE GENERIC TEMPLATE CONTENT**: the byline under the quote reads "From our client testimonial archive," and the rating block reads "Reported on our existing website. Not a live Google feed." — both are honest, correct disclosures (already flagged as working-as-intended provenance language in the prior audit), but their prominence as the *primary* caption, ahead of any specific detail about Neeta's actual situation or what Chandrakant did for her, makes a genuine testimonial read procedurally, like a disclaimer-first template field, rather than as a story.
- **Swap test**: **NO for the quote itself** (a real person's real words) — **YES for the presentation frame** around it.

## Homepage — Featured Case ("client community" panel, repurposed from Kora's case study)

**Evidence**: `evidence-data.json → ghanchi.featuredCase`.

- **KORA DNA THAT IS TOO DOMINANT**: Kora's equivalent panel is a single named case study ("How Sitemark broke through an $18M plateau...") with specific dollar figures. Ghanchi's repurposed version ("Serving clients since 2009 / A personal approach, for clients in India and abroad") correctly avoids inventing a comparable single-client case study (no audited outcome data exists to cite — correct restraint), but the result is an aggregate, impersonal stat block (15+ years, 1,200+ clients) sitting in a slot Kora built for one specific, human story. The structural mismatch is a genuine, hard-to-solve tension: Kora's layout wants one story, and the honest Ghanchi content available is a statistic.
- **Swap test**: **PARTIAL** — the stats are real Ghanchi numbers, but the section's rhetorical shape ("here is proof, in the form of one compelling number") is doing Kora's job, not telling an actual Ghanchi client's story.

## Homepage — Insights (Articles)

**Evidence**: `evidence-data.json → ghanchi.insightsIntro`.

- Already well-covered by the prior content audit (`docs/agency-audit/CONTENT_AUDIT.md` F6 — all live articles show the same single category, a data-backlog issue not a copy defect). Not re-litigated here. One brand-specific note: "Knowledge for your next chapter. Financial education from our archive. Original dates are retained." is honest and specific about the archive nature — this is a case of Ghanchi content correctly *not* imitating Kora's "Lessons, frameworks, and honest takes" confident-thought-leadership framing, since Ghanchi's 2 live articles are labelled adaptations of 2021-era pieces, not a live editorial operation. Correct restraint, not a gap.

## Newsletters

Not present as a distinct Kora section at all (Kora has no newsletter archive) — this is a genuinely Ghanchi-specific addition to the IA. The one identity-leak issue here is imagery, not structure: the newsletter teaser (hero corner) and the archive both point at the same still-Kora-stock cover image (P1-5, already flagged). Structurally this section is **already Ghanchi's own**, not Kora's.

## About Us

**Evidence**: `evidence-data.json → ghanchi.page_about-us` (full extracted text available for the specialist agents' deeper read).

Flagged here at a high level for the identity-leak classification; full content-level analysis is `CONTENT_AUTHENTICITY_AUDIT.md`'s job. Structural note: About Us and its sub-pages (Awards, Certificates, Our Clients, Testimonials) are Ghanchi-specific IA extensions beyond Kora's flat 4-link nav (already confirmed a justified addition in the prior fidelity audit) — the *existence* of this IA is Ghanchi DNA, correctly added. Whether its *content* delivers a founder story is a content-authenticity question, answered in that document.

## Contact

Largely Kora-structure-neutral (a contact form is a contact form); the genuinely Ghanchi-specific content here — real address, two real phone numbers, two real emails, honest "Office Hours Mon–Fri" — is already correct and specific. No significant identity leak found in this section structurally.

## Footer

**Evidence**: `evidence-data.json → ghanchi.footerMessage`, `ghanchi.footerTop`.

- **KORA DNA THAT SHOULD REMAIN**: the giant wordmark treatment, the circle-reveal scroll animation, the social-icon roll-up hover — all confirmed byte-identical, purely a design-system asset, not a content decision.
- **GHANCHI DNA PRESENT AND GENUINE**: the footer message now correctly pulls `siteSettings.vision` ("Making Goal-based customized Financial Advice accessible to all and spread Financial Literacy. Let's plan your financial future together.") — this is real, CMS-managed, Ghanchi-specific copy, and (per the roadmap work already completed this session) is no longer drifting from the About page's copy of the same field. Real address, real phones, real emails all present and correct.
- **Swap test**: **NO** — the footer, alone among all homepage sections, contains enough real specific detail (exact address, two real phone numbers, two real emails, the founder's real name) that it would not read as generic even with the logo removed. This is the strongest "unmistakably Ghanchi" section on the entire page, and it's also the *last* thing a visitor sees, on the page's furthest-scrolled content — the identity proof is backloaded almost as far as it can go.

---

## Summary pattern across sections

The leak is consistent and mechanical, not random: **every section retains its Kora-built container's rhetorical shape and specificity requirement (a named person, a quantified outcome, a first-person voice, a differentiated stance), and Ghanchi content fills that shape with the real facts it has, at a lower specificity/volume than the container expects.** The two sections that pass the swap test *least* (footer, testimonials-quote-itself) are exactly the two sections carrying the most concrete, specific, real detail — which is direct evidence that specificity, not a redesign, is what closes this gap. See `BRAND_DIFFERENTIATION_STRATEGY.md`.
