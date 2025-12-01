# API Endpoints - Event App Pro

Ce document liste tous les endpoints API nécessaires pour le backend de Event App Pro.

## Base URL
```
https://api.eventapppro.sn/v1
```

---

## 🔐 Authentification

### POST /auth/register
Inscription d'un nouvel utilisateur
```json
Request:
{
  "name": "Amadou Diallo",
  "email": "amadou@example.com",
  "password": "password123",
  "phone": "+221771234567"
}

Response:
{
  "user": {
    "id": "uuid",
    "name": "Amadou Diallo",
    "email": "amadou@example.com",
    "role": "user"
  },
  "token": "jwt_token"
}
```

### POST /auth/login
Connexion utilisateur
```json
Request:
{
  "email": "amadou@example.com",
  "password": "password123"
}

Response:
{
  "user": { ... },
  "token": "jwt_token"
}
```

### POST /auth/logout
Déconnexion utilisateur

### POST /auth/refresh
Rafraîchir le token JWT

### POST /auth/forgot-password
Demande de réinitialisation de mot de passe
```json
Request:
{
  "email": "amadou@example.com"
}
```

### POST /auth/reset-password
Réinitialiser le mot de passe
```json
Request:
{
  "token": "reset_token",
  "password": "new_password"
}
```

---

## 👤 Utilisateurs

### GET /users/profile
Récupérer le profil de l'utilisateur connecté

### PUT /users/profile
Mettre à jour le profil
```json
Request:
{
  "name": "Amadou Diallo",
  "phone": "+221771234567",
  "location": "Dakar, Sénégal",
  "birthdate": "1990-05-15"
}
```

### PUT /users/avatar
Uploader une photo de profil (multipart/form-data)

### PUT /users/password
Changer le mot de passe
```json
Request:
{
  "currentPassword": "old_password",
  "newPassword": "new_password"
}
```

### GET /users/favorites
Liste des événements favoris

### POST /users/favorites/:eventId
Ajouter un événement aux favoris

### DELETE /users/favorites/:eventId
Retirer un événement des favoris

---

## 🎟️ Événements (Public)

### GET /events
Liste tous les événements avec filtres et pagination
```
Query params:
- page: number (default: 1)
- limit: number (default: 10)
- category: string (Concert, Conférence, Sport, etc.)
- search: string
- location: string
- startDate: date
- endDate: date
- minPrice: number
- maxPrice: number
- featured: boolean
- sort: string (date, price, popularity)

Response:
{
  "events": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

### GET /events/:id
Détails d'un événement
```json
Response:
{
  "id": "uuid",
  "title": "Concert Youssou N'Dour",
  "description": "...",
  "category": "Concert",
  "date": "2025-12-31T20:00:00Z",
  "time": "20:00",
  "location": "Grand Théâtre National, Dakar",
  "image": "url",
  "organizer": {
    "id": "uuid",
    "name": "Youssou N'Dour",
    "email": "contact@youssou.sn"
  },
  "tickets": [
    {
      "type": "Standard",
      "price": 15000,
      "available": 450,
      "description": "..."
    },
    {
      "type": "VIP",
      "price": 50000,
      "available": 48,
      "description": "..."
    }
  ],
  "capacity": 500,
  "sold": 52,
  "featured": true,
  "tags": ["Musique", "Mbalax"],
  "createdAt": "2025-11-01T10:00:00Z",
  "updatedAt": "2025-11-30T15:00:00Z"
}
```

### GET /events/featured
Liste des événements populaires/mis en avant

### GET /events/categories
Liste des catégories disponibles
```json
Response:
{
  "categories": [
    "Concert",
    "Conférence",
    "Sport",
    "Festival",
    "Théâtre",
    "Formation",
    "Networking"
  ]
}
```

### GET /events/search/suggestions
Suggestions de recherche autocomplete
```
Query: ?q=concert
```

---

## 🎫 Billets

### POST /tickets/reserve
Réserver des billets (ajouter au panier)
```json
Request:
{
  "eventId": "uuid",
  "tickets": [
    { "type": "Standard", "quantity": 2 },
    { "type": "VIP", "quantity": 1 }
  ]
}

