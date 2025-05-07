
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown, Circle } from "lucide-react";

interface VitalDataPoint {
  date: string;
  value: number;
}

interface PatientVitalsChartProps {
  data: VitalDataPoint[];
  recentReading: string;
  highestReading: string;
  lowestReading: string;
}

const PatientVitalsChart: React.FC<PatientVitalsChartProps> = ({
  data,
  recentReading,
  highestReading,
  lowestReading
}) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">Blood Pressure History</CardTitle>
        <div className="flex items-center text-sm text-gray-500">
          <span>12 - 19 May 2022</span>
          <ChevronDown className="ml-1 h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[220px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 5,
                right: 10,
                left: 0,
                bottom: 5,
              }}
            >
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis
                domain={[60, 100]}
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                width={30}
              />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#4ade80"
                strokeWidth={2}
                dot={{ strokeWidth: 2, r: 4, fill: "white" }}
                activeDot={{ r: 6, stroke: "#4ade80", strokeWidth: 2, fill: "white" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="flex items-center">
            <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
              <Circle className="h-5 w-5 text-green-500 fill-green-500" />
            </div>
            <div>
              <p className="font-medium text-gray-700">{recentReading}</p>
              <p className="text-xs text-gray-500">Recent Blood Pressure</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
              <Circle className="h-5 w-5 text-green-500 fill-green-500" />
            </div>
            <div>
              <p className="font-medium text-gray-700">{highestReading}</p>
              <p className="text-xs text-gray-500">Highest Blood Pressure</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
              <Circle className="h-5 w-5 text-green-500 fill-green-500" />
            </div>
            <div>
              <p className="font-medium text-gray-700">{lowestReading}</p>
              <p className="text-xs text-gray-500">Lowest Blood Pressure</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientVitalsChart;
