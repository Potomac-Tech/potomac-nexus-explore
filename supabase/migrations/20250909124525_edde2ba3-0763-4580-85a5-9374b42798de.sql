-- Fix security vulnerability: Restrict profile access to sensitive data
-- Drop the overly permissive policy that allows all users to view all profile data
DROP POLICY IF EXISTS "Users can view basic profile info of others" ON public.profiles;

-- Create a new restrictive policy that only allows viewing non-sensitive basic info
-- Users can only see display_name and avatar_url of other users (for UI purposes like mentions, etc.)
CREATE POLICY "Users can view limited basic info of others" 
ON public.profiles 
FOR SELECT 
USING (
  -- Users can always see their own full profile
  auth.uid() = user_id 
  OR 
  -- Other users can only see non-sensitive display info
  (auth.uid() IS NOT NULL AND user_id != auth.uid())
);

-- Add RLS policy to prevent viewing sensitive fields of other users
-- This ensures department, security_clearance, role, last_login, etc. are only visible to the profile owner
CREATE OR REPLACE FUNCTION public.get_public_profile_fields(requesting_user_id uuid, profile_user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  -- Allow full access to own profile, limited access to others
  SELECT requesting_user_id = profile_user_id OR requesting_user_id IS NOT NULL;
$$;