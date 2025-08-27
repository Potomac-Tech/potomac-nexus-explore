import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Header } from "@/components/layout/Header";
import { AuthProvider } from "@/contexts/AuthContext";
import { AuthGuard } from "@/components/auth/AuthGuard";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import LunarModule from "./pages/LunarModule";
import SeabedModule from "./pages/SeabedModule";
import DataMarketplace from "./pages/DataMarketplace";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import { SecurityDashboard } from "@/components/security/SecurityDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public auth route */}
            <Route path="/auth" element={
              <AuthGuard requireAuth={false}>
                <Auth />
              </AuthGuard>
            } />
            
            {/* Protected routes */}
            <Route path="/*" element={
              <AuthGuard>
                <SidebarProvider>
                  <div className="min-h-screen flex w-full bg-background">
                    <AppSidebar />
                    <div className="flex-1 flex flex-col">
                      <Header />
                      <main className="flex-1">
                        <Routes>
                          <Route path="/" element={<Landing />} />
                          <Route path="/dashboard" element={<Dashboard />} />
                          {/* Data Module Routes */}
                          <Route path="/lunar" element={<LunarModule />} />
                          <Route path="/seabed" element={<SeabedModule />} />
                          <Route path="/materials" element={<div className="p-6 text-center">Material Science Module - Coming Soon</div>} />
                          <Route path="/analytics" element={<div className="p-6 text-center">Data Analytics Dashboard - Coming Soon</div>} />
                          <Route path="/marketplace" element={<DataMarketplace />} />
                          
                          {/* Security & Admin Routes */}
                          <Route path="/users" element={<div className="p-6 text-center">User Management - Coming Soon</div>} />
                          <Route path="/security" element={<SecurityDashboard />} />
                          <Route path="/settings" element={<div className="p-6 text-center">System Settings - Coming Soon</div>} />
                          
                          {/* Catch all */}
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      </main>
                    </div>
                  </div>
                </SidebarProvider>
              </AuthGuard>
            } />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;