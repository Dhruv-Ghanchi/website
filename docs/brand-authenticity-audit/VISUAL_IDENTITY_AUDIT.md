# Visual Identity Audit — Kora Composition vs. Ghanchi Content

Auditors acting jointly: **UI Designer** (visual-hierarchy/system eye), **UX Architect** (structural/IA view), **UI Finish-Gate Reviewer** (the deciding voice — every section below is run through its exact test: *"Could I replace Ghanchi's logo, founder name and company copy with another financial company's and would this section still look almost identical? If yes, why — name the specific interchangeable pattern."*).

**Scope discipline.** The prior audit (`docs/agency-audit/KORA_VS_GHANCHI_COMPARISON.md`) already confirmed Kora's *design system* — type scale, color tokens, button/card geometry, spring motion — is faithfully and correctly carried into Ghanchi. This document does not re-litigate that. It asks a different question: are Kora's *specific compositional decisions* (what goes first, what shape a proof-card takes, what a numbered-phase panel claims, what a chart is measuring) still driving the page even where they no longer fit a solo Navi Mumbai financial advisor's actual client relationship? Findings are cited to `src/app/globals.css` / `src/components/*.tsx` line numbers, to `docs/brand-authenticity-audit/evidence/evidence-data.json`, and to screenshots in `docs/brand-authenticity-audit/evidence/screenshots/`. Severity key: **P0** structurally misleading or actively damaging · **P1** major legibility/trust problem · **P2** meaningful polish · **P3** minor/cleanup.

---

## Verdict

The site is not badly built — it is badly *cast*. Every homepage section is a real, working component with Ghanchi's real facts poured into it, and the type/color/motion system genuinely reads as a coherent brand. But the mold each section was poured into is still Kora's: a B2B growth-consultancy's proof architecture (before/after objection-handling, a numbered 4-phase delivery methodology, a leadership-bench team roster, a single flagship case study, a tiered-pricing panel's sibling components), built to persuade a company's CEO to sign an $8,500/mo retainer, now holding a solo insurance-and-investment advisor's much gentler, much more personal offer. The clearest single artifact of this is not a subjective vibe — it is literal: the shipped CSS still contains selectors named `.with-kora` and `.without-kora` (`src/app/globals.css:182-183`) driving the one chart on the homepage, and a JSX component still carries `className="with-kora"` (`src/components/home-sections.tsx:20`) six months and one full rebrand later. Below, each section is separated into what to keep (the Kora *system*) and what to reconsider (the Kora *decision*), with severities and an owner/code/content split. Nothing here recommends a redesign; most fixes are content and layout-weight decisions, not new components.

---

## 1. Hero

**Current state.** Full-bleed Kora stock tulip macro photo, H1 "Your trusted partner for financial planning and protection.", subheading, two CTAs, trust badge (initials, not photos), country-name marquee, and a bottom-right floating card. Screenshot: `evidence/screenshots/ghanchi/home-fold0.png` vs `kora/home-fold0.png`.

**Kora-system vs Kora-specific.** The layout grid, pill-nav chrome, button geometry, and hero-media parallax/blur motion (`src/components/home-hero.tsx:38-68`) are system — keep. The specific decision under question is the **background image choice and what fills the bottom-right proof slot** (see §2).

**Finish-Gate test.** Swap "Ghanchi Investments" for "Any Wealth Advisory Pvt Ltd" and change nothing else: the hero is unchanged, because an abstract, unexplained flower macro carries zero information about family financial planning, India, or Chandrakant Ghanchi. It is Kora's own unedited stock photo (already flagged as P1 in `docs/agency-audit/MEDIA_AUDIT.md`), so this is not new — but it is the single biggest reason people say "someone else's website." **Interchangeable pattern: an evocative, brand-neutral macro-photography hero used as an "elegant/premium" placeholder rather than a first-read object that signals the actual business.**

**Severity: P1.** **Fix type: content (asset), not code.** A photo of Chandrakant with a client, a family, or even Navi Mumbai/CBD Belapur signage would cost nothing structurally to swap in — `siteSettings.heroImage` is already a config-driven field (`home-hero.tsx:68`, `img src={siteSettings.heroImage}`). **OWNER VERIFICATION REQUIRED**: whether a real, consented photo (of Chandrakant, an office, or a client meeting) exists to use here; this audit does not fabricate one.

---

## 2. "Latest Newsletter" card (hero proof slot)

**Current state.** Bottom-right of the hero, Kora's exact "New Case Study" card shape is reused to promote a **November 2021** newsletter — five years stale on a site whose footer reads "© 2026." Screenshot: `ghanchi/home-fold0.png`; text: `evidence-data.json → ghanchi.bodyText` "Latest Newsletter … November 2021 Newsletter … 2021 … Read edition."

