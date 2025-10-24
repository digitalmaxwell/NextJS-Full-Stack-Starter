import { z } from 'zod';

// Profile schemas
export const ProfileUpdateInput = z.object({
  name: z.string().min(1, 'Name is required'),
  timezone: z.string().min(1, 'Timezone is required'),
});

export type ProfileUpdateInput = z.infer<typeof ProfileUpdateInput>;

// Note schemas
export const NoteCreateInput = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
  content: z.string().optional(),
});

export const NoteUpdateInput = z.object({
  id: z.string().uuid(),
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long').optional(),
  content: z.string().optional(),
});

export const NoteDeleteInput = z.object({
  id: z.string().uuid(),
});

export type NoteCreateInput = z.infer<typeof NoteCreateInput>;
export type NoteUpdateInput = z.infer<typeof NoteUpdateInput>;
export type NoteDeleteInput = z.infer<typeof NoteDeleteInput>;

