
import { Card } from "@/components/ui/card";
import { Calendar, Scissors, Users, DollarSign } from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  chartData: { value: number }[];
  color: string;
}

const StatCard = ({ title, value, icon, chartData, color }: StatCardProps) => (
  <Card className="p-6">
    <div className="flex items-center gap-4 mb-4">
      <div className={`p-2 rounded-lg ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-600">{title}</p>
        <h3 className="text-2xl font-semibold">{value}</h3>
      </div>
    </div>
    <div className="h-16">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke={color.includes('purple') ? '#9333EA' : 
                   color.includes('orange') ? '#F97316' :
                   color.includes('green') ? '#22C55E' : '#3B82F6'} 
            strokeWidth={2} 
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </Card>
);

const generateChartData = () => {
  return Array.from({ length: 10 }, () => ({
    value: Math.floor(Math.random() * 100)
  }));
};

const AdminOverviewStats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <StatCard
        title="Appointments"
        value="650"
        icon={<Calendar className="text-purple-600" size={24} />}
        chartData={generateChartData()}
        color="bg-purple-100"
      />
      <StatCard
        title="Operations"
        value="54"
        icon={<Scissors className="text-orange-600" size={24} />}
        chartData={generateChartData()}
        color="bg-orange-100"
      />
      <StatCard
        title="New Patients"
        value="129"
        icon={<Users className="text-green-600" size={24} />}
        chartData={generateChartData()}
        color="bg-green-100"
      />
      <StatCard
        title="Earning"
        value="$20,125"
        icon={<DollarSign className="text-blue-600" size={24} />}
        chartData={generateChartData()}
        color="bg-blue-100"
      />
    </div>
  );
};

export default AdminOverviewStats;
