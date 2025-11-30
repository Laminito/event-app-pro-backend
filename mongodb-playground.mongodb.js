// MongoDB Playground - Event App Pro
// Connecté à: mongodb://localhost:27017

// ========================================
// SÉLECTIONNER LA BASE DE DONNÉES
// ========================================
use('eventapp');

// ========================================
// 1. VOIR TOUS LES UTILISATEURS
// ========================================
db.users.find({}).limit(10);

// ========================================
// 2. VOIR TOUS LES ÉVÉNEMENTS
// ========================================
db.events.find({}).limit(10);

// ========================================
// 3. COMPTER LES ÉVÉNEMENTS PAR CATÉGORIE
// ========================================
db.events.aggregate([
  {
    $group: {
      _id: '$category',
      count: { $sum: 1 }
    }
  },
  { $sort: { count: -1 } }
]);

// ========================================
// 4. ÉVÉNEMENTS À VENIR (APRÈS AUJOURD'HUI)
// ========================================
db.events.find({
  'date.start': { $gte: new Date() }
}).sort({ 'date.start': 1 });

// ========================================
// 5. ÉVÉNEMENTS PAR VILLE
// ========================================
db.events.aggregate([
  {
    $group: {
      _id: '$location.city',
      count: { $sum: 1 },
      events: { $push: '$title' }
    }
  }
]);

// ========================================
// 6. ÉVÉNEMENTS AVEC PRIX MIN/MAX
// ========================================
db.events.find({}, {
  title: 1,
  'tickets.price': 1,
  'location.city': 1
}).limit(10);

// ========================================
// 7. UTILISATEURS PAR RÔLE
// ========================================
db.users.aggregate([
  {
    $group: {
      _id: '$role',
      count: { $sum: 1 },
      users: { $push: { name: '$name', email: '$email' } }
    }
  }
]);

// ========================================
// 8. CHERCHER UN ÉVÉNEMENT PAR TITRE
// ========================================
db.events.find({
  title: { $regex: 'Dakar', $options: 'i' }
});

// ========================================
// 9. ÉVÉNEMENTS AVEC BILLETS DISPONIBLES
// ========================================
db.events.find({
  'tickets.available': { $gt: 0 }
}, {
  title: 1,
  'tickets.type': 1,
  'tickets.available': 1,
  'tickets.price': 1
});

// ========================================
// 10. TOUS LES TICKETS/ORDERS (si existants)
// ========================================
db.orders.find({}).limit(5);
db.tickets.find({}).limit(5);

// ========================================
// 11. STATISTIQUES GLOBALES
// ========================================
db.events.aggregate([
  {
    $facet: {
      totalEvents: [{ $count: 'count' }],
      categories: [
        { $group: { _id: '$category', count: { $sum: 1 } } }
      ],
      cities: [
        { $group: { _id: '$location.city', count: { $sum: 1 } } }
      ],
      totalTickets: [
        { $unwind: '$tickets' },
        { $group: { _id: null, total: { $sum: '$tickets.total' } } }
      ]
    }
  }
]);

// ========================================
// 12. INSÉRER UN NOUVEL ÉVÉNEMENT (EXEMPLE)
// ========================================
// DÉCOMMENTEZ POUR EXÉCUTER
/*
db.events.insertOne({
  title: "Test Event",
  description: "Événement de test",
  category: "Concert",
  date: {
    start: new Date('2025-12-15T20:00:00'),
    end: new Date('2025-12-15T23:00:00')
  },
  location: {
    venue: "Test Venue",
    address: "123 Test Street",
    city: "Dakar"
  },
  organizer: ObjectId('votre_organizer_id_ici'),
  tickets: [
    {
      type: "Standard",
      price: 5000,
      total: 100,
      available: 100
    }
  ],
  status: "published",
  featured: false
});
*/

// ========================================
// 13. METTRE À JOUR UN ÉVÉNEMENT
// ========================================
// DÉCOMMENTEZ POUR EXÉCUTER
/*
db.events.updateOne(
  { title: "Test Event" },
  { $set: { featured: true } }
);
*/

// ========================================
// 14. SUPPRIMER UN ÉVÉNEMENT
// ========================================
// DÉCOMMENTEZ POUR EXÉCUTER
/*
db.events.deleteOne({ title: "Test Event" });
*/

// ========================================
// INSTRUCTIONS:
// ========================================
// 1. Sélectionnez une requête (ou plusieurs lignes)
// 2. Appuyez sur Ctrl+Shift+E (ou clic droit > "Run Selected Lines")
// 3. Les résultats s'affichent dans l'onglet "Output"
// 
// Pour voir la structure de la base:
// - Ouvrez la vue MongoDB (icône feuille à gauche)
// - Dépliez "localhost:27017" > "eventapp"
// - Cliquez sur une collection pour voir les documents
