const swaggerJsdoc = require('swagger-jsdoc');
const config = require('./index');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Event App Pro API',
      version: '1.0.0',
      description: 'API REST pour la plateforme événementielle Event App Pro - Sénégal',
      contact: {
        name: 'YOUWARE',
        email: 'contact@youware.sn',
      },
      license: {
        name: 'Propriétaire',
      },
    },
    servers: [
      {
        url: `http://localhost:${config.port}/api/${config.apiVersion}`,
        description: 'Serveur de développement',
      },
      {
        url: `https://api.eventapppro.sn/${config.apiVersion}`,
        description: 'Serveur de production',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Token JWT obtenu lors de la connexion',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '675b1234567890abcdef1234' },
            name: { type: 'string', example: 'Amadou Diallo' },
            email: { type: 'string', format: 'email', example: 'amadou@example.com' },
            phone: { type: 'string', example: '+221771234567' },
            role: { type: 'string', enum: ['user', 'organizer', 'admin'], example: 'user' },
            avatar: { type: 'string', nullable: true },
            location: { type: 'string', nullable: true },
            birthdate: { type: 'string', format: 'date', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Event: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            title: { type: 'string', example: 'Festival Dakar Music' },
            description: { type: 'string' },
            category: {
              type: 'string',
              enum: ['Concert', 'Conférence', 'Sport', 'Festival', 'Théâtre', 'Formation', 'Networking', 'Autre'],
            },
            date: { type: 'string', format: 'date-time' },
            time: { type: 'string', example: '20:00' },
            location: { type: 'string', example: 'Grand Théâtre National, Dakar' },
            image: { type: 'string', format: 'uri' },
            organizer: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                name: { type: 'string' },
                email: { type: 'string' },
              },
            },
            tickets: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  type: { type: 'string', example: 'VIP' },
                  price: { type: 'number', example: 35000 },
                  quantity: { type: 'number', example: 100 },
                  available: { type: 'number', example: 50 },
                  description: { type: 'string' },
                },
              },
            },
            capacity: { type: 'number' },
            sold: { type: 'number' },
            featured: { type: 'boolean' },
            published: { type: 'boolean' },
            status: { type: 'string', enum: ['draft', 'published', 'cancelled', 'completed'] },
            tags: { type: 'array', items: { type: 'string' } },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Ticket: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            ticketNumber: { type: 'string', example: 'TKT-20251130-00001' },
            event: { $ref: '#/components/schemas/Event' },
            user: { $ref: '#/components/schemas/User' },
            ticketType: { type: 'string', example: 'VIP' },
            price: { type: 'number', example: 35000 },
            qrCode: { type: 'string', description: 'QR Code en base64' },
            status: { type: 'string', enum: ['valid', 'used', 'cancelled', 'refunded'] },
            usedAt: { type: 'string', format: 'date-time', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Order: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            orderNumber: { type: 'string', example: 'ORD-20251130-0001' },
            user: { type: 'string' },
            event: { type: 'string' },
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  ticketType: { type: 'string' },
                  quantity: { type: 'number' },
                  price: { type: 'number' },
                  subtotal: { type: 'number' },
                },
              },
            },
            total: { type: 'number', example: 80000 },
            status: { type: 'string', enum: ['pending', 'completed', 'cancelled', 'refunded'] },
            paymentMethod: { type: 'string', enum: ['card', 'wave', 'orange_money', 'free_money'] },
            paymentStatus: { type: 'string', enum: ['pending', 'paid', 'failed', 'refunded'] },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'object',
              properties: {
                code: { type: 'string', example: 'VALIDATION_ERROR' },
                message: { type: 'string', example: 'Erreur de validation' },
                details: { type: 'object' },
              },
            },
          },
        },
        Pagination: {
          type: 'object',
          properties: {
            page: { type: 'number', example: 1 },
            limit: { type: 'number', example: 10 },
            total: { type: 'number', example: 100 },
            pages: { type: 'number', example: 10 },
            hasNext: { type: 'boolean' },
            hasPrev: { type: 'boolean' },
          },
        },
      },
      responses: {
        UnauthorizedError: {
          description: 'Token manquant ou invalide',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' },
              example: {
                error: {
                  code: 'UNAUTHORIZED',
                  message: 'Non autorisé - Token manquant',
                },
              },
            },
          },
        },
        ForbiddenError: {
          description: 'Accès refusé',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' },
              example: {
                error: {
                  code: 'FORBIDDEN',
                  message: 'Accès refusé - Rôle user non autorisé',
                },
              },
            },
          },
        },
        NotFoundError: {
          description: 'Ressource non trouvée',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' },
              example: {
                error: {
                  code: 'NOT_FOUND',
                  message: 'Ressource non trouvée',
                },
              },
            },
          },
        },
        ValidationError: {
          description: 'Erreur de validation',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' },
              example: {
                error: {
                  code: 'VALIDATION_ERROR',
                  message: 'Erreur de validation',
                  details: [
                    {
                      field: 'email',
                      message: 'Email invalide',
                    },
                  ],
                },
              },
            },
          },
        },
      },
    },
    tags: [
      {
        name: 'Authentification',
        description: 'Gestion de l\'authentification et des comptes utilisateurs',
      },
      {
        name: 'Événements',
        description: 'Gestion des événements publics',
      },
      {
        name: 'Utilisateurs',
        description: 'Gestion du profil utilisateur',
      },
      {
        name: 'Billets',
        description: 'Réservation et achat de billets',
      },
      {
        name: 'Organisateur',
        description: 'Espace organisateur - Gestion des événements',
      },
    ],
  },
  apis: ['./src/routes/*.js'], // Fichiers contenant les annotations
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
