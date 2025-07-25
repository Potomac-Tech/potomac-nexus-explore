import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ModuleCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  dataCount: string;
  lastUpdated: string;
  status: "active" | "processing" | "maintenance";
  tier: "public" | "premium" | "developer";
  onAccess: () => void;
}

export function ModuleCard({
  title,
  description,
  icon: Icon,
  dataCount,
  lastUpdated,
  status,
  tier,
  onAccess,
}: ModuleCardProps) {
  const statusConfig = {
    active: { label: "Active", className: "status-secure" },
    processing: { label: "Processing", className: "status-warning" },
    maintenance: { label: "Maintenance", className: "bg-muted text-muted-foreground" },
  };

  const tierConfig = {
    public: { label: "Public", className: "bg-blue-500 text-white" },
    premium: { label: "Premium", className: "bg-purple-500 text-white" },
    developer: { label: "Developer", className: "bg-orange-500 text-white" },
  };

  return (
    <Card className="module-card group cursor-pointer" onClick={onAccess}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-lg bg-gradient-primary">
            <Icon className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription className="text-sm">{description}</CardDescription>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge className={tierConfig[tier].className}>
            {tierConfig[tier].label}
          </Badge>
          <Badge className={statusConfig[status].className}>
            {statusConfig[status].label}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-primary">{dataCount}</div>
            <p className="text-xs text-muted-foreground">
              Records available
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium">Last Updated</div>
            <div className="text-xs text-muted-foreground">{lastUpdated}</div>
          </div>
        </div>
        
        <Button 
          className="w-full mt-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
          variant="outline"
        >
          Access Database
        </Button>
      </CardContent>
    </Card>
  );
}