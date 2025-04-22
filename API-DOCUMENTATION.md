# Documentation de l'API du système de réservation

Cette documentation détaille les points d'entrée (endpoints) API disponibles pour le système de réservation du VR Café, leur utilisation et les formats de données attendus.

## API Experiences

Permet de récupérer les expériences disponibles depuis les Content Collections.

### GET `/api/experiences`

Récupère la liste des expériences, avec possibilité de filtrage.

**Paramètres de requête:**
- `tag` (optionnel): Filtre par type d'expérience ('escapeGame', 'jeuxVR', 'freeroaming', 'escapeFreeroaming')
- `editeur` (optionnel): Filtre par éditeur ('arvi', 'octopod', 'ldlc', 'ubisoft', 'vex')

**Exemple de requête:**
```
GET /api/experiences?tag=escapeGame&editeur=arvi
```

**Exemple de réponse:**
```json
[
  {
    "data": {
      "id": 24,
      "name": "Chernobyl",
      "slug": "chernobyl",
      "image": "chernobyl.jpg",
      "youtube": "https://youtu.be/AZzWC92dd6M",
      "tag": "escapeGame",
      "editeur": "arvi"
    },
    "body": "Si seulement nous pouvions changer le passé..."
  },
  // Autres expériences...
]
```

## API Calcul de prix

Permet de calculer le prix en fonction de l'expérience et du nombre de participants.

### GET `/api/calculate-price`

Calcule le prix total et par personne pour une réservation.

**Paramètres de requête:**
- `experienceId` (obligatoire): ID de l'expérience
- `participants` (obligatoire): Nombre de participants
- `duration` (obligatoire): Durée ('30min' ou '1h')

**Exemple de requête:**
```
GET /api/calculate-price?experienceId=24&participants=4&duration=1h
```

**Exemple de réponse:**
```json
{
  "basePrice": 29,
  "totalPrice": 108,
  "pricePerPerson": 27,
  "savings": 8,
  "experienceName": "Chernobyl",
  "experienceType": "escapeGame"
}
```

## API Disponibilité

Permet de vérifier les créneaux horaires disponibles pour une date et une expérience données.

### GET `/api/check-availability`

Récupère les créneaux disponibles pour une date spécifique.

**Paramètres de requête:**
- `date` (obligatoire): Date au format YYYY-MM-DD
- `durationId` (obligatoire): Durée ('30min' ou '1h')
- `experienceId` (optionnel): ID de l'expérience
- `participants` (optionnel): Nombre de participants

**Exemple de requête:**
```
GET /api/check-availability?date=2025-05-01&durationId=1h&participants=3
```

**Exemple de réponse:**
```json
{
  "date": "2025-05-01",
  "durationId": "1h",
  "availableSlots": [
    {
      "id": 10,
      "start": "10:00",
      "end": "11:00",
      "remainingCapacity": 5,
      "isAvailable": true
    },
    // Autres créneaux disponibles...
  ]
}
```

## API Réservations

Permet de créer et de gérer les réservations.

### POST `/api/reservations`

Crée une nouvelle réservation.

**Corps de la requête:**
```json
{
  "experienceId": 24,
  "experienceSlug": "chernobyl",
  "date": "2025-05-01",
  "timeSlotId": 10,
  "customerName": "Jean Dupont",
  "customerEmail": "jean@example.com",
  "customerPhone": "06 12 34 56 78",
  "numberOfPeople": 3,
  "duration": "1h",
  "price": 81,
  "specialRequests": "Nous sommes tous débutants en VR"
}
```

**Exemple de réponse:**
```json
{
  "id": "VR-25-00123",
  "message": "Réservation créée avec succès",
  "details": {
    "experienceId": 24,
    "experienceSlug": "chernobyl",
    "date": "2025-05-01",
    "timeSlotId": 10,
    "customerName": "Jean Dupont",
    "customerEmail": "jean@example.com",
    "customerPhone": "06 12 34 56 78",
    "numberOfPeople": 3,
    "duration": "1h",
    "price": 81,
    "status": "confirmed",
    "createdAt": "2025-04-22T10:30:00.000Z"
  }
}
```

### GET `/api/reservations`

Récupère les réservations (protégé par authentification admin).

**Paramètres de requête:**
- `adminKey` (obligatoire): Clé d'authentification admin
- `fromDate` (optionnel): Date de début au format YYYY-MM-DD
- `toDate` (optionnel): Date de fin au format YYYY-MM-DD
- `experienceId` (optionnel): ID de l'expérience

**Exemple de requête:**
```
GET /api/reservations?adminKey=admin123&fromDate=2025-05-01&toDate=2025-05-31
```

**Exemple de réponse:**
```json
[
  {
    "id": 1,
    "experienceId": 24,
    "experienceSlug": "chernobyl",
    "date": "2025-05-01T00:00:00.000Z",
    "timeSlotId": 10,
    "customerName": "Jean Dupont",
    "customerEmail": "jean@example.com",
    "customerPhone": "06 12 34 56 78",
    "numberOfPeople": 3,
    "duration": "1h",
    "status": "confirmed",
    "specialRequests": "Nous sommes tous débutants en VR",
    "price": 81,
    "referenceNumber": "VR-25-00123",
    "createdAt": "2025-04-15T10:30:00.000Z"
  },
  // Autres réservations...
]
```

## Schéma de base de données

### Table TimeSlots

```typescript
TimeSlots = {
  id: number (primaryKey, autoIncrement),
  start: string,
  end: string,
  capacity: number (default: 6),
  duration: string, // '30min' ou '1h'
  monday: boolean (default: true),
  tuesday: boolean (default: true),
  wednesday: boolean (default: true),
  thursday: boolean (default: true),
  friday: boolean (default: true),
  saturday: boolean (default: true),
  sunday: boolean (default: true),
  active: boolean (default: true)
}
```

### Table Reservations

```typescript
Reservations = {
  id: number (primaryKey, autoIncrement),
  experienceId: number,
  experienceSlug: string,
  date: Date,
  timeSlotId: number,
  customerName: string,
  customerEmail: string,
  customerPhone: string,
  numberOfPeople: number,
  duration: string, // '30min' ou '1h'
  status: string (default: 'confirmed'),
  specialRequests: string (optional),
  price: number,
  referenceNumber: string (optional),
  createdAt: Date (default: now),
  updatedAt: Date (optional)
}
```

## Codes d'erreur

| Code | Description |
|------|-------------|
| 400 | Requête invalide (paramètres manquants ou incorrects) |
| 401 | Non autorisé (clé admin incorrecte) |
| 404 | Ressource non trouvée |
| 409 | Conflit (créneau déjà réservé) |
| 500 | Erreur serveur interne |

## Limites et considérations

- Les API sont conçues pour fonctionner avec le front-end React fourni
- Les clés d'authentification admin sont temporaires et devraient être remplacées par un système d'authentification plus robuste
- La vérification de disponibilité n'est pas en temps réel et peut nécessiter une actualisation pour obtenir les données les plus récentes
- Les API suivent les principes RESTful pour une utilisation cohérente

---

Pour toute question ou problème concernant l'API, veuillez contacter l'équipe de développement.
