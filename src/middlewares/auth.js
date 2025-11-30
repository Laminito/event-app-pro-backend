const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config');

// Protéger les routes (authentification requise)
exports.protect = async (req, res, next) => {
  try {
    let token;
    
    // Vérifier si le token est dans les headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
      return res.status(401).json({
        error: {
          code: 'UNAUTHORIZED',
          message: 'Non autorisé - Token manquant',
        },
      });
    }
    
    try {
      // Vérifier le token
      const decoded = jwt.verify(token, config.jwt.secret);
      
      // Récupérer l'utilisateur
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        return res.status(401).json({
          error: {
            code: 'UNAUTHORIZED',
            message: 'Utilisateur non trouvé',
          },
        });
      }
      
      next();
    } catch (error) {
      return res.status(401).json({
        error: {
          code: 'UNAUTHORIZED',
          message: 'Token invalide ou expiré',
        },
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: {
        code: 'SERVER_ERROR',
        message: 'Erreur serveur',
      },
    });
  }
};

// Autoriser uniquement certains rôles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: {
          code: 'FORBIDDEN',
          message: `Accès refusé - Rôle ${req.user.role} non autorisé`,
        },
      });
    }
    next();
  };
};

// Middleware optionnel (utilisateur peut être connecté ou non)
exports.optionalAuth = async (req, res, next) => {
  try {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    if (token) {
      try {
        const decoded = jwt.verify(token, config.jwt.secret);
        req.user = await User.findById(decoded.id).select('-password');
      } catch (error) {
        // Token invalide, mais on continue sans utilisateur
        req.user = null;
      }
    }
    
    next();
  } catch (error) {
    next();
  }
};
