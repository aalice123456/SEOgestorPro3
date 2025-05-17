import { ReactNode, useState } from "react";
import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { useAuth } from "@/hooks/use-auth";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const { user } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  
  if (!user) {
    return null; // Don't render if user is not authenticated
  }

  return (
    <div className="min-h-screen flex bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Mobile Sidebar (controlled by state) */}
      <div className={`fixed inset-0 bg-background/80 backdrop-blur-sm z-50 md:hidden ${mobileSidebarOpen ? 'block' : 'hidden'}`} 
        onClick={() => setMobileSidebarOpen(false)}>
        <div 
          className={`fixed inset-y-0 left-0 w-64 transition-transform duration-300 ease-in-out ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
          onClick={(e) => e.stopPropagation()}>
          <ScrollArea className="h-full">
            <Sidebar 
              isMobile={true} 
              onClose={() => setMobileSidebarOpen(false)} 
            />
          </ScrollArea>
        </div>
      </div>

      {/* Mobile Sidebar Toggle */}
      <div className="md:hidden fixed bottom-4 right-4 z-30">
        <Button 
          variant="default"
          size="icon"
          onClick={() => setMobileSidebarOpen(true)}
          className="rounded-full shadow-lg h-12 w-12 flex items-center justify-center">
          <Menu className="h-6 w-6" />
        </Button>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto">
        <Header />
        <div className="container mx-auto px-4 pt-4 pb-16">
          {children}
        </div>
      </main>
    </div>
  );
}
