# Strapi Content Audit — Ghanchi Investments

Scope per brief: content types, media relationships, image metadata/alt-text coverage in Strapi itself, ordering, published state, content that should be CMS-managed but isn't (or vice versa). All figures below are read live from `http://localhost:1337/api/*` (Strapi 5, `ghanchi-cms`), not assumed from schema alone.

---

## Content type inventory

20 collection/single types under `ghanchi-cms/src/api/*`: `about-page`, `about-subpage`, `article`, `blog-page`, `category`, `contact-page`, `faq-item`, `gallery-item`, `home-page`, `legal-page`, `navigation`, `newsletter`, `newsletters-page`, `online-service`, `online-services-page`, `service`, `services-page`, `site-setting`, `team-member`, `testimonial`. Plus 26 reusable components (`ghanchi-cms/src/components/**`) backing repeatable/nested fields (e.g. `home/phase`, `shared/stat`, `content/page-intro`). This matches `docs/CURRENT_IMPLEMENTATION_PLAN.md`'s Section 336-337 inventory — no drift found.

---

## P1 — Image alt-text coverage is partial and inconsistent across content types

Verified via `populate=*` on each collection:

| Content type | Total records | Records with `alternativeText` set | Notes |
|---|---|---|---|
| `service` (`image`) | 9 | 3 (financial-planning, life-insurance, health-insurance) | 6/9 blank |
| `article` (`coverImage`) | 2 | 0 | 0/2 |
| `team-member` (`headshot`) | 1 | 1 (founder) | Fully covered — set during this session per `docs/QA_REPORT.md` Phase 3 |
| `gallery-item` (`image`) | 27 (8 awards + 19 certificates) | 0 | Acceptable per existing plan — see below |
| `testimonial` (`image`) | 11 | N/A — see next finding | No images exist to caption |

The `gallery-item` 0/27 figure is **already a known, accepted state**, not a new gap: `docs/QA_REPORT.md` line 210 documents that these are uncaptioned archive scans and that the frontend's neutral-caption fallback (rendering `item.title`, e.g. "Awards archive — photograph 3", as the `<img alt>` — confirmed in `src/app/about-us/[section]/page.tsx`) is the deliberate interim approach until the owner transcribes each one. No action needed here beyond what's already planned.

The `service` and `article` gaps **are** new/actionable: unlike gallery items, these records have no owner-review blocker — an editor can simply open each Strapi entry's Media Library asset and fill in the "Alternative text" field for the 6 remaining services and 2 articles. (Whether the frontend actually uses this field once filled in is a separate, already-flagged issue — see `FRONTEND_ARCHITECTURE_AUDIT.md`.)

---

## P2 — Testimonial media relationship exists in schema but is 0% populated

`ghanchi-cms/src/api/testimonial/content-types/testimonial/schema.json` defines an `image` media field (single, images-only). Querying all 11 testimonials with `populate=*` returns `image: null` for every single one. This means the `Person` component's photo path is never exercised in production for testimonials — every testimonial on the live site renders as text initials only (the `person-initials` fallback in `src/components/ui.tsx:36`), never a real client photo, despite the schema being built to support one.

This is worth an explicit content decision rather than silent by-design: either (a) source real client photos and populate the field (strengthens E-E-A-T/trust signal for testimonials, which the SEO persona flags as valuable), or (b) if client photos will never be available (plausible for a financial-services testimonial dataset — privacy/consent concerns are a legitimate reason), the `image` field should be documented as intentionally unused rather than left as an apparent gap.

---

## Ordering

`order` (integer) fields are present and used consistently across `service` (0-8, matches the 9 services with no gaps or duplicates), `gallery-item` (0-7 for awards, 0-18 for certificates, independent per-category sequences as expected since the frontend queries `filters[category][$eq]=...&sort=order:asc`), and `testimonial` (0-10, 11 records, no gaps). `home-page`'s nested repeatable components (`phases`, `operatingItems`, `comparisonBefore/After`) rely on Strapi's natural component-array order rather than an explicit `order` field — fine, since these are edited as a single page, not filtered/sorted independently.

---

## Published state

`testimonial` and `gallery-item` have `draftAndPublish: true` (confirmed in schema); both have a populated `publishedAt` on every record returned by the public API (Strapi's public REST endpoint only returns published entries by default, so a draft item would simply be invisible rather than erroring — this audit cannot distinguish "no drafts exist" from "drafts exist but are correctly hidden" without an authenticated admin-API query, which was out of scope here). No indication of accidentally-unpublished content: every service, article, and team member expected by the frontend's `generateStaticParams` calls resolves successfully (verified by fetching all 9 service detail pages' and both article pages' slugs against the live API).

---

## Content that should be CMS-managed but isn't, or vice versa

- **Should be CMS-managed but isn't**: `/contact-us` page metadata (title/description) is hardcoded in `src/app/contact-us/page.tsx` instead of reading the already-existing `contact-page.intro.metaTitle`/`metaDescription` fields (currently `null` in Strapi, confirmed via API — the fields exist and are simply unfilled/unused). See `FRONTEND_ARCHITECTURE_AUDIT.md` P2 for the code-side fix; on the content side, once the frontend is fixed an editor should also fill in those two fields in the `contact-page` singleton (currently blank).
- **`verificationState`** (`unreviewed`/`owner-approved`, added to `testimonial` and `gallery-item` this session per `docs/CURRENT_IMPLEMENTATION_PLAN.md` Section "Phase 4") is confirmed present and backfilled to `unreviewed` on all 38 records (11 testimonials + 27 gallery items, verified live). This is intentionally an internal editorial-tracking field, not surfaced on the public frontend — status quo is correct, no action needed; flagging only so the site owner is aware every record is still sitting at `unreviewed` and nothing has been marked `owner-approved` yet if/when that workflow is actually used.
- **Category taxonomy is thin relative to the service catalog**: only 2 `category` records exist (`retirement-planning`, `insurance`) against 9 services. Both currently-published articles use `retirement-planning`. This isn't a bug — categories exist to classify the 2 articles that exist today — but it means only 1 of 9 services has any matching blog content at all right now (see `SEO_AUDIT.md` for the resulting internal-linking implication). Not something to build around yet; noted for when the ~23-article backlog (open business decision per the brief) is addressed, since new articles should ideally get categories that map onto the other 8 service slugs too.
