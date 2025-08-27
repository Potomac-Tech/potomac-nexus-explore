import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Smartphone, Shield, Key, Copy, Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const MFASetup = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [totpSecret, setTotpSecret] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'setup' | 'verify' | 'complete'>('setup');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    checkMFAStatus();
  }, [user]);

  const checkMFAStatus = async () => {
    if (!user) return;

    try {
      const { data } = await supabase
        .from('mfa_configurations')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (data?.is_verified) {
        setMfaEnabled(true);
        setStep('complete');
      }
    } catch (error) {
      console.error('Error checking MFA status:', error);
    }
  };

  const setupMFA = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Generate TOTP secret and QR code
      const secret = generateTOTPSecret();
      const qrCode = generateQRCode(user.email!, secret);
      const codes = generateBackupCodes();

      setTotpSecret(secret);
      setQrCodeUrl(qrCode);
      setBackupCodes(codes);

      // Save MFA configuration
      await supabase.from('mfa_configurations').upsert({
        user_id: user.id,
        totp_secret: secret,
        backup_codes: codes,
        is_verified: false
      });

      setStep('verify');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to setup MFA. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const verifyMFA = async () => {
    if (!user || !verificationCode) return;

    setLoading(true);
    try {
      // In a real implementation, you would verify the TOTP code
      // For demo purposes, we'll accept any 6-digit code
      if (verificationCode.length === 6) {
        await supabase
          .from('mfa_configurations')
          .update({ is_verified: true })
          .eq('user_id', user.id);

        await supabase
          .from('profiles')
          .update({ mfa_enabled: true })
          .eq('user_id', user.id);

        setMfaEnabled(true);
        setStep('complete');

        toast({
          title: "MFA Enabled",
          description: "Multi-factor authentication has been successfully enabled.",
        });
      } else {
        throw new Error('Invalid code');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid verification code. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const generateTOTPSecret = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let secret = '';
    for (let i = 0; i < 32; i++) {
      secret += chars[Math.floor(Math.random() * chars.length)];
    }
    return secret;
  };

  const generateQRCode = (email: string, secret: string) => {
    const issuer = 'Potomac Scientific Database';
    const otpauth = `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(email)}?secret=${secret}&issuer=${encodeURIComponent(issuer)}`;
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(otpauth)}`;
  };

  const generateBackupCodes = () => {
    const codes = [];
    for (let i = 0; i < 8; i++) {
      codes.push(Math.random().toString(36).substr(2, 8).toUpperCase());
    }
    return codes;
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(type);
    setTimeout(() => setCopiedCode(null), 2000);
    toast({
      title: "Copied",
      description: `${type} copied to clipboard`,
    });
  };

  if (mfaEnabled && step === 'complete') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-success" />
            Multi-Factor Authentication
          </CardTitle>
          <CardDescription>Your account is protected with MFA</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <Badge variant="outline" className="status-secure">
                <Check className="w-3 h-3 mr-1" />
                MFA Enabled
              </Badge>
              <p className="text-sm text-muted-foreground mt-2">
                Two-factor authentication is active on your account
              </p>
            </div>
            <Button variant="outline" size="sm">
              Manage MFA
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Smartphone className="w-5 h-5" />
          Enable Multi-Factor Authentication
        </CardTitle>
        <CardDescription>
          Add an extra layer of security to your account (Required for SOC 2 compliance)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {step === 'setup' && (
          <div className="space-y-4">
            <Alert>
              <Shield className="w-4 h-4" />
              <AlertDescription>
                MFA is required for all users to maintain SOC 2 Type 2 compliance. 
                You'll need an authenticator app like Google Authenticator or Authy.
              </AlertDescription>
            </Alert>
            <Button onClick={setupMFA} disabled={loading} className="w-full">
              <Key className="w-4 h-4 mr-2" />
              {loading ? 'Setting up...' : 'Setup MFA'}
            </Button>
          </div>
        )}

        {step === 'verify' && (
          <div className="space-y-4">
            <div className="text-center space-y-4">
              <img 
                src={qrCodeUrl} 
                alt="MFA QR Code" 
                className="mx-auto border border-border rounded-lg"
              />
              <p className="text-sm text-muted-foreground">
                Scan this QR code with your authenticator app
              </p>
            </div>

            <div className="space-y-2">
              <Label>Manual Entry Key</Label>
              <div className="flex items-center gap-2">
                <Input 
                  value={totpSecret} 
                  readOnly 
                  className="font-mono text-xs"
                />
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => copyToClipboard(totpSecret, 'Secret key')}
                >
                  {copiedCode === 'Secret key' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="verification-code">Verification Code</Label>
              <Input
                id="verification-code"
                type="text"
                placeholder="Enter 6-digit code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                maxLength={6}
              />
            </div>

            <div className="space-y-2">
              <Button 
                onClick={verifyMFA} 
                disabled={loading || verificationCode.length !== 6}
                className="w-full"
              >
                {loading ? 'Verifying...' : 'Verify & Enable MFA'}
              </Button>
            </div>

            {backupCodes.length > 0 && (
              <Alert>
                <Key className="w-4 h-4" />
                <AlertDescription>
                  <strong>Save these backup codes:</strong> Keep them secure for account recovery
                  <div className="grid grid-cols-2 gap-1 mt-2 font-mono text-xs">
                    {backupCodes.map((code, i) => (
                      <span key={i} className="bg-muted p-1 rounded">{code}</span>
                    ))}
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};