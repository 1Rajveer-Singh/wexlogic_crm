-- Create Enum for User Roles
CREATE TYPE public.user_role AS ENUM ('admin', 'manager', 'viewer');

-- Create User Roles table (links to auth.users)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'viewer',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Clients table
CREATE TABLE public.clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  company_name TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Services table
CREATE TABLE public.services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  base_price NUMERIC(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Enum for Revenue Status
CREATE TYPE public.revenue_status AS ENUM ('pending', 'paid');

-- Create Revenue table
CREATE TABLE public.revenue (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  amount NUMERIC(10, 2) NOT NULL,
  status revenue_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.revenue ENABLE ROW LEVEL SECURITY;

-- Helper function to get the current user's role
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS public.user_role
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT role FROM public.user_roles WHERE id = auth.uid();
$$;

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own role"
  ON public.user_roles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Admins have full access to user_roles"
  ON public.user_roles
  FOR ALL
  USING (public.get_user_role() = 'admin');

-- RLS Policies for clients
CREATE POLICY "Admins have full access to clients"
  ON public.clients
  FOR ALL
  USING (public.get_user_role() = 'admin');

CREATE POLICY "Managers can select clients"
  ON public.clients
  FOR SELECT
  USING (public.get_user_role() = 'manager');

CREATE POLICY "Managers can update clients"
  ON public.clients
  FOR UPDATE
  USING (public.get_user_role() = 'manager');

CREATE POLICY "Viewers can select clients"
  ON public.clients
  FOR SELECT
  USING (public.get_user_role() = 'viewer');

-- RLS Policies for services
CREATE POLICY "Admins have full access to services"
  ON public.services
  FOR ALL
  USING (public.get_user_role() = 'admin');

CREATE POLICY "Managers can select services"
  ON public.services
  FOR SELECT
  USING (public.get_user_role() = 'manager');

CREATE POLICY "Managers can update services"
  ON public.services
  FOR UPDATE
  USING (public.get_user_role() = 'manager');

CREATE POLICY "Viewers can select services"
  ON public.services
  FOR SELECT
  USING (public.get_user_role() = 'viewer');

-- RLS Policies for revenue
CREATE POLICY "Admins have full access to revenue"
  ON public.revenue
  FOR ALL
  USING (public.get_user_role() = 'admin');

CREATE POLICY "Managers can select revenue"
  ON public.revenue
  FOR SELECT
  USING (public.get_user_role() = 'manager');

CREATE POLICY "Managers can update revenue"
  ON public.revenue
  FOR UPDATE
  USING (public.get_user_role() = 'manager');

CREATE POLICY "Viewers can select revenue"
  ON public.revenue
  FOR SELECT
  USING (public.get_user_role() = 'viewer');
