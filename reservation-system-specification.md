# Système de réservation VR Café

Ce document détaille le flux de réservation personnalisé pour le site VR Café, utilisant Astro DB et Astro Content Collections.

## Flux de réservation en 4 étapes

### 1. Sélection d'expérience

**Objectif**: Permettre à l'utilisateur de choisir l'expérience VR qu'il souhaite réserver.

**Fonctionnalités**:
- Affichage des expériences disponibles en grille, avec une image et un titre par expérience
- Affichage de 4 choix principaux de catégories:
  - Escape Games VR
  - Jeux VR
  - Escape Games Sans Fil
  - VR Sans Fil
- Sélection de l'expérience par un bouton "Choisir cette expérience"
- Données statiques provenant des Content Collections

**Apparence UI**:
- Style cohérent avec le reste du site (bleu #2563eb, fond sombre #111827 ou #1f2937)
- Cartes dans le style des composants `Card.astro` existants
- Boutons bleus arrondis comme les boutons de réservation actuels

### 2. Sélection du nombre de participants

**Objectif**: Permettre à l'utilisateur d'indiquer combien de personnes participeront à l'expérience.

**Fonctionnalités**:
- Sélecteur numérique pour choisir le nombre de participants
- Affichage des limitations (min/max de participants) selon l'expérience choisie
- Calcul et affichage du prix total en fonction du nombre de participants et des tarifs
- Indication claire si une réduction de groupe s'applique

**Apparence UI**:
- Interface similaire aux cartes de tarification actuelles
- Compteur numérique avec boutons + et - stylisés
- Affichage du prix total en gros caractères
- Mise en évidence visuelle des économies potentielles

### 3. Sélection date et heure

**Objectif**: Permettre à l'utilisateur de choisir quand il souhaite réserver l'expérience.

**Fonctionnalités**:
- Calendrier interactif pour sélectionner une date
- Affichage des créneaux horaires disponibles pour la date sélectionnée
- Indication visuelle des créneaux déjà complets
- Vérification en temps réel de la disponibilité en fonction du nombre de participants

**Apparence UI**:
- Calendrier avec jours disponibles en surbrillance
- Créneaux horaires présentés sous forme de boutons
- Code couleur cohérent (disponible en bleu, indisponible en gris)
- Style de sélection correspondant aux boutons du site

### 4. Informations client et confirmation

**Objectif**: Collecter les informations nécessaires et finaliser la réservation.

**Fonctionnalités pour la partie information**:
- Formulaire avec validation pour:
  - Nom complet
  - Email (avec confirmation)
  - Numéro de téléphone
  - Remarques/demandes spéciales (optionnel)

**Fonctionnalités pour la partie confirmation**:
- Récapitulatif complet de la réservation (expérience, date, heure, nombre de participants, prix total)
- Numéro de réservation unique
- Instructions pour le jour de l'expérience
- Options pour:
  - Recevoir une confirmation par email
  - Ajouter l'événement au calendrier

**Apparence UI**:
- Formulaire dans le style de la page de contact existante
- Mise en page claire et aérée
- Cohérence visuelle avec la page de contact
- Confirmation dans une carte style Tailwind avec bordure et ombre

## Design système global

**Navigation et progression**:
- Indicateur de progression en haut montrant les 4 étapes
- Boutons "Précédent" et "Suivant" pour naviguer entre les étapes
- Style cohérent avec les boutons "Réserver" existants

**Palette de couleurs**:
- Utilisation du bleu principal (#2563eb) pour les actions et sélections principales
- Fond sombre (#111827) pour le mode sombre
- Texte blanc (#ffffff) sur fond sombre
- Texte sombre (#111827) sur fond clair
- Utilisation des couleurs d'accent existantes pour les notifications

**Typographie**:
- Titres en "font-extrabold" comme les composants Title.astro
- Corps de texte en "font-normal" pour la lisibilité
- Tailles cohérentes avec le reste du site

**Responsive design**:
- Adaptation complète du mobile au desktop
- Layout en colonne unique sur mobile, multi-colonnes sur desktop
- Taille de texte et d'interaction adaptée aux appareils tactiles

## Schémas Astro DB

### Table TimeSlots
```typescript
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
```

### Table Reservations
```typescript
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
    createdAt: column.date({ default: () => new Date() })
  }
});
```

## Composants React à développer

1. `ReservationFlow.jsx` - Composant principal qui orchestre toutes les étapes
2. `ExperienceSelector.jsx` - Grille et filtres d'expériences
3. `ParticipantSelector.jsx` - Interface de sélection du nombre de participants
4. `DateTimeSelector.jsx` - Calendrier et sélection de créneaux
5. `CustomerForm.jsx` - Formulaire d'information client
6. `ReservationSummary.jsx` - Récapitulatif et confirmation
7. `ProgressIndicator.jsx` - Indicateur d'étapes du processus

## API Endpoints

1. `/api/experiences` - Obtenir les expériences filtrées par catégorie
2. `/api/available-slots` - Obtenir les créneaux disponibles pour une date et une expérience
3. `/api/calculate-price` - Calculer le prix en fonction de l'expérience et du nombre de personnes
4. `/api/reservations` - Créer une nouvelle réservation

## Processus de développement recommandé

1. Configurer Astro DB et créer les schémas
2. Développer les composants React pour chaque étape
3. Créer les endpoints API
4. Tester le flux complet
5. Remplacer l'intégration SimplyBook actuelle par le nouveau système
