# Noble Ledger documentation

Astro + Starlight documentation for the sibling `noble-web` frontend. The root route is the documentation homepage; task guides use the application's navigation labels.

## Development

```sh
npm ci
npm run dev
npm run verify
npm run preview
```

Use Node 22 (minimum 22.19.0). `.nvmrc`, Docker, Netlify, and CI use Node 22. Run `nvm use` before installing dependencies. Major Astro upgrades must keep runtime settings aligned.

## Structure

- `src/content/docs/`: published Markdown/MDX and blog posts.
- `src/content.config.ts`: Starlight and blog schemas.
- `astro.config.mjs`: navigation, integrations, redirects, site metadata.
- `src/styles/theme.css`: brand tokens.
- `src/styles/starlight.css`: documentation styles.
- `src/components/MarketingPage.astro`: retained former marketing page, not routed.
- `docs/content-review.md`: source provenance, verification limits, remaining coverage.

## Authoring

Use an outcome-focused title, prerequisites, numbered steps, expected result, and troubleshooting. Confirm action labels against `noble-web`. Source inspection does not replace an authenticated walkthrough. Never include live customer data in screenshots.

Preserve published URLs or add tested redirects. Add navigation groups only when their guides exist. Keep draft and internal architecture material outside published collections.

## Verification

Run `npm run verify` before shipping: Astro typechecking, link-checker tests, production build, and generated HTML link/anchor/asset checks. The checker follows same-site absolute and relative URLs; it does not fetch external sites or validate srcset. Preview the home page, guides, search, mobile navigation, both themes, and keyboard focus. Complete workflow checks with the frontend and backend before marking guides runtime-verified.

Netlify builds `dist/`; Docker serves the static build with nginx; the Makefile retains the existing optional Cloud Run deployment flow.

## Framework baseline

Astro 7.3.1, Starlight 0.42.0, MDX 8.0.0 and starlight-blog 0.29.0. The lockfile records exact resolved dependencies. Verified with Node 22.23.2 and npm 10; use `nvm install 22` if your Node 22 patch is below 22.19.0.
