import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import {
  BarChart2,
  Users,
  FolderKanban,
  CheckSquare,
  FileText,
  UserCircle,
  Settings,
  LogOut,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isMobile?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isMobile = false, onClose }: SidebarProps) {
  const [location, setLocation] = useLocation();
  const { logoutMutation } = useAuth();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const isActive = (path: string) => {
    return location === path;
  };

  const navigateTo = (path: string) => {
    if (isMobile && onClose) onClose();
    setLocation(path);
  };

  const NavItem = ({ path, icon, label }: { path: string; icon: React.ReactNode; label: string }) => (
    <Button
      variant="ghost"
      className={cn(
        "w-full justify-start gap-3 font-normal",
        isActive(path) ? "bg-primary/20 text-primary" : "hover:bg-muted"
      )}
      onClick={() => navigateTo(path)}
    >
      {icon}
      <span>{label}</span>
    </Button>
  );

  return (
    <aside className="bg-card/50 text-card-foreground w-64 flex-shrink-0 h-full flex flex-col border-r">
      <div className="p-4 flex items-center border-b">
        {isMobile && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="mr-2"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
        <div className="bg-gradient-to-r from-primary to-blue-600 text-white p-2 rounded-lg mr-2">
          <BarChart2 size={20} />
        </div>
        <h1 className="text-xl font-bold">SeoGestorPro</h1>
      </div>

      <div className="py-4 flex-1 overflow-y-auto space-y-1 px-3">
        <div className="text-xs font-semibold text-muted-foreground px-4 pt-2 pb-1 uppercase">
          Main
        </div>

        <NavItem path="/" icon={<BarChart2 className="h-5 w-5" />} label="Dashboard" />
        <NavItem path="/clients" icon={<Users className="h-5 w-5" />} label="Clients" />
        <NavItem path="/projects" icon={<FolderKanban className="h-5 w-5" />} label="Projects" />
        <NavItem path="/tasks" icon={<CheckSquare className="h-5 w-5" />} label="Tasks" />
        <NavItem path="/reports" icon={<FileText className="h-5 w-5" />} label="Reports" />

        <div className="text-xs font-semibold text-muted-foreground px-4 pt-4 pb-1 uppercase">
          Settings
        </div>

        <NavItem path="/profile" icon={<UserCircle className="h-5 w-5" />} label="My Profile" />
        <NavItem path="/settings" icon={<Settings className="h-5 w-5" />} label="Settings" />
      </div>

      <div className="mt-auto p-4 border-t">
        <Button
          variant="ghost" 
          className="w-full justify-start gap-3 text-red-600 hover:bg-red-100 hover:text-red-700 dark:hover:bg-red-900/20"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </Button>
      </div>
    </aside>
  );
}
