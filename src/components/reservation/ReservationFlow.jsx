import React, { useState } from 'react';
import ExperienceSelector from './ExperienceSelector';
import ParticipantSelector from './ParticipantSelector';
import DateTimeSelector from './DateTimeSelector';
import CustomerForm from './CustomerForm';
import ReservationSummary from './ReservationSummary';
import ProgressIndicator from './ProgressIndicator';

function ReservationFlow() {
  const [currentStep, setCurrentStep] = useState(1);
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

  const updateReservationData = (data) => {
    setReservationData(prevData => ({
      ...prevData,
      ...data
    }));
  };

  const goToNextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const goToPreviousStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleExperienceSelect = (experience) => {
    updateReservationData({ experience });
    goToNextStep();
  };

  const handleParticipantsSelect = (participants, price) => {
    updateReservationData({ participants, price });
    goToNextStep();
  };

  const handleDateTimeSelect = (date, timeSlot) => {
    updateReservationData({ date, timeSlot });
    goToNextStep();
  };

  const handleCustomerInfoSubmit = (customerInfo) => {
    updateReservationData({ customerInfo });
    goToNextStep();
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <ExperienceSelector 
            onExperienceSelect={handleExperienceSelect}
          />
        );
      case 2:
        return (
          <ParticipantSelector 
            selectedExperience={reservationData.experience}
            onParticipantsSelect={handleParticipantsSelect}
            onBack={goToPreviousStep}
          />
        );
      case 3:
        return (
          <DateTimeSelector 
            selectedExperience={reservationData.experience}
            participants={reservationData.participants}
            onDateTimeSelect={handleDateTimeSelect}
            onBack={goToPreviousStep}
          />
        );
      case 4:
        return (
          <CustomerForm 
            onSubmit={handleCustomerInfoSubmit}
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
