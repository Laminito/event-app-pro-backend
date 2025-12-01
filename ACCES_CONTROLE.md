# 🔐 Contrôle d'Accès par Rôle (RBAC)

## Rôles disponibles

- **user** - Utilisateur standard
- **organizer** - Organisateur d'événements
- **admin** - Administrateur système

## Middlewares de sécurité

### 1. `protect`
Vérifie que l'utilisateur est authentifié (a un token JWT valide)

### 2. `authorize(...roles)`
Vérifie que l'utilisateur a le bon rôle pour accéder à la ressource

### 3. `optionalAuth`
L'authentification est optionnelle (route publique mais peut avoir un utilisateur connecté)

---

## 📊 Matrice des Accès par Endpoint

### 🔓 ENDPOINTS PUBLICS (Aucune authentification requise)

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/api/v1/health` | GET | Health check |
| `/api/v1/auth/register` | POST | Inscription |
| `/api/v1/auth/login` | POST | Connexion |
| `/api/v1/auth/forgot-password` | POST | Mot de passe oublié |
| `/api/v1/auth/reset-password/:token` | POST | Réinitialiser mot de passe |
| `/api/v1/events` | GET | Liste des événements |
| `/api/v1/events/:id` | GET | Détails d'un événement |
| `/api/v1/events/featured` | GET | Événements à la une |
| `/api/v1/events/categories` | GET | Liste des catégories |
| `/api/v1/events/search/suggestions` | GET | Suggestions de recherche |

---

### 🔒 ENDPOINTS AUTHENTIFIÉS (Tous les utilisateurs connectés)

| Endpoint | Méthode | Description | Rôles autorisés |
|----------|---------|-------------|-----------------|
| `/api/v1/auth/refresh-token` | POST | Rafraîchir le token | Tous |
| `/api/v1/auth/logout` | POST | Déconnexion | Tous |
| `/api/v1/users/profile` | GET | Mon profil | Tous |
| `/api/v1/users/profile` | PUT | Modifier mon profil | Tous |
| `/api/v1/tickets/reserve` | POST | Réserver un ticket | Tous |
| `/api/v1/tickets/purchase` | POST | Acheter un ticket | Tous |
| `/api/v1/tickets/my-tickets` | GET | Mes tickets | Tous |
| `/api/v1/tickets/:ticketId` | GET | Détails d'un ticket | Tous (propriétaire) |
| `/api/v1/tickets/:ticketId/transfer` | POST | Transférer un ticket | Tous (propriétaire) |
| `/api/v1/tickets/:ticketId/cancel` | POST | Annuler un ticket | Tous (propriétaire) |

---

### 👨‍💼 ENDPOINTS ORGANISATEUR (organizer + admin)

| Endpoint | Méthode | Description | Rôles autorisés |
|----------|---------|-------------|-----------------|
| `/api/v1/events` | POST | Créer un événement | organizer, admin |
| `/api/v1/events/:id` | PUT | Modifier un événement | organizer (propriétaire), admin |
| `/api/v1/events/:id/stats` | GET | Statistiques d'un événement | organizer (propriétaire), admin |
| `/api/v1/tickets/:ticketId/validate` | POST | Valider un ticket | organizer (événement), admin |
| `/api/v1/organizer/*` | ALL | Toutes les routes organisateur | organizer, admin |
| `/api/v1/organizer/events` | GET | Mes événements | organizer, admin |
| `/api/v1/organizer/events/:id/orders` | GET | Commandes de mon événement | organizer, admin |
| `/api/v1/organizer/events/:id/attendees` | GET | Participants de mon événement | organizer, admin |
| `/api/v1/organizer/dashboard` | GET | Tableau de bord | organizer, admin |
| `/api/v1/organizer/stats` | GET | Statistiques globales | organizer, admin |

---

### 👑 ENDPOINTS ADMIN UNIQUEMENT (admin only)

| Endpoint | Méthode | Description | Rôles autorisés |
|----------|---------|-------------|-----------------|
| `/api/v1/events/:id` | DELETE | Supprimer un événement | admin |
| `/api/v1/users` | GET | Liste tous les utilisateurs | admin |
| `/api/v1/users/:id` | GET | Profil d'un utilisateur | admin |
| `/api/v1/users/:id/role` | PUT | Changer le rôle d'un utilisateur | admin |
| `/api/v1/users/:id` | DELETE | Supprimer un utilisateur | admin |

---

## 🔑 Exemples d'utilisation dans les routes

### Route publique
```javascript
router.get('/events', getEvents);
// Aucun middleware = accès public
```

### Route authentifiée (tous les utilisateurs)
```javascript
router.get('/profile', protect, getProfile);
// protect = nécessite d'être connecté
```

### Route organisateur
```javascript
router.post('/events', protect, authorize('organizer', 'admin'), createEvent);
// protect = connecté
// authorize = rôle organizer OU admin
```

### Route admin uniquement
```javascript
router.delete('/events/:id', protect, authorize('admin'), deleteEvent);
// protect = connecté
// authorize = rôle admin UNIQUEMENT
```

---

## 🛡️ Vérifications supplémentaires

### Propriété de ressource

Certaines routes vérifient également la propriété de la ressource :

**Exemple : Modifier un événement**
```javascript
// Dans eventController.js
const event = await Event.findById(req.params.id);

// Vérifier que l'utilisateur est le propriétaire OU admin
if (event.organizer.toString() !== req.user.id && req.user.role !== 'admin') {
  return res.status(403).json({
    error: {
      code: 'FORBIDDEN',
      message: 'Vous n\'êtes pas autorisé à modifier cet événement'
    }
  });
}
```

**Exemple : Voir mes tickets**
```javascript
// Seul le propriétaire du ticket peut le voir
const ticket = await Ticket.findById(req.params.id);

if (ticket.user.toString() !== req.user.id && req.user.role !== 'admin') {
  return res.status(403).json({
    error: {
      code: 'FORBIDDEN',
      message: 'Accès refusé'
    }
  });
}
```

---

## 📝 Format de réponse d'erreur

### 401 Unauthorized (non authentifié)
```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Non autorisé - Token manquant"
  }
}
```

### 403 Forbidden (mauvais rôle)
```json
{
  "error": {
    "code": "FORBIDDEN",
    "message": "Accès refusé - Rôle user non autorisé"
  }
}
```

---

## 🔐 Utilisation du token JWT

### 1. Obtenir un token
```bash
POST /api/v1/auth/login
{
  "email": "admin@eventapp.sn",
  "password": "password123"
}
```

Réponse :
```json
{
  "status": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "...",
      "name": "Admin User",
      "email": "admin@eventapp.sn",
      "role": "admin"
    }
  }
}
```

### 2. Utiliser le token
Ajouter le header Authorization à chaque requête :
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🧪 Test des accès avec Swagger

Dans Swagger UI (http://localhost:5000/api-docs) :

1. **Cliquez sur "Authorize"** en haut à droite
2. **Entrez** : `Bearer votre_token_ici`
3. **Cliquez sur "Authorize"**
4. Tous les endpoints protégés seront maintenant accessibles

---

## 🎯 Résumé par rôle

### 👤 USER (Utilisateur)
✅ Consulter les événements  
✅ Acheter des tickets  
✅ Voir ses propres tickets  
✅ Gérer son profil  
❌ Créer des événements  
❌ Voir les statistiques  
❌ Gérer d'autres utilisateurs  

### 👨‍💼 ORGANIZER (Organisateur)
✅ Tout ce que fait USER  
✅ Créer et gérer ses événements  
✅ Voir les statistiques de ses événements  
✅ Valider les tickets de ses événements  
✅ Dashboard organisateur  
❌ Modifier les événements des autres  
❌ Gérer les utilisateurs  

### 👑 ADMIN (Administrateur)
✅ Tout ce que font USER et ORGANIZER  
✅ Supprimer n'importe quel événement  
✅ Gérer tous les utilisateurs  
✅ Changer les rôles des utilisateurs  
✅ Accès complet à toutes les données  

---

**✅ Le système de contrôle d'accès est complet et sécurisé !**
