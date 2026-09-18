import { Router } from 'express';

import { createReview } from '../controllers/review.controller.js';

import { authenticate } from '../middleware/auth.middleware.js';

import { validate } from '../middleware/validate.middleware.js';

import { createReviewSchema } from '../validators/review.validator.js';

const router = Router();

router.post(
  '/products/:id/reviews',
  authenticate,
  validate(createReviewSchema),
  createReview,
);

export default router;
