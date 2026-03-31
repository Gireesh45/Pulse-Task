import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { connectDB } from './config/db';
import authRoutes from './routes/authRoutes';
import videoRoutes from './routes/videoRoutes';

dotenv.config();
connectDB();

const app = express();
const httpServer = createServer(app);
export const io = new Server(httpServer, {
  cors: { origin: process.env.FRONTEND_URL || '*', methods: ['GET', 'POST'] }
});

app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/videos', videoRoutes);
app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'API running' });
});

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
