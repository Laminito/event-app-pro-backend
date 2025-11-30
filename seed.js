require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');
const Event = require('./src/models/Event');
const connectDB = require('./src/config/database');

const seedData = async () => {
  try {
    // Connexion à la base de données
    await connectDB();
    
    console.log('🗑️  Nettoyage de la base de données...');
    await User.deleteMany({});
    await Event.deleteMany({});
    
    console.log('👤 Création des utilisateurs...');
    
    // Créer des utilisateurs
    const users = await User.create([
      {
        name: 'Admin User',
        email: 'admin@eventapp.sn',
        password: 'password123',
        phone: '+221771234567',
        role: 'admin',
      },
      {
        name: 'Youssou N\'Dour',
        email: 'youssou@eventapp.sn',
        password: 'password123',
        phone: '+221771234568',
        role: 'organizer',
      },
      {
        name: 'Amadou Diallo',
        email: 'amadou@eventapp.sn',
        password: 'password123',
        phone: '+221771234569',
        role: 'user',
      },
      {
        name: 'Fatou Sow',
        email: 'fatou@eventapp.sn',
        password: 'password123',
        phone: '+221771234570',
        role: 'organizer',
      },
    ]);
    
    console.log('✅ Utilisateurs créés:', users.length);
    
    console.log('🎉 Création des événements...');
    
    // Créer des événements
    const events = await Event.create([
      {
        title: 'Festival Dakar Music',
        description: 'Le plus grand festival de musique d\'Afrique de l\'Ouest. Rejoignez-nous pour une soirée inoubliable avec les meilleurs artistes sénégalais et internationaux.',
        category: 'Concert',
        date: new Date('2025-12-15T20:00:00Z'),
        time: '20:00',
        location: 'Grand Théâtre National, Dakar',
        image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800',
        organizer: users[1]._id,
        capacity: 5000,
        sold: 3200,
        featured: true,
        published: true,
        status: 'published',
        tickets: [
          { type: 'Standard', price: 15000, quantity: 3200, available: 1800, description: 'Place standard' },
          { type: 'VIP', price: 35000, quantity: 1800, available: 0, description: 'Accès VIP' },
        ],
        tags: ['Musique', 'Festival', 'Concert'],
      },
      {
        title: 'Tech Summit Sénégal 2025',
        description: 'Conférence sur l\'innovation technologique en Afrique. Rencontrez des experts, entrepreneurs et investisseurs du secteur tech.',
        category: 'Conférence',
        date: new Date('2025-12-20T09:00:00Z'),
        time: '09:00',
        location: 'King Fahd Palace Hotel, Dakar',
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
        organizer: users[1]._id,
        capacity: 1000,
        sold: 650,
        featured: true,
        published: true,
        status: 'published',
        tickets: [
          { type: 'Standard', price: 25000, quantity: 700, available: 350, description: 'Accès standard' },
          { type: 'VIP', price: 50000, quantity: 300, available: 0, description: 'Accès VIP avec networking' },
        ],
        tags: ['Tech', 'Innovation', 'Conférence'],
      },
      {
        title: 'Match ASC Diaraf vs Jaraaf',
        description: 'Derby sénégalais passionnant entre deux grandes équipes. Venez supporter votre équipe favorite dans une ambiance électrique.',
        category: 'Sport',
        date: new Date('2025-12-18T17:00:00Z'),
        time: '17:00',
        location: 'Stade Léopold Sédar Senghor',
        image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800',
        organizer: users[3]._id,
        capacity: 30000,
        sold: 18500,
        featured: false,
        published: true,
        status: 'published',
        tickets: [
          { type: 'Standard', price: 5000, quantity: 25000, available: 11500, description: 'Place tribune' },
          { type: 'VIP', price: 15000, quantity: 5000, available: 0, description: 'Tribune VIP' },
        ],
        tags: ['Sport', 'Football', 'Derby'],
      },
      {
        title: 'Festival Gorée Cinema',
        description: 'Festival international du cinéma africain. Projections, masterclass et rencontres avec les réalisateurs.',
        category: 'Festival',
        date: new Date('2025-12-22T18:00:00Z'),
        time: '18:00',
        location: 'Île de Gorée',
        image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800',
        organizer: users[3]._id,
        capacity: 800,
        sold: 420,
        featured: true,
        published: true,
        status: 'published',
        tickets: [
          { type: 'Standard', price: 10000, quantity: 600, available: 380, description: 'Accès projections' },
          { type: 'VIP', price: 25000, quantity: 200, available: 0, description: 'Pass Festival complet' },
        ],
        tags: ['Cinéma', 'Culture', 'Festival'],
      },
      {
        title: 'Pièce de Théâtre: Le Mandat',
        description: 'Adaptation théâtrale du célèbre roman de Sembène Ousmane. Une comédie sociale poignante.',
        category: 'Théâtre',
        date: new Date('2025-12-25T19:30:00Z'),
        time: '19:30',
        location: 'Théâtre Daniel Sorano',
        image: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=800',
        organizer: users[3]._id,
        capacity: 600,
        sold: 385,
        featured: false,
        published: true,
        status: 'published',
        tickets: [
          { type: 'Standard', price: 8000, quantity: 450, available: 215, description: 'Place standard' },
          { type: 'VIP', price: 18000, quantity: 150, available: 0, description: 'Places premium' },
        ],
        tags: ['Théâtre', 'Culture', 'Sembène Ousmane'],
      },
      {
        title: 'Formation Marketing Digital',
        description: 'Formation intensive sur les stratégies de marketing digital adaptées au marché africain.',
        category: 'Formation',
        date: new Date('2026-01-10T09:00:00Z'),
        time: '09:00',
        location: 'Sup de Co Dakar',
        image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800',
        organizer: users[1]._id,
        capacity: 50,
        sold: 32,
        featured: false,
        published: true,
        status: 'published',
        tickets: [
          { type: 'Standard', price: 50000, quantity: 50, available: 18, description: 'Formation complète 3 jours' },
        ],
        tags: ['Formation', 'Marketing', 'Digital'],
      },
      {
        title: 'Networking Evening - Entrepreneurs',
        description: 'Soirée de networking pour entrepreneurs et startups. Échangez, collaborez et développez votre réseau.',
        category: 'Networking',
        date: new Date('2025-12-28T18:30:00Z'),
        time: '18:30',
        location: 'Jokko Labs, Plateau',
        image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800',
        organizer: users[1]._id,
        capacity: 150,
        sold: 98,
        featured: false,
        published: true,
        status: 'published',
        tickets: [
          { type: 'Standard', price: 5000, quantity: 150, available: 52, description: 'Accès soirée networking' },
        ],
        tags: ['Networking', 'Entrepreneurs', 'Startups'],
      },
      {
        title: 'Saint Louis Jazz Festival',
        description: 'Festival de jazz international dans la ville historique de Saint-Louis. Ambiance unique garantie.',
        category: 'Festival',
        date: new Date('2026-01-05T20:00:00Z'),
        time: '20:00',
        location: 'Place Faidherbe, Saint-Louis',
        image: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=800',
        organizer: users[3]._id,
        capacity: 2000,
        sold: 890,
        featured: true,
        published: true,
        status: 'published',
        tickets: [
          { type: 'Standard', price: 12000, quantity: 1400, available: 1110, description: 'Accès festival' },
          { type: 'VIP', price: 28000, quantity: 600, available: 0, description: 'Accès VIP premium' },
        ],
        tags: ['Jazz', 'Musique', 'Festival'],
      },
    ]);
    
    console.log('✅ Événements créés:', events.length);
    
    console.log('');
    console.log('='.repeat(60));
    console.log('✅ Base de données initialisée avec succès!');
    console.log('='.repeat(60));
    console.log('');
    console.log('📝 Comptes créés:');
    console.log('');
    console.log('👤 Admin:');
    console.log('   Email: admin@eventapp.sn');
    console.log('   Password: password123');
    console.log('');
    console.log('👨‍💼 Organisateur 1 (Youssou N\'Dour):');
    console.log('   Email: youssou@eventapp.sn');
    console.log('   Password: password123');
    console.log('');
    console.log('👨‍💼 Organisateur 2 (Fatou Sow):');
    console.log('   Email: fatou@eventapp.sn');
    console.log('   Password: password123');
    console.log('');
    console.log('👤 Utilisateur (Amadou Diallo):');
    console.log('   Email: amadou@eventapp.sn');
    console.log('   Password: password123');
    console.log('');
    console.log('='.repeat(60));
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
};

seedData();
