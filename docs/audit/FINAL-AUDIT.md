# Ghanchi Investments Website Audit

**Client-perspective audit, content reduction and conversion restructuring**  
Date: 30 September 2026  
Status: **Audit complete; recommendations awaiting owner approval. No implementation authorized.**

## Executive summary

The site has useful material and a distinctive identity. It does not need a rebuild. Its central problem is **repeating service explanations and reassurance over a very long journey**, not a total absence of trust or contact actions. It is frequently spacious rather than cramped; a spacious section can still impose disproportionate scrolling.

At 1440×900 the homepage measures **22,541px / 25.05 viewport heights**; at 390×844 it measures **24,272px / 28.76 heights**. Services alone occupies 6,406px desktop and 9,696px mobile. Desktop visitors reach the Services section only at y5,958 after hero, statement/timeline and a 3,258px comparison scene. The dedicated founder section starts at y14,471, dedicated Testimonials at y15,413. There are earlier service-card testimonials and early hero claims: these distinctions matter.

Recommended: preserve the protected hero/statement and footer personality; compact all nine services into grouped links; bring short named proof and founder credibility ahead of process; merge the comparison/FeaturedCase messages rather than maintain two separate canvases; demote dated newsletter promotion; keep functional contact/utility routes. Estimated target **~9,100px desktop / ~9,600px mobile**, approximately **60% shorter**, subject to actual copy/layout verification. This is a budget, not an implemented result.

The audit also reproduced **invisible Contact introduction under reduced motion**, **2.21:1 green-button text contrast**, and **decorative autoplay despite reduced motion**. These are independent of subjective redesign preferences. Typecheck and production build pass; the full existing suite returned **33 passed / 6 failed**, detailed below. Do not call this a clean production sign-off.

## 1. Scope, evidence and limits

- Audited current branch/worktree `ghanchi-investments`, including five existing uncommitted production files. Original diff: 66 insertions/55 deletions. No audit edits to production code, CMS records, security/deployment settings or `.env`.
- Existing local Strapi started with explicit owner authorization. Initial frontend used stale private-LAN media addresses; final captures use a process-only local origin and all homepage assets load. Missing images before startup were an environment issue, not a website image-component finding.
- Rendered all **25 canonical public pages** at desktop and mobile, measured homepage at 1440/1200/810/390px. Reviewed full captures, normal-motion checkpoints and reduced-motion top/mid route sheets. Exact route table below. Four-width route coverage also exists in the test suite; note the one 1200px failure.
- Evidence: [scroll map](01-homepage-scroll-map.md), `evidence/measurements.json`, `home-brief.json`, `public-content.json`, `inspection.json`, `runtime-findings.json`, `screenshots/`, `routes-top-sheet.png`, `routes-mid-sheet.png`.
- Full-page screenshots taken while at the footer can show the fixed header lower down and the expanded footer circle over earlier content. These are capture/sticky-compositing artifacts, not proof of an ordinary blank section. Normal checkpoints and reduced-motion supplemental captures resolve that ambiguity. The reduced-motion blank Contact intro, by contrast, was separately reproduced and measured.
- No analytics, real-client interviews, conversion experiment, screen-reader session, real financial submission, payment/login, live email delivery or external regulatory-register verification. Persona reactions are hypotheses. No fabricated abandonment percentages, conversion uplift or time-on-page claims.
- External portal/newsletter destinations were inspected as links, not authenticated or transacted. Two newsletter URLs are intentionally unavailable; live availability of all external providers needs a separate safe link review.

## 2. Actual architecture

| Area | Current implementation |
|---|---|
| Framework | Next.js 16.3.4 App Router; React 19.2.8; TypeScript; Tailwind CSS 4.2.1; CSS files; Motion 12.34.0; Lucide icons |
| Composition | `src/app/page.tsx:12-17` assembles homepage; `layout.tsx:19-27` wraps global Header/Footer/MotionProvider |
| Content | **Strapi is implemented**, not future work. `src/lib/strapi.ts` typed REST adapter; server fetches revalidate after 60s; page data fetched concurrently. `content.ts` is types/helpers, not the old six-record content store |
| Assets | Current media URLs resolve from Strapi `/uploads`; size-aware derivatives/focal points in `mediaUrl`/`mediaFocal`. Local `public/assets` still supplies fallback/favicon and legacy assets. Real founder/recognition records distinguished from illustrative service/hero/video imagery |
| Forms | Client Contact/Newsletter components → `/api/contact` and `/api/newsletter`; server validates body/origin/consent, service IDs, HTTPS webhook transport and timeouts. Unconfigured delivery intentionally returns 503 |
| Navigation | CMS-driven Header with desktop dropdowns and mobile menu; phone icon, Contact Us and Online Services; Footer duplicates useful utility links |
| Motion | Sticky hero/statement, comparison choreography, sticky service cards, reveals, phases/testimonial interactions, count-up stats, decorative videos, footer reveal/hover; reduced-motion JS/CSS support is incomplete in Contact/media |
| SEO | Per-route metadata/canonicals, global FinancialService/WebSite JSON-LD, Article/Breadcrumb data, sitemap and preview robots; no fabricated aggregate-rating schema |
| Analytics | No implementation of a client analytics integration found in `src`; no measured funnel data available |
| Existing integrations | Strapi content, optional HTTPS delivery webhooks, outbound provider/account/renewal/app links; no new integrations needed for restructuring |

