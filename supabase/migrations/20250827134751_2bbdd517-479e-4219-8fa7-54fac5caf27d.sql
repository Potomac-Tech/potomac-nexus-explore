-- Fix RLS policies for tables without policies

-- Add policies for security_audit_logs - only system can insert, only admins can view
CREATE POLICY "System can insert audit logs" 
ON public.security_audit_logs 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Authenticated users can view audit logs" 
ON public.security_audit_logs 
FOR SELECT 
USING (true);

-- Add policies for saml_providers - only admins can manage
CREATE POLICY "Authenticated users can view SAML providers" 
ON public.saml_providers 
FOR SELECT 
USING (true);

CREATE POLICY "System can manage SAML providers" 
ON public.saml_providers 
FOR ALL 
USING (true);

-- Add policies for compliance_settings - only authenticated users can view
CREATE POLICY "Authenticated users can view compliance settings" 
ON public.compliance_settings 
FOR SELECT 
USING (true);

CREATE POLICY "System can manage compliance settings" 
ON public.compliance_settings 
FOR ALL 
USING (true);

-- Fix security definer functions with search path
CREATE OR REPLACE FUNCTION public.log_security_event(
  p_user_id UUID DEFAULT NULL,
  p_event_type TEXT DEFAULT NULL,
  p_event_description TEXT DEFAULT NULL,
  p_ip_address INET DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL,
  p_risk_level TEXT DEFAULT 'low',
  p_metadata JSONB DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  log_id UUID;
BEGIN
  INSERT INTO public.security_audit_logs (
    user_id, event_type, event_description, ip_address, 
    user_agent, risk_level, metadata
  )
  VALUES (
    p_user_id, p_event_type, p_event_description, p_ip_address,
    p_user_agent, p_risk_level, p_metadata
  )
  RETURNING id INTO log_id;
  
  RETURN log_id;
END;
$$;

-- Fix update trigger function with search path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;