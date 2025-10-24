-- =============================================================================
-- SEED DATA - Development and Testing
-- =============================================================================
-- This file seeds the database with example data for development.
-- Run with: npx supabase db reset (automatically runs seed.sql)
-- =============================================================================

-- Note: auth.users is managed by Supabase Auth, so we can't directly insert
-- Instead, create users through the signup flow or Supabase dashboard

-- Example: If you have a test user (create via Supabase dashboard first)
-- Then you can seed their data:

DO $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Get a test user (or create one via dashboard first)
  SELECT id INTO v_user_id FROM auth.users LIMIT 1;
  
  IF v_user_id IS NOT NULL THEN
    -- Seed example notes
    INSERT INTO notes (user_id, title, content) VALUES
      (v_user_id, 'Welcome to the app', 'This is your first note!'),
      (v_user_id, 'Getting Started', 'Here are some tips for using this app...'),
      (v_user_id, 'Example Note', 'You can create, edit, and delete notes.'),
      (v_user_id, 'TypeScript is Great', 'Type-safe from database to UI!'),
      (v_user_id, 'Supabase Rocks', 'PostgreSQL + Auth + RLS = ❤️');
      
    RAISE NOTICE 'Seeded 5 example notes for user %', v_user_id;
  ELSE
    RAISE NOTICE 'No users found. Create a user first via signup or Supabase dashboard.';
  END IF;
END $$;

