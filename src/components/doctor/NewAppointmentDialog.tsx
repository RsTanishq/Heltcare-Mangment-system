import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { CheckCircle } from "lucide-react";
import { Appointment, NewAppointment } from "./types";

interface NewAppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAppointmentCreated: (appointment: Appointment) => void;
}

export const NewAppointmentDialog: React.FC<NewAppointmentDialogProps> = ({
  open,
  onOpenChange,
  onAppointmentCreated,
}) => {
  const { toast } = useToast();
  const [newAppointment, setNewAppointment] = useState<NewAppointment>({
    patientName: "",
    condition: "",
    time: "",
    date: new Date().toISOString().split('T')[0],
    amount: 0,
    status: "upcoming",
    paymentStatus: "pending"
  });

  const handleCreateAppointment = () => {
    if (!newAppointment.patientName || !newAppointment.condition || !newAppointment.time) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const appointment: Appointment = {
      ...newAppointment,
      id: Math.random().toString(36).substr(2, 9),
      patientId: "P" + Math.random().toString(36).substr(2, 4).toUpperCase(),
      patientImage: "/placeholder.svg"
    };

    onAppointmentCreated(appointment);
    setNewAppointment({
      patientName: "",
      condition: "",
      time: "",
      date: new Date().toISOString().split('T')[0],
      amount: 0,
      status: "upcoming",
      paymentStatus: "pending"
    });

    toast({
      title: "Appointment Created",
      description: "New appointment has been scheduled successfully",
      action: (
        <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="h-5 w-5 text-green-600" />
        </div>
      ),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Schedule New Appointment</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Patient Name</label>
            <Input
              value={newAppointment.patientName}
              onChange={(e) => setNewAppointment({ ...newAppointment, patientName: e.target.value })}
              placeholder="Enter patient name"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Condition</label>
            <Input
              value={newAppointment.condition}
              onChange={(e) => setNewAppointment({ ...newAppointment, condition: e.target.value })}
              placeholder="Enter condition"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Date</label>
              <Input
                type="date"
                value={newAppointment.date}
                onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Time</label>
              <Input
                type="time"
                value={newAppointment.time}
                onChange={(e) => setNewAppointment({ ...newAppointment, time: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Amount (INR)</label>
            <Input
              type="number"
              value={newAppointment.amount}
              onChange={(e) => setNewAppointment({ ...newAppointment, amount: Number(e.target.value) })}
              placeholder="Enter amount"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            className="bg-indigo-600 hover:bg-indigo-700"
            onClick={handleCreateAppointment}
          >
            Schedule Appointment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}; 