**Documentation drift:** older AGENTS/docs still describe a future Strapi connection and file-backed collections. Do not remove/replace the working integration on that basis. Current runtime/source/evidence take precedence. This handoff records the correction without rewriting older project history during the audit.

## 3. Current homepage structure — exact order

01 Header → 02 Hero (“A personal financial advisor for Navi Mumbai families, trusted since 2009.”) → 03 “Making goal-based financial advice accessible to all.” and timeline spacer → 04 “From scattered decisions to one coordinated plan.” → 05 “Services.” → 06 “Your goals come first. The plan follows.” → 07 “Meet your advisor. A personal partnership.” → 08 “Testimonials” → 09 “A personal approach, for clients in India and abroad.” → 10 “FAQ” → 11 “Knowledge for your next chapter.” → 12 “Let’s plan your next chapter.” → 13 Footer.

Nested proof/chart/recognition/statistics are not invented standalone sections. [01](01-homepage-scroll-map.md) contains exact component mapping, per-section pixels/viewport percentages, visuals, interactions and value ratings. [03](03-section-decision-matrix.md) contains exactly one primary decision per section and six density/value scores.

## 4. Biggest problems, ranked by client impact

| Priority | Finding | Evidence | Why it matters / proposed response |
|---|---|---|---|
| 1 | Nine full service presentations delay proof and force irrelevant reading | 6,406px D / 9,696px M; `ServicesSection`, screenshot `home-390-05.png` | Keep all nine choices, not nine homepage mini-pages. Group linked rows; keep detail pages intact |
| 2 | Reduced-motion Contact introduction is invisible | Reproduced at 1440×900 after 2.5s: both introduction containers opacity 0; normal mode opacity 1. `contact.tsx:39-47`, `runtime-findings.json` | Hides the most useful contact information for this audience; fix initial/final animation states before launch once authorized |
| 3 | Comparison costs 3.62 desktop screens before services | `Comparison`, y2,700–5,958 | Claims about coordination are not proof. Merge two useful benefits into founder/why block |
| 4 | Green controls have insufficient text contrast | Computed foreground `(255,255,250)` / background `(118,193,67)` = 2.2086:1; 13–15px text | Hard readability/accessibility issue, not taste. Correct tested combinations without replacing the brand palette |
| 5 | Distinctive named/person evidence is late and fragmented | Founder y14,471; dedicated proof y15,413 D; early badge is reported numbers | Promote real identity and compact attributed proof, keep qualifiers, not more decorative badges |
| 6 | Lower page repeats the same proof types | Testimonials → stats → founder CTA → FeaturedCase stats/services/Neeta quote → contact stats | Merge repeated content; every retained block should answer a new visitor question |
| 7 | Decorative motion competes with reading/form entry | Testimonial and contact videos autoplay in view under reduced motion at desktop/mobile, no visible pause controls | Static fallback/explicit user control; don't conflate this with the working click-to-play process video |
| 8 | Dated content given “latest” hero prominence | November 2021 newsletter card is 400px on phone; archives date to 2020–21 | Keep honest archives lower; don't imply active publication or invent new issues |
| 9 | Form/launch expectations and professional status need confirmation | Webhook-gated delivery; draft legal pages; historical credentials; current advisory terminology | Confirm actual delivery and business capacity separately. Cleaner design does not establish legal authorization or working email |
| 10 | Regression expectations are out of sync with current content/mobile behavior | Four process tests expect missing-video dialog; one mobile pin test fails; one parallel `/blog` 500 | Resolve intentionally, never bypass tests to claim a redesign is verified |

## 5. Trust analysis

### How soon does meaningful proof appear?

