# 📡 Exemples de Requêtes API - Event App Pro

Collection de requêtes pour tester l'API avec Postman, Thunder Client ou curl.

## Configuration

**Base URL:** `http://localhost:5000/api/v1`

---

## 🔐 AUTHENTIFICATION

### 1. Inscription (Register)
```http
POST /auth/register
Content-Type: application/json

{
  "name": "Jean Dupont",
  "email": "jean@example.com",
  "password": "password123",
  "phone": "+221771234567"
}
```

**Réponse attendue:**
```json
{
  "user": {
    "id": "...",
    "name": "Jean Dupont",
    "email": "jean@example.com",
    "role": "user"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 2. Connexion (Login)
```http
POST /auth/login
Content-Type: application/json

{
  "email": "amadou@eventapp.sn",
  "password": "password123"
}
```

### 3. Mot de passe oublié
```http
POST /auth/forgot-password
Content-Type: application/json

{
  "email": "amadou@eventapp.sn"
}
```

### 4. Rafraîchir le token
```http
POST /auth/refresh
Authorization: Bearer {TOKEN}
```

---

## 🎟️ ÉVÉNEMENTS (Public)

### 5. Liste des événements
```http
GET /events?page=1&limit=10&category=Concert&featured=true
```

**Query params disponibles:**
- `page` - Numéro de page
- `limit` - Nombre d'éléments par page
- `category` - Filtrer par catégorie
- `search` - Recherche textuelle
- `location` - Filtrer par lieu
- `startDate` - Date de début
- `endDate` - Date de fin
- `minPrice` - Prix minimum
- `maxPrice` - Prix maximum
- `featured` - Événements mis en avant (true/false)
- `sort` - Tri (-createdAt, date, price)

### 6. Détails d'un événement
```http
GET /events/{eventId}
```

### 7. Événements mis en avant
```http
GET /events/featured
```

### 8. Catégories disponibles
```http
GET /events/categories
```

### 9. Suggestions de recherche
```http
GET /events/search/suggestions?q=concert
```

---

## 👤 UTILISATEUR (Authentifié)

**Note:** Toutes ces routes nécessitent le header:
```
Authorization: Bearer {TOKEN}
```

### 10. Mon profil
```http
GET /users/profile
Authorization: Bearer {TOKEN}
```

### 11. Mettre à jour le profil
```http
PUT /users/profile
Authorization: Bearer {TOKEN}
Content-Type: application/json

{
  "name": "Amadou Diallo Jr",
  "phone": "+221771234567",
  "location": "Dakar, Sénégal",
  "birthdate": "1990-05-15"
}
```

### 12. Changer le mot de passe
```http
PUT /users/password
Authorization: Bearer {TOKEN}
Content-Type: application/json

{
  "currentPassword": "password123",
  "newPassword": "newpassword456"
}
```

### 13. Mes favoris
```http
GET /users/favorites
Authorization: Bearer {TOKEN}
```

### 14. Ajouter aux favoris
```http
POST /users/favorites/{eventId}
Authorization: Bearer {TOKEN}
```

### 15. Retirer des favoris
```http
DELETE /users/favorites/{eventId}
Authorization: Bearer {TOKEN}
```

---

## 🎫 BILLETS (Authentifié)

### 16. Réserver des billets
```http
POST /tickets/reserve
Authorization: Bearer {TOKEN}
Content-Type: application/json

{
  "eventId": "675b1234567890abcdef1234",
  "tickets": [
    {
      "type": "Standard",
      "quantity": 2
    },
    {
      "type": "VIP",
      "quantity": 1
    }
  ]
}
```

### 17. Acheter des billets
```http
POST /tickets/purchase
Authorization: Bearer {TOKEN}
Content-Type: application/json

{
  "reservationId": "675b1234567890abcdef5678",
  "paymentMethod": "wave",
  "customerInfo": {
    "name": "Amadou Diallo",
    "email": "amadou@eventapp.sn",
    "phone": "+221771234567"
  }
}
```

**Méthodes de paiement disponibles:**
- `card` - Carte bancaire
- `wave` - Wave
- `orange_money` - Orange Money
- `free_money` - Free Money

### 18. Mes billets
```http
GET /tickets/my-tickets?status=valid
Authorization: Bearer {TOKEN}
```

**Status disponibles:**
- `valid` - Billets valides
- `used` - Billets utilisés
- `cancelled` - Billets annulés

### 19. Détails d'un billet
```http
GET /tickets/{ticketId}
Authorization: Bearer {TOKEN}
```

### 20. Valider un billet (Organisateur)
```http
POST /tickets/{ticketId}/validate
Authorization: Bearer {TOKEN_ORGANIZER}
```

---

## 👨‍💼 ORGANISATEUR (Rôle: organizer)

**Note:** Ces routes nécessitent un token avec le rôle `organizer` ou `admin`

### 21. Statistiques du dashboard
```http
GET /organizer/dashboard/stats
Authorization: Bearer {TOKEN_ORGANIZER}
```

### 22. Créer un événement
```http
POST /organizer/events
Authorization: Bearer {TOKEN_ORGANIZER}
Content-Type: application/json

