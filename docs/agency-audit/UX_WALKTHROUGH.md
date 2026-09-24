# UX Persona Walkthrough — Ghanchi Investments

Method: `docs/agency-audit/roster/design-persona-walkthrough.md` (Persona Walkthrough Specialist — cognitive walkthrough, LIFT / Cialdini / Fogg frameworks). This is a **qualitative simulation, not statistical evidence** — findings are strong hypotheses to validate against real analytics/user testing, not proven facts.

**Method note:** Live site navigated with Playwright against `http://localhost:3100` (Strapi-backed content on port 1337) at 1440×1000 (desktop) and 390×844 (mobile). Screenshots and raw DOM extracts are saved under `docs/agency-audit/evidence/screenshots/ux-walkthrough/` and `docs/agency-audit/evidence/ux-walkthrough-data.json`; every claim below cites a specific route and file. The small circular "N" badge visible bottom-left in several screenshots is the Next.js dev-mode indicator — a local-dev-only artifact, not something a real visitor sees in production; ignore it.

---

## Persona 1 — First-time cold visitor (desktop, homepage)

**Profile:** Priya, 38, found the site via a friend's referral, knows nothing about the business, opens the homepage with no prior context. Avoidant-leaning: wants facts fast, will bounce on fluff.

**Relevance contract:** In 5 seconds she needs: what is this, is it for people like me, what do I do next.

### Five-Second Test — fold 0 (`p1-home-desktop-fold0.png`)
- **What is this?** Clear. H1 "Your trusted partner for financial planning and protection," subhead "Ghanchi Investments helps families plan, protect, and invest with confidence."
- **Is it for me?** Reasonably clear — family-oriented framing, plus immediate social proof: client-initial avatars (NA/SJ/RS/VS/MR), "Trusted by 1,200+ clients," "5.0/5 · Google rating on existing site" (honestly qualified as "existing site," not a live badge), and a India · UAE · USA client-geography marquee — all visible without scrolling.
- **What should I do?** Two CTAs visible immediately: "Our Services" (primary pill) and "Get in touch" (secondary, arrow icon). Both reachable with zero scroll.
- **Friction:** a circular avatar photo sits top-right next to "Get in touch," with `alt=""` and no `aria-label`/link semantics (verified in DOM). Priya's monologue: "Who's that? Is that a chat button?" — first-impression ambiguity with no cost to fix (it's the founder's photo, confirmed on `/about-us`).

**Analyst:** LIFT Clarity ↑ (headline), LIFT Relevance ↑ (family framing + geography), Cialdini Social Proof active from fold 0 — unusually strong for a small local advisory. Distraction: unlabeled avatar. Fogg: Motivation medium, Ability high (CTA visible), Prompt visible.

### Scroll journey — folds 1–6
- Folds 1–2 (`p1-home-desktop-fold1/2.png`, ~1800px of scroll ≈ 2 full screens) are a single pinned sentence, "Making goal-based financial advice accessible to all," released only at fold 3 (`fold3.png`, "What changes when you plan with us."). No new information appears for ~2 screens.
- Folds 4–6 (`fold4/5/6.png`) pin a "Before / After" comparison card for another ~2 screens before releasing into the services grid ("Services." heading, `fold7.png`).
- **Confusing element:** the "Before" (negative — "Financial decisions made in isolation") card and the "After" (positive) card both display the **same Ghanchi Investments logo** (`fold5.png`). Priya's monologue: "Wait, why is their own logo on the bad example? Did something break?" This is a Kora-template comparison scene repurposed without adapting which brand mark sits on which side.

**Analyst:** LIFT Distraction ↑ (two long pinned single-message scenes before the services grid), Fogg Motivation risk — an impatient/avoidant visitor is the type most likely to bounce during a low-information-density pinned scroll. Trust delta ↓ momentarily at fold 5 (logo-on-both-cards confusion), recovering once the grid appears.

