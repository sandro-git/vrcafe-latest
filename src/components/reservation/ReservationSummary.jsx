import React, { useState } from 'react';

function ReservationSummary({ reservationData, onBack }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const handleFinalize = async () => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);

      // Simulation d'un appel API
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Redirection vers une page de confirmation
      window.location.href = '/reservation-confirmation';
    } catch (error) {
      setSubmitError('Une erreur est survenue lors de la finalisation de votre réservation. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">
        Récapitulatif de votre réservation
      </h2>

      <div className="space-y-6">
        {/* Expérience */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
            {reservationData.experience.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Type: {reservationData.experience.type === 'escapeGame' ? 'Escape Game VR' :
                  reservationData.experience.type === 'jeuxVR' ? 'Jeu VR' :
                  reservationData.experience.type === 'freeroaming' ? 'VR Sans Fil' :
                  'Escape Sans Fil'}
          </p>
        </div>

        {/* Date et heure */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 dark:text-white mb-1">Date et heure</h3>
          <p className="text-gray-600 dark:text-gray-300">
            {formatDate(reservationData.date)}
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            {reservationData.timeSlot.start} - {reservationData.timeSlot.end}
          </p>
        </div>

        {/* Participants et prix */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600 dark:text-gray-300">Participants</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {reservationData.participants}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-900 dark:text-white font-medium">Total</span>
            <span className="text-xl font-bold text-blue-700 dark:text-blue-400">
              {reservationData.price} €
            </span>
          </div>
        </div>

        {/* Informations client */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 dark:text-white mb-2">
            Vos informations
          </h3>
          <div className="space-y-1 text-sm">
            <p className="text-gray-600 dark:text-gray-300">
              <span className="font-medium">Nom :</span> {reservationData.customerInfo.name}
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              <span className="font-medium">Email :</span> {reservationData.customerInfo.email}
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              <span className="font-medium">Téléphone :</span> {reservationData.customerInfo.phone}
            </p>
            {reservationData.customerInfo.specialRequests && (
              <div className="mt-2">
                <p className="font-medium text-gray-700 dark:text-gray-200">Demandes spéciales :</p>
                <p className="text-gray-600 dark:text-gray-300">
                  {reservationData.customerInfo.specialRequests}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {submitError && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          <p>{submitError}</p>
        </div>
      )}

      <div className="flex justify-between mt-6">
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
              <span className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></span>
              Confirmation en cours...
            </>
          ) : (
            'Confirmer la réservation'
          )}
        </button>
      </div>
    </div>
  );
}

export default ReservationSummary;
