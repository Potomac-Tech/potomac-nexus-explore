import React from 'react';
import { ProfileForm } from '@/components/profile/ProfileForm';
import { MFASetup } from '@/components/auth/MFASetup';
import { useProfile } from '@/hooks/useProfile';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { User, Shield, Clock, Key, Mail } from 'lucide-react';

export default function Profile() {
  const { user, signOut } = useAuth();
  const { profile, isAdmin } = useProfile();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gradient-celestial">
      <div className="container mx-auto p-6 space-y-8">
        <div className="flow-in">
          <h1 className="text-4xl font-bold text-foreground mb-2">Profile Settings</h1>
          <p className="text-lg text-muted-foreground">
            Manage your account information and security settings
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Overview */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="module-card flow-in">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Account Overview</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-center">
                  <div className="h-20 w-20 rounded-full bg-gradient-primary flex items-center justify-center">
                    <User className="h-10 w-10 text-primary-foreground" />
                  </div>
                </div>
                
                <div className="text-center space-y-2">
                  <h3 className="font-semibold text-lg">
                    {profile?.display_name || user?.email?.split('@')[0] || 'User'}
                  </h3>
                  <div className="flex justify-center space-x-2">
                    <Badge variant={isAdmin ? 'destructive' : 'secondary'}>
                      {profile?.role || 'researcher'}
                    </Badge>
                    {profile?.mfa_enabled && (
                      <Badge variant="outline" className="text-success border-success">
                        <Shield className="h-3 w-3 mr-1" />
                        MFA
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-border/30">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span>{user?.email}</span>
                  </div>
                  {profile?.department && (
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <User className="h-4 w-4" />
                      <span>{profile.department}</span>
                    </div>
                  )}
                  {profile?.last_login && (
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>Last login: {new Date(profile.last_login).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>

                <Button 
                  onClick={handleSignOut} 
                  variant="outline" 
                  className="w-full mt-4 text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                >
                  Sign Out
                </Button>
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card className="module-card flow-in" style={{ animationDelay: '0.1s' }}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Key className="h-5 w-5" />
                  <span>Security Settings</span>
                </CardTitle>
                <CardDescription>
                  Manage your multi-factor authentication
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MFASetup />
              </CardContent>
            </Card>
          </div>

          {/* Main Profile Form */}
          <div className="lg:col-span-2 flow-in" style={{ animationDelay: '0.2s' }}>
            <ProfileForm />
          </div>
        </div>
      </div>
    </div>
  );
}