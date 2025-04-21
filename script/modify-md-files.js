// modify-md-files.js
import { readFileSync, writeFileSync, readdirSync, existsSync } from "fs";
import { join, basename, extname, dirname } from "path";
import { fileURLToPath } from "url";

// Obtenir le chemin du répertoire courant en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Chemin vers le dossier contenant les fichiers Markdown
const experiencesDir = join("src", "content", "experiences");

// Fonction pour extraire le nom de fichier d'un chemin
function extractFilename(imagePath) {
  // Si le chemin est null ou undefined, retourner une chaîne vide
  if (!imagePath) return "";

  // Extraire le nom de fichier du chemin
  return basename(imagePath);
}

// Fonction pour modifier un fichier Markdown
function modifyMarkdownFile(filePath) {
  try {
    // Lire le contenu du fichier
    const content = readFileSync(filePath, "utf8");

    // Utiliser une expression régulière pour trouver et remplacer le chemin de l'image
    // Cette regex cherche une ligne commençant par "image: " suivie d'un chemin entre guillemets
    const modifiedContent = content.replace(
      /image: "src\/assets\/images\/experiences\/\/images\/experiences\/([^"]+)"/g,
      'image: "src/assets/images/experiences/$1"'
    );

    // Écrire le contenu modifié dans le fichier
    writeFileSync(filePath, modifiedContent);

    console.log(`Fichier modifié avec succès: ${filePath}`);
  } catch (err) {
    console.error(
      `Erreur lors de la modification du fichier ${filePath}:`,
      err
    );
  }
}

// Fonction principale pour traiter tous les fichiers .md dans le dossier
function processAllMarkdownFiles() {
  try {
    // Vérifier si le dossier existe
    if (!existsSync(experiencesDir)) {
      console.error(`Le dossier ${experiencesDir} n'existe pas.`);
      return;
    }

    // Lire tous les fichiers du dossier
    const files = readdirSync(experiencesDir);

    // Filtrer pour ne garder que les fichiers .md
    const markdownFiles = files.filter(
      (file) => extname(file).toLowerCase() === ".md"
    );

    console.log(`Nombre de fichiers Markdown trouvés: ${markdownFiles.length}`);

    // Traiter chaque fichier
    markdownFiles.forEach((file) => {
      const filePath = join(experiencesDir, file);
      modifyMarkdownFile(filePath);
    });

    console.log("Tous les fichiers ont été traités avec succès.");
  } catch (err) {
    console.error("Erreur lors du traitement des fichiers:", err);
  }
}

// Exécuter la fonction principale
processAllMarkdownFiles();
