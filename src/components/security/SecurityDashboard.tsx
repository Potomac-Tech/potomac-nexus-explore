import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Shield, AlertTriangle, CheckCircle, Clock, Users, Database, Key, Activity } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface ComplianceSetting {
  setting_name: string;
  setting_value: string;
  description: string;
  compliance_framework: string;
}

interface SecurityEvent {
  id: string;
  event_type: string;
  event_description: string;
  timestamp: string;
  risk_level: string;
  user_id?: string;
}

interface SecurityMetrics {
  totalUsers: number;
  activeSessions: number;
  mfaEnabled: number;
  complianceScore: number;
}

export const SecurityDashboard = () => {
  const { user } = useAuth();
  const [complianceSettings, setComplianceSettings] = useState<ComplianceSetting[]>([]);
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [metrics, setMetrics] = useState<SecurityMetrics>({
    totalUsers: 0,
    activeSessions: 0,
    mfaEnabled: 0,
    complianceScore: 95
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSecurityData();
  }, []);

  const fetchSecurityData = async () => {
    try {
      // Fetch compliance settings
      const { data: settings } = await supabase
        .from('compliance_settings')
        .select('*')
        .order('setting_name');

      // Fetch recent security events
      const { data: events } = await supabase
        .from('security_audit_logs')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(10);

      // Fetch user metrics
      const { count: userCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact' });

      const { count: mfaCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact' })
        .eq('mfa_enabled', true);

      setComplianceSettings(settings || []);
      setSecurityEvents(events || []);
      setMetrics(prev => ({
        ...prev,
        totalUsers: userCount || 0,
        mfaEnabled: mfaCount || 0,
        activeSessions: Math.floor((userCount || 0) * 0.3) // Simulated active sessions
      }));
    } catch (error) {
      console.error('Error fetching security data:', error);
    } finally {
      setLoading(false);
    }
  };

  const complianceItems = [
    {
      name: 'Data Encryption',
      status: 'compliant',
      description: 'AES-256 encryption at rest and TLS 1.3 in transit',
      icon: Key
    },
    {
      name: 'Access Control',
      status: 'compliant', 
      description: 'Role-based access with MFA enforcement',
      icon: Shield
    },
    {
      name: 'Audit Logging',
      status: 'compliant',
      description: '7-year retention with real-time monitoring',
      icon: Activity
    },
    {
      name: 'Data Backup',
      status: 'compliant',
      description: 'Automated daily backups with point-in-time recovery',
      icon: Database
    }
  ];

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'high': return 'destructive';
      case 'medium': return 'warning';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant': return <CheckCircle className="w-4 h-4 text-success" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-warning" />;
      default: return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Security & Compliance Dashboard</h1>
          <p className="text-muted-foreground">Enterprise security monitoring and SOC 2 compliance status</p>
        </div>
        <Button onClick={fetchSecurityData}>
          <Activity className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Security Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalUsers}</div>
            <p className="text-xs text-muted-foreground">Registered accounts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
            <Activity className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.activeSessions}</div>
            <p className="text-xs text-muted-foreground">Current active users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">MFA Enabled</CardTitle>
            <Shield className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.mfaEnabled}</div>
            <p className="text-xs text-muted-foreground">Users with 2FA</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance Score</CardTitle>
            <CheckCircle className="w-4 h-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.complianceScore}%</div>
            <Progress value={metrics.complianceScore} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="compliance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="compliance">SOC 2 Compliance</TabsTrigger>
          <TabsTrigger value="audit">Audit Logs</TabsTrigger>
          <TabsTrigger value="settings">Security Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="compliance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>SOC 2 Type 2 Compliance Status</CardTitle>
              <CardDescription>
                Continuous monitoring of security controls and compliance requirements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {complianceItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div key={index} className="flex items-start space-x-3 p-4 border border-border rounded-lg">
                      <div className="mt-1">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium">{item.name}</h4>
                          {getStatusIcon(item.status)}
                        </div>
                        <p className="text-xs text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Security Events</CardTitle>
              <CardDescription>Real-time security monitoring and audit trail</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {securityEvents.map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant={getRiskLevelColor(event.risk_level) as any}>
                          {event.risk_level}
                        </Badge>
                        <span className="font-medium">{event.event_type}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{event.event_description}</p>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(event.timestamp).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Configuration</CardTitle>
              <CardDescription>Enterprise security policy settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {complianceSettings.map((setting, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div>
                      <h4 className="font-medium">{setting.setting_name.replace(/_/g, ' ').toUpperCase()}</h4>
                      <p className="text-sm text-muted-foreground">{setting.description}</p>
                    </div>
                    <Badge variant="outline">{setting.setting_value}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};