const Event = require('../models/Event');
const Ticket = require('../models/Ticket');
const Order = require('../models/Order');
const { paginate, paginatedResponse } = require('../utils/helpers');
const AppError = require('../utils/AppError');

// @desc    Créer un événement
// @route   POST /api/v1/organizer/events
// @access  Private (Organizer)
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
      capacity,
      tickets,
      tags,
    } = req.body;
    
    // Calculer available pour chaque type de billet
    const ticketsWithAvailable = tickets.map(ticket => ({
      ...ticket,
      available: ticket.quantity,
    }));
    
    const event = await Event.create({
      title,
      description,
      category,
      date,
      time,
      location,
      image,
      organizer: req.user._id,
      capacity,
      tickets: ticketsWithAvailable,
      tags,
      status: 'draft',
    });
    
    res.status(201).json(event);
  } catch (error) {
    next(error);
  }
};

// @desc    Obtenir mes événements
// @route   GET /api/v1/organizer/events
// @access  Private (Organizer)
exports.getMyEvents = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const { skip, limit: limitNum } = paginate(page, limit);
    
    const events = await Event.find({ organizer: req.user._id })
      .sort('-createdAt')
      .skip(skip)
      .limit(limitNum);
    
    const total = await Event.countDocuments({ organizer: req.user._id });
    
    res.status(200).json(paginatedResponse(events, page, limitNum, total));
  } catch (error) {
    next(error);
  }
};

// @desc    Obtenir un événement
// @route   GET /api/v1/organizer/events/:id
// @access  Private (Organizer)
exports.getMyEventById = async (req, res, next) => {
  try {
    const event = await Event.findOne({
      _id: req.params.id,
      organizer: req.user._id,
    });
    
    if (!event) {
      throw new AppError('Événement non trouvé', 404, 'EVENT_NOT_FOUND');
    }
    
    res.status(200).json(event);
  } catch (error) {
    next(error);
  }
};

// @desc    Mettre à jour un événement
// @route   PUT /api/v1/organizer/events/:id
// @access  Private (Organizer)
exports.updateEvent = async (req, res, next) => {
  try {
    const event = await Event.findOne({
      _id: req.params.id,
      organizer: req.user._id,
    });
    
    if (!event) {
      throw new AppError('Événement non trouvé', 404, 'EVENT_NOT_FOUND');
    }
    
    const allowedFields = [
      'title',
      'description',
      'category',
      'date',
      'time',
      'location',
      'image',
      'capacity',
      'tickets',
      'tags',
      'featured',
    ];
    
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        event[field] = req.body[field];
      }
    });
    
    await event.save();
    
    res.status(200).json(event);
  } catch (error) {
    next(error);
  }
};

// @desc    Supprimer un événement
// @route   DELETE /api/v1/organizer/events/:id
// @access  Private (Organizer)
exports.deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findOne({
      _id: req.params.id,
      organizer: req.user._id,
    });
    
    if (!event) {
      throw new AppError('Événement non trouvé', 404, 'EVENT_NOT_FOUND');
    }
    
    // Vérifier s'il y a des billets vendus
    const ticketCount = await Ticket.countDocuments({ event: event._id });
    
    if (ticketCount > 0) {
      throw new AppError('Impossible de supprimer un événement avec des billets vendus', 400, 'EVENT_HAS_TICKETS');
    }
    
    await event.deleteOne();
    
    res.status(200).json({
      message: 'Événement supprimé avec succès',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Publier un événement
// @route   POST /api/v1/organizer/events/:id/publish
// @access  Private (Organizer)
exports.publishEvent = async (req, res, next) => {
  try {
    const event = await Event.findOne({
      _id: req.params.id,
      organizer: req.user._id,
    });
    
    if (!event) {
      throw new AppError('Événement non trouvé', 404, 'EVENT_NOT_FOUND');
    }
    
    event.published = true;
    event.status = 'published';
    await event.save();
    
    res.status(200).json(event);
  } catch (error) {
    next(error);
  }
};

// @desc    Dépublier un événement
// @route   POST /api/v1/organizer/events/:id/unpublish
// @access  Private (Organizer)
exports.unpublishEvent = async (req, res, next) => {
  try {
    const event = await Event.findOne({
      _id: req.params.id,
      organizer: req.user._id,
    });
    
    if (!event) {
      throw new AppError('Événement non trouvé', 404, 'EVENT_NOT_FOUND');
    }
    
    event.published = false;
    event.status = 'draft';
    await event.save();
    
    res.status(200).json(event);
  } catch (error) {
    next(error);
  }
};

// @desc    Statistiques du dashboard
// @route   GET /api/v1/organizer/dashboard/stats
// @access  Private (Organizer)
exports.getDashboardStats = async (req, res, next) => {
  try {
    // Total événements
    const totalEvents = await Event.countDocuments({ organizer: req.user._id });
    
    // Événements actifs
    const activeEvents = await Event.countDocuments({
      organizer: req.user._id,
      status: 'published',
      date: { $gte: new Date() },
    });
    
    // Total billets vendus
    const eventIds = await Event.find({ organizer: req.user._id }).distinct('_id');
    const totalTickets = await Ticket.countDocuments({ event: { $in: eventIds } });
    
    // Total revenus
    const orders = await Order.find({
      event: { $in: eventIds },
      paymentStatus: 'paid',
    });
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    
    res.status(200).json({
      totalRevenue,
      totalEvents,
      totalTickets,
      activeEvents,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtenir les billets vendus
// @route   GET /api/v1/organizer/tickets
// @access  Private (Organizer)
exports.getOrganizerTickets = async (req, res, next) => {
  try {
    const { eventId, status, page = 1, limit = 10 } = req.query;
    
    const filter = {};
    
    // Filtrer par événement
    if (eventId) {
      filter.event = eventId;
    } else {
      // Tous les événements de l'organisateur
      const eventIds = await Event.find({ organizer: req.user._id }).distinct('_id');
      filter.event = { $in: eventIds };
    }
    
    if (status) filter.status = status;
    
    const { skip, limit: limitNum } = paginate(page, limit);
    
    const tickets = await Ticket.find(filter)
      .populate('event', 'title date time location')
      .populate('user', 'name email phone')
      .sort('-createdAt')
      .skip(skip)
      .limit(limitNum);
    
    const total = await Ticket.countDocuments(filter);
    
    res.status(200).json(paginatedResponse(tickets, page, limitNum, total));
  } catch (error) {
    next(error);
  }
};
