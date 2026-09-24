# Accessibility Audit Report

## Audit Overview
**Product/Feature**: Ghanchi Investments frontend (Next.js), all live-content routes
**Standard**: WCAG 2.2 Level AA
**Date**: 2026-09-25
**Auditor**: AccessibilityAuditor persona (this session)
**Tools used**: Playwright (scripted DOM/ARIA/computed-style inspection against the running dev server, Chromium), manual source review, WCAG relative-luminance contrast formula applied directly to `globals.css` tokens, manual dismissal of automated false positives.

## Scope note
Per the session brief, this audit **does not re-verify** what `docs/QA_REPORT.md` and the existing Playwright suite already cover and pass: single `<h1>` per page, `#main` skip-link target, keyboard operation of the desktop nav dropdown (Tab/Enter/Escape), mobile submenu keyboard Escape behavior, FAQ tab arrow-key navigation, dialog Escape/focus-return for the video and team-member dialogs, and the "no horizontal overflow" check at 1440/1200/810/390px. Those are real, passing, automated regression coverage — not re-litigated here except where a gap in that coverage was found.

## Summary
**Total issues found**: 8
- Critical: 1
- Serious: 2
- Moderate: 3
- Minor: 2

**WCAG conformance**: DOES NOT CONFORM (blocked primarily by the Critical contrast issue, which touches primary CTAs sitewide)
**Assistive technology compatibility**: PARTIAL — landmark structure, heading order, form labeling, and live-region error/success announcements are all genuinely good; the contrast and duplicate-announcement issues are real UX barriers for low-vision and screen-reader users respectively.

---

## Issues Found

### Issue 1: White text on `--accent` background fails contrast across multiple sitewide components
**WCAG Criterion**: 1.4.3 Contrast Minimum (Level AA)
**Severity**: Critical
**User Impact**: Low-vision users cannot read primary call-to-action button labels, the entire "Testimonials"/team-section heading and body copy, or the highlighted stat/keyword text. This is the site's primary brand accent color, used precisely where the highest-visibility content lives.
**Location**:
- `src/app/globals.css:32` — `.button-mint { background: var(--accent); color: var(--white); }` — used by every primary CTA (`Get Started`, `Subscribe to newsletter`, `Phase` accordion default state, hero primary button)
- `src/app/globals.css:261` — `.team-section { background: var(--accent); color: var(--white); }` — the "Testimonials" `<h2>`, team member names/roles, and the "Meet your advisor" callout
- `src/app/globals.css:269` — `.team-row small { color: #ffffffb0; }` (69% white) inside the accent-background team section
- `src/app/globals.css:280` — `.hiring-card p { color: #ffffffe0; }` (88% white) also on the accent background
- `src/app/globals.css:173` — `.services-intro > p > span { color: var(--accent); }` — accent-colored text directly on `--paper`/`--cream`
- `src/app/globals.css:326` — `.case-big-stats strong > span { color: var(--accent); }` — accent-colored highlight numbers on `--paper`

**Evidence** (computed via the WCAG relative-luminance formula against the exact hex values in `globals.css:4`):
| Pair | Contrast ratio | Requirement | Result |
|---|---|---|---|
| `#fffffa` on `#59c29f` (white text/icons on accent bg) | **2.17:1** | 4.5:1 normal / 3:1 large | FAIL (even at large-text threshold) |
| `#fffffa` on `#3da886` (accent-dark, button hover state) | **2.93:1** | 4.5:1 / 3:1 | FAIL |
| `#ffffffb0` (69% white) effective vs `#59c29f` | **1.72:1** | 4.5:1 | FAIL |
| `#ffffffe0` (88% white) effective vs `#59c29f` | **1.99:1** | 4.5:1 | FAIL |
| `#59c29f` (accent) as text on `#fcfcfa`/`#f5f5e9` | **2.12:1** | 4.5:1 | FAIL |

