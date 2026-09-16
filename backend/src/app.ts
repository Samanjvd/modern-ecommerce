import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import authRoutes from './routes/auth.routes.js';

dotenv.config();

export const app = express();

app.use(helmet());

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  }),
);

app.use(express.json());

app.use('/api/auth', authRoutes);
