const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  ticketNumber: {
    type: String,
    required: true,
    unique: true,
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  ticketType: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  qrCode: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['valid', 'used', 'cancelled', 'refunded'],
    default: 'valid',
  },
  usedAt: {
    type: Date,
    default: null,
  },
  usedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  customerInfo: {
    name: String,
    email: String,
    phone: String,
  },
}, {
  timestamps: true,
});

// Générer un numéro de billet unique
ticketSchema.pre('save', function(next) {
  if (!this.ticketNumber) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
    this.ticketNumber = `TKT-${year}${month}${day}-${random}`;
  }
  next();
});

// Index
ticketSchema.index({ user: 1, createdAt: -1 });
ticketSchema.index({ event: 1, status: 1 });
ticketSchema.index({ ticketNumber: 1 });
ticketSchema.index({ qrCode: 1 });

module.exports = mongoose.model('Ticket', ticketSchema);
