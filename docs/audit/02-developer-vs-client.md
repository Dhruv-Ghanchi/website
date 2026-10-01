# Developer value versus client value

Status: **audit recommendations, not implementation approval**. Read the factual inventory in [01](01-homepage-scroll-map.md) first. Evidence: fresh rendered screenshots/geometry, current components, public Strapi snapshot, supplemental runtime checks. “Developer value” means demonstrable implementation/design-system value, not a claim about the original developer's motives.

## Evaluation rule

Ask: **Does a first-time visitor need this information at this point to identify relevant help, judge trust or take an informed next step?** High technical complexity is neither a reason to keep nor remove something. Distinguish new information from repetitions of true information. Keep dedicated-page detail where it matches intent.

| Existing element | Developer / presentation value | Client value now | Recommendation and evidence |
|---|---|---|---|
| Working header dropdowns, keyboard handling, phone link | High | High | KEEP. They provide actual wayfinding/action; do not replace with a new nav system. `site-shell.tsx:15-88`. |
| Real logo, real founder image/name | Medium | High | KEEP/promote identity. Avoid substituting attractive stock/AI people for the actual founder. |
| Hero pin/zoom/blur/reversal | High | Medium | KEEP protected behavior in baseline proposal. Reduce competing copy/card first; no assumption that animation itself is useless. |
| Large mission statement + desktop timeline spacer | High | Low incremental | KEEP in conservative scope because protected; do not call spacer empty accidental whitespace. Optional timing reduction is a separate owner decision. 1,800px desktop cost. |
| Three-screen Before/After choreography | High | Medium message, low additional proof | MERGE its strongest two client benefits into founder/why-us block; remove standalone choreography only after approval. 3,258px desktop for assertions already explained by services/process. |
| PlanningChart's relative bar lengths | High | Low | REMOVE homepage chart, retain plain process concepts. Values 100%/67.6% are illustrative, not measured; financial visitors should not decode graph-like imagery to learn what services exist. |
| Nine full service cards | High | High category discovery; low need for nine full explanations | KEEP categories, reduce to grouped linked rows. Detailed paragraphs/deliverables remain on all nine service routes. Homepage is a selector, not nine service pages stitched together. |
| Every service's numbered badge | Medium | Low | Drop numbering from homepage selector unless needed for orientation. 01–09 is sequence, not company scale. |
| Service icon | Medium | Medium | Retain one restrained icon per group if useful; avoid redundant tag + icon + number + five chips for every option. |
| Service images taking 400px each on mobile | High | Medium for first example; low repeated utility | Remove homepage image repetition, not original files. Keep service-specific illustrations on detail pages; preserve accurate alt text. |
| Testimonials overlaying service images | High | Medium; interrupts comparison | Centralize named proof. Don't retain quote overlays on every compact service item just to preserve card sophistication. Current service testimonials are already varied, not all one person. |
| Phase accordion, Understand/Assess/Plan/Review | High | High | KEEP + condense. Make steps easy to compare and access by touch/keyboard; preserve useful progressive disclosure. |
| Actual “How we work” video | High | Unknown until content/transcript review | Keep accessible as an optional inline disclosure/link, not a 743px default homepage frame. It plays successfully now; “video unavailable” is not a current finding. Do not delete media. |
| Hidden fallback process dialog | Medium | Medium resilience | Keep conditional fallback unless video relocation removes its caller. Hidden dialog headings are not visible duplicate content. |
| Online access / Annual review / Personal service | Medium | High | KEEP, merge with process/why-us explanation. These explain ongoing help more concretely than “personal partnership”. |
| Founder modal behind plus icon | Medium | High information, medium discoverability | Show name, role and two useful sentences without opening modal; keep full biography in About. Native dialog functionality can remain for deeper detail. |
| “Recognition. Built on service.” large homepage panel | Medium | Medium; link rather than proof | Compact link/caption beside founder; promote one archive item only after accurate issuer/date/meaning are confirmed. No need for a new logo ticker of supposed partners. |
| Four animated statistics | High | High if substantiated | Consolidate important facts near hero; static values preferable. Normal/reduced-motion counts settle correctly; don't invent a broken-counter bug. |
| Testimonials' looping family background | High | Low evidential value | Replace backdrop with a calm static surface in proposed compact proof. Family imagery is illustrative, not a real client's portrait. Video autoplays under reduced motion. |
| Real quotes and full testimonial archive | Medium | High | KEEP original records, names, qualifiers and source URLs. Use one or two approved exact excerpts on home, full context at `/about-us/testimonials`. |
| `FeaturedCase` overview | High reuse value | Low incremental | MERGE audience fit into founder/proof; remove standalone rendering. It repeats counts, services, dates and Neeta's quote; it is not a genuine case study. |
| FAQ tablist + accordions | High | High answers, medium tab complexity | KEEP + reduce homepage selection. Preserve all eleven answers in appropriate indexable destinations, with accessible controls. |
| Large 2021 education cards | Medium | Medium | Convert to compact resources rows below decision content. Archives remain useful; recency is not implied. |
| November 2021 “Latest Newsletter” hero card | Medium | Low above fold | MOVE to compact resources/footer archive link. Do not fabricate a newer issue or erase original dates. |
| Contact form validation, consent, service preselection | High | High | KEEP. Don't reduce fields casually without validating backend, response workflow and consent; first simplify surrounding presentation. |
| Animated glass-shard form background | High | Low | Prefer static surface for readability; visible fields are the value. Decorative autoplay is independent of business functionality. |
| Contact stats and founder CTA repeated after proof | Low | Low incremental | Consolidate facts; keep a contextual invitation, not a second proof stack. |
| Large footer wordmark + layered hover | High | Medium brand closure | KEEP protected wordmark/hover. Reduce adjacent repeated mission prose rather than erasing distinctive branding. |
| Footer address, phone/email, disclosures, portals | Medium | High | KEEP prominent and functional. These substantiate reachability. |
| “Not a live Google feed” / draft legal notes | Low polish value | High honesty | Rewrite jargon into short clear qualification; never conceal uncertainty to look more credible. Draft legal text must remain identified until approved. |

