import { z } from 'zod';

const PALETTE_COLORS = ['#E34664', '#364737', '#F5E6DB', '#B9D2D1', '#EB7822', '#6D483F', null];

export const createNoteSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  content: z.record(z.any()).optional(),
  plainText: z.string().optional(),
  folderId: z.string().optional().nullable(),
  tags: z.array(z.string()).optional(),
  color: z.enum(['#E34664', '#364737', '#F5E6DB', '#B9D2D1', '#EB7822', '#6D483F', '']).optional().nullable(),
  isPinned: z.boolean().optional(),
  isFavorite: z.boolean().optional(),
});

export const updateNoteSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters').optional(),
  content: z.record(z.any()).optional(),
  plainText: z.string().optional(),
  folderId: z.string().optional().nullable(),
  tags: z.array(z.string()).optional(),
  color: z.enum(['#E34664', '#364737', '#F5E6DB', '#B9D2D1', '#EB7822', '#6D483F', '']).optional().nullable(),
  isPinned: z.boolean().optional(),
  isFavorite: z.boolean().optional(),
  isArchived: z.boolean().optional(),
  isTrashed: z.boolean().optional(),
});

export const bulkUpdateNotesSchema = z.object({
  ids: z.array(z.string()).min(1, 'At least one note must be selected'),
  folderId: z.string().optional().nullable(),
  tags: z.array(z.string()).optional(),
  isPinned: z.boolean().optional(),
  isFavorite: z.boolean().optional(),
  isArchived: z.boolean().optional(),
  isTrashed: z.boolean().optional(),
});

export type CreateNoteInput = z.infer<typeof createNoteSchema>;
export type UpdateNoteInput = z.infer<typeof updateNoteSchema>;
export type BulkUpdateNotesInput = z.infer<typeof bulkUpdateNotesSchema>;
