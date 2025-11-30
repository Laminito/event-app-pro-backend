require('dotenv').config();

module.exports = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 5000,
  apiVersion: process.env.API_VERSION || 'v1',
  
  mongodb: {
    uri: process.env.MONGODB_URI,
  },
  
  jwt: {
    secret: process.env.JWT_SECRET,
    expire: process.env.JWT_EXPIRE || '7d',
  },
  
  email: {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASSWORD,
    from: process.env.EMAIL_FROM,
  },
  
  payment: {
    wave: {
      apiKey: process.env.WAVE_API_KEY,
      secret: process.env.WAVE_SECRET,
      webhookSecret: process.env.WAVE_WEBHOOK_SECRET,
    },
    orangeMoney: {
      apiKey: process.env.ORANGE_MONEY_API_KEY,
      secret: process.env.ORANGE_MONEY_SECRET,
    },
    freeMoney: {
      apiKey: process.env.FREE_MONEY_API_KEY,
      secret: process.env.FREE_MONEY_SECRET,
    },
  },
  
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  },
  
  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB
    uploadPath: process.env.UPLOAD_PATH || './uploads',
  },
  
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 3600000, // 1 hour
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 1000,
    maxRequestsUnauth: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS_UNAUTH) || 100,
  },
};
