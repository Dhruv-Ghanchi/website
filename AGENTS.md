# Project workflow

This is a Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4 website using Motion for interactions. The visual source of truth is https://kora.framer.media/ and the provided homepage PDF; the reference uses Manrope, mint, warm cream, and rounded panels rather than the generic written palette.

## Repository context

Use Graft before locating source or scoping edits. Start with `graft map`; use `graft ask "question" --source`, `graft grep`, `graft skeleton`, and `graft callers` as appropriate. Graft CLI 0.16.0 and the MCP server are available. The project integration is in `.devin/`; do not create other agents' configuration directories.

Build/recover the local graph with `graft build --only-dir src --only-dir tests --only-dir scripts --no-gitignore --no-ignore`. Retrieval refreshes it automatically. `graft check` verifies freshness. Indexing is local and structural; do not enable `--deep` or configure an LLM provider unless requested. CSS/configuration files are outside the structural index.

## Verification

- `npm run dev`: development server on port 3000.
- `npm run typecheck`: TypeScript checks.
- `npm run build`: production build.
- `npm test`: Playwright Chromium tests; the configuration starts or reuses the local server.
- `node scripts/complete-content.mjs --validate`: validates six file-backed collections and referenced local images. Without `--validate`, this script imports live reference content and overwrites the collections; do not run casually.
- Check desktop 1440/1200px, tablet 810px, mobile 390px, keyboard access, and reduced motion. Scroll to activate reveal animations before capturing screenshots.
- `node scripts/inspect-reference.mjs --motion` captures live hero/footer scroll checkpoints; add `--local` for localhost. Results are in `reference/motion/live` and `reference/motion/local`.
- `tests/pages.spec.ts` checks every published route, assets, overflow, dialogs, process, pricing, FAQ and mobile navigation. Wait for hydration before jumping directly to distant interactive sections.
- `python scripts/create-cms-handoff.py` regenerates and validates `CMS_AI_AGENT_HANDOFF.docx` using the installed python-docx package. This is a future CMS specification, not an implemented Supabase/Cloudinary integration.
- Sticky element offsets change during scroll. Hero timelines use untransformed measured height and viewport height; preserve the shared home-intro wrapper and separate sticky statement scene.

## Content and delivery

`src/lib/content.ts` contains six typed, reference-linked file-backed collections, not a hosted CMS/admin interface. Public assets are local under `public/assets`. `src/lib/site-config.ts` controls hero image/video mode and the optional process video. The approved live reference currently uses an image hero.

Contact/newsletter endpoints require `CONTACT_WEBHOOK_URL` and `NEWSLETTER_WEBHOOK_URL` respectively. Unconfigured endpoints intentionally return 503 rather than a false success. Use mocked delivery in tests; do not submit to the reference business. Legal text is a draft requiring review before launch.

## Kora baseline preservation

The `main` branch in https://github.com/Dhruv-Ghanchi/website.git preserves the Kora replica. Keep Ghanchi Investments rebranding and its Strapi implementation in a separate working copy after explicit approval; do not rebrand this baseline. Preserve existing visual components and interactions, propose business-specific content replacements, and obtain approval before removing sections. The Ghanchi frontend is implemented in this worktree; the Strapi connection remains future work described in the handoff.

## Ghanchi worktree overrides

- Work only in `C:/Users/Ghanchi/Desktop/ghanchi-investments` on branch `ghanchi-investments`; do not edit `trial` or push to the backup `main`.
- `npm test` starts its own server on port 3100 and refuses reuse. Stop a preview on 3100 before running tests. Use `npm run dev -- --port 3100` for this worktree’s preview.
- `node scripts/complete-content.mjs --validate` now validates Ghanchi records and assets only. Running without `--validate` deliberately fails instead of overwriting content from Kora.
- `node scripts/collect-assets.mjs --ghanchi` imports only approved founder/awards/certificates/newsletter sources and writes `src/lib/ghanchi-source.json`; inspect its changes before using them. The Kora asset collector is preserved in the backup, not used here.
- Canonical routes use `/about-us`, `/contact-us`, `/blog`, `/online-services` and `/newsletters`. Tests cover all four target widths, new navigation and the approved pricing removal.
- `python scripts/create-cms-handoff.py` regenerates the Strapi 5 specification, not an implemented CMS. Do not provision infrastructure without separate approval.
- `SITE_URL` sets the canonical origin; when absent, robots disallows preview indexing. Forms still require separate HTTPS webhook configuration and return 503 when unavailable.
- Latest newsletter listed by the source is November 2021. November 2020 and June 2020 have malformed source URLs and remain visibly unavailable. Do not invent newer issues or repaired links.
- Client countries verified in source: India, UAE, USA. Testimonials must retain real names and source URLs; absent portraits use initials. Employer affiliations are not corporate endorsements. Awards/certificates use neutral archive captions pending transcription.
- Current articles are explicitly labelled adaptations of two genuine March 2021 source articles. Never import the live blog feed wholesale: unrelated gambling posts are present.
- Hero and footer motion tests remain authoritative for pinning/reversal. The large footer wordmark and layered text hover must not be removed during rebranding.
- The owner selected integration with an existing Strapi application, not creation of another CMS. Obtain its source/repository location before schema changes. Do not provision infrastructure or mutate hosted content without separate authorization.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
