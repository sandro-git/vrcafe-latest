import React, { useState, useEffect } from 'react';

function ParticipantSelector({ selectedExperience, onParticipantsSelect, onBack }) {
  // État pour le nombre de participants
  const [participants, setParticipants] = useState(1);
  // État pour les limites de participants
  const [limits, setLimits] = useState({ min: 1, max: 6 });
  // État pour le prix
  const [price, setPrice] = useState(0);
  // État pour le prix unitaire de base
  const [basePrice, setBasePrice] = useState(18);

  // Détermination des limites et du prix de base en fonction de l'expérience
  useEffect(() => {
    if (selectedExperience) {
      // Définir les limites en fonction du type d'expérience
      let newLimits = { min: 1, max: 6 };
      let newBasePrice = 18;
      
      // Ajuster en fonction du tag
      switch (selectedExperience.data.tag) {
        case 'escapeGame':
          newLimits = { min: 1, max: 6 };
          newBasePrice = 18;
          break;
        case 'jeuxVR':
          newLimits = { min: 1, max: 8 };
          newBasePrice = 18;
          break;
        case 'freeroaming':
          newLimits = { min: 2, max: 6 };
          newBasePrice = 25;
          break;
        case 'escapeFreeroaming':
          newLimits = { min: 2, max: 4 };
          newBasePrice = 25;
          break;
        default:
          break;
      }
      
      setLimits(newLimits);
      setBasePrice(newBasePrice);
      // Initialiser le nombre de participants au minimum
      setParticipants(newLimits.min);
    }
  }, [selectedExperience]);

  // Calculer le prix total et par personne
  useEffect(() => {
    const calculatePrice = () => {
      let totalPrice = basePrice * participants;
      
      // Appliquer des réductions pour les groupes
      if (participants >= 6) {
        totalPrice = totalPrice * 0.9; // 10% de réduction pour 6 personnes ou plus
      } else if (participants >= 4) {
        totalPrice = totalPrice * 0.95; // 5% de réduction pour 4-5 personnes
      }
      
      return Math.round(totalPrice);
    };
    
    setPrice(calculatePrice());
  }, [participants, basePrice]);

  // Augmenter le nombre de participants
  const increaseParticipants = () => {
    if (participants < limits.max) {
      setParticipants(participants + 1);
    }
  };

  // Diminuer le nombre de participants
  const decreaseParticipants = () => {
    if (participants > limits.min) {
      setParticipants(participants - 1);
    }
  };

  // Calculer le prix par personne
  const pricePerPerson = price / participants;

  // Calculer l'économie si une réduction est appliquée
  const calculateSavings = () => {
    const regularPrice = basePrice * participants;
    return regularPrice - price;
  };

  const savings = calculateSavings();

  // Confirmer la sélection
  const handleContinue = () => {
    onParticipantsSelect(participants, price);
  };

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">
        Nombre de participants
      </h2>
      
      {selectedExperience && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {selectedExperience.data.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Type: {selectedExperience.data.tag === 'escapeGame' ? 'Escape Game VR' :
                  selectedExperience.data.tag === 'jeuxVR' ? 'Jeu VR' :
                  selectedExperience.data.tag === 'freeroaming' ? 'VR Sans Fil' :
                  'Escape Sans Fil'}
          </p>
        </div>
      )}
      
      <div className="mb-8">
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
          Cette expérience nécessite entre {limits.min} et {limits.max} participants
        </p>
        
        <div className="flex items-center justify-center space-x-4 mb-4">
          <button 
            onClick={decreaseParticipants}
            disabled={participants <= limits.min}
            className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold ${
              participants <= limits.min
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200'
            }`}
          >
            -
          </button>
          
          <span className="text-3xl font-bold text-gray-900 dark:text-white w-12 text-center">
            {participants}
          </span>
          
          <button 
            onClick={increaseParticipants}
            disabled={participants >= limits.max}
            className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold ${
              participants >= limits.max
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200'
            }`}
          >
            +
          </button>
        </div>
      </div>
      
      <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <div className="flex justify-between mb-2">
          <span className="text-gray-600 dark:text-gray-300">Prix de base</span>
          <span className="font-medium text-gray-900 dark:text-white">{basePrice} € / personne</span>
        </div>
        
        <div className="flex justify-between mb-2">
          <span className="text-gray-600 dark:text-gray-300">Nombre de participants</span>
          <span className="font-medium text-gray-900 dark:text-white">{participants}</span>
        </div>
        
        {savings > 0 && (
          <div className="flex justify-between mb-2 text-green-600 dark:text-green-400">
            <span>Réduction de groupe</span>
            <span>-{savings} €</span>
          </div>
        )}
        
        <div className="border-t border-gray-200 dark:border-gray-600 my-2 pt-2"></div>
        
        <div className="flex justify-between">
          <span className="text-gray-800 dark:text-gray-200 font-semibold">Total</span>
          <span className="text-2xl font-bold text-blue-700 dark:text-blue-400">{price} €</span>
        </div>
        
        <div className="text-sm text-gray-500 dark:text-gray-400 text-right mt-1">
          Soit {pricePerPerson.toFixed(2)} € par personne
        </div>
      </div>
      
      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="px-4 py-2 text-blue-700 dark:text-blue-400 font-medium hover:underline focus:outline-none"
        >
          Retour
        </button>
        
        <button
          onClick={handleContinue}
          className="px-6 py-2 bg-blue-700 text-white font-medium rounded-lg hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          Continuer
        </button>
      </div>
    </div>
  );
}

export default ParticipantSelector;
