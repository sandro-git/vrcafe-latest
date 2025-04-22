import { defineDb, defineTable, column } from 'astro:db';

// Définition de la table TimeSlots
const TimeSlots = defineTable({
  columns: {
    id: column.number({ primaryKey: true, autoIncrement: true }),
    start: column.text(),
    end: column.text(),
    capacity: column.number({ default: 6 }),
    monday: column.boolean({ default: true }),
    tuesday: column.boolean({ default: true }),
    wednesday: column.boolean({ default: true }),
    thursday: column.boolean({ default: true }),
    friday: column.boolean({ default: true }),
    saturday: column.boolean({ default: true }),
    sunday: column.boolean({ default: true })
  }
});

// Définition de la table Reservations
const Reservations = defineTable({
  columns: {
    id: column.number({ primaryKey: true, autoIncrement: true }),
    experienceId: column.number(),
    experienceSlug: column.text(),
    date: column.date(),
    timeSlotId: column.number(),
    customerName: column.text(),
    customerEmail: column.text(),
    customerPhone: column.text(),
    numberOfPeople: column.number(),
    status: column.text({ default: 'confirmed' }),
    specialRequests: column.text({ optional: true }),
    createdAt: column.date()
  }
});

// Définition de la base de données
export default defineDb({
  tables: {
    TimeSlots,
    Reservations
  }
});