The button label text (15px/600 weight) does not meet the "large text" exemption (needs ≥18.66px bold or ≥24px regular); the `.section-title`/`.display-title` headings on the accent background are large enough to use the 3:1 large-text threshold, but 2.17:1 still fails that too.
**Current state**: `color: var(--white)` (or partially-transparent white) on `background: var(--accent)`.
**Recommended fix**: Either darken `--accent` for any surface carrying text/icon content directly on it, or switch text color on accent backgrounds to `--ink` (`ink` on `--accent` measures 7.13:1 — passes AA and AAA). For the `.button-mint` CTA specifically, switching label color to `--ink` is the lowest-risk fix since `--ink` already has enormous headroom against `--accent-dark` too (would need re-verification, but ink is dark enough to pass against both accent states).
**Testing verification**: Re-run the same relative-luminance check against the corrected token pairs before shipping; confirm ≥4.5:1 for all normal-weight text and ≥3:1 for large/bold text and non-text UI (icons, focus rings) per 1.4.11.

---

### Issue 2: Service-card images carry incorrect, non-descriptive alt text on 8 of 9 services
**WCAG Criterion**: 1.1.1 Non-text Content (Level A)
**Severity**: Serious
**User Impact**: Screen reader users browsing the homepage services list hear "Illustrative financial planning imagery" for the Life Insurance, Health Insurance, Mutual Funds, Retirement Planning, Child Education Planning, Personal Accidental Policy, General Insurance, and Employer Employee Insurance card images — every single card except the one it's actually accurate for.
**Location**: `src/components/home-sections.tsx:23` (`ServicesSection`)
```
<img src={service.image} alt="Illustrative financial planning imagery" loading="lazy" .../>
```
This string is hardcoded and does not reference `service.title`, unlike the correct, working pattern already used one file away on the service detail page (`src/app/services/[slug]/page.tsx:26`: `alt={`${service.title} collaboration`}`, confirmed live as `"Life Insurance collaboration"` via DOM inspection).
**Evidence**: Live DOM extraction from `/` confirmed identical alt text `"Illustrative financial planning imagery"` on the Life Insurance, Health Insurance, and other non-financial-planning service card images.
**Recommended fix**: `alt={`Illustrative ${service.title.toLowerCase()} imagery`}` (or empty `alt=""` if the image is purely decorative relative to the adjacent visible heading/link text, which is a defensible alternative given the card already has a text link with the service name).
**Testing verification**: `page.locator('.service-card img').evaluateAll(imgs => imgs.map(i => i.alt))` should return distinct, service-matching strings.

---

