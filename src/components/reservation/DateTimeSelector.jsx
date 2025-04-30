import React, { useState, useEffect } from 'react';

function DateTimeSelector({ selectedExperience, selectedDuration, participants, onDateTimeSelect, onBack }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [calendarDays, setCalendarDays] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  const dayNames = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  // Générer les jours du calendrier pour le mois en cours
  useEffect(() => {
    const generateCalendarDays = () => {
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth();
      
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      
      let dayOfWeek = firstDay.getDay() || 7;
      dayOfWeek = dayOfWeek - 1;
      
      const days = [];
      
      const prevMonthLastDate = new Date(year, month, 0).getDate();
      for (let i = dayOfWeek - 1; i >= 0; i--) {
        days.push({
          date: new Date(year, month - 1, prevMonthLastDate - i),
          isCurrentMonth: false,
          isSelectable: false
        });
      }
      
      const today = new Date();
      const todayWithoutTime = new Date(today);
      todayWithoutTime.setHours(0, 0, 0, 0);
      
      for (let day = 1; day <= lastDay.getDate(); day++) {
        const date = new Date(year, month, day);
        date.setHours(0, 0, 0, 0);
        const isSelectable = date > todayWithoutTime || date.getTime() === todayWithoutTime.getTime();
        
        days.push({
          date,
          isCurrentMonth: true,
          isSelectable
        });
      }
      
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

  // Générer des créneaux horaires en fonction de la date sélectionnée et de la durée
  useEffect(() => {
    if (selectedDate && selectedExperience && selectedDuration) {
      const fetchAvailableTimeSlots = async () => {
        try {
          setLoading(true);
          setError(null);
          
          const formattedDate = selectedDate.toISOString().split('T')[0];
          const experienceType = selectedExperience.type;
          const durationId = selectedDuration.id;
          
          // Simuler l'appel API pour le moment
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Générer des créneaux différents selon la durée
          let mockTimeSlots = [];
          
          if (durationId === '30min') {
            mockTimeSlots = [
              { id: 1, start: '10:00', end: '10:30' },
              { id: 2, start: '11:00', end: '11:30' },
              { id: 3, start: '12:00', end: '12:30' },
              { id: 4, start: '14:00', end: '14:30' },
              { id: 5, start: '15:00', end: '15:30' },
              { id: 6, start: '16:00', end: '16:30' },
              { id: 7, start: '17:00', end: '17:30' },
              { id: 8, start: '18:00', end: '18:30' },
              { id: 9, start: '19:00', end: '19:30' }
            ];
          } else {
            mockTimeSlots = [
              { id: 10, start: '10:00', end: '11:00' },
              { id: 11, start: '11:30', end: '12:30' },
              { id: 12, start: '13:00', end: '14:00' },
              { id: 13, start: '14:30', end: '15:30' },
              { id: 14, start: '16:00', end: '17:00' },
              { id: 15, start: '17:30', end: '18:30' },
              { id: 16, start: '19:00', end: '20:00' }
            ];
          }
          
          // Peut-être filtrer selon le jour de la semaine ou l'expérience
          const dayOfWeek = selectedDate.getDay();
          const isWeekend = dayOfWeek === 0 || dayOfWeek === 6; // Dimanche ou samedi
          
          // Si c'est le week-end, on propose plus de créneaux
          if (isWeekend) {
            if (durationId === '30min') {
              mockTimeSlots.push(
                { id: 17, start: '09:30', end: '10:00' },
                { id: 18, start: '20:00', end: '20:30' }
              );
            } else {
              mockTimeSlots.push(
                { id: 19, start: '09:00', end: '10:00' },
                { id: 20, start: '20:30', end: '21:30' }
              );
            }
          }
          
          // Simule un taux d'occupation différent selon l'expérience
          if (experienceType === 'escapeGame' || experienceType === 'escapeFreeroaming') {
            // Supprime aléatoirement certains créneaux pour simuler des créneaux occupés
            mockTimeSlots = mockTimeSlots.filter(() => Math.random() > 0.3);
          }
          
          // Filtrer les créneaux déjà passés si la date sélectionnée est aujourd'hui
          const now = new Date();
          const isToday = selectedDate.toDateString() === now.toDateString();
          
          if (isToday) {
            const currentHour = now.getHours();
            const currentMinute = now.getMinutes();
            
            // Filtrer les créneaux horaires qui sont déjà passés aujourd'hui
            mockTimeSlots = mockTimeSlots.filter(slot => {
              const [hours, minutes] = slot.start.split(':').map(Number);
              return hours > currentHour || (hours === currentHour && minutes > currentMinute);
            });
          }
          
          setAvailableTimeSlots(mockTimeSlots);
        } catch (err) {
          setError("Erreur lors du chargement des créneaux horaires");
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
  }, [selectedDate, selectedExperience, selectedDuration]);

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handleDateClick = (day) => {
    if (day.isSelectable) {
      setSelectedDate(day.date);
      setSelectedTimeSlot(null);
    }
  };

  const handleTimeSlotClick = (timeSlot) => {
    setSelectedTimeSlot(timeSlot);
  };

  const handleContinue = () => {
    if (selectedDate && selectedTimeSlot) {
      onDateTimeSelect(selectedDate, selectedTimeSlot);
    }
  };

  const formatTimeSlot = (timeSlot) => {
    return `${timeSlot.start} - ${timeSlot.end}`;
  };

  return (
    <div className="max-w-lg mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">
        Choisissez une date et un horaire
      </h2>
      
      {selectedExperience && selectedDuration && (
        <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h3 className="font-medium text-gray-900 dark:text-white">
            {selectedExperience.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {selectedDuration.title} - {participants} {participants > 1 ? 'participants' : 'participant'}
          </p>
        </div>
      )}
      
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <button 
            onClick={goToPreviousMonth}
            className="p-2 text-gray-600 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-400 focus:outline-none"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
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
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {dayNames.map((day, index) => (
            <div key={index} className="text-center text-gray-500 dark:text-gray-400 text-sm font-medium py-2">
              {day}
            </div>
          ))}
          
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