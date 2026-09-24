# Frontend & Senior Developer Audit — Ghanchi Investments

Personas: Frontend Developer + Senior Developer (`docs/agency-audit/roster/engineering-frontend-developer.md`, `engineering-senior-developer.md`). Scope: `src/lib/strapi.ts`, `src/lib/content.ts`, `src/components/*.tsx`, `src/app/**/page.tsx`, `src/app/globals.css`/`inner.css`/`contact.css`, `package.json`. All findings verified by reading the actual source and, where noted, by querying the live Strapi API (`localhost:1337`) and Next dev server (`localhost:3100`).

---

## Architecture verdict (answering the brief directly)

**The current architecture — typed per-content-type REST fetches (`src/lib/strapi.ts`) with explicit `mapX()` functions into app-owned types (`src/lib/content.ts`), no dynamic-zone page builder — is still the right call. No new evidence justifies revisiting it.**

Evidence for keeping it simple:
- 20 Strapi content types (`ghanchi-cms/src/api/*`), each with a small, stable, hand-countable shape. `getX()`/`mapX()` pairs in `strapi.ts` are ~5-10 lines each and read linearly top to bottom (lines 49-425).
- Every route (`src/app/**/page.tsx`) calls 2-6 `getX()` functions via `Promise.all` and passes plain typed props to server/client components — no generic block-renderer, no `switch` on component type. This is easier to trace and typecheck than a dynamic zone would be for a site this size.
- Total live content volume is small (9 services, 2 articles, 11 testimonials, 1 team member, 27 gallery items — confirmed via Strapi pagination `meta.pagination.total`). A page-builder's main payoff (non-developers composing arbitrary page layouts) has no audience yet; the site has one editor per `docs/QA_REPORT.md` Phase 5.
- `src/lib/content.ts` is confirmed types-only: it holds only type declarations plus four helpers (`asset`, `getCategory`, `formatDate`, `formatIssue`, `safeUrl`) — no hardcoded business data. Grepped every `from '@/lib/content'` import in `src/` (7 files): all import types or the helper functions, none import stale content arrays.

Recommendation: keep the current pattern. Revisit only if content volume grows an order of magnitude or a second editor needs freeform page layouts.

---

## P1 — Strapi `alternativeText` is fetched but never surfaced anywhere

`src/lib/strapi.ts:28` defines `alternativeText?: string | null` on `StrapiMedia`, and it **is** populated in the CMS for some records (verified via `GET /api/services?populate=*`):

| Service slug | `image.alternativeText` in Strapi |
|---|---|
| financial-planning | "Financial advisor reviewing a client's financial goals plan" |
| life-insurance | "Illustrative life insurance and savings growth imagery" |
| health-insurance | "Illustrative health insurance planning imagery" |
| mutual-funds, retirement-planning, child-education-planning, personal-accidental-policy, general-insurance, employer-employee-insurance | `null` (6 of 9) |

But grepping the whole `src/` tree for `alternativeText` returns exactly **one match** — the type declaration itself. No `mapService`, `mapArticle`, `mapGalleryItem`, `mapTeamMember`, or `mapTestimonial` function reads or returns it, and `mediaUrl()` (strapi.ts:12-17) discards it. The result is that the three services with real, specific CMS alt text render with **hardcoded, generic, non-CMS strings instead**, and inconsistently across pages:

- `src/components/home-sections.tsx` (`ServicesSection`, the service card `<img>`): every service image gets the literal same string `alt="Illustrative financial planning imagery"` regardless of which service it is.
- `src/app/services/[slug]/page.tsx:26`: the same image on the detail page instead gets `alt={\`${service.title} collaboration\`}` — a second, different hardcoded template.
- `src/app/blog/[slug]/page.tsx:30`: every article cover image gets the literal same string `alt="Illustrative editorial photography"`, regardless of article — even though the article has a real, specific title available.

