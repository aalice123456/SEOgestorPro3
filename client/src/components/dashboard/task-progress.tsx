import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TaskProgressProps {
  progress?: {
    completed: number;
    inProgress: number;
    pending: number;
    overdue: number;
    total: number;
    completedPercentage: number;
    inProgressPercentage: number;
    pendingPercentage: number;
    overduePercentage: number;
  };
}

export function TaskProgress({ progress }: TaskProgressProps) {
  const [timeFrame, setTimeFrame] = useState("week");

  // Default data if none is provided
  const defaultProgress = {
    completed: 25,
    inProgress: 10,
    pending: 7,
    overdue: 3,
    total: 45,
    completedPercentage: 56,
    inProgressPercentage: 22,
    pendingPercentage: 16,
    overduePercentage: 6
  };

  // Use provided data or fallback to default
  const data = progress || defaultProgress;

  // Prepare chart data
  const chartData = [
    { name: "Completed", value: data.completed, color: "#10B981" }, // green
    { name: "In Progress", value: data.inProgress, color: "#3B82F6" }, // blue
    { name: "Pending", value: data.pending, color: "#F59E0B" }, // amber
    { name: "Overdue", value: data.overdue, color: "#DC2626" }, // red
  ];

  // Filter out items with zero value
  const filteredChartData = chartData.filter(item => item.value > 0);

  // Handle time frame change
  const handleTimeFrameChange = (value: string) => {
    setTimeFrame(value);
    // In a real app, you would fetch new data based on the selected time frame
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Task Progress</CardTitle>
          <Select value={timeFrame} onValueChange={handleTimeFrameChange}>
            <SelectTrigger className="w-[130px] h-8 text-sm">
              <SelectValue placeholder="This Week" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={filteredChartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {filteredChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [`${value} tasks`, 'Count']}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '0.375rem',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                }}
              />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <div>
              <p className="text-sm font-medium">Completed</p>
              <p className="text-lg font-bold">
                {data.completed} <span className="text-xs text-gray-500 font-normal">{data.completedPercentage}%</span>
              </p>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            <div>
              <p className="text-sm font-medium">In Progress</p>
              <p className="text-lg font-bold">
                {data.inProgress} <span className="text-xs text-gray-500 font-normal">{data.inProgressPercentage}%</span>
              </p>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="w-3 h-3 bg-amber-500 rounded-full mr-2"></div>
            <div>
              <p className="text-sm font-medium">Pending</p>
              <p className="text-lg font-bold">
                {data.pending} <span className="text-xs text-gray-500 font-normal">{data.pendingPercentage}%</span>
              </p>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
            <div>
              <p className="text-sm font-medium">Overdue</p>
              <p className="text-lg font-bold">
                {data.overdue} <span className="text-xs text-red-500 font-normal">{data.overduePercentage}%</span>
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
