import { z } from 'zod';

const productColorSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'نام رنگ الزامی است')
    .max(30, 'نام رنگ بیش از حد طولانی است'),

  value: z
    .string()
    .trim()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'مقدار رنگ باید HEX معتبر باشد'),
});

export const createProductSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, 'عنوان محصول باید حداقل ۲ کاراکتر باشد')
    .max(200, 'عنوان محصول بیش از حد طولانی است'),

  slug: z
    .string()
    .trim()
    .min(2, 'Slug نامعتبر است')
    .max(200, 'Slug بیش از حد طولانی است')
    .regex(
      /^[a-z0-9-]+$/,
      'Slug فقط می‌تواند شامل حروف انگلیسی، اعداد و - باشد',
    ),

  description: z
    .string()
    .trim()
    .max(2000, 'توضیحات بیش از حد طولانی است')
    .optional(),

  brand: z
    .string()
    .trim()
    .min(1, 'برند الزامی است')
    .max(100, 'نام برند بیش از حد طولانی است'),

  price: z.number().int().positive('قیمت باید بیشتر از صفر باشد'),

  discountPrice: z
    .number()
    .int()
    .positive('قیمت تخفیف‌خورده باید بیشتر از صفر باشد')
    .optional(),

  discount: z.number().int().min(0).max(100).optional(),

  rating: z.number().min(0).max(5).default(0),

  reviewCount: z.number().int().min(0).default(0),

  stock: z.number().int().min(0, 'موجودی نمی‌تواند منفی باشد'),

  isNew: z.boolean().default(false),

  isPopular: z.boolean().default(false),

  isFeatured: z.boolean().default(false),

  categoryId: z.number().int().positive('شناسه دسته‌بندی نامعتبر است'),

  specifications: z.record(z.string(), z.unknown()).optional(),

  image: z.string().url('آدرس تصویر معتبر نیست').optional(),

  colors: z.array(productColorSchema).default([]),
});

export const updateProductSchema = createProductSchema.partial();

export type CreateProductInput = z.infer<typeof createProductSchema>;

export type UpdateProductInput = z.infer<typeof updateProductSchema>;
