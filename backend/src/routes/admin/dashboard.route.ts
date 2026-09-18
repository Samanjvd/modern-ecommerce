import { Router } from 'express';

import { getDashboardStats } from '../../controllers/admin/dashboard.controller.js';

import { authenticate } from '../../middleware/auth.middleware.js';

import { requireAdmin } from '../../middleware/admin.middleware.js';

const router = Router();

router.get('/', authenticate, requireAdmin, getDashboardStats);

export default router;
