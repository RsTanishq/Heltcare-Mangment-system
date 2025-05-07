
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, MessageSquare } from "lucide-react";

const DoctorMessageStats: React.FC = () => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Card className="bg-indigo-600 text-white">
        <CardContent className="p-4 flex flex-col items-center justify-center">
          <MessageSquare className="h-8 w-8 mb-2" />
          <p className="text-2xl font-bold">13</p>
          <p className="text-sm opacity-75">Missed Call</p>
        </CardContent>
      </Card>
      
      <Card className="bg-white">
        <CardContent className="p-4 flex flex-col items-center justify-center">
          <Mail className="h-8 w-8 mb-2" />
          <p className="text-2xl font-bold">9</p>
          <p className="text-sm text-gray-500">New Messages</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DoctorMessageStats;
