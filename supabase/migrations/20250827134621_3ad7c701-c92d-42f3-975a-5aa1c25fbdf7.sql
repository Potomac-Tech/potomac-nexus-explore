-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  display_name TEXT,
  department TEXT,
  role TEXT,
  security_clearance TEXT,
  mfa_enabled BOOLEAN NOT NULL DEFAULT false,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create security audit logs table for SOC 2 compliance
CREATE TABLE public.security_audit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  event_type TEXT NOT NULL,
  event_description TEXT NOT NULL,
  ip_address INET,
  user_agent TEXT,
  risk_level TEXT DEFAULT 'low',
  metadata JSONB,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for audit logs - only admins can view
ALTER TABLE public.security_audit_logs ENABLE ROW LEVEL SECURITY;

-- Create SAML providers table
CREATE TABLE public.saml_providers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  domain TEXT NOT NULL,
  metadata_url TEXT,
  entity_id TEXT NOT NULL,
  sso_url TEXT NOT NULL,
  certificate TEXT,
  enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for SAML providers - only admins can manage
ALTER TABLE public.saml_providers ENABLE ROW LEVEL SECURITY;

-- Create MFA configurations table
CREATE TABLE public.mfa_configurations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  totp_secret TEXT,
  backup_codes TEXT[],
  phone_number TEXT,
  is_verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for MFA configs
ALTER TABLE public.mfa_configurations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own MFA" 
ON public.mfa_configurations 
FOR ALL 
USING (auth.uid() = user_id);

-- Create compliance configurations table
CREATE TABLE public.compliance_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_name TEXT NOT NULL UNIQUE,
  setting_value TEXT NOT NULL,
  description TEXT,
  compliance_framework TEXT DEFAULT 'SOC2',
  updated_by UUID,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for compliance settings - admin only
ALTER TABLE public.compliance_settings ENABLE ROW LEVEL SECURITY;

-- Insert default SOC 2 compliance settings
INSERT INTO public.compliance_settings (setting_name, setting_value, description, compliance_framework) VALUES
('password_min_length', '12', 'Minimum password length requirement', 'SOC2'),
('session_timeout', '3600', 'Session timeout in seconds', 'SOC2'),
('mfa_required', 'true', 'Multi-factor authentication required', 'SOC2'),
('audit_retention_days', '2555', 'Audit log retention period (7 years)', 'SOC2'),
('encryption_at_rest', 'true', 'Data encryption at rest enabled', 'SOC2'),
('encryption_in_transit', 'true', 'Data encryption in transit enabled', 'SOC2');

-- Create update trigger for timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_saml_providers_updated_at
  BEFORE UPDATE ON public.saml_providers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_mfa_configurations_updated_at
  BEFORE UPDATE ON public.mfa_configurations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function for logging security events
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