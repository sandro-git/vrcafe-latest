import type { APIRoute } from 'astro';
import { db, Reservations } from 'astro:db';

export const POST: APIRoute = async ({ request }) => {
  try {
    // Récupérer les données du corps de la requête
    const data = await request.json();
    
    // Valider les données
    const { 
      experienceId, 
      experienceSlug, 
      date, 
      timeSlotId, 
      customerName, 
      customerEmail, 
      customerPhone, 
      numberOfPeople, 
      specialRequests 
    } = data;
    
    // Vérifier que tous les champs obligatoires sont présents
    if (!experienceId || !experienceSlug || !date || !timeSlotId || !customerName || !customerEmail || !customerPhone || !numberOfPeople) {
      return new Response(
        JSON.stringify({ error: 'Tous les champs obligatoires doivent être renseignés' }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }
    
    // Créer la réservation
    const result = await db.insert(Reservations).values({
      experienceId,
      experienceSlug,
      date: new Date(date),
      timeSlotId,
      customerName,
      customerEmail,
      customerPhone,
      numberOfPeople,
      specialRequests: specialRequests || '',
      status: 'confirmed',
      createdAt: new Date()
    }).returning({ id: Reservations.id });
    
    // Générer un identifiant lisible pour la réservation (préfixe + ID)
    const reservationId = result.length > 0 ? result[0].id : null;
    const readableId = reservationId ? `VR-${new Date().getFullYear().toString().slice(2)}-${reservationId.toString().padStart(5, '0')}` : null;
    
    // À ce stade, vous pourriez envoyer un email de confirmation
    // Cette fonctionnalité peut être ajoutée ultérieurement
    
    return new Response(
      JSON.stringify({
        id: readableId,
        message: 'Réservation créée avec succès'
      }),
      {
        status: 201,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('Erreur lors de la création de la réservation:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Une erreur est survenue lors de la création de la réservation' 
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

// Pour récupérer les réservations (protégé par authentification admin)
export const GET: APIRoute = async ({ request, url }) => {
  try {
    // Cette route devrait être protégée par une authentification
    // Pour l'instant, nous ajoutons un paramètre simple pour la protection
    const adminKey = url.searchParams.get('adminKey');
    
    if (adminKey !== process.env.ADMIN_KEY) {
      return new Response(
        JSON.stringify({ error: 'Non autorisé' }),
        {
          status: 401,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }
    
    // Récupérer les paramètres de filtrage
    const fromDate = url.searchParams.get('fromDate');
    const toDate = url.searchParams.get('toDate');
    const experienceId = url.searchParams.get('experienceId');
    
    // Construire la requête
    let query = db.select().from(Reservations);
    
    // Appliquer les filtres si présents
    if (fromDate) {
      query = query.where(db.sql`DATE(${Reservations.date}) >= ${fromDate}`);
    }
    
    if (toDate) {
      query = query.where(db.sql`DATE(${Reservations.date}) <= ${toDate}`);
    }
    
    if (experienceId) {
      query = query.where(db.sql`${Reservations.experienceId} = ${parseInt(experienceId)}`);
    }
    
    // Exécuter la requête et récupérer les résultats
    const reservations = await query.orderBy(db.sql`${Reservations.date} ASC`);
    
    return new Response(
      JSON.stringify(reservations),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('Erreur lors de la récupération des réservations:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Une erreur est survenue lors de la récupération des réservations' 
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
