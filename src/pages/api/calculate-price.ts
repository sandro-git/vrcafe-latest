import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async ({ request, url }) => {
  try {
    // Récupérer les paramètres de requête
    const experienceId = url.searchParams.get('experienceId');
    const participants = url.searchParams.get('participants');
    const duration = url.searchParams.get('duration');
    
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
    
    if (!duration) {
      return new Response(
        JSON.stringify({ error: 'La durée est requise' }),
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
    
    // Déterminer le prix de base en fonction du type d'expérience et de la durée
    let basePrice = 18; // Prix par défaut pour 30min standard
    
    if (duration === '30min') {
      // Prix pour 30 minutes
      if (experience.data.tag === 'freeroaming' || experience.data.tag === 'escapeFreeroaming') {
        basePrice = 25; // 25€ pour freeroaming
      } else {
        basePrice = 18; // 18€ pour les autres
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
    } else if (duration === '1h') {
      // Prix pour 1 heure (tarification spéciale)
      let pricePerPerson;
      
      if (numParticipants <= 2) {
        pricePerPerson = 29; // 29€ par personne pour 1-2 personnes
      } else if (numParticipants <= 4) {
        pricePerPerson = 27; // 27€ par personne pour 3-4 personnes
      } else {
        pricePerPerson = 25; // 25€ par personne pour 5-6 personnes
      }
      
      const totalPrice = pricePerPerson * numParticipants;
      const standardPrice = 29 * numParticipants; // Prix standard (sans réduction)
      const savings = standardPrice - totalPrice;
      
      return new Response(
        JSON.stringify({
          basePrice: 29,
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
    } else {
      return new Response(
        JSON.stringify({ error: 'Durée non valide' }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }
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