{
  "title": "Concert Baaba Maal",
  "description": "Concert exceptionnel du célèbre artiste sénégalais",
  "category": "Concert",
  "date": "2026-02-14",
  "time": "20:00",
  "location": "Grand Théâtre National, Dakar",
  "image": "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae",
  "capacity": 1000,
  "tickets": [
    {
      "type": "Standard",
      "price": 20000,
      "quantity": 800,
      "description": "Place standard"
    },
    {
      "type": "VIP",
      "price": 50000,
      "quantity": 200,
      "description": "Accès VIP avec cocktail"
    }
  ],
  "tags": ["Musique", "Mbalax", "Concert"]
}
```

**Catégories valides:**
- `Concert`
- `Conférence`
- `Sport`
- `Festival`
- `Théâtre`
- `Formation`
- `Networking`
- `Autre`

### 23. Mes événements
```http
GET /organizer/events?page=1&limit=10
Authorization: Bearer {TOKEN_ORGANIZER}
```

### 24. Détails événement (organisateur)
```http
GET /organizer/events/{eventId}
Authorization: Bearer {TOKEN_ORGANIZER}
```

### 25. Modifier un événement
```http
PUT /organizer/events/{eventId}
Authorization: Bearer {TOKEN_ORGANIZER}
Content-Type: application/json

{
  "title": "Concert Baaba Maal - MODIFIÉ",
  "featured": true
}
```

### 26. Supprimer un événement
```http
DELETE /organizer/events/{eventId}
Authorization: Bearer {TOKEN_ORGANIZER}
```

### 27. Publier un événement
```http
POST /organizer/events/{eventId}/publish
Authorization: Bearer {TOKEN_ORGANIZER}
```

### 28. Dépublier un événement
```http
POST /organizer/events/{eventId}/unpublish
Authorization: Bearer {TOKEN_ORGANIZER}
```

### 29. Billets vendus
```http
GET /organizer/tickets?eventId={eventId}&status=valid&page=1&limit=20
Authorization: Bearer {TOKEN_ORGANIZER}
```

---

## 🧪 TESTS CURL (PowerShell)

### Health Check
```powershell
curl http://localhost:5000/api/v1/health
```

### Inscription
```powershell
curl -X POST http://localhost:5000/api/v1/auth/register `
  -H "Content-Type: application/json" `
  -d '{\"name\":\"Test User\",\"email\":\"test@test.com\",\"password\":\"password123\",\"phone\":\"+221771234567\"}'
```

### Connexion
```powershell
curl -X POST http://localhost:5000/api/v1/auth/login `
  -H "Content-Type: application/json" `
  -d '{\"email\":\"amadou@eventapp.sn\",\"password\":\"password123\"}'
```

### Liste événements
```powershell
curl http://localhost:5000/api/v1/events
```

### Avec authentification
```powershell
$token = "VOTRE_TOKEN_ICI"
curl http://localhost:5000/api/v1/users/profile `
  -H "Authorization: Bearer $token"
```

---

## 📝 CODES D'ERREUR

### Codes HTTP
- `200` - OK
- `201` - Créé
- `400` - Mauvaise requête
- `401` - Non authentifié
- `403` - Non autorisé (permissions)
- `404` - Non trouvé
- `422` - Erreur de validation
- `429` - Trop de requêtes (rate limit)
- `500` - Erreur serveur

### Format d'erreur
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Erreur de validation",
    "details": [
      {
        "field": "email",
        "message": "Email invalide",
        "value": "invalid-email"
      }
    ]
  }
}
```

### Codes d'erreur personnalisés
- `UNAUTHORIZED` - Non autorisé
- `FORBIDDEN` - Accès refusé
- `VALIDATION_ERROR` - Erreur de validation
- `INVALID_CREDENTIALS` - Identifiants invalides
- `USER_NOT_FOUND` - Utilisateur non trouvé
- `EVENT_NOT_FOUND` - Événement non trouvé
- `TICKET_NOT_FOUND` - Billet non trouvé
- `TICKETS_UNAVAILABLE` - Billets non disponibles
- `RESERVATION_EXPIRED` - Réservation expirée
- `DUPLICATE_ERROR` - Ressource déjà existante
- `RATE_LIMIT_EXCEEDED` - Limite de requêtes dépassée

---

## 🔄 Workflow complet: Acheter un billet

1. **Inscription/Connexion**
```http
POST /auth/login
{
  "email": "amadou@eventapp.sn",
  "password": "password123"
}
```
→ Récupérer le `token`

2. **Chercher un événement**
```http
GET /events?category=Concert&featured=true
```
→ Récupérer l'`eventId`

3. **Réserver des billets**
```http
POST /tickets/reserve
Authorization: Bearer {token}
{
  "eventId": "...",
  "tickets": [{"type": "VIP", "quantity": 2}]
}
```
→ Récupérer le `reservationId`

4. **Acheter les billets**
```http
POST /tickets/purchase
Authorization: Bearer {token}
{
  "reservationId": "...",
  "paymentMethod": "wave",
  "customerInfo": {...}
}
```
→ Recevoir les billets avec QR codes

5. **Voir mes billets**
```http
GET /tickets/my-tickets
Authorization: Bearer {token}
```

---

## 💡 Conseils

1. **Sauvegardez vos tokens** - Utilisez des variables d'environnement dans Postman
2. **Testez la pagination** - Ajoutez `?page=1&limit=5` aux requêtes de liste
3. **Vérifiez les erreurs** - Lisez le champ `error.message` pour debug
4. **Rate limiting** - Maximum 1000 req/h authentifié, 100 req/h non-authentifié

---

**Documentation complète:** Voir `API_ENDPOINTS.md`
