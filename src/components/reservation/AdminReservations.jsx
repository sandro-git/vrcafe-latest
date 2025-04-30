import { useState, useEffect } from 'react';

function AdminReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    fromDate: '',
    toDate: '',
    experienceId: ''
  });
  const [experiences, setExperiences] = useState([]);

  useEffect(() => {
    // Charger les expériences pour le filtre
    const fetchExperiences = async () => {
      try {
        const response = await fetch('/api/experiences');
        if (!response.ok) {
          throw new Error('Erreur lors du chargement des expériences');
        }
        const data = await response.json();
        setExperiences(data);
      } catch (err) {
        console.error('Erreur:', err);
      }
    };

    fetchExperiences();
  }, []);

  useEffect(() => {
    // Fonction pour charger les réservations
    const fetchReservations = async () => {
      try {
        setLoading(true);
        
        // Construire l'URL avec les filtres
        const queryParams = new URLSearchParams();
        
        // Ajouter une clé admin simple (à remplacer par une authentification réelle)
        queryParams.append('adminKey', 'admin123');
        
        if (filters.fromDate) {
          queryParams.append('fromDate', filters.fromDate);
        }
        
        if (filters.toDate) {
          queryParams.append('toDate', filters.toDate);
        }
        
        if (filters.experienceId) {
          queryParams.append('experienceId', filters.experienceId);
        }
        
        const response = await fetch(`/api/reservations?${queryParams.toString()}`);
        
        if (!response.ok) {
          throw new Error('Erreur lors du chargement des réservations');
        }
        
        const data = await response.json();
        setReservations(data);
        setError(null);
      } catch (err) {
        setError('Impossible de charger les réservations');
        console.error('Erreur:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Format de date pour l'affichage
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Statut avec badge coloré
  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Confirmé</span>;
      case 'cancelled':
        return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">Annulé</span>;
      case 'pending':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">En attente</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">{status}</span>;
    }
  };

  // Trouver le nom de l'expérience à partir de l'ID
  const getExperienceName = (experienceId) => {
    const experience = experiences.find(exp => exp.data.id === experienceId);
    return experience ? experience.data.name : `Expérience #${experienceId}`;
  };

  // Gestion du changement de statut
  const handleStatusChange = async (reservationId, newStatus) => {
    try {
      // Dans une implémentation réelle, cela ferait un appel API pour mettre à jour le statut
      console.log(`Changement de statut pour la réservation #${reservationId}: ${newStatus}`);
      
      // Simuler une mise à jour locale pour l'instant
      setReservations(prev => 
        prev.map(res => 
          res.id === reservationId ? { ...res, status: newStatus } : res
        )
      );
    } catch (err) {
      console.error('Erreur lors de la mise à jour du statut:', err);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Gestion des réservations</h1>
      
      {/* Filtres */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-6">
        <h2 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Filtres</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Date de début
            </label>
            <input
              type="date"
              name="fromDate"
              value={filters.fromDate}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Date de fin
            </label>
            <input
              type="date"
              name="toDate"
              value={filters.toDate}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Expérience
            </label>
            <select
              name="experienceId"
              value={filters.experienceId}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="">Toutes les expériences</option>
              {experiences.map(exp => (
                <option key={exp.data.id} value={exp.data.id}>
                  {exp.data.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* Tableau des réservations */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600 mb-2"></div>
            <p className="text-gray-600 dark:text-gray-300">Chargement des réservations...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-600">
            <p>{error}</p>
          </div>
        ) : reservations.length === 0 ? (
          <div className="p-8 text-center text-gray-600 dark:text-gray-300">
            <p>Aucune réservation trouvée</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ID</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Créneau</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Expérience</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Client</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Participants</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Statut</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                {reservations.map((reservation) => (
                  <tr key={reservation.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {reservation.referenceNumber || `VR-${new Date(reservation.createdAt).getFullYear().toString().slice(2)}-${reservation.id.toString().padStart(5, '0')}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {formatDate(reservation.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {reservation.timeSlot ? `${reservation.timeSlot.start} - ${reservation.timeSlot.end}` : `Créneau #${reservation.timeSlotId}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {getExperienceName(reservation.experienceId)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{reservation.customerName}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{reservation.customerEmail}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {reservation.numberOfPeople}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(reservation.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      <div className="flex space-x-2">
                        <select
                          value={reservation.status}
                          onChange={(e) => handleStatusChange(reservation.id, e.target.value)}
                          className="px-2 py-1 text-xs border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        >
                          <option value="confirmed">Confirmé</option>
                          <option value="pending">En attente</option>
                          <option value="cancelled">Annulé</option>
                        </select>
                        <button
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                          onClick={() => console.log('Voir détails', reservation.id)}
                        >
                          Détails
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminReservations;