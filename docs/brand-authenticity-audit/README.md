# Brand Authenticity Audit — "Not Just a Kora Reskin"

## Why this audit exists

The prior `docs/agency-audit/` pass verified **fidelity** to the Kora template — that Kora's design system, motion language, and component structure were faithfully preserved and correctly rebranded, with no content-truth violations. That audit was correct on its own terms, and its conclusions stand.

But fidelity to a template and authenticity of a brand are different questions. Multiple people shown the live Ghanchi Investments site next to `kora.framer.media` independently reacted: *"It doesn't feel like a Ghanchi Investments website. It feels like someone else's website with the Ghanchi Investments logo pasted onto it."*

This audit exists to answer, with evidence rather than opinion: **why does it feel that way, and what closes the gap without abandoning Kora's design foundation or redesigning the site.**

## Scope discipline

- This is an investigation + solution-design phase only. **No code, content, Strapi records, or media were changed to produce this audit.**
- Kora's design system is not on trial. The question is never "should we stop using Kora's visual language" — it's "where has Kora's *specific* content/structure/voice decisions leaked through in place of a genuine Ghanchi decision."
- No business fact is invented anywhere in this audit. Where a claim about "who Ghanchi Investments is" can't be sourced from verified project material, it is marked **OWNER / BUSINESS VERIFICATION REQUIRED**, not guessed.

## Method

Live evidence was gathered directly, not recalled from the prior audit's memory:
- A fresh Playwright pass (`evidence/gather-evidence.mjs`) captured full-page and fold-by-fold screenshots of `https://kora.framer.media/` (home + `/about`, `/cases/sitemark`, `/insights`) and the current local Ghanchi build (`http://localhost:3100/`, home + 6 inner routes), plus extracted the actual rendered text of every major homepage section on both sites for direct sentence-level comparison.
- The live production site (`ghanchiinvest.com` / `www.ghanchiinvest.com`) was also attempted. It returns a **blank white page** to an automated fetch (screenshot in `evidence/screenshots/live/`) — consistent with the bot-protection finding already on record in `docs/QA_REPORT.md`. It could not be used as a live evidence source; verified business facts instead come from the project's own prior direct-database and Strapi-content investigation (`docs/CURRENT_IMPLEMENTATION_PLAN.md` §4/§10/§10a), which already did this extraction work from the real WordPress backend, not from guessing. `www.ghanciinvest.com` (as typed) does not resolve (`ERR_NAME_NOT_RESOLVED`) — likely a typo for `ghanchiinvest.com`.
- A responsibility matrix (`AGENT_ROSTER.md`) split the investigation across specialist personas from `docs/agency-audit/roster/`, each producing one primary deliverable, cross-reviewed and reconciled in `FINAL_BRAND_AUTHENTICITY_REPORT.md`.

## How to read this folder

Read `FINAL_BRAND_AUTHENTICITY_REPORT.md` first — it answers the ten questions the brief asked for and links to every supporting document for detail. The rest of the folder is the evidence trail behind that report.

| File | Answers |
|---|---|
| `AGENT_ROSTER.md` | Who investigated what, and why that division |
| `KORA_VS_GHANCHI_IDENTITY_AUDIT.md` | The three sources of truth, established separately: Kora, current Ghanchi implementation, actual verified Ghanchi business identity |
| `BRAND_AUTHENTICITY_AUDIT.md` | Is Ghanchi the *designer* of the experience or the *content inserted into* Kora's experience — across 25 dimensions |
| `VISUAL_IDENTITY_AUDIT.md` | Is Kora's visual language overpowering Ghanchi's identity, section by section |
| `CONTENT_AUTHENTICITY_AUDIT.md` | Does the copy say who Ghanchi is, or only what it sells |
| `IMAGERY_AUTHENTICITY_AUDIT.md` | Why the imagery reads as template/generic, and exact direction for what replaces it |
| `UX_PERSONA_WALKTHROUGH.md` | Six personas' honest reactions, scroll by scroll |
| `BLIND_BRAND_TEST.md` | What survives if you strip every explicit Ghanchi reference |
| `IDENTITY_LEAK_AUDIT.md` | Section-by-section: Kora DNA to keep / Kora DNA too dominant / Ghanchi DNA missing / Ghanchi content too weak or generic |
| `EVIDENCE.md` | Index of every screenshot, extracted text block, and source citation used above |
| `BRAND_DIFFERENTIATION_STRATEGY.md` | The actual solution: KEEP / STRENGTHEN / REPLACE / ADD / REMOVE / OWNER INPUT |
| `IMPLEMENTATION_BACKLOG.md` | The same solution, prioritized P0–P3, with exact files and verification |
| `FINAL_BRAND_AUTHENTICITY_REPORT.md` | The synthesis — start here |

## What happens next

Nothing, until you review `FINAL_BRAND_AUTHENTICITY_REPORT.md` and `IMPLEMENTATION_BACKLOG.md` and tell me which phases to execute. Per your instruction, this phase stops at the report.