Response:
{
  "reservation": {
    "id": "uuid",
    "expiresAt": "2025-11-30T15:15:00Z",
    "total": 80000
  }
}
```

### POST /tickets/purchase
Acheter des billets
```json
Request:
{
  "reservationId": "uuid",
  "paymentMethod": "wave",
  "customerInfo": {
    "name": "Amadou Diallo",
    "email": "amadou@example.com",
    "phone": "+221771234567"
  }
}

Response:
{
  "order": {
    "id": "uuid",
    "orderNumber": "ORD-20251130-001",
    "tickets": [...],
    "total": 80000,
    "status": "pending",
    "paymentUrl": "https://payment.wave.sn/..."
  }
}
```

### GET /tickets/my-tickets
Liste des billets de l'utilisateur
```
Query params:
- status: string (upcoming, past, cancelled)
```

### GET /tickets/:ticketId
Détails d'un billet avec QR code
```json
Response:
{
  "id": "uuid",
  "orderNumber": "ORD-20251130-001",
  "event": { ... },
  "type": "VIP",
  "qrCode": "base64_or_url",
  "status": "valid",
  "purchaseDate": "2025-11-30T14:30:00Z",
  "price": 50000
}
```

### GET /tickets/:ticketId/qr
Générer le QR code du billet

### POST /tickets/:ticketId/validate
Valider un billet (scan QR code) - Organisateur uniquement
```json
Response:
{
  "valid": true,
  "ticket": { ... },
  "message": "Billet validé avec succès"
}
```

---

## 💳 Paiements

### POST /payments/initiate
Initialiser un paiement
```json
Request:
{
  "orderId": "uuid",
  "method": "wave" | "orange_money" | "free_money",
  "phone": "+221771234567"
}

Response:
{
  "paymentId": "uuid",
  "paymentUrl": "https://...",
  "status": "pending"
}
```

### GET /payments/:paymentId/status
Vérifier le statut d'un paiement

### POST /payments/webhook
Webhook pour les notifications de paiement (Wave, Orange Money, etc.)

### GET /payments/history
Historique des paiements de l'utilisateur

---

## 📋 Commandes

### GET /orders
Liste des commandes de l'utilisateur
```
Query params:
- page: number
- limit: number
- status: string (pending, completed, cancelled, refunded)
```

### GET /orders/:orderId
Détails d'une commande
```json
Response:
{
  "id": "uuid",
  "orderNumber": "ORD-20251130-001",
  "event": { ... },
  "tickets": [
    {
      "id": "uuid",
      "type": "VIP",
      "quantity": 1,
      "price": 50000
    }
  ],
  "total": 80000,
  "status": "completed",
  "paymentMethod": "wave",
  "createdAt": "2025-11-30T14:30:00Z"
}
```

### POST /orders/:orderId/cancel
Annuler une commande (selon politique de remboursement)

### GET /orders/:orderId/invoice
Télécharger la facture (PDF)

---

## 👨‍💼 Organisateur - Événements

### POST /organizer/events
Créer un nouvel événement
```json
Request:
{
  "title": "Concert Youssou N'Dour",
  "description": "...",
  "category": "Concert",
  "date": "2025-12-31",
  "time": "20:00",
  "location": "Grand Théâtre National, Dakar",
  "image": "url",
  "capacity": 500,
  "tickets": [
    {
      "type": "Standard",
      "price": 15000,
      "quantity": 450,
      "description": "..."
    },
    {
      "type": "VIP",
      "price": 50000,
      "quantity": 50,
      "description": "..."
    }
  ],
  "tags": ["Musique", "Mbalax"]
}
```

### GET /organizer/events
Liste des événements de l'organisateur

### GET /organizer/events/:id
Détails d'un événement (vue organisateur)

### PUT /organizer/events/:id
Mettre à jour un événement

### DELETE /organizer/events/:id
Supprimer un événement

### POST /organizer/events/:id/publish
Publier un événement (rendre visible)

### POST /organizer/events/:id/unpublish
Dépublier un événement

### POST /organizer/events/upload-image
Upload d'image pour un événement (multipart/form-data)

---

## 👨‍💼 Organisateur - Billets

### GET /organizer/tickets
Liste de tous les billets vendus par l'organisateur
```
Query params:
- eventId: uuid
- status: string (valid, used, cancelled)
- page: number
- limit: number
```

### GET /organizer/events/:eventId/tickets
Billets pour un événement spécifique

### POST /organizer/tickets/scan
Scanner un QR code
```json
Request:
{
  "qrCode": "string"
}

