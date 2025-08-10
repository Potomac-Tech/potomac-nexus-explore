import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Header } from "@/components/layout/Header";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import LunarModule from "./pages/LunarModule";
import SeabedModule from "./pages/SeabedModule";
import DataMarketplace from "./pages/DataMarketplace";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
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
                  
                  {/* Admin Routes - To be implemented */}
                  <Route path="/users" element={<div className="p-6 text-center">User Management - Coming Soon</div>} />
                  <Route path="/security" element={<div className="p-6 text-center">Security & CMMC Dashboard - Coming Soon</div>} />
                  <Route path="/settings" element={<div className="p-6 text-center">System Settings - Coming Soon</div>} />
                  
                  {/* Catch all */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>
          </div>
        </SidebarProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;