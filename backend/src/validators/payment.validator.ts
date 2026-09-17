import { z } from 'zod';

export const verifyPaymentSchema = z.object({
  transactionId: z.string().min(5),
});

export type VerifyPaymentInput = z.infer<typeof verifyPaymentSchema>;
