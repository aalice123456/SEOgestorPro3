import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Task, Project, Client } from "@shared/schema";
import { Calendar, ChevronRight, Plus } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { format, isToday, isTomorrow, addDays, differenceInDays } from "date-fns";
import { useState } from "react";
import { TaskForm } from "../tasks/task-form";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { queryClient } from "@/lib/queryClient";

interface UpcomingDeadlinesProps {
  tasks?: Task[];
}

export function UpcomingDeadlines({ tasks }: UpcomingDeadlinesProps) {
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  
  const { data: projects } = useQuery<Project[]>({
    queryKey: ['/api/projects'],
  });

  const { data: clients } = useQuery<Client[]>({
    queryKey: ['/api/clients'],
  });

  // Function to get project name from project id
  const getProjectName = (projectId: number) => {
    if (!projects) return "Loading...";
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : "Unknown Project";
  };

  // Function to get client name from project
  const getClientName = (projectId: number) => {
    if (!projects || !clients) return "Loading...";
    const project = projects.find(p => p.id === projectId);
    if (!project) return "Unknown Client";
    const client = clients.find(c => c.id === project.clientId);
    return client ? client.name : "Unknown Client";
  };

  // Function to format due date in a user-friendly way
  const formatDueDate = (dueDate: string | Date) => {
    const date = new Date(dueDate);
    
    if (isToday(date)) {
      return "Due Today";
    } else if (isTomorrow(date)) {
      return "Due Tomorrow";
    } else {
      const daysUntil = differenceInDays(date, new Date());
      if (daysUntil < 0) {
        return `Overdue by ${Math.abs(daysUntil)} day${Math.abs(daysUntil) !== 1 ? 's' : ''}`;
      } else if (daysUntil <= 7) {
        return `Due in ${daysUntil} day${daysUntil !== 1 ? 's' : ''}`;
      } else {
        return `Due on ${format(date, 'MMM d')}`;
      }
    }
  };

  // Function to render priority badge
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100">High Priority</Badge>;
      case 'medium':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">Medium Priority</Badge>;
      case 'low':
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Low Priority</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  // Function to view all tasks (would navigate to tasks page)
  const handleViewAll = () => {
    window.location.href = "/tasks";
  };

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">Upcoming Deadlines</CardTitle>
            <Button variant="link" size="sm" onClick={handleViewAll}>
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {tasks && tasks.length > 0 ? (
            <div className="space-y-4">
              {tasks.map((task) => (
                <div key={task.id} className="mb-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0 last:mb-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">{task.title}</h3>
                      <p className="text-sm text-gray-500">Client: {getClientName(task.projectId)}</p>
                      <div className="flex mt-2 items-center">
                        {getPriorityBadge(task.priority)}
                        <span className="text-xs text-gray-600 ml-2">
                          <Calendar className="inline-block h-3 w-3 mr-1" />
                          {task.dueDate ? formatDueDate(task.dueDate) : "No due date"}
                        </span>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No upcoming deadlines</p>
            </div>
          )}
          <Button 
            variant="outline" 
            className="w-full mt-2 py-2 text-primary hover:bg-primary/10"
            onClick={() => setIsAddTaskOpen(true)}
          >
            <Plus className="h-4 w-4 mr-1" /> Add New Task
          </Button>
        </CardContent>
      </Card>

      {/* Add Task Dialog */}
      <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
            <DialogDescription>
              Enter the task details below to create a new task.
            </DialogDescription>
          </DialogHeader>
          <TaskForm onClose={() => setIsAddTaskOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
}
