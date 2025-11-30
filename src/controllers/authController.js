const User = require('../models/User');
const { sendTokenResponse } = require('../utils/jwt');
const { sendWelcomeEmail, sendPasswordResetEmail } = require('../utils/email');
const AppError = require('../utils/AppError');
const crypto = require('crypto');

// @desc    Inscription utilisateur
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;
    
    // Créer l'utilisateur
    const user = await User.create({
      name,
      email,
      password,
      phone,
    });
    
    // Envoyer email de bienvenue (async, ne bloque pas)
    sendWelcomeEmail(user).catch(err => console.error('Erreur email:', err));
    
    // Envoyer la réponse avec token
    sendTokenResponse(user, 201, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Connexion utilisateur
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    // Vérifier email et password
    if (!email || !password) {
      throw new AppError('Email et mot de passe requis', 400, 'MISSING_CREDENTIALS');
    }
    
    // Récupérer l'utilisateur avec le mot de passe
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      throw new AppError('Email ou mot de passe incorrect', 401, 'INVALID_CREDENTIALS');
    }
    
    // Vérifier le mot de passe
    const isPasswordValid = await user.matchPassword(password);
    
    if (!isPasswordValid) {
      throw new AppError('Email ou mot de passe incorrect', 401, 'INVALID_CREDENTIALS');
    }
    
    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Mot de passe oublié
// @route   POST /api/v1/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    
    const user = await User.findOne({ email });
    
    if (!user) {
      throw new AppError('Aucun utilisateur avec cet email', 404, 'USER_NOT_FOUND');
    }
    
    // Générer le token de réinitialisation
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });
    
    // Envoyer l'email
    await sendPasswordResetEmail(user, resetToken);
    
    res.status(200).json({
      message: 'Email de réinitialisation envoyé',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Réinitialiser le mot de passe
// @route   POST /api/v1/auth/reset-password
// @access  Public
exports.resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    
    // Hash du token
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');
    
    // Trouver l'utilisateur avec le token valide
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });
    
    if (!user) {
      throw new AppError('Token invalide ou expiré', 400, 'INVALID_TOKEN');
    }
    
    // Définir le nouveau mot de passe
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    
    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Rafraîchir le token
// @route   POST /api/v1/auth/refresh
// @access  Private
exports.refreshToken = async (req, res, next) => {
  try {
    sendTokenResponse(req.user, 200, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Déconnexion
// @route   POST /api/v1/auth/logout
// @access  Private
exports.logout = async (req, res, next) => {
  try {
    res.status(200).json({
      message: 'Déconnexion réussie',
    });
  } catch (error) {
    next(error);
  }
};
