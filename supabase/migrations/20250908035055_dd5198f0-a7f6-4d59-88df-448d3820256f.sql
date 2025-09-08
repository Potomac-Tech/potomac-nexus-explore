-- Add role system and admin functionality

-- Create user roles enum
CREATE TYPE public.user_role AS ENUM ('admin', 'researcher', 'analyst', 'viewer');

-- Add role and additional fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS role public.user_role DEFAULT 'researcher',
ADD COLUMN IF NOT EXISTS first_name TEXT,
ADD COLUMN IF NOT EXISTS last_name TEXT,
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Create admin check function (security definer to avoid RLS recursion)
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.user_id = is_admin.user_id 
    AND role = 'admin'
  );
$$;

-- Allow users to view other users' basic profile info (for display purposes)
CREATE POLICY "Users can view basic profile info of others" 
ON public.profiles 
FOR SELECT 
USING (true);

-- Update existing policy to allow profile updates
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create a default admin user (you'll need to update this with your actual user ID)
-- First user to sign up can be made admin manually through SQL
INSERT INTO public.profiles (user_id, display_name, role, first_name, last_name)
SELECT id, 'Admin User', 'admin', 'Admin', 'User'
FROM auth.users 
WHERE email = (SELECT email FROM auth.users LIMIT 1)
ON CONFLICT (user_id) DO UPDATE SET 
  role = 'admin',
  display_name = COALESCE(profiles.display_name, 'Admin User'),
  first_name = COALESCE(profiles.first_name, 'Admin'),
  last_name = COALESCE(profiles.last_name, 'User');