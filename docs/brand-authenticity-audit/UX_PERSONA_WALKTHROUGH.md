# UX Persona Walkthrough — Brand Authenticity (Ghanchi Investments)

Method: `docs/agency-audit/roster/design-persona-walkthrough.md` (Persona Walkthrough Specialist — two-voice cognitive walkthrough). This pass is **narrower than a full LIFT/Cialdini/Fogg conversion audit** — it asks one question per fold, in two directions: *what makes this feel specifically like Ghanchi Investments*, and *what makes this feel like a generic template site*. It does not repeat the conversion-focused findings already on record in `docs/agency-audit/UX_WALKTHROUGH.md`.

**Honest boundary, stated up front per the persona's own methodology rule: this is qualitative simulation, not statistical evidence.** Six fictional personas, run by one analyst, against one page. Findings are hypotheses about what a category of visitor might notice, grounded in the actual rendered content — not proof of what any real person thinks. Where a finding depends on a persona's fictional prior knowledge (Personas 4 and 5 especially), it is explicitly flagged as speculation about a hypothetical person's reaction, separate from the underlying site fact, which is cited.

**Evidence base:** live local site at `http://localhost:3100`, screenshots and extracted text captured in `docs/brand-authenticity-audit/evidence/` (`EVIDENCE.md`, `evidence/evidence-data.json`, `evidence/screenshots/ghanchi/*.png`, `evidence/screenshots/kora/*.png`), and verified business facts from `docs/CURRENT_IMPLEMENTATION_PLAN.md` §4. Every claim below cites one of these. Five recurring folds are used per persona: **Hero → Services → Team/Founder → Testimonials → Footer.**

---

## Persona 1 — First-time Indian investor, no prior context

