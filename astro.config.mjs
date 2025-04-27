import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import icon from "astro-icon";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";

import netlify from "@astrojs/netlify";

// https://astro.build/config
export default defineConfig({
  site: "https://vr-cafe.fr",
  integrations: [tailwind(), icon(), react(), sitemap()],
  output: "server",
  adapter: netlify(),
  // image: {
  //   service: {
  //     entrypoint: "astro/assets/services/sharp"
  //   }
  // }
});