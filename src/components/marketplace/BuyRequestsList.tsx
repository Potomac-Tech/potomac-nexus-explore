import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock, DollarSign, Target, Filter } from "lucide-react";

interface BuyRequestsListProps {
  showFilters?: boolean;
}

export const BuyRequestsList = ({ showFilters = false }: BuyRequestsListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [budgetFilter, setBudgetFilter] = useState("all");

  // Mock data - TO BE REPLACED WITH BACKEND API CALL
  const buyRequests = [
    {
      id: "1",
      title: "High-resolution lunar crater measurements",
      description: "Need detailed depth and diameter measurements of lunar craters in Mare Tranquillitatis region for impact modeling research.",
      category: "lunar",
      budget: 5000,
      deadline: "2024-03-15",
      timeframe: "Short-term (1-3 months)",
      status: "active",
      requester: "Dr. Sarah Chen",
      requirements: "Sub-meter resolution, calibrated measurements, CSV format"
    },
    {
      id: "2", 
      title: "Deep-sea thermal vent bacterial samples analysis",
      description: "Seeking comprehensive bacterial community analysis data from hydrothermal vents at depths >3000m.",
      category: "seabed",
      budget: 12000,
      deadline: "2024-04-01",
      timeframe: "Medium-term (3-6 months)",
      status: "active",
      requester: "Marine Biology Institute",
      requirements: "16S rRNA sequencing, metabolic pathway analysis, environmental metadata"
    },
    {
      id: "3",
      title: "Carbon nanotube tensile strength data",
      description: "Need comprehensive tensile testing results for various carbon nanotube configurations under different environmental conditions.",
      category: "materials",
      budget: 8500,
      deadline: "2024-02-28",
      timeframe: "Immediate (within 1 month)",
      status: "urgent",
      requester: "Advanced Materials Lab",
      requirements: "Temperature range: -200°C to 500°C, humidity variations, stress-strain curves"
    }
  ];

  const handleAcceptRequest = async (requestId: string) => {
    // TODO: Connect to backend API and Stripe escrow
    // const response = await supabase.functions.invoke('accept-buy-request', {
    //   body: { requestId, providerId: user.id }
    // });
    
    console.log("Accepting buy request:", requestId);
    alert("Request acceptance functionality - TO BE CONNECTED TO BACKEND");
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      lunar: "bg-blue-100 text-blue-800",
      seabed: "bg-green-100 text-green-800", 
      materials: "bg-purple-100 text-purple-800",
      atmospheric: "bg-orange-100 text-orange-800",
      geological: "bg-yellow-100 text-yellow-800"
    };
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getStatusColor = (status: string) => {
    const colors = {
      active: "bg-green-100 text-green-800",
      urgent: "bg-red-100 text-red-800",
      closing: "bg-orange-100 text-orange-800"
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const filteredRequests = buyRequests.filter(request => {
    const matchesSearch = request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || request.category === categoryFilter;
    const matchesBudget = budgetFilter === "all" || 
                         (budgetFilter === "low" && request.budget < 5000) ||
                         (budgetFilter === "medium" && request.budget >= 5000 && request.budget < 10000) ||
                         (budgetFilter === "high" && request.budget >= 10000);
    
    return matchesSearch && matchesCategory && matchesBudget;
  });

  return (
    <div className="space-y-4">
      {showFilters && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Input
                  placeholder="Search requests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="lunar">Lunar Surface</SelectItem>
                    <SelectItem value="seabed">Seabed Ecology</SelectItem>
                    <SelectItem value="materials">Material Science</SelectItem>
                    <SelectItem value="atmospheric">Atmospheric</SelectItem>
                    <SelectItem value="geological">Geological</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select value={budgetFilter} onValueChange={setBudgetFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Budget Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Budgets</SelectItem>
                    <SelectItem value="low">Under $5,000</SelectItem>
                    <SelectItem value="medium">$5,000 - $10,000</SelectItem>
                    <SelectItem value="high">Over $10,000</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {filteredRequests.map((request) => (
          <Card key={request.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <CardTitle className="text-lg">{request.title}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge className={getCategoryColor(request.category)}>
                      {request.category}
                    </Badge>
                    <Badge className={getStatusColor(request.status)}>
                      {request.status}
                    </Badge>
                    <span className="text-sm text-muted-foreground">by {request.requester}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-lg font-bold text-green-600">
                    <DollarSign className="w-4 h-4" />
                    {request.budget.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    Due {request.deadline}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-3">
                {request.description}
              </CardDescription>
              
              <div className="space-y-2 text-sm">
                <div>
                  <strong>Timeframe:</strong> {request.timeframe}
                </div>
                <div>
                  <strong>Requirements:</strong> {request.requirements}
                </div>
              </div>

              <div className="flex justify-between items-center mt-4 pt-4 border-t">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Target className="w-3 h-3" />
                  Escrow protected by Potomac
                </div>
                <Button onClick={() => handleAcceptRequest(request.id)}>
                  Accept Request
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredRequests.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">No buy requests found matching your criteria.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};