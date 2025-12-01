const multer = require('multer');
const path = require('path');
const AppError = require('./AppError');

// Configuration du stockage pour avatars
const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/avatars');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${req.user.id}-${Date.now()}`;
    const ext = path.extname(file.originalname);
    cb(null, `avatar-${uniqueSuffix}${ext}`);
  }
});

// Configuration du stockage pour images d'événements
const eventImageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/events');
  },
  filename: (req, file, cb) => {
    // Générer un nom unique: event-timestamp.ext
    const uniqueSuffix = `${Date.now()}`;
    const ext = path.extname(file.originalname);
    cb(null, `event-${uniqueSuffix}${ext}`);
  }
});

// Filtrer les types de fichiers
const fileFilter = (req, file, cb) => {
  // Accepter seulement les images
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new AppError('Seules les images sont autorisées (jpeg, jpg, png, gif, webp)', 400, 'INVALID_FILE_TYPE'), false);
  }
};

// Configuration multer
const uploadAvatar = multer({
  storage: avatarStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
  },
  fileFilter: fileFilter
});

const uploadEventImage = multer({
  storage: eventImageStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
  },
  fileFilter: fileFilter
});

module.exports = {
  uploadAvatar,
  uploadEventImage
};