Response:
{
  "valid": true,
  "ticket": {
    "id": "uuid",
    "event": { ... },
    "customer": { ... },
    "type": "VIP",
    "status": "valid"
  }
}
```

### PUT /organizer/tickets/:ticketId/cancel
Annuler un billet

---

## 👨‍💼 Organisateur - Statistiques

### GET /organizer/dashboard/stats
Statistiques du dashboard
```json
Response:
{
  "totalRevenue": 15420000,
  "totalEvents": 24,
  "totalTickets": 1456,
  "activeEvents": 8,
  "revenueGrowth": 12.5,
  "ticketsSold": {
    "thisMonth": 340,
    "lastMonth": 290
  }
}
```

### GET /organizer/analytics/sales
Données de ventes pour graphiques
```
Query params:
- period: string (day, week, month, year)
- startDate: date
- endDate: date

Response:
{
  "labels": ["Jan", "Feb", "Mar", ...],
  "data": [45000, 78000, 52000, ...]
}
```

### GET /organizer/analytics/events/:eventId
Analytiques détaillées pour un événement
```json
Response:
{
  "event": { ... },
  "sales": {
    "total": 2500000,
    "ticketsSold": 156,
    "ticketsRemaining": 344
  },
  "demographics": {
    "ageGroups": [...],
    "locations": [...]
  },
  "salesByDay": [...]
}
```

### GET /organizer/analytics/revenue
Analyse des revenus
```
Query params:
- period: string (week, month, quarter, year)
```

---

## 📝 Blog

### GET /blog/posts
Liste des articles de blog
```
Query params:
- page: number
- limit: number
- category: string
```

### GET /blog/posts/:id
Détails d'un article

### GET /blog/categories
Liste des catégories de blog

### POST /blog/posts/:id/like
Liker un article

---

## 🔔 Notifications

### GET /notifications
Liste des notifications de l'utilisateur
```
Query params:
- unread: boolean
- page: number
- limit: number
```

### PUT /notifications/:id/read
Marquer une notification comme lue

### PUT /notifications/read-all
Marquer toutes les notifications comme lues

### DELETE /notifications/:id
Supprimer une notification

---

## ⚙️ Paramètres

### GET /settings
Récupérer les paramètres de l'utilisateur
```json
Response:
{
  "notifications": {
    "email": true,
    "push": true,
    "sms": false,
    "marketing": false
  },
  "language": "fr",
  "currency": "XOF",
  "timezone": "Africa/Dakar"
}
```

### PUT /settings
Mettre à jour les paramètres

### PUT /settings/notifications
Mettre à jour les préférences de notifications

---

## 📊 Autres Endpoints

### GET /health
Health check de l'API

### GET /locations/cities
Liste des villes disponibles

### GET /locations/venues
Liste des lieux/salles d'événements

### POST /contact
Formulaire de contact
```json
Request:
{
  "name": "Amadou Diallo",
  "email": "amadou@example.com",
  "subject": "Question",
  "message": "..."
}
```

### GET /faqs
Questions fréquentes

---

## 📌 Notes Importantes

### Headers requis
```
Authorization: Bearer {token}
Content-Type: application/json
Accept: application/json
X-API-Key: {api_key} (optionnel)
```

### Codes de statut HTTP
- `200` - Succès
- `201` - Créé
- `400` - Mauvaise requête
- `401` - Non authentifié
- `403` - Non autorisé
- `404` - Non trouvé
- `422` - Erreur de validation
- `429` - Trop de requêtes
- `500` - Erreur serveur

### Format d'erreur
```json
{
  "error": {
    "code": "INVALID_REQUEST",
    "message": "Le champ email est requis",
    "details": {
      "field": "email",
      "value": null
    }
  }
}
```

### Pagination
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### Rate Limiting
- **Utilisateurs authentifiés**: 1000 requêtes/heure
- **Utilisateurs non authentifiés**: 100 requêtes/heure

### Webhooks disponibles
- `payment.completed`
- `payment.failed`
- `ticket.purchased`
- `event.published`
- `order.cancelled`
