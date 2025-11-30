# 🎉 Event App Pro - Backend API

Backend Node.js/Express pour la plateforme événementielle sénégalaise Event App Pro.

## 🚀 Technologies

- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Base de données:** MongoDB Atlas Cloud
- **ODM:** Mongoose
- **Authentification:** JWT (jsonwebtoken)
- **Validation:** Express Validator
- **Sécurité:** Helmet, CORS, Rate Limiting
- **Email:** Nodemailer
- **QR Code:** qrcode

## 📦 Installation

### 1. Cloner le projet
```bash
cd EventAppBackend
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Configuration MongoDB Atlas

1. Créez un compte sur [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Créez un nouveau cluster (gratuit)
3. Créez un utilisateur de base de données
4. Whitelist votre IP (ou 0.0.0.0/0 pour autoriser toutes les IPs en dev)
5. Copiez votre URI de connexion

### 4. Configuration de l'environnement

Le fichier `.env` est déjà créé. Mettez à jour ces valeurs :

```env
# Remplacez par votre URI MongoDB Atlas
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/eventapp?retryWrites=true&w=majority

# Générez un secret JWT fort
JWT_SECRET=votre_secret_tres_securise

# Configuration email (optionnel en dev)
EMAIL_USER=votre_email@gmail.com
EMAIL_PASSWORD=votre_app_password
```

### 5. Démarrer le serveur

**Mode développement (avec auto-reload) :**
```bash
npm run dev
```

**Mode production :**
```bash
npm start
```

Le serveur démarre sur `http://localhost:5000`

## 📡 API Endpoints

### Base URL
```
http://localhost:5000/api/v1
```

### Health Check
```bash
GET /api/v1/health
```

### 🔐 Authentification
- `POST /api/v1/auth/register` - Inscription
- `POST /api/v1/auth/login` - Connexion
- `POST /api/v1/auth/logout` - Déconnexion
- `POST /api/v1/auth/refresh` - Rafraîchir le token
- `POST /api/v1/auth/forgot-password` - Mot de passe oublié
- `POST /api/v1/auth/reset-password` - Réinitialiser mot de passe

### 🎟️ Événements
- `GET /api/v1/events` - Liste des événements (avec filtres)
- `GET /api/v1/events/:id` - Détails d'un événement
- `GET /api/v1/events/featured` - Événements mis en avant
- `GET /api/v1/events/categories` - Liste des catégories
- `GET /api/v1/events/search/suggestions` - Suggestions de recherche

### 👤 Utilisateurs
- `GET /api/v1/users/profile` - Profil utilisateur
- `PUT /api/v1/users/profile` - Mettre à jour le profil
- `PUT /api/v1/users/password` - Changer le mot de passe
- `GET /api/v1/users/favorites` - Événements favoris
- `POST /api/v1/users/favorites/:eventId` - Ajouter aux favoris
- `DELETE /api/v1/users/favorites/:eventId` - Retirer des favoris

### 🎫 Billets
- `POST /api/v1/tickets/reserve` - Réserver des billets
- `POST /api/v1/tickets/purchase` - Acheter des billets
- `GET /api/v1/tickets/my-tickets` - Mes billets
- `GET /api/v1/tickets/:ticketId` - Détails d'un billet
- `POST /api/v1/tickets/:ticketId/validate` - Valider un billet (Organisateur)

### 👨‍💼 Organisateur
- `GET /api/v1/organizer/dashboard/stats` - Statistiques dashboard
- `POST /api/v1/organizer/events` - Créer un événement
- `GET /api/v1/organizer/events` - Mes événements
- `GET /api/v1/organizer/events/:id` - Détails événement
- `PUT /api/v1/organizer/events/:id` - Modifier événement
- `DELETE /api/v1/organizer/events/:id` - Supprimer événement
- `POST /api/v1/organizer/events/:id/publish` - Publier événement
- `POST /api/v1/organizer/events/:id/unpublish` - Dépublier événement
- `GET /api/v1/organizer/tickets` - Billets vendus

Voir `API_ENDPOINTS.md` pour la documentation complète.

