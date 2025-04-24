import { defineDb, defineTable, column } from 'astro:db';

// Schéma pour les créneaux horaires
export const TimeSlots = defineTable({
  columns: {
    id: column.number({ primaryKey: true, autoIncrement: true }),
    start: column.text(),
    end: column.text(),
    capacity: column.number({ default: 6 }),
    duration: column.text(), // '30min' ou '1h'
    monday: column.boolean({ default: true }),
    tuesday: column.boolean({ default: true }),
    wednesday: column.boolean({ default: true }),
    thursday: column.boolean({ default: true }),
    friday: column.boolean({ default: true }),
    saturday: column.boolean({ default: true }),
    sunday: column.boolean({ default: true }),
    active: column.boolean({ default: true })
  }
});

// Schéma pour les réservations
export const Reservations = defineTable({
  columns: {
    id: column.number({ primaryKey: true, autoIncrement: true }),
    experienceId: column.number(),
    experienceSlug: column.text(), // Pour lier aux Content Collections
    date: column.date(),
    timeSlotId: column.number(),
    customerName: column.text(),
    customerEmail: column.text(),
    customerPhone: column.text(),
    numberOfPeople: column.number(),
    duration: column.text(), // '30min' ou '1h'
    status: column.text({ default: 'confirmed' }),
    specialRequests: column.text({ optional: true }),
    price: column.number(),
    referenceNumber: column.text({ optional: true }),
    createdAt: column.date({ default: () => new Date() }),
    updatedAt: column.date({ optional: true })
  }
});

// Configuration complète de la base de données
export default defineDb({
  tables: {
    TimeSlots,
    Reservations
  }
});
