import React from 'react';

function ExperienceSelector({ onExperienceSelect }) {
  const categories = [
    { 
      id: 'escapeGame', 
      name: 'Escape Games VR',
      image: 'https://placehold.co/600x400/2563eb/ffffff?text=Escape+Games+VR'
    },
    { 
      id: 'jeuxVR', 
      name: 'Jeux VR',
      image: 'https://placehold.co/600x400/2563eb/ffffff?text=Jeux+VR'
    },
    { 
      id: 'freeroaming', 
      name: 'VR Sans Fil',
      image: 'https://placehold.co/600x400/2563eb/ffffff?text=VR+Sans+Fil'
    },
    { 
      id: 'escapeFreeroaming', 
      name: 'Escape Games Sans Fil',
      image: 'https://placehold.co/600x400/2563eb/ffffff?text=Escape+Sans+Fil'
    }
  ];

  const handleCategoryClick = (category) => {
    // Appel de la fonction onExperienceSelect avec l'objet approprié
    onExperienceSelect({
      id: category.id,
      name: category.name,
      type: category.id // Ajouter le type pour la cohérence avec le reste du flux
    });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
        Choisissez votre type d'expérience
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {categories.map((category) => (
          <div
            key={category.id}
            onClick={() => handleCategoryClick(category)}
            className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden cursor-pointer hover:shadow-2xl transform transition-all duration-300 hover:scale-105"
          >
            <div className="aspect-w-16 aspect-h-9">
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-2xl font-bold text-white mb-2">
                  {category.name}
                </h3>
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200">
                  Sélectionner
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ExperienceSelector;
