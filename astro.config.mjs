import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import db from '@astrojs/db';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';

import netlify from '@astrojs/netlify';

// https://astro.build/config
export default defineConfig({
  site: "https://vr-cafe.fr",
  output: 'server',

  integrations: [
    db({
      type: 'turso',
      url: process.env.DATABASE_URL,
      token: process.env.DATABASE_TOKEN
    }),
    sitemap(),
    icon(),
    tailwind(),
    react()
  ],

  adapter: netlify(),
});