Net effect: the CMS alt-text field that editors can fill in (and have, for 3/9 services) has zero effect on what ships. Fix: extend `StrapiMedia`'s mapped output to carry `alt` through `mapService`/`mapArticle` (fallback to a sensible default only when the CMS field is empty), and use it in place of the hardcoded strings.

---

## P2 — `/contact-us` hardcodes its SEO metadata instead of sourcing it from Strapi like every other route

Every other route's `generateMetadata` pulls `title`/`description` from its CMS page-intro fields (`getServicesPage().intro.metaTitle`, `getBlogPage().intro.metaTitle`, `getAboutSubpage(section).intro.metaTitle`, etc.). `src/app/contact-us/page.tsx:6` breaks the pattern:

```ts
export const metadata: Metadata = { title: 'Contact Us', description: 'Contact Ghanchi Investments in CBD Belapur, Navi Mumbai, to discuss your financial goals.', alternates: { canonical: '/contact-us' } };
```

This is a static export, not a `generateMetadata` call — it never touches `contactPage.intro.metaTitle`/`metaDescription`, even though `ContactPageContent.intro` (strapi.ts:356-373) already carries those fields and the CMS `contact-page` singleton already has an `intro` component with `metaTitle`/`metaDescription` (confirmed via `GET /api/contact-page?populate=*`, currently both `null`, correctly falling through to nothing since nothing reads them). Every other page in the app lets the editor change the SEO title/description in Strapi; this one can only be changed by a developer editing code. Fix: convert to `generateMetadata`, read `contactPage.intro.metaTitle || 'Contact Us'` the same way the about-us subpages already do.

---

## P2 — Duplicated copy-to-clipboard logic (should be a shared hook)

Byte-for-byte identical logic exists in two files:

- `src/components/site-shell.tsx:95-98` (`Footer`)
- `src/components/contact.tsx:40-43` (`ContactIntro`)

```ts
const [copyStatus, setCopyStatus] = useState('');
useEffect(() => { if (!copyStatus) return; const timer = window.setTimeout(() => setCopyStatus(''), 2500); return () => window.clearTimeout(timer); }, [copyStatus]);
const copyEmail = async () => { try { await navigator.clipboard.writeText(contactInfo.email1); setCopyStatus('Copied!'); } catch { setCopyStatus('Select the email address to copy it.'); } };
```

`src/components/ui.tsx` already exists as the shared-primitives file (`Reveal`, `Button`, `Logo`, `Person`, `Dots`, `useReducedMotion`) — this is exactly the kind of cross-cutting UI behavior it should host as a `useCopyToClipboard()` hook. Low risk, quick win, removes ~8 duplicated lines and a future drift risk (the two copies already have subtly different surrounding JSX for the status message).

By contrast, `useSubmission` (contact.tsx) is correctly shared between `ContactSection` and `NewsletterForm`, and `Honeypot` is a correctly-extracted shared component — worth noting as the pattern already proven to work here.

---

## P2 — Contact and newsletter API routes duplicate ~20 lines of request-parsing/validation boilerplate

`src/app/api/contact/route.ts:7-31` and `src/app/api/newsletter/route.ts:4-27` both independently implement, near-identically: the origin/`sec-fetch-site` same-origin check, the `content-type` check, the manual size-capped streaming body reader (`reader.read()` loop with a byte-count guard), the `TextDecoder` + `JSON.parse` wrapping, and the honeypot (`data.website`) check. The only real differences are the size cap (16384 vs 2048 bytes) and the field-specific validation that follows. This is solid, careful code (correct use of `AbortSignal.timeout`, `redirect: 'error'`, `cache: 'no-store'`, strict origin checks) — but it's written twice. Extracting a shared `parseJsonBody(request, maxBytes)` and `verifySameOrigin(request)` into `src/lib/` would cut the duplication and centralize a security-sensitive code path so a future fix (e.g. rate limiting) only needs to land once.

---

## P3 — Minor findings

