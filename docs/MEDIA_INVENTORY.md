# Media Inventory

Classification of every file in `public/assets/` (89 total) plus the live Strapi media library (41 files), against the locked policy: authentic Ghanchi business records are kept regardless of origin; decorative/stock/generic imagery (including Kora's own original template photography) is not treated as final production media and is in scope for AI regeneration.

Method: cross-referenced every file against `src/lib/ghanchi-source.json` (this project's own committed WordPress-provenance manifest), direct visual inspection of a representative sample per group, a full-codebase reference check (`grep` across `src/`/`scripts/`), and — critically — a direct query of every Strapi content type's media relations plus the Strapi media library's own file list. The codebase-only check undercounted what's actually live; several files only show up as "in use" through a Strapi database relation, not a static Next.js path.

---

## Headline finding: Kora's own template stock photography is live in production

**9 distinct Kora-original stock photos (random-hash filenames, no relation to Ghanchi) are currently uploaded to Strapi and wired into real, visible content** — this is exactly what the media policy is meant to catch. Specifically:

| File | Where it's live |
|---|---|
| `IaiFRY4S4OYymE10NQ9ipQb5dwc.jpg` | **Homepage hero background** (`site-setting.heroImage`) — the single most visible image on the site |
| `Xg3naOB3jlkrgVdI79zfTGmUpxo.jpg` | `service.image` for **both** Mutual Funds *and* Employer Employee Insurance (same stock photo reused across two unrelated services) |
| `qkntRVyDFXSavXk2fE20yVB6CU.jpg` | `service.image` for Retirement Planning |
| `OqCGYrjHIzy11F9CWaDgfYAzKQ.jpg` | `service.image` for Child Education Planning |
| `3NdwQXmM1SRuYwMwOwL4wEa9Y.jpg` | `service.image` for Personal Accidental Policy |
| `NF5tRpn3xrpV81CGf1SDQo60Lk.jpg` | `service.image` for General Insurance |
| `IXWqaCHPbvPQKcyZ9Mch2cWh9hU.jpg` | `article.coverImage` — "Single Woman, Retiring Solo…" |
| `IQe1Ak6IQCv8JGUh2qx9RiQCBQ.jpg` | `article.coverImage` — "You Don't Have to Be Rich to Retire Rich!" |
| `MuKacYjazqkYtwK8LUQanQB1xg.jpeg` | `newsletter.coverImage` for **all 19** newsletter archive entries — one generic stock photo repeated 19 times |

By contrast, **3 of the 9 services already have real AI-generated Ghanchi imagery** (Financial Planning, Life Insurance, Health Insurance — see Group C below), proving the correct pipeline is already partway through execution; it just wasn't finished before this session.

**This is the priority item for Phase 7**, ranked by visibility: hero image first, then the 6 remaining service images, then the 2 article covers, then the newsletter cover.

---

## A. AUTHENTIC GHANCHI ASSETS (41 files in `public/assets/`) — KEEP

| Group | Count | Evidence | Current state |
|---|---|---|---|
| `ghanchi-founder-headshot.jpg` | 1 | Genuine candid photo of a real person | **Live** — Strapi media id 41, linked to Chandrakant B. Ghanchi's `team-member` record |
| `logo-ghanchi.png` | 1 | The real Ghanchi Investments logo (visible as a watermark on `ghanchi-1.jpg.webp`, matches `site-setting.logo`) | **Live** — Strapi media id 40, wired via `site-setting.logo` |
| `ghanchi-dc1c1b_*_mv2.jpg.webp` (8 files) | 8 | `ghanchi-source.json` records the exact WordPress source URL for each under `"awards"`; filenames match WordPress attachment records directly | **Live** — Strapi media ids 12-19, each connected to a `gallery-item` (category: awards) |
| `ghanchi-ezgif.com-gif-maker-*.jpg.webp` (19 files) | 19 | `ghanchi-source.json` records exact WordPress source URLs under `"certificates"`. Directly verified by opening one: a real "Certificate of Recognition" from Bima Gurukul, awarded to **Chandrakant Ghanchi** by name, 2020 | **Live** — Strapi media ids 20-38, each connected to a `gallery-item` (category: certificates) |
| `ghanchi-1.jpg.webp` … `ghanchi-12.jpg.webp` (12 files) | 12 | `ghanchi-source.json` records exact WordPress source URLs under `"about-us"`, each with a real topic caption. Directly verified `ghanchi-1.jpg.webp`: a real video-thumbnail frame carrying the actual Ghanchi Investments logo watermark and "YOUR FINANCIAL ADVISOR" caption | **Not yet uploaded to Strapi or used anywhere** — genuine content sitting idle. Natural fit as illustration once the ~23-article content backlog (Phase 6) is migrated. |

## B. REQUIRES BUSINESS VERIFICATION (1 file)

| File | Why it's ambiguous |
|---|---|
| `ghanchi-IMG_1346_50-1024x683.jpg.webp` | Has a real WordPress source URL in `ghanchi-source.json` (from the `about-us` page), but visually it's a generic "financial success" stock-composite graphic (a man cut out and pasted over a stock coin-stack/word-cloud background) — the photographic treatment doesn't match the genuine candid style of the verified founder headshot, and I can't confirm whether the person depicted is the founder or a stock model. **Needs a direct answer: is this the founder, or old decorative stock?** Currently unreferenced by any live page or Strapi record either way, so this isn't urgent. |

## C. AI-GENERATED, already connected and live (3 files)

| Service | File | Status |
|---|---|---|
| Financial Planning | `ghanchi-service-financial-planning.png` | **Live**, connected to the `service` record. Alt text was missing — added this session ("Financial advisor reviewing a client's financial goals plan"). |
| Life Insurance | `ghanchi-service-life-insurance.png` | **Live**, connected. Alt text added this session. |
| Health Insurance | `ghanchi-service-health-insurance.png` | **Live**, connected. Alt text added this session. |

Visually consistent with the Gemini pipeline referenced in the implementation plan (conceptual desk/advisory scenes, anonymous people, no fabricated real-person claim) — compliant with the media policy as written.

## D. DECORATIVE / STOCK — Kora template leftovers

Split into two very different states — this is the correction from my first pass at this inventory, which only checked static Next.js references and missed Strapi's own database-driven media relations.

### D1 — Live in production, replacement needed (9 files)
Listed in the headline finding above. These are real, visible policy violations, not just leftover clutter.

### D2 — Fully orphaned, not live anywhere (33 files)
The remaining 31 random-hash files (of the original 40 in `public/assets/`) plus `logo-0.svg`/`logo-1.svg` (Kora's own SVG wordmark — confirmed by inspecting the file itself: literal Framer CSS classes and design tokens, not a Ghanchi asset). None of these appear in Strapi's 41-file media library and none are referenced anywhere in `src/`/`scripts/`. No live-production impact; just unused files taking up space in the repo.

Recommendation: safe to delete D2 as routine cleanup once you confirm (they remain preserved in the `trial` worktree's Kora baseline and in git history regardless). Not doing this without your go-ahead since it's a 33-file bulk delete and isn't blocking anything.

## Not media content (excluded from classification)

- `placeholder-founder.svg` — code-owned UI fallback graphic, not editorial content.
- `manrope-variable.woff2` — font file.

---

## What Phase 7 actually needs to generate

| Priority | Slot | Current state | Aspect ratio (matches existing) |
|---|---|---|---|
| 1 | Homepage hero background | Kora stock (`IaiFRY4S4OYymE10NQ9ipQb5dwc.jpg`) | Match current hero crop |
| 2 | Mutual Funds service image | Kora stock (shared with #4) | Match `service.image` format (see Group C examples) |
| 3 | Retirement Planning service image | Kora stock | Same |
| 4 | Employer Employee Insurance service image | Kora stock (duplicate of Mutual Funds) | Same |
| 5 | Child Education Planning service image | Kora stock | Same |
| 6 | Personal Accidental Policy service image | Kora stock | Same |
| 7 | General Insurance service image | Kora stock | Same |
| 8 | 2 article cover images | Kora stock | Match `article.coverImage` format |
| 9 | Newsletter archive cover | One Kora stock image shared by all 19 entries | Match `newsletter.coverImage` format |

Art direction: match the 3 already-generated service images (Group C) — conceptual/editorial financial-advisory scenes, mint/cream/ink palette consistent with the Kora design system, no fabricated real-person claims. The Gemini pipeline (`scripts/gemini-gen-test.mjs`, `GEMINI_API_KEY` already configured) is the established mechanism.

**This is ready to execute** — the architecture (Strapi media fields, focal-point picker, `mediaUrl()`/`mediaFocal()` handling) already works correctly for all of these slots, proven by the 3 images already live. Generating and connecting the remaining 9 is content production, not engineering — happy to proceed with Gemini generation now if you want me to, or hold for your review of the 3 already-live ones first.
