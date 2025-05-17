import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Client } from "@shared/schema";
import { ChevronRight, Plus, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ClientForm } from "../clients/client-form";
import { useLocation } from "wouter";

interface RecentClientsProps {
  clients?: Client[];
}

export function RecentClients({ clients }: RecentClientsProps) {
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const [, navigate] = useLocation();

  // Generate initials from client name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Get random color class for initials background
  const getColorClass = (clientId: number) => {
    const colors = [
      'bg-gray-200 text-gray-600', 
      'bg-blue-100 text-blue-600', 
      'bg-green-100 text-green-600',
      'bg-amber-100 text-amber-600',
      'bg-purple-100 text-purple-600',
      'bg-red-100 text-red-600',
      'bg-indigo-100 text-indigo-600'
    ];
    return colors[clientId % colors.length];
  };

  // Format the time since client was added
  const formatAddedTime = (dateStr: string | Date) => {
    try {
      const date = new Date(dateStr);
      return `Added ${formatDistanceToNow(date, { addSuffix: false })} ago`;
    } catch (error) {
      return 'Recently added';
    }
  };

  // Navigate to client details or clients list
  const handleViewAll = () => {
    navigate("/clients");
  };

  const handleViewClient = (clientId: number) => {
    navigate(`/clients/${clientId}`);
  };

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">Recent Clients</CardTitle>
            <Button variant="link" size="sm" onClick={handleViewAll}>
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {clients && clients.length > 0 ? (
            <div>
              {clients.map((client) => (
                <div 
                  key={client.id}
                  className="flex items-center py-3 border-b border-gray-100 last:border-0"
                >
                  <div className={`w-10 h-10 rounded-full ${getColorClass(client.id)} flex items-center justify-center text-center mr-3`}>
                    <span>{getInitials(client.name)}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{client.name}</h3>
                    <p className="text-xs text-gray-500">{formatAddedTime(client.createdAt)}</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleViewClient(client.id)}
                  >
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <User className="h-10 w-10 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500 mb-2">No clients yet</p>
            </div>
          )}
          <Button 
            variant="outline" 
            className="w-full mt-4 py-2 text-primary hover:bg-primary/10"
            onClick={() => setIsAddClientOpen(true)}
          >
            <Plus className="h-4 w-4 mr-1" /> Add New Client
          </Button>
        </CardContent>
      </Card>

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
    </>
  );
}
