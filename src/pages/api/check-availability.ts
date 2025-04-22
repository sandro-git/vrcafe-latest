import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request, url }) => {
  try {
    // Récupérer les paramètres de requête
    const date = url.searchParams.get('date');
    const experienceId = url.searchParams.get('experienceId');
    const durationId = url.searchParams.get('durationId');
    const participants = url.searchParams.get('participants');
    
    if (!date || !durationId) {
      return new Response(
        JSON.stringify({ error: 'La date et la durée sont requises' }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }
    
    // Cette fonction simulera pour l'instant la vérification de disponibilité
    // Dans une implémentation réelle, elle consulterait Astro DB
    const checkAvailability = (date: string, durationId: string, experienceId?: string, participants?: string) => {
      const requestDate = new Date(date);
      const dayOfWeek = requestDate.getDay(); // 0 pour dimanche, 6 pour samedi
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      
      // Créneaux pour 30 minutes
      let timeSlots30min = [
        { id: 1, start: '10:00', end: '10:30', remainingCapacity: 6 },
        { id: 2, start: '11:00', end: '11:30', remainingCapacity: 6 },
        { id: 3, start: '12:00', end: '12:30', remainingCapacity: 6 },
        { id: 4, start: '14:00', end: '14:30', remainingCapacity: 6 },
        { id: 5, start: '15:00', end: '15:30', remainingCapacity: 6 },
        { id: 6, start: '16:00', end: '16:30', remainingCapacity: 6 },
        { id: 7, start: '17:00', end: '17:30', remainingCapacity: 6 },
        { id: 8, start: '18:00', end: '18:30', remainingCapacity: 6 },
        { id: 9, start: '19:00', end: '19:30', remainingCapacity: 6 },
      ];
      
      // Créneaux pour 1 heure
      let timeSlots1h = [
        { id: 10, start: '10:00', end: '11:00', remainingCapacity: 6 },
        { id: 11, start: '11:30', end: '12:30', remainingCapacity: 6 },
        { id: 12, start: '13:00', end: '14:00', remainingCapacity: 6 },
        { id: 13, start: '14:30', end: '15:30', remainingCapacity: 6 },
        { id: 14, start: '16:00', end: '17:00', remainingCapacity: 6 },
        { id: 15, start: '17:30', end: '18:30', remainingCapacity: 6 },
        { id: 16, start: '19:00', end: '20:00', remainingCapacity: 6 },
      ];
      
      // Ajouter des créneaux supplémentaires pour les weekends
      if (isWeekend) {
        timeSlots30min.push(
          { id: 17, start: '09:30', end: '10:00', remainingCapacity: 6 },
          { id: 18, start: '20:00', end: '20:30', remainingCapacity: 6 }
        );
        
        timeSlots1h.push(
          { id: 19, start: '09:00', end: '10:00', remainingCapacity: 6 },
          { id: 20, start: '20:30', end: '21:30', remainingCapacity: 6 }
        );
      }
      
      // Simuler l'occupation aléatoire des créneaux
      const simulateOccupancy = (slots: any[]) => {
        return slots.map(slot => {
          // Simuler une occupation aléatoire entre 0 et 6 personnes
          const randomOccupancy = Math.floor(Math.random() * 7);
          const remainingCapacity = Math.max(0, 6 - randomOccupancy);
          
          return {
            ...slot,
            remainingCapacity,
            isAvailable: remainingCapacity >= (participants ? parseInt(participants) : 1)
          };
        });
      };
      
      // Sélectionner les créneaux en fonction de la durée
      const slots = durationId === '30min' ? timeSlots30min : timeSlots1h;
      
      // Simuler l'occupation
      const occupiedSlots = simulateOccupancy(slots);
      
      // Filtre en fonction de la capacité restante
      return occupiedSlots.filter(slot => slot.isAvailable);
    };
    
    // Obtenir les créneaux disponibles
    const availableSlots = checkAvailability(date, durationId, experienceId || undefined, participants || undefined);
    
    return new Response(
      JSON.stringify({
        date,
        durationId,
        availableSlots
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('Erreur lors de la vérification de disponibilité:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Une erreur est survenue lors de la vérification de disponibilité' 
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
