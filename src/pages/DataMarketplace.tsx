import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, TrendingUp, Clock, DollarSign, Plus, Crown } from "lucide-react";
import { CreateBuyRequestForm } from "@/components/marketplace/CreateBuyRequestForm";
import { CreateSellRequestForm } from "@/components/marketplace/CreateSellRequestForm";
import { BuyRequestsList } from "@/components/marketplace/BuyRequestsList";
import { SellRequestsList } from "@/components/marketplace/SellRequestsList";

const DataMarketplace = () => {
  const [activeTab, setActiveTab] = useState("browse");
  const [showCreateBuyForm, setShowCreateBuyForm] = useState(false);
  const [showCreateSellForm, setShowCreateSellForm] = useState(false);
  
  // Mock premium user check - TO BE REPLACED WITH ACTUAL AUTH
  const isPremiumUser = true; // TODO: Connect to Supabase auth and subscription status

  if (!isPremiumUser) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="text-center space-y-6">
          <Crown className="mx-auto h-16 w-16 text-muted-foreground" />
          <div>
            <h1 className="text-3xl font-bold mb-2">Premium Feature</h1>
            <p className="text-muted-foreground">
              The Data Marketplace is available for Premium subscribers only.
            </p>
          </div>
          <Button size="lg">
            {/* TODO: Connect to Stripe subscription upgrade */}
            Upgrade to Premium
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-3xl font-bold">Data Marketplace</h1>
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                <Crown className="w-3 h-3 mr-1" />
                Premium
              </Badge>
            </div>
            <p className="text-muted-foreground">
              Buy and sell scientific data with the research community
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowCreateBuyForm(true)}
              className="flex items-center gap-2"
            >
              <ShoppingCart className="w-4 h-4" />
              Create Buy Request
            </Button>
            <Button 
              onClick={() => setShowCreateSellForm(true)}
              className="flex items-center gap-2"
            >
              <TrendingUp className="w-4 h-4" />
              Create Sell Request
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">24</p>
                  <p className="text-sm text-muted-foreground">Active Buy Requests</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">18</p>
                  <p className="text-sm text-muted-foreground">Data for Sale</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-orange-500" />
                <div>
                  <p className="text-2xl font-bold">12</p>
                  <p className="text-sm text-muted-foreground">Pending Contracts</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-purple-500" />
                <div>
                  <p className="text-2xl font-bold">$45.2K</p>
                  <p className="text-sm text-muted-foreground">Total Volume</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="browse">Browse Requests</TabsTrigger>
            <TabsTrigger value="buy-requests">Buy Requests</TabsTrigger>
            <TabsTrigger value="sell-requests">Sell Requests</TabsTrigger>
            <TabsTrigger value="my-activity">My Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Data Buy Requests</h3>
                <BuyRequestsList />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Data for Sale</h3>
                <SellRequestsList />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="buy-requests">
            <BuyRequestsList showFilters />
          </TabsContent>

          <TabsContent value="sell-requests">
            <SellRequestsList showFilters />
          </TabsContent>

          <TabsContent value="my-activity">
            <Card>
              <CardHeader>
                <CardTitle>My Marketplace Activity</CardTitle>
                <CardDescription>
                  Track your buy requests, sell requests, and completed transactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center py-8">
                  {/* TODO: Connect to backend to load user's marketplace activity */}
                  Your marketplace activity will appear here
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Modals */}
        {showCreateBuyForm && (
          <CreateBuyRequestForm 
            open={showCreateBuyForm} 
            onClose={() => setShowCreateBuyForm(false)} 
          />
        )}
        
        {showCreateSellForm && (
          <CreateSellRequestForm 
            open={showCreateSellForm} 
            onClose={() => setShowCreateSellForm(false)} 
          />
        )}
      </div>
    </div>
  );
};

export default DataMarketplace;