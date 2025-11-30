const Order = require('../models/Order');
const Ticket = require('../models/Ticket');
const Event = require('../models/Event');
const { generateQRCode } = require('../utils/qrcode');
const { sendOrderConfirmation, sendTicketEmail } = require('../utils/email');
const { calculateTotal } = require('../utils/helpers');
const AppError = require('../utils/AppError');

// @desc    Réserver des billets
// @route   POST /api/v1/tickets/reserve
// @access  Private
exports.reserveTickets = async (req, res, next) => {
  try {
    const { eventId, tickets } = req.body;
    
    // Vérifier l'événement
    const event = await Event.findById(eventId);
    if (!event) {
      throw new AppError('Événement non trouvé', 404, 'EVENT_NOT_FOUND');
    }
    
    // Vérifier la disponibilité
    for (const ticket of tickets) {
      const available = event.checkAvailability(ticket.type, ticket.quantity);
      if (!available) {
        throw new AppError(`Billets ${ticket.type} non disponibles`, 400, 'TICKETS_UNAVAILABLE');
      }
    }
    
    // Calculer le total
    const items = tickets.map(ticket => {
      const eventTicket = event.tickets.find(t => t.type === ticket.type);
      return {
        ticketType: ticket.type,
        quantity: ticket.quantity,
        price: eventTicket.price,
        subtotal: eventTicket.price * ticket.quantity,
      };
    });
    
    const total = calculateTotal(items);
    
    // Créer la réservation
    const reservation = await Order.create({
      user: req.user._id,
      event: eventId,
      items,
      total,
      status: 'pending',
      paymentMethod: 'card', // Temporaire
      customerInfo: {
        name: req.user.name,
        email: req.user.email,
        phone: req.user.phone,
      },
      reservationExpiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
    });
    
    res.status(201).json({
      reservation: {
        id: reservation._id,
        expiresAt: reservation.reservationExpiresAt,
        total: reservation.total,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Acheter des billets
// @route   POST /api/v1/tickets/purchase
// @access  Private
exports.purchaseTickets = async (req, res, next) => {
  try {
    const { reservationId, paymentMethod, customerInfo } = req.body;
    
    // Récupérer la réservation
    const order = await Order.findById(reservationId)
      .populate('event');
    
    if (!order) {
      throw new AppError('Réservation non trouvée', 404, 'RESERVATION_NOT_FOUND');
    }
    
    // Vérifier l'expiration
    if (order.reservationExpiresAt && new Date() > order.reservationExpiresAt) {
      throw new AppError('Réservation expirée', 400, 'RESERVATION_EXPIRED');
    }
    
    // Mettre à jour la commande
    order.paymentMethod = paymentMethod;
    order.customerInfo = customerInfo;
    order.status = 'completed';
    order.paymentStatus = 'paid';
    order.reservationExpiresAt = null;
    await order.save();
    
    // Réserver les billets dans l'événement
    const event = order.event;
    for (const item of order.items) {
      event.reserveTickets(item.ticketType, item.quantity);
    }
    await event.save();
    
    // Créer les billets
    const tickets = [];
    for (const item of order.items) {
      for (let i = 0; i < item.quantity; i++) {
        const ticket = await Ticket.create({
          order: order._id,
          event: event._id,
          user: req.user._id,
          ticketType: item.ticketType,
          price: item.price,
          qrCode: '', // Temporaire
          customerInfo: customerInfo,
        });
        
        // Générer le QR code
        const qrCode = await generateQRCode(ticket._id.toString());
        ticket.qrCode = qrCode;
        await ticket.save();
        
        tickets.push(ticket);
        
        // Envoyer email de billet
        sendTicketEmail(ticket, req.user, event).catch(err => console.error(err));
      }
    }
    
    // Envoyer email de confirmation
    sendOrderConfirmation(order, req.user).catch(err => console.error(err));
    
    res.status(200).json({
      order: {
        id: order._id,
        orderNumber: order.orderNumber,
        tickets: tickets.map(t => ({
          id: t._id,
          ticketNumber: t.ticketNumber,
          type: t.ticketType,
        })),
        total: order.total,
        status: order.status,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtenir mes billets
// @route   GET /api/v1/tickets/my-tickets
// @access  Private
exports.getMyTickets = async (req, res, next) => {
  try {
    const { status } = req.query;
    
    const filter = { user: req.user._id };
    if (status) filter.status = status;
    
    const tickets = await Ticket.find(filter)
      .populate('event', 'title date time location image')
      .populate('order', 'orderNumber total')
      .sort('-createdAt');
    
    res.status(200).json(tickets);
  } catch (error) {
    next(error);
  }
};

// @desc    Obtenir un billet par ID
// @route   GET /api/v1/tickets/:ticketId
// @access  Private
exports.getTicketById = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.ticketId)
      .populate('event', 'title date time location image organizer')
      .populate('order', 'orderNumber total');
    
    if (!ticket) {
      throw new AppError('Billet non trouvé', 404, 'TICKET_NOT_FOUND');
    }
    
    // Vérifier que le billet appartient à l'utilisateur
    if (ticket.user.toString() !== req.user._id.toString()) {
      throw new AppError('Non autorisé', 403, 'FORBIDDEN');
    }
    
    res.status(200).json(ticket);
  } catch (error) {
    next(error);
  }
};

// @desc    Valider un billet
// @route   POST /api/v1/tickets/:ticketId/validate
// @access  Private (Organizer)
exports.validateTicket = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.ticketId)
      .populate('event');
    
    if (!ticket) {
      throw new AppError('Billet non trouvé', 404, 'TICKET_NOT_FOUND');
    }
    
    // Vérifier que l'utilisateur est l'organisateur
    if (ticket.event.organizer.toString() !== req.user._id.toString()) {
      throw new AppError('Non autorisé', 403, 'FORBIDDEN');
    }
    
    // Vérifier le statut
    if (ticket.status === 'used') {
      return res.status(400).json({
        valid: false,
        message: 'Billet déjà utilisé',
        ticket,
      });
    }
    
    if (ticket.status === 'cancelled') {
      return res.status(400).json({
        valid: false,
        message: 'Billet annulé',
        ticket,
      });
    }
    
    // Marquer comme utilisé
    ticket.status = 'used';
    ticket.usedAt = new Date();
    ticket.usedBy = req.user._id;
    await ticket.save();
    
    res.status(200).json({
      valid: true,
      message: 'Billet validé avec succès',
      ticket,
    });
  } catch (error) {
    next(error);
  }
};
