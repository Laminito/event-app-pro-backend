const express = require('express');
const authRoutes = require('./authRoutes');
const eventRoutes = require('./eventRoutes');
const userRoutes = require('./userRoutes');
const ticketRoutes = require('./ticketRoutes');
const organizerRoutes = require('./organizerRoutes');

const router = express.Router();

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check de l'API
 *     tags: [System]
 *     responses:
 *       200:
 *         description: API opérationnelle
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 *                 message:
 *                   type: string
 *                   example: Event App Pro API is running
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Event App Pro API is running',
    timestamp: new Date().toISOString(),
  });
});

// Mount routes
router.use('/auth', authRoutes);
router.use('/events', eventRoutes);
router.use('/users', userRoutes);
router.use('/tickets', ticketRoutes);
router.use('/organizer', organizerRoutes);

module.exports = router;
