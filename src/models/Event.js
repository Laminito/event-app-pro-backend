const mongoose = require('mongoose');

const ticketTypeSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
  },
  available: {
    type: Number,
    required: true,
    min: 0,
  },
  description: {
    type: String,
    default: '',
  },
});

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Le titre est requis'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'La description est requise'],
  },
  category: {
    type: String,
    required: true,
    enum: ['Concert', 'Conférence', 'Sport', 'Festival', 'Théâtre', 'Formation', 'Networking', 'Autre'],
  },
  date: {
    type: Date,
    required: [true, 'La date est requise'],
  },
  time: {
    type: String,
    required: [true, "L'heure est requise"],
  },
  location: {
    type: String,
    required: [true, 'Le lieu est requis'],
  },
  image: {
    type: String,
    default: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30',
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  tickets: [ticketTypeSchema],
  capacity: {
    type: Number,
    required: true,
    min: 1,
  },
  sold: {
    type: Number,
    default: 0,
    min: 0,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  published: {
    type: Boolean,
    default: false,
  },
  tags: [{
    type: String,
  }],
  status: {
    type: String,
    enum: ['draft', 'published', 'cancelled', 'completed'],
    default: 'draft',
  },
}, {
  timestamps: true,
});

// Index pour la recherche
eventSchema.index({ title: 'text', description: 'text', tags: 'text' });
eventSchema.index({ category: 1, date: 1 });
eventSchema.index({ organizer: 1 });

// Méthode pour vérifier la disponibilité
eventSchema.methods.checkAvailability = function(ticketType, quantity) {
  const ticket = this.tickets.find(t => t.type === ticketType);
  return ticket && ticket.available >= quantity;
};

// Méthode pour réserver des billets
eventSchema.methods.reserveTickets = function(ticketType, quantity) {
  const ticket = this.tickets.find(t => t.type === ticketType);
  if (ticket && ticket.available >= quantity) {
    ticket.available -= quantity;
    this.sold += quantity;
    return true;
  }
  return false;
};

module.exports = mongoose.model('Event', eventSchema);
