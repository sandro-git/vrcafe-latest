// youtube-link-updater.js
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');
const matter = require('gray-matter');
const slugify = require('slugify');

// Configuration
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID;
const EXPERIENCES_DIR = '/Users/sandro/Code/vrcafe-latest/src/content/experiences';

// Initialiser l'API YouTube
const youtube = google.youtube({
  version: 'v3',
  auth: YOUTUBE_API_KEY
});

// Fonction pour extraire l'ID YouTube d'une URL
function getYoutubeId(url) {
  if (!url) return null;
  
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
  const match = url.match(regex);
  
  return match ? match[1] : null;
}

// Fonction pour récupérer toutes les vidéos de la chaîne
async function getChannelVideos() {
  try {
    const response = await youtube.search.list({
      part: 'snippet',
      channelId: CHANNEL_ID,
      maxResults: 70, // Augmentez si vous avez plus de vidéos
      type: 'video',
      order: 'date' // Récupère les plus récentes en premier
    });

    return response.data.items.map(item => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      url: `https://youtu.be/${item.id.videoId}`,
      publishedAt: item.snippet.publishedAt
    }));
  } catch (error) {
    console.error('Erreur lors de la récupération des vidéos:', error);
    return [];
  }
}

// Fonction pour lire tous les fichiers .md
function readMarkdownFiles() {
  const files = fs.readdirSync(EXPERIENCES_DIR).filter(file => file.endsWith('.md'));
  
  return files.map(file => {
    const filePath = path.join(EXPERIENCES_DIR, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(content);
    
    return {
      slug: data.slug || path.basename(file, '.md'),
      name: data.name,
      path: filePath,
      content,
      data
    };
  });
}

// Fonction pour trouver la correspondance entre une vidéo et une expérience
function findMatchingExperience(video, experiences) {
  // Normaliser le titre de la vidéo pour faciliter la correspondance
  const normalizedVideoTitle = video.title.toLowerCase().trim();
  
  // Recherche exacte par nom d'expérience
  const exactMatch = experiences.find(exp => 
    exp.name.toLowerCase() === normalizedVideoTitle
  );
  
  if (exactMatch) return exactMatch;
  
  // Recherche par inclusion du nom de l'expérience dans le titre de la vidéo
  const inclusionMatch = experiences.find(exp => 
    normalizedVideoTitle.includes(exp.name.toLowerCase())
  );
  
  if (inclusionMatch) return inclusionMatch;
  
  // Recherche par slug dans le titre de la vidéo
  return experiences.find(exp => 
    normalizedVideoTitle.includes(exp.slug.toLowerCase())
  );
}

// Fonction pour mettre à jour un fichier Markdown avec le lien YouTube
function updateMarkdownFile(filePath, content, youtubeUrl) {
  try {
    const { data, content: markdownContent } = matter(content);
    
    // Mettre à jour le champ youtube
    data.youtube = youtubeUrl;
    
    // Réécrire le fichier avec le front matter mis à jour
    const updatedContent = matter.stringify(markdownContent, data);
    fs.writeFileSync(filePath, updatedContent);
    
    return true;
  } catch (error) {
    console.error(`Erreur lors de la mise à jour du fichier ${filePath}:`, error);
    return false;
  }
}

// Fonction principale
async function main() {
  console.log('Récupération des vidéos YouTube...');
  const videos = await getChannelVideos();
  console.log(`${videos.length} vidéos trouvées.`);
  
  console.log('Lecture des fichiers Markdown...');
  const experiences = readMarkdownFiles();
  console.log(`${experiences.length} fichiers d'expérience trouvés.`);
  
  let updatedCount = 0;
  let notFoundCount = 0;
  const notFound = [];
  
  // Pour chaque vidéo, trouver l'expérience correspondante et mettre à jour le fichier
  for (const video of videos) {
    const experience = findMatchingExperience(video, experiences);
    
    if (experience) {
      console.log(`Correspondance trouvée: "${video.title}" -> "${experience.name}"`);
      
      // Vérifier si le lien YouTube existe déjà et est différent
      const currentYoutubeId = getYoutubeId(experience.data.youtube);
      const newYoutubeId = getYoutubeId(video.url);
      
      if (currentYoutubeId !== newYoutubeId) {
        const updated = updateMarkdownFile(experience.path, experience.content, video.url);
        
        if (updated) {
          console.log(`  ✅ Fichier mis à jour: ${experience.path}`);
          updatedCount++;
        }
      } else {
        console.log(`  ⏩ Lien YouTube déjà à jour pour: ${experience.name}`);
      }
    } else {
      console.log(`❌ Aucune correspondance trouvée pour: "${video.title}"`);
      notFound.push(video);
      notFoundCount++;
    }
  }
  
  console.log('\nRésumé:');
  console.log(`- ${updatedCount} fichiers mis à jour`);
  console.log(`- ${notFoundCount} vidéos sans correspondance`);
  
  if (notFound.length > 0) {
    console.log('\nVidéos sans correspondance:');
    notFound.forEach(video => {
      console.log(`- "${video.title}" (${video.url})`);
    });
  }
}

// Exécuter le script
main().catch(error => {
  console.error('Erreur:', error);
  process.exit(1);
});