- **Initial screen, no scroll:** hero says “trusted since 2009”; badge at ~y731 (desktop, 81% of viewport) / y490 (mobile, 58%) says 1,200+ clients and historical 5.0/5. Header carries real logo, phone action and a small founder image on desktop. Trust claims are **not absent until the bottom**.
- **Nature of that proof:** those are company-reported historical claims, not independently validated review counts/licences. The word “Google” is qualified, but “on existing site” is developer-oriented and awkward.
- **First named client testimony:** occurs within the service cards, beginning in the first Financial Planning card (card flow starts ~y6,844 D; first card in the ~3,000–4,500px mobile region). Its exact visible quote position depends on reveal/sticky progress. It is substantially earlier than the dedicated Testimonials section but still delayed by the intro/comparison.
- **Dedicated real founder block:** y14,471 / 16.08 desktop viewport heights; mobile y14,146 / 16.76 heights. Tiny header portrait is not a substitute for a readable name/bio.
- **Recognition link panel:** ~y15,088 D; ~y14,576 M. Full awards and certificates are only on separate pages. No homepage award gallery to remove.
- **Dedicated testimonials:** section top y15,413 / 17.13 D heights; y14,856 / 17.60 M heights. Four clients in this block; eleven in the full archive. Separate rating/statistics are farther down.
- **Direct contact:** phone/nav and hero link already available from load; embedded form y20,026 / 22.25 D heights and y20,799 / 24.64 M heights. Late form placement is not the same as no conversion path.

**Conclusion:** early claims exist, but checkable human context and non-repetitive proof should be earlier. Do not add a bigger unverified rating to solve the hierarchy problem. Proposed dedicated proof begins around y3,800 D / y2,830 M, with compact founder/source-based trust already in the hero.

### Claims ledger

- **1,200+ clients:** present consistently in current CMS; owner should confirm definition/as-of date. Never relabel as “families”, “policies” or active accounts.
- **Since 2009 / 15+ years:** both company-reported; not logically contradictory because 15+ is a lower bound. Prefer one concise stable claim; don't auto-increment to a stronger number.
- **5.0/5:** historical site-reported value; no live feed or verified review count. Source/date and owner confirmation required before elevating it.
- **12+ awards:** present claim, but **eight photos and nineteen certificate scans do not establish the number of distinct awards**. Reconcile before promotion; preserve archive with neutral captions.
- **Credentials:** archive contains genuine-looking historical recognition/registration/course scans with generic captions. That does not prove current validity or regulated scope. Founder title and Financial Planning/advisor wording need owner/compliance verification; no inference that the company is unregistered.
- **Associations:** client employers and external LIC/NJ/Fundz Bazar/insurer portal links are not evidence of corporate endorsements or partnerships. Do not add their logos as “trusted by”.
- **Absent:** verified AUM/business scale, policies sold, branch count, current review count. **Do not fabricate a statistic. Use another trust mechanism.**

### Testimonials and recognition

Use one or two concise, accurately attributed originals early. The insurance-specific Manju Rajvanshi quote is already short; Neeta Agrawal provides planning context. Selection/permission and any ellipsis require approval. Keep names and initials, source URLs and full records. Do not change Sumit Jain's “family’s health” to “wealth”; it plausibly refers to insurance and is not an established typo. A money-making sentence and “new website” reference occur in **Firoz Shaikh's** archive quote, not Parvez Shaikh's. Do not promote that language as a present investment outcome.

Awards/certificates deserve a compact contextual entry near founder credibility, not a new large carousel. Transcribe issuer/date/type/expiry with owner review before using any badge. Preserve original scans and separate professional authorization from sales recognition/community certificates. Their utility is contextual credibility, not guaranteed competence or returns.

## 6. Client perspective and curiosity

| Visitor | Actual question | Current friction | Proposed answer path |
|---|---|---|---|
| First-time investor | “Can they help me invest, and what should I do first?” | Hero is broad; Mutual Funds follows three full cards; nine-service sequence delays reassurance | Concrete product line → Plan & invest group → named proof → steps → contact |
| Insurance customer | “Can I trust them to explain cover and help later?” | Must scan planning-first content; servicing/claims appears in deliverables/process/FAQ | Insurance group → relevant genuine quote → founder and claim-assistance boundary → enquiry |
| Family planner | “Can someone consider our goals together?” | Comparison, chart, process and overview repeatedly make that promise | One coordinated-benefit explanation, clear categories, review/implementation details |
| Existing client | “Where do I access accounts, renew or get help?” | Homepage narrative is mostly irrelevant, but useful Online Services nav exists | Preserve direct Online Services/phone; no need to force lead-generation form |
| Referral visitor | “Who is this person, and why was I referred?” | Name/bio buried; hero portrait alone gives little context | Real founder micro-proof early, fuller identity after named client proof, About link |

