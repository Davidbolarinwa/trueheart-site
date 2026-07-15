# BonHeart Home Care — Website

Static marketing site and blog for BonHeart Home Care (Winnipeg, MB). No build step, no dependencies — plain HTML/CSS/JS, deployable as-is to any static host (GitHub Pages, Netlify, S3, etc.).

## Structure

- `index.html` — landing page: hero, founders, pricing, guarantee, FAQ, blog index, and a multi-step lead-qualification form.
- `*.html` (10 files) — SEO blog articles linked from the landing page's blog section.

## Lead form

The form on `index.html` (`#get-started`) is a 7-step JS wizard that validates input client-side, scores leads (hot/warm/nurture/out-of-area/budget-mismatch), and routes to a matching success screen.

On submit, it POSTs the collected data as JSON to a webhook configured in the `FORM_ENDPOINT` constant near the bottom of `index.html`. Currently wired to a Make.com scenario. Swap that URL to repoint the form at a different backend (Formspree, another Make.com webhook, etc.) — see the inline comment above the constant.

## Local development

No build step required — open `index.html` directly in a browser, or serve the directory with any static file server, e.g.:

```
python3 -m http.server 8000
```
