import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { Button } from "@/components/ui/button";

// Chart data for each time period
const mockMonthlyData = [
  { name: 'Jan', total: 10, completed: 7 },
  { name: 'Feb', total: 15, completed: 8 },
  { name: 'Mar', total: 20, completed: 14 },
  { name: 'Apr', total: 12, completed: 7 },
  { name: 'May', total: 18, completed: 15 },
  { name: 'Jun', total: 22, completed: 17 },
];

const mockWeeklyData = [
  { name: 'Mon', total: 5, completed: 3 },
  { name: 'Tue', total: 7, completed: 4 },
  { name: 'Wed', total: 3, completed: 2 },
  { name: 'Thu', total: 6, completed: 5 },
  { name: 'Fri', total: 8, completed: 4 },
  { name: 'Sat', total: 2, completed: 1 },
  { name: 'Sun', total: 1, completed: 0 },
];

const mockYearlyData = [
  { name: 'Jan', total: 10, completed: 7 },
  { name: 'Feb', total: 15, completed: 8 },
  { name: 'Mar', total: 20, completed: 14 },
  { name: 'Apr', total: 12, completed: 7 },
  { name: 'May', total: 18, completed: 15 },
  { name: 'Jun', total: 22, completed: 17 },
  { name: 'Jul', total: 17, completed: 12 },
  { name: 'Aug', total: 15, completed: 10 },
  { name: 'Sep', total: 20, completed: 15 },
  { name: 'Oct', total: 25, completed: 18 },
  { name: 'Nov', total: 18, completed: 12 },
  { name: 'Dec', total: 15, completed: 10 },
];

export function ProjectsChart() {
  const [timeFrame, setTimeFrame] = useState<'week' | 'month' | 'year'>('month');
  
  // Fetch project stats from backend, fallback to mock data for now
  const { data: statsData } = useQuery({
    queryKey: ['/api/dashboard/stats'],
  });

  // Determine which data to use based on selected time frame
  const chartData = (() => {
    switch (timeFrame) {
      case 'week':
        return mockWeeklyData;
      case 'month':
        return mockMonthlyData;
      case 'year':
        return mockYearlyData;
      default:
        return mockMonthlyData;
    }
  })();

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Projects Overview</CardTitle>
          <div className="flex space-x-2">
            <Button 
              variant={timeFrame === 'week' ? "default" : "secondary"} 
              size="sm"
              onClick={() => setTimeFrame('week')}
              className="text-xs h-8"
            >
              Week
            </Button>
            <Button 
              variant={timeFrame === 'month' ? "default" : "secondary"} 
              size="sm"
              onClick={() => setTimeFrame('month')}
              className="text-xs h-8"
            >
              Month
            </Button>
            <Button 
              variant={timeFrame === 'year' ? "default" : "secondary"} 
              size="sm"
              onClick={() => setTimeFrame('year')}
              className="text-xs h-8"
            >
              Year
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '0.375rem',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                }}
              />
              <Legend />
              <Bar 
                dataKey="total" 
                name="Total Projects" 
                fill="hsl(var(--primary) / 0.2)" 
                radius={[4, 4, 0, 0]} 
              />
              <Bar 
                dataKey="completed" 
                name="Completed" 
                fill="hsl(var(--primary))" 
                radius={[4, 4, 0, 0]} 
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
