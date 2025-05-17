import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { 
  PlusCircle, Pencil, Trash2, CalendarRange, BarChart3, AlignLeft, 
  Link2, Clock, CheckCircle, PauseCircle, FolderKanban, Globe
} from "lucide-react";
import { Project } from "@shared/schema";
import { ProjectForm } from "@/components/projects/project-form";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
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
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProjectsPage() {
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deletingProject, setDeletingProject] = useState<Project | null>(null);
  const { toast } = useToast();

  const { data: projects, isLoading, error } = useQuery<Project[]>({
    queryKey: ['/api/projects'],
  });

  const { data: clients } = useQuery({
    queryKey: ['/api/clients'],
  });

  const deleteProjectMutation = useMutation({
    mutationFn: async (projectId: number) => {
      await apiRequest('DELETE', `/api/projects/${projectId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
      toast({
        title: 'Project deleted',
        description: 'The project has been successfully deleted',
      });
      setDeletingProject(null);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to delete project: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  const handleDeleteProject = (project: Project) => {
    setDeletingProject(project);
  };

  const confirmDeleteProject = () => {
    if (deletingProject) {
      deleteProjectMutation.mutate(deletingProject.id);
    }
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'in_progress':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">In Progress</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>;
      case 'paused':
        return <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100">Paused</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getClientName = (clientId: number) => {
    if (!clients) return 'Loading...';
    const client = clients.find(c => c.id === clientId);
    return client ? client.name : 'Unknown Client';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'in_progress':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'paused':
        return <PauseCircle className="h-5 w-5 text-amber-500" />;
      default:
        return <FolderKanban className="h-5 w-5 text-gray-500" />;
    }
  };

  const filterProjectsByStatus = (status: string) => {
    if (!projects) return [];
    return status === 'all' 
      ? projects 
      : projects.filter(project => project.status === status);
  };

  const renderContent = (filteredProjects: Project[]) => {
    if (isLoading) {
      return <ProjectsPageSkeleton />;
    }

    if (error) {
      return (
        <Alert variant="destructive" className="my-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load projects. Please try again later.
          </AlertDescription>
        </Alert>
      );
    }

    if (!filteredProjects || filteredProjects.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <FolderKanban className="h-16 w-16 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No projects found</h3>
          <p className="text-sm text-gray-500 mb-6">
            {!projects || projects.length === 0 
              ? "Add your first project to get started" 
              : "No projects match the selected filter"}
          </p>
          <Button onClick={() => setIsAddProjectOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Project
          </Button>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <Card key={project.id} className="overflow-hidden">
            <CardHeader className="bg-secondary/50 pb-4">
              <div className="flex justify-between">
                <CardTitle className="truncate">{project.name}</CardTitle>
                <div className="flex space-x-1">
                  <Button variant="ghost" size="icon" onClick={() => handleEditProject(project)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteProject(project)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
              <CardDescription className="flex items-center mt-1">
                <BarChart3 className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                {getClientName(project.clientId)}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3">
                <div className="flex items-start">
                  <Globe className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Website</p>
                    <p className="text-sm text-muted-foreground break-all">{project.website}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CalendarRange className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Timeline</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(project.startDate), 'MMM dd, yyyy')} 
                      {project.endDate && ` - ${format(new Date(project.endDate), 'MMM dd, yyyy')}`}
                    </p>
                  </div>
                </div>
                {project.description && (
                  <div className="flex items-start">
                    <AlignLeft className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Description</p>
                      <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                    </div>
                  </div>
                )}
                {project.attachments && project.attachments.length > 0 && (
                  <div className="flex items-start">
                    <Link2 className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Attachments</p>
                      <p className="text-sm text-muted-foreground">{project.attachments.length} file(s)</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="bg-secondary/50 py-2 px-6 flex justify-between items-center">
              <div className="flex items-center">
                {getStatusIcon(project.status)}
                <span className="ml-2 text-sm font-medium">Status:</span>
              </div>
              {getStatusBadge(project.status)}
            </CardFooter>
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
            <h1 className="text-2xl font-semibold">Projects</h1>
            <p className="text-sm text-muted-foreground">Manage your SEO projects</p>
          </div>
          <Button onClick={() => setIsAddProjectOpen(true)} className="bg-gradient-to-r from-primary to-blue-600 hover:opacity-90">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Project
          </Button>
        </div>

        <Tabs defaultValue="all" className="mb-6">
          <TabsList>
            <TabsTrigger value="all">All Projects</TabsTrigger>
            <TabsTrigger value="in_progress">In Progress</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="paused">Paused</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            {renderContent(filterProjectsByStatus('all'))}
          </TabsContent>
          <TabsContent value="in_progress">
            {renderContent(filterProjectsByStatus('in_progress'))}
          </TabsContent>
          <TabsContent value="completed">
            {renderContent(filterProjectsByStatus('completed'))}
          </TabsContent>
          <TabsContent value="paused">
            {renderContent(filterProjectsByStatus('paused'))}
          </TabsContent>
        </Tabs>

        {/* Add Project Dialog */}
        <Dialog open={isAddProjectOpen} onOpenChange={setIsAddProjectOpen}>
          <DialogContent className="sm:max-w-[650px]">
            <DialogHeader>
              <DialogTitle>Add New Project</DialogTitle>
              <DialogDescription>
                Enter the project details below to create a new SEO project.
              </DialogDescription>
            </DialogHeader>
            <ProjectForm onClose={() => setIsAddProjectOpen(false)} />
          </DialogContent>
        </Dialog>

        {/* Edit Project Dialog */}
        <Dialog 
          open={editingProject !== null} 
          onOpenChange={(open) => !open && setEditingProject(null)}
        >
          <DialogContent className="sm:max-w-[650px]">
            <DialogHeader>
              <DialogTitle>Edit Project</DialogTitle>
              <DialogDescription>
                Update the project details below.
              </DialogDescription>
            </DialogHeader>
            {editingProject && (
              <ProjectForm 
                project={editingProject} 
                onClose={() => setEditingProject(null)} 
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog
          open={deletingProject !== null}
          onOpenChange={(open) => !open && setDeletingProject(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the project "{deletingProject?.name}" and all associated tasks. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={confirmDeleteProject}
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

function ProjectsPageSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <CardHeader className="bg-gray-50 pb-4">
            <div className="flex justify-between">
              <Skeleton className="h-6 w-40" />
              <div className="flex space-x-1">
                <Skeleton className="h-8 w-8 rounded-md" />
                <Skeleton className="h-8 w-8 rounded-md" />
              </div>
            </div>
            <div className="mt-1">
              <Skeleton className="h-4 w-32" />
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-3">
              {[...Array(3)].map((_, j) => (
                <div className="flex items-start" key={j}>
                  <Skeleton className="h-4 w-4 mr-2 mt-0.5" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-24 mb-1" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="bg-gray-50 py-2 px-6 flex justify-between items-center">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-6 w-24 rounded-full" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
