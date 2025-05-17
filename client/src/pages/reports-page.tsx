import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { ReportGenerator } from "@/components/reports/report-generator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { Report, Project, Client } from "@shared/schema";
import { Download, FileText, ArrowRightCircle, Calendar } from "lucide-react";
import { format } from "date-fns";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ReportsPage() {
  // Fetch reports
  const { data: reports, isLoading: isLoadingReports, error: reportsError } = useQuery<Report[]>({
    queryKey: ['/api/reports'],
  });

  // Fetch projects for context
  const { data: projects } = useQuery<Project[]>({
    queryKey: ['/api/projects'],
  });

  // Fetch clients for context
  const { data: clients } = useQuery<Client[]>({
    queryKey: ['/api/clients'],
  });

  // Get project name from project id
  const getProjectName = (projectId: number) => {
    if (!projects) return "Unknown Project";
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : "Unknown Project";
  };

  // Get client name from project id
  const getClientName = (projectId: number) => {
    if (!projects || !clients) return "Unknown Client";
    const project = projects.find(p => p.id === projectId);
    if (!project) return "Unknown Client";
    
    const client = clients.find(c => c.id === project.clientId);
    return client ? client.name : "Unknown Client";
  };

  // Handle downloading a report
  const handleDownloadReport = (report: Report) => {
    // In a real app, this would trigger a download of the report
    console.log("Downloading report:", report);
    alert(`Downloading report: ${report.title}`);
  };

  // Render appropriate content based on loading/error state
  const renderReportsList = () => {
    if (isLoadingReports) {
      return <ReportsPageSkeleton />;
    }

    if (reportsError) {
      return (
        <Alert variant="destructive" className="my-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load reports. Please try again later.
          </AlertDescription>
        </Alert>
      );
    }

    if (!reports || reports.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <FileText className="h-16 w-16 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No reports found</h3>
          <p className="text-sm text-gray-500 mb-6">
            Generate your first SEO report to get started
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {reports.map((report) => (
          <Card key={report.id} className="overflow-hidden">
            <CardHeader className="pb-3 bg-gray-50">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{report.title}</CardTitle>
                  <CardDescription className="mt-1">
                    Project: {getProjectName(report.projectId)}
                  </CardDescription>
                </div>
                <Button size="sm" onClick={() => handleDownloadReport(report)}>
                  <Download className="h-4 w-4 mr-1" /> Download
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Calendar className="h-4 w-4" />
                  <span>Generated on {format(new Date(report.createdAt), "MMMM d, yyyy")}</span>
                </div>
                
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <ArrowRightCircle className="h-4 w-4" />
                  <span>Client: {getClientName(report.projectId)}</span>
                </div>
                
                <div className="mt-3 pt-3 border-t">
                  <h4 className="text-sm font-medium mb-1">Report Preview:</h4>
                  <p className="text-sm text-gray-600 line-clamp-3">{report.content}</p>
                </div>
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
            <h1 className="text-2xl font-semibold text-gray-800">Reports</h1>
            <p className="text-sm text-gray-500">Generate and manage SEO reports for your clients</p>
          </div>
        </div>

        <Tabs defaultValue="list" className="space-y-6">
          <TabsList>
            <TabsTrigger value="list">Reports List</TabsTrigger>
            <TabsTrigger value="generate">Generate Report</TabsTrigger>
          </TabsList>
          
          <TabsContent value="list" className="space-y-6">
            {renderReportsList()}
          </TabsContent>
          
          <TabsContent value="generate">
            <ReportGenerator />
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}

function ReportsPageSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {[...Array(4)].map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <CardHeader className="pb-3 bg-gray-50">
            <div className="flex justify-between items-start">
              <div>
                <Skeleton className="h-6 w-48 mb-1" />
                <Skeleton className="h-4 w-36" />
              </div>
              <Skeleton className="h-9 w-28 rounded-md" />
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-48" />
              </div>
              
              <div className="flex items-center space-x-2">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-40" />
              </div>
              
              <div className="mt-3 pt-3 border-t">
                <Skeleton className="h-4 w-32 mb-1" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
