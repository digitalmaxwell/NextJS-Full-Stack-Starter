import { router, protectedProcedure } from '../trpc';
import { Database } from '../db';
import { ProfileUpdateInput } from '@/lib/schemas';

export const profileRouter = router({
  get: protectedProcedure.query(async ({ ctx }) => {
    const db = new Database(ctx.supabase, ctx.user);
    return db.profileGet();
  }),

  update: protectedProcedure
    .input(ProfileUpdateInput)
    .mutation(async ({ ctx, input }) => {
      const db = new Database(ctx.supabase, ctx.user);
      return db.profileUpdate(input);
    }),
});

