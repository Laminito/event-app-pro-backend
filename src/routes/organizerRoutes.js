const express = require('express');
const { body } = require('express-validator');
const { validate } = require('../middlewares/validator');
const {
  createEvent,
  getMyEvents,
  getMyEventById,
  updateEvent,
  deleteEvent,
  publishEvent,
  unpublishEvent,
  getDashboardStats,
  getOrganizerTickets,
} = require('../controllers/organizerController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

// Toutes les routes nécessitent authentification + rôle organizer
router.use(protect);
router.use(authorize('organizer', 'admin'));

// Validation rules
const createEventValidation = [
  body('title').trim().notEmpty().withMessage('Le titre est requis'),
  body('description').trim().notEmpty().withMessage('La description est requise'),
  body('category').isIn(['Concert', 'Conférence', 'Sport', 'Festival', 'Théâtre', 'Formation', 'Networking', 'Autre']).withMessage('Catégorie invalide'),
  body('date').isISO8601().withMessage('Date invalide'),
  body('time').notEmpty().withMessage('Heure requise'),
  body('location').trim().notEmpty().withMessage('Lieu requis'),
  body('capacity').isInt({ min: 1 }).withMessage('Capacité invalide'),
  body('tickets').isArray({ min: 1 }).withMessage('Au moins un type de billet requis'),
  body('tickets.*.type').notEmpty().withMessage('Type de billet requis'),
  body('tickets.*.price').isNumeric().withMessage('Prix invalide'),
  body('tickets.*.quantity').isInt({ min: 1 }).withMessage('Quantité invalide'),
];

// Routes Dashboard
router.get('/dashboard/stats', getDashboardStats);

// Routes Events
router.post('/events', createEventValidation, validate, createEvent);
router.get('/events', getMyEvents);
router.get('/events/:id', getMyEventById);
router.put('/events/:id', updateEvent);
router.delete('/events/:id', deleteEvent);
router.post('/events/:id/publish', publishEvent);
router.post('/events/:id/unpublish', unpublishEvent);

// Routes Tickets
router.get('/tickets', getOrganizerTickets);

module.exports = router;
