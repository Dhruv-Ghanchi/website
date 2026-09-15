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

The `main` branch in https://github.com/Dhruv-Ghanchi/website.git preserves the Kora replica. Keep Ghanchi Investments rebranding and its Strapi implementation in a separate working copy after explicit approval; do not rebrand this baseline. Preserve existing visual components and interactions, propose business-specific content replacements, and obtain approval before removing sections. The Ghanchi implementation and updated Strapi handoff remain deferred.
