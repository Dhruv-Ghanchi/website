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
- Check desktop 1440/1200px, tablet 810px, mobile 390px, keyboard access, and reduced motion. Scroll to activate reveal animations before capturing screenshots.
- `tests/pages.spec.ts` checks every published route, assets, overflow, dialogs, process, pricing, FAQ and mobile navigation. Wait for hydration before jumping directly to distant interactive sections.
- Sticky element offsets change during scroll. Hero timelines use untransformed measured height and viewport height; preserve the shared home-intro wrapper and separate sticky statement scene.

## Content and delivery

Content is served by Strapi 5 (`C:/Users/Ghanchi/Desktop/ghanchi-cms`, SQLite locally) via `src/lib/strapi.ts`, not file-backed collections. `src/lib/content.ts` holds shared types and formatting helpers only. Public assets are local under `public/assets`. `src/lib/site-config.ts` controls hero image/video mode and the optional process video. The approved live reference currently uses an image hero.

Contact/newsletter endpoints require `CONTACT_WEBHOOK_URL` and `NEWSLETTER_WEBHOOK_URL` respectively. Unconfigured endpoints intentionally return 503 rather than a false success. Use mocked delivery in tests; do not submit to the reference business. Legal text is a draft requiring review before launch.

## Kora baseline preservation

The `main` branch in https://github.com/Dhruv-Ghanchi/website.git preserves the Kora replica. Keep Ghanchi Investments rebranding and its Strapi implementation in a separate working copy after explicit approval; do not rebrand this baseline. Preserve existing visual components and interactions, propose business-specific content replacements, and obtain approval before removing sections. The Ghanchi frontend and its Strapi 5 CMS backend are both implemented in this worktree.

## Ghanchi worktree overrides

- Work only in `C:/Users/Ghanchi/Desktop/ghanchi-investments` on branch `ghanchi-investments`; do not edit `trial` or push to the backup `main`.
- `npm test` starts its own server on port 3100 and refuses reuse. Stop a preview on 3100 before running tests. Use `npm run dev -- --port 3100` for this worktree’s preview.
- Canonical routes use `/about-us`, `/contact-us`, `/blog`, `/online-services` and `/newsletters`. Tests cover all four target widths, new navigation and the approved pricing removal.
- `SITE_URL` sets the canonical origin; when absent, robots disallows preview indexing. Forms still require separate HTTPS webhook configuration and return 503 when unavailable.
- Latest newsletter listed by the source is November 2021. November 2020 and June 2020 have malformed source URLs and remain visibly unavailable. Do not invent newer issues or repaired links.
- Client countries verified in source: India, UAE, USA. Testimonials must retain real names and source URLs; absent portraits use initials. Employer affiliations are not corporate endorsements. Awards/certificates use neutral archive captions pending transcription.
- Current articles are explicitly labelled adaptations of two genuine March 2021 source articles. Never import the live blog feed wholesale: unrelated gambling posts are present.
- Hero and footer motion tests remain authoritative for pinning/reversal. The large footer wordmark and layered text hover must not be removed during rebranding.
- The owner selected integration with an existing Strapi application, not creation of another CMS. Obtain its source/repository location before schema changes. Do not provision infrastructure or mutate hosted content without separate authorization.

## Approved homepage simplification

- The owner approved removing Comparison and FeaturedCase from homepage rendering and replacing the nine large service stacks. Other audit proposals remain unapproved.
- The owner rejected the compact 3x3 grid and clarified that one-screen height is NOT a limit. Preserve the original Kora heading/intro typography and spacing; prioritize a distinctive animated presentation over density.
- Keep `ServicesSection` inside `.home-intro` after `Hero`: its opaque background replaces Comparison as the sticky hero/statement handoff. Do not leave the old comparison scroll allocation behind.
- The latest approved service reference is a responsive gallery of portrait image tiles with rounded corners, a lower-right circular cutout, and a diagonal animated arrow on hover/focus. The orbital selector is superseded. Render the actual CMS collection without assuming nine items; preserve direct canonical links, image focal points, missing-image fallback and reduced motion.
- Phase cards retain their original palette, typography, radii and numbering, but use testimonial-style hover/focus/tap expansion (desktop flex 1/2), with every phase preview always mounted.
- Current source connects to the existing Strapi application at `C:/Users/Ghanchi/Desktop/ghanchi-cms`; older future-CMS notes above are historical. For local verification, run that existing application and set `STRAPI_URL=http://localhost:1337` for the frontend/test process without editing environment files.
- Mobile (up to 560px) already uses a static statement and hides the hero spacer. Desktop/tablet retain pinning and reversal; motion tests distinguish these existing behaviors.

