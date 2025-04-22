import React, { useState } from 'react';

function ReservationSummary({ reservationData, onBack }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [reservationId, setReservationId] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Formatter la date
  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Formatter l'heure
  const formatTime = (timeSlot) => {
    if (!timeSlot) return '';
    return `${timeSlot.start} - ${timeSlot.end}`;
  };

  // Formater le nom de l'expérience
  const formatExperienceType = (tag) => {
    switch (tag) {
      case 'escapeGame':
        return 'Escape Game VR';
      case 'jeuxVR':
        return 'Jeu VR';
      case 'freeroaming':
        return 'VR Sans Fil';
      case 'escapeFreeroaming':
        return 'Escape Sans Fil';
      default:
        return tag;
    }
  };

  // Finaliser la réservation
  const handleFinalize = async () => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);
      
      // Préparer les données pour l'API
      const submissionData = {
        experienceId: reservationData.experience.id,
        experienceSlug: reservationData.experience.data.slug,
        date: reservationData.date.toISOString(),
        timeSlotId: reservationData.timeSlot.id,
        customerName: reservationData.customerInfo.name,
        customerEmail: reservationData.customerInfo.email,
        customerPhone: reservationData.customerInfo.phone,
        numberOfPeople: reservationData.participants,
        specialRequests: reservationData.customerInfo.specialRequests || ''
      };
      
      // Appel à l'API
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submissionData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la création de la réservation');
      }
      
      const responseData = await response.json();
      
      // Stocker l'identifiant de réservation
      setReservationId(responseData.id);
      
      // Afficher le message de succès
      setShowSuccessMessage(true);
      
    } catch (error) {
      setSubmitError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Télécharger la confirmation au format PDF
  const handleDownloadPDF = () => {
    // Cette fonction sera implémentée ultérieurement
    alert('Téléchargement de la confirmation en PDF (fonctionnalité à venir)');
  };

  // Ajouter au calendrier
  const handleAddToCalendar = () => {
    // Cette fonction sera implémentée ultérieurement
    alert('Ajout au calendrier (fonctionnalité à venir)');
  };

  // Rendu du récapitulatif de réservation
  return (
    <div className="max-w-lg mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      {showSuccessMessage ? (
        // Affichage après confirmation de la réservation
        <div className="text-center">
          <svg className="mx-auto h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          
          <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
            Réservation confirmée !
          </h2>
          
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Votre réservation a bien été enregistrée. Un e-mail de confirmation a été envoyé à {reservationData.customerInfo.email}.
          </p>
          
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-lg font-medium text-gray-900 dark:text-white">
              Numéro de réservation: <span className="font-bold">{reservationId}</span>
            </p>
          </div>
          
          <div className="mt-6 flex justify-center space-x-4">
            <button
              onClick={handleDownloadPDF}
              className="px-4 py-2 bg-blue-700 text-white font-medium rounded-lg hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              Télécharger PDF
            </button>
            
            <button
              onClick={handleAddToCalendar}
              className="px-4 py-2 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
            >
              Ajouter au calendrier
            </button>
          </div>
          
          <div className="mt-8">
            <a
              href="/"
              className="text-blue-700 dark:text-blue-400 font-medium hover:underline"
            >
              Retour à l'accueil
            </a>
          </div>
        </div>
      ) : (
        // Récapitulatif avant confirmation
        <>
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">
            Récapitulatif de votre réservation
          </h2>
          
          {/* Détails de l'expérience */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Expérience
            </h3>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <p className="text-gray-800 dark:text-gray-200 font-medium">
                {reservationData.experience?.data.name}
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {formatExperienceType(reservationData.experience?.data.tag)}
              </p>
            </div>
          </div>
          
          {/* Date et heure */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Date et heure
            </h3>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <p className="text-gray-800 dark:text-gray-200 font-medium">
                {formatDate(reservationData.date)}
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {formatTime(reservationData.timeSlot)}
              </p>
            </div>
          </div>
          
          {/* Participants et prix */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Participants et tarif
            </h3>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <p className="text-gray-800 dark:text-gray-200 font-medium">
                {reservationData.participants} {reservationData.participants > 1 ? 'personnes' : 'personne'}
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Prix total: <span className="font-bold text-blue-700 dark:text-blue-400">{reservationData.price} €</span>
              </p>
            </div>
          </div>
          
          {/* Coordonnées */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Vos coordonnées
            </h3>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <p className="text-gray-800 dark:text-gray-200 font-medium">
                {reservationData.customerInfo?.name}
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {reservationData.customerInfo?.email}
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {reservationData.customerInfo?.phone}
              </p>
              
              {reservationData.customerInfo?.specialRequests && (
                <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                  <p className="text-gray-800 dark:text-gray-200 text-sm font-medium">
                    Demandes spéciales:
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {reservationData.customerInfo.specialRequests}
                  </p>
                </div>
              )}
            </div>
          </div>
          
          {/* Informations de paiement */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Paiement
            </h3>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <p className="text-gray-800 dark:text-gray-200">
                Le paiement s'effectuera sur place le jour de votre venue.
              </p>
            </div>
          </div>
          
          {/* Erreur éventuelle */}
          {submitError && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              <p>{submitError}</p>
            </div>
          )}
          
          {/* Boutons d'action */}
          <div className="flex justify-between">
            <button
              onClick={onBack}
              disabled={isSubmitting}
              className="px-4 py-2 text-blue-700 dark:text-blue-400 font-medium hover:underline focus:outline-none disabled:opacity-50"
            >
              Retour
            </button>
            
            <button
              onClick={handleFinalize}
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-700 text-white font-medium rounded-lg hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <span className="inline-block animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></span>
                  Confirmation...
                </>
              ) : (
                'Confirmer la réservation'
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default ReservationSummary;
