import { 
  BarChart2, 
  CheckCircle, 
  Users, 
  CheckSquare,
  TrendingUp,
  TrendingDown
} from "lucide-react";

interface StatsTrendProps {
  value: number;
  label: string;
  isPositive?: boolean;
}

interface StatsCardProps {
  title: string;
  value: number;
  icon: 'project' | 'client' | 'task' | 'completed';
  trend: StatsTrendProps;
  color: 'blue' | 'amber' | 'indigo' | 'green';
}

export function StatsCard({ title, value, icon, trend, color }: StatsCardProps) {
  // Define color classes based on the color prop
  const colorClasses = {
    blue: {
      bg: 'bg-blue-100',
      text: 'text-blue-500'
    },
    amber: {
      bg: 'bg-amber-100',
      text: 'text-amber-500'
    },
    indigo: {
      bg: 'bg-indigo-100',
      text: 'text-indigo-500'
    },
    green: {
      bg: 'bg-green-100',
      text: 'text-green-500'
    }
  };

  // Render the appropriate icon based on the icon prop
  const renderIcon = () => {
    switch (icon) {
      case 'project':
        return <BarChart2 className={`${colorClasses[color].text} text-xl`} />;
      case 'client':
        return <Users className={`${colorClasses[color].text} text-xl`} />;
      case 'task':
        return <CheckSquare className={`${colorClasses[color].text} text-xl`} />;
      case 'completed':
        return <CheckCircle className={`${colorClasses[color].text} text-xl`} />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <div className={`w-12 h-12 ${colorClasses[color].bg} rounded-full flex items-center justify-center`}>
          {renderIcon()}
        </div>
      </div>
      <div className="mt-4">
        <div className="flex items-center">
          <span 
            className={`text-sm mr-1 ${trend.isPositive === false ? 'text-red-500' : 'text-green-500'}`}
          >
            {trend.isPositive === false ? (
              <TrendingDown className="inline h-3 w-3 mr-0.5" />
            ) : (
              <TrendingUp className="inline h-3 w-3 mr-0.5" />
            )}
            {trend.value}%
          </span>
          <span className="text-xs text-gray-500">{trend.label}</span>
        </div>
      </div>
    </div>
  );
}
