# Agent Roster

Source: [github.com/msitarzewski/agency-agents](https://github.com/msitarzewski/agency-agents) (MIT licensed), commit as of 2026-09-25. Verified real via the GitHub API before use — this is not a fabricated roster.

## A note on how these are actually used

This harness's Claude Code runtime does not support registering new persistent subagent types from an external repository at conversation time — the available agent types are fixed by this project's configuration, not something installable mid-session. So "installing" these 16 specialists means: their real persona definitions (full markdown files, copied verbatim into `docs/agency-audit/roster/`) are used as the literal operating brief for a dedicated review pass — either a spawned background agent instructed to follow that persona's stated process and standards, or, for the smaller/more mechanical checks, applied directly by the primary session using that persona's criteria against the same shared evidence set.

Every specialist works from one shared evidence base (`docs/agency-audit/evidence/`) — real screenshots and computed-style extracts from the live `https://kora.framer.media/` and the local Ghanchi implementation, gathered once — rather than each independently re-scraping the same two sites. This keeps every finding traceable to the same underlying facts and avoids 16x redundant browser automation.

## Roster (16 agents, all verified present in the source repo)

| # | Persona | Source file | Used for |
|---|---|---|---|
| 1 | UI Designer | `design-ui-designer.md` | Visual/component/design-system audit |
| 2 | UX Architect | `design-ux-architect.md` | Layout architecture, responsive implementation |
| 3 | Brand Guardian | `design-brand-guardian.md` | Brand consistency, logo/typography/color usage |
| 4 | Visual Storyteller | `design-visual-storyteller.md` | Visual hierarchy, image selection, section storytelling |
| 5 | Whimsy Injector | `design-whimsy-injector.md` | Micro-interactions, hover states, motion personality |
| 6 | Image Prompt Engineer | `design-image-prompt-engineer.md` | Imagery audit, replacement generation briefs |
| 7 | Persona Walkthrough Specialist | `design-persona-walkthrough.md` | Scroll-by-scroll realistic-visitor evaluation |
| 8 | UI Finish-Gate Reviewer | `design-ui-finish-gate-reviewer.md` | Harsh polish/finish review |
| 9 | Frontend Developer | `engineering-frontend-developer.md` | Implementation-level gap analysis |
| 10 | Senior Developer | `engineering-senior-developer.md` | Technical safety/architecture review of proposed changes |
| 11 | Content Creator | `marketing-content-creator.md` | Copy, content hierarchy, CTA wording |
| 12 | SEO Specialist | `marketing-seo-specialist.md` | SEO implications of visual/content change, legacy URL cross-check |
| 13 | Evidence Collector | `testing-evidence-collector.md` | Screenshot/DOM/computed-style evidence gathering |
| 14 | Accessibility Auditor | `testing-accessibility-auditor.md` | WCAG, keyboard, contrast, motion accessibility |
| 15 | Performance Benchmarker | `testing-performance-benchmarker.md` | Image/animation/loading/Core Web Vitals |
| 16 | Reality Checker | `testing-reality-checker.md` | Final cross-agent verification, evidence discipline |

Full text of each persona is preserved in `docs/agency-audit/roster/*.md` for reference and re-use in later phases.

## Binding constraints carried into every review (from the brief)

- Kora fidelity is the goal, not a new design direction. No redesign, no replacing Kora.
- Do not touch business architecture: Strapi stays the CMS; no Supabase, WordPress runtime, or cPanel dependency.
- Do not modify email DNS.
- Per the separate, already-completed media classification (`docs/MEDIA_INVENTORY.md`): the 41 verified-authentic Ghanchi assets are protected, the 1 uncertain asset stays `REQUIRES BUSINESS VERIFICATION`, the 33 orphaned Kora files are not touched. **No asset is regenerated, replaced, or deleted during this audit** — this phase produces specifications only.
- Every finding must cite evidence (screenshot, computed style, DOM/source inspection, or existing project documentation) — no unsupported "could be better" statements.