The current flow creates initial curiosity, then repeats the answer “personal goals-based planning” across several visual forms. Better curiosity comes from **new answers**, not animation frequency: what help → who has used it → who helps → what happens → how to contact. Timing goals in 04 are design hypotheses, not observed behavior. No urgency, scarcity, fear-based cover warnings or return promises recommended.

## 7. Overcrowding / visual cleanup

The site is **sparse-but-long in places and dense in others**. Do not solve all of it by cutting padding.

- Services: remove repeated image/quote/deliverable structures from homepage, keep linked service names and short benefits.
- Testimonials: one/two readable proof items; no long feature plus three-card rail plus rating plus four-stat grid plus founder sales message.
- Comparison and planning bars: replace with a couple of concrete coordination benefits; graphic complexity adds little verified information.
- Process: keep four steps and ongoing-service usefulness; actual media optional, not presumed broken or useless.
- Founder: stronger position and concise visible biography, not a giant panel whose main detail requires a plus-icon click.
- Contact: keep controls/consent/validation; remove decorative background motion and improve solid-surface contrast rather than arbitrarily drop important fields.
- Footer: preserve wordmark/hover and essential utilities; shorten repeated mission copy. Footer size is not the main source of waste.
- Imagery: founder/award documents are evidence; flower/stock/AI service/family/glass imagery is illustration. No insinuation that illustrative people are actual clients.

## 8. Scroll analysis and section decisions

All current section heights and the primary decisions are in 01/03. Summary:

- **KEEP:** Header; protected statement/timeline.
- **KEEP + REDUCE:** Hero, Services, FAQ, Insights/resources, Contact, Footer.
- **KEEP + MOVE UP:** Founder/recognition; compact Testimonials.
- **KEEP + MOVE DOWN:** Process, behind person/proof.
- **MERGE:** Comparison into founder/why; FeaturedCase into existing identity/proof/audience-fit content.
- Child removals are presentation-only: planning bars, redundant service image/deep-detail stacks, duplicated proof blocks, decorative autoplay. No content record or public route deletion.

Current 22,541 / 24,272px → central target 9,100 / 9,600px. Estimated ~60% reduction; practical target bands 9,000–10,500 D and 9,500–11,500 M. Default retains the expensive desktop hero/statement timeline; more aggressive shortening requires explicit motion approval. Do not promise a services-within-two-screens result while preserving three viewport allocations unchanged.

## 9. Recommended homepage structure

01 Header → 02 Hero + compact qualified trust → 03 protected statement → 04 grouped Services → 05 compact named Testimonials → 06 founder + why + recognition → 07 compact Process / optional video → 08 selected FAQ → 09 compact resources/archive → 10 Contact → 11 Footer.

Every retained section's purpose, client takeaway, CTA, placement rationale, approximate budget and content destination is specified in [04](04-recommended-information-architecture.md). No implementation structure has yet been approved.

## 10. Mobile / desktop / content / conversion recommendations

### Mobile
All nine service labels visible as short grouped rows, not a swipe-only carousel. Remove the 400px newsletter teaser from hero prominence and nine 400px service images from home. Keep early qualified trust and telephone/menu usable. Preserve original short mobile statement until owner resolves the existing pin-test conflict. Allow honest natural text wrapping; no forced card heights just to match desktop. Check 390 and 810 separately, keyboard, touch, zoom and reduced motion.

### Desktop
Retain the professional rounded-panel/blue-green-cream language and protected motion. Replace enormous repeated canvases with clear changes in information type. Compact service columns and short proof allow visual breathing room without 25 viewport heights. Current nav/hero CTA already works; improve emphasis rather than add competing floating actions.

### Content
Shorten homepage summaries only, not shared service `longDesc` fields. Keep existing strong client-language headings. Replace repeated “personal/goals/next chapter” messages with concrete subsequent answers. Keep archival dates, risk qualifications and disclosure substance. Avoid internal terms like “not connected” as primary public copy. Verify owner-approved role, offer, response expectations and permission before changing them.

### Conversion
Service discovery and contact should remain obvious at load and after relevant proof. Consolidate to a primary contact phrase, secondary detail/archive links. Current CTA abundance is not a shortage: nine service contact links plus header/hero/founder/FAQ exist. Keep the homepage enquiry form as well as `/contact-us`; don't duplicate additional forms. Preserve valid service preselection. Any optional-phone/message change requires operational approval and matching server/client tests. No “free call”, WhatsApp or booking guarantee added by inference.

## 11. Every public route reviewed

