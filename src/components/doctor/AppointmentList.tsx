import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  CreditCard, 
  Calendar as CalendarIcon, 
  Stethoscope
} from "lucide-react";
import { Appointment } from "./types";

interface AppointmentListProps {
  appointments: Appointment[];
  onAppointmentAction: (appointment: Appointment, action: string) => void;
  emptyState?: React.ReactNode;
}

export const AppointmentList: React.FC<AppointmentListProps> = ({
  appointments,
  onAppointmentAction,
  emptyState
}) => {
  const getStatusBadge = (status: Appointment['status']) => {
    switch (status) {
      case 'upcoming':
        return <Badge className="bg-blue-100 text-blue-800">Upcoming</Badge>;
      case 'finished':
        return <Badge className="bg-green-100 text-green-800">Finished</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
      default:
        return null;
    }
  };

  if (appointments.length === 0 && emptyState) {
    return <>{emptyState}</>;
  }

  return (
    <div className="space-y-4">
      {appointments.map((appointment) => (
        <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={appointment.patientImage} />
              <AvatarFallback>{appointment.patientName.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{appointment.patientName}</p>
              <p className="text-xs text-gray-500">{appointment.condition}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-lg font-medium">{appointment.time}</p>
              {getStatusBadge(appointment.status)}
            </div>
            <div className="flex gap-2">
              {appointment.status === "upcoming" && (
                <>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onAppointmentAction(appointment, "payment")}
                  >
                    <CreditCard className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onAppointmentAction(appointment, "records")}
                  >
                    <FileText className="h-4 w-4" />
                  </Button>
                </>
              )}
              {appointment.status === "finished" && (
                <>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onAppointmentAction(appointment, "prescription")}
                  >
                    <Stethoscope className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onAppointmentAction(appointment, "follow-up")}
                  >
                    <CalendarIcon className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}; 