## 🧪 Tester l'API

### Avec curl

**Inscription :**
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Amadou Diallo",
    "email": "amadou@example.com",
    "password": "password123",
    "phone": "+221771234567"
  }'
```

**Connexion :**
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "amadou@example.com",
    "password": "password123"
  }'
```

**Liste des événements :**
```bash
curl http://localhost:5000/api/v1/events
```

### Avec Postman ou Thunder Client

Importez la collection depuis `API_ENDPOINTS.md`

## 📁 Structure du Projet

```
EventAppBackend/
├── src/
│   ├── config/
│   │   ├── database.js       # Configuration MongoDB
│   │   └── index.js          # Config générale
│   ├── controllers/          # Logique métier
│   │   ├── authController.js
│   │   ├── eventController.js
│   │   ├── userController.js
│   │   ├── ticketController.js
│   │   └── organizerController.js
│   ├── models/               # Modèles Mongoose
│   │   ├── User.js
│   │   ├── Event.js
│   │   ├── Order.js
│   │   ├── Ticket.js
│   │   └── Notification.js
│   ├── routes/               # Routes API
│   │   ├── index.js
│   │   ├── authRoutes.js
│   │   ├── eventRoutes.js
│   │   ├── userRoutes.js
│   │   ├── ticketRoutes.js
│   │   └── organizerRoutes.js
│   ├── middlewares/          # Middlewares
│   │   ├── auth.js           # Authentification JWT
│   │   ├── validator.js      # Validation
│   │   └── error.js          # Gestion erreurs
│   ├── utils/                # Utilitaires
│   │   ├── jwt.js            # Génération JWT
│   │   ├── qrcode.js         # QR Code
│   │   ├── email.js          # Envoi emails
│   │   ├── helpers.js        # Fonctions helpers
│   │   └── AppError.js       # Erreurs custom
│   ├── app.js                # Configuration Express
│   └── server.js             # Point d'entrée
├── .env                      # Variables d'environnement
├── .env.example              # Template .env
├── .gitignore
├── package.json
├── API_ENDPOINTS.md          # Documentation API
└── README_BACKEND.md         # Ce fichier
```

## 🔒 Sécurité

- ✅ Hash des mots de passe (bcryptjs)
- ✅ JWT pour l'authentification
- ✅ Helmet pour les headers HTTP
- ✅ CORS configuré
- ✅ Rate limiting (1000 req/h authentifié, 100 req/h non-authentifié)
- ✅ Validation des données (express-validator)
- ✅ Protection CSRF

## 🌐 Déploiement

### Variables d'environnement production

Assurez-vous de définir :
- `NODE_ENV=production`
- `JWT_SECRET` (fort et unique)
- `MONGODB_URI` (votre cluster production)
- URLs de paiement réelles

### Plateformes recommandées

- **Render** (gratuit pour commencer)
- **Railway**
- **Heroku**
- **DigitalOcean**
- **AWS Elastic Beanstalk**

## 📝 Modèles de données

### User
- name, email, password, phone
- role (user, organizer, admin)
- favorites (références Event)

### Event
- title, description, category
- date, time, location
- organizer (référence User)
- tickets (Array: type, price, quantity, available)
- capacity, sold, featured, published

### Order
- orderNumber (généré auto)
- user, event
- items (tickets achetés)
- total, status, paymentMethod, paymentStatus

### Ticket
- ticketNumber (généré auto)
- order, event, user
- ticketType, price
- qrCode (Data URL)
- status (valid, used, cancelled)

## 🛠️ Scripts disponibles

```bash
npm start       # Démarrer en production
npm run dev     # Démarrer en développement (nodemon)
```

## 🐛 Debugging

Logs détaillés en mode développement avec Morgan.

Pour debug MongoDB :
```javascript
mongoose.set('debug', true);
```

## 📄 Licence

© 2025 YOUWARE - Tous droits réservés

## 🤝 Support

Pour toute question : contact@youware.sn

---

**Développé avec ❤️ pour révolutionner l'événementiel au Sénégal**
