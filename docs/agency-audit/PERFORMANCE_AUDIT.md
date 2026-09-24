# Ghanchi Investments Frontend — Performance Analysis Report

## Scope note
Per the session brief, this does not re-verify what's already confirmed elsewhere: fonts are self-hosted (Manrope variable woff2, `font-display: swap`, no Google Fonts round-trip — `src/app/globals.css:3`) and `npm audit` on the frontend is clean. This audit specifically closes the two items `docs/QA_REPORT.md` flagged as unverified: (1) whether `src/lib/strapi.ts`'s per-section fetches cause a request waterfall on any single page render, and (2) actual JS bundle size, plus a full image/loading-pattern review per the brief.

## Performance Test Results
No load/stress/endurance testing was performed — this is a pre-launch static/SSG marketing site with ISR (`revalidate: 60s` per `src/lib/strapi.ts:4`), not a service under production traffic, so synthetic load testing would not produce meaningful capacity data yet. This report is a static/build-time and rendering-pattern analysis instead, which is the meaningful class of performance risk at this stage.

## Core Web Vitals Analysis (risk assessment, not field data — no production traffic exists yet)
**Largest Contentful Paint (LCP) risk**: HIGH on the homepage and any service detail page. The LCP candidate on `/` is the hero background image (`src/components/home-hero.tsx:68`, `fetchPriority="high"` — correctly prioritized), but on `/services/life-insurance` the LCP candidate is a **2.1MB unoptimized PNG** served at its original resolution (see Bottleneck Analysis below) — `fetchPriority="high"` here accelerates the *request* but does nothing about the 2.1MB payload itself.
**First Input Delay / Interaction risk**: LOW-MEDIUM. No long synchronous JS was found blocking the main thread; the main risk is bundle size deferring hydration (see Bottleneck Analysis).
**Cumulative Layout Shift (CLS) risk**: LOW-MEDIUM. No `<img>` anywhere in the codebase sets native `width`/`height` attributes (confirmed by a live DOM scan across all 13 audited routes — every image returned `width: null, height: null`), but nearly every image container is pre-sized via CSS (`aspect-ratio`, or `position: absolute; inset: 0` inside a CSS-grid/fixed-size parent), which substitutes for native dimensions in practice. This mitigates but doesn't eliminate risk for any future content image that doesn't fit an existing pre-sized container.
**Speed Index**: Not measured (no synthetic Lighthouse run performed in this pass — dev server, not a representative production build target for Lighthouse numbers); the bundle-size and image-weight findings below are the direct levers.

---

## Bottleneck Analysis

### 1. `next/image` is not used anywhere — confirmed, still true
**Severity**: CRITICAL
**Evidence**: `grep -r "next/image" src/` returns zero matches across the entire codebase. Every image in the app is a raw `<img>` tag.
**Impact**: No automatic responsive `srcset`, no automatic format conversion (WebP/AVIF), no automatic lazy-loading defaults, no automatic sizing/CLS protection from the framework. This is a single architectural decision responsible for most of the other findings below.

### 2. Unoptimized, multi-megabyte service images served at original resolution
**Severity**: CRITICAL
**Evidence** (measured directly on disk, `public/assets/`):
| File | Size |
|---|---|
| `ghanchi-service-health-insurance.png` | **2,056,778 bytes (2.0MB)** |
| `ghanchi-service-life-insurance.png` | **2,181,572 bytes (2.1MB)** |
| `ghanchi-service-financial-planning.png` | **1,033,331 bytes (1.0MB)** |
| `logo-ghanchi.png` | 177,875 bytes |

These are the source files behind the Strapi-served versions rendered on the live page. Confirmed live: the `/services/life-insurance` hero image request (`fetchPriority="high"`) resolves to `ghanchi_service_life_insurance_9847e4f1a2.png` at **naturalWidth 768 × naturalHeight 1376**, rendered on-screen at only **625×540 CSS px** — i.e., the browser downloads a full ~2.1MB, 768×1376 PNG and scales it down by roughly 20% for display. Confirmed via `src/lib/strapi.ts:6-17`'s own code comment: *"PNG re-encoding can sometimes bloat past the original (seen on our AI-generated service images), so we only use a derivative when it's actually smaller than the file it was resized from"* — for these three specific images, Strapi's auto-generated `medium`/`large` derivatives are apparently *larger* than the source PNG (a known symptom of re-encoding a already-lossy or high-entropy AI-generated PNG), so the fallback logic serves the **original, full-size file** to every visitor. The homepage `ServicesSection` cards independently render the same images down to **645×660 CSS px** (confirmed via live DOM: `naturalW`/`naturalH` unavailable pre-scroll due to `loading="lazy"`, but they resolve to the same unprefixed original filenames as the life-insurance hero).
**Recommended fix**: Convert these three source PNGs to WebP/AVIF (or re-export at a sane max dimension, e.g. 1200px, before upload) so Strapi's derivative pipeline has a sane baseline to shrink from; this is a content/asset problem, not a code problem, and was already flagged as an open item in the existing implementation plan's media-classification backlog.

