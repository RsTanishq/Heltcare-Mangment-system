import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  ChevronDown, 
  FileText, 
  CreditCard, 
  Calendar as CalendarIcon, 
  Stethoscope,
  CheckCircle,
  XCircle,
  List,
  Grid,
  ChevronLeft,
  ChevronRight,
  Plus,
  Filter,
  Search,
  Clock
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { useMetaMask } from "@/hooks/useMetaMask";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Appointment, AppointmentStatus, PaymentStatus } from "./types";
import { NewCalendar } from "./NewCalendar";
import { AppointmentList } from "./AppointmentList";
import { AppointmentFilters } from './AppointmentFilters';
import { NewAppointmentDialog } from "./NewAppointmentDialog";

// Sample appointments data
const sampleAppointments: Appointment[] = [
  {
    id: "1",
    patientId: "P001",
    patientName: "John Doe",
    patientImage: "/placeholder.svg",
    date: new Date().toISOString().split('T')[0],
    time: "10:00 AM",
    type: "checkup",
    condition: "Regular Checkup",
    status: "upcoming",
    paymentStatus: "pending",
    amount: 1500,
    prescription: "",
    followUpDate: "",
    medicalRecords: []
  },
  {
    id: "2",
    patientId: "P002",
    patientName: "Jane Smith",
    patientImage: "/placeholder.svg",
    date: new Date().toISOString().split('T')[0],
    time: "2:30 PM",
    type: "consultation",
    condition: "Fever",
    status: "finished",
    paymentStatus: "completed",
    amount: 2000,
    prescription: "Paracetamol 500mg",
    followUpDate: "",
    medicalRecords: ["/records/jane-smith-001.pdf"]
  }
];

