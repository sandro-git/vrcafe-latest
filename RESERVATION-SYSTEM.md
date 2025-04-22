# Système de Réservation VR Café

Ce document explique comment configurer, tester et maintenir le nouveau système de réservation pour VR Café.

## Architecture

Le système utilise :
- **Astro DB** pour stocker les données dynamiques (réservations, créneaux horaires)
- **Astro Content Collections** pour les données statiques (expériences)
- **Composants React** pour l'interface utilisateur
- **API Astro** pour la logique côté serveur

## Structure des fichiers

```
src/
├── components/
│   └── reservation/         # Composants React du système de réservation
│       ├── ReservationFlow.jsx       # Composant principal qui gère tout le flux
│       ├── ProgressIndicator.jsx     # Indicateur d'étapes du processus
│       ├── ExperienceSelector.jsx    # Sélection de l'expérience
│       ├── ParticipantSelector.jsx   # Sélection du nombre de participants
│       ├── DateTimeSelector.jsx      # Sélection de la date et du créneau
│       ├── CustomerForm.jsx          # Formulaire d'informations client
│       └── ReservationSummary.jsx    # Récapitulatif et confirmation
├── pages/
│   ├── api/                 # Endpoints API
│   │   ├── experiences.ts          # API pour récupérer les expériences
│   │   ├── available-slots.ts      # API pour les créneaux disponibles
│   │   ├── calculate-price.ts      # API pour calculer le prix
│   │   └── reservations.ts         # API pour gérer les réservations
│   └── reservation-new.astro # Page de réservation (version test)
└── db/
    ├── config.ts           # Configuration des tables Astro DB
    └── seed.ts             # Script pour initialiser la base de données
```

## Installation

1. Assurez-vous que Astro DB est installé :
   ```
   npx astro add db
   ```

2. Initialisez la base de données :
   ```
   npm run astro db push
   ```

3. Remplissez la base de données avec les créneaux horaires par défaut :
   ```
   npm run astro db seed
   ```

## Développement et Test

Pour tester le système sans perturber le système actuel, nous utilisons une approche progressive :

1. La nouvelle page de réservation est disponible à `/reservation-new`
2. Le composant `BookingButtonNew.astro` peut être utilisé pour pointer vers la nouvelle page
3. Une fois le test validé, vous pouvez remplacer l'ancien système

## Flux de réservation

Le processus de réservation se déroule en 5 étapes :

1. **Sélection d'expérience** : L'utilisateur choisit le type d'expérience
2. **Sélection de participants** : Choix du nombre de personnes et calcul du prix
3. **Sélection date et heure** : Choix d'un créneau disponible
4. **Informations client** : Saisie des coordonnées
5. **Confirmation** : Récapitulatif et finalisation

## Personnalisation

### Prix et réductions

Les prix de base et les réductions sont configurés dans :
- `ParticipantSelector.jsx` pour l'affichage côté client
- `api/calculate-price.ts` pour les calculs côté serveur

Assurez-vous de maintenir ces deux fichiers synchronisés si vous modifiez la tarification.

### Créneaux horaires

Les créneaux horaires disponibles sont stockés dans la table `TimeSlots` d'Astro DB.
Pour modifier les créneaux par défaut, mettez à jour le fichier `db/seed.ts`.

### Limites de participants

Les limites de participants par type d'expérience sont définies dans :
- `ParticipantSelector.jsx`

## Mise en production

Pour passer du mode test à la production :

1. Testez soigneusement toutes les fonctionnalités sur `/reservation-new`
2. Renommez `reservation-new.astro` en `reservation.astro` (sauvegardez l'ancien fichier au besoin)
3. Modifiez `BookingButtonNew.astro` pour définir `testMode={false}`
4. Remplacez les références à `BookingButton.astro` par `BookingButtonNew.astro` dans les composants

## Maintenance

### Sauvegarde des données

Astro DB stocke les données dans un fichier SQLite. Pour sauvegarder les données :

1. Exportez la base de données depuis le tableau de bord Astro DB
2. Conservez une copie sécurisée des données

### Extensions futures

Le système est conçu pour être facilement extensible. Voici quelques améliorations potentielles :

1. **Système d'emails** : Ajouter l'envoi d'emails de confirmation
2. **Interface admin** : Créer une interface d'administration pour gérer les réservations
3. **Intégration de paiement** : Ajouter le paiement en ligne
4. **Notifications SMS** : Envoyer des rappels par SMS

## Résolution des problèmes

### Problèmes courants

1. **Les créneaux ne s'affichent pas** : Vérifiez que la table `TimeSlots` est correctement initialisée
2. **Erreurs de réservation** : Consultez les logs du serveur pour plus de détails
3. **Capacité incorrecte** : Vérifiez les paramètres de capacité dans `TimeSlots`

### Support

Pour toute question, contactez l'équipe de développement.
