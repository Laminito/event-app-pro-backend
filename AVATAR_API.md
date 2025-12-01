# 📸 API Upload Avatar - Guide d'utilisation

## Endpoints disponibles

### 1. Upload d'avatar
```
POST /api/v1/users/avatar
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Body (form-data):**
- `avatar` (file): Image à uploader

**Formats acceptés:** jpeg, jpg, png, gif, webp  
**Taille max:** 5MB

**Réponse succès (200):**
```json
{
  "message": "Avatar mis à jour avec succès",
  "avatar": "/uploads/avatars/avatar-userid-timestamp.jpg"
}
```

---

### 2. Supprimer l'avatar
```
DELETE /api/v1/users/avatar
Authorization: Bearer {token}
```

**Réponse succès (200):**
```json
{
  "message": "Avatar supprimé avec succès"
}
```

---

### 3. Changer le mot de passe
```
PUT /api/v1/users/password
Authorization: Bearer {token}
Content-Type: application/json
```

**Body:**
```json
{
  "currentPassword": "password123",
  "newPassword": "newpassword456"
}
```

**Réponse succès (200):**
```json
{
  "message": "Mot de passe mis à jour avec succès"
}
```

---

## 🧪 Test avec cURL

### Upload avatar
```bash
# 1. D'abord se connecter pour obtenir le token
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@eventapp.sn\",\"password\":\"password123\"}"

# Copiez le token de la réponse

# 2. Upload avatar
curl -X POST http://localhost:5000/api/v1/users/avatar \
  -H "Authorization: Bearer VOTRE_TOKEN" \
  -F "avatar=@C:\chemin\vers\votre\image.jpg"
```

### Changer mot de passe
```bash
curl -X PUT http://localhost:5000/api/v1/users/password \
  -H "Authorization: Bearer VOTRE_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"currentPassword\":\"password123\",\"newPassword\":\"nouveaumotdepasse\"}"
```

### Supprimer avatar
```bash
curl -X DELETE http://localhost:5000/api/v1/users/avatar \
  -H "Authorization: Bearer VOTRE_TOKEN"
```

---

## 🧪 Test avec Postman

### Upload avatar

1. **Méthode:** POST
2. **URL:** `http://localhost:5000/api/v1/users/avatar`
3. **Headers:**
   - `Authorization: Bearer {votre_token}`
4. **Body:**
   - Sélectionnez `form-data`
   - Key: `avatar` (changez le type en "File")
   - Value: Sélectionnez votre image

5. **Cliquez sur Send**

### Voir l'avatar
Après upload, l'avatar sera accessible à :
```
http://localhost:5000/uploads/avatars/avatar-{userid}-{timestamp}.jpg
```

---

## 📋 Test avec Swagger UI

1. Ouvrez http://localhost:5000/api-docs
2. Cliquez sur **Authorize** en haut
3. Entrez: `Bearer votre_token`
4. Cherchez **POST /users/avatar**
5. Cliquez sur **Try it out**
6. Sélectionnez votre fichier image
7. Cliquez sur **Execute**

---

## ⚠️ Erreurs possibles

### 400 - NO_FILE
```json
{
  "error": {
    "code": "NO_FILE",
    "message": "Veuillez fournir une image"
  }
}
```
**Solution:** Vérifiez que le champ s'appelle bien `avatar` et qu'un fichier est sélectionné.

### 400 - INVALID_FILE_TYPE
```json
{
  "error": {
    "code": "INVALID_FILE_TYPE",
    "message": "Seules les images sont autorisées (jpeg, jpg, png, gif, webp)"
  }
}
```
**Solution:** Uploadez un fichier image valide.

### 413 - File too large
```json
{
  "error": {
    "message": "File too large"
  }
}
```
**Solution:** Réduisez la taille de l'image (max 5MB).

### 401 - UNAUTHORIZED
```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Non autorisé - Token manquant"
  }
}
```
**Solution:** Ajoutez le header Authorization avec un token valide.

---

## 📂 Structure des fichiers

```
EventAppBackend/
├── uploads/
│   └── avatars/
│       ├── avatar-userid1-1234567890.jpg
│       ├── avatar-userid2-1234567891.png
│       └── ...
```

Les fichiers sont automatiquement nommés:
```
avatar-{userId}-{timestamp}.{extension}
```

---

## 🔒 Sécurité

✅ **Authentification requise** - Seuls les utilisateurs connectés peuvent uploader  
✅ **Validation du type** - Seules les images sont acceptées  
✅ **Limite de taille** - Maximum 5MB par fichier  
✅ **Suppression automatique** - L'ancien avatar est supprimé lors d'un nouvel upload  
✅ **Noms uniques** - Évite les conflits de fichiers  

---

## 💡 Exemples d'intégration Frontend

### React/Next.js

```javascript
// Upload avatar
const uploadAvatar = async (file) => {
  const formData = new FormData();
  formData.append('avatar', file);

  const response = await fetch('http://localhost:5000/api/v1/users/avatar', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });

  const data = await response.json();
  return data.avatar; // "/uploads/avatars/avatar-xxx.jpg"
};

// Afficher l'avatar
<img src={`http://localhost:5000${user.avatar}`} alt="Avatar" />
```

### JavaScript Vanilla

```javascript
// HTML
<input type="file" id="avatarInput" accept="image/*">
<button onclick="uploadAvatar()">Upload</button>

// JavaScript
async function uploadAvatar() {
  const input = document.getElementById('avatarInput');
  const file = input.files[0];
  
  if (!file) return;
  
  const formData = new FormData();
  formData.append('avatar', file);
  
  const response = await fetch('http://localhost:5000/api/v1/users/avatar', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: formData
  });
  
  const result = await response.json();
  console.log('Avatar URL:', result.avatar);
}
```

---

## ✅ Checklist

- [x] Endpoint POST /users/avatar créé
- [x] Endpoint DELETE /users/avatar créé
- [x] Endpoint PUT /users/password amélioré
- [x] Middleware multer configuré
- [x] Validation des types de fichiers
- [x] Limite de taille (5MB)
- [x] Dossier uploads/avatars créé
- [x] Fichiers statiques servis par Express
- [x] Documentation Swagger ajoutée
- [x] Suppression automatique ancien avatar
- [x] Gestion d'erreurs complète

**✅ L'API d'upload d'avatar est prête !**
