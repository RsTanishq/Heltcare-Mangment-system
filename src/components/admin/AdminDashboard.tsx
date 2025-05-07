import { useState, useEffect } from "react";
import AdminWelcomeBanner from "./AdminWelcomeBanner";
import AdminOverviewStats from "./AdminOverviewStats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { useToast } from "@/hooks/use-toast";

const AdminDashboard = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  
  const surveyData = [
    { month: "Jan '24", newPatients: 30, oldPatients: 15 },
    { month: "Feb '24", newPatients: 35, oldPatients: 25 },
    { month: "Mar '24", newPatients: 40, oldPatients: 45 },
    { month: "Apr '24", newPatients: 45, oldPatients: 35 },
    { month: "May '24", newPatients: 50, oldPatients: 40 },
    { month: "Jun '24", newPatients: 80, oldPatients: 55 }
  ];
  
  const appointmentData = [
    { id: 1, patient: "John Doe", doctor: "Dr.Jacob Ryan", date: "12/05/2024", disease: "Fever" },
    { id: 2, patient: "Sarah Smith", doctor: "Dr.Sarah Lee", date: "12/05/2024", disease: "Cholera" },
    { id: 3, patient: "Mike Johnson", doctor: "Dr.Emily Chen", date: "12/05/2024", disease: "Diabetes" }
  ];
  
  const doctorStatus = [
    { id: 1, name: "Dr.Jay Soni", status: "Available", image: "/lovable-uploads/548ba9c5-8472-4f97-aa24-f9ce70f53b9d.png" },
    { id: 2, name: "Dr.Sarah Smith", status: "Absent", image: "/lovable-uploads/a4b0b053-4e4f-4a68-9a39-1b46b39ba829.png" }
  ];

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminWelcomeBanner name="Sarah Smith" />
      <AdminOverviewStats />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Hospital Survey</CardTitle>
              <select className="text-sm border rounded-md p-1">
                <option>Monthly</option>
                <option>Weekly</option>
                <option>Daily</option>
              </select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={surveyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="newPatients" 
                    stackId="1" 
                    stroke="#8884d8" 
                    fill="#8884d8" 
                    fillOpacity={0.3}
                    name="New Patients"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="oldPatients" 
                    stackId="1" 
                    stroke="#82ca9d" 
                    fill="#82ca9d" 
                    fillOpacity={0.3}
                    name="Old Patients"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Total Appointments</CardTitle>
              <span className="text-2xl font-bold">128</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between gap-4 mb-6">
              <div className="bg-blue-100 rounded-lg p-4 flex-1 text-center">
                <div className="text-2xl font-bold text-blue-600">73</div>
                <div className="text-sm text-blue-600">Completed</div>
              </div>
              <div className="bg-orange-100 rounded-lg p-4 flex-1 text-center">
                <div className="text-2xl font-bold text-orange-600">55</div>
                <div className="text-sm text-orange-600">Upcoming</div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="text-sm font-medium mb-2">Revenue</div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">$4,589</span>
                  <span className="text-green-500">+7.5%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Recent Appointments</CardTitle>
              <Button variant="outline" size="sm">View All</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {appointmentData.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium">{appointment.patient}</div>
                    <div className="text-sm text-gray-500">{appointment.doctor}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{appointment.date}</div>
                    <div className="text-xs text-gray-500">{appointment.disease}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Doctor Status</CardTitle>
              <Button variant="outline" size="sm">View All</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {doctorStatus.map((doctor) => (
                <div key={doctor.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <img src={doctor.image} alt={doctor.name} className="w-10 h-10 rounded-full" />
                    <div>
                      <div className="font-medium">{doctor.name}</div>
                      <div className="text-xs text-gray-500">(MBBS,MD)</div>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm ${
                    doctor.status === "Available" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                  }`}>
                    {doctor.status}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
