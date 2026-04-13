import 'dotenv/config';
import '@babel/polyfill';
import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import router from './Backend/routes';
import errorHandler from './Backend/helpers/errorHandler';
import {
  init
} from './Backend/helpers/socket';

// express app
const app = express();
const server = http.createServer(app);

// --- CORS: restrict to configured frontend URL ---
const allowedOrigins = process.env.FRONT_END_URL
  ? process.env.FRONT_END_URL.split(',').map((o) => o.trim())
  : ['http://localhost:3000'];

// Initialize Socket.io via helper
init(server, allowedOrigins);

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
  credentials: true,
}));

// body parse configuration
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Logging — only in development
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// --- Rate limiting on auth-heavy endpoints ---
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // 30 requests per window per IP
  message: {
    error: 'Too many requests, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/user/login', authLimiter);
app.use('/api/user/reset-password', authLimiter);

// General API rate limit (more generous)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: {
    error: 'Too many requests, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', apiLimiter);

app.use('/api', router);

// Error handling to catch 404
app.all('*', (_req, res) => {
  res.status(404).json({
    error: 'Route not found',
  });
});

// Global error handler (must be last middleware)
app.use(errorHandler);

// Starting server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  // eslint-disable-next-line
  console.log(`Server running on ${PORT}`);
});

export default app;
