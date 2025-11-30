const express = require('express');
const { body } = require('express-validator');
const { validate } = require('../middlewares/validator');
const {
  getProfile,
  updateProfile,
  updatePassword,
  getFavorites,
  addToFavorites,
  removeFromFavorites,
} = require('../controllers/userController');
const { protect } = require('../middlewares/auth');

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
router.get('/profile', getProfile);
router.put('/profile', updateProfileValidation, validate, updateProfile);
router.put('/password', updatePasswordValidation, validate, updatePassword);
router.get('/favorites', getFavorites);
router.post('/favorites/:eventId', addToFavorites);
router.delete('/favorites/:eventId', removeFromFavorites);

module.exports = router;
