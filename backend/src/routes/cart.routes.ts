import { Router } from 'express';

import { authenticate } from '../middleware/auth.middleware.js';

import {
  getCart,
  addToCart,
  updateCartItem,
  deleteCartItem,
  clearCart,
} from '../controllers/cart.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import {
  addToCartSchema,
  updateCartItemSchema,
} from '../validators/cart.validator.js';

const router = Router();

router.get('/', authenticate, getCart);

router.post('/items', authenticate, validate(addToCartSchema), addToCart);

router.patch(
  '/items/:id',
  authenticate,
  validate(updateCartItemSchema),
  updateCartItem,
);

router.delete('/items/:id', authenticate, deleteCartItem);

router.delete('/', authenticate, clearCart);

export default router;