**Kora-system vs Kora-specific.** The card shell (`.hero-case`, `border-radius: 30px`, nested white panel) is system — keep. The *specific* Kora decision is what that slot is *for*: in Kora it holds the single biggest number on the page, `47%`, in a 30px/600-weight display slot (`.hero-case-stat strong { font-size: 30px; font-weight: 600; }`, `globals.css:151`) — a hard growth-proof metric, the whole reason the card exists. Ghanchi's version fills that exact same big-bold-number slot with **"2021"** (`home-hero.tsx:68`, `newsletter.issueMonth.slice(0,4)`) — a publication year, not a claim about anything.

**Finish-Gate test.** This is the textbook case the brief asked to name: **the "case study" card pattern reused for a newsletter teaser.** Swap logos: identical card, identical position, identical visual promise ("here's a big impressive number") — but the number means nothing here. A first-time visitor's eye lands on a stat-shaped box in the first three seconds on the page and gets a five-year-old newsletter issue number.

**Severity: P0** (highest-visual-weight secondary object on the page currently communicates staleness, not trust). **Fix type: content — most urgent single fix in this audit.** Either (a) replace with a real current proof point that fits the same slot shape (e.g., years in business, a recent award, a client-count milestone — several already exist elsewhere on the page: "15+ years," "1,200+ clients"), or (b) if the newsletter archive itself is the intended content, drop the big-number stat treatment and use a plainer "read our archive" card so the visual promise matches the payoff. **OWNER VERIFICATION REQUIRED**: is a more recent newsletter available, or is the archive genuinely capped at 2021 (per `EVIDENCE.md`'s "Original dates are retained" disclosure elsewhere on the site)?

---

## 3. Trust badge & country marquee

**Current state.** 5 mint-green initials avatars + "Trusted by 1,200+ clients / 5.0/5 · Google rating on existing site," then a looping "India • UAE • USA" marquee. Already covered for the avatar substitution in the prior fidelity audit (P3, content-truth-driven, correct as-is).

**New finding for this audit:** the marquee itself. Kora's ticker holds 5 *client company logos*, each with distinct typography for rhythm (venice., Lightspeed, Sitemark, Hamilton, theo — see `KORA_VS_GHANCHI_COMPARISON.md` row 18). Ghanchi's ticker holds **3 country names** in one flat style (`.client-location`, `home-hero.tsx:15`). A client-logo marquee is a B2B agency's specific proof device ("look who trusts us"); a country-name marquee answers a completely different question ("where do you operate"). It isn't false, but it's a geography footnote occupying a slot shaped and weighted like a trust signal — most visitors will read three looping words next to five colored circles as "more logos" and register it as decorative rather than informative.

**Finish-Gate test.** Any financial firm with clients in 3 countries could drop their initials in and get an identical result. **Interchangeable pattern: a proof-shaped marquee slot filled with geography instead of a verifiable claim.**

**Severity: P3.** **Fix type: content**, optional. Keep as-is (already flagged and approved in the prior audit) or fold "India · UAE · USA" into the trust badge's existing caption line instead of giving it its own full-width animated strip — a decision for the owner, not a defect requiring urgent action.

---

## 4. Sticky mid-scroll statement

**Current state.** "The strategies that built your company won't scale it." / "What changes when you work with us." → "Making goal-based financial advice accessible to all." / "What changes when you plan with us." Full-bleed, same tulip photo as the hero, word-by-word scroll-reveal (`home-hero.tsx:17-32`). Screenshots: `kora/home-fold1-2.png` vs `ghanchi/home-fold1-3.png`.

**Kora-system vs Kora-specific.** The scroll-linked word-blur reveal mechanic is system motion — keep, it is genuinely well executed and content-agnostic. The Kora-*specific* decision is the two-line, tension-then-resolution rhetorical structure itself ("the old way is broken → here's the new way with us") — a classic B2B repositioning pitch aimed at a skeptical buyer who already has an existing process they're being told to abandon. Ghanchi's rewritten version is declarative, not adversarial ("Making … accessible to all"), which is a genuine, correct adaptation of the words — but it still sits inside a section built for a two-beat "problem → reframe" pace, and it repeats the exact same unexplained flower photograph as the hero for a second full viewport, doubling down on the least brand-specific asset on the site rather than giving this second full-bleed moment its own reason to exist.

**Finish-Gate test.** Swap logos: unchanged. **Interchangeable pattern: full-bleed brand-neutral macro photography used twice in the first two scroll beats.**

**Severity: P2.** **Fix type: content (asset)** — same root cause as §1; a second hero-grade image (not necessarily different from §1, but ideally not the *same* frame) would remove the "double flower" repetition. No code change required — `siteSettings.heroImage` already backs both instances.

---

## 5. Comparison scene (Before/After)

**Current state.** Sticky pinned scroll: cream "Before" card (4 X-bulleted pain points) → mint "After" card (4 check-bulleted resolutions), the After card carrying a small white lockup with the **Ghanchi logo** in exactly the slot where Kora's own wordmark sits on its own After card. Screenshots: `kora/home-fold4-7.png` vs `ghanchi/home-fold4-6.png` — the `ghanchi/home-fold5.png` capture is the single most literal "logo pasted onto someone else's card" artifact gathered in this audit.

**Kora-system vs Kora-specific.** Card geometry (`border-radius: 40px`, nested shell, `globals.css:162-172`) and the pinned horizontal-slide scroll mechanic are system — keep, they work well and read as premium without being loud. The *specific* decision is the **rhetorical device itself**: an X-vs-check objection-handling scene is a sales tool for overcoming an skeptical buyer's status-quo bias ("you think you're fine, you're not, here's why we're different") — built for a CEO who has to be talked out of doing nothing. Ghanchi's rewritten before/after ("Financial decisions made in isolation" → "Every decision aligned with your goals") is honest, low-key, and well-adapted copy — but it's still doing the *job* of a competitive-differentiation pitch, when a financial advisor's actual first-time-visitor question is closer to "can I trust this person with my family's money" than "how are you different from doing nothing."

**Finish-Gate test.** Swap logos: the After card literally becomes generic the instant the badge changes — the card's entire distinctiveness *is* the badge, because the copy pattern (four short aligned-goal bullets) is content-neutral enough to belong to any advisory practice. **Interchangeable pattern: a before/after objection-handling scene whose only brand-specific element is a logo watermark.**

**Severity: P2.** **Fix type: content**, optionally structural. Keep the component (it is well-built and the copy is honest) but treat it as a **design decision the owner should confirm fits how Chandrakant actually opens a client conversation** — a personal advisory practice may prefer to lead with credibility/experience rather than a competitive-contrast frame. **OWNER / BUSINESS VERIFICATION REQUIRED**: does "before you were guessing, after you're not" match how prospective clients actually decide to work with Chandrakant, or would a credibility-first framing (years in practice, personal relationship, local presence) convert better for this audience?

---

## 6. Services — intro chart + 9 cards

### 6a. The "PlanningChart" (biggest single finding in this audit)

**Current state.** A horizontal two-bar chart with 8 gridlines and axis labels "Understand / Plan / Implement / Review," captioned "An illustration of the planning journey — not a return forecast or performance comparison." Screenshot: `ghanchi/home-fold7.png`; component: `src/components/home-sections.tsx:14-20` (function `PlanningChart`).

**Kora-system vs Kora-specific — this is a code-level, not just visual, finding.** Kora's original is a **bar chart measuring dollars**: "With Kora → $14.2M avg ARR" vs. "Without → $9.6M avg ARR," axis in `$0M–$14M`, i.e., a quantitative ROI-proof visualization (`kora/home-fold7-8.png`). Ghanchi's version reuses the identical component, but a bar chart cannot represent a *sequence of four process phases* — so the axis labels were swapped for phase names while the two bars keep arbitrary widths (one bar animates to 100%, the other to a **hardcoded 67.6%** — `home-sections.tsx:19`, `useTransform(scrollYProgress, [0, 1], ['0%', '67.6%'])`) that correspond to nothing. The CSS classes are more damning than the visual: `.chart-bar.with-kora { background: var(--accent); color: var(--white); }` and `.chart-bar.without-kora { background: #e6e6e6; }` (`globals.css:182-183`), and the JSX literally assigns `className="chart-bar with-kora"` / `className="chart-bar without-kora"` (`home-sections.tsx:20`) — **the word "kora" is still shipping in the live Ghanchi Investments codebase**, five commits after the rebrand, driving a graphic on the homepage. The caption disclaiming "not a return forecast or performance comparison" is itself evidence the mismatch was noticed at some point — a comparison-chart shape was kept and then defused with a disclaimer, rather than replaced with a shape suited to a 4-step sequence (e.g., a simple numbered/connected-step diagram).

**Finish-Gate test.** Swap logos: unchanged, because the chart displays no Ghanchi-specific quantity at all — it's decoration wearing chart clothing. **Interchangeable pattern: a growth-metric bar chart repurposed as a process diagram, defused with a disclaimer instead of replaced with a shape that actually represents a sequence.**

**Severity: P0** (both for user-facing legibility — a chart with an unexplained 67.6% and no y-axis units baffles rather than informs — and as a code-hygiene/brand-identity issue: literal "kora" strings in shipped class names). **Fix type: code.** Two independent, low-cost paths: (1) minimum fix — rename `with-kora`/`without-kora` to neutral names (e.g. `chart-bar-primary`/`chart-bar-secondary`) even if the chart shape is kept; (2) real fix — replace the bar-chart component with a 4-step connected-node/timeline diagram (a shape that actually depicts "Understand → Plan → Implement → Review" as a sequence, not a magnitude comparison). Either is a component-level change, not a rewrite of the section.

### 6b. Nine service cards, each with a self-quote and a "Get Started" button

**Current state.** 9 full-width cards (Financial Planning, Life Insurance, Health Insurance, Mutual Funds, Retirement Planning, Child Education Planning, Personal Accidental Policy, General Insurance, Employer-Employee Insurance), each ~680px tall, each ending in a floating glass-panel quote card and a full-width "Get Started" CTA. Screenshots: `ghanchi/home-fold8-11.png`.

**Kora-system vs Kora-specific.** Card shell, image treatment, and CTA geometry are system — keep, and the photography swap (real India-context family/advisor imagery replacing Kora's diverse-young-professionals stock) is a genuine, well-executed improvement already worth crediting (see "Keep" list, §16). The Kora-*specific* decision under question is **what the floating glass-panel quote card is for**. In Kora, every service card ends in a *named, titled, external client* quote ("James Martin, CEO, Hamilton") — a different real customer's proof, once per service. In Ghanchi's version, the quote card is filled with **Chandrakant quoting his own service description back at himself** (`home-sections.tsx:25`, `service.longDesc.split('.')[0]`, attributed via `<Person>` to the founder) — nine times, once per card. The visual format (small avatar, name, role, quote-mark glyphs) signals "third-party endorsement"; the content is first-party marketing copy restyled as an aphorism.

**Finish-Gate test.** A visitor skimming service cards will register nine pull-quotes as nine pieces of social proof; they are actually one person's product descriptions, repeated in a proof-shaped box. **Interchangeable pattern: a customer-testimonial slot filled with founder self-quotation** — this would look identical on any solo practitioner's site with the same component reused.

**Severity: P1.** **Fix type: content**, no code change needed (the `Person`/`service-quote` slot already accepts arbitrary name/role/quote — `home-sections.tsx:25`). Two honest options: replace the self-quote with a real, consented client testimonial specific to that service line (Ghanchi has 10 real named testimonials on file per `evidence-data.json → page_about-us_testimonials` — several are already insurance/mutual-fund specific and could be matched to the right card), or drop the floating-quote device for cards that don't have a matched real testimonial and let the founder's descriptive line live as normal body copy instead of a proof-card.

**Separate structural finding — 9 cards where the component was built for ~5:** Kora ships 5 service cards; the identical card pattern was mechanically repeated for Ghanchi's 9 services, each still full-height (~680px) with its own image, quote, and CTA. That roughly doubles the scroll length of this one section versus Kora's original design intent, and produces "Get Started" nine times in a row — a CTA cadence built for a small number of high-consideration B2B offers, not for a menu of 9 largely-free-consultation insurance categories. **Severity: P2. Fix type: design** — consider a denser secondary treatment (e.g., a compact grid or accordion) for services beyond the first 4-5, reserving the full illustrated-card treatment for the offers Chandrakant most wants to lead with. **OWNER / BUSINESS VERIFICATION REQUIRED**: which 3-4 services are actually the highest-intent entry points for new clients — that should drive which get the full card treatment.

---

## 7. Process / "How we work"

**Current state.** "Your goals come first. The plan follows." → a 4-panel accordion, **Phase 01 Understand / 02 Plan / 03 Implement / 04 Review** (`evidence-data.json → ghanchi.bodyText`), each phase numbered exactly like Kora's Diagnose/Design/Build/Transfer, plus a video-dialog "How we work" card with a play button over a backdrop image. Component: `home-sections.tsx:27-36` (`ProcessSection`, `.phase-card`, `.phase-trigger`, `globals.css:209-230`).

**Kora-system vs Kora-specific.** Accordion mechanics (spring-animated width, `layout` transitions), card radii, and the video-dialog modal are system — keep, well executed. The *specific* decision is the **framing itself**: Kora's "Diagnose → Design → Build → Transfer" is a consulting-engagement methodology, explicitly built to make a multi-person team's delivery process legible to a buyer signing a formal contract ("Most consultancies slow you down with process and overhead. We built our process to get to revenue impact in weeks, not quarters."). It exists to justify a $2,500-$8,500/mo engagement structurally. Ghanchi's "Understand → Plan → Implement → Review" is genuinely close to how financial planning actually works (fact-find → plan → execute → review is a standard, real advisory cycle) — so this is the *least* forced of the Kora-shaped structural devices in this audit. It is still, however, presented with the exact numbered-phase-card apparatus (large "Phase 01" numerals, an active/inactive accordion state, a 90-second explainer video) built for a company explaining its operating system to a skeptical enterprise buyer, not for a single advisor describing what a client meeting is like.

**Finish-Gate test.** Swap logos: mostly unchanged in visual language (numbered phase cards, accordion, video-dialog chrome), but the underlying four-step content genuinely maps to a real financial-planning process rather than being empty box-filling — this is a partial pass, not a full fail. **Interchangeable pattern: the numbered-phase-methodology apparatus (not the specific four words, which are plausible and real).**

**Severity: P3.** **Fix type: content confirmation, not code.** **OWNER / BUSINESS VERIFICATION REQUIRED**: does Chandrakant actually run a formal 4-phase client process worth branding this heavily (with its own explainer video), or is this closer to "we talk, we plan, we act, we check in annually" — in which case a lighter-weight presentation (no numbered "Phase" apparatus, no dedicated video) would be more honest to the actual one-person, relationship-based service model.

---

## 8. Team section + Recognition/Awards panel (the clearest "reused pattern" example)

**Current state.** "Meet your advisor. A personal partnership." — a single team row (Chandrakant B. Ghanchi, "01"), opening a modal on click. Directly below it, in the same section, a wide two-column panel: photo + "Recognition. Built on service. / Explore our awards and certificates archive…" + a "View Awards" button. Component: `home-sections.tsx:37-40` (`TeamSection`), CSS: `.hiring-card` (`globals.css:278-282`).

**Kora-system vs Kora-specific.** Card/modal geometry is system — keep. The *specific* finding: **that second panel is, in the code, literally the same `hiring-card` component Kora uses for "Join us, we're hiring / Apply Now."** The class name (`hiring-card`), grid proportions (image + copy, `1.8fr 1fr`), and button slot are unchanged from a recruitment CTA; only the copy and destination link were swapped to point at an awards page. This is exactly the pattern named in the brief's own example ("the 'case study' card pattern reused for a newsletter teaser") — here it's the *hiring-CTA* pattern reused for an *awards-archive* teaser.

**Finish-Gate test.** The component's shape (large photo, short heading, one sentence, one button, positioned directly under the team roster) still visually reads as "join our team" to anyone who has seen the Kora template before, and to a first-time visitor it reads as an odd tonal shift — from "meet your one advisor" straight into a large recruitment-shaped panel that turns out to be about awards. **Interchangeable pattern: a recruitment-CTA card repurposed, unmarked, as an awards teaser — the DOM/CSS still calls it `hiring-card`.**

**Severity: P2** (visual/structural non-sequitur — a "we're hiring" shaped panel sitting directly beneath a solo-founder introduction reads oddly regardless of the copy inside it) **+ P3 code-hygiene** (class name mismatch with actual content, same category of issue as `with-kora`/`without-kora`). **Fix type: design + code.** Rename the component/class to something content-neutral (`recognition-card` or similar) and — more importantly — reconsider whether an awards teaser belongs in this exact slot (directly under the one-person team intro) or would sit more naturally near the About page's existing Awards/Certificates/Our-Clients/Testimonials 4-card grid (`evidence/screenshots/ghanchi/inner_about-us.png` already has this, and it's a clean, appropriately-scaled version of the same idea).

**Separate note — team roster shape built for six, used for one.** Kora's team section lists 6 named specialists with distinct titles (a leadership bench); the same numbered-list-with-dialog-modal pattern now lists exactly one row. This is not wrong — Ghanchi is a solo practice and should say so plainly — but a component built to make a roster feel populated (numbered rows "01" implying "02, 03…" follow) applied to a single entry can read as a placeholder that never got filled in, rather than a deliberate "it's just me, and that's the point" statement. **Severity: P3. Fix type: design.** Consider whether a single advisor is better served by a format that doesn't visually imply a roster (e.g., drop the "01" numbering, or reframe as a straightforward founder profile block) versus the current shape's ambiguity between "solo by design" and "roster not filled in yet."

---

## 9. Testimonials (feature card + review-score + list + stats + founder callout)

**Current state.** Full-bleed "Testimonials" heading + one featured quote (Neeta Agrawal) in a glass-panel card, a large review-score readout (`0.0/5` per `evidence-data.json → ghanchi.bodyText`, "Google rating reported on our existing website"), three more expandable testimonials, a 4-up stats grid (years/clients/awards/rating — all showing **`0+`/`0.0/5`** in the captured evidence, i.e., counters that hadn't animated in at capture time — `evidence-data.json → ghanchi.bodyText`), and a founder-callout CTA. Component: `home-sections.tsx:50-56`.

**Kora-system vs Kora-specific.** Card geometry, the counter-animation mechanic, and the accordion testimonial list are system — keep. Two content-shaped findings:

1. **Review-score component.** Kora's version reads "4.9 /5, Based on 300 verified reviews" — a specific, checkable claim. Ghanchi's occupies the identical 120px-numeral slot (`globals.css:290`) with a rating explicitly caveated as "Google rating on existing site" / "not a live Google feed" (`evidence-data.json`) — an honest disclosure, correctly not fabricating a live integration. But the visual weight (a 120px numeral is the single largest piece of text in this section, larger than any heading) is calibrated for a bold, current, verifiable claim, not a caveated historical figure. **Severity: P2. Fix type: design.** Either shrink the numeral's visual weight to match its actual certainty, or invest in the real live-Google-rating integration the visual weight already implies exists.
2. **Founder-callout voice mismatch** (adjacent, already flagged content-side in `EVIDENCE.md` item 3 but worth naming here as a hierarchy issue too): Kora's equivalent slot is first-person ("I've personally led 40+ growth engagements. Let me show you what's possible for yours.") — a deliberate choice to make the *founder*, not the company, the trust object, which is exactly right for a single-operator growth consultancy. Ghanchi's callout ("Your goals are personal. Your plan should be too. Let's start with a conversation.") stays in company/third-person voice throughout, in a slot whose whole design premise (a large personal photo + name + role, positioned as the site's emotional close) is built for a first-person founder statement. For a **solo, personally-branded advisory practice**, this is a case where Kora's specific device (founder speaks in first person) may actually be the more appropriate choice to adopt more fully, not less — the opposite of most findings in this audit.

**Finish-Gate test (founder-callout).** Swap logos: the slot's visual design (photo + name badge, large heading, single CTA) is built to make one named person the reason to act; the current company-voice copy makes it swappable with any advisory firm's generic closing CTA. **Interchangeable pattern: a personal-trust closing slot filled with brand copy instead of a person's own words.**

**Severity: P2. Fix type: content.** **OWNER / BUSINESS VERIFICATION REQUIRED**: whether Chandrakant is comfortable with first-person copy here ("I've helped families…", "Let me show you…") — this is a voice/tone decision only the business owner can make, not a code or design change.

---

## 10. Featured Case / "Client community" panel

**Current state.** "Serving clients since 2009 / A personal approach, for clients in India and abroad," a definition-list (Our focus / Our clients / Review), two big stats (15+ years, 1,200+ clients), a services cross-link list, a small testimonial quote, and a "Meet Our Clients" CTA — all inside Kora's single-flagship-case-study component (`home-sections.tsx:58-62`, `.featured-case-grid`, `globals.css:318-333`).

**Kora-system vs Kora-specific.** Card shell/grid is system — keep. The *specific* decision: Kora's version of this component exists to tell **one company's story** (Sitemark: $18M→$26.5M ARR, named metrics, a named VP quote) — a case-study format whose entire premise is *specificity about a single client*. Ghanchi's content is the opposite: general facts about the *practice as a whole* ("clients in India and abroad," "Individuals & families," "Annually"). The component's DNA (single protagonist, dated narrative, "the challenge / the approach / the results" implied structure) is being used to hold what is actually an About-page-style summary paragraph. It isn't wrong, but the specific-case-study shape overpromises a story this content doesn't deliver.

**Finish-Gate test.** Swap logos: entirely unchanged, since none of the content here (years in business, client geography, review cadence) is genuinely a case study — every financial advisory could drop equivalent placeholder facts into this exact grid. **Interchangeable pattern: a single-client case-study module used to hold general "about the firm" facts.**

**Severity: P2. Fix type: design or content.** Either (a) find and feature one real, consented, specific client story that actually fits a case-study shape (if that exists and is usable), or (b) swap this component for a plainer "about the practice" summary block that doesn't borrow the visual grammar (dl-style stat rows, "the results" framing) of a single-story case study. **OWNER / BUSINESS VERIFICATION REQUIRED**: is there a real, nameable, consented client story available, or should this section's shape change to match what the content actually is (a firm summary, not a case)?

---

## 11. FAQ

**Current state.** "What does Ghanchi Investments do? / Who do you work with? / Where are you based? / More questions? Reach out anytime → Let's talk" — same accordion shape and "More questions? Reach out" closing pattern as Kora's FAQ (`evidence-data.json`, `ghanchi/crops/ghanchi-c11.png`). This is a close structural match but the content itself (what/who/where) is genuinely the right set of first-time-visitor questions for a local advisory practice, not forced B2B content (Kora's FAQ covers "How is Kora different from a marketing agency?" — a category-differentiation question Ghanchi doesn't need and correctly doesn't have).

**Finish-Gate test.** Passes — the accordion shape is a near-universal pattern (not distinctively Kora's), and the question set is content-appropriate.

**Severity: —** No finding. Keep as-is.

---

## 12. Insights

**Current state.** "Knowledge for your next chapter" + 2 archived blog posts, same `image-hover` card treatment as Kora's Insights teaser. Reasonable, low-risk adaptation — a blog/insights section is a generic-enough pattern that it doesn't read as distinctively Kora's.

**Severity: —** No finding.

---

## 13. Footer

Already covered in the prior fidelity audit (vertical-rhythm compression P2, hover micro-interactions confirmed unchanged/kept). One visual-identity note for this audit: the giant lowercase wordmark treatment at the footer's base ("ghanchi", `crops/ghanchi-c11.png`) is Kora's system device (a huge outline wordmark as a footer signature) and reads well here — genuinely one of the better system-carryovers, worth keeping. No new finding beyond the prior audit's P2.

---

## Inner pages

### About-us
Reasonably well-adapted: hero uses the same tulip image (see §1/§4 finding — same root cause, not a separate issue), but the body structure (What we value → Our Vision quote → a clean 4-card Awards/Certificates/Our-Clients/Testimonials grid → Insights teaser → contact CTA) does **not** reuse the hiring-card or single-case-study devices from the homepage, and is a good example of Kora's *system* (card grid, quote treatment) serving genuinely Ghanchi-shaped content. Screenshot: `evidence/screenshots/ghanchi/inner_about-us.png` vs `kora/inner_about.png` — note Kora's About hero uses a 3-person "leadership team" power-pose photo (agency-specific device); Ghanchi's correctly does not attempt an equivalent, since there is no team to photograph. **No new severity beyond §1's hero-image finding.**

### Service detail (e.g., Life Insurance)
The strongest inner page in this audit. Kora's case-study-style service/case page (industry/company-size/timeline stat block, hard metrics) was **not** mechanically reused here — instead it's a simple, appropriately-scaled "what we discuss" checklist + real contextual photography (father and daughter, screenshot `evidence/screenshots/ghanchi/inner_services_life-insurance.png`) + a 3-card cross-sell ("Connected expertise"). This is a case of the team correctly recognizing a Kora-specific device (metrics-dashboard case study) didn't fit and not forcing it. **Explicitly worth crediting — see Keep list.**

### Awards / Our Clients / Testimonials (inner)
Text-only text-and-photo-archive pages with honest framing ("Photographs from the Ghanchi Investments awards archive," "Employer names describe individuals' affiliations, not corporate endorsements" — `evidence-data.json → page_about-us_awards`, `page_about-us_our-clients`). These pages don't borrow a distinctive Kora composition at all — they're closer to plain content archives, which is appropriate. **No finding.**

### Contact-us
Standard contact form + FAQ + stats strip; matches Kora's own contact-page shape (form + trust stats + FAQ), which is a near-universal pattern for this kind of page, not a distinctively Kora one. **No finding.**

---

## Summary table

| # | Section | Kora-system (keep) | Kora-specific decision in question | Finish-Gate verdict | Severity | Fix type |
|---|---|---|---|---|---|---|
| 1 | Hero | Layout grid, nav pill, parallax motion | Brand-neutral stock flower as first-read image | Interchangeable — no brand info in first-read object | P1 | Content (asset); OWNER input needed |
| 2 | Newsletter/proof card | Card shell geometry | Growth-metric stat slot filled with a stale year | Interchangeable + actively stale | **P0** | Content |
| 3 | Trust marquee | Ticker mechanic | Client-logo slot filled with country names | Mildly interchangeable | P3 | Content, optional |
| 4 | Sticky statement | Word-reveal scroll motion | Reused hero image a second time | Interchangeable (image only) | P2 | Content (asset) |
| 5 | Comparison scene | Card geometry, pinned-scroll motion | Objection-handling before/after rhetoric | Distinctive only via logo watermark | P2 | Content; OWNER input needed |
| 6a | Planning chart | — | ARR bar-chart repurposed as process diagram; literal `with-kora`/`without-kora` in code | Fails — measures nothing, ships "kora" in class names | **P0** | Code |
| 6b | Service cards | Card/image/CTA geometry, real photography | Client-testimonial slot filled with founder self-quote; 9x CTA repetition | Self-quote reads as proof but isn't | P1 (quotes) / P2 (repetition) | Content / Design |
| 7 | Process phases | Accordion/video mechanics | Numbered-methodology apparatus for a real but lightweight 4-step process | Partial pass — content is real, apparatus is heavy | P3 | OWNER confirmation |
| 8 | Team + Recognition panel | Card/modal geometry | `hiring-card` component (literal class name) reused for an awards teaser | Fails — code and placement both signal "we're hiring" | P2 (+P3 code) | Design + Code |
| 9 | Testimonials/stats/callout | Counter, accordion, glass-panel | 120px numeral slot on a caveated rating; company-voice copy in a first-person-shaped slot | Partial — voice mismatch | P2 | Content; OWNER input needed |
| 10 | Featured case | Grid/card geometry | Single-client case-study shape holding firm-wide summary facts | Fails — no actual case being told | P2 | Design or content; OWNER input |
| 11 | FAQ | Accordion | Content-appropriate, not Kora-specific | Passes | — | — |
| 12 | Insights | Card hover | Generic pattern | Passes | — | — |
| 13 | Footer | Wordmark, hover interactions | (Prior audit's P2 spacing finding only) | Passes | — | — |
| — | About-us | Card grid, quote treatment | Correctly does not reuse hiring/case devices | Passes | — | — |
| — | Service detail | Checklist + photography | Correctly avoids Kora's metrics-dashboard case format | Passes — best inner page | — | — |
| — | Awards/Clients/Testimonials/Contact (inner) | Standard archive/form patterns | Not distinctively Kora | Passes | — | — |

---

## Kora design-system elements confirmed correctly kept — do not touch

These are working, load-bearing, and should not be changed as part of any fix from this audit:

- **Typography scale and weights** — the 80px/400-weight hero heading and consistent type ramp (already verified byte-identical in the prior fidelity audit).
- **Color tokens** (`--accent`, `--ink`, `--cream`, `--white`) — exact match to Kora's rendered values; the palette itself is not the problem this audit found.
- **Button geometry and interaction** (`.button`, pill shape, `border-radius: 40px`, hover/tap scale, dot-reveal arrow) — unchanged and correct.
- **Card nesting pattern** (outer cream shell / inner white panel / 10px gutter, `border-radius: 40px`/`30px`) — the structural card language used across services, comparison, team-dialog, and featured-case. This is genuinely good, reusable design-system grammar; the findings above are about *what content fills specific cards*, never about the card shape itself.
- **`.glass-panel` frosted-card treatment** (`globals.css:62`) — used correctly for floating proof cards; keep.
- **Spring/scroll motion system** — pinned-scroll comparison scene, word-blur statement reveal, accordion `layout` transitions, hero parallax/zoom. All confirmed working and content-agnostic; none of this needs to change.
- **Footer hover micro-interactions and giant-wordmark footer signature** — confirmed unchanged from Kora and reads well on Ghanchi.
- **Reduced-motion handling** — already confirmed as a genuine improvement over the Kora baseline in the prior audit.
- **Real, India-context photography substitutions already made** on service cards (family/advisor imagery replacing Kora's generic stock) and the correct, deliberate *omission* of Kora's tiered-pricing section — both are evidence the team already knows how to diverge from Kora where it matters; the findings in this document are about the remaining places that same judgment hasn't yet been applied.

---

## Cross-cutting pattern, restated

Nearly every P0/P1/P2 finding above traces to one root cause, not eleven separate ones: **Kora's components were built to persuade a company buyer through a sales funnel (skepticism → differentiation → methodology → proof → close), and most of that funnel's specific *shapes* (comparison scene, phase methodology, single case study, growth-metric chart, hiring CTA, client-logo marquee) were kept even where the content poured into them is personal, honest, and un-funnel-shaped.** The fix is almost never "build something new" — every component already has the flexibility to hold different content (see how cleanly the service-detail page and About page already diverge). It is a matter of, section by section, asking the Finish-Gate question this audit ran throughout: *does this shape still earn its place once the logo is real, or is the logo the only thing making it feel specific to Ghanchi Investments?*
