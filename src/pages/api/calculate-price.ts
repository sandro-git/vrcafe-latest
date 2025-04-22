import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async ({ request, url }) => {
  try {
    // Récupérer les paramètres de requête
    const experienceId = url.searchParams.get('experienceId');
    const participants = url.searchParams.get('participants');
    
    if (!experienceId) {
      return new Response(
        JSON.stringify({ error: 'L\'identifiant de l\'expérience est requis' }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }
    
    if (!participants) {
      return new Response(
        JSON.stringify({ error: 'Le nombre de participants est requis' }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }
    
    // Convertir en nombres
    const expId = parseInt(experienceId);
    const numParticipants = parseInt(participants);
    
    // Récupérer l'expérience correspondante
    const experiences = await getCollection('experiences');
    const experience = experiences.find(exp => exp.data.id === expId);
    
    if (!experience) {
      return new Response(
        JSON.stringify({ error: 'Expérience non trouvée' }),
        {
          status: 404,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }
    
    // Déterminer le prix de base en fonction du type d'expérience
    let basePrice = 18; // Prix par défaut
    
    switch (experience.data.tag) {
      case 'escapeGame':
        basePrice = 18;
        break;
      case 'jeuxVR':
        basePrice = 18;
        break;
      case 'freeroaming':
        basePrice = 25;
        break;
      case 'escapeFreeroaming':
        basePrice = 25;
        break;
    }
    
    // Calculer le prix total
    let totalPrice = basePrice * numParticipants;
    
    // Appliquer des réductions pour les groupes
    if (numParticipants >= 6) {
      totalPrice = totalPrice * 0.9; // 10% de réduction pour 6 personnes ou plus
    } else if (numParticipants >= 4) {
      totalPrice = totalPrice * 0.95; // 5% de réduction pour 4-5 personnes
    }
    
    // Arrondir le prix
    totalPrice = Math.round(totalPrice);
    
    // Calculer le prix par personne
    const pricePerPerson = totalPrice / numParticipants;
    
    // Calculer l'économie
    const regularPrice = basePrice * numParticipants;
    const savings = regularPrice - totalPrice;
    
    return new Response(
      JSON.stringify({
        basePrice,
        totalPrice,
        pricePerPerson,
        savings,
        experienceName: experience.data.name,
        experienceType: experience.data.tag
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('Erreur lors du calcul du prix:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Une erreur est survenue lors du calcul du prix' 
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
