const express = require('express');
const { body } = require('express-validator');
const { validate } = require('../middlewares/validator');
const {
  getProfile,
  updateProfile,
  updatePassword,
  uploadAvatar: uploadAvatarController,
  deleteAvatar,
  getFavorites,
  addToFavorites,
  removeFromFavorites,
} = require('../controllers/userController');
const { protect } = require('../middlewares/auth');
const { uploadAvatar: avatarUploadMiddleware, uploadEventImage } = require('../utils/upload');

const router = express.Router();

// Toutes les routes nécessitent une authentification
router.use(protect);

// Validation rules
const updateProfileValidation = [
  body('name').optional().trim().notEmpty().withMessage('Le nom ne peut pas être vide'),
  body('phone').optional().matches(/^\+221[0-9]{9}$/).withMessage('Format téléphone invalide'),
  body('birthdate').optional().isISO8601().withMessage('Date invalide'),
];

const updatePasswordValidation = [
  body('currentPassword').notEmpty().withMessage('Le mot de passe actuel est requis'),
  body('newPassword').isLength({ min: 6 }).withMessage('Le nouveau mot de passe doit contenir au moins 6 caractères'),
];

// Routes
/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Récupérer le profil de l'utilisateur connecté
 *     tags: [Utilisateurs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profil utilisateur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get('/profile', getProfile);

/**
 * @swagger
 * /users/profile:
 *   put:
 *     summary: Mettre à jour le profil
 *     tags: [Utilisateurs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *               location:
 *                 type: string
 *               birthdate:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Profil mis à jour
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.put('/profile', updateProfileValidation, validate, updateProfile);

/**
 * @swagger
 * /users/password:
 *   put:
 *     summary: Changer le mot de passe
 *     tags: [Utilisateurs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 format: password
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *     responses:
 *       200:
 *         description: Mot de passe changé
 *       401:
 *         description: Mot de passe actuel incorrect
 */
router.put('/password', updatePasswordValidation, validate, updatePassword);

/**
 * @swagger
 * /users/avatar:
 *   post:
 *     summary: Upload avatar
 *     tags: [Utilisateurs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 description: Image de l'avatar (jpeg, jpg, png, gif, webp - max 5MB)
 *     responses:
 *       200:
 *         description: Avatar uploadé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 avatar:
 *                   type: string
 *                   description: Chemin de l'avatar
 *       400:
 *         description: Fichier manquant ou type invalide
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.post('/avatar', avatarUploadMiddleware.single('avatar'), uploadAvatarController);

/**
 * @swagger
 * /users/avatar:
 *   delete:
 *     summary: Supprimer l'avatar
 *     tags: [Utilisateurs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Avatar supprimé
 *       404:
 *         description: Aucun avatar à supprimer
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.delete('/avatar', deleteAvatar);

/**
 * @swagger
 * /users/favorites:
 *   get:
 *     summary: Liste des événements favoris
 *     tags: [Utilisateurs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des favoris
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 */
router.get('/favorites', getFavorites);

/**
 * @swagger
 * /users/favorites/{eventId}:
 *   post:
 *     summary: Ajouter un événement aux favoris
 *     tags: [Utilisateurs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Événement ajouté aux favoris
 *       400:
 *         description: Événement déjà dans les favoris
 */
router.post('/favorites/:eventId', addToFavorites);

/**
 * @swagger
 * /users/favorites/{eventId}:
 *   delete:
 *     summary: Retirer un événement des favoris
 *     tags: [Utilisateurs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Événement retiré des favoris
 */
router.delete('/favorites/:eventId', removeFromFavorites);

module.exports = router;
