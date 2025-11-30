const express = require('express');
const {
  getEvents,
  getEventById,
  getFeaturedEvents,
  getCategories,
  getSearchSuggestions,
} = require('../controllers/eventController');

const router = express.Router();

/**
 * @swagger
 * /events:
 *   get:
 *     summary: Liste de tous les événements avec filtres et pagination
 *     tags: [Événements]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Numéro de page
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Nombre d'éléments par page
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [Concert, Conférence, Sport, Festival, Théâtre, Formation, Networking, Autre]
 *         description: Filtrer par catégorie
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Recherche textuelle
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: Filtrer par lieu
 *       - in: query
 *         name: featured
 *         schema:
 *           type: boolean
 *         description: Événements mis en avant
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           default: -createdAt
 *         description: Tri (date, price, -createdAt)
 *     responses:
 *       200:
 *         description: Liste des événements
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Event'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 */
router.get('/', getEvents);

/**
 * @swagger
 * /events/featured:
 *   get:
 *     summary: Liste des événements mis en avant
 *     tags: [Événements]
 *     responses:
 *       200:
 *         description: Événements populaires
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 */
router.get('/featured', getFeaturedEvents);

/**
 * @swagger
 * /events/categories:
 *   get:
 *     summary: Liste des catégories disponibles
 *     tags: [Événements]
 *     responses:
 *       200:
 *         description: Catégories d'événements
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 categories:
 *                   type: array
 *                   items:
 *                     type: string
 */
router.get('/categories', getCategories);

/**
 * @swagger
 * /events/search/suggestions:
 *   get:
 *     summary: Suggestions de recherche autocomplete
 *     tags: [Événements]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Terme de recherche
 *     responses:
 *       200:
 *         description: Suggestions de recherche
 */
router.get('/search/suggestions', getSearchSuggestions);

/**
 * @swagger
 * /events/{id}:
 *   get:
 *     summary: Détails d'un événement
 *     tags: [Événements]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'événement
 *     responses:
 *       200:
 *         description: Détails de l'événement
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get('/:id', getEventById);

module.exports = router;
