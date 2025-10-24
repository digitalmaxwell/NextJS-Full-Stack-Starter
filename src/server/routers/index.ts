import { router } from '../trpc';
import { profileRouter } from './profile';
import { noteRouter } from './note';

export const appRouter = router({
  profile: profileRouter,
  note: noteRouter,
});

export type AppRouter = typeof appRouter;

