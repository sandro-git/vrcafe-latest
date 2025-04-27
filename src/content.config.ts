// 1. Import utilities from `astro:content`
import { defineCollection, z } from "astro:content";
import { glob } from 'astro/loaders';
// Définition du schéma pour la collection des expériences
// src/content.config.ts
const experiencesCollection = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: "./src/content/experiences" }),

  schema:({image})=> z.object({
    id: z.number(),
    name: z.string(),
    slug: z.string(),
    // Changer cette ligne pour accepter une simple chaîne
    image: z.string(), // Au lieu de image()
    youtube: z.string(),
    text: z.string(),
    tag: z.enum(["escapeGame", "jeuxVR", "freeroaming", "escapeFreeroaming"]),
    editeur: z.enum(["arvi", "octopod", "ldlc", "ubisoft", "vex"]),
  }),
});