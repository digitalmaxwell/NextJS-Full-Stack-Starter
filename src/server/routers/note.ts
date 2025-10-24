import { router, protectedProcedure } from '../trpc';
import { Database } from '../db';
import { NoteCreateInput, NoteUpdateInput, NoteDeleteInput } from '@/lib/schemas';
import { z } from 'zod';

export const noteRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    const db = new Database(ctx.supabase, ctx.user);
    return db.noteList();
  }),

  get: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const db = new Database(ctx.supabase, ctx.user);
      return db.noteGet(input.id);
    }),

  create: protectedProcedure
    .input(NoteCreateInput)
    .mutation(async ({ ctx, input }) => {
      const db = new Database(ctx.supabase, ctx.user);
      return db.noteCreate(input);
    }),

  update: protectedProcedure
    .input(NoteUpdateInput)
    .mutation(async ({ ctx, input }) => {
      const db = new Database(ctx.supabase, ctx.user);
      const { id, ...data } = input;
      return db.noteUpdate(id, data);
    }),

  delete: protectedProcedure
    .input(NoteDeleteInput)
    .mutation(async ({ ctx, input }) => {
      const db = new Database(ctx.supabase, ctx.user);
      return db.noteDelete(input.id);
    }),
});