### 3. Home page and service-card `<img>` are unnecessarily client-rendered inside heavy "use client" boundaries
**Severity**: HIGH
**Evidence**: `grep -rl "use client" src/components/` returns 6 files: `faq.tsx`, `home-sections.tsx`, `site-shell.tsx`, `ui.tsx`, `home-hero.tsx`, `contact.tsx`. Between them, these client components render **every major section of the homepage** — `Hero`, `Comparison`, `ServicesSection`, `ProcessSection`, `TeamSection`, `TestimonialsSection`, `FeaturedCase`, `FAQ`, `ContactSection` are all declared inside "use client" modules (imported into the server component `src/app/page.tsx`), each pulling in `motion/react` (`package.json`: `"motion": "12.34.0"`) for scroll-linked animation. This means the entire homepage's interactive/visual layer — including large static content blocks like the services list and the FAQ accordion — ships and hydrates as client JS, rather than only the specific pieces that need interactivity (e.g., the accordion toggle state, the scroll-linked hero transforms) being isolated into small client islands with the surrounding static markup left as server-rendered content.
**Impact**: Larger client JS payload than necessary, deferred interactivity/hydration on a content-heavy first-load page, all measured in Bundle Size below.
**Recommended fix**: Not a quick fix — would require restructuring components so static content (deliverables lists, card copy, FAQ question text) is server-rendered and only the minimal interactive wrapper (toggle button, motion transform) is a client leaf. Flagging as an architectural finding, not a one-line patch.

### 4. No request waterfall — data-fetching pattern is correctly parallelized (previously "unverified," now confirmed)
**Severity**: N/A — verified as a non-issue
**Evidence**: Every page component was checked. `src/app/page.tsx:8`:
```js
const [homePage, siteSettings, contactPage, faqItems, services, testimonials, teamMembers, articles, categories, newsletters, awards] = await Promise.all([...]);
```
`src/app/services/[slug]/page.tsx:21`: `const [services, page, siteSettings] = await Promise.all([...]);`. `src/app/layout.tsx:20`: `const [navigation, siteSettings, legalPages, teamMembers] = await Promise.all([...]);`. Every other route file (`about-us`, `about-us/[section]`, `blog`, `blog/[slug]`, `contact-us`, `newsletters`, `online-services`, `services`, `[legal]`) was grepped for `await get[A-Z]` calls: each route makes either a single fetch or fetches that are already inside a `Promise.all`. No route issues a sequential chain of dependent `await` calls to Strapi. `layout.tsx`'s `generateMetadata()` and `RootLayout()` both independently call `getSiteSettings()`, and each page additionally calls it again inside its own `Promise.all` — this looks redundant on paper, but Next.js's `fetch()` patch automatically dedupes identical-URL/identical-options requests within a single render pass, so this does not produce duplicate network round-trips in practice.
**Conclusion**: The concern flagged in `docs/QA_REPORT.md` Section 23 as unverified is now closed — there is no waterfall.

### 5. Bundle size — Next.js 16 Turbopack no longer prints a First Load JS table; measured directly from build output instead
**Severity**: MEDIUM (informational baseline, correlates with Finding 3)
**Evidence**: `npm run build` ran to completion successfully (Turbopack, Next.js 16.3.4). The build output no longer prints the classic per-route "First Load JS" size table that older webpack-based Next builds did (confirmed: the printed route table has only Route/Revalidate/Expire columns, no size column) — this is a Next 16 Turbopack build-output change, not a measurement gap on this audit's part. Measured directly from `.next/static/chunks/*.js` on disk instead:
| Chunk | Size |
|---|---|
| Largest chunk | 224KB |
| 2nd largest | 164KB |
| 3rd largest | 160KB |
| 4th largest | 112KB |
| (8 smaller chunks) | 4KB–32KB each |
| **Total client JS (all chunks)** | **~795KB** uncompressed |
| Root/shared chunks (loaded on every route) | **~429KB** uncompressed (`rootMainFiles` in `.next/build-manifest.json`) |

