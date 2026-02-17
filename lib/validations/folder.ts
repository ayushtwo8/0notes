import { z } from 'zod';

export const createFolderSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name must be less than 50 characters'),
  parentId: z.string().optional().nullable(),
  color: z.enum(['#E34664', '#364737', '#F5E6DB', '#B9D2D1', '#EB7822', '#6D483F', '']).optional().nullable(),
  icon: z.string().optional(),
});

export const updateFolderSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name must be less than 50 characters').optional(),
  color: z.enum(['#E34664', '#364737', '#F5E6DB', '#B9D2D1', '#EB7822', '#6D483F', '']).optional().nullable(),
  icon: z.string().optional(),
  order: z.number().optional(),
});

export const reorderFoldersSchema = z.object({
  folders: z.array(z.object({
    id: z.string(),
    order: z.number(),
    parentId: z.string().nullable(),
  })),
});

export type CreateFolderInput = z.infer<typeof createFolderSchema>;
export type UpdateFolderInput = z.infer<typeof updateFolderSchema>;
export type ReorderFoldersInput = z.infer<typeof reorderFoldersSchema>;
