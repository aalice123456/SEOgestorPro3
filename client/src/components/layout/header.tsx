import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";

export function Header() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  
  // Format the current date for display
  const currentDate = format(new Date(), "EEEE, MMMM d, yyyy");

  if (!user) {
    return null; // Don't render if user is not authenticated
  }

  return (
    <header className="bg-white shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
          <p className="text-sm text-gray-500">{currentDate}</p>
        </div>
        
        <div className="flex items-center">
          <div className="relative mr-4">
            <Input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400 h-4 w-4" />
          </div>
          
          <div className="relative mr-4">
            <button className="relative">
              <Bell className="text-gray-500 h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                3
              </span>
            </button>
          </div>
          
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden mr-2">
              {user.fullName ? (
                <span className="text-sm font-medium text-gray-600">
                  {user.fullName.split(' ').map(name => name[0]).join('').toUpperCase()}
                </span>
              ) : (
                <img
                  src={`https://ui-avatars.com/api/?name=${user.username}&background=random`}
                  alt="User profile"
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium">{user.fullName || user.username}</p>
              <p className="text-xs text-gray-500">{user.role || "SEO Manager"}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