All 25 canonical pages returned 200 in the dedicated crawl with one main H1, loaded images, no pageerror and no horizontal overflow at 1440/390px. The parallel suite later observed one `/blog` 500 at 1200px; that exception remains in verification below. Heights include shared footer, so they are not all unique-content height.

| Route | Height D / M px | Client/IA observation and destination decision |
|---|---:|---|
| `/` | 22,541 / 24,272 | Primary restructuring scope |
| `/about-us` | 5,778 / 7,753 | Real founder letter and values; retain biography depth, condense repeated vision/education blocks when separately approved |
| `/about-us/awards` | 3,482 / 5,788 | Eight authentic archive photos; generic numbered captions need interpretation, not invented titles |
| `/about-us/certificates` | 5,120 / 10,232 | Nineteen mixed historical records; categorize/annotate after verification, don't imply current licences |
| `/about-us/our-clients` | 3,481 / 4,946 | Nine audience cards repeat identical introductory text; replace repetition with useful grouping/list; preserve no-corporate-endorsement note |
| `/about-us/testimonials` | 9,608 / 12,064 | Eleven long source-linked quotes; valuable deep archive, not homepage-sized proof. Improve scanning without altering originals |
| `/services` | 3,392 / 5,535 | Already demonstrates more compact catalog pattern; reuse conventions for home selector |
| `/services/financial-planning` | 4,609 / 6,146 | Appropriate detail destination; verify professional-capacity copy |
| `/services/life-insurance` | 4,455 / 5,777 | Insurance-specific quote exists; retain needs/policy/claims detail |
| `/services/health-insurance` | 4,609 / 6,110 | Sumit quote and coverage/exclusion topics; generic mutual-fund disclaimer elsewhere on template is a copy mismatch to review |
| `/services/mutual-funds` | 4,609 / 6,005 | SIP/lump-sum options legitimately present; no new separate SIP service invented |
| `/services/retirement-planning` | 4,865 / 6,519 | Keep goal/income detail; related cards always take early catalog entries rather than deliberate relationship ranking |
| `/services/child-education-planning` | 3,827 / 5,218 | No service testimonial relation renders here; don't fabricate one to fill layout |
| `/services/personal-accidental-policy` | 4,660 / 6,206 | Clarify difference from life/health in short summary; preserve scope/terms |
| `/services/general-insurance` | 4,711 / 6,227 | Preserve risk/policy-specific detail; do not add unsupported product lines |
| `/services/employer-employee-insurance` | 4,865 / 6,644 | Business-specific audience belongs in its own compact group, not dropped from catalog |
| `/online-services` | 3,711 / 5,894 | Eleven useful portal/archive/app items; keep direct nav, consider task grouping; no new client login system needed |
| `/newsletters` | 3,729 / 6,244 | Nineteen dated issues; November 2020/June 2020 unavailable by design; clearer client wording, no guessed URLs |
| `/blog` | 3,005 / 3,039 | Two explicitly archived/adapted articles; retain category filtering, don't ingest polluted legacy feed |
| `/blog/single-woman-retiring-solo-is-a-dream-retirement-life-but-with-proper-planning` | 4,389 / 4,602 | Original date/adaptation note/source link important; title long, shorten display only with editorial approval |
| `/blog/you-dont-have-to-be-rich-to-retire-rich` | 4,344 / 4,537 | Keep genuine education; avoid treating aspirational title as outcome guarantee |
| `/contact-us` | 3,292 / 4,072 | Useful phones/address/hours at top normally; confirmed reduced-motion invisibility must be fixed |
| `/privacy-policy` | 2,201 / 2,590 | Explicit draft and noindex; owner legal review required |
| `/terms-of-service` | 2,169 / 2,446 | Explicit draft and noindex; preserve legal route |
| `/disclaimer` | 2,397 / 2,802 | Appropriate risks/archive qualifications; owner final review |

Also inspected: both published `/insights/{article-slug}` aliases return 308 to corresponding `/blog/{article-slug}` (follow-up evidence in `final-checks.json`). `/blog?category=…` filtered states work; invalid category returns full listing, not an error. `/about`, `/contact` (service query retained), `/insights`, `/cases`, four old About slugs and nine bare service slugs redirect with 308 to canonical destinations. `/cases/[slug]` is not a working case-study product; sampled unknown case returns 404. Unknown content returns 404. `/robots.txt` disallows all in this preview, as intended; sitemap serves 22 non-legal canonical pages. API POST routes inspected/tested with mocks, not treated as public content pages.

## 12. Code / functional findings and SEO

