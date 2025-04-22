import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async ({ request, url }) => {
  try {
    // Récupérer les paramètres de requête
    const tag = url.searchParams.get('tag');
    const editeur = url.searchParams.get('editeur');
    
    // Obtenir toutes les expériences
    const experiences = await getCollection('experiences');
    
    // Filtrer en fonction des paramètres
    let filteredExperiences = experiences;
    
    if (tag) {
      filteredExperiences = filteredExperiences.filter(exp => exp.data.tag === tag);
    }
    
    if (editeur) {
      filteredExperiences = filteredExperiences.filter(exp => exp.data.editeur === editeur);
    }
    
    // Trier par ID
    filteredExperiences.sort((a, b) => a.data.id - b.data.id);
    
    return new Response(
      JSON.stringify(filteredExperiences),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('Erreur lors de la récupération des expériences:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Une erreur est survenue lors de la récupération des expériences' 
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
};