Roughly 429KB of JS is a shared baseline cost on every single route before any page-specific code, consistent with Finding 3 (motion/react + lucide-react + the six "use client" component modules being part of the common bundle). These are uncompressed on-disk sizes; real network transfer would be smaller after gzip/brotli, but this was not separately measured since no production server (with compression enabled) was running during this audit.
**Recommended fix**: Route-split and reduce client-component surface area per Finding 3; audit whether `lucide-react` icon imports are tree-shaken per-icon (they should be, but worth confirming with a bundle analyzer given the icon variety used across `ui.tsx`, `site-shell.tsx`, `home-sections.tsx`, etc.).

### 6. Logo served at ~10x its rendered resolution
**Severity**: LOW
**Evidence**: `logo-ghanchi.png` / the Strapi-served `logo_ghanchi_f393433b99.png` resolves to **738×333 natural pixels**, rendered in the site header at **75×34 CSS px** (measured live on `/`). Same asset reused at similarly small render sizes in the footer (64×28) and mobile nav — every instance is a fraction of the natural resolution.
**Recommended fix**: Either serve an appropriately-sized derivative (Strapi already generates `small`/`thumbnail` formats that aren't currently consumed for the logo — `src/lib/strapi.ts`'s `mediaUrl()` only checks `medium`/`large`) or pre-export a correctly-sized static logo asset.

### 7. `loading`/`fetchPriority` usage is otherwise a genuinely good pattern
**Severity**: N/A — positive finding
**Evidence**: `grep -rn 'loading=\|fetchPriority' src/` shows a consistent, correct pattern: hero and above-the-fold LCP-candidate images use `fetchPriority="high"` with no `loading` attribute (so they're eager by default) — `home-hero.tsx`'s hero image, `services/[slug]/page.tsx`'s service hero image, `blog/[slug]/page.tsx`'s article cover. Everything else below the fold (service card images, team photos, testimonial backgrounds, insight cards, gallery grids) consistently uses `loading="lazy"`. This is exactly the right pattern in the absence of `next/image`'s automatic behavior — it was clearly done deliberately, not by accident.

---

## Performance ROI Analysis
**Optimization costs**: Findings 1–2 (image pipeline) are the highest-leverage, lowest-engineering-cost fix — re-exporting 3 source images is not a code change. Finding 3 (client-component architecture) is the highest-cost, most structural fix. Finding 5 (bundle size) is a downstream consequence of Finding 3, not independently actionable.
**Performance gains**: Fixing Findings 1–2 alone would cut the heaviest single-page payload (life-insurance service page) by roughly 2MB — the single largest lever available on this site today.
**Business impact**: The homepage and service pages are the primary conversion surfaces (`Get Started`, `Send enquiry` CTAs); LCP delay on a 2MB image directly gates when a first-time visitor sees usable content.

## Optimization Recommendations
**High-Priority**: Re-export/compress the three oversized `public/assets/ghanchi-service-*.png` source images (Finding 2); this alone resolves the worst LCP risk on the site.
**Medium-Priority**: Right-size the logo asset (Finding 6); confirm gzip/brotli is enabled at the eventual hosting layer (not yet deployed — no production environment exists per the current implementation status report) so the measured ~795KB uncompressed JS figure isn't the real wire cost.
**Long-Term**: Adopt `next/image` (Finding 1) and restructure the homepage's client/server component boundary (Finding 3) — both are real architectural investments, not quick patches, and should be scoped as their own work rather than folded into this audit's immediate fixes.
**Monitoring**: Once a production/staging environment exists (none does yet, per the current implementation status), add a Lighthouse CI run and real Core Web Vitals field monitoring (CrUX or RUM) — none of the numbers in this report are field data, they're static build/asset analysis, and should be superseded by real measurements once there's a deployable target.

---
**Analysis Date**: 2026-09-25
**Performance Status**: Cannot yet be scored against a formal SLA — no production deployment exists. Static analysis surfaces two CRITICAL and one HIGH finding that should be resolved before launch.
**Scalability Assessment**: Not assessed — this is a low-traffic marketing/advisory site with ISR caching (60s revalidate) sitting in front of a single local Strapi instance; no scaling posture has been defined or tested, and none was in scope for this pass.