### Confirmed and reproducible
1. **Reduced-motion Contact invisibility:** `ContactIntro` computes empty final `animate` targets when reduced, while the server snapshot initially sets opacity 0. `useReducedMotion` server snapshot is false (`ui.tsx:15`). Fresh reduced-motion navigation leaves copy/details opacity 0; normal mode reaches 1. Add a failing test before future fix; accessible text needs an explicit visible reduced state.
2. **Contrast:** white/off-white small text on current green is ~2.21:1, below normal-text 4.5:1 and large-text 3:1. Team text is now blue, so the older “all team text white” finding is stale. Check actual per-element colors, don't blanket-replace green.
3. **Decorative videos:** testimonials/contact autoplay in view under reduced motion; no pause control, `autoPlay muted loop`. MotionProvider/CSS does not stop HTML video. Prefer still frame/reduced-motion conditional playback and user pause where retained. Offscreen-paused observations alone are misleading.
4. **Mobile hero/test contract mismatch:** current CSS makes statement relative/short on <=560px (`globals.css:625-632`); authoritative test still expects pin y0. Requires owner decision about preserving old behavior vs approving current adaptation, not an arbitrary test deletion.
5. **Process test contract stale:** real video plays with controls (readyState 4, paused false); four tests still expect fallback dialog. Test both media-present and media-absent behavior using deterministic fixtures after authorization. No text tracks found; captions/transcript need content review.

### Source-supported risks, not reproduced outages/security exploits
- `strapiFetch` throws on failure; root layout depends on CMS; no app-level custom error/loading boundary found. CMS loss can fail fresh renders/builds, although cached pages may continue serving. Do not claim every page instantly fails on any outage. Contact validation also calls CMS without an explicit JSON error boundary (`api/contact/route.ts`). Add failure-mode tests later.
- Media URLs use `STRAPI_URL`; reachable public HTTPS origin is a deployment concern. The stale LAN incident demonstrates local configuration drift, not a reason to change production env without approval.
- Sitemap hardcodes four About subsections while routes source them dynamically from Strapi: future CMS slug changes could drift. Current listed routes work.
- Missing service/article media can produce empty OpenGraph image values; current selected assets load. Root metadata lacks a dedicated social-share image. Improvements are separate from scroll reduction.
- Article JSON-LD already uses an absolute URL (older relative-URL issue fixed); author/publisher data could be richer if verifiable. Do not invent an expert author or review schema.
- The documented legacy content validator fails reproducibly (`content.validateContent is not a function`): it still assumes file-backed exports. This is tooling/documentation drift, not proof that current CMS records are invalid. Preserve the current integration and replace validation only under approved scope.
- No analytics present; privacy-aware click/form completion measurement would help validate this plan, but requires consent/data policy decisions. No automatic integration installation.
- No application-level rate limiter identified for forms; honeypot/origin checks do not prove adequate abuse control. Review launch threat/traffic needs separately without weakening existing security.

### SEO restructuring rules

Retain direct service links, all nine detail routes, title/meta intent, canonical/308 mappings, About identity and real archives. Move useful detailed paragraphs off home only if they remain reachable/indexable on suitable existing pages. Keep article adaptation/original dates/source attribution. No wholesale import of legacy blog feed. Canonical homepage currently exists (`page.tsx:8-9`), so don't “fix” an obsolete absence. Legal noindex is a current deliberate choice; legal approval doesn't automatically require changing index policy. Preview robots remains until launch approval/SITE_URL configuration. FAQ markup is optional/low priority; do not promise FAQ rich results for this site.

## 13. Industry references — useful patterns, not a template to copy

Accessed 30 September 2026. Official homepages fetched as readable documents; content order below reflects extraction, **not a pixel-level competitor visual audit**. No traffic/conversion/CWV comparisons measured. Additional research used indexed snippets; only appropriately qualified findings adopted.

