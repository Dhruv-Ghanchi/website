# Three Sources of Truth

Established separately, as the brief requires, before any comparison is drawn between them. Source A and B were captured live this session (see `EVIDENCE.md`). Source C is compiled only from material already verified elsewhere in this project — nothing here is inferred or invented.

---

## A. Original Kora (`https://kora.framer.media/`)

**What it is**: a Framer-hosted marketing site for a fictional B2B growth consultancy, sold as a $129+ Framer template ("Unlock from $129", "Made in Framer" badges visible sitewide — confirmed in `evidence-data.json → kora.bodyText`).

**Who it's speaking as**: "Kora," founded/fronted by "Koraline Spencer, Founder & CEO" — a fictional person, with a 6-person named leadership team, each with a distinct title (Head of Growth Strategy, Senior Growth Consultant, Growth Operations Lead, Head of Client Solutions, Revenue Strategist).

**What it sells**: growth strategy consulting for B2B companies ($2M–$50M revenue) across 5 named service lines (Go-to-Market, Growth Strategy, Revenue Operations, Sales Optimization, Pricing & Packaging), each with a specific quantified outcome claim (e.g. "clients experienced an average 47% increase in annual revenue... across B2B clients with $5M to $50M in annual revenue over a standard 6-month engagement").

**Its actual brand voice, in its own words** (verbatim, `evidence-data.json`):
- Confident, specific, faintly combative: *"Most consultancies slow you down with process and overhead. We built our process to get to revenue impact in weeks, not quarters."*
- Opinionated, not just descriptive: *"We are not an agency that runs campaigns... most of the time, the problem is not a lack of tactics. It is a lack of clarity on what to prioritize."*
- First-person founder authority: *"I've personally led 40+ growth engagements. Let me show you what's possible for yours." — Koraline Spencer, Founder & CEO*
- Every claim is quantified or named: "$14.2M avg ARR," "300 verified reviews," "40+ Long-term partnerships," named client companies (Sitemark, Lightspeed, Theo, Hamilton, Elevance) with named quoted executives.

**Its structural DNA** (the template mechanics, independent of content): scroll-pinned hero with zoom/blur, a sticky oversized mid-scroll statement, a numbered 5-service list each ending in a named-person pull-quote, a 4-phase process framework (Diagnose→Design→Build→Transfer), a tiered pricing panel, a named 6-person team grid, a stats bar, a "case study" panel with a client logo and outcome stats, an FAQ, a newsletter signup, and a footer with a giant wordmark.

---

## B. Current Ghanchi Investments website (`http://localhost:3100/`, current build)

**What it is**: the same Kora component library and CSS system (confirmed byte-identical in the prior `docs/agency-audit/KORA_VS_GHANCHI_COMPARISON.md` fidelity pass), populated with real Ghanchi content through Strapi.

**Who it's speaking as**: "Ghanchi Investments," fronted by one real person, Chandrakant B. Ghanchi (Founder & Financial Planner) — confirmed live, `evidence-data.json → ghanchi.teamRows`: `["Chandrakant B. Ghanchi\nFounder & Financial Planner\n01"]`. There is no second team member; the team-grid structure built for Kora's 6-person bench holds exactly one row.

**What it sells**: 9 real financial/insurance advisory services for individuals and families (Financial Planning, Life Insurance, Health Insurance, Mutual Funds, Retirement Planning, Child Education Planning, Personal Accidental Policy, General Insurance, Employer Employee Insurance) — no quantified outcome claims per service (correctly so — Ghanchi has no audited before/after client data comparable to Kora's "47% revenue growth," and inventing one would violate this project's own content-truth policy, already established in `docs/CURRENT_IMPLEMENTATION_PLAN.md` §5/§17).

