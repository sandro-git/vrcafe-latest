import React, { useState } from 'react';
import ExperienceSelector from './ExperienceSelector';
import ParticipantSelector from './ParticipantSelector';
import DateTimeSelector from './DateTimeSelector';
import CustomerForm from './CustomerForm';
import ReservationSummary from './ReservationSummary';
import ProgressIndicator from './ProgressIndicator';

function ReservationFlow() {
  // État pour suivre l'étape courante
  const [currentStep, setCurrentStep] = useState(1);
  
  // État pour stocker les données de réservation
  const [reservationData, setReservationData] = useState({
    experience: null,
    participants: 1,
    date: null,
    timeSlot: null,
    customerInfo: {
      name: '',
      email: '',
      phone: '',
      specialRequests: ''
    },
    price: 0
  });

  // Fonction pour mettre à jour les données de réservation
  const updateReservationData = (data) => {
    setReservationData(prevData => ({
      ...prevData,
      ...data
    }));
  };

  // Fonction pour passer à l'étape suivante
  const goToNextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  // Fonction pour revenir à l'étape précédente
  const goToPreviousStep = () => {
    setCurrentStep(currentStep - 1);
  };

  // Rendu conditionnel en fonction de l'étape courante
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <ExperienceSelector 
            onExperienceSelect={(experience) => {
              updateReservationData({ experience });
              goToNextStep();
            }}
          />
        );
      case 2:
        return (
          <ParticipantSelector 
            selectedExperience={reservationData.experience}
            onParticipantsSelect={(participants, price) => {
              updateReservationData({ participants, price });
              goToNextStep();
            }}
            onBack={goToPreviousStep}
          />
        );
      case 3:
        return (
          <DateTimeSelector 
            selectedExperience={reservationData.experience}
            participants={reservationData.participants}
            onDateTimeSelect={(date, timeSlot) => {
              updateReservationData({ date, timeSlot });
              goToNextStep();
            }}
            onBack={goToPreviousStep}
          />
        );
      case 4:
        return (
          <CustomerForm 
            onSubmit={(customerInfo) => {
              updateReservationData({ customerInfo });
              goToNextStep();
            }}
            onBack={goToPreviousStep}
          />
        );
      case 5:
        return (
          <ReservationSummary 
            reservationData={reservationData}
            onBack={goToPreviousStep}
          />
        );
      default:
        return <div>Étape inconnue</div>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <ProgressIndicator currentStep={currentStep} totalSteps={5} />
      <div className="mt-8">
        {renderStep()}
      </div>
    </div>
  );
}

export default ReservationFlow;
