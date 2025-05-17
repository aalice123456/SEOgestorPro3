import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { PlusCircle, Pencil, Trash2, Building2, User, Mail, Phone, Globe } from "lucide-react";
import { Client } from "@shared/schema";
import { ClientForm } from "@/components/clients/client-form";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
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
import { Skeleton } from "@/components/ui/skeleton";

export default function ClientsPage() {
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [deletingClient, setDeletingClient] = useState<Client | null>(null);
  const { toast } = useToast();

  const { data: clients, isLoading, error } = useQuery<Client[]>({
    queryKey: ['/api/clients'],
  });

  const deleteClientMutation = useMutation({
    mutationFn: async (clientId: number) => {
      await apiRequest('DELETE', `/api/clients/${clientId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/clients'] });
      toast({
        title: 'Client deleted',
        description: 'The client has been successfully deleted',
      });
      setDeletingClient(null);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to delete client: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  const handleDeleteClient = (client: Client) => {
    setDeletingClient(client);
  };

  const confirmDeleteClient = () => {
    if (deletingClient) {
      deleteClientMutation.mutate(deletingClient.id);
    }
  };

  const handleEditClient = (client: Client) => {
    setEditingClient(client);
  };

  const renderContent = () => {
    if (isLoading) {
      return <ClientsPageSkeleton />;
    }

    if (error) {
      return (
        <Alert variant="destructive" className="my-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load clients. Please try again later.
          </AlertDescription>
        </Alert>
      );
    }

    if (!clients || clients.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <Building2 className="h-16 w-16 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No clients yet</h3>
          <p className="text-sm text-gray-500 mb-6">Add your first client to get started</p>
          <Button onClick={() => setIsAddClientOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Client
          </Button>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.map((client) => (
          <Card key={client.id} className="overflow-hidden">
            <CardHeader className="bg-gray-50 pb-4">
              <div className="flex justify-between">
                <CardTitle className="truncate">{client.name}</CardTitle>
                <div className="flex space-x-1">
                  <Button variant="ghost" size="icon" onClick={() => handleEditClient(client)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteClient(client)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3">
                <div className="flex items-start">
                  <User className="h-4 w-4 mr-2 mt-0.5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Contact Person</p>
                    <p className="text-sm text-gray-500">{client.contactPerson}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Mail className="h-4 w-4 mr-2 mt-0.5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-gray-500 break-all">{client.email}</p>
                  </div>
                </div>
                {client.phone && (
                  <div className="flex items-start">
                    <Phone className="h-4 w-4 mr-2 mt-0.5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Phone</p>
                      <p className="text-sm text-gray-500">{client.phone}</p>
                    </div>
                  </div>
                )}
                {client.website && (
                  <div className="flex items-start">
                    <Globe className="h-4 w-4 mr-2 mt-0.5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Website</p>
                      <p className="text-sm text-gray-500 truncate">{client.website}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
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
            <h1 className="text-2xl font-semibold text-gray-800">Clients</h1>
            <p className="text-sm text-gray-500">Manage your client information</p>
          </div>
          <Button onClick={() => setIsAddClientOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Client
          </Button>
        </div>

        {renderContent()}

        {/* Add Client Dialog */}
        <Dialog open={isAddClientOpen} onOpenChange={setIsAddClientOpen}>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Add New Client</DialogTitle>
              <DialogDescription>
                Enter the client details below to create a new client.
              </DialogDescription>
            </DialogHeader>
            <ClientForm onClose={() => setIsAddClientOpen(false)} />
          </DialogContent>
        </Dialog>

        {/* Edit Client Dialog */}
        <Dialog 
          open={editingClient !== null} 
          onOpenChange={(open) => !open && setEditingClient(null)}
        >
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Edit Client</DialogTitle>
              <DialogDescription>
                Update the client details below.
              </DialogDescription>
            </DialogHeader>
            {editingClient && (
              <ClientForm 
                client={editingClient} 
                onClose={() => setEditingClient(null)} 
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog
          open={deletingClient !== null}
          onOpenChange={(open) => !open && setDeletingClient(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the client "{deletingClient?.name}" and all associated data. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={confirmDeleteClient}
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

function ClientsPageSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <CardHeader className="bg-gray-50 pb-4">
            <div className="flex justify-between">
              <Skeleton className="h-6 w-32" />
              <div className="flex space-x-1">
                <Skeleton className="h-8 w-8 rounded-md" />
                <Skeleton className="h-8 w-8 rounded-md" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-3">
              {[...Array(4)].map((_, j) => (
                <div className="flex items-start" key={j}>
                  <Skeleton className="h-4 w-4 mr-2 mt-0.5" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-24 mb-1" />
                    <Skeleton className="h-4 w-36" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
