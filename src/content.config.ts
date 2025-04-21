// 1. Import utilities from `astro:content`
import { defineCollection, z } from "astro:content";

// Définition du schéma pour la collection des expériences
const experiencesCollection = defineCollection({
  type: "content",
  schema:({image})=> z.object({
    id: z.number(),
    name: z.string(),
    slug: z.string(),
    image: image(), // URL de l'image (peut être une URL Sanity ou un chemin local)
    youtube: z.string(), // ID de la vidéo YouTube
    text: z.string(),
    tag: z.enum(["escapeGame", "jeuxVR", "freeroaming", "escapeFreeroaming"]),
    editeur: z.enum(["arvi", "octopod", "ldlc", "ubisoft", "vex"]),
  }),
});

// Export des collections pour qu'Astro puisse les utiliser
export const collections = {
  experiences: experiencesCollection,
};
