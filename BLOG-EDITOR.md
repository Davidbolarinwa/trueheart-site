# Blog editor guide

Blog posts are Markdown files in `_articles/`. GitHub Pages builds them into normal pages with
one shared layout (`_layouts/post.html`), the blog page (`blogs.html`) and the sitemap
(`sitemap.xml`). You edit them in **Pages CMS** (https://app.pagescms.org), signed in with the
GitHub account that owns this repo. This file isn't published on the site.

## Add a post

1. In Pages CMS, open **Articles** and click **Add an entry**.
2. Fill in:
   - **Title (H1)**: the headline on the page.
   - **Meta description**: 160 characters or fewer. It's what Google and Facebook show.
   - **Permalink**: the address, e.g. `/caring-for-a-parent-with-dementia.html`. Lowercase
     words and dashes only, starting with `/` and ending in `.html`.
   - **Date published**, **Category label**, **Read time**, **Related services** (1 to 3).
   - Optional: browser-tab title, card text, keep-reading text and posts, end box heading
     and text, social share image.
   - **Article**: the post itself. Use headings (H2 for sections, H3 under them), lists,
     bold, links and tables.
3. Callouts ("Tip from Mary, RN:") are quotes: use the quote button and start with the label
   in bold, e.g. **Tip from Mary, RN:** then the text. They show as the white box with the
   red edge.
4. Leave **Published** off while you write, and save. That's a draft (see below).
5. When it's ready, switch **Published** on and save. Pages CMS commits to `main`, GitHub
   Pages rebuilds, and the post is live within a few minutes. It appears on `/blogs` and in
   the sitemap automatically.

The byline, "Reviewed by a Registered Nurse" line, related services, end box and the
analytics tags come from the layout. You don't add them to the article.

## Drafts

- **Published off** = draft. Drafts are saved in the repo but are **not built at all**: no
  page, not on `/blogs`, not in the sitemap. New posts start as drafts.
- The repo is public, so a draft's text can still be read on GitHub. Don't put anything
  private in a draft.
- To take a published post down, switch Published off. Its URL will then 404, so only do
  this on purpose.

## Images

- Format **WebP**, **under 200 KB**, **1200 px wide** (social share images: 1200 x 630).
- Uploads go to `images/blog/`. Give every image a short description (alt text).
- Without a share image, posts use the standard Bonhearts image (`/og-image.png`).

## Rules

- **A published post's permalink never changes.** Google, ads and links from other sites
  point to it, and GitHub Pages can't redirect. If a title changes, keep the old permalink.
- Use **Date last updated** when you make a real content change. It updates the post's
  structured data and the sitemap.
- Spelling: "Bonhearts Home Care" (never BonHeart or Bon Hearts). Service area: Winnipeg,
  Selkirk, Lockport, West St. Paul and East St. Paul. CTA wording: "Get Your Free Care Plan".
- Pages that aren't blog posts are plain HTML and aren't in Pages CMS.

## For developers

- Local build (same versions as GitHub Pages, Jekyll 3.10 / github-pages 232):
  `~/.jekyll-ghpages/build.sh <repo> <output folder>` (Mac, outside this repo).
- `_data/services.yml` lists the services for the Related services block. `live: false`
  hides an entry (the dementia page until it exists).
- Front matter defaults (author, byline, default image, `published: false`) are in
  `_config.yml`.
