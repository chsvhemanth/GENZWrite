import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import path from 'path';
import passport from 'passport';
import './routes/auth'; // ensure strategy is registered
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import postRoutes from './routes/posts';
import uploadRoutes from './routes/uploads';
import { Notification } from './models/Notification';
import { authRequired, AuthRequest } from './middleware/auth';
import 'express-async-errors';
import { errorHandler, notFoundHandler, requestLogger } from './middleware/logger';

const app = express();
const PORT = process.env.PORT || 4000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

app.use(helmet());
app.use(cors({ origin: CLIENT_URL, credentials: true }));
app.use(express.json({ limit: '2mb' }));
app.use(cookieParser());
app.use(passport.initialize());
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
app.use(requestLogger);

// routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/uploads', uploadRoutes);

// Notifications: list + SSE stream
app.get('/api/notifications', authRequired, async (req: AuthRequest, res) => {
  const items = await Notification.find({ userId: req.userId }).sort({ createdAt: -1 }).limit(50);
  res.json({ notifications: items });
});
app.get('/api/notifications/stream', authRequired, async (req: AuthRequest, res) => {
  res.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive'
  });
  res.flushHeaders();
  const interval = setInterval(async () => {
    // send heartbeat
    res.write(`event: ping\ndata: ${Date.now()}\n\n`);
  }, 20000);
  req.on('close', () => clearInterval(interval));
});

// 404 + error handler
app.use(notFoundHandler);
app.use(errorHandler);

// start
async function start() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('[Startup] Missing MONGODB_URI. Set it in server/.env (see README.md).');
    process.exit(1);
  }
  try {
    await mongoose.connect(uri);
    console.log('[MongoDB] Connected');
  } catch (err) {
    console.error('[MongoDB] Connection failed:', (err as Error).message);
    console.error('URI in use:', uri.startsWith('mongodb+srv') ? '<mongodb+srv redacted>' : uri);
    process.exit(1);
  }
  app.listen(PORT, () => {
    console.log(`Server on http://localhost:${PORT}`);
  });
}

process.on('unhandledRejection', (reason) => {
  console.error('[UnhandledRejection]', reason);
});
process.on('uncaughtException', (err) => {
  console.error('[UncaughtException]', err);
});

start().catch((e) => {
  console.error(e);
  process.exit(1);
});


