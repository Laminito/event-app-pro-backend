const express = require('express');
const {
  getEvents,
  getEventById,
  getFeaturedEvents,
  getCategories,
  getSearchSuggestions,
} = require('../controllers/eventController');

const router = express.Router();

// Routes publiques
router.get('/', getEvents);
router.get('/featured', getFeaturedEvents);
router.get('/categories', getCategories);
router.get('/search/suggestions', getSearchSuggestions);
router.get('/:id', getEventById);

module.exports = router;