## CMS handoff for the homepage updates

- No schema migration is required for the service tiles or phase interaction.
- CMS image records for the service tiles and article covers have been updated: new Indian-themed `files` rows were added in Strapi and the corresponding `files_related_mph` links were repointed. Old image files remain in `public/uploads` and the Media Library but are no longer referenced by the updated services/articles; remove them through the Strapi admin when convenient.
- Maintain published services through existing `title`, unique stable `slug`, `order`, and `image` fields. The frontend reads the collection in `order` order and revalidates after 60 seconds; additions/removals/reordering do not require frontend layout edits.
- Review portrait crops for each service image. Set `alternativeText` and `focalPoint` on the Strapi media asset; the frontend maps these to image alt/focal properties. Several current assets lack authored alt text and use the existing generated fallback. Keep the shared `icon` field for missing-image fallback and other pages.
- Keep `home-page.servicesIntro` and existing phase titles/icons/text editable as before. Hover and arrow animation are frontend-only. Comparison and FeaturedCase fields/assets remain stored but are no longer rendered on the homepage; do not delete them automatically.
- Hero background now uses the `heroImage` media field in `site-setting`; `home-hero.tsx` renders a `<video>` when the URL ends in `.mp4`/`.webm`/`.mov` and an `<img>` otherwise. The testimonials background video still uses the original non-Indian asset; replace it in `site-setting.testimonialBackground` once a new asset is ready.
- `gallery-items` now have a `showOnHomepage` boolean toggle. Only toggled items render in the homepage "Recognition. Built on service." marquee (`getRecognitionGallery`); `/about-us/awards` and `/about-us/certificates` still list all published records via `getGalleryItems`. Existing records were backfilled to `true`.
- Owner verified the promotional claims used on the site: "serving since 2009", "15+ years", "1,200+ clients", "12+ awards", "5.0/5" (Google rating reported on the existing website, not a live feed), and "financial advisor" wording. These are approved; do not re-flag them as unverified.

## Deployment pipeline

- Frontend is on Vercel (project `ghanchi-investments`, team `dhruvghanchi`): pushes to `ghanchi-investments` build a Preview; `main` builds Production. Live URL: https://ghanchi-investments.vercel.app. Vercel env `STRAPI_URL` must be a publicly reachable Strapi — a LAN IP breaks builds. Promote a preview with `npx vercel promote <deployment-url>` instead of pushing `main`.
- CMS is hosted on Render at https://ghanchi-cms.onrender.com and autodeploys `main` of `Dhruv-Ghanchi/website-cms`. Content and media never travel through git: `public/uploads/*` and the sqlite DB are gitignored.
- Render uses Postgres + Cloudinary (`CLOUDINARY_NAME/KEY/SECRET` set there); local dev uses sqlite + local uploads when those vars are absent. `config/plugins.ts` picks Cloudinary whenever `CLOUDINARY_NAME` is set.
- Sync content/media local → hosted with `npx strapi transfer --to $REMOTE_STRAPI_URL/admin --to-token $REMOTE_TRANSFER_TOKEN` (envs live in `ghanchi-cms/.env`; the token is an unlimited Push transfer token). Transfer replaces all remote entities/assets/links/config with local — remote is a mirror, local is the source of truth.
- Render free tier sleeps after ~15 min idle; builds/transfers that hit it cold can fail with 520/timeout — warm it with a request first. A keep-alive ping service is a reasonable future addition.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
