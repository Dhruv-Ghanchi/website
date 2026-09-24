# Agency Agents — Ghanchi Investments Kora Fidelity Audit

Status: **in progress**. This is an audit-and-specification pass only — nothing in this folder authorizes or performs a redesign, a media regeneration, or a content rewrite. See `IMPROVEMENT_BACKLOG.md` and `FINAL_AGENCY_REVIEW.md` for what actually happens next, once every file below is complete.

## Why this exists

The site owner asked for a deep, evidence-based audit of the current Ghanchi Investments implementation against the live Kora reference (`https://kora.framer.media/`), using a curated set of specialist review personas from the real, MIT-licensed [`msitarzewski/agency-agents`](https://github.com/msitarzewski/agency-agents) repository. See `AGENT_ROSTER.md` for exactly which 16 personas, verified real, and how they were actually applied in this harness (persistent custom subagent types can't be registered from an external repo mid-session, so each persona's real definition was used as the literal operating brief for a dedicated review pass instead).

## Ground rules carried through every document here

- Kora fidelity is the goal — not a new design direction, not a rewrite, not "starting over."
- Architecture stays Next.js → Strapi → production DB/storage. No Supabase, no WordPress runtime, no cPanel dependency, no DNS/email changes.
- Media: per `docs/MEDIA_INVENTORY.md` (completed separately, before this audit), 41 assets are verified-authentic Ghanchi records and are protected, 1 asset is `REQUIRES BUSINESS VERIFICATION` and stays that way, 33 assets are orphaned Kora leftovers and are untouched. **No image was generated, replaced, or deleted as part of this audit.**
- Every finding is evidence-based: a screenshot, a computed style, a source-code reference, a live measurement, or an existing project document — not a subjective "could be better."

## Documents in this audit

| File | Covers | Status |
|---|---|---|
| `AGENT_ROSTER.md` | The 16 real personas used, and how | Done |
| `VISUAL_EVIDENCE.md` | Shared screenshot/computed-style evidence, gathered once | Done |
| `KORA_VS_GHANCHI_COMPARISON.md` | Full comparison matrix: typography, color, nav, hero, sections, cards, buttons, footer, images, motion triggers, responsive behavior | Done |
| `KORA_MOTION_AUDIT.md` | Dedicated motion/interaction audit vs. Kora | Done |
| `MEDIA_AUDIT.md` | Replacement specifications for the 9 live Kora-stock slots identified in `docs/MEDIA_INVENTORY.md` — direction only, no generation | Done |
| `CONTENT_AUDIT.md` | Copy structure/hierarchy vs. Kora, without inventing facts | Done |
| `BRAND_AUDIT.md` | Logo, typography, color, tone, template-remnant check | Done |
| `UX_WALKTHROUGH.md` | Five realistic-visitor scroll-by-scroll walkthroughs | Done |
| `ACCESSIBILITY_AUDIT.md` | WCAG/keyboard/contrast/motion findings beyond what's already automated-tested | Done |
| `PERFORMANCE_AUDIT.md` | Image/animation/bundle/API-waterfall findings | Done |
| `FRONTEND_ARCHITECTURE_AUDIT.md` | Implementation-level review of proposed changes' technical safety | Done |
| `STRAPI_CONTENT_AUDIT.md` | CMS-side content-type/media/metadata correctness | Done |
| `SEO_AUDIT.md` | Structured data validity, heading hierarchy, internal linking, metadata uniqueness | Done |
| `IMPROVEMENT_BACKLOG.md` | Every finding above, deduplicated and prioritized P0-P3 with full implementation detail | Done |
| `FINAL_AGENCY_REVIEW.md` | Reality-check pass + final READY/NOT-READY recommendation | Done |

`roster/` holds the verbatim source persona files. `evidence/` holds the raw screenshots and computed-style JSON.
