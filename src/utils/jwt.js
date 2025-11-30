const jwt = require('jsonwebtoken');
const config = require('../config');

// Générer un JWT token
exports.generateToken = (userId) => {
  return jwt.sign({ id: userId }, config.jwt.secret, {
    expiresIn: config.jwt.expire,
  });
};

// Envoyer une réponse avec token
exports.sendTokenResponse = (user, statusCode, res) => {
  const token = exports.generateToken(user._id);
  
  // Retirer le mot de passe de la réponse
  const userResponse = {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    avatar: user.avatar,
  };
  
  res.status(statusCode).json({
    user: userResponse,
    token,
  });
};
