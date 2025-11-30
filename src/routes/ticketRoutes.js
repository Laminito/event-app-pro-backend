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

/**
 * @swagger
 * /tickets/reserve:
 *   post:
 *     summary: Réserver des billets (ajouter au panier)
 *     tags: [Billets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - eventId
 *               - tickets
 *             properties:
 *               eventId:
 *                 type: string
 *                 example: 675b1234567890abcdef1234
 *               tickets:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     type:
 *                       type: string
 *                       example: VIP
 *                     quantity:
 *                       type: integer
 *                       example: 2
 *     responses:
 *       201:
 *         description: Réservation créée
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 reservation:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     expiresAt:
 *                       type: string
 *                       format: date-time
 *                     total:
 *                       type: number
 *       400:
 *         description: Billets non disponibles
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.post('/reserve', reserveValidation, validate, reserveTickets);

/**
 * @swagger
 * /tickets/purchase:
 *   post:
 *     summary: Acheter des billets
 *     tags: [Billets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reservationId
 *               - paymentMethod
 *               - customerInfo
 *             properties:
 *               reservationId:
 *                 type: string
 *               paymentMethod:
 *                 type: string
 *                 enum: [card, wave, orange_money, free_money]
 *                 example: wave
 *               customerInfo:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *                   phone:
 *                     type: string
 *     responses:
 *       200:
 *         description: Achat réussi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 order:
 *                   $ref: '#/components/schemas/Order'
 *       400:
 *         description: Réservation expirée
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.post('/purchase', purchaseValidation, validate, purchaseTickets);

/**
 * @swagger
 * /tickets/my-tickets:
 *   get:
 *     summary: Liste de mes billets
 *     tags: [Billets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [valid, used, cancelled]
 *     responses:
 *       200:
 *         description: Liste des billets
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Ticket'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get('/my-tickets', getMyTickets);

/**
 * @swagger
 * /tickets/{ticketId}:
 *   get:
 *     summary: Détails d'un billet avec QR code
 *     tags: [Billets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: ticketId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Détails du billet
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ticket'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get('/:ticketId', getTicketById);

/**
 * @swagger
 * /tickets/{ticketId}/validate:
 *   post:
 *     summary: Valider un billet (scan QR code) - Organisateur uniquement
 *     tags: [Billets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: ticketId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Billet validé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 valid:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 ticket:
 *                   $ref: '#/components/schemas/Ticket'
 *       400:
 *         description: Billet déjà utilisé ou annulé
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.post('/:ticketId/validate', authorize('organizer', 'admin'), validateTicket);

module.exports = router;
