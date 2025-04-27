// script/simplify-image-paths.js
import { readFileSync, writeFileSync, readdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const experiencesDir = join(__dirname, "../src/content/experiences");

console.log(`Recherche de fichiers dans: ${experiencesDir}`);

if (!existsSync(experiencesDir)) {
  console.error(`Le répertoire ${experiencesDir} n'existe pas!`);
  process.exit(1);
}

function simplifyImagePaths(filePath) {
  try {
    const content = readFileSync(filePath, "utf8");
    console.log(`Traitement du fichier: ${filePath}`);
    
    // Nouvelle expression régulière adaptée à votre format
    // Cette regex reconnaît les lignes image: avec ou sans guillemets, suivies d'un chemin,
    // et extrait le nom du fichier à la fin
    const regex = /image: *(["']?)(?:.*\/)?([^\/]+\.[a-zA-Z0-9]+)\1/g;
    
    let match;
    let matchFound = false;
    const contentCopy = content.slice(); // Copie pour le test des correspondances
    
    while ((match = regex.exec(contentCopy)) !== null) {
      matchFound = true;
      console.log(`Match trouvé: ${match[0]}, sera remplacé par: image: "${match[2]}"`);
    }
    
    if (!matchFound) {
      console.log(`Aucune correspondance trouvée dans ${filePath}`);
      return false;
    }
    
    // Effectuer le remplacement
    const modifiedContent = content.replace(regex, 'image: "$2"');
    
    // Vérifier si le contenu a changé
    if (modifiedContent !== content) {
      writeFileSync(filePath, modifiedContent);
      console.log(`✅ Fichier modifié: ${filePath}`);
      return true;
    } else {
      console.log(`⚠️ Aucune modification pour: ${filePath} (malgré les correspondances)`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Erreur lors de la modification de ${filePath}:`, error);
    return false;
  }
}

const markdownFiles = readdirSync(experiencesDir)
  .filter(file => file.endsWith(".md") || file.endsWith(".mdx"));

console.log(`Fichiers trouvés: ${markdownFiles.length}`);

if (markdownFiles.length === 0) {
  console.log("Aucun fichier Markdown trouvé!");
  process.exit(0);
}

let modifiedCount = 0;
markdownFiles.forEach(file => {
  const filePath = join(experiencesDir, file);
  if (simplifyImagePaths(filePath)) {
    modifiedCount++;
  }
});

console.log(`Résumé: ${modifiedCount} fichiers modifiés sur ${markdownFiles.length} fichiers traités.`);