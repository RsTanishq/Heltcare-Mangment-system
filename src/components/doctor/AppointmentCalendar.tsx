import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { format } from "date-fns";
import { Appointment } from "./types";
import { AppointmentList } from "./AppointmentList";
import { NewAppointmentDialog } from "./NewAppointmentDialog";

interface AppointmentCalendarProps {
  appointments: Appointment[];
  onAppointmentAction: (appointment: Appointment, action: string) => void;
}

export const AppointmentCalendar: React.FC<AppointmentCalendarProps> = ({
  appointments,
  onAppointmentAction,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isNewAppointmentDialogOpen, setIsNewAppointmentDialogOpen] = useState(false);

  const getAppointmentsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return appointments.filter(app => app.date === dateStr);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              const newDate = new Date(selectedDate || new Date());
              newDate.setMonth(newDate.getMonth() - 1);
              setSelectedDate(newDate);
            }}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              const newDate = new Date(selectedDate || new Date());
              newDate.setMonth(newDate.getMonth() + 1);
              setSelectedDate(newDate);
            }}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <span className="font-medium">
            {selectedDate ? format(selectedDate, "MMMM yyyy") : ""}
          </span>
        </div>
        <Button
          variant="outline"
          onClick={() => setIsNewAppointmentDialogOpen(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          New Appointment
        </Button>
      </div>
      
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={setSelectedDate}
        className="rounded-md border"
        modifiers={{
          hasAppointments: (date) => getAppointmentsForDate(date).length > 0
        }}
        modifiersStyles={{
          hasAppointments: { backgroundColor: 'rgba(99, 102, 241, 0.1)', fontWeight: 'bold' }
        }}
      />
      
      {selectedDate && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">
              Appointments for {format(selectedDate, "MMMM d, yyyy")}
            </h3>
            <Badge variant="outline">
              {getAppointmentsForDate(selectedDate).length} appointments
            </Badge>
          </div>
          <AppointmentList
            appointments={getAppointmentsForDate(selectedDate)}
            onAppointmentAction={onAppointmentAction}
            emptyState={
              <div className="text-center py-8">
                <p className="text-gray-500 mb-2">No appointments scheduled for this date</p>
                <Button
                  variant="outline"
                  onClick={() => setIsNewAppointmentDialogOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Schedule Appointment
                </Button>
              </div>
            }
          />
        </div>
      )}

      <NewAppointmentDialog
        open={isNewAppointmentDialogOpen}
        onOpenChange={setIsNewAppointmentDialogOpen}
        onAppointmentCreated={(appointment) => {
          appointments.push(appointment);
          setIsNewAppointmentDialogOpen(false);
        }}
      />
    </div>
  );
}; 