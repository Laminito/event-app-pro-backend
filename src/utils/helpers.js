// Fonction pour la pagination
exports.paginate = (page = 1, limit = 10) => {
  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  
  const skip = (pageNum - 1) * limitNum;
  
  return {
    skip,
    limit: limitNum,
    page: pageNum,
  };
};

// Créer une réponse paginée
exports.paginatedResponse = (data, page, limit, total) => {
  const totalPages = Math.ceil(total / limit);
  
  return {
    data,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
};

// Fonction pour filtrer les champs
exports.filterFields = (obj, allowedFields) => {
  const filtered = {};
  Object.keys(obj).forEach(key => {
    if (allowedFields.includes(key)) {
      filtered[key] = obj[key];
    }
  });
  return filtered;
};

// Fonction pour nettoyer les objets
exports.cleanObject = (obj) => {
  const cleaned = {};
  Object.keys(obj).forEach(key => {
    if (obj[key] !== null && obj[key] !== undefined && obj[key] !== '') {
      cleaned[key] = obj[key];
    }
  });
  return cleaned;
};

// Générer un numéro aléatoire
exports.generateRandomNumber = (length = 6) => {
  return Math.floor(Math.random() * Math.pow(10, length))
    .toString()
    .padStart(length, '0');
};

// Formater le prix en FCFA
exports.formatPrice = (price) => {
  return new Intl.NumberFormat('fr-SN', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0,
  }).format(price);
};

// Calculer le total
exports.calculateTotal = (items) => {
  return items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
};
