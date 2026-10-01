# Section decision matrix

**Proposed, not approved.** Each of the 13 inventory sections has exactly one primary decision from the requested vocabulary. Secondary details do not change that primary classification. `01` contains facts; `04` specifies destinations and budgets. Desktop baseline 1440×900; mobile 390×844.

## Decision matrix

| Current position / actual section | Recommended position | Primary decision | Why / client benefit | Approx. scroll reduction D / M | Trust impact | Conversion impact | Complexity |
|---|---|---|---|---:|---|---|---|
| 01 Header | 01 Header | KEEP | Useful navigation/phone already works; returning clients retain direct access. Improve labeling/contrast only where tested. | 0 / 0 | Maintains identity/reachability | Keeps early contact path | Low |
| 02 Hero — “A personal financial advisor…” | 02 Hero + compact evidence | KEEP + REDUCE | Keep identity/locality/actions, replace newsletter prominence with qualified evidence. Shorter product explanation, no extra CTA stack. | 0 / 255px | Stronger distinction between claims and named proof | Clearer service/contact choice | Medium |
| 03 “Making goal-based financial advice accessible to all.” (+ timeline spacer) | 03 Same protected statement scene | KEEP | Preserve mandated pin/reversal and shared wrapper. It has low incremental information value, but removing it is not assumed approved. | 0 / 0 | Neutral | Neutral; known scroll tradeoff | Low if untouched |
| 04 “From scattered decisions to one coordinated plan.” | 06 Founder / why clients choose Ghanchi | MERGE | Keep useful coordinated-service benefit as two concise points, not a 3.62-screen comparison. | 3,258 / 1,387px standalone allocation removed; content accommodated in 06 budget | Less unsupported before/after certainty | Reaches actual services sooner | Medium–high: separate from protected hero mechanics |
| 05 “Services.” | 04 Services selector | KEEP + REDUCE | All nine categories remain visible and linked, grouped by visitor need; full details stay on service pages. Remove homepage chart/images/deliverables repetition. | 5,306 / 7,896px | Maintains breadth without pretending illustrations are proof | Fast relevant choice, valid preselected enquiry links | Medium |
| 06 “Your goals come first. The plan follows.” | 07 How working together works | KEEP + MOVE DOWN | Proof/person before mechanics; compact four steps plus ongoing support; optional real video disclosure. | 1,457 / 978px through compact treatment | Confirms support after credibility established | Explains commitment before form | Medium |
| 07 “Meet your advisor. A personal partnership.” | 06 Founder / why / recognition | KEEP + MOVE UP | Named person and actual experience surface earlier; absorb audience fit and coordinated-benefit copy. | 292 / −90px (mobile allowance expands to accommodate merged content) | High improvement | A human contact, not anonymous company assertions | Medium |
| 08 “Testimonials” (+ stats/founder callout) | 05 Compact named client proof; important stats to 02 | KEEP + MOVE UP | One or two approved exact excerpts plus archive link; remove repeated background/rating/stat/callout canvases. | 1,552 / 1,951px | High improvement if source/permissions qualified | Proof follows service relevance | Medium |
| 09 “A personal approach, for clients in India and abroad.” | Absorbed into 02 / 05 / 06 | MERGE | Audience fit retained; repeated stats, Neeta quote and nine-service list not repeated. Not a case study. | 843 / 1,215px standalone allocation removed | No unique verified evidence lost | Less repetition before decision | Low–medium |
| 10 “FAQ” | 08 Selected decision questions | KEEP + REDUCE | Put 4–5 useful objections in one compact list; preserve remaining answers in dedicated destinations. No fake policy/fee answers. | 238 / 89px | Preserves risk/claims honesty | Resolves final uncertainty | Medium: accessible state/SEO destinations |
| 11 “Knowledge for your next chapter.” | 09 Compact resources, including newsletter archive | KEEP + REDUCE | Keep two dated article links, add archive link; no large homepage covers. | 329 / 788px | Keeps education without suggesting current news | Secondary path doesn't dominate contact | Low–medium |
| 12 “Let’s plan your next chapter.” | 10 Contact | KEEP + REDUCE | Keep functional form and useful benefits; calmer static backdrop and no repeated statistics. No required-field/API changes by default. | 66 / 130px | Easier reading, honest consent and expectations | Retains inline enquiry, lower visual effort | Medium |
| 13 Footer | 11 Footer | KEEP + REDUCE | Keep address, phone/email, disclosure, links, newsletter, protected wordmark/hover; shorten repeated mission prose. | 99 / 73px | Maintains physical-business verification | Keeps utility, avoids competing pitch | Low–medium |

Reduction entries are rough attribution, **not independent estimates to sum without rounding/merged-content adjustments**. Header is non-additive. Exact budget arithmetic in 04 is authoritative. No standalone section receives REMOVE because the two redundant ones retain useful content through MERGE; specific child elements can still be removed from homepage rendering after approval. No database records/assets/routes are proposed for deletion.

## Child-element decisions

