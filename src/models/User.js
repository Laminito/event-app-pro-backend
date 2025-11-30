const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Le nom est requis'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "L'email est requis"],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Email invalide'],
  },
  password: {
    type: String,
    required: [true, 'Le mot de passe est requis'],
    minlength: [6, 'Le mot de passe doit contenir au moins 6 caractères'],
    select: false,
  },
  phone: {
    type: String,
    required: [true, 'Le numéro de téléphone est requis'],
    match: [/^\+221[0-9]{9}$/, 'Format téléphone invalide (ex: +221771234567)'],
  },
  role: {
    type: String,
    enum: ['user', 'organizer', 'admin'],
    default: 'user',
  },
  avatar: {
    type: String,
    default: null,
  },
  location: {
    type: String,
    default: null,
  },
  birthdate: {
    type: Date,
    default: null,
  },
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
  }],
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  emailVerificationToken: String,
}, {
  timestamps: true,
});

// Hash password avant sauvegarde
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Méthode pour vérifier le mot de passe
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Méthode pour générer un token de réinitialisation
userSchema.methods.getResetPasswordToken = function() {
  const crypto = require('crypto');
  const resetToken = crypto.randomBytes(32).toString('hex');
  
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
    
  this.resetPasswordExpire = Date.now() + 30 * 60 * 1000; // 30 minutes
  
  return resetToken;
};

module.exports = mongoose.model('User', userSchema);
