import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { 
  PlusCircle, 
  Pencil, 
  Trash2, 
  Calendar, 
  AlignLeft, 
  CheckSquare,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Task, Project } from "@shared/schema";
import { format, isAfter, parseISO } from "date-fns";
import { TaskForm } from "@/components/tasks/task-form";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function TasksPage() {
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [projectFilter, setProjectFilter] = useState("all");
  const { toast } = useToast();

  // Fetch tasks
  const { data: tasks, isLoading: isLoadingTasks, error: tasksError } = useQuery<Task[]>({
    queryKey: ['/api/tasks'],
  });

  // Fetch projects for filtering and task creation
  const { data: projects } = useQuery<Project[]>({
    queryKey: ['/api/projects'],
  });

  // Delete task mutation
  const deleteTaskMutation = useMutation({
    mutationFn: async (taskId: number) => {
      await apiRequest('DELETE', `/api/tasks/${taskId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
      toast({
        title: 'Task deleted',
        description: 'The task has been successfully deleted',
      });
      setDeletingTask(null);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to delete task: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  // Handler functions
  const handleDeleteTask = (task: Task) => {
    setDeletingTask(task);
  };

  const confirmDeleteTask = () => {
    if (deletingTask) {
      deleteTaskMutation.mutate(deletingTask.id);
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
  };

  // Get project name from project id
  const getProjectName = (projectId: number) => {
    if (!projects) return "Unknown Project";
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : "Unknown Project";
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100">Pending</Badge>;
      case 'in_progress':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">In Progress</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Get priority badge
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">High</Badge>;
      case 'medium':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">Medium</Badge>;
      case 'low':
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Low</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-amber-500" />;
      case 'in_progress':
        return <CheckSquare className="h-5 w-5 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <CheckSquare className="h-5 w-5 text-gray-500" />;
    }
  };

  // Check if task is overdue
  const isTaskOverdue = (task: Task) => {
    if (!task.dueDate || task.status === 'completed') return false;
    return isAfter(new Date(), new Date(task.dueDate));
  };

  // Filter tasks based on search query and filters
  const filteredTasks = useMemo(() => {
    if (!tasks) return [];
    
    return tasks.filter((task) => {
      // Text search
      const matchesSearch = 
        searchQuery === "" || 
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));
      
      // Status filter
      const matchesStatus = statusFilter === "all" || task.status === statusFilter;
      
      // Priority filter
      const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter;
      
      // Project filter
      const matchesProject = projectFilter === "all" || task.projectId.toString() === projectFilter;
      
      return matchesSearch && matchesStatus && matchesPriority && matchesProject;
    });
  }, [tasks, searchQuery, statusFilter, priorityFilter, projectFilter]);

  // Render appropriate content based on loading/error state
  const renderContent = () => {
    if (isLoadingTasks) {
      return <TasksPageSkeleton />;
    }

    if (tasksError) {
      return (
        <Alert variant="destructive" className="my-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load tasks. Please try again later.
          </AlertDescription>
        </Alert>
      );
    }

    if (!filteredTasks || filteredTasks.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <CheckSquare className="h-16 w-16 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No tasks found</h3>
          <p className="text-sm text-gray-500 mb-6">
            {(!tasks || tasks.length === 0) 
              ? "Add your first task to get started" 
              : "No tasks match your current filters"}
          </p>
          <Button onClick={() => setIsAddTaskOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Task
          </Button>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTasks.map((task) => (
          <Card 
            key={task.id} 
            className={`p-5 border ${isTaskOverdue(task) ? 'border-red-200 bg-red-50' : ''}`}
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center">
                {getStatusIcon(task.status)}
                <h3 className="font-medium ml-2">{task.title}</h3>
              </div>
              <div className="flex space-x-1">
                <Button variant="ghost" size="icon" onClick={() => handleEditTask(task)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDeleteTask(task)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <p className="text-sm text-gray-500 mb-3">
              Project: {getProjectName(task.projectId)}
            </p>
            
            {task.description && (
              <div className="flex items-start mb-3">
                <AlignLeft className="h-4 w-4 mt-0.5 text-gray-500 mr-2" />
                <p className="text-sm text-gray-600 line-clamp-2">{task.description}</p>
              </div>
            )}
            
            {task.dueDate && (
              <div className="flex items-center mb-3">
                <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                <p className="text-sm">
                  Due: {format(new Date(task.dueDate), "MMM dd, yyyy")}
                  {isTaskOverdue(task) && (
                    <span className="text-red-600 font-medium ml-1">(Overdue)</span>
                  )}
                </p>
              </div>
            )}
            
            <div className="flex justify-between items-center mt-2">
              {getStatusBadge(task.status)}
              {getPriorityBadge(task.priority)}
            </div>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <AppShell>
      <div className="py-6 px-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">Tasks</h1>
            <p className="text-sm text-gray-500">Manage your SEO tasks</p>
          </div>
          <Button onClick={() => setIsAddTaskOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Task
          </Button>
        </div>

        {/* Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/3">
              <Input
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="grid grid-cols-3 gap-4 w-full md:w-2/3">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={projectFilter} onValueChange={setProjectFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by project" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Projects</SelectItem>
                  {projects && projects.map(project => (
                    <SelectItem key={project.id} value={project.id.toString()}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Task Tabs */}
        <Tabs defaultValue="all" className="mb-6">
          <TabsList>
            <TabsTrigger 
              value="all" 
              onClick={() => setStatusFilter("all")}
            >
              All Tasks
            </TabsTrigger>
            <TabsTrigger 
              value="pending" 
              onClick={() => setStatusFilter("pending")}
            >
              Pending
            </TabsTrigger>
            <TabsTrigger 
              value="in_progress" 
              onClick={() => setStatusFilter("in_progress")}
            >
              In Progress
            </TabsTrigger>
            <TabsTrigger 
              value="completed" 
              onClick={() => setStatusFilter("completed")}
            >
              Completed
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-4">
            {renderContent()}
          </TabsContent>
          <TabsContent value="pending" className="mt-4">
            {renderContent()}
          </TabsContent>
          <TabsContent value="in_progress" className="mt-4">
            {renderContent()}
          </TabsContent>
          <TabsContent value="completed" className="mt-4">
            {renderContent()}
          </TabsContent>
        </Tabs>

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

        {/* Edit Task Dialog */}
        <Dialog 
          open={editingTask !== null} 
          onOpenChange={(open) => !open && setEditingTask(null)}
        >
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Edit Task</DialogTitle>
              <DialogDescription>
                Update the task details below.
              </DialogDescription>
            </DialogHeader>
            {editingTask && (
              <TaskForm 
                task={editingTask} 
                onClose={() => setEditingTask(null)} 
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog
          open={deletingTask !== null}
          onOpenChange={(open) => !open && setDeletingTask(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the task "{deletingTask?.title}". This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={confirmDeleteTask}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AppShell>
  );
}

function TasksPageSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <Card key={i} className="p-5">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center">
              <Skeleton className="h-5 w-5 rounded-full" />
              <Skeleton className="h-5 w-40 ml-2" />
            </div>
            <div className="flex space-x-1">
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
          </div>
          
          <Skeleton className="h-4 w-48 mb-3" />
          
          <div className="flex items-start mb-3">
            <Skeleton className="h-4 w-4 mt-0.5 mr-2" />
            <Skeleton className="h-4 w-full" />
          </div>
          
          <div className="flex items-center mb-3">
            <Skeleton className="h-4 w-4 mr-2" />
            <Skeleton className="h-4 w-36" />
          </div>
          
          <div className="flex justify-between items-center mt-2">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        </Card>
      ))}
    </div>
  );
}
