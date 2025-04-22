import React, { useState, useEffect } from 'react';

function ParticipantSelector({ selectedExperience, selectedDuration, onParticipantsSelect, onBack }) {
  const [participants, setParticipants] = useState(1);
  const [limits, setLimits] = useState({ min: 1, max: 6 });
  const [price, setPrice] = useState(0);
  const [basePrice, setBasePrice] = useState(18);

  // Définir les limites et prix selon l'expérience et la durée
  useEffect(() => {
    if (selectedExperience && selectedDuration) {
      let newLimits = { min: 1, max: 6 };
      let newBasePrice = selectedDuration.id === '30min' ? 18 : 29;
      
      switch (selectedExperience.type) {
        case 'escapeGame':
          newLimits = { min: 1, max: 6 };
          break;
        case 'jeuxVR':
          newLimits = { min: 1, max: 6 };
          break;
        case 'freeroaming':
          newLimits = { min: 1, max: 4 };
          newBasePrice = selectedDuration.id === '30min' ? 25 : 29;
          break;
        case 'escapeFreeroaming':
          newLimits = { min: 1, max: 4 };
          newBasePrice = selectedDuration.id === '30min' ? 25 : 29;
          break;
        default:
          break;
      }
      
      setLimits(newLimits);
      setBasePrice(newBasePrice);
      // Réajuster le nombre de participants si nécessaire
      if (participants > newLimits.max) {
        setParticipants(newLimits.max);
      }
      if (participants < newLimits.min) {
        setParticipants(newLimits.min);
      }
    }
  }, [selectedExperience, selectedDuration]);

  // Calculer le prix total en fonction du nombre de participants et de la durée
  useEffect(() => {
    const calculatePrice = () => {
      if (selectedDuration && selectedDuration.id === '30min') {
        // Prix fixe de 25€/personne pour freeroaming et escapeFreeroaming en 30min
        if (selectedExperience.type === 'freeroaming' || selectedExperience.type === 'escapeFreeroaming') {
          return 25 * participants;
        }
        // Prix fixe de 18€/personne pour les autres expériences en 30min
        return 18 * participants;
      } 
      // Tarification spéciale pour session d'1 heure
      else {
        let pricePerPerson;
        
        if (participants <= 2) {
          pricePerPerson = 29; // 29€ par personne pour 1-2 personnes
        } else if (participants <= 4) {
          pricePerPerson = 27; // 27€ par personne pour 3-4 personnes
        } else {
          pricePerPerson = 25; // 25€ par personne pour 5-6 personnes
        }
        
        return pricePerPerson * participants;
      }
    };
    
    setPrice(calculatePrice());
  }, [participants, selectedDuration, selectedExperience]);

  const increaseParticipants = () => {
    if (participants < limits.max) {
      setParticipants(participants + 1);
    }
  };

  const decreaseParticipants = () => {
    if (participants > limits.min) {
      setParticipants(participants - 1);
    }
  };

  // Calculer le prix par personne
  const pricePerPerson = price / participants;
  
  // Calculer les économies uniquement pour la session d'une heure
  let savings = 0;
  if (selectedDuration && selectedDuration.id === '1h' && participants > 2) {
    const standardHourPrice = 29 * participants;
    savings = standardHourPrice - price;
  }

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">
        Nombre de participants
      </h2>
      
      {selectedExperience && selectedDuration && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {selectedExperience.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Durée: {selectedDuration.title}
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
        {selectedDuration && selectedDuration.id === '1h' && (
          <>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600 dark:text-gray-300">Tarif</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {participants <= 2 ? '29 €' : participants <= 4 ? '27 €' : '25 €'} / personne
              </span>
            </div>
          </>
        )}
        
        {selectedDuration && selectedDuration.id === '30min' && (
          <div className="flex justify-between mb-2">
            <span className="text-gray-600 dark:text-gray-300">Prix de base</span>
            <span className="font-medium text-gray-900 dark:text-white">{basePrice} € / personne</span>
          </div>
        )}
        
        <div className="flex justify-between mb-2">
          <span className="text-gray-600 dark:text-gray-300">Nombre de participants</span>
          <span className="font-medium text-gray-900 dark:text-white">{participants}</span>
        </div>
        
        {savings > 0 && (
          <div className="flex justify-between mb-2 text-green-600 dark:text-green-400">
            <span>Réduction</span>
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
          onClick={() => onParticipantsSelect(participants, price)}
          className="px-6 py-2 bg-blue-700 text-white font-medium rounded-lg hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          Continuer
        </button>
      </div>
    </div>
  );
}

export default ParticipantSelector;