import type { APIRoute } from 'astro';
import { db, eq, and, TimeSlots, Reservations } from 'astro:db';

export const GET: APIRoute = async ({ url }) => {
  try {
    // Récupérer les paramètres de requête directement depuis l'URL Astro
    const dateString = url.searchParams.get('date');
    const experienceId = url.searchParams.get('experienceId');
    const participants = url.searchParams.get('participants') ? parseInt(url.searchParams.get('participants') || '1') : 1;

    console.log('Received params:', { dateString, experienceId, participants });

    if (!dateString) {
      return new Response(
        JSON.stringify({ error: 'La date est requise' }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }

    // Parser la date
    const date = new Date(dateString);
    
    // Vérifier si c'est une date valide
    if (isNaN(date.getTime())) {
      return new Response(
        JSON.stringify({ error: 'Format de date invalide' }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }

    // Récupérer le jour de la semaine (0: dimanche, 1: lundi, ..., 6: samedi)
    const dayOfWeek = date.getDay();
    // Convertir pour notre schéma (1: lundi, ..., 7: dimanche)
    const dayMap = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;
    const dayColumn = dayMap[dayOfWeek];

    console.log('Fetching slots for day:', dayColumn);

    // Récupérer tous les créneaux horaires pour ce jour de la semaine
    const allTimeSlots = await db.select().from(TimeSlots).where(eq(TimeSlots[dayColumn], true));

    console.log('Available time slots:', allTimeSlots);

    // Formater la date pour la comparaison (YYYY-MM-DD)
    const formattedDate = date.toISOString().split('T')[0];

    // Récupérer les réservations existantes pour cette date
    const existingReservations = experienceId 
      ? await db.select().from(Reservations).where(
          and(
            eq(Reservations.experienceId, parseInt(experienceId)),
            eq(Reservations.date, new Date(formattedDate))
          )
        )
      : await db.select().from(Reservations).where(
          eq(Reservations.date, new Date(formattedDate))
        );

    console.log('Existing reservations:', existingReservations);

    // Calculer les créneaux disponibles
    const availableTimeSlots = allTimeSlots.map(timeSlot => {
      // Filtrer les réservations pour ce créneau horaire
      const reservationsForTimeSlot = existingReservations.filter(
        reservation => reservation.timeSlotId === timeSlot.id
      );

      // Calculer la capacité restante
      const totalReservedCapacity = reservationsForTimeSlot.reduce(
        (sum, reservation) => sum + reservation.numberOfPeople,
        0
      );
      const remainingCapacity = timeSlot.capacity - totalReservedCapacity;

      // Ajouter l'information de disponibilité
      return {
        ...timeSlot,
        remainingCapacity,
        isAvailable: remainingCapacity >= participants
      };
    });

    // Filtrer pour ne renvoyer que les créneaux disponibles
    const availableSlots = availableTimeSlots
      .filter(slot => slot.isAvailable)
      .sort((a, b) => a.start.localeCompare(b.start));

    return new Response(
      JSON.stringify(availableSlots),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    );
  } catch (error) {
    console.error('Erreur lors de la récupération des créneaux disponibles:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Une erreur est survenue lors de la récupération des créneaux disponibles' 
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
