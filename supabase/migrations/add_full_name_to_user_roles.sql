-- Migration: Add full_name column to user_roles for displaying admin names in the dashboard pie chart
-- Run this in your Supabase SQL editor.

ALTER TABLE public.user_roles
  ADD COLUMN IF NOT EXISTS full_name TEXT;

-- After running this migration, update the full_name for each admin user:
-- Example:
-- UPDATE public.user_roles SET full_name = 'Naman' WHERE id = '<your-user-uuid>';
-- UPDATE public.user_roles SET full_name = 'Person 2' WHERE id = '<second-admin-uuid>';
-- UPDATE public.user_roles SET full_name = 'Person 3' WHERE id = '<third-admin-uuid>';
