const User = require('../models/User');
const Event = require('../models/Event');
const AppError = require('../utils/AppError');
const path = require('path');
const fs = require('fs').promises;

// @desc    Obtenir le profil utilisateur
// @route   GET /api/v1/users/profile
// @access  Private
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('favorites', 'title date location image');
    
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

// @desc    Mettre à jour le profil
// @route   PUT /api/v1/users/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, phone, location, birthdate } = req.body;
    
    const fieldsToUpdate = {};
    if (name) fieldsToUpdate.name = name;
    if (phone) fieldsToUpdate.phone = phone;
    if (location) fieldsToUpdate.location = location;
    if (birthdate) fieldsToUpdate.birthdate = birthdate;
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      fieldsToUpdate,
      { new: true, runValidators: true }
    );
    
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

// @desc    Changer le mot de passe
// @route   PUT /api/v1/users/password
// @access  Private
exports.updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      throw new AppError('Veuillez fournir le mot de passe actuel et le nouveau', 400, 'MISSING_PASSWORDS');
    }
    
    if (newPassword.length < 6) {
      throw new AppError('Le nouveau mot de passe doit contenir au moins 6 caractères', 400, 'PASSWORD_TOO_SHORT');
    }
    
    const user = await User.findById(req.user._id).select('+password');
    
    // Vérifier le mot de passe actuel
    const isValid = await user.matchPassword(currentPassword);
    
    if (!isValid) {
      throw new AppError('Mot de passe actuel incorrect', 401, 'INVALID_PASSWORD');
    }
    
    // Mettre à jour le mot de passe
    user.password = newPassword;
    await user.save();
    
    res.status(200).json({
      message: 'Mot de passe mis à jour avec succès',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload avatar
// @route   POST /api/v1/users/avatar
// @access  Private
exports.uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new AppError('Veuillez fournir une image', 400, 'NO_FILE');
    }

    const user = await User.findById(req.user._id);

    // Supprimer l'ancien avatar si existe
    if (user.avatar) {
      const oldAvatarPath = path.join(__dirname, '../../', user.avatar);
      try {
        await fs.unlink(oldAvatarPath);
      } catch (err) {
        console.error('Erreur suppression ancien avatar:', err);
      }
    }

    // Mettre à jour avec le nouveau chemin
    const avatarPath = `/uploads/avatars/${req.file.filename}`;
    user.avatar = avatarPath;
    await user.save();

    res.status(200).json({
      message: 'Avatar mis à jour avec succès',
      avatar: avatarPath
    });
  } catch (error) {
    // Supprimer le fichier uploadé en cas d'erreur
    if (req.file) {
      const filePath = path.join(__dirname, '../../uploads/avatars', req.file.filename);
      try {
        await fs.unlink(filePath);
      } catch (err) {
        console.error('Erreur suppression fichier:', err);
      }
    }
    next(error);
  }
};

// @desc    Supprimer avatar
// @route   DELETE /api/v1/users/avatar
// @access  Private
exports.deleteAvatar = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user.avatar) {
      throw new AppError('Aucun avatar à supprimer', 404, 'NO_AVATAR');
    }

    // Supprimer le fichier
    const avatarPath = path.join(__dirname, '../../', user.avatar);
    try {
      await fs.unlink(avatarPath);
    } catch (err) {
      console.error('Erreur suppression avatar:', err);
    }

    // Supprimer de la DB
    user.avatar = null;
    await user.save();

    res.status(200).json({
      message: 'Avatar supprimé avec succès'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtenir les favoris
// @route   GET /api/v1/users/favorites
// @access  Private
exports.getFavorites = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('favorites', 'title date location image category tickets sold');
    
    res.status(200).json(user.favorites);
  } catch (error) {
    next(error);
  }
};

// @desc    Ajouter aux favoris
// @route   POST /api/v1/users/favorites/:eventId
// @access  Private
exports.addToFavorites = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    
    // Vérifier que l'événement existe
    const event = await Event.findById(eventId);
    if (!event) {
      throw new AppError('Événement non trouvé', 404, 'EVENT_NOT_FOUND');
    }
    
    const user = await User.findById(req.user._id);
    
    // Vérifier si déjà dans les favoris
    if (user.favorites.includes(eventId)) {
      throw new AppError('Événement déjà dans les favoris', 400, 'ALREADY_FAVORITE');
    }
    
    user.favorites.push(eventId);
    await user.save();
    
    res.status(200).json({
      message: 'Événement ajouté aux favoris',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Retirer des favoris
// @route   DELETE /api/v1/users/favorites/:eventId
// @access  Private
exports.removeFromFavorites = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    
    const user = await User.findById(req.user._id);
    
    user.favorites = user.favorites.filter(id => id.toString() !== eventId);
    await user.save();
    
    res.status(200).json({
      message: 'Événement retiré des favoris',
    });
  } catch (error) {
    next(error);
  }
};
