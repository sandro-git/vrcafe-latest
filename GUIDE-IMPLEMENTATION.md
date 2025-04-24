# Guide d'implémentation du nouveau système de réservation VR Café

Ce document détaille les étapes nécessaires pour mettre en place le nouveau système de réservation personnalisé pour le site VR Café, utilisant Astro Content Collections et Astro DB.

## 1. Prérequis techniques

- Node.js (v18 ou supérieur)
- Astro v3.5 ou supérieur
- Tailwind CSS (déjà intégré)
- React (pour les composants interactifs)

## 2. Structure des fichiers

Tous les fichiers nécessaires ont été créés. L'organisation principale est la suivante:

```
src/
├── components/
│   └── reservation/                  # Composants du système de réservation
│       ├── ReservationFlow.jsx       # Composant principal
│       ├── ExperienceSelector.jsx    # Sélection d'expérience
│       ├── DurationSelector.jsx      # Sélection de durée (30min/1h)
│       ├── ParticipantSelector.jsx   # Sélection du nombre de participants
│       ├── DateTimeSelector.jsx      # Sélection de date et heure
│       ├── CustomerForm.jsx          # Formulaire d'informations client
│       ├── ReservationSummary.jsx    # Récapitulatif et confirmation
│       ├── ProgressIndicator.jsx     # Indicateur des étapes du flux
│       └── AdminReservations.jsx     # Interface d'administration
├── pages/
│   ├── reservation-new.astro         # Nouvelle page de réservation
│   ├── reservation-confirmation.astro # Page de confirmation
│   └── admin.astro                   # Interface d'administration
├── pages/api/
│   ├── experiences.ts                # API pour récupérer les expériences
│   ├── calculate-price.ts            # API pour calculer les prix
│   ├── check-availability.ts         # API pour vérifier les disponibilités
│   └── reservations.ts               # API pour gérer les réservations
└── db/
    ├── schema.ts                     # Schéma Astro DB
    └── seed.ts                       # Script d'initialisation
```

## 3. Étapes d'installation

1. **Mise à jour des dépendances**

```bash
npm install @astrojs/db
```

2. **Mise à jour du fichier astro.config.mjs**

Ajoutez le plugin db à votre configuration Astro:

```js
import db from '@astrojs/db';

export default defineConfig({
  integrations: [
    // Autres intégrations...
    db()
  ]
});
```

3. **Initialisation de la base de données**

```bash
npm run astro db push
npm run astro db seed
```

4. **Mise à jour de la navigation**

Remplacez le composant BookingButton actuel par le nouveau DualBookingButton:

```astro
<DualBookingButton id="MainButton" showChoice={true} />
```

Le paramètre `showChoice` permet d'afficher les deux options (ancien et nouveau système) pendant la phase de test.

## 4. Fonctionnalités implémentées

- **Flux de réservation en 6 étapes**:
  1. Sélection d'expérience (par catégorie)
  2. Sélection de durée (30 minutes ou 1 heure)
  3. Nombre de participants avec calcul dynamique des prix
  4. Choix de date et créneau horaire
  5. Informations du client
  6. Récapitulatif et confirmation

- **Tarification dynamique**:
  - Pour 30 minutes:
    - 18€ par personne pour les jeux standards
    - 25€ par personne pour les experiences freeroaming
    - Réductions de groupe: 5% pour 4-5 personnes, 10% pour 6+
  - Pour 1 heure:
    - 29€ par personne pour 1-2 participants
    - 27€ par personne pour 3-4 participants
    - 25€ par personne pour 5-6 participants

- **Gestion des disponibilités**:
  - Vérification des créneaux disponibles
  - Limitation par capacité

- **Interface d'administration**:
  - Vue d'ensemble des réservations
  - Filtrage par date et expérience
  - Gestion des statuts (confirmé, en attente, annulé)

## 5. Transition progressive

Pour permettre une transition en douceur, les deux systèmes de réservation peuvent coexister:

1. **Phase 1 - Test interne**:
   - Utiliser `showChoice={true}` sur le DualBookingButton
   - Tester le nouveau système en parallèle de l'ancien

2. **Phase 2 - Mise en production partielle**:
   - Rediriger 50% des utilisateurs vers le nouveau système
   - Collecter les retours

3. **Phase 3 - Migration complète**:
   - Désactiver l'ancien système
   - Rediriger toutes les requêtes vers le nouveau système

## 6. Personnalisations possibles

Le système a été conçu pour être facilement personnalisable:

- **Tarifs**: Modifiez les tarifs dans le composant `ParticipantSelector.jsx`
- **Expériences**: Gérez les expériences via les Content Collections
- **Créneaux horaires**: Modifiez les créneaux disponibles dans le script `db/seed.ts`
- **Design**: Tous les composants utilisent Tailwind CSS et peuvent être facilement adaptés à votre charte graphique

## 7. Maintenance et support

Pour toute assistance lors de l'implémentation:

1. Consultez la documentation d'Astro et d'Astro DB
2. Vérifiez les journaux dans la console pour les erreurs potentielles
3. N'hésitez pas à me contacter pour toute question ou problème rencontré

---

Une documentation plus détaillée de l'API est disponible dans le fichier `API-DOCUMENTATION.md`.
