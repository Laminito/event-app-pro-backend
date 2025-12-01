# 📚 Documentation API Swagger

## 🎯 Accès à la documentation

Une fois le serveur démarré, accédez à la documentation interactive Swagger :

### URL de la documentation
```
http://localhost:5000/api-docs
```

## ✨ Fonctionnalités de Swagger UI

### 🔍 Explorer l'API
- **Navigation par tags** : Authentification, Événements, Utilisateurs, Billets, Organisateur
- **Détails des endpoints** : Méthode HTTP, URL, paramètres, réponses
- **Schémas de données** : Modèles User, Event, Ticket, Order

### 🧪 Tester directement
1. Cliquez sur un endpoint
2. Cliquez sur "Try it out"
3. Remplissez les paramètres
4. Cliquez sur "Execute"
5. Voir la réponse en temps réel

### 🔐 Authentification
Pour tester les endpoints protégés :

1. **Connectez-vous** via `/auth/login` pour obtenir un token
2. Copiez le token de la réponse
3. Cliquez sur le bouton **"Authorize"** en haut à droite
4. Collez le token (avec ou sans "Bearer ")
5. Cliquez sur "Authorize"
6. Tous les endpoints protégés sont maintenant accessibles

## 📋 Sections de la documentation

### 1. Authentification
- `POST /auth/register` - Inscription
- `POST /auth/login` - Connexion
- `POST /auth/forgot-password` - Mot de passe oublié
- `POST /auth/reset-password` - Réinitialiser mot de passe
- `POST /auth/refresh` - Rafraîchir token
- `POST /auth/logout` - Déconnexion

### 2. Événements (Public)
- `GET /events` - Liste avec filtres et pagination
- `GET /events/:id` - Détails
- `GET /events/featured` - Événements mis en avant
- `GET /events/categories` - Catégories
- `GET /events/search/suggestions` - Autocomplete

### 3. Utilisateurs (Authentifié)
- `GET /users/profile` - Mon profil
- `PUT /users/profile` - Modifier profil
- `PUT /users/password` - Changer mot de passe
- `GET /users/favorites` - Mes favoris
- `POST /users/favorites/:eventId` - Ajouter favori
- `DELETE /users/favorites/:eventId` - Retirer favori

### 4. Billets (Authentifié)
- `POST /tickets/reserve` - Réserver
- `POST /tickets/purchase` - Acheter
- `GET /tickets/my-tickets` - Mes billets
- `GET /tickets/:ticketId` - Détails
- `POST /tickets/:ticketId/validate` - Valider (Organisateur)

### 5. Organisateur (Rôle: organizer)
- `GET /organizer/dashboard/stats` - Statistiques
- `POST /organizer/events` - Créer événement
- `GET /organizer/events` - Mes événements
- `GET /organizer/events/:id` - Détails
- `PUT /organizer/events/:id` - Modifier
- `DELETE /organizer/events/:id` - Supprimer
- `POST /organizer/events/:id/publish` - Publier
- `POST /organizer/events/:id/unpublish` - Dépublier
- `GET /organizer/tickets` - Billets vendus

## 🎨 Schémas de données

### User
```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "phone": "+221771234567",
  "role": "user|organizer|admin",
  "avatar": "string",
  "location": "string",
  "birthdate": "date",
  "createdAt": "datetime"
}
```

### Event
```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "category": "Concert|Conférence|Sport|...",
  "date": "datetime",
  "time": "20:00",
  "location": "string",
  "image": "url",
  "organizer": {...},
  "tickets": [{
    "type": "VIP",
    "price": 35000,
    "quantity": 100,
    "available": 50
  }],
  "capacity": 1000,
  "sold": 200,
  "featured": true,
  "published": true,
  "tags": ["tag1", "tag2"]
}
```

### Ticket
```json
{
  "id": "string",
  "ticketNumber": "TKT-20251130-00001",
  "event": {...},
  "user": {...},
  "ticketType": "VIP",
  "price": 35000,
  "qrCode": "base64_string",
  "status": "valid|used|cancelled",
  "createdAt": "datetime"
}
```

## 🔒 Codes de réponse

- `200` - OK
- `201` - Créé
- `400` - Mauvaise requête
- `401` - Non authentifié
- `403` - Non autorisé
- `404` - Non trouvé
- `422` - Erreur de validation
- `500` - Erreur serveur

## 💡 Exemples d'utilisation

### 1. S'inscrire et se connecter
```
1. POST /auth/register
   Body: { name, email, password, phone }
   
2. POST /auth/login
   Body: { email, password }
   Response: { user, token }
   
3. Copier le token
4. Cliquer sur "Authorize"
5. Coller le token
```

### 2. Réserver et acheter des billets
```
1. GET /events (trouver un événement)
2. POST /tickets/reserve
   Body: { eventId, tickets: [{type, quantity}] }
   Response: { reservationId }
   
3. POST /tickets/purchase
   Body: { reservationId, paymentMethod, customerInfo }
   Response: { order avec tickets }
```

### 3. Créer un événement (Organisateur)
```
1. Connectez-vous avec un compte organizer
2. POST /organizer/events
   Body: { title, description, category, date, time, location, tickets, ... }
   
3. POST /organizer/events/:id/publish
   Pour rendre l'événement public
```

## 🛠️ Configuration Swagger

La configuration se trouve dans `src/config/swagger.js`

Pour personnaliser :
- Titre, description, version
- Serveurs (dev, production)
- Schémas de données
- Tags et descriptions
- Exemples de réponses

## 📝 Ajouter de la documentation

Pour ajouter des annotations à vos routes :

```javascript
/**
 * @swagger
 * /endpoint:
 *   get:
 *     summary: Description courte
 *     tags: [Tag]
 *     parameters:
 *       - in: query
 *         name: param
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
router.get('/endpoint', controller);
```

## 🌐 Documentation en production

Pour la production, modifiez `src/config/swagger.js` :

```javascript
servers: [
  {
    url: 'https://api.votredomaine.com/api/v1',
    description: 'Production',
  }
]
```

## 🔗 Liens utiles

- **Swagger UI** : http://localhost:5000/api-docs
- **JSON Swagger** : http://localhost:5000/api-docs.json (si configuré)
- **Health Check** : http://localhost:5000/api/v1/health

## 📚 Ressources

- [OpenAPI Specification](https://swagger.io/specification/)
- [Swagger UI](https://swagger.io/tools/swagger-ui/)
- [swagger-jsdoc](https://github.com/Surnet/swagger-jsdoc)

---

**Documentation générée automatiquement par Swagger UI**  
**Version API : 1.0.0**
