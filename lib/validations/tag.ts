import { z } from 'zod';

export const createTagSchema = z.object({
  name: z.string().min(1, 'Name is required').max(30, 'Name must be less than 30 characters'),
  color: z.enum(['#E34664', '#364737', '#F5E6DB', '#B9D2D1', '#EB7822', '#6D483F', '']).optional().nullable(),
});

export const updateTagSchema = z.object({
  name: z.string().min(1, 'Name is required').max(30, 'Name must be less than 30 characters').optional(),
  color: z.enum(['#E34664', '#364737', '#F5E6DB', '#B9D2D1', '#EB7822', '#6D483F', '']).optional().nullable(),
});

export type CreateTagInput = z.infer<typeof createTagSchema>;
export type UpdateTagInput = z.infer<typeof updateTagSchema>;
