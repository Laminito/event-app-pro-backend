# 🎉 Event App Pro - Backend Setup Complet

## ✅ Installation terminée !

Le backend Node.js avec MongoDB Atlas est maintenant prêt.

## 🚀 Démarrage Rapide

### 1️⃣ Configurer MongoDB Atlas

Avant de démarrer, vous devez configurer votre connexion MongoDB Atlas :

1. Rendez-vous sur [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Créez un compte gratuit (si vous n'en avez pas)
3. Créez un nouveau cluster (Shared/Free Tier)
4. Créez un utilisateur de base de données :
   - Username: `eventapp`
   - Password: (choisissez un mot de passe fort)
5. Whitelist votre IP ou utilisez `0.0.0.0/0` (pour dev uniquement)
6. Copiez votre URI de connexion

### 2️⃣ Mettre à jour le fichier .env

Ouvrez le fichier `.env` et remplacez la ligne MONGODB_URI :

```env
MONGODB_URI=mongodb+srv://eventapp:VOTRE_MOT_DE_PASSE@cluster0.xxxxx.mongodb.net/eventapp?retryWrites=true&w=majority
```

Remplacez :
- `VOTRE_MOT_DE_PASSE` par le mot de passe que vous avez créé
- `cluster0.xxxxx` par l'adresse de votre cluster

### 3️⃣ Initialiser la base de données avec des données de test

```bash
npm run seed
```

Cette commande va créer :
- ✅ 4 utilisateurs (admin, 2 organisateurs, 1 utilisateur)
- ✅ 8 événements variés (concerts, conférences, sport, etc.)

### 4️⃣ Démarrer le serveur

**Mode développement (recommandé) :**
```bash
npm run dev
```

**Mode production :**
```bash
npm start
```

Le serveur démarre sur `http://localhost:5000`

## 🧪 Tester l'API

### Health Check
```bash
curl http://localhost:5000/api/v1/health
```

### Inscription d'un utilisateur
```bash
curl -X POST http://localhost:5000/api/v1/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Test User\",\"email\":\"test@test.com\",\"password\":\"password123\",\"phone\":\"+221771234567\"}"
```

### Connexion
```bash
curl -X POST http://localhost:5000/api/v1/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"amadou@eventapp.sn\",\"password\":\"password123\"}"
```

### Liste des événements
```bash
curl http://localhost:5000/api/v1/events
```

## 👥 Comptes de test créés

Après avoir exécuté `npm run seed`, vous aurez :

### Admin
- Email: `admin@eventapp.sn`
- Password: `password123`
- Rôle: admin

### Organisateur 1 (Youssou N'Dour)
- Email: `youssou@eventapp.sn`
- Password: `password123`
- Rôle: organizer

### Organisateur 2 (Fatou Sow)
- Email: `fatou@eventapp.sn`
- Password: `password123`
- Rôle: organizer

### Utilisateur (Amadou Diallo)
- Email: `amadou@eventapp.sn`
- Password: `password123`
- Rôle: user

## 📚 Documentation

- **API Endpoints complets :** Voir `API_ENDPOINTS.md`
- **Documentation Backend :** Voir `README_BACKEND.md`

## 🛠️ Commandes disponibles

```bash
npm start          # Démarrer en production
npm run dev        # Démarrer en développement avec nodemon
npm run seed       # Initialiser la DB avec des données de test
```

## 📁 Structure du projet

```
EventAppBackend/
├── src/
│   ├── config/           # Configuration (DB, env)
│   ├── controllers/      # Logique métier
│   ├── models/          # Modèles Mongoose
│   ├── routes/          # Routes Express
│   ├── middlewares/     # Middlewares (auth, validation, errors)
│   ├── utils/           # Utilitaires (JWT, email, QR code)
│   ├── app.js           # Configuration Express
│   └── server.js        # Point d'entrée
├── .env                 # Variables d'environnement
├── seed.js             # Script de seed
└── package.json        # Dépendances
```

## 🔗 Connexion avec le Frontend

Dans votre frontend React (EventApp), configurez l'URL de l'API :

```typescript
// config.ts ou .env
const API_URL = 'http://localhost:5000/api/v1';
```

## 🚨 Troubleshooting

### Erreur de connexion MongoDB
- Vérifiez que votre IP est whitelistée dans MongoDB Atlas
- Vérifiez que l'URI de connexion est correcte dans `.env`
- Vérifiez que le mot de passe ne contient pas de caractères spéciaux (ou encodez-les)

### Port 5000 déjà utilisé
Changez le port dans `.env` :
```env
PORT=5001
```

### Erreur lors du seed
Assurez-vous que MongoDB est bien connecté avant de lancer `npm run seed`

## 🎯 Prochaines étapes

1. ✅ Configurer MongoDB Atlas
2. ✅ Lancer `npm run seed`
3. ✅ Démarrer le serveur avec `npm run dev`
4. 🔄 Connecter votre frontend React
5. 🔄 Tester les endpoints
6. 🔄 Configurer les paiements (Wave, Orange Money)
7. 🔄 Configurer l'envoi d'emails

---

**Besoin d'aide ?** Consultez `README_BACKEND.md` pour plus de détails !

🚀 **Bon développement !**
