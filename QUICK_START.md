# 🚀 Démarrage Rapide - Event App Pro Backend

## ⚡ Options de développement

Vous avez 3 options pour travailler avec ce backend :

### Option 1 : MongoDB Atlas (Recommandé pour le développement local) ✨

1. **Créer un compte gratuit** sur [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)

2. **Créer un cluster gratuit** :
   - Choisissez un cluster M0 (gratuit)
   - Région : AWS - Paris ou Europe
   - Nom du cluster : `EventAppPro`

3. **Configurer l'accès** :
   - Database Access → Add New User
   - Username: `eventapp_user`
   - Password: Générez un mot de passe fort
   - User Privileges: `Read and write to any database`

4. **Whitelist votre IP** :
   - Network Access → Add IP Address
   - Allow access from anywhere: `0.0.0.0/0` (pour le dev)

5. **Obtenir l'URL de connexion** :
   - Clusters → Connect → Connect your application
   - Copiez l'URL qui ressemble à :
   ```
   mongodb+srv://eventapp_user:<password>@eventapppro.xxxxx.mongodb.net/eventapp?retryWrites=true&w=majority
   ```

6. **Mettre à jour `.env`** :
   ```env
   MONGODB_URI=mongodb+srv://eventapp_user:votre_password@eventapppro.xxxxx.mongodb.net/eventapp?retryWrites=true&w=majority
   ```

7. **Démarrer le serveur** :
   ```bash
   npm run dev
   ```

8. **Seed la database** :
   ```bash
   npm run seed
   ```

---

### Option 2 : MongoDB local avec Docker 🐳

Si vous avez Docker installé :

1. **Lancer MongoDB avec Docker** :
   ```bash
   docker run -d --name mongodb -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=password123 mongo:latest
   ```

2. **Mettre à jour `.env`** :
   ```env
   MONGODB_URI=mongodb://admin:password123@localhost:27017/eventapp?authSource=admin
   ```

3. **Démarrer le serveur** :
   ```bash
   npm run dev
   ```

4. **Seed la database** :
   ```bash
   npm run seed
   ```

---

### Option 3 : MongoDB local (installation native) 💾

1. **Installer MongoDB Community Server** :
   - Téléchargez depuis [mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
   - Suivez l'installation pour Windows

2. **Démarrer MongoDB** :
   ```bash
   # Créer le dossier de données
   mkdir C:\data\db

   # Démarrer MongoDB
   mongod --dbpath C:\data\db
   ```

3. **Mettre à jour `.env`** :
   ```env
   MONGODB_URI=mongodb://localhost:27017/eventapp
   ```

4. **Démarrer le serveur** (dans un nouveau terminal) :
   ```bash
   npm run dev
   ```

5. **Seed la database** :
   ```bash
   npm run seed
   ```

---

## 🎯 Vérification que tout fonctionne

### 1. Le serveur démarre
```bash
npm run dev
```

Vous devriez voir :
```
==================================================
🚀 Event App Pro API
📡 Server running in development mode
🌐 Port: 5001
🔗 URL: http://localhost:5001
📝 API Version: v1
==================================================
✅ MongoDB connected successfully
```

### 2. Test du Health Check
Ouvrez http://localhost:5001/api/v1/health

Réponse attendue :
```json
{
  "status": "success",
  "message": "Event App Pro API is running",
  "data": {
    "uptime": 5.123456789,
    "timestamp": "2025-01-23T10:30:00.000Z",
    "environment": "development",
    "version": "v1"
  }
}
```

### 3. Swagger UI
Ouvrez http://localhost:5001/api-docs

Vous devriez voir l'interface Swagger avec tous les endpoints.

### 4. Test d'inscription
```bash
curl -X POST http://localhost:5001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Test User\",\"email\":\"test@example.com\",\"password\":\"password123\",\"phone\":\"+221771234567\"}"
```

### 5. Voir les événements
http://localhost:5001/api/v1/events

---

## 📦 Seeds (données de test)

Après avoir connecté MongoDB, initialisez la base avec :

```bash
npm run seed
```

Cela créera :
- **4 utilisateurs** (admin, 2 organisateurs, 1 utilisateur)
- **8 événements** (concerts, tech, sport, cinéma, etc.)

### Comptes de test créés :

| Email | Password | Rôle |
|-------|----------|------|
| admin@eventapp.sn | password123 | admin |
| organizer@eventapp.sn | password123 | organizer |
| org2@eventapp.sn | password123 | organizer |
| user@eventapp.sn | password123 | user |

---

## 🔧 Configuration minimale

Fichier `.env` minimum pour démarrer :

```env
# Server
NODE_ENV=development
PORT=5001
API_VERSION=v1

# MongoDB (CHOISIR UNE OPTION)
# Option Atlas:
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/eventapp

# Option Docker:
# MONGODB_URI=mongodb://admin:password123@localhost:27017/eventapp?authSource=admin

# Option Local:
# MONGODB_URI=mongodb://localhost:27017/eventapp

# JWT
JWT_SECRET=event_app_pro_super_secret_key_2025
JWT_EXPIRE=7d

# Frontend (CORS)
FRONTEND_URL=http://localhost:5173
```

---

## 🐛 Problèmes courants

### Port 5001 déjà utilisé
```env
# Dans .env, changez le port
PORT=5002
```

### MongoDB connection timeout
- Vérifiez que MongoDB est démarré
- Vérifiez l'URL de connexion dans `.env`
- Pour Atlas : vérifiez que votre IP est whitelistée

### "Cannot find module"
```bash
# Réinstaller les dépendances
rm -rf node_modules
npm install
```

### Warnings sur les index dupliqués
C'est normal, pas d'impact sur le fonctionnement.

---

## 📚 Endpoints principaux

Une fois le serveur démarré :

| Endpoint | Description |
|----------|-------------|
| GET /api/v1/health | Health check |
| GET /api-docs | Documentation Swagger |
| POST /api/v1/auth/register | Inscription |
| POST /api/v1/auth/login | Connexion |
| GET /api/v1/events | Liste des événements |
| GET /api/v1/events/:id | Détails d'un événement |

---

## 🚀 Déploiement sur Railway

Quand vous êtes prêt à déployer :

1. Lisez le fichier **RAILWAY_DEPLOYMENT.md**
2. Poussez votre code sur GitHub
3. Connectez Railway à votre repo
4. Configurez les variables d'environnement
5. Railway déploie automatiquement !

---

## ✅ Checklist de démarrage

- [ ] Node.js 18+ installé (`node --version`)
- [ ] npm installé (`npm --version`)
- [ ] Dépendances installées (`npm install`)
- [ ] MongoDB accessible (Atlas, Docker, ou local)
- [ ] Fichier `.env` configuré avec MONGODB_URI
- [ ] Serveur démarre (`npm run dev`)
- [ ] Health check fonctionne (http://localhost:5001/api/v1/health)
- [ ] Base de données seedée (`npm run seed`)
- [ ] Swagger accessible (http://localhost:5001/api-docs)
- [ ] Connexion/inscription fonctionnent

---

## 📞 Besoin d'aide ?

1. Vérifiez les logs dans le terminal
2. Consultez RAILWAY_DEPLOYMENT.md pour plus de détails
3. Lisez README_BACKEND.md pour l'architecture complète
4. Consultez SWAGGER.md pour l'utilisation de Swagger

---

**Recommandation** : Utilisez **MongoDB Atlas** pour un démarrage rapide sans installation locale !
