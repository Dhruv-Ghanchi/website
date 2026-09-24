# SEO Audit — Ghanchi Investments

Persona: SEO Specialist (`docs/agency-audit/roster/marketing-seo-specialist.md`). All findings verified against the rendered HTML from the live Next dev server (`curl http://localhost:3100/...`) and the JSON-LD extracted and `JSON.parse`d from that HTML — not assumed from source code alone. Real article slug used: `single-woman-retiring-solo-is-a-dream-retirement-life-but-with-proper-planning` (fetched live from `GET /api/articles`).

---

## P1 — Article JSON-LD `url` field is a relative path, not an absolute URL

`src/lib/structured-data.ts:42-54`:

```ts
export function articleJsonLd(article: {...}, url: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    image: article.coverImage ? [new URL(article.coverImage, SITE_URL).href] : undefined,
    datePublished: article.publishDate,
    url,                              // <-- passed through verbatim, never resolved
    isBasedOn: article.sourceUrl || undefined,
  };
}
```

The caller, `src/app/blog/[slug]/page.tsx:27`, passes a bare relative path: `articleJsonLd(article, \`/blog/${slug}\`)`. Fetching the live article page and parsing its JSON-LD confirms the bug in production output:

```json
{
  "@type": "Article",
  "headline": "Single Woman, Retiring Solo Is a Dream Retirement Life (but) With Proper Planning!",
  "url": "/blog/single-woman-retiring-solo-is-a-dream-retirement-life-but-with-proper-planning",
  "isBasedOn": "https://ghanchiinvest.com/single-woman-retiring-solo-is-a-dream-retirement-life-but-with-proper-planning/"
}
```

Schema.org's `url` property expects a fully-qualified URL (the same page also correctly demonstrates the right pattern two ways: `image` on this same object *is* resolved via `new URL(..., SITE_URL).href`, and `breadcrumbJsonLd()` at `structured-data.ts:56-67` correctly does `new URL(item.url, SITE_URL).href` for every breadcrumb entry). Google's Rich Results Test and Search Console's structured data report both flag non-absolute URLs in `url`/`@id`-type fields as invalid. Fix is a one-line change: resolve `url` through `new URL(url, SITE_URL).href` the same way `breadcrumbJsonLd` already does, or better, have callers pass the resolved URL and drop the inconsistency between the two builder functions.

---

## P1 — Home page has no `<link rel="canonical">`

Every inner route sets `alternates: { canonical: ... }` in its `generateMetadata` — confirmed present in the rendered `<head>` for `/services/life-insurance`, the blog article, `/about-us`, `/about-us/awards`, `/blog`, `/services`. The home page does not: `src/app/page.tsx` (`Home`) has no `generateMetadata` export at all, and `src/app/layout.tsx`'s `generateMetadata` (the only metadata source for `/`) sets `metadataBase`, `title`, `description`, `openGraph`, `icons` — but never `alternates.canonical`. Confirmed by fetching `/` and grepping for `rel="canonical"`: zero matches, versus one match on every other fetched route. Since `metadataBase` is set, Next.js would happily resolve a relative canonical if one were declared — it simply isn't. Fix: add `alternates: { canonical: '/' }` either to `page.tsx`'s own `generateMetadata` or conditionally in the layout.

---

## P2 — Home page has no Open Graph image, so social shares of the homepage show no preview image

`src/app/layout.tsx:15`'s `openGraph` object sets `title`, `description`, `type`, `siteName` but no `images`. Confirmed on the live rendered `<head>` for `/`: `og:title`, `og:description`, `og:site_name`, `og:type` are all present; `og:image` is absent. By contrast, the service detail page (which sets `openGraph.images` in its own `generateMetadata`, `src/app/services/[slug]/page.tsx:16`) does render `og:image` correctly. A homepage shared on LinkedIn, Facebook, or WhatsApp — the most likely share target for a small financial-advisory site — will show a text-only card with no image. `siteSettings.heroImage` is already fetched in the layout's sibling data and would be a natural default `og:image` for the root layout and any inner page that doesn't set its own.

---

## P2 — Structured data: `Article` type omits `author`, which Google's guidelines treat as required

