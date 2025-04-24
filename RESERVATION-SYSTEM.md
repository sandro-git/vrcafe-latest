# Système de réservation VR Café

## Vue d'ensemble

Ce système de réservation personnalisé a été développé pour remplacer la solution SimplyBook actuellement utilisée par VR Café. Il offre une expérience utilisateur fluide, une tarification personnalisée adaptée aux besoins spécifiques de VR Café, et une intégration complète avec le site web existant.

## Fonctionnalités principales

### 1. Flux de réservation en 6 étapes
1. **Choix du type d'expérience** : Escape Game VR, Jeu VR, VR sans fil, Escape sans fil
2. **Sélection de la durée** : 30 minutes ou 1 heure
3. **Nombre de participants** : De 1 à 8 selon l'expérience, avec calcul dynamique du prix
4. **Date et heure** : Calendrier interactif et sélection de créneau
5. **Informations du client** : Formulaire avec validation
6. **Confirmation** : Récapitulatif et enregistrement

### 2. Tarification dynamique sophistiquée
- **30 minutes** :
  - Jeux standards : 18€/personne
  - Freeroaming : 25€/personne
  - Réductions de groupe : 5% (4-5 personnes), 10% (6+ personnes)
- **1 heure** :
  - 1-2 personnes : 29€/personne
  - 3-4 personnes : 27€/personne
  - 5-6 personnes : 25€/personne

### 3. Interface d'administration
- Tableau de bord des réservations
- Filtrage et recherche
- Gestion des statuts

## Technologies utilisées

- **Frontend** : React pour une interface interactive
- **Backend** : Astro DB pour le stockage des réservations
- **Contenu** : Astro Content Collections pour les expériences
- **Design** : Tailwind CSS pour une interface cohérente

## Architecture du système

Le système est construit autour des composants suivants :

- **Content Collections** : Stockage des informations statiques sur les expériences
- **Astro DB** : Base de données pour les créneaux horaires et les réservations
- **API Endpoints** : Points d'entrée pour les opérations CRUD
- **Composants React** : Interface utilisateur interactive

## Comment utiliser le système

### Pour les clients

1. Accédez au site web de VR Café
2. Cliquez sur "Réserver"
3. Suivez le flux de réservation en 6 étapes
4. Recevez une confirmation par email

### Pour les administrateurs

1. Accédez à la page `/admin`
2. Consultez les réservations
3. Filtrez par date, type d'expérience, etc.
4. Gérez les statuts (confirmé, en attente, annulé)

## Maintenance

### Gestion des créneaux horaires

Les créneaux horaires sont définis dans le fichier `db/seed.ts`. Pour modifier les horaires disponibles :

1. Mettez à jour les tableaux `timeSlots30min` et `timeSlots1h`
2. Exécutez `npm run astro db seed` pour mettre à jour la base de données

### Tarification

La logique de tarification est implémentée dans deux endroits :

1. Côté client : `src/components/reservation/ParticipantSelector.jsx`
2. Côté serveur : `src/pages/api/calculate-price.ts`

## Support et dépannage

En cas de problème :

1. Vérifiez les journaux dans la console du navigateur
2. Testez les API avec le script `script/test-reservation-system.js`
3. Contactez l'équipe de développement pour une assistance supplémentaire

---

Documentation complète disponible dans :
- `GUIDE-IMPLEMENTATION.md` : Guide d'implémentation détaillé
- `API-DOCUMENTATION.md` : Documentation technique des API
