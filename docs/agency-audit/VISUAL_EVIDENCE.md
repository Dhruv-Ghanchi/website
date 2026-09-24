# Visual Evidence

Raw evidence gathered once, centrally, via `scripts/agency-evidence.mjs` (removed after use — this file plus the outputs under `evidence/` are the permanent record). Used as the shared basis for every specialist review in this audit rather than each specialist re-scraping the same two sites independently.

## Method

Playwright (Chromium, real browser, not a static fetch) visited each URL, waited for network idle + 1.5s settle, then captured:
- A screenshot (`evidence/screenshots/*.png`) — full-page at mobile width, viewport-only at desktop width.
- Computed styles (`getComputedStyle`, not source CSS — reflects what's actually rendered) for the header, first nav link, `<h1>`, a "primary button"-like element, and the footer.
- The live root CSS custom properties (`--font-body`, `--accent`, `--ink`, etc.) where present.

Raw data: `docs/agency-audit/evidence/computed-styles.json`.

## Pages captured

| Label | URL | Widths |
|---|---|---|
| `kora-home` | https://kora.framer.media/ (live reference) | 1440×1000, 390×844 |
| `ghanchi-home` | http://localhost:3100/ | 1440×1000, 390×844 |
| `ghanchi-service` | http://localhost:3100/services/life-insurance | 1440×1000, 390×844 |
| `ghanchi-about` | http://localhost:3100/about-us | 1440×1000, 390×844 |

## Known methodology limitation — read before citing colors/buttons from this evidence

The `navLink` and `primaryButton` selectors on Kora's site returned `rgb(0, 0, 238)` (the browser's default unvisited-link blue) for color. This is almost certainly a measurement artifact, not Kora's real rendered color: Framer typically wraps a link's visible text in a nested `<span>` with its own `color`, while the outer `<a>` itself is left at the browser default. `getComputedStyle` on the outer element then reads that default rather than what a viewer actually sees. **Do not treat any `rgb(0, 0, 238)` reading in `computed-styles.json` as a real Kora color** — it was already identified and correctly dismissed earlier in this project's own template-fidelity audit (`docs/CURRENT_IMPLEMENTATION_PLAN.md` documents the same artifact from an earlier `hover-audit.mjs` run).

Similarly, the generic `primaryButton` selector (`a[class*="button"], button, .button, a.cta`) matches whatever such element appears *first in DOM order* on each page, which is not reliably "the hero CTA" on every route — on Ghanchi's pages it mostly matched a small circular icon button, not the actual primary call-to-action. Treat `primaryButton` readings as "first button-like element found," not "the hero CTA," unless a specialist verified the specific element separately.

## Reliable, high-confidence findings from this pass

- **Home hero typography is computed-identical between Kora and Ghanchi at desktop**: `fontSize: 80px`, `lineHeight: 84px`, `letterSpacing: -3.2px`, `fontFamily: Manrope Variable` (Kora) vs `Manrope` (Ghanchi, self-hosted equivalent) on both sites' `<h1>`. This is strong, direct evidence that the home hero's typographic scale was faithfully carried over — not a claim from documentation, a real computed-style match.
- Ghanchi's service-detail (`/services/life-insurance`) and about-us hero headings use a **different scale** from the home hero: 72px/500-weight/-3.6px tracking (service) and 80px/500-weight/-4.4px tracking (about-us), vs. the home hero's 80px/400-weight/-3.2px. This is a real, measured difference — whether it's an intentional secondary heading scale (likely, since inner pages use a different component than the home hero) or an unintended inconsistency is a design-review question, addressed in `KORA_VS_GHANCHI_COMPARISON.md`.
- Ghanchi correctly exposes its design tokens as CSS custom properties (`--accent: #59c29f`, `--ink: #242424`, etc.) readable straight from `:root` — Kora's Framer export does not expose equivalent named tokens (framework difference, not a fidelity gap).
- At 390px mobile width, Ghanchi's top-level `nav a` and button selectors return 0×0 (no visible match) — consistent with the primary nav being collapsed behind a hamburger menu on mobile, not a bug, but noted so it isn't misread as "no navigation exists" by a specialist working only from this JSON.

## Screenshots

Stored at `docs/agency-audit/evidence/screenshots/`:
`kora-home-desktop.png`, `kora-home-mobile.png`, `ghanchi-home-desktop.png`, `ghanchi-home-mobile.png`, `ghanchi-service-desktop.png`, `ghanchi-service-mobile.png`, `ghanchi-about-desktop.png`, `ghanchi-about-mobile.png`.

These are local PNG files (not embedded here) — view them directly with an image-capable tool, or open the folder.
