import React, { useState, useEffect } from 'react';

function DateTimeSelector({ selectedExperience, participants, onDateTimeSelect, onBack }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [calendarDays, setCalendarDays] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Noms des mois en français
  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  // Noms des jours en français (commençant par lundi)
  const dayNames = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  // Générer les jours du calendrier pour le mois en cours
  useEffect(() => {
    const generateCalendarDays = () => {
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth();
      
      // Premier jour du mois
      const firstDay = new Date(year, month, 1);
      // Dernier jour du mois
      const lastDay = new Date(year, month + 1, 0);
      
      // Ajuster le jour de la semaine (0 = dimanche, 1 = lundi, ..., 6 = samedi)
      // Nous voulons que le calendrier commence par lundi (1)
      let dayOfWeek = firstDay.getDay() || 7; // Convertir 0 (dimanche) à 7
      dayOfWeek = dayOfWeek - 1; // Ajuster pour commencer par lundi (0)
      
      const days = [];
      
      // Ajouter les jours du mois précédent (grisés)
      const prevMonthLastDate = new Date(year, month, 0).getDate();
      for (let i = dayOfWeek - 1; i >= 0; i--) {
        days.push({
          date: new Date(year, month - 1, prevMonthLastDate - i),
          isCurrentMonth: false,
          isSelectable: false
        });
      }
      
      // Ajouter les jours du mois en cours
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      for (let day = 1; day <= lastDay.getDate(); day++) {
        const date = new Date(year, month, day);
        date.setHours(0, 0, 0, 0);
        
        // Déterminer si le jour est sélectionnable (généralement les jours à partir d'aujourd'hui)
        const isSelectable = date >= today;
        
        days.push({
          date,
          isCurrentMonth: true,
          isSelectable
        });
      }
      
      // Ajouter les jours du mois suivant pour compléter la dernière semaine
      const remainingDays = 7 - (days.length % 7 || 7);
      for (let day = 1; day <= remainingDays; day++) {
        days.push({
          date: new Date(year, month + 1, day),
          isCurrentMonth: false,
          isSelectable: false
        });
      }
      
      setCalendarDays(days);
    };
    
    generateCalendarDays();
  }, [currentMonth]);

  // Charger les créneaux horaires disponibles lorsqu'une date est sélectionnée
  useEffect(() => {
    if (selectedDate && selectedExperience) {
      const fetchAvailableTimeSlots = async () => {
        try {
          setLoading(true);
          setError(null);
          
          // Formatage de la date pour l'API (YYYY-MM-DD)
          const formattedDate = selectedDate.toISOString().split('T')[0];
          
          const response = await fetch(`/api/available-slots?date=${formattedDate}&experienceId=${selectedExperience.id}&participants=${participants}`);
          
          if (!response.ok) {
            throw new Error('Erreur lors du chargement des créneaux horaires');
          }
          
          const data = await response.json();
          setAvailableTimeSlots(data);
        } catch (err) {
          setError(err.message);
          setAvailableTimeSlots([]);
        } finally {
          setLoading(false);
        }
      };
      
      fetchAvailableTimeSlots();
    } else {
      setAvailableTimeSlots([]);
      setSelectedTimeSlot(null);
    }
  }, [selectedDate, selectedExperience, participants]);

  // Passer au mois précédent
  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  // Passer au mois suivant
  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  // Sélectionner une date
  const handleDateClick = (day) => {
    if (day.isSelectable) {
      setSelectedDate(day.date);
      setSelectedTimeSlot(null);
    }
  };

  // Sélectionner un créneau horaire
  const handleTimeSlotClick = (timeSlot) => {
    setSelectedTimeSlot(timeSlot);
  };

  // Confirmer la sélection
  const handleContinue = () => {
    if (selectedDate && selectedTimeSlot) {
      onDateTimeSelect(selectedDate, selectedTimeSlot);
    }
  };

  // Formater un créneau horaire pour l'affichage
  const formatTimeSlot = (timeSlot) => {
    return `${timeSlot.start} - ${timeSlot.end}`;
  };

  return (
    <div className="max-w-lg mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">
        Choisissez une date et un horaire
      </h2>
      
      {/* Calendrier */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <button 
            onClick={goToPreviousMonth}
            className="p-2 text-gray-600 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-400 focus:outline-none"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>
          
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h3>
          
          <button 
            onClick={goToNextMonth}
            className="p-2 text-gray-600 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-400 focus:outline-none"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {/* Jours de la semaine */}
          {dayNames.map((day, index) => (
            <div key={index} className="text-center text-gray-500 dark:text-gray-400 text-sm font-medium py-2">
              {day}
            </div>
          ))}
          
          {/* Jours du mois */}
          {calendarDays.map((day, index) => (
            <div
              key={index}
              onClick={() => handleDateClick(day)}
              className={`
                text-center py-2 rounded-full cursor-pointer text-sm
                ${day.isCurrentMonth ? 'font-medium' : 'text-gray-400 dark:text-gray-600'}
                ${day.isSelectable ? 'hover:bg-blue-100 dark:hover:bg-blue-900' : 'cursor-not-allowed opacity-50'}
                ${selectedDate && day.date.toDateString() === selectedDate.toDateString() 
                  ? 'bg-blue-700 text-white' 
                  : day.isCurrentMonth ? 'text-gray-800 dark:text-gray-200' : ''}
              `}
            >
              {day.date.getDate()}
            </div>
          ))}
        </div>
      </div>
      
      {/* Créneaux horaires */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          {selectedDate 
            ? `Horaires disponibles - ${selectedDate.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}` 
            : 'Veuillez sélectionner une date'}
        </h3>
        
        {loading ? (
          <div className="text-center py-4">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-300">Chargement des horaires...</p>
          </div>
        ) : error ? (
          <div className="text-center py-4 text-red-600">
            <p>{error}</p>
          </div>
        ) : selectedDate && availableTimeSlots.length === 0 ? (
          <p className="text-center text-gray-600 dark:text-gray-300 py-4">
            Aucun créneau disponible pour cette date
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {availableTimeSlots.map((timeSlot, index) => (
              <button
                key={index}
                onClick={() => handleTimeSlotClick(timeSlot)}
                className={`
                  py-2 px-4 rounded-lg text-sm font-medium
                  ${selectedTimeSlot && selectedTimeSlot.id === timeSlot.id
                    ? 'bg-blue-700 text-white'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'}
                `}
              >
                {formatTimeSlot(timeSlot)}
              </button>
            ))}
          </div>
        )}
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
          disabled={!selectedDate || !selectedTimeSlot}
          className={`
            px-6 py-2 font-medium rounded-lg
            ${selectedDate && selectedTimeSlot
              ? 'bg-blue-700 text-white hover:bg-blue-800 focus:ring-2 focus:ring-blue-300'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400'}
          `}
        >
          Continuer
        </button>
      </div>
    </div>
  );
}

export default DateTimeSelector;
