import React, { useState } from 'react';

function CustomerForm({ onSubmit, onBack }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    confirmEmail: '',
    phone: '',
    specialRequests: ''
  });
  
  const [formErrors, setFormErrors] = useState({
    name: '',
    email: '',
    confirmEmail: '',
    phone: ''
  });

  // Gérer le changement dans les champs du formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Réinitialiser l'erreur du champ modifié
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  // Valider le formulaire
  const validateForm = () => {
    let valid = true;
    const newErrors = {
      name: '',
      email: '',
      confirmEmail: '',
      phone: ''
    };
    
    // Validation du nom
    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis';
      valid = false;
    }
    
    // Validation de l'email
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
      valid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
      valid = false;
    }
    
    // Validation de la confirmation d'email
    if (formData.email !== formData.confirmEmail) {
      newErrors.confirmEmail = 'Les emails ne correspondent pas';
      valid = false;
    }
    
    // Validation du téléphone
    if (!formData.phone.trim()) {
      newErrors.phone = 'Le numéro de téléphone est requis';
      valid = false;
    } else if (!/^[0-9]{10}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Format de téléphone invalide (10 chiffres attendus)';
      valid = false;
    }
    
    setFormErrors(newErrors);
    return valid;
  };

  // Soumettre le formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Envoyer les données sans confirmEmail
      const { confirmEmail, ...submissionData } = formData;
      onSubmit(submissionData);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">
        Vos informations
      </h2>
      
      <form onSubmit={handleSubmit}>
        {/* Nom complet */}
        <div className="mb-4">
          <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
            Nom complet *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`
              shadow-sm bg-gray-50 border text-gray-900 text-sm rounded-lg block w-full p-2.5
              dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white
              ${formErrors.name 
                ? 'border-red-500 focus:ring-red-500 focus:border-red-500 dark:focus:ring-red-500 dark:focus:border-red-500' 
                : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500'}
            `}
            placeholder="Prénom et nom"
            required
          />
          {formErrors.name && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-500">{formErrors.name}</p>
          )}
        </div>
        
        {/* Email */}
        <div className="mb-4">
          <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`
              shadow-sm bg-gray-50 border text-gray-900 text-sm rounded-lg block w-full p-2.5
              dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white
              ${formErrors.email 
                ? 'border-red-500 focus:ring-red-500 focus:border-red-500 dark:focus:ring-red-500 dark:focus:border-red-500' 
                : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500'}
            `}
            placeholder="votre@email.com"
            required
          />
          {formErrors.email && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-500">{formErrors.email}</p>
          )}
        </div>
        
        {/* Confirmation Email */}
        <div className="mb-4">
          <label htmlFor="confirmEmail" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
            Confirmation de l'email *
          </label>
          <input
            type="email"
            id="confirmEmail"
            name="confirmEmail"
            value={formData.confirmEmail}
            onChange={handleChange}
            className={`
              shadow-sm bg-gray-50 border text-gray-900 text-sm rounded-lg block w-full p-2.5
              dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white
              ${formErrors.confirmEmail 
                ? 'border-red-500 focus:ring-red-500 focus:border-red-500 dark:focus:ring-red-500 dark:focus:border-red-500' 
                : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500'}
            `}
            placeholder="votre@email.com"
            required
          />
          {formErrors.confirmEmail && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-500">{formErrors.confirmEmail}</p>
          )}
        </div>
        
        {/* Téléphone */}
        <div className="mb-4">
          <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
            Téléphone *
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={`
              shadow-sm bg-gray-50 border text-gray-900 text-sm rounded-lg block w-full p-2.5
              dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white
              ${formErrors.phone 
                ? 'border-red-500 focus:ring-red-500 focus:border-red-500 dark:focus:ring-red-500 dark:focus:border-red-500' 
                : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500'}
            `}
            placeholder="06 12 34 56 78"
            required
          />
          {formErrors.phone && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-500">{formErrors.phone}</p>
          )}
        </div>
        
        {/* Demandes spéciales */}
        <div className="mb-6">
          <label htmlFor="specialRequests" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
            Demandes spéciales ou commentaires (optionnel)
          </label>
          <textarea
            id="specialRequests"
            name="specialRequests"
            rows="3"
            value={formData.specialRequests}
            onChange={handleChange}
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Informations complémentaires ou demandes particulières..."
          ></textarea>
        </div>
        
        <div className="flex justify-between">
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2 text-blue-700 dark:text-blue-400 font-medium hover:underline focus:outline-none"
          >
            Retour
          </button>
          
          <button
            type="submit"
            className="px-6 py-2 bg-blue-700 text-white font-medium rounded-lg hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            Continuer
          </button>
        </div>
      </form>
    </div>
  );
}

export default CustomerForm;
