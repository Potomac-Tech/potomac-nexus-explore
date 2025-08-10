import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Database, DollarSign, Download, Eye, Filter } from "lucide-react";

interface SellRequestsListProps {
  showFilters?: boolean;
}

export const SellRequestsList = ({ showFilters = false }: SellRequestsListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");

  // Mock data - TO BE REPLACED WITH BACKEND API CALL
  const sellRequests = [
    {
      id: "1",
      title: "Apollo 17 soil composition analysis",
      description: "Complete elemental and mineralogical analysis of lunar soil samples from Apollo 17 mission site. Includes XRF, XRD, and SEM-EDS data.",
      category: "lunar",
      price: 3500,
      dataSize: "1.2 GB",
      format: "CSV, PDF reports",
      collectionDate: "2023-08-15",
      seller: "Lunar Research Institute", 
      quality: "Peer-reviewed",
      sampleAvailable: true,
      exclusivity: "non-exclusive"
    },
    {
      id: "2",
      title: "Mariana Trench biodiversity survey",
      description: "Comprehensive species identification and abundance data from 10,000m depth expedition. Includes video footage, specimen catalog, and environmental parameters.",
      category: "seabed", 
      price: 15000,
      dataSize: "5.8 GB",
      format: "JSON, MP4, Excel",
      collectionDate: "2023-09-22",
      seller: "Deep Ocean Expeditions",
      quality: "Research grade",
      sampleAvailable: true,
      exclusivity: "limited"
    },
    {
      id: "3",
      title: "Graphene thermal conductivity measurements",
      description: "High-precision thermal conductivity measurements of graphene samples under varying temperature and pressure conditions.",
      category: "materials",
      price: 6800,
      dataSize: "850 MB", 
      format: "HDF5, MATLAB",
      collectionDate: "2023-10-05",
      seller: "Materials Science Consortium",
      quality: "ISO certified",
      sampleAvailable: false,
      exclusivity: "exclusive"
    }
  ];

  const handlePurchaseData = async (dataId: string) => {
    // TODO: Connect to Stripe payment processing
    // const response = await supabase.functions.invoke('create-data-purchase', {
    //   body: { dataId, buyerId: user.id }
    // });
    
    console.log("Purchasing data:", dataId);
    alert("Purchase functionality - TO BE CONNECTED TO STRIPE");
  };

  const handleViewSample = (dataId: string) => {
    // TODO: Connect to backend API for sample data
    console.log("Viewing sample for:", dataId);
    alert("Sample viewing functionality - TO BE CONNECTED TO BACKEND");
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

  const getExclusivityColor = (exclusivity: string) => {
    const colors = {
      "non-exclusive": "bg-green-100 text-green-800",
      "limited": "bg-orange-100 text-orange-800", 
      "exclusive": "bg-red-100 text-red-800"
    };
    return colors[exclusivity as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const filteredRequests = sellRequests.filter(request => {
    const matchesSearch = request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || request.category === categoryFilter;
    const matchesPrice = priceFilter === "all" ||
                        (priceFilter === "low" && request.price < 5000) ||
                        (priceFilter === "medium" && request.price >= 5000 && request.price < 10000) ||
                        (priceFilter === "high" && request.price >= 10000);
    
    return matchesSearch && matchesCategory && matchesPrice;
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
                  placeholder="Search data..."
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
                <Select value={priceFilter} onValueChange={setPriceFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Price Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Prices</SelectItem>
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
                    <Badge className={getExclusivityColor(request.exclusivity)}>
                      {request.exclusivity}
                    </Badge>
                    <Badge variant="outline">{request.quality}</Badge>
                    <span className="text-sm text-muted-foreground">by {request.seller}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-lg font-bold text-green-600">
                    <DollarSign className="w-4 h-4" />
                    {request.price.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Database className="w-3 h-3" />
                    {request.dataSize}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-3">
                {request.description}
              </CardDescription>
              
              <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                <div>
                  <strong>Format:</strong> {request.format}
                </div>
                <div>
                  <strong>Collection Date:</strong> {request.collectionDate}
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t">
                <div className="flex items-center gap-2">
                  {request.sampleAvailable && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewSample(request.id)}
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      View Sample
                    </Button>
                  )}
                  <span className="text-xs text-muted-foreground">
                    Secure payment via Stripe
                  </span>
                </div>
                <Button onClick={() => handlePurchaseData(request.id)}>
                  <Download className="w-4 h-4 mr-1" />
                  Purchase Data
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredRequests.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">No data for sale matching your criteria.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};