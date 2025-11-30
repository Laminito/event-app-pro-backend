require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/database');
const config = require('./config');

// Connexion à MongoDB
connectDB();

// Démarrer le serveur
const PORT = config.port;

const server = app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log(`🚀 Event App Pro API`);
  console.log(`📡 Server running in ${config.env} mode`);
  console.log(`🌐 Port: ${PORT}`);
  console.log(`🔗 URL: http://localhost:${PORT}`);
  console.log(`📝 API Version: ${config.apiVersion}`);
  console.log('='.repeat(50));
});

// Gestion des erreurs non catchées
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err.message);
  console.error(err.stack);
  
  // Fermer le serveur proprement
  server.close(() => {
    process.exit(1);
  });
});

process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err.message);
  console.error(err.stack);
  process.exit(1);
});

// Gestion du SIGTERM
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM signal received: closing server');
  server.close(() => {
    console.log('💤 Server closed');
    process.exit(0);
  });
});
