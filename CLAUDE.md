# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Static marketing site + blog for **BonHeart Home Care** (Winnipeg, MB), recently rebranded from "TrueHeart". No build step, no package manager, no dependencies — plain HTML/CSS/JS. Deployed as static assets via Cloudflare Workers (see `wrangler.jsonc`, `assets.directory: "."`).

## Commands

- **Local dev**: no build step. Open any `.html` file directly, or serve the directory:
  ```
  python3 -m http.server 8000
  ```
- **Deploy**: Cloudflare Workers static assets (`wrangler.jsonc`, worker name `bonhearts`). Deploy with `wrangler deploy` if the user asks — do not deploy proactively.
- There is no test suite, linter, or build/bundle step in this repo.

## Structure

- `index.html` — the entire landing page (hero, founders, pricing, guarantee, FAQ, blog index, and the lead-qualification form) in one file, including all CSS in a `<style>` block and all JS in `<script>` tags at the bottom.
- 10 standalone blog article pages (`*.html` at repo root, e.g. `aging-in-place-home-safety-seniors.html`), each linked from `index.html`'s blog section.
- 8 service detail pages, one per service in the nav's "Services" dropdown, all built from one shared template (see **Service page template** below): `personal-care-services.html`, `post-hospital-convalescent-care.html`, `overnight-respite-care.html`, `senior-care.html`, `companionship-outings.html`, `household-support.html`, `specialized-care.html`, `disability-support-services.html`.
- `CNAME` — custom domain for GitHub Pages (`bonhearts.ca`).
- `sitemap.xml`, `robots.txt` — **still reference the old `trueheartshomecare.ca` domain**; check before trusting them as current, and flag/update alongside any other rebrand cleanup.

## Architecture notes

- **Every HTML file is fully self-contained.** There is no shared CSS/JS file, no templating, no includes. Each page (`index.html` and every blog article) duplicates its own `<style>` block with the same CSS custom properties (`--ink`, `--paper`, `--heart`, `--sage`, etc. — the brand palette) and its own copy of shared behaviors (nav scroll shadow, `IntersectionObserver`-based scroll-reveal, footer markup). **When changing shared visual/behavioral elements (nav, footer, logo, color tokens, reveal animation), the edit must be repeated across all 11 HTML files by hand** — there's no single source of truth to edit once.
- Blog articles share a common internal layout: a `.page-head`, `.toc` (table of contents), `<article>` body with `h2`/`h3`/callouts/`.cta-box`/`.suggest`/tables, all wired to the same scroll-reveal `IntersectionObserver` pattern at the bottom of the file.
- **Lead form** (`index.html`, `#get-started`): a 7-step client-side JS wizard (no framework). Key pieces, all in the `<script>` block near the bottom of `index.html`:
  - `FORM_ENDPOINT` — a Make.com webhook URL; the form POSTs the final JSON payload here. Swap this constant to repoint the form at a different backend.
  - `IN_AREA_FSA_PREFIXES` / `IN_AREA_FSA_EXACT` — Winnipeg-area Canadian postal FSA allow-list used by `inServiceArea()` to gate the "in area" flag.
  - `scoreLead(d)` — classifies each submission into `hot` / `warm` / `nurture` / `out-of-area` / `budget-mismatch` based on postal area, funding, and timing answers.
  - `validate(i)` — per-step client-side validation (postal code regex, required selects, phone/email format, min-length free text).
  - On submit, routing goes to one of several `#success-*` screens keyed by `lead_score` (`success-qualified`, `success-out-of-area`, `success-budget`, `success-nurture`).
