import { Router } from 'express';

import {
  createCategory,
  updateCategory,
  deleteCategory,
} from '../../controllers/category.controller.js';

import { authenticate } from '../../middleware/auth.middleware.js';
import { requireAdmin } from '../../middleware/admin.middleware.js';

const router = Router();

router.use(authenticate, requireAdmin);

router.post('/', createCategory);

router.patch('/:id', updateCategory);

router.delete('/:id', deleteCategory);

export default router;
