import { z } from 'zod';

export const updateUserRoleSchema = z.object({
  role: z.enum(['USER', 'ADMIN']),
});

export type UpdateUserRoleInput = z.infer<typeof updateUserRoleSchema>;
