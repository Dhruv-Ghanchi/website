# Evidence Index

All evidence below was gathered live during this audit session (2026-09-25), via `evidence/gather-evidence.mjs` (Playwright + `playwright-core`, not part of the app — a one-off script, kept here rather than deleted since the brief asks for evidence traceability; safe to delete once this audit is closed out). Raw extracted text lives in `evidence/evidence-data.json`. Nothing below is from memory or from the prior `docs/agency-audit/` pass's cached findings — this is a fresh capture against the live sites.

## Sources captured

| Source | Method | Result |
|---|---|---|
| `https://kora.framer.media/` (home) | Full-page + 9 fold screenshots at 1440×900, full body text extraction | ✅ Captured — `evidence/screenshots/kora/home-*.png`, `evidence-data.json → kora.bodyText` |
| `https://kora.framer.media/about`, `/cases/sitemark`, `/insights` | Full-page screenshot + body text, for inner-page tone reference | ✅ Captured — `evidence/screenshots/kora/inner_*.png`, `evidence-data.json → kora.page_*` |
| `http://localhost:3100/` (current Ghanchi build, home) | Full-page + 12 fold screenshots at 1440×900, plus targeted per-section text extraction via known CSS selectors (`.hero-copy`, `.trust-badge`, `.services-intro`, `.hero-statement h2`, `.before-card`, `.after-card`, `.team-section`, `.hiring-card`, `.testimonial-feature`, `.founder-callout`, `.featured-case`, `.insights-intro`, `.footer-message`, `.footer-top`) | ✅ Captured — `evidence/screenshots/ghanchi/home-*.png`, `evidence-data.json → ghanchi.*` |
| `http://localhost:3100/about-us`, `/services/life-insurance`, `/about-us/awards`, `/about-us/our-clients`, `/about-us/testimonials`, `/contact-us` | Full-page screenshot + body text | ✅ Captured — `evidence/screenshots/ghanchi/inner_*.png`, `evidence-data.json → ghanchi.page_*` |
| `https://ghanchiinvest.com/` and `https://www.ghanchiinvest.com/` (live production site) | Full-page screenshot + body text, realistic desktop user-agent | ⚠️ Both resolve but render a **blank white page** to automated fetch — `evidence/screenshots/live/https___ghanchiinvest_com_.png` (5,850 bytes, visually empty). Confirms the bot-protection finding already on record in `docs/QA_REPORT.md`; not usable as a live content source. |
| `https://www.ghanciinvest.com/` (as typed in the brief) | Same method | ❌ `ERR_NAME_NOT_RESOLVED` — this hostname does not exist. Likely a typo for `ghanchiinvest.com`. Flagged, not silently corrected. |

## Headline visual evidence (the clearest single artifacts)

1. **`evidence/screenshots/kora/home-fold0.png` vs. `evidence/screenshots/ghanchi/home-fold0.png`** — the hero. Identical tulip macro photograph (Kora's own unedited stock, already flagged in `docs/agency-audit/MEDIA_AUDIT.md` P1-5), identical layout grid, identical bottom-right "teaser card" pattern (Kora: "New Case Study" card with a portrait photo + stat; Ghanchi: "Latest Newsletter" card using the *same visual container* over a Kora-stock art-gallery photo). Even the headline follows Kora's exact sentence template: **"Your growth partner for companies ready to scale."** → **"Your trusted partner for financial planning and protection."** (`Your [adjective] partner for [noun phrase].`)
2. **`evidence/screenshots/kora/home-fold2.png` / `fold3.png` vs. `evidence/screenshots/ghanchi/home-fold3.png` / `fold6.png`** — the sticky mid-scroll statement. Kora: *"The strategies that built your company won't scale it."* then *"What changes when you work with us."* Ghanchi: *"What changes when you plan with us."* — literally the same sentence with one word substituted, confirmed via direct text extraction, not visual impression.
3. **`evidence-data.json → ghanchi.servicesIntro` vs. `kora.bodyText`'s services section** — Kora's five services each carry a *named, quantified* value claim ("Within six months... clients experienced an average 47% increase in annual revenue," a specific named case study, a specific named CEO quote). Ghanchi's services intro is qualitative only ("Personalized solutions based on your needs, risk appetite and cash flows") — correctly so, since Ghanchi has no comparable audited outcome data to quote (inventing one would violate the project's own content-truth policy) — but the *section shape* (numbered service cards, each with a pull-quote testimonial in the same position) is unchanged from Kora, so the absence of Kora's specific evidence type reads as a gap rather than a different kind of section.