Checked against schema.org's `Article` spec and Google's structured-data documentation for `Article`/`BlogPosting`/`NewsArticle`: schema.org itself makes no property strictly mandatory, but Google's eligibility requirements for Article-family structured data specifically list `author` (with a `name`) as required, and `publisher`/`dateModified` as strongly recommended. The current `articleJsonLd()` builder (`structured-data.ts:42-54`) sets `headline`, `image`, `datePublished`, `url`, `isBasedOn` — no `author`. Given the site's articles are explicitly "condensed adaptations" of archive content attributed to the firm rather than a named journalist (confirmed via each article's `editorialNote` field, e.g. "A condensed adaptation of our March 2021 archive article"), the correct fix is an `Organization`-type author (`{ "@type": "Organization", "name": "Ghanchi Investments" }`), not inventing a named byline — consistent with the project's existing rule (`structured-data.ts:4-7` comment) to never fabricate facts in JSON-LD.

---

## Verified correct — heading hierarchy (no violations found)

Fetched and parsed the full heading sequence (`<h1>` through `<h6>`, in document order) for `/`, `/services/life-insurance`, the blog article, `/about-us/awards`, `/about-us`, `/blog`, `/services`. Every page has **exactly one `<h1>`**, and every subsequent heading level increases or holds rather than skipping (e.g. home page: `h1 → h2 → h2 → h3 → h3 → h2 → h3 → h4 → ...`, never jumping from `h2` straight to `h4`). No fix needed here.

---

## Verified correct — metadata uniqueness (no templated duplication found)

Sampled title/description pairs across 7 distinct routes, all served through the shared `%s | Ghanchi Investments` template (`siteSettings.siteTitleTemplate`, confirmed via `GET /api/site-setting`) but with genuinely distinct `%s` values and descriptions per page — not a copy-pasted template:

| Route | `<title>` | Description |
|---|---|---|
| `/` | Ghanchi Investments — Plan. Protect. Invest. | Personalized financial planning, insurance and investment support... |
| `/services/life-insurance` | Life Insurance \| Ghanchi Investments | Life insurance helps provide financial protection for your family... |
| `/blog/...retiring-solo...` | Single Woman, Retiring Solo Is a Dream Retirement Life (but) With Proper Planning! \| Ghanchi Investments | Retiring independently calls for a plan that considers... |
| `/about-us/awards` | Awards \| Ghanchi Investments | Photographs from the Ghanchi Investments awards archive. |
| `/about-us` | About Us \| Ghanchi Investments | Meet Chandrakant B. Ghanchi and learn about Ghanchi Investments... |
| `/blog` | Blog \| Ghanchi Investments | Financial education from the Ghanchi Investments archive. |
| `/services` | Services \| Ghanchi Investments | Explore nine financial planning, investment and insurance services... |

No duplication risk found in this sample. One dependency worth flagging: the 4 `about-subpage` records (`awards`, `certificates`, `our-clients`, `testimonials`) all have `metaTitle`/`metaDescription` set to `null` in Strapi — the distinct values shown above only exist because `src/app/about-us/[section]/page.tsx:17` falls back to `page.intro.title`/`description` when the meta-specific fields are blank. This fallback works today, but an editor filling in `metaTitle` differently from the visible `title` (e.g. to add keyword variation) currently has no effect being blank — not a bug, just worth noting that the meta-specific fields are unused in practice.

---

## P2 — Internal linking: articles and their matching service are never cross-linked despite an exact taxonomy match

The `category` taxonomy and `service` catalog share slugs by design: the `retirement-planning` category (`GET /api/categories`) has the identical slug as the `retirement-planning` service (`GET /api/services`), and both of the site's currently-published articles are filed under that category. Despite this exact 1:1 mapping already existing in the data model:

- `src/app/blog/[slug]/page.tsx` (article detail) links only to: the blog index (`BackLink`), the category filter (`/blog?category=...`), other articles (`InsightGrid`), and the external `sourceUrl` — never to `/services/retirement-planning`, even though both live articles are about exactly that topic.
- `src/app/services/[slug]/page.tsx` (service detail) links only to: the services index, up to 3 other services, and the contact form — never to any article in a matching category.

This is a real, low-effort SEO opportunity: a contextual link from the retirement-planning articles to the retirement-planning service page (and back) would pass topical relevance signal between two pages Google should associate, and gives users a natural next step. Every other page type in the app is reasonably well cross-linked (service ↔ service via the "connected services" grid, article ↔ article via "keep exploring", about-us ↔ every about-us subpage via the explore grid) — this specific article-to-service link is the one gap. Low priority to fix broadly until the ~23-article backlog lands (open content decision, not proposing that here), but worth doing for the 2 articles that already exist today since the target page and matching category already exist.

---

## Verified correct — no WordPress route can be reintroduced

Confirmed live against the running app: `/wp-admin`, `/wp-json`, `/wp-json/wp/v2/posts`, `/xmlrpc.php`, `/wp-content/plugins/elementor`, `/wp-login.php` all return **404**. (`/wp-admin/` with a trailing slash returns a `308` — but only Next.js's own trailing-slash normalization to `/wp-admin`, which then 404s; not a resurrected WordPress route.) None of the findings above require recreating any WordPress path — all fixes are either in `src/lib/structured-data.ts`, `src/app/layout.tsx`, or content entry in Strapi.

`robots.txt` currently returns `Disallow: /` for the entire site on this local environment — this is the intentional fail-safe in `src/app/robots.ts` (`disallow: '/'` whenever `SITE_URL` is unset), not a bug; confirming here only so it isn't mistaken for a new finding. Production deploys must have `SITE_URL` set or the entire site stays deindexed.
