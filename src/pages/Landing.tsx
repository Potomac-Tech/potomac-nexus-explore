import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Database, Microscope, Rocket, Waves, Shield, Users, Globe, Satellite, ShoppingCart, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { MFASetup } from "@/components/auth/MFASetup";

const Landing = () => {
  const { user } = useAuth();

  const features = [
    {
      title: 'Lunar Data Module',
      description: 'Advanced lunar surface analysis and mineral composition data',
      icon: Satellite,
      href: '/lunar',
      status: 'Active'
    },
    {
      title: 'Seabed Mapping',
      description: 'Deep-sea geological surveys and underwater terrain mapping',
      icon: Waves, 
      href: '/seabed',
      status: 'Active'
    },
    {
      title: 'Data Marketplace',
      description: 'Buy and sell scientific datasets with secure transactions',
      icon: ShoppingCart,
      href: '/marketplace',
      status: 'Active'
    },
    {
      title: 'Analytics Dashboard',
      description: 'Comprehensive data visualization and research analytics',
      icon: BarChart3,
      href: '/analytics',
      status: 'Coming Soon'
    }
  ];

  const securityFeatures = [
    'SAML SSO Integration',
    'Multi-Factor Authentication (MFA)',
    'SOC 2 Type 2 Compliance',
    'AES-256 Encryption at Rest',
    'TLS 1.3 Encryption in Transit',
    'Real-time Security Monitoring'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <Database className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Potomac Scientific Database
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Enterprise-grade scientific data platform with advanced security and compliance
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <Badge variant="outline" className="status-secure">
              <Shield className="w-3 h-3 mr-1" />
              SOC 2 Certified
            </Badge>
            <Badge variant="outline">Enterprise Security</Badge>
            <Badge variant="outline">Real-time Monitoring</Badge>
          </div>
        </div>

        {/* User Welcome */}
        {user && (
          <Card className="mb-8 bg-card/50 backdrop-blur-sm border-primary/20">
            <CardHeader>
              <CardTitle>Welcome back, {user.email}</CardTitle>
              <CardDescription>
                Your secure session is active. All activities are monitored for compliance.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Badge variant="outline" className="status-secure">
                    <Users className="w-3 h-3 mr-1" />
                    Authenticated
                  </Badge>
                  <Link to="/dashboard">
                    <Button>Go to Dashboard</Button>
                  </Link>
                </div>
                <Link to="/security">
                  <Button variant="outline">
                    <Shield className="w-4 h-4 mr-2" />
                    Security Center
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* MFA Setup */}
        {user && (
          <div className="mb-8">
            <MFASetup />
          </div>
        )}

        {/* Data Modules */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Globe className="w-6 h-6 text-primary" />
            Scientific Data Modules
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="module-card group cursor-pointer">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <Icon className="w-8 h-8 text-primary" />
                      <Badge 
                        variant={feature.status === 'Active' ? 'default' : 'secondary'}
                        className={feature.status === 'Active' ? 'status-secure' : ''}
                      >
                        {feature.status}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-4">{feature.description}</CardDescription>
                    {feature.status === 'Active' && (
                      <Link to={feature.href}>
                        <Button variant="outline" size="sm" className="w-full group-hover:bg-primary group-hover:text-primary-foreground">
                          Access Module
                        </Button>
                      </Link>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Security & Compliance */}
        <Card className="bg-gradient-to-r from-card/80 to-card/60 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-primary" />
              Enterprise Security & Compliance
            </CardTitle>
            <CardDescription>
              Built with enterprise-grade security controls and SOC 2 Type 2 compliance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold mb-3 text-primary">Security Features</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {securityFeatures.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Shield className="w-3 h-3 text-success" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3 text-primary">Compliance Standards</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Shield className="w-3 h-3 text-success" />
                    SOC 2 Type 2 Certified
                  </li>
                  <li className="flex items-center gap-2">
                    <Shield className="w-3 h-3 text-success" />
                    CMMC Level 2 Ready
                  </li>
                  <li className="flex items-center gap-2">
                    <Shield className="w-3 h-3 text-success" />
                    GDPR Compliant
                  </li>
                  <li className="flex items-center gap-2">
                    <Shield className="w-3 h-3 text-success" />
                    HIPAA Ready
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-3 text-primary">Data Protection</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Shield className="w-3 h-3 text-success" />
                    End-to-End Encryption
                  </li>
                  <li className="flex items-center gap-2">
                    <Shield className="w-3 h-3 text-success" />
                    Zero-Knowledge Architecture
                  </li>
                  <li className="flex items-center gap-2">
                    <Shield className="w-3 h-3 text-success" />
                    Automated Backups
                  </li>
                  <li className="flex items-center gap-2">
                    <Shield className="w-3 h-3 text-success" />
                    Audit Trail Logging
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Landing;