const DoctorAppointments: React.FC = () => {
  const { toast } = useToast();
  const { sendTransaction } = useMetaMask();
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [isPrescriptionDialogOpen, setIsPrescriptionDialogOpen] = useState(false);
  const [isRecordsDialogOpen, setIsRecordsDialogOpen] = useState(false);
  const [isFollowUpDialogOpen, setIsFollowUpDialogOpen] = useState(false);
  const [prescription, setPrescription] = useState("");
  const [followUpDate, setFollowUpDate] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | 'all'>('all');
  const [paymentFilter, setPaymentFilter] = useState<PaymentStatus | 'all'>('all');
  const [isNewAppointmentDialogOpen, setIsNewAppointmentDialogOpen] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    patientName: "",
    condition: "",
    time: "",
    date: new Date().toISOString().split('T')[0],
    status: "upcoming" as const,
    paymentStatus: "pending" as const,
    amount: 0
  });

  const handlePayment = async (appointment: Appointment) => {
    try {
      // Convert INR to ETH (assuming 1 ETH = 200,000 INR)
      const ethAmount = (appointment.amount / 200000).toString();
      await sendTransaction(appointment.patientId, ethAmount);
      
      toast({
        title: "Payment Processed",
        description: `₹${appointment.amount.toLocaleString('en-IN')} received successfully`,
        action: (
          <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="h-5 w-5 text-green-600" />
          </div>
        ),
      });
      
      setIsPaymentDialogOpen(false);
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "Failed to process the payment. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePrescription = (appointment: Appointment) => {
    setPrescription(appointment.prescription || "");
    setIsPrescriptionDialogOpen(true);
  };

  const handleSavePrescription = () => {
    if (selectedAppointment) {
      // In a real app, this would update the database
      toast({
        title: "Prescription Saved",
        description: "Prescription has been updated successfully",
        action: (
          <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="h-5 w-5 text-green-600" />
          </div>
        ),
      });
      setIsPrescriptionDialogOpen(false);
    }
  };

  const handleFollowUp = (appointment: Appointment) => {
    setFollowUpDate(appointment.followUpDate || "");
    setIsFollowUpDialogOpen(true);
  };

  const handleSaveFollowUp = () => {
    if (selectedAppointment) {
      // In a real app, this would update the database
      toast({
        title: "Follow-up Scheduled",
        description: `Follow-up scheduled for ${followUpDate}`,
        action: (
          <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="h-5 w-5 text-green-600" />
          </div>
        ),
      });
      setIsFollowUpDialogOpen(false);
    }
  };

  const getAppointmentsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return sampleAppointments.filter(app => app.date === dateStr);
  };

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
      patientImage: "/placeholder.svg",
      type: newAppointment.condition,
      prescription: "",
      followUpDate: "",
      medicalRecords: []
    };

    sampleAppointments.push(appointment);
    setIsNewAppointmentDialogOpen(false);
    setNewAppointment({
      patientName: "",
      condition: "",
      time: "",
      date: new Date().toISOString().split('T')[0],
      status: "upcoming",
      paymentStatus: "pending",
      amount: 0
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

  const filteredAppointments = sampleAppointments.filter(appointment => {
    const matchesSearch = appointment.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         appointment.condition.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
    const matchesPayment = paymentFilter === 'all' || appointment.paymentStatus === paymentFilter;
    return matchesSearch && matchesStatus && matchesPayment;
  });

  const handleAppointmentAction = async (appointment: Appointment, action: string) => {
    switch (action) {
      case "payment":
        await handlePayment(appointment);
        break;
      case "records":
        setSelectedAppointment(appointment);
        setIsRecordsDialogOpen(true);
        break;
      case "prescription":
        handlePrescription(appointment);
        break;
      case "follow-up":
        handleFollowUp(appointment);
        break;
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setPaymentFilter('all');
  };

  const getBadgeVariant = (status: AppointmentStatus | PaymentStatus) => {
    switch (status) {
      case 'finished':
      case 'completed':
        return 'default';
      case 'upcoming':
      case 'pending':
        return 'secondary';
      case 'cancelled':
      case 'refunded':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base font-medium">Appointments</CardTitle>
          <div className="flex items-center gap-4">
            <AppointmentFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              paymentFilter={paymentFilter}
              onPaymentFilterChange={setPaymentFilter}
              onReset={handleResetFilters}
            />
            <Tabs defaultValue="list" value={viewMode} onValueChange={(value) => setViewMode(value as "list" | "calendar")}>
              <TabsList>
                <TabsTrigger value="list">
                  <List className="h-4 w-4 mr-2" />
                  List
                </TabsTrigger>
                <TabsTrigger value="calendar">
                  <Grid className="h-4 w-4 mr-2" />
                  Calendar
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          {viewMode === "calendar" ? (
            <NewCalendar
              appointments={filteredAppointments.map(apt => ({
                id: apt.id,
                date: apt.date,
                time: apt.time,
                patientName: apt.patientName,
                type: apt.type
              }))}
              onNewAppointment={(appointment) => {
                const newAppointment: Appointment = {
                  ...appointment,
                  patientId: "P" + Math.random().toString(36).substr(2, 4).toUpperCase(),
                  condition: appointment.type,
                  status: "upcoming",
                  paymentStatus: "pending",
                  amount: 1500,
                  prescription: "",
                  followUpDate: "",
                  medicalRecords: [],
                  patientImage: "/placeholder.svg"
                };
                sampleAppointments.push(newAppointment);
                toast({
                  title: "Appointment Created",
                  description: "New appointment has been scheduled successfully"
                });
              }}
              onDateSelect={(date) => setSelectedDate(date)}
            />
          ) : (
            <AppointmentList
              appointments={filteredAppointments}
              onAppointmentAction={handleAppointmentAction}
              emptyState={
                <div className="text-center py-8">
                  <p className="text-gray-500">No appointments found</p>
                </div>
              }
            />
          )}
        </CardContent>
      </Card>

      {/* Payment Dialog */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Process Payment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {selectedAppointment && (
              <>
                <p className="text-lg font-medium">
                  Amount: ₹{selectedAppointment.amount.toLocaleString('en-IN')}
                </p>
                <p className="text-sm text-gray-500">
                  Patient: {selectedAppointment.patientName}
                </p>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPaymentDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-indigo-600 hover:bg-indigo-700"
              onClick={() => selectedAppointment && handlePayment(selectedAppointment)}
            >
              Process Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Prescription Dialog */}
      <Dialog open={isPrescriptionDialogOpen} onOpenChange={setIsPrescriptionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Prescription</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <textarea
              className="w-full h-32 p-2 border rounded-md"
              value={prescription}
              onChange={(e) => setPrescription(e.target.value)}
              placeholder="Enter prescription details..."
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPrescriptionDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-indigo-600 hover:bg-indigo-700"
              onClick={handleSavePrescription}
            >
              Save Prescription
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Medical Records Dialog */}
      <Dialog open={isRecordsDialogOpen} onOpenChange={setIsRecordsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Medical Records</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {selectedAppointment?.medicalRecords?.map((record, index) => (
              <div key={index} className="flex items-center justify-between p-2 border rounded-md">
                <span className="text-sm">{record.split('/').pop()}</span>
                <Button variant="outline" size="sm">
                  View
                </Button>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Follow-up Dialog */}
      <Dialog open={isFollowUpDialogOpen} onOpenChange={setIsFollowUpDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule Follow-up</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <input
              type="date"
              className="w-full p-2 border rounded-md"
              value={followUpDate}
              onChange={(e) => setFollowUpDate(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFollowUpDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-indigo-600 hover:bg-indigo-700"
              onClick={handleSaveFollowUp}
            >
              Schedule Follow-up
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <NewAppointmentDialog
        open={isNewAppointmentDialogOpen}
        onOpenChange={setIsNewAppointmentDialogOpen}
        onAppointmentCreated={handleCreateAppointment}
      />
    </div>
  );
};

export default DoctorAppointments;
