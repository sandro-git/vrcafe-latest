import { db, TimeSlots } from 'astro:db';

// Script de peuplement initial de la base de données
// Pour exécuter: npm run astro db seed

export default async function seed() {
  // Créneaux pour les sessions de 30 minutes
  const timeSlots30min = [
    { start: '09:30', end: '10:00', duration: '30min', capacity: 6 },
    { start: '10:00', end: '10:30', duration: '30min', capacity: 6 },
    { start: '10:30', end: '11:00', duration: '30min', capacity: 6 },
    { start: '11:00', end: '11:30', duration: '30min', capacity: 6 },
    { start: '11:30', end: '12:00', duration: '30min', capacity: 6 },
    { start: '12:00', end: '12:30', duration: '30min', capacity: 6 },
    { start: '12:30', end: '13:00', duration: '30min', capacity: 6 },
    { start: '13:00', end: '13:30', duration: '30min', capacity: 6 },
    { start: '13:30', end: '14:00', duration: '30min', capacity: 6 },
    { start: '14:00', end: '14:30', duration: '30min', capacity: 6 },
    { start: '14:30', end: '15:00', duration: '30min', capacity: 6 },
    { start: '15:00', end: '15:30', duration: '30min', capacity: 6 },
    { start: '15:30', end: '16:00', duration: '30min', capacity: 6 },
    { start: '16:00', end: '16:30', duration: '30min', capacity: 6 },
    { start: '16:30', end: '17:00', duration: '30min', capacity: 6 },
    { start: '17:00', end: '17:30', duration: '30min', capacity: 6 },
    { start: '17:30', end: '18:00', duration: '30min', capacity: 6 },
    { start: '18:00', end: '18:30', duration: '30min', capacity: 6 },
    { start: '18:30', end: '19:00', duration: '30min', capacity: 6 },
    { start: '19:00', end: '19:30', duration: '30min', capacity: 6 },
    { start: '19:30', end: '20:00', duration: '30min', capacity: 6 },
    { start: '20:00', end: '20:30', duration: '30min', capacity: 6 },
  ];

  // Créneaux pour les sessions d'1 heure
  const timeSlots1h = [
    { start: '09:00', end: '10:00', duration: '1h', capacity: 6 },
    { start: '10:00', end: '11:00', duration: '1h', capacity: 6 },
    { start: '11:00', end: '12:00', duration: '1h', capacity: 6 },
    { start: '12:00', end: '13:00', duration: '1h', capacity: 6 },
    { start: '13:00', end: '14:00', duration: '1h', capacity: 6 },
    { start: '14:00', end: '15:00', duration: '1h', capacity: 6 },
    { start: '15:00', end: '16:00', duration: '1h', capacity: 6 },
    { start: '16:00', end: '17:00', duration: '1h', capacity: 6 },
    { start: '17:00', end: '18:00', duration: '1h', capacity: 6 },
    { start: '18:00', end: '19:00', duration: '1h', capacity: 6 },
    { start: '19:00', end: '20:00', duration: '1h', capacity: 6 },
    { start: '20:00', end: '21:00', duration: '1h', capacity: 6 },
  ];

  // Configuration pour les jours de semaine réguliers
  const weekdayConfig = {
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: true,
    sunday: true,
  };

  // Disponibilité adaptée pour certains jours
  const officeHoursConfig = {
    ...weekdayConfig,
    monday: false, // Fermé les lundis
  };

  // Configuration du matin uniquement (9h-14h)
  const morningOnlyConfig = {
    ...weekdayConfig,
    monday: false,
  };

  // Configuration du soir uniquement (17h-21h)
  const eveningOnlyConfig = {
    ...weekdayConfig,
    monday: false,
  };

  try {
    console.log('🌱 Peuplement de la table TimeSlots...');

    // Insérer les créneaux pour les sessions de 30 minutes
    for (const slot of timeSlots30min) {
      let config;
      
      // Appliquer des configurations différentes selon l'heure
      if (slot.start < '12:00') {
        config = morningOnlyConfig;
      } else if (slot.start >= '17:00') {
        config = eveningOnlyConfig;
      } else {
        config = officeHoursConfig;
      }
      
      await db.insert(TimeSlots).values({
        ...slot,
        ...config,
      });
    }
    
    // Insérer les créneaux pour les sessions d'1 heure
    for (const slot of timeSlots1h) {
      let config;
      
      // Appliquer des configurations différentes selon l'heure
      if (slot.start < '12:00') {
        config = morningOnlyConfig;
      } else if (slot.start >= '17:00') {
        config = eveningOnlyConfig;
      } else {
        config = officeHoursConfig;
      }
      
      await db.insert(TimeSlots).values({
        ...slot,
        ...config,
      });
    }

    console.log('✅ Initialisation des données réussie !');
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation des données:', error);
    throw error;
  }
}