**Its actual copy voice, in its own words** (verbatim, `evidence-data.json → ghanchi.*`):
- Hero: *"Your trusted partner for financial planning and protection."* / *"Ghanchi Investments helps families plan, protect, and invest with confidence."*
- Sticky statement: *"What changes when you plan with us."*
- Services intro: *"Your goals deserve more than isolated decisions. We bring planning, protection and investing together around your life. Personalized solutions based on your needs, risk appetite and cash flows."*
- Founder callout: *"Your goals are personal. Your plan should be too. Let's start with a conversation."* — third-person/company voice throughout; no first-person "I" anywhere in the extracted homepage text.
- Recognition panel (repurposed from Kora's "we're hiring" panel): *"Recognition. Built on service. Explore our awards and certificates archive, reflecting our journey in financial services."*

**Structurally**: every one of Kora's mechanics listed above is still present and still carrying the load it carried for Kora, with content substituted: the 9-service numbered list still ends each card in a named-person pull-quote (now the same one person, Chandrakant, nine times — see `IDENTITY_LEAK_AUDIT.md`); the 4-phase process framework is retained (relabelled Understand/Assess/Plan/Review); the tiered pricing panel is removed (the one approved full removal, per `docs/CURRENT_IMPLEMENTATION_PLAN.md` §5); the case-study panel became the "featured case" client-community panel; the newsletter-teaser card in the hero corner still shows a Kora-stock photo (`docs/agency-audit/MEDIA_AUDIT.md` P1-5, not yet replaced).

---

## C. Actual Ghanchi Investments brand / business identity (verified, project-sourced)

Compiled exclusively from material already verified elsewhere in this project. Every fact below is cited to its source; nothing is invented for this audit. Anything the client asked about that is **not** covered by an existing source is marked explicitly.

**Verified facts** (source: `docs/CURRENT_IMPLEMENTATION_PLAN.md` §4, itself sourced from the owner-approved transformation-plan docx and cross-checked against a direct raw-SQL parse of the real WordPress database, §10a — not guessed):
- Legal/trading name: Ghanchi Investments. Founded/established **2009**.
- Founder: **Chandrakant B. Ghanchi**.
- Address: Shop no. 27, Sector 11, Balaji Bhavan, CBD Belapur, Navi Mumbai, Maharashtra 400614.
- Phones: +91 9820926446, +91 7977061717. Emails: info@ghanchiinvest.com, chandrakant@ghanchiinvest.com.
- Editorial stats (owner-approved, not independently audited): 1,200+ clients, 15+ years experience, 12+ awards, 5.0/5 static Google rating "as reported on the existing site, not a live feed."
- Client geography: India, UAE, USA.
- 11 real testimonials, named individuals with employer affiliations (individual clients' employers, not corporate endorsements — e.g. Neeta Agrawal / Syntel).
- Genuine business records already in the project and confirmed authentic (`docs/MEDIA_INVENTORY.md`): a real candid founder headshot, 8 real award photographs (filenames cross-matched to actual WordPress attachment records), 19 real certificate scans (one directly verified as a "Certificate of Recognition" from Bima Gurukul, awarded to Chandrakant Ghanchi by name, 2020), the real logo.
- Real social links (`docs/CURRENT_IMPLEMENTATION_PLAN.md` §10a): Facebook, Instagram, LinkedIn (two slightly different URL forms found, not yet reconciled), YouTube.
- Historical detail with texture, sitting unused: the old WordPress site's contact forms notified `chandrakantlic@gmail.com` (general) and `chandrakant@ghanchiinvest.com` (appointments) — suggesting the founder's professional history includes LIC (Life Insurance Corporation) affiliation, a real detail never surfaced on the current site.
- Online-service integrations reflecting the real advisory relationships the business maintains on clients' behalf: LIC Registered User, LIC Pay Premium Direct, Fundz Bazar, NJ E-Wealth Account, NJ Client Desk, Niva Bupa / Star Health / HDFC Ergo renewal links.

**Live production site**: `ghanchiinvest.com` was fetched live for this audit and returned a **blank white page** to automated access (bot-protected — see `EVIDENCE.md`). It could not be used as a source. This means the current site's actual predecessor voice/tone could not be directly re-verified visually in this pass; the WordPress-database-level facts above (§10/§10a of the implementation plan) are the closest available substitute, and they are structural/factual, not tonal — they tell us *what* the business is, not *how it used to sound*.

**OWNER / BUSINESS VERIFICATION REQUIRED** — genuinely not documented anywhere in this project, not something this audit can source:
- The founder's personal story: why/how Chandrakant B. Ghanchi started the business in 2009, what shaped his approach to financial planning.
- Any explicit stated philosophy or point of view about financial planning (Kora has one — "the problem is not a lack of tactics" — Ghanchi's equivalent does not appear to exist anywhere in the project's content).
- Real specific client relationship stories beyond the 11 testimonial quotes already in use.
- Confirmation of the founder's LIC-affiliation history hinted at by the old contact-form recipient address, and any other professional credentials/designations not already listed.
- Any real photography of the actual office, team (if any beyond the founder), or client meetings beyond the single verified founder headshot.

---

## What the comparison of A, B, and C actually shows

Kora (A) is a confident, specific, quantified, multi-person B2B sales voice wrapped around fictional facts. Ghanchi's current implementation (B) is Kora's exact structural and tonal machinery, now population by real but comparatively thin facts (C) — a single real founder standing in the slots built for a six-person team, real testimonials standing in for named case studies with dollar figures, and a real "since 2009" history that is stated once but never developed with texture, because the texture (the founder's actual story) simply isn't written down anywhere in the project yet.

This is the structural root of the "pasted-on logo" perception: it is not that the facts are wrong — every fact in B traces to C — it's that B's sentence templates and section shapes are sized for Kora's volume and specificity of proof, and C currently doesn't have (or hasn't yet surfaced) content at that volume, so the gaps read as genericness rather than as Ghanchi's own, differently-shaped, story. See `IDENTITY_LEAK_AUDIT.md` for the section-by-section breakdown and `BRAND_DIFFERENTIATION_STRATEGY.md` for what to do about it.
