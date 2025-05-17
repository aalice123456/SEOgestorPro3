import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ActivityLog } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";
import { 
  FileText, 
  CheckCircle, 
  UserPlus,
  FolderKanban,
  Clock,
  Activity,
  Edit,
  Trash2,
  UserCheck
} from "lucide-react";

interface RecentActivityProps {
  activities?: ActivityLog[];
}

export function RecentActivity({ activities }: RecentActivityProps) {
  // Helper function to format time
  const formatTime = (dateStr: string | Date) => {
    try {
      const date = new Date(dateStr);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      return 'recently';
    }
  };

  // Helper function to get icon and color based on activity type
  const getActivityIcon = (activity: ActivityLog) => {
    const { action, entityType } = activity;
    
    if (action === 'created' && entityType === 'report') {
      return { icon: <FileText />, bgColor: 'bg-blue-100', textColor: 'text-blue-500' };
    }
    if (action === 'completed' || (action === 'updated' && entityType === 'task' && activity.details?.includes('completed'))) {
      return { icon: <CheckCircle />, bgColor: 'bg-green-100', textColor: 'text-green-500' };
    }
    if (action === 'created' && entityType === 'client') {
      return { icon: <UserPlus />, bgColor: 'bg-indigo-100', textColor: 'text-indigo-500' };
    }
    if (action === 'created' && entityType === 'project') {
      return { icon: <FolderKanban />, bgColor: 'bg-amber-100', textColor: 'text-amber-500' };
    }
    if (action === 'updated') {
      return { icon: <Edit />, bgColor: 'bg-purple-100', textColor: 'text-purple-500' };
    }
    if (action === 'deleted') {
      return { icon: <Trash2 />, bgColor: 'bg-red-100', textColor: 'text-red-500' };
    }
    if (action === 'logged_in' || action === 'registered') {
      return { icon: <UserCheck />, bgColor: 'bg-teal-100', textColor: 'text-teal-500' };
    }
    
    // Default
    return { icon: <Activity />, bgColor: 'bg-gray-100', textColor: 'text-gray-500' };
  };

  // Helper function to get activity title
  const getActivityTitle = (activity: ActivityLog) => {
    const { action, entityType, details } = activity;
    
    if (action === 'created' && entityType === 'report') {
      return 'New report generated';
    }
    if (action === 'completed' || (action === 'updated' && entityType === 'task' && details?.includes('completed'))) {
      return 'Task completed';
    }
    if (action === 'created' && entityType === 'client') {
      return 'New client added';
    }
    if (action === 'created' && entityType === 'project') {
      return 'New project created';
    }
    if (action === 'created' && entityType === 'task') {
      return 'New task created';
    }
    if (action === 'updated') {
      return `${entityType.charAt(0).toUpperCase() + entityType.slice(1)} updated`;
    }
    if (action === 'deleted') {
      return `${entityType.charAt(0).toUpperCase() + entityType.slice(1)} deleted`;
    }
    if (action === 'logged_in') {
      return 'User logged in';
    }
    if (action === 'registered') {
      return 'New user registered';
    }
    
    // Default
    return `${action.charAt(0).toUpperCase() + action.slice(1)} ${entityType}`;
  };

  // Handle view all activities
  const handleViewAll = () => {
    console.log('View all activities');
    // Navigate to activity log page
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
          <Button variant="link" size="sm" onClick={handleViewAll}>
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {activities && activities.length > 0 ? (
          <div className="relative">
            <div className="absolute top-0 bottom-0 left-4 w-0.5 bg-gray-200"></div>
            
            {activities.map((activity) => {
              const { icon, bgColor, textColor } = getActivityIcon(activity);
              
              return (
                <div key={activity.id} className="relative pl-10 pb-6 last:pb-0">
                  <div className={`absolute left-0 top-1 w-8 h-8 rounded-full ${bgColor} flex items-center justify-center ${textColor}`}>
                    {icon}
                  </div>
                  <div>
                    <h3 className="font-medium">{getActivityTitle(activity)}</h3>
                    <p className="text-sm text-gray-500">{activity.details}</p>
                    <span className="text-xs text-gray-400">{formatTime(activity.createdAt)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <Clock className="h-10 w-10 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500">No recent activity</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
