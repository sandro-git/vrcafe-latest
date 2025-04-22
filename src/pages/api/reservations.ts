import type { APIRoute } from 'astro';

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
      duration,
      price,
      specialRequests 
    } = data;
    
    // Vérifier que tous les champs obligatoires sont présents
    if (!experienceId || !experienceSlug || !date || !timeSlotId || !customerName || !customerEmail || !customerPhone || !numberOfPeople || !duration || !price) {
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
    
    // Simuler la création d'une réservation
    // Dans une implémentation réelle, cela écrirait dans Astro DB
    
    // Générer un identifiant lisible pour la réservation (préfixe + ID)
    const reservationId = Math.floor(Math.random() * 10000); // Simulé
    const readableId = `VR-${new Date().getFullYear().toString().slice(2)}-${reservationId.toString().padStart(5, '0')}`;
    
    // À ce stade, vous pourriez envoyer un email de confirmation
    // Cette fonctionnalité peut être ajoutée ultérieurement
    
    return new Response(
      JSON.stringify({
        id: readableId,
        message: 'Réservation créée avec succès',
        details: {
          experienceId,
          experienceSlug,
          date,
          timeSlotId,
          customerName,
          customerEmail,
          customerPhone,
          numberOfPeople,
          duration,
          price,
          status: 'confirmed',
          createdAt: new Date().toISOString()
        }
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
    
    if (adminKey !== 'admin123') { // À remplacer par une vraie authentification
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
    
    // Simuler des données de réservation pour le moment
    // Dans une implémentation réelle, vous interrogeriez Astro DB
    const mockReservations = [
      {
        id: 1,
        experienceId: 24,
        experienceSlug: "chernobyl",
        date: "2025-05-01T00:00:00.000Z",
        timeSlotId: 10,
        customerName: "Jean Dupont",
        customerEmail: "jean@example.com",
        customerPhone: "06 12 34 56 78",
        numberOfPeople: 3,
        duration: "1h",
        price: 81,
        status: "confirmed",
        specialRequests: "Nous sommes tous débutants en VR",
        referenceNumber: "VR-25-00123",
        createdAt: "2025-04-15T10:30:00.000Z"
      },
      {
        id: 2,
        experienceId: 11,
        experienceSlug: "the-dagger-of-time",
        date: "2025-05-02T00:00:00.000Z",
        timeSlotId: 5,
        customerName: "Marie Martin",
        customerEmail: "marie@example.com",
        customerPhone: "06 98 76 54 32",
        numberOfPeople: 2,
        duration: "30min",
        price: 36,
        status: "confirmed",
        specialRequests: "",
        referenceNumber: "VR-25-00124",
        createdAt: "2025-04-16T14:45:00.000Z"
      },
      {
        id: 3,
        experienceId: 36,
        experienceSlug: "alice",
        date: "2025-05-03T00:00:00.000Z",
        timeSlotId: 14,
        customerName: "Pierre Durand",
        customerEmail: "pierre@example.com",
        customerPhone: "07 65 43 21 09",
        numberOfPeople: 4,
        duration: "1h",
        price: 108,
        status: "pending",
        specialRequests: "Un anniversaire, pouvez-vous prévoir quelque chose de spécial?",
        referenceNumber: "VR-25-00125",
        createdAt: "2025-04-17T09:15:00.000Z"
      }
    ];
    
    // Appliquer les filtres si présents
    let filteredReservations = [...mockReservations];
    
    if (fromDate) {
      const fromDateTime = new Date(fromDate).getTime();
      filteredReservations = filteredReservations.filter(
        reservation => new Date(reservation.date).getTime() >= fromDateTime
      );
    }
    
    if (toDate) {
      const toDateTime = new Date(toDate).getTime();
      filteredReservations = filteredReservations.filter(
        reservation => new Date(reservation.date).getTime() <= toDateTime
      );
    }
    
    if (experienceId) {
      filteredReservations = filteredReservations.filter(
        reservation => reservation.experienceId === parseInt(experienceId)
      );
    }
    
    // Trier par date
    filteredReservations.sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    return new Response(
      JSON.stringify(filteredReservations),
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
