
import React, { useState } from "react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown } from "lucide-react";

interface ActivityData {
  name: string;
  consultations: number;
  patients: number;
}

const data: ActivityData[] = [
  { name: "Jan", consultations: 120, patients: 150 },
  { name: "Feb", consultations: 140, patients: 130 },
  { name: "Mar", consultations: 160, patients: 180 },
  { name: "Apr", consultations: 120, patients: 140 },
  { name: "May", consultations: 200, patients: 170 },
  { name: "Jun", consultations: 220, patients: 200 },
  { name: "Jul", consultations: 180, patients: 220 },
  { name: "Aug", consultations: 240, patients: 180 },
  { name: "Sep", consultations: 196, patients: 150 }, // Current month
  { name: "Oct", consultations: 220, patients: 230 },
  { name: "Nov", consultations: 240, patients: 210 },
  { name: "Dec", consultations: 200, patients: 190 }
];

const timeOptions = ["This Year", "This Month", "This Week"];

const DoctorActivityChart: React.FC = () => {
  const [selectedTime, setSelectedTime] = useState(timeOptions[0]);

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-medium">Activity</CardTitle>
        <div className="flex items-center text-sm font-medium text-gray-500">
          <span>{selectedTime}</span>
          <ChevronDown size={16} className="ml-1" />
        </div>
      </CardHeader>
      <CardContent className="px-2">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 20,
              left: 0,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12 }} 
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12 }} 
              domain={[0, 300]}
            />
            <Tooltip />
            <ReferenceLine x="Sep" stroke="#666" strokeDasharray="3 3" />
            <Line
              type="monotone"
              dataKey="consultations"
              stroke="#4338ca"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="patients"
              stroke="#22d3ee"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6 }}
            />
            <Legend 
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              iconSize={10}
              formatter={(value) => <span className="text-sm capitalize">{value}</span>}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default DoctorActivityChart;
