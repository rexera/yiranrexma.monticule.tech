# yiranrexma.monticule.tech

The personal homepage of **Yiran Rex Ma** (马义然) — a bilingual (English / 中文) academic site built with Next.js 16 (App Router), React 19, and Tailwind CSS.

This site is adapted from [Ronchy2000/Academic-Homepage-Template](https://github.com/Ronchy2000/Academic-Homepage-Template) — many thanks for the excellent starting point. The template's own documentation still lives under [`docs/`](./docs) and is useful as background reading; this README is the **maintenance guide for this specific site**.

## Site structure

Everything on the pages is **content-driven**: copy and data live in `content/`, so day-to-day edits rarely touch components.

```
content/
  site.json               # global i18n config — bilingual vs single-locale
  profile.json            # name, affiliation, socials (incl. QR platforms), avatar
  updates.json            # Home "Updates" news timeline (hand-maintained!)
  publications.json       # papers / patents / preprints list
  timeline.json           # education & experience entries (CV page)
  awards.json             # honors
  pages/*.json            # per-page copy (home, blog, publications, cv, story)
  blog/{en,zh}/*.mdx      # blog posts (missing locale falls back per slug)
  publications/*.mdx      # long-form bodies for publication detail pages
  about/{en,zh}.mdx       # the Story page

app/(site)/[locale]/     # all real pages, statically built per locale
components/              # UI components (server; "-client" files are interactive)
lib/                     # content loaders, MDX pipeline, GitHub commits fetch
scripts/new-post.mjs     # blog post scaffold
public/images/           # avatar, QR codes, logo, post images
```

A few things worth knowing:

- **Home page** composes three zones: hero + At a Glance, the hand-curated **Updates** news timeline, and a **Latest commits** strip. The commits are fetched from the GitHub API **at build time** — every push redeploys, so the strip (and the footer's "last updated" date) are always current. `github-actions[bot]` commits are filtered out.
- **Story** (`/[locale]/experience`) renders `content/about/*.mdx` through the same MDX pipeline and typography as blog posts.
- **Deployments**: Vercel by default (`proxy.ts` handles locale entry redirects). `EDGEONE=1 npm run build` produces a static export in `out/` for EdgeOne Pages.

## Managing the content

### Personal updates (Home timeline)

Edit [`content/updates.json`](./content/updates.json). Each entry:

```json
{
  "date": "2026-05-10",
  "type": "Publication",
  "title": "CLASE: Chinese Stylistic Evaluation",
  "summary": "One-sentence description shown under the title.",
  "link": "https://doi.org/..."   // "" for no link
}
```

Newest first is conventional; entries are sorted by date automatically. Only `date`, `title`, and `summary` are displayed. **This file is maintained by hand** — the nightly workflow that used to overwrite it with commit history has been removed (the commit history now lives in its own carousel instead).

### Publications

Edit [`content/publications.json`](./content/publications.json). Each entry:

```json
{
  "id": "clase-2026",
  "type": "C",                    // C = conference, J = journal, P = patent, S = submitted
  "slug": "clase",               // optional — creates a detail page
  "title": "...",
  "authors": "...",
  "venue": "...",
  "year": "2026",
  "tags": ["Stylistic Evaluation"],
  "links": [{ "label": "DOI", "href": "https://doi.org/..." }],
  "notes": "..."
}
```

To give a publication a full detail page, add `content/publications/<slug>.mdx` with the long-form body (Markdown/MDX: math, code, figures, and Mermaid/Plotly blocks are all supported).

### Blog

Scaffold a new post:

```bash
npm run new:post -- --locale en --slug my-post --title "My Post" [--type research]
```

This creates `content/blog/en/my-post.mdx` with `draft: true`. Frontmatter:

```yaml
title: "My Post"
date: "2026-08-28"
summary: "Shown on the blog index."
tags: [Note]
type: note        # or "research"
draft: true       # flip to false (or delete the line) to publish
```

Draft posts are hidden from the index and their URLs 404. A post may exist in one locale only — the other falls back automatically. Images go under `public/images/posts/<slug>/`.

### Story page

Edit [`content/about/en.mdx`](./content/about/en.mdx) and [`zh.mdx`](./content/about/zh.mdx). These render with full blog typography (headings, links, images, math). Use `*italics*` rather than `_italics_` — underscores don't parse as emphasis next to CJK characters.

### Profile & sidebar

Edit [`content/profile.json`](./content/profile.json). The `social` array drives the sidebar rows: entries with an `href` become external links; entries with a `qr` path (e.g. `/images/wechat_oa.JPG`) show a hover popover with that image instead of navigating — used for 微信公众号 / 小红书 / 抖音. Replace the QR images in `public/images/` directly.

## Working on the site

```bash
nvm use                 # Node 24
npm ci
npm run dev             # http://localhost:3000
npm run lint            # ESLint — run before every push
npm run build           # production build; also the pre-deploy check
```

Verification is `npm run lint && npm run build` — both must pass before pushing (there is no test suite). Pushing to `master` triggers the Vercel deployment and refreshes the commits strip.

Environment variables (see `.env.example`): `NEXT_PUBLIC_CONTACT_EMAIL_B64` (Base64-encoded contact email shown in the sidebar), `NEXT_PUBLIC_REPOSITORY_URL` (footer link + source for the commits API), and optionally `GITHUB_TOKEN` to lift GitHub API rate limits during builds.

## License

MIT — inherited from the upstream template.
