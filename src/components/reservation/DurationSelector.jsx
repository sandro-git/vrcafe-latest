import React from 'react';

function DurationSelector({ selectedExperience, onDurationSelect, onBack }) {
  const durations = [
    {
      id: '30min',
      title: '30 Minutes',
      description: 'Session de 30 minutes dans l\'expérience',
      price: '18',
      features: [
        '30 min de jeu effectif',
        'Idéal pour une première expérience',
        'Temps suffisant pour les jeux faciles'
      ]
    },
    {
      id: '1h',
      title: '1 Heure',
      description: 'Session d\'une heure complète',
      price: '29',
      features: [
        '1h de jeu effectif',
        'Expérience immersive complète',
        'Recommandé pour les escape games',
        'Temps pour explorer tout le contenu'
      ]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">
        Choisissez la durée
      </h2>
      
      {selectedExperience && (
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
          <h3 className="font-medium text-gray-900 dark:text-white">
            {selectedExperience.name}
          </h3>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {durations.map((duration) => (
          <div
            key={duration.id}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300"
          >
            <div className="p-5">
              <h3 className="text-xl text-center mb-4 font-extrabold tracking-tight text-gray-900 dark:text-white">
                {duration.title}
              </h3>
              
              <div className="flex flex-col items-baseline text-gray-900 dark:text-white mb-4">
                <div>
                  <span className="text-5xl font-extrabold tracking-tight">{duration.price}</span>
                  <span className="text-3xl font-semibold">€</span>
                  <span className="ms-1 text-xl font-normal text-gray-500 dark:text-gray-400">
                    /personne
                  </span>
                </div>
              </div>
              
              <ul role="list" className="space-y-5 my-7">
                {duration.features.map((feature, index) => (
                  <li key={index} className="flex">
                    <svg
                      className="flex-shrink-0 w-4 h-4 text-blue-700 dark:text-blue-500"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"
                      ></path>
                    </svg>
                    <span
                      className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400 ms-3"
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
              
              <button
                onClick={() => onDurationSelect(duration)}
                type="button"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-200 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-900 font-medium rounded-lg text-sm px-5 py-2.5 inline-flex justify-center w-full text-center"
              >
                Sélectionner
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-start">
        <button
          onClick={onBack}
          className="px-4 py-2 text-blue-700 dark:text-blue-400 font-medium hover:underline focus:outline-none"
        >
          Retour
        </button>
      </div>
    </div>
  );
}

export default DurationSelector;