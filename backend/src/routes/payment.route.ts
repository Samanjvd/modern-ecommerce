import { Router } from 'express';

import {
  createPayment,
  verifyPayment,
} from '../controllers/payment.controller.js';

import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/create/:orderId', authenticate, createPayment);

router.post('/verify/:id', authenticate, verifyPayment);

export default router;