## Full section-by-section text (Ghanchi, extracted live)

See `evidence-data.json` for the complete strings; reproduced here for quick reference in the other audit documents:

- **Hero H1**: "Your trusted partner for financial planning and protection."
- **Hero subheading**: "Ghanchi Investments helps families plan, protect, and invest with confidence."
- **Sticky statement**: "Making goal-based financial advice accessible to all."
- **Trust badge**: "Trusted by 1,200+ clients / 5.0/5 · Google rating on existing site"
- **Services intro**: "Your goals deserve more than isolated decisions. We bring planning, protection and investing together around your life. Personalized solutions based on your needs, risk appetite and cash flows."
- **Comparison — Before**: "Financial decisions made in isolation." + 4 generic pain-point bullets
- **Comparison — After**: "Every decision aligned with your goals." + 4 generic resolution bullets
- **Team heading**: "Meet your advisor. A personal partnership."
- **Team row** (only one — single founder): "Chandrakant B. Ghanchi / Founder & Financial Planner / 01"
- **Hiring-card repurpose (Recognition panel)**: "Recognition. Built on service. Explore our awards and certificates archive, reflecting our journey in financial services."
- **Testimonials heading + featured quote**: "Testimonials" / Neeta Agrawal (Syntel) quote / "From our client testimonial archive." / "Reported on our existing website. Not a live Google feed."
- **Founder callout**: "Your goals are personal. Your plan should be too. Let's start with a conversation." + Chandrakant B. Ghanchi / Founder & Financial Planner
- **Featured case (repurposed "client community" panel)**: "Serving clients since 2009 / A personal approach, for clients in India and abroad." + stat dl (Our focus: Your goals / Our clients: Individuals & families / Review: Annually) + 15+ years / 1,200+ clients
- **Insights intro**: "Knowledge for your next chapter. Financial education from our archive. Original dates are retained."
- **Footer message**: "Making Goal-based customized Financial Advice accessible to all and spread Financial Literacy. Let's plan your financial future together." + founder Person block + both phones + both emails

## Full section-by-section text (Kora, extracted live)

Full text in `evidence-data.json → kora.bodyText`. Key structural facts used elsewhere in this audit:
- Every one of Kora's 5 service cards ends in a **named, titled, quoted human** ("James Martin, CEO, Hamilton"; "Sarah Bouchard, Founder & CEO, Lightspeed"; etc.) — a different person per card, not a repeated single spokesperson.
- Kora's team section lists **6 named people with distinct titles** (Founder & CEO, Head of Growth Strategy, Senior Growth Consultant, Growth Operations Lead, Head of Client Solutions, Revenue Strategist) — a leadership bench, not a solo founder.
- Kora's founder callout is **first-person**: *"I've personally led 40+ growth engagements. Let me show you what's possible for yours."* — Ghanchi's equivalent (`founderCallout`) is third-person/company-voice throughout, never "I."
- Kora's FAQ opens with *"What exactly does Kora do?"* answered in a specific, opinionated, differentiating way ("We are not an agency that runs campaigns... most of the time, the problem is not a lack of tactics") — a genuine point of view, not a category description.

## Evidence NOT captured (and why)

- **Live production site content** — attempted, returned blank (see table above). Business facts instead sourced from `docs/CURRENT_IMPLEMENTATION_PLAN.md` §4 (verified facts recovered from the transformation-plan docx and cross-checked against a direct WordPress database pull, §10a) — that document's own sourcing discipline (raw SQL parse of the live WP backup, not the old site's rendered HTML) is treated as authoritative here, since it is a closer, more reliable source than a bot-blocked live fetch would have been anyway.
- **Mobile-viewport screenshots** — not re-captured this pass; the prior audit's `docs/agency-audit/evidence/screenshots/ux-walkthrough/p5-*-mobile-*.png` set already exists and is referenced directly where mobile behavior is relevant, rather than duplicating the capture.
- **Video/audio content** — Kora's "How we work" video and Ghanchi's process-video fallback were not analyzed frame-by-frame; not material to the brand-voice question this audit answers.
