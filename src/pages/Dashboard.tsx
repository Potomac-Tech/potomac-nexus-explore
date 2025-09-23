import { useNavigate } from "react-router-dom";
import { Moon, Waves, Atom, BarChart3, Database, TrendingUp, ShoppingCart } from "lucide-react";
import { ModuleCard } from "@/components/dashboard/ModuleCard";
import { SecurityOverview } from "@/components/dashboard/SecurityOverview";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/contexts/AuthContext";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile } = useProfile();

  const displayName = profile?.display_name || 
    (profile?.first_name && profile?.last_name 
      ? `${profile.first_name} ${profile.last_name}` 
      : user?.email?.split('@')[0] || 'User');

  const dataModules = [
    {
      title: "Lunar Surface Data",
      description: "Geological composition, atmospheric readings, and surface topography",
      icon: Moon,
      dataCount: "2.4M",
      lastUpdated: "2 hours ago",
      status: "active" as const,
      tier: "public" as const,
      route: "/lunar"
    },
    {
      title: "Seabed Ecology",
      description: "Marine ecosystem analysis, biodiversity mapping, and environmental data",
      icon: Waves,
      dataCount: "1.8M",
      lastUpdated: "45 minutes ago",
      status: "processing" as const,
      tier: "premium" as const,
      route: "/seabed"
    },
    {
      title: "Material Science",
      description: "Structural analysis, compositional data, and property measurements",
      icon: Atom,
      dataCount: "950K",
      lastUpdated: "1 hour ago",
      status: "active" as const,
      tier: "developer" as const,
      route: "/materials"
    }
  ];

  const systemStats = [
    {
      title: "Total Data Records",
      value: "5.15M",
      change: "+12.5%",
      trend: "up",
      icon: Database
    },
    {
      title: "Active Analyses",
      value: "847",
      change: "+8.2%",
      trend: "up",
      icon: BarChart3
    },
    {
      title: "Processing Queue",
      value: "23",
      change: "-15.3%",
      trend: "down",
      icon: TrendingUp
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-celestial">
      <div className="container mx-auto p-6 space-y-8">
        {/* Welcome Section with 3D Logo */}
        <div className="flow-in">
          <div className="flex items-center gap-4 mb-4">
            <div className="dashboard-logo-3d">
              <img 
                src="/lovable-uploads/21fa0edb-b252-42c1-bd21-38a5e74baa22.png" 
                alt="Potomac Logo" 
                className="w-16 h-16"
              />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">
                Welcome back, {displayName}
              </h1>
              <p className="text-lg text-muted-foreground">
                Access your scientific databases and monitor system performance
              </p>
            </div>
          </div>
        </div>

        {/* System Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flow-in">
          {systemStats.map((stat) => (
            <Card key={stat.title} className="module-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{stat.value}</div>
                <p className={`text-xs flex items-center space-x-1 ${
                  stat.trend === 'up' ? 'text-success' : 'text-warning'
                }`}>
                  <TrendingUp className={`h-3 w-3 ${
                    stat.trend === 'down' ? 'rotate-180' : ''
                  }`} />
                  <span>{stat.change} from last week</span>
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Data Modules Grid */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-foreground">Data Modules</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {dataModules.map((module, index) => (
              <div key={module.title} className="flow-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <ModuleCard
                  {...module}
                  onAccess={() => navigate(module.route)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Security Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flow-in">
            <SecurityOverview />
          </div>
          
          {/* Quick Actions */}
          <div className="flow-in">
            <Card className="module-card">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Frequently used functions and shortcuts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <button 
                  className="w-full p-3 text-left rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors border border-border/30"
                  onClick={() => navigate("/analytics")}
                >
                  <div className="font-medium">Data Analytics</div>
                  <div className="text-sm text-muted-foreground">View cross-module insights</div>
                </button>
                
                <button 
                  className="w-full p-3 text-left rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors border border-border/30"
                  onClick={() => navigate("/marketplace")}
                >
                  <div className="font-medium">Data Marketplace</div>
                  <div className="text-sm text-muted-foreground">Buy & sell research data</div>
                </button>
                
                <button 
                  className="w-full p-3 text-left rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors border border-border/30"
                  onClick={() => navigate("/users")}
                >
                  <div className="font-medium">User Management</div>
                  <div className="text-sm text-muted-foreground">Manage access permissions</div>
                </button>
                
                <button 
                  className="w-full p-3 text-left rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors border border-border/30"
                  onClick={() => navigate("/security")}
                >
                  <div className="font-medium">Security Dashboard</div>
                  <div className="text-sm text-muted-foreground">Full CMMC compliance view</div>
                </button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}