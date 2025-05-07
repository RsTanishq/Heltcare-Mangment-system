
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color: "blue" | "green" | "purple" | "orange";
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, trend, color }) => {
  const getColorClasses = () => {
    switch (color) {
      case "blue":
        return "bg-blue-500 text-blue-100";
      case "green":
        return "bg-green-500 text-green-100";
      case "purple":
        return "bg-purple-500 text-purple-100";
      case "orange":
        return "bg-orange-500 text-orange-100";
      default:
        return "bg-blue-500 text-blue-100";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="flex p-6 justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          
          {trend && (
            <div className="flex items-center mt-2">
              <div className={`text-xs ${trend.isPositive ? 'text-green-500' : 'text-red-500'} flex items-center`}>
                <span>{trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%</span>
              </div>
              <span className="text-xs text-gray-400 ml-1">from last month</span>
            </div>
          )}
        </div>
        
        <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${getColorClasses()}`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
