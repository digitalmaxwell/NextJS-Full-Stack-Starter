# Next.js Full-Stack Starter

Production-ready boilerplate with Next.js 15, Supabase, tRPC v11, and Tailwind CSS v4.

> **Opinionated Setup** - This uses specific architectural patterns. See [Why These Choices?](#🎯-why-these-choices) for detailed rationale.

**Want to build this from scratch?** See [HOW_TO_REPLICATE.md](./HOW_TO_REPLICATE.md) for a complete step-by-step guide.

## Table of Contents

- [Quick Start](#🚀-quick-start)
- [What's Included](#✨-whats-included)
- [Tech Stack](#📚-tech-stack)
- [Architecture](#🏗️-architecture)
  - [Database-Level Logic](#database-level-logic-with-postgresql)
  - [End-to-End Type Safety](#end-to-end-type-safety-with-trpc)
  - [Row Level Security](#row-level-security-rls)
  - [Domain-Driven Organization](#domain-driven-organization)
- [Project Structure](#📁-project-structure)
- [Configuration](#🔧-configuration)
  - [Environment Variables](#environment-variables)
  - [Supabase Configuration](#supabase-configuration)
  - [TypeScript & ESLint](#typescript--eslint)
  - [Database Seeding](#database-seeding)
- [Development](#🛠️-development)
  - [Commands](#commands)
  - [Adding New Features](#adding-new-features)
- [Deployment](#🚢-deployment)
- [Why These Choices?](#🎯-why-these-choices)
- [Learn More](#📖-learn-more)

---

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Configure environment
cp .env.example .env.local
# Add your Supabase credentials to .env.local

# Set up Supabase
npx supabase login
npx supabase link --project-ref your-project-ref
npx supabase db push

# Generate TypeScript types from database
pnpm db:types

# Start development
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000)

**Need help getting credentials?** See [Configuration](#🔧-configuration) section below.

---

## ✨ What's Included

- ✅ **Complete Authentication** - Email/password + Google OAuth
- ✅ **Type-Safe API** - tRPC with end-to-end TypeScript
- ✅ **Database Security** - Row Level Security (RLS) policies
- ✅ **Example CRUD** - Notes feature demonstrating all patterns
- ✅ **Dark/Light Mode** - Theme support with next-themes
- ✅ **Strict TypeScript** - No `any` types allowed (ESLint enforced)
- ✅ **Responsive Design** - Mobile-first with Tailwind CSS v4
- ✅ **Database Seeding** - Example seed data for development

---

## 📚 Tech Stack

| Technology | Version | Purpose | Documentation |
|-----------|---------|---------|---------------|
| **Next.js** | 15.3 | React framework | [Docs](https://nextjs.org/docs) |
| **Supabase** | Latest | PostgreSQL + Auth + RLS | [Docs](https://supabase.com/docs) |
| **tRPC** | 11.4 | Type-safe API | [Docs](https://trpc.io/docs) |
| **Tailwind CSS** | 4.1 | Utility-first styling | [Docs](https://tailwindcss.com/docs) |
| **shadcn/ui** | Latest | Component library | [Docs](https://ui.shadcn.com/) |
| **TypeScript** | 5.8 | Type safety | [Docs](https://typescriptlang.org/docs) |

---

## 🏗️ Architecture

### Database-Level Logic with PostgreSQL

This boilerplate leverages PostgreSQL's powerful features like functions and triggers alongside the Supabase JavaScript client.

#### PostgreSQL Functions & Triggers

**1. Triggers (automatic execution)**

Example: Auto-create profile when user signs up
```sql
CREATE FUNCTION handle_new_user() RETURNS TRIGGER AS $$
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

**How it connects to Supabase Auth:**

1. User calls `supabase.auth.signUp({ email, password })`
2. Supabase Auth inserts into `auth.users` table
3. PostgreSQL detects INSERT on `auth.users`
4. Trigger fires automatically with `NEW` = the new user row
5. Function accesses `NEW.id`, `NEW.email` from the inserted row
6. Profile is created using the new user's data
7. Transaction completes (or rolls back if trigger fails)

**Why:** Automatic, guaranteed execution. Profile always exists. (~5ms overhead)

**2. Complex multi-step operations** - Update multiple tables atomically (all succeed or all fail)

**3. Data integrity** - Rules enforced at database level, can't be bypassed

**For everything else:** Use the Supabase JavaScript client (see `src/server/db/note.ts`):
```typescript
async list() {
  const { data } = await this.supabase
    .from('notes')
    .select('*')
    .eq('user_id', this.user.id);
  return data || [];
}
```

**Why:** Full TypeScript types, easy testing, familiar patterns.

**Learn more:**
- [Supabase Database Functions](https://supabase.com/docs/guides/database/functions)
- [PostgreSQL Triggers](https://www.postgresql.org/docs/current/triggers.html)

---

### End-to-End Type Safety with tRPC

tRPC provides automatic type safety from your database to your UI **with minimal setup**.

#### How Types Flow

```
Database (PostgreSQL)
    ↓
Supabase CLI (generates src/lib/database.types.ts)
    ↓
Supabase Client (typed with Database types)
    ↓
tRPC Router (TypeScript functions)
    ↓
tRPC Client (automatic type inference)
    ↓
React Components (fully typed data)
```

#### Real Example

**1. Database operation** (`src/server/db/note.ts`):
```typescript
async list() {
  const { data } = await this.supabase
    .from('notes')
    .select('*')
    .eq('user_id', this.user.id);
  return data || [];  // ← Supabase infers type from 'notes' table
}
```

**2. tRPC router** (`src/server/routers/note.ts`):
```typescript
export const noteRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    const db = new Database(ctx.supabase, ctx.user);
    return db.noteList();  // ← Return type inferred from db.noteList()
  }),
});
```

**3. React component** (`src/components/notes/NotesManager.tsx`):
```typescript
const { data: notes } = api.note.list.useQuery();
//     ^? Note[] - Fully typed, autocomplete works!

notes.map(note => (
  <div key={note.id}>
    {note.title}  // ← TypeScript knows all fields
  </div>
))
```

#### Generating Database Types

After creating migrations, generate TypeScript types:

```bash
npx supabase gen types typescript --local > src/lib/database.types.ts
```

This creates type definitions for all your tables:
```typescript
export type Database = {
  public: {
    Tables: {
      notes: {
        Row: { id: string; title: string; ... }
        Insert: { title: string; content?: string; ... }
        Update: { title?: string; ... }
      }
    }
  }
}
```

#### The Magic

**Automatic type inference across the stack:**
- Supabase queries are typed from `database.types.ts`
- tRPC routers infer types from function returns
- React components get types from tRPC procedures
- **Change database → Run type gen → Get TypeScript errors → Fix with autocomplete**

**If you change the database:**
1. Update migration (`npx supabase migration new your_change`)
2. Apply migration (`npx supabase db push`)
3. Regenerate types (`npx supabase gen types typescript --local > src/lib/database.types.ts`)
4. TypeScript errors guide you to update components
5. Deploy with confidence

**Learn more:**
- [Generating Supabase Types](https://supabase.com/docs/guides/api/rest/generating-types)
- [tRPC Type Safety](https://trpc.io/docs/quickstart#end-to-end-type-safety)

---

### Row Level Security (RLS)

PostgreSQL's RLS enforces authorization **at the database level**, not in application code.

#### The Security Problem

**Traditional Approach (❌):**
```typescript
// Every query must manually check permissions
async getNotes(userId: string) {
  const notes = await db.notes.findMany();
  // BUG: Forgot to filter by user!
  return notes; // ← Security vulnerability! Returns ALL notes
}
```

**With RLS (✅):**
```sql
-- Set once in migration
CREATE POLICY "Users see own notes" ON notes
  FOR SELECT USING (auth.uid() = user_id);
```

```typescript
// Database automatically filters - can't forget!
async getNotes() {
  const { data } = await this.supabase
    .from('notes')
    .select('*');
  // ← Only returns current user's notes, guaranteed
  return data;
}
```

#### Benefits

1. **Can't Be Bypassed** - Works with direct SQL, Supabase Studio, all database tools
2. **Single Source of Truth** - Authorization in migrations, applies everywhere
3. **Performance** - Database-level filtering uses indexes efficiently
4. **Audit Trail** - Policies version controlled and easy to review

**Learn more:**
- [PostgreSQL RLS Documentation](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
- [Supabase RLS Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [RLS Best Practices](https://supabase.com/docs/guides/database/postgres/row-level-security#security-best-practices)

---

### Domain-Driven Organization

Code is organized by **business domain** (profile, note), not technical layer (controllers, models).

```
src/server/
├── db/
│   ├── profile.ts    # All profile operations together
│   └── note.ts       # All note operations together
└── routers/
    ├── profile.ts    # Profile API routes
    └── note.ts       # Note API routes
```

**Why this approach:**
- **Scales better** - Easy to find all code related to a feature
- **Clear boundaries** - Each domain is self-contained
- **Team-friendly** - Multiple developers work independently
- **Avoids "utils hell"** - Functions live near their domain

**Learn more:**
- [Domain-Driven Design in React](https://khalilstemmler.com/articles/domain-driven-design-intro/) (Khalil Stemmler)
- [Bulletproof React](https://github.com/alan2207/bulletproof-react) - Domain-based architecture
- [Feature-Sliced Design](https://feature-sliced.design/) - Alternative modern approach

---

## 📁 Project Structure

```
src/
├── app/                      # Next.js App Router
│   ├── (authenticated)/      # Protected routes
│   │   ├── dashboard/        # User dashboard
│   │   ├── notes/            # Notes CRUD example
│   │   └── profile/          # Profile settings
│   ├── api/
│   │   ├── auth/             # Auth API routes
│   │   └── trpc/             # tRPC HTTP handler
│   └── signin/               # Authentication pages
│
├── components/
│   ├── notes/                # Notes feature
│   ├── profile/              # Profile components
│   ├── shared/               # Shared components
│   └── ui/                   # shadcn/ui components
│
├── lib/
│   ├── supabase/             # Supabase clients (server + browser)
│   ├── trpc/                 # tRPC client setup
│   └── schemas.ts            # Zod validation schemas
│
└── server/
    ├── db/                   # Database operations (domain-organized)
    ├── routers/              # tRPC routers (domain-organized)
    └── trpc/                 # tRPC server setup
```

---

## 🔧 Configuration

### Environment Variables

Get your Supabase credentials from [supabase.com/dashboard](https://supabase.com/dashboard):

1. Create a new project
2. Go to Project Settings → API
3. Copy your URL and anon key

**Create `.env.local`:**
```env
# Required
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Optional (Google OAuth)
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret

# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

### Supabase Configuration

**`supabase/config.toml`** - Local development configuration

This file configures your local Supabase instance (runs with `npx supabase start`):

```toml
[db]
port = 54322              # Local database port
major_version = 15        # PostgreSQL version

[db.seed]
enabled = true
sql_paths = ["./seed.sql"]  # Auto-runs on db reset

[auth]
site_url = "http://127.0.0.1:3000"
enable_signup = true

[auth.external.google]
enabled = true
client_id = "env(GOOGLE_CLIENT_ID)"  # Reads from .env
secret = "env(GOOGLE_CLIENT_SECRET)"
```

**What it controls:**
- **Database settings** - Port, version, pooling
- **Authentication** - OAuth providers, email settings, rate limits
- **Local services** - API, Studio, Inbucket (email testing)
- **Seed data** - Automatically runs `seed.sql` on `db reset`

**Key features:**
- Environment variable substitution with `env(VAR_NAME)`
- Mirrors production settings locally
- Version controlled configuration
- Email testing with Inbucket (see emails at `localhost:54324`)

**Documentation:**
- [Supabase Config Reference](https://supabase.com/docs/guides/cli/config) - Complete guide
- [Local Development](https://supabase.com/docs/guides/cli/local-development) - Using local Supabase
- [Managing Environments](https://supabase.com/docs/guides/cli/managing-environments) - Local vs production

---

### TypeScript & ESLint

**Strict mode enabled** (`tsconfig.json`):
- No implicit `any`
- Strict null checks
- No unused locals/parameters

**ESLint bans `any` types** (`.eslintrc.json`):
```json
{
  "@typescript-eslint/no-explicit-any": "error"
}
```

**Use `unknown` instead:**
```typescript
// ❌ Bad
const data: any = await fetch('/api');

// ✅ Good
const data: unknown = await fetch('/api');
if (isValidData(data)) {
  // TypeScript knows the type here
}
```

**See** [HOW_TO_REPLICATE.md - Step 14](./HOW_TO_REPLICATE.md#step-14-typescript-best-practices) for complete type safety guide.

---

### Database Seeding

The `supabase/seed.sql` file automatically runs when you reset your local database:

```bash
npx supabase db reset  # Applies migrations + runs seed.sql
```

**Example seed file:**
```sql
DO $$
DECLARE
  v_user_id UUID;
BEGIN
  SELECT id INTO v_user_id FROM auth.users LIMIT 1;
  
  IF v_user_id IS NOT NULL THEN
    INSERT INTO notes (user_id, title, content) VALUES
      (v_user_id, 'Welcome!', 'Your first note');
  END IF;
END $$;
```

**Documentation:**
- [Supabase Seeding](https://supabase.com/docs/guides/cli/local-development#seed-your-database) - Seed file guide
- [PostgreSQL DO Blocks](https://www.postgresql.org/docs/current/sql-do.html) - Anonymous code blocks

---

## 🛠️ Development

### Commands

```bash
pnpm dev              # Start development server
pnpm build            # Production build
pnpm lint             # Run ESLint (will error on any types)
pnpm db:push          # Push migrations to remote
pnpm db:reset         # Reset local database + seed
pnpm db:types         # Generate TypeScript types from database
```

---

### Adding New Features

**Example: Adding a "Tasks" domain**

**1. Create Migration** (`supabase/migrations/003_tasks.sql`)
```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  title TEXT NOT NULL
);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own tasks" ON tasks
  FOR ALL USING (auth.uid() = user_id);
```

**2. Apply & Generate Types**
```bash
npx supabase db push
pnpm db:types  # Regenerate types with new 'tasks' table
```

**3. Database Operations** (`src/server/db/task.ts`)
```typescript
export class TaskOperations {
  async list() {
    const { data } = await this.supabase
      .from('tasks')
      .select('*');
    return data || [];
  }
}
```

**4. tRPC Router** (`src/server/routers/task.ts`)
```typescript
export const taskRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    const db = new Database(ctx.supabase, ctx.user);
    return db.taskList();
  }),
});
```

**5. Add to Main Router** (`src/server/routers/index.ts`)
```typescript
export const appRouter = router({
  task: taskRouter,  // Add this line
});
```

**6. Use in Frontend** (fully typed!)
```typescript
const { data: tasks } = api.task.list.useQuery();
//     ^? Task[] - TypeScript knows the shape from database.types.ts
```

---

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables (see [Configuration](#🔧-configuration))
4. Deploy!

Vercel automatically:
- Builds your Next.js app
- Sets up preview deployments
- Configures edge functions

### Database Setup

Your Supabase project is production-ready:
1. Run `npx supabase db push` to apply migrations
2. Configure OAuth redirect URLs in Supabase dashboard
3. Set up custom email templates (optional)

**Environment variables in Vercel:**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `GOOGLE_CLIENT_ID` (optional)
- `GOOGLE_CLIENT_SECRET` (optional)
- `NEXT_PUBLIC_SITE_URL` (your production URL)

---

## 🎯 Why These Choices?

### tRPC over REST/GraphQL

- **End-to-end type safety** without code generation
- **Simpler** than GraphQL for CRUD operations
- **Better DX** - Autocomplete and inline errors
- [Learn more](https://trpc.io/docs/main/introduction)

### Supabase over Other Backends

- **PostgreSQL** - Battle-tested SQL database
- **Built-in Auth** - No separate service needed
- **Row Level Security** - Database-level authorization
- **Real-time** - WebSocket subscriptions included
- [Learn more](https://supabase.com/docs)

### pnpm over npm/yarn

- **2x faster** than npm/yarn
- **Disk efficient** - Content-addressable storage
- **Strict** - Prevents phantom dependencies
- [Benchmarks](https://pnpm.io/benchmarks)

### Domain-Driven Structure

- **Scales better** than feature folders
- **Clear boundaries** - Self-contained domains
- **Team-friendly** - Independent development
- [Read more](https://khalilstemmler.com/articles/domain-driven-design-intro/)

### Tailwind CSS v4

- **Faster** - New engine performance
- **Better DX** - `@theme` directive
- **Modern** - CSS-first approach
- [Migration guide](https://tailwindcss.com/docs/upgrade-guide)

### shadcn/ui Copy/Paste

- **Full control** - Copy/paste, not npm install
- **Customizable** - Own the code
- **Modern** - Built on Radix UI primitives
- [Philosophy](https://ui.shadcn.com/docs)

---

## 📖 Learn More

### Complete Guide

**[HOW_TO_REPLICATE.md](./HOW_TO_REPLICATE.md)** - Build this from scratch
- 16 detailed steps from `create-next-app` to production
- Exact commands for each step
- Inline links to official documentation for every technology
- TypeScript best practices (avoiding `any`)
- Database seeding guide
- Troubleshooting tips

### Official Documentation

- [Next.js](https://nextjs.org/docs) - React framework
- [Supabase](https://supabase.com/docs) - Backend platform
- [tRPC](https://trpc.io/docs) - Type-safe API
- [Tailwind CSS](https://tailwindcss.com/docs) - Styling
- [shadcn/ui](https://ui.shadcn.com/) - Components
- [TypeScript](https://www.typescriptlang.org/docs/) - Type system

---

## 📝 License

MIT - Use this however you want!

---

**Built with** ❤️ **using Next.js, Supabase, tRPC, and Tailwind CSS**
