// Script de test pour la console du navigateur
// Pour tester en environnement de développement

async function testReservationSystem() {
  console.log('⏳ Test du système de réservation...');
  
  // 1. Test de l'API des expériences
  console.log('\n📊 Test API Expériences:');
  try {
    const experiencesResponse = await fetch('/api/experiences?tag=escapeGame');
    if (!experiencesResponse.ok) throw new Error('Erreur lors de la récupération des expériences');
    
    const experiences = await experiencesResponse.json();
    console.log(`✅ ${experiences.length} expériences récupérées`);
    
    if (experiences.length > 0) {
      console.log(`   Premier élément: ${experiences[0].data.name}`);
    }
  } catch (error) {
    console.error('❌ Échec du test API Expériences:', error);
  }
  
  // 2. Test de l'API de calcul des prix
  console.log('\n💲 Test API Calcul de prix:');
  try {
    const experienceId = 1;
    const participants = 4;
    const duration = '1h';
    const priceResponse = await fetch(`/api/calculate-price?experienceId=${experienceId}&participants=${participants}&duration=${duration}`);
    
    if (!priceResponse.ok) throw new Error('Erreur lors du calcul du prix');
    
    const priceData = await priceResponse.json();
    console.log(`✅ Prix calculé: ${priceData.totalPrice}€ pour ${participants} participants`);
    console.log(`   Prix par personne: ${priceData.pricePerPerson}€`);
    console.log(`   Économie: ${priceData.savings}€`);
  } catch (error) {
    console.error('❌ Échec du test API Calcul de prix:', error);
  }
  
  // 3. Test de l'API de vérification des disponibilités
  console.log('\n🗓️ Test API Disponibilités:');
  try {
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    
    const formattedDate = nextWeek.toISOString().split('T')[0];
    const availabilityResponse = await fetch(`/api/check-availability?date=${formattedDate}&durationId=1h&participants=2`);
    
    if (!availabilityResponse.ok) throw new Error('Erreur lors de la vérification des disponibilités');
    
    const availabilityData = await availabilityResponse.json();
    console.log(`✅ ${availabilityData.availableSlots.length} créneaux disponibles pour le ${formattedDate}`);
    
    if (availabilityData.availableSlots.length > 0) {
      const firstSlot = availabilityData.availableSlots[0];
      console.log(`   Premier créneau disponible: ${firstSlot.start} - ${firstSlot.end}`);
      console.log(`   Capacité restante: ${firstSlot.remainingCapacity}`);
    }
  } catch (error) {
    console.error('❌ Échec du test API Disponibilités:', error);
  }
  
  console.log('\n🏁 Tests terminés!');
}

// Exécuter les tests (vous pouvez aussi coller ce code dans la console du navigateur)
testReservationSystem();
