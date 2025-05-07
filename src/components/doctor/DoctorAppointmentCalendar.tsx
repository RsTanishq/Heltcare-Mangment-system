
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AppointmentEvent {
  id: string;
  patientName: string;
  patientImage?: string;
  reason: string;
  time: string;
  duration: number; // in minutes
  status: "confirmed" | "pending" | "cancelled" | "completed";
}

interface AppointmentsForDate {
  [date: string]: AppointmentEvent[];
}

const DoctorAppointmentCalendar: React.FC = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [showTimeTable, setShowTimeTable] = useState(true);
  
  // Sample appointment data
  const appointmentsMap: AppointmentsForDate = {
    // Today's date in ISO format
    [new Date().toISOString().split('T')[0]]: [
      {
        id: "app1",
        patientName: "Sarah Johnson",
        patientImage: "/placeholder.svg",
        reason: "Regular Checkup",
        time: "10:00 AM",
        duration: 30,
        status: "confirmed"
      },
      {
        id: "app2",
        patientName: "Michael Brown",
        patientImage: "/placeholder.svg",
        reason: "Follow-up",
        time: "11:30 AM",
        duration: 15,
        status: "confirmed"
      },
      {
        id: "app3",
        patientName: "Emily Davis",
        patientImage: "/placeholder.svg",
        reason: "Blood Test Results",
        time: "2:00 PM",
        duration: 45,
        status: "pending"
      }
    ],
    // Tomorrow's date in ISO format
    [new Date(Date.now() + 86400000).toISOString().split('T')[0]]: [
      {
        id: "app4",
        patientName: "David Wilson",
        patientImage: "/placeholder.svg",
        reason: "Annual Physical",
        time: "9:00 AM",
        duration: 60,
        status: "confirmed"
      },
      {
        id: "app5",
        patientName: "Sophia Martinez",
        patientImage: "/placeholder.svg",
        reason: "Consultation",
        time: "1:30 PM",
        duration: 30,
        status: "confirmed"
      }
    ]
  };
  
  // Helper function to get appointments for selected date
  const getAppointmentsForSelectedDate = (): AppointmentEvent[] => {
    if (!date) return [];
    
    const dateKey = date.toISOString().split('T')[0];
    return appointmentsMap[dateKey] || [];
  };
  
  const selectedDateAppointments = getAppointmentsForSelectedDate();
  
  // Function to highlight dates with appointments on the calendar
  const isDayWithAppointment = (day: Date) => {
    const dateKey = day.toISOString().split('T')[0];
    return dateKey in appointmentsMap;
  };
  
  const getStatusBadge = (status: AppointmentEvent['status']) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Confirmed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Pending</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Cancelled</Badge>;
      case 'completed':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Completed</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium">Appointment Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
            modifiers={{
              withAppointments: (date) => isDayWithAppointment(date)
            }}
            modifiersStyles={{
              withAppointments: { backgroundColor: 'rgba(99, 102, 241, 0.1)', fontWeight: 'bold' }
            }}
          />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-medium">
              {date ? `Appointments for ${date.toLocaleDateString()}` : 'No Date Selected'}
            </CardTitle>
            <p className="text-sm text-gray-500">
              {selectedDateAppointments.length} appointments scheduled
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-1" /> Filter
            </Button>
            <Button
              variant="ghost" 
              size="sm" 
              onClick={() => setShowTimeTable(!showTimeTable)}
            >
              {showTimeTable ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardHeader>
        {showTimeTable && (
          <CardContent>
            {selectedDateAppointments.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedDateAppointments.map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={appointment.patientImage} />
                            <AvatarFallback>
                              {appointment.patientName.substring(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{appointment.patientName}</span>
                        </div>
                      </TableCell>
                      <TableCell>{appointment.time}</TableCell>
                      <TableCell>{appointment.reason}</TableCell>
                      <TableCell>{appointment.duration} mins</TableCell>
                      <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="py-10 text-center">
                <p className="text-gray-500">No appointments scheduled for this date.</p>
              </div>
            )}
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default DoctorAppointmentCalendar;
