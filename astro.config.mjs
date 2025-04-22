import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import icon from "astro-icon";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import db from "@astrojs/db";

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
  integrations: [
    tailwind(),
    icon(),
    react(),
    sitemap(),
    db({
      runtime: true,
      data: {
        TimeSlots: []
      }
    })
  ],
});
