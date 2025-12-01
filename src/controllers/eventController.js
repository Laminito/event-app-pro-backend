// @desc    Créer un nouvel événement
// @route   POST /api/v1/events
// @access  Private (organizer/admin)
exports.createEvent = async (req, res, next) => {
  try {
    const {
      title,
      description,
      category,
      date,
      time,
      location,
      image,
      organizer,
      tickets,
      capacity,
      featured,
      tags,
      published,
    } = req.body;

    // Validation minimale
    if (!title || !description || !category || !date || !time || !location || !organizer || !capacity) {
      return res.status(400).json({ error: 'Champs obligatoires manquants.' });
    }

    const event = await Event.create({
      title,
      description,
      category,
      date,
      time,
      location,
      image,
      organizer,
      tickets,
      capacity,
      featured,
      tags,
      published,
    });

    res.status(201).json(event);
  } catch (error) {
    next(error);
  }
};
const Event = require('../models/Event');
const { paginate, paginatedResponse, cleanObject } = require('../utils/helpers');
const AppError = require('../utils/AppError');

// @desc    Upload event image
// @route   POST /api/v1/events/upload-image
// @access  Private (organizer/admin)
exports.uploadEventImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Aucune image envoyée.' });
    }
    // Return the path or URL of the uploaded image
    const imageUrl = `/uploads/events/${req.file.filename}`;
    res.status(200).json({ imageUrl });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtenir tous les événements (avec filtres et pagination)
// @route   GET /api/v1/events
// @access  Public
exports.getEvents = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      search,
      location,
      startDate,
      endDate,
      minPrice,
      maxPrice,
      featured,
      sort = '-createdAt',
    } = req.query;
    
    // Construction du filtre
    const filter = { published: true, status: 'published' };
    
    if (category) filter.category = category;
    if (location) filter.location = new RegExp(location, 'i');
    if (featured) filter.featured = featured === 'true';
    
    // Filtre par date
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }
    
    // Filtre par prix
    if (minPrice || maxPrice) {
      filter['tickets.price'] = {};
      if (minPrice) filter['tickets.price'].$gte = parseInt(minPrice);
      if (maxPrice) filter['tickets.price'].$lte = parseInt(maxPrice);
    }
    
    // Recherche textuelle
    if (search) {
      filter.$text = { $search: search };
    }
    
    // Pagination
    const { skip, limit: limitNum } = paginate(page, limit);
    
    // Récupérer les événements
    const events = await Event.find(filter)
      .populate('organizer', 'name email')
      .sort(sort)
      .skip(skip)
      .limit(limitNum);
    
    const total = await Event.countDocuments(filter);
    
    res.status(200).json(paginatedResponse(events, page, limitNum, total));
  } catch (error) {
    next(error);
  }
};

// @desc    Obtenir un événement par ID
// @route   GET /api/v1/events/:id
// @access  Public
exports.getEventById = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizer', 'name email phone');
    
    if (!event) {
      throw new AppError('Événement non trouvé', 404, 'EVENT_NOT_FOUND');
    }
    
    res.status(200).json(event);
  } catch (error) {
    next(error);
  }
};

// @desc    Obtenir les événements mis en avant
// @route   GET /api/v1/events/featured
// @access  Public
exports.getFeaturedEvents = async (req, res, next) => {
  try {
    const events = await Event.find({
      featured: true,
      published: true,
      status: 'published',
    })
      .populate('organizer', 'name email')
      .limit(6)
      .sort('-createdAt');
    
    res.status(200).json(events);
  } catch (error) {
    next(error);
  }
};

// @desc    Obtenir les catégories
// @route   GET /api/v1/events/categories
// @access  Public
exports.getCategories = async (req, res, next) => {
  try {
    const categories = [
      'Concert',
      'Conférence',
      'Sport',
      'Festival',
      'Théâtre',
      'Formation',
      'Networking',
      'Autre',
    ];
    
    res.status(200).json({ categories });
  } catch (error) {
    next(error);
  }
};

// @desc    Suggestions de recherche
// @route   GET /api/v1/events/search/suggestions
// @access  Public
exports.getSearchSuggestions = async (req, res, next) => {
  try {
    const { q } = req.query;
    
    if (!q || q.length < 2) {
      return res.status(200).json({ suggestions: [] });
    }
    
    const events = await Event.find({
      published: true,
      status: 'published',
      $or: [
        { title: new RegExp(q, 'i') },
        { tags: new RegExp(q, 'i') },
      ],
    })
      .select('title category')
      .limit(5);
    
    const suggestions = events.map(e => ({
      id: e._id,
      title: e.title,
      category: e.category,
    }));
    
    res.status(200).json({ suggestions });
  } catch (error) {
    next(error);
  }
};
