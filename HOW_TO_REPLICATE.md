# How to Replicate This Stack

This guide shows you how to recreate this entire stack from scratch using exact commands. Perfect for learning how everything fits together or adapting for your own projects.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Step 1: Initialize Next.js](#step-1-initialize-nextjs)
3. [Step 2: Install Core Dependencies](#step-2-install-core-dependencies)
4. [Step 3: Configure Tailwind CSS v4](#step-3-configure-tailwind-css-v4)
5. [Step 4: Set Up shadcn/ui](#step-4-set-up-shadcnui)
6. [Step 5: Initialize Supabase](#step-5-initialize-supabase)
7. [Step 6: Create Database Schema](#step-6-create-database-schema)
8. [Step 7: Set Up Supabase Clients](#step-7-set-up-supabase-clients)
9. [Step 8: Configure tRPC](#step-8-configure-trpc)
10. [Step 9: Implement Authentication Middleware](#step-9-implement-authentication-middleware)
11. [Step 10: Build Auth Pages](#step-10-build-auth-pages)
12. [Step 11: Create Example CRUD](#step-11-create-example-crud-notes)
13. [Step 12: Add Theme Support](#step-12-add-theme-support)
14. [Step 13: Configure Supabase Auth](#step-13-configure-supabase-auth)
15. [Step 14: TypeScript Best Practices](#step-14-typescript-best-practices)
16. [Step 15: Database Seeding](#step-15-database-seeding)
17. [Step 16: Testing and Validation](#step-16-testing-and-validation)
18. [Opinionated Decisions](#opinionated-decisions)

---

## Prerequisites

Before starting, install these tools:

- **Node.js 20+** - [Installation Guide](https://nodejs.org/en/download/package-manager)
- **pnpm** - [Installation Guide](https://pnpm.io/installation)
  ```bash
  npm install -g pnpm
  ```
- **Supabase Account** - [Sign Up](https://supabase.com/dashboard)
- **Supabase CLI** - [Installation Guide](https://supabase.com/docs/guides/cli/getting-started)
  ```bash
  brew install supabase/tap/supabase  # macOS
  # See docs for other platforms
  ```
- **Code Editor** - VS Code recommended

---

## Step 1: Initialize Next.js

Create a new Next.js project with TypeScript, Tailwind CSS, and App Router:

```bash
pnpm create next-app@latest my-app --typescript --tailwind --app --src-dir --import-alias "@/*"
cd my-app
```

**Documentation:**
- [create-next-app](https://nextjs.org/docs/app/api-reference/cli/create-next-app) - CLI reference
- [TypeScript in Next.js](https://nextjs.org/docs/app/building-your-application/configuring/typescript) - TypeScript configuration
- [App Router](https://nextjs.org/docs/app) - App Router overview
- [src Directory](https://nextjs.org/docs/app/building-your-application/configuring/src-directory) - Using src/ folder
- [Path Aliases](https://nextjs.org/docs/app/building-your-application/configuring/absolute-imports-and-module-aliases) - Import aliases

**What this does:**
- Creates a new Next.js 15 project
- Enables TypeScript for type safety
- Sets up Tailwind CSS for styling
- Uses App Router (not Pages Router)
- Organizes code in `src/` directory
- Configures `@/*` import alias

### Configure TypeScript Strict Mode

Update `tsconfig.json` to enforce strict type checking:

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "strict": true,  // ← Enables all strict type checking options
    "noEmit": true,
    // ... other options
  }
}
```

**What `strict: true` enforces:**
- `noImplicitAny` - Error on expressions with implied `any` type
- `strictNullChecks` - `null` and `undefined` handled correctly
- `strictFunctionTypes` - Function types checked properly
- `strictBindCallApply` - `bind`, `call`, `apply` type-checked

**Why ES2017 target:**
- Modern JavaScript features (async/await, object spread)
- Widely supported (Node 8+, all modern browsers)
- Good balance of features and compatibility

**Documentation:**
- [TypeScript Compiler Options](https://www.typescriptlang.org/tsconfig) - Full reference
- [Strict Mode](https://www.typescriptlang.org/tsconfig#strict) - What it enables

### Add ESLint Configuration

Create `.eslintrc.json` to ban `any` types and enforce best practices:

```json
{
  "extends": [
    "next/core-web-vitals",
    "next/typescript"
  ],
  "rules": {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unused-vars": ["error", {
      "argsIgnorePattern": "^_",
      "varsIgnorePattern": "^_"
    }],
    "@typescript-eslint/consistent-type-imports": ["error", {
      "prefer": "type-imports"
    }]
  }
}
```

**What these rules do:**
- `no-explicit-any` - **Bans `any` types** to maintain type safety
- `no-unused-vars` - Catches unused variables (allows `_` prefix for intentionally unused)
- `consistent-type-imports` - Enforces `import type` for type-only imports

**Documentation:**
- [ESLint Rules](https://eslint.org/docs/latest/rules/) - Core ESLint rules
- [@typescript-eslint](https://typescript-eslint.io/rules/) - TypeScript-specific rules

---

## Step 2: Install Core Dependencies

Install all required packages for the full stack:

```bash
# Supabase for authentication and database
pnpm add @supabase/ssr @supabase/supabase-js

# tRPC for type-safe API
pnpm add @trpc/server@11.4.0 @trpc/client@11.4.0 @trpc/react-query@11.4.0 @trpc/next@11.4.0

# Data fetching and validation
pnpm add @tanstack/react-query@5.80.7 superjson zod

# Styling utilities
pnpm add class-variance-authority clsx tailwind-merge

# UI utilities
pnpm add sonner next-themes

# Development tools
pnpm add -D supabase
```

**Documentation Links:**

**Supabase:**
- [@supabase/ssr](https://supabase.com/docs/guides/auth/server-side/nextjs) - Server-side auth for Next.js
- [@supabase/supabase-js](https://supabase.com/docs/reference/javascript) - JavaScript client library

**tRPC:**
- [tRPC](https://trpc.io/docs/quickstart) - Getting started guide
- [tRPC with Next.js](https://trpc.io/docs/client/nextjs) - Next.js App Router integration

**Data & Validation:**
- [TanStack Query](https://tanstack.com/query/latest/docs/framework/react/overview) - React Query for data fetching
- [superjson](https://github.com/blitz-js/superjson) - Serialize complex types (Date, Map, Set)
- [Zod](https://zod.dev/) - TypeScript-first schema validation

**Utilities:**
- [class-variance-authority](https://cva.style/docs) - CVA for component variants
- [clsx](https://github.com/lukeed/clsx) - Conditional className utility
- [tailwind-merge](https://github.com/dcastil/tailwind-merge) - Merge Tailwind classes intelligently
- [Sonner](https://sonner.emilkowal.ski/) - Toast notifications
- [next-themes](https://github.com/pacocoursey/next-themes) - Dark mode support

---

## Step 3: Configure Tailwind CSS v4

Update to Tailwind CSS v4 with the new @import syntax:

**1. Update `postcss.config.mjs`:**

```js
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
```

**2. Update `src/app/globals.css`:**

```css
@import "tailwindcss";

@theme inline {
  --color-primary: /* your colors */;
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

**Documentation:**
- [Tailwind CSS v4 Beta](https://tailwindcss.com/docs/v4-beta) - What's new in v4
- [@tailwindcss/postcss](https://tailwindcss.com/docs/installation/using-postcss) - PostCSS plugin setup
- [@theme directive](https://tailwindcss.com/docs/theme) - Inline theme configuration
- [CSS Variables](https://tailwindcss.com/docs/customizing-colors#using-css-variables) - Dynamic theming with CSS vars

**Key Changes:**
- `@import "tailwindcss"` replaces individual layer imports
- `@theme inline` for custom theme tokens
- More performant than v3

---

## Step 4: Set Up shadcn/ui

Initialize shadcn/ui and install base components:

```bash
# Initialize shadcn/ui
pnpm dlx shadcn@latest init
# Select: New York style, CSS variables, neutral base color

# Add essential components
pnpm dlx shadcn@latest add button card input label dialog dropdown-menu select
```

**Documentation:**
- [shadcn/ui Installation](https://ui.shadcn.com/docs/installation/next) - Next.js setup guide
- [shadcn/ui CLI](https://ui.shadcn.com/docs/cli) - CLI commands reference
- [Theming Guide](https://ui.shadcn.com/docs/theming) - Customize colors and styling
- [Component List](https://ui.shadcn.com/docs/components) - All available components

**What this does:**
- Installs shadcn/ui configuration
- Adds base UI components to your project
- Components are copied to `src/components/ui/`
- Full control - you own the code!

---

## Step 5: Initialize Supabase

Set up Supabase for your project:

```bash
# Initialize Supabase in your project
npx supabase init

# Log in to Supabase CLI
npx supabase login

# Link to your remote Supabase project
npx supabase link --project-ref your-project-ref
```

**Get your project ref:**
1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Create a new project (or use existing)
3. Go to Project Settings → General
4. Copy the "Reference ID"

**Documentation:**
- [Supabase CLI](https://supabase.com/docs/guides/cli) - CLI overview
- [supabase init](https://supabase.com/docs/reference/cli/supabase-init) - Initialize local config
- [supabase login](https://supabase.com/docs/reference/cli/supabase-login) - Authenticate CLI
- [supabase link](https://supabase.com/docs/reference/cli/supabase-link) - Link to remote project
- [Managing Config](https://supabase.com/docs/guides/cli/managing-config) - Configuration guide

---

## Step 6: Create Database Schema

Create and apply database migrations:

```bash
# Create a new migration file
npx supabase migration new initial_schema
```

**Edit the migration file** (`supabase/migrations/XXXXXX_initial_schema.sql`):

```sql
-- User profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  timezone TEXT DEFAULT 'UTC',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notes table (example CRUD)
CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can manage own notes" ON notes
  FOR ALL USING (auth.uid() = user_id);

-- Trigger to create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, name)
  VALUES (NEW.id, NEW.email, SPLIT_PART(NEW.email, '@', 1));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

#### How Triggers Work: Synchronous Execution

**Important:** PostgreSQL triggers are **synchronous** and part of the transaction.

When a user signs up:
1. Supabase Auth inserts into `auth.users`
2. **Trigger fires immediately** (blocks the INSERT)
3. Profile is created
4. If trigger succeeds → user creation completes
5. If trigger fails → entire transaction rolls back (no user created)

**This means:**
- ✅ Profile **always** exists when user is created
- ✅ Can't have orphaned users without profiles
- ✅ Atomic operation (all-or-nothing)
- ⚠️ Trigger errors prevent user signup (good for data integrity)

**Response time:** The signup request waits for the trigger (~5-10ms overhead).

**Why this matters:**
- Your application can assume profiles exist for all users
- No race conditions or async timing issues
- Database enforces data integrity automatically

**Documentation:**
- [PostgreSQL Triggers](https://www.postgresql.org/docs/current/triggers.html) - How triggers work
- [Trigger Timing](https://www.postgresql.org/docs/current/trigger-definition.html) - BEFORE vs AFTER
- [Supabase Auth Triggers](https://supabase.com/docs/guides/auth/managing-user-data#using-triggers) - User creation patterns

**Apply migrations:**

```bash
# Apply to local database
npx supabase db reset

# Push to remote (production)
npx supabase db push

# Generate TypeScript types from database
npx supabase gen types typescript --local > src/lib/database.types.ts
```

**What type generation does:**

Reads your database schema and creates TypeScript types for:
- Each table's Row, Insert, and Update types
- Database functions
- Enums and composite types

This gives you autocomplete and type safety when using the Supabase client!

**Documentation:**
- [Database Migrations](https://supabase.com/docs/guides/cli/local-development#database-migrations) - Migration workflow
- [supabase migration new](https://supabase.com/docs/reference/cli/supabase-migration-new) - Create migration
- [supabase db push](https://supabase.com/docs/reference/cli/supabase-db-push) - Apply to remote
- [Generating Types](https://supabase.com/docs/guides/api/rest/generating-types) - TypeScript type generation
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security) - RLS policies guide

---

## Step 7: Set Up Supabase Clients

Create server and browser Supabase clients:

**1. Server Client** (`src/lib/supabase/server.ts`):

```typescript
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );
}
```

**2. Browser Client** (`src/lib/supabase/client.ts`):

```typescript
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

**Documentation:**
- [Supabase Auth with Next.js](https://supabase.com/docs/guides/auth/server-side/nextjs) - Complete integration guide
- [SSR Package](https://supabase.com/docs/reference/javascript/ssr-package) - @supabase/ssr API reference
- [createServerClient](https://supabase.com/docs/reference/javascript/initializing#create-a-server-client) - Server setup
- [createBrowserClient](https://supabase.com/docs/reference/javascript/initializing#create-a-browser-client) - Browser setup
- [Cookie Management](https://supabase.com/docs/guides/auth/server-side/nextjs#creating-a-supabase-client) - SSR cookie handling

**Why two clients?**
- Server: For Server Components, API routes, middleware
- Browser: For Client Components, client-side auth

---

## Step 8: Configure tRPC

Set up tRPC for type-safe APIs:

**1. Server Setup** (`src/server/trpc/index.ts`):

```typescript
import { initTRPC, TRPCError } from '@trpc/server';
import { type FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';
import { createClient } from '@/lib/supabase/server';
import superjson from 'superjson';
import { ZodError } from 'zod';

export async function createContext(opts: FetchCreateContextFnOptions) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return {
    supabase,
    user,
  };
}

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const router = t.router;
export const publicProcedure = t.procedure;

const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({ ctx: { ...ctx, user: ctx.user } });
});

export const protectedProcedure = t.procedure.use(enforceUserIsAuthed);
```

**2. Client Setup** (`src/lib/trpc/client.tsx`):

```typescript
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { createTRPCReact } from '@trpc/react-query';
import { useState } from 'react';
import superjson from 'superjson';
import type { AppRouter } from '@/server/routers';

export const api = createTRPCReact<AppRouter>();

export function TRPCProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    api.createClient({
      links: [
        httpBatchLink({
          url: '/api/trpc',
          transformer: superjson,
        }),
      ],
    })
  );

  return (
    <api.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </api.Provider>
  );
}
```

**3. HTTP Handler** (`src/app/api/trpc/[trpc]/route.ts`):

```typescript
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from '@/server/routers';
import { createContext } from '@/server/trpc';

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext,
  });

export { handler as GET, handler as POST };
```

**Documentation:**
- [tRPC Quickstart](https://trpc.io/docs/quickstart) - Getting started
- [tRPC with App Router](https://trpc.io/docs/client/tanstack-react-query/server-components) - React Server Components
- [tRPC Next.js Setup](https://trpc.io/docs/client/nextjs/setup) - Pages Router (reference)
- [Context](https://trpc.io/docs/server/context) - Creating request context
- [Procedures](https://trpc.io/docs/server/procedures) - Queries and mutations
- [React Query Integration](https://trpc.io/docs/client/react) - React hooks
- [Error Handling](https://trpc.io/docs/server/error-handling) - Custom errors
- [superjson Transformer](https://trpc.io/docs/server/data-transformers#using-superjson) - Serialize complex types

**What you get:**
- Full type safety from client to server
- Automatic TypeScript inference
- Built-in React hooks
- Error handling with Zod validation

---

## Step 9: Implement Authentication Middleware

Protect routes with Next.js middleware:

**Create** `src/middleware.ts`:

```typescript
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // Protect authenticated routes
  if (!user && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  // Redirect authenticated users away from auth pages
  if (user && request.nextUrl.pathname.startsWith('/signin')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
};
```

**Documentation:**
- [Next.js Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware) - Middleware basics
- [Supabase Auth Helpers](https://supabase.com/docs/guides/auth/server-side/creating-a-client) - Server-side patterns
- [Middleware with Supabase](https://supabase.com/docs/guides/auth/server-side/nextjs#creating-a-supabase-client-in-middleware) - Full example
- [Route Protection](https://nextjs.org/docs/app/building-your-application/routing/middleware#matching-paths) - Path matching

---

## Step 10: Build Auth Pages

Create authentication pages (signin, signup, forgot/reset password).

See the boilerplate files for complete implementations:
- `src/app/signin/page.tsx` - Sign in with email/password and Google
- `src/app/signup/page.tsx` - User registration
- `src/app/forgot-password/page.tsx` - Password recovery
- `src/app/reset-password/page.tsx` - Password reset
- `src/app/auth/callback/route.ts` - OAuth callback handler

**Documentation:**
- [Supabase Auth](https://supabase.com/docs/guides/auth) - Auth overview
- [Email/Password Auth](https://supabase.com/docs/guides/auth/auth-email) - Email authentication
- [OAuth with Google](https://supabase.com/docs/guides/auth/social-login/auth-google) - Google OAuth setup
- [Password Reset](https://supabase.com/docs/guides/auth/auth-password-reset) - Reset flow
- [Email Templates](https://supabase.com/docs/guides/auth/auth-email-templates) - Customize emails
- [Redirect URLs](https://supabase.com/docs/guides/auth/redirect-urls) - OAuth callbacks

---

## Step 11: Create Example CRUD (Notes)

Build a complete CRUD feature to demonstrate patterns:

**1. Database Operations** (`src/server/db/note.ts`)
**2. tRPC Router** (`src/server/routers/note.ts`)
**3. React Component** (`src/components/notes/NotesManager.tsx`)

See boilerplate files for complete implementations.

**Documentation:**
- [tRPC Mutations](https://trpc.io/docs/client/react/useMutation) - Creating mutations
- [tRPC Queries](https://trpc.io/docs/client/react/useQuery) - Fetching data
- [Optimistic Updates](https://tanstack.com/query/latest/docs/framework/react/guides/optimistic-updates) - Instant UI feedback
- [Input Validation](https://trpc.io/docs/server/validators) - Zod with tRPC
- [Supabase CRUD](https://supabase.com/docs/reference/javascript/select) - Database operations

**Patterns demonstrated:**
- Type-safe API calls
- Optimistic UI updates
- Form validation with Zod
- Error handling
- Loading states

---

## Step 12: Add Theme Support

Implement dark/light mode:

**1. Theme Provider** (`src/lib/theme-provider.tsx`)
**2. Add to root layout**
**3. Create theme toggle component**

**Documentation:**
- [next-themes](https://github.com/pacocoursey/next-themes#readme) - Theme provider documentation
- [Tailwind Dark Mode](https://tailwindcss.com/docs/dark-mode) - Dark mode configuration
- [CSS Variables Theming](https://ui.shadcn.com/docs/theming) - shadcn/ui theming

---

## Step 13: Configure Supabase Auth

Configure authentication in Supabase Dashboard:

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to Authentication → URL Configuration
4. Add redirect URLs:
   - `http://localhost:3000/auth/callback` (development)
   - `https://yourdomain.com/auth/callback` (production)
5. Go to Authentication → Providers
6. Enable Email provider
7. (Optional) Configure Google OAuth:
   - Enable Google provider
   - Add Google Client ID and Secret
   - Configure authorized redirect URIs in Google Cloud Console

**Documentation:**
- [Supabase Dashboard](https://supabase.com/dashboard) - Project dashboard
- [Auth Settings](https://supabase.com/docs/guides/auth/auth-smtp) - SMTP configuration
- [OAuth Providers](https://supabase.com/docs/guides/auth/social-login) - Provider setup
- [Email Templates](https://supabase.com/docs/guides/auth/auth-email-templates) - Customization

---

## Step 14: TypeScript Best Practices

### Avoiding `any` Types

Our ESLint configuration bans `any` types to maintain type safety. Here's how to handle different scenarios:

#### Bad - Using `any`:
```typescript
const data: any = await fetch('/api/data');
// No type safety, no autocomplete, defeats TypeScript
```

#### Good - Proper Typing:
```typescript
type ApiResponse = { notes: Note[] };
const response = await fetch('/api/data');
const data: ApiResponse = await response.json();
// Full type safety and autocomplete
```

#### Good - Using `unknown`:
```typescript
const data: unknown = await someExternalLib();

// Type guard to validate
if (isNoteArray(data)) {
  // TypeScript now knows data is Note[]
  data.forEach(note => console.log(note.title));
}
```

#### When You MUST Use `any` (Rare):
```typescript
// Inline override with explanation
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const legacyLib: any = require('old-untyped-library');
```

### Better Alternatives to `any`

**For object maps:**
```typescript
// ❌ Bad
const config: any = { key: 'value' };

// ✅ Good
const config: Record<string, unknown> = { key: 'value' };
```

**For function parameters:**
```typescript
// ❌ Bad
function process(data: any) { }

// ✅ Good - Use generic
function process<T>(data: T) { }

// ✅ Good - Use unknown + validation
function process(data: unknown) {
  if (isValidData(data)) {
    // Now data is typed
  }
}
```

**For arrays:**
```typescript
// ❌ Bad
const items: any[] = [1, 'hello', true];

// ✅ Good - Use union
const items: (number | string | boolean)[] = [1, 'hello', true];

// ✅ Better - Create specific type
type Item = { id: number; name: string };
const items: Item[] = [{ id: 1, name: 'test' }];
```

**Documentation:**
- [TypeScript Handbook - Everyday Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)
- [unknown vs any](https://www.typescriptlang.org/docs/handbook/2/functions.html#unknown)
- [Type Guards](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)

---

## Step 15: Database Seeding

Create `supabase/seed.sql` for development data:

```sql
-- =============================================================================
-- SEED DATA - Development and Testing
-- =============================================================================
-- Run with: npx supabase db reset (automatically runs seed.sql)

DO $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Get first user (create via signup or dashboard first)
  SELECT id INTO v_user_id FROM auth.users LIMIT 1;
  
  IF v_user_id IS NOT NULL THEN
    -- Seed example notes
    INSERT INTO notes (user_id, title, content) VALUES
      (v_user_id, 'Welcome!', 'This is your first note'),
      (v_user_id, 'Getting Started', 'Tips for using the app'),
      (v_user_id, 'Example Note', 'You can create, edit, delete');
      
    RAISE NOTICE 'Seeded data for user %', v_user_id;
  ELSE
    RAISE NOTICE 'No users found. Create a user first.';
  END IF;
END $$;
```

**Update `supabase/config.toml`:**
```toml
[db.seed]
enabled = true
sql_paths = ["./seed.sql"]
```

**Documentation:**
- [Supabase Local Development](https://supabase.com/docs/guides/cli/local-development) - Using seed files
- [PostgreSQL DO Blocks](https://www.postgresql.org/docs/current/sql-do.html) - Anonymous code blocks

---

## Step 16: Testing and Validation

Verify everything works:

```bash
# Type check
pnpm tsc --noEmit

# Lint (will error on any types)
pnpm lint

# Build for production
pnpm build

# Start development server
pnpm dev
```

**Test the flow:**
1. Sign up with email
2. Verify email (check Supabase Inbucket in local dev)
3. Create a note
4. Edit and delete notes
5. Sign out and sign in again
6. Test dark/light mode toggle

**Documentation:**
- [Next.js Testing](https://nextjs.org/docs/app/building-your-application/testing) - Testing overview
- [Type Safety](https://trpc.io/docs/quickstart#end-to-end-type-safety) - tRPC benefits
- [RLS Testing](https://supabase.com/docs/guides/auth/row-level-security#testing-policies) - Test policies

---

## Opinionated Decisions

This stack makes specific choices. Here's the reasoning:

### **SQL Functions vs TypeScript: The Hybrid Approach**

**Why we use BOTH:** Different tools for different jobs

This boilerplate uses **TypeScript for simple CRUD** and **SQL functions for complex operations**. This is intentional.

#### When to Use SQL Functions

**1. Batch Operations**

Example from `001_initial_schema.sql`:
```sql
CREATE FUNCTION handle_new_user() RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, name)
  VALUES (NEW.id, NEW.email, SPLIT_PART(NEW.email, '@', 1));
  RETURN NEW;
END;
$$;
```

**Why SQL:** Automatic execution on user creation. Can't be forgotten or bypassed.

**2. Complex Multi-Step Operations**

For operations creating many related records (e.g., initializing user data, batch imports):
- **SQL**: 1 function call, 1 transaction, ~50ms
- **TypeScript**: Many round-trips or complex batching, ~2000ms+

**3. Data Integrity**

SQL functions run in database transactions - either all succeed or all fail. No partial states.

**4. Timezone Operations**

PostgreSQL timezone handling is battle-tested:
```sql
(date::TEXT || ' ' || time::TEXT || ' ' || timezone)::TIMESTAMPTZ
```

vs complex JavaScript timezone libraries.

#### When to Use TypeScript/tRPC

**1. Simple CRUD** (see `src/server/db/note.ts`)

```typescript
async create(data: { title: string; content?: string }) {
  const { data: note } = await this.supabase
    .from('notes')
    .insert({ user_id: this.user.id, ...data })
    .select()
    .single();
  return note;
}
```

**Why TypeScript:**
- Full type safety
- Easy to test
- Great developer experience
- Type inference from Supabase

**2. Business Logic That Changes Frequently**

Application code is easier to iterate on than database functions.

**3. External API Integration**

TypeScript is better for HTTP requests, webhooks, etc.

#### When SQL Wins: Real Example

Imagine creating related records for a multi-day event scheduler (100+ records with complex relationships):

- **SQL function**: Single transaction, ~50ms
- **TypeScript**: Multiple network calls, ~5,000ms+

**For simple operations**, performance is similar. See [README.md](./README.md#performance-benchmarks) for detailed benchmarks and complete trade-offs table.

---

### **tRPC over REST/GraphQL**

**Why:** End-to-end type safety without code generation

- REST requires manual type synchronization or code generation
- GraphQL requires schema definitions and codegen
- tRPC gives you types automatically from your TypeScript code

[Read more](https://trpc.io/docs/main/introduction)

### **Supabase over Other Backends**

**Why:** All-in-one backend with PostgreSQL

- PostgreSQL is battle-tested and powerful
- Built-in authentication saves weeks of development
- Row Level Security provides database-level authorization
- Real-time subscriptions without additional setup

[Read more](https://supabase.com/docs)

### **pnpm over npm/yarn**

**Why:** Faster and more efficient

- Up to 2x faster installation
- Saves gigabytes with content-addressable storage
- Stricter, prevents phantom dependencies

[Benchmarks](https://pnpm.io/benchmarks)

### **Domain-Driven Structure**

**Why:** Scales better for complex applications

- Easy to find all code related to a feature
- Clear boundaries between domains
- Multiple developers can work independently
- Better than organizing by technical layers

[Discussion](https://profy.dev/article/react-folder-structure)

### **Tailwind CSS v4**

**Why:** Performance and better DX

- New engine is significantly faster
- Improved @import and @theme syntax
- Better integration with modern tools

[Migration Guide](https://tailwindcss.com/docs/upgrade-guide)

### **shadcn/ui Copy/Paste Approach**

**Why:** Full control over components

- Own the code, modify as needed
- No npm package bloat
- Understand exactly how components work
- Built on Radix UI primitives

[Philosophy](https://ui.shadcn.com/docs)

---

## Next Steps

You now have a complete understanding of how this stack is built! 

- **Customize** - Make it your own
- **Extend** - Add features like file uploads, webhooks, etc.
- **Deploy** - Push to Vercel or your preferred host
- **Learn** - Dive deeper into each technology

**Happy building!** 🚀

