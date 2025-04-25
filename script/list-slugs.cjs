// list-slugs.cjs
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// Configuration
const EXPERIENCES_DIR = path.resolve('./src/content/experiences');

// Fonction principale
function main() {
  console.log(`Lecture des fichiers dans ${EXPERIENCES_DIR}`);
  
  if (!fs.existsSync(EXPERIENCES_DIR)) {
    console.error(`Le dossier ${EXPERIENCES_DIR} n'existe pas!`);
    return;
  }
  
  const files = fs.readdirSync(EXPERIENCES_DIR)
    .filter(file => file.endsWith('.md'));
  
  console.log(`${files.length} fichiers trouvés\n`);
  
  // Tableau pour stocker les résultats
  const results = [];
  
  for (const file of files) {
    const slug = path.basename(file, '.md');
    const filePath = path.join(EXPERIENCES_DIR, file);
    
    try {
      // Lecture du fichier
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Analyse avec gray-matter
      const parsed = matter(content);
      
      // Extraire l'ID YouTube de l'URL
      let youtubeId = '';
      if (parsed.data.youtube) {
        if (parsed.data.youtube.includes('youtu.be/')) {
          youtubeId = parsed.data.youtube.split('youtu.be/')[1];
        } else if (parsed.data.youtube.includes('watch?v=')) {
          youtubeId = parsed.data.youtube.split('watch?v=')[1];
        } else {
          youtubeId = parsed.data.youtube;
        }
      }
      
      results.push({
        slug,
        youtubeLink: parsed.data.youtube || '',
        youtubeId
      });
    } catch (err) {
      console.error(`Erreur pour ${file}: ${err.message}`);
    }
  }
  
  // Afficher les résultats
  console.log('Slugs et liens YouTube existants :');
  results.forEach(item => {
    console.log(`'${item.slug}': '${item.youtubeId}',`);
  });
  
  // Créer un nouveau fichier youtubeLinks.js
  const youtubeLinksContent = `// Généré automatiquement le ${new Date().toISOString()}
const youtubeLinks = {
${results.map(item => `  '${item.slug}': '${item.youtubeId}'`).join(',\n')}
};

module.exports = youtubeLinks;`;
  
  fs.writeFileSync('youtubeLinks.js', youtubeLinksContent);
  console.log('\nFichier youtubeLinks.js généré avec succès!');
}

main();