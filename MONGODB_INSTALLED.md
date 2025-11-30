# ✅ MongoDB Installé et Configuré !

## 🎉 Statut actuel

✅ **MongoDB 8.2.2** installé et démarré  
✅ **Serveur backend** en cours d'exécution sur http://localhost:5000  
✅ **Base de données** initialisée avec 8 événements et 4 utilisateurs  
✅ **Swagger UI** accessible sur http://localhost:5000/api-docs  

---

## 🚀 Commandes utiles

### Démarrer MongoDB (si arrêté)
```powershell
mongod --dbpath C:\data\db
```

Ou en arrière-plan :
```powershell
Start-Process mongod -ArgumentList "--dbpath", "C:\data\db" -WindowStyle Hidden
```

### Démarrer le serveur backend
```powershell
npm run dev
```

### Réinitialiser la base de données
```powershell
npm run seed
```

### Arrêter MongoDB
```powershell
Get-Process mongod | Stop-Process -Force
```

### Arrêter le serveur Node
```powershell
Get-Process node | Stop-Process -Force
```

---

## 🔐 Comptes de test créés

| Email | Password | Rôle |
|-------|----------|------|
| admin@eventapp.sn | password123 | Admin |
| youssou@eventapp.sn | password123 | Organisateur |
| fatou@eventapp.sn | password123 | Organisateur |
| amadou@eventapp.sn | password123 | Utilisateur |

---

## 🌐 URLs importantes

- **API Base** : http://localhost:5000/api/v1
- **Health Check** : http://localhost:5000/api/v1/health
- **Swagger UI** : http://localhost:5000/api-docs
- **Liste événements** : http://localhost:5000/api/v1/events

---

## 🧪 Tester l'API avec Swagger

1. Ouvrez http://localhost:5000/api-docs
2. Cliquez sur "POST /api/v1/auth/login"
3. Cliquez sur "Try it out"
4. Entrez :
   ```json
   {
     "email": "admin@eventapp.sn",
     "password": "password123"
   }
   ```
5. Cliquez sur "Execute"
6. Copiez le token retourné
7. Cliquez sur "Authorize" en haut
8. Entrez : `Bearer votre_token`
9. Vous pouvez maintenant tester tous les endpoints protégés !

---

## 📊 Événements créés

1. **Festival Dakar Music** - Concert à Dakar (15 000 FCFA)
2. **Tech Summit Sénégal** - Conférence Tech (25 000 FCFA)
3. **Match ASC Diaraf vs Teungueth FC** - Sport (5 000 FCFA)
4. **Ciné sous les Étoiles Gorée** - Cinéma (3 000 FCFA)
5. **Théâtre Le Mandat** - Théâtre (8 000 FCFA)
6. **Formation Marketing Digital** - Formation (50 000 FCFA)
7. **Networking Evening Tech** - Networking (Gratuit)
8. **Saint Louis Jazz Festival** - Concert (20 000 FCFA)

---

## 🔧 Configuration MongoDB

**Emplacement de MongoDB** : `C:\Program Files\MongoDB\Server\8.2\bin\`  
**Données** : `C:\data\db\`  
**Port** : `27017` (défaut)  
**URI de connexion** : `mongodb://localhost:27017/eventapp`

MongoDB a été ajouté au PATH système, vous pouvez maintenant utiliser les commandes `mongod` et `mongosh` directement depuis n'importe quel terminal.

---

## 🎯 Prochaines étapes

1. ✅ MongoDB installé et configuré
2. ✅ Serveur backend fonctionnel
3. ✅ Base de données initialisée
4. ✅ Swagger UI accessible
5. 🔄 Tester les endpoints via Swagger
6. 🔄 Connecter le frontend React
7. 🔄 Configurer les paiements (Wave, Orange Money)
8. 🔄 Déployer sur Railway

---

## 🐛 En cas de problème

### MongoDB ne démarre pas
```powershell
# Vérifier si le dossier existe
Test-Path C:\data\db

# Créer le dossier si besoin
New-Item -ItemType Directory -Path "C:\data\db" -Force

# Redémarrer MongoDB
Start-Process mongod -ArgumentList "--dbpath", "C:\data\db" -WindowStyle Hidden
```

### Port 5000 déjà utilisé
Changez le port dans `.env` :
```env
PORT=5001
```

### MongoDB dans le PATH
Si `mongod` n'est pas reconnu après redémarrage du PC :
```powershell
$env:Path += ";C:\Program Files\MongoDB\Server\8.2\bin"
```

---

**Tout fonctionne ! 🎊 Vous pouvez maintenant développer votre application !**
