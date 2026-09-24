# Final Agency Review — Reality Check

Persona: Reality Checker (`docs/agency-audit/roster/testing-reality-checker.md`), applied against all 10 preceding audit documents plus `IMPROVEMENT_BACKLOG.md`.

---

## 1. Are findings evidence-based?

Yes, with the evidence discipline holding up under a second pass. Every finding in every document cites one or more of: a direct file diff (`trial` vs. `ghanchi-investments`), a computed-style extraction, a live Strapi API response, a Playwright DOM query, a rendered-HTML fetch, or a WCAG-formula calculation against real hex values. Several agents went further than asked and actively distinguished real findings from measurement artifacts rather than reporting the artifact as a finding — the Kora `rgb(0,0,238)` link-color read (a Framer nested-`<span>` quirk, already known from this project's own prior audit), the "duplicate H2" false positive traced to inert `<dialog>` content, and the "0 landmark" false positive traced to an implicit-role-blind query are all explicitly caught and dismissed with a stated root cause, not silently omitted or wrongly reported. That specific behavior — checking your own tooling before trusting it — is exactly what this review is meant to verify exists, and it does, independently, in three different documents.

No finding in the backlog rests on a single agent's unverified claim: the highest-impact ones are corroborated across independent specialists working from different evidence (P1-1's self-quote issue found by both Content Creator and Brand Guardian from different angles; P1-7's alt-text pipeline gap found by three separate audits — Frontend, Accessibility, and Strapi Content — each looking at a different layer of the same bug).

## 2. Are proposed changes technically realistic?

Yes. The backlog's Implementation Location field points to real, specific files for every P0/P1 code-level item, and the Frontend/Senior Developer audit explicitly re-affirmed the existing architecture (typed fetches, no dynamic-zone builder) rather than proposing a rewrite riding along with these fixes. Nothing in the backlog requires a new dependency, a new data model beyond what Strapi already has (`alternativeText`, `vision`, `contactPage.intro` are all fields that already exist and are simply unused or unwired), or a change to the Next.js/Strapi/Postgres-eventually architecture.

## 3. Does the Kora comparison rest on the actual live site, not memory?

Yes, on both counts that matter. The shared evidence base (`VISUAL_EVIDENCE.md`) was gathered via live Playwright navigation to `https://kora.framer.media/`, not from a cached description. Where an agent needed something the shared evidence didn't cover (the Visual/Motion audit's need for Kora's *inner*-page typography, not just its homepage), it fetched fresh live pages (`kora.framer.media/about`, `/insights/...`, `/cases/sitemark`) rather than guessing — and that fresh fetch is what produced the P2-1 finding (inner-heading weight drift) and, just as importantly, what allowed that same finding to correctly identify itself as a **pre-existing gap in the `trial` template recreation**, not a rebrand regression — a distinction that would have been impossible without checking the live site directly.

## 4. Do recommendations contradict any locked project constraint?

No violations found on any of the explicit constraints:
- **No Supabase, WordPress runtime, or cPanel dependency introduced or proposed** — the SEO audit explicitly re-verified every WordPress infrastructure path still 404s, and no finding anywhere proposes touching DNS, email, or hosting.
- **No genuine Ghanchi asset was regenerated, replaced, or deleted.** The Media Audit is explicit about this in its own first line, and cross-checked: it neither reclassified the `REQUIRES BUSINESS VERIFICATION` asset nor touched any of the 33 orphaned files nor any of the 41 protected records. The logo finding (P1-10), despite being a real and well-evidenced visual-fit issue, was correctly treated as a *flag for owner decision*, not an executed change — consistent with the logo's already-settled authenticity status in `docs/MEDIA_INVENTORY.md`.
- **No business fact was invented.** Every content recommendation that touches copy explicitly routes through either (a) a real, already-verified fact (the founder's actual name/role, an already-verified testimonial's actual content) or (b) a content-owner decision flagged as such, never a fabricated statistic, award, or claim. The SEO audit's `author` fix explicitly chose the honest `Organization`-type attribution over inventing a named byline, citing the project's own no-fabrication rule in the code comment it was fixing.
- **No redesign was executed.** Every document in this audit is a specification, not a diff — confirmed by re-scanning all 11 audit files for any indication a source file was modified beyond the explicitly-permitted throwaway evidence-gathering scripts (all confirmed deleted by their authors after use).

## 5. Is the improvement backlog actually implementable?

Yes, in the specific sense that matters for a "what's next" decision: the P0 and P1 tiers split cleanly into two implementable batches —
- **Trivial/Small, code-only, zero content dependency** (can start immediately): P0-1 (contrast), P1-1 (quote attribution), P1-4 (logo mix-up), P1-7 (alt-text wiring), P1-8 (JSON-LD URL), P1-9 (canonical), P1-11 (footer tagline) — 7 items, all single-file or two-file changes with no owner input required beyond a go-ahead to proceed.
- **Small, requires a short content decision first**: P0-2 (needs only the phone number Strapi already has — no new decision, just implementation), P1-2 (needs someone to read 11 testimonials and judge topical fit), P1-3 (needs 9 short written descriptions).
- **Explicitly deferred, owner-gated, not part of "implementation" in the near term**: P1-5 (media regeneration — a separate controlled step per the brief), P1-10 (logo redraw — a real design deliverable needing sign-off), P1-6 (image re-export — small but needs the source files, which may be superseded by P1-5's regeneration anyway).

## 6. Default-assumption check: is the site "visually complete"?

**No — and the evidence supports that conclusion specifically, not as a default hedge.** Two things keep this from a clean READY verdict: the P0 accessibility contrast failure touches every primary CTA sitewide (this alone is disqualifying for a production launch under any reasonable accessibility bar), and the P0 contact-findability gap sits directly on top of the site's actual conversion mechanism for its real-world use case (a local advisory business visitor who wants to call). Both are small, well-specified, low-risk fixes — but they are unresolved as of this review.

---

## Final Recommendation

**REQUIRES ADDITIONAL EVIDENCE for full launch-readiness — but READY FOR IMPROVEMENT IMPLEMENTATION on the P0/P1 backlog specifically.**

More precisely: this audit did not find evidence that the site needs redesigning, needs to abandon Kora fidelity, or has an architecture problem — on the contrary, it repeatedly confirmed the opposite (motion system byte-identical, component reuse sound, no waterfall, no stale migration code, typed-fetch architecture still the right call). What it found is a specific, bounded, well-evidenced list of gaps concentrated in three places: (1) two accessibility/UX items that are genuinely launch-blocking in severity but trivial-to-small in fix effort, (2) a cluster of content/attribution issues that came from the same root cause (a few hardcoded strings and one shared testimonial relation standing in for content that should be differentiated), and (3) media that was never finished being swapped out from the Kora baseline.

None of this requires "additional evidence" to act on — the evidence already gathered is sufficient to implement the P0/P1 backlog directly. "Requires additional evidence" applies specifically to declaring the site *fully* launch-ready: that would also need the still-open business-gated items from `docs/QA_REPORT.md` (form delivery recipient, legal page text, hosting/DNS decisions) and the P1-5/P1-10 media/logo decisions this audit deliberately left to the owner.

---

## Phased Implementation Plan

**Phase 1 — Critical Fidelity (do first, no dependencies):** P0-1 (contrast), P0-2 (header phone number).

**Phase 2 — Visual System:** P2-1 (inner heading weight/tracking — fix in `trial` baseline first, then port), P2-2 (nav-pill translucency — confirm intent first), P2-3 (footer rhythm — confirm intent first).

**Phase 3 — Motion:** No action required — the motion audit found the system already faithfully preserved. (P3-1 is optional and cosmetic.)

**Phase 4 — Media:** P1-6 (compress the 3 existing AI images — do this regardless of timing), then P1-5 (generate the 9 replacement images per the `MEDIA_AUDIT.md` briefs, pending your go-ahead — separate controlled step as instructed), then P1-10 (logo — pending your decision on whether to commission a redraw).

**Phase 5 — Content:** P1-1, P1-2, P1-3, P1-4, P1-11, P2-4, P2-5, P2-12, P2-13 — all content/attribution fixes, none requiring new invented facts.

**Phase 6 — Responsive:** P2-19 (mobile touch targets), P2-20 (mobile services scroll depth) — both already well-specified, no further audit needed before fixing.

**Phase 7 — Accessibility:** P1-7 (alt-text wiring), P2-14 (duplicate name announcement), P2-15 (FAQ arrow-key scoping), P3-8 (image dimensions going forward).

**Phase 8 — Performance:** P1-6 (already listed under Phase 4 — do once), P2-21 (logo resolution). Longer-term: `next/image` adoption and the client-component-boundary restructuring flagged in `PERFORMANCE_AUDIT.md` are real architectural investments, correctly scoped there as their own future work, not folded into this pass.

**Phase 9 — Final Visual QA:** Re-run the same evidence-gathering script (`scripts/agency-evidence.mjs` pattern) after Phases 1-8 land, to confirm each fix actually closed its finding rather than assuming it did.

**Phase 10 — Reality Check:** Re-run this document's six questions against the post-fix state before considering the backlog closed.

---

## Blockers (genuine, requiring your decision — nothing else in this audit is blocked)

1. **Go-ahead to generate the 9 replacement images** per the specifications in `MEDIA_AUDIT.md` (P1-5) — explicitly held per your instruction that generation is a separate controlled step.
2. **Logo redraw decision** (P1-10) — commission a like-for-like vector redraw, or leave as-is; a real design deliverable, not something this audit executes unilaterally.
3. **Testimonial photo sourcing decision** (P2-13) — source real client photos for the `testimonial.image` field, or formally document it as intentionally text-only.
4. Everything else in the P0/P1 tier is implementable now without further decisions from you.

---

## Files Created/Updated This Audit

`docs/agency-audit/README.md`, `AGENT_ROSTER.md`, `VISUAL_EVIDENCE.md`, `KORA_VS_GHANCHI_COMPARISON.md`, `KORA_MOTION_AUDIT.md`, `MEDIA_AUDIT.md`, `CONTENT_AUDIT.md`, `BRAND_AUDIT.md`, `UX_WALKTHROUGH.md`, `ACCESSIBILITY_AUDIT.md`, `PERFORMANCE_AUDIT.md`, `FRONTEND_ARCHITECTURE_AUDIT.md`, `STRAPI_CONTENT_AUDIT.md`, `SEO_AUDIT.md`, `IMPROVEMENT_BACKLOG.md`, `FINAL_AGENCY_REVIEW.md` (this file), plus `evidence/computed-styles.json` and `evidence/screenshots/*.png`, and `roster/*.md` (16 verbatim persona source files). No file outside `docs/agency-audit/` was created or modified during this audit.
