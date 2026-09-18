import { z } from 'zod';

export const createReviewSchema = z.object({
  comment: z.string().min(5, 'متن نظر حداقل ۵ کاراکتر باشد').max(500),

  rating: z.number().min(1).max(5),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
