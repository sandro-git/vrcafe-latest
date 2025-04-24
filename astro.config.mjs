import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import db from '@astrojs/db';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';

// https://astro.build/config
export default defineConfig({
  site: "https://vr-cafe.fr",
  integrations: [
    sitemap(),
    icon(),
    tailwind(),
    react()
  ],
});
