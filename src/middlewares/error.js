// Middleware de gestion des erreurs global
exports.errorHandler = (err, req, res, next) => {
  console.error('❌ Error:', err);
  
  // Erreur Mongoose - Validation
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => ({
      field: e.path,
      message: e.message,
    }));
    
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Erreur de validation',
        details: errors,
      },
    });
  }
  
  // Erreur Mongoose - CastError (ID invalide)
  if (err.name === 'CastError') {
    return res.status(400).json({
      error: {
        code: 'INVALID_ID',
        message: 'ID invalide',
        details: {
          field: err.path,
          value: err.value,
        },
      },
    });
  }
  
  // Erreur Mongoose - Duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(400).json({
      error: {
        code: 'DUPLICATE_ERROR',
        message: `Ce ${field} existe déjà`,
        details: {
          field: field,
        },
      },
    });
  }
  
  // Erreur JWT
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: {
        code: 'INVALID_TOKEN',
        message: 'Token invalide',
      },
    });
  }
  
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: {
        code: 'TOKEN_EXPIRED',
        message: 'Token expiré',
      },
    });
  }
  
  // Erreur par défaut
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Erreur serveur';
  
  res.status(statusCode).json({
    error: {
      code: err.code || 'SERVER_ERROR',
      message: message,
    },
  });
};

// Middleware pour les routes non trouvées
exports.notFound = (req, res, next) => {
  res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.originalUrl} non trouvée`,
    },
  });
};
