import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/layout/app-shell";
import { StatsCard } from "@/components/dashboard/stats-card";
import { ProjectsChart } from "@/components/dashboard/projects-chart";
import { UpcomingDeadlines } from "@/components/dashboard/upcoming-deadlines";
import { TaskProgress } from "@/components/dashboard/task-progress";
import { RecentClients } from "@/components/dashboard/recent-clients";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function DashboardPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  const renderContent = () => {
    if (isLoading) {
      return <DashboardSkeleton />;
    }

    if (error) {
      return (
        <Alert variant="destructive" className="my-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load dashboard data. Please try again later.
          </AlertDescription>
        </Alert>
      );
    }

    if (!data) {
      return (
        <Alert variant="default" className="my-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No Data</AlertTitle>
          <AlertDescription>
            No dashboard data available. Start by adding clients and projects.
          </AlertDescription>
        </Alert>
      );
    }

    return (
      <>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatsCard
            title="Active Projects"
            value={data.stats.activeProjects}
            icon="project"
            trend={{ value: 8, label: "since last month" }}
            color="blue"
          />
          <StatsCard
            title="Pending Tasks"
            value={data.stats.pendingTasks}
            icon="task"
            trend={{ value: 12, label: "since last week", isPositive: false }}
            color="amber"
          />
          <StatsCard
            title="Active Clients"
            value={data.stats.activeClients}
            icon="client"
            trend={{ value: 5, label: "since last month" }}
            color="indigo"
          />
          <StatsCard
            title="Completed Projects"
            value={data.stats.completedProjects}
            icon="completed"
            trend={{ value: 15, label: "since last quarter" }}
            color="green"
          />
        </div>

        {/* Project Overview and Upcoming Deadlines */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <ProjectsChart />
          </div>
          <div>
            <UpcomingDeadlines tasks={data.upcomingDeadlines} />
          </div>
        </div>

        {/* Task Progress, Recent Clients, and Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div>
            <RecentClients clients={data.recentClients} />
          </div>
          <div>
            <TaskProgress progress={data.taskProgress} />
          </div>
          <div>
            <RecentActivity activities={data.recentActivities} />
          </div>
        </div>
      </>
    );
  };

  return (
    <AppShell>
      <div className="py-6 px-6">
        {renderContent()}
      </div>
    </AppShell>
  );
}

function DashboardSkeleton() {
  return (
    <>
      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {[...Array(4)].map((_, i) => (
          <div className="bg-white rounded-lg shadow p-6" key={i}>
            <div className="flex justify-between items-center">
              <div>
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-8 w-12" />
              </div>
              <Skeleton className="h-12 w-12 rounded-full" />
            </div>
            <div className="mt-4">
              <Skeleton className="h-4 w-36" />
            </div>
          </div>
        ))}
      </div>

      {/* Charts Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <Skeleton className="h-6 w-40" />
            <div className="flex space-x-2">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-8 w-16" />
            </div>
          </div>
          <Skeleton className="h-64 w-full" />
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-16" />
          </div>
          {[...Array(4)].map((_, i) => (
            <div className="mb-4 pb-4 border-b border-gray-100" key={i}>
              <Skeleton className="h-5 w-full mb-2" />
              <Skeleton className="h-4 w-32 mb-2" />
              <div className="flex gap-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Third row skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div className="bg-white rounded-lg shadow p-6" key={i}>
            <div className="flex justify-between items-center mb-6">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="h-48 w-full" />
          </div>
        ))}
      </div>
    </>
  );
}
