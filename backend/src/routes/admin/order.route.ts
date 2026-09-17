import { Router } from 'express';

import {
  getAllOrders,
  updateOrderStatus,
} from '../../controllers/admin.order.controller.js';

import { authenticate } from '../../middleware/auth.middleware.js';

import { requireAdmin } from '../../middleware/admin.middleware.js';

import { validate } from '../../middleware/validate.middleware.js';

import { updateOrderStatusSchema } from '../../validators/order.validator.js';

const router = Router();

router.get('/', authenticate, requireAdmin, getAllOrders);

router.patch(
  '/:id/status',
  authenticate,
  requireAdmin,
  validate(updateOrderStatusSchema),
  updateOrderStatus,
);

export default router;