## Information dumping versus simply being long

- **Highest information density:** Services (nine repeated decision structures), Testimonials (long feature + three quotes + rating + four stats + founder CTA), FeaturedCase (multiple already-seen proof types), Contact (six required commitments and nine service options).
- **Highest scroll cost without much information:** Comparison's pinned scene; statement/timeline; oversized process media. Their problem is delay, not paragraph length.
- **Useful density:** navigation, financial risk/consent disclosures, and service-page detail. Do not reduce these to hit a screenshot target.
- **Strong asset:** much service copy already uses client language (“Protection for the people who depend on you”). Retain that rather than rewriting every heading.

## Content strategy, without a wholesale rewrite

| Current pattern | Needed change | Proposed direction, not approved final copy |
|---|---|---|
| Hero “personal financial advisor” plus plan/protect/invest | Clarify products and verify professional capacity | One plain line naming insurance and mutual funds; retain Navi Mumbai. Owner/compliance must approve regulated role wording first. |
| Repeated “personal”, “your goals”, “your next chapter” | Reduce repetition | One promise at the start; later sections answer concrete questions: relevant service, responsible person, ongoing help, next step. |
| Nine service paragraphs plus deliverables | Shorten only homepage version | Service name + one short benefit + detail link. Don't overwrite shared Strapi `longDesc` just to compress home. |
| Before/After four promises each | Remove absolute certainty and fear cues | Two defensible benefits: considering protection and investments together; revisiting plans as needs change. No claim that every goal is achieved. |
| “Google rating on existing site” | Clear qualifier / verification decision | Prefer a named testimonial until source/date/review-count are verified. If rating retained: explicitly historical/site-reported, never imply a live review feed. |
| “View All” | Describe destination | “Read financial articles” or equivalent; link `/blog`. |
| “Our process video is not connected yet” fallback | Avoid developer jargon if fallback used later | Explain that a written overview is available; do not claim current video is missing. |
| Newsletter unavailable link copy “malformed” | Client language | “This edition is currently unavailable. Contact us for a copy.” Only promise a copy if staff can supply one. |
| Contact request | Set expectations honestly | State how enquiry is handled only after business confirmation; do not add “free”, guaranteed response times or appointments if unverified. |

## Why we do not follow all agency suggestions

Independent reviews are useful for proposing hypotheses, not establishing facts. Lead verified: nine services (not ten), eleven testimonials, eight award photos (not six), real process video, working early CTAs and correctly settling counters. The default motion architecture remains protected. Detailed disagreements and corrections are recorded in `FINAL-AUDIT.md`; these tables contain the reconciled recommendation.
