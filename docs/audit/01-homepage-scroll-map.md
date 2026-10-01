# Homepage Scroll Map — Ghanchi Investments

Audit date: 30 September 2026. **Inventory and observations first; recommendations are in 03 and 04.** Baseline is the current uncommitted worktree, not the older Kora replica or earlier audit. No website changes authorized.

## Evidence and measurement method

Live local Next frontend `http://localhost:3100`, existing Strapi 5 CMS `http://localhost:1337`. Strapi was started with owner authorization. A frontend process-only `STRAPI_URL=http://localhost:1337` override resolved stale LAN media addresses; no environment files/content changed. Early incomplete captures were superseded. Final homepage capture reports zero failed images at all four widths.

Chromium via installed Playwright; fonts/hydration settled, ordinary motion enabled, viewport scrolled in 80%-height steps before captures. `evidence/capture.mjs` reproduces collection. Raw DOM geometry, text, links, media and route evidence: `evidence/measurements.json`; compact derived geometry: `evidence/home-brief.json`; source content: `evidence/public-content.json`; fresh screenshots: `evidence/screenshots/`. Full-page images can misrepresent sticky scenes; checkpoint screenshots are authoritative for those scenes.

Measurements rounded to pixels; small layout rounding differences are expected. Heights include padding but not fixed-header overlap. **Viewport equivalents = section height / viewport height; they are not time-to-read or scroll counts.** The visible part of a section can enter a viewport before its top reaches the top of the screen. Detail coordinates captured before reveal may include a 40px reveal translation. Counts in pre-scroll DOM can show zero because counters have not entered view; actual CMS values are 15+, 1,200+, 12+, 5.0/5. Do not mistake those zeros for company statistics or a hydration failure.

| Viewport | Page height | Maximum scroll offset | Page-height equivalents | Horizontal overflow |
|---|---:|---:|---:|---|
| 1440 × 900 desktop | 22,541px | 21,641px | 25.05 | None observed |
| 1200 × 900 laptop | 22,332px | 21,432px | 24.81 | None observed |
| 810 × 1080 tablet | 21,409px | 20,329px | 19.82 | None observed |
| 390 × 844 mobile | 24,272px | 23,428px | 28.76 | None observed |

## Exact homepage section inventory — first deliverable

Names below use actual rendered headings; Header/Hero/Footer are functional labels where no section heading exists. The statement's spacer is a timeline utility, not an invented content section. Nested elements remain attached to their owning section.

| # | Section Name | Component / source file | Approx. Scroll Height desktop / mobile | Purpose | Primary Audience Value |
|---|---|---|---|---|---|
| 01 | Header | `Header`, `src/components/site-shell.tsx` | 60 / 68px, fixed overlay; adds no page height | Navigation, direct call, contact | All visitors; existing-client shortcut |
| 02 | Hero — “A personal financial advisor for Navi Mumbai families, trusted since 2009.” | `Hero`, `src/components/home-hero.tsx` | 900 / 1,055px | Identity, promise, services/contact, trust badge, geography, newsletter | First-time/referral orientation |
| 03 | “Making goal-based financial advice accessible to all.” | `Hero` statement + `.hero-scroll-space`, same file | 1,800 / 230px including spacer | Company mission in scroll scene | Broad reassurance |
| 04 | “From scattered decisions to one coordinated plan.” | `Comparison`, `home-hero.tsx` | 3,258 / 1,387px | Before/after explanation | Family planner with fragmented decisions |
| 05 | “Services.” | `ServicesSection` + `PlanningChart`, `src/components/home-sections.tsx` | 6,406 / 9,696px | Nine services with full explanations | Find relevant help |
| 06 | “Your goals come first. The plan follows.” | `ProcessSection`, `home-sections.tsx` | 2,107 / 1,778px | Phases, how-we-work media, ongoing support | What working together involves |
| 07 | “Meet your advisor. A personal partnership.” | `TeamSection`, `home-sections.tsx` | 942 / 710px | Named founder; recognition archive link | Referral/first-time confidence |
| 08 | “Testimonials” | `TestimonialsSection`, `home-sections.tsx` | 2,152 / 2,651px | Client voices, rating, four stats, founder CTA | Social proof |
| 09 | “A personal approach, for clients in India and abroad.” | `FeaturedCase`, `home-sections.tsx` | 843 / 1,215px | Company/client overview, repeated stats/services/quote | Audience fit; NOT a case study |
| 10 | “FAQ” | `FAQ`, `src/components/faq.tsx` | 888 / 789px | Categorized objections and practical answers | Reduce uncertainty |
| 11 | “Knowledge for your next chapter.” | `InsightsSection`, `home-sections.tsx` | 729 / 1,288px | Two education archive articles | Interested researcher |
| 12 | “Let’s plan your next chapter.” | `ContactSection`, `src/components/contact.tsx` | 1,216 / 1,880px | Enquiry form, benefits, testimonial, two stats | Ready-to-contact visitor |
| 13 | Footer — “Subscribe to our newsletter.” | `Footer`, `site-shell.tsx` | 1,299 / 1,593px | Office/contact, newsletter, links, disclosure, wordmark | Contact verification; returning visitor |