| Source | Observed useful pattern | Application to Ghanchi | What not to copy |
|---|---|---|---|
| [Ditto](https://joinditto.in) | Extracted opening pairs clear insurance identity with review/backing links; Term Life/Health explained early; expert/assistance/claims promise, named reviews, checklist/FAQ, explicit support/licence footer | Explain concrete service and ongoing help, provide one clear conversation path and checkable proof | Their numbers, backing, free-call/no-spam guarantee, claimed credentials or breadth of claims support |
| [Scripbox](https://scripbox.com) | Goal-led identity, concise mission/since date and scale; benefit sections with testimonials; separate pricing/detail links | Pair short benefit with attributed evidence, keep detailed product/fee questions in appropriate destinations | Their AUM, clients, returns, adviser/distributor permissions or “best funds” claims |
| [FundsIndia](https://www.fundsindia.com) | Goals and product navigation distinct; short investment options, expert CTA, goal cards, testimonials and transparent disclosures | Group Ghanchi's existing categories and keep a human assistance path | Their calculator/performance chart, massive product catalog, strategy-return comparison or registrations |
| [NJ Wealth distributor information](https://www.njwealth.in/mf-distributor/) | Indexed disclosure material specifies legal/registration identity rather than anonymous “trusted” badges | Verify exact applicable entity/capacity/validity before adding credentials | Their network scale/registration status as Ghanchi's own |

These sites are not uniformly short and some are promotional. The lesson is clear identity/service/proof/disclosure, **not** maximizing badges or repeating CTAs every viewport.

Regulatory context for owner review: [AMFI FAQs on Do's & Don'ts for MFDs](https://www.amfiindia.com/Themes/Theme1/downloads/FAQsonRoleofMFDsAdvts.pdf), especially Q2–3, distinguishes incidental mutual-fund distribution guidance from regulated investment advice/financial planning; [SEBI IA FAQ, August 2025](https://www.sebi.gov.in/sebi_data/faqfiles/aug-2025/1755174193178.pdf) is an additional official reference. This is a **verification/wording gate**, not a legal finding about Ghanchi's current authorization. Do not transplant another firm's compliance footer or invent an ARN/SEBI/IRDAI status.

## 14. Agency Agent findings and adjudication

Agency Agents already existed locally: sixteen definitions under `docs/agency-audit/roster/`, with upstream provenance in `docs/agency-audit/AGENT_ROSTER.md` (msitarzewski/agency-agents). No installation necessary. Seven independent narrow reviews used actual definitions as operating briefs via `subagent_explore`, plus supporting technical and industry reviews. This profile uses the documented lower-cost subagent router; the exact runtime backend model/billing was not inspected. Definitions are advisory prompts, not independently trained seven specialist models or human researchers.

| Requested lens | Actual available persona used | Useful independent finding adopted |
|---|---|---|
| A UX | Persona Walkthrough Specialist (closest local UX-research fit) | Local/family identity is clear; readable proof/person should arrive earlier |
| B Conversion | Persona Walkthrough Specialist, conversion framework | Preserve homepage form plus dedicated contact route; simplify competing archive/form context |
| C Visual design | UI Designer | Sparse-but-long is different from visual overcrowding; repeated service architecture is major fatigue source |
| D Information architecture | UX Architect | Move newsletter out of hero; merge duplicated founder/stat material |
| E Trust | Brand Guardian + Reality Checker | Early reported trust exists; verify awards count and rating basis before promoting |
| F Mobile UX | UX Architect + Accessibility Auditor | Service-card stacking dominates mobile height; keep early trust and utility navigation |
| G Content | Content Creator | Group nine actual categories; shorten repeated personal/goals language and developer provenance |
| Technical/SEO/accessibility support | Frontend Developer + SEO Specialist + Accessibility Auditor | CMS dependency, dynamic sitemap drift, metadata edge cases and safe preservation boundaries |
| Industry support | SEO Specialist + Persona Walkthrough Specialist | Official-service grouping/disclosure patterns and regulated-role terminology gate |

**Evidence limits:** visual/mobile subagents explicitly reported image-viewing limitations; their geometry/source findings were not treated as independent screenshot verification. The lead inspected rendered captures directly. No agent performed real-user interviews.

### Disagreements, errors and final decisions

| Agent suggestion/assertion | Competing evidence | Final decision and reason |
|---|---|---|
| A/B: no CTA until ~20,000px; header nav-only | Fresh first viewport visibly has hero Get in touch; phone/nav Contact Us; `ServicesSection` renders nine enquiry links | **Rejected factual claim.** Improve prominence/hierarchy, not add actions to solve a nonexistent absence |
| A: “80% stop scrolling”; inconsistent archive age | No analytics; November 2021 → September 2026 is nearly five years | **Rejected unsupported percentage.** Date is authoritative; don't manufacture behavior data |
| Several: captured zeros prove broken counters | Entry/settle tested in both motion modes: 15+, 1,200+, 12+, 5.0/5 | **Rejected bug claim.** Static numbers still recommended for calmness/instant clarity, not to fix nonexistent stuck state |
| D: retain FeaturedCase as real case and link `/cases/[slug]` | Source/runtime: generic overview; `/cases` redirects, dynamic case sample 404 | **Rejected.** Merge duplicate overview; no fake case, no invented route |
| D: put consolidated stats only within later testimonials | Hero already supports early qualified evidence; visitor needs basis before long explanations | **Prefer hero integration**, qualified and limited; no extra large strip |
| F: ten services; view all → `/online-services`; horizontal carousel option | Actual nine services; portal directory is not catalog | **Correct count/destination.** `/services`; all labels discoverable without horizontal-only interaction |
| E/G: six award photos | Full public query and rendered archive show eight; nineteen certificates | **Corrected.** Count still doesn't substantiate 12 distinct awards |
| G: money-making wording attributed to Parvez; “health” presumed typo | Public records place wording in Firoz; Sumit's original context fits health insurance | **Rejected editing inference.** No silent quote correction; avoid risky archive quote promotion |
| C/D: hidden duplicated process headings imply visible repetition/missing video | Current video exists/plays; dialog headings in DOM belong to inactive fallback | **Corrected.** Shrink large media presentation, not remove it based on a false defect |
| Keep protected motion vs shorten intro | Existing hero/footer rules require preservation; comparison is a separate scene, services are largest cost | **Conservative default chosen.** Preserve hero/statement/footer, merge comparison. Optional hero retiming requires explicit approval |
| Generic “add free consultation, credentials, WhatsApp” | Not confirmed company offers/status/channel | **Not adopted** without owner confirmation |

Recommendations were not chosen by majority vote. All critical corrections are persisted here so another agent does not reuse inaccurate review statements.

## 15. Verification status and remaining uncertainty

| Check | Result |
|---|---|
| Typecheck | Passed |
| Legacy content validator | Failed: `scripts/complete-content.mjs:11` calls `content.validateContent`, no longer exported by the types/helper module. Obsolete file-backed validation must be replaced through a separate approved task, not mistaken for corrupt Strapi content |
| Production build with local Strapi reachable | Passed; 35 static/generated entries built; no deployment performed |
| Dedicated browser crawl | 25 canonical pages × desktop/mobile, all 200, images load, no observed horizontal overflow/pageerror |
| Homepage sizes | Four widths captured; zero failed images each |
| Supplemental runtime | Working stat settlement in both motion modes; mobile service submenu visible; Escape returns focus to toggle |
| Independent follow-up interaction checks | `evidence/final-checks.json`: phases, actual video playback/controls, founder dialog + focus restoration, testimonial selection and FAQ toggle all pass at 1440/1200/810/390px. These exercise assertions skipped after the stale dialog failures; they do not turn the original suite green |
| Reduced-motion Contact follow-up | Invisibility reproduced at both 1440px and 390px widths, not only desktop |
| Existing Playwright full suite | **33 passed / 6 failed** |
| Four failures | `pages.spec.ts:56` assumes “How we work” fallback dialog despite present video; later assertions in these tests were not executed |
| One failure | `home-motion.spec.ts:23` mobile statement y≈−1,100 instead of 0; current CSS differs from protected pin expectation |
| One failure | 1200px route loop `/blog` returned 500 in parallel run; isolated full 1200px route/asset/overflow rerun passed (1 test, 32.2s). Original transient failure remains unexplained, not declared fixed |
| Delivery | Client/API paths tested with mocked transport; no real webhook delivery or business submission verified |
| Accessibility | Targeted contrast/motion/keyboard checks only; no full axe/screen-reader/real-device certification |

Trace-file inspection for initial test failure was blocked by ignored-path permissions; no bypass attempted. Preserve uncertainty around the intermittent 500 until reproducible evidence establishes cause. Clean isolated rerun, if successful, does not erase the original failure.

## 16. Decisions requiring human approval

1. Approve the eleven-block proposed structure and merging standalone Comparison/FeaturedCase presentations.
2. Approve nine-service grouped homepage presentation while preserving all service routes/content.
3. Confirm regulated professional role/current credential details before promoting advisor/planning language or badges.
4. Reconfirm client/date/rating/awards claims and approve which exact testimonial excerpts/source qualifications may be shown early.
5. Resolve mobile motion intent: existing normal-flow phone layout versus protected pinning test. Default proposal preserves current measured scene until this conflict is decided; don't silently rewrite the test.
6. Approve moving newsletter promotion lower, compact resources, optional process-video placement and replacing decorative autoplay surfaces.
7. Keep current required form fields by default; optional-field/response-promise/delivery changes require separate approval.
8. Confirm launch legal text, reachable public media origin, SITE_URL and actual webhook delivery separately; no infrastructure provisioned by this audit.
9. If investigating original ignored traces is needed, grant specific read permission; otherwise reproduce into an approved audit evidence path.

**Next action:** owner reviews [04](04-recommended-information-architecture.md) and [IMPLEMENTATION-HANDOFF](IMPLEMENTATION-HANDOFF.md), approves scope/options, then a coding agent may implement incrementally with regression tests. Until then, production code and CMS content remain untouched.
