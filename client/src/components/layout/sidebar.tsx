import { useLocation, Link } from "wouter";
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
} from "lucide-react";

interface SidebarProps {
  isMobile?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isMobile = false, onClose }: SidebarProps) {
  const [location] = useLocation();
  const { logoutMutation } = useAuth();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const isActive = (path: string) => {
    return location === path;
  };

  const linkClass = (path: string) => {
    return `flex items-center px-4 py-3 ${
      isActive(path)
        ? "text-gray-100 bg-gray-700"
        : "text-gray-300 hover:bg-gray-700 transition-colors"
    }`;
  };

  return (
    <aside className="bg-gray-800 text-white w-64 flex-shrink-0 h-full flex flex-col">
      <div className="p-4 flex items-center border-b border-gray-700">
        {isMobile && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white mr-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
        <div className="bg-blue-500 text-white p-2 rounded-lg mr-2">
          <BarChart2 size={20} />
        </div>
        <h1 className="text-xl font-bold">SeoGestorPro</h1>
      </div>

      <div className="py-4 flex-1 overflow-y-auto">
        <div className="px-4 py-2 text-gray-400 text-xs font-semibold uppercase">
          Main
        </div>

        <div className={linkClass("/")} onClick={() => {
            if (isMobile && onClose) onClose();
            window.location.href = "/";
          }}>
          <BarChart2 className="w-5 mr-3" />
          <span>Dashboard</span>
        </div>

        <div className={linkClass("/clients")} onClick={() => {
            if (isMobile && onClose) onClose();
            window.location.href = "/clients";
          }}>
          <Users className="w-5 mr-3" />
          <span>Clients</span>
        </div>

        <div className={linkClass("/projects")} onClick={() => {
            if (isMobile && onClose) onClose();
            window.location.href = "/projects";
          }}>
          <FolderKanban className="w-5 mr-3" />
          <span>Projects</span>
        </div>

        <div className={linkClass("/tasks")} onClick={() => {
            if (isMobile && onClose) onClose();
            window.location.href = "/tasks";
          }}>
          <CheckSquare className="w-5 mr-3" />
          <span>Tasks</span>
        </div>

        <div className={linkClass("/reports")} onClick={() => {
            if (isMobile && onClose) onClose();
            window.location.href = "/reports";
          }}>
          <FileText className="w-5 mr-3" />
          <span>Reports</span>
        </div>

        <div className="px-4 py-2 mt-4 text-gray-400 text-xs font-semibold uppercase">
          Settings
        </div>

        <div className={linkClass("/profile")} onClick={() => {
            if (isMobile && onClose) onClose();
            window.location.href = "/profile";
          }}>
          <UserCircle className="w-5 mr-3" />
          <span>My Profile</span>
        </div>

        <div className={linkClass("/settings")} onClick={() => {
            if (isMobile && onClose) onClose();
            window.location.href = "/settings";
          }}>
          <Settings className="w-5 mr-3" />
          <span>Settings</span>
        </div>
      </div>

      <div className="mt-auto p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="flex items-center text-gray-300 hover:text-white"
        >
          <LogOut className="mr-3" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