Composition: `src/app/page.tsx:17`, global shell `src/app/layout.tsx`, stylesheet `src/app/globals.css`, contact layout `src/app/contact.css`. There is **no standalone homepage About section, awards gallery, pricing section or real client case study**. Awards are a nested recognition panel plus an awards statistic; the full archives have their own routes.

## 01 — Header
- **What the user sees:** fixed cream rounded nav with small real logo; Home, About Us, Services, Online Services, Blog, Contact Us on desktop; telephone icon. Separate founder-photo “Get in touch” control at top right. Mobile replaces nav labels with hamburger while retaining logo and phone icon.
- **Communicates / intended understanding:** recognizable business and shortcuts; contact does not require scrolling to the form.
- **Scroll cost:** 60px / 6.7% desktop; 68px / 8.1% mobile, overlaid rather than additive. Dropdown/menu expansion has a temporary visual cost.
- **Interaction:** hover pill/backdrop, desktop dropdowns, keyboard toggles, mobile submenus/Escape, tel link, skip link. Separate desktop contact control fades with homepage scroll; main nav remains.
- **Client value HIGH · Trust MEDIUM · Conversion HIGH · Cognitive load MEDIUM.**

## 02 — Hero — “A personal financial advisor for Navi Mumbai families, trusted since 2009.”
- **What the user sees:** large white heading over flower photograph, short subheading, “Our Services” primary button and “Get in touch” secondary link. Lower-left five initials, “Trusted by 1,200+ clients”, qualified 5.0/5 historical rating; India/UAE/USA ticker. Cream newsletter card reads “Latest in archive”, November 2021.
- **Communicates:** local personal service, family focus, plan/protect/invest, longevity and reported client scale; archive education.
- **Expected understanding:** who the company serves, what broad help it offers and two next actions. Insurance and mutual funds are not named explicitly in the main subheading.
- **Scroll cost:** desktop y0–900, 100%; mobile y0–1,055, 125%. Mobile archive card alone 400px / 47% versus 215px / 24% desktop; this is not an extra section to double-count.
- **Interaction:** load scale/blur/text reveal, sticky zoom/blur and upward text motion, reversible scroll behavior, ticker, hover image, services anchor, contact route, newsletter archive link. Header phone is immediately available.
- **Client value HIGH · Trust HIGH potential (claims need qualification) · Conversion HIGH · Cognitive load MEDIUM.** Evidence `home-1440-00.png`, `home-390-00.png`.

## 03 — “Making goal-based financial advice accessible to all.”
- **What the user sees:** centered large mission sentence, words revealed on the retained hero background; mobile uses a short dark-blue block.
- **Communicates / expected understanding:** accessibility of goal-based guidance, rather than a new service or proof point.
- **Scroll cost:** desktop statement 900px plus 900px timeline spacer: 1,800px / 200%, y900–2,700. Mobile 230px / 27%, y1,055–1,285; spacer hidden. Tablet retains two additional 1,080px allocations. Spacer advances the sticky scene; it is not literally a blank white section.
- **Interaction:** word opacity/blur sequence, pinning and reversal; no CTA. Reduced-motion path differs.
- **Client value LOW · Trust LOW · Conversion LOW · Cognitive load LOW (high time/scroll cost on desktop).**

## 04 — “From scattered decisions to one coordinated plan.”
- **What the user sees:** huge split heading, then Before/After cards. “Financial decisions made in isolation” versus “Every decision aligned with your goals”, four points per card, branch/target icons and crosses/checks. Mobile stacks both cards.
- **Communicates / expected understanding:** coordinated planning considers goals, protection, risk and retirement together.
- **Scroll cost:** desktop y2,700–5,958, 3,258px / 362%, multiple screens; mobile y1,285–2,672, 1,387px / 164%. Tablet switches to shorter normal flow.
- **Interaction:** desktop pinned heading exits sideways, before-card scale/translation and after-card reveal. Mobile/reduced-motion static layout. No direct action.
- **Client value MEDIUM · Trust LOW (assertions, not evidence) · Conversion LOW · Cognitive load MEDIUM.** A screenshot during the transition may show partial heading text; inspect the full sequence, not a single frame as a defect.