### Issue 3: Back-link and header "Get in touch" target sizes fall below the WCAG 24×24px minimum on mobile
**WCAG Criterion**: 2.5.8 Target Size Minimum (Level AA)
**Severity**: Serious
**User Impact**: Motor-impaired and touch-screen users on mobile (390px viewport, the site's own tested breakpoint) have a harder time accurately tapping these controls; below 24px in either dimension is a direct AA failure (not just a best-practice miss), and neither qualifies for the "inline text" exception since both are standalone block-level links, not text running within a sentence.
**Location**:
- `src/components/inner-pages.tsx:10` (`BackLink`, e.g. rendered as "All services" on service pages) — measured **95×19px** at 390px viewport
- `src/components/home-hero.tsx` header CTA rendered via `Header` in `src/components/site-shell.tsx:77` ("Get in touch") — measured **111×23px** at 390px viewport
**Evidence**: Playwright `getBoundingClientRect()` + `elementFromPoint()` hit-test (to exclude visually-clipped/collapsed elements) at `width: 390`, confirming both are genuinely visible, standalone, non-inline interactive elements under the 24px minimum in height.
**Recommended fix**: Increase vertical padding on `.inner-back` and the header-call link so rendered height reaches at least 24px (44px recommended per platform touch-target guidance, though 44px is an AAA-level target, not AA).
**Testing verification**: Re-measure bounding boxes at 390px; both should report height ≥24px (target: ≥44px).

---

### Issue 4: Automated heading-hierarchy scan flagged duplicate H2/H3s — verified as a false positive (closed `<dialog>` content)
**WCAG Criterion**: N/A — dismissed after manual verification
**Severity**: N/A (documented per the "honest assessment, verify automated findings" mandate)
**Finding**: A raw DOM heading scan on `/` initially flagged an apparent hierarchy break: `H2 "How we work"` and `H3` phase titles (Understand/Assess/Plan/Review) appear a second time in DOM order, seemingly duplicating the visible `ProcessSection` heading and the accordion's active-phase heading.
**Root cause, verified live**: This second set of headings lives inside the "Watch how we work" `<dialog>` fallback content (`src/components/home-sections.tsx:33`, the `!processVideo` branch). Playwright's `getComputedStyle()` on the actual `<dialog>` element confirmed `display: none` and `hasAttribute('open') === false` when closed — native HTML5 `dialog:not([open])` UA-stylesheet behavior. Content inside a `display: none` element is excluded from the accessibility tree entirely; it is not read by screen readers, not reachable by Tab, and not a real heading-order violation for any user. Also verified via `page.getByRole('banner'|'contentinfo'|'main')` (ARIA-aware query) that this project's landmark structure is correct — an earlier raw `querySelectorAll('[role=banner]')` CSS-attribute check incorrectly reported 0 banner/contentinfo landmarks because it doesn't credit the *implicit* landmark roles that bare `<header>`/`<footer>` elements receive; the ARIA-aware query returned exactly 1 of each, as expected.
**Note included per the auditor mandate to distinguish real issues from tooling artifacts** — no action needed.

---

### Issue 5: `Person` component duplicates visible names as image `alt` text, causing double announcement
**WCAG Criterion**: 1.1.1 Non-text Content (Level A) — technique-level nuance (redundant alt text)
**Severity**: Moderate
**User Impact**: Screen reader users hear every person's name twice in immediate succession — once from the `<img alt="{name}">`, once from the adjacent visible `<strong>{name}</strong>`. This is minor per-instance but occurs on every page that renders a team member, testimonial author, or the founder callout (confirmed live on `/`, `/about-us`, `/contact-us`, `/services/life-insurance`, and the blog article page via the `Person`-driven "From our financial education archive" byline).
**Location**: `src/components/ui.tsx:36`
```
<img src={image} alt={name} loading="lazy" .../> ... <strong>{name}</strong>
```
**Recommended fix**: Since the name is always rendered as adjacent visible text in this component, set `alt=""` on the photo (the photo is decorative relative to the text that already identifies the person) — matching the pattern already correctly used elsewhere on the same components for genuinely decorative images (e.g. `src/components/site-shell.tsx:77`'s header-call founder thumbnail already uses `alt=""`).
**Testing verification**: Confirm with a screen reader (NVDA/VoiceOver) that a team row or testimonial card announces the name once, not twice.

---

### Issue 6: FAQ tablist allows all four arrow keys regardless of declared orientation
**WCAG Criterion**: 4.1.2 Name, Role, Value (Level A) — WAI-ARIA Authoring Practices deviation, not a hard SC failure
**Severity**: Moderate
**User Impact**: On the homepage FAQ (`aria-orientation="vertical"`), the component still responds to ArrowLeft/ArrowRight identically to ArrowUp/ArrowDown. Per the APG Tabs pattern, a vertical tablist should only respond to Up/Down (Left/Right are reserved for other purposes, e.g. potentially expanding tab content). This won't break anything for most screen reader/keyboard users, but it doesn't match the orientation it declares, which can be surprising to users of assistive tech that key off `aria-orientation` to set expectations.
**Location**: `src/components/faq.tsx:21`
```
role="tablist" aria-orientation={contact ? 'horizontal' : 'vertical'}
onKeyDown={... ['ArrowDown','ArrowUp','ArrowLeft','ArrowRight','Home','End'] ...}
```
**Recommended fix**: Branch the accepted keys on the `contact` flag: horizontal variant handles Left/Right, vertical variant handles Up/Down only (both keep Home/End).
**Testing verification**: On `/` (vertical), ArrowLeft/ArrowRight should no longer move tab focus; on `/contact-us` (horizontal), they should continue to work as already tested.

---

### Issue 7: No native `width`/`height` (or equivalent) attributes on any `<img>` — CLS risk is CSS-mitigated but not guaranteed
**WCAG/Web Vitals**: Not a WCAG SC directly (relates to 2.2's motion/stability concerns only indirectly); flagged for cross-reference with the Performance audit's CLS section.
**Severity**: Minor (accessibility angle only — layout jumps are disorienting for low-vision/cognitive users, magnification, and screen-magnifier users specifically)
**Evidence**: Every image sampled across all 13 routes (See `PERFORMANCE_AUDIT.md`) returned `width: null, height: null` from `getAttribute`. Most containers are pre-sized via CSS (`aspect-ratio`, `position: absolute; inset: 0` inside a sized parent), which mitigates layout shift in the common case, but there is no guarantee for every future content image added through Strapi with a different natural aspect ratio (e.g. `person-image > img` relies on `object-fit: cover` inside a fixed 48×48/80×80 box — safe; but ad hoc content images like `RichText` blog body images, if ever added, would not be protected).
**Recommended fix**: Add explicit `width`/`height` (matching the Strapi media's known dimensions, already available on `StrapiMedia`) or `aspect-ratio` inline styles wherever a new image type is introduced.
**Testing verification**: Lighthouse/CrUX CLS score, or Playwright layout-shift observation.

---

### Issue 8: `prefers-reduced-motion` is correctly implemented — confirmed working, flagged here only to document the verification (no fix needed)
**Severity**: N/A — positive finding
**Evidence**: `src/components/ui.tsx:8-16` implements `useReducedMotion()` via `useSyncExternalStore` on `matchMedia('(prefers-reduced-motion: reduce)')`, consumed consistently across `home-hero.tsx`, `home-sections.tsx`, `contact.tsx`, and `site-shell.tsx` to gate every `motion/react` animation (scale, opacity, blur, sticky-scroll transforms) with a `reduced ? {} : {...}` pattern. `globals.css:763` additionally provides a CSS-level fallback (`@media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: .01ms !important; ... } }`) as defense-in-depth for any animation not gated in JS. This was also confirmed passing live by the existing `tests/home-motion.spec.ts` reduced-motion test (sticky positioning removed, ticker animation disabled, footer transform reset to `none`). This is correctly implemented — not "assumed," genuinely checked and gated at both the JS and CSS layers.

---

## What's Working Well
- Landmark structure is correct: exactly one `role=banner`, one `role=main`, one `role=contentinfo` per page, verified via ARIA-aware Playwright queries (not just tag-name counting).
- Heading hierarchy has no skipped levels (no H1→H3 jumps) on any of the 13 routes audited; nesting is logical throughout.
- Form error/success states use proper live regions: `role="alert"` for errors, `role="status"` for success/copy-confirmation — confirmed both in source (`src/components/contact.tsx`) and in the passing `tests/forms.spec.ts` assertions.
- `prefers-reduced-motion` is genuinely respected at both the JS (per-animation gating) and CSS (global fallback) layers — see Issue 8.
- Decorative background/overlay images (hero background, testimonial background, insight-card cover images used as link backgrounds with adjacent visible headings) correctly use `alt=""` — this is the right call, not an oversight, since the adjacent text already conveys the same information.
- FAQ, desktop nav dropdown, team/video dialogs, and mobile nav submenu all have real, working keyboard support (Escape, focus return, arrow-key tab navigation) — already covered by the existing Playwright suite and independently spot-checked here.
- Skip link (`.skip-link` → `#main`) is present and correctly targets the `<main id="main">` landmark on every route.

## Remediation Priority
### Immediate (Critical/Serious)
1. Fix white-on-accent contrast (Issue 1) — touches every primary CTA button and the entire Testimonials/team section; highest user-facing impact.
2. Fix service-card alt text (Issue 2) — one-line code fix, currently misinforms screen reader users about page content.
3. Increase back-link/header-CTA touch target height (Issue 3) — straightforward padding fix.

### Short-term (Moderate)
1. De-duplicate `Person` alt text (Issue 5).
2. Scope FAQ tablist arrow keys to declared orientation (Issue 6).

### Ongoing (Minor)
1. Add explicit image dimensions as new content image types are introduced (Issue 7).

## Recommended Next Steps
- Re-run this audit's contrast check against any new color token before it ships, using the same relative-luminance formula against actual paired backgrounds (not assumed pass/fail).
- Add an automated axe-core pass to CI as a baseline net (it would have caught Issue 1 immediately); this audit's manual pass caught what axe-core alone would miss or over-report (Issues 2, 3, 5, 6, and the Issue 4 false-positive dismissal).
