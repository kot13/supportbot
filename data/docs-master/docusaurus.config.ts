import path from "path";
import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: "InAppStory",
  tagline: "InAppStory documentation and guides",
  favicon: "img/favicon.ico",

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: "https://your-docusaurus-site.example.com",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "InAppStory", // Usually your GitHub org/user name.
  projectName: "InAppStory Docs", // Usually your repo name.

  onBrokenLinks: "warn",

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  plugins: [
    path.resolve(__dirname, "src/plugins/latest-versions-plugin"),
    "docusaurus-plugin-sass",
  ],

  themes: [
    [
      "@easyops-cn/docusaurus-search-local",
      {
        docsRouteBasePath: "/",
        explicitSearchResultPath: true,
      },
    ],
  ],

  clientModules: [
    path.resolve(__dirname, "src/clientModules/domainPlaceholder.ts"),
  ],

  presets: [
    [
      "classic",
      {
        docs: {
          routeBasePath: "/",
          sidebarPath: "./sidebars.ts",
        },
        blog: false,
        theme: {
          customCss: "./src/css/custom.scss",
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: "img/docusaurus-social-card.jpg",
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      logo: {
        alt: "My Site Logo",
        src: "img/logo.png",
      },
      items: [
        { type: "search", position: "left" },
        {
          type: "docSidebar",
          sidebarId: "sdkGuidesSidebar",
          position: "right",
          label: "SDK Guides",
        },
        {
          type: "docSidebar",
          sidebarId: "ugcGuidesSidebar",
          position: "right",
          label: "UGC Guides",
        },
        {
          type: "docSidebar",
          sidebarId: "webhooksSidebar",
          position: "right",
          label: "Webhooks",
        },
        {
          type: "docSidebar",
          sidebarId: "glossariumSidebar",
          position: "right",
          label: "Glossarium",
        },
        {
          type: "docSidebar",
          sidebarId: "onPremiseSidebar",
          position: "right",
          label: "On-Premise",
        },
        {
          href: "https://api.domain-placeholder/pub/v1",
          label: "REST API",
          position: "right",
        },
      ],
    },
    footer: {
      style: "light",
      copyright: `Copyright © ${new Date().getFullYear()} InAppStory.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ["dart", "gradle"],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
