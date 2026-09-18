import { Router } from 'express';

import {
  getAllUsers,
  getUserById,
  updateUserRole,
} from '../../controllers/admin/admin-user.controller.js';

import { authenticate } from '../../middleware/auth.middleware.js';

import { requireAdmin } from '../../middleware/admin.middleware.js';

import { validate } from '../../middleware/validate.middleware.js';

import { updateUserRoleSchema } from '../../validators/admin-user.validator.js';

const router = Router();

router.use(authenticate, requireAdmin);

router.get('/', getAllUsers);

router.get('/:id', getUserById);

router.patch('/:id/role', validate(updateUserRoleSchema), updateUserRole);

export default router;
