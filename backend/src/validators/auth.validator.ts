import { z } from 'zod';

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'نام باید حداقل ۲ کاراکتر باشد')
    .max(50, 'نام بیش از حد طولانی است'),

  email: z.string().trim().email('ایمیل معتبر وارد کنید').toLowerCase(),

  password: z
    .string()
    .min(6, 'رمز عبور باید حداقل ۶ کاراکتر باشد')
    .max(100, 'رمز عبور بیش از حد طولانی است'),
});

export const loginSchema = z.object({
  email: z.string().trim().email('ایمیل معتبر وارد کنید').toLowerCase(),

  password: z.string().min(1, 'رمز عبور را وارد کنید'),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1),
});

export const logoutSchema = z.object({
  refreshToken: z.string().min(1),
});
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
