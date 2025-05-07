
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown } from "lucide-react";

const DoctorIncome: React.FC = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-medium">Incomes</CardTitle>
        <div className="flex items-center text-sm font-medium text-gray-500">
          <span>February</span>
          <ChevronDown size={16} className="ml-1" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="mt-2">
          <h3 className="text-2xl font-bold">$2,857.15</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 rounded">
              +50%
            </span>
            <span className="text-xs text-gray-500">From last month</span>
          </div>
          <p className="text-sm text-gray-500 mt-4">Total Incomes</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DoctorIncome;
