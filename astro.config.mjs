// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import mdx from "@astrojs/mdx";
import icon from "astro-icon";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import starlightBlog from "starlight-blog";

// https://astro.build/config
// @ts-ignore
export default defineConfig({
  site: "https://nbl.nobleledger.com",
  redirects: { "/noble_ledger/landing_page": "/getting_started/landing_page/" },
  vite: {
    // @ts-ignore
    plugins: [tailwindcss()],
  },
  integrations: [
    sitemap(),
    icon({
      include: {
        tabler: ["*"],
        "flat-color-icons": [
          "template",
          "gallery",
          "approval",
          "document",
          "advertising",
          "currency-exchange",
          "voice-presentation",
          "business-contact",
          "database",
        ],
      },
    }),
    starlight({
      plugins: [starlightBlog()],
      title: "Noble Ledger",
      favicon: "/favicon.ico",
      components: {
        Footer: "./src/components/StarlightFooter.astro",
      },
      customCss: [
        "@fontsource-variable/newsreader/index.css",
        "@fontsource-variable/newsreader/wght-italic.css",
        "@fontsource/ibm-plex-sans/400.css",
        "@fontsource/ibm-plex-sans/500.css",
        "@fontsource/ibm-plex-sans/600.css",
        "@fontsource/ibm-plex-mono/400.css",
        "@fontsource/ibm-plex-mono/500.css",
        "./src/styles/starlight.css",
      ],
      expressiveCode: {
        themes: ["vitesse-dark"],
        styleOverrides: {
          borderRadius: "5px",
          borderColor: "var(--rule-ink)",
        },
      },
      logo: {
        src: "./src/assets/chess_board.png",
        alt: "Noble Ledger Logo",
      },
      lastUpdated: true,
      editLink: {
        baseUrl: "https://github.com/mstoews/noble-doc/edit/main/",
      },
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/mstoews/noble-doc",
        },
      ],
      sidebar: [
        { label: "Start here", items: [{ label: "Welcome", slug: "getting_started/landing_page" }, { label: "Account setup", slug: "getting_started/getting_started" }] },
        { label: "General Ledger", items: [{ autogenerate: { directory: "general-ledger" } }] },
        { label: "Accounts Receivable", items: [{ autogenerate: { directory: "accounts-receivable" } }] },
        { label: "Accounts Payable", items: [{ autogenerate: { directory: "accounts-payable" } }] },
        { label: "Banking", items: [{ autogenerate: { directory: "banking" } }] },
        { label: "Reports & close", items: ["reports/report-library", "accounting/how_to_read_financial_statement", "guides/year_end_close", "guides/prepare_for_audit"] },
        { label: "Budgets", items: [{ autogenerate: { directory: "budgets" } }] },
        { label: "Community", items: [{ autogenerate: { directory: "community" } }] },
        { label: "Documents & audit", items: [{ autogenerate: { directory: "documents" } }] },
        { label: "Company setup", items: [{ autogenerate: { directory: "company" } }] },
        { label: "Learn accounting", collapsed: true, items: [{ autogenerate: { directory: "accounting" } }] },
        { label: "Guides", collapsed: true, items: [{ autogenerate: { directory: "guides" } }] },
        { label: "Reference", collapsed: true, items: [{ autogenerate: { directory: "reference" } }] },
        { label: "Condominium law", collapsed: true, items: [{ autogenerate: { directory: "condo_law" } }] },
        { label: "Company policies", collapsed: true, items: [{ autogenerate: { directory: "policy" } }] },
        { label: "FAQ", items: [{ autogenerate: { directory: "faq" } }] },
        { label: "About the application", items: [{ autogenerate: { directory: "noble_ledger" } }] },
      ],
    }),
    mdx(),
  ],
});
