const User = require('../models/User');
const Event = require('../models/Event');
const AppError = require('../utils/AppError');

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
