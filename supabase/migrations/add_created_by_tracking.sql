-- Add created_by to clients and revenue to track user contributions
-- Run this in your Supabase SQL editor.

ALTER TABLE public.clients
  ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES public.user_roles(id) ON DELETE SET NULL;

ALTER TABLE public.revenue
  ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES public.user_roles(id) ON DELETE SET NULL;

-- If you want existing data to be attributed to a specific admin (so it shows in the pie chart), run these:
-- UPDATE public.clients SET created_by = '<your-admin-uuid>' WHERE created_by IS NULL;
-- UPDATE public.revenue SET created_by = '<your-admin-uuid>' WHERE created_by IS NULL;
