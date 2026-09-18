import { Router } from 'express';

import {
  createProduct,
  deleteProduct,
  updateProduct,
} from '../../controllers/admin/admin.controller.js';

import { authenticate } from '../../middleware/auth.middleware.js';
import { requireAdmin } from '../../middleware/admin.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';

import {
  createProductSchema,
  updateProductSchema,
} from '../../validators/product.validator.js';

const router = Router();

router.get('/test', authenticate, requireAdmin, (_req, res) => {
  res.json({
    message: 'Admin access granted',
  });
});

router.post(
  '/products',
  authenticate,
  requireAdmin,
  validate(createProductSchema),
  createProduct,
);

router.patch(
  '/products/:id',
  authenticate,
  requireAdmin,
  validate(updateProductSchema),
  updateProduct,
);

router.delete('/products/:id', authenticate, requireAdmin, deleteProduct);

export default router;
