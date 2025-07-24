import { Bell, Search, User, Shield, CheckCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  userName?: string;
  userRole?: string;
  cmmcLevel?: string;
}

export function Header({ 
  userName = "Dr. Sarah Chen", 
  userRole = "Senior Researcher",
  cmmcLevel = "Level 3" 
}: HeaderProps) {
  return (
    <header className="h-16 border-b border-border/30 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="flex items-center justify-between h-full px-6">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          <SidebarTrigger className="glow-on-hover" />
          
          {/* Search */}
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search databases, samples, or documentation..."
              className="pl-10 bg-muted/30 border-border/50 focus:border-primary/50 transition-colors"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* CMMC Compliance Status */}
          <div className="flex items-center space-x-2 px-3 py-1 rounded-lg status-cmmc">
            <Shield className="h-4 w-4" />
            <span className="text-sm font-medium">CMMC {cmmcLevel}</span>
            <CheckCircle className="h-4 w-4 text-success" />
          </div>

          {/* Security Status */}
          <Badge variant="secondary" className="status-secure">
            <CheckCircle className="h-3 w-3 mr-1" />
            Secure
          </Badge>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative glow-on-hover">
            <Bell className="h-5 w-5" />
            <div className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full flex items-center justify-center">
              <span className="text-xs text-primary-foreground">3</span>
            </div>
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2 glow-on-hover">
                <div className="h-8 w-8 rounded-full bg-gradient-primary flex items-center justify-center">
                  <User className="h-4 w-4 text-primary-foreground" />
                </div>
                <div className="text-left hidden md:block">
                  <div className="text-sm font-medium">{userName}</div>
                  <div className="text-xs text-muted-foreground">{userRole}</div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div>
                  <div className="font-medium">{userName}</div>
                  <div className="text-sm text-muted-foreground">{userRole}</div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile Settings</DropdownMenuItem>
              <DropdownMenuItem>Access Permissions</DropdownMenuItem>
              <DropdownMenuItem>Security Keys</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}