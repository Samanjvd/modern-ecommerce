import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';

dotenv.config();

export const app = express();

app.use(helmet());

app.use(
  cors({
    origin: 'http://localhost:5000',
  }),
);

app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({
    message: 'API is running',
  });
});
