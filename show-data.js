// Script pour afficher les données MongoDB
const mongoose = require('mongoose');

async function showData() {
  try {
    // Connexion à MongoDB
    await mongoose.connect('mongodb://localhost:27017/eventapp');
    console.log('✅ Connecté à MongoDB\n');

    // Récupérer les collections
    const db = mongoose.connection.db;
    
    // 1. UTILISATEURS
    console.log('========================================');
    console.log('📊 UTILISATEURS');
    console.log('========================================');
    const users = await db.collection('users').find({}).toArray();
    console.log(`Total: ${users.length} utilisateurs\n`);
    users.forEach(user => {
      console.log(`👤 ${user.name}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Rôle: ${user.role}`);
      console.log('');
    });

    // 2. ÉVÉNEMENTS
    console.log('========================================');
    console.log('🎉 ÉVÉNEMENTS');
    console.log('========================================');
    const events = await db.collection('events').find({}).toArray();
    console.log(`Total: ${events.length} événements\n`);
    events.forEach(event => {
      console.log(`🎫 ${event.title}`);
      console.log(`   Catégorie: ${event.category}`);
      console.log(`   Ville: ${event.location.city}`);
      console.log(`   Date: ${new Date(event.date.start).toLocaleDateString('fr-FR')}`);
      console.log(`   Tickets: ${event.tickets.length} types`);
      event.tickets.forEach(ticket => {
        console.log(`     - ${ticket.type}: ${ticket.price} FCFA (${ticket.available}/${ticket.total} disponibles)`);
      });
      console.log('');
    });

    // 3. STATISTIQUES
    console.log('========================================');
    console.log('📈 STATISTIQUES');
    console.log('========================================');
    
    const stats = await db.collection('events').aggregate([
      {
        $facet: {
          byCategory: [
            { $group: { _id: '$category', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
          ],
          byCity: [
            { $group: { _id: '$location.city', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
          ]
        }
      }
    ]).toArray();

    console.log('Par catégorie:');
    stats[0].byCategory.forEach(cat => {
      console.log(`  ${cat._id}: ${cat.count} événement(s)`);
    });

    console.log('\nPar ville:');
    stats[0].byCity.forEach(city => {
      console.log(`  ${city._id}: ${city.count} événement(s)`);
    });

    await mongoose.connection.close();
    console.log('\n✅ Terminé !');
    process.exit(0);

  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

showData();
