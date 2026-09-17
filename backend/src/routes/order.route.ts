import { Router } from 'express';

import {
  createOrder,
  getMyOrders,
  getUserOrderById,
} from '../controllers/order.controller.js';

import { authenticate } from '../middleware/auth.middleware.js';

import { validate } from '../middleware/validate.middleware.js';

import { createOrderSchema } from '../validators/order.validator.js';

const router = Router();

router.get('/', authenticate, getMyOrders);
router.get('/:id', authenticate, getUserOrderById);

router.post('/', authenticate, validate(createOrderSchema), createOrder);

export default router;
