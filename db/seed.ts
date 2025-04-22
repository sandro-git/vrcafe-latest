import { db, TimeSlots } from 'astro:db';

// Script pour initialiser la base de données avec des créneaux horaires par défaut
export default async function() {
  // Supprimer les données existantes pour éviter les doublons
  await db.delete(TimeSlots);
  
  // Créneaux du matin
  await db.insert(TimeSlots).values([
    {
      start: '10:00',
      end: '10:30',
      capacity: 6,
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: true
    },
    {
      start: '10:30',
      end: '11:00',
      capacity: 6,
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: true
    },
    {
      start: '11:00',
      end: '11:30',
      capacity: 6,
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: true
    },
    {
      start: '11:30',
      end: '12:00',
      capacity: 6,
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: true
    },
  ]);

  // Créneaux de l'après-midi
  await db.insert(TimeSlots).values([
    {
      start: '14:00',
      end: '14:30',
      capacity: 6,
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: true
    },
    {
      start: '14:30',
      end: '15:00',
      capacity: 6,
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: true
    },
    {
      start: '15:00',
      end: '15:30',
      capacity: 6,
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: true
    },
    {
      start: '15:30',
      end: '16:00',
      capacity: 6,
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: true
    },
    {
      start: '16:00',
      end: '16:30',
      capacity: 6,
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: true
    },
    {
      start: '16:30',
      end: '17:00',
      capacity: 6,
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: true
    },
  ]);

  // Créneaux de soirée
  await db.insert(TimeSlots).values([
    {
      start: '17:00',
      end: '17:30',
      capacity: 6,
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: true
    },
    {
      start: '17:30',
      end: '18:00',
      capacity: 6,
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: true
    },
    {
      start: '18:00',
      end: '18:30',
      capacity: 6,
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: true
    },
    {
      start: '18:30',
      end: '19:00',
      capacity: 6,
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: true
    },
  ]);

  console.log('Base de données initialisée avec les créneaux horaires par défaut');
}
