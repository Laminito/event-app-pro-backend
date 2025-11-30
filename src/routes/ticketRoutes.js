const express = require('express');
const { body } = require('express-validator');
const { validate } = require('../middlewares/validator');
const {
  reserveTickets,
  purchaseTickets,
  getMyTickets,
  getTicketById,
  validateTicket,
} = require('../controllers/ticketController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

// Toutes les routes nécessitent une authentification
router.use(protect);

// Validation rules
const reserveValidation = [
  body('eventId').notEmpty().withMessage('ID événement requis'),
  body('tickets').isArray({ min: 1 }).withMessage('Au moins un type de billet requis'),
  body('tickets.*.type').notEmpty().withMessage('Type de billet requis'),
  body('tickets.*.quantity').isInt({ min: 1 }).withMessage('Quantité invalide'),
];

const purchaseValidation = [
  body('reservationId').notEmpty().withMessage('ID réservation requis'),
  body('paymentMethod').isIn(['card', 'wave', 'orange_money', 'free_money']).withMessage('Méthode de paiement invalide'),
  body('customerInfo.name').notEmpty().withMessage('Nom client requis'),
  body('customerInfo.email').isEmail().withMessage('Email client invalide'),
  body('customerInfo.phone').matches(/^\+221[0-9]{9}$/).withMessage('Téléphone client invalide'),
];

// Routes
router.post('/reserve', reserveValidation, validate, reserveTickets);
router.post('/purchase', purchaseValidation, validate, purchaseTickets);
router.get('/my-tickets', getMyTickets);
router.get('/:ticketId', getTicketById);
router.post('/:ticketId/validate', authorize('organizer', 'admin'), validateTicket);

module.exports = router;