- SEO metadata (title, description, canonical, OpenGraph, Twitter card, and a JSON-LD `HomeHealthCareService`/article schema block) is hand-duplicated in the `<head>` of every page — update all relevant occurrences together when changing site-wide facts (phone number, address, business name). Service pages do **not** carry the JSON-LD block (only `index.html` and blog articles do).
- **Service page template** (all 8 files listed above, rebuilt 2026-09-03 — layout must stay identical across all of them; only copy/imagery differ):
  - `.service-hero` — full-width photo (`<img>` + gradient scrim), `object-fit:cover`, ~45vh, with the page's `<h1>` centered in white on top. Currently reuses the existing small 400×300 service-grid thumbnails (`service_img3.webp`–`service_img10.webp`, one per service, mapped from `index.html`'s `#services` grid) stretched to fill — these are soft at hero size; swap in real full-resolution photography when available (just replace the `<img src>`/`object-position` on that one page).
  - `.promise` section — centered `<h2>` promise headline, then the site's `.heartline` SVG (an EKG-pulse-style accent-red signature stroke that draws in on scroll — was defined in `index.html`'s CSS but unused/orphaned there; now the active "hand-drawn underline" token for these pages), then a short `<p class="sub">` supporting line.
  - `.band.dim` CTA band — single `.btn.big` linking to `/get-in-touch` (there's no Calendly integration anywhere in this codebase; every CTA site-wide, including this one, points at `/get-in-touch`).
  - `.detail-list` — one `<p>` per service item, bold lead phrase running into the sentence, no bullets/cards. Copy is scoped to what an HCA/support worker can actually do (no clinical/diagnostic claims).
  - `.service-carousel` / `.service-grid` (cross-links to the other 7 services, rebuilt twice: photo cards on 2026-09-15, converted to a horizontal-scroll carousel on 2026-09-15) — cross-links to the other 7 service pages using the same photo `.service-card` markup/CSS as `index.html`'s `#services` grid (circular photo frame, `h3`, `p`, `.read` "Learn more →"), in homepage order, self excluded. This section's `.wrap` carries an extra `.wide` modifier (`.wrap.wide{max-width:1080px}`, vs. the page's base 720px `.wrap`) so cards get the same per-card width as the homepage's 1080px `#services` section — don't reuse `.wrap.wide` narrower than this without re-checking card text doesn't clip.
    - **Carousel mechanics**: `.service-grid` is a single-row `display:flex` scroller (`overflow-x:auto`, `scroll-snap-type:x mandatory`, native scrollbar hidden via `scrollbar-width:none`/`::-webkit-scrollbar{display:none}`). `.service-card` flex-basis is `82%` (mobile, base) / `44%` (`min-width:641px`) / `22%` (`min-width:901px`) — the same three breakpoints used everywhere else on the page, chosen so a sliver of the next card always peeks at every width. `.service-grid` has `padding:20px 20px 40px` so the first/last cards and the hover-lifted shadow never sit flush against the scroll container's edges.
    - **Arrows**: two real `<button>`s, `.carousel-arrow-prev`/`.carousel-arrow-next` (`aria-label="Previous/Next services"`), absolutely positioned over the row's edges, circular, `var(--heart)`/`var(--heart-deep)` background matching `.btn`, `var(--shadow)`/`var(--shadow-lift)` matching `.service-card`. Disabled natively (`disabled` attribute, not `aria-disabled`) at each end — fades via `.carousel-arrow:disabled{opacity:.35}`. Keyboard focus uses the page's existing global `button:focus-visible` rule (no separate style needed).
    - **Edge fades**: `.carousel-fade-left`/`-right`, `linear-gradient` from `var(--paper-dim)` (the section's own `.band.dim` background) to `transparent`, `pointer-events:none`, hidden via `.service-carousel.is-start`/`.is-end` classes.
    - **JS** (new inline `<script>` block at the bottom, identical on all 8 pages): one IIFE per page queries `.service-carousel`, computes a "one card" scroll distance from the first `.service-card`'s live width + the flex `gap`, and on arrow click calls `track.scrollBy({left, behavior})` — `behavior` is `'auto'` instead of `'smooth'` when `prefers-reduced-motion: reduce` (JS checks this directly, since an explicit `behavior` in `scrollBy` overrides the CSS `scroll-behavior` property). A `scroll`/`resize`-driven `update()` toggles `disabled` on both buttons and `is-start`/`is-end` on the wrapper. Native touch/trackpad scrolling is untouched — no touch listeners, scroll-snap and the browser handle it.
  - Nav, announcement banner, and footer are the same shared components as every other page — see the note above about hand-editing all 11+8 files together.

## Session continuity notes

This section is a running handoff log so a new Claude Code session (desktop app, web app, or another terminal) can pick up where the last one left off without needing the old chat transcript pasted in. Keep entries short; prune old ones once they're no longer relevant.

- **2026-09-15**: Two passes on the "Explore our other home care services" section, both on all 8 service pages. (1) Replaced the icon-based `.cross-grid` with photo `.service-card`s matching `index.html`'s `#services` grid — verified via local headless-Chrome screenshots at ~1400/800/390px (7 cards each, no self-links, links/images resolve, last row of 3 centered on desktop); pushed. (2) Converted that same section from a wrapping grid into a horizontal-scroll carousel (single row, snap points, prev/next arrow buttons, edge fades, reduced-motion support) — see the updated "Service page template" note above for the full implementation. Verified this pass by reading the code/diffing all 8 files and curling each page for 200 (no browser automation, per instruction) — **not yet visually checked in a real browser**; committed but not pushed. Remote: `origin` → `https://github.com/Davidbolarinwa/trueheart-site.git`.
