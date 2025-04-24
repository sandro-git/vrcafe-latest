import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import db from '@astrojs/db';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';

// https://astro.build/config
export default defineConfig({
  site: "https://vr-cafe.fr",
  image: {
    remotePatterns: [{
      protocol: "https"
    }],
    service: {
      entrypoint: 'astro/assets/services/sharp'
    },
    domains: ['vr-cafe.fr']
  },
  integrations: [
    tailwind(), 
    react(),
    db(), // Astro DB pour le système de réservation
    sitemap(),
    icon(),
  ],
  server: {
    port: 4321,
    host: true
  }
});