| Child element | Treatment | Destination / safety |
|---|---|---|
| Hero November 2021 newsletter card | Move downward; lose large card treatment | Compact resources link → `/newsletters`; retain all original issue records/dates |
| Hero historical rating | Conditional retain, not unqualified promotion | Prefer verified founder/source evidence; keep historic qualifier if rating remains |
| Geography ticker | Static short line recommended | Keep India/UAE/USA only, without service-eligibility inference |
| PlanningChart | Remove homepage rendering | Concepts already in process; no data erased |
| Nine service photos/quote overlays/deliverable chips | Remove from compact homepage presentation | Detail pages and original assets retained |
| 01–09 service numbering | Remove homepage decoration | No numerical trust value |
| Large process video frame | Collapse from default flow | Keep actual video accessible on demand or About; preserve controls and provide appropriate text alternative |
| Recognition panel | Merge into founder block | Links to BOTH `/about-us/awards` and `/about-us/certificates`; actual image preview only after description review |
| Four-stat grid | Consolidate | At most two verified/non-conflicting facts near hero; no count-up required |
| Founder CTA under testimonials | Merge | Founder block and contact remain; no second founder pitch |
| Repeated quote and service list in FeaturedCase | Remove duplicate rendering | Same quote remains with real identity/source; every service link exists in selector |
| Testimonial/contact decorative video backgrounds | Replace with static surface in proposed layout | Keep media files; never remove real client records |
| Footer wordmark / layered hover | Keep | Protected brand behavior; not a scroll-reduction casualty |

## Content density scorecard

Scores are expert judgments, **not analytics, usability-test outcomes or conversion predictions**. 1 = low, 5 = high. Visual density measures simultaneous competing elements, not height. Trust = potential contribution of honest evidence; relevance = incremental usefulness at its current position.

| # / section | Visual density | Text density | Cognitive load | Trust contribution | Conversion contribution | Client relevance |
|---|---:|---:|---:|---:|---:|---:|
| 01 Header | 3 | 2 | 2 | 3 | 5 | 5 |
| 02 Hero | 4 | 3 | 3 | 4 | 5 | 5 |
| 03 Statement / spacer | 1 | 1 | 1 | 1 | 1 | 2 |
| 04 Comparison | 3 | 3 | 3 | 2 | 2 | 3 |
| 05 Services | 4 | 5 | 5 | 3 | 5 | 5 |
| 06 Process | 4 | 3 | 4 | 3 | 3 | 4 |
| 07 Founder / recognition | 2 | 2 | 2 | 5 | 3 | 5 |
| 08 Testimonials / stats / founder CTA | 5 | 5 | 4 | 5 | 4 | 4 |
| 09 FeaturedCase overview | 4 | 4 | 4 | 3 | 2 | 2 |
| 10 FAQ | 3 | 3 | 3 | 4 | 4 | 5 |
| 11 Insights | 3 | 2 | 2 | 3 | 2 | 3 |
| 12 Contact | 5 | 4 | 4 | 4 | 5 | 5 |
| 13 Footer | 4 | 3 | 3 | 4 | 3 | 4 |

**High density + low incremental value:** FeaturedCase; repetition within Services once the relevant category is found; extra ratings/stats/founder callout within Testimonials. These deserve consolidation. Contact has high density AND high relevance: simplify its visual surroundings, not its consent/validation indiscriminately. The statement is low density but high scroll cost: it is a separate, explicitly protected tradeoff.

## Trust and numerical-claim classification

| Number / claim | Class | Actual source and interpretation | Placement decision / verification requirement |
|---|---|---|---|
| Since 2009 | Trust number | Current hero, FeaturedCase and About; company-reported founding/service date | Retain once prominently if owner confirms; not a registration date |
| 15+ years | Trust number | Site settings + contact-page stats | Compatible lower-bound with 2009, but don't silently calculate/update to 17+. Prefer “since 2009” over duplicate counters |
| 1,200+ clients | Trust number | Hero/site/contact metadata and stats | Eligible early only with owner confirmation of definition and as-of date; not “families” or “policies” |
| 12+ awards | Marketing/trust claim lacking itemized substantiation | Site settings; eight award photos + nineteen certificate scans do not prove twelve distinct awards | Do not promote numeric count before reconciliation; link genuine archive instead |
| 5.0/5 | Historical trust number | Site setting says “Reported on our existing website. Not a live Google feed.” | Not independently checked/current Google proof; no review-count claim supported |
| India, UAE, USA | Audience footprint | Three named client locations; not a count of licensed markets | May retain as geography of clients, not cross-border authorization |
| Testimonial “last 4 years”, “6 yrs” | Historical personal statements | Original undated/archived client text | Never roll forward to current durations or treat as performance statistics |
| 01–09 services; 01–04 phases | Decorative/organizational | UI ordering only | Omit redundant numbering; phase numbering can remain if helpful |
| 100% / 67.6% chart width | Decorative | Hardcoded relative widths in `PlanningChart`, not rendered return claims | Remove chart; never present as return/productivity uplift |
| Newsletter 2021/2020; article March 2021 | Dates, not marketing claims | Dated archive; latest issue November 2021, two unavailable links | Keep dates honest, move away from “freshness” prominence |
| Address/postcode, phone, office hours | Operational numbers | Public settings/contact content | Retain and owner-verify reachability; not “scale” statistics |
| AUM, policies sold, assets/business value, verified current review count, branch count | Absent | No reliable claim established in this audit | **Do not fabricate a statistic. Use another trust mechanism.** |

Numerical claims found in third-party competitor research are never transferred to Ghanchi. Registration/credential numbers visible in historical scans need owner/current-register confirmation before transcription or use as current status.
