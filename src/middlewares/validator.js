const { validationResult } = require('express-validator');

// Middleware de validation
exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Erreur de validation',
        details: errors.array().map(err => ({
          field: err.path,
          message: err.msg,
          value: err.value,
        })),
      },
    });
  }
  
  next();
};
