import { Shield, CheckCircle, AlertTriangle, Lock, Key, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export function SecurityOverview() {
  const securityMetrics = [
    {
      title: "CMMC Compliance",
      value: "Level 3",
      status: "compliant",
      icon: Shield,
      description: "Cybersecurity Maturity Model Certification"
    },
    {
      title: "Active Sessions",
      value: "12",
      status: "normal",
      icon: Users,
      description: "Current authenticated users"
    },
    {
      title: "Encryption Status",
      value: "AES-256",
      status: "secure",
      icon: Lock,
      description: "Data at rest and in transit"
    },
    {
      title: "Access Keys",
      value: "Valid",
      status: "secure",
      icon: Key,
      description: "All certificates current"
    }
  ];

  const complianceScore = 98;

  return (
    <Card className="module-card">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Shield className="h-5 w-5 text-primary" />
          <span>Security & Compliance Overview</span>
        </CardTitle>
        <CardDescription>
          Real-time security status and CMMC compliance monitoring
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Compliance Score */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Overall Compliance Score</span>
            <span className="text-2xl font-bold text-primary">{complianceScore}%</span>
          </div>
          <Progress value={complianceScore} className="h-2" />
          <p className="text-xs text-muted-foreground">
            Exceeds CMMC Level 3 requirements
          </p>
        </div>

        {/* Security Metrics Grid */}
        <div className="grid grid-cols-2 gap-4">
          {securityMetrics.map((metric) => {
            const statusColors = {
              compliant: "status-secure",
              secure: "status-secure",
              normal: "status-cmmc",
              warning: "status-warning"
            };

            return (
              <div key={metric.title} className="space-y-2">
                <div className="flex items-center space-x-2">
                  <metric.icon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{metric.title}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold">{metric.value}</span>
                  <Badge className={statusColors[metric.status as keyof typeof statusColors]}>
                    <CheckCircle className="h-3 w-3 mr-1" />
                    OK
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {metric.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Recent Security Events */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Recent Security Events</h4>
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-xs">
              <CheckCircle className="h-3 w-3 text-success" />
              <span>Security scan completed - No issues found</span>
              <span className="text-muted-foreground">2 hours ago</span>
            </div>
            <div className="flex items-center space-x-2 text-xs">
              <CheckCircle className="h-3 w-3 text-success" />
              <span>Access keys renewed successfully</span>
              <span className="text-muted-foreground">1 day ago</span>
            </div>
            <div className="flex items-center space-x-2 text-xs">
              <CheckCircle className="h-3 w-3 text-success" />
              <span>CMMC audit passed with commendation</span>
              <span className="text-muted-foreground">3 days ago</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}