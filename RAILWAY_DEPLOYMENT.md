# 🚂 Guide de Déploiement Railway

## 📋 Prérequis

- Compte GitHub avec le projet event-app-pro-backend
- Compte Railway (gratuit pour commencer)
- MongoDB déjà configuré sur Railway

## 🚀 Déploiement sur Railway

### Étape 1 : Créer un nouveau projet Railway

1. Allez sur [railway.app](https://railway.app)
2. Connectez-vous avec GitHub
3. Cliquez sur **"New Project"**
4. Sélectionnez **"Deploy from GitHub repo"**
5. Choisissez le repository **event-app-pro-backend**

### Étape 2 : Ajouter MongoDB

Votre MongoDB est déjà configuré avec ces variables :
```
MONGO_INITDB_ROOT_USERNAME=mongo
MONGO_INITDB_ROOT_PASSWORD=RJMaDDrkZOjpIZRRfNxnHrsiuMGuukjG
MONGO_URL=mongodb://mongo:RJMaDDrkZOjpIZRRfNxnHrsiuMGuukjG@mongodb.railway.internal:27017
```

### Étape 3 : Configurer les variables d'environnement

Dans Railway, allez dans **Variables** et ajoutez :

#### Variables essentielles (OBLIGATOIRES)

```env
NODE_ENV=production
API_VERSION=v1

# MongoDB (déjà configurées par Railway)
# Ces variables devraient déjà exister
MONGO_INITDB_ROOT_USERNAME=mongo
MONGO_INITDB_ROOT_PASSWORD=RJMaDDrkZOjpIZRRfNxnHrsiuMGuukjG

# URI MongoDB complète (créez cette variable)
MONGODB_URI=mongodb://mongo:RJMaDDrkZOjpIZRRfNxnHrsiuMGuukjG@mongodb.railway.internal:27017/eventapp?authSource=admin

# JWT Secret (IMPORTANT: Changez cette valeur!)
JWT_SECRET=votre_secret_jwt_tres_securise_pour_production

# Frontend URL (CORS)
FRONTEND_URL=https://votre-frontend.vercel.app
```

#### Variables optionnelles (pour plus tard)

```env
# Email (Gmail, SendGrid, etc.)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=votre-email@gmail.com
EMAIL_PASSWORD=votre-app-password
EMAIL_FROM=noreply@eventapppro.sn

# Payment Gateways
WAVE_API_KEY=votre_wave_api_key
WAVE_SECRET=votre_wave_secret
ORANGE_MONEY_API_KEY=votre_orange_money_key
```

### Étape 4 : Configuration du build

Railway détecte automatiquement Node.js. Vérifiez dans **Settings** :

- **Build Command** : `npm install` (automatique)
- **Start Command** : `npm start` (automatique)
- **Node Version** : 18.x ou supérieur

### Étape 5 : Déploiement

Railway déploie automatiquement à chaque push sur GitHub.

Pour déployer manuellement :
1. Allez dans l'onglet **Deployments**
2. Cliquez sur **Deploy**

### Étape 6 : Initialiser la base de données

Une fois déployé, vous devez initialiser la DB avec des données de test.

**Option 1 : Via Railway CLI**
```bash
# Installer Railway CLI
npm install -g @railway/cli

# Se connecter
railway login

# Lier le projet
railway link

# Exécuter le seed
railway run node seed.js
```

**Option 2 : Créer un endpoint temporaire**
Ajoutez temporairement dans `src/routes/index.js` :
```javascript
router.post('/seed-db', async (req, res) => {
  // Code du seed.js ici
  // À SUPPRIMER APRÈS UTILISATION !
});
```

### Étape 7 : Obtenir l'URL publique

1. Dans Railway, allez dans **Settings**
2. Section **Networking**
3. Cliquez sur **Generate Domain**
4. Vous obtiendrez une URL type : `event-app-pro-backend-production.up.railway.app`

### Étape 8 : Tester l'API

```bash
# Health check
curl https://votre-app.up.railway.app/api/v1/health

# Documentation Swagger
# Ouvrez dans le navigateur
https://votre-app.up.railway.app/api-docs

# Liste des événements
curl https://votre-app.up.railway.app/api/v1/events
```

## 🔐 Sécurité en Production

### Variables à ABSOLUMENT changer

1. **JWT_SECRET** : Générez un secret fort
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

2. **Mots de passe** : Ne jamais commit les vrais mots de passe

3. **CORS** : Configurez FRONTEND_URL avec votre vrai domaine

### Bonnes pratiques

- ✅ Utilisez des secrets forts et uniques
- ✅ Activez HTTPS (automatique sur Railway)
- ✅ Configurez CORS pour votre domaine frontend uniquement
- ✅ Surveillez les logs dans Railway
- ✅ Activez les alertes Railway

## 📊 Surveillance et Logs

### Voir les logs
1. Dans Railway, onglet **Logs**
2. Filtrez par niveau (info, error, warn)

### Métriques
- CPU et RAM dans l'onglet **Metrics**
- Requêtes HTTP
- Temps de réponse

## 🔄 Mises à jour

### Déploiement automatique
Chaque `git push` sur `main` déclenche un déploiement automatique.

### Déploiement manuel
```bash
# Pousser sur GitHub
git add .
git commit -m "Update"
git push origin main

# Railway déploie automatiquement
```

## 🐛 Debugging

### Problème de connexion MongoDB

Si l'erreur `MongoServerError: Authentication failed` :

1. Vérifiez que `MONGODB_URI` est correcte :
   ```env
   mongodb://mongo:RJMaDDrkZOjpIZRRfNxnHrsiuMGuukjG@mongodb.railway.internal:27017/eventapp?authSource=admin
   ```

2. Vérifiez que `authSource=admin` est bien présent

3. Si Railway utilise un service MongoDB séparé, utilisez `MONGO_URL` :
   ```env
   MONGODB_URI=${{MONGO_URL}}/eventapp?authSource=admin
   ```

### Problème de CORS

Ajoutez votre domaine frontend dans `FRONTEND_URL` :
```env
FRONTEND_URL=https://votre-app.vercel.app
```

### Port déjà utilisé

Railway fournit automatiquement `PORT`. Assurez-vous que votre app l'utilise :
```javascript
const PORT = process.env.PORT || 5000;
```

## 📱 URL de l'API

Une fois déployé, votre API sera accessible à :

```
https://event-app-pro-backend-production.up.railway.app
```

### Endpoints disponibles

- **API Base** : `/api/v1`
- **Health** : `/api/v1/health`
- **Swagger** : `/api-docs`
- **Auth** : `/api/v1/auth/*`
- **Events** : `/api/v1/events`
- **Tickets** : `/api/v1/tickets`

## 💰 Coûts Railway

**Plan gratuit** :
- $5 de crédit gratuit/mois
- Parfait pour dev/test

**Plan Pro** :
- $20/mois
- Pour la production

**Optimisation des coûts** :
- Utilisez le sleep mode pour les environnements de dev
- Surveillez l'utilisation dans le dashboard

## 🔗 Connexion Frontend

Dans votre app React/Next.js :

```typescript
// .env.production
NEXT_PUBLIC_API_URL=https://event-app-pro-backend-production.up.railway.app/api/v1
```

```typescript
// api/client.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchEvents = async () => {
  const response = await fetch(`${API_URL}/events`);
  return response.json();
};
```

## ✅ Checklist de déploiement

- [ ] Projet créé sur Railway
- [ ] Repository GitHub connecté
- [ ] MongoDB configuré et connecté
- [ ] Variables d'environnement ajoutées
- [ ] JWT_SECRET changé pour production
- [ ] FRONTEND_URL configuré
- [ ] Domaine généré
- [ ] API testée (health check)
- [ ] Swagger accessible
- [ ] Base de données seedée
- [ ] Connexion frontend testée

## 🆘 Support

- **Documentation Railway** : https://docs.railway.app
- **Discord Railway** : https://discord.gg/railway
- **GitHub Issues** : Pour les bugs du projet

---

## 📝 Notes importantes

### Variables Railway automatiques

Railway fournit automatiquement :
- `PORT` - Port à utiliser
- `RAILWAY_ENVIRONMENT` - dev/production
- `RAILWAY_PROJECT_NAME`
- `RAILWAY_SERVICE_NAME`

### Connexion MongoDB

Railway utilise un réseau privé. L'URL MongoDB contient :
- `mongodb.railway.internal` - Pour connexion interne
- `RAILWAY_TCP_PROXY_DOMAIN` - Pour connexion externe

### Domaine personnalisé

Pour utiliser votre propre domaine :
1. Settings → Networking → Custom Domain
2. Ajoutez votre domaine (ex: api.eventapppro.sn)
3. Configurez le DNS chez votre registrar

---

**🎉 Votre backend Event App Pro est maintenant déployé sur Railway !**

**URL API** : https://votre-app.up.railway.app  
**Swagger** : https://votre-app.up.railway.app/api-docs
