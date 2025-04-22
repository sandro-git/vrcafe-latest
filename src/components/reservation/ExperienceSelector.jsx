import React, { useState, useEffect } from 'react';

function ExperienceSelector({ onExperienceSelect }) {
  // État pour stocker les expériences
  const [experiences, setExperiences] = useState([]);
  // État pour stocker le filtre de catégorie actif
  const [activeCategory, setActiveCategory] = useState('all');
  // État pour gérer le chargement
  const [loading, setLoading] = useState(true);
  // État pour gérer les erreurs
  const [error, setError] = useState(null);

  // Catégories d'expériences disponibles
  const categories = [
    { id: 'all', name: 'Toutes les expériences' },
    { id: 'escapeGame', name: 'Escape Games VR' },
    { id: 'jeuxVR', name: 'Jeux VR' },
    { id: 'freeroaming', name: 'VR Sans Fil' },
    { id: 'escapeFreeroaming', name: 'Escape Games Sans Fil' }
  ];

  // Charger les expériences depuis l'API
  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/experiences');
        
        if (!response.ok) {
          throw new Error('Erreur lors du chargement des expériences');
        }
        
        const data = await response.json();
        setExperiences(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  // Filtrer les expériences en fonction de la catégorie sélectionnée
  const filteredExperiences = activeCategory === 'all'
    ? experiences
    : experiences.filter(exp => exp.data.tag === activeCategory);

  // Gérer le clic sur une catégorie
  const handleCategoryClick = (categoryId) => {
    setActiveCategory(categoryId);
  };

  // Gérer le clic sur une expérience
  const handleExperienceClick = (experience) => {
    onExperienceSelect(experience);
  };

  // Affichage pendant le chargement
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
        <p className="mt-2 text-gray-600 dark:text-gray-300">Chargement des expériences...</p>
      </div>
    );
  }

  // Affichage en cas d'erreur
  if (error) {
    return (
      <div className="text-center py-12 text-red-600">
        <p>{error}</p>
        <p>Veuillez rafraîchir la page ou réessayer ultérieurement.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">
        Choisissez votre expérience
      </h2>

      {/* Filtres de catégories */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeCategory === category.id
                ? 'bg-blue-700 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Grille d'expériences */}
      {filteredExperiences.length === 0 ? (
        <p className="text-center text-gray-600 dark:text-gray-300">
          Aucune expérience disponible dans cette catégorie
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExperiences.map((experience) => (
            <div
              key={experience.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden cursor-pointer hover:shadow-lg transform transition hover:scale-105"
              onClick={() => handleExperienceClick(experience)}
            >
              <div className="aspect-w-16 aspect-h-9 relative h-48">
                <img
                  src={`/images/experiences/${experience.data.image}`}
                  alt={experience.data.name}
                  className="object-cover absolute w-full h-full"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  {experience.data.name}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    {experience.data.tag === 'escapeGame' ? 'Escape Game VR' :
                     experience.data.tag === 'jeuxVR' ? 'Jeu VR' :
                     experience.data.tag === 'freeroaming' ? 'VR Sans Fil' :
                     'Escape Sans Fil'}
                  </span>
                  <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
                    Sélectionner
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ExperienceSelector;
