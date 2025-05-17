import { ReactNode, useState } from "react";
import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { useAuth } from "@/hooks/use-auth";

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
    <div className="min-h-screen flex bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Mobile Sidebar (controlled by state) */}
      <div className={`fixed inset-0 bg-gray-900 bg-opacity-50 z-20 md:hidden ${mobileSidebarOpen ? 'block' : 'hidden'}`} 
        onClick={() => setMobileSidebarOpen(false)}>
        <div 
          className={`bg-gray-800 text-white w-64 h-full transform transition-transform ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
          onClick={(e) => e.stopPropagation()}>
          <Sidebar 
            isMobile={true} 
            onClose={() => setMobileSidebarOpen(false)} 
          />
        </div>
      </div>

      {/* Mobile Sidebar Toggle */}
      <div className="md:hidden fixed bottom-4 right-4 z-10">
        <button 
          onClick={() => setMobileSidebarOpen(true)}
          className="bg-primary text-white p-3 rounded-full shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto">
        <Header />
        {children}
      </main>
    </div>
  );
}
