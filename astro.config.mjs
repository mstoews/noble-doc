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
      title: "NBL Documentation",
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
        {
          label: "Start Here",
          autogenerate: { directory: "getting_started" },
        },
        {
          label: "Noble Ledger Docs",
          autogenerate: { directory: "noble_ledger" },
        },
        {
          label: "Accounting",
          autogenerate: { directory: "accounting" },
        },
        {
          label: "Guides",
          autogenerate: { directory: "guides" },
        },
        {
          label: "Condominium Law",
          autogenerate: { directory: "condo_law" },
        },
        {
          label: "Reference",
          autogenerate: { directory: "reference" },
        },
        {
          label: "FAQ",
          autogenerate: { directory: "faq" },
        },
        {
          label: "Company Policies",
          autogenerate: { directory: "policy" },
        },
      ],
    }),
    mdx(),
  ],
});
