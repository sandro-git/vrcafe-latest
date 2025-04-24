import React from 'react';

function ProgressIndicator({ currentStep, totalSteps }) {
  // Noms des étapes
  const stepNames = [
    'Expérience',
    'Durée',
    'Participants',
    'Date & Heure',
    'Informations',
    'Confirmation'
  ];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        {stepNames.map((step, index) => (
          <div 
            key={index} 
            className={`flex flex-col items-center ${
              index + 1 === currentStep 
                ? 'text-blue-600 font-bold' 
                : index + 1 < currentStep 
                  ? 'text-green-500' 
                  : 'text-gray-400'
            }`}
          >
            <div 
              className={`flex items-center justify-center w-8 h-8 rounded-full mb-1 ${
                index + 1 === currentStep 
                  ? 'bg-blue-600 text-white' 
                  : index + 1 < currentStep 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-200 text-gray-600'
              }`}
            >
              {index + 1 < currentStep ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                </svg>
              ) : (
                index + 1
              )}
            </div>
            <span className="text-xs md:text-sm hidden md:block">{step}</span>
          </div>
        ))}
      </div>
      <div className="relative w-full h-2 bg-gray-200 rounded-full mb-6">
        <div 
          className="absolute top-0 left-0 h-2 bg-blue-600 rounded-full"
          style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
        ></div>
      </div>
    </div>
  );
}

export default ProgressIndicator;