## 05 — “Services.”
- **What the user sees:** oversized section title, explanatory paragraph, two-bar planning illustration, then nine full image/text cards. Exact order: Financial Planning; Life Insurance; Health Insurance; Mutual Funds; Retirement Planning; Child Education Planning; Personal Accidental Policy; General Insurance; Employer Employee Insurance.
- **Each card:** service tag/icon; decorative 01–09; outcome headline; paragraph; five “What we discuss” items where supplied; “Talk about your goals”; illustration and testimonial overlay when the CMS relation supplies one. No need to infer services from a stock image.
- **Communicates / expected understanding:** breadth, product differences, discussion topics and route to relevant enquiry.
- **Scroll cost:** desktop y5,958–12,364, 6,406px / 712%; mobile y2,672–12,368, 9,696px / 1,149%. Nine desktop cards alone 5,400px; intro/chart/padding ~1,006px. On mobile each image area is 400px before surrounding copy/spacing. The full service list is 28% of desktop and 40% of mobile page height.
- **Interaction:** scroll-driven illustration bars, reveal animation, sticky stacked cards on larger screens, image hover, three kinds of service links (tag/title/image), per-service contact preselection. Nine contact prompts exist here—claims that there are none until the bottom are false.
- **Client value HIGH · Trust MEDIUM · Conversion HIGH · Cognitive load HIGH.** Relevance changes sharply after the visitor finds their category. Evidence `home-1440-10.png`, `home-390-05.png`.
- **Chart interpretation:** lengths are decorative comparisons (100%/67.6% in code), not outcomes. Caption explicitly disclaims return forecasts. It is not actual performance evidence.

## 06 — “Your goals come first. The plan follows.”
- **What the user sees:** heading/subheading; four-phase Understand / Assess / Plan / Review control with one detailed phase open; large “How we work” poster/play affordance; “Personal advice. Ongoing support.” and Online access / Annual review / Personal service items.
- **Communicates / expected understanding:** conversation, assessment, recommendations, implementation/review and support after purchase.
- **Scroll cost:** desktop y12,364–14,471, 2,107px / 234%; mobile y12,368–14,146, 1,778px / 211%. Media frame ~743px desktop / 398px mobile, nested within section.
- **Interaction:** hover/focus/click changes phase. The current Strapi configuration supplies a real process video: click successfully starts it and reveals native controls. No text tracks were present; inspect the actual audio/content before specifying captions versus an equivalent text description. The text dialog repeating phases is only a fallback for missing media, not an extra visible block in this configuration.
- **Client value HIGH · Trust MEDIUM · Conversion MEDIUM · Cognitive load HIGH from multiple presentations of the process.** Evidence `home-1440-18.png`.

## 07 — “Meet your advisor. A personal partnership.”
- **What the user sees:** very large heading in green rounded panel; one actual founder portrait/name, Chandrakant B. Ghanchi, Founder & Financial Planner; plus control. “Recognition. Built on service.” description and View Awards link. No award images appear in this homepage panel.
- **Communicates / expected understanding:** identifiable person behind advice, with a recognition archive available.
- **Scroll cost:** desktop y14,471–15,413, 942px / 105%; mobile y14,146–14,856, 710px / 84%. Recognition block ~245/255px.
- **Interaction:** native profile dialog and link to founder on About; awards route button. Real founder image is not interchangeable with illustrative service/process imagery.
- **Client value HIGH · Trust HIGH · Conversion MEDIUM · Cognitive load LOW.** It is visually sparse, not text-overloaded; late placement and oversized treatment are separate issues. Evidence `home-1440-20.png`.

## 08 — “Testimonials”
- **What the user sees:** large looping family-video background, long Neeta Agrawal testimonial and initials/name/employer, rating caveat; three additional interactive quotes by Sumit Jain, Ranbir Singh, Vikram Sawant; statistics; another founder callout and CTA.
- **Communicates / expected understanding:** real people report personal service and ongoing help; company-reported scale/experience. Employer labels do not establish corporate endorsements.
- **Scroll cost:** desktop y15,413–17,565, 2,152px / 239%; mobile y14,856–17,507, 2,651px / 314%. Feature ~927/870px; three-quote list ~356/922px; stats and founder callout add further height.
- **Interaction:** focus/hover/click quote expansion and archive links; 1.7s stat count-up when entering view; founder contact CTA. Counts are settled values, not the intermediate 0/725 states seen in some checkpoint images.
- **Client value HIGH · Trust HIGH when attributed/qualified · Conversion MEDIUM · Cognitive load HIGH.** Hero/service proof already exists; this is the first dedicated testimonial section, not the first testimonial anywhere.

