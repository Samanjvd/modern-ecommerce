import { z } from 'zod';

export const checkoutSchema = z.object({
  fullName: z
    .string()
    .min(3, 'نام و نام خانوادگی را وارد کنید')
    .max(100, 'نام و نام خانوادگی بیش از حد طولانی است'),

  phone: z.string().regex(/^09\d{9}$/, 'شماره موبایل معتبر وارد کنید'),

  province: z.string().min(2, 'استان را انتخاب کنید'),

  city: z.string().min(2, 'شهر را وارد کنید'),

  address: z
    .string()
    .min(10, 'آدرس باید حداقل ۱۰ کاراکتر باشد')
    .max(300, 'آدرس بیش از حد طولانی است'),

  postalCode: z.string().regex(/^\d{10}$/, 'کد پستی باید ۱۰ رقم باشد'),

  description: z.string().max(500, 'توضیحات بیش از حد طولانی است').optional(),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;
