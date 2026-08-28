# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A bilingual (English/Chinese) personal academic homepage — Next.js 16 App Router, React 19, Tailwind CSS. This repo is Yiran Rex Ma's live site, adapted from an academic-homepage-template, so template docs in `docs/` and `README.md` describe the generic template; the actual site keeps only Home / Blog / Publications (with detail pages) / Experience / CV (see `NAV_ITEMS` in `app/(site)/[locale]/layout.tsx`). Legacy `/research`, `/projects`, and `/contact` routes are redirect stubs under `app/(redirects)/`.

## Commands

```bash
nvm use            # Node 24 (.nvmrc)
npm ci
npm run dev        # http://localhost:3000
npm run lint       # ESLint (eslint-config-next)
npm run build      # production build (Vercel-style, server-aware)
EDGEONE=1 npm run build   # static export to out/ for EdgeOne Pages
```

There is no test suite; `npm run lint` + `npm run build` is the verification step (also what `docs/PUBLISH-CHECKLIST.md` asks for).

New blog post scaffold:

```bash
npm run new:post -- --locale en --slug my-post --title "My Post" [--type research]
```

Creates `content/blog/<locale>/<slug>.mdx` with `draft: true`; flip to `false` when publishing.

## Architecture

### Content-driven, not code-driven

Almost all page copy and data live in `content/` — when something on a page is wrong, change the JSON/MDX, not the components:

- `content/site.json` — global i18n config (the one file that drives routing behavior)
- `content/profile.json`, `research.json`, `publications.json`, `projects.json`, `timeline.json`, `awards.json`, `updates.json` — structured site data
- `content/pages/*.json` — per-page copy (home, blog, publications, cv, experience)
- `content/blog/{en,zh}/*.mdx` — blog posts; `content/publications/<slug>.mdx` — long-form publication detail bodies
- `content/about/{en,zh}.mdx` — homepage about text

Localized JSON files are `{ en: {...}, zh: {...} }`; `resolveLocalized` in `lib/content.ts` falls back so a single locale block fills both. Blog posts fall back per-slug via `getBlogPostWithFallback` (`lib/blog.ts`) — a post existing in only one locale is fine.

### i18n pipeline (the core of the repo)

`content/site.json` → `lib/locale.ts`, which parses it at build time into constants (`LOCALES`, `DEFAULT_LOCALE`, `AUTO_DETECT_LOCALE`, `IS_BILINGUAL`) consumed by every route, the proxy, and content loaders. Changing `i18n.mode` / `i18n.primaryLocale` in the JSON changes the whole route tree — never hardcode locale lists elsewhere.

All real pages live under `app/(site)/[locale]/` with `dynamicParams = false` + `generateStaticParams()` → fully static per-locale routes. Two parallel entry-redirect layers put visitors into a locale:

1. `proxy.ts` (repo root) — request-time redirect on Vercel for `/` and known roots; resolution order: `locale` cookie → Accept-Language (only when bilingual mode + empty `primaryLocale`) → default.
2. `app/(redirects)/` — client-side `LocaleRedirect` fallback pages for static-export (EdgeOne) where middleware can't run; same resolution order via `navigator`.

If you add a top-level route, it must be added to `isSupportedRoute` in `proxy.ts` and given a page under `app/(redirects)/`.

### Dual deployment targets

- **Vercel (default)**: standard Next build; `proxy.ts` handles locale entry redirects.
- **EdgeOne Pages**: `EDGEONE=1` flips `next.config.mjs` to `output: "export"` + `trailingSlash` (routes must resolve to `out/<locale>/.../index.html`); images are `unoptimized` everywhere for EdgeOne compat. `edgeone.json` + `edge-functions/` hold its deployment config.

Anything requiring request-time server behavior must be avoided or gated for the static-export path.

### Content loading layers (`lib/`)

- `lib/content.ts` — imports the JSON files directly (typed via `lib/content-types.ts`); sync, build-time.
- `lib/blog.ts` — reads `content/blog/<locale>/` from disk with gray-matter; slugs must be kebab-case (`^[a-z0-9-]+$`), `draft: true` hides a post, `type: research|note`.
- `lib/publications.ts` — joins `content/publications.json` entries (which have an optional `slug`) with `content/publications/<slug>.mdx` bodies for `/[locale]/publications/[slug]` detail pages.
- `lib/mdx.ts` — the single MDX pipeline (`renderMdx`): compileMDX with remark-gfm, remark-math, rehype-katex, rehype-slug; maps `pre`→`CodeBlock`, plus `Callout` and `Table` components. TOC comes from `extractToc`/`githubSlug` (regex over raw markdown, matching rehype-slug ids). `MermaidDiagram` and `PlotlyFigure` are client components imported inside MDX.

### Server/client split

Pages are server components that read content at build time; interactivity lives in separate `"use client"` files (`home-client.tsx`, `blog/blog-client.tsx`, `publications/publications-client.tsx`, `components/site-shell.tsx`). `SiteShell` shows the profile sidebar only on the home route and decodes the contact email from `NEXT_PUBLIC_CONTACT_EMAIL_B64` (Base64 to avoid scraping).

### Automation

`.github/workflows/update-content.yml` runs daily: `scripts/update-recent-updates.mjs` (rewrites `content/updates.json` from commit history) and `scripts/update-project-stars.mjs` (rewrites star counts in `content/projects.json`), then commits the changes as `github-actions[bot]`. These files are machine-maintained — expect churn in them.

## Conventions

- Path alias `@/*` maps to the repo root.
- Theming via `next-themes` (`components/providers.tsx`): class-based dark mode, follows system by default. Tailwind config in `tailwind.config.ts`.
- `types/` holds ambient declarations (e.g., the vendored `plotly-js-dist-min` module typing).
