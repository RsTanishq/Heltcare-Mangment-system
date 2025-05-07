
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, Clock, User } from "lucide-react";

interface Appointment {
  id: string;
  patientName: string;
  doctorName: string;
  date: string;
  time: string;
  status: "upcoming" | "completed" | "cancelled";
}

const mockAppointments: Appointment[] = [
  {
    id: "1",
    patientName: "John Doe",
    doctorName: "Dr. Smith",
    date: "2025-04-20",
    time: "09:00 AM",
    status: "upcoming"
  },
  {
    id: "2",
    patientName: "Jane Smith",
    doctorName: "Dr. Johnson",
    date: "2025-04-18",
    time: "02:30 PM",
    status: "completed"
  }
];

const AdminAppointments = () => {
  const [activeTab, setActiveTab] = useState("today");

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
        <Button>
          Book Appointment
        </Button>
      </div>

      <Tabs defaultValue="today" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>

        <TabsContent value="today">
          <Card>
            <CardHeader>
              <CardTitle>Today's Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <User className="h-10 w-10 text-gray-400" />
                      <div>
                        <h3 className="font-medium">{appointment.patientName}</h3>
                        <p className="text-sm text-gray-500">{appointment.doctorName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{appointment.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{appointment.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upcoming">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Similar structure as Today's appointments */}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="past">
          <Card>
            <CardHeader>
              <CardTitle>Past Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Similar structure as Today's appointments */}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminAppointments;
