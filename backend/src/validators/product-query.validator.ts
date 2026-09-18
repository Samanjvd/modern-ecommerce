import { z } from 'zod';

export const productQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),

  limit: z.coerce.number().min(1).max(50).default(12),

  search: z.string().optional(),

  category: z.string().optional(),

  brands: z.string().optional(),

  minPrice: z.coerce.number().optional(),

  maxPrice: z.coerce.number().optional(),

  rating: z.coerce.number().min(1).max(5).optional(),

  availability: z.coerce.boolean().optional(),

  sort: z.enum(['newest', 'price_asc', 'price_desc', 'popular']).optional(),

  ram: z.string().optional(),

  storage: z.string().optional(),

  cpu: z.string().optional(),

  operatingSystem: z.string().optional(),

  connectionType: z.string().optional(),

  bluetooth: z.coerce.boolean().optional(),

  noiseCancellation: z.coerce.boolean().optional(),

  microphone: z.coerce.boolean().optional(),
});
