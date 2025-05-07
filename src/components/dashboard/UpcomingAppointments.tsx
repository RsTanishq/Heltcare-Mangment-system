import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Calendar, Clock, CheckCircle, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import useAppointmentStore from "@/store/appointmentStore";

interface Appointment {
  id: string;
  time: string;
  title: string;
  doctor: string;
  type: string;
  date?: string;
  htpiScore?: number;
}

interface UpcomingAppointmentsProps {
  appointments: Appointment[];
  currentMonth: number;
  currentYear: number;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

const UpcomingAppointments: React.FC<UpcomingAppointmentsProps> = ({
  appointments,
  currentMonth,
  currentYear,
  onPrevMonth,
  onNextMonth
}) => {
  const [visitMode, setVisitMode] = useState<string>("in-person");
  const [urgency, setUrgency] = useState<string>("normal");
  const [symptoms, setSymptoms] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [confirmationSuccess, setConfirmationSuccess] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>("");
  
  const { addAppointment } = useAppointmentStore();
  
  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
  // Get days for the mini calendar
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };
  
  const days = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
  
  const handleScheduleAppointment = () => {
    const { addAppointment } = useAppointmentStore();
    
    // Add the appointment to the store
    addAppointment({
      patientName: "Patient Name", // Replace with actual patient name
      patientId: "patient_id", // Replace with actual patient ID
      doctorId: "doctor_id", // Replace with selected doctor's ID
      doctorName: "Doctor Name", // Replace with selected doctor's name
      date: selectedDate.toISOString().split('T')[0],
      time: selectedTime,
      condition: symptoms,
      status: 'pending',
      visitMode: visitMode as 'online' | 'offline',
      urgency: urgency as 'low' | 'medium' | 'high',
      symptoms: symptoms
    });

    setConfirmationSuccess(true);
    
    // Reset after animation
    setTimeout(() => {
      setConfirmationSuccess(false);
      setIsDialogOpen(false);
      
      // Show toast message
      toast({
        title: "Appointment Scheduled",
        description: "Your appointment has been successfully scheduled.",
      });
      
      // Reset form
      setVisitMode("in-person");
      setUrgency("normal");
      setSymptoms("");
    }, 2000);
  };
  
  const renderCalendarDays = () => {
    const calendarDays = [];
    
    // Previous month days
    const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();
    for (let i = firstDay - 1; i >= 0; i--) {
      calendarDays.push(
        <div key={`prev-${prevMonthDays - i}`} className="h-8 w-8 flex items-center justify-center text-gray-300 text-xs">
          {prevMonthDays - i}
        </div>
      );
    }
    
    // Current month days
    for (let i = 1; i <= days; i++) {
      const isToday = i === 10; // Just for demo, marking 10th as today
      calendarDays.push(
        <div 
          key={`current-${i}`} 
          className={`h-8 w-8 flex items-center justify-center text-xs ${
            isToday 
              ? 'bg-green-500 text-white rounded-full' 
              : 'text-gray-700 hover:bg-gray-100 rounded-full cursor-pointer'
          }`}
        >
          {i}
        </div>
      );
    }
    
    // Next month days
    const totalCells = 35; // 5 rows x 7 days
    const nextMonthDays = totalCells - calendarDays.length;
    for (let i = 1; i <= nextMonthDays; i++) {
      calendarDays.push(
        <div key={`next-${i}`} className="h-8 w-8 flex items-center justify-center text-gray-300 text-xs">
          {i}
        </div>
      );
    }
    
    return calendarDays;
  };

  return (
    <Card>
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-medium">Upcoming appointment</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 px-2 text-xs bg-green-500 text-white hover:bg-green-600 border-0">
              Schedule
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Book an Appointment</DialogTitle>
              <DialogDescription>
                Please provide details about your appointment request.
              </DialogDescription>
            </DialogHeader>
            
            {confirmationSuccess ? (
              <div className="flex flex-col items-center justify-center py-8 space-y-4">
                <div className="text-5xl animate-bounce">✅</div>
                <p className="font-medium text-center text-green-600">Appointment request confirmed!</p>
              </div>
            ) : (
              <>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Visit Mode</h4>
                    <RadioGroup defaultValue="in-person" value={visitMode} onValueChange={setVisitMode}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="in-person" id="in-person" />
                        <Label htmlFor="in-person">In Person</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="virtual" id="virtual" />
                        <Label htmlFor="virtual">Virtual Visit</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Urgency Level</h4>
                    <RadioGroup defaultValue="normal" value={urgency} onValueChange={setUrgency}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="urgent" id="urgent" />
                        <Label htmlFor="urgent" className="flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1 text-red-500" /> 
                          Urgent
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="normal" id="normal" />
                        <Label htmlFor="normal">Regular checkup</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="symptoms">Symptoms</Label>
                    <Textarea 
                      id="symptoms" 
                      placeholder="Describe your symptoms or reason for visit..."
                      value={symptoms}
                      onChange={(e) => setSymptoms(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleScheduleAppointment} className="bg-green-500 hover:bg-green-600">
                    Confirm
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">{monthNames[currentMonth]} {currentYear}</h3>
          <div className="flex space-x-2">
            <button 
              onClick={onPrevMonth} 
              className="p-1 rounded-full hover:bg-gray-100"
              aria-label="Previous month"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button 
              onClick={onNextMonth} 
              className="p-1 rounded-full hover:bg-gray-100"
              aria-label="Next month"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-7 gap-1 mb-2">
          {daysOfWeek.map((day) => (
            <div key={day} className="text-xs font-medium text-center text-gray-500">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1 mb-6">
          {renderCalendarDays()}
        </div>
        
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div key={appointment.id} className="flex">
              <div className={`w-1 mr-3 ${appointment.type === 'checkup' ? 'bg-red-500' : 'bg-blue-500'} rounded-full`}></div>
              <div className="flex-1">
                <p className="text-sm text-gray-500">{appointment.time}</p>
                <h3 className="font-medium">{appointment.title}</h3>
                <p className="text-sm text-gray-500">{appointment.doctor}</p>
              </div>
            </div>
          ))}
          
          {appointments.length === 0 && (
            <div className="text-center py-6 text-gray-500">
              No upcoming appointments
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingAppointments;
