-- Fix MFA configurations RLS policy to properly restrict access
-- Drop the existing overly permissive policy
DROP POLICY IF EXISTS "Users can manage their own MFA" ON public.mfa_configurations;

-- Create restrictive policies for each operation
CREATE POLICY "Users can view their own MFA configuration" 
ON public.mfa_configurations 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own MFA configuration" 
ON public.mfa_configurations 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own MFA configuration" 
ON public.mfa_configurations 
FOR UPDATE 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own MFA configuration" 
ON public.mfa_configurations 
FOR DELETE 
USING (auth.uid() = user_id);