### Verdict
- Confidence: 7/10. Clarity: 8/10. Relevance: 7/10.
- Would contact: Maybe — value prop and CTAs are clear early, but the mid-page pacing and logo mix-up cost some momentum before she'd reach the trust-heavy About Us content.
- Almost-left moment: fold 2, mid-pinned-sentence, no new content for the second consecutive screen.
- Most-engaged moment: fold 0, the immediate social-proof cluster (client count, rating, geography) landing alongside the headline.

---

## Persona 2 — Actively shopping for health insurance for aging parents (desktop)

**Profile:** Rohan, 42, searching specifically for health cover for his mother; urgency: weeks, not days; primary fear: policy exclusions/waiting periods not covering a parent's pre-existing conditions.

### Path: Home → Services → Health Insurance → Contact
- `/services` (`p2-services-desktop-fold0.png`): all 9 services in a clean icon + one-line-description + "Explore service" grid. Health Insurance is card 3 of 9, visible in the first screen at 1440×1000 — no scrolling needed to spot it.
- `/services/health-insurance` (`p2-health-insurance-desktop-fold0.png`): headline "Plan for healthcare, before you need it," and — genuinely well-matched — the hero photo shows an adult daughter, an elderly mother, and an advisor reviewing a policy together. Rohan's monologue: "OK, that's literally my situation." This is the single strongest relevance hit found in the whole walkthrough.
- CTA "Discuss your goals" → `/contact-us?service=health-insurance`. **Verified directly** (not just visually): landing on that URL pre-checks the "Health Insurance" checkbox on the contact form — his specific need carries through without re-entering it (Cialdini: Commitment/Consistency honored correctly).
- Mid-page disclaimer (`p2-health-insurance-desktop-fold2.png`): "Solutions depend on your circumstances and applicable product terms... The testimonial describes a general client experience, not a result for this specific service." Reduces over-promise anxiety — a real LIFT:Anxiety-reducing element, appropriate for an insurance-advisory business.

**Friction:**
- No age-band/pre-existing-condition specifics are surfaced on the service page itself — Rohan's actual anxiety trigger (will Mum's pre-existing conditions be covered?) isn't addressed until he contacts the advisor. Acceptable for a lead-gen model, but worth knowing it's not answered on-page.
- "Connected expertise" cross-sell on this page (`fold2.png`) surfaces Financial Planning / Life Insurance / Mutual Funds — generic, not tailored to an aging-parent-care context (Retirement Planning would be a more relevant pairing).

### Verdict
- Confidence: 8/10. Clarity: 8/10. Relevance: 9/10 (the hero photo specifically).
- Would contact: Yes — 2 clicks from home to the right page, 1 more to a pre-filled contact form is an efficient, low-friction path.
- Most-engaged moment: `/services/health-insurance` fold 0 — the hero image doing real relevance work.

---

## Persona 3 — Verifying credibility before trusting them with money (desktop)

**Profile:** Meera, 55, self-employed, cautious/avoidant, wants data not reassurance-fluff: founder identity, years in business, real award/certificate evidence, real (not corporate) testimonials.

### About Us → Awards → Certificates → Testimonials → Our Clients
- `/about-us` fold 0 (`p3-about-desktop-fold0.png`): "Personalized financial planning, protection and investment support **since 2009**" — years-in-business answered in the first screen, plus a "Meet your advisor" CTA.
- Founder section (`p3-about-desktop-fold1.png`): real name (Chandrakant B. Ghanchi), a real (non-generic-looking) photo, specific bio ("incorporated in 2009," "1,200+ clients," client types named), direct **Email** and **LinkedIn** links. Meera's monologue: "OK, this is an actual person, not a stock photo of a guy in a suit." Reads as a genuine small local advisor, not a fabricated corporate persona.
- Awards (`p3-awards-desktop-fold0.png`): real, legible photographs — an MDRT 2020 trophy engraved with "CHANDRAKANT GHANCHI," LIC recognition-ceremony photos. **Friction:** captions are generic placeholders ("Awards archive — photograph 1/2/3") rather than explaining what was won, from whom, or when — Meera has to zoom in and read the trophy engraving herself to get any value from the photo.
- Certificates (`p3-certificates-desktop-fold0.png`): explicit disclosure — "Historical certificates from our existing website. These archive images do not establish current licence validity." An unusually honest move for a financial advisory; **strengthens** rather than weakens credibility because it preempts the "are they overclaiming" skepticism. But the wall mixes genuine financial credentials (MDRT Qualifying Member, LIC "Zonal Manager's Club") with unrelated recognitions (a "Corona Warrior" COVID-era certificate, a National Human Rights Commission pledge) with no grouping — dilutes the specifically-financial authority signal Meera is scanning for.
- Testimonials (`p3-testimonials-desktop-fold0.png`): explicit disclosure — "Employer names describe individuals' affiliations, not corporate endorsements." Again, genuinely trust-building: it preempts the "are these fake client logos" doubt before Meera can even ask it. The sample quote (Neeta Agrawal, Syntel) reads as a real, specific, slightly-unpolished quote rather than marketing copy.
- **Our Clients** (`p3-clients-desktop-fold0.png`) is the weak link: all 9 client-type cards (HNIs, Business owners, NRIs, Entrepreneurs, Software engineers, Advocates, Doctors, Architects, CEOs & CFOs) carry the **identical** boilerplate sentence, verbatim: "Personalized planning in the context of your goals, risk appetite and cash flows." Meera's monologue: "Wait, this is the exact same sentence nine times. Did nobody actually write this page?" For a persona specifically doing a close, skeptical read, this is the single fastest credibility-killer found in the whole walkthrough — it reads as templated filler exactly where differentiated proof was needed.

### Verdict
- Confidence: 7/10 (founder + testimonials + certificate honesty pull it up; Our Clients pulls it down).
- Clarity: 8/10. Relevance: 8/10.
- Would contact: Yes, but with a footnote — "I'd trust the guy in the photo, less sure this site was built carefully."
- Almost-left moment: `/about-us/our-clients`, on noticing the repeated boilerplate.
- Most-engaged moment: the founder bio + Email/LinkedIn block on `/about-us`.

---

## Persona 4 — Needs the phone number / address right now (desktop + mobile)

**Profile:** Arjun, 61, existing informal referral, wants to call **today**, not fill a form. Urgent, low patience for scrolling.

Tested systematically: header contact-info presence and footer scroll-distance across `/`, `/services`, `/services/health-insurance`, `/blog`, `/about-us`, at both viewports (`ux-walkthrough-data.json`, `p4_desktop` / `p4_mobile` blocks).

- **Header has no phone number and no `tel:` link on any page, at either viewport** — confirmed by direct DOM query (`headerHasTelLink: false` on all 5 routes × 2 viewports, 10/10). The only always-available path to contact info is the sticky "Contact Us" nav link / "Get in touch" button (1 click, present in every fold screenshot captured across every persona).
- **Footer has full contact info** (`tel:` link + full address) on every page — but the distance to it varies enormously by page length:

| Route | Desktop screens to footer | Mobile screens to footer |
|---|---|---|
| `/` (homepage) | **~25** (pageHeight 24,869px / 1000) | **~31** (25,838px / 844) |
| `/services` | 4 | 7 |
| `/services/health-insurance` | 5 | 8 |
| `/blog` | 4 | 4 |
| `/about-us` | 6 | 9 |

  If Arjun lands on the homepage and scrolls (a very ordinary real behavior — he doesn't know "Contact Us" is in the nav, or the nav has scrolled off) rather than clicking the nav link, he must scroll roughly **25–31 full screens** before reaching the phone number in the footer. That is well beyond what a real, urgent visitor will tolerate; most would give up or search for the number elsewhere (e.g., Google Maps listing) instead.
- `/contact-us` itself (`p2-contact-desktop-fold0.png`) does this correctly: both phone numbers, both emails, and the full address appear in the very first fold, with the primary number as a real `tel:` link (178×30px, clickable). **Minor technical note:** the secondary phone number and secondary email render as 1×1px elements at this breakpoint — almost certainly a hidden responsive duplicate rather than a real bug, but worth confirming it isn't a zero-size focusable element for screen-reader/keyboard users.
- **Office Hours** on the contact page read only "Monday to Friday: 9:00 AM – 6:00 PM" — no Saturday/Sunday status is given, leaving a weekend visitor (a very plausible time to be researching insurance) unsure whether calling is worth trying.
- **Mobile is actually the strength here:** opening the hamburger menu (`mobile-nav-open.png`) surfaces the phone number and email directly under the nav links, with zero further scrolling — the fastest path to contact info found anywhere in this audit, 1 tap.

### Verdict
- Confidence in "I can reach them fast": high if he uses the nav (1 click/tap everywhere tested); low if he scrolls the homepage looking for it (~25-31 screens).
- The gap between best-case (1 click) and worst-case (25+ screens) is the single largest inconsistency found in this audit.

---

## Persona 5 — Mobile visitor repeating Persona 1/2's journey (390×844)

**Profile:** Same as Persona 2 (Rohan, health insurance for aging parent) but on a phone, approximating a real on-the-go lookup.

- **Hero and content reflow cleanly** — no horizontal overflow observed in any of the 18 mobile folds captured across home/services/health-insurance. `p5-home-mobile-fold0.png` and `p5-health-insurance-mobile-fold0.png` both render the same hero photography and messaging as desktop, single-column, fully legible.
- **Hamburger menu (`mobile-nav-closed.png` → `mobile-nav-open.png`):** toggle button is 36×36px — under the commonly-recommended 44×44px minimum touch target (iOS HIG / WCAG 2.5.5). Once opened, the drawer itself is well executed: full-width tap targets per nav item, phone number + email visible immediately with no further scroll, and a full-width "Get in touch" CTA at the bottom — one of the better-built pieces of the mobile experience.
- **Services listing on mobile** (`p5-services-mobile-fold0.png`) stacks each service into a nearly full-screen card (icon, heading, description, "Explore service" link, generous padding) — pageHeight 5,509px at 844px viewport vs. 3,392px at 1000px desktop. Reaching "Health Insurance" (3rd of 9) costs roughly 2–3 full screens of scrolling on mobile versus zero scrolling on desktop (all 6 top services visible in one screen there). Same underlying content, meaningfully more scroll effort on the smaller viewport.
- **Homepage is proportionally longer on mobile too:** 25,838px at 844px height (~31 screens) vs. 24,869px at 1000px (~25 screens) — the same pinned-statement and before/after scenes identified in Persona 1 cost more relative scroll on a phone.
- **Cosmetic:** the "India • UAE • USA" trust marquee is partially clipped at the mobile viewport's left edge mid-animation (`p5-home-mobile-fold0.png`, "ia" visible instead of "India") — a legibility nit during the scroll cycle, not a functional bug.
- **No persistent tap-to-call affordance** is visible on mobile until the menu is opened — a visitor expecting a sticky "Call now" bar (common on local-service mobile sites) has to find and tap the hamburger first, same underlying gap as Persona 4 but on the viewport where thumb-friendly urgency matters most.
- Network-speed approximation was not run (no throttling profile applied in this pass); flagged as a gap, not a finding — a follow-up with 3G/4G throttling would be needed to speak to real load-time friction.

### Verdict
- Mobile does not introduce new comprehension problems — the content and hierarchy Persona 1/2 relied on survive the reflow. The friction it *adds* is entirely about touch-target sizing and proportionally more scrolling for the same information, not about anything breaking or becoming unreadable.

---

## Prioritized Issue List (combined, all five personas)

**P0 — Fix first**
1. **No click-to-call phone number in the header/nav on any page or viewport; homepage footer (the only in-page contact block reachable by scrolling) sits ~25 screens down on desktop and ~31 on mobile.** (Persona 4, `p4_desktop`/`p4_mobile` data, all 5 routes tested) For a local advisory business where a phone call is the highest-intent, most urgent conversion path, this is the biggest gap found. *Fix:* add a persistent `tel:` link/button in the sticky header (desktop) and a sticky "Call" affordance on mobile, so the number is reachable in 0 scrolls from anywhere, not just via the nav.

**P1 — High impact, straightforward fix**
2. **`/about-us/our-clients` repeats the identical sentence verbatim across all 9 client-type cards** ("Personalized planning in the context of your goals, risk appetite and cash flows."). (Persona 3, `p3-clients-desktop-fold0.png`) Directly undermines the one page whose entire purpose is proving "they understand people like me." *Fix:* write distinct 1–2 sentence descriptions per client segment.
3. **Homepage spends ~2 of its first ~7 folds on a single pinned sentence, and another ~2 folds on a pinned before/after scene**, before reaching the services grid. (Persona 1, `p1-home-desktop-fold1/2.png`, `fold4/5/6.png`) Real pacing cost for impatient first-time visitors on the highest-traffic page.
4. **The before/after comparison scene shows the Ghanchi Investments logo on both the negative ("Before") and positive ("After") cards.** (Persona 1, `p1-home-desktop-fold5.png`) Reads as a branding error on first glance rather than intentional framing.

**P2 — Worth fixing, lower urgency**
5. Header avatar photo (founder's photo, top-right next to "Get in touch") has empty `alt` text, no label, and unclear link semantics — ambiguous on first impression. (Persona 1, `p1-home-desktop-fold0.png`)
6. Awards page photos use generic captions ("Awards archive — photograph 1/2/3") instead of explaining what was won/from whom/when. (Persona 3, `/about-us/awards`)
7. Certificates wall mixes genuine financial credentials (MDRT, LIC) with unrelated recognitions (COVID "Corona Warrior," Human Rights pledge) with no grouping, diluting the financial-authority signal. (Persona 3, `/about-us/certificates`)
8. Mobile hamburger toggle is 36×36px, under the commonly-recommended 44×44px minimum touch target. (Persona 5, `mobile-nav-closed.png`)
9. Mobile services listing requires ~2–3 screens of scrolling to reach the 3rd card, versus zero scrolling on desktop for the same content. (Persona 5, `p5-services-mobile-fold0.png`)

**P3 — Minor / polish**
10. Contact page Office Hours list only "Monday to Friday" with no weekend status. (Persona 4, `/contact-us`)
11. Secondary phone/email on the contact page render as 1×1px elements at desktop width — confirm this is an intentional hidden responsive duplicate, not a stray zero-size focusable link for assistive tech. (Persona 2/4, `/contact-us`)
12. "India • UAE • USA" trust marquee text is clipped at the mobile viewport edge mid-animation. (Persona 5, `p5-home-mobile-fold0.png`)
13. Health Insurance page's "Connected expertise" cross-sell (Financial Planning, Life Insurance, Mutual Funds) isn't tailored to the aging-parent-care context; Retirement Planning would be a more relevant pairing. (Persona 2, `/services/health-insurance`)

---

## Evidence index

- Raw DOM/link/heading extracts per fold: `docs/agency-audit/evidence/ux-walkthrough-data.json`
- Screenshots (desktop 1440×1000 and mobile 390×844, by persona/route/fold): `docs/agency-audit/evidence/screenshots/ux-walkthrough/`
- Mobile nav open/closed states: `mobile-nav-closed.png`, `mobile-nav-open.png`
