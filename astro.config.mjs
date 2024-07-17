import { defineConfig } from "astro/config";

import tailwind from "@astrojs/tailwind";
import icon from "astro-icon";
import react from "@astrojs/react";

import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://vr-cafe.fr",
  image: {
    remotePatterns: [
      {
        protocol: "https",
      },
    ],
  },
  integrations: [tailwind(), icon(), react(), sitemap()],
});
