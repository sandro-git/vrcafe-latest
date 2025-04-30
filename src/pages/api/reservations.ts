import type { APIRoute } from 'astro';
import { db, eq, gte, lte, and, desc } from 'astro:db';
import { Reservations, TimeSlots } from '../../../db/schema';
export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    
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
    
    // Vérification des champs obligatoires
    if (!experienceId || !experienceSlug || !date || !timeSlotId || !customerName || 
        !customerEmail || !customerPhone || !numberOfPeople || !duration || !price) {
      return new Response(
        JSON.stringify({ error: 'Tous les champs obligatoires doivent être renseignés' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    // Récupération du créneau horaire à partir de l'ID depuis la base de données
    // Validation de la date et de l'heure (doivent être dans le futur)
    const reservationDate = new Date(date);
    
    // Récupérer le créneau horaire depuis la base de données
    const timeSlot = await db.select(TimeSlots)
      .where(eq(TimeSlots.id, timeSlotId))
      .first();
    
    if (!timeSlot) {
      return new Response(
        JSON.stringify({ error: 'Créneau horaire invalide ou introuvable' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // timeSlot is already assigned above
    
    // Vérifier si le créneau est actif
    if (!timeSlot.active) {
      return new Response(
        JSON.stringify({ error: 'Ce créneau horaire n\'est pas disponible actuellement' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Vérification de la disponibilité selon le jour de la semaine
    const dayOfWeek = reservationDate.getDay(); // 0 = dimanche, 1 = lundi, etc.
    const dayAvailability = {
      0: timeSlot.sunday,
      1: timeSlot.monday,
      2: timeSlot.tuesday,
      3: timeSlot.wednesday,
      4: timeSlot.thursday,
      5: timeSlot.friday,
      6: timeSlot.saturday
    };
    
    if (!dayAvailability[dayOfWeek]) {
      return new Response(
        JSON.stringify({ error: 'Ce créneau n\'est pas disponible pour le jour sélectionné' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Créer une date/heure complète pour la réservation en combinant la date et l'heure de début du créneau
    const [hours, minutes] = timeSlot.start.split(':').map(Number);
    const reservationDateTime = new Date(reservationDate);
    reservationDateTime.setHours(hours, minutes, 0, 0);
    
    const now = new Date();
    if (reservationDateTime <= now) {
      return new Response(
        JSON.stringify({ error: 'La date et l\'heure de réservation doivent être dans le futur' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validation du prix (doit être un nombre positif)
    if (typeof price !== 'number' || price <= 0) {
      return new Response(
        JSON.stringify({ error: 'Le prix doit être un nombre positif' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validation du nombre de participants selon le type d'expérience
    const maxParticipants = ['freeroaming', 'escapeFreeroaming'].includes(experienceSlug) ? 4 : 6;
    const minParticipants = 1;

    if (numberOfPeople < minParticipants || numberOfPeople > maxParticipants) {
      return new Response(
        JSON.stringify({ 
          error: `Le nombre de participants doit être entre ${minParticipants} et ${maxParticipants} pour ce type d'expérience` 
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validation du format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerEmail)) {
      return new Response(
        JSON.stringify({ error: 'Le format de l\'email est invalide' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validation du numéro de téléphone (format français)
    const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
    if (!phoneRegex.test(customerPhone)) {
      return new Response(
        JSON.stringify({ error: 'Le format du numéro de téléphone est invalide' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Création d'une nouvelle réservation dans la base de données
    try {
      // Insérer la réservation dans la base de données
      const createdAt = new Date();
      const insertResult = await db.insert(Reservations).values({
        experienceId,
        experienceSlug,
        date: new Date(date),
        timeSlotId,
        customerName,
        customerEmail,
        customerPhone,
        numberOfPeople,
        duration,
        price,
        status: 'confirmed',
        specialRequests: specialRequests || null,
        createdAt,
        referenceNumber: null
      });

      // Fetch the inserted reservation
      const reservation = await db.select(Reservations)
        .where(and(
          eq(Reservations.customerEmail, customerEmail),
          eq(Reservations.date, new Date(date)),
          eq(Reservations.timeSlotId, timeSlotId)
        ))
        .order(desc(Reservations.id))
        .first();

      // Récupérer la réservation créée
      if (!reservation) {
        throw new Error('Échec de la création de la réservation');
      }
      
      // Génération d'un identifiant lisible
      const readableId = `VR-${new Date().getFullYear().toString().slice(2)}-${reservation.id.toString().padStart(5, '0')}`;
      
      return new Response(
        JSON.stringify({
          id: reservation.id,
          referenceNumber: readableId,
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
            createdAt: createdAt.toISOString()
          }
        }),
        { status: 201, headers: { 'Content-Type': 'application/json' } }
      );
    } catch (dbError) {
      console.error('Erreur lors de l\'insertion en base de données:', dbError);
      
      return new Response(
        JSON.stringify({ error: 'Une erreur est survenue lors de la création de la réservation dans la base de données' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Erreur lors de la création de la réservation:', error);
    
    return new Response(
      JSON.stringify({ error: 'Une erreur est survenue lors de la création de la réservation' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

// Pour récupérer les réservations (protégé par authentification admin)
export const GET: APIRoute = async ({ request, url }) => {
  try {
    // Cette route devrait être protégée par une authentification
    const adminKey = url.searchParams.get('adminKey');
    
    if (adminKey !== 'admin123') { // À remplacer par une vraie authentification
      return new Response(
        JSON.stringify({ error: 'Non autorisé' }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Récupérer les paramètres de filtrage
    const fromDate = url.searchParams.get('fromDate');
    const toDate = url.searchParams.get('toDate');
    const experienceId = url.searchParams.get('experienceId');
    
    // Build the conditions array
    const conditions = [];

    if (fromDate) {
      const fromDateTime = new Date(fromDate);
      conditions.push(gte(Reservations.date, fromDateTime));
    }

    if (toDate) {
      const toDateTime = new Date(toDate);
      conditions.push(lte(Reservations.date, toDateTime));
    }

    if (experienceId) {
      const expId = parseInt(experienceId);
      conditions.push(eq(Reservations.experienceId, expId));
    }

    // Execute the query with all conditions
    const reservations = conditions.length > 0
      ? await db.select(Reservations).where(and(...conditions)).all()
      : await db.select(Reservations).all();
    
    // Récupérer tous les time slots pour les lier aux réservations
    const timeSlots = await db.select(TimeSlots).all();
    const timeSlotsById = Object.fromEntries(timeSlots.map(ts => [ts.id, ts]));
    
    // Ajouter la référence lisible pour chaque réservation
    const processedReservations = reservations.map(reservation => ({
      ...reservation,
      referenceNumber: `VR-${new Date(reservation.createdAt).getFullYear().toString().slice(2)}-${reservation.id.toString().padStart(5, '0')}`,
      timeSlot: timeSlotsById[reservation.timeSlotId] || null,
      date: reservation.date.toISOString(),
      createdAt: reservation.createdAt.toISOString(),
    }));
    
    // Trier par date
    processedReservations.sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  
    return new Response(
      JSON.stringify(processedReservations),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
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
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};
