import { Router } from 'express';

import {
  getMe,
  updateProfile,
  changePassword,
} from '../controllers/user.controller.js';

import { authenticate } from '../middleware/auth.middleware.js';

import { validate } from '../middleware/validate.middleware.js';

import {
  updateProfileSchema,
  changePasswordSchema,
} from '../validators/user.validator.js';

const router = Router();

router.use(authenticate);

router.get('/me', getMe);

router.patch('/me', validate(updateProfileSchema), updateProfile);

router.patch('/password', validate(changePasswordSchema), changePassword);

export default router;
