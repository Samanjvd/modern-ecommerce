import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z.string().min(2, 'نام دسته بندی حداقل باید ۲ کاراکتر باشد'),

  slug: z.string().min(2, 'slug الزامی است'),
  image: z.string().url().optional(),
});

export const updateCategorySchema = z.object({
  name: z.string().min(2).optional(),

  slug: z.string().min(2).optional(),
  image: z.string().url().optional(),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;

export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