**Profile:** Priya, 34, searched "financial planning India" on Google, lands on the homepage cold. No comparison frame from Kora (she's never seen it) — her comparison frame is whatever else showed up in her search results (likely a mix of large-brand advisory sites, aggregators like Policybazaar/ClearTax, and other small local-advisor sites).

### Hero (`evidence/screenshots/ghanchi/home-fold0.png`)
> **Priya:** "OK — 'Your trusted partner for financial planning and protection,' 'Ghanchi Investments helps families plan, protect, and invest with confidence.' Fine, generic but fine. 1,200+ clients, 5.0 rating, India · UAE · USA — so they're not tiny, and they've got NRI clients too, that's a good sign for trust. The flower photo is pretty but I have literally no idea why it's there. Doesn't feel Indian, doesn't feel financial, could be a spa."

**Analyst — brand-authenticity read:** What's specifically Ghanchi here: the company name appears twice in the first fold (H1 context + subhead), and the India · UAE · USA marquee is a real, verified claim (`CURRENT_IMPLEMENTATION_PLAN.md` §4: "Client geography: India, UAE, USA"), not decoration. What reads generic: the headline is a near word-for-word swap of Kora's own template sentence — "Your **growth** partner for **companies ready to scale**" → "Your **trusted** partner for **financial planning and protection**" (`EVIDENCE.md` item 1) — and the hero photograph is Kora's own unedited stock tulip macro, identical pixel-for-pixel to `evidence/screenshots/kora/home-fold0.png`. Priya has no way to know this is a reused template, but the *effect* she names unprompted — "doesn't feel Indian, doesn't feel financial" — is exactly what an unbranded stock photo with no connection to India or finance produces.

### Services (`evidence-data.json → ghanchi.bodyText`, services block)
> **Priya:** "Nine services, that's thorough — Financial Planning, Life Insurance, Health Insurance... Child Education... OK this actually covers what I'd search for individually. Each card has a quote at the bottom from 'Chandrakant B. Ghanchi, Founder & Financial Planner' — same guy, every single card. That's either really personal or really repetitive, not sure which yet."

**Analyst:** Specifically Ghanchi: attaching one named, real individual's attribution to all 9 service cards is unusual for this kind of template — Kora's five service cards each end in a *different* named client testimonial (James Martin/CEO Hamilton, Sarah Bouchard/Lightspeed, etc. — `evidence-data.json → kora.bodyText`), while Ghanchi's cards all quote the same advisor restating his own preceding sentence. This is a structural tell that this is a one-person practice, which is true and specific. Generic: the quote text is not a testimonial or proof point at all — it's a repeated restatement of the paragraph directly above it ("Health insurance can help manage eligible medical expenses" → quote: "Health insurance can help manage eligible medical expenses.") on every one of the 9 cards. The Kora slot this fills (a named client outcome) is present in shape but empty of the specific content that made Kora's version work.

### Team / Founder (`evidence/screenshots/ghanchi/home-fold9.png`, `evidence-data.json → ghanchi.teamRows`)
> **Priya:** "'Meet your advisor. A personal partnership.' — one card, one person, '01'. Where's 02 through 06? Feels like the page expected a team and only got one guy."

**Analyst:** Specifically Ghanchi: a real name (Chandrakant B. Ghanchi) and real title (Founder & Financial Planner), not an invented executive roster — this is honest, since the business genuinely is a single founder (`CURRENT_IMPLEMENTATION_PLAN.md` §4). Generic/template-tell: the "01" numbering and card shape are inherited directly from Kora's 6-person team grid (`Koraline Spencer / Founder & CEO / 01`, `Priya Sharma / Head of Growth Strategy / 02` ... through `06` — `evidence-data.json → kora.bodyText`), with 5 of 6 slots simply never filled. Priya's own unprompted read — "expected a team and only got one guy" — is the visitor-facing symptom of that leftover numbering.

### Testimonials (`evidence-data.json → ghanchi.testimonialFeature`)
> **Priya:** "Neeta Agrawal, Syntel — 'Reported on our existing website. Not a live Google feed.' Huh, that's oddly honest for a company to admit. I kind of trust that more, weirdly."

**Analyst:** Specifically Ghanchi: the named individuals with specific, plausible Indian employer affiliations (Syntel, L&T Infotech, TCS, Oberoi Realty) and the explicit self-disclosure that this is archived, not live, content (`"Reported on our existing website. Not a live Google feed."`) — no generic template would include a disclaimer admitting its own social proof isn't live. Generic: the visual container (quote + initials avatar + name + company + star rating) is the identical pattern Kora uses for its testimonials section.

### Footer (`evidence/screenshots/ghanchi/inner_contact-us.png`, bottom)
> **Priya:** "Real address — Shop no. 27, Sector 11, CBD Belapur, Navi Mumbai. Two phone numbers, two emails. That's a real, findable place. Then there's this giant lowercase 'ghanchi' wordmark across the whole bottom of the page — that's a weird flex for a one-person advisory, feels borrowed from somewhere bigger."

**Analyst:** Specifically Ghanchi: the full, real, specific street address and both real phone numbers (verified in `CURRENT_IMPLEMENTATION_PLAN.md` §4) are present in every footer captured. Generic/template-tell: the oversized lowercase wordmark treatment at the very bottom of the page is a direct visual quote of Kora's own footer ("kora" rendered huge, `evidence-data.json → kora.bodyText` ends the same way) — the device itself, not just the content inside it, is unmistakably borrowed.

### Persona 1 summary
**Feels Ghanchi:** real address/phone/email, real named client testimonials with real-sounding employers, honest "not live" data disclosures, single real founder attribution repeated across services. **Feels generic:** the headline template, the stock hero photo, the empty team-grid slots, the footer wordmark stunt, the repeated non-testimonial "quotes" on service cards. Priya's net read: she'd trust the *facts* on the page more than the *voice* of the page — the voice reads borrowed, the facts don't.

---

## Persona 2 — Parent researching child/education financial planning

**Profile:** Meena, 41, two kids (ages 9 and 14), searching specifically for help planning for their education costs — possibly study-abroad costs given one is nearing college age. Urgency: months, not days. Primary fear: not saving enough, starting too late.

### Hero
> **Meena:** "'Helps families plan, protect, and invest' — OK, 'families' is doing some work here, feels aimed at me broadly. Doesn't mention kids or education specifically though."

**Analyst:** Family-oriented framing in the subhead is real and not accidental — but it's generic-family, not parent-of-school-age-kids specific. Nothing here differentiates Ghanchi from any advisory that also says "helps families."

### Services — Child Education Planning card (`evidence-data.json → ghanchi.bodyText`, service 06)
> **Meena:** "'Give their ambitions a financial plan' — that's a nice line, actually. 'Prepare for your child's future education needs with a goal-based approach that considers the time available, expected costs and your family's finances.' OK but... what costs? Studying in India vs. abroad is a completely different number. There's nothing here about that. It's the same five bullets as every other service card: goals, time horizon, cash-flow, solutions, review."

**Analyst:** Specifically Ghanchi: the headline phrase itself ("Give their ambitions a financial plan") is not lifted verbatim from Kora and reads like real original copywriting for this one service — a genuine bright spot. Generic: the supporting structure ("What we discuss": Education goals / Time horizon / Cash-flow planning / Suitable solutions / Progress review) is the identical 5-bullet template used on all 9 service cards, just with the nouns swapped — Retirement Planning's bullets are "Retirement goals / Future expense planning / Income needs / Available investment options / Annual review," structurally identical. For a parent persona specifically anxious about a fast-approaching, expensive, India-specific decision (school fees inflation, study-abroad costs), nothing on the page engages that anxiety more specifically than any other service would.

### Team / Founder
> **Meena:** "Same single advisor card as before. No 'here's how I've helped other parents plan for their kids' — I'd want to see that specifically, not just 'goal-based planning' again."

**Analyst:** No content gap unique to this persona beyond what's already noted — the single-founder section is identical regardless of entry point.

### Testimonials
> **Meena:** "Scanning for anyone who mentions kids, school, college... Manju Rajvanshi talks about LIC and mediclaim. Sumit Jain calls him 'family' but that's about health insurance. None of these are actually about planning for a kid's education specifically."

**Analyst — evidence-based, not speculative:** This is directly checkable against the extracted testimonial text (`evidence-data.json → ghanchi.page_about-us_testimonials`, 11 full testimonials). None of the 11 testimonials' content centers on child/education planning specifically — the visible themes are LIC/mediclaim knowledge, general "trustworthy family-like advisor" language, and general investment guidance. For a visitor whose specific need is child education planning, there is no anchor testimonial matched to that need, even though Child Education Planning is one of the 9 named services and even has its own dedicated blog article reference elsewhere on the site ("Indian Parents' Dreams... Child Education Planning" is listed among the 25 legacy article slugs in `CURRENT_IMPLEMENTATION_PLAN.md` §11, but is not one of the 2 currently republished articles).

### Footer
Same real contact block as Persona 1 — no persona-specific difference.

### Persona 2 summary
**Feels Ghanchi:** the one genuinely original service headline ("Give their ambitions a financial plan"), the real contact facts. **Feels generic:** the identical 5-bullet template across all 9 services means the *specific* anxiety a parent brings (timing, cost magnitude, India-vs-abroad) is never engaged; no testimonial anchors to this exact need even though real testimonials exist for other needs (LIC, mediclaim, general investing).

---

## Persona 3 — Insurance shopper (life/health)

**Profile:** Rohan, 42, comparing life and health insurance options for himself and an aging parent. Wants concrete, India-specific reassurance — waiting periods, pre-existing conditions, claim experience.

### Hero
Same as Persona 1 — no insurance-specific signal above the fold; "protection" appears in the H1 but generically.

### Services — Life Insurance & Health Insurance detail pages
> **Rohan (Life Insurance, `evidence/screenshots/ghanchi/inner_services_life-insurance.png`):** "Wait — that photo. A dad carrying his daughter on his shoulders, looks like some kind of outdoor Indian festival, everyone in the background too. That's the first thing on this whole site that actually looks like it was taken *here*, not stock-library anywhere."
>
> **Rohan (Health Insurance, home fold — `evidence/screenshots/ghanchi/home-fold9.png`):** "And this one — a mother in a saree, her daughter, and what looks like a doctor going over paperwork together. That's... that's literally the scenario I'm in. Planning health cover for my mother."

**Analyst:** This is the single strongest brand-authenticity signal found anywhere in this walkthrough. Both the Life Insurance hero image and the Health Insurance service-card image are specific, contextually Indian, family-scenario photography that directly matches the service they illustrate — a sharp, positive exception to the otherwise generic/stock visual language elsewhere on the site (compare to the hero tulip, identical to Kora's own stock). Whether these were newly sourced/generated specifically for Ghanchi or licensed stock chosen with real care, the *effect* on this persona is real and specific: "looks like it was taken here."

> **Rohan (Retirement Planning, `evidence/screenshots/ghanchi/home-fold11.png`):** "...and then this one's just a hand tapping a Visa card on a payment terminal. Nothing about retirement, nothing about India, could be a random Shutterstock result for 'payment.' Kind of undercuts the two photos before it."

**Analyst:** A real, observed inconsistency: the photography quality/specificity is not uniform across services. Two folds earn strong authenticity credit; the very next one (Retirement Planning) reverts to generic, geographically unplaceable stock. A persona scrolling straight through experiences this as a quality dip, not a deliberate choice.

### Team / Founder
No insurance-specific difference from Persona 1's read.

### Testimonials
> **Rohan:** "Multiple testimonials specifically about LIC and mediclaim knowledge — Manju Rajvanshi, Ashu Rajvanshi both call out 'LIC and mediclaim' by name. That's specific enough that I believe it, that's not something you'd invent for a demo site."

**Analyst:** Evidence-based: two of the 11 testimonials (`evidence-data.json → ghanchi.page_about-us_testimonials`) independently and specifically praise "excellent knowledge of LIC and mediclaim" — LIC (Life Insurance Corporation of India) and "mediclaim" (a specifically Indian colloquial term for health/medical insurance) are precise, non-generic, India-specific terms that a generic template would not surface. This is a genuine brand-specific signal directly relevant to this persona's search intent.

### Footer
Same as Persona 1.

### Persona 3 summary
**Feels Ghanchi:** the Life/Health Insurance photography (the strongest authenticity signal on the entire site), the LIC/mediclaim-specific testimonial language. **Feels generic:** the immediately-following Retirement Planning photo breaks the pattern with placeless stock; the underlying service-card copy structure is identical template regardless of which insurance product is being described.

---

## Persona 4 — Existing Ghanchi client, checking the new site

**Profile:** Arjun, 58, has been Chandrakant's client for over a decade, knows him personally, has physically visited the CBD Belapur shop, is checking the new website mostly out of curiosity/loyalty rather than to be sold anything.

**Methodological note for this persona specifically:** Arjun's reactions below are explicitly split into two categories — (a) direct comparisons between the site and *verified facts* from `CURRENT_IMPLEMENTATION_PLAN.md` §4 (not speculation), and (b) inferred hypotheses about how a real long-term client *might* react, clearly labelled as such, since no real client feedback was collected for this audit.

### Hero, Services
> **Arjun (fact-check, not speculation):** "1,200+ clients, 15+ years — matches what I'd expect, I know he's been at this since 2009. The India · UAE · USA bit is right too, I know he has clients abroad."

**Analyst:** These are directly verifiable against `CURRENT_IMPLEMENTATION_PLAN.md` §4 ("founded/established 2009," "1,200+ clients... 15+ years experience," "Client geography: India, UAE, USA") — the site's stats are not embellishment relative to the owner-approved facts on record. This is a fact-check, not a guess about Arjun's reaction.

### Team / Founder
> **Arjun (hypothesis, flagged):** "*If* a real client like me looked at 'Meet your advisor. A personal partnership' with just the one card, my guess is it would land fine — that's literally accurate, he is one guy, that's exactly why people like him. I wouldn't read the empty 02–06 slots as a problem the way a first-time visitor might, because I already know there's no missing team to find."

**Analyst:** This is explicitly a hypothesis about how prior knowledge would reframe a UI artifact (the Kora leftover numbering) from "looks incomplete" (Persona 1's read) to "accurately small" (a plausible existing-client read) — not a fact, since no real client was interviewed. Flagged as such.

### Testimonials
> **Arjun (fact-adjacent, testimonial language matches known relationship style):** "'Chandrakant is not an agent for me... but as a FAMILY member' — that phrasing, the all-caps FAMILY, the slightly unpolished English — that reads like something a real person actually wrote and someone pasted in as-is rather than a copywriter smoothing it into marketing voice."

**Analyst:** This is a defensible textual observation, not pure invention: the testimonial text (`evidence-data.json → ghanchi.page_about-us_testimonials`) does contain unpolished, colloquial phrasing across multiple entries ("Once you are with Ghanch investments, rest assured..." — note the misspelling of "Ghanchi" as "Ghanch" left uncorrected) that a fabricated or professionally-ghostwritten testimonial bank typically would not contain. Whether a specific real client would find this reassuring or embarrassing is genuinely unknowable without asking one — stated as a hypothesis, not fact.

### What the site fails to reflect that a real client would know (evidence-based gaps, not speculation)
- **No WhatsApp contact option anywhere in the captured evidence**, despite the old WordPress site having had a WhatsApp click-to-chat widget as part of its live functional stack (`CURRENT_IMPLEMENTATION_PLAN.md` §10a: "a WhatsApp click-to-chat widget were the live functional stack... has no equivalent in the current `ghanchi-investments` implementation"). A client used to reaching Chandrakant informally would find this specific, real channel gap — this is a documented implementation fact, not a guess about Arjun.
- **No photo of the actual CBD Belapur shop** appears anywhere in the captured screenshots — the office-context photography used across the services grid (glass-walled modern office interiors, a woman in a green blouse reviewing documents at what reads as a corporate office — `evidence/screenshots/ghanchi/home-fold10.png`) is generic, unplaceable stock, not the real small shop at Shop no. 27, Sector 11, Balaji Bhavan. Whether a real client would consciously notice or mind this is a hypothesis; that the imagery doesn't depict the real location is an observable fact from the evidence captured.

### Persona 4 summary
**Feels Ghanchi (fact-based):** the stats match verified business facts; testimonial language is unusually unpolished/authentic for marketing copy, including a client-submitted spelling error left uncorrected. **Feels generic / documented gap:** no WhatsApp channel despite it being part of the real historical business; office photography depicts a generic corporate interior, not the real shop. **Speculative only (flagged):** whether the single-founder framing reads as "appropriately small" vs. "incomplete-looking" to an existing client is a hypothesis, not a finding.

---

## Persona 5 — Knows the Ghanchi family/business personally (neighbor, relative's friend)

**Profile:** Kavita, 50, lives in the same CBD Belapur neighborhood, has known the Ghanchi family for years, has never been a client herself but knows Chandrakant socially as "the LIC agent down the road," is looking at the site because a relative mentioned it.

**Methodological note:** as with Persona 4, real-world-knowledge reactions are marked as hypotheses; only claims checkable against the extracted evidence or verified facts doc are stated as fact.

### Hero, Services
> **Kavita (hypothesis, flagged):** "'Financial planning and protection' — my guess is that's not how I'd describe him to someone. I'd say 'he does LIC and insurance and mediclaim stuff.' This reads more like... a bigger company than the guy I know."

**Analyst — the underlying evidence supporting this hypothesis is real, even though Kavita's specific reaction is speculative:** the site's *positioning* foregrounds "Financial Planning" as service 01 of 9, with insurance as several of the remaining 8 — a broad, multi-service-advisory framing. But the site's own testimonial evidence repeatedly and specifically centers LIC and mediclaim knowledge (`evidence-data.json → ghanchi.page_about-us_testimonials`: at least 3 of 11 testimonials specifically praise LIC/mediclaim/insurance expertise by name, more than any other single theme), and the verified online-service portal list includes LIC-specific tools ("LIC Registered User, LIC Pay Premium Direct" — `CURRENT_IMPLEMENTATION_PLAN.md` §4). There is a real, evidence-supported tension between how the site *frames* the business (broad financial-planning consultancy, matching Kora's original growth-consultancy positioning) and what the *underlying testimonial evidence on the same site* suggests clients actually valued him for (LIC/insurance specifically). Whether a specific neighbor would consciously voice this as "feels bigger than the guy I know" is speculation; the framing/evidence tension itself is not.

### Team / Founder, Testimonials
> **Kavita (hypothesis, flagged):** "The awards page — 'Awards archive — photograph 1, photograph 2...' I think I remember him getting an MDRT award, some LIC recognition thing. If I already know that, seeing it captioned as just 'photograph 3' feels like a missed chance to say the actual thing out loud."

**Analyst:** The underlying fact is directly evidence-based (`evidence-data.json → ghanchi.page_about-us_awards`: all 8 award images captioned only "Awards archive — photograph N," no issuer/date/award name) and independently corroborated by `CURRENT_IMPLEMENTATION_PLAN.md` §10a, which confirms the real trophy photograph is engraved "CHANDRAKANT GHANCHI" and that the source WordPress site's Awards page itself had no distinct award body copy to migrate — meaning the generic captions are a real, acknowledged content gap (not an invented one), and a neighbor with independent knowledge of which award is which would be the one visitor most likely to notice the gap between what's shown and what's known.

### Footer
No difference from other personas.

### Persona 5 summary
**Feels Ghanchi:** the LIC/mediclaim-heavy testimonial evidence is real and specific, even if the page's framing doesn't lead with it. **Feels generic / documented gap:** broad "financial planning" positioning sits in real tension with the LIC-specific reality visible elsewhere on the same site; award captions are generically archival rather than named, a gap independently confirmed by the source-content audit, not invented for this persona. **Speculative only (flagged):** the specific "feels like a bigger company than the guy I know" reaction and "I remember which award that was" recollection are hypotheses about a real person's knowledge, not facts.

---

## Persona 6 — Never heard of Ghanchi, zero context

**Profile:** Devesh, 29, arrived via a random link, has no search intent, no family/business connection, no prior exposure to Kora or any other advisory site. The purest "blank slate" read.

### Hero
> **Devesh:** "Logo's got a little blue-and-white crest-looking mark and 'Ghanchi Investments — Insurance & Investment Consultancy' in small text under it. That at least looks like a real, specific company logo, not a placeholder. The headline itself though — 'Your trusted partner for financial planning and protection' — I've seen that exact sentence shape a hundred times. Could be literally any advisory, bank, or insurance broker anywhere."

**Analyst:** The logo itself (`evidence/screenshots/ghanchi/home-fold0.png`, top-left) is a real, custom, non-template visual asset — distinct from Kora's own circular green icon mark — and is one of the few elements Devesh singles out unprompted as feeling specific rather than generic. The headline, independently, is confirmed (`EVIDENCE.md` item 1) to follow Kora's exact template sentence structure word-for-word with nouns swapped — Devesh's "could be literally any advisory" reaction, arrived at with zero knowledge of Kora, independently reproduces what the direct text comparison shows.

### Services
> **Devesh:** "Nine services, all with the same shape: heading, a sentence, five bullets, a quote from the same guy, 'Get Started.' After the third one I stopped reading the bullets, they all look the same."

**Analyst:** This is the Fogg-style scanning-fatigue effect of a single repeated component template applied 9 times with only nouns changed — a structural, not content, observation, and it's the single clearest "this is a template" tell for a persona with no comparison site to reference.

### Team / Founder
> **Devesh:** "One person, numbered '01.' If there's an '02' somewhere I never found it."

**Analyst:** Same leftover-numbering tell as Persona 1, independently arrived at.

### Testimonials
> **Devesh:** "The quotes feel like real people wrote them — a bit rambly, specific detail like 'my wife and I came to you,' 'active investor from Dubai.' I don't know if I trust the company, but I don't think these particular sentences are fake."

**Analyst:** Devesh's read matches the textual evidence: the testimonials (`evidence-data.json → ghanchi.page_about-us_testimonials`) contain first-person, specific, occasionally grammatically loose language uncharacteristic of copywritten marketing testimonials (e.g., "I'm a active investor," "It is so reassuring to know," specific unrelated-sounding employer names like "East-west Freight Carriers Ltd" and "Firoz Dance Academy") — detail that is hard to fabricate cheaply and reads as genuinely sourced, even to a reader with zero context.

### Footer
> **Devesh:** "Real address, real-looking phone numbers, two email addresses. Then this huge lowercase wordmark across the bottom that takes up like half a screen height — that part feels like a design flourish copied from somewhere, not really 'about' the company."

**Analyst:** Consistent with all prior personas' footer read.

### The one structural finding unique to this persona's zero-context vantage point
Comparing Ghanchi's `founderCallout` block ("Your goals are personal. Your plan should be too. Let's start with a conversation." — third-person, `Chandrakant B. Ghanchi / Founder & Financial Planner`, never "I") against Kora's equivalent ("**I've** personally led 40+ growth engagements. **Let me** show you what's possible for yours." — first-person, `evidence-data.json → kora.bodyText`) surfaces something counter-intuitive: **the actual solo-practitioner site is less personal, in the literal grammatical sense, than the six-person consultancy template it's built from.** A visitor with zero context, reading only what's on the page, gets a company-voice statement from Ghanchi and a founder's own voice from Kora — the opposite of what the real underlying business structures would suggest (Ghanchi genuinely is one person who could speak in first person; Kora is a fictional template company whose "I" is invented).

### Persona 6 summary
**Feels Ghanchi:** the real logo mark, the specific/unpolished testimonial language, the real contact block. **Feels generic:** the headline template match, the 9x-repeated service card shape, the leftover single-team-slot numbering, the footer wordmark device, and — the most structurally interesting finding — the founder speaking in third person where the template it's built from used first person.

---

## Cross-persona pattern (not a new persona — a synthesis)

Across all six walkthroughs, the same split recurs: **the factual layer (address, phone, real testimonial names/employers, real service list, real founder name) is specifically Ghanchi and does not read as generic; the structural/voice layer (headline template, card shapes, repeated bullet patterns, footer wordmark, third-person founder voice) is a near-unmodified Kora skin.** No persona who reached the testimonials or footer concluded "this could be anyone" about those specific sections — but every persona who scrolled the services grid or read the hero headline used some version of "could be any advisory" language independently. This matches the framing problem stated in the brief: the site's *facts* are Ghanchi's, but its *voice and structure* are still recognizably someone else's template with the facts substituted in.
