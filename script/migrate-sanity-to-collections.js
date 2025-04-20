// scripts/migrate-sanity-to-collections.js
import { createClient } from "@sanity/client";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import fetch from "node-fetch";
import createImageUrlBuilder from "@sanity/image-url";

// Configuration du client Sanity
const sanityClient = createClient({
  projectId: "7ef57i1i",
  dataset: "production",
  useCdn: false,
  apiVersion: "2023-05-03",
});

// Utilitaire pour générer des URLs d'images Sanity
const imageBuilder = createImageUrlBuilder(sanityClient);
const urlFor = (source) => imageBuilder.image(source);

// Chemins vers les dossiers de destination
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const contentDir = path.join(__dirname, "../src/content/experiences");
const imagesDir = path.join(__dirname, "../public/images/experiences");

// Assurez-vous que les dossiers existent
if (!fs.existsSync(contentDir)) {
  fs.mkdirSync(contentDir, { recursive: true });
}
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Fonction pour télécharger une image
async function downloadImage(url, filePath) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Échec du téléchargement: ${response.statusText}`);
    }

    const buffer = await response.buffer();
    fs.writeFileSync(filePath, buffer);
    console.log(`Image téléchargée: ${filePath}`);
    return true;
  } catch (error) {
    console.error(`Erreur lors du téléchargement de l'image ${url}:`, error);
    return false;
  }
}

async function migrateData() {
  try {
    // Récupération de toutes les expériences depuis Sanity
    const experiences = await sanityClient.fetch(`*[_type == "escapeGames"]`);
    console.log(
      `Récupération de ${experiences.length} expériences depuis Sanity`
    );

    // Pour chaque expérience, créer un fichier dans le dossier content
    for (const [index, experience] of experiences.entries()) {
      // Gérer l'image
      let imagePath = "";
      if (experience.image && experience.image.asset) {
        // Générer l'URL de l'image Sanity
        const imageUrl = urlFor(experience.image).url();

        // Déterminer l'extension de fichier à partir de l'URL
        const ext = path.extname(imageUrl) || ".jpg";
        const imageFileName = `${experience.slug.current}${ext}`;
        const localImagePath = path.join(imagesDir, imageFileName);

        // Télécharger l'image
        await downloadImage(imageUrl, localImagePath);

        // Chemin relatif pour le fichier markdown
        imagePath = `/images/experiences/${imageFileName}`;
      }

      // Préparer les données au format Content Collections
      const contentData = {
        id: index + 1,
        name: experience.name,
        slug: experience.slug.current,
        image: imagePath, // Utiliser le chemin local de l'image
        youtube: experience.youtube || "",
        text: experience.text || "",
        tag: experience.tag || "escapeGame",
        editeur: experience.editeur || "arvi",
      };

      // Créer le fichier (format .md)
      const fileName = `${contentData.slug}.md`;
      const filePath = path.join(contentDir, fileName);

      // Formater le contenu au format Markdown avec frontmatter
      const fileContent = `---
id: ${contentData.id}
name: "${contentData.name}"
slug: "${contentData.slug}"
image: "${contentData.image}"
youtube: "${contentData.youtube}"
tag: "${contentData.tag}"
editeur: "${contentData.editeur}"
---

${contentData.text}
`;

      // Écrire le fichier
      fs.writeFileSync(filePath, fileContent, "utf8");
      console.log(`Fichier créé: ${fileName}`);
    }

    console.log("Migration terminée avec succès!");
  } catch (error) {
    console.error("Erreur lors de la migration:", error);
  }
}

// Exécuter le script
migrateData();
