# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A documentation site for **Noble Ledger** (NBL) — condominium/HOA fund-accounting software. Built with **Astro + Starlight**. The published site is the docs, blog, and a custom marketing landing page; most content is Markdown, not code.

Production site: https://nbl.nobleledger.com

## Commands

```bash
npm install        # install deps (package-lock.json is the source of truth; CI/Docker use `npm ci`)
npm run dev        # dev server at localhost:4321
npm run build      # production build to ./dist/
npm run preview    # preview the built ./dist/ locally
npm run astro -- check   # type-check Astro/TS files
```

There is no test suite, linter, or formatter configured — `npm run build` (which runs `astro check`-style content validation) is the closest thing to CI verification. Run it before considering changes done.

Note: the `Makefile` targets (`make build`, `make deploy`, `make start`) invoke **pnpm**, but the lockfile and Docker/Netlify pipelines use **npm**. Prefer the `npm run` scripts above unless you are intentionally using the Makefile deploy flow.

## Architecture

This is a content-driven Starlight site. The two halves to understand:

1. **Docs/blog content** — Markdown lives in `src/content/docs/`. This is where ~all real work happens.
2. **Custom landing page** — `src/pages/index.astro` plus `src/components/*.astro` render a bespoke marketing splash that sits *outside* the Starlight docs shell.

### Content & the sidebar (the key relationship)

- Each `.md`/`.mdx` file under `src/content/docs/` becomes a route from its path (e.g. `accounting/reserve_fund.md` → `/accounting/reserve_fund/`).
- The sidebar is **not** auto-discovered from the filesystem alone — it is defined in `astro.config.mjs` as a list of sections, each `autogenerate`-d from a specific subdirectory of `src/content/docs/`. **Adding a new top-level content directory requires adding a matching sidebar section in `astro.config.mjs`**, or its pages won't appear in the nav. Current sections map to: `getting_started`, `noble_ledger`, `accounting`, `guides`, `condo_law`, `reference`, `faq`, `policy`.
- The `blog/` directory is driven by the `starlight-blog` plugin (not the sidebar config); blog posts use the extended frontmatter schema.
- Content collections and frontmatter schema are wired in `src/content.config.ts`: the `docs` collection uses Starlight's `docsSchema` extended with `starlight-blog`'s `blogSchema`, so blog frontmatter fields are valid on docs pages.

### Configuration

`astro.config.mjs` is the central control file: site URL, Starlight theme/title/logo, `editLink` base (GitHub edit links), social links, the icon sets loaded (`tabler`, `flat-color-icons`), the `sitemap` and `mdx` integrations, and Tailwind (v4, via `@tailwindcss/vite` — configured in `tailwind.config.js` and the `src/styles/` CSS files, not a PostCSS pipeline).

### Layout of `src/`

- `content/docs/` — published docs/blog Markdown (the bulk of the repo)
- `pages/index.astro` — custom landing page route
- `components/` — `.astro` components for the landing page (hero, pricing, features, footer, theme-switcher, etc.)
- `data/pricing.ts`, `types.ts` — typed data/interfaces feeding the landing-page components
- `styles/` — global/theme Tailwind CSS
- `assets/` — images referenced from Markdown and components (use relative links from Markdown)

## Deployment

Three independent deploy paths exist; know which one you're targeting:

- **Netlify** (`netlify.toml`) — `npm run build`, publishes `dist/`, Node 20. Unmatched routes 404.
- **Docker / generic** (`Dockerfile` + `nginx.conf`) — multi-stage: `npm ci && npm run build`, served by nginx on port 8080.
- **Google Cloud Run** — `make deploy-cloud` (`gcloud run deploy nobleledger-doc --source .`), uses the Dockerfile.

All three produce the same static `dist/` from `npm run build`.
