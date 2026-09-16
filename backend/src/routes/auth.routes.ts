import { Router } from 'express';

import { getMe, login, register } from '../controllers/auth.controller.js';

import { authenticate } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { loginSchema, registerSchema } from '../validators/auth.validator.js';

const router = Router();

router.post('/register', validate(registerSchema), register);

router.post('/login', validate(loginSchema), login);

router.get('/me', authenticate, getMe);

export default router;
