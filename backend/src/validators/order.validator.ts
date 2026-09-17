import { z } from 'zod';

export const createOrderSchema = z.object({
  firstName: z.string().min(2),

  lastName: z.string().min(2),

  phone: z.string().min(10),

  address: z.string().min(5),

  city: z.string().min(2),

  postalCode: z.string().min(5),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum([
    'PENDING',
    'PROCESSING',
    'SHIPPED',
    'DELIVERED',
    'CANCELLED',
  ]),
});

export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
