import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import useAppointmentStore from "@/store/appointmentStore";

const DoctorAppointmentRequests: React.FC<{ doctorId: string }> = ({ doctorId }) => {
  const { toast } = useToast();
  const { getDoctorAppointments, updateAppointmentStatus } = useAppointmentStore();
  const appointments = getDoctorAppointments(doctorId);
  
  const pendingAppointments = appointments.filter(app => app.status === "pending");
  
  const handleAccept = (requestId: string) => {
    updateAppointmentStatus(requestId, 'accepted');
    toast({
      title: "Appointment Accepted",
      description: "You have accepted this appointment request.",
    });
  };
  
  const handleReject = (requestId: string) => {
    updateAppointmentStatus(requestId, 'rejected');
    toast({
      title: "Appointment Rejected",
      description: "You have rejected this appointment request.",
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-medium">Appointment Requests</CardTitle>
        <span className="text-sm text-gray-500">
          {pendingAppointments.length} pending
        </span>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {pendingAppointments.map((request) => (
            <div key={request.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>{request.patientName.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{request.patientName}</p>
                  <p className="text-xs text-gray-500">{request.condition}</p>
                </div>
              </div>
              
              <div className="text-sm text-gray-500">
                {`${request.date} - ${request.time}`}
              </div>
              
              <div className="flex items-center gap-2">
                <button 
                  className="h-7 w-7 rounded-full bg-green-100 text-green-600 flex items-center justify-center"
                  onClick={() => handleAccept(request.id)}
                >
                  <Check size={16} />
                </button>
                <button 
                  className="h-7 w-7 rounded-full bg-red-100 text-red-600 flex items-center justify-center"
                  onClick={() => handleReject(request.id)}
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          ))}
          {pendingAppointments.length === 0 && (
            <div className="text-center py-4 text-gray-500">
              No pending appointment requests
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DoctorAppointmentRequests;