## 09 — “A personal approach, for clients in India and abroad.”
- **What the user sees:** Serving clients since 2009; focus/clients/review definition list; 15+ and 1,200+ statistics; initials/client-count illustration when no feature image; all nine service links; Neeta's quote again; Meet Our Clients.
- **Communicates / expected understanding:** audience fit and ongoing review. Component name `FeaturedCase` is misleading to developers: no named case, problem/intervention/outcome or validated performance is presented.
- **Scroll cost:** desktop y17,565–18,409, 843px / 94%; mobile y17,507–18,722, 1,215px / 144%.
- **Interaction:** counter, image/link hover, services links, client archive CTA.
- **Client value LOW incremental · Trust MEDIUM largely duplicated · Conversion LOW · Cognitive load HIGH.**

## 10 — “FAQ”
- **What the user sees:** title, four categories (General, Planning, Protection, Online Services); General opens first with what/who/where; one answer open and More questions? contact prompt. Eleven questions exist across categories.
- **Communicates / expected understanding:** company fit, starting process, claim support, external portals, historical rating and no guaranteed returns.
- **Scroll cost:** desktop y18,409–19,297, 888px / 99%; mobile y18,722–19,511, 789px / 93%; active category/answer changes height.
- **Interaction:** roving-focus tabs with arrows/Home/End, animated answers, contact link. Default tab obscures useful specific objections unless discovered.
- **Client value HIGH · Trust MEDIUM · Conversion HIGH · Cognitive load MEDIUM.**

## 11 — “Knowledge for your next chapter.”
- **What the user sees:** archive qualifier, View All link, two large article images with dates/category/title. Articles: “Single Woman, Retiring Solo Is a Dream Retirement Life (but) With Proper Planning!” and “You Don’t Have to Be Rich to Retire Rich!”. Original March 2021 dates retained.
- **Communicates / expected understanding:** educational material is available, not a current-news feed.
- **Scroll cost:** desktop y19,297–20,026, 729px / 81%; mobile y19,511–20,799, 1,288px / 153% due to stacking.
- **Interaction:** article and blog links, image hover/reveal. No need to read both to contact the business.
- **Client value MEDIUM · Trust MEDIUM · Conversion LOW direct · Cognitive load MEDIUM.**

## 12 — “Let’s plan your next chapter.”
- **What the user sees:** large heading, three benefits, Manju Rajvanshi quote with identity; glass-styled enquiry form over blue decorative media; name/email/phone, nine service choices, optional financial goal, enquiry, required consent; Send enquiry; 1,200+ clients / 15+ years.
- **Communicates / expected understanding:** how to begin, what to share, no account credentials/sensitive documents, consent and next step.
- **Scroll cost:** desktop y20,026–21,242, 1,216px / 135%; mobile y20,799–22,679, 1,880px / 223%. A visitor can instead use persistent nav/contact or earlier service CTAs; the embedded form is not the only contact route.
- **Interaction:** native/custom validation, service pills, async request/loading/error/success, privacy/terms links. Webhooks require separate configuration; mocked success does not prove delivery. Current contact and testimonial decorative videos autoplay when scrolled into view even under reduced motion, without pause controls (`evidence/runtime-findings.json`). Background motion/media is not form functionality.
- **Client value HIGH · Trust HIGH potential · Conversion HIGH · Cognitive load HIGH.** Evidence `home-1440-28.png`.

## 13 — Footer — “Subscribe to our newsletter.”
- **What the user sees:** actual logo and CBD Belapur office address, newsletter signup, mission statement and founder, two phones/two emails, social/legal/navigation links, risk disclosure and oversized “ghanchi” wordmark.
- **Communicates / expected understanding:** reachable local business, ways to continue/use the site, legal limitations.
- **Scroll cost:** desktop y21,242–22,541, 1,299px / 144%; mobile y22,679–24,272, 1,593px / 189%.
- **Interaction:** newsletter with consent, email copy status, tel/mailto/social links, scroll circle/card reveal, layered wordmark hover. Mobile/reduced-motion disable some effects. Preserve the wordmark and layered hover per project rules.
- **Client value HIGH utility · Trust HIGH · Conversion MEDIUM · Cognitive load MEDIUM.** Footer utilities should not be confused with first-time sales copy.
