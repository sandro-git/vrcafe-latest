// 1. Import utilities from `astro:content`
import { z, defineCollection } from "astro:content";
// 2. Define your collection(s)
const gamesCollection = defineCollection({
  type: "content", // v2.5.0 and later
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      //define Image.
      image: image(),
      alt: z.string(),
      video: z.string().optional(),
    }),
});
const freeroamingCollection = defineCollection({
  type: "data", // v2.5.0 and later
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      //define Image.
      image: image(),
      alt: z.string(),
      video: z.string().optional(),
      slug: z.string(),
    }),
});
// 3. Export a single `collections` object to register your collection(s)
//    This key should match your collection directory name in "src/content"
export const collections = {
  games: gamesCollection,
  jeux: gamesCollection,
  freeroaming: freeroamingCollection,
};
