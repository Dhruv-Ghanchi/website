# Agent Responsibility Matrix

Personas sourced from `docs/agency-audit/roster/*.md` (read in full before assignment, not assumed from name alone). Each agent below adopts its persona's mission and communication style but writes in the grounded, file/line/screenshot-cited style already established in `docs/agency-audit/*.md` — not the generic deliverable templates in the roster files, which are boilerplate starting points, not this project's voice.

Not every persona in the roster was used. Ones with no distinct question to answer in *this* audit (SEO Specialist, Accessibility Auditor, Performance Benchmarker, Whimsy Injector) were left out — their ground was already covered by the prior fidelity audit and re-running them here would repeat, not add, evidence.

| Agent | Persona(s) adopted | Investigates | Deliverable(s) | Run mode |
|---|---|---|---|---|
| Orchestrator (this session) | Reality Checker + Evidence Collector + Senior Developer | Three sources of truth; per-section identity-leak classification; evidence indexing; final reconciliation of all agents' findings against each other for contradictions | `KORA_VS_GHANCHI_IDENTITY_AUDIT.md`, `IDENTITY_LEAK_AUDIT.md`, `EVIDENCE.md`, `BRAND_DIFFERENTIATION_STRATEGY.md`, `IMPLEMENTATION_BACKLOG.md`, `FINAL_BRAND_AUTHENTICITY_REPORT.md` | Foreground, throughout |
| Brand Voice Agent | Brand Guardian | The 25-dimension question from the brief: is Ghanchi's personality, voice, positioning, and trust architecture actually expressed, or is the *company name* the only thing that changed inside Kora's brand system | `BRAND_AUTHENTICITY_AUDIT.md` | Background |
| Visual Identity Agent | UI Designer + UX Architect + UI Finish-Gate Reviewer | Whether Kora's layout composition, hierarchy, and decorative decisions are dominant enough to make section ordering/weighting swap-proof for any financial brand; applies the Finish-Gate Reviewer's specific "could this screen belong to any product" test per section | `VISUAL_IDENTITY_AUDIT.md` | Background |
| Imagery Agent | Visual Storyteller + Image Prompt Engineer | Why the imagery (both the still-live Kora stock and the 3 already-generated AI images) reads as generic/template rather than as Ghanchi's specific world; produces exact replacement image-direction specs, not new images | `IMAGERY_AUTHENTICITY_AUDIT.md` | Background |
| Content Authenticity Agent | Content Creator | Whether the copy answers "who is Ghanchi" vs. only "what does Ghanchi sell"; classifies every gap as derivable-from-existing-content / needs-rewrite-of-existing-content / needs-new-owner-input | `CONTENT_AUTHENTICITY_AUDIT.md` | Background |
| Persona Agent | Persona Walkthrough Specialist | Six defined personas' scroll-by-scroll reactions to the live local build, each answering "what makes this feel specifically Ghanchi" vs. "what makes this feel like a generic Kora financial site" | `UX_PERSONA_WALKTHROUGH.md`, `BLIND_BRAND_TEST.md` | Background |

## Why this split

- **Brand Guardian** owns the abstract question (personality/voice/positioning) because that persona's whole mandate is "is this a cohesive, protected identity system" — the right lens for "is Ghanchi the designer or the content."
- **UI Designer + UX Architect + UI Finish-Gate Reviewer** are combined into one Visual Identity Agent because the brief's Step 8 (design dominance) needs both the systems view (UX Architect: is this structurally still Kora's IA) and the blunt per-screen verdict (Finish-Gate Reviewer: could this section belong to any product). Splitting them into two agents would produce two overlapping documents about the same screens.
- **Visual Storyteller + Image Prompt Engineer** are combined because imagery direction requires both the narrative critique (does this image tell Ghanchi's story) and the technical photography-language translation (what exactly to specify next time) — the brief explicitly asks for both in Step 6 and Step 11's replacement-spec output.
- **Content Creator** owns Step 7 alone because it's a single, well-bounded question (founder story / philosophy / differentiators — present, weak, or missing) that doesn't benefit from a second voice.
- **Persona Walkthrough Specialist** owns Steps 5 and 9 together because the Blind Brand Test *is* a specialized persona walkthrough (a persona with all explicit branding removed) — same method, same evidence, one agent.
- The **orchestrator** (this session, not a spawned agent) holds Step 2 (three sources of truth), Step 4 (identity-leak classification), and the final synthesis, because those require holding every other agent's findings in one head to catch contradictions — exactly the cross-review the brief asks for in its closing instruction.

## Cross-review protocol

Each background agent's deliverable is read in full by the orchestrator before being cited in `FINAL_BRAND_AUTHENTICITY_REPORT.md`. Any finding that contradicts another agent's finding (e.g., one agent calling a section "authentically Ghanchi" while another calls the same section "generic") is resolved explicitly in the Final Report's reconciliation notes, not silently dropped in favor of one side.
