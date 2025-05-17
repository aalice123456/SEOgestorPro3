import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { insertReportSchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, FileText, CheckCircle, Download } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Extended schema for form validation
const reportFormSchema = insertReportSchema
  .extend({
    includeTaskStats: z.boolean().default(true),
    includeCharts: z.boolean().default(true),
    includeClientInfo: z.boolean().default(true),
  })
  .omit({ createdBy: true }); // omit fields that are set server-side

// Infer the form values type from the schema
type ReportFormValues = z.infer<typeof reportFormSchema>;

export function ReportGenerator() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("generate");
  const [generatedReport, setGeneratedReport] = useState<any>(null);

  // Fetch projects for the dropdown
  const { data: projects, isLoading: isLoadingProjects } = useQuery({
    queryKey: ['/api/projects'],
  });

  // Fetch reports
  const { data: reports, isLoading: isLoadingReports } = useQuery({
    queryKey: ['/api/reports'],
  });

  // Initialize the form
  const form = useForm<ReportFormValues>({
    resolver: zodResolver(reportFormSchema),
    defaultValues: {
      title: "",
      projectId: undefined,
      content: "",
      includeTaskStats: true,
      includeCharts: true,
      includeClientInfo: true,
    },
  });

  // Create report mutation
  const createReportMutation = useMutation({
    mutationFn: async (data: ReportFormValues) => {
      // Strip out the additional form fields that aren't in the API schema
      const { includeTaskStats, includeCharts, includeClientInfo, ...reportData } = data;
      
      // In a real app, you might generate some content based on the selected options
      if (!reportData.content) {
        reportData.content = `Generated report for project ${reportData.projectId}. ${
          includeTaskStats ? "Includes task statistics. " : ""
        }${includeCharts ? "Includes performance charts. " : ""}${
          includeClientInfo ? "Includes client information. " : ""
        }`;
      }
      
      const response = await apiRequest("POST", "/api/reports", reportData);
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/reports"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({
        title: "Success",
        description: "Report generated successfully",
      });
      
      // Set the generated report and switch to the view tab
      setGeneratedReport(data);
      setActiveTab("view");
      
      // Reset the form
      form.reset();
    },
    onError: (error) => {
      console.error("Error generating report:", error);
      toast({
        title: "Error",
        description: `Failed to generate report: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Submit handler
  const onSubmit = (values: ReportFormValues) => {
    createReportMutation.mutate(values);
  };

  // Handle downloading a report
  const handleDownloadReport = (report: any) => {
    // In a real app, this would trigger a download of the report
    toast({
      title: "Download Started",
      description: `Downloading report: ${report.title}`,
    });
  };

  // Get project name from project id
  const getProjectName = (projectId: number) => {
    if (!projects) return "Unknown Project";
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : "Unknown Project";
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="generate" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="generate">Generate Report</TabsTrigger>
          <TabsTrigger value="view">View Generated</TabsTrigger>
          <TabsTrigger value="history">Report History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="generate" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Generate SEO Report</CardTitle>
              <CardDescription>
                Create a comprehensive SEO report for your client
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Report Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter report title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="projectId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project</FormLabel>
                        <Select 
                          onValueChange={(value) => field.onChange(parseInt(value))}
                          defaultValue={field.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a project" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {isLoadingProjects ? (
                              <SelectItem value="loading" disabled>Loading projects...</SelectItem>
                            ) : projects && projects.length > 0 ? (
                              projects.map((project) => (
                                <SelectItem key={project.id} value={project.id.toString()}>
                                  {project.name}
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem value="none" disabled>No projects available</SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-2">
                    <FormLabel>Report Options</FormLabel>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="includeTaskStats"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Task Statistics</FormLabel>
                              <FormDescription className="text-xs">
                                Include task completion statistics
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="includeCharts"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Performance Charts</FormLabel>
                              <FormDescription className="text-xs">
                                Include visual performance charts
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="includeClientInfo"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Client Information</FormLabel>
                              <FormDescription className="text-xs">
                                Include client details in report
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional Content (Optional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter any additional content for the report" 
                            className="resize-none" 
                            rows={5} 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full mt-2" 
                    disabled={createReportMutation.isPending}
                  >
                    {createReportMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating Report...
                      </>
                    ) : (
                      <>
                        <FileText className="mr-2 h-4 w-4" />
                        Generate Report
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="view" className="pt-4">
          {generatedReport ? (
            <Card>
              <CardHeader className="bg-green-50 border-b">
                <div className="flex items-center">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-2" />
                  <div>
                    <CardTitle>Report Generated Successfully</CardTitle>
                    <CardDescription>
                      Your report has been created and is ready to download
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold">{generatedReport.title}</h3>
                    <p className="text-sm text-gray-500">
                      Project: {getProjectName(generatedReport.projectId)}
                    </p>
                  </div>
                  
                  <div className="rounded-md bg-gray-50 p-4">
                    <h4 className="text-sm font-medium mb-2">Report Content Preview</h4>
                    <p className="text-sm text-gray-600">{generatedReport.content}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-gray-50 flex justify-end gap-4">
                <Button 
                  variant="outline"
                  onClick={() => setActiveTab("generate")}
                >
                  Create Another
                </Button>
                <Button 
                  onClick={() => handleDownloadReport(generatedReport)}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Report
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>No Recent Report</CardTitle>
                <CardDescription>
                  You haven't generated any reports in this session yet
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center py-8">
                <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Generate a new report to see it here</p>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button onClick={() => setActiveTab("generate")}>
                  Generate Report
                </Button>
              </CardFooter>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="history" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Report History</CardTitle>
              <CardDescription>
                View and download previously generated reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingReports ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                </div>
              ) : reports && reports.length > 0 ? (
                <div className="space-y-4">
                  {reports.map((report) => (
                    <div 
                      key={report.id}
                      className="flex items-center justify-between p-4 border rounded-md hover:bg-gray-50"
                    >
                      <div className="flex items-start space-x-3">
                        <FileText className="h-5 w-5 text-blue-500 mt-0.5" />
                        <div>
                          <h3 className="font-medium">{report.title}</h3>
                          <p className="text-sm text-gray-500">
                            Project: {getProjectName(report.projectId)}
                          </p>
                          <p className="text-xs text-gray-400">
                            Created: {new Date(report.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Button 
                        size="sm"
                        onClick={() => handleDownloadReport(report)}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No reports have been generated yet</p>
                  <Button onClick={() => setActiveTab("generate")}>
                    Generate Your First Report
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Helper component for the report form
function FormDescription({ children }: { children: React.ReactNode }) {
  return <p className="text-gray-500">{children}</p>;
}
