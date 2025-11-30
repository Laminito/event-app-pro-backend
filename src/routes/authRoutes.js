const express = require('express');
const { body } = require('express-validator');
const { validate } = require('../middlewares/validator');
const {
  register,
  login,
  forgotPassword,
  resetPassword,
  refreshToken,
  logout,
} = require('../controllers/authController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

// Validation rules
const registerValidation = [
  body('name').trim().notEmpty().withMessage('Le nom est requis'),
  body('email').isEmail().withMessage('Email invalide'),
  body('password').isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères'),
  body('phone').matches(/^\+221[0-9]{9}$/).withMessage('Format téléphone invalide (ex: +221771234567)'),
];

const loginValidation = [
  body('email').isEmail().withMessage('Email invalide'),
  body('password').notEmpty().withMessage('Le mot de passe est requis'),
];

const forgotPasswordValidation = [
  body('email').isEmail().withMessage('Email invalide'),
];

const resetPasswordValidation = [
  body('token').notEmpty().withMessage('Token requis'),
  body('password').isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères'),
];

// Routes
router.post('/register', registerValidation, validate, register);
router.post('/login', loginValidation, validate, login);
router.post('/forgot-password', forgotPasswordValidation, validate, forgotPassword);
router.post('/reset-password', resetPasswordValidation, validate, resetPassword);
router.post('/refresh', protect, refreshToken);
router.post('/logout', protect, logout);

module.exports = router;