- **Dead code in `src/lib/content.ts`**: `asset()` (line 13) and `safeUrl()` (line 17) are exported but have zero call sites anywhere in `src/` (grepped both). Leftover from the pre-Strapi implementation; safe to delete.
- **Inefficient legacy-route lookup**: `src/app/insights/[slug]/page.tsx:5-6` calls `getArticles()` (fetches the full article collection) purely to check `articles.some(item => item.id === slug)` before redirecting. `getArticle(slug)` (strapi.ts:111-114) already exists and does a server-side filtered query (`filters[slug][$eq]=...`) for exactly this case — cheaper and clearer.
- **Tailwind is wired into the build but never used**: `globals.css:1,5` does `@import "tailwindcss"` and defines a `@theme inline` block mapping `--font-sans`/`--color-accent`/`--color-ink`/`--color-cream`/`--color-paper` to Tailwind's token system. Grepping every `.tsx` file in `src/` for Tailwind utility class patterns (`flex`, `grid`, `px-`, `items-center`, `bg-accent`, `text-ink`, `font-sans`, etc.) turns up **zero real matches** — every apparent hit is a custom BEM-style class that happens to contain a look-alike substring (e.g. `inner-services-grid`, `chart-grid`). All 1,267 lines of actual styling across `globals.css`/`inner.css`/`contact.css` are hand-written custom CSS using the plain `:root` custom properties defined one line above the `@theme` block. The Tailwind engine (`tailwindcss` + `@tailwindcss/postcss` deps) is currently paying its build-time cost for zero utility-class usage. Either start using Tailwind utilities where it would reduce custom CSS, or drop the dependency and keep the plain `:root` tokens that already exist.
- **Type-unsafe empty-object cast**: `mapService` (strapi.ts:61) does `testimonial: raw.testimonial ? mapTestimonial(raw.testimonial) : ({} as Testimonial)`. This works at runtime only because every call site uses optional chaining (`service.testimonial?.quote`), but the type system now lies — `Service.testimonial` claims to always be a real `Testimonial`. Should be typed `Testimonial | null` for honesty; the `as` cast is a smell that will bite the next person who writes `service.testimonial.quote` without the `?.`.
- **Breakpoint convention drift**: `globals.css:441` uses `@media (max-width: 1200px)` while `contact.css:92` uses `@media (max-width: 1199px)` for what appear to be independent, non-interacting concerns (no shared selector), so this isn't a live bug — but it's a one-pixel inconsistency in an otherwise coherent set of breakpoints (560/700/810/1000/1100/1200/1600) that suggests no single source of truth for breakpoint values across the three CSS files.

---

## Confirmed strengths (verified, not assumed)

- **Client/server boundary is well-drawn.** `src/components/inner-pages.tsx` (PageIntro, RichText, ServiceCard, InsightCard, InnerCTA) has no `"use client"` directive — these render on the server and only import client primitives (`Reveal`, `Button` from `ui.tsx`) where animation genuinely requires it. Every route's `page.tsx` is an async server component doing data fetching directly; interactivity is pushed down into `site-shell.tsx`, `home-hero.tsx`, `home-sections.tsx`, `faq.tsx`, `contact.tsx`, `ui.tsx` — all correctly marked `"use client"` because they use hooks, motion values, or DOM event handlers that require it.
- **Reduced-motion handled centrally and consistently.** `useReducedMotion()` (ui.tsx:14-16) is a single `useSyncExternalStore` subscription to `prefers-reduced-motion`, consumed by every animated component (`Hero`, `Comparison`, `Footer`, `TrustBadge` implicitly via `Dots`, etc.) rather than each component re-implementing the media query.
- **Focal-point and derivative-image logic is centralized** in `mediaUrl()`/`mediaFocal()` (strapi.ts:12-24) with a documented rationale (PNG re-encoding can bloat past original size, so only use a derivative when smaller) — every `mapX()` function reuses it rather than reimplementing image-URL logic per content type.
- **No stale Strapi-migration leftovers found.** `src/lib/content.ts` is genuinely types-only; `src/lib/site-config.ts` (deleted per `git status`) is gone and